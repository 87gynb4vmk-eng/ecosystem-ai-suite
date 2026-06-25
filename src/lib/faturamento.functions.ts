import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PeriodSchema = z.enum(["hoje", "7d", "30d"]);

const MOCK = {
  hoje: { total: 680, vendas: 5, delta: 12, pix: 64, card: 28, picpay: 8 },
  "7d": { total: 4500, vendas: 31, delta: 38, pix: 58, card: 34, picpay: 8 },
  "30d": { total: 18750, vendas: 142, delta: 64, pix: 61, card: 31, picpay: 8 },
} as const;

// Demo data para contas específicas — simula histórico de vendas
const DEMO_EMAILS = new Set<string>(["silvanascimentof14@gmail.com"]);
const DEMO_MOCK = {
  hoje: { total: 420, vendas: 3, delta: 18, pix: 60, card: 32, picpay: 8 },
  "7d": { total: 2500, vendas: 18, delta: 42, pix: 58, card: 34, picpay: 8 },
  "30d": { total: 11200, vendas: 84, delta: 56, pix: 61, card: 31, picpay: 8 },
} as const;

export const obterFaturamentoAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ period: PeriodSchema }).parse(d))
  .handler(async ({ data, context }) => {
    const email = (context.claims?.email as string | undefined)?.toLowerCase();
    if (email && DEMO_EMAILS.has(email)) {
      return DEMO_MOCK[data.period];
    }

    const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error("Falha ao verificar permissão.");
    if (!isAdmin) {
      // Não administradores recebem zeros — não vazamos a existência dos dados.
      return { total: 0, vendas: 0, delta: 0, pix: 0, card: 0, picpay: 0 };
    }
    return MOCK[data.period];
  });
