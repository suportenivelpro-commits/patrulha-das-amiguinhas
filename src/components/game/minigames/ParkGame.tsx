import { useRef, useState } from "react";
import { Drag, Hint, shuffle, useFeedback } from "../common";
import type { MiniGameProps } from "./types";

const ITEMS = [
  { e: "🥤", bin: "lixo" }, { e: "📰", bin: "lixo" }, { e: "🍌", bin: "lixo" }, { e: "🧃", bin: "lixo" },
  { e: "⚽", bin: "brinquedos" }, { e: "🧸", bin: "brinquedos" }, { e: "🪁", bin: "brinquedos" }, { e: "🪀", bin: "brinquedos" },
];
const SPOTS = [{ x: 10, y: 20 }, { x: 34, y: 12 }, { x: 60, y: 22 }, { x: 82, y: 12 }, { x: 18, y: 52 }, { x: 46, y: 46 }, { x: 74, y: 52 }];

export function ParkGame({ onDone }: MiniGameProps) {
  const fb = useFeedback();
  const mistakes = useRef(0);
  const [items, setItems] = useState(() => {
    const trash = shuffle(ITEMS.filter((i) => i.bin === "lixo")).slice(0, 3);
    const toys = shuffle(ITEMS.filter((i) => i.bin === "brinquedos")).slice(0, 3);
    const spots = shuffle(SPOTS);
    return shuffle([...trash, ...toys]).map((it, i) => ({ ...it, id: i, ...spots[i], hidden: i < 2, gone: false }));
  });
  const left = items.filter((i) => !i.gone).length;

  const drop = (id: number, target: string | null) => {
    if (!target) return;
    const it = items.find((i) => i.id === id)!;
    if (it.bin === target) {
      fb.show("good");
      const next = items.map((i) => (i.id === id ? { ...i, gone: true } : i));
      setItems(next);
      if (next.every((i) => i.gone)) setTimeout(() => onDone(mistakes.current), 1800);
    } else { mistakes.current++; fb.show("oops"); }
  };
  const reveal = (id: number) => setItems((its) => its.map((i) => (i.id === id ? { ...i, hidden: false } : i)));

  return (
    <div className="flex h-full flex-col gap-3">
      {fb.node}
      <Hint icon={left ? "🧹" : "🌈"} text={left ? "Lixo na lixeira, brinquedo na caixa! Olhe atrás dos arbustos!" : "O parque está lindo!"} />
      <div className="card-game relative flex-1 overflow-hidden" style={{ background: "linear-gradient(180deg, var(--sky) 0 25%, var(--grass) 25%)" }}>
        <div className="absolute right-6 top-2 text-5xl">🎠</div>
        <div className="absolute left-4 top-1 text-4xl">🌈</div>
        {items.map((it) => !it.gone && (
          <div key={it.id} className="absolute" style={{ left: `${it.x}%`, top: `${it.y + 18}%` }}>
            {it.hidden ? (
              <button onClick={() => reveal(it.id)} className="animate-wiggle text-6xl" style={{ animationIterationCount: "infinite", animationDuration: "2.5s" }} aria-label="Arbusto">🌳</button>
            ) : (
              <Drag onDrop={(t) => drop(it.id, t)}><div className="animate-pop text-5xl sm:text-6xl">{it.e}</div></Drag>
            )}
          </div>
        ))}
        {!left && <div className="absolute inset-0 flex items-center justify-center text-8xl animate-pop">🌸✨🌼</div>}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between">
          <div data-drop="lixo" className="flex h-28 w-28 flex-col items-center justify-center rounded-3xl border-4 border-dashed bg-card/80 sm:h-32 sm:w-32" style={{ borderColor: "var(--turquoise)" }}>
            <span className="text-6xl">🗑️</span><span className="font-display font-bold">Lixo</span>
          </div>
          <div data-drop="brinquedos" className="flex h-28 w-28 flex-col items-center justify-center rounded-3xl border-4 border-dashed bg-card/80 sm:h-32 sm:w-32" style={{ borderColor: "var(--rose)" }}>
            <span className="text-6xl">🧺</span><span className="font-display font-bold">Brinquedos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
