import { createFileRoute } from "@tanstack/react-router";
import { FunilTemplate } from "@/components/funil/FunilTemplate";
import { inicianteFunil } from "@/lib/funis/iniciante";

export const Route = createFileRoute("/iniciante")({
  head: () => ({
    meta: [
      { title: "Comece do zero no digital — Alevi.ai" },
      { name: "description", content: "Nunca vendeu produto digital? A Alevi guia você em cada passo, com IA e estrutura pronta." },
      { property: "og:title", content: "Comece do zero no digital — Alevi.ai" },
      { property: "og:description", content: "Passo a passo simples para criar seu primeiro produto digital com IA." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/iniciante" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/iniciante" }],
  }),
  component: () => <FunilTemplate {...inicianteFunil} />,
});
