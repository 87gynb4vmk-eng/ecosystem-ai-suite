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

function isAprovado(event: string) {
  return ["purchase.approved", "purchase_approved", "approved"].includes(event);
}

function isCancelado(event: string) {
  return ["purchase.canceled", "subscription.canceled", "canceled", "cancelled"].includes(event);
}

function isReembolsado(event: string) {
  return ["purchase.refunded", "refunded"].includes(event);
}

function isFalhaCobranca(event: string) {
  return ["subscription.charge_failed", "charge_failed"].includes(event);
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

        const eventId = request.headers.get("x-cakto-event-id") ?? crypto.randomUUID();
        const email = parsed.data.customer.email.toLowerCase().trim();
        const plano: "mensal" | "vitalicio" =
          parsed.data.plano ??
          (parsed.data.product?.price && parsed.data.product.price >= 200 ? "vitalicio" : "mensal");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Idempotência: ignora eventos duplicados
        const { data: existingEvent } = await supabaseAdmin
          .from("pedidos")
          .select("id")
          .eq("gateway_event_id", eventId)
          .maybeSingle();
        if (existingEvent) {
          return Response.json({ ok: true, ignored: "duplicate" });
        }

        if (isAprovado(parsed.event)) {
          const senha = gerarSenha(12);

          const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: senha,
            email_confirm: true,
          });

          let userId = created?.user?.id;
          let isNewUser = true;
          if (createErr) {
            const { data: list } = await supabaseAdmin.auth.admin.listUsers();
            const found = list?.users.find((u) => u.email?.toLowerCase() === email);
            if (!found) {
              console.error("[Cakto webhook] erro criar usuario:", createErr.message);
              return new Response("Falha ao processar usuário", { status: 500 });
            }
            userId = found.id;
            isNewUser = false;
            await supabaseAdmin.auth.admin.updateUserById(userId, { password: senha });
          }

          if (!userId) {
            return new Response("ID do usuário não disponível", { status: 500 });
          }

          const acessoAte = plano === "mensal" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null;

          await supabaseAdmin.from("usuarios").upsert(
            {
              id: userId,
              email,
              plano,
              status: "ativo",
              acesso_ate: acessoAte,
              trocar_senha_obrigatorio: isNewUser,
            },
            { onConflict: "id" },
          );

          const { error: pedidoErr } = await supabaseAdmin.from("pedidos").insert({
            usuario_id: userId,
            email,
            plano,
            status: "aprovado",
            gateway_event_id: eventId,
            produto_nome: parsed.data.product?.name,
            valor: parsed.data.product?.price,
          });
          if (pedidoErr) {
            console.error("[Cakto webhook] erro inserir pedido:", pedidoErr.message);
          }

          // TODO: enviar e-mail de boas-vindas quando infraestrutura de e-mail estiver configurada
          console.log(`[Cakto webhook] usuário ${email} provisionado plano=${plano} senha=${senha}`);
          return Response.json({ ok: true });
        }

        if (isCancelado(parsed.event) || isReembolsado(parsed.event) || isFalhaCobranca(parsed.event)) {
          const { data: usuario } = await supabaseAdmin
            .from("usuarios")
            .select("id, plano")
            .eq("email", email)
            .maybeSingle();

          if (!usuario) {
            return Response.json({ ok: true, ignored: "user_not_found" });
          }

          const novoStatus = isReembolsado(parsed.event) ? "reembolsado" : "cancelado";

          if (usuario.plano === "mensal") {
            await supabaseAdmin
              .from("usuarios")
              .update({ status: "inativo", acesso_ate: new Date().toISOString() })
              .eq("id", usuario.id);
          }

          await supabaseAdmin.from("pedidos").insert({
            usuario_id: usuario.id,
            email,
            plano: usuario.plano,
            status: novoStatus,
            gateway_event_id: eventId,
            produto_nome: parsed.data.product?.name,
            valor: parsed.data.product?.price,
          });

          console.log(`[Cakto webhook] usuário ${email} ${novoStatus}`);
          return Response.json({ ok: true });
        }

        return Response.json({ ok: true, ignored: "event_not_handled" });
      },
    },
  },
});
