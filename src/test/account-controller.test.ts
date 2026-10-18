import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AccountController } from "@/game/account-controller";
import { CloudApi, CloudError } from "@/game/cloud-api";
import { combineSaves, type CloudSave } from "@/game/cloud-model";
import { setAccountScope } from "@/game/account-storage";
import { emptyProgress, loadProgress, saveProgress } from "@/game/progress";
import { loadDriveBest, saveDriveBest } from "@/game/drive-engine";
const fresh = (): CloudSave => ({ epoch: 0, revision: 0, stars: {}, medals: [], best: 0 });
let cleanup: (() => void) | undefined;
beforeEach(() => { localStorage.clear(); setAccountScope(null); vi.useFakeTimers(); });
afterEach(() => { cleanup?.(); cleanup = undefined; setAccountScope(null); vi.clearAllTimers(); vi.useRealTimers(); });
function setup() {
  let remote = fresh(), offline = false;
  const api = new CloudApi({ url: "https://test.supabase.co", publishableKey: "public-test" });
  vi.spyOn(api, "authenticate").mockImplementation(async () => {
    const session = { user: { id: "account-ana", username: "ana" }, access_token: "access", refresh_token: "refresh", expires_at: 9999999999 };
    api.session = session; return session;
  });
  const rpc = vi.spyOn(api, "rpc").mockImplementation(async (name, body) => {
    if (offline) throw new CloudError("offline");
    const data = body as { expected_epoch: number; new_stars: Record<string, number>; new_medals: string[]; new_best: number };
    if (name === "patrulha_save") {
      if (data.expected_epoch !== remote.epoch) throw new CloudError("reset", 409);
      remote = combineSaves(remote, { stars: data.new_stars, medals: data.new_medals, sound: true }, data.new_best); remote.revision++;
    }
    if (name === "patrulha_reset") remote = { ...fresh(), epoch: remote.epoch + 1, revision: remote.revision + 1 };
    return structuredClone(remote);
  });
  const controller = new AccountController(api); cleanup = controller.start();
  return { controller, api, rpc, get remote() { return remote; }, externalReset() { remote = { ...fresh(), epoch: remote.epoch + 1, revision: remote.revision + 1 }; }, setOffline(value: boolean) { offline = value; } };
}
describe("salvamento online", () => {
  it("transfere o progresso do visitante somente quando a pessoa escolhe", async () => {
    const s = setup();
    saveProgress({ ...emptyProgress(), stars: { gatinho: 3 }, medals: ["m-gatinho"] }); saveDriveBest(9);
    await s.controller.login("ana", "senha1234", true, true);
    expect(s.remote.stars).toEqual({ gatinho: 3 }); expect(s.remote.best).toBe(9);
    expect(s.controller.state.status).toBe("Progresso salvo online.");
  });
  it("entrar sem transferência não importa o jogo de outra pessoa no aparelho", async () => {
    const s = setup(); saveProgress({ ...emptyProgress(), stars: { fogo: 3 } });
    await s.controller.login("ana", "senha1234", false, false);
    expect(loadProgress().stars).toEqual({}); expect(s.remote.stars).toEqual({});
    setAccountScope(null); expect(loadProgress().stars).toEqual({ fogo: 3 });
  });
  it("preserva alterações offline e envia ao reconectar", async () => {
    const s = setup(); await s.controller.login("ana", "senha1234", false, false);
    s.setOffline(true); saveProgress({ ...emptyProgress(), stars: { fogo: 2 } }); saveDriveBest(5);
    await expect(s.controller.flush()).rejects.toThrow();
    expect(loadProgress().stars.fogo).toBe(2); expect(s.controller.state.status).toContain("aguardando envio");
    s.setOffline(false); await s.controller.flush();
    expect(s.remote.stars.fogo).toBe(2); expect(s.remote.best).toBe(5);
  });
  it("um navegador antigo não ressuscita as estrelas depois de um reinício remoto", async () => {
    const s = setup(); await s.controller.login("ana", "senha1234", false, false);
    saveProgress({ ...emptyProgress(), stars: { gatinho: 3 } }); await s.controller.flush();
    s.externalReset(); saveProgress({ ...loadProgress(), stars: { gatinho: 3, fogo: 3 } });
    await s.controller.flush();
    expect(loadProgress().stars).toEqual({}); expect(s.remote.stars).toEqual({}); expect(loadDriveBest()).toBe(0);
  });
  it("reinicia na nuvem e mantém o visitante separado", async () => {
    const s = setup(); saveProgress({ ...emptyProgress(), stars: { memoria: 3 } });
    await s.controller.login("ana", "senha1234", false, false);
    saveProgress({ ...emptyProgress(), stars: { gatinho: 3 } }); await s.controller.flush(); await s.controller.reset();
    expect(s.remote.epoch).toBe(1); expect(loadProgress().stars).toEqual({});
    setAccountScope(null); expect(loadProgress().stars).toEqual({ memoria: 3 });
  });
  it("não perde uma missão concluída enquanto outro salvamento está em andamento", async () => {
    const s = setup(); await s.controller.login("ana", "senha1234", false, false);
    const original = s.rpc.getMockImplementation()!;
    let release!: () => void, began!: () => void;
    const gate = new Promise<void>((resolve) => { release = resolve; });
    const started = new Promise<void>((resolve) => { began = resolve; });
    s.rpc.mockImplementation(async (name, body) => { if (name === "patrulha_save") { began(); await gate; } return original(name, body); });
    saveProgress({ ...emptyProgress(), stars: { gatinho: 3 } });
    const saving = s.controller.flush(); await started;
    saveProgress({ ...loadProgress(), stars: { gatinho: 3, fogo: 2 } });
    release(); await saving; await s.controller.flush();
    expect(s.remote.stars).toEqual({ gatinho: 3, fogo: 2 }); expect(loadProgress().stars).toEqual(s.remote.stars);
  });
});
