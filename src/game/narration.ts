export const VOICE_STORAGE_KEY = "patrulha-voz-v1";

export interface NarrationVoice {
  name: string;
  lang: string;
  voiceURI: string;
}

export function isPortugueseVoice(voice: NarrationVoice) {
  return /^pt(?:[-_]|$)/i.test(voice.lang);
}

/** The browser provides no gender field; rank known voice names, then allow an explicit choice. */
export function chooseNarrationVoice<T extends NarrationVoice>(voices: T[], preferredURI?: string | null): T | undefined {
  const portuguese = voices.filter(isPortugueseVoice);
  const preferred = portuguese.find((voice) => voice.voiceURI === preferredURI);
  if (preferred) return preferred;
  const score = (voice: NarrationVoice) => {
    const name = voice.name.toLowerCase();
    let value = /^pt[-_]br$/i.test(voice.lang) ? 100 : 60;
    if (/luciana|francisca|fernanda|maria|vit[oó]ria|camila|let[ií]cia|raquel|joana|catarina|female|feminina/.test(name)) value += 60;
    if (/ant[oô]nio|daniel|duarte|ricardo|felipe|male\b/.test(name) && !/female/.test(name)) value -= 50;
    if (/neural|natural|premium|enhanced/.test(name)) value += 20;
    if (/google/.test(name)) value += 10;
    return value;
  };
  return [...portuguese].sort((a, b) => score(b) - score(a))[0];
}

export function narrationText(text: string) {
  return text.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "").replace(/\s+/g, " ").trim();
}
