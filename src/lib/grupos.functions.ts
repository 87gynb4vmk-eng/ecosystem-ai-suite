import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listarGruposDoMeuNicho = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Pega o nicho do último ebook do usuário
    const { data: ebook, error: ebookErr } = await supabase
      .from("ebooks")
      .select("nicho")
      .eq("usuario_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (ebookErr) throw new Error(ebookErr.message);
    if (!ebook?.nicho) return { nicho: null, grupos: [] };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: grupos, error } = await supabaseAdmin
      .from("community_groups")
      .select("id, plataforma, nicho, link, descricao")
      .ilike("nicho", ebook.nicho)
      .eq("is_active", true)
      .order("plataforma", { ascending: true });

    if (error) throw new Error(error.message);
    return { nicho: ebook.nicho, grupos: grupos ?? [] };
  });
