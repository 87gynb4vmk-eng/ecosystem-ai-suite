## Nova seção de oferta relâmpago

Substituir a `Pricing` atual da landing por uma seção mais persuasiva, com banner de urgência, cronômetro real de 15 min por visitante e dois cards de oferta com os novos preços/links.

### Arquivos

**Novo:** `src/components/landing/OfertaRelampago.tsx`
- Banner topo vermelho com texto: "🔥 OFERTA RELÂMPAGO! Você tem apenas 15 minutos..."
- Cronômetro grande HH:MM:SS, tipografia grande, cor vermelha, animação suave (pulse leve + transição em cada segundo)
- Persistência por visitante via `localStorage` (`alevi_oferta_deadline`): na primeira visita grava `Date.now() + 15*60*1000`; em visitas seguintes reusa o mesmo deadline
- `useEffect` com `setInterval(1000)` calcula tempo restante; quando chega a 0:
  - Cronômetro é substituído por bloco "⏰ Promoção encerrada" 
  - Cards ficam com opacidade reduzida, preços promocionais riscados e um aviso: "Esta oferta expirou. Os preços voltaram ao valor normal." (mostra R$ 150 e R$ 350 como preço vigente)
  - Botões continuam funcionando mas com label "Ver planos" apontando para o Cakto (comportamento honesto — sem reiniciar contagem)
- Dois cards responsivos (grid 1 col mobile / 2 cols desktop):
  - **Mensal**: selo 🚀, "De R$ 150,00" riscado, "Por apenas R$ 55,00" grande, botão verde "QUERO O PLANO MENSAL" → `https://pay.cakto.com.br/di3c2n7_975572`
  - **Vitalício (destaque)**: selos "⭐ MAIS VENDIDO" e "💰 Melhor Custo-Benefício", borda dourada, escala levemente maior no desktop, "De R$ 350,00" riscado, "Por apenas R$ 150,00", botão dourado "QUERO ACESSO VITALÍCIO" → `https://pay.cakto.com.br/rrwtdn3_976866`
- Rodapé de gatilhos: ✅ Acesso imediato / ✅ Pagamento 100% seguro / ✅ Oferta por tempo limitado
- Usa tokens do design system (`bg-gradient-gold`, `text-gold`, `shadow-gold-glow`, `bg-destructive`, etc.) — sem cores hardcoded

**Editar:** `src/routes/index.tsx`
- Trocar `import { Pricing }` por `import { OfertaRelampago }` e usar o novo componente no lugar de `<Pricing />`

`src/components/landing/Pricing.tsx` permanece no repo (não referenciado) — não deletar para preservar histórico.

### Detalhes técnicos

- SSR-safe: leitura de `localStorage` e `Date.now()` dentro de `useEffect`, estado inicial do timer = `null` até hidratar (evita mismatch)
- Animação: `transition-all duration-300` nos dígitos + classe `animate-pulse` sutil no bloco do timer enquanto ativo
- Acessibilidade: `aria-live="polite"` no cronômetro, `role="timer"`
- Responsivo: dígitos `text-5xl sm:text-7xl`, cards `grid gap-6 md:grid-cols-2`, padding adaptado
- Links abrem em `_top` com `rel="noopener noreferrer"` (mesmo padrão do `Pricing` atual)
