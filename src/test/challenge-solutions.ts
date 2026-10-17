import type { ChallengeAction, ChallengeLevel } from "@/game/challenge-types";
import { searchBoard } from "@/game/challenge-engine";

/** Independent breadth-first search verifies that each authored maze has an exit. */
export function routeSolution(level: Extract<ChallengeLevel, { kind: "route" }>): ChallengeAction[] {
  const queue: { at: number; path: ChallengeAction[] }[] = [{ at: level.start, path: [] }];
  const seen = new Set([level.start]);
  const directions = [["up", -1, 0], ["down", 1, 0], ["left", 0, -1], ["right", 0, 1]] as const;
  while (queue.length) {
    const { at, path } = queue.shift()!;
    if (at === level.goal) return path;
    const row = Math.floor(at / level.size), col = at % level.size;
    for (const [direction, dr, dc] of directions) {
      const nextRow = row + dr, nextCol = col + dc, next = nextRow * level.size + nextCol;
      if (nextRow < 0 || nextRow >= level.size || nextCol < 0 || nextCol >= level.size || level.walls.includes(next) || seen.has(next)) continue;
      seen.add(next);
      queue.push({ at: next, path: [...path, { type: "move", direction }] });
    }
  }
  throw new Error(`Labirinto sem saída: ${level.id}`);
}

export function solveLevel(level: ChallengeLevel): ChallengeAction[] {
  switch (level.kind) {
    case "search": return searchBoard(level).filter((cell) => cell.id === level.target.id).map((cell) => ({ type: "tap", id: cell.cellId }));
    case "sequence": return level.order.map((id) => ({ type: "tap", id }));
    case "count": return level.rounds.map((round) => ({ type: "tap", id: String(round.count) }));
    case "pattern": return level.rounds.map((round) => ({ type: "tap", id: round.answer }));
    case "sort": return level.items.flatMap((item): ChallengeAction[] => [{ type: "tap", id: item.id }, { type: "target", id: item.bin }]);
    case "pairs": return level.pairs.flatMap((pair): ChallengeAction[] => [{ type: "tap", id: pair.id }, { type: "target", id: pair.id }]);
    case "build": return level.slots.map((slot) => ({ type: "tap", id: slot.id }));
    case "route": return routeSolution(level);
  }
}

export function wrongActions(level: ChallengeLevel): ChallengeAction[] {
  switch (level.kind) {
    case "search": return [{ type: "tap", id: searchBoard(level).find((cell) => cell.id !== level.target.id)!.cellId }];
    case "sequence": return [{ type: "tap", id: level.palette.find((token) => token.id !== level.order[0])!.id }];
    case "count": return [{ type: "tap", id: String(level.rounds[0]!.options.find((option) => option !== level.rounds[0]!.count)) }];
    case "pattern": return [{ type: "tap", id: level.rounds[0]!.options.find((token) => token.id !== level.rounds[0]!.answer)!.id }];
    case "sort": return [{ type: "tap", id: level.items[0]!.id }, { type: "target", id: level.bins.find((bin) => bin.id !== level.items[0]!.bin)!.id }];
    case "pairs": return [{ type: "tap", id: level.pairs[0]!.id }, { type: "target", id: level.pairs[1]!.id }];
    case "build": return [{ type: "tap", id: level.slots[1]!.id }];
    case "route": return [{ type: "move", direction: Math.floor(level.start / level.size) === 0 ? "up" : "down" }];
  }
}
