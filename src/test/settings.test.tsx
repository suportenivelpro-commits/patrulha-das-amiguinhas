import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Game } from "@/components/game/Game";
import { emptyProgress, loadProgress, saveProgress } from "@/game/progress";

vi.mock("@/game/audio", () => ({ audio: {
  sfx: vi.fn(), speak: vi.fn(), setEnabled: vi.fn(), startMusic: vi.fn(), stopMusic: vi.fn(), stopSpeaking: vi.fn(),
  getVoices: vi.fn(() => []), getPreferredVoice: vi.fn(() => ""), setPreferredVoice: vi.fn(),
} }));
beforeEach(() => {
  localStorage.clear();
  saveProgress({ ...emptyProgress(), stars: { gatinho: 3 }, medals: ["m-gatinho"], sound: false });
  localStorage.setItem("patrulha-voz-v1", "voz-escolhida");
});
afterEach(() => { cleanup(); });
function openReset() {
  render(<Game />);
  fireEvent.click(screen.getByRole("button", { name: /Jogar/ }));
  fireEvent.click(screen.getByRole("button", { name: /Voz e ajustes/ }));
  fireEvent.click(screen.getByRole("button", { name: /Zerar jogos e pontuações/ }));
}

describe("confirmação de reinício", () => {
  it("permite cancelar sem perder as pontuações", () => {
    openReset();
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(loadProgress().stars.gatinho).toBe(3);
    expect(loadProgress().medals).toContain("m-gatinho");
    expect(screen.getByText(/3 estrelas/)).toBeInTheDocument();
  });
  it("reinicia somente depois da confirmação e retorna à central", () => {
    openReset();
    expect(loadProgress().stars.gatinho).toBe(3);
    fireEvent.click(screen.getByRole("button", { name: "Sim, zerar progresso" }));
    expect(loadProgress()).toEqual({ stars: {}, medals: [], sound: false });
    expect(localStorage.getItem("patrulha-voz-v1")).toBe("voz-escolhida");
    expect(screen.getByRole("heading", { name: "Central de Missões" })).toBeInTheDocument();
  });
});
