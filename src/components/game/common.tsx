import { GameText } from "./GameText";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { audio } from "@/game/audio";
import { cn } from "@/lib/utils";

const GOOD = ["Muito bem!", "Você conseguiu!", "Isso aí!", "Incrível!", "Que heroína!"];
const OOPS = ["Vamos tentar de novo!", "Quase! Tenta outra vez!", "Hmm, tenta outro!"];

export function useFeedback() {
  const [fb, setFb] = useState<{ t: string; k: "good" | "oops"; n: number } | null>(null);
  useEffect(() => {
    if (!fb) return;
    const id = setTimeout(() => setFb(null), 1300);
    return () => clearTimeout(id);
  }, [fb]);
  const show = useCallback((k: "good" | "oops") => {
    const list = k === "good" ? GOOD : OOPS;
    const t = list[Math.floor(Math.random() * list.length)];
    audio.sfx(k);
    audio.speak(t);
    setFb({ t, k, n: Date.now() });
  }, []);
  const node = fb ? (
    <div key={fb.n} className="pointer-events-none fixed left-1/2 top-24 z-[60] w-max max-w-[calc(100vw-1rem)] -translate-x-1/2">
      <div className="animate-pop card-game px-6 py-3 font-display text-2xl font-extrabold sm:text-3xl" style={{ color: fb.k === "good" ? "var(--plum)" : "var(--muted-foreground)" }}>
        <GameText text={fb.k === "good" ? "🎉 " : "🤗 "} />{fb.t}
      </div>
    </div>
  ) : null;
  return { node, show };
}

export function Hint({ icon, text }: { icon: string; text: string }) {
  useEffect(() => { const id = setTimeout(() => audio.speak(text), 300); return () => clearTimeout(id); }, [text]);
  return (
    <button onClick={() => audio.speak(text)} className="game-hint card-game animate-pop mx-auto flex max-w-full shrink-0 items-center gap-3 px-4 py-3 text-left" aria-label="Ouvir instrução">
      <span className="text-3xl"><GameText text={icon} /></span>
      <span className="font-display text-xl font-bold leading-tight sm:text-2xl">{text}</span>
      <span className="text-xl"><GameText text="🔊" /></span>
    </button>
  );
}

/** Item arrastável por toque/mouse. Solta sobre elementos com data-drop. */
export function Drag({ onDrop, onTap, children, className, disabled, label }: { onDrop: (target: string | null) => void; onTap?: () => void; children: ReactNode; className?: string; disabled?: boolean; label?: string }) {
  const [off, setOff] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const st = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const end = (e: React.PointerEvent, cancel = false) => {
    const s = st.current;
    st.current = null;
    setDragging(false);
    setOff({ x: 0, y: 0 });
    if (!s || cancel || disabled) return;
    if (!s.moved) { onTap?.(); return; }
    const under = document.elementsFromPoint?.(e.clientX, e.clientY) ?? [];
    const t = under.find((el) => el instanceof HTMLElement && el.dataset.drop && !ref.current?.contains(el)) as HTMLElement | undefined;
    onDrop(t?.dataset.drop ?? null);
  };
  return (
    <div
      ref={ref}
      role={onTap ? "button" : undefined}
      tabIndex={onTap && !disabled ? 0 : undefined}
      aria-label={label}
      aria-disabled={disabled || undefined}
      onKeyDown={(e) => { if (!disabled && onTap && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onTap(); } }}
      className={cn("touch-none select-none", disabled ? "opacity-40" : "cursor-grab", dragging ? "relative z-50" : "transition-transform duration-300", className)}
      style={{ transform: `translate(${off.x}px, ${off.y}px) scale(${dragging ? 1.2 : 1})` }}
      onPointerDown={(e) => { if (disabled || st.current) return; e.currentTarget.setPointerCapture?.(e.pointerId); st.current = { x: e.clientX, y: e.clientY, moved: false }; setDragging(true); audio.sfx("tap"); }}
      onPointerMove={(e) => { const s = st.current; if (!s) return; const dx = e.clientX - s.x, dy = e.clientY - s.y; if (Math.hypot(dx, dy) > 10) s.moved = true; setOff({ x: dx, y: dy }); }}
      onPointerUp={(e) => end(e)}
      onPointerCancel={(e) => end(e, true)}
      onLostPointerCapture={(e) => end(e, true)}
    >
      {children}
    </div>
  );
}

export function Confetti({ count = 50 }: { count?: number }) {
  const [pieces] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100, delay: Math.random() * 1.5, dur: 2.5 + Math.random() * 2,
      c: ["var(--rose)", "var(--lilac)", "var(--turquoise)", "var(--sun)", "var(--mint)"][i % 5],
      s: 8 + Math.random() * 10, star: i % 4 === 0,
    })),
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces.map((p, i) => (
        <span key={i} className="absolute top-0" style={{ left: `${p.left}%`, animation: `confetti ${p.dur}s ${p.delay}s linear infinite`, fontSize: p.s * 2 }}>
          {p.star ? <GameText text="⭐" /> : <span className="block rounded-sm" style={{ width: p.s, height: p.s * 0.6, background: p.c }} />}
        </span>
      ))}
    </div>
  );
}

export function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}
