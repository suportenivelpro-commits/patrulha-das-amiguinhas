# Verificação do login e progresso online

Executada em 18/10/2026 no projeto Supabase de Felipe.

- Estrutura aplicada; serviço `patrulha-register` ativo.
- Teste HTTP real aprovado: cadastro, senha incorreta rejeitada, nova sessão, recuperação do progresso e recorde, isolamento de duas contas, reinício e rejeição do cache de uma sessão antiga.
- Teste SQL aprovado: RLS, proteção de propriedade, bloqueio de visitante e da permissão TRUNCATE, melhores pontuações preservadas e limite de cadastro.
- Contas temporárias removidas. Extensão HTTP temporária removida após o teste.
- Nenhum aviso do assessor de segurança referente às estruturas `patrulha_*`. Avisos preexistentes de outros sistemas não foram alterados.
- Lógica do cliente verificada: transferência opcional, contas separadas, funcionamento offline com reenvio, renovação de sessão e salvamentos concorrentes.
- Regressão de lógica aprovada: 42 desafios catalogados solucionáveis, 10 capítulos e progressão das 50 missões até 150 estrelas.
- Sintaxe e transpilação verificadas nos 108 arquivos TS/TSX. A suíte Vitest completa e a compilação Vite serão executadas pelo Render após o envio do pacote ao GitHub.

O Supabase já está ativo. A interface de login depende da publicação dos arquivos desta atualização no Render.
