## Objetivo

Adequar o Alevi.ai à LGPD e às boas práticas OWASP, entregando:
- Páginas legais (Privacidade LGPD, Termos, Cookies, Contato DPO, Exclusão de Conta)
- Banner de consentimento de cookies
- Endurecimento de segurança (headers, rate limit, RLS, validações)
- Relatório final do que foi feito, o que depende de config manual e o nível atual

Só implemento o que faz sentido no stack atual (TanStack Start + Lovable Cloud/Supabase gerenciado). Itens que já estão cobertos pela plataforma serão apenas documentados no relatório, não reimplementados.

---

## O que será IMPLEMENTADO em código

### 1. Páginas legais (novas rotas públicas)
- `src/routes/politica-privacidade.tsx` — Política de Privacidade LGPD completa: dados coletados (e-mail, plano, projetos, logs), finalidade, base legal (execução de contrato / consentimento / legítimo interesse), retenção, compartilhamento (Supabase/Lovable Cloud, Cakto, Gemini/Lovable AI, JSON2Video), direitos do titular (art. 18 LGPD), como exercê-los, encarregado (DPO) e contato.
- `src/routes/termos-de-uso.tsx` — Termos de uso: objeto, cadastro, planos (mensal/vitalício), pagamentos via Cakto, limites de uso, propriedade intelectual do conteúdo gerado, condutas proibidas, cancelamento, foro.
- `src/routes/politica-cookies.tsx` — Detalhamento dos cookies: essenciais (sessão Supabase), analíticos/marketing (se houver), como gerenciar.
- `src/routes/contato-privacidade.tsx` — Formulário para solicitações de titular (acesso, correção, exclusão, portabilidade, revogação). Envia via server function usando a infra de e-mail já configurada em `notify.suportealevi.store` para o e-mail do DPO.
- Rotas antigas `/privacidade`, `/privacy`, `/security`, `/trust` passam a redirecionar para as novas.

### 2. Exclusão de conta (LGPD art. 18, VI)
- `src/routes/_authenticated/conta.tsx` — Página "Minha conta" com botão "Excluir minha conta e dados" (com confirmação por senha).
- `src/lib/conta.functions.ts` — server function `excluirMinhaConta` (autenticada) que apaga registros do usuário em `ebooks`, `videos`, `projetos`, `pedidos`, `usuarios`, `user_roles` e depois chama `auth.admin.deleteUser` via `supabaseAdmin`.

### 3. Banner de consentimento de cookies
- `src/components/CookieBanner.tsx` — Banner fixo com "Aceitar todos", "Recusar não essenciais", "Personalizar". Persiste escolha em `localStorage` (`cookie-consent-v1`). Renderizado no `__root.tsx`. Como hoje só há cookie essencial de sessão, o banner é informativo + opt-in para futuros analíticos (gate simples via `window.__consent`).

### 4. Rodapé com links legais
- Atualizar `src/components/landing/Footer.tsx` com links para Privacidade, Termos, Cookies, Contato de Privacidade e Exclusão de Conta.

### 5. Cabeçalhos de segurança
- Novo server middleware em `src/start.ts` (ou wrapper no handler SSR) aplicando em todas as respostas:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN` (o preview do Lovable roda em iframe, então SAMEORIGIN e não DENY)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
  - `Content-Security-Policy` conservadora permitindo Supabase, Lovable, Cakto e Gemini; começar em `Report-Only` para não quebrar o preview e depois promover.

### 6. Rate limiting em endpoints sensíveis
- Como o backend não tem primitiva de rate limit padrão, implementar limitador ad-hoc em Postgres:
  - Tabela `public.rate_limits(chave text, janela_inicio timestamptz, contador int)` + função `check_rate_limit(chave, limite, janela_seg)`.
  - Aplicar no webhook Cakto (`/api/public/webhook/cakto`), no formulário de contato de privacidade e na server fn de exclusão de conta. Para login do Supabase Auth, documentar no relatório que é gerenciado pela plataforma (não há hook customizável nesse projeto).

### 7. Validação e hardening de formulários
- Revisar todos os formulários (`auth`, `checkout`, `contato-privacidade`, `primeiro-acesso`) para usar `zod` com `.trim()`, limites de tamanho e sanitização; garantir que nenhum `dangerouslySetInnerHTML` receba input do usuário.
- CSRF: server functions do TanStack são same-origin com `POST` + validação Zod; documentar. Webhooks públicos já têm verificação de assinatura HMAC (revisar Cakto e JSON2Video e reforçar se faltar).

### 8. Verificação de e-mail e recuperação de senha
- Verificação de e-mail: hoje o admin cria contas com `email_confirm: true` (fluxo pós-compra). Para futuros cadastros self-service, deixar `auto_confirm_email: false` via `configure_auth` e usar os templates de auth já scaffolded.
- Recuperação de senha: criar `src/routes/esqueci-senha.tsx` (chama `resetPasswordForEmail` com `redirectTo`) + `src/routes/redefinir-senha.tsx` (consome `type=recovery` do hash e chama `updateUser({ password })`). Link a partir da tela `/auth`.
- Ativar `password_hibp_enabled: true` via `configure_auth`.

### 9. Revisão de RLS e menor privilégio
- Rodar `supabase--linter` e auditar cada policy das tabelas `usuarios`, `ebooks`, `videos`, `projetos`, `pedidos`, `community_groups`, `user_roles`, `email_send_log`, `suppressed_emails`, `email_unsubscribe_tokens`, `video_webhook_tokens`.
- Corrigir GRANTs excessivos a `anon`/`authenticated` (garantir que só policies com `auth.uid()` estejam ativas; `service_role` só onde edge/admin precisa).
- Confirmar que nenhuma query no frontend retorna colunas de outros usuários.

### 10. Logs sem PII
- Auditar `console.error/info` em `src/lib/**` e nos webhooks; remover payloads que contenham e-mail, senha, tokens, assinatura Cakto etc. Manter apenas IDs.

---

## O que NÃO precisa de código (será apenas relatado)

- **HTTPS**: forçado pela infra Lovable/Cloudflare.
- **Hash de senha**: Supabase Auth já usa bcrypt; texto puro nunca é armazenado.
- **Chaves no frontend**: só `VITE_SUPABASE_PUBLISHABLE_KEY` (pública por design). `SERVICE_ROLE`, `GEMINI_API_KEY`, `CAKTO_WEBHOOK_SEGREDO`, `JSON2VIDEO_API_KEY`, `ADMIN_MASTER_PASSWORD` já estão em secrets do backend.
- **Tokens JWT com expiração/refresh**: gerenciados pelo Supabase Auth.
- **Proteção contra brute force no /auth/token**: aplicada pela plataforma Supabase (não há hook local).

---

## Detalhes técnicos

### Migrations SQL
1. `rate_limits` (tabela + função `check_rate_limit`) — com GRANT só para `service_role`.
2. Ajustes de policies/GRANTs identificados na auditoria (uma migration por tabela alterada, se necessário).

### Ordem de execução
1. Migrations (rate limit + ajustes RLS).
2. Auth config (`configure_auth` com HIBP + email verificado).
3. Páginas legais + rodapé + banner + rotas de recuperação de senha + página de exclusão de conta.
4. Middleware de headers de segurança.
5. Rate limiting nos endpoints.
6. Auditoria de logs / limpeza de PII.
7. Rodar `supabase--linter` e `security--run_security_scan`, corrigir o que aparecer.
8. Escrever o relatório final (`RELATORIO_SEGURANCA_LGPD.md` na raiz + resumo no chat).

### Impacto no usuário final
- Novo banner de cookies aparece na primeira visita.
- Novos links no rodapé.
- Fluxo "esqueci minha senha" disponível na tela de login.
- Página "Minha conta" com exclusão.

---

## Confirmações antes de começar

1. **DPO/contato de privacidade**: qual e-mail usar para receber solicitações LGPD? (ex.: `privacidade@suportealevi.store`). Se não informar, uso `suportealevi.store` genérico.
2. **Razão social / CNPJ** para constar nas páginas legais — se não tiver, uso apenas "Alevi.ai" e um placeholder que você edita depois.
3. **CSP em Report-Only ou Enforce** desde o início? Recomendo Report-Only por 1 semana para não quebrar integrações.

Posso implementar com as suposições acima se preferir seguir direto.
