import { StrictMode } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StarArcade } from "@/components/game/StarArcade";
import { DriveGame } from "@/components/game/minigames/DriveGame";
import { HEROES } from "@/game/data";
import { loadDriveBest } from "@/game/drive-engine";
vi.mock("@/game/audio", () => ({ audio: { sfx: vi.fn(), speak: vi.fn() } }));
beforeEach(() => { localStorage.clear(); vi.useFakeTimers(); vi.spyOn(Math, "random").mockReturnValue(0.5); });
afterEach(() => { cleanup(); vi.clearAllTimers(); vi.useRealTimers(); vi.restoreAllMocks(); });
describe("Corrida das Estrelinhas", () => {
  it("oferece as cinco personagens e usa o avião da Mel", () => {
    render(<StarArcade />);
    expect(screen.getAllByRole("button", { name: /^Correr com/ })).toHaveLength(5);
    fireEvent.click(screen.getByRole("button", { name: "Correr com Mel" }));
    expect(screen.getByRole("img", { name: /Avião.*Mel/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Direita" }));
    expect(screen.getByLabelText("Faixa 3")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByLabelText("Faixa 2")).toBeInTheDocument();
  });
  it("pausa o tempo e continua sem reiniciar a partida", () => {
    render(<DriveGame hero={HEROES[0]!} mode="arcade" onDone={vi.fn()} />);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByLabelText("Tempo restante")).toHaveTextContent("59 s");
    fireEvent.click(screen.getByRole("button", { name: "Pausar" }));
    act(() => { vi.advanceTimersByTime(10000); });
    expect(screen.getByLabelText("Tempo restante")).toHaveTextContent("59 s");
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByLabelText("Tempo restante")).toHaveTextContent("58 s");
  });
  it("salva o recorde, permite repetir e trocar de personagem", () => {
    render(<StarArcade />);
    fireEvent.click(screen.getByRole("button", { name: "Correr com Luna" }));
    act(() => { vi.advanceTimersByTime(60000); });
    act(() => { vi.advanceTimersByTime(600); });
    expect(screen.getByRole("heading", { name: "Que corrida divertida!" })).toBeInTheDocument();
    expect(loadDriveBest()).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Jogar novamente" }));
    expect(screen.getByLabelText("Tempo restante")).toHaveTextContent("60 s");
    act(() => { vi.advanceTimersByTime(60000); }); act(() => { vi.advanceTimersByTime(600); });
    fireEvent.click(screen.getByRole("button", { name: "Trocar amiguinha" }));
    expect(screen.getAllByRole("button", { name: /^Correr com/ })).toHaveLength(5);
  });
  it("conclui o trajeto original uma só vez em StrictMode e limpa os timers", () => {
    const onDone = vi.fn();
    const view = render(<StrictMode><DriveGame hero={HEROES[0]!} onDone={onDone} /></StrictMode>);
    act(() => { vi.advanceTimersByTime(9000); }); act(() => { vi.advanceTimersByTime(600); });
    expect(onDone).toHaveBeenCalledTimes(1);
    act(() => { vi.advanceTimersByTime(9000); }); expect(onDone).toHaveBeenCalledTimes(1);
    view.unmount(); expect(vi.getTimerCount()).toBe(0);
  });
});
