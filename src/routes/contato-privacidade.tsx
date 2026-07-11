import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/contato-privacidade")({
  head: () => ({
    meta: [
      { title: "Contato de Privacidade (DPO) | Alevi.ai" },
      {
        name: "description",
        content:
          "Canal para exercício dos direitos do titular previstos na LGPD: acesso, correção, portabilidade e exclusão de dados.",
      },
      { property: "og:title", content: "Contato de Privacidade | Alevi.ai" },
      {
        property: "og:description",
        content: "Fale com o Encarregado (DPO) da Alevi.ai.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContatoPrivacidadePage,
});

function ContatoPrivacidadePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="text-sm text-gold hover:underline">
          ← Voltar para a home
        </Link>
        <h1 className="font-display text-4xl font-bold mt-6 mb-2">
          Contato de Privacidade (DPO)
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Canal oficial para exercício dos direitos do titular previstos no
          art. 18 da LGPD.
        </p>

        <div className="rounded-2xl bg-card p-6 space-y-4 leading-relaxed">
          <p>
            Para exercer qualquer direito de titular — confirmação de
            tratamento, acesso, correção, portabilidade, anonimização, revogação
            de consentimento, informações sobre compartilhamento ou exclusão de
            dados — envie sua solicitação para:
          </p>
          <p className="font-mono text-lg text-gold">
            <a href="mailto:privacidade@suportealevi.store" className="hover:underline">
              privacidade@suportealevi.store
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            Prazo de resposta: até 15 dias corridos, conforme prática recomendada
            pela ANPD. Solicitações de exclusão da própria conta também podem
            ser feitas diretamente em{" "}
            <Link to="/conta" className="text-gold hover:underline">
              Minha conta
            </Link>
            .
          </p>
          <div className="pt-4 border-t border-border/60 text-sm">
            <p className="font-semibold mb-1">Ao entrar em contato, inclua:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>E-mail cadastrado na plataforma;</li>
              <li>Descrição do direito que deseja exercer;</li>
              <li>Documentação que comprove a titularidade, se necessário.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
