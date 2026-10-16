import { describe, expect, it } from "vitest";
import { applyResult, emptyProgress, isUnlocked, starsFor } from "@/game/progress";
import { MISSIONS } from "@/game/data";

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
