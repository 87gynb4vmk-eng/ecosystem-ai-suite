import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const LIMITES = {
  mensal: {
    ebooksPorMes: 5,
    paginasPublicadas: 3,
    videosPorMes: 5,
  },
  vitalicio: {
    ebooksPorMes: Infinity,
    paginasPublicadas: Infinity,
    videosPorMes: Infinity,
  },
} as const;

export type Recurso = "ebook" | "pagina" | "video";

export const verificarLimite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ recurso: z.enum(["ebook", "pagina", "video"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: usuario, error } = await context.supabase
      .from("usuarios")
      .select("plano, ebooks_gerados_mes, videos_gerados_mes, paginas_publicadas_total")
      .eq("id", context.userId)
      .single();

    if (error || !usuario) {
      return { ok: false as const, error: "Usuário não encontrado." };
    }

    const plano = usuario.plano as "mensal" | "vitalicio";
    const limite = LIMITES[plano];

    if (data.recurso === "ebook" && usuario.ebooks_gerados_mes >= limite.ebooksPorMes) {
      return {
        ok: false as const,
        error: `Limite de ${limite.ebooksPorMes} e-books/mês atingido. Faça upgrade para o plano Vitalício.`,
      };
    }

    if (data.recurso === "video" && usuario.videos_gerados_mes >= limite.videosPorMes) {
      return {
        ok: false as const,
        error: `Limite de ${limite.videosPorMes} vídeos/mês atingido. Faça upgrade para o plano Vitalício.`,
      };
    }

    if (data.recurso === "pagina" && usuario.paginas_publicadas_total >= limite.paginasPublicadas) {
      return {
        ok: false as const,
        error: `Limite de ${limite.paginasPublicadas} páginas publicadas atingido. Faça upgrade para o plano Vitalício.`,
      };
    }

    return { ok: true as const };
  });

export const incrementarUso = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ recurso: z.enum(["ebook", "pagina", "video"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const coluna =
      data.recurso === "ebook"
        ? "ebooks_gerados_mes"
        : data.recurso === "video"
          ? "videos_gerados_mes"
          : "paginas_publicadas_total";

    const { error } = await context.supabase.rpc("increment_counter", {
      p_user_id: context.userId,
      p_column: coluna,
    });

    if (error) {
      console.error("[incrementarUso] erro:", error);
      return { ok: false as const, error: error.message };
    }

    return { ok: true as const };
  });

export const obterMeuPlano = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("usuarios")
      .select("plano, status, acesso_ate, ebooks_gerados_mes, videos_gerados_mes, paginas_publicadas_total")
      .eq("id", context.userId)
      .single();

    if (error || !data) {
      return { ok: false as const, error: "Usuário não encontrado." };
    }

    const plano = data.plano as "mensal" | "vitalicio";
    return {
      ok: true as const,
      plano,
      status: data.status,
      acessoAte: data.acesso_ate,
      usado: {
        ebooks: data.ebooks_gerados_mes,
        videos: data.videos_gerados_mes,
        paginas: data.paginas_publicadas_total,
      },
      limites: LIMITES[plano],
    };
  });
