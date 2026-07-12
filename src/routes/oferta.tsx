import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { OfertaRelampago } from "@/components/landing/OfertaRelampago";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/oferta")({
  head: () => ({
    meta: [
      { title: "Oferta relâmpago — Alevi.ai" },
      { name: "description", content: "Garanta acesso à Alevi.ai com condição especial por tempo limitado." },
      { property: "og:title", content: "Oferta relâmpago — Alevi.ai" },
      { property: "og:description", content: "Condição especial por tempo limitado para começar com a Alevi." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/oferta" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/oferta" }],
  }),
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="py-16 sm:py-20 text-center">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold mb-4">
            Sua oportunidade de começar com a <span className="text-gradient-gold">Alevi</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Estruture seu produto digital com IA por um valor especial, por tempo limitado.
          </p>
        </div>
      </section>
      <OfertaRelampago />
      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
            <ShieldCheck className="h-6 w-6 text-gold shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-lg font-bold mb-1">Compra 100% segura</h2>
              <p className="text-sm text-muted-foreground">Pagamento processado pela Cakto. Acesso enviado por e-mail em minutos após a confirmação.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  ),
});
