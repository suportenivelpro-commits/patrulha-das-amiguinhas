import type { ChallengeAction, ChallengeLevel, ChallengeState, Token } from "./challenge-types";

/** Seeded order stays stable across rerenders and can be checked without a browser. */
export function orderedForLevel<T>(items: T[], seed: string): T[] {
  let value = 2166136261;
  for (const char of seed) value = Math.imul(value ^ char.charCodeAt(0), 16777619) >>> 0;
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    const j = value % (i + 1);
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export function searchBoard(level: Extract<ChallengeLevel, { kind: "search" }>): (Token & { cellId: string })[] {
  const cells = Array.from({ length: 12 }, (_, i) => {
    const token = i < level.needed ? level.target : level.distractors[(i - level.needed) % level.distractors.length]!;
    return { ...token, cellId: `cell-${i}` };
  });
  return orderedForLevel(cells, level.id);
}

export function challengeGoal(level: ChallengeLevel): number {
  switch (level.kind) {
    case "search": return level.needed;
    case "sequence": return level.order.length;
    case "count": case "pattern": return level.rounds.length;
    case "sort": return level.items.length;
    case "pairs": return level.pairs.length;
    case "build": return level.slots.length;
    case "route": return 1;
  }
}

export function initialChallenge(level: ChallengeLevel): ChallengeState {
  return { progress: 0, mistakes: 0, found: [], selected: null, position: level.kind === "route" ? level.start : 0, done: false };
}

export function routeDestination(level: Extract<ChallengeLevel, { kind: "route" }>, position: number, direction: "up" | "down" | "left" | "right"): number | null {
  const row = Math.floor(position / level.size), col = position % level.size;
  const nextRow = row + (direction === "down" ? 1 : direction === "up" ? -1 : 0);
  const nextCol = col + (direction === "right" ? 1 : direction === "left" ? -1 : 0);
  if (nextRow < 0 || nextRow >= level.size || nextCol < 0 || nextCol >= level.size) return null;
  const next = nextRow * level.size + nextCol;
  return level.walls.includes(next) ? null : next;
}

export function reduceChallenge(level: ChallengeLevel, state: ChallengeState, action: ChallengeAction): ChallengeState {
  if (state.done) return state;
  const wrong = () => ({ ...state, mistakes: state.mistakes + 1 });
  const advance = (id?: string) => {
    const progress = state.progress + 1;
    return { ...state, progress, found: id ? [...state.found, id] : state.found, selected: null, done: progress >= challengeGoal(level) };
  };
  if (level.kind === "route") {
    if (action.type !== "move") return state;
    const position = routeDestination(level, state.position, action.direction);
    if (position === null) return wrong();
    return { ...state, position, progress: position === level.goal ? 1 : 0, done: position === level.goal };
  }
  if (action.type === "move") return state;
  if (level.kind === "search") {
    if (action.type !== "tap" || state.found.includes(action.id)) return state;
    const cell = searchBoard(level).find((item) => item.cellId === action.id);
    if (!cell) return state;
    return cell.id === level.target.id ? advance(cell.cellId) : wrong();
  }
  if (level.kind === "sequence") {
    if (action.type !== "tap" || !level.palette.some((token) => token.id === action.id)) return state;
    return level.order[state.progress] === action.id ? advance() : wrong();
  }
  if (level.kind === "count") {
    const round = level.rounds[state.progress];
    if (action.type !== "tap" || !round || !round.options.includes(Number(action.id))) return state;
    return Number(action.id) === round.count ? advance() : wrong();
  }
  if (level.kind === "pattern") {
    const round = level.rounds[state.progress];
    if (action.type !== "tap" || !round || !round.options.some((token) => token.id === action.id)) return state;
    return action.id === round.answer ? advance() : wrong();
  }
  if (level.kind === "sort") {
    if (action.type === "tap") {
      if (state.found.includes(action.id) || !level.items.some((item) => item.id === action.id)) return state;
      return { ...state, selected: action.id };
    }
    if (!state.selected || !level.bins.some((bin) => bin.id === action.id)) return state;
    const item = level.items.find((token) => token.id === state.selected);
    return item?.bin === action.id ? advance(item.id) : wrong();
  }
  if (level.kind === "pairs") {
    if (action.type === "tap") {
      if (state.found.includes(action.id) || !level.pairs.some((pair) => pair.id === action.id)) return state;
      return { ...state, selected: action.id };
    }
    if (!state.selected || state.found.includes(action.id) || !level.pairs.some((pair) => pair.id === action.id)) return state;
    return state.selected === action.id ? advance(action.id) : wrong();
  }
  if (level.kind === "build") {
    if (action.type !== "tap" || state.found.includes(action.id) || !level.slots.some((token) => token.id === action.id)) return state;
    return level.slots[state.progress]?.id === action.id ? advance(action.id) : wrong();
  }
  return state;
}
