import { beforeEach, describe, expect, it } from "vitest";
import { advanceDrive, initialDrive, loadDriveBest, moveLane, resetDriveBest, saveDriveBest } from "@/game/drive-engine";

beforeEach(() => localStorage.clear());
describe("corrida e pontuação", () => {
  it("coleta cada estrela uma vez e não coleta em outra faixa", () => {
    const state = { ...initialDrive(), objects: [{ id: 1, lane: 1, y: 73, kind: "star" as const }, { id: 2, lane: 0, y: 73, kind: "star" as const }] };
    const next = advanceDrive(state, 1, 1200, true);
    expect(next.stars).toBe(1);
    expect(next.objects.map((item) => item.id)).toEqual([2]);
    expect(advanceDrive(next, 1, 1200, true).stars).toBe(1);
    expect(state.objects).toHaveLength(2);
  });
  it("permite esbarrar sem encerrar a partida nem perder estrelas", () => {
    const state = { ...initialDrive(), stars: 4, objects: [{ id: 1, lane: 1, y: 73, kind: "cone" as const }] };
    const next = advanceDrive(state, 1, 1200, true);
    expect(next).toMatchObject({ stars: 4, bumps: 1, done: false });
  });
  it("mantém as faixas entre zero e dois", () => {
    expect(moveLane(0, -1)).toBe(0); expect(moveLane(2, 1)).toBe(2);
    expect(moveLane(1, -1)).toBe(0); expect(moveLane(1, 1)).toBe(2);
  });
  it("termina a corrida em 60 segundos e congela o resultado", () => {
    let state = initialDrive();
    for (let tick = 0; tick < 1200; tick++) state = advanceDrive(state, 1, 1200, true, () => 0.5);
    expect(state.done).toBe(true); expect(state.stars).toBeGreaterThan(0);
    expect(advanceDrive(state, 1, 1200, true)).toBe(state);
  });
  it("salva somente o maior recorde e permite zerar", () => {
    expect(saveDriveBest(8)).toBe(8); expect(saveDriveBest(3)).toBe(8);
    expect(loadDriveBest()).toBe(8); resetDriveBest(); expect(loadDriveBest()).toBe(0);
  });
  it("ignora valores de recorde inválidos", () => {
    localStorage.setItem("patrulha-corrida-v1", "-9"); expect(loadDriveBest()).toBe(0);
    localStorage.setItem("patrulha-corrida-v1", "NaN"); expect(loadDriveBest()).toBe(0);
    expect(saveDriveBest(Infinity)).toBe(0);
  });
});
