import { Clock, Zap, Layers, Cpu, Workflow, Rocket } from "lucide-react";
import type { FunilTemplateProps } from "@/components/funil/FunilTemplate";

export const produtividadeFunil: FunilTemplateProps = {
  slug: "produtividade",
  publico: "Para quem quer economizar tempo",
  headline: "Pare de perder horas fazendo tudo manualmente.",
  subheadline:
    "A Alevi centraliza a criação de eBooks, páginas, vídeos e conteúdos em uma única plataforma. Menos ferramentas, menos abas, mais foco.",
  ctaPrimario: "Quero economizar tempo",
  demonstracao: {
    titulo: "Substitua várias ferramentas por uma só",
    itens: [
      "Editor de eBook",
      "Construtor de landing page",
      "Gerador de vídeos",
      "Criador de conteúdo social",
      "Gestor de produtos",
      "Integrações com Cakto e Kiwify",
    ],
  },
  beneficios: [
    { icon: Clock, titulo: "Ganhe horas por semana", desc: "Automatize o que hoje é feito manualmente." },
    { icon: Zap, titulo: "Fluxo rápido", desc: "Do prompt ao produto pronto em minutos." },
    { icon: Layers, titulo: "Menos ferramentas", desc: "Um lugar só para tudo do produto digital." },
    { icon: Cpu, titulo: "IA que executa", desc: "A parte repetitiva sai do seu ombro." },
    { icon: Workflow, titulo: "Processo unificado", desc: "Fim do quebra-cabeça entre apps." },
    { icon: Rocket, titulo: "Lançamentos mais frequentes", desc: "Crie e teste novos produtos com facilidade." },
  ],
  comoFunciona: [
    { passo: "01", titulo: "Centralize", desc: "Traga sua criação para dentro da Alevi." },
    { passo: "02", titulo: "Automatize", desc: "Use a IA para gerar a estrutura completa." },
    { passo: "03", titulo: "Revise rápido", desc: "Ajuste apenas o necessário." },
    { passo: "04", titulo: "Publique", desc: "Divulgue com os assets já prontos." },
  ],
  entrega: [
    "eBook, página, vídeo e conteúdo em uma plataforma",
    "Fluxo de trabalho unificado",
    "Templates prontos para reutilizar",
    "Painel único de gestão",
    "Integrações com Cakto e Kiwify",
    "Redução real de horas de trabalho",
  ],
  antesDepois: {
    antes: [
      "Várias ferramentas separadas",
      "Processos demorados e manuais",
      "Muitas tarefas repetitivas",
      "Copiar e colar entre apps",
      "Difícil de organizar",
      "Lançamentos travados por falta de tempo",
    ],
    depois: [
      "Uma única plataforma",
      "IA gerando a estrutura completa",
      "Automação das tarefas repetitivas",
      "Tudo conectado por dentro",
      "Painel único e organizado",
      "Mais tempo livre para divulgar",
    ],
  },
  faq: [
    { pergunta: "Quanto tempo economiza?", resposta: "Depende do fluxo atual, mas usuários relatam horas por semana." },
    { pergunta: "Preciso migrar meus produtos antigos?", resposta: "Não. Você pode usar a Alevi só para novos produtos." },
    { pergunta: "Funciona com quais integrações?", resposta: "Cakto, Kiwify e canais como WhatsApp e Telegram." },
    { pergunta: "Posso cancelar quando quiser?", resposta: "Sim, o plano mensal pode ser cancelado a qualquer momento." },
  ],
  ctaFinal: "Libere horas na sua semana",
};
