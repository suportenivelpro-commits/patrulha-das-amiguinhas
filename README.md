# Patrulha das Amiguinhas

Jogo infantil de missões de resgate, exportado do Lovable e preparado para hospedagem estática na Render.

## Desenvolvimento

Use Node.js 24 e npm:

```sh
npm install
npm run dev
```

## Verificação e publicação

```sh
npm test
npm run build
```

A Render publica a pasta `dist`. O jogo não precisa de servidor ou banco de dados: progresso, estrelas, medalhas e preferências ficam no `localStorage` do navegador. O progresso fica separado em cada domínio.

O código das personagens, missões, áudio e minijogos foi preservado. A entrada de produção usa React e Vite diretamente. Os módulos TanStack originais permanecem disponíveis no código exportado e no teste de rotas, mas não participam do bundle estático.

Origem: Lovable `32c80073-8d7a-467d-b1f5-979bea7d76ca`, commit `aae5e3aa36509332aeb0012ac0a0d99b9a24852a`.
