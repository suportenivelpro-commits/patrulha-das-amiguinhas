import { describe, expect, it } from "vitest";
import { cleanBest, cleanMedals, cleanStars, combineSaves, credentialsError, normalizeUsername, parseCloudSave, sameScores } from "@/game/cloud-model";
const base = { stars: { gatinho: 3 }, medals: ["m-gatinho"], epoch: 1, revision: 2, best: 10 };
describe("contas e mesclagem de progresso", () => {
  it("normaliza usuário e valida senha sem aceitar e-mail ou nome completo", () => {
    expect(normalizeUsername("  AMIGUINHA_1 ")).toBe("amiguinha_1");
    expect(credentialsError("amiguinha_1", "senha1234")).toBeNull();
    expect(credentialsError("Ana Maria", "senha1234")).not.toBeNull();
    expect(credentialsError("ana", "123")).not.toBeNull();
    expect(credentialsError("ana", "💫".repeat(20))).not.toBeNull();
  });
  it("filtra missões, medalhas e números inválidos recebidos do cache", () => {
    expect(cleanStars({ gatinho: 3, fogo: 9, memoria: "3", inexistente: 2 })).toEqual({ gatinho: 3 });
    expect(cleanMedals(["cap1", "cap1", "inexistente", null])).toEqual(["cap1"]);
    expect(cleanBest(Infinity)).toBe(0); expect(cleanBest(-1)).toBe(0);
    expect(() => parseCloudSave({})).toThrow();
  });
  it("combina dois aparelhos sem diminuir estrelas ou perder medalhas e recordes", () => {
    const merged = combineSaves(base, { stars: { gatinho: 1, fogo: 2 }, medals: ["m-fogo"], sound: false }, 4);
    expect(merged.stars).toEqual({ gatinho: 3, fogo: 2 });
    expect(merged.medals).toEqual(["m-gatinho", "m-fogo"]);
    expect(merged.best).toBe(10); expect(merged.epoch).toBe(1);
  });
  it("compara o conteúdo independentemente da ordem de propriedades e medalhas", () => {
    expect(sameScores({ stars: { fogo: 2, gatinho: 3 }, medals: ["cap1", "primeira"], best: 2 }, { stars: { gatinho: 3, fogo: 2 }, medals: ["primeira", "cap1"], best: 2 })).toBe(true);
  });
});
