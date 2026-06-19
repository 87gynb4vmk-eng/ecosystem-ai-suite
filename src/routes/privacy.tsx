import { createFileRoute } from "@tanstack/react-router";
import { PrivacidadePage } from "./privacidade";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy and Security | Alevi.ai" },
      {
        name: "description",
        content:
          "How Alevi.ai protects data, manages access, and handles personal information.",
      },
      { property: "og:title", content: "Privacy and Security | Alevi.ai" },
      {
        property: "og:description",
        content:
          "How Alevi.ai protects data, manages access, and handles personal information.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivacidadePage,
});