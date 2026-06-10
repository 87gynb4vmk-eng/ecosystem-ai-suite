import { Check, Crown } from "lucide-react";
import { Link } from "@tanstack/react-router";

const beneficiosMensal = [
  "Geração ilimitada de ecossistemas",
  "Painel de gestão completo",
  "Atualizações contínuas da IA",
  "Suporte por e-mail",
];

const beneficiosVitalicio = [
  "Tudo do plano Mensal",
  "Pagamento único — sem mensalidade",
  "Acesso vitalício a novas funcionalidades",
  "Suporte prioritário",
  "Bônus exclusivos para early adopters",
];

export function Pricing() {
  return (
    <section id="planos" className="py-24 bg-gradient-to-b from-muted/40 to-background">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Escolha seu plano</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold">Acesse o ecossistema agora</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Comece hoje e gere seu primeiro ecossistema em minutos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          {/* Plano Mensal — discreto */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
            <h3 className="font-display text-2xl font-bold mb-2">Mensal</h3>
            <p className="text-sm text-muted-foreground mb-6">Para quem quer testar e validar.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-bold">R$ 170</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <ul className="space-y-3 mb-8">
              {beneficiosMensal.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/checkout/$plano"
              params={{ plano: "mensal" }}
              className="block w-full text-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Assinar Mensal
            </Link>
          </div>

          {/* Plano Vitalício — destaque */}
          <div className="relative bg-card border-2 border-gold rounded-2xl p-10 shadow-luxury md:scale-105 md:-translate-y-2">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-gold px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-foreground shadow-gold-glow">
              <Crown className="h-3.5 w-3.5" />
              Mais Vendido
            </div>
            <h3 className="font-display text-2xl font-bold mb-2 text-gradient-gold">Vitalício</h3>
            <p className="text-sm text-muted-foreground mb-6">Pague uma vez, use para sempre.</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-bold">R$ 250,90</span>
            </div>
            <p className="text-sm text-gold font-semibold mb-8">Pagamento único</p>
            <ul className="space-y-3 mb-8">
              {beneficiosVitalicio.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/checkout/$plano"
              params={{ plano: "vitalicio" }}
              className="block w-full text-center rounded-md bg-gradient-gold px-6 py-3.5 text-base font-bold text-gold-foreground shadow-gold-glow hover:opacity-95 transition"
            >
              Garantir Vitalício
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Pagamento processado de forma segura pela Cakto. Acesso liberado por e-mail em minutos.
        </p>
      </div>
    </section>
  );
}
