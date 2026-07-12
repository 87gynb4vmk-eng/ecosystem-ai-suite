import { useState, type ComponentType } from "react";
import { Check, ChevronDown, Play, Sparkles, X } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { OfertaRelampago } from "@/components/landing/OfertaRelampago";

const LINK_VITALICIO = "https://pay.cakto.com.br/rrwtdn3_976866";

export type FunilTemplateProps = {
  slug: string;
  publico: string;
  headline: string;
  subheadline: string;
  ctaPrimario?: string;
  videoEmbedUrl?: string;
  demonstracao: { titulo: string; itens: string[] };
  beneficios: { icon: ComponentType<{ className?: string }>; titulo: string; desc: string }[];
  comoFunciona: { passo: string; titulo: string; desc: string }[];
  entrega: string[];
  antesDepois?: { antes: string[]; depois: string[] };
  faq: { pergunta: string; resposta: string }[];
  ctaFinal?: string;
};

function scrollToPlanos() {
  const el = document.getElementById("planos");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function FunilTemplate(props: FunilTemplateProps) {
  const {
    publico,
    headline,
    subheadline,
    ctaPrimario = "Quero começar agora",
    videoEmbedUrl,
    demonstracao,
    beneficios,
    comoFunciona,
    entrega,
    antesDepois,
    faq,
    ctaFinal = "Comece agora com a Alevi",
  } = props;

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--gold)/0.15),transparent_60%)]" />
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 text-center relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            {publico}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            {headline}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            {subheadline}
          </p>
          <button
            onClick={scrollToPlanos}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-gold px-8 py-4 text-base font-bold uppercase tracking-wider text-gold-foreground shadow-gold-glow hover:opacity-95 transition-all hover:scale-[1.02]"
          >
            {ctaPrimario}
          </button>
          <p className="mt-4 text-xs text-muted-foreground">
            Acesso imediato · Pagamento 100% seguro
          </p>
        </div>
      </section>

      {/* VÍDEO */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-card shadow-card">
            {videoEmbedUrl ? (
              <iframe
                src={videoEmbedUrl}
                title="Demonstração Alevi.ai"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-muted/40 to-background">
                <div className="h-20 w-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold-glow mb-4">
                  <Play className="h-8 w-8 text-gold-foreground fill-current" />
                </div>
                <p className="text-sm text-muted-foreground">Vídeo demonstrativo em breve</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DEMONSTRAÇÃO */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4">
            {demonstracao.titulo}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Veja tudo o que a plataforma organiza para você em um só lugar.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demonstracao.itens.map((item, i) => (
              <div
                key={item}
                className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-luxury transition-all hover:scale-[1.02]"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-gold mb-3">
                  Módulo {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-base font-semibold leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12">
            Por que escolher a <span className="text-gradient-gold">Alevi</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beneficios.map(({ icon: Icon, titulo, desc }) => (
              <div
                key={titulo}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:border-gold/40"
              >
                <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12">
            Como funciona
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {comoFunciona.map((step) => (
              <div
                key={step.passo}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <div className="text-4xl font-extrabold text-gradient-gold mb-3">{step.passo}</div>
                <h3 className="font-display text-lg font-bold mb-2">{step.titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENTREGA */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4">
            O que a Alevi entrega
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            Um ecossistema completo para você focar no que importa: divulgar e vender.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {entrega.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-border bg-card px-5 py-4"
              >
                <Check className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span className="text-sm font-medium leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ANTES x DEPOIS */}
      {antesDepois && (
        <section className="py-16 sm:py-20 bg-muted/20">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12">
              Antes <span className="text-muted-foreground">x</span>{" "}
              <span className="text-gradient-gold">Depois</span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                <h3 className="font-display text-xl font-bold mb-4 text-destructive">Antes</h3>
                <ul className="space-y-3">
                  {antesDepois.antes.map((a) => (
                    <li key={a} className="flex items-start gap-3 text-sm">
                      <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border-2 border-gold/40 bg-gold/5 p-6 shadow-gold-glow">
                <h3 className="font-display text-xl font-bold mb-4 text-gradient-gold">
                  Depois com a Alevi
                </h3>
                <ul className="space-y-3">
                  {antesDepois.depois.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-sm">
                      <Check className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PLANOS */}
      <OfertaRelampago />

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-10">
            Perguntas frequentes
          </h2>
          <div className="space-y-3">
            {faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={f.pergunta}
                  className="rounded-2xl border border-border bg-card overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-3 p-5 text-left"
                  >
                    <span className="text-sm sm:text-base font-semibold">{f.pergunta}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-gold transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {f.resposta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-card to-muted/40 p-10 sm:p-14 text-center shadow-luxury">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gold)/0.15),transparent_70%)]" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                {ctaFinal}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Estruture seu produto digital com a inteligência artificial da Alevi e ganhe tempo
                para o que realmente importa: divulgar e vender.
              </p>
              <a
                href={LINK_VITALICIO}
                target="_top"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-gold px-8 py-4 text-base font-bold uppercase tracking-wider text-gold-foreground shadow-gold-glow hover:opacity-95 transition-all hover:scale-[1.02]"
              >
                Quero acesso vitalício
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
