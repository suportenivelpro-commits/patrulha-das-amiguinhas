import { useEffect, useRef, useState } from "react";
import { CHALLENGE_LEVELS } from "@/game/challenge-levels";
import { challengeGoal, initialChallenge, orderedForLevel, reduceChallenge, searchBoard } from "@/game/challenge-engine";
import type { ChallengeAction, ChallengeLevel, ChallengeState, Token } from "@/game/challenge-types";
import { audio } from "@/game/audio";
import { Hint, useFeedback } from "../common";
import type { MiniGameProps } from "./types";

function Picture({ token, className = "text-4xl" }: { token: Token; className?: string }) {
  return <span aria-hidden="true" className={className} style={{ filter: token.silhouette ? "brightness(0)" : undefined }}>{token.icon}</span>;
}

function Tile({ token, label, onClick, disabled, selected }: { token: Token; label: string; onClick: () => void; disabled?: boolean; selected?: boolean }) {
  return (
    <button aria-label={label} aria-pressed={selected} disabled={disabled} onClick={onClick} className={`flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border-4 border-white bg-card/85 p-2 disabled:opacity-45 ${selected ? "ring-4 ring-sun" : ""}`}>
      <Picture token={token} /><span className="text-center font-display text-sm font-bold leading-tight">{token.label}</span>
    </button>
  );
}

export function ChallengeGame({ mission, onDone }: MiniGameProps) {
  const level = CHALLENGE_LEVELS.find((candidate) => candidate.id === mission?.challengeId);
  if (!level) return <Hint icon="🧭" text="Esta missão não foi encontrada. Volte ao mapa para escolher outra aventura." />;
  return <ChallengeSession key={level.id} level={level} onDone={onDone} />;
}

function ChallengeSession({ level, onDone }: { level: ChallengeLevel; onDone: MiniGameProps["onDone"] }) {
  const [state, setState] = useState(() => initialChallenge(level));
  const { node, show } = useFeedback();
  const previous = useRef({ progress: 0, mistakes: 0 });
  useEffect(() => {
    if (state.mistakes > previous.current.mistakes) show("oops");
    else if (state.progress > previous.current.progress) show("good");
    previous.current = { progress: state.progress, mistakes: state.mistakes };
  }, [state.progress, state.mistakes, show]);
  useEffect(() => {
    if (!state.done) return;
    const id = setTimeout(() => onDone(state.mistakes), 1700);
    return () => clearTimeout(id);
  }, [state.done, state.mistakes, onDone]);
  const attempt = (action: ChallengeAction) => {
    if (state.done) return;
    audio.sfx("tap");
    setState((current) => reduceChallenge(level, current, action));
  };
  const instruction = state.done ? "Missão cumprida! Que trabalho incrível!" : state.selected && (level.kind === "sort" || level.kind === "pairs") ? "Agora toque no destino certo!" : level.instruction;
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {node}
      <Hint icon={level.icon} text={instruction} />
      <div className="card-game flex min-h-0 flex-1 flex-col gap-3 bg-sky-grad p-3">
        <div role="status" className="shrink-0 text-center font-display text-xl font-bold">{level.icon} {state.progress}/{challengeGoal(level)}</div>
        <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-2">
          {state.done ? <div className="flex h-full min-h-36 flex-col items-center justify-center gap-3 text-center"><span className="animate-bob text-7xl">🎉</span><p className="font-display text-2xl font-bold">Você conseguiu!</p></div> : <LevelBoard level={level} state={state} attempt={attempt} />}
        </div>
      </div>
    </div>
  );
}

function LevelBoard({ level, state, attempt }: { level: ChallengeLevel; state: ChallengeState; attempt: (action: ChallengeAction) => void }) {
  switch (level.kind) {
    case "search":
      return <div className="flex h-full flex-col gap-3">
        <div className="rounded-2xl bg-card/80 p-2 text-center font-display text-xl font-bold">Procure: {level.target.icon} {level.target.label}</div>
        <div className="grid flex-1 grid-cols-4 gap-2">
          {searchBoard(level).map((cell, index) => <button key={cell.cellId} aria-label={`${cell.label}, posição ${index + 1}`} disabled={state.found.includes(cell.cellId)} onClick={() => attempt({ type: "tap", id: cell.cellId })} className="flex min-h-16 min-w-0 items-center justify-center rounded-2xl border-4 border-white bg-card/70 text-4xl disabled:opacity-30">{state.found.includes(cell.cellId) ? "✅" : cell.icon}</button>)}
        </div>
      </div>;
    case "sequence":
      return <div className="flex h-full flex-col gap-4">
        <div aria-label="Ordem dos desenhos" className="flex shrink-0 flex-wrap justify-center gap-2 rounded-2xl bg-card/80 p-3">
          {level.order.map((id, index) => <div key={index} className={`flex flex-col items-center rounded-xl p-1 ${index === state.progress ? "ring-4 ring-sun" : index < state.progress ? "opacity-40" : ""}`}><Picture token={level.palette.find((token) => token.id === id)!} className="text-3xl" /><span className="font-bold">{index + 1}</span></div>)}
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3">{level.palette.map((token) => <Tile key={token.id} token={token} label={`Tocar ${token.label}`} onClick={() => attempt({ type: "tap", id: token.id })} />)}</div>
      </div>;
    case "count": {
      const round = level.rounds[state.progress]!;
      return <div className="flex h-full flex-col gap-3">
        <h3 className="shrink-0 text-center font-display text-xl font-bold">Quantos? {round.label}</h3>
        <div aria-label={`${round.count} ${round.label}`} className="grid flex-1 grid-cols-4 content-center gap-3 rounded-2xl bg-card/75 p-3">{Array.from({ length: round.count }, (_, index) => <span aria-hidden="true" key={index} className="text-center text-4xl">{round.icon}</span>)}</div>
        <div className="grid shrink-0 grid-cols-3 gap-2">{round.options.map((option) => <button key={option} aria-label={`Número ${option}`} onClick={() => attempt({ type: "tap", id: String(option) })} className="btn-game min-h-16 py-3 text-3xl">{option}</button>)}</div>
      </div>;
    }
    case "pattern": {
      const round = level.rounds[state.progress]!;
      return <div className="flex h-full flex-col justify-center gap-5">
        <div aria-label="Sequência para completar" className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-card/80 p-3">{round.series.map((token, index) => <Picture key={index} token={token} />)}<span className="rounded-xl bg-sun px-3 text-4xl">?</span></div>
        <div className="grid grid-cols-3 gap-2">{round.options.map((token) => <Tile key={token.id} token={token} label={`Escolher ${token.label}`} onClick={() => attempt({ type: "tap", id: token.id })} />)}</div>
      </div>;
    }
    case "sort":
      return <div className="flex h-full flex-col gap-3">
        <div className="grid min-h-36 flex-1 grid-cols-3 gap-2">{orderedForLevel(level.items, level.id).map((token) => <Tile key={token.id} token={token} label={`Selecionar ${token.label}`} selected={state.selected === token.id} disabled={state.found.includes(token.id)} onClick={() => attempt({ type: "tap", id: token.id })} />)}</div>
        <div className="grid shrink-0 grid-cols-2 gap-3 border-t-4 border-white pt-3">{level.bins.map((token) => <Tile key={token.id} token={token} label={`Guardar em ${token.label}`} onClick={() => attempt({ type: "target", id: token.id })} />)}</div>
      </div>;
    case "pairs":
      return <div className="grid h-full grid-cols-2 gap-4">
        <div className="grid gap-2">{orderedForLevel(level.pairs, `${level.id}-left`).map((pair) => <Tile key={pair.id} token={pair.left} label={`Escolher ${pair.left.label}`} selected={state.selected === pair.id} disabled={state.found.includes(pair.id)} onClick={() => attempt({ type: "tap", id: pair.id })} />)}</div>
        <div className="grid gap-2">{orderedForLevel(level.pairs, `${level.id}-right`).map((pair) => <Tile key={pair.id} token={pair.right} label={`Ligar a ${pair.right.label}`} disabled={state.found.includes(pair.id)} onClick={() => attempt({ type: "target", id: pair.id })} />)}</div>
      </div>;
    case "build":
      return <div className="flex h-full flex-col gap-3">
        <div aria-label="Espaços da montagem" className="grid grid-cols-3 gap-2 rounded-2xl bg-card/70 p-2">{level.slots.map((token, index) => <div key={token.id} aria-label={`Espaço ${index + 1}: ${token.label}`} className={`flex min-h-16 flex-col items-center justify-center rounded-xl border-4 border-white ${index === state.progress ? "ring-4 ring-sun" : ""}`}><span className={state.found.includes(token.id) ? "" : "opacity-25"}><Picture token={token} /></span></div>)}</div>
        <div className="grid min-h-36 flex-1 grid-cols-3 gap-2">{orderedForLevel(level.slots, level.id).map((token) => <Tile key={token.id} token={token} label={`Usar ${token.label}`} disabled={state.found.includes(token.id)} onClick={() => attempt({ type: "tap", id: token.id })} />)}</div>
      </div>;
    case "route": {
      const move = (direction: "up" | "down" | "left" | "right") => attempt({ type: "move", direction });
      const directions = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" } as const;
      return <div role="group" aria-label="Navegar no resgate" tabIndex={0} className="flex h-full flex-col gap-3" onKeyDown={(event) => { const direction = directions[event.key as keyof typeof directions]; if (direction) { event.preventDefault(); move(direction); } }}>
        <div aria-label={`Mapa do resgate. Você está na linha ${Math.floor(state.position / level.size) + 1}, coluna ${state.position % level.size + 1}.`} className="grid min-h-40 flex-1 gap-1" style={{ gridTemplateColumns: `repeat(${level.size}, minmax(0, 1fr))` }}>
          {Array.from({ length: level.size * level.size }, (_, index) => <div key={index} aria-hidden="true" className={`flex min-h-10 items-center justify-center rounded-xl border-2 border-white text-3xl ${level.walls.includes(index) ? "bg-lilac/60" : "bg-card/85"}`}>{index === state.position ? level.player.icon : index === level.goal ? level.destination.icon : level.walls.includes(index) ? level.obstacle.icon : "·"}</div>)}
        </div>
        <div className="mx-auto grid w-full max-w-xs shrink-0 grid-cols-3 gap-2">
          <span /><button aria-label="Cima" onClick={() => move("up")} className="btn-game min-h-14 text-3xl">⬆️</button><span />
          <button aria-label="Esquerda" onClick={() => move("left")} className="btn-game min-h-14 text-3xl">⬅️</button>
          <button aria-label="Baixo" onClick={() => move("down")} className="btn-game min-h-14 text-3xl">⬇️</button>
          <button aria-label="Direita" onClick={() => move("right")} className="btn-game min-h-14 text-3xl">➡️</button>
        </div>
      </div>;
    }
  }
}
