import { useEffect, useState, useSyncExternalStore } from "react";
import { AccountController, guestSnapshot } from "@/game/account-controller";
import { CloudApi } from "@/game/cloud-api";
import { CLOUD_CONFIG } from "@/game/cloud-config";
import { Game } from "./Game";
import { AccountContext } from "./AccountContext";

export function AccountGame() {
  const [controller] = useState(() => new AccountController(new CloudApi(CLOUD_CONFIG)));
  const state = useSyncExternalStore(controller.subscribe, controller.snapshot, controller.snapshot);
  useEffect(() => controller.start(), [controller]);
  return <AccountContext.Provider value={controller}>
    {state.ready ? <div className="contents" inert={state.panel}><Game key={state.user?.id ?? "guest"} /></div> : <div className="game-app game-centered flex h-dvh flex-col items-center gap-4 bg-sky-grad p-5"><h1 className="font-display text-3xl font-bold">Carregando sua aventura…</h1><p>Aguarde enquanto buscamos seu progresso.</p></div>}
    {state.panel && <AccountPanel controller={controller} />}
  </AccountContext.Provider>;
}

function AccountPanel({ controller }: { controller: AccountController }) {
  const state = useSyncExternalStore(controller.subscribe, controller.snapshot, controller.snapshot);
  const [create, setCreate] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [importGuest, setImportGuest] = useState(false);
  const [error, setError] = useState("");
  const guest = guestSnapshot();
  const hasGuest = Object.keys(guest.progress.stars).length > 0 || guest.best > 0;
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = document.getElementById("account-dialog");
    (dialog?.querySelector("input,button") as HTMLElement | null)?.focus();
    const keys = (event: KeyboardEvent) => {
      if (event.key === "Escape") controller.close();
      if (event.key !== "Tab" || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href]'));
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener("keydown", keys, true);
    return () => { window.removeEventListener("keydown", keys, true); previous?.focus(); };
  }, [controller, state.user?.id, create]);
  return <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/45 p-3 sm:items-center" onKeyDown={(event) => event.stopPropagation()}>
    <section id="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-heading" className="card-game my-auto flex w-full max-w-lg flex-col gap-4 p-5">
      <h2 id="account-heading" className="font-display text-3xl font-extrabold">{state.user ? `Conta de ${state.user.username}` : create ? "Criar minha conta" : "Entrar na minha conta"}</h2>
      {state.user ? <>
        <p className="text-lg">Entre com este mesmo usuário e senha em outro navegador para continuar sua aventura.</p>
        <p role="status" className="rounded-xl bg-muted p-3 font-bold">{state.status}</p>
        <button disabled={state.busy} onClick={async () => { setError(""); try { await controller.flush(); } catch (err) { setError(err instanceof Error ? err.message : "Tente novamente."); } }} className="btn-game px-4 py-3 text-xl">Salvar agora</button>
        <button disabled={state.busy} onClick={() => { controller.logout().catch(() => {}); }} className="btn-game px-4 py-3 text-xl" style={{ ["--btn" as string]: "var(--turquoise)" }}>Sair da conta</button>
      </> : <form className="flex flex-col gap-4" onSubmit={async (event) => {
        event.preventDefault(); setError("");
        if (create && password !== confirmation) { setError("As senhas precisam ser iguais."); return; }
        try { await controller.login(username, password, create, importGuest && hasGuest); } finally { setPassword(""); setConfirmation(""); }
      }}>
        <p className="text-lg">Seu progresso ficará guardado online. Peça ajuda a um responsável para criar sua conta.</p>
        <label className="flex flex-col gap-1 text-lg font-bold">Usuário<input required autoCapitalize="none" autoCorrect="off" spellCheck={false} autoComplete="username" minLength={3} maxLength={24} pattern="[A-Za-z0-9_]{3,24}" value={username} disabled={state.busy} onChange={(event) => setUsername(event.target.value)} className="min-h-14 rounded-xl border-2 border-border bg-white px-3 text-xl" /></label>
        <p className="text-sm">Use letras sem acento, números ou _. Não precisa informar nome completo ou e-mail.</p>
        <label className="flex flex-col gap-1 text-lg font-bold">Senha<input required type="password" autoComplete={create ? "new-password" : "current-password"} minLength={8} maxLength={72} value={password} disabled={state.busy} onChange={(event) => setPassword(event.target.value)} className="min-h-14 rounded-xl border-2 border-border bg-white px-3 text-xl" /></label>
        {create && <><label className="flex flex-col gap-1 text-lg font-bold">Repetir senha<input required type="password" autoComplete="new-password" minLength={8} maxLength={72} value={confirmation} disabled={state.busy} onChange={(event) => setConfirmation(event.target.value)} className="min-h-14 rounded-xl border-2 border-border bg-white px-3 text-xl" /></label><p className="text-sm">Guarde seu usuário e sua senha com um responsável. Como não pedimos e-mail, não há recuperação automática por e-mail.</p></>}
        {hasGuest && <label className="flex items-start gap-3 text-lg"><input type="checkbox" checked={importGuest} disabled={state.busy} onChange={(event) => setImportGuest(event.target.checked)} className="mt-1 h-6 w-6 shrink-0" />Trazer para esta conta as missões e o recorde que já estão neste aparelho.</label>}
        <button disabled={state.busy || !controller.api.configured} type="submit" className="btn-game px-4 py-3 text-xl disabled:opacity-50">{state.busy ? "Aguarde…" : create ? "Criar conta e jogar" : "Entrar e continuar"}</button>
        <button disabled={state.busy} type="button" onClick={() => { setCreate((value) => !value); setPassword(""); setConfirmation(""); setError(""); }} className="min-h-12 text-lg font-bold underline">{create ? "Já tenho uma conta" : "Ainda não tenho conta"}</button>
        {!controller.api.configured && <p role="status">O salvamento online está sendo configurado. Por enquanto, seu progresso continua neste aparelho.</p>}
      </form>}
      {(error || state.error) && <p role="alert" className="rounded-xl bg-muted p-3 font-bold">{error || state.error}</p>}
      <button disabled={state.busy} onClick={controller.close} className="min-h-12 text-lg font-bold underline">Voltar ao jogo</button>
    </section>
  </div>;
}
