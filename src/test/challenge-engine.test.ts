import { describe, expect, it } from "vitest";
import { CHALLENGE_LEVELS } from "@/game/challenge-levels";
import { CHAPTERS, HEROES, MEDALS, MISSIONS } from "@/game/data";
import { challengeGoal, initialChallenge, reduceChallenge, searchBoard } from "@/game/challenge-engine";
import { solveLevel, wrongActions } from "./challenge-solutions";

describe("catálogo de 50 missões", () => {
  it("tem 50 missões únicas, dez capítulos completos e referências válidas", () => {
    expect(MISSIONS).toHaveLength(50);
    expect(CHALLENGE_LEVELS).toHaveLength(42);
    expect(CHAPTERS).toHaveLength(10);
    expect(new Set(MISSIONS.map((mission) => mission.id)).size).toBe(50);
    expect(new Set(CHAPTERS.flatMap((chapter) => chapter.missions)).size).toBe(50);
    expect(new Set(MEDALS.map((medal) => medal.id)).size).toBe(MEDALS.length);
    for (const chapter of CHAPTERS) expect(chapter.missions).toHaveLength(5);
    for (const mission of MISSIONS) {
      expect(CHAPTERS.filter((chapter) => chapter.missions.includes(mission.id))).toHaveLength(1);
      expect(HEROES.some((hero) => hero.id === mission.hero)).toBe(true);
      if (mission.game === "challenge") expect(CHALLENGE_LEVELS.some((level) => level.id === mission.challengeId)).toBe(true);
    }
  });
  it("usa oito mecânicas novas com alvos e opções consistentes", () => {
    expect(new Set(CHALLENGE_LEVELS.map((level) => level.kind)).size).toBe(8);
    for (const level of CHALLENGE_LEVELS) {
      expect(challengeGoal(level)).toBeGreaterThan(0);
      if (level.kind === "search") {
        const board = searchBoard(level);
        expect(board).toHaveLength(12);
        expect(board.filter((cell) => cell.id === level.target.id)).toHaveLength(level.needed);
        expect(new Set(board.map((cell) => cell.cellId)).size).toBe(12);
        expect(searchBoard(level)).toEqual(board);
      }
      if (level.kind === "sequence") expect(level.order.every((id) => level.palette.some((token) => token.id === id))).toBe(true);
      if (level.kind === "count") for (const round of level.rounds) {
        expect(round.options).toContain(round.count);
        expect(new Set(round.options).size).toBe(round.options.length);
        expect(round.options.every((value) => Number.isInteger(value) && value > 0)).toBe(true);
      }
      if (level.kind === "pattern") for (const round of level.rounds) expect(round.options.filter((token) => token.id === round.answer)).toHaveLength(1);
      if (level.kind === "sort") for (const item of level.items) expect(level.bins.filter((bin) => bin.id === item.bin)).toHaveLength(1);
      if (level.kind === "build") {
        expect(new Set(level.slots.map((slot) => slot.id)).size).toBe(level.slots.length);
        expect(new Set(level.slots.map((slot) => slot.icon)).size).toBe(level.slots.length);
      }
    }
  });
  it.each(CHALLENGE_LEVELS)("permite concluir $id sem erros ou alterações nos dados", (level) => {
    const snapshot = JSON.stringify(level);
    let state = initialChallenge(level);
    for (const action of solveLevel(level)) state = reduceChallenge(level, state, action);
    expect(state.done).toBe(true);
    expect(state.progress).toBe(challengeGoal(level));
    expect(state.mistakes).toBe(0);
    expect(reduceChallenge(level, state, { type: "tap", id: "extra" })).toBe(state);
    expect(JSON.stringify(level)).toBe(snapshot);
  });
  it.each(CHALLENGE_LEVELS)("permite tentar novamente em $id após uma escolha errada", (level) => {
    let state = initialChallenge(level);
    for (const action of wrongActions(level)) state = reduceChallenge(level, state, action);
    expect(state.mistakes).toBe(1);
    expect(state.progress).toBe(0);
    expect(state.done).toBe(false);
    for (const action of solveLevel(level)) state = reduceChallenge(level, state, action);
    expect(state.done).toBe(true);
    expect(state.mistakes).toBe(1);
  });
});
