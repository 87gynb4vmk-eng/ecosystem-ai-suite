import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Privacidade e Segurança | Alevi.ai" },
      {
        name: "description",
        content:
          "Como a Alevi.ai protege seus dados, gerencia acessos e trata informações pessoais.",
      },
      { property: "og:title", content: "Privacidade e Segurança | Alevi.ai" },
      {
        property: "og:description",
        content:
          "Como a Alevi.ai protege seus dados, gerencia acessos e trata informações pessoais.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivacidadePage,
});

export function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-gold hover:underline">
          ← Voltar para a home
        </Link>
        <h1 className="font-display text-4xl font-bold mt-6 mb-2">
          Trust Center, Privacy Policy e Segurança
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Esta página é mantida pela Alevi.ai para responder às principais dúvidas sobre privacidade, segurança, proteção de dados e controle de acesso. Última atualização: junho de 2026.
        </p>

        <section className="space-y-8 text-foreground/90 leading-relaxed">
          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              Privacy Policy: quais dados coletamos
            </h2>
            <p>
              Coletamos apenas o necessário para operar a plataforma: e-mail de
              acesso, plano contratado e os projetos/ebooks que você gera dentro
              da ferramenta. Não vendemos dados a terceiros.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              Security: como protegemos sua conta
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Senhas armazenadas com hash seguro pelo provedor de
                autenticação.
              </li>
              <li>
                Banco de dados com Row-Level Security: cada usuário só acessa os
                próprios registros.
              </li>
              <li>
                Operações sensíveis (alteração de plano, criação de contas)
                ficam restritas ao painel administrativo.
              </li>
              <li>Conexões protegidas por HTTPS de ponta a ponta.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              Retenção, exclusão e direitos do usuário
            </h2>
            <p>
              Você pode solicitar a exclusão completa da sua conta e dos dados
              associados a qualquer momento, entrando em contato com o suporte.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              Contato de segurança e privacidade
            </h2>
            <p>
              Dúvidas sobre privacidade ou segurança? Fale com a gente pelo
              canal de suporte informado dentro da sua conta.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
