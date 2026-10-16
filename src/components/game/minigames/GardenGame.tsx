import { useEffect, useRef, useState } from "react";
import { Hint, useFeedback } from "../common";
import { audio } from "@/game/audio";
import type { MiniGameProps } from "./types";

const FLOWERS = ["🌷", "🌻", "🌼", "🌺", "🪻", "🌸"];

export function GardenGame({ onDone }: MiniGameProps) {
  const [water, setWater] = useState(() => FLOWERS.map(() => 0));
  const { node, show } = useFeedback();
  const previous = useRef(0);
  const bloomed = water.filter((value) => value >= 3).length;
  const done = bloomed === FLOWERS.length;
  useEffect(() => {
    if (bloomed > previous.current) show("good");
    previous.current = bloomed;
  }, [bloomed, show]);
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => onDone(0), 1600);
    return () => clearTimeout(id);
  }, [done, onDone]);
  const pour = (index: number) => {
    audio.sfx("splash");
    setWater((values) => values.map((value, i) => i === index ? Math.min(3, value + 1) : value));
  };
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {node}
      <Hint icon="🚿" text={done ? "O jardim floresceu! As borboletas agradecem!" : "Toque três vezes em cada plantinha para regar!"} />
      <div className="card-game flex min-h-0 flex-1 flex-col bg-sky-grad p-3">
        <div role="status" className="shrink-0 text-center font-display text-xl font-bold">🦋 Flores felizes: {bloomed}/{FLOWERS.length}</div>
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-2 py-3">
          {FLOWERS.map((flower, i) => (
            <button key={flower} aria-label={`Regar flor ${i + 1}`} disabled={water[i]! >= 3} onClick={() => pour(i)} className="flex min-h-24 min-w-0 flex-col items-center justify-center gap-2 rounded-3xl border-4 border-white bg-card/70">
              <span className={`text-5xl ${water[i]! >= 3 ? "animate-bob" : ""}`}>{water[i]! >= 3 ? flower : water[i]! > 0 ? "🌱" : "🪴"}</span>
              <span className="text-lg" aria-label={`${water[i]} de 3 gotas`}>{[0, 1, 2].map((drop) => <span key={drop} className={drop < water[i]! ? "" : "opacity-20"}>💧</span>)}</span>
            </button>
          ))}
        </div>
        {done && <div className="shrink-0 text-center text-3xl" aria-hidden="true">🦋 🌈 🦋</div>}
      </div>
    </div>
  );
}
