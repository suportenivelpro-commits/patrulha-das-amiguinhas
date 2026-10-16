import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FireGame } from "@/components/game/minigames/FireGame";
import { HEROES } from "@/game/data";

vi.mock("@/game/audio", () => ({ audio: { sfx: vi.fn(), speak: vi.fn() } }));

class TestPointerEvent extends MouseEvent {
  readonly pointerId: number;
  readonly isPrimary: boolean;
  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
    this.isPrimary = init.isPrimary ?? true;
  }
}

function setup() {
  const onDone = vi.fn();
  render(<FireGame hero={HEROES[0]!} onDone={onDone} />);
  const board = screen.getByLabelText("Área para apagar o fogo");
  vi.spyOn(board, "getBoundingClientRect").mockReturnValue({
    left: 0, top: 0, width: 360, height: 480, right: 360, bottom: 480,
    x: 0, y: 0, toJSON: () => ({}),
  });
  return { board, onDone };
}

function pointAt(flame: HTMLElement) {
  return {
    pointerId: 1, button: 0, isPrimary: true,
    clientX: parseFloat(flame.style.left) * 3.6,
    clientY: parseFloat(flame.style.top) * 4.8,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("PointerEvent", TestPointerEvent);
});
afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Fire mission touch controls", () => {
  it("keeps extinguishing the visible flame while the finger moves continuously", () => {
    const { board } = setup();
    const flame = screen.getAllByRole("img", { name: /Foco de fogo/ })[0]!;
    const label = flame.getAttribute("aria-label")!;
    const point = pointAt(flame);
    fireEvent.pointerDown(board, point);
    // Finger movements arrive faster than the watering interval (60 ms).
    for (let i = 0; i < 35; i++) {
      fireEvent.pointerMove(board, { ...point, clientX: point.clientX + i % 2 });
      act(() => { vi.advanceTimersByTime(20); });
    }
    expect(screen.queryByRole("img", { name: label })).toBeNull();
    fireEvent.pointerUp(board, point);
  });

  it.each(["pointerUp", "pointerCancel", "lostPointerCapture"] as const)("stops watering after %s", (event) => {
    const { board } = setup();
    const flame = screen.getAllByRole("img", { name: /Foco de fogo/ })[0]!;
    const point = pointAt(flame);
    fireEvent.pointerDown(board, point);
    act(() => { vi.advanceTimersByTime(120); });
    const scale = (flame.firstElementChild as HTMLElement).style.transform;
    fireEvent[event](board, point);
    act(() => { vi.advanceTimersByTime(1200); });
    expect((flame.firstElementChild as HTMLElement).style.transform).toBe(scale);
  });

  it("finishes the mission once after all four flames are extinguished", () => {
    const { board, onDone } = setup();
    const flames = screen.getAllByRole("img", { name: /Foco de fogo/ });
    for (const flame of flames) {
      const point = pointAt(flame);
      fireEvent.pointerDown(board, point);
      act(() => { vi.advanceTimersByTime(600); });
      fireEvent.pointerUp(board, point);
    }
    expect(screen.queryAllByRole("img", { name: /Foco de fogo/ })).toHaveLength(0);
    act(() => { vi.advanceTimersByTime(1800); });
    expect(onDone).toHaveBeenCalledExactlyOnceWith(0);
    act(() => { vi.advanceTimersByTime(3000); });
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
