import { useEffect, useRef, useState } from "react";
import { Hint } from "../common";
import { Vehicle } from "../art";
import { audio } from "@/game/audio";
import type { Hero } from "@/game/data";

interface Obj { id: number; lane: number; y: number; kind: "cone" | "star" }

/** Fase curta de direção: sem derrota, só desvia e coleta estrelinhas. */
export function DriveGame({ hero, onDone }: { hero: Hero; onDone: () => void }) {
  const flying = hero.vehicleKind === "airplane";
  const [lane, setLane] = useState(1);
  const [objs, setObjs] = useState<Obj[]>([]);
  const [progress, setProgress] = useState(0);
  const [bump, setBump] = useState(0);
  const [got, setGot] = useState(0);
  const laneRef = useRef(1);
  laneRef.current = lane;
  const tick = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tick.current++;
      setProgress((p) => Math.min(100, p + 0.55));
      setObjs((os) => {
        let next = os.map((o) => ({ ...o, y: o.y + 1.6 })).filter((o) => o.y < 110);
        if (tick.current % 22 === 0) next.push({ id: tick.current, lane: Math.floor(Math.random() * 3), y: -10, kind: Math.random() < 0.45 ? "star" : "cone" });
        const hit = next.find((o) => o.lane === laneRef.current && o.y > 72 && o.y < 90);
        if (hit) {
          if (hit.kind === "star") { audio.sfx("star"); setGot((g) => g + 1); }
          else { audio.sfx("oops"); setBump((b) => b + 1); }
          next = next.filter((o) => o !== hit);
        }
        return next;
      });
    }, 50);
    return () => clearInterval(id);
  }, []);
  useEffect(() => { if (progress >= 100) { const id = setTimeout(onDone, 600); return () => clearTimeout(id); } }, [progress]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "ArrowLeft") setLane((l) => Math.max(0, l - 1)); if (e.key === "ArrowRight") setLane((l) => Math.min(2, l + 1)); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  const move = (d: number) => { audio.sfx("tap"); setLane((l) => Math.max(0, Math.min(2, l + d))); };

  return (
    <div className="flex h-full flex-col gap-3">
      <Hint icon={flying ? "✈️" : "🚗"} text={flying ? "Voe entre as nuvens de chuva e pegue as estrelinhas!" : "Desvie dos cones e pegue as estrelinhas!"} />
      <div className="card-game relative flex-1 overflow-hidden" style={{ background: flying ? "var(--sky)" : "var(--grass)" }}>
        <div className="absolute inset-y-0 left-[15%] right-[15%] overflow-hidden" style={{ background: flying ? "linear-gradient(var(--sky), #c5efff)" : "oklch(0.6 0.03 300)" }}>
          {[1, 2].map((l) => <div key={l} className="absolute inset-y-0 w-2" style={{ left: `${(l * 100) / 3}%`, background: `repeating-linear-gradient(180deg, #fff 0 30px, transparent 30px 60px)`, backgroundPositionY: `${progress * 30}px` }} />)}
          {objs.map((o) => (
            <div key={o.id} className="absolute -translate-x-1/2 text-5xl" style={{ left: `${(o.lane + 0.5) * (100 / 3)}%`, top: `${o.y}%` }}>{o.kind === "cone" ? flying ? "🌧️" : "🚧" : "⭐"}</div>
          ))}
          <div key={bump} className={`absolute bottom-[8%] -translate-x-1/2 transition-[left] duration-200 ${bump ? "animate-wiggle" : ""}`} style={{ left: `${(lane + 0.5) * (100 / 3)}%` }}>
            <div className="-rotate-90"><Vehicle hero={hero} size={110} /></div>
          </div>
        </div>
        <div className="absolute left-2 top-2 rounded-full bg-card px-3 py-1 font-display text-xl font-bold">⭐ {got}</div>
        <div className="absolute right-2 top-2 bottom-2 w-4 overflow-hidden rounded-full bg-card">
          <div className="absolute bottom-0 w-full rounded-full transition-all" style={{ height: `${progress}%`, background: "var(--rose)" }} />
          <span className="absolute -left-1 top-0 text-lg">🏁</span>
        </div>
        <button onPointerDown={() => move(-1)} className="btn-game absolute bottom-4 left-2 h-20 w-20 text-4xl sm:h-24 sm:w-24" style={{ ["--btn" as string]: "var(--turquoise)" }} aria-label="Esquerda">⬅️</button>
        <button onPointerDown={() => move(1)} className="btn-game absolute bottom-4 right-8 h-20 w-20 text-4xl sm:h-24 sm:w-24" style={{ ["--btn" as string]: "var(--turquoise)" }} aria-label="Direita">➡️</button>
      </div>
    </div>
  );
}
