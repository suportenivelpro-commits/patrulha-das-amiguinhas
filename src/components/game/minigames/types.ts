import type { Hero, Mission } from "@/game/data";
export interface MiniGameProps { hero: Hero; onDone: (mistakes: number) => void; mission?: Mission }
