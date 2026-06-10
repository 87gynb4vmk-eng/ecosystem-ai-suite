
# Alevi.ai — Plano de Implementação

Ecossistema digital em duas frentes: **Landing Page** (vendas) e **Painel do Usuário** (pós-compra) com geração real por IA via Lovable AI Gateway, autenticação Supabase e integração com webhook da Cakto.

## 1. Identidade Visual (tokens globais)

Definidos em `src/styles.css` como design tokens semânticos (OKLCH) — nada de cores hardcoded em componentes.

- `--primary` → Verde Rolex `#006039`
- `--accent` / `--gold` → Ouro Premium `#C5A059`
- `--background` → off-white sofisticado / preto profundo (dark)
- Tipografia: Playfair Display (display/títulos) + Inter (corpo), carregadas via `<link>` no `__root.tsx`
- Tokens extras: `--gradient-gold`, `--gradient-dark`, `--shadow-luxury`, `--shadow-gold-glow`
- Variantes premium em Button (`gold`, `outline-gold`) e Card (`luxury`, `featured`)

## 2. Ambiente 1 — Landing Page (`src/routes/index.tsx`)

Seções em ordem:

1. **Header fixo** — logo Alevi.ai + CTA "Entrar" → `/auth`
2. **Hero** — título impactante sobre ecossistemas digitais com IA, sub-headline, CTA dourado "Criar meu ecossistema" → scroll para preços, mockup visual
3. **Como Funciona** — 3 passos visuais: Input do negócio → Geração por IA → Painel pronto
4. **Depoimentos 1** (pós "Como Funciona") — foco em resultado/faturamento rápido (ex.: Thiago M. — Infoprodutor Premium)
5. **Benefícios / Diferenciais** — grid de features (autoridade, IA, exclusividade)
6. **Depoimentos 2** (quebra de objeção, antes dos preços) — Sofia R., Lucas V., etc.
7. **Pricing** — dois cards lado a lado:
   - **Mensal** R$ 170/mês — card discreto, borda fina, botão verde
   - **Vitalício** R$ 250,90 pagamento único — card centralizado, maior, etiqueta dourada "MAIS VENDIDO", botão ouro premium
   - Links: `#checkout-mensal` e `#checkout-vitalicio` (placeholders Cakto)
8. **FAQ** curto + **Footer**

SEO: `head()` com title, description, og:title, og:description, og:image específicos.

## 3. Banco de Dados (Lovable Cloud / Supabase)

Habilitar Lovable Cloud e criar migração com:

**Tabela `usuarios`** (perfis estendidos — `auth.users` cuida do login)
- `id uuid PK` (= `auth.users.id`)
- `email text`
- `senha_temporaria text` (definida pelo webhook, limpa após primeiro login)
- `plano text` ('mensal' | 'vitalicio')
- `created_at timestamptz`

**Tabela `projetos`**
- `id uuid PK`
- `usuario_id uuid FK → usuarios(id) ON DELETE CASCADE`
- `nome_negocio text`
- `nicho text`
- `paginas_ia jsonb` (conteúdo gerado pela IA: landing, sobre, serviços, etc.)
- `created_at timestamptz`

GRANTs explícitos para `authenticated` e `service_role`. RLS habilitada:
- `usuarios`: usuário lê/atualiza apenas o próprio registro
- `projetos`: usuário lê/insere/deleta apenas onde `usuario_id = auth.uid()`

Secret: `CAKTO_WEBHOOK_SEGREDO = "PROVISORIO_123"` (via add_secret).

## 4. Webhook Cakto — `src/routes/api/public/webhook/cakto.ts`

- Server route POST com verificação HMAC (`x-cakto-signature`) contra `CAKTO_WEBHOOK_SEGREDO` usando `timingSafeEqual`
- Validação Zod do payload (email, plano, evento de compra aprovada)
- Carrega `supabaseAdmin` dentro do handler (await import)
- Gera `senha_temporaria` aleatória (12 chars)
- Cria usuário via `supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true })`
- Insere linha em `usuarios` com plano e senha temporária
- Retorna 200 OK; logs server-side, sem vazar detalhes

## 5. Autenticação

- Rota pública `/auth` — formulário email + senha (Supabase Auth)
- Após login bem-sucedido → redirect para `/_authenticated/dashboard`
- Layout `src/routes/_authenticated/route.tsx` (managed pattern, `ssr: false`, redirect para `/auth`)
- `attachSupabaseAuth` em `src/start.ts` (functionMiddleware)
- `onAuthStateChange` filtrado em `__root.tsx`

## 6. Ambiente 2 — Painel (`src/routes/_authenticated/dashboard.tsx`)

Estado inicial **completamente vazio** — sem dados demo.

Layout:
- Header com nome do usuário + botão "Sair"
- **Card de criação** (formulário):
  - Input "Nome do negócio"
  - Input "Nicho"
  - Textarea "Descreva seu negócio" (input rico para a IA)
  - Botão dourado "Gerar ecossistema com IA"
- **Histórico de projetos**:
  - Estado vazio: ilustração + texto "Você ainda não criou nenhum ecossistema. Comece agora acima."
  - Quando populado: grid de cards com nome do negócio, nicho, data, botão "Ver páginas"
- **Modal/rota detalhe** do projeto exibindo o JSON `paginas_ia` renderizado (landing, sobre, serviços, contato)

## 7. Geração por IA (real)

- Server function `src/lib/projetos.functions.ts`:
  - `gerarEcossistema` (protegida com `requireSupabaseAuth`)
  - Usa AI SDK + helper `src/lib/ai-gateway.server.ts` (provider Lovable AI Gateway)
  - Modelo: `google/gemini-3-flash-preview`
  - `generateText` com `Output.object` (Zod schema) retornando estrutura:
    ```
    { landing: { headline, subheadline, cta, beneficios[] },
      sobre: { titulo, texto },
      servicos: [{ titulo, descricao }],
      contato: { titulo, cta } }
    ```
  - Salva em `projetos.paginas_ia` e retorna o projeto
- `listarProjetos` e `obterProjeto` — também protegidas
- Cliente usa `useServerFn` + TanStack Query; erros 429/402 com toasts claros
- Secret `LOVABLE_API_KEY` provisionado via `ai_gateway--create`

## 8. Detalhes Técnicos

- Stack: TanStack Start (já presente), Tailwind v4, shadcn/ui
- Componentes em `src/components/`: `Header.tsx`, `Hero.tsx`, `ComoFunciona.tsx`, `Testimonials.tsx`, `Pricing.tsx`, `Faq.tsx`, `Footer.tsx`, `ProjetoCard.tsx`, `CriarProjetoForm.tsx`
- Imagens: gerar 1 hero premium (mockup dashboard verde/dourado) via imagegen
- Validação de inputs com Zod (cliente e servidor)
- Migração SQL única com GRANTs + RLS + policies + has_role pattern (não usado agora, mas estrutura limpa)

## 9. Ordem de Execução

1. Habilitar Lovable Cloud + provisionar LOVABLE_API_KEY + secret CAKTO
2. Migração SQL (tabelas, GRANTs, RLS, policies)
3. Tokens visuais em `src/styles.css` + fontes no `__root.tsx`
4. Gerar imagem hero
5. Componentes da landing + `src/routes/index.tsx`
6. `/auth` route
7. `_authenticated/route.tsx` layout
8. Server functions de projetos (IA) + helper AI Gateway
9. Dashboard `_authenticated/dashboard.tsx` + form + lista
10. Server route webhook Cakto
11. Verificações: build, navegação, criação manual de conta de teste

## 10. Itens fora do escopo (para depois)

- URLs reais Cakto (placeholders por ora)
- Renderização pública do site gerado em domínio próprio
- Painel admin / métricas
- Reset de senha self-service (fluxo focado em senha temporária Cakto)
