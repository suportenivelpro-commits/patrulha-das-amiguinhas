import { describe, expect, it } from "vitest";
import { applyResult, emptyProgress, isChapterUnlocked, isUnlocked, loadProgress, resetProgress, saveProgress, starsFor } from "@/game/progress";
import { CHAPTERS, MISSIONS } from "@/game/data";

describe("progresso", () => {
  it("estrelas de 1 a 3 sem punir", () => {
    expect(starsFor(0)).toBe(3);
    expect(starsFor(2)).toBe(2);
    expect(starsFor(9)).toBe(1);
  });
  it("terceira missão abre após concluir a segunda", () => {
    const p = emptyProgress();
    expect(isUnlocked(p, 2)).toBe(false);
    expect(isUnlocked(applyResult(p, MISSIONS[1].id, 1).next, 2)).toBe(true);
  });
  it("medalha do capítulo após as 5 missões", () => {
    let p = emptyProgress();
    for (const m of MISSIONS.slice(0, 4)) p = applyResult(p, m.id, 2).next;
    expect(p.medals).not.toContain("cap1");
    expect(applyResult(p, MISSIONS[4].id, 2).earned).toContain("cap1");
  });
});


describe("novos capítulos", () => {
  it("não abre a natureza só por concluir o parque", () => {
    const p = applyResult(emptyProgress(), "parque", 2).next;
    expect(isChapterUnlocked(p, 1)).toBe(false);
    expect(isUnlocked(p, 5)).toBe(false);
  });
  it("preserva o progresso antigo e abre a primeira missão da natureza", () => {
    let p = emptyProgress();
    for (const id of CHAPTERS[0]!.missions) p = applyResult(p, id, 3).next;
    saveProgress(p);
    const restored = loadProgress();
    expect(restored.stars).toEqual(p.stars);
    expect(restored.medals).toContain("cap1");
    expect(isChapterUnlocked(restored, 1)).toBe(true);
    expect(isUnlocked(restored, 5)).toBe(true);
    expect(isUnlocked(restored, 6)).toBe(false);
  });
  it("abre as missões novas em sequência e premia a natureza só ao terminar", () => {
    let p = emptyProgress();
    for (const id of CHAPTERS[0]!.missions) p = applyResult(p, id, 2).next;
    p = applyResult(p, "jardim", 3).next;
    expect(isUnlocked(p, 6)).toBe(true);
    expect(isUnlocked(p, 7)).toBe(false);
    p = applyResult(p, "patinhos", 3).next;
    expect(isUnlocked(p, 7)).toBe(true);
    expect(p.medals).not.toContain("cap2");
    p = applyResult(p, "memoria", 3).next;
    expect(p.medals).not.toContain("cap2");
    p = applyResult(p, "borboletas", 3).next;
    const result = applyResult(p, "abelhinhas", 3);
    expect(result.earned).toContain("cap2");
    expect(result.next.stars.gatinho).toBe(2);
  });
});


describe("reinício do jogo", () => {
  it("zera estrelas e medalhas, preservando som, voz e outros dados do aparelho", () => {
    const p = applyResult(emptyProgress(), "gatinho", 3).next;
    saveProgress({ ...p, sound: false });
    localStorage.setItem("patrulha-voz-v1", "voz-feminina");
    localStorage.setItem("outro-app", "preservado");
    const fresh = resetProgress(false);
    expect(fresh).toEqual({ stars: {}, medals: [], sound: false });
    expect(loadProgress()).toEqual(fresh);
    expect(isUnlocked(fresh, 2)).toBe(false);
    expect(isChapterUnlocked(fresh, 1)).toBe(false);
    expect(localStorage.getItem("patrulha-voz-v1")).toBe("voz-feminina");
    expect(localStorage.getItem("outro-app")).toBe("preservado");
  });
});


describe("campanha de 50 missões", () => {
  it("permite avançar até a missão50 e conquistar os dez capítulos", () => {
    let p = emptyProgress();
    for (const [index, mission] of MISSIONS.entries()) {
      expect(isUnlocked(p, index)).toBe(true);
      p = applyResult(p, mission.id, 3).next;
    }
    expect(Object.keys(p.stars)).toHaveLength(50);
    expect(CHAPTERS.every((chapter) => p.medals.includes(chapter.medal))).toBe(true);
    expect(p.medals).toContain("cinquenta");
    expect(p.medals).toContain("perfeita");
    expect(p.medals).toContain("estrelas150");
  });
  it("preserva as oito missões antigas e abre os novos desafios da natureza", () => {
    const old = { ...emptyProgress(), stars: Object.fromEntries(MISSIONS.slice(0, 8).map((mission) => [mission.id, 3])), medals: ["cap1", "cap2", "perfeita"], sound: false };
    saveProgress(old);
    const restored = loadProgress();
    expect(restored).toEqual(old);
    expect(isUnlocked(restored, 8)).toBe(true);
    expect(isUnlocked(restored, 9)).toBe(false);
    expect(isChapterUnlocked(restored, 2)).toBe(false);
    const next = applyResult(restored, MISSIONS[8]!.id, 2).next;
    expect(next.stars.gatinho).toBe(3);
    expect(next.medals).toContain("cap2");
    expect(next.medals).toContain("perfeita");
  });
});
