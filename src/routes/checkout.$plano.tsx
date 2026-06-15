import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/$plano")({
  head: () => ({ meta: [{ title: "Checkout | Alevi.ai" }] }),
  component: CheckoutPage,
});

const PLANOS: Record<string, { label: string; preco: string }> = {
  mensal: { label: "Mensal", preco: "R$ 170/mês" },
  vitalicio: { label: "Vitalício", preco: "R$ 250,90 — pagamento único" },
};

function CheckoutPage() {
  const { plano } = Route.useParams();
  const info = PLANOS[plano];

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-luxury text-center">
        <Link to="/" className="block text-center mb-6">
          <span className="font-display text-2xl font-bold text-primary">Alevi</span>
          <span className="font-display text-2xl font-bold text-gradient-gold">.ai</span>
        </Link>

        <h1 className="font-display text-2xl font-bold mb-2">
          {info ? `Plano ${info.label}` : "Plano"}
        </h1>
        {info && <p className="text-sm text-muted-foreground mb-6">{info.preco}</p>}

        <p className="text-sm text-muted-foreground mb-6">
          O pagamento é processado pela Cakto. Após aprovação, sua conta e senha
          de acesso serão enviadas automaticamente para o seu e-mail.
        </p>

        <Link
          to="/"
          className="inline-flex w-full items-center justify-center rounded-md bg-gradient-gold px-4 py-3 text-sm font-semibold text-gold-foreground shadow-gold-glow hover:opacity-95 transition"
        >
          Voltar para os planos
        </Link>
      </div>
    </main>
  );
}
