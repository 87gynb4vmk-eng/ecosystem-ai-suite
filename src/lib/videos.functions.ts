import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const GerarInput = z.object({
  ebookId: z.string().uuid(),
  videoLink: z.string().url().optional().or(z.literal("").optional()),
});

const ObterInput = z.object({ id: z.string().uuid() });

const J2V_BASE = "https://api.json2video.com/v2/movies";

function buildTimeline(args: {
  titulo: string;
  subtitulo: string;
  nicho: string;
  beneficios: string[];
  ctaTexto: string;
  ctaLink?: string;
  webhookUrl: string;
}) {
  const accent = "#f59e0b";
  const bg = "#0a0a0a";
  const fg = "#ffffff";

  const beneficios = args.beneficios.slice(0, 4);
  const text = (
    text: string,
    opts: { x?: number; y: number; width?: number; size: number; color?: string; weight?: string | number; align?: string },
  ) => ({
    type: "text",
    text,
    style: "001",
    x: opts.x ?? 70,
    y: opts.y,
    width: opts.width ?? 940,
    "font-family": "Arial",
    "font-size": opts.size,
    "font-weight": opts.weight ?? 800,
    color: opts.color ?? fg,
    "text-align": opts.align ?? "center",
  });

  return {
    resolution: "custom",
    quality: "high",
    width: 1080,
    height: 1920,
    variables: { titulo: args.titulo, nicho: args.nicho },
    scenes: [
      {
        duration: 3.5,
        "background-color": bg,
        elements: [
          text(args.nicho.toUpperCase(), { y: 360, size: 48, color: accent, weight: 900 }),
          text(args.titulo, { y: 650, size: 86, weight: 900 }),
          text(args.subtitulo, { y: 1120, size: 46, color: "#d4d4d8", weight: 600 }),
        ],
      },
      ...beneficios.map((b, i) => ({
        duration: 2.8,
        "background-color": bg,
        elements: [
          text(`0${i + 1}`, { y: 260, size: 190, color: accent, weight: 900 }),
          text(b, { y: 760, size: 66, weight: 900 }),
        ],
      })),
      {
        duration: 4,
        "background-color": accent,
        elements: [
          text(args.ctaTexto, { y: 690, size: 96, color: "#0a0a0a", weight: 900 }),
          ...(args.ctaLink
            ? [
                text(args.ctaLink, { y: 1080, size: 38, color: "#0a0a0a", weight: 700 }),
              ]
            : []),
        ],
      },
    ],
  };
}

export const gerarVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => GerarInput.parse(i))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.JSON2VIDEO_API_KEY;
    if (!apiKey) return { ok: false as const, error: "JSON2VIDEO_API_KEY ausente." };

    // Carrega o e-book do usuário (RLS já restringe)
    const { data: ebook, error: ebookErr } = await context.supabase
      .from("ebooks")
      .select("id, titulo, subtitulo, nicho, conteudo, affiliate_link")
      .eq("id", data.ebookId)
      .single();
    if (ebookErr || !ebook) return { ok: false as const, error: "E-book não encontrado." };

    // Extrai 3-4 benefícios do conteúdo (linhas curtas com "-" ou primeiras frases dos capítulos)
    const linhas = ebook.conteudo
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const bullets = linhas
      .filter((l) => l.startsWith("- ") || l.startsWith("• "))
      .map((l) => l.replace(/^[-•]\s+/, ""))
      .filter((l) => l.length >= 12 && l.length <= 90)
      .slice(0, 4);
    const beneficios =
      bullets.length >= 3
        ? bullets
        : [
            "Conteúdo prático e direto ao ponto",
            "Aprenda no seu ritmo, sem enrolação",
            "Resultados reais e aplicáveis hoje",
            "Material exclusivo de alto valor",
          ];

    // Cria registro em "videos" como processando
    const { data: videoRow, error: insErr } = await context.supabase
      .from("videos")
      .insert({
        usuario_id: context.userId,
        ebook_id: ebook.id,
        status: "processando",
      })
      .select("id")
      .single();
    if (insErr || !videoRow) return { ok: false as const, error: "Falha ao registrar vídeo." };

    // Webhook URL pública e estável
    const { getRequestHost } = await import("@tanstack/react-start/server");
    const host = getRequestHost();
    const webhookUrl = `https://${host}/api/public/webhook/json2video?video=${videoRow.id}`;

    const ctaLink = data.videoLink || ebook.affiliate_link || undefined;
    const movie = buildTimeline({
      titulo: ebook.titulo,
      subtitulo: ebook.subtitulo,
      nicho: ebook.nicho,
      beneficios,
      ctaTexto: "Garanta o seu agora",
      ctaLink,
      webhookUrl,
    });

    try {
      const res = await fetch(`${J2V_BASE}?webhook=${encodeURIComponent(webhookUrl)}`, {
        method: "POST",
        headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });
      const json = (await res.json()) as { success?: boolean; project?: string; message?: string };
      if (!res.ok || !json.success || !json.project) {
        await context.supabase
          .from("videos")
          .update({ status: "erro", erro: json.message ?? `HTTP ${res.status}` })
          .eq("id", videoRow.id);
        return { ok: false as const, error: json.message ?? "Falha ao iniciar renderização." };
      }
      await context.supabase
        .from("videos")
        .update({ render_id: json.project })
        .eq("id", videoRow.id);
      return { ok: true as const, id: videoRow.id, renderId: json.project };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "erro de rede";
      await context.supabase.from("videos").update({ status: "erro", erro: msg }).eq("id", videoRow.id);
      return { ok: false as const, error: msg };
    }
  });

export const obterVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => ObterInput.parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("videos")
      .select("id, status, video_url, erro, render_id")
      .eq("id", data.id)
      .single();
    if (error || !row) return { ok: false as const, error: "Vídeo não encontrado." };

    // Fallback: se ainda processando após muito tempo, consulta a API
    if (row.status === "processando" && row.render_id) {
      const apiKey = process.env.JSON2VIDEO_API_KEY;
      if (apiKey) {
        try {
          const res = await fetch(`${J2V_BASE}?project=${encodeURIComponent(row.render_id)}`, {
            headers: { "x-api-key": apiKey },
          });
          const j = (await res.json()) as {
            success?: boolean;
            movie?: { status?: string; url?: string; message?: string };
          };
          const st = j.movie?.status;
          if (st === "done" && j.movie?.url) {
            await context.supabase
              .from("videos")
              .update({ status: "concluido", video_url: j.movie.url })
              .eq("id", row.id);
            return { ok: true as const, status: "concluido", videoUrl: j.movie.url };
          }
          if (st === "error") {
            await context.supabase
              .from("videos")
              .update({ status: "erro", erro: j.movie?.message ?? "erro" })
              .eq("id", row.id);
            return { ok: true as const, status: "erro", erro: j.movie?.message ?? "erro" };
          }
        } catch {
          // ignora — segue como processando
        }
      }
    }

    return {
      ok: true as const,
      status: row.status,
      videoUrl: row.video_url ?? undefined,
      erro: row.erro ?? undefined,
    };
  });

const UltimoInput = z.object({ ebookId: z.string().uuid() });
export const obterUltimoVideoDoEbook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => UltimoInput.parse(i))
  .handler(async ({ data, context }) => {
    const { data: row } = await context.supabase
      .from("videos")
      .select("id, status, video_url, erro")
      .eq("ebook_id", data.ebookId)
      .neq("status", "erro")
      .gt("created_at", "2026-06-14T01:00:00Z")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!row) return { ok: true as const, video: null };
    return {
      ok: true as const,
      video: {
        id: row.id,
        status: row.status,
        videoUrl: row.video_url ?? undefined,
        erro: row.erro ?? undefined,
      },
    };
  });
