import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const excluirMinhaConta = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = context.userId;

    // Apaga dados vinculados explicitamente (em vez de depender de cascade).
    const ops: Array<Promise<{ error: unknown }>> = [
      supabaseAdmin.from("videos").delete().eq("usuario_id", uid) as unknown as Promise<{ error: unknown }>,
      supabaseAdmin.from("ebooks").delete().eq("usuario_id", uid) as unknown as Promise<{ error: unknown }>,
      supabaseAdmin.from("projetos").delete().eq("usuario_id", uid) as unknown as Promise<{ error: unknown }>,
      supabaseAdmin.from("pedidos").delete().eq("usuario_id", uid) as unknown as Promise<{ error: unknown }>,
      supabaseAdmin.from("user_roles").delete().eq("user_id", uid) as unknown as Promise<{ error: unknown }>,
    ];

    const results = await Promise.all(ops);
    for (const r of results) {
      if (r?.error) console.warn("[excluirMinhaConta] falha parcial:", r.error);
    }

    const { error: usuariosErr } = await supabaseAdmin.from("usuarios").delete().eq("id", uid);
    if (usuariosErr) console.warn("[excluirMinhaConta] falha ao apagar usuarios:", usuariosErr.message);

    const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(uid);
    if (authErr) {
      throw new Error(`Não foi possível excluir a conta de autenticação: ${authErr.message}`);
    }

    console.info(`[excluirMinhaConta] conta excluída em ${new Date().toISOString()}`);
    return { ok: true as const };
  });
