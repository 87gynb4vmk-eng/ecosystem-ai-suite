import { Sparkles, Compass, Layers, ShieldCheck, Rocket, Users } from "lucide-react";
import type { FunilTemplateProps } from "@/components/funil/FunilTemplate";

export const inicianteFunil: FunilTemplateProps = {
  slug: "iniciante",
  publico: "Feito para quem está começando do zero",
  headline: "Nunca vendeu um produto digital? Comece por aqui.",
  subheadline:
    "A Alevi guia você em cada passo — da criação do produto até a página de vendas — com uma interface simples pensada para iniciantes.",
  ctaPrimario: "Quero começar do zero",
  demonstracao: {
    titulo: "Um caminho simples do zero ao seu primeiro produto",
    itens: [
      "Passo a passo guiado",
      "Sem termos técnicos difíceis",
      "Modelos prontos para você usar",
      "Estrutura já organizada",
      "Suporte para tirar dúvidas",
      "Comunidade para trocar experiências",
    ],
  },
  beneficios: [
    { icon: Compass, titulo: "Caminho claro", desc: "Você sabe exatamente o que fazer em cada etapa." },
    { icon: Sparkles, titulo: "IA que ajuda", desc: "A parte difícil fica com a inteligência artificial." },
    { icon: Layers, titulo: "Tudo em um só lugar", desc: "Sem juntar dezenas de ferramentas." },
    { icon: ShieldCheck, titulo: "Segurança pra começar", desc: "Ambiente estruturado para você não se perder." },
    { icon: Users, titulo: "Comunidade ativa", desc: "Aprenda com outros criadores digitais." },
    { icon: Rocket, titulo: "Primeiro produto rápido", desc: "Do prompt ao produto em poucas horas." },
  ],
  comoFunciona: [
    { passo: "01", titulo: "Crie sua conta", desc: "Cadastro simples em um minuto." },
    { passo: "02", titulo: "Escolha o tema", desc: "Diga sobre o que você quer criar." },
    { passo: "03", titulo: "Gere sua estrutura", desc: "eBook, página e material prontos." },
    { passo: "04", titulo: "Publique", desc: "Compartilhe seu link e comece a divulgar." },
  ],
  entrega: [
    "Passo a passo guiado dentro da plataforma",
    "eBook, página e conteúdos prontos",
    "Modelos e templates para começar",
    "Painel simples para gerenciar tudo",
    "Suporte por e-mail",
    "Materiais introdutórios",
  ],
  faq: [
    { pergunta: "É difícil de usar?", resposta: "Não. A interface é pensada para quem nunca criou um produto digital." },
    { pergunta: "Preciso ter um tema pronto?", resposta: "Não. A IA ajuda a estruturar até a ideia." },
    { pergunta: "Consigo suporte?", resposta: "Sim, oferecemos suporte por e-mail." },
    { pergunta: "Existe garantia?", resposta: "Sim, garantia legal de arrependimento em até 7 dias após a compra." },
  ],
  ctaFinal: "Dê o primeiro passo no mercado digital",
};
