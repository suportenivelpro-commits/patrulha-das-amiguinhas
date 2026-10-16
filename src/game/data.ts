// Conteúdo do jogo: adicione personagens, missões, medalhas e capítulos aqui.
export type HeroId = "luna" | "mel" | "bella" | "lili" | "nina";
export type GameKind = "kitten" | "fire" | "vet" | "bridge" | "park";

export interface Hero {
  id: HeroId;
  name: string;
  role: string;
  personality: string;
  skill: string;
  vehicle: string;
  vehicleIcon: string;
  badge: string;
  color: string; // uniforme
  fur: string;
  ear: string;
  intro: string;
}

export const HEROES: Hero[] = [
  { id: "luna", name: "Luna", role: "Líder", personality: "Corajosa e gentil", skill: "Organiza a equipe", vehicle: "Carro Estrela", vehicleIcon: "⭐", badge: "⭐", color: "var(--lilac)", fur: "#f4dcb6", ear: "#c48a55", intro: "Oi! Eu sou a Luna, a líder da patrulha!" },
  { id: "mel", name: "Mel", role: "Pilota", personality: "Alegre e curiosa", skill: "Voa bem alto", vehicle: "Heli-Brisa", vehicleIcon: "🚁", badge: "☁️", color: "var(--turquoise)", fur: "#eab57d", ear: "#9c6034", intro: "Oi! Eu sou a Mel e adoro voar nas nuvens!" },
  { id: "bella", name: "Bella", role: "Bombeira", personality: "Valente e animada", skill: "Jato de água", vehicle: "Caminhão Bolha", vehicleIcon: "💧", badge: "💧", color: "var(--coral)", fur: "#d8cfe0", ear: "#8a7b98", intro: "Oi! Eu sou a Bella, a bombeira das bolhas!" },
  { id: "lili", name: "Lili", role: "Veterinária", personality: "Carinhosa e calma", skill: "Cuida de bichinhos", vehicle: "Ambulância Coração", vehicleIcon: "💗", badge: "💗", color: "var(--mint)", fur: "#dba78c", ear: "#7f5038", intro: "Oi! Eu sou a Lili e cuido de todos os bichinhos!" },
  { id: "nina", name: "Nina", role: "Construtora", personality: "Esperta e criativa", skill: "Conserta tudo", vehicle: "Trator Faísca", vehicleIcon: "🔧", badge: "🔧", color: "var(--sun)", fur: "#f8ead6", ear: "#e08a48", intro: "Oi! Eu sou a Nina e conserto qualquer coisa!" },
];
export const heroById = (id: HeroId) => HEROES.find((h) => h.id === id)!;

export interface Mission {
  id: string;
  title: string;
  place: string;
  icon: string;
  caller: string;
  call: string;
  hero: HeroId;
  game: GameKind;
  x: number; // posição no mapa (%)
  y: number;
}

export const MISSIONS: Mission[] = [
  { id: "gatinho", title: "Gatinho no Alto", place: "Praça das Árvores", icon: "🌳", caller: "🐱", call: "Socorro! O gatinho Pipoca subiu na árvore e não consegue descer!", hero: "mel", game: "kitten", x: 22, y: 30 },
  { id: "fogo", title: "Foguinho na Padaria", place: "Padaria Docinho", icon: "🧁", caller: "👩‍🍳", call: "Ai, ai! Tem foguinhos na padaria! Precisamos de água!", hero: "bella", game: "fire", x: 76, y: 26 },
  { id: "bichinho", title: "Coelhinho Dodói", place: "Fazenda Girassol", icon: "🌻", caller: "🐰", call: "O coelhinho Fofo não está bem. Alguém pode cuidar dele?", hero: "lili", game: "vet", x: 80, y: 70 },
  { id: "ponte", title: "Ponte Quebrada", place: "Rio Cristal", icon: "🌉", caller: "🦆", call: "Quá quá! A ponte quebrou e ninguém consegue passar!", hero: "nina", game: "bridge", x: 48, y: 76 },
  { id: "parque", title: "Parque Bagunçado", place: "Parque Arco-Íris", icon: "🎠", caller: "🧒", call: "O vento bagunçou o parque todinho! Vamos arrumar?", hero: "luna", game: "park", x: 16, y: 70 },
];

export interface Medal { id: string; icon: string; name: string; color: string }
export const MEDALS: Medal[] = [
  ...MISSIONS.map((m) => ({ id: `m-${m.id}`, icon: m.icon, name: m.title, color: heroById(m.hero).color })),
  { id: "primeira", icon: "🎀", name: "Primeira Missão", color: "var(--rose)" },
  { id: "estrelas10", icon: "🌟", name: "10 Estrelas", color: "var(--sun)" },
  { id: "perfeita", icon: "👑", name: "Tudo Perfeito", color: "var(--lilac)" },
  { id: "cap1", icon: "🏅", name: "Heroínas da Cidade", color: "var(--turquoise)" },
];

// Modo história: capítulos ligam missões e dão uma medalha especial.
export interface Chapter { id: string; title: string; missions: string[]; medal: string }
export const CHAPTERS: Chapter[] = [
  { id: "cap1", title: "Um Dia na Cidade Arco-Íris", missions: MISSIONS.map((m) => m.id), medal: "cap1" },
];
