import { Layers, Package, Rocket, Zap, ShieldCheck, Sparkles } from "lucide-react";
import type { FunilTemplateProps } from "@/components/funil/FunilTemplate";

export const tudoFunil: FunilTemplateProps = {
  slug: "tudo",
  publico: "Solução completa em uma só plataforma",
  headline: "Tudo o que você precisa para criar e lançar um produto digital em um só lugar.",
  subheadline:
    "eBooks, landing pages, vídeos, integrações com Cakto, Kiwify e canais de divulgação — tudo dentro da Alevi.",
  ctaPrimario: "Quero a solução completa",
  demonstracao: {
    titulo: "O ecossistema completo Alevi",
    itens: [
      "eBooks com IA",
      "Landing pages responsivas",
      "Vídeos e roteiros",
      "Integração com Cakto",
      "Integração com Kiwify",
      "Distribuição em Facebook, WhatsApp e Telegram",
    ],
  },
  beneficios: [
    { icon: Package, titulo: "Tudo incluído", desc: "Você não precisa contratar outras ferramentas." },
    { icon: Layers, titulo: "Fluxo integrado", desc: "Cada etapa conversa com a próxima." },
    { icon: Sparkles, titulo: "IA em cada etapa", desc: "Criação, revisão e publicação assistidas." },
    { icon: Zap, titulo: "Velocidade", desc: "Do prompt ao ar em poucos passos." },
    { icon: ShieldCheck, titulo: "Segurança", desc: "Boas práticas de segurança e privacidade." },
    { icon: Rocket, titulo: "Pronto para escalar", desc: "Rode vários lançamentos em paralelo." },
  ],
  comoFunciona: [
    { passo: "01", titulo: "Escolha o produto", desc: "Diga o tema e o público." },
    { passo: "02", titulo: "Gere a estrutura", desc: "eBook, página, vídeo e conteúdo criados." },
    { passo: "03", titulo: "Conecte checkout", desc: "Cakto ou Kiwify em cliques." },
    { passo: "04", titulo: "Divulgue", desc: "Use os canais de distribuição prontos." },
  ],
  entrega: [
    "eBooks completos",
    "Landing pages profissionais",
    "Vídeos gerados por IA",
    "Integrações com Cakto e Kiwify",
    "Materiais para Facebook, WhatsApp e Telegram",
    "Painel completo de gestão",
  ],
  faq: [
    { pergunta: "Preciso de outras ferramentas?", resposta: "Não para o essencial. A Alevi cobre criação, página e distribuição." },
    { pergunta: "Como funciona a integração com Cakto e Kiwify?", resposta: "Você conecta seu link de checkout diretamente à página." },
    { pergunta: "Consigo publicar em canais sociais?", resposta: "Sim, geramos conteúdos prontos para publicação em canais como Facebook, WhatsApp e Telegram." },
    { pergunta: "Existe limite de produtos?", resposta: "Depende do plano contratado — o vitalício libera todo o ecossistema sem mensalidade." },
  ],
  ctaFinal: "Tudo o que você precisa em uma única plataforma",
};
