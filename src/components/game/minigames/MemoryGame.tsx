import { GameText } from "../GameText";
import { useEffect, useRef, useState } from "react";
import { Hint, shuffle, useFeedback } from "../common";
import { audio } from "@/game/audio";
import type { MiniGameProps } from "./types";

const ANIMALS = ["🐱", "🐰", "🦊", "🐶"];

export function MemoryGame({ onDone }: MiniGameProps) {
  const [cards] = useState(() => shuffle(ANIMALS.flatMap((animal) => [animal, animal])).map((animal, id) => ({ id, animal })));
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const openRef = useRef<number[]>([]);
  const matchedRef = useRef(new Set<number>());
  const resolving = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mistakes = useRef(0);
  const { node, show } = useFeedback();
  const done = matched.length === cards.length;
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => onDone(mistakes.current), 1600);
    return () => clearTimeout(id);
  }, [done, onDone]);
  const flip = (id: number) => {
    if (resolving.current || matchedRef.current.has(id) || openRef.current.includes(id)) return;
    audio.sfx("tap");
    const next = [...openRef.current, id];
    openRef.current = next;
    setOpen(next);
    if (next.length < 2) return;
    if (cards[next[0]!]!.animal === cards[id]!.animal) {
      next.forEach((card) => matchedRef.current.add(card));
      setMatched((previous) => [...previous, ...next]);
      openRef.current = [];
      setOpen([]);
      show("good");
    } else {
      mistakes.current++;
      resolving.current = true;
      timer.current = setTimeout(() => {
        openRef.current = [];
        setOpen([]);
        resolving.current = false;
        timer.current = null;
      }, 900);
    }
  };
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {node}
      <Hint icon="🐾" text={done ? "Todos os amigos encontraram seus pares!" : "Vire duas cartas e encontre os bichinhos iguais!"} />
      <div className="card-game flex min-h-0 flex-1 flex-col gap-3 bg-sky-grad p-3">
        <div role="status" className="shrink-0 text-center font-display text-xl font-bold"><GameText text="🐾 Pares encontrados: " />{matched.length / 2}/{ANIMALS.length}</div>
        <div className="grid min-h-0 flex-1 grid-cols-4 gap-2">
          {cards.map((card) => {
            const visible = open.includes(card.id) || matched.includes(card.id);
            return <button key={card.id} onClick={() => flip(card.id)} disabled={matched.includes(card.id) || (open.length === 2 && !visible)} aria-label={`Carta ${card.id + 1}${visible ? `: ${card.animal}` : ""}`} aria-pressed={visible} className={`flex min-h-20 min-w-0 items-center justify-center rounded-2xl border-4 border-white text-4xl transition-colors ${matched.includes(card.id) ? "bg-mint" : visible ? "bg-card" : "bg-lilac"}`} style={{ background: matched.includes(card.id) ? "var(--mint)" : undefined }}><GameText text={visible ? card.animal : "🐾"} /></button>;
          })}
        </div>
      </div>
    </div>
  );
}
