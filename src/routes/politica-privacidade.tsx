import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/politica-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade (LGPD) | Alevi.ai" },
      {
        name: "description",
        content:
          "Como a Alevi.ai coleta, usa, armazena e compartilha dados pessoais em conformidade com a LGPD (Lei nº 13.709/2018).",
      },
      { property: "og:title", content: "Política de Privacidade | Alevi.ai" },
      {
        property: "og:description",
        content:
          "Política de privacidade da Alevi.ai em conformidade com a LGPD.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PoliticaPrivacidadePage,
});

function PoliticaPrivacidadePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-gold hover:underline">
          ← Voltar para a home
        </Link>
        <h1 className="font-display text-4xl font-bold mt-6 mb-2">
          Política de Privacidade
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Em conformidade com a Lei Geral de Proteção de Dados (Lei nº
          13.709/2018 — LGPD). Última atualização: julho de 2026.
        </p>

        <section className="space-y-8 text-foreground/90 leading-relaxed">
          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              1. Quem somos (Controlador)
            </h2>
            <p>
              A Alevi.ai (“nós”) é a controladora dos dados pessoais tratados
              pela plataforma, conforme o art. 5º, VI da LGPD. Contato do
              Encarregado (DPO):{" "}
              <a href="mailto:privacidade@suportealevi.store" className="text-gold hover:underline">
                privacidade@suportealevi.store
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              2. Dados pessoais que coletamos
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cadastro:</strong> e-mail, senha (armazenada com hash), plano contratado.</li>
              <li><strong>Uso da plataforma:</strong> ebooks, páginas e vídeos criados por você, links de afiliado, projetos.</li>
              <li><strong>Pagamento:</strong> identificador da transação e status recebidos do gateway (Cakto). Não armazenamos dados de cartão.</li>
              <li><strong>Registros técnicos:</strong> logs de acesso e erros contendo timestamps e identificadores internos.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              3. Finalidade e base legal do tratamento
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Execução de contrato (art. 7º, V):</strong> prover acesso à plataforma, processar pagamentos, gerar conteúdo solicitado.</li>
              <li><strong>Cumprimento de obrigação legal (art. 7º, II):</strong> registros fiscais e atendimento a autoridades.</li>
              <li><strong>Legítimo interesse (art. 7º, IX):</strong> segurança, prevenção a fraudes, melhoria contínua.</li>
              <li><strong>Consentimento (art. 7º, I):</strong> cookies não essenciais e comunicações opcionais.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              4. Compartilhamento com terceiros (operadores)
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Lovable Cloud / Supabase:</strong> infraestrutura de banco de dados, autenticação e hospedagem.</li>
              <li><strong>Cakto:</strong> processamento de pagamentos.</li>
              <li><strong>Google Gemini / Lovable AI Gateway:</strong> geração de textos e imagens.</li>
              <li><strong>JSON2Video:</strong> renderização de vídeos.</li>
              <li><strong>Resend/Provedor de e-mail transacional:</strong> envio de e-mails do sistema.</li>
            </ul>
            <p className="mt-2">
              Todos os operadores tratam dados exclusivamente para as finalidades
              descritas e estão contratualmente obrigados à segurança dos dados.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              5. Retenção
            </h2>
            <p>
              Dados de cadastro e conteúdo: mantidos enquanto sua conta estiver
              ativa. Após a exclusão, apagados em até 30 dias, exceto quando a
              retenção for exigida por lei (ex.: registros fiscais — até 5 anos).
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              6. Seus direitos (art. 18 da LGPD)
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Confirmação da existência de tratamento;</li>
              <li>Acesso aos dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>Portabilidade;</li>
              <li>Eliminação dos dados tratados com consentimento;</li>
              <li>Informação sobre compartilhamento;</li>
              <li>Revogação do consentimento.</li>
            </ul>
            <p className="mt-2">
              Para exercer qualquer direito, use a{" "}
              <Link to="/contato-privacidade" className="text-gold hover:underline">
                página de contato de privacidade
              </Link>{" "}
              ou, se preferir, exclua sua conta diretamente em{" "}
              <Link to="/conta" className="text-gold hover:underline">
                Minha conta
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              7. Segurança
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Senhas armazenadas com hash bcrypt (Supabase Auth).</li>
              <li>Row-Level Security (RLS) em todas as tabelas de usuário.</li>
              <li>HTTPS obrigatório em toda a aplicação.</li>
              <li>Verificação de assinatura HMAC em webhooks.</li>
              <li>Segredos de API armazenados em variáveis de ambiente do servidor, jamais expostos ao navegador.</li>
              <li>Verificação de senhas contra a base HaveIBeenPwned no cadastro/alteração.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              8. Cookies
            </h2>
            <p>
              Utilizamos cookies essenciais (sessão de login) e, mediante
              consentimento, cookies analíticos. Veja a{" "}
              <Link to="/politica-cookies" className="text-gold hover:underline">
                Política de Cookies
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              9. Transferência internacional
            </h2>
            <p>
              Provedores como Google Gemini e Cloudflare podem processar dados
              fora do Brasil. Nesses casos garantimos que o país destinatário
              oferece grau de proteção adequado ou aplicamos cláusulas
              contratuais compatíveis com o art. 33 da LGPD.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              10. Alterações
            </h2>
            <p>
              Podemos atualizar esta política. Mudanças materiais serão
              comunicadas por e-mail ou aviso no painel.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
