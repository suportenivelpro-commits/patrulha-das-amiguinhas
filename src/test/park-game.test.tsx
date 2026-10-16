import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ParkGame } from "@/components/game/minigames/ParkGame";
import { HEROES } from "@/game/data";

vi.mock("@/game/audio", () => ({ audio: { sfx: vi.fn(), speak: vi.fn() } }));
const TRASH = ["Copo usado", "Papel usado", "Casca de banana", "Caixinha vazia"];
const TOYS = ["Bola", "Ursinho", "Pipa", "Ioiô"];

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { cleanup(); vi.clearAllTimers(); vi.useRealTimers(); });
function setup() {
  const onDone = vi.fn();
  render(<ParkGame hero={HEROES[0]!} onDone={onDone} />);
  screen.getAllByRole("button", { name: /Revelar item/ }).forEach((bush) => fireEvent.click(bush));
  return onDone;
}
function select(label: string) {
  fireEvent.keyDown(screen.getByRole("button", { name: label }), { key: "Enter" });
}

describe("parque acessível", () => {
  it("permite recolher os seis itens, inclusive os revelados, sem arrastar", () => {
    const onDone = setup();
    const available = [...TRASH, ...TOYS].filter((label) => screen.queryByRole("button", { name: label }));
    expect(available).toHaveLength(6);
    for (const label of available) {
      select(label);
      fireEvent.click(screen.getByRole("button", { name: TRASH.includes(label) ? "Lixeira" : "Cesta de brinquedos" }));
    }
    expect(screen.getByRole("status")).toHaveTextContent("Faltam 0 itens");
    act(() => { vi.advanceTimersByTime(1800); });
    expect(onDone).toHaveBeenCalledExactlyOnceWith(0);
    fireEvent.click(screen.getByRole("button", { name: "Lixeira" }));
    act(() => { vi.advanceTimersByTime(3000); });
    expect(onDone).toHaveBeenCalledTimes(1);
  });
  it("mantém um item disponível quando o cesto escolhido está errado", () => {
    setup();
    const toy = TOYS.find((label) => screen.queryByRole("button", { name: label }))!;
    select(toy);
    fireEvent.click(screen.getByRole("button", { name: "Lixeira" }));
    expect(screen.getByRole("button", { name: toy })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Faltam 6 itens");
    fireEvent.click(screen.getByRole("button", { name: "Cesta de brinquedos" }));
    expect(screen.queryByRole("button", { name: toy })).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("Faltam 5 itens");
  });
});
