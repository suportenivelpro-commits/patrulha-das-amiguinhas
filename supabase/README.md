# Contas e progresso da Patrulha

Projeto Supabase: `lgkcwcwzjufxwfdrksls` (Felipe).

- `patrulha_progress`: uma linha por conta, protegida por RLS e pelo identificador autenticado.
- RPCs `patrulha_load`, `patrulha_save` e `patrulha_reset`: carregamento, mesclagem de melhores pontuações e reinício com versão de geração.
- `patrulha-register`: criação de conta com usuário/senha pelo Supabase Auth, com limite de tentativas. O identificador interno termina em `@patrulha.invalid`; não é solicitado nem enviado e-mail.
- Senhas são tratadas pelo Supabase Auth. O navegador armazena somente a sessão e o cache separado por conta.
- A transferência do progresso antigo requer marcar a opção no formulário de entrada/criação da conta.
- Sem conexão, partidas ficam no cache da conta e são reenviadas quando a conexão volta.
- O reinício de uma conta requer conexão e vale para todos os aparelhos. A geração impede que um cache antigo restaure pontuações apagadas.

`src/game/cloud-config.ts` contém apenas URL e chave **publicável**. Nunca coloque uma chave de serviço no frontend. A função usa `SUPABASE_SERVICE_ROLE_KEY` somente no ambiente do servidor.

A função é publicada com `verify_jwt=false` para permitir novos cadastros sem sessão; ela valida a chave pública do aplicativo, os dados e o limite de cadastros. As operações de progresso exigem sessão autenticada e RLS.

`patrulha-setup.sql` registra a estrutura criada. `patrulha-verify.sql` verifica salvamento, isolamento de duas contas, rejeição de acesso anônimo e proteção após reinício, sem deixar dados de teste (ROLLBACK).
