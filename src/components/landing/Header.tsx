import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="container mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-primary">Alevi</span>
          <span className="font-display text-2xl font-bold text-gradient-gold">.ai</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#como-funciona" className="hover:text-foreground transition">Como Funciona</a>
          <a href="#depoimentos" className="hover:text-foreground transition">Depoimentos</a>
          <a href="#planos" className="hover:text-foreground transition">Planos</a>
        </nav>
        <Link
          to="/auth"
          className="inline-flex items-center justify-center rounded-md border border-primary/30 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
