import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Menu,
  FileText,
  Plus,
  Gift,
  Home,
  BookOpen,
  Layout as LayoutIcon,
  Video,
  User,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Início | Alevi.ai" }] }),
  component: InicioPage,
});

type Periodo = "hoje" | "7" | "30";

function InicioPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [periodo, setPeriodo] = useState<Periodo>("hoje");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Radial verde rolex glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 25%, oklch(0.28 0.08 158 / 0.55), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-md min-h-screen flex flex-col pb-24">
        {/* HEADER */}
        <header className="flex items-center justify-between px-5 pt-6 pb-4">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menu"
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-border/60 bg-white/[0.02] hover:bg-white/[0.05] transition"
          >
            <Menu className="h-5 w-5 text-foreground/90" />
          </button>

          <div className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-border/40">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>

          <button
            aria-label="Novo"
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-gold/60 text-gold hover:bg-gold/10 transition shadow-[0_0_18px_-6px_var(--gold)]"
          >
            <Plus className="h-5 w-5" />
          </button>
        </header>

        {menuOpen && (
          <div className="mx-5 mb-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur p-2">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-white/[0.04]"
            >
              Sair da conta
            </button>
          </div>
        )}

        {/* TITLE */}
        <section className="px-5 pt-2">
          <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
          <p className="text-xs text-muted-foreground mt-1">Atualizado agora</p>
        </section>

        {/* FILTERS */}
        <section className="px-5 mt-5 flex items-center gap-2">
          <PeriodoPill ativo={periodo === "hoje"} onClick={() => setPeriodo("hoje")}>
            Hoje
          </PeriodoPill>
          <PeriodoPill ativo={periodo === "7"} onClick={() => setPeriodo("7")}>
            7 dias
          </PeriodoPill>
          <PeriodoPill ativo={periodo === "30"} onClick={() => setPeriodo("30")}>
            30 dias
          </PeriodoPill>

          <button className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold bg-gradient-gold text-gold-foreground shadow-gold-glow">
            <Plus className="h-3.5 w-3.5" /> Novo
          </button>
        </section>

        {/* BONUS ALERT */}
        <section className="px-5 mt-5">
          <div className="flex items-center gap-3 rounded-xl border border-gold/25 bg-gold/[0.04] px-4 py-3">
            <div className="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-lg bg-gold/15 text-gold">
              <Gift className="h-4 w-4" />
            </div>
            <p className="text-xs leading-relaxed text-foreground/85">
              <span className="font-semibold text-gold">Bônus disponível em 6 dias</span>
              <span className="text-muted-foreground"> • Continue usando a plataforma para desbloquear</span>
            </p>
          </div>
        </section>

        {/* FATURAMENTO CARD */}
        <section className="px-5 mt-5">
          <div className="relative rounded-2xl border border-border/60 bg-gradient-dark p-5 shadow-card overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-40"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.48 0.1 158 / 0.55), transparent 70%)",
              }}
            />

            <div className="relative flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Você faturou hoje
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] border border-border/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                <TrendingUp className="h-3 w-3" /> 0%
              </span>
            </div>

            <div className="relative mt-3">
              <div className="text-4xl font-bold tracking-tight">
                R$ <span className="text-foreground">0,00</span>
              </div>
            </div>

            <div className="relative mt-4 flex items-center gap-x-4 gap-y-1.5 flex-wrap text-[11px] text-muted-foreground">
              <span>0 vendas aprovadas</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>Ticket médio R$ 0,00</span>
              <span className="ml-auto inline-flex items-center gap-1.5">
                <span className="relative inline-flex">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="absolute inset-0 h-2 w-2 rounded-full bg-primary animate-ping opacity-60" />
                </span>
                <span className="text-foreground/80">Sistema ativo</span>
              </span>
            </div>

            <div className="relative mt-5 space-y-3">
              <OrigemBar label="Pix" pct={0} />
              <OrigemBar label="Cartão de Crédito" pct={0} />
              <OrigemBar label="PicPay" pct={0} />
            </div>
          </div>
        </section>
      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 inset-x-0 z-20 border-t border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-md grid grid-cols-5 px-2 py-2">
          <NavItem icon={<Home className="h-5 w-5" />} label="Início" ativo />
          <NavItem icon={<BookOpen className="h-5 w-5" />} label="Ebooks" />
          <NavItem icon={<LayoutIcon className="h-5 w-5" />} label="Páginas" />
          <NavItem icon={<Video className="h-5 w-5" />} label="Vídeos" />
          <NavItem icon={<User className="h-5 w-5" />} label="Perfil" />
        </div>
      </nav>
    </div>
  );
}

function PeriodoPill({
  children,
  ativo,
  onClick,
}: {
  children: React.ReactNode;
  ativo?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full px-3.5 py-1.5 text-xs font-medium transition border " +
        (ativo
          ? "bg-white/[0.06] border-border text-foreground"
          : "bg-transparent border-border/50 text-muted-foreground hover:text-foreground hover:bg-white/[0.03]")
      }
    >
      {children}
    </button>
  );
}

function OrigemBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground/70 font-medium">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
        <div
          className="h-full bg-gradient-gold rounded-full transition-all"
          style={{ width: `${Math.max(pct, 0)}%` }}
        />
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  ativo,
}: {
  icon: React.ReactNode;
  label: string;
  ativo?: boolean;
}) {
  return (
    <button
      className={
        "flex flex-col items-center justify-center gap-1 py-1.5 rounded-lg transition " +
        (ativo ? "text-gold" : "text-muted-foreground hover:text-foreground")
      }
    >
      <span className={ativo ? "drop-shadow-[0_0_8px_var(--gold)]" : ""}>{icon}</span>
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
      {ativo && <span className="h-0.5 w-6 rounded-full bg-gold" />}
    </button>
  );
}
