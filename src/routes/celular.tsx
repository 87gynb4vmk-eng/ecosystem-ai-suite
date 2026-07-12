import { createFileRoute } from "@tanstack/react-router";
import { FunilTemplate } from "@/components/funil/FunilTemplate";
import { celularFunil } from "@/lib/funis/celular";

export const Route = createFileRoute("/celular")({
  head: () => ({
    meta: [
      { title: "Crie produtos digitais pelo celular — Alevi.ai" },
      { name: "description", content: "Use a Alevi para criar eBooks, páginas e conteúdos direto do seu celular, sem depender de computador." },
      { property: "og:title", content: "Crie produtos digitais pelo celular — Alevi.ai" },
      { property: "og:description", content: "eBooks, landing pages, vídeos e conteúdos gerados com IA — tudo pelo celular." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/celular" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/celular" }],
  }),
  component: () => <FunilTemplate {...celularFunil} />,
});
