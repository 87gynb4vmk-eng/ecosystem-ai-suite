import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/trust")({
  beforeLoad: () => {
    throw redirect({ to: "/politica-privacidade" });
  },
});
