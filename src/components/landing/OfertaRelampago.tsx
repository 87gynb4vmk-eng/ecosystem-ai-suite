import { useEffect, useState } from "react";
import { Check, Crown, Rocket, ShieldCheck, Zap, Star, BadgePercent } from "lucide-react";

const DEADLINE_KEY = "alevi_oferta_deadline";
const DURATION_MS = 15 * 60 * 1000;

const LINK_MENSAL = "https://pay.cakto.com.br/di3c2n7_975572";
const LINK_VITALICIO = "https://pay.cakto.com.br/rrwtdn3_976866";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function useCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    let deadline: number;
    try {
      const stored = localStorage.getItem(DEADLINE_KEY);
      const parsed = stored ? parseInt(stored, 10) : NaN;
      if (Number.isFinite(parsed) && parsed > Date.now() - DURATION_MS) {
        deadline = parsed;
      } else {
        deadline = Date.now() + DURATION_MS;
        localStorage.setItem(DEADLINE_KEY, String(deadline));
      }
    } catch {
      deadline = Date.now() + DURATION_MS;
    }

    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return remaining;
}

export function OfertaRelampago() {
  const remaining = useCountdown();
  const expired = remaining !== null && remaining <= 0;

  const totalSeconds = Math.floor((remaining ?? 0) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <section id="planos" className="py-20 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Banner urgência */}
        <div
          className={`rounded-2xl border-2 px-5 py-4 sm:px-6 sm:py-5 text-center shadow-lg ${
            expired
              ? "border-muted bg-muted/40 text-muted-foreground"
              : "border-destructive/60 bg-destructive/10 text-destructive-foreground animate-pulse"
          }`}
        >
          <p className="text-sm sm:text-base font-bold leading-relaxed">
            {expired ? (
              <span className="text-foreground">
                ⏰ Promoção encerrada. Os preços voltaram ao valor normal.
              </span>
            ) : (
              <span className="text-destructive">
                🔥 OFERTA RELÂMPAGO! Você tem apenas <span className="underline">15 minutos</span>{" "}
                para garantir este desconto exclusivo. Após o término da contagem, esta oferta será
                encerrada e os preços voltarão ao valor normal.
              </span>
            )}
          </p>
        </div>

        {/* Cronômetro */}
        <div
          role="timer"
          aria-live="polite"
          className="mt-8 flex flex-col items-center"
        >
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-muted-foreground mb-3">
            {expired ? "Oferta encerrada" : "A oferta expira em"}
          </span>
          <div
            className={`flex items-center gap-2 sm:gap-4 font-mono font-extrabold tabular-nums transition-all duration-300 ${
              expired ? "text-muted-foreground" : "text-destructive drop-shadow-[0_0_25px_hsl(var(--destructive)/0.45)]"
            }`}
          >
            {[
              { v: hours, l: "H" },
              { v: minutes, l: "M" },
              { v: seconds, l: "S" },
            ].map((seg, i) => (
              <div key={seg.l} className="flex items-center gap-2 sm:gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-5xl sm:text-7xl leading-none transition-all duration-300">
                    {remaining === null ? "--" : pad(seg.v)}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    {seg.l === "H" ? "Horas" : seg.l === "M" ? "Min" : "Seg"}
                  </span>
                </div>
                {i < 2 && <span className="text-4xl sm:text-6xl leading-none opacity-60">:</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 items-stretch">
          {/* Mensal */}
          <div
            className={`relative bg-card border border-border rounded-2xl p-8 shadow-card flex flex-col transition ${
              expired ? "opacity-70" : ""
            }`}
          >
            <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
              <Rocket className="h-3.5 w-3.5" />
              Plano Mensal
            </div>
            <h3 className="font-display text-2xl font-bold mb-1">Acesso Mensal</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Ideal para começar e validar seus resultados.
            </p>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground line-through">De R$ 150,00</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-sm font-semibold text-muted-foreground">Por apenas</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">R$</span>
                <span className="text-6xl font-extrabold tracking-tight">
                  {expired ? "150" : "55"}
                </span>
                <span className="text-2xl font-bold">,00</span>
                <span className="text-muted-foreground ml-1">/mês</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Geração ilimitada de ecossistemas",
                "Painel de gestão completo",
                "Atualizações contínuas da IA",
                "Suporte por e-mail",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <a
              href={LINK_MENSAL}
              target="_top"
              rel="noopener noreferrer"
              className="block w-full text-center rounded-md bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition"
            >
              {expired ? "Ver plano mensal" : "Quero o plano mensal"}
            </a>
          </div>

          {/* Vitalício */}
          <div
            className={`relative bg-card border-2 border-gold rounded-2xl p-8 sm:p-10 shadow-luxury flex flex-col md:scale-[1.03] transition ${
              expired ? "opacity-80" : ""
            }`}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 w-full px-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-gold px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gold-foreground shadow-gold-glow whitespace-nowrap">
                <Star className="h-3.5 w-3.5" fill="currentColor" />
                Mais Vendido
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-destructive-foreground whitespace-nowrap">
                <BadgePercent className="h-3.5 w-3.5" />
                Melhor Custo-Benefício
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-gold/15 text-gold px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 mt-6">
              <Crown className="h-3.5 w-3.5" />
              Plano Vitalício
            </div>
            <h3 className="font-display text-2xl font-bold mb-1 text-gradient-gold">
              Acesso Vitalício
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Pague uma vez e use para sempre.
            </p>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground line-through">De R$ 350,00</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-sm font-semibold text-muted-foreground">Por apenas</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">R$</span>
                <span className="text-6xl font-extrabold tracking-tight">
                  {expired ? "350" : "150"}
                </span>
                <span className="text-2xl font-bold">,00</span>
              </div>
              <p className="text-sm text-gold font-semibold mt-1">
                {expired ? "Preço regular" : "Pagamento único"}
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Tudo do plano Mensal",
                "Sem mensalidade — pagamento único",
                "Acesso vitalício a novas funcionalidades",
                "Suporte prioritário",
                "Bônus exclusivos para early adopters",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <a
              href={LINK_VITALICIO}
              target="_top"
              rel="noopener noreferrer"
              className="block w-full text-center rounded-md bg-gradient-gold px-6 py-4 text-base font-bold uppercase tracking-wider text-gold-foreground shadow-gold-glow hover:opacity-95 transition"
            >
              {expired ? "Ver acesso vitalício" : "Quero acesso vitalício"}
            </a>
          </div>
        </div>

        {/* Gatilhos */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3 max-w-3xl mx-auto">
          {[
            { icon: Zap, text: "Acesso imediato após a confirmação do pagamento" },
            { icon: ShieldCheck, text: "Pagamento 100% seguro" },
            { icon: BadgePercent, text: "Oferta disponível por tempo limitado" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 justify-center text-center rounded-xl border border-border bg-card/60 px-4 py-3 text-xs sm:text-sm font-medium"
            >
              <Icon className="h-4 w-4 text-primary shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Pagamento processado com segurança pela Cakto. Liberação por e-mail em minutos.
        </p>
      </div>
    </section>
  );
}
