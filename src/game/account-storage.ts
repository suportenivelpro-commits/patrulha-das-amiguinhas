let accountId: string | null = null;
export const LOCAL_SAVE_EVENT = "patrulha-local-save";
export const CLOUD_LOAD_EVENT = "patrulha-cloud-load";
export function setAccountScope(id: string | null) { accountId = id; }
export function getAccountScope() { return accountId; }
export function scopedKey(base: string) { return accountId ? `${base}:${accountId}` : base; }
export function notifyLocalSave() { if (typeof window !== "undefined") window.dispatchEvent(new Event(LOCAL_SAVE_EVENT)); }
export function notifyCloudLoad() { if (typeof window !== "undefined") window.dispatchEvent(new Event(CLOUD_LOAD_EVENT)); }
