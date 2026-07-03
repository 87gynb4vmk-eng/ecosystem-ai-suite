import type { Page, Route } from "@playwright/test";

/**
 * Fake ebook payload returned by the stubbed `gerarEbook` server function.
 * Matches the shape consumed by `src/routes/_authenticated/dashboard.tsx`.
 */
export function fakeEbookPayload() {
  const capitulos = Array.from({ length: 10 }).map((_, i) => ({
    titulo: `Capítulo ${i + 1}: Teste E2E`,
    conteudo: `Conteúdo do capítulo ${i + 1}. `.repeat(20),
  }));
  return {
    ok: true as const,
    id: "test-ebook-id",
    titulo: "E-book de Teste",
    subtitulo: "Gerado por testes automatizados",
    conteudo: {
      introducao: "Introdução do e-book de teste.",
      capitulos,
      conclusao: "Conclusão do e-book de teste.",
      cta: "Baixe agora mesmo.",
    },
  };
}

/**
 * Intercepts the TanStack server-fn RPC endpoint for `gerarEbook` and returns
 * a canned success response. TanStack Start server fns are POSTed to
 * `/_serverFn/<hash>` and the client accepts a plain JSON body when the
 * `content-type` is `application/json`.
 */
export async function mockGerarEbookOk(page: Page) {
  await page.route("**/_serverFn/**", async (route: Route) => {
    const req = route.request();
    const url = req.url();
    // Filter to the gerarEbook call — the URL contains the function name.
    if (!/gerar|ebook/i.test(url)) return route.continue();
    await route.fulfill({
      status: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ result: fakeEbookPayload() }),
    });
  });
}
