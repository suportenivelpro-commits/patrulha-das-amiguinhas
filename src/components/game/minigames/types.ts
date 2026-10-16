import type { Hero } from "@/game/data";
export interface MiniGameProps { hero: Hero; onDone: (mistakes: number) => void }
