import { Smartphone, Zap, Clock, Rocket, Layers, Wifi } from "lucide-react";
import type { FunilTemplateProps } from "@/components/funil/FunilTemplate";

export const celularFunil: FunilTemplateProps = {
  slug: "celular",
  publico: "Feito para criadores mobile",
  headline: "Transforme seu celular em uma ferramenta para criar e vender produtos digitais.",
  subheadline:
    "Com a Alevi, você organiza eBooks, páginas, vídeos e conteúdos direto do celular — sem precisar de computador, designer ou copywriter.",
  ctaPrimario: "Quero criar pelo celular",
  demonstracao: {
    titulo: "Tudo isso pelo seu celular",
    itens: [
      "Criação de eBooks com IA",
      "Landing pages prontas para publicar",
      "Vídeos curtos para divulgação",
      "Conteúdo para redes sociais",
      "Estrutura completa para lançar",
      "Integração com Cakto e Kiwify",
    ],
  },
  beneficios: [
    { icon: Smartphone, titulo: "100% mobile", desc: "Interface pensada para funcionar bem em qualquer smartphone." },
    { icon: Zap, titulo: "Rápido de usar", desc: "Do prompt ao produto pronto em poucos minutos." },
    { icon: Clock, titulo: "Ganhe tempo", desc: "Reduz horas de trabalho manual com automação inteligente." },
    { icon: Rocket, titulo: "Pronto para lançar", desc: "Estrutura organizada para começar a divulgar hoje." },
    { icon: Layers, titulo: "Tudo em um lugar", desc: "Sem precisar abrir dez ferramentas diferentes." },
    { icon: Wifi, titulo: "Funciona online", desc: "Basta conexão com a internet no celular." },
  ],
  comoFunciona: [
    { passo: "01", titulo: "Escolha o tema", desc: "Digite o assunto do seu produto digital." },
    { passo: "02", titulo: "IA cria a estrutura", desc: "eBook, página e conteúdos gerados automaticamente." },
    { passo: "03", titulo: "Revise no celular", desc: "Ajuste o que quiser em segundos." },
    { passo: "04", titulo: "Publique e divulgue", desc: "Compartilhe seu link e comece a divulgar." },
  ],
  entrega: [
    "eBook completo em PDF",
    "Página de vendas responsiva",
    "Vídeos curtos gerados por IA",
    "Textos para redes sociais",
    "Integração com plataformas de pagamento",
    "Painel para gerenciar seus produtos",
  ],
  faq: [
    { pergunta: "Preciso de computador?", resposta: "Não. Toda a plataforma foi pensada para funcionar bem no celular." },
    { pergunta: "Funciona em iPhone e Android?", resposta: "Sim. Basta abrir o navegador do seu celular." },
    { pergunta: "Preciso ter experiência?", resposta: "Não. A IA guia todo o processo, do zero ao produto pronto." },
    { pergunta: "Como recebo meus produtos?", resposta: "Ficam salvos na sua conta, prontos para download e divulgação." },
  ],
  ctaFinal: "Comece a criar direto do seu celular",
};
