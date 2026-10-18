import { credentialsError, normalizeUsername, parseCloudSave, type CloudSave } from "./cloud-model";
export interface GameUser { id: string; username: string }
export interface GameSession { access_token: string; refresh_token: string; expires_at: number; user: GameUser }
export class CloudError extends Error { constructor(message: string, public status = 0) { super(message); } }
const SESSION_KEY = "patrulha-conta-v1";
function parseUser(value: unknown): GameUser {
  const user = value as { id?: string; email?: string; app_metadata?: { patrulha_account?: boolean } };
  const username = user?.email?.replace(/@patrulha\.invalid$/, "") ?? "";
  if (!user?.id || !user.email?.endsWith("@patrulha.invalid") || !/^[a-z0-9_]{3,24}$/.test(username) || user.app_metadata?.patrulha_account !== true) throw new CloudError("Esta conta não pertence ao jogo. Entre novamente.", 401);
  return { id: user.id, username };
}
function parseSession(value: unknown): GameSession {
  const data = value as Record<string, unknown>;
  if (typeof data?.["access_token"] !== "string" || typeof data["refresh_token"] !== "string") throw new CloudError("Não foi possível iniciar a sessão.");
  const expires = typeof data["expires_at"] === "number" ? data["expires_at"] : Math.floor(Date.now() / 1000) + Number(data["expires_in"] ?? 3600);
  return { access_token: data["access_token"], refresh_token: data["refresh_token"], expires_at: expires, user: parseUser(data["user"]) };
}
export class CloudApi {
  session: GameSession | null = null;
  private refreshing: Promise<GameSession> | null = null;
  private generation = 0;
  constructor(private config: { url: string; publishableKey: string }, private fetcher: typeof fetch = (...args) => fetch(...args)) {}
  get configured() { return Boolean(this.config.url && this.config.publishableKey); }
  restore(): GameSession | null {
    try {
      const saved = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null") as GameSession | null;
      if (saved && typeof saved.access_token === "string" && typeof saved.refresh_token === "string" && Number.isFinite(saved.expires_at) && typeof saved.user?.id === "string" && typeof saved.user.username === "string" && /^[a-z0-9_]{3,24}$/.test(saved.user.username)) this.session = saved;
    } catch { /* Invalid local sessions are ignored. */ }
    return this.session;
  }
  private persist(session: GameSession | null) {
    this.session = session;
    try { if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session)); else localStorage.removeItem(SESSION_KEY); } catch { /* The session can still work until the tab closes. */ }
  }
  clear() { this.generation++; this.persist(null); }
  private async request(path: string, options: RequestInit = {}): Promise<unknown> {
    if (!this.configured) throw new CloudError("O salvamento online ainda não foi configurado.");
    let response: Response;
    try { response = await this.fetcher(this.config.url + path, { ...options, headers: { apikey: this.config.publishableKey, "Content-Type": "application/json", ...options.headers }, signal: AbortSignal.timeout(15000) }); }
    catch { throw new CloudError("Sem conexão. Seu progresso continua salvo neste aparelho."); }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = response.status === 429 ? "Muitas tentativas. Aguarde um pouco e tente novamente." : response.status === 401 || response.status === 400 && path.startsWith("/auth/") ? "Usuário ou senha incorretos. Tente novamente." : response.status === 409 ? path.startsWith("/functions/") ? "Esse usuário já está em uso. Escolha outro." : "O progresso foi reiniciado em outro aparelho. Vamos carregar a versão atual." : "Não foi possível conectar à sua conta. Tente novamente.";
      throw new CloudError(message, response.status);
    }
    return data;
  }
  async authenticate(username: string, password: string, create: boolean) {
    const error = credentialsError(username, password); if (error) throw new CloudError(error);
    const generation = this.generation;
    const data = await this.request(create ? "/functions/v1/patrulha-register" : "/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify(create ? { username: normalizeUsername(username), password } : { email: `${normalizeUsername(username)}@patrulha.invalid`, password }) });
    const session = parseSession(data);
    if (generation !== this.generation) throw new CloudError("A sessão mudou. Entre novamente.", 401);
    this.persist(session); return session;
  }
  private async token(): Promise<string> {
    if (!this.session) throw new CloudError("Entre na sua conta para salvar online.", 401);
    if (this.session.expires_at > Date.now() / 1000 + 60) return this.session.access_token;
    if (!this.refreshing) {
      const generation = this.generation;
      const refresh = async () => {
        // Another tab may already have rotated the refresh token.
        this.restore();
        if (!this.session) throw new CloudError("Entre novamente na sua conta.", 401);
        if (this.session.expires_at > Date.now() / 1000 + 60) return this.session;
        const data = await this.request("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: this.session.refresh_token }) });
        const session = parseSession(data);
        if (generation !== this.generation) throw new CloudError("A sessão mudou.", 401);
        this.persist(session); return session;
      };
      this.refreshing = (typeof navigator !== "undefined" && navigator.locks ? navigator.locks.request("patrulha-refresh", refresh) : refresh()).finally(() => { this.refreshing = null; });
    }
    return (await this.refreshing).access_token;
  }
  async verify() { const data = await this.request("/auth/v1/user", { headers: { Authorization: `Bearer ${await this.token()}` } }); const user = parseUser(data); if (user.id !== this.session?.user.id) throw new CloudError("Entre novamente na sua conta.", 401); return user; }
  async rpc(name: "patrulha_load" | "patrulha_save" | "patrulha_reset", body: unknown = {}): Promise<CloudSave> {
    const data = await this.request(`/rest/v1/rpc/${name}`, { method: "POST", headers: { Authorization: `Bearer ${await this.token()}` }, body: JSON.stringify(body) });
    return parseCloudSave(data);
  }
  async logout() {
    const token = this.session?.access_token;
    this.clear();
    if (token) await this.request("/auth/v1/logout?scope=local", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
  }
}
