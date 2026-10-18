-- Additive game-only schema. Does not change existing app tables or global Auth settings.
create table if not exists public.patrulha_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  epoch bigint not null default 0 check (epoch >= 0),
  revision bigint not null default 0 check (revision >= 0),
  stars jsonb not null default '{}'::jsonb check (jsonb_typeof(stars) = 'object'),
  medals text[] not null default '{}'::text[],
  best integer not null default 0 check (best between 0 and 1000000),
  updated_at timestamptz not null default now()
);
alter table public.patrulha_progress enable row level security;
revoke all on public.patrulha_progress from public, anon, authenticated;
grant select, insert, update on public.patrulha_progress to authenticated;
grant all on public.patrulha_progress to service_role;
drop policy if exists patrulha_owner_select on public.patrulha_progress;
create policy patrulha_owner_select on public.patrulha_progress for select to authenticated
using ((select auth.uid()) = user_id and (select auth.jwt()->'app_metadata'->>'patrulha_account') = 'true');
drop policy if exists patrulha_owner_insert on public.patrulha_progress;
create policy patrulha_owner_insert on public.patrulha_progress for insert to authenticated
with check ((select auth.uid()) = user_id and (select auth.jwt()->'app_metadata'->>'patrulha_account') = 'true');
drop policy if exists patrulha_owner_update on public.patrulha_progress;
create policy patrulha_owner_update on public.patrulha_progress for update to authenticated
using ((select auth.uid()) = user_id and (select auth.jwt()->'app_metadata'->>'patrulha_account') = 'true')
with check ((select auth.uid()) = user_id and (select auth.jwt()->'app_metadata'->>'patrulha_account') = 'true');

create or replace function public.patrulha_load() returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare item public.patrulha_progress;
begin
  if auth.uid() is null then raise exception 'Authentication required' using errcode='42501'; end if;
  insert into public.patrulha_progress(user_id) values(auth.uid()) on conflict do nothing;
  select * into strict item from public.patrulha_progress where user_id=auth.uid();
  return to_jsonb(item);
end; $$;

create or replace function public.patrulha_save(expected_epoch bigint, new_stars jsonb, new_medals text[], new_best integer) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare item public.patrulha_progress; merged_stars jsonb; merged_medals text[];
begin
  if auth.uid() is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if jsonb_typeof(new_stars) is distinct from 'object' or new_stars is null or new_medals is null or new_best is null or new_best not between 0 and 1000000 then
    raise exception 'Invalid progress' using errcode='22023';
  end if;
  if exists(select 1 from jsonb_each(new_stars) e where not (e.key = any(array['gatinho','fogo','bichinho','ponte','parque','jardim','patinhos','memoria','borboletas','abelhinhas','lanche-fazenda','cerca-colorida','colheita','casinhas-animais','pintinho-perdido','farol-praia','conchinhas','boias-resgate','peixinhos','trilha-tartarugas','mochila-aventura','equipamentos-resgate','cabritinho','passarela','estrelas-acampamento','luzes-pista','passageiros','baloes-nuvens','bagagens','hangares','caminho-escola','painel-sala','lapis-perdidos','bandinha','biblioteca','bandeirinhas','piquenique','sombras-festa','bolo-coreto','palco','parafusos','energia','rodas','trilhos','oficina','constelacoes','astronauta','painel-foguete','estrelas-cadentes','sinal-voltar']::text[])) or e.value::text !~ '^[123]$')
     or not (new_medals <@ array['m-gatinho','m-fogo','m-bichinho','m-ponte','m-parque','m-jardim','m-patinhos','m-memoria','m-borboletas','m-abelhinhas','m-lanche-fazenda','m-cerca-colorida','m-colheita','m-casinhas-animais','m-pintinho-perdido','m-farol-praia','m-conchinhas','m-boias-resgate','m-peixinhos','m-trilha-tartarugas','m-mochila-aventura','m-equipamentos-resgate','m-cabritinho','m-passarela','m-estrelas-acampamento','m-luzes-pista','m-passageiros','m-baloes-nuvens','m-bagagens','m-hangares','m-caminho-escola','m-painel-sala','m-lapis-perdidos','m-bandinha','m-biblioteca','m-bandeirinhas','m-piquenique','m-sombras-festa','m-bolo-coreto','m-palco','m-parafusos','m-energia','m-rodas','m-trilhos','m-oficina','m-constelacoes','m-astronauta','m-painel-foguete','m-estrelas-cadentes','m-sinal-voltar','primeira','estrelas10','estrelas30','estrelas75','estrelas150','perfeita','cinquenta','cap1','cap2','cap3','cap4','cap5','cap6','cap7','cap8','cap9','cap10']::text[]) then
    raise exception 'Invalid mission or medal' using errcode='22023';
  end if;
  insert into public.patrulha_progress(user_id) values(auth.uid()) on conflict do nothing;
  select * into strict item from public.patrulha_progress where user_id=auth.uid() for update;
  if expected_epoch is distinct from item.epoch then raise exception 'Progress was reset on another device' using errcode='PT409'; end if;
  select coalesce(jsonb_object_agg(s.key,s.score),'{}'::jsonb) into merged_stars from (
    select e.key, max((e.value::text)::integer) score from (
      select * from jsonb_each(item.stars) union all select * from jsonb_each(new_stars)
    ) e group by e.key
  ) s;
  select coalesce(array_agg(distinct medal),'{}'::text[]) into merged_medals from unnest(item.medals || new_medals) medal;
  update public.patrulha_progress set stars=merged_stars, medals=merged_medals, best=greatest(item.best,new_best), revision=item.revision+1, updated_at=now()
    where user_id=auth.uid() returning * into item;
  return to_jsonb(item);
end; $$;

create or replace function public.patrulha_reset(expected_epoch bigint) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare item public.patrulha_progress;
begin
  if auth.uid() is null then raise exception 'Authentication required' using errcode='42501'; end if;
  select * into strict item from public.patrulha_progress where user_id=auth.uid() for update;
  if expected_epoch is distinct from item.epoch then raise exception 'Progress changed' using errcode='PT409'; end if;
  update public.patrulha_progress set stars='{}'::jsonb, medals='{}'::text[], best=0, epoch=item.epoch+1, revision=item.revision+1, updated_at=now()
    where user_id=auth.uid() returning * into item;
  return to_jsonb(item);
end; $$;
revoke all on function public.patrulha_load() from public, anon;
revoke all on function public.patrulha_save(bigint,jsonb,text[],integer) from public, anon;
revoke all on function public.patrulha_reset(bigint) from public, anon;
grant execute on function public.patrulha_load() to authenticated;
grant execute on function public.patrulha_save(bigint,jsonb,text[],integer) to authenticated;
grant execute on function public.patrulha_reset(bigint) to authenticated;

-- Registration throttling: only the server-side function can access this table/RPC.
create table if not exists public.patrulha_registration_limits (
  bucket text primary key, attempts integer not null default 1, created_at timestamptz not null default now()
);
create index if not exists patrulha_registration_limits_created_idx on public.patrulha_registration_limits(created_at);
alter table public.patrulha_registration_limits enable row level security;
drop policy if exists patrulha_registration_service_only on public.patrulha_registration_limits;
create policy patrulha_registration_service_only on public.patrulha_registration_limits for all to service_role using (true) with check (true);
revoke all on public.patrulha_registration_limits from public, anon, authenticated;
grant all on public.patrulha_registration_limits to service_role;
create or replace function public.patrulha_registration_allow(p_fingerprint text) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare ip_attempts integer; total_attempts integer; period text := to_char(date_trunc('hour',now() at time zone 'UTC'),'YYYYMMDDHH24');
begin
  if p_fingerprint is null or p_fingerprint !~ '^[a-f0-9]{64}$' then return false; end if;
  delete from public.patrulha_registration_limits where created_at < now()-interval '2 days';
  insert into public.patrulha_registration_limits(bucket) values(period||':all')
    on conflict(bucket) do update set attempts=public.patrulha_registration_limits.attempts+1 returning attempts into total_attempts;
  insert into public.patrulha_registration_limits(bucket) values(period||':'||p_fingerprint)
    on conflict(bucket) do update set attempts=public.patrulha_registration_limits.attempts+1 returning attempts into ip_attempts;
  return ip_attempts <= 10 and total_attempts <= 100;
end; $$;
revoke all on function public.patrulha_registration_allow(text) from public, anon, authenticated;
grant execute on function public.patrulha_registration_allow(text) to service_role;
