import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Lista grupos (WhatsApp ativos) do nicho do último ebook + retorna o nicho para link dinâmico do Facebook.
export const listarGruposDoMeuNicho = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: ebook, error: ebookErr } = await supabase
      .from("ebooks")
      .select("nicho")
      .eq("usuario_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (ebookErr) {
      console.error("[listarGruposDoMeuNicho] ebook lookup", ebookErr);
      throw new Error("Não foi possível carregar os grupos. Tente novamente.");
    }
    if (!ebook?.nicho) return { nicho: null, grupos: [] as Array<{ id: string; plataforma: string; nicho: string; link: string; descricao: string }> };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: grupos, error } = await supabaseAdmin
      .from("community_groups")
      .select("id, plataforma, nicho, link, descricao")
      .ilike("nicho", ebook.nicho)
      .eq("is_active", true)
      .order("plataforma", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[listarGruposDoMeuNicho] grupos query", error);
      throw new Error("Não foi possível carregar os grupos. Tente novamente.");
    }
    return { nicho: ebook.nicho, grupos: grupos ?? [] };
  });

// --- Admin: gerenciamento de grupos ---

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

export const verificarSouAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error(error.message);
    return { isAdmin: !!data };
  });

export const adminListarGrupos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("community_groups")
      .select("id, plataforma, nicho, link, descricao, is_active, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const grupoInput = z.object({
  plataforma: z.string().min(1).max(50),
  nicho: z.string().min(1).max(100),
  link: z.string().url().max(500),
  descricao: z.string().min(1).max(500),
  is_active: z.boolean().optional().default(true),
});

export const adminCriarGrupo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => grupoInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("community_groups")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminAtualizarGrupo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        is_active: z.boolean().optional(),
        plataforma: z.string().min(1).max(50).optional(),
        nicho: z.string().min(1).max(100).optional(),
        link: z.string().url().max(500).optional(),
        descricao: z.string().min(1).max(500).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...patch } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("community_groups")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminDeletarGrupo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("community_groups").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
