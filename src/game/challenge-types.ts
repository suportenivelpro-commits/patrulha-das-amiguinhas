import type { HeroId } from "./data";

export interface Token { id: string; icon: string; label: string; silhouette?: boolean }
export type ChallengeSpec =
  | { kind: "search"; target: Token; distractors: Token[]; needed: number }
  | { kind: "sequence"; palette: Token[]; order: string[] }
  | { kind: "count"; rounds: { icon: string; label: string; count: number; options: number[] }[] }
  | { kind: "pattern"; rounds: { series: Token[]; options: Token[]; answer: string }[] }
  | { kind: "sort"; bins: Token[]; items: (Token & { bin: string })[] }
  | { kind: "pairs"; pairs: { id: string; left: Token; right: Token }[] }
  | { kind: "route"; size: number; start: number; goal: number; walls: number[]; player: Token; destination: Token; obstacle: Token }
  | { kind: "build"; slots: Token[] };

export type ChallengeLevel = ChallengeSpec & {
  id: string; chapterId: string; title: string; place: string; icon: string;
  caller: string; call: string; hero: HeroId; instruction: string;
};
export type ChallengeState = { progress: number; mistakes: number; found: string[]; selected: string | null; position: number; done: boolean };
export type ChallengeAction = { type: "tap" | "target"; id: string } | { type: "move"; direction: "up" | "down" | "left" | "right" };
