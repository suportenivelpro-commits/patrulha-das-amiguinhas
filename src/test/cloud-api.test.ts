import { beforeEach, describe, expect, it, vi } from "vitest";
import { CloudApi } from "@/game/cloud-api";
const authUser = { id: "user-ana", email: "ana@patrulha.invalid", app_metadata: { patrulha_account: true } };
const session = { access_token: "access-one", refresh_token: "refresh-one", expires_in: 3600, user: authUser };
const config = { url: "https://example.supabase.co", publishableKey: "sb_publishable_example" };
const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
beforeEach(() => localStorage.clear());
describe("autenticação online", () => {
  it("envia credenciais por HTTPS e nunca armazena a senha", async () => {
    const request = vi.fn().mockResolvedValue(response(session));
    const api = new CloudApi(config, request); await api.authenticate(" ANA ", "senha1234", false);
    expect(JSON.parse(String(request.mock.calls[0]![1].body))).toEqual({ email: "ana@patrulha.invalid", password: "senha1234" });
    expect(localStorage.getItem("patrulha-conta-v1")).not.toContain("senha1234");
    expect(api.restore()?.user.username).toBe("ana");
  });
  it("recusa senhas incorretas sem criar uma sessão", async () => {
    const api = new CloudApi(config, vi.fn().mockResolvedValue(response({}, 400)));
    await expect(api.authenticate("ana", "senhaerrada", false)).rejects.toThrow("Usuário ou senha incorretos");
    expect(api.session).toBeNull();
  });
  it("renova a sessão expirada uma só vez para chamadas simultâneas", async () => {
    const request = vi.fn().mockImplementation((url: string) => Promise.resolve(response(url.includes("refresh_token") ? session : authUser)));
    const api = new CloudApi(config, request);
    localStorage.setItem("patrulha-conta-v1", JSON.stringify({ access_token: "old", refresh_token: "old-refresh", expires_at: 1, user: { id: authUser.id, username: "ana" } }));
    api.restore(); await Promise.all([api.verify(), api.verify()]);
    expect(request.mock.calls.filter(([url]) => String(url).includes("grant_type=refresh_token"))).toHaveLength(1);
  });
  it("sair remove a sessão mesmo quando a rede falha", async () => {
    const request = vi.fn().mockResolvedValueOnce(response(session)).mockRejectedValueOnce(new Error("offline"));
    const api = new CloudApi(config, request); await api.authenticate("ana", "senha1234", false); await api.logout();
    expect(api.session).toBeNull(); expect(localStorage.getItem("patrulha-conta-v1")).toBeNull();
  });
});
