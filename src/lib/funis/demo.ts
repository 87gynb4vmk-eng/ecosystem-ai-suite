import { Play, Sparkles, BookOpen, LayoutTemplate, Video, FileText } from "lucide-react";
import type { FunilTemplateProps } from "@/components/funil/FunilTemplate";

export const demoFunil: FunilTemplateProps = {
  slug: "demo",
  publico: "Veja a plataforma em funcionamento",
  headline: "Veja como a Alevi funciona na prática.",
  subheadline:
    "Do prompt inicial ao produto pronto para divulgação — acompanhe o fluxo completo em poucos minutos.",
  ctaPrimario: "Quero acessar a plataforma",
  demonstracao: {
    titulo: "Do prompt ao produto pronto",
    itens: [
      "1. Você digita o prompt",
      "2. IA cria o eBook",
      "3. Landing page é gerada",
      "4. Vídeos curtos entram no fluxo",
      "5. Conteúdo para divulgação sai pronto",
      "6. Estrutura completa pronta para publicar",
    ],
  },
  beneficios: [
    { icon: Play, titulo: "Fluxo visual", desc: "Você vê cada etapa acontecendo." },
    { icon: Sparkles, titulo: "IA em ação", desc: "Modelos gerando conteúdo em tempo real." },
    { icon: BookOpen, titulo: "eBook automático", desc: "Livro digital pronto em minutos." },
    { icon: LayoutTemplate, titulo: "Página de vendas", desc: "Layout profissional já configurado." },
    { icon: Video, titulo: "Vídeos gerados", desc: "Peças curtas para redes sociais." },
    { icon: FileText, titulo: "Copies inclusas", desc: "Textos de apoio para divulgação." },
  ],
  comoFunciona: [
    { passo: "01", titulo: "Prompt", desc: "Você descreve o produto que quer criar." },
    { passo: "02", titulo: "eBook", desc: "A IA escreve e diagrama o eBook." },
    { passo: "03", titulo: "Landing page", desc: "Uma página de vendas é montada." },
    { passo: "04", titulo: "Vídeos e conteúdo", desc: "Peças de divulgação são geradas." },
  ],
  entrega: [
    "Fluxo completo demonstrado",
    "Acesso à plataforma real",
    "Exemplos de eBooks gerados",
    "Exemplos de landing pages",
    "Exemplos de vídeos curtos",
    "Painel para reproduzir o fluxo",
  ],
  faq: [
    { pergunta: "Consigo testar antes?", resposta: "Você pode assistir à demonstração e acessar a plataforma logo após a contratação." },
    { pergunta: "Quanto tempo leva o fluxo?", resposta: "Normalmente poucos minutos, dependendo do tamanho do produto." },
    { pergunta: "Preciso de conhecimento técnico?", resposta: "Não. A interface é guiada." },
    { pergunta: "Como acesso após comprar?", resposta: "Você recebe o acesso por e-mail logo após a confirmação do pagamento." },
  ],
  ctaFinal: "Acesse a plataforma e reproduza o fluxo",
};
