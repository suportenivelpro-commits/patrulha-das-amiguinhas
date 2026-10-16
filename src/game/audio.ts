import { chooseNarrationVoice, isPortugueseVoice, narrationText, VOICE_STORAGE_KEY } from "./narration";

// Efeitos sintetizados e narração com as vozes disponíveis no aparelho.
type Sfx = "tap" | "good" | "oops" | "win" | "siren" | "splash" | "pop" | "star";

class GameAudio {
  enabled = true;
  private ctx: AudioContext | null = null;
  private music: ReturnType<typeof setInterval> | null = null;
  private waitingForVoice: (() => void) | null = null;

  private ac() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!C) return null;
      this.ctx = new C();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }
  private tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.15, delay = 0) {
    const ctx = this.ac();
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  sfx(name: Sfx) {
    if (!this.enabled) return;
    const T = this.tone.bind(this);
    switch (name) {
      case "tap": T(660, 0.08, "triangle", 0.1); break;
      case "pop": T(880, 0.1, "sine", 0.12); T(1320, 0.08, "sine", 0.08, 0.05); break;
      case "good": [523, 659, 784].forEach((f, i) => T(f, 0.18, "triangle", 0.14, i * 0.08)); break;
      case "oops": T(392, 0.18, "sine", 0.1); T(330, 0.25, "sine", 0.1, 0.12); break;
      case "star": T(1046, 0.2, "triangle", 0.12); T(1568, 0.25, "sine", 0.08, 0.06); break;
      case "splash": T(300 + Math.random() * 200, 0.06, "sawtooth", 0.03); break;
      case "siren": [0, 0.35, 0.7].forEach((d) => { T(740, 0.17, "triangle", 0.1, d); T(988, 0.17, "triangle", 0.1, d + 0.17); }); break;
      case "win": [523, 659, 784, 1046, 784, 1046].forEach((f, i) => T(f, 0.25, "triangle", 0.14, i * 0.12)); break;
    }
  }
  startMusic() {
    if (this.music || !this.enabled) return;
    const notes = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1046, 880, 784, 659, 587];
    let i = 0;
    this.music = setInterval(() => {
      if (!this.enabled) return;
      this.tone(notes[i % notes.length], 0.3, "sine", 0.035);
      if (i % 4 === 0) this.tone(notes[i % notes.length] / 2, 0.6, "triangle", 0.03);
      i++;
    }, 340);
  }
  stopMusic() { if (this.music) clearInterval(this.music); this.music = null; }
  getVoices() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
    return window.speechSynthesis.getVoices().filter(isPortugueseVoice);
  }
  getPreferredVoice() {
    try { return localStorage.getItem(VOICE_STORAGE_KEY) ?? ""; } catch { return ""; }
  }
  setPreferredVoice(uri: string) {
    this.stopSpeaking();
    try { if (uri) localStorage.setItem(VOICE_STORAGE_KEY, uri); else localStorage.removeItem(VOICE_STORAGE_KEY); } catch { /* Optional preference. */ }
  }
  stopSpeaking() {
    this.waitingForVoice?.();
    this.waitingForVoice = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }
  speak(text: string) {
    if (!this.enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const clean = narrationText(text);
    if (!clean) return;
    this.stopSpeaking();
    const synth = window.speechSynthesis;
    let started = false;
    let fallback: ReturnType<typeof setTimeout> | null = null;
    const cleanup = () => {
      started = true;
      if (fallback !== null) clearTimeout(fallback);
      synth.removeEventListener?.("voiceschanged", voicesChanged);
      this.waitingForVoice = null;
    };
    const speakNow = () => {
      if (started || !this.enabled) return;
      started = true;
      cleanup();
      const voice = chooseNarrationVoice(synth.getVoices(), this.getPreferredVoice());
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = voice?.lang || "pt-BR";
      if (voice) utterance.voice = voice;
      // A gentle pitch avoids the old high-pitched robotic effect.
      utterance.pitch = 1.08;
      utterance.rate = 0.95;
      utterance.volume = 1;
      synth.speak(utterance);
    };
    const voicesChanged = () => { if (synth.getVoices().length > 0) speakNow(); };
    if (synth.getVoices().length > 0) { speakNow(); return; }
    synth.addEventListener?.("voiceschanged", voicesChanged);
    fallback = setTimeout(speakNow, 500);
    this.waitingForVoice = cleanup;
  }
  setEnabled(on: boolean) {
    this.enabled = on;
    if (!on) { this.stopMusic(); this.stopSpeaking(); }
  }
}
export const audio = new GameAudio();
