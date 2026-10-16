import { createFileRoute } from "@tanstack/react-router";
import { Game } from "@/components/game/Game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Patrulha das Amiguinhas — Missões na Cidade" },
      { name: "description", content: "Jogo infantil de resgate com cachorrinhas heroínas: missões, estrelas e medalhas." },
      { property: "og:title", content: "Patrulha das Amiguinhas — Missões na Cidade" },
      { property: "og:description", content: "Ajude a cidade com Luna, Mel, Bella, Lili e Nina!" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});
