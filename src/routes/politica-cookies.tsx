import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/politica-cookies")({
  head: () => ({
    meta: [
      { title: "Política de Cookies | Alevi.ai" },
      {
        name: "description",
        content:
          "Quais cookies a Alevi.ai utiliza, com que finalidade e como você pode gerenciá-los.",
      },
      { property: "og:title", content: "Política de Cookies | Alevi.ai" },
      {
        property: "og:description",
        content: "Uso de cookies na plataforma Alevi.ai.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  const abrirPreferencias = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("cookie-consent-v1");
      window.location.reload();
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-gold hover:underline">
          ← Voltar para a home
        </Link>
        <h1 className="font-display text-4xl font-bold mt-6 mb-2">
          Política de Cookies
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Última atualização: julho de 2026.
        </p>

        <section className="space-y-8 text-foreground/90 leading-relaxed">
          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              O que são cookies?
            </h2>
            <p>
              Pequenos arquivos gravados no seu dispositivo pelo navegador
              quando você visita um site. Servem para lembrar preferências,
              manter sessão e medir uso.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              Cookies que utilizamos
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border">
                <thead className="bg-card">
                  <tr>
                    <th className="text-left p-2 border-b border-border">Categoria</th>
                    <th className="text-left p-2 border-b border-border">Finalidade</th>
                    <th className="text-left p-2 border-b border-border">Base legal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-b border-border">Essenciais</td>
                    <td className="p-2 border-b border-border">Autenticação, manutenção da sessão, segurança.</td>
                    <td className="p-2 border-b border-border">Execução de contrato</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b border-border">Preferências</td>
                    <td className="p-2 border-b border-border">Salvar sua escolha de consentimento de cookies.</td>
                    <td className="p-2 border-b border-border">Legítimo interesse</td>
                  </tr>
                  <tr>
                    <td className="p-2">Analíticos (opcional)</td>
                    <td className="p-2">Métricas agregadas de uso — só ativados após seu consentimento.</td>
                    <td className="p-2">Consentimento</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              Como gerenciar
            </h2>
            <p>
              Você pode aceitar ou recusar cookies não essenciais pelo banner
              exibido na primeira visita, ou revisar sua escolha a qualquer
              momento:
            </p>
            <button
              onClick={abrirPreferencias}
              className="mt-3 rounded-md bg-gradient-gold px-4 py-2 text-sm font-semibold text-gold-foreground shadow-gold-glow hover:opacity-95 transition"
            >
              Rever preferências de cookies
            </button>
            <p className="mt-4 text-sm text-muted-foreground">
              Você também pode bloquear ou excluir cookies diretamente nas
              configurações do seu navegador. Cookies essenciais não podem ser
              desativados, pois são necessários ao funcionamento do serviço.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
