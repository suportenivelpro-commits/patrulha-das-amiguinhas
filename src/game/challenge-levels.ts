import type { ChallengeLevel } from "./challenge-types";

// Forty-two authored challenges supplement the eight original minigames.
export const CHALLENGE_LEVELS: ChallengeLevel[] = [
  {
    "id": "borboletas",
    "chapterId": "cap2",
    "title": "Borboletas do Bosque",
    "place": "Bosque dos Amigos",
    "icon": "🦋",
    "caller": "🦋",
    "call": "A Mel pode ajudar! Encontre 4 borboletas entre os outros desenhos!",
    "hero": "mel",
    "instruction": "Encontre 4 borboletas entre os outros desenhos!",
    "kind": "search",
    "target": {
      "id": "borboletas",
      "icon": "🦋",
      "label": "Borboletas"
    },
    "distractors": [
      {
        "id": "joaninha",
        "icon": "🐞",
        "label": "Joaninha"
      },
      {
        "id": "abelha",
        "icon": "🐝",
        "label": "Abelha"
      },
      {
        "id": "flor",
        "icon": "🌼",
        "label": "Flor"
      }
    ],
    "needed": 4
  },
  {
    "id": "abelhinhas",
    "chapterId": "cap2",
    "title": "Abelhinhas no Jardim",
    "place": "Bosque dos Amigos",
    "icon": "🐝",
    "caller": "🐝",
    "call": "A Lili pode ajudar! Conte os desenhos e toque no número certo!",
    "hero": "lili",
    "instruction": "Conte os desenhos e toque no número certo!",
    "kind": "count",
    "rounds": [
      {
        "icon": "🐝",
        "label": "Abelhas",
        "count": 3,
        "options": [
          3,
          4,
          2
        ]
      },
      {
        "icon": "🌼",
        "label": "Flores",
        "count": 5,
        "options": [
          6,
          4,
          5
        ]
      },
      {
        "icon": "🐞",
        "label": "Joaninhas",
        "count": 4,
        "options": [
          4,
          5,
          3
        ]
      }
    ]
  },
  {
    "id": "lanche-fazenda",
    "chapterId": "cap3",
    "title": "Lanche dos Bichinhos",
    "place": "Fazenda Girassol",
    "icon": "🥕",
    "caller": "🥕",
    "call": "A Lili pode ajudar! Toque nos desenhos na ordem mostrada, um de cada vez!",
    "hero": "lili",
    "instruction": "Toque nos desenhos na ordem mostrada, um de cada vez!",
    "kind": "sequence",
    "palette": [
      {
        "id": "cenoura",
        "icon": "🥕",
        "label": "Cenoura"
      },
      {
        "id": "maca",
        "icon": "🍎",
        "label": "Maçã"
      },
      {
        "id": "milho",
        "icon": "🌽",
        "label": "Milho"
      }
    ],
    "order": [
      "cenoura",
      "maca",
      "milho",
      "cenoura"
    ]
  },
  {
    "id": "cerca-colorida",
    "chapterId": "cap3",
    "title": "Cerca Colorida",
    "place": "Fazenda Girassol",
    "icon": "🪵",
    "caller": "🪵",
    "call": "A Nina pode ajudar! Olhe a sequência e escolha o desenho que vem depois!",
    "hero": "nina",
    "instruction": "Olhe a sequência e escolha o desenho que vem depois!",
    "kind": "pattern",
    "rounds": [
      {
        "series": [
          {
            "id": "amarelo",
            "icon": "🟨",
            "label": "Amarelo"
          },
          {
            "id": "verde",
            "icon": "🟩",
            "label": "Verde"
          },
          {
            "id": "amarelo",
            "icon": "🟨",
            "label": "Amarelo"
          }
        ],
        "options": [
          {
            "id": "amarelo",
            "icon": "🟨",
            "label": "Amarelo"
          },
          {
            "id": "verde",
            "icon": "🟩",
            "label": "Verde"
          },
          {
            "id": "azul",
            "icon": "🟦",
            "label": "Azul"
          }
        ],
        "answer": "verde"
      },
      {
        "series": [
          {
            "id": "azul",
            "icon": "🟦",
            "label": "Azul"
          },
          {
            "id": "azul",
            "icon": "🟦",
            "label": "Azul"
          },
          {
            "id": "amarelo",
            "icon": "🟨",
            "label": "Amarelo"
          },
          {
            "id": "azul",
            "icon": "🟦",
            "label": "Azul"
          },
          {
            "id": "azul",
            "icon": "🟦",
            "label": "Azul"
          }
        ],
        "options": [
          {
            "id": "amarelo",
            "icon": "🟨",
            "label": "Amarelo"
          },
          {
            "id": "verde",
            "icon": "🟩",
            "label": "Verde"
          },
          {
            "id": "azul",
            "icon": "🟦",
            "label": "Azul"
          }
        ],
        "answer": "amarelo"
      },
      {
        "series": [
          {
            "id": "verde",
            "icon": "🟩",
            "label": "Verde"
          },
          {
            "id": "amarelo",
            "icon": "🟨",
            "label": "Amarelo"
          },
          {
            "id": "azul",
            "icon": "🟦",
            "label": "Azul"
          },
          {
            "id": "verde",
            "icon": "🟩",
            "label": "Verde"
          },
          {
            "id": "amarelo",
            "icon": "🟨",
            "label": "Amarelo"
          }
        ],
        "options": [
          {
            "id": "amarelo",
            "icon": "🟨",
            "label": "Amarelo"
          },
          {
            "id": "verde",
            "icon": "🟩",
            "label": "Verde"
          },
          {
            "id": "azul",
            "icon": "🟦",
            "label": "Azul"
          }
        ],
        "answer": "azul"
      }
    ]
  },
  {
    "id": "colheita",
    "chapterId": "cap3",
    "title": "Colheita da Fazenda",
    "place": "Fazenda Girassol",
    "icon": "🧺",
    "caller": "🧺",
    "call": "A Luna pode ajudar! Toque em um objeto e depois no grupo certo para guardar!",
    "hero": "luna",
    "instruction": "Toque em um objeto e depois no grupo certo para guardar!",
    "kind": "sort",
    "bins": [
      {
        "id": "frutas",
        "icon": "🍎",
        "label": "Frutas"
      },
      {
        "id": "legumes",
        "icon": "🥕",
        "label": "Legumes"
      }
    ],
    "items": [
      {
        "id": "maca",
        "icon": "🍎",
        "label": "Maçã",
        "bin": "frutas"
      },
      {
        "id": "banana",
        "icon": "🍌",
        "label": "Banana",
        "bin": "frutas"
      },
      {
        "id": "uvas",
        "icon": "🍇",
        "label": "Uvas",
        "bin": "frutas"
      },
      {
        "id": "cenoura",
        "icon": "🥕",
        "label": "Cenoura",
        "bin": "legumes"
      },
      {
        "id": "brocolis",
        "icon": "🥦",
        "label": "Brócolis",
        "bin": "legumes"
      },
      {
        "id": "milho",
        "icon": "🌽",
        "label": "Milho",
        "bin": "legumes"
      }
    ]
  },
  {
    "id": "casinhas-animais",
    "chapterId": "cap3",
    "title": "Quem Mora Aqui?",
    "place": "Fazenda Girassol",
    "icon": "🏡",
    "caller": "🏡",
    "call": "A Lili pode ajudar! Toque em um desenho da esquerda e no par da direita!",
    "hero": "lili",
    "instruction": "Toque em um desenho da esquerda e no par da direita!",
    "kind": "pairs",
    "pairs": [
      {
        "id": "par-0",
        "left": {
          "id": "galinha",
          "icon": "🐔",
          "label": "Galinha"
        },
        "right": {
          "id": "ninho",
          "icon": "🪹",
          "label": "Ninho"
        }
      },
      {
        "id": "par-1",
        "left": {
          "id": "cachorrinho",
          "icon": "🐶",
          "label": "Cachorrinho"
        },
        "right": {
          "id": "casinha",
          "icon": "🏠",
          "label": "Casinha"
        }
      },
      {
        "id": "par-2",
        "left": {
          "id": "peixinho",
          "icon": "🐟",
          "label": "Peixinho"
        },
        "right": {
          "id": "agua",
          "icon": "🌊",
          "label": "Água"
        }
      },
      {
        "id": "par-3",
        "left": {
          "id": "abelha",
          "icon": "🐝",
          "label": "Abelha"
        },
        "right": {
          "id": "colmeia",
          "icon": "🍯",
          "label": "Colmeia"
        }
      }
    ]
  },
  {
    "id": "pintinho-perdido",
    "chapterId": "cap3",
    "title": "Pintinho Perdido",
    "place": "Fazenda Girassol",
    "icon": "🐥",
    "caller": "🐥",
    "call": "A Lili pode ajudar! Use as setas para chegar ao resgate, contornando os obstáculos!",
    "hero": "lili",
    "instruction": "Use as setas para chegar ao resgate, contornando os obstáculos!",
    "kind": "route",
    "size": 3,
    "start": 6,
    "goal": 2,
    "walls": [
      1,
      4
    ],
    "player": {
      "id": "ambulancia",
      "icon": "🚑",
      "label": "Ambulância"
    },
    "destination": {
      "id": "pintinho",
      "icon": "🐥",
      "label": "Pintinho"
    },
    "obstacle": {
      "id": "arvore",
      "icon": "🌳",
      "label": "Árvore"
    }
  },
  {
    "id": "farol-praia",
    "chapterId": "cap4",
    "title": "Painel do Farol",
    "place": "Praia das Conchinhas",
    "icon": "🔦",
    "caller": "🔦",
    "call": "A Nina pode ajudar! Toque na peça igual ao espaço que está brilhando para montar!",
    "hero": "nina",
    "instruction": "Toque na peça igual ao espaço que está brilhando para montar!",
    "kind": "build",
    "slots": [
      {
        "id": "peca-0",
        "icon": "🔺",
        "label": "Triângulo"
      },
      {
        "id": "peca-1",
        "icon": "🟦",
        "label": "Quadrado azul"
      },
      {
        "id": "peca-2",
        "icon": "🟨",
        "label": "Quadrado amarelo"
      },
      {
        "id": "peca-3",
        "icon": "⚪",
        "label": "Círculo"
      },
      {
        "id": "peca-4",
        "icon": "⭐",
        "label": "Estrela"
      },
      {
        "id": "peca-5",
        "icon": "🟥",
        "label": "Quadrado vermelho"
      }
    ]
  },
  {
    "id": "conchinhas",
    "chapterId": "cap4",
    "title": "Conchinhas na Areia",
    "place": "Praia das Conchinhas",
    "icon": "🐚",
    "caller": "🐚",
    "call": "A Mel pode ajudar! Encontre 5 conchinhas entre os outros desenhos!",
    "hero": "mel",
    "instruction": "Encontre 5 conchinhas entre os outros desenhos!",
    "kind": "search",
    "target": {
      "id": "conchinhas",
      "icon": "🐚",
      "label": "Conchinhas"
    },
    "distractors": [
      {
        "id": "caranguejo",
        "icon": "🦀",
        "label": "Caranguejo"
      },
      {
        "id": "pedra",
        "icon": "🪨",
        "label": "Pedra"
      },
      {
        "id": "balde",
        "icon": "🪣",
        "label": "Balde"
      }
    ],
    "needed": 5
  },
  {
    "id": "boias-resgate",
    "chapterId": "cap4",
    "title": "Boias do Resgate",
    "place": "Praia das Conchinhas",
    "icon": "🛟",
    "caller": "🛟",
    "call": "A Bella pode ajudar! Toque nos desenhos na ordem mostrada, um de cada vez!",
    "hero": "bella",
    "instruction": "Toque nos desenhos na ordem mostrada, um de cada vez!",
    "kind": "sequence",
    "palette": [
      {
        "id": "vermelho",
        "icon": "🔴",
        "label": "Vermelho"
      },
      {
        "id": "amarelo",
        "icon": "🟡",
        "label": "Amarelo"
      },
      {
        "id": "azul",
        "icon": "🔵",
        "label": "Azul"
      },
      {
        "id": "verde",
        "icon": "🟢",
        "label": "Verde"
      }
    ],
    "order": [
      "azul",
      "vermelho",
      "amarelo",
      "verde",
      "azul"
    ]
  },
  {
    "id": "peixinhos",
    "chapterId": "cap4",
    "title": "Peixinhos na Lagoa",
    "place": "Praia das Conchinhas",
    "icon": "🐠",
    "caller": "🐠",
    "call": "A Lili pode ajudar! Conte os desenhos e toque no número certo!",
    "hero": "lili",
    "instruction": "Conte os desenhos e toque no número certo!",
    "kind": "count",
    "rounds": [
      {
        "icon": "🐠",
        "label": "Peixinhos",
        "count": 2,
        "options": [
          2,
          3,
          1
        ]
      },
      {
        "icon": "🦀",
        "label": "Caranguejos",
        "count": 5,
        "options": [
          6,
          4,
          5
        ]
      },
      {
        "icon": "🐚",
        "label": "Conchinhas",
        "count": 7,
        "options": [
          7,
          8,
          6
        ]
      }
    ]
  },
  {
    "id": "trilha-tartarugas",
    "chapterId": "cap4",
    "title": "Trilha das Tartarugas",
    "place": "Praia das Conchinhas",
    "icon": "🐢",
    "caller": "🐢",
    "call": "A Luna pode ajudar! Olhe a sequência e escolha o desenho que vem depois!",
    "hero": "luna",
    "instruction": "Olhe a sequência e escolha o desenho que vem depois!",
    "kind": "pattern",
    "rounds": [
      {
        "series": [
          {
            "id": "tartaruga",
            "icon": "🐢",
            "label": "Tartaruga"
          },
          {
            "id": "concha",
            "icon": "🐚",
            "label": "Concha"
          },
          {
            "id": "tartaruga",
            "icon": "🐢",
            "label": "Tartaruga"
          }
        ],
        "options": [
          {
            "id": "tartaruga",
            "icon": "🐢",
            "label": "Tartaruga"
          },
          {
            "id": "concha",
            "icon": "🐚",
            "label": "Concha"
          },
          {
            "id": "estrela",
            "icon": "⭐",
            "label": "Estrela"
          }
        ],
        "answer": "concha"
      },
      {
        "series": [
          {
            "id": "estrela",
            "icon": "⭐",
            "label": "Estrela"
          },
          {
            "id": "tartaruga",
            "icon": "🐢",
            "label": "Tartaruga"
          },
          {
            "id": "concha",
            "icon": "🐚",
            "label": "Concha"
          },
          {
            "id": "estrela",
            "icon": "⭐",
            "label": "Estrela"
          },
          {
            "id": "tartaruga",
            "icon": "🐢",
            "label": "Tartaruga"
          }
        ],
        "options": [
          {
            "id": "tartaruga",
            "icon": "🐢",
            "label": "Tartaruga"
          },
          {
            "id": "concha",
            "icon": "🐚",
            "label": "Concha"
          },
          {
            "id": "estrela",
            "icon": "⭐",
            "label": "Estrela"
          }
        ],
        "answer": "concha"
      },
      {
        "series": [
          {
            "id": "concha",
            "icon": "🐚",
            "label": "Concha"
          },
          {
            "id": "concha",
            "icon": "🐚",
            "label": "Concha"
          },
          {
            "id": "estrela",
            "icon": "⭐",
            "label": "Estrela"
          },
          {
            "id": "concha",
            "icon": "🐚",
            "label": "Concha"
          },
          {
            "id": "concha",
            "icon": "🐚",
            "label": "Concha"
          }
        ],
        "options": [
          {
            "id": "tartaruga",
            "icon": "🐢",
            "label": "Tartaruga"
          },
          {
            "id": "concha",
            "icon": "🐚",
            "label": "Concha"
          },
          {
            "id": "estrela",
            "icon": "⭐",
            "label": "Estrela"
          }
        ],
        "answer": "estrela"
      }
    ]
  },
  {
    "id": "mochila-aventura",
    "chapterId": "cap5",
    "title": "Mochila de Aventura",
    "place": "Montanha dos Ventos",
    "icon": "🎒",
    "caller": "🎒",
    "call": "A Luna pode ajudar! Toque em um objeto e depois no grupo certo para guardar!",
    "hero": "luna",
    "instruction": "Toque em um objeto e depois no grupo certo para guardar!",
    "kind": "sort",
    "bins": [
      {
        "id": "seguranca",
        "icon": "🛟",
        "label": "Segurança"
      },
      {
        "id": "lanche",
        "icon": "🍎",
        "label": "Lanche"
      }
    ],
    "items": [
      {
        "id": "capacete",
        "icon": "🪖",
        "label": "Capacete",
        "bin": "seguranca"
      },
      {
        "id": "lanterna",
        "icon": "🔦",
        "label": "Lanterna",
        "bin": "seguranca"
      },
      {
        "id": "luvas",
        "icon": "🧤",
        "label": "Luvas",
        "bin": "seguranca"
      },
      {
        "id": "maca",
        "icon": "🍎",
        "label": "Maçã",
        "bin": "lanche"
      },
      {
        "id": "sanduiche",
        "icon": "🥪",
        "label": "Sanduíche",
        "bin": "lanche"
      },
      {
        "id": "banana",
        "icon": "🍌",
        "label": "Banana",
        "bin": "lanche"
      }
    ]
  },
  {
    "id": "equipamentos-resgate",
    "chapterId": "cap5",
    "title": "Equipamentos do Resgate",
    "place": "Montanha dos Ventos",
    "icon": "🧰",
    "caller": "🧰",
    "call": "A Bella pode ajudar! Toque em um desenho da esquerda e no par da direita!",
    "hero": "bella",
    "instruction": "Toque em um desenho da esquerda e no par da direita!",
    "kind": "pairs",
    "pairs": [
      {
        "id": "par-0",
        "left": {
          "id": "chuva",
          "icon": "🌧️",
          "label": "Chuva"
        },
        "right": {
          "id": "guarda-chuva",
          "icon": "☂️",
          "label": "Guarda-chuva"
        }
      },
      {
        "id": "par-1",
        "left": {
          "id": "sol",
          "icon": "☀️",
          "label": "Sol"
        },
        "right": {
          "id": "bone",
          "icon": "🧢",
          "label": "Boné"
        }
      },
      {
        "id": "par-2",
        "left": {
          "id": "frio",
          "icon": "❄️",
          "label": "Frio"
        },
        "right": {
          "id": "cachecol",
          "icon": "🧣",
          "label": "Cachecol"
        }
      },
      {
        "id": "par-3",
        "left": {
          "id": "noite",
          "icon": "🌙",
          "label": "Noite"
        },
        "right": {
          "id": "lanterna",
          "icon": "🔦",
          "label": "Lanterna"
        }
      }
    ]
  },
  {
    "id": "cabritinho",
    "chapterId": "cap5",
    "title": "Cabritinho no Alto",
    "place": "Montanha dos Ventos",
    "icon": "🐐",
    "caller": "🐐",
    "call": "A Mel pode ajudar! Use as setas para chegar ao resgate, contornando os obstáculos!",
    "hero": "mel",
    "instruction": "Use as setas para chegar ao resgate, contornando os obstáculos!",
    "kind": "route",
    "size": 4,
    "start": 12,
    "goal": 3,
    "walls": [
      1,
      5,
      8,
      10
    ],
    "player": {
      "id": "aviao",
      "icon": "✈️",
      "label": "Avião"
    },
    "destination": {
      "id": "cabritinho",
      "icon": "🐐",
      "label": "Cabritinho"
    },
    "obstacle": {
      "id": "pedra",
      "icon": "🪨",
      "label": "Pedra"
    }
  },
  {
    "id": "passarela",
    "chapterId": "cap5",
    "title": "Passarela da Montanha",
    "place": "Montanha dos Ventos",
    "icon": "🛤️",
    "caller": "🛤️",
    "call": "A Nina pode ajudar! Toque na peça igual ao espaço que está brilhando para montar!",
    "hero": "nina",
    "instruction": "Toque na peça igual ao espaço que está brilhando para montar!",
    "kind": "build",
    "slots": [
      {
        "id": "peca-0",
        "icon": "🟫",
        "label": "Marrom"
      },
      {
        "id": "peca-1",
        "icon": "🟩",
        "label": "Verde"
      },
      {
        "id": "peca-2",
        "icon": "🟧",
        "label": "Laranja"
      },
      {
        "id": "peca-3",
        "icon": "🟪",
        "label": "Roxo"
      },
      {
        "id": "peca-4",
        "icon": "🟥",
        "label": "Vermelho"
      },
      {
        "id": "peca-5",
        "icon": "🟦",
        "label": "Azul"
      }
    ]
  },
  {
    "id": "estrelas-acampamento",
    "chapterId": "cap5",
    "title": "Estrelas no Acampamento",
    "place": "Montanha dos Ventos",
    "icon": "⭐",
    "caller": "⭐",
    "call": "A Mel pode ajudar! Encontre 4 estrelas entre os outros desenhos!",
    "hero": "mel",
    "instruction": "Encontre 4 estrelas entre os outros desenhos!",
    "kind": "search",
    "target": {
      "id": "estrelas",
      "icon": "⭐",
      "label": "Estrelas"
    },
    "distractors": [
      {
        "id": "lua",
        "icon": "🌙",
        "label": "Lua"
      },
      {
        "id": "nuvem",
        "icon": "☁️",
        "label": "Nuvem"
      },
      {
        "id": "barraca",
        "icon": "🏕️",
        "label": "Barraca"
      }
    ],
    "needed": 4
  },
  {
    "id": "luzes-pista",
    "chapterId": "cap6",
    "title": "Luzes da Pista",
    "place": "Aeroporto das Nuvens",
    "icon": "🛬",
    "caller": "🛬",
    "call": "A Mel pode ajudar! Toque nos desenhos na ordem mostrada, um de cada vez!",
    "hero": "mel",
    "instruction": "Toque nos desenhos na ordem mostrada, um de cada vez!",
    "kind": "sequence",
    "palette": [
      {
        "id": "luz-vermelha",
        "icon": "🔴",
        "label": "Luz vermelha"
      },
      {
        "id": "luz-verde",
        "icon": "🟢",
        "label": "Luz verde"
      },
      {
        "id": "luz-azul",
        "icon": "🔵",
        "label": "Luz azul"
      },
      {
        "id": "luz-amarela",
        "icon": "🟡",
        "label": "Luz amarela"
      }
    ],
    "order": [
      "luz-vermelha",
      "luz-amarela",
      "luz-verde",
      "luz-azul",
      "luz-verde"
    ]
  },
  {
    "id": "passageiros",
    "chapterId": "cap6",
    "title": "Passageiros do Avião",
    "place": "Aeroporto das Nuvens",
    "icon": "✈️",
    "caller": "✈️",
    "call": "A Mel pode ajudar! Conte os desenhos e toque no número certo!",
    "hero": "mel",
    "instruction": "Conte os desenhos e toque no número certo!",
    "kind": "count",
    "rounds": [
      {
        "icon": "🧒",
        "label": "Passageiros",
        "count": 4,
        "options": [
          4,
          5,
          3
        ]
      },
      {
        "icon": "🧳",
        "label": "Malas",
        "count": 6,
        "options": [
          7,
          5,
          6
        ]
      },
      {
        "icon": "🎫",
        "label": "Bilhetes",
        "count": 8,
        "options": [
          8,
          9,
          7
        ]
      }
    ]
  },
  {
    "id": "baloes-nuvens",
    "chapterId": "cap6",
    "title": "Balões nas Nuvens",
    "place": "Aeroporto das Nuvens",
    "icon": "🎈",
    "caller": "🎈",
    "call": "A Luna pode ajudar! Olhe a sequência e escolha o desenho que vem depois!",
    "hero": "luna",
    "instruction": "Olhe a sequência e escolha o desenho que vem depois!",
    "kind": "pattern",
    "rounds": [
      {
        "series": [
          {
            "id": "balao",
            "icon": "🎈",
            "label": "Balão"
          },
          {
            "id": "nuvem",
            "icon": "☁️",
            "label": "Nuvem"
          },
          {
            "id": "balao",
            "icon": "🎈",
            "label": "Balão"
          }
        ],
        "options": [
          {
            "id": "balao",
            "icon": "🎈",
            "label": "Balão"
          },
          {
            "id": "nuvem",
            "icon": "☁️",
            "label": "Nuvem"
          },
          {
            "id": "sol",
            "icon": "☀️",
            "label": "Sol"
          }
        ],
        "answer": "nuvem"
      },
      {
        "series": [
          {
            "id": "sol",
            "icon": "☀️",
            "label": "Sol"
          },
          {
            "id": "nuvem",
            "icon": "☁️",
            "label": "Nuvem"
          },
          {
            "id": "nuvem",
            "icon": "☁️",
            "label": "Nuvem"
          },
          {
            "id": "sol",
            "icon": "☀️",
            "label": "Sol"
          },
          {
            "id": "nuvem",
            "icon": "☁️",
            "label": "Nuvem"
          }
        ],
        "options": [
          {
            "id": "balao",
            "icon": "🎈",
            "label": "Balão"
          },
          {
            "id": "nuvem",
            "icon": "☁️",
            "label": "Nuvem"
          },
          {
            "id": "sol",
            "icon": "☀️",
            "label": "Sol"
          }
        ],
        "answer": "nuvem"
      },
      {
        "series": [
          {
            "id": "balao",
            "icon": "🎈",
            "label": "Balão"
          },
          {
            "id": "sol",
            "icon": "☀️",
            "label": "Sol"
          },
          {
            "id": "nuvem",
            "icon": "☁️",
            "label": "Nuvem"
          },
          {
            "id": "balao",
            "icon": "🎈",
            "label": "Balão"
          },
          {
            "id": "sol",
            "icon": "☀️",
            "label": "Sol"
          }
        ],
        "options": [
          {
            "id": "balao",
            "icon": "🎈",
            "label": "Balão"
          },
          {
            "id": "nuvem",
            "icon": "☁️",
            "label": "Nuvem"
          },
          {
            "id": "sol",
            "icon": "☀️",
            "label": "Sol"
          }
        ],
        "answer": "nuvem"
      }
    ]
  },
  {
    "id": "bagagens",
    "chapterId": "cap6",
    "title": "Bagagens no Aeroporto",
    "place": "Aeroporto das Nuvens",
    "icon": "🧳",
    "caller": "🧳",
    "call": "A Luna pode ajudar! Toque em um objeto e depois no grupo certo para guardar!",
    "hero": "luna",
    "instruction": "Toque em um objeto e depois no grupo certo para guardar!",
    "kind": "sort",
    "bins": [
      {
        "id": "bagagens",
        "icon": "🧳",
        "label": "Bagagens"
      },
      {
        "id": "encomendas",
        "icon": "📦",
        "label": "Encomendas"
      }
    ],
    "items": [
      {
        "id": "mochila",
        "icon": "🎒",
        "label": "Mochila",
        "bin": "bagagens"
      },
      {
        "id": "bolsa",
        "icon": "👜",
        "label": "Bolsa",
        "bin": "bagagens"
      },
      {
        "id": "mala-de-mao",
        "icon": "💼",
        "label": "Mala de mão",
        "bin": "bagagens"
      },
      {
        "id": "caixa",
        "icon": "📦",
        "label": "Caixa",
        "bin": "encomendas"
      },
      {
        "id": "carta",
        "icon": "✉️",
        "label": "Carta",
        "bin": "encomendas"
      },
      {
        "id": "pacote-de-presente",
        "icon": "🎁",
        "label": "Pacote de presente",
        "bin": "encomendas"
      }
    ]
  },
  {
    "id": "hangares",
    "chapterId": "cap6",
    "title": "Hangares Coloridos",
    "place": "Aeroporto das Nuvens",
    "icon": "🛩️",
    "caller": "🛩️",
    "call": "A Mel pode ajudar! Toque em um desenho da esquerda e no par da direita!",
    "hero": "mel",
    "instruction": "Toque em um desenho da esquerda e no par da direita!",
    "kind": "pairs",
    "pairs": [
      {
        "id": "par-0",
        "left": {
          "id": "aviao-vermelho",
          "icon": "🔴",
          "label": "Avião vermelho"
        },
        "right": {
          "id": "hangar-vermelho",
          "icon": "🟥",
          "label": "Hangar vermelho"
        }
      },
      {
        "id": "par-1",
        "left": {
          "id": "aviao-azul",
          "icon": "🔵",
          "label": "Avião azul"
        },
        "right": {
          "id": "hangar-azul",
          "icon": "🟦",
          "label": "Hangar azul"
        }
      },
      {
        "id": "par-2",
        "left": {
          "id": "aviao-amarelo",
          "icon": "🟡",
          "label": "Avião amarelo"
        },
        "right": {
          "id": "hangar-amarelo",
          "icon": "🟨",
          "label": "Hangar amarelo"
        }
      },
      {
        "id": "par-3",
        "left": {
          "id": "aviao-verde",
          "icon": "🟢",
          "label": "Avião verde"
        },
        "right": {
          "id": "hangar-verde",
          "icon": "🟩",
          "label": "Hangar verde"
        }
      }
    ]
  },
  {
    "id": "caminho-escola",
    "chapterId": "cap7",
    "title": "Caminho até a Escola",
    "place": "Escola dos Amigos",
    "icon": "🏫",
    "caller": "🏫",
    "call": "A Luna pode ajudar! Use as setas para chegar ao resgate, contornando os obstáculos!",
    "hero": "luna",
    "instruction": "Use as setas para chegar ao resgate, contornando os obstáculos!",
    "kind": "route",
    "size": 4,
    "start": 0,
    "goal": 15,
    "walls": [
      2,
      5,
      6,
      9
    ],
    "player": {
      "id": "carro-da-luna",
      "icon": "🚗",
      "label": "Carro da Luna"
    },
    "destination": {
      "id": "escola",
      "icon": "🏫",
      "label": "Escola"
    },
    "obstacle": {
      "id": "arvore",
      "icon": "🌳",
      "label": "Árvore"
    }
  },
  {
    "id": "painel-sala",
    "chapterId": "cap7",
    "title": "Painel da Sala",
    "place": "Escola dos Amigos",
    "icon": "🔢",
    "caller": "🔢",
    "call": "A Nina pode ajudar! Toque na peça igual ao espaço que está brilhando para montar!",
    "hero": "nina",
    "instruction": "Toque na peça igual ao espaço que está brilhando para montar!",
    "kind": "build",
    "slots": [
      {
        "id": "peca-0",
        "icon": "1️⃣",
        "label": "Número um"
      },
      {
        "id": "peca-1",
        "icon": "2️⃣",
        "label": "Número dois"
      },
      {
        "id": "peca-2",
        "icon": "3️⃣",
        "label": "Número três"
      },
      {
        "id": "peca-3",
        "icon": "4️⃣",
        "label": "Número quatro"
      },
      {
        "id": "peca-4",
        "icon": "5️⃣",
        "label": "Número cinco"
      },
      {
        "id": "peca-5",
        "icon": "6️⃣",
        "label": "Número seis"
      }
    ]
  },
  {
    "id": "lapis-perdidos",
    "chapterId": "cap7",
    "title": "Lápis Perdidos",
    "place": "Escola dos Amigos",
    "icon": "✏️",
    "caller": "✏️",
    "call": "A Luna pode ajudar! Encontre 5 lápis entre os outros desenhos!",
    "hero": "luna",
    "instruction": "Encontre 5 lápis entre os outros desenhos!",
    "kind": "search",
    "target": {
      "id": "lapis",
      "icon": "✏️",
      "label": "Lápis"
    },
    "distractors": [
      {
        "id": "regua",
        "icon": "📏",
        "label": "Régua"
      },
      {
        "id": "giz-de-cera",
        "icon": "🖍️",
        "label": "Giz de cera"
      },
      {
        "id": "caderno",
        "icon": "📘",
        "label": "Caderno"
      }
    ],
    "needed": 5
  },
  {
    "id": "bandinha",
    "chapterId": "cap7",
    "title": "Bandinha dos Amigos",
    "place": "Escola dos Amigos",
    "icon": "🥁",
    "caller": "🥁",
    "call": "A Bella pode ajudar! Toque nos desenhos na ordem mostrada, um de cada vez!",
    "hero": "bella",
    "instruction": "Toque nos desenhos na ordem mostrada, um de cada vez!",
    "kind": "sequence",
    "palette": [
      {
        "id": "tambor",
        "icon": "🥁",
        "label": "Tambor"
      },
      {
        "id": "trompete",
        "icon": "🎺",
        "label": "Trompete"
      },
      {
        "id": "violao",
        "icon": "🎸",
        "label": "Violão"
      },
      {
        "id": "sino",
        "icon": "🔔",
        "label": "Sino"
      }
    ],
    "order": [
      "tambor",
      "violao",
      "trompete",
      "sino",
      "tambor"
    ]
  },
  {
    "id": "biblioteca",
    "chapterId": "cap7",
    "title": "Livros na Biblioteca",
    "place": "Escola dos Amigos",
    "icon": "📚",
    "caller": "📚",
    "call": "A Lili pode ajudar! Conte os desenhos e toque no número certo!",
    "hero": "lili",
    "instruction": "Conte os desenhos e toque no número certo!",
    "kind": "count",
    "rounds": [
      {
        "icon": "📕",
        "label": "Livros vermelhos",
        "count": 4,
        "options": [
          4,
          5,
          3
        ]
      },
      {
        "icon": "📗",
        "label": "Livros verdes",
        "count": 5,
        "options": [
          6,
          4,
          5
        ]
      },
      {
        "icon": "📘",
        "label": "Livros azuis",
        "count": 6,
        "options": [
          6,
          7,
          5
        ]
      }
    ]
  },
  {
    "id": "bandeirinhas",
    "chapterId": "cap8",
    "title": "Bandeirinhas da Festa",
    "place": "Festival Arco-Íris",
    "icon": "🎏",
    "caller": "🎏",
    "call": "A Nina pode ajudar! Olhe a sequência e escolha o desenho que vem depois!",
    "hero": "nina",
    "instruction": "Olhe a sequência e escolha o desenho que vem depois!",
    "kind": "pattern",
    "rounds": [
      {
        "series": [
          {
            "id": "bandeira-vermelha",
            "icon": "🔺",
            "label": "Bandeira vermelha"
          },
          {
            "id": "bandeira-azul",
            "icon": "🔷",
            "label": "Bandeira azul"
          },
          {
            "id": "bandeira-vermelha",
            "icon": "🔺",
            "label": "Bandeira vermelha"
          }
        ],
        "options": [
          {
            "id": "bandeira-vermelha",
            "icon": "🔺",
            "label": "Bandeira vermelha"
          },
          {
            "id": "bandeira-azul",
            "icon": "🔷",
            "label": "Bandeira azul"
          },
          {
            "id": "bandeira-laranja",
            "icon": "🔶",
            "label": "Bandeira laranja"
          }
        ],
        "answer": "bandeira-azul"
      },
      {
        "series": [
          {
            "id": "bandeira-laranja",
            "icon": "🔶",
            "label": "Bandeira laranja"
          },
          {
            "id": "bandeira-vermelha",
            "icon": "🔺",
            "label": "Bandeira vermelha"
          },
          {
            "id": "bandeira-azul",
            "icon": "🔷",
            "label": "Bandeira azul"
          },
          {
            "id": "bandeira-laranja",
            "icon": "🔶",
            "label": "Bandeira laranja"
          },
          {
            "id": "bandeira-vermelha",
            "icon": "🔺",
            "label": "Bandeira vermelha"
          }
        ],
        "options": [
          {
            "id": "bandeira-vermelha",
            "icon": "🔺",
            "label": "Bandeira vermelha"
          },
          {
            "id": "bandeira-azul",
            "icon": "🔷",
            "label": "Bandeira azul"
          },
          {
            "id": "bandeira-laranja",
            "icon": "🔶",
            "label": "Bandeira laranja"
          }
        ],
        "answer": "bandeira-azul"
      },
      {
        "series": [
          {
            "id": "bandeira-vermelha",
            "icon": "🔺",
            "label": "Bandeira vermelha"
          },
          {
            "id": "bandeira-vermelha",
            "icon": "🔺",
            "label": "Bandeira vermelha"
          },
          {
            "id": "bandeira-laranja",
            "icon": "🔶",
            "label": "Bandeira laranja"
          },
          {
            "id": "bandeira-vermelha",
            "icon": "🔺",
            "label": "Bandeira vermelha"
          },
          {
            "id": "bandeira-vermelha",
            "icon": "🔺",
            "label": "Bandeira vermelha"
          }
        ],
        "options": [
          {
            "id": "bandeira-vermelha",
            "icon": "🔺",
            "label": "Bandeira vermelha"
          },
          {
            "id": "bandeira-azul",
            "icon": "🔷",
            "label": "Bandeira azul"
          },
          {
            "id": "bandeira-laranja",
            "icon": "🔶",
            "label": "Bandeira laranja"
          }
        ],
        "answer": "bandeira-laranja"
      }
    ]
  },
  {
    "id": "piquenique",
    "chapterId": "cap8",
    "title": "Mesa do Piquenique",
    "place": "Festival Arco-Íris",
    "icon": "🧺",
    "caller": "🧺",
    "call": "A Luna pode ajudar! Toque em um objeto e depois no grupo certo para guardar!",
    "hero": "luna",
    "instruction": "Toque em um objeto e depois no grupo certo para guardar!",
    "kind": "sort",
    "bins": [
      {
        "id": "comidas",
        "icon": "🍽️",
        "label": "Comidas"
      },
      {
        "id": "decoracoes",
        "icon": "🎉",
        "label": "Decorações"
      }
    ],
    "items": [
      {
        "id": "melancia",
        "icon": "🍉",
        "label": "Melancia",
        "bin": "comidas"
      },
      {
        "id": "bolinho",
        "icon": "🧁",
        "label": "Bolinho",
        "bin": "comidas"
      },
      {
        "id": "sanduiche",
        "icon": "🥪",
        "label": "Sanduíche",
        "bin": "comidas"
      },
      {
        "id": "balao",
        "icon": "🎈",
        "label": "Balão",
        "bin": "decoracoes"
      },
      {
        "id": "laco",
        "icon": "🎀",
        "label": "Laço",
        "bin": "decoracoes"
      },
      {
        "id": "bandeirinhas",
        "icon": "🎏",
        "label": "Bandeirinhas",
        "bin": "decoracoes"
      }
    ]
  },
  {
    "id": "sombras-festa",
    "chapterId": "cap8",
    "title": "Sombras da Festa",
    "place": "Festival Arco-Íris",
    "icon": "🎁",
    "caller": "🎁",
    "call": "A Lili pode ajudar! Toque em um desenho da esquerda e no par da direita!",
    "hero": "lili",
    "instruction": "Toque em um desenho da esquerda e no par da direita!",
    "kind": "pairs",
    "pairs": [
      {
        "id": "par-0",
        "left": {
          "id": "presente",
          "icon": "🎁",
          "label": "Presente"
        },
        "right": {
          "id": "sombra-do-presente",
          "icon": "🎁",
          "label": "Sombra do presente",
          "silhouette": true
        }
      },
      {
        "id": "par-1",
        "left": {
          "id": "balao",
          "icon": "🎈",
          "label": "Balão"
        },
        "right": {
          "id": "sombra-do-balao",
          "icon": "🎈",
          "label": "Sombra do balão",
          "silhouette": true
        }
      },
      {
        "id": "par-2",
        "left": {
          "id": "ursinho",
          "icon": "🧸",
          "label": "Ursinho"
        },
        "right": {
          "id": "sombra-do-ursinho",
          "icon": "🧸",
          "label": "Sombra do ursinho",
          "silhouette": true
        }
      },
      {
        "id": "par-3",
        "left": {
          "id": "trompete",
          "icon": "🎺",
          "label": "Trompete"
        },
        "right": {
          "id": "sombra-do-trompete",
          "icon": "🎺",
          "label": "Sombra do trompete",
          "silhouette": true
        }
      }
    ]
  },
  {
    "id": "bolo-coreto",
    "chapterId": "cap8",
    "title": "Bolo no Coreto",
    "place": "Festival Arco-Íris",
    "icon": "🎂",
    "caller": "🎂",
    "call": "A Bella pode ajudar! Use as setas para chegar ao resgate, contornando os obstáculos!",
    "hero": "bella",
    "instruction": "Use as setas para chegar ao resgate, contornando os obstáculos!",
    "kind": "route",
    "size": 4,
    "start": 3,
    "goal": 12,
    "walls": [
      5,
      9,
      14
    ],
    "player": {
      "id": "caminhao-da-bella",
      "icon": "🚒",
      "label": "Caminhão da Bella"
    },
    "destination": {
      "id": "bolo",
      "icon": "🎂",
      "label": "Bolo"
    },
    "obstacle": {
      "id": "cadeira",
      "icon": "🪑",
      "label": "Cadeira"
    }
  },
  {
    "id": "palco",
    "chapterId": "cap8",
    "title": "Palco do Festival",
    "place": "Festival Arco-Íris",
    "icon": "🎪",
    "caller": "🎪",
    "call": "A Nina pode ajudar! Toque na peça igual ao espaço que está brilhando para montar!",
    "hero": "nina",
    "instruction": "Toque na peça igual ao espaço que está brilhando para montar!",
    "kind": "build",
    "slots": [
      {
        "id": "peca-0",
        "icon": "🔺",
        "label": "Teto"
      },
      {
        "id": "peca-1",
        "icon": "🟨",
        "label": "Painel amarelo"
      },
      {
        "id": "peca-2",
        "icon": "🟦",
        "label": "Painel azul"
      },
      {
        "id": "peca-3",
        "icon": "🎵",
        "label": "Nota musical"
      },
      {
        "id": "peca-4",
        "icon": "⭐",
        "label": "Estrela"
      },
      {
        "id": "peca-5",
        "icon": "🔴",
        "label": "Luz vermelha"
      }
    ]
  },
  {
    "id": "parafusos",
    "chapterId": "cap9",
    "title": "Parafusos Sumidos",
    "place": "Oficina das Invenções",
    "icon": "🔩",
    "caller": "🔩",
    "call": "A Nina pode ajudar! Encontre 4 parafusos entre os outros desenhos!",
    "hero": "nina",
    "instruction": "Encontre 4 parafusos entre os outros desenhos!",
    "kind": "search",
    "target": {
      "id": "parafusos",
      "icon": "🔩",
      "label": "Parafusos"
    },
    "distractors": [
      {
        "id": "martelo",
        "icon": "🔨",
        "label": "Martelo"
      },
      {
        "id": "chave",
        "icon": "🔧",
        "label": "Chave"
      },
      {
        "id": "engrenagem",
        "icon": "⚙️",
        "label": "Engrenagem"
      }
    ],
    "needed": 4
  },
  {
    "id": "energia",
    "chapterId": "cap9",
    "title": "Painel de Energia",
    "place": "Oficina das Invenções",
    "icon": "💡",
    "caller": "💡",
    "call": "A Bella pode ajudar! Toque nos desenhos na ordem mostrada, um de cada vez!",
    "hero": "bella",
    "instruction": "Toque nos desenhos na ordem mostrada, um de cada vez!",
    "kind": "sequence",
    "palette": [
      {
        "id": "raio",
        "icon": "⚡",
        "label": "Raio"
      },
      {
        "id": "gota",
        "icon": "💧",
        "label": "Gota"
      },
      {
        "id": "sol",
        "icon": "☀️",
        "label": "Sol"
      },
      {
        "id": "bateria",
        "icon": "🔋",
        "label": "Bateria"
      }
    ],
    "order": [
      "sol",
      "bateria",
      "raio",
      "gota",
      "sol",
      "raio"
    ]
  },
  {
    "id": "rodas",
    "chapterId": "cap9",
    "title": "Rodas para Consertar",
    "place": "Oficina das Invenções",
    "icon": "🛞",
    "caller": "🛞",
    "call": "A Nina pode ajudar! Conte os desenhos e toque no número certo!",
    "hero": "nina",
    "instruction": "Conte os desenhos e toque no número certo!",
    "kind": "count",
    "rounds": [
      {
        "icon": "🛞",
        "label": "Rodas",
        "count": 4,
        "options": [
          4,
          5,
          3
        ]
      },
      {
        "icon": "⚙️",
        "label": "Engrenagens",
        "count": 6,
        "options": [
          7,
          5,
          6
        ]
      },
      {
        "icon": "🔩",
        "label": "Parafusos",
        "count": 8,
        "options": [
          8,
          9,
          7
        ]
      }
    ]
  },
  {
    "id": "trilhos",
    "chapterId": "cap9",
    "title": "Trilhos do Trenzinho",
    "place": "Oficina das Invenções",
    "icon": "🚂",
    "caller": "🚂",
    "call": "A Nina pode ajudar! Olhe a sequência e escolha o desenho que vem depois!",
    "hero": "nina",
    "instruction": "Olhe a sequência e escolha o desenho que vem depois!",
    "kind": "pattern",
    "rounds": [
      {
        "series": [
          {
            "id": "trilho-vermelho",
            "icon": "🟥",
            "label": "Trilho vermelho"
          },
          {
            "id": "trilho-amarelo",
            "icon": "🟨",
            "label": "Trilho amarelo"
          },
          {
            "id": "trilho-azul",
            "icon": "🟦",
            "label": "Trilho azul"
          },
          {
            "id": "trilho-vermelho",
            "icon": "🟥",
            "label": "Trilho vermelho"
          },
          {
            "id": "trilho-amarelo",
            "icon": "🟨",
            "label": "Trilho amarelo"
          }
        ],
        "options": [
          {
            "id": "trilho-vermelho",
            "icon": "🟥",
            "label": "Trilho vermelho"
          },
          {
            "id": "trilho-amarelo",
            "icon": "🟨",
            "label": "Trilho amarelo"
          },
          {
            "id": "trilho-azul",
            "icon": "🟦",
            "label": "Trilho azul"
          }
        ],
        "answer": "trilho-azul"
      },
      {
        "series": [
          {
            "id": "trilho-amarelo",
            "icon": "🟨",
            "label": "Trilho amarelo"
          },
          {
            "id": "trilho-azul",
            "icon": "🟦",
            "label": "Trilho azul"
          },
          {
            "id": "trilho-amarelo",
            "icon": "🟨",
            "label": "Trilho amarelo"
          },
          {
            "id": "trilho-azul",
            "icon": "🟦",
            "label": "Trilho azul"
          },
          {
            "id": "trilho-amarelo",
            "icon": "🟨",
            "label": "Trilho amarelo"
          }
        ],
        "options": [
          {
            "id": "trilho-vermelho",
            "icon": "🟥",
            "label": "Trilho vermelho"
          },
          {
            "id": "trilho-amarelo",
            "icon": "🟨",
            "label": "Trilho amarelo"
          },
          {
            "id": "trilho-azul",
            "icon": "🟦",
            "label": "Trilho azul"
          }
        ],
        "answer": "trilho-azul"
      },
      {
        "series": [
          {
            "id": "trilho-vermelho",
            "icon": "🟥",
            "label": "Trilho vermelho"
          },
          {
            "id": "trilho-vermelho",
            "icon": "🟥",
            "label": "Trilho vermelho"
          },
          {
            "id": "trilho-amarelo",
            "icon": "🟨",
            "label": "Trilho amarelo"
          },
          {
            "id": "trilho-vermelho",
            "icon": "🟥",
            "label": "Trilho vermelho"
          },
          {
            "id": "trilho-vermelho",
            "icon": "🟥",
            "label": "Trilho vermelho"
          }
        ],
        "options": [
          {
            "id": "trilho-vermelho",
            "icon": "🟥",
            "label": "Trilho vermelho"
          },
          {
            "id": "trilho-amarelo",
            "icon": "🟨",
            "label": "Trilho amarelo"
          },
          {
            "id": "trilho-azul",
            "icon": "🟦",
            "label": "Trilho azul"
          }
        ],
        "answer": "trilho-amarelo"
      }
    ]
  },
  {
    "id": "oficina",
    "chapterId": "cap9",
    "title": "Oficina Organizada",
    "place": "Oficina das Invenções",
    "icon": "🛠️",
    "caller": "🛠️",
    "call": "A Nina pode ajudar! Toque em um objeto e depois no grupo certo para guardar!",
    "hero": "nina",
    "instruction": "Toque em um objeto e depois no grupo certo para guardar!",
    "kind": "sort",
    "bins": [
      {
        "id": "ferramentas",
        "icon": "🧰",
        "label": "Ferramentas"
      },
      {
        "id": "pecas",
        "icon": "⚙️",
        "label": "Peças"
      }
    ],
    "items": [
      {
        "id": "martelo",
        "icon": "🔨",
        "label": "Martelo",
        "bin": "ferramentas"
      },
      {
        "id": "chave-inglesa",
        "icon": "🔧",
        "label": "Chave inglesa",
        "bin": "ferramentas"
      },
      {
        "id": "chave-de-fenda",
        "icon": "🪛",
        "label": "Chave de fenda",
        "bin": "ferramentas"
      },
      {
        "id": "parafuso",
        "icon": "🔩",
        "label": "Parafuso",
        "bin": "pecas"
      },
      {
        "id": "engrenagem",
        "icon": "⚙️",
        "label": "Engrenagem",
        "bin": "pecas"
      },
      {
        "id": "bateria",
        "icon": "🔋",
        "label": "Bateria",
        "bin": "pecas"
      }
    ]
  },
  {
    "id": "constelacoes",
    "chapterId": "cap10",
    "title": "Constelações Amigas",
    "place": "Observatório das Estrelas",
    "icon": "🌌",
    "caller": "🌌",
    "call": "A Luna pode ajudar! Toque em um desenho da esquerda e no par da direita!",
    "hero": "luna",
    "instruction": "Toque em um desenho da esquerda e no par da direita!",
    "kind": "pairs",
    "pairs": [
      {
        "id": "par-0",
        "left": {
          "id": "foguete",
          "icon": "🚀",
          "label": "Foguete"
        },
        "right": {
          "id": "sombra-do-foguete",
          "icon": "🚀",
          "label": "Sombra do foguete",
          "silhouette": true
        }
      },
      {
        "id": "par-1",
        "left": {
          "id": "lua",
          "icon": "🌙",
          "label": "Lua"
        },
        "right": {
          "id": "sombra-da-lua",
          "icon": "🌙",
          "label": "Sombra da lua",
          "silhouette": true
        }
      },
      {
        "id": "par-2",
        "left": {
          "id": "planeta",
          "icon": "🪐",
          "label": "Planeta"
        },
        "right": {
          "id": "sombra-do-planeta",
          "icon": "🪐",
          "label": "Sombra do planeta",
          "silhouette": true
        }
      },
      {
        "id": "par-3",
        "left": {
          "id": "estrela",
          "icon": "⭐",
          "label": "Estrela"
        },
        "right": {
          "id": "sombra-da-estrela",
          "icon": "⭐",
          "label": "Sombra da estrela",
          "silhouette": true
        }
      }
    ]
  },
  {
    "id": "astronauta",
    "chapterId": "cap10",
    "title": "Astronauta no Acampamento",
    "place": "Observatório das Estrelas",
    "icon": "🧑‍🚀",
    "caller": "🧑‍🚀",
    "call": "A Mel pode ajudar! Use as setas para chegar ao resgate, contornando os obstáculos!",
    "hero": "mel",
    "instruction": "Use as setas para chegar ao resgate, contornando os obstáculos!",
    "kind": "route",
    "size": 4,
    "start": 15,
    "goal": 0,
    "walls": [
      2,
      6,
      10,
      12
    ],
    "player": {
      "id": "nave-de-resgate",
      "icon": "🚀",
      "label": "Nave de resgate"
    },
    "destination": {
      "id": "astronauta",
      "icon": "🧑‍🚀",
      "label": "Astronauta"
    },
    "obstacle": {
      "id": "meteoro",
      "icon": "☄️",
      "label": "Meteoro"
    }
  },
  {
    "id": "painel-foguete",
    "chapterId": "cap10",
    "title": "Painel do Foguete",
    "place": "Observatório das Estrelas",
    "icon": "🚀",
    "caller": "🚀",
    "call": "A Nina pode ajudar! Toque na peça igual ao espaço que está brilhando para montar!",
    "hero": "nina",
    "instruction": "Toque na peça igual ao espaço que está brilhando para montar!",
    "kind": "build",
    "slots": [
      {
        "id": "peca-0",
        "icon": "🔺",
        "label": "Nariz vermelho"
      },
      {
        "id": "peca-1",
        "icon": "🟦",
        "label": "Painel azul"
      },
      {
        "id": "peca-2",
        "icon": "🟨",
        "label": "Painel amarelo"
      },
      {
        "id": "peca-3",
        "icon": "🟩",
        "label": "Painel verde"
      },
      {
        "id": "peca-4",
        "icon": "⚪",
        "label": "Janela"
      },
      {
        "id": "peca-5",
        "icon": "⭐",
        "label": "Emblema"
      }
    ]
  },
  {
    "id": "estrelas-cadentes",
    "chapterId": "cap10",
    "title": "Estrelas Cadentes",
    "place": "Observatório das Estrelas",
    "icon": "🌟",
    "caller": "🌟",
    "call": "A Mel pode ajudar! Encontre 5 estrelas brilhantes entre os outros desenhos!",
    "hero": "mel",
    "instruction": "Encontre 5 estrelas brilhantes entre os outros desenhos!",
    "kind": "search",
    "target": {
      "id": "estrelas-brilhantes",
      "icon": "🌟",
      "label": "Estrelas brilhantes"
    },
    "distractors": [
      {
        "id": "lua",
        "icon": "🌙",
        "label": "Lua"
      },
      {
        "id": "planeta",
        "icon": "🪐",
        "label": "Planeta"
      },
      {
        "id": "nuvem",
        "icon": "☁️",
        "label": "Nuvem"
      }
    ],
    "needed": 5
  },
  {
    "id": "sinal-voltar",
    "chapterId": "cap10",
    "title": "Sinal para Voltar",
    "place": "Observatório das Estrelas",
    "icon": "📡",
    "caller": "📡",
    "call": "A Bella pode ajudar! Toque nos desenhos na ordem mostrada, um de cada vez!",
    "hero": "bella",
    "instruction": "Toque nos desenhos na ordem mostrada, um de cada vez!",
    "kind": "sequence",
    "palette": [
      {
        "id": "sinal-vermelho",
        "icon": "🔴",
        "label": "Sinal vermelho"
      },
      {
        "id": "sinal-azul",
        "icon": "🔵",
        "label": "Sinal azul"
      },
      {
        "id": "sinal-amarelo",
        "icon": "🟡",
        "label": "Sinal amarelo"
      },
      {
        "id": "sinal-verde",
        "icon": "🟢",
        "label": "Sinal verde"
      }
    ],
    "order": [
      "sinal-verde",
      "sinal-azul",
      "sinal-amarelo",
      "sinal-vermelho",
      "sinal-azul",
      "sinal-verde"
    ]
  }
];

export const CHALLENGE_CHAPTERS = [
  {
    "id": "cap3",
    "title": "Amigos da Fazenda",
    "icon": "🐮",
    "decorations": [
      "🐮",
      "🌽",
      "🐥",
      "🌳",
      "🏡",
      "🌻",
      "🐑"
    ],
    "missions": [
      "lanche-fazenda",
      "cerca-colorida",
      "colheita",
      "casinhas-animais",
      "pintinho-perdido"
    ],
    "medal": "cap3"
  },
  {
    "id": "cap4",
    "title": "Praia das Conchinhas",
    "icon": "🐚",
    "decorations": [
      "🐚",
      "🦀",
      "🏖️",
      "🌴",
      "🐢",
      "🌊",
      "🪣"
    ],
    "missions": [
      "farol-praia",
      "conchinhas",
      "boias-resgate",
      "peixinhos",
      "trilha-tartarugas"
    ],
    "medal": "cap4"
  },
  {
    "id": "cap5",
    "title": "Montanha dos Ventos",
    "icon": "⛰️",
    "decorations": [
      "⛰️",
      "🌲",
      "🏕️",
      "🪨",
      "🐐",
      "🌤️",
      "🌼"
    ],
    "missions": [
      "mochila-aventura",
      "equipamentos-resgate",
      "cabritinho",
      "passarela",
      "estrelas-acampamento"
    ],
    "medal": "cap5"
  },
  {
    "id": "cap6",
    "title": "Aeroporto nas Nuvens",
    "icon": "✈️",
    "decorations": [
      "☁️",
      "✈️",
      "🌈",
      "🛩️",
      "☁️",
      "🎈",
      "☀️"
    ],
    "missions": [
      "luzes-pista",
      "passageiros",
      "baloes-nuvens",
      "bagagens",
      "hangares"
    ],
    "medal": "cap6"
  },
  {
    "id": "cap7",
    "title": "Escola dos Amigos",
    "icon": "🏫",
    "decorations": [
      "🏫",
      "📚",
      "✏️",
      "🌳",
      "🎨",
      "🎒",
      "🔔"
    ],
    "missions": [
      "caminho-escola",
      "painel-sala",
      "lapis-perdidos",
      "bandinha",
      "biblioteca"
    ],
    "medal": "cap7"
  },
  {
    "id": "cap8",
    "title": "Festa Arco-Íris",
    "icon": "🎉",
    "decorations": [
      "🎈",
      "🎪",
      "🎏",
      "🌳",
      "🎂",
      "🎁",
      "🎵"
    ],
    "missions": [
      "bandeirinhas",
      "piquenique",
      "sombras-festa",
      "bolo-coreto",
      "palco"
    ],
    "medal": "cap8"
  },
  {
    "id": "cap9",
    "title": "Oficina das Invenções",
    "icon": "🛠️",
    "decorations": [
      "⚙️",
      "🔧",
      "🚂",
      "🛞",
      "🏭",
      "🔩",
      "💡"
    ],
    "missions": [
      "parafusos",
      "energia",
      "rodas",
      "trilhos",
      "oficina"
    ],
    "medal": "cap9"
  },
  {
    "id": "cap10",
    "title": "Expedição das Estrelas",
    "icon": "🌌",
    "decorations": [
      "🌙",
      "⭐",
      "🪐",
      "🚀",
      "🔭",
      "☄️",
      "🌟"
    ],
    "missions": [
      "constelacoes",
      "astronauta",
      "painel-foguete",
      "estrelas-cadentes",
      "sinal-voltar"
    ],
    "medal": "cap10"
  }
];
