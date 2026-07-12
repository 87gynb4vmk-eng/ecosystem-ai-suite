import { Briefcase, Layers, TrendingUp, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import type { FunilTemplateProps } from "@/components/funil/FunilTemplate";

export const negocioFunil: FunilTemplateProps = {
  slug: "negocio",
  publico: "Para quem quer começar um negócio digital",
  headline: "Comece seu negócio digital sem complicação.",
  subheadline:
    "A Alevi organiza praticamente toda a estrutura inicial do seu negócio digital — do produto à página de vendas — para que você foque no que importa.",
  ctaPrimario: "Quero começar meu negócio",
  demonstracao: {
    titulo: "Sua estrutura inicial de negócio digital",
    itens: [
      "Produto digital criado com IA",
      "Página de vendas profissional",
      "Estrutura para receber pagamentos",
      "Conteúdos para divulgação",
      "Material de lançamento",
      "Painel para gerenciar tudo",
    ],
  },
  beneficios: [
    { icon: Briefcase, titulo: "Estrutura profissional", desc: "Fundação sólida para o seu negócio online." },
    { icon: Layers, titulo: "Ecossistema unificado", desc: "Uma plataforma no lugar de várias." },
    { icon: Sparkles, titulo: "IA de apoio", desc: "Reduz o trabalho manual da criação." },
    { icon: TrendingUp, titulo: "Pronto pra escalar", desc: "Crie novos produtos quando quiser." },
    { icon: ShieldCheck, titulo: "Ambiente seguro", desc: "Infraestrutura confiável e conformidade com LGPD." },
    { icon: Rocket, titulo: "Comece rápido", desc: "Do zero ao ar em poucas horas." },
  ],
  comoFunciona: [
    { passo: "01", titulo: "Defina seu nicho", desc: "Escolha o mercado onde vai atuar." },
    { passo: "02", titulo: "Crie seu produto", desc: "A IA monta o produto e a página." },
    { passo: "03", titulo: "Configure pagamento", desc: "Integração direta com Cakto." },
    { passo: "04", titulo: "Divulgue", desc: "Use os conteúdos gerados para promover." },
  ],
  entrega: [
    "Produto digital pronto",
    "Página de vendas profissional",
    "Integração com meios de pagamento",
    "Conteúdo para divulgação",
    "Painel de gestão",
    "Estrutura escalável",
  ],
  faq: [
    { pergunta: "Preciso de CNPJ?", resposta: "Não é obrigatório para começar, mas é recomendado conforme seu volume de vendas." },
    { pergunta: "Recebo suporte para começar?", resposta: "Sim, suporte por e-mail e materiais introdutórios." },
    { pergunta: "Consigo trocar de nicho depois?", resposta: "Sim, você pode criar quantos produtos e nichos quiser." },
    { pergunta: "É seguro?", resposta: "Sim, seguimos boas práticas de segurança e conformidade com a LGPD." },
  ],
  ctaFinal: "Estruture o seu negócio digital hoje",
};
