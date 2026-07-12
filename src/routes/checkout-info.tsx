import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Crown, Rocket, ShieldCheck } from "lucide-react";

const LINK_MENSAL = "https://pay.cakto.com.br/di3c2n7_975572";
const LINK_VITALICIO = "https://pay.cakto.com.br/rrwtdn3_976866";

export const Route = createFileRoute("/checkout-info")({
  head: () => ({
    meta: [
      { title: "Escolha seu plano — Alevi.ai" },
      { name: "description", content: "Escolha entre plano mensal ou vitalício e finalize sua contratação da Alevi.ai com segurança." },
      { property: "og:title", content: "Escolha seu plano — Alevi.ai" },
      { property: "og:description", content: "Plano mensal ou vitalício — finalize sua contratação com segurança pela Cakto." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/checkout-info" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/checkout-info" }],
  }),
  component: CheckoutInfoPage,
});

function CheckoutInfoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold mb-4">
              Escolha o plano ideal para você
            </h1>
            <p className="text-lg text-muted-foreground">
              Ao clicar, você será direcionado ao checkout seguro da Cakto para concluir a compra.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-card flex flex-col">
              <Rocket className="h-8 w-8 text-primary mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Plano Mensal</h2>
              <p className="text-sm text-muted-foreground mb-6">Ideal para começar e validar.</p>
              <div className="text-4xl font-extrabold mb-6">R$ 55,00<span className="text-base font-normal text-muted-foreground">/mês</span></div>
              <a href={LINK_MENSAL} target="_top" rel="noopener noreferrer" className="mt-auto block text-center rounded-md bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition">
                Contratar mensal
              </a>
            </div>
            <div className="rounded-2xl border-2 border-gold bg-card p-8 shadow-luxury flex flex-col">
              <Crown className="h-8 w-8 text-gold mb-4" />
              <h2 className="font-display text-2xl font-bold text-gradient-gold mb-2">Vitalício</h2>
              <p className="text-sm text-muted-foreground mb-6">Pague uma vez, use para sempre.</p>
              <div className="text-4xl font-extrabold mb-6">R$ 150,00</div>
              <a href={LINK_VITALICIO} target="_top" rel="noopener noreferrer" className="mt-auto block text-center rounded-md bg-gradient-gold px-6 py-4 text-sm font-bold uppercase tracking-wider text-gold-foreground shadow-gold-glow hover:opacity-95 transition">
                Contratar vitalício
              </a>
            </div>
          </div>
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-gold" />
            Pagamento processado com segurança pela Cakto.
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
