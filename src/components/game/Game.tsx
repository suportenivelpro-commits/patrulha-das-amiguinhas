import { GameText } from "./GameText";
import { StarArcade } from "./StarArcade";
import { resetDriveBest } from "@/game/drive-engine";
import { useEffect, useState } from "react";
import { HEROES, MEDALS, MISSIONS, CHAPTERS, heroById, type Hero, type Mission } from "@/game/data";
import { applyResult, emptyProgress, isChapterUnlocked, isUnlocked, loadProgress, resetProgress, saveProgress, starsFor, totalStars, type Progress } from "@/game/progress";
import { audio } from "@/game/audio";
import { Cloud, Puppy, Stars, Vehicle } from "./art";
import { Confetti } from "./common";
import { KittenGame } from "./minigames/KittenGame";
import { FireGame } from "./minigames/FireGame";
import { VetGame } from "./minigames/VetGame";
import { BridgeGame } from "./minigames/BridgeGame";
import { ParkGame } from "./minigames/ParkGame";
import { DriveGame } from "./minigames/DriveGame";
import { GardenGame } from "./minigames/GardenGame";
import { RiverGame } from "./minigames/RiverGame";
import { MemoryGame } from "./minigames/MemoryGame";
import { ChallengeGame } from "./minigames/ChallengeGame";
import type { MiniGameProps } from "./minigames/types";

const GAMES: Record<Mission["game"], (p: MiniGameProps) => React.ReactElement> = { kitten: KittenGame, fire: FireGame, vet: VetGame, bridge: BridgeGame, park: ParkGame, garden: GardenGame, river: RiverGame, memory: MemoryGame, challenge: ChallengeGame };

type Screen =
  | { n: "arcade" } | { n: "title" } | { n: "hub" } | { n: "map" } | { n: "team" } | { n: "medals" } | { n: "settings" } | { n: "reset" }
  | { n: "call"; m: Mission } | { n: "choose"; m: Mission } | { n: "launch"; m: Mission; h: Hero }
  | { n: "drive"; m: Mission; h: Hero } | { n: "play"; m: Mission; h: Hero }
  | { n: "win"; m: Mission; h: Hero; stars: number; earned: string[] };

const btn = (c: string) => ({ ["--btn" as string]: c });

export function Game() {
  const [p, setP] = useState<Progress>(emptyProgress);
  const [s, setS] = useState<Screen>({ n: "title" });
  const [chapterIndex, setChapterIndex] = useState(0);
  const completedCount = MISSIONS.filter((mission) => (p.stars[mission.id] ?? 0) > 0).length;
  const resumeMission = MISSIONS.find((mission, index) => isUnlocked(p, index) && (p.stars[mission.id] ?? 0) === 0);
  useEffect(() => { const l = loadProgress(); setP(l); audio.setEnabled(l.sound); }, []);
  const update = (np: Progress) => { setP(np); saveProgress(np); };
  const go = (n: Screen) => { audio.sfx("tap"); setS(n); };
  const startMission = (mission: Mission) => {
    const index = CHAPTERS.findIndex((chapter) => chapter.missions.includes(mission.id));
    setChapterIndex(Math.max(0, index));
    go({ n: "call", m: mission });
  };
  const surprise = () => {
    const available = MISSIONS.filter((_, index) => isUnlocked(p, index));
    const mission = available[Math.floor(Math.random() * available.length)];
    if (mission) startMission(mission);
  };
  const toggleSound = () => { const on = !p.sound; audio.setEnabled(on); if (on) audio.startMusic(); update({ ...p, sound: on }); };

  const restart = () => {
    audio.stopSpeaking();
    audio.stopMusic();
    const fresh = resetProgress(p.sound);
    resetDriveBest();
    setP(fresh);
    setChapterIndex(0);
    setS({ n: "hub" });
    if (fresh.sound) audio.startMusic();
    audio.speak("Tudo pronto! Vamos começar uma nova aventura!");
  };

  const top = s.n !== "title" && (
    <div className="game-toolbar flex shrink-0 items-center justify-between gap-2 p-3">
      <button onClick={() => go({ n: s.n === "hub" ? "title" : s.n === "reset" ? "settings" : "hub" })} className="btn-game h-14 w-14 text-2xl" style={btn("var(--lilac)")} aria-label="Voltar"><GameText text="🏠" /></button>
      <div className="card-game px-4 py-1 font-display text-2xl font-extrabold"><GameText text="⭐ " />{totalStars(p)}</div>
      <button onClick={toggleSound} className="btn-game h-14 w-14 text-2xl" style={btn("var(--turquoise)")} aria-label="Som"><GameText text={p.sound ? "🔊" : "🔇"} /></button>
    </div>
  );

  let body: React.ReactNode = null;
  switch (s.n) {
    case "title":
      body = (
        <div className="game-centered relative flex min-h-0 flex-1 flex-col items-center gap-6 overflow-y-auto overflow-x-hidden bg-title-grad p-4 text-center">
          <Cloud className="animate-drift absolute top-[8%] w-40" />
          <Cloud className="animate-drift absolute top-[22%] w-28" style={{ animationDelay: "-18s" }} />
          <div className="absolute -top-40 h-96 w-96 animate-spin-slow rounded-full opacity-30" style={{ background: "repeating-conic-gradient(#fff 0 10deg, transparent 10deg 20deg)" }} />
          <h1 className="animate-pop relative font-display text-5xl font-extrabold leading-none text-primary-foreground text-outline sm:text-7xl">Patrulha das<br />Amiguinhas</h1>
          <p className="relative font-display text-xl font-bold text-primary-foreground text-outline sm:text-2xl"><GameText text="✨ Aventuras na Cidade e na Natureza ✨" /></p>
          <div className="relative flex flex-wrap justify-center">
            {HEROES.map((h, i) => <div key={h.id} className="animate-bob" style={{ animationDelay: `${i * 0.2}s` }}><Puppy hero={h} size={96} /></div>)}
          </div>
          <button onClick={() => { audio.startMusic(); audio.speak("Vamos jogar!"); go({ n: "hub" }); }} className="btn-game animate-pulse-big relative px-14 py-5 text-4xl" style={btn("var(--rose)")}><GameText text="▶ Jogar" /></button>
        </div>
      );
      break;
    case "hub":
      body = (
        <div className="game-centered flex min-h-0 flex-1 flex-col items-center gap-5 overflow-y-auto p-4">
          <h2 className="font-display text-4xl font-extrabold">Central de Missões</h2>
          <p className="card-game px-4 py-2 text-center font-display text-xl font-bold">{completedCount}/{MISSIONS.length} missões · {CHAPTERS.length} capítulos</p>
          {completedCount > 0 && resumeMission && <button onClick={() => startMission(resumeMission)} className="btn-game px-5 py-3 text-2xl" style={btn("var(--rose)")}><GameText text="▶ Continuar aventura" /></button>}
          <div className="flex flex-wrap justify-center gap-1">{HEROES.map((h) => <Puppy key={h.id} hero={h} size={72} />)}</div>
          <div className="grid w-full max-w-xl grid-cols-2 gap-4">
            <button onClick={() => go({ n: "map" })} className="btn-game py-6 text-2xl" style={btn("var(--rose)")}><GameText text="🗺️" /><br />Mapa</button>
            <button onClick={() => go({ n: "team" })} className="btn-game py-6 text-2xl" style={btn("var(--turquoise)")}><GameText text="🐾" /><br />Equipe</button>
            <button onClick={() => go({ n: "medals" })} className="btn-game py-6 text-2xl" style={btn("var(--lilac)")}><GameText text="🏅" /><br />Medalhas</button>
            <button onClick={surprise} className="btn-game py-6 text-2xl" style={btn("var(--coral)")}><GameText text="🎲" /><br />Surpresa</button>
            <button onClick={() => go({ n: "arcade" })} className="btn-game col-span-2 px-4 py-4 text-2xl" style={{ ...btn("var(--sun)"), color: "var(--plum)" }}><GameText text="⭐ Corrida das Estrelinhas" /></button>
            <button onClick={() => go({ n: "settings" })} className="btn-game col-span-2 px-4 py-4 text-2xl" style={btn("var(--mint)")}><GameText text="⚙️ Voz e ajustes" /></button>
          </div>
        </div>
      );
      break;
    case "arcade":
      body = <StarArcade />;
      break;
    case "settings":
      body = <Settings progress={p} onReset={() => go({ n: "reset" })} />;
      break;
    case "reset":
      body = (
        <Centered>
          <h2 className="text-center font-display text-3xl font-extrabold">Começar tudo de novo?</h2>
          <div className="card-game max-w-lg p-5 text-center text-xl">
            <div className="mb-3 text-5xl" aria-hidden="true"><GameText text="⭐ 🏅" /></div>
            <p>Isso apaga as estrelas, medalhas e o recorde da corrida deste aparelho e volta as missões ao começo.</p>
            <p className="mt-3 text-lg">A voz escolhida e a opção de som serão mantidas.</p>
          </div>
          <button onClick={restart} className="btn-game px-6 py-4 text-2xl" style={btn("var(--coral)")}>Sim, zerar progresso</button>
          <button onClick={() => go({ n: "settings" })} className="btn-game px-6 py-4 text-2xl" style={btn("var(--turquoise)")}>Cancelar</button>
        </Centered>
      );
      break;
    case "map": {
      const ch = CHAPTERS[chapterIndex]!;
      const chapterMissions = ch.missions.map((id) => MISSIONS.find((mission) => mission.id === id)!);
      const doneCount = ch.missions.filter((id) => p.stars[id]).length;
      body = (
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3">
          <div className="flex shrink-0 items-center gap-2" aria-label="Capítulos">
            <button aria-label="Capítulo anterior" disabled={chapterIndex === 0} onClick={() => { audio.sfx("tap"); setChapterIndex((index) => index - 1); }} className="btn-game h-14 w-14 shrink-0 text-2xl disabled:opacity-40"><GameText text="⬅️" /></button>
            <label htmlFor="chapter-select" className="sr-only">Escolher capítulo</label>
            <select id="chapter-select" value={chapterIndex} onChange={(event) => { const index = Number(event.target.value); if (isChapterUnlocked(p, index)) { audio.sfx("tap"); setChapterIndex(index); } }} className="card-game min-h-14 min-w-0 flex-1 px-2 font-display text-base font-bold">
              {CHAPTERS.map((chapter, index) => <option key={chapter.id} value={index} disabled={!isChapterUnlocked(p, index)}>{index + 1}. {chapter.title}{isChapterUnlocked(p, index) ? "" : " (bloqueado)"}</option>)}
            </select>
            <button aria-label="Próximo capítulo" disabled={!isChapterUnlocked(p, chapterIndex + 1)} onClick={() => { audio.sfx("tap"); setChapterIndex((index) => index + 1); }} className="btn-game h-14 w-14 shrink-0 text-2xl disabled:opacity-40"><GameText text="➡️" /></button>
          </div>
          <div className="card-game flex shrink-0 items-center gap-3 px-4 py-2">
            <span className="text-2xl"><GameText text="📖" /></span>
            <div className="flex-1"><div className="font-display font-bold">Capítulo {chapterIndex + 1}: {ch.title}</div>
              <div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full transition-all" style={{ width: `${(doneCount / ch.missions.length) * 100}%`, background: "var(--rose)" }} /></div></div>
            <span className="font-display font-bold">{doneCount}/{ch.missions.length}</span>
          </div>
          <div className="card-game relative flex-1 overflow-hidden" style={{ background: "linear-gradient(180deg, var(--sky) 0 12%, var(--grass) 12%)", minHeight: 420 }}>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 88 Q30 80 50 90 T100 84 L100 100 L0 100Z" fill="var(--water)" />
              <path d="M22 30 Q50 45 76 26 M50 45 L80 70 M50 45 L48 76 M50 45 L16 70" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="1 3" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 10 }} />
            </svg>
            {(ch.decorations ?? (chapterIndex === 0 ? ["🏡", "🌷", "🏠", "🌳", "🏫", "🌼", "🏘️"] : ["🌲", "🌷", "🦋", "🌳", "🏕️", "🌼", "🌲"])).map((e, i) => <span key={i} className="absolute text-3xl" style={{ left: `${[8, 35, 60, 90, 35, 66, 88][i]}%`, top: `${[48, 22, 54, 45, 58, 84, 88][i]}%` }}><GameText text={e} /></span>)}
            <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 text-center"><div className="text-5xl"><GameText text={chapterIndex === 0 ? "🏰" : "🏕️"} /></div><div className="rounded-full bg-card px-2 font-display text-sm font-bold">Base</div></div>
            {chapterMissions.map((m) => {
              const open = isUnlocked(p, MISSIONS.indexOf(m));
              return (
                <button key={m.id} disabled={!open} onClick={() => startMission(m)} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${m.x}%`, top: `${m.y}%` }} aria-label={m.title}>
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 border-card text-4xl shadow-lg ${open && !p.stars[m.id] ? "animate-pulse-big" : ""}`} style={{ background: open ? heroById(m.hero).color : "var(--muted)" }}><GameText text={open ? m.icon : "🔒"} /></div>
                  {p.stars[m.id] ? <Stars n={p.stars[m.id]} size={16} /> : null}
                </button>
              );
            })}
          </div>
          {CHAPTERS[chapterIndex + 1] && !isChapterUnlocked(p, chapterIndex + 1) && <p className="shrink-0 py-2 text-center font-display font-bold"><GameText text="🔓 Conclua as missões deste capítulo para abrir " />{CHAPTERS[chapterIndex + 1]!.title}!</p>}
        </div>
      );
      break;
    }
    case "team":
      body = (
        <div className="grid flex-1 grid-cols-2 gap-4 overflow-auto p-4 sm:grid-cols-3 lg:grid-cols-5">
          {HEROES.map((h, i) => (
            <button key={h.id} onClick={() => { audio.sfx("pop"); audio.speak(h.intro); }} className="card-game animate-pop flex flex-col items-center p-3 transition-transform active:scale-95" style={{ animationDelay: `${i * 0.1}s`, background: `color-mix(in oklab, ${h.color} 30%, white)` }}>
              <div className="animate-bob"><Puppy hero={h} size={112} /></div>
              <div className="font-display text-2xl font-extrabold">{h.name}</div>
              <div className="font-bold"><GameText text={h.badge} /> {h.role}</div>
              <div className="text-sm text-muted-foreground">{h.personality}</div>
              <Vehicle hero={h} size={104} />
              <div className="text-xs font-bold">{h.vehicle}</div>
            </button>
          ))}
        </div>
      );
      break;
    case "medals":
      body = (
        <div className="flex-1 overflow-auto p-4">
          <h2 className="mb-4 text-center font-display text-4xl font-extrabold">Minhas Medalhas</h2>
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-5">
            {MEDALS.map((m) => { const has = p.medals.includes(m.id); return (
              <div key={m.id} className="card-game flex flex-col items-center p-3 text-center">
                <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 border-card text-4xl shadow-md ${has ? "animate-pop" : "grayscale opacity-30"}`} style={{ background: m.color }}><GameText text={has ? m.icon : "❔"} /></div>
                <div className="mt-1 text-sm font-bold leading-tight">{m.name}</div>
              </div>); })}
          </div>
        </div>
      );
      break;
    case "call":
      body = (
        <Centered>
          <Speak text={s.m.call} />
          <div className="animate-ring text-8xl"><GameText text="📞" /></div>
          <div className="card-game animate-pop max-w-md p-5 text-center"><div className="text-7xl"><GameText text={s.m.caller} /></div>
            <p className="mt-2 font-display text-2xl font-bold">{s.m.call}</p><p className="mt-1 text-muted-foreground"><GameText text="📍 " />{s.m.place}</p></div>
          <button onClick={() => go({ n: "choose", m: s.m })} className="btn-game animate-pulse-big px-10 py-4 text-3xl" style={btn("var(--rose)")}><GameText text="Vamos ajudar! 🐾" /></button>
        </Centered>
      );
      break;
    case "choose":
      body = <Choose m={s.m} onPick={(h) => { audio.sfx("siren"); setS({ n: "launch", m: s.m, h }); }} />;
      break;
    case "launch":
      body = <Launch h={s.h} onDone={() => setS({ n: "drive", m: s.m, h: s.h })} />;
      break;
    case "drive":
      body = <div className="min-h-0 flex-1 px-3 pb-3"><DriveGame hero={s.h} onDone={() => setS({ n: "play", m: s.m, h: s.h })} /></div>;
      break;
    case "play": {
      const G = GAMES[s.m.game];
      body = <div className="min-h-0 flex-1 px-3 pb-3"><G key={s.m.id} mission={s.m} hero={s.h} onDone={(mist) => { const stars = starsFor(mist); const r = applyResult(p, s.m.id, stars); update(r.next); audio.sfx("win"); audio.speak("Missão cumprida! Você conseguiu!"); setS({ n: "win", m: s.m, h: s.h, stars, earned: r.earned }); }} /></div>;
      break;
    }
    case "win": {
      const nextIndex = MISSIONS.findIndex((mission) => mission.id === s.m.id) + 1;
      const next = MISSIONS[nextIndex];
      body = (
        <Centered>
          <Confetti />
          <h2 className="animate-pop font-display text-5xl font-extrabold">Missão cumprida!</h2>
          <div className="animate-bob"><Puppy hero={s.h} size={150} mood="wow" /></div>
          <Stars n={s.stars} size={56} />
          {s.earned.length > 0 && (
            <div className="card-game flex flex-wrap justify-center gap-3 p-3">
              {s.earned.map((id) => { const md = MEDALS.find((x) => x.id === id)!; return (
                <div key={id} className="animate-pop flex flex-col items-center"><div className="flex h-16 w-16 items-center justify-center rounded-full text-3xl" style={{ background: md.color }}><GameText text={md.icon} /></div><span className="text-xs font-bold">{md.name}</span></div>); })}
            </div>
          )}
          <div className="relative z-50 flex max-w-full flex-wrap justify-center gap-3">
            <button onClick={() => go({ n: "play", m: s.m, h: s.h })} className="btn-game px-6 py-4 text-2xl" style={btn("var(--turquoise)")}><GameText text="🔁" /></button>
            <button onClick={() => go({ n: "map" })} className="btn-game px-10 py-4 text-2xl" style={btn("var(--rose)")}><GameText text="🗺️ Mapa" /></button>
            {next && isUnlocked(p, nextIndex) && <button onClick={() => startMission(next)} className="btn-game w-full px-6 py-4 text-2xl" style={btn("var(--mint)")}><GameText text="Próxima missão ➡️" /></button>}
          </div>
        </Centered>
      );
      break;
    }
  }

  return <div className="game-app flex h-dvh min-h-0 flex-col overflow-hidden bg-sky-grad">{top}{body}</div>;
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="game-centered flex min-h-0 flex-1 flex-col items-center gap-5 overflow-y-auto p-4">{children}</div>;
}
function Speak({ text }: { text: string }) {
  useEffect(() => { const id = setTimeout(() => audio.speak(text), 300); return () => clearTimeout(id); }, [text]);
  return null;
}

function Choose({ m, onPick }: { m: Mission; onPick: (h: Hero) => void }) {
  const [wrong, setWrong] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const best = heroById(m.hero);
  const pick = (h: Hero) => {
    if (h.id === m.hero) { audio.sfx("good"); audio.speak(`${h.name}, ao resgate!`); onPick(h); return; }
    audio.sfx("oops"); setWrong(h.id); setTries((t) => t + 1);
    audio.speak(`Hmm, a ${best.name} é ótima nisso! Tenta ela!`);
  };
  return (
    <Centered>
      <Speak text="Quem é a melhor heroína para essa missão?" />
      <h2 className="text-center font-display text-3xl font-extrabold">Quem vai ajudar? <GameText text={m.icon} /></h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {HEROES.map((h) => (
          <button key={`${h.id}${wrong === h.id ? tries : ""}`} onClick={() => pick(h)} className={`card-game flex flex-col items-center p-2 ${wrong === h.id ? "animate-wiggle" : ""} ${tries > 0 && h.id === m.hero ? "animate-pulse-big ring-8 ring-sun" : ""}`} style={{ background: `color-mix(in oklab, ${h.color} 30%, white)` }}>
            <Puppy hero={h} size={104} mood={wrong === h.id ? "think" : "happy"} />
            <span className="font-display text-xl font-bold">{h.name}</span><span className="text-2xl"><GameText text={h.badge} /></span>
          </button>
        ))}
      </div>
    </Centered>
  );
}

function Launch({ h, onDone }: { h: Hero; onDone: () => void }) {
  useEffect(() => { const id = setTimeout(onDone, 2900); return () => clearTimeout(id); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Centered>
      <h2 className="animate-pop font-display text-4xl font-extrabold">{h.name}<GameText text=", ao resgate! 🚨" /></h2>
      <div className="relative h-56 w-full max-w-lg overflow-hidden rounded-t-[4rem] border-8 border-card" style={{ background: h.color }}>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2"><div className="animate-drive-out"><Vehicle hero={h} size={180} /></div></div>
        <div className="animate-door absolute inset-0" style={{ background: "repeating-linear-gradient(180deg, oklch(0.95 0.02 300) 0 22px, oklch(0.88 0.04 300) 22px 26px)" }} />
      </div>
    </Centered>
  );
}


function Settings({ progress, onReset }: { progress: Progress; onReset: () => void }) {
  const [voices, setVoices] = useState(() => audio.getVoices());
  const [selected, setSelected] = useState(() => audio.getPreferredVoice());
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  useEffect(() => {
    if (!supported) return;
    const refresh = () => setVoices(audio.getVoices());
    refresh();
    window.speechSynthesis.addEventListener?.("voiceschanged", refresh);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", refresh);
  }, [supported]);
  return (
    <Centered>
      <h2 className="text-center font-display text-3xl font-extrabold">Voz e ajustes</h2>
      <div className="card-game flex w-full max-w-lg flex-col gap-4 p-4">
        <label htmlFor="narration-voice" className="font-display text-2xl font-bold"><GameText text="🎙️ Voz das aventuras" /></label>
        <select id="narration-voice" disabled={!supported} value={selected} onChange={(event) => { const uri = event.target.value; setSelected(uri); audio.setPreferredVoice(uri); }} className="min-h-14 w-full rounded-2xl border-2 border-border bg-card px-3 text-lg">
          <option value="">Automático — priorizar voz feminina</option>
          {voices.map((voice) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>)}
        </select>
        <p className="text-lg">O modo automático prioriza vozes femininas em português. Você também pode escolher e ouvir a que preferir.</p>
        {!supported && <p className="text-lg">Este navegador não oferece narração por voz.</p>}
        {supported && voices.length === 0 && <p className="text-lg">A lista depende das vozes de português instaladas no aparelho. Enquanto carrega, usamos a voz padrão disponível.</p>}
        <button disabled={!supported || !progress.sound} onClick={() => audio.speak("Olá, amiguinha! Que alegria ter você aqui! Vamos ajudar os bichinhos e viver uma aventura juntas?")} className="btn-game px-4 py-3 text-xl disabled:opacity-50" style={btn("var(--turquoise)")}><GameText text="🔊 Ouvir esta voz" /></button>
        {!progress.sound && <p className="text-lg">Ative o som no botão do alto para ouvir o teste.</p>}
      </div>
      <div className="card-game flex w-full max-w-lg flex-col items-center gap-4 p-4 text-center">
        <h3 className="font-display text-2xl font-bold">Progresso deste aparelho</h3>
        <p className="text-xl"><GameText text="⭐ " />{totalStars(progress)} estrelas · <GameText text="🏅" /> {progress.medals.length} medalhas</p>
        <button onClick={onReset} className="btn-game px-4 py-3 text-xl" style={btn("var(--coral)")}><GameText text="🔄 Zerar jogos e pontuações" /></button>
      </div>
      <a href="/illustrations/credits.html" target="_blank" rel="noreferrer" className="text-sm underline">Créditos das ilustrações</a>
    </Centered>
  );
}
