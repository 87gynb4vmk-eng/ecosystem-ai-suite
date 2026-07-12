import { createFileRoute } from "@tanstack/react-router";
import { FunilTemplate } from "@/components/funil/FunilTemplate";
import { iaFunil } from "@/lib/funis/ia";

export const Route = createFileRoute("/ia")({
  head: () => ({
    meta: [
      { title: "IA para criar seu produto digital — Alevi.ai" },
      { name: "description", content: "Use inteligência artificial para gerar eBooks, páginas, vídeos e a estrutura do seu produto digital em minutos." },
      { property: "og:title", content: "IA para criar seu produto digital — Alevi.ai" },
      { property: "og:description", content: "eBooks, páginas, vídeos e conteúdos criados por IA em uma plataforma só." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/ia" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/ia" }],
  }),
  component: () => <FunilTemplate {...iaFunil} />,
});
