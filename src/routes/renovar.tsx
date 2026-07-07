import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/renovar")({
  head: () => ({
    meta: [
      { title: "Renovar acesso | Alevi.ai" },
      {
        name: "description",
        content: "Renove seu acesso ao Alevi.ai para continuar gerando conteúdo.",
      },
    ],
  }),
  component: RenovarPage,
});

function RenovarPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-dark px-6">
      <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-luxury text-center">
        <Link to="/" className="block text-center mb-8">
          <span className="font-display text-3xl font-bold text-primary">Alevi</span>
          <span className="font-display text-3xl font-bold text-gradient-gold">.ai</span>
        </Link>

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <RefreshCcw className="h-8 w-8 text-gold" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Acesso expirado ou inativo</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Sua assinatura mensal expirou ou foi cancelada. Renove agora para voltar a gerar e-books, páginas e vídeos.
        </p>

        <div className="space-y-4">
          <a
            href="https://pay.cakto.com.br/n26znnn_922150"
            target="_top"
            rel="noopener noreferrer"
            className="block w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            Assinar Mensal — R$ 170/mês
          </a>

          <a
            href="https://pay.cakto.com.br/fnw2s5q_922144"
            target="_top"
            rel="noopener noreferrer"
            className="relative block w-full rounded-md bg-gradient-gold px-6 py-3 text-sm font-semibold text-gold-foreground shadow-gold-glow hover:opacity-95 transition"
          >
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-foreground">
              <Crown className="h-3 w-3" />
              Mais Vendido
            </span>
            Garantir Vitalício — R$ 250,00
          </a>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Após a aprovação do pagamento, seu acesso será reativado automaticamente em minutos.
        </p>
      </div>
    </main>
  );
}
