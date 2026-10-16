import { useRef, useState } from "react";
import { Drag, Hint, shuffle, useFeedback } from "../common";
import type { MiniGameProps } from "./types";

const NEEDS = [
  { id: "fome", bubble: "😋", item: "🥕", say: "Ele está com fome!" },
  { id: "sede", bubble: "💧", item: "🥛", say: "Ele está com sede!" },
  { id: "dodoi", bubble: "🤕", item: "🩹", say: "Ele tem um dodói!" },
  { id: "frio", bubble: "🥶", item: "🧣", say: "Ele está com frio!" },
  { id: "sujo", bubble: "🫧", item: "🧽", say: "Ele precisa de um banho!" },
  { id: "sono", bubble: "😴", item: "🧸", say: "Ele está com sono!" },
];
const ANIMALS = ["🐰", "🐶", "🐱", "🐥"];

export function VetGame({ onDone }: MiniGameProps) {
  const fb = useFeedback();
  const mistakes = useRef(0);
  const [animal] = useState(() => ANIMALS[Math.floor(Math.random() * ANIMALS.length)]);
  const [needs] = useState(() => shuffle(NEEDS).slice(0, 3));
  const [idx, setIdx] = useState(0);
  const [hearts, setHearts] = useState(0);
  const need = needs[idx];
  const [tray, setTray] = useState(() => shuffle([needs[0], ...shuffle(NEEDS.filter((n) => n.id !== needs[0].id)).slice(0, 3)]));
  const finished = idx >= needs.length;

  const give = (itemNeed: string, target: string | null) => {
    if (target !== "bichinho" || finished) return;
    if (itemNeed === need.id) {
      fb.show("good");
      setHearts((h) => h + 1);
      const n = idx + 1;
      setIdx(n);
      if (n < needs.length) setTray(shuffle([needs[n], ...shuffle(NEEDS.filter((x) => x.id !== needs[n].id)).slice(0, 3)]));
      else setTimeout(() => onDone(mistakes.current), 1800);
    } else { mistakes.current++; fb.show("oops"); }
  };

  return (
    <div className="flex h-full flex-col gap-3">
      {fb.node}
      <Hint icon={finished ? "💗" : need.bubble} text={finished ? "Ele está feliz e saudável!" : `${need.say} Arraste o item certo.`} />
      <div className="card-game relative flex flex-1 items-center justify-center overflow-hidden" style={{ background: "linear-gradient(180deg, var(--sky), var(--mint))" }}>
        <div className="absolute bottom-0 h-1/3 w-full" style={{ background: "var(--grass)" }} />
        <div data-drop="bichinho" className="relative flex h-56 w-56 items-center justify-center rounded-full sm:h-72 sm:w-72" style={{ background: "oklch(1 0 0 / 0.5)" }}>
          <span className={`text-[8rem] sm:text-[10rem] ${finished ? "animate-bob" : ""}`} style={{ filter: finished ? "none" : "saturate(0.7)" }}>{animal}</span>
          {!finished && (
            <div key={idx} className="animate-pop absolute -right-2 -top-2 flex h-20 w-20 items-center justify-center rounded-full bg-card text-5xl shadow-lg">{need.bubble}</div>
          )}
        </div>
        <div className="absolute left-4 top-4 flex gap-1 text-3xl">
          {needs.map((_, i) => <span key={i} className={i < hearts ? "animate-pop" : "opacity-25 grayscale"}>💗</span>)}
        </div>
      </div>
      {!finished && (
        <div className="card-game flex justify-center gap-3 p-3 sm:gap-6">
          {tray.map((t) => (
            <Drag key={`${idx}-${t.id}`} onDrop={(tg) => give(t.id, tg)} onTap={() => give(t.id, "bichinho")}>
              <div className="flex h-18 w-18 items-center justify-center rounded-3xl bg-muted text-5xl sm:h-24 sm:w-24" style={{ width: 76, height: 76 }}>{t.item}</div>
            </Drag>
          ))}
        </div>
      )}
    </div>
  );
}
