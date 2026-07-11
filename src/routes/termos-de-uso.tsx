import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => ({
    meta: [
      { title: "Termos de Uso | Alevi.ai" },
      {
        name: "description",
        content:
          "Condições gerais de uso da plataforma Alevi.ai: cadastro, planos, pagamentos, propriedade intelectual e responsabilidades.",
      },
      { property: "og:title", content: "Termos de Uso | Alevi.ai" },
      {
        property: "og:description",
        content: "Termos e condições de uso da plataforma Alevi.ai.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-gold hover:underline">
          ← Voltar para a home
        </Link>
        <h1 className="font-display text-4xl font-bold mt-6 mb-2">
          Termos de Uso
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Última atualização: julho de 2026.
        </p>

        <section className="space-y-8 text-foreground/90 leading-relaxed">
          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">1. Aceitação</h2>
            <p>
              Ao criar conta ou utilizar a plataforma Alevi.ai, você concorda com
              estes Termos e com a{" "}
              <Link to="/politica-privacidade" className="text-gold hover:underline">
                Política de Privacidade
              </Link>
              . Se não concordar, não utilize o serviço.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">2. Objeto</h2>
            <p>
              A Alevi.ai oferece ferramentas de geração assistida por IA de
              ebooks, páginas de captura e vídeos, mediante contratação de
              plano.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">3. Cadastro e conta</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Você deve ter capacidade civil e fornecer dados verdadeiros.</li>
              <li>A conta é pessoal e intransferível; você é responsável pela guarda da senha.</li>
              <li>Podemos suspender contas com uso indevido, fraude ou violação destes Termos.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">4. Planos e pagamento</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Planos mensal e vitalício, conforme condições vigentes na página de checkout.</li>
              <li>Pagamentos processados pela Cakto; a Alevi.ai não armazena dados de cartão.</li>
              <li>Renovação automática do plano mensal enquanto não houver cancelamento.</li>
              <li>Cancelamento pode ser feito a qualquer momento, com efeitos ao fim do ciclo já pago.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              5. Direito de arrependimento (art. 49 do CDC)
            </h2>
            <p>
              Compras online podem ser desfeitas em até 7 dias corridos do
              pagamento, com reembolso integral, solicitado pelo suporte.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              6. Uso aceitável
            </h2>
            <p>É vedado usar a plataforma para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conteúdo ilegal, ofensivo, discriminatório, difamatório ou que viole direitos de terceiros.</li>
              <li>Spam, phishing, engenharia social ou fraudes.</li>
              <li>Engenharia reversa, scraping massivo ou exploração de vulnerabilidades.</li>
              <li>Revenda do acesso a terceiros sem autorização.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              7. Propriedade intelectual
            </h2>
            <p>
              O conteúdo gerado pela plataforma pertence a você, respeitados os
              direitos de terceiros e as licenças dos modelos de IA
              utilizados. A marca Alevi.ai, o software e a documentação são de
              propriedade da Alevi.ai.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              8. Isenção e limitação de responsabilidade
            </h2>
            <p>
              O serviço é fornecido “no estado em que se encontra”. Conteúdo
              gerado por IA pode conter imprecisões — revise antes de publicar.
              Nossa responsabilidade se limita ao valor efetivamente pago pelo
              usuário nos 12 meses anteriores ao evento, salvo previsão legal
              diversa.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              9. Alterações
            </h2>
            <p>
              Podemos alterar estes Termos. Alterações materiais serão
              comunicadas com antecedência razoável.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              10. Lei aplicável e foro
            </h2>
            <p>
              Estes Termos são regidos pelas leis do Brasil. Fica eleito o foro
              da comarca de domicílio do consumidor para dirimir controvérsias.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
