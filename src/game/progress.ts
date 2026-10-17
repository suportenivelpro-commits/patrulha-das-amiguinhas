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

/** O capítulo seguinte abre quando todas as missões do anterior foram concluídas. */
export function isChapterUnlocked(p: Progress, index: number) {
  if (!CHAPTERS[index]) return false;
  return index === 0 || CHAPTERS[index - 1]!.missions.every((id) => (p.stars[id] ?? 0) > 0);
}

/** Mantém as missões já jogadas e a abertura gentil das duas primeiras. */
export function isUnlocked(p: Progress, index: number) {
  const mission = MISSIONS[index];
  if (!mission) return false;
  if ((p.stars[mission.id] ?? 0) > 0) return true;
  const chapterIndex = CHAPTERS.findIndex((c) => c.missions.includes(mission.id));
  const chapter = CHAPTERS[chapterIndex];
  if (!chapter || !isChapterUnlocked(p, chapterIndex)) return false;
  const position = chapter.missions.indexOf(mission.id);
  if (position === 0 || (chapterIndex === 0 && position === 1)) return true;
  return (p.stars[chapter.missions[position - 1]!] ?? 0) > 0;
}

export function applyResult(p: Progress, missionId: string, stars: number) {
  const next: Progress = { ...p, stars: { ...p.stars, [missionId]: Math.max(p.stars[missionId] ?? 0, stars) }, medals: [...p.medals] };
  const earned: string[] = [];
  const give = (id: string) => { if (!next.medals.includes(id)) { next.medals.push(id); earned.push(id); } };
  give(`m-${missionId}`);
  give("primeira");
  if (totalStars(next) >= 10) give("estrelas10");
  if (totalStars(next) >= 30) give("estrelas30");
  if (totalStars(next) >= 75) give("estrelas75");
  if (totalStars(next) >= 150) give("estrelas150");
  if (MISSIONS.every((mission) => (next.stars[mission.id] ?? 0) > 0)) give("cinquenta");
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

/** Reset only this game's scores and medals, keeping sound and voice preferences. */
export function resetProgress(sound = true): Progress {
  const fresh = { ...emptyProgress(), sound };
  saveProgress(fresh);
  return fresh;
}
