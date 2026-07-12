
## Objetivo

Criar 11 rotas de funil (`/celular`, `/ia`, `/ebook`, `/iniciante`, `/negocio`, `/produtividade`, `/afiliados`, `/tudo`, `/demo`, `/automatizacao`, `/quiz`) + 3 auxiliares (`/obrigado`, `/oferta`, `/checkout-info`) — todas dentro do projeto atual, reutilizando o design system (tokens `bg-gradient-gold`, `text-gold`, `shadow-gold-glow`, etc.), componentes existentes (`Header`, `Footer`, `OfertaRelampago`) e os mesmos links Cakto usados hoje (Mensal `di3c2n7_975572`, Vitalício `rrwtdn3_976866`).

Nota: a rota `/checkout` já existe (`checkout.$plano.tsx` — fluxo autenticado da plataforma). Para não conflitar, a página intermediária pública será `/checkout-info`.

## Arquitetura (evitar duplicação)

**Novo componente compartilhado:** `src/components/funil/FunilTemplate.tsx`

Recebe props e renderiza todas as seções pedidas na mesma ordem em todos os funis:

```ts
type FunilTemplateProps = {
  slug: string;                    // usado em meta / analytics
  headline: string;
  subheadline: string;
  ctaPrimario?: string;            // default: "Quero começar agora"
  publico: string;                 // linha curta acima da headline
  videoEmbedUrl?: string;          // se null, mostra placeholder estilizado
  demonstracao: { titulo: string; itens: string[] };
  beneficios: { icon: LucideIcon; titulo: string; desc: string }[];
  comoFunciona: { passo: string; titulo: string; desc: string }[];  // 3-5 passos
  entrega: string[];               // lista "O que a Alevi entrega"
  antesDepois?: { antes: string[]; depois: string[] };  // opcional (obrigatório em /produtividade)
  faq: { pergunta: string; resposta: string }[];
  ctaFinal?: string;
};
```

Seções renderizadas (todas responsivas, tokens do design system, animações via `transition-all`, `animate-fade-in` e `hover:scale`):

1. `<Header />` compartilhado
2. Hero — badge de público, headline (h1, `text-4xl sm:text-6xl`), subheadline, CTA gold, indicadores de confiança
3. Bloco de vídeo — iframe `videoEmbedUrl` ou placeholder 16:9 com ícone play
4. Demonstração da plataforma — grid com screenshots/mocks (usa `bento-grid` de cards com gradient)
5. Benefícios — grid 2/3 colunas com ícones lucide
6. Como funciona — passos numerados em cards com conector visual
7. O que a Alevi entrega — lista com checks dourados
8. Antes x Depois — duas colunas contrastantes (só quando a prop existe)
9. **`<OfertaRelampago />`** reaproveitado (planos + cronômetro + Cakto)
10. FAQ — accordion (reusar padrão do `LandingPageTemplate`)
11. CTA final — banner full-width gold com botão Cakto
12. `<Footer />` compartilhado

Cada seção usa `min-h-0 shrink-0 truncate` conforme guia de layout responsivo. Padding vertical `py-16 sm:py-24`, container `max-w-6xl`.

## Arquivos novos

**Template + conteúdos por funil** (`src/lib/funis/*.ts` — só dados, sem lógica):

- `src/lib/funis/celular.ts`
- `src/lib/funis/ia.ts`
- `src/lib/funis/ebook.ts`
- `src/lib/funis/iniciante.ts`
- `src/lib/funis/negocio.ts`
- `src/lib/funis/produtividade.ts` (inclui `antesDepois`)
- `src/lib/funis/afiliados.ts`
- `src/lib/funis/tudo.ts`
- `src/lib/funis/demo.ts` (foco em fluxo prompt → ebook → LP → vídeos)
- `src/lib/funis/automatizacao.ts`

Cada arquivo exporta um objeto `FunilTemplateProps` com o conteúdo do briefing, sempre respeitando as regras: sem promessa de renda, sem "fica rico", foco em criar produto/economizar tempo/organizar estrutura.

**Rotas de funil** (uma linha cada, apenas montam o template + `head()` com título/descrição/og próprios):

- `src/routes/celular.tsx`
- `src/routes/ia.tsx`
- `src/routes/ebook.tsx`
- `src/routes/iniciante.tsx`
- `src/routes/negocio.tsx`
- `src/routes/produtividade.tsx`
- `src/routes/afiliados.tsx`
- `src/routes/tudo.tsx`
- `src/routes/demo.tsx`
- `src/routes/automatizacao.tsx`

Cada rota: `createFileRoute("/<slug>")` com `head()` único (title <60 chars, description <160 chars, og:title, og:description, og:type=website) e `component` que retorna `<FunilTemplate {...conteudoDoSlug} />`.

**Quiz interativo:**

- `src/routes/quiz.tsx` — client-side stepper (4 perguntas do briefing), estado com `useState`, barra de progresso, animação de transição entre perguntas
  - Lógica de resultado: mapeia respostas em 4 perfis (`Iniciante`, `Criador em Evolução`, `Especialista em Escala`, `Explorador de IA`) via pontuação simples nas respostas
  - Tela final: nome do perfil, explicação em 2 parágrafos + `<OfertaRelampago />` embutido + CTA extra "Quero criar minha estrutura com a Alevi" apontando para Cakto (Vitalício por padrão)
  - `<Header />` e `<Footer />` compartilhados
  - Persistência do resultado em `localStorage` para pré-selecionar na volta

**Páginas auxiliares:**

- `src/routes/obrigado.tsx` — pós-compra: confirmação, próximos passos (verificar e-mail, acessar `/auth`, entrar em contato), CTA para dashboard, links para políticas
- `src/routes/oferta.tsx` — página curta focada só em `<OfertaRelampago />` + FAQ resumido + garantia
- `src/routes/checkout-info.tsx` — página intermediária: escolha entre Mensal/Vitalício com selo de segurança, explica o que acontece após clicar (redireciona para Cakto), botões para os dois links

## SEO / head

Cada rota tem `head()` próprio (nunca reutilizar do `/`). Padrão:

```ts
head: () => ({
  meta: [
    { title: "Crie e venda produtos digitais pelo celular — Alevi.ai" },
    { name: "description", content: "..." },
    { property: "og:title", content: "..." },
    { property: "og:description", content: "..." },
    { property: "og:type", content: "website" },
  ],
})
```

Sem `og:image` (não temos hero image dedicada por funil ainda; hosting adiciona screenshot automaticamente).

## Fora de escopo

- Não alterar `/` (landing atual permanece igual)
- Não alterar `/checkout/$plano` (fluxo autenticado da plataforma)
- Não criar novos endpoints server / migrations
- Não adicionar tracking/pixel (pode ser feito depois, quando o usuário fornecer os IDs)
- Sem geração de imagens/vídeos — o slot de vídeo mostra placeholder até o usuário fornecer o embed

## Verificação

Após implementar, `bun run build` para garantir que o `routeTree.gen.ts` regenera limpo e não há import quebrado.
