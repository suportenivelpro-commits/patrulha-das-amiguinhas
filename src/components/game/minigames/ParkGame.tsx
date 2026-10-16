import { useEffect, useRef, useState } from "react";
import { Drag, Hint, shuffle, useFeedback } from "../common";
import type { MiniGameProps } from "./types";

const ITEMS = [
  { e: "🥤", label: "Copo usado", bin: "lixo" }, { e: "📰", label: "Papel usado", bin: "lixo" },
  { e: "🍌", label: "Casca de banana", bin: "lixo" }, { e: "🧃", label: "Caixinha vazia", bin: "lixo" },
  { e: "⚽", label: "Bola", bin: "brinquedos" }, { e: "🧸", label: "Ursinho", bin: "brinquedos" },
  { e: "🪁", label: "Pipa", bin: "brinquedos" }, { e: "🪀", label: "Ioiô", bin: "brinquedos" },
];

export function ParkGame({ onDone }: MiniGameProps) {
  const { node, show } = useFeedback();
  const mistakes = useRef(0);
  const removed = useRef(new Set<number>());
  const [selected, setSelected] = useState<number | null>(null);
  const [items, setItems] = useState(() => {
    const trash = shuffle(ITEMS.filter((i) => i.bin === "lixo")).slice(0, 3);
    const toys = shuffle(ITEMS.filter((i) => i.bin === "brinquedos")).slice(0, 3);
    return shuffle([...trash, ...toys]).map((it, id) => ({ ...it, id, hidden: id < 2, gone: false }));
  });
  const left = items.filter((i) => !i.gone).length;

  useEffect(() => {
    if (left !== 0) return;
    const id = setTimeout(() => onDone(mistakes.current), 1800);
    return () => clearTimeout(id);
  }, [left, onDone]);

  const drop = (id: number, target: string | null) => {
    const item = items.find((i) => i.id === id);
    if (!target || !item || item.hidden || removed.current.has(id)) return;
    if (item.bin !== target) { mistakes.current++; show("oops"); return; }
    removed.current.add(id);
    setItems((previous) => previous.map((i) => i.id === id ? { ...i, gone: true } : i));
    setSelected(null);
    show("good");
  };
  const reveal = (id: number) => setItems((previous) => previous.map((i) => i.id === id ? { ...i, hidden: false } : i));

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {node}
      <Hint icon={left ? "🧹" : "🌈"} text={!left ? "O parque está lindo!" : selected !== null ? "Agora toque no cesto certo!" : "Arraste até o cesto ou toque no item e no cesto!"} />
      <div className="card-game flex min-h-0 flex-1 flex-col" style={{ background: "linear-gradient(180deg, var(--sky), var(--grass))" }}>
        <div className="flex shrink-0 items-center justify-between px-3 pt-2 font-display text-lg font-bold">
          <span aria-hidden="true">🌈 🎠</span><span role="status">Faltam {left} itens</span>
        </div>
        {/* Items and bins occupy separate rows: nothing can spawn behind a bin. */}
        <div className="grid min-h-36 flex-1 grid-cols-3 gap-2 p-3" aria-label="Itens do parque">
          {items.map((item) => (
            <div key={item.id} className="flex min-w-0 items-center justify-center">
              {item.gone ? <span className="text-3xl" aria-hidden="true">✨</span> : item.hidden ? (
                <button onClick={() => reveal(item.id)} className="flex min-h-16 w-full items-center justify-center rounded-2xl bg-card/60 text-5xl" aria-label={`Revelar item ${item.id + 1} no arbusto`}>🌳</button>
              ) : (
                <Drag label={item.label} onDrop={(target) => drop(item.id, target)} onTap={() => setSelected(item.id)} className="w-full">
                  <div className={`flex min-h-16 items-center justify-center rounded-2xl bg-card/70 text-5xl sm:text-6xl ${selected === item.id ? "ring-4 ring-sun" : ""}`}>{item.e}</div>
                </Drag>
              )}
            </div>
          ))}
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-3 p-3" aria-label="Cestos do parque">
          <button data-drop="lixo" onClick={() => { if (selected !== null) drop(selected, "lixo"); }} aria-label="Lixeira" className="flex min-h-24 min-w-0 flex-col items-center justify-center rounded-3xl border-4 border-dashed bg-card/90" style={{ borderColor: "var(--turquoise)" }}>
            <span className="text-5xl">🗑️</span><span className="font-display text-lg font-bold">Lixo</span>
          </button>
          <button data-drop="brinquedos" onClick={() => { if (selected !== null) drop(selected, "brinquedos"); }} aria-label="Cesta de brinquedos" className="flex min-h-24 min-w-0 flex-col items-center justify-center rounded-3xl border-4 border-dashed bg-card/90" style={{ borderColor: "var(--rose)" }}>
            <span className="text-5xl">🧺</span><span className="font-display text-lg font-bold">Brinquedos</span>
          </button>
        </div>
      </div>
    </div>
  );
}
