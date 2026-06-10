import heroImage from "@/assets/hero-ecosystem.jpg";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-dark">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background" aria-hidden="true" />

      <div className="container relative mx-auto max-w-5xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/10 px-4 py-1.5 text-xs font-medium text-gold backdrop-blur-sm mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          Inteligência Artificial Premium
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-background leading-[1.05] tracking-tight">
          Crie um <span className="text-gradient-gold">ecossistema digital</span><br className="hidden md:block" />
          completo em minutos com IA
        </h1>

        <p className="mt-8 text-lg md:text-xl text-background/75 max-w-2xl mx-auto leading-relaxed">
          A Alevi.ai transforma a descrição do seu negócio em um sistema de páginas estratégicas,
          prontas para converter — sem mexer em uma linha de código.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#planos"
            className="inline-flex items-center justify-center rounded-md bg-gradient-gold px-8 py-4 text-base font-semibold text-gold-foreground shadow-gold-glow hover:opacity-95 transition"
          >
            Criar meu ecossistema
          </a>
          <a
            href="#como-funciona"
            className="inline-flex items-center justify-center rounded-md border border-background/20 px-8 py-4 text-base font-semibold text-background/90 hover:bg-background/10 transition"
          >
            Como funciona
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-background/60">
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
