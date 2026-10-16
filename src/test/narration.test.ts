import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { audio } from "@/game/audio";
import { chooseNarrationVoice } from "@/game/narration";

const female = { name: "Microsoft Francisca Online Natural", lang: "pt-BR", voiceURI: "francisca", localService: false, default: false } as SpeechSynthesisVoice;
const male = { name: "Microsoft Antonio", lang: "pt-BR", voiceURI: "antonio", localService: true, default: true } as SpeechSynthesisVoice;
class TestUtterance {
  text: string;
  voice: SpeechSynthesisVoice | null = null;
  lang = "";
  pitch = 1;
  rate = 1;
  volume = 1;
  constructor(text: string) { this.text = text; }
}
let voices: SpeechSynthesisVoice[];
let events: EventTarget;
let synth: { getVoices: ReturnType<typeof vi.fn>; speak: ReturnType<typeof vi.fn>; cancel: ReturnType<typeof vi.fn>; addEventListener: EventTarget["addEventListener"]; removeEventListener: EventTarget["removeEventListener"] };
beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  voices = [male, female];
  events = new EventTarget();
  synth = { getVoices: vi.fn(() => voices), speak: vi.fn(), cancel: vi.fn(), addEventListener: events.addEventListener.bind(events), removeEventListener: events.removeEventListener.bind(events) };
  vi.stubGlobal("speechSynthesis", synth);
  vi.stubGlobal("SpeechSynthesisUtterance", TestUtterance);
  audio.setEnabled(true);
});
afterEach(() => {
  audio.stopSpeaking(); audio.stopMusic();
  vi.clearAllTimers(); vi.useRealTimers(); vi.unstubAllGlobals();
});

describe("narração infantil", () => {
  it("prioriza uma voz feminina natural em português e suaviza a entonação", () => {
    audio.speak("Olá! Vamos brincar? 🌟");
    const utterance = synth.speak.mock.calls[0]![0] as TestUtterance;
    expect(utterance.voice).toBe(female);
    expect(utterance.lang).toBe("pt-BR");
    expect(utterance.pitch).toBe(1.08);
    expect(utterance.rate).toBe(0.95);
    expect(utterance.text).toBe("Olá! Vamos brincar?");
  });
  it("respeita a voz escolhida pela pessoa", () => {
    audio.setPreferredVoice(male.voiceURI);
    audio.speak("Teste de voz");
    expect(synth.speak.mock.calls[0]![0].voice).toBe(male);
    expect(audio.getPreferredVoice()).toBe(male.voiceURI);
    audio.setPreferredVoice("");
    expect(chooseNarrationVoice(voices)).toBe(female);
  });
  it("aguarda o carregamento das vozes e não repete a fala", () => {
    voices = [];
    audio.speak("Uma nova aventura!");
    expect(synth.speak).not.toHaveBeenCalled();
    voices = [female];
    events.dispatchEvent(new Event("voiceschanged"));
    vi.advanceTimersByTime(1000);
    expect(synth.speak).toHaveBeenCalledTimes(1);
    expect(synth.speak.mock.calls[0]![0].voice).toBe(female);
  });
  it("cancela uma fala pendente quando o som é desligado", () => {
    voices = [];
    audio.speak("Aguarde");
    audio.setEnabled(false);
    voices = [female];
    events.dispatchEvent(new Event("voiceschanged"));
    vi.advanceTimersByTime(1000);
    expect(synth.speak).not.toHaveBeenCalled();
  });
  it("usa o idioma português sem forçar uma voz estrangeira quando não há voz compatível", () => {
    voices = [{ ...female, lang: "en-US", voiceURI: "english" }];
    audio.speak("Vamos ajudar!");
    const utterance = synth.speak.mock.calls[0]![0] as TestUtterance;
    expect(utterance.voice).toBeNull();
    expect(utterance.lang).toBe("pt-BR");
  });
});
