import { createFileRoute } from "@tanstack/react-router";
import { FunilTemplate } from "@/components/funil/FunilTemplate";
import { automatizacaoFunil } from "@/lib/funis/automatizacao";

export const Route = createFileRoute("/automatizacao")({
  head: () => ({
    meta: [
      { title: "Automatize criação de produtos digitais — Alevi.ai" },
      { name: "description", content: "Automatize eBooks, páginas, vídeos e conteúdos com IA. Foque em estratégia, deixe a execução com a Alevi." },
      { property: "og:title", content: "Automatize criação de produtos digitais — Alevi.ai" },
      { property: "og:description", content: "IA gerando cada etapa do seu produto digital em fluxo automatizado." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/automatizacao" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/automatizacao" }],
  }),
  component: () => <FunilTemplate {...automatizacaoFunil} />,
});
