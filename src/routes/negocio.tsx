import { createFileRoute } from "@tanstack/react-router";
import { FunilTemplate } from "@/components/funil/FunilTemplate";
import { negocioFunil } from "@/lib/funis/negocio";

export const Route = createFileRoute("/negocio")({
  head: () => ({
    meta: [
      { title: "Comece seu negócio digital — Alevi.ai" },
      { name: "description", content: "A Alevi organiza a estrutura inicial do seu negócio digital: produto, página, integrações e divulgação." },
      { property: "og:title", content: "Comece seu negócio digital — Alevi.ai" },
      { property: "og:description", content: "Estrutura completa para o seu negócio digital, criada com IA." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/negocio" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/negocio" }],
  }),
  component: () => <FunilTemplate {...negocioFunil} />,
});
