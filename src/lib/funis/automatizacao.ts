import { Cpu, Workflow, Zap, Bot, Repeat, Rocket } from "lucide-react";
import type { FunilTemplateProps } from "@/components/funil/FunilTemplate";

export const automatizacaoFunil: FunilTemplateProps = {
  slug: "automatizacao",
  publico: "Para quem busca automatizar processos",
  headline: "Automatize grande parte do processo de criação do seu produto digital.",
  subheadline:
    "A Alevi reduz tarefas repetitivas usando IA para gerar eBooks, páginas, vídeos e conteúdos em fluxo automatizado.",
  ctaPrimario: "Quero automatizar meu processo",
  demonstracao: {
    titulo: "O que fica automatizado",
    itens: [
      "Escrita do eBook",
      "Diagramação em PDF",
      "Criação da landing page",
      "Geração de vídeos curtos",
      "Textos para redes sociais",
      "Estrutura de lançamento",
    ],
  },
  beneficios: [
    { icon: Cpu, titulo: "IA no fluxo", desc: "Cada etapa apoiada por inteligência artificial." },
    { icon: Workflow, titulo: "Processo conectado", desc: "Uma etapa alimenta a próxima automaticamente." },
    { icon: Repeat, titulo: "Menos repetição", desc: "Reduz o trabalho manual e repetitivo." },
    { icon: Bot, titulo: "Menos operacional", desc: "Você foca em estratégia, a IA na execução." },
    { icon: Zap, titulo: "Ganho de velocidade", desc: "Lançamentos e testes muito mais rápidos." },
    { icon: Rocket, titulo: "Escala real", desc: "Rode vários produtos ao mesmo tempo." },
  ],
  comoFunciona: [
    { passo: "01", titulo: "Descreva o produto", desc: "Prompt inicial em uma tela." },
    { passo: "02", titulo: "Fluxo automatizado", desc: "IA gera cada etapa em sequência." },
    { passo: "03", titulo: "Revisão rápida", desc: "Você aprova ou ajusta detalhes." },
    { passo: "04", titulo: "Publicação", desc: "Estrutura completa vai ao ar." },
  ],
  entrega: [
    "Automatização da criação de eBooks",
    "Automatização de páginas de vendas",
    "Automatização de conteúdos curtos",
    "Fluxo de lançamento organizado",
    "Redução expressiva de tarefas manuais",
    "Painel de acompanhamento",
  ],
  faq: [
    { pergunta: "É totalmente automático?", resposta: "A maior parte é automatizada; você mantém o controle das decisões estratégicas." },
    { pergunta: "Consigo customizar?", resposta: "Sim, cada etapa pode ser revisada e ajustada." },
    { pergunta: "Precisa integrar com outras ferramentas?", resposta: "Não é obrigatório, mas suportamos Cakto, Kiwify e canais como WhatsApp e Telegram." },
    { pergunta: "Serve para qualquer nicho?", resposta: "Sim, a IA se adapta ao tema e público que você definir." },
  ],
  ctaFinal: "Automatize e ganhe tempo real",
};
