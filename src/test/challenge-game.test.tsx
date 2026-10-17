import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CHALLENGE_LEVELS } from "@/game/challenge-levels";
import { challengeGoal, searchBoard } from "@/game/challenge-engine";
import type { ChallengeAction, ChallengeLevel } from "@/game/challenge-types";
import { heroById, MISSIONS } from "@/game/data";
import { ChallengeGame } from "@/components/game/minigames/ChallengeGame";
import { solveLevel } from "./challenge-solutions";

vi.mock("@/game/audio", () => ({ audio: { sfx: vi.fn(), speak: vi.fn() } }));
beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { cleanup(); vi.clearAllTimers(); vi.useRealTimers(); });
const representatives = [...new Set(CHALLENGE_LEVELS.map((level) => level.kind))].map((kind) => CHALLENGE_LEVELS.find((level) => level.kind === kind)!);

function actionLabel(level: ChallengeLevel, action: ChallengeAction): string {
  if (action.type === "move") return { up: "Cima", down: "Baixo", left: "Esquerda", right: "Direita" }[action.direction];
  switch (level.kind) {
    case "search": {
      const board = searchBoard(level), index = board.findIndex((cell) => cell.cellId === action.id);
      return `${board[index]!.label}, posição ${index + 1}`;
    }
    case "sequence": return `Tocar ${level.palette.find((token) => token.id === action.id)!.label}`;
    case "count": return `Número ${action.id}`;
    case "pattern": return `Escolher ${level.rounds.flatMap((round) => round.options).find((token) => token.id === action.id)!.label}`;
    case "sort": return action.type === "tap" ? `Selecionar ${level.items.find((token) => token.id === action.id)!.label}` : `Guardar em ${level.bins.find((token) => token.id === action.id)!.label}`;
    case "pairs": { const pair = level.pairs.find((candidate) => candidate.id === action.id)!; return action.type === "tap" ? `Escolher ${pair.left.label}` : `Ligar a ${pair.right.label}`; }
    case "build": return `Usar ${level.slots.find((slot) => slot.id === action.id)!.label}`;
    default: throw new Error("Ação não suportada");
  }
}

describe("controles das novas mecânicas", () => {
  it.each(representatives)("conclui $kind pelos botões visíveis uma única vez", (level) => {
    const onDone = vi.fn();
    render(<ChallengeGame hero={heroById(level.hero)} mission={MISSIONS.find((mission) => mission.challengeId === level.id)!} onDone={onDone} />);
    for (const action of solveLevel(level)) fireEvent.click(screen.getByRole("button", { name: actionLabel(level, action) }));
    expect(screen.getByRole("status")).toHaveTextContent(`${challengeGoal(level)}/${challengeGoal(level)}`);
    act(() => { vi.advanceTimersByTime(1700); });
    expect(onDone).toHaveBeenCalledExactlyOnceWith(0);
    act(() => { vi.advanceTimersByTime(3000); });
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
