import { useEffect, useRef, useState } from "react";
import { Hint, useFeedback } from "../common";
import { Puppy } from "../art";
import { audio } from "@/game/audio";
import type { MiniGameProps } from "./types";

const SPOTS = [{ x: 30, y: 42 }, { x: 62, y: 42 }, { x: 46, y: 22 }, { x: 30, y: 66 }, { x: 70, y: 66 }];

export function FireGame({ hero, onDone }: MiniGameProps) {
  const fb = useFeedback();
  const box = useRef<HTMLDivElement>(null);
  const [flames, setFlames] = useState(() => SPOTS.sort(() => Math.random() - 0.5).slice(0, 4).map((s) => ({ ...s, hp: 100 })));
  const [aim, setAim] = useState<{ x: number; y: number } | null>(null);
  const done = flames.every((f) => f.hp <= 0);

  useEffect(() => {
    if (!aim || done) return;
    const id = setInterval(() => {
      audio.sfx("splash");
      setFlames((fs) => {
        const next = fs.map((f) => (f.hp > 0 && Math.hypot(f.x - aim.x, (f.y - aim.y) * 0.8) < 11 ? { ...f, hp: f.hp - 7 } : f));
        next.forEach((f, i) => { if (fs[i].hp > 0 && f.hp <= 0) fb.show("good"); });
        return next;
      });
    }, 60);
    return () => clearInterval(id);
  }, [aim, done]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (done) { setAim(null); const id = setTimeout(() => onDone(0), 1800); return () => clearTimeout(id); } }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const point = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    setAim({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="flex h-full flex-col gap-3">
      {fb.node}
      <Hint icon="💧" text={done ? "Fogo apagado! Que bombeira!" : "Segure o dedo nos foguinhos para jogar água!"} />
      <div ref={box} className="card-game relative flex-1 touch-none overflow-hidden bg-sky-grad"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); point(e); }}
        onPointerMove={(e) => aim && point(e)} onPointerUp={() => setAim(null)} onPointerCancel={() => setAim(null)}>
        {/* padaria */}
        <div className="absolute left-[18%] top-[14%] h-[72%] w-[64%] rounded-t-[3rem] rounded-b-xl" style={{ background: "oklch(0.93 0.05 60)" }}>
          <div className="absolute -top-2 left-0 right-0 h-10 rounded-t-[3rem]" style={{ background: "repeating-linear-gradient(90deg, var(--rose) 0 28px, #fff 28px 56px)" }} />
          <div className="absolute bottom-0 left-1/2 h-[30%] w-[22%] -translate-x-1/2 rounded-t-2xl" style={{ background: "var(--lilac)" }} />
          <div className="absolute left-1/2 top-[14%] -translate-x-1/2 text-4xl">🧁</div>
        </div>
        {flames.map((f, i) => (
          <div key={i} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-transform" style={{ left: `${f.x}%`, top: `${f.y}%`, transform: `translate(-50%,-50%) scale(${Math.max(f.hp, 0) / 100})` }}>
            <div className="animate-flicker text-6xl">🔥</div>
          </div>
        ))}
        {flames.map((f, i) => f.hp <= 0 && <div key={`s${i}`} className="pointer-events-none absolute animate-rise text-4xl" style={{ left: `${f.x}%`, top: `${f.y}%` }}>✨</div>)}
        {aim && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d={`M 8 92 Q ${(8 + aim.x) / 2} ${Math.min(aim.y, 92) - 25} ${aim.x} ${aim.y}`} stroke="var(--water)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeDasharray="6 4" className="animate-dash" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 14 }} />
          </svg>
        )}
        {aim && <div className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-5xl" style={{ left: `${aim.x}%`, top: `${aim.y}%` }}>💦</div>}
        <div className="pointer-events-none absolute -bottom-2 left-0"><Puppy hero={hero} size={100} mood={done ? "wow" : "happy"} /></div>
      </div>
    </div>
  );
}
