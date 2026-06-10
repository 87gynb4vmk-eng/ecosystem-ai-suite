import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black pt-32 pb-24">
      {/* Subtle radial Verde Rolex glow centered behind the headline */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(0, 96, 57, 0.35), rgba(0, 96, 57, 0.08) 45%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      <div className="container relative mx-auto max-w-5xl px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#C5A059]/40 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#C5A059] backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          ALEVI.AI
        </div>

        <h1 className="font-sans text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
          Construa seu ecossistema digital com{" "}
          <span style={{ color: "#C5A059" }}>precisão de elite</span>.
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
          Sua estrutura completa de vendas, configurada automaticamente por IA, do zero ao faturamento.
        </p>

        <div className="mt-12 flex justify-center">
          <a
            href="#planos"
            className="inline-flex items-center justify-center rounded-full bg-gradient-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-luxury transition hover:opacity-95"
          >
            Criar meu negócio agora
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-white/50">
          <span>+1.000 ecossistemas gerados</span>
          <span className="hidden sm:inline">·</span>
          <span>Pagamento único disponível</span>
          <span className="hidden sm:inline">·</span>
          <span>Suporte premium</span>
        </div>
      </div>
    </section>
  );
}
