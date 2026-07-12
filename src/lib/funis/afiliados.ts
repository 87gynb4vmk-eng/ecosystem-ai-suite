import { Megaphone, Layers, Sparkles, Rocket, Target, Zap } from "lucide-react";
import type { FunilTemplateProps } from "@/components/funil/FunilTemplate";

export const afiliadosFunil: FunilTemplateProps = {
  slug: "afiliados",
  publico: "Para afiliados e profissionais de marketing digital",
  headline: "Passe menos tempo criando estrutura e mais tempo divulgando suas ofertas.",
  subheadline:
    "A Alevi entrega páginas, criativos, conteúdos e materiais de apoio prontos para você focar em tráfego e conversão.",
  ctaPrimario: "Quero divulgar mais rápido",
  demonstracao: {
    titulo: "Assets prontos para você divulgar",
    itens: [
      "Landing pages otimizadas",
      "Criativos para redes sociais",
      "Textos de anúncios",
      "Vídeos curtos para reels",
      "Conteúdo para WhatsApp e Telegram",
      "Estrutura pronta para escalar campanhas",
    ],
  },
  beneficios: [
    { icon: Megaphone, titulo: "Foco em divulgação", desc: "Menos criação, mais tráfego." },
    { icon: Sparkles, titulo: "IA otimizada pra copy", desc: "Textos pensados para conversão." },
    { icon: Layers, titulo: "Tudo em um lugar", desc: "Pare de pular entre ferramentas." },
    { icon: Target, titulo: "Testes rápidos", desc: "Gere variações para testar em campanhas." },
    { icon: Zap, titulo: "Velocidade real", desc: "Estrutura pronta em minutos." },
    { icon: Rocket, titulo: "Escala facilitada", desc: "Rode várias ofertas em paralelo." },
  ],
  comoFunciona: [
    { passo: "01", titulo: "Escolha a oferta", desc: "Defina o produto ou nicho." },
    { passo: "02", titulo: "Gere os assets", desc: "Página, criativos e textos prontos." },
    { passo: "03", titulo: "Rode as campanhas", desc: "Envie tráfego para as páginas geradas." },
    { passo: "04", titulo: "Otimize", desc: "Teste variações e melhore o retorno." },
  ],
  entrega: [
    "Landing pages responsivas",
    "Copies para anúncios",
    "Criativos para redes sociais",
    "Vídeos curtos gerados por IA",
    "Materiais para grupos e listas",
    "Painel para gerenciar suas páginas",
  ],
  faq: [
    { pergunta: "Serve para qualquer nicho?", resposta: "Sim, você define o nicho e a IA se adapta." },
    { pergunta: "Posso usar em várias campanhas?", resposta: "Sim, gere quantas páginas e variações precisar." },
    { pergunta: "Integra com Cakto e Kiwify?", resposta: "Sim, você conecta o link do checkout facilmente." },
    { pergunta: "Preciso saber programar?", resposta: "Não. Tudo é feito por interface visual." },
  ],
  ctaFinal: "Divulgue mais e crie menos manualmente",
};
