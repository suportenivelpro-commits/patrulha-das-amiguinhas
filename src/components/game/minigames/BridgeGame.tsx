import { GameText } from "../GameText";
import { useRef, useState } from "react";
import { Drag, Hint, shuffle, useFeedback } from "../common";
import { Vehicle } from "../art";
import type { MiniGameProps } from "./types";

type Shape = "circulo" | "quadrado" | "triangulo" | "estrela" | "coracao";
const COLORS: Record<Shape, string> = { circulo: "var(--turquoise)", quadrado: "var(--sun)", triangulo: "var(--rose)", estrela: "var(--lilac)", coracao: "var(--coral)" };

function ShapeSvg({ s, slot }: { s: Shape; slot?: boolean }) {
  const p = { fill: slot ? "oklch(1 0 0 / 0.35)" : COLORS[s], stroke: slot ? "#fff" : "oklch(1 0 0 / 0.9)", strokeWidth: 5, strokeDasharray: slot ? "8 6" : undefined };
  return (
    <svg viewBox="0 0 60 60" className="h-full w-full">
      {s === "circulo" && <circle cx="30" cy="30" r="24" {...p} />}
      {s === "quadrado" && <rect x="7" y="7" width="46" height="46" rx="6" {...p} />}
      {s === "triangulo" && <path d="M30 6 L55 52 L5 52 Z" strokeLinejoin="round" {...p} />}
      {s === "estrela" && <path d="M30 4 L37 22 L56 22 L41 34 L47 54 L30 42 L13 54 L19 34 L4 22 L23 22 Z" strokeLinejoin="round" {...p} />}
      {s === "coracao" && <path d="M30 52 C4 34 6 10 22 10 C27 10 30 14 30 18 C30 14 33 10 38 10 C54 10 56 34 30 52Z" {...p} />}
    </svg>
  );
}

export function BridgeGame({ hero, onDone }: MiniGameProps) {
  const fb = useFeedback();
  const mistakes = useRef(0);
  const [slots] = useState<Shape[]>(() => shuffle<Shape>(["circulo", "quadrado", "triangulo", "estrela", "coracao"]).slice(0, 3));
  const [pieces] = useState(() => shuffle(slots));
  const [filled, setFilled] = useState<Shape[]>([]);
  const done = filled.length === slots.length;

  const drop = (s: Shape, target: string | null) => {
    if (!target) return;
    if (target === s) {
      fb.show("good");
      const f = [...filled, s];
      setFilled(f);
      if (f.length === slots.length) setTimeout(() => onDone(mistakes.current), 2600);
    } else { mistakes.current++; fb.show("oops"); }
  };

  return (
    <div className="flex h-full flex-col gap-3">
      {fb.node}
      <Hint icon="🧩" text={done ? "A ponte está pronta!" : "Encaixe cada peça no buraco igual!"} />
      <div className="card-game relative flex-1 overflow-hidden bg-sky-grad">
        <div className="absolute bottom-0 h-[45%] w-full" style={{ background: "var(--water)" }}>
          <div className="absolute inset-x-0 top-4 text-center text-3xl tracking-[2rem] opacity-60"><GameText text="〰️〰️〰️" /></div>
          <div className="absolute bottom-4 right-8 animate-bob text-4xl"><GameText text="🦆" /></div>
        </div>
        <div className="absolute bottom-[25%] left-0 h-[30%] w-[14%] rounded-tr-3xl" style={{ background: "var(--grass)" }} />
        <div className="absolute bottom-[25%] right-0 h-[30%] w-[14%] rounded-tl-3xl" style={{ background: "var(--grass)" }} />
        <div className="absolute bottom-[50%] left-[14%] right-[14%] flex h-24 items-stretch justify-around gap-1 sm:h-28">
          {slots.map((s) => (
            <div key={s} data-drop={s} className="flex flex-1 items-center justify-center rounded-xl p-2" style={{ background: filled.includes(s) ? "#c9915f" : "oklch(0.6 0.05 60 / 0.35)", border: "4px solid #a8744a" }}>
              <div className="h-16 w-16 sm:h-20 sm:w-20">{filled.includes(s) ? <div className="animate-pop h-full w-full"><ShapeSvg s={s} /></div> : <ShapeSvg s={s} slot />}</div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-[calc(50%+6rem)] transition-all ease-in-out sm:bottom-[calc(50%+7rem)]" style={{ left: done ? "80%" : "0%", transitionDuration: "2.2s" }}>
          <Vehicle hero={hero} size={110} />
        </div>
      </div>
      {!done && (
        <div className="card-game flex justify-center gap-6 p-3">
          {pieces.filter((p) => !filled.includes(p)).map((p) => (
            <Drag key={p} onDrop={(t) => drop(p, t)}>
              <div className="h-20 w-20 sm:h-24 sm:w-24"><ShapeSvg s={p} /></div>
            </Drag>
          ))}
        </div>
      )}
    </div>
  );
}
