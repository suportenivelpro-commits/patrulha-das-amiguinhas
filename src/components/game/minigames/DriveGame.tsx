import { useEffect, useRef, useState } from "react";
import { Hint } from "../common";
import { Vehicle } from "../art";
import { GameText } from "../GameText";
import { audio } from "@/game/audio";
import { advanceDrive, initialDrive, moveLane, type DriveResult } from "@/game/drive-engine";
import type { Hero } from "@/game/data";

/** Shared road game: short trip before a mission, or a full minute in the arcade. */
export function DriveGame({ hero, onDone, mode = "trip" }: { hero: Hero; onDone: (result: DriveResult) => void; mode?: "trip" | "arcade" }) {
  const flying = hero.vehicleKind === "airplane";
  const arcade = mode === "arcade";
  const durationTicks = (arcade ? 60 : 9) * 20;
  const [state, setState] = useState(initialDrive);
  const [lane, setLane] = useState(1);
  const [paused, setPaused] = useState(false);
  const laneRef = useRef(1);
  const simulation = useRef(state);
  const callback = useRef(onDone);
  callback.current = onDone;
  const swipe = useRef<number | null>(null);
  const move = (direction: number) => {
    if (paused || simulation.current.done) return;
    audio.sfx("tap");
    laneRef.current = moveLane(laneRef.current, direction);
    setLane(laneRef.current);
  };
  useEffect(() => {
    if (paused || state.done) return;
    const id = setInterval(() => {
      const before = simulation.current;
      const next = advanceDrive(before, laneRef.current, durationTicks, arcade);
      simulation.current = next;
      if (next.stars > before.stars) audio.sfx("star");
      if (next.bumps > before.bumps) audio.sfx("oops");
      setState(next);
    }, 50);
    return () => clearInterval(id);
  }, [paused, state.done, durationTicks, arcade]);
  useEffect(() => {
    if (!state.done) return;
    const id = setTimeout(() => callback.current({ stars: state.stars, bumps: state.bumps }), 600);
    return () => clearTimeout(id);
  }, [state.done, state.stars, state.bumps]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      if (paused || simulation.current.done) return;
      laneRef.current = moveLane(laneRef.current, event.key === "ArrowLeft" ? -1 : 1);
      setLane(laneRef.current);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [paused]);
  const progress = Math.min(100, state.tick / durationTicks * 100);
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <Hint icon={flying ? "✈️" : "🚗"} text={state.done ? "Chegamos! Que aventura divertida!" : flying ? "Voe entre as nuvens de chuva e pegue as estrelinhas!" : "Desvie dos cones e pegue as estrelinhas!"} />
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
        <div role="status" aria-label="Estrelinhas coletadas" className="card-game px-3 py-1 font-display text-xl font-bold"><GameText text="⭐" /> {state.stars}</div>
        {arcade && <><div className="font-display text-xl font-bold" aria-label="Tempo restante">{Math.ceil((durationTicks - state.tick) / 20)} s</div><button disabled={state.done} aria-pressed={paused} onClick={() => setPaused((value) => !value)} className="btn-game px-4 py-2 text-lg">{paused ? "Continuar" : "Pausar"}</button></>}
      </div>
      <div className="card-game relative min-h-64 flex-1 overflow-hidden" style={{ background: flying ? "var(--sky)" : "var(--grass)" }}>
        <div aria-label="Pista de estrelinhas" className="absolute inset-y-0 left-[8%] right-[8%] touch-pan-y overflow-hidden sm:left-[15%] sm:right-[15%]" style={{ background: flying ? "linear-gradient(var(--sky), #c5efff)" : "#79717f" }} onPointerDown={(event) => { swipe.current = event.clientX; }} onPointerUp={(event) => { if (swipe.current !== null && Math.abs(event.clientX - swipe.current) > 24) move(event.clientX > swipe.current ? 1 : -1); swipe.current = null; }} onPointerCancel={() => { swipe.current = null; }}>
          {[1, 2].map((line) => <div key={line} className="absolute inset-y-0 w-2" style={{ left: `${line * 100 / 3}%`, background: "repeating-linear-gradient(180deg, #fff 0 30px, transparent 30px 60px)", backgroundPositionY: `${state.tick * 8}px` }} />)}
          {state.objects.map((item) => <div key={item.id} aria-hidden="true" className="absolute -translate-x-1/2 text-4xl sm:text-5xl" style={{ left: `${(item.lane + 0.5) * 100 / 3}%`, top: `${item.y}%` }}><GameText text={item.kind === "star" ? "⭐" : flying ? "🌧️" : "🚧"} /></div>)}
          <div key={state.bumps} aria-label={`Faixa ${lane + 1}`} className={`absolute top-[78%] -translate-x-1/2 -translate-y-1/2 transition-[left] duration-150 ${state.bumps ? "animate-wiggle" : ""}`} style={{ left: `${(lane + 0.5) * 100 / 3}%` }}><div className="-rotate-90"><Vehicle hero={hero} size={88} /></div></div>
        </div>
        <div role="progressbar" aria-label="Percurso" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} className="absolute bottom-2 right-2 top-2 w-3 overflow-hidden rounded-full bg-card"><div className="absolute bottom-0 w-full rounded-full" style={{ height: `${progress}%`, background: "var(--rose)" }} /></div>
        {paused && <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/75 font-display text-3xl font-bold">Pausa</div>}
      </div>
      <div className="grid shrink-0 grid-cols-2 gap-4 pb-2">
        <button disabled={paused || state.done} onClick={() => move(-1)} className="btn-game min-h-16 py-3 text-4xl disabled:opacity-40" style={{ ["--btn" as string]: "var(--turquoise)" }} aria-label="Esquerda"><GameText text="⬅️" /></button>
        <button disabled={paused || state.done} onClick={() => move(1)} className="btn-game min-h-16 py-3 text-4xl disabled:opacity-40" style={{ ["--btn" as string]: "var(--turquoise)" }} aria-label="Direita"><GameText text="➡️" /></button>
      </div>
    </div>
  );
}
