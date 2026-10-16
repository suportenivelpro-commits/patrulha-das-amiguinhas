import type { Hero } from "@/game/data";

export function Puppy({ hero, size = 120, mood = "happy", className = "" }: { hero: Hero; size?: number; mood?: "happy" | "wow" | "think"; className?: string }) {
  return (
    <svg viewBox="0 0 120 130" width={size} height={size * 1.08} className={className} aria-label={hero.name}>
      <ellipse cx="60" cy="124" rx="34" ry="5" fill="#000" opacity=".08" />
      {/* corpo + uniforme */}
      <path d="M30 128 Q30 96 60 94 Q90 96 90 128 Z" fill={hero.color} />
      <path d="M48 96 L60 110 L72 96" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="114" r="8" fill="#fff" />
      <text x="60" y="118" fontSize="10" textAnchor="middle">{hero.badge}</text>
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
      <text x="60" y="37" fontSize="10" textAnchor="middle">{hero.badge}</text>
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

export function Vehicle({ hero, size = 160, className = "" }: { hero: Hero; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 160 100" width={size} height={size * 0.62} className={className} aria-label={hero.vehicle}>
      <ellipse cx="80" cy="94" rx="64" ry="5" fill="#000" opacity=".1" />
      <path d="M14 70 Q14 44 40 42 L58 20 Q62 14 72 14 L108 14 Q118 14 122 24 L130 42 Q148 44 148 66 L148 74 Q148 80 140 80 L22 80 Q14 80 14 74 Z" fill={hero.color} stroke="#fff" strokeWidth="4" />
      <path d="M64 24 L104 24 Q110 24 112 30 L118 42 L56 42 Z" fill="var(--sky)" stroke="#fff" strokeWidth="3" />
      <circle cx="86" cy="58" r="11" fill="#fff" />
      <text x="86" y="63" fontSize="13" textAnchor="middle">{hero.badge}</text>
      <rect x="132" y="50" width="12" height="8" rx="4" fill="var(--sun)" />
      <rect x="70" y="6" width="22" height="9" rx="4" fill="var(--rose)" />
      <circle cx="44" cy="80" r="14" fill="#4a3550" /><circle cx="44" cy="80" r="6" fill="#fff" />
      <circle cx="122" cy="80" r="14" fill="#4a3550" /><circle cx="122" cy="80" r="6" fill="#fff" />
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
        <span key={i} style={{ fontSize: size, animationDelay: `${i * 0.2}s` }} className={i <= n ? "animate-pop" : "opacity-25 grayscale"}>⭐</span>
      ))}
    </div>
  );
}
