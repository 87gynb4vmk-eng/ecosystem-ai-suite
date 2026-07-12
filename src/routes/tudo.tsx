import { createFileRoute } from "@tanstack/react-router";
import { FunilTemplate } from "@/components/funil/FunilTemplate";
import { tudoFunil } from "@/lib/funis/tudo";

export const Route = createFileRoute("/tudo")({
  head: () => ({
    meta: [
      { title: "Solução completa em uma plataforma — Alevi.ai" },
      { name: "description", content: "eBooks, landing pages, vídeos e integrações com Cakto, Kiwify, Facebook, WhatsApp e Telegram em um só lugar." },
      { property: "og:title", content: "Solução completa em uma plataforma — Alevi.ai" },
      { property: "og:description", content: "Tudo o que você precisa para criar e lançar um produto digital em um só lugar." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/tudo" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/tudo" }],
  }),
  component: () => <FunilTemplate {...tudoFunil} />,
});
