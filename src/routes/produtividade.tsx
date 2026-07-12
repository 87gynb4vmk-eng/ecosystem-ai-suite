import { createFileRoute } from "@tanstack/react-router";
import { FunilTemplate } from "@/components/funil/FunilTemplate";
import { produtividadeFunil } from "@/lib/funis/produtividade";

export const Route = createFileRoute("/produtividade")({
  head: () => ({
    meta: [
      { title: "Economize horas com IA — Alevi.ai" },
      { name: "description", content: "Automatize a criação de eBooks, páginas, vídeos e conteúdos em uma plataforma só. Menos ferramentas, mais foco." },
      { property: "og:title", content: "Economize horas com IA — Alevi.ai" },
      { property: "og:description", content: "Antes: várias ferramentas. Depois: a Alevi centralizando tudo." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/produtividade" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/produtividade" }],
  }),
  component: () => <FunilTemplate {...produtividadeFunil} />,
});
