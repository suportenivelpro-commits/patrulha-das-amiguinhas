-- Verification runs in one transaction. Every test account and row is rolled back.
begin;
insert into auth.users(id,email,raw_app_meta_data,created_at,updated_at) values
('551d6ac2-2af5-47ac-b9d3-a2ec6a510001','patrulha_verify_a@patrulha.invalid','{"patrulha_account":true}'::jsonb,now(),now()),
('551d6ac2-2af5-47ac-b9d3-a2ec6a510002','patrulha_verify_b@patrulha.invalid','{"patrulha_account":true}'::jsonb,now(),now());
set local role authenticated;
set local request.jwt.claims='{"sub":"551d6ac2-2af5-47ac-b9d3-a2ec6a510001","role":"authenticated","app_metadata":{"patrulha_account":true}}';
do $$
declare a jsonb;
begin
  a:=public.patrulha_load();
  if a->>'epoch' <> '0' then raise exception 'Fresh save failed'; end if;
  a:=public.patrulha_save(0,'{"gatinho":3}',array['m-gatinho'],7);
  a:=public.patrulha_save(0,'{"gatinho":1,"fogo":2}',array['m-fogo'],4);
  if a->'stars' <> '{"gatinho":3,"fogo":2}'::jsonb or a->>'best' <> '7' then raise exception 'Merge failed'; end if;
  begin
    perform public.patrulha_save(0,'{"unknown":3}',array[]::text[],0);
    raise exception 'Invalid mission was accepted';
  exception when sqlstate '22023' then null; end;
end $$;
set local request.jwt.claims='{"sub":"551d6ac2-2af5-47ac-b9d3-a2ec6a510002","role":"authenticated","app_metadata":{"patrulha_account":true}}';
do $$
declare a jsonb; n integer;
begin
  a:=public.patrulha_load();
  if a->'stars' <> '{}'::jsonb then raise exception 'Account isolation failed'; end if;
  select count(*) into n from public.patrulha_progress where user_id='551d6ac2-2af5-47ac-b9d3-a2ec6a510001';
  if n <> 0 then raise exception 'Other save visible'; end if;
  update public.patrulha_progress set best=999 where user_id='551d6ac2-2af5-47ac-b9d3-a2ec6a510001';
  get diagnostics n=row_count;
  if n <> 0 then raise exception 'Other save writable'; end if;
  begin
    update public.patrulha_progress set user_id='551d6ac2-2af5-47ac-b9d3-a2ec6a510001' where user_id=auth.uid();
    raise exception 'Ownership change was accepted';
  exception when insufficient_privilege then null; end;
  if has_table_privilege('authenticated','public.patrulha_progress','TRUNCATE') then raise exception 'Truncate privilege is unsafe'; end if;
  begin
    perform public.patrulha_registration_allow(repeat('a',64));
    raise exception 'Registration limiter is callable by a player';
  exception when insufficient_privilege then null; end;
end $$;
set local request.jwt.claims='{"sub":"551d6ac2-2af5-47ac-b9d3-a2ec6a510001","role":"authenticated","app_metadata":{"patrulha_account":true}}';
do $$
declare a jsonb;
begin
  a:=public.patrulha_load();
  if a->>'best' <> '7' then raise exception 'Other user changed record'; end if;
  a:=public.patrulha_reset(0);
  if a->>'epoch' <> '1' or a->'stars' <> '{}'::jsonb or a->>'best' <> '0' then raise exception 'Reset failed'; end if;
  begin
    perform public.patrulha_save(0,'{"gatinho":3}',array['m-gatinho'],7);
    raise exception 'Old browser restored reset save';
  exception when sqlstate 'PT409' then null; end;
end $$;
set local role anon;
do $$
begin
  begin perform public.patrulha_load(); raise exception 'Anonymous load allowed'; exception when insufficient_privilege then null; end;
  if has_table_privilege('anon','public.patrulha_progress','SELECT') then raise exception 'Anonymous read allowed'; end if;
end $$;
set local role service_role;
do $$
declare allowed boolean;
begin
  for i in 1..10 loop allowed:=public.patrulha_registration_allow(repeat('f',64)); end loop;
  if not allowed then raise exception 'Rate limit too strict'; end if;
  allowed:=public.patrulha_registration_allow(repeat('f',64));
  if allowed then raise exception 'Rate limit did not block'; end if;
end $$;
reset role;
rollback;
select 'PASS: save/load, max merge, account isolation, ownership protection, anonymous denial, reset epoch, limiter and no truncate privilege' as verification;
