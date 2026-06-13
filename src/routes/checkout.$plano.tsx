import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Mail, ShieldCheck, Copy } from "lucide-react";
import { simularCompraCakto } from "@/lib/checkout.functions";

export const Route = createFileRoute("/checkout/$plano")({
  head: () => ({ meta: [{ title: "Checkout | Alevi.ai" }] }),
  component: CheckoutPage,
});

const PLANOS = {
  mensal: { label: "Mensal", preco: "R$ 170/mês" },
  vitalicio: { label: "Vitalício", preco: "R$ 250,90 — pagamento único" },
} as const;

function CheckoutPage() {
  const { plano } = Route.useParams();
  const navigate = useNavigate();
  const simular = useServerFn(simularCompraCakto);
  const info = PLANOS[plano as keyof typeof PLANOS];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{ email: string; senha: string } | null>(null);

  if (!info) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Plano inválido</h1>
          <Link to="/" className="text-gold underline">
            Voltar ao início
          </Link>
        </div>
      </main>
    );
  }

  const handlePagar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simula 1s de "redirecionamento Cakto + processamento"
      await new Promise((r) => setTimeout(r, 1200));
      const res = await simular({ data: { email, plano: plano as "mensal" | "vitalicio" } });
      setResultado({ email: res.email, senha: res.senha });
    } catch (err) {
      toast.error((err as Error).message ?? "Falha ao processar a compra.");
    } finally {
      setLoading(false);
    }
  };

  if (resultado) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-8 shadow-luxury text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Pagamento aprovado!</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Sua conta foi criada e sua senha de acesso foi enviada para:
          </p>

          <div className="bg-muted/40 border border-border rounded-xl p-5 mb-6 text-left">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold mb-2">
              <Mail className="h-3.5 w-3.5" /> E-mail enviado
            </div>
            <div className="font-semibold mb-4 break-all">{resultado.email}</div>

            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
              Senha temporária (simulação)
            </div>
            <div className="flex items-center justify-between gap-3 bg-background rounded-md border border-border px-3 py-2.5">
              <code className="font-mono text-base text-foreground">{resultado.senha}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(resultado.senha);
                  toast.success("Senha copiada!");
                }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Copiar senha"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Em produção, esta senha seria enviada apenas por e-mail.
          </div>

          <button
            onClick={() => navigate({ to: "/auth" })}
            className="w-full rounded-md bg-gradient-gold px-4 py-3 text-sm font-semibold text-gold-foreground shadow-gold-glow hover:opacity-95 transition"
          >
            Ir para o login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-luxury">
        <Link to="/" className="block text-center mb-6">
          <span className="font-display text-2xl font-bold text-primary">Alevi</span>
          <span className="font-display text-2xl font-bold text-gradient-gold">.ai</span>
        </Link>

        <div className="text-center mb-8">
          <div className="inline-block text-xs uppercase tracking-wider text-gold border border-gold/40 rounded-full px-3 py-1 mb-3">
            Checkout Cakto · Simulação
          </div>
          <h1 className="font-display text-2xl font-bold mb-1">Plano {info.label}</h1>
          <p className="text-sm text-muted-foreground">{info.preco}</p>
        </div>

        <form onSubmit={handlePagar} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Seu melhor e-mail</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Sua senha de acesso será enviada para este e-mail.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-gold px-4 py-3.5 text-base font-bold text-gold-foreground shadow-gold-glow hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processando pagamento...
              </>
            ) : (
              <>Pagar agora</>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Pagamento processado de forma segura pela Cakto.
        </p>
      </div>
    </main>
  );
}
