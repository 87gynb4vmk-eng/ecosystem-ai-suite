import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Mail, LayoutDashboard } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "Obrigado pela sua compra — Alevi.ai" },
      { name: "description", content: "Sua compra foi confirmada. Veja os próximos passos para acessar a plataforma Alevi.ai." },
      { property: "og:title", content: "Obrigado pela sua compra — Alevi.ai" },
      { property: "og:description", content: "Próximos passos após a confirmação do pagamento." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/obrigado" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/obrigado" }],
  }),
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="py-20 sm:py-28">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold-glow mb-6">
            <CheckCircle2 className="h-10 w-10 text-gold-foreground" />
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold mb-4">
            Obrigado pela sua compra!
          </h1>
          <p className="text-lg text-muted-foreground mb-10">
            Sua compra foi confirmada. Em instantes você receberá um e-mail com os dados de acesso.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 text-left mb-10">
            <div className="rounded-2xl border border-border bg-card p-6">
              <Mail className="h-6 w-6 text-gold mb-3" />
              <h2 className="font-display text-lg font-bold mb-2">1. Verifique seu e-mail</h2>
              <p className="text-sm text-muted-foreground">O link e a senha temporária chegam em minutos. Se não aparecer, veja também a caixa de spam.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <LayoutDashboard className="h-6 w-6 text-gold mb-3" />
              <h2 className="font-display text-lg font-bold mb-2">2. Acesse a plataforma</h2>
              <p className="text-sm text-muted-foreground">Faça login e comece a gerar seus primeiros produtos digitais.</p>
            </div>
          </div>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-gold px-8 py-4 text-base font-bold uppercase tracking-wider text-gold-foreground shadow-gold-glow hover:opacity-95 transition-all hover:scale-[1.02]"
          >
            Ir para o login
          </Link>
          <p className="text-xs text-muted-foreground mt-6">
            Precisa de ajuda? Fale com o nosso suporte por e-mail.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  ),
});
