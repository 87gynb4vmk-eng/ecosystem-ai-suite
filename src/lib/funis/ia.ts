import { Brain, Sparkles, Layers, Rocket, Bot, Wand2 } from "lucide-react";
import type { FunilTemplateProps } from "@/components/funil/FunilTemplate";

export const iaFunil: FunilTemplateProps = {
  slug: "ia",
  publico: "Para quem quer aplicar IA no negócio digital",
  headline: "A IA que organiza praticamente toda a estrutura do seu produto digital.",
  subheadline:
    "A Alevi usa inteligência artificial para criar eBooks, páginas de vendas, vídeos, conteúdos e a estrutura de lançamento — em minutos, não em semanas.",
  ctaPrimario: "Quero aplicar IA no meu produto",
  demonstracao: {
    titulo: "O que a IA da Alevi faz por você",
    itens: [
      "Escreve eBooks completos a partir de um tema",
      "Cria páginas de vendas com copy persuasiva",
      "Gera roteiros e vídeos curtos",
      "Produz conteúdos para redes sociais",
      "Monta a estrutura de lançamento",
      "Otimiza títulos, chamadas e ofertas",
    ],
  },
  beneficios: [
    { icon: Brain, titulo: "IA especializada", desc: "Modelos treinados para o mercado digital brasileiro." },
    { icon: Sparkles, titulo: "Qualidade profissional", desc: "Conteúdo pronto para publicar sem retrabalho." },
    { icon: Wand2, titulo: "Prompt simples", desc: "Você descreve, a IA entrega estrutura completa." },
    { icon: Bot, titulo: "Automação real", desc: "Reduz drasticamente tarefas repetitivas." },
    { icon: Layers, titulo: "Ecossistema unificado", desc: "Todos os assets integrados na mesma plataforma." },
    { icon: Rocket, titulo: "Pronto para escalar", desc: "Gere quantos produtos precisar sem custo adicional por criação." },
  ],
  comoFunciona: [
    { passo: "01", titulo: "Descreva o produto", desc: "Diga qual é o tema e público." },
    { passo: "02", titulo: "IA gera a estrutura", desc: "eBook, página, vídeos e conteúdos." },
    { passo: "03", titulo: "Você ajusta detalhes", desc: "Refina o que quiser em cliques." },
    { passo: "04", titulo: "Publique e divulgue", desc: "Ecosistema completo pronto para ir ao ar." },
  ],
  entrega: [
    "eBook gerado por IA em PDF",
    "Página de vendas com copy pronta",
    "Vídeos e roteiros automatizados",
    "Posts prontos para redes sociais",
    "Estrutura de lançamento organizada",
    "Painel de gestão dos seus produtos",
  ],
  faq: [
    { pergunta: "Qual IA a Alevi usa?", resposta: "Modelos de linguagem e de geração de vídeo integrados via nosso gateway." },
    { pergunta: "O conteúdo é original?", resposta: "Sim, cada geração é única a partir do seu prompt." },
    { pergunta: "Preciso saber prompt engineering?", resposta: "Não. A plataforma já traz prompts otimizados por trás." },
    { pergunta: "Posso revisar tudo?", resposta: "Sim, você tem controle total do conteúdo antes de publicar." },
  ],
  ctaFinal: "Coloque a IA para trabalhar pelo seu produto",
};
