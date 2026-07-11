# Relatório de Segurança e Conformidade — Alevi.ai

Última revisão: 11/07/2026.

## 1. Resumo executivo

Nível atual estimado: **Bom** — conformidade material com LGPD e cobertura das
principais categorias do OWASP Top 10. Restam ações **manuais** de baixo esforço
(marcadas na seção 5) para atingir nível **Alto**.

## 2. Alterações aplicadas nesta rodada

### 2.1 LGPD / conteúdo legal
- Nova **Política de Privacidade LGPD** em `/politica-privacidade` com bases
  legais, retenção, operadores, direitos do titular e transferências
  internacionais.
- Novos **Termos de Uso** em `/termos-de-uso` (art. 49 CDC, uso aceitável,
  responsabilidade, foro).
- Nova **Política de Cookies** em `/politica-cookies` com tabela categorizada e
  botão para reabrir as preferências.
- Novo **Contato de Privacidade (DPO)** em `/contato-privacidade`
  (`privacidade@suportealevi.store`).
- Rodapé (`Footer.tsx`) atualizado com links para todas as páginas legais e
  para a área "Excluir minha conta".
- Redirects 301 lógicos: `/privacidade`, `/privacy`, `/security`, `/trust` →
  `/politica-privacidade`.

### 2.2 Direitos do titular (art. 18 LGPD)
- Página **Minha conta** (`/conta`) autenticada, com fluxo de exclusão que
  exige confirmação textual.
- Server function `excluirMinhaConta` apaga `usuarios`, `pedidos`, `projetos`,
  `ebooks`, `videos`, `user_roles` e a conta de autenticação (`auth.admin.deleteUser`).

### 2.3 Recuperação de senha
- `/esqueci-senha` → `supabase.auth.resetPasswordForEmail` com `redirectTo`
  para `/redefinir-senha`.
- `/redefinir-senha` (SSR desligado) valida sessão `PASSWORD_RECOVERY` e chama
  `updateUser({ password })`, com validação Zod (8–72 chars).
- Link "Esqueci minha senha" adicionado à tela `/auth`.

### 2.4 Consentimento de cookies
- Componente `CookieBanner` armazena a escolha em `localStorage`
  (`cookie-consent-v1`), com opções **Aceitar todos** / **Recusar não essenciais**.
- Banner renderizado globalmente no `__root.tsx`.

### 2.5 Autenticação Supabase
- `password_hibp_enabled: true` (checagem HaveIBeenPwned).
- `auto_confirm_email: false` (verificação de e-mail habilitada para futuros
  cadastros self-service; o provisionamento pós-compra continua criando conta
  já confirmada).
- `disable_signup: true` (cadastro público desabilitado — contas nascem via
  webhook Cakto).
- `external_anonymous_users_enabled: false` (sem usuários anônimos).

### 2.6 Cabeçalhos de segurança (aplicados em todas as respostas via middleware
global em `src/start.ts`)
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(),
  interest-cohort=()`
- `Content-Security-Policy-Report-Only` (permite Supabase, Lovable e fontes
  Google; frame-ancestors restritos). Depois de 1–2 semanas monitorando o
  console, promover para `Content-Security-Policy` (enforce).

## 3. Itens já cobertos pela plataforma (não requerem código)

| Requisito | Status | Origem |
|---|---|---|
| HTTPS obrigatório | ✅ | Lovable / Cloudflare (redirect + HSTS) |
| Hash de senha (bcrypt) | ✅ | Supabase Auth |
| Rotação/expiração de JWT | ✅ | Supabase Auth (access 1h, refresh rotation) |
| Proteção contra brute force no `/auth/token` | ✅ | Rate limit gerenciado pelo Supabase |
| Segredos fora do frontend | ✅ | `SERVICE_ROLE`, `GEMINI_API_KEY`, `CAKTO_WEBHOOK_SEGREDO`, `JSON2VIDEO_API_KEY`, `ADMIN_MASTER_PASSWORD`, `LOVABLE_API_KEY` em variáveis de ambiente do servidor |
| Chave publicável do Supabase no cliente | ✅ | `VITE_SUPABASE_PUBLISHABLE_KEY` é pública por design |
| RLS habilitado nas tabelas de negócio | ✅ | `usuarios`, `ebooks`, `videos`, `projetos`, `pedidos`, `user_roles` (auditado) |
| `SECURITY DEFINER` com search_path fixo | ✅ | Corrigido em migrations anteriores |

## 4. Cobertura OWASP Top 10 (2021)

| Categoria | Como está tratada |
|---|---|
| A01 Broken Access Control | RLS por `auth.uid()`; rotas admin protegidas por `has_role`; server functions com `requireSupabaseAuth`. |
| A02 Cryptographic Failures | HTTPS forçado, HSTS, senhas bcrypt, HIBP ativo, segredos em env vars. |
| A03 Injection | Zero SQL string concatenado no app; queries via Supabase client parametrizado; validação Zod nos inputs. |
| A04 Insecure Design | Webhooks com HMAC + verificação `timingSafeEqual`; idempotência por `gateway_event_id`. |
| A05 Security Misconfiguration | Headers de segurança + CSP-Report-Only; `disable_signup`; sem policies anônimas em tabelas privadas. |
| A06 Vulnerable Components | `bun` + versões pinadas; scanner de dependências disponível via ferramenta interna. |
| A07 Ident. & Auth Failures | HIBP, verificação de e-mail, `resetPasswordForEmail`, senhas 8–72 caracteres na UI, rate-limit Supabase. |
| A08 Data Integrity Failures | Assinatura HMAC nos webhooks; imports server-only isolados (`client.server.ts`). |
| A09 Logging & Monitoring | Logs sem senhas/tokens; logs de auditoria em ações admin (`admin.functions.ts`). |
| A10 SSRF | Sem fetch de URLs arbitrárias fornecidas por usuário. |

## 5. Pendências que dependem de configuração manual

1. **Preencher razão social / CNPJ** nas páginas legais (placeholders atuais só
   citam "Alevi.ai").
2. **Configurar a caixa `privacidade@suportealevi.store`** e definir prazo de
   SLA interno para respostas LGPD (recomendado: 15 dias).
3. **Promover CSP** de `Report-Only` para enforce após validar em produção.
4. **Rate-limit adicional para login** — o Supabase já limita, mas se quiser
   política própria mais rígida, é preciso um proxy (Cloudflare WAF) na frente
   do endpoint `/auth/v1/token`.
5. **Backups de banco**: verificar/ativar retenção conforme necessidade (feito
   pela Lovable Cloud; ajustar plano se precisar de RPO menor).
6. **Registro público de tratamento (RoPA)** — manter uma planilha interna
   listando operações de tratamento (obrigação do controlador).

## 6. Nível atual

- **Conformidade LGPD:** materialmente conforme.
- **Segurança técnica:** boas práticas OWASP aplicadas; sem vulnerabilidades
  abertas conhecidas neste ciclo.
- **Próxima revisão sugerida:** trimestral, com rerun do scanner de segurança
  e do linter Supabase.
