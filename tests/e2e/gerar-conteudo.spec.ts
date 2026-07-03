import { test, expect } from "@playwright/test";
import { restoreSupabaseSession, clearSupabaseSession } from "./helpers/auth";
import { mockGerarEbookOk } from "./helpers/server-fn-mock";

const SKIP_REASON =
  "Sessão Supabase não injetada no sandbox (LOVABLE_BROWSER_AUTH_STATUS != 'injected'). " +
  "Faça login no preview e rode novamente — o Lovable injeta a sessão automaticamente na próxima execução.";

test.describe("Fluxo: Gerar Conteúdo (E-book)", () => {
  test("gera ebook e libera download em PDF após login", async ({ context, page }) => {
    const ok = await restoreSupabaseSession(context, page);
    test.skip(!ok, SKIP_REASON);

    await mockGerarEbookOk(page);

    await page.goto("/dashboard");
    // Estamos na etapa 1 (Gerar E-book) por padrão.
    await expect(page.getByRole("heading", { name: /Gerar E-book/i })).toBeVisible();

    // Seleciona nicho e sub-nicho (usa o primeiro par disponível).
    const nichoSelect = page.locator("select").nth(0);
    const options = await nichoSelect.locator("option").allTextContents();
    const primeiroNicho = options.find((o) => o && !/Selecione/i.test(o));
    expect(primeiroNicho, "nenhum nicho disponível").toBeTruthy();
    await nichoSelect.selectOption({ label: primeiroNicho! });

    const subSelect = page.locator("select").nth(1);
    await expect(subSelect).toBeEnabled();
    const subOpts = await subSelect.locator("option").allTextContents();
    const primeiroSub = subOpts.find((o) => o && !/Selecione|Escolha/i.test(o));
    await subSelect.selectOption({ label: primeiroSub! });

    // Clica em "Gerar Conteúdo" e aguarda o card do arquivo aparecer.
    await page.getByRole("button", { name: /Gerar Conteúdo/i }).click();
    await expect(page.getByText(/\.pdf$/)).toBeVisible({ timeout: 20_000 });

    // Baixa o PDF e valida.
    const downloadPromise = page.waitForEvent("download", { timeout: 20_000 });
    await page.getByRole("button", { name: /Baixar/i }).first().click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
    const path = await download.path();
    expect(path, "arquivo do download não persistido").toBeTruthy();
  });

  test("redireciona para /auth quando a sessão expira antes de gerar", async ({
    context,
    page,
  }) => {
    const ok = await restoreSupabaseSession(context, page);
    test.skip(!ok, SKIP_REASON);

    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: /Gerar E-book/i })).toBeVisible();

    // Preenche seleção para que o botão fique habilitado.
    const nichoSelect = page.locator("select").nth(0);
    const primeiroNicho = (await nichoSelect.locator("option").allTextContents()).find(
      (o) => o && !/Selecione/i.test(o),
    )!;
    await nichoSelect.selectOption({ label: primeiroNicho });
    const subSelect = page.locator("select").nth(1);
    const primeiroSub = (await subSelect.locator("option").allTextContents()).find(
      (o) => o && !/Selecione|Escolha/i.test(o),
    )!;
    await subSelect.selectOption({ label: primeiroSub });

    // Expira a sessão: limpa storage e força refreshSession a devolver null.
    await clearSupabaseSession(page);
    await page.evaluate(() => {
      // @ts-expect-error injeta stub em window
      window.__origRefresh = window.__origRefresh || null;
    });

    await page.getByRole("button", { name: /Gerar Conteúdo/i }).click();

    // Deve navegar para /auth.
    await page.waitForURL(/\/auth(\?|$)/, { timeout: 15_000 });
    expect(page.url()).toMatch(/\/auth/);
  });
});
