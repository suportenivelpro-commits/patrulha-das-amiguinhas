import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Hint, shuffle, useFeedback } from "../common";
import { Puppy } from "../art";
import { audio } from "@/game/audio";
import type { MiniGameProps } from "./types";

const SPOTS = [{ x: 30, y: 42 }, { x: 62, y: 42 }, { x: 46, y: 22 }, { x: 30, y: 66 }, { x: 70, y: 66 }];
type Point = { x: number; y: number };

export function FireGame({ hero, onDone }: MiniGameProps) {
  const { node, show } = useFeedback();
  const box = useRef<HTMLDivElement>(null);
  const aimRef = useRef<Point | null>(null);
  const activePointer = useRef<number | null>(null);
  const lastExtinguished = useRef(0);
  const [flames, setFlames] = useState(() => shuffle(SPOTS).slice(0, 4).map((s) => ({ ...s, hp: 100 })));
  const [aim, setAim] = useState<Point | null>(null);
  const [spraying, setSpraying] = useState(false);
  const extinguished = flames.filter((f) => f.hp <= 0).length;
  const done = extinguished === flames.length;

  useEffect(() => {
    if (!spraying) return;
    // Movement updates a ref, so dragging never restarts the watering timer.
    const id = setInterval(() => {
      const point = aimRef.current;
      const bounds = box.current?.getBoundingClientRect();
      if (!point || !bounds || bounds.width <= 0 || bounds.height <= 0) return;
      const radius = Math.max(44, Math.min(bounds.width, bounds.height) * 0.11);
      audio.sfx("splash");
      setFlames((fs) => fs.map((f) => {
        const distance = Math.hypot((f.x - point.x) * bounds.width / 100, (f.y - point.y) * bounds.height / 100);
        return f.hp > 0 && distance <= radius ? { ...f, hp: Math.max(0, f.hp - 10) } : f;
      }));
    }, 60);
    return () => clearInterval(id);
  }, [spraying]);

  useEffect(() => {
    if (extinguished > lastExtinguished.current) show("good");
    lastExtinguished.current = extinguished;
  }, [extinguished, show]);

  useEffect(() => {
    if (!done) return;
    aimRef.current = null;
    activePointer.current = null;
    setSpraying(false);
    setAim(null);
    const id = setTimeout(() => onDone(0), 1800);
    return () => clearTimeout(id);
  }, [done, onDone]);

  const point = (e: PointerEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    const next = {
      x: Math.max(0, Math.min(100, (e.clientX - bounds.left) / bounds.width * 100)),
      y: Math.max(0, Math.min(100, (e.clientY - bounds.top) / bounds.height * 100)),
    };
    aimRef.current = next;
    setAim(next);
  };
  const stop = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== activePointer.current) return;
    activePointer.current = null;
    aimRef.current = null;
    setSpraying(false);
    setAim(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {node}
      <Hint icon="💧" text={done ? "Fogo apagado! Que bombeira!" : "Segure ou arraste o dedo sobre o fogo para jogar água!"} />
      <div ref={box} aria-label="Área para apagar o fogo" className="card-game relative min-h-0 flex-1 touch-none overflow-hidden bg-sky-grad"
        onPointerDown={(e) => {
          if (done || e.isPrimary === false || e.button !== 0 || activePointer.current !== null) return;
          activePointer.current = e.pointerId;
          point(e);
          e.currentTarget.setPointerCapture?.(e.pointerId);
          setSpraying(true);
        }}
        onPointerMove={(e) => { if (e.pointerId === activePointer.current) point(e); }}
        onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop}>
        <div className="absolute left-[18%] top-[14%] h-[72%] w-[64%] rounded-t-[3rem] rounded-b-xl" style={{ background: "oklch(0.93 0.05 60)" }}>
          <div className="absolute -top-2 left-0 right-0 h-10 rounded-t-[3rem]" style={{ background: "repeating-linear-gradient(90deg, var(--rose) 0 28px, #fff 28px 56px)" }} />
          <div className="absolute bottom-0 left-1/2 h-[30%] w-[22%] -translate-x-1/2 rounded-t-2xl" style={{ background: "var(--lilac)" }} />
          <div className="absolute left-1/2 top-[14%] -translate-x-1/2 text-4xl">🧁</div>
        </div>
        {flames.map((f, i) => f.hp > 0 && (
          <div key={i} role="img" aria-label={`Foco de fogo ${i + 1}`} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
            <div className="transition-transform" style={{ transform: `scale(${0.45 + f.hp / 100 * 0.55})` }}>
              <div className="animate-flicker text-7xl">🔥</div>
            </div>
          </div>
        ))}
        {flames.map((f, i) => f.hp <= 0 && <div key={`s${i}`} className="pointer-events-none absolute animate-rise text-4xl" style={{ left: `${f.x}%`, top: `${f.y}%` }}>✨</div>)}
        {aim && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d={`M 8 92 Q ${(8 + aim.x) / 2} ${Math.min(aim.y, 92) - 25} ${aim.x} ${aim.y}`} stroke="var(--water)" fill="none" strokeLinecap="round" strokeDasharray="6 4" className="animate-dash" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 18 }} />
          </svg>
        )}
        {aim && <div className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-5xl" style={{ left: `${aim.x}%`, top: `${aim.y}%` }}>💦</div>}
        <div className="pointer-events-none absolute -bottom-2 left-0"><Puppy hero={hero} size={112} mood={done ? "wow" : "happy"} /></div>
        <div role="status" className="pointer-events-none absolute right-2 top-2 rounded-full bg-card px-3 py-1 font-display text-lg font-bold">🔥 {extinguished}/{flames.length}</div>
      </div>
    </div>
  );
}
