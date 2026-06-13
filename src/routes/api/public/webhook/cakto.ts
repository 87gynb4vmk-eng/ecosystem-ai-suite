import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";

const PayloadSchema = z.object({
  event: z.string(),
  data: z.object({
    customer: z.object({
      email: z.string().email(),
      name: z.string().optional(),
    }),
    product: z
      .object({
        // Mensal vs vitalicio: identificar por preço ou id
        price: z.number().optional(),
        id: z.string().optional(),
        name: z.string().optional(),
      })
      .optional(),
    plano: z.enum(["mensal", "vitalicio"]).optional(),
  }),
});

function gerarSenha(len = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let s = "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) s += chars[arr[i] % chars.length];
  return s;
}

export const Route = createFileRoute("/api/public/webhook/cakto")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const segredo = process.env.CAKTO_WEBHOOK_SEGREDO;
        if (!segredo) {
          return new Response("Servidor não configurado", { status: 500 });
        }

        const signature = request.headers.get("x-cakto-signature") ?? "";
        const body = await request.text();

        const expected = createHmac("sha256", segredo).update(body).digest("hex");
        const sig = Buffer.from(signature);
        const exp = Buffer.from(expected);
        if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) {
          return new Response("Assinatura inválida", { status: 401 });
        }

        let parsed;
        try {
          parsed = PayloadSchema.parse(JSON.parse(body));
        } catch {
          return new Response("Payload inválido", { status: 400 });
        }

        // Aceitar apenas eventos de compra aprovada
        if (!["purchase.approved", "purchase_approved", "approved"].includes(parsed.event)) {
          return new Response("Evento ignorado", { status: 200 });
        }

        const email = parsed.data.customer.email.toLowerCase().trim();
        const plano: "mensal" | "vitalicio" =
          parsed.data.plano ??
          (parsed.data.product?.price && parsed.data.product.price >= 200 ? "vitalicio" : "mensal");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const senha = gerarSenha(12);

        // Tenta criar; se já existir, atualiza senha
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: senha,
          email_confirm: true,
        });

        let userId = created?.user?.id;
        if (createErr) {
          // Provavelmente já existe — buscar
          const { data: list } = await supabaseAdmin.auth.admin.listUsers();
          const found = list?.users.find((u) => u.email?.toLowerCase() === email);
          if (!found) {
            console.error("[Cakto webhook] erro criar usuario:", createErr.message);
            return new Response("Falha ao processar usuário", { status: 500 });
          }
          userId = found.id;
          await supabaseAdmin.auth.admin.updateUserById(userId, { password: senha });
        }

        if (!userId) {
          return new Response("ID do usuário não disponível", { status: 500 });
        }

        await supabaseAdmin
          .from("usuarios")
          .upsert({ id: userId, email, senha_temporaria: senha, plano }, { onConflict: "id" });

        console.log(`[Cakto webhook] usuário ${email} provisionado plano=${plano}`);
        return Response.json({ ok: true });
      },
    },
  },
});
