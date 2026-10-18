import { MEDALS, MISSIONS } from "./data";
import type { Progress } from "./progress";
export interface CloudSave { epoch: number; revision: number; stars: Record<string, number>; medals: string[]; best: number }
export interface SyncMeta { epoch: number; dirty: boolean }
export const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;
export function normalizeUsername(value: string) { return value.trim().toLowerCase(); }
export function credentialsError(username: string, password: string): string | null {
  if (!USERNAME_PATTERN.test(normalizeUsername(username))) return "Use um usuário com 3 a 24 letras sem acento, números ou _.";
  if (password.length < 8 || new TextEncoder().encode(password).length > 72) return "Use uma senha com pelo menos 8 caracteres e no máximo 72 bytes.";
  return null;
}
const missionIds = new Set(MISSIONS.map((mission) => mission.id));
const medalIds = new Set(MEDALS.map((medal) => medal.id));
export function cleanStars(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([id, stars]) => missionIds.has(id) && Number.isInteger(stars) && Number(stars) >= 1 && Number(stars) <= 3));
}
export function cleanMedals(value: unknown): string[] { return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string" && medalIds.has(id)))] : []; }
export function cleanBest(value: unknown): number { return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 1000000 ? value : 0; }
export function parseCloudSave(value: unknown): CloudSave {
  if (!value || typeof value !== "object") throw new Error("O servidor não retornou um progresso válido.");
  const row = value as Record<string, unknown>;
  if (!Number.isSafeInteger(row["epoch"]) || Number(row["epoch"]) < 0 || !Number.isSafeInteger(row["revision"])) throw new Error("O servidor não retornou um progresso válido.");
  return { epoch: Number(row["epoch"]), revision: Number(row["revision"]), stars: cleanStars(row["stars"]), medals: cleanMedals(row["medals"]), best: cleanBest(row["best"]) };
}
export function combineSaves(remote: CloudSave, progress: Progress, best: number): CloudSave {
  const stars = { ...remote.stars };
  for (const [id, value] of Object.entries(cleanStars(progress.stars))) stars[id] = Math.max(stars[id] ?? 0, value);
  return { ...remote, stars, medals: [...new Set([...remote.medals, ...cleanMedals(progress.medals)])], best: Math.max(remote.best, cleanBest(best)) };
}
export function sameScores(a: Pick<CloudSave, "stars" | "medals" | "best">, b: Pick<CloudSave, "stars" | "medals" | "best">): boolean {
  const sorted = (value: typeof a) => JSON.stringify({ stars: Object.entries(value.stars).sort(), medals: [...value.medals].sort(), best: value.best });
  return sorted(a) === sorted(b);
}
