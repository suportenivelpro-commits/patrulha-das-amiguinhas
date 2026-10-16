import { CHAPTERS, MISSIONS } from "./data";

export interface Progress {
  stars: Record<string, number>;
  medals: string[];
  sound: boolean;
}
export const STORAGE_KEY = "patrulha-amiguinhas-v1";
export const emptyProgress = (): Progress => ({ stars: {}, medals: [], sound: true });

/** Estrelas gentis: 0 erros = 3, até 2 = 2, mais = 1. Nunca zero. */
export function starsFor(mistakes: number) {
  return mistakes <= 0 ? 3 : mistakes <= 2 ? 2 : 1;
}
export const totalStars = (p: Progress) => Object.values(p.stars).reduce((a, b) => a + b, 0);

/** As duas primeiras missões começam abertas; cada missão concluída abre a próxima. */
export function isUnlocked(p: Progress, index: number) {
  return index < 2 || (p.stars[MISSIONS[index - 1]?.id] ?? 0) > 0;
}

export function applyResult(p: Progress, missionId: string, stars: number) {
  const next: Progress = { ...p, stars: { ...p.stars, [missionId]: Math.max(p.stars[missionId] ?? 0, stars) }, medals: [...p.medals] };
  const earned: string[] = [];
  const give = (id: string) => { if (!next.medals.includes(id)) { next.medals.push(id); earned.push(id); } };
  give(`m-${missionId}`);
  give("primeira");
  if (totalStars(next) >= 10) give("estrelas10");
  if (MISSIONS.every((m) => next.stars[m.id] === 3)) give("perfeita");
  for (const c of CHAPTERS) if (c.missions.every((id) => (next.stars[id] ?? 0) > 0)) give(c.medal);
  return { next, earned };
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptyProgress(), ...JSON.parse(raw) } : emptyProgress();
  } catch { return emptyProgress(); }
}
export function saveProgress(p: Progress) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}
