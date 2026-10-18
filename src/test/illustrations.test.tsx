import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MISSIONS, heroById, type Mission } from "@/game/data";
import { ILLUSTRATIONS } from "@/game/illustrations";
import { GameText } from "@/components/game/GameText";
import { KittenGame } from "@/components/game/minigames/KittenGame";
import { FireGame } from "@/components/game/minigames/FireGame";
import { VetGame } from "@/components/game/minigames/VetGame";
import { BridgeGame } from "@/components/game/minigames/BridgeGame";
import { ParkGame } from "@/components/game/minigames/ParkGame";
import { GardenGame } from "@/components/game/minigames/GardenGame";
import { RiverGame } from "@/components/game/minigames/RiverGame";
import { MemoryGame } from "@/components/game/minigames/MemoryGame";
import { ChallengeGame } from "@/components/game/minigames/ChallengeGame";
import type { MiniGameProps } from "@/components/game/minigames/types";
vi.mock("@/game/audio", () => ({ audio: { sfx: vi.fn(), speak: vi.fn() } }));
beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.clearAllTimers(); vi.useRealTimers(); });
const games: Record<Mission["game"], (props: MiniGameProps) => React.ReactElement> = { kitten: KittenGame, fire: FireGame, vet: VetGame, bridge: BridgeGame, park: ParkGame, garden: GardenGame, river: RiverGame, memory: MemoryGame, challenge: ChallengeGame };
describe("imagens locais no desktop e celular", () => {
  it("inclui todos os SVGs do catálogo e evita dependências externas", () => {
    expect(Object.keys(ILLUSTRATIONS).length).toBeGreaterThanOrEqual(204);
    for (const path of Object.values(ILLUSTRATIONS)) {
      const svg = readFileSync(join(process.cwd(), "public", path), "utf8");
      expect(svg.startsWith("<svg")).toBe(true);
      expect(svg).not.toMatch(/<script|<foreignObject|(?:href|src)=["']https?:/i);
    }
  });
  it("troca emojis compostos por imagens sem perder o texto ou as alternativas", () => {
    const { container } = render(<GameText text="Resgate 🧑‍🚀 com ⭐!" />);
    expect(container.textContent).toBe("Resgate  com !");
    expect([...container.querySelectorAll("img")].map((img) => img.alt)).toEqual(["🧑‍🚀", "⭐"]);
  });
  it.each(MISSIONS)("abre $id com imagens presentes no pacote", (mission) => {
    const Component = games[mission.game];
    const { container } = render(<Component mission={mission} hero={heroById(mission.hero)} onDone={vi.fn()} />);
    const images = container.querySelectorAll("img, image");
    expect(images.length).toBeGreaterThan(0);
    for (const image of images) {
      const path = image.getAttribute("src") ?? image.getAttribute("href");
      expect(path).toMatch(/^\/illustrations\/[a-f0-9-]+\.svg$/);
      expect(existsSync(join(process.cwd(), "public", path!))).toBe(true);
    }
  });
});
