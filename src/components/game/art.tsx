import { ILLUSTRATIONS } from "@/game/illustrations";
import { GameText } from "./GameText";
import type { Hero } from "@/game/data";

export function Puppy({ hero, size = 120, mood = "happy", className = "" }: { hero: Hero; size?: number; mood?: "happy" | "wow" | "think"; className?: string }) {
  return (
    <svg viewBox="0 0 120 130" width={size} height={size * 1.08} className={className} role="img" aria-label={hero.name}>
      <ellipse cx="60" cy="124" rx="34" ry="5" fill="#000" opacity=".08" />
      {/* corpo + uniforme */}
      <path d="M30 128 Q30 96 60 94 Q90 96 90 128 Z" fill={hero.color} />
      <path d="M48 96 L60 110 L72 96" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="114" r="8" fill="#fff" />
      <image href={ILLUSTRATIONS[hero.badge]} x="55" y="109" width="10" height="10" />
      {/* orelhas */}
      <ellipse cx="27" cy="62" rx="12" ry="22" fill={hero.ear} transform="rotate(20 27 62)" />
      <ellipse cx="93" cy="62" rx="12" ry="22" fill={hero.ear} transform="rotate(-20 93 62)" />
      {/* cabeça */}
      <circle cx="60" cy="62" r="33" fill={hero.fur} />
      <ellipse cx="60" cy="77" rx="18" ry="13" fill="#fff" opacity=".85" />
      {/* boné */}
      <path d="M30 50 Q32 20 60 20 Q88 20 90 50 Q60 40 30 50 Z" fill={hero.color} />
      <path d="M30 50 Q60 40 90 50 Q92 55 86 55 Q60 46 34 55 Q28 55 30 50Z" fill="#fff" opacity=".6" />
      <circle cx="60" cy="33" r="8" fill="#fff" />
      <image href={ILLUSTRATIONS[hero.badge]} x="55" y="28" width="10" height="10" />
      {/* rosto */}
      <g>
        <ellipse cx="46" cy="63" rx="6.5" ry={mood === "wow" ? 8 : 7} fill="#3a2440" />
        <ellipse cx="74" cy="63" rx="6.5" ry={mood === "wow" ? 8 : 7} fill="#3a2440" />
        <circle cx="48.5" cy="60" r="2.4" fill="#fff" />
        <circle cx="76.5" cy="60" r="2.4" fill="#fff" />
        <path d="M38 55 l-3 -3 M41 54 l-1 -4 M82 55 l3 -3 M79 54 l1 -4" stroke="#3a2440" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <circle cx="37" cy="74" r="5" fill="var(--rose)" opacity=".55" />
      <circle cx="83" cy="74" r="5" fill="var(--rose)" opacity=".55" />
      <ellipse cx="60" cy="72" rx="5" ry="3.6" fill="#3a2440" />
      {mood === "wow" ? (
        <ellipse cx="60" cy="83" rx="4" ry="5" fill="#7a2f4a" />
      ) : mood === "think" ? (
        <path d="M54 82 Q60 80 66 82" stroke="#3a2440" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <path d="M52 79 Q60 88 68 79" stroke="#3a2440" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M57 83 Q60 90 63 83 Z" fill="var(--rose)" />
        </>
      )}
    </svg>
  );
}

function Wheel({ x, y = 80, radius = 13 }: { x: number; y?: number; radius?: number }) {
  return <g><circle cx={x} cy={y} r={radius} fill="#40364c" /><circle cx={x} cy={y} r={radius * 0.43} fill="#fff" /></g>;
}

export function Vehicle({ hero, size = 160, className = "" }: { hero: Hero; size?: number; className?: string }) {
  const kind = hero.vehicleKind;
  return (
    <svg viewBox="0 0 160 100" width={size} height={size * 0.625} className={className} role="img" aria-label={`${hero.vehicle} de ${hero.name}`}>
      <title>{hero.vehicle}</title>
      <ellipse cx="80" cy="94" rx="64" ry="4" fill="#000" opacity=".1" />
      {kind === "airplane" && <g stroke="#fff" strokeWidth="3" strokeLinejoin="round">
        <path d="M45 51 L67 10 Q72 5 78 11 L97 51 Z" fill="var(--rose)" />
        <path d="M19 55 L9 26 L29 29 L48 55 Z" fill={hero.color} />
        <path d="M12 59 Q34 44 102 45 Q131 43 151 60 Q155 66 146 69 L40 74 Q22 73 12 59Z" fill={hero.color} />
        <path d="M81 56 L46 89 Q43 94 53 94 L109 68 Z" fill="var(--rose)" />
        <path d="M100 47 Q121 45 133 56 L106 56Z" fill="#bceeff" />
        <circle cx="144" cy="61" r="6" fill="var(--sun)" />
        <path d="M150 46 L150 76" stroke="#5a4567" strokeWidth="5" strokeLinecap="round" />
        <circle cx="43" cy="59" r="7" fill="#fff" stroke="none" />
        <image href={ILLUSTRATIONS["☁️"]} x="38" y="54" width="10" height="10" />
      </g>}
      {kind === "firetruck" && <g stroke="#fff" strokeWidth="3" strokeLinejoin="round">
        <rect x="9" y="42" width="92" height="38" rx="8" fill="#f0676d" />
        <path d="M100 80 V31 H128 L148 49 V80Z" fill={hero.color} />
        <path d="M109 38 H125 L137 51 H109Z" fill="#bceeff" />
        <rect x="16" y="30" width="96" height="10" rx="3" fill="#e9e7f5" stroke="#786984" />
        {[24, 40, 56, 72, 88, 104].map((x) => <path key={x} d={`M${x} 31 V39`} stroke="#786984" strokeWidth="2" />)}
        <circle cx="51" cy="60" r="13" fill="#fff" stroke="#b5485e" strokeWidth="4" />
        <circle cx="51" cy="60" r="6" fill="var(--water)" stroke="none" />
        <rect x="73" y="49" width="19" height="23" rx="3" fill="#ffe6df" />
        <rect x="108" y="22" width="12" height="8" rx="3" fill="#72c9ff" stroke="none" />
        <rect x="121" y="22" width="12" height="8" rx="3" fill="#ffb3c4" stroke="none" />
        <rect x="139" y="60" width="10" height="7" rx="3" fill="var(--sun)" stroke="none" />
        <Wheel x={32} /><Wheel x={124} />
      </g>}
      {kind === "ambulance" && <g stroke="#fff" strokeWidth="3" strokeLinejoin="round">
        <rect x="10" y="25" width="88" height="55" rx="10" fill="#fff" stroke={hero.color} strokeWidth="5" />
        <path d="M98 80 V37 H124 L149 57 V80Z" fill={hero.color} />
        <path d="M107 43 H121 L137 56 H107Z" fill="#d8f6ff" />
        <path d="M14 67 H146" stroke={hero.color} strokeWidth="7" />
        <path d="M53 56 C31 43 43 32 53 41 C63 32 75 43 53 56Z" fill="var(--rose)" stroke="none" />
        <rect x="47" y="14" width="23" height="10" rx="4" fill="var(--rose)" />
        <rect x="136" y="62" width="12" height="7" rx="3" fill="var(--sun)" stroke="none" />
        <Wheel x={33} /><Wheel x={125} />
      </g>}
      {kind === "bulldozer" && <g stroke="#fff" strokeWidth="3" strokeLinejoin="round">
        <rect x="11" y="67" width="96" height="25" rx="12" fill="#4b4050" />
        {[29, 52, 75, 93].map((x) => <circle key={x} cx={x} cy="80" r="6" fill="#ae9b80" stroke="none" />)}
        <path d="M18 67 V46 H47 V25 H87 V67Z" fill={hero.color} />
        <rect x="53" y="31" width="27" height="25" rx="4" fill="#c6f2ff" />
        <rect x="42" y="18" width="51" height="9" rx="4" fill={hero.color} />
        <path d="M94 59 L122 71 L133 55" stroke="#a78038" strokeWidth="9" fill="none" />
        <path d="M125 59 L146 49 L150 83 H122Z" fill={hero.color} />
        <path d="M22 50 H39 M22 57 H39" stroke="#a78038" strokeWidth="3" />
        <circle cx="35" cy="39" r="5" fill="var(--rose)" stroke="none" />
      </g>}
      {kind === "patrol" && <g>
        <path d="M14 70 Q14 44 40 42 L58 20 Q62 14 72 14 L108 14 Q118 14 122 24 L130 42 Q148 44 148 66 L148 74 Q148 80 140 80 L22 80 Q14 80 14 74Z" fill={hero.color} stroke="#fff" strokeWidth="4" />
        <path d="M64 24 L104 24 Q110 24 112 30 L118 42 L56 42Z" fill="var(--sky)" stroke="#fff" strokeWidth="3" />
        <circle cx="86" cy="59" r="12" fill="#fff" />
        <image href={ILLUSTRATIONS["⭐"]} x="78" y="51" width="16" height="16" />
        <rect x="132" y="50" width="12" height="8" rx="4" fill="var(--sun)" />
        <rect x="70" y="5" width="14" height="9" rx="4" fill="var(--rose)" />
        <rect x="85" y="5" width="14" height="9" rx="4" fill="var(--turquoise)" />
        <Wheel x={44} /><Wheel x={122} />
      </g>}
    </svg>
  );
}

export function Cloud({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 60" className={className} style={style} aria-hidden>
      <path d="M20 50 Q0 50 6 34 Q10 20 28 24 Q34 4 58 8 Q76 0 86 18 Q110 14 112 34 Q120 50 100 50 Z" fill="#fff" opacity=".92" />
    </svg>
  );
}

export function Stars({ n, size = 36 }: { n: number; size?: number }) {
  return (
    <div className="flex justify-center gap-1">
      {[1, 2, 3].map((i) => (
        <span key={i} style={{ fontSize: size, animationDelay: `${i * 0.2}s` }} className={i <= n ? "animate-pop" : "opacity-25 grayscale"}><GameText text="⭐" /></span>
      ))}
    </div>
  );
}
