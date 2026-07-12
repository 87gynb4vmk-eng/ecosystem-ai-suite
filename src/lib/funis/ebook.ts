import { BookOpen, FileText, Sparkles, Download, PenTool, Rocket } from "lucide-react";
import type { FunilTemplateProps } from "@/components/funil/FunilTemplate";

export const ebookFunil: FunilTemplateProps = {
  slug: "ebook",
  publico: "Para quem quer criar e vender eBooks",
  headline: "Crie eBooks completos em poucos minutos.",
  subheadline:
    "Digite o tema, a Alevi gera o eBook, a página de vendas e o material de divulgação. Você foca apenas em vender.",
  ctaPrimario: "Quero criar meu eBook",
  demonstracao: {
    titulo: "Do tema ao produto pronto para vender",
    itens: [
      "Você digita o tema",
      "IA cria capítulos e conteúdo",
      "eBook diagramado em PDF",
      "Página de vendas gerada",
      "Copy e chamadas prontas",
      "Produto pronto para divulgação",
    ],
  },
  beneficios: [
    { icon: BookOpen, titulo: "Estrutura de livro real", desc: "Sumário, capítulos e conclusão bem definidos." },
    { icon: PenTool, titulo: "Copy de conversão", desc: "Textos pensados para gerar interesse e venda." },
    { icon: FileText, titulo: "PDF profissional", desc: "Diagramação limpa, pronta para entregar ao comprador." },
    { icon: Sparkles, titulo: "Sem bloqueio criativo", desc: "A IA cuida da parte pesada da escrita." },
    { icon: Download, titulo: "Download imediato", desc: "Baixe e envie ao seu público em minutos." },
    { icon: Rocket, titulo: "Pronto para lançar", desc: "Página, texto e produto — tudo integrado." },
  ],
  comoFunciona: [
    { passo: "01", titulo: "Coloque o tema", desc: "Diga qual é o assunto do eBook." },
    { passo: "02", titulo: "IA cria o conteúdo", desc: "Capítulos completos gerados em minutos." },
    { passo: "03", titulo: "Ajuste e finalize", desc: "Revise o que quiser e gere o PDF." },
    { passo: "04", titulo: "Página pronta", desc: "Landing page criada automaticamente." },
  ],
  entrega: [
    "eBook completo em PDF",
    "Capa gerada com identidade visual",
    "Página de vendas responsiva",
    "Copy de conversão pronta",
    "Conteúdo para divulgar nas redes",
    "Integração com plataformas de pagamento",
  ],
  faq: [
    { pergunta: "Qual o tamanho do eBook gerado?", resposta: "Varia conforme o tema — normalmente entre 20 e 60 páginas." },
    { pergunta: "Posso editar o conteúdo?", resposta: "Sim, você pode revisar e ajustar antes de baixar o PDF." },
    { pergunta: "O eBook é meu?", resposta: "Sim, todo o conteúdo gerado é de sua propriedade." },
    { pergunta: "Consigo criar quantos eBooks?", resposta: "De acordo com o plano contratado, sem limites artificiais." },
  ],
  ctaFinal: "Crie seu próximo eBook agora",
};
