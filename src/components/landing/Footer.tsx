import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-gradient-dark text-background/70 py-12">
      <div className="container mx-auto max-w-6xl px-6 text-center">
        <div className="font-display text-2xl font-bold mb-4">
          <span className="text-background">Alevi</span>
          <span className="text-gradient-gold">.ai</span>
        </div>
        <p className="text-sm">
          Ecossistemas digitais premium gerados por inteligência artificial.
        </p>
        <nav className="mt-6" aria-label="Links institucionais">
          <div className="flex justify-center gap-4 text-xs">
            <Link to="/privacidade" className="text-background/60 hover:text-background">
              Privacidade e Segurança
            </Link>
            <Link to="/privacy" className="text-background/60 hover:text-background">
              Privacy Policy
            </Link>
          </div>
        </nav>
        <p className="text-xs mt-6 text-background/40">
          © {new Date().getFullYear()} Alevi.ai. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
