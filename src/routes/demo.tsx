import { createFileRoute } from "@tanstack/react-router";
import { FunilTemplate } from "@/components/funil/FunilTemplate";
import { demoFunil } from "@/lib/funis/demo";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Veja a Alevi funcionando — Alevi.ai" },
      { name: "description", content: "Do prompt ao produto pronto: acompanhe o fluxo completo da Alevi na prática." },
      { property: "og:title", content: "Veja a Alevi funcionando — Alevi.ai" },
      { property: "og:description", content: "Demonstração do fluxo completo: prompt → eBook → landing page → vídeos → divulgação." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/demo" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/demo" }],
  }),
  component: () => <FunilTemplate {...demoFunil} />,
});
