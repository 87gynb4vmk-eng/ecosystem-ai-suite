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
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
            <Link to="/politica-privacidade" className="text-background/60 hover:text-background">
              Política de Privacidade
            </Link>
            <Link to="/termos-de-uso" className="text-background/60 hover:text-background">
              Termos de Uso
            </Link>
            <Link to="/politica-cookies" className="text-background/60 hover:text-background">
              Política de Cookies
            </Link>
            <Link to="/contato-privacidade" className="text-background/60 hover:text-background">
              Contato de Privacidade
            </Link>
            <Link to="/conta" className="text-background/60 hover:text-background">
              Excluir minha conta
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
