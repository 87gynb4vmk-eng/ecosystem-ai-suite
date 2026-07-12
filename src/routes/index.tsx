import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ComoFunciona } from "@/components/landing/ComoFunciona";
import { TestimonialsResultado, TestimonialsObjecao } from "@/components/landing/Testimonials";
import { OfertaRelampago } from "@/components/landing/OfertaRelampago";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alevi.ai — Crie ecossistemas digitais completos com IA" },
      {
        name: "description",
        content:
          "A Alevi.ai transforma o seu negócio em um ecossistema digital premium em minutos, com copy de alta conversão gerada por inteligência artificial.",
      },
      { property: "og:title", content: "Alevi.ai — Ecossistemas digitais com IA" },
      {
        property: "og:description",
        content: "Gere páginas, ofertas e copy de alta conversão para o seu negócio em minutos.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ComoFunciona />
      <TestimonialsResultado />
      <TestimonialsObjecao />
      <OfertaRelampago />
      <Footer />
    </main>
  );
}
