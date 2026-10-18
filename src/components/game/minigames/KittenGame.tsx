import { GameText } from "../GameText";
import { useRef, useState } from "react";
import { Drag, Hint, shuffle, useFeedback } from "../common";
import { Puppy } from "../art";
import { audio } from "@/game/audio";
import type { MiniGameProps } from "./types";

const TOOLS = [
  { id: "escada", e: "🪜", ok: true },
  { id: "balao", e: "🎈", ok: false },
  { id: "balde", e: "🪣", ok: false },
];
const RUNGS = 5;

export function KittenGame({ hero, onDone }: MiniGameProps) {
  const fb = useFeedback();
  const mistakes = useRef(0);
  const [tools] = useState(() => shuffle(TOOLS));
  const [stage, setStage] = useState<"tool" | "climb" | "done">("tool");
  const [step, setStep] = useState(0);

  const drop = (toolOk: boolean, target: string | null) => {
    if (target !== "arvore") return;
    if (toolOk) { fb.show("good"); setStage("climb"); }
    else { mistakes.current++; fb.show("oops"); }
  };
  const climb = () => {
    audio.sfx("pop");
    const n = step + 1;
    setStep(n);
    if (n >= RUNGS) { setStage("done"); fb.show("good"); setTimeout(() => onDone(mistakes.current), 1800); }
  };
  const heroBottom = stage === "tool" ? 4 : 4 + (step / RUNGS) * 52;

  return (
    <div className="flex h-full flex-col gap-3">
      {fb.node}
      <Hint icon={stage === "tool" ? "🪜" : "👆"} text={stage === "tool" ? "Arraste a ferramenta certa até a árvore!" : stage === "climb" ? "Toque nos degraus para subir!" : "O gatinho está salvo!"} />
      <div data-drop="arvore" className="card-game relative flex-1 overflow-hidden bg-sky-grad">
        {/* árvore */}
        <div className="absolute bottom-0 left-1/2 h-[45%] w-10 -translate-x-1/2 rounded-t-lg" style={{ background: "#b07a52" }} />
        <div className="absolute left-1/2 top-[8%] h-[46%] w-[60%] max-w-80 -translate-x-1/2 rounded-full" style={{ background: "var(--grass)" }} />
        <div className="absolute left-[30%] top-[18%] h-24 w-24 rounded-full opacity-80" style={{ background: "var(--mint)" }} />
        <div className={`absolute left-1/2 top-[12%] -translate-x-1/2 text-6xl transition-all duration-700 ${stage === "done" ? "translate-y-[30vh] scale-110" : "animate-wiggle"}`} style={{ animationIterationCount: stage === "done" ? 1 : "infinite", animationDuration: "1.8s" }}><GameText text="🐱" /></div>
        {stage !== "tool" && (
          <div className="absolute bottom-0 left-[58%] flex h-[62%] w-16 flex-col-reverse justify-between rounded-md border-x-8 py-2" style={{ borderColor: "var(--sun)" }}>
            {Array.from({ length: RUNGS }, (_, i) => (
              <button key={i} disabled={stage !== "climb" || i !== step} onClick={climb} className={`mx-auto h-4 w-full rounded ${i === step && stage === "climb" ? "animate-pulse-big" : ""}`} style={{ background: i < step ? "var(--mint)" : i === step ? "var(--rose)" : "var(--sun)", minHeight: 18 }} aria-label={`Degrau ${i + 1}`} />
            ))}
          </div>
        )}
        <div className="absolute left-[62%] transition-all duration-500" style={{ bottom: `${heroBottom}%` }}>
          <Puppy hero={hero} size={86} mood={stage === "done" ? "wow" : "happy"} />
        </div>
        {stage === "climb" && step < RUNGS && (
          <button onClick={climb} className="btn-game absolute bottom-4 left-4 px-6 py-4 text-xl" style={{ ["--btn" as string]: "var(--turquoise)" }}><GameText text="⬆️ Subir" /></button>
        )}
      </div>
      {stage === "tool" && (
        <div className="card-game flex justify-center gap-6 p-3">
          {tools.map((t) => (
            <Drag key={t.id} onDrop={(tg) => drop(t.ok, tg)} onTap={() => drop(t.ok, "arvore")}>
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted text-5xl sm:h-24 sm:w-24"><GameText text={t.e} /></div>
            </Drag>
          ))}
        </div>
      )}
    </div>
  );
}
