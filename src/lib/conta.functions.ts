import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const excluirMinhaConta = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const uid = context.userId;

    // Apaga dados vinculados. Alguns já têm ON DELETE CASCADE via auth.users,
    // mas apagamos explicitamente para garantir remoção mesmo com FKs sem cascade.
    const tabelas = [
      "videos",
      "ebooks",
      "projetos",
      "pedidos",
      "user_roles",
      "usuarios",
    ] as const;

    for (const t of tabelas) {
      const coluna = t === "user_roles" || t === "pedidos" ? "user_id" : t === "usuarios" ? "id" : "user_id";
      // usuarios usa id; pedidos usa usuario_id; demais usam user_id — normaliza:
      const col =
        t === "usuarios" ? "id" : t === "pedidos" ? "usuario_id" : t === "user_roles" ? "user_id" : "user_id";
      const { error } = await supabaseAdmin.from(t).delete().eq(col, uid);
      if (error) {
        console.warn(`[excluirMinhaConta] falha ao apagar ${t}:`, error.message);
      }
      void coluna;
    }

    const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(uid);
    if (authErr) {
      throw new Error(`Não foi possível excluir a conta de autenticação: ${authErr.message}`);
    }

    console.info(`[excluirMinhaConta] conta ${uid} excluída em ${new Date().toISOString()}`);
    return { ok: true as const };
  });
