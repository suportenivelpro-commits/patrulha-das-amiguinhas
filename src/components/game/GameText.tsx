import { Fragment } from "react";
import { ILLUSTRATIONS } from "@/game/illustrations";

const escaped = Object.keys(ILLUSTRATIONS).sort((a, b) => b.length - a.length).map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
const illustrationsPattern = new RegExp(`(${escaped.join("|")})`, "u");

/** Local artwork renders consistently even when a computer has no emoji font. */
export function GameText({ text }: { text: string }) {
  return <>{text.split(illustrationsPattern).map((part, index) => ILLUSTRATIONS[part]
    ? <img key={index} className="game-illustration" src={ILLUSTRATIONS[part]} alt={part} draggable={false} width={36} height={36} />
    : <Fragment key={index}>{part}</Fragment>)}</>;
}
