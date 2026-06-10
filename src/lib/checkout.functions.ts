import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  plano: z.enum(["mensal", "vitalicio"]),
});

function gerarSenha(len = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let s = "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) s += chars[arr[i] % chars.length];
  return s;
}

/**
 * Simula o fluxo da Cakto:
 * 1. Usuário "paga" -> 2. Webhook aprovado -> 3. Conta criada -> 4. Senha gerada.
 * Retorna a senha temporária para exibição (simulação de envio por e-mail).
 */
export const simularCompraCakto = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const senha = gerarSenha(12);
    const email = data.email;

    // Cria usuário no Auth (ou recupera se já existir)
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });

    let userId = created?.user?.id;
    if (createErr) {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers();
      const found = list?.users.find((u) => u.email?.toLowerCase() === email);
      if (!found) {
        console.error("[Checkout simulado] erro criar usuario:", createErr.message);
        throw new Error("Não foi possível processar a compra. Tente novamente.");
      }
      userId = found.id;
      await supabaseAdmin.auth.admin.updateUserById(userId, { password: senha });
    }

    if (!userId) throw new Error("ID do usuário não disponível");

    await supabaseAdmin
      .from("usuarios")
      .upsert(
        { id: userId, email, senha_temporaria: senha, plano: data.plano },
        { onConflict: "id" },
      );

    return { ok: true, email, senha, plano: data.plano };
  });
