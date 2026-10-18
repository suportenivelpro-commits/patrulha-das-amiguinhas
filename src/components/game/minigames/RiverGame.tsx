import { GameText } from "../GameText";
import { useEffect, useRef, useState } from "react";
import { Hint, useFeedback } from "../common";
import { audio } from "@/game/audio";
import type { MiniGameProps } from "./types";

const DUCKS = [0, 1, 2, 3, 4, 5];

export function RiverGame({ onDone }: MiniGameProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [rescued, setRescued] = useState<number[]>([]);
  const rescuedRef = useRef(new Set<number>());
  const { node, show } = useFeedback();
  const done = rescued.length === DUCKS.length;
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => onDone(0), 1600);
    return () => clearTimeout(id);
  }, [done, onDone]);
  const rescue = () => {
    if (selected === null || rescuedRef.current.has(selected)) return;
    rescuedRef.current.add(selected);
    setRescued((previous) => [...previous, selected]);
    setSelected(null);
    show("good");
  };
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {node}
      <Hint icon="🛟" text={done ? "Todos os patinhos estão com a mamãe!" : selected === null ? "Toque em um patinho para chamar o resgate!" : "Agora toque no avião para resgatar!"} />
      <div className="card-game flex min-h-0 flex-1 flex-col gap-3 p-3" style={{ background: "linear-gradient(var(--sky), var(--water))" }}>
        <div role="status" className="shrink-0 text-center font-display text-xl font-bold"><GameText text="🦆 Patinhos salvos: " />{rescued.length}/{DUCKS.length}</div>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
          {DUCKS.map((duck) => (
            <button key={duck} aria-label={`Patinho ${duck + 1}`} aria-pressed={selected === duck} disabled={rescued.includes(duck)} onClick={() => { setSelected(duck); audio.sfx("tap"); }} className={`flex min-h-20 min-w-0 flex-col items-center justify-center rounded-3xl border-4 border-white/70 bg-card/30 text-5xl ${selected === duck ? "ring-4 ring-sun" : ""}`}>
              <span className={rescued.includes(duck) ? "text-3xl" : "animate-bob"} style={{ animationDelay: `${duck * 0.15}s` }}><GameText text={rescued.includes(duck) ? "✨" : "🦆"} /></span>
            </button>
          ))}
        </div>
        <button onClick={rescue} disabled={selected === null} className="btn-game shrink-0 px-3 py-3 text-2xl disabled:opacity-60" style={{ ["--btn" as string]: "var(--turquoise)" }} aria-label="Resgatar patinho"><GameText text="✈️ Resgatar" /></button>
      </div>
    </div>
  );
}
