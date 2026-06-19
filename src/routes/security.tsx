import { createFileRoute } from "@tanstack/react-router";
import { PrivacidadePage } from "./privacidade";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security and Privacy | Alevi.ai" },
      {
        name: "description",
        content:
          "Alevi.ai security, privacy, access control, and data protection information.",
      },
      { property: "og:title", content: "Security and Privacy | Alevi.ai" },
      {
        property: "og:description",
        content:
          "Alevi.ai security, privacy, access control, and data protection information.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivacidadePage,
});