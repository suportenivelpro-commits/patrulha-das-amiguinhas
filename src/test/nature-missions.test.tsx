import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GardenGame } from "@/components/game/minigames/GardenGame";
import { RiverGame } from "@/components/game/minigames/RiverGame";
import { MemoryGame } from "@/components/game/minigames/MemoryGame";
import { HEROES } from "@/game/data";

vi.mock("@/game/audio", () => ({ audio: { sfx: vi.fn(), speak: vi.fn() } }));
beforeEach(() => { vi.useFakeTimers(); vi.spyOn(Math, "random").mockReturnValue(0.999); });
afterEach(() => { cleanup(); vi.clearAllTimers(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("aventuras na natureza", () => {
  it("rega as seis flores e conclui o jardim uma única vez", () => {
    const onDone = vi.fn();
    render(<GardenGame hero={HEROES[2]!} onDone={onDone} />);
    const flowers = screen.getAllByRole("button", { name: /Regar flor/ });
    for (const flower of flowers) {
      fireEvent.click(flower); fireEvent.click(flower); fireEvent.click(flower);
      expect(flower).toBeDisabled();
    }
    expect(screen.getByRole("status")).toHaveTextContent("6/6");
    act(() => { vi.advanceTimersByTime(5000); });
    expect(onDone).toHaveBeenCalledExactlyOnceWith(0);
  });
  it("resgata cada patinho somente depois de selecionar e chamar o helicóptero", () => {
    const onDone = vi.fn();
    render(<RiverGame hero={HEROES[1]!} onDone={onDone} />);
    const helicopter = screen.getByRole("button", { name: "Resgatar patinho" });
    expect(helicopter).toBeDisabled();
    for (const duck of screen.getAllByRole("button", { name: /^Patinho/ })) {
      fireEvent.click(duck); fireEvent.click(helicopter); fireEvent.click(helicopter);
      expect(duck).toBeDisabled();
    }
    expect(screen.getByRole("status")).toHaveTextContent("6/6");
    act(() => { vi.advanceTimersByTime(5000); });
    expect(onDone).toHaveBeenCalledExactlyOnceWith(0);
  });
  it("bloqueia a terceira carta durante um erro e permite completar os quatro pares", () => {
    const onDone = vi.fn();
    render(<MemoryGame hero={HEROES[0]!} onDone={onDone} />);
    fireEvent.click(screen.getByRole("button", { name: "Carta 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Carta 3" }));
    expect(screen.getByRole("button", { name: "Carta 5" })).toBeDisabled();
    act(() => { vi.advanceTimersByTime(900); });
    for (let card = 1; card <= 8; card += 2) {
      fireEvent.click(screen.getByRole("button", { name: `Carta ${card}` }));
      fireEvent.click(screen.getByRole("button", { name: `Carta ${card + 1}` }));
    }
    expect(screen.getByRole("status")).toHaveTextContent("4/4");
    act(() => { vi.advanceTimersByTime(5000); });
    expect(onDone).toHaveBeenCalledExactlyOnceWith(1);
  });
});
