import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="container mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center">
          <span className="font-display text-2xl font-bold text-primary">Alevi</span>
          <span className="font-display text-2xl font-bold text-gradient-gold">.ai</span>
        </Link>
        <Link
          to="/auth"
          className="inline-flex items-center justify-center rounded-md border border-gold/60 px-5 py-2 text-sm font-semibold text-gold hover:bg-gold hover:text-gold-foreground transition"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
