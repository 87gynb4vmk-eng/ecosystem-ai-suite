import { createFileRoute } from "@tanstack/react-router";
import { PrivacidadePage } from "./privacidade";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: "Trust Center | Alevi.ai" },
      {
        name: "description",
        content:
          "Trust, security, and privacy information for Alevi.ai users and customers.",
      },
      { property: "og:title", content: "Trust Center | Alevi.ai" },
      {
        property: "og:description",
        content:
          "Trust, security, and privacy information for Alevi.ai users and customers.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivacidadePage,
});