import { createFileRoute } from "@tanstack/react-router";
import { FunilTemplate } from "@/components/funil/FunilTemplate";
import { ebookFunil } from "@/lib/funis/ebook";

export const Route = createFileRoute("/ebook")({
  head: () => ({
    meta: [
      { title: "Crie eBooks completos em minutos — Alevi.ai" },
      { name: "description", content: "Digite o tema, a IA da Alevi cria o eBook, a página de vendas e o material de divulgação." },
      { property: "og:title", content: "Crie eBooks completos em minutos — Alevi.ai" },
      { property: "og:description", content: "Do tema ao eBook pronto para vender, com página de vendas incluída." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/ebook" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/ebook" }],
  }),
  component: () => <FunilTemplate {...ebookFunil} />,
});
