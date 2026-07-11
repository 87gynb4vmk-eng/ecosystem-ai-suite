import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const KEY = "cookie-consent-v1";

type Consent = "all" | "essential" | null;

export function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "all" || saved === "essential") {
        setConsent(saved);
      }
    } catch {
      /* noop */
    }
    setReady(true);
  }, []);

  const salvar = (value: Exclude<Consent, null>) => {
    try {
      window.localStorage.setItem(KEY, value);
      (window as unknown as { __consent?: string }).__consent = value;
    } catch {
      /* noop */
    }
    setConsent(value);
  };

  if (!ready || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-4 bottom-4 z-50 max-w-3xl mx-auto rounded-xl border border-border bg-card p-4 shadow-luxury sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground/90 leading-relaxed">
          Usamos cookies essenciais para o login e, com seu consentimento,
          cookies para melhorar a experiência. Veja a{" "}
          <Link to="/politica-cookies" className="text-gold hover:underline">
            Política de Cookies
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => salvar("essential")}
            className="rounded-md border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-accent"
          >
            Recusar não essenciais
          </button>
          <button
            onClick={() => salvar("all")}
            className="rounded-md bg-gradient-gold px-3 py-2 text-xs font-semibold text-gold-foreground shadow-gold-glow hover:opacity-95"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
