export interface RoadObject { id: number; lane: number; y: number; kind: "cone" | "star" }
export interface DriveState { tick: number; objects: RoadObject[]; stars: number; bumps: number; done: boolean }
export interface DriveResult { stars: number; bumps: number }
export const initialDrive = (): DriveState => ({ tick: 0, objects: [], stars: 0, bumps: 0, done: false });
export const moveLane = (lane: number, direction: number) => Math.max(0, Math.min(2, lane + direction));
/** One simulation tick. Rendering and sounds never run inside state updaters. */
export function advanceDrive(state: DriveState, lane: number, durationTicks: number, arcade: boolean, random = Math.random): DriveState {
  if (state.done) return state;
  const tick = state.tick + 1;
  let objects = state.objects.map((item) => ({ ...item, y: item.y + 1.6 })).filter((item) => item.y < 110);
  if (tick % (arcade ? 14 : 22) === 0) objects.push({ id: tick, lane: Math.floor(random() * 3), y: -10, kind: random() < (arcade ? 0.75 : 0.45) ? "star" : "cone" });
  const hits = objects.filter((item) => item.lane === lane && item.y >= 72 && item.y <= 90);
  objects = objects.filter((item) => !hits.includes(item));
  return { tick, objects, stars: state.stars + hits.filter((item) => item.kind === "star").length, bumps: state.bumps + hits.filter((item) => item.kind === "cone").length, done: tick >= durationTicks };
}
const SCORE_KEY = "patrulha-corrida-v1";
export function loadDriveBest(): number {
  try { const value = Number(localStorage.getItem(SCORE_KEY)); return Number.isSafeInteger(value) && value >= 0 ? value : 0; } catch { return 0; }
}
export function saveDriveBest(stars: number): number {
  const best = Math.max(loadDriveBest(), Number.isSafeInteger(stars) && stars >= 0 ? stars : 0);
  try { localStorage.setItem(SCORE_KEY, String(best)); } catch { /* The round still works if storage is unavailable. */ }
  return best;
}
export function resetDriveBest() { try { localStorage.removeItem(SCORE_KEY); } catch { /* Storage may be unavailable. */ } }
