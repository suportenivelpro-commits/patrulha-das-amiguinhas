import { describe, expect, it } from "vitest";
import { applyResult, emptyProgress, isChapterUnlocked, isUnlocked, loadProgress, saveProgress, starsFor } from "@/game/progress";
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
    const result = applyResult(p, "memoria", 3);
    expect(result.earned).toContain("cap2");
    expect(result.next.stars.gatinho).toBe(2);
  });
});
