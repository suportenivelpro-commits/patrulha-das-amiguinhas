import { CloudApi, CloudError, type GameUser } from "./cloud-api";
import { combineSaves, sameScores, type CloudSave, type SyncMeta } from "./cloud-model";
import { LOCAL_SAVE_EVENT, notifyCloudLoad, setAccountScope } from "./account-storage";
import { emptyProgress, loadProgress, STORAGE_KEY, type Progress } from "./progress";
import { loadDriveBest } from "./drive-engine";
export interface AccountState { user: GameUser | null; ready: boolean; busy: boolean; panel: boolean; status: string; error: string }
const metaKey = (id: string) => `patrulha-sync-v1:${id}`;
const getMeta = (id: string): SyncMeta | null => { try { const value = JSON.parse(localStorage.getItem(metaKey(id)) ?? "null") as SyncMeta | null; return value && Number.isSafeInteger(value.epoch) && value.epoch >= 0 && typeof value.dirty === "boolean" ? value : null; } catch { return null; } };
function putMeta(id: string, meta: SyncMeta) { try { localStorage.setItem(metaKey(id), JSON.stringify(meta)); } catch { /* A failed cache never becomes a successful cloud status. */ } }
export function guestSnapshot(): { progress: Progress; best: number } {
  try { return { progress: { ...emptyProgress(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") }, best: Number(localStorage.getItem("patrulha-corrida-v1")) || 0 }; } catch { return { progress: emptyProgress(), best: 0 }; }
}
export class AccountController {
  state: AccountState = { user: null, ready: false, busy: false, panel: false, status: "", error: "" };
  private listeners = new Set<() => void>();
  private generation = 0;
  private localVersion = 0;
  private queue: Promise<unknown> = Promise.resolve();
  private timer: ReturnType<typeof setTimeout> | null = null;
  constructor(readonly api: CloudApi) {}
  subscribe = (fn: () => void) => { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; };
  snapshot = () => this.state;
  private patch(values: Partial<AccountState>) { this.state = { ...this.state, ...values }; for (const fn of this.listeners) fn(); }
  open = () => this.patch({ panel: true, error: "" });
  close = () => { if (!this.state.busy) this.patch({ panel: false, error: "" }); };
  private serial<T>(fn: () => Promise<T>): Promise<T> { const task = this.queue.catch(() => {}).then(fn); this.queue = task; return task; }
  private cancelTimer() { if (this.timer) clearTimeout(this.timer); this.timer = null; }
  private schedule() { this.cancelTimer(); this.timer = setTimeout(() => { this.flush().catch(() => {}); }, 400); }
  private apply(id: string, save: CloudSave, dirty = false) {
    const sound = loadProgress().sound;
    try {
      localStorage.setItem(`${STORAGE_KEY}:${id}`, JSON.stringify({ stars: save.stars, medals: save.medals, sound }));
      localStorage.setItem(`patrulha-corrida-v1:${id}`, String(save.best));
    } catch { /* The verified server copy remains available. */ }
    putMeta(id, { epoch: save.epoch, dirty });
    notifyCloudLoad();
  }
  private onSave = () => {
    const user = this.state.user; if (!user) return;
    this.localVersion++;
    const meta = getMeta(user.id);
    if (meta) putMeta(user.id, { ...meta, dirty: true });
    this.patch({ status: "Salvo neste aparelho; enviando para sua conta…" }); this.schedule();
  };
  private onOnline = () => { this.flush().catch(() => {}); };
  private onVisible = () => { if (document.visibilityState === "visible") this.onOnline(); };
  private onStorage = (event: StorageEvent) => {
    if (event.key !== "patrulha-conta-v1") return;
    if (!event.newValue) {
      this.generation++; this.cancelTimer(); this.api.clear(); setAccountScope(null);
      this.patch({ user: null, ready: true, busy: false, panel: false, status: "", error: "" });
    } else {
      const latest = this.api.restore();
      if (latest && latest.user.id !== this.state.user?.id) { this.restore().catch(() => {}); }
    }
  };
  start() {
    window.addEventListener(LOCAL_SAVE_EVENT, this.onSave);
    window.addEventListener("online", this.onOnline);
    window.addEventListener("storage", this.onStorage);
    document.addEventListener("visibilitychange", this.onVisible);
    const poll = setInterval(() => { if (document.visibilityState === "visible") this.onOnline(); }, 30000);
    this.restore().catch(() => {});
    return () => { this.generation++; this.cancelTimer(); clearInterval(poll); window.removeEventListener(LOCAL_SAVE_EVENT, this.onSave); window.removeEventListener("online", this.onOnline); window.removeEventListener("storage", this.onStorage); document.removeEventListener("visibilitychange", this.onVisible); };
  }
  async restore() {
    const generation = ++this.generation;
    this.patch({ ready: false });
    const session = this.api.restore();
    if (!session || !this.api.configured) { setAccountScope(null); this.patch({ user: null, ready: true }); return; }
    try {
      const user = await this.api.verify();
      if (generation !== this.generation) return;
      setAccountScope(user.id); this.patch({ user });
      await this.flush();
      if (generation === this.generation) this.patch({ ready: true });
    } catch (error) {
      if (generation !== this.generation) return;
      if (error instanceof CloudError && error.status === 0 && getMeta(session.user.id)) {
        setAccountScope(session.user.id); this.patch({ user: session.user, ready: true, status: "Sem conexão. Jogando com a cópia deste aparelho." });
      } else {
        this.api.clear(); setAccountScope(null);
        this.patch({ user: null, ready: true, panel: true, status: "", error: "Conecte-se e entre novamente para carregar seu progresso online." });
      }
    }
  }
  async login(username: string, password: string, create: boolean, importGuest: boolean) {
    if (this.state.busy) return;
    const guest = guestSnapshot(); const generation = ++this.generation;
    this.patch({ busy: true, error: "" });
    try {
      const session = await this.api.authenticate(username, password, create);
      const remote = await this.api.rpc("patrulha_load");
      if (generation !== this.generation) return;
      setAccountScope(session.user.id); this.patch({ user: session.user });
      const cached = getMeta(session.user.id);
      if (cached?.dirty && cached.epoch === remote.epoch) {
        const merged = combineSaves(remote, loadProgress(), loadDriveBest());
        this.apply(session.user.id, merged, true);
      } else this.apply(session.user.id, remote);
      if (importGuest) {
        const merged = combineSaves(remote, guest.progress, guest.best);
        const withCache = combineSaves(merged, loadProgress(), loadDriveBest());
        this.apply(session.user.id, withCache, true);
      }
      await this.flush();
      if (generation === this.generation) this.patch({ panel: false, ready: true });
    } catch (error) { if (generation === this.generation) this.patch({ error: error instanceof Error ? error.message : "Não foi possível entrar." }); }
    finally { if (generation === this.generation) this.patch({ busy: false }); }
  }
  flush(): Promise<void> {
    this.cancelTimer();
    const generation = this.generation, user = this.state.user;
    if (!user) return Promise.resolve();
    return this.serial(async () => {
      if (generation !== this.generation || user.id !== this.state.user?.id) return;
      try {
        const remote = await this.api.rpc("patrulha_load");
        if (generation !== this.generation) return;
        const meta = getMeta(user.id);
        if (meta && meta.epoch !== remote.epoch) {
          this.apply(user.id, remote); this.patch({ status: "Progresso atualizado após um reinício em outro aparelho.", error: "" }); return;
        }
        if (!meta?.dirty) { this.apply(user.id, remote); this.patch({ status: "Progresso salvo online.", error: "" }); return; }
        const merged = combineSaves(remote, loadProgress(), loadDriveBest());
        const version = this.localVersion;
        const saved = sameScores(remote, merged) ? remote : await this.api.rpc("patrulha_save", { expected_epoch: remote.epoch, new_stars: merged.stars, new_medals: merged.medals, new_best: merged.best });
        if (generation !== this.generation) return;
        if (version !== this.localVersion) {
          this.apply(user.id, combineSaves(saved, loadProgress(), loadDriveBest()), true); this.schedule();
          this.patch({ status: "Salvo neste aparelho; enviando para sua conta…", error: "" });
        } else { this.apply(user.id, saved); this.patch({ status: "Progresso salvo online.", error: "" }); }
      } catch (error) {
        if (generation !== this.generation) return;
        if (error instanceof CloudError && error.status === 409) {
          const current = await this.api.rpc("patrulha_load");
          if (generation === this.generation) { this.apply(user.id, current); this.patch({ status: "Progresso atualizado após um reinício em outro aparelho." }); }
          return;
        }
        this.patch({ status: error instanceof CloudError && [400, 401, 403].includes(error.status) ? "Sua sessão terminou. Entre novamente; a cópia deste aparelho foi preservada." : "Sem conexão. Progresso salvo neste aparelho; aguardando envio." });
        throw error;
      }
    });
  }
  async reset() {
    const generation = this.generation, user = this.state.user; if (!user) return;
    await this.serial(async () => {
      if (generation !== this.generation) throw new Error("A conta mudou. Tente novamente.");
      const remote = await this.api.rpc("patrulha_load");
      if (generation !== this.generation) throw new Error("A conta mudou. Tente novamente.");
      const saved = await this.api.rpc("patrulha_reset", { expected_epoch: remote.epoch });
      if (generation !== this.generation) throw new Error("A conta mudou. Tente novamente.");
      this.localVersion++; this.apply(user.id, saved); this.patch({ status: "Progresso reiniciado e salvo online." });
    });
  }
  async logout() {
    this.patch({ busy: true });
    await this.flush().catch(() => {});
    this.generation++; this.cancelTimer();
    const done = this.api.logout();
    setAccountScope(null); this.patch({ user: null, busy: false, panel: false, ready: true, status: "", error: "" });
    await done;
  }
}
