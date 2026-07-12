import { createFileRoute } from "@tanstack/react-router";
import { FunilTemplate } from "@/components/funil/FunilTemplate";
import { afiliadosFunil } from "@/lib/funis/afiliados";

export const Route = createFileRoute("/afiliados")({
  head: () => ({
    meta: [
      { title: "Estrutura pronta para afiliados — Alevi.ai" },
      { name: "description", content: "Landing pages, criativos, textos e vídeos gerados por IA para você focar em divulgação e conversão." },
      { property: "og:title", content: "Estrutura pronta para afiliados — Alevi.ai" },
      { property: "og:description", content: "Menos tempo criando, mais tempo divulgando suas ofertas." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/afiliados" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/afiliados" }],
  }),
  component: () => <FunilTemplate {...afiliadosFunil} />,
});
