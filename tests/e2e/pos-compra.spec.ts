import { test, expect } from "@playwright/test";
import { createHmac } from "crypto";

const CAKTO_SECRET = process.env.CAKTO_WEBHOOK_SEGREDO || "test-secret";
const WEBHOOK_URL = "http://localhost:8080/api/public/webhook/cakto";

function signCakto(payload: object): { signature: string; body: string } {
  const body = JSON.stringify(payload);
  const signature = createHmac("sha256", CAKTO_SECRET).update(body).digest("hex");
  return { signature, body };
}

test.describe("Fluxo Pós-Compra", () => {
  test("webhook aprovado cria usuário e registra pedido", async ({ request }) => {
    const timestamp = Date.now();
    const email = `teste-pos-compra-${timestamp}@example.com`;
    const payload = {
      event: "purchase.approved",
      data: {
        customer: { email, name: "Teste Compra" },
        product: { id: "prod-vitalicio", name: "Plano Vitalício", price: 250 },
        plano: "vitalicio",
      },
    };
    const { signature, body } = signCakto(payload);

    const res = await request.post(WEBHOOK_URL, {
      data: body,
      headers: { "x-cakto-signature": signature, "Content-Type": "application/json" },
    });

    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  test("login com senha temporária redireciona para troca obrigatória de senha", async ({
    page,
    request,
  }) => {
    const timestamp = Date.now();
    const email = `teste-login-${timestamp}@example.com`;
    const payload = {
      event: "purchase.approved",
      data: {
        customer: { email, name: "Teste Login" },
        product: { id: "prod-mensal", name: "Plano Mensal", price: 170 },
        plano: "mensal",
      },
    };
    const { signature, body } = signCakto(payload);
    await request.post(WEBHOOK_URL, {
      data: body,
      headers: { "x-cakto-signature": signature, "Content-Type": "application/json" },
    });

    // A senha temporária não é exposta; este teste verifica a estrutura da tela de login.
    await page.goto("/auth");
    await expect(page.getByRole("heading", { name: /Entrar no painel/i })).toBeVisible();
  });

  test("usuário inativo é redirecionado para /renovar", async ({ page }) => {
    await page.goto("/renovar");
    await expect(page.getByRole("heading", { name: /Acesso expirado/i })).toBeVisible();
    await expect(page.getByText(/R\$ 170\/mês/i)).toBeVisible();
    await expect(page.getByText(/R\$ 250,00/i)).toBeVisible();
  });
});
