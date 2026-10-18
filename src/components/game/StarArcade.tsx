import { useState } from "react";
import { HEROES, type Hero } from "@/game/data";
import { loadDriveBest, saveDriveBest, type DriveResult } from "@/game/drive-engine";
import { audio } from "@/game/audio";
import { Puppy, Vehicle } from "./art";
import { GameText } from "./GameText";
import { DriveGame } from "./minigames/DriveGame";

export function StarArcade() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [result, setResult] = useState<DriveResult | null>(null);
  const [best, setBest] = useState(loadDriveBest);
  const [round, setRound] = useState(0);
  if (!hero) return (
    <div className="game-centered flex min-h-0 flex-1 flex-col items-center gap-4 overflow-y-auto p-4 text-center">
      <h2 className="font-display text-3xl font-extrabold"><GameText text="⭐ Corrida das Estrelinhas" /></h2>
      <p className="max-w-xl text-xl">Pegue o máximo de estrelinhas em 60 segundos! Use as setas do teclado ou os botões na tela. Escolha sua amiguinha:</p>
      <p className="font-display text-xl font-bold">Seu recorde: {best} estrelinhas</p>
      <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {HEROES.map((candidate) => <button key={candidate.id} aria-label={`Correr com ${candidate.name}`} onClick={() => { audio.sfx("tap"); setHero(candidate); }} className="card-game flex flex-col items-center gap-2 p-3"><Puppy hero={candidate} size={80} /><span className="font-display text-xl font-bold">{candidate.name}</span><Vehicle hero={candidate} size={100} /></button>)}
      </div>
    </div>
  );
  if (result) return (
    <div className="game-centered flex min-h-0 flex-1 flex-col items-center gap-5 overflow-y-auto p-4 text-center">
      <h2 className="font-display text-4xl font-extrabold">Que corrida divertida!</h2>
      <Puppy hero={hero} size={140} mood="wow" />
      <div role="status" className="card-game px-6 py-4 font-display text-3xl font-bold"><GameText text="⭐" /> {result.stars} estrelinhas</div>
      <p className="text-xl font-bold">Seu recorde: {best} estrelinhas</p>
      <button onClick={() => { setResult(null); setRound((value) => value + 1); }} className="btn-game px-6 py-4 text-2xl">Jogar novamente</button>
      <button onClick={() => { setResult(null); setHero(null); }} className="btn-game px-6 py-4 text-xl" style={{ ["--btn" as string]: "var(--turquoise)" }}>Trocar amiguinha</button>
    </div>
  );
  return <div className="mx-auto min-h-0 w-full max-w-3xl flex-1 overflow-y-auto px-3 pb-3"><DriveGame key={round} hero={hero} mode="arcade" onDone={(score) => { setBest(saveDriveBest(score.stars)); setResult(score); audio.sfx("win"); audio.speak("Que corrida divertida! Vamos brincar de novo?"); }} /></div>;
}
