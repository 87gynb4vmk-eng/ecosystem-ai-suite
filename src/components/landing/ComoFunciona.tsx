import { PenLine, Cpu, LayoutDashboard } from "lucide-react";

const steps = [
  {
    icon: PenLine,
    titulo: "Descreva seu negócio",
    texto:
      "Conte para a Alevi.ai sobre seu nicho, público e proposta única. Quanto mais detalhado, melhor o resultado.",
  },
  {
    icon: Cpu,
    titulo: "IA constrói seu ecossistema",
    texto:
      "Nossa inteligência artificial proprietária estrutura headlines, ofertas, serviços e copy de conversão em segundos.",
  },
  {
    icon: LayoutDashboard,
    titulo: "Painel pronto para vender",
    texto:
      "Acesse, ajuste e publique. Seu ecossistema digital fica disponível no painel, pronto para começar a faturar.",
  },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="py-24 bg-background">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Como Funciona
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            Três passos para o seu ecossistema
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Sem agências, sem espera, sem orçamentos longos. Direto ao ponto.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div
              key={s.titulo}
              className="relative bg-card border border-border rounded-2xl p-8 shadow-card hover:shadow-luxury transition"
            >
              <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold text-gold-foreground font-display font-bold text-lg shadow-gold-glow">
                {i + 1}
              </div>
              <s.icon className="h-10 w-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-3">{s.titulo}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
