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
  const beneficios = args.beneficios.slice(0, 4);
  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const htmlScene = (opts: { kicker: string; headline: string; body: string; number?: string; cta?: boolean }) => ({
    type: "html",
    width: 1080,
    height: 1920,
    x: 0,
    y: 0,
    duration: -2,
    html: `
      <div class="scene ${opts.cta ? "cta" : ""}">
        <div class="orb one"></div><div class="orb two"></div><div class="grid"></div>
        <div class="panel">
          <div class="kicker">${escapeHtml(opts.kicker)}</div>
          ${opts.number ? `<div class="number">${escapeHtml(opts.number)}</div>` : ""}
          <h1>${escapeHtml(opts.headline)}</h1>
          <p>${escapeHtml(opts.body)}</p>
        </div>
      </div>
      <style>
        *{box-sizing:border-box} body{margin:0;background:#111827;overflow:hidden}
        .scene{position:relative;width:1080px;height:1920px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:white;background:radial-gradient(circle at 25% 18%,#78350f 0,#1f2937 26%,#111827 58%,#020617 100%)}
        .scene.cta{background:radial-gradient(circle at 75% 22%,#fde68a 0,#f59e0b 30%,#92400e 68%,#111827 100%);color:#09090b}
        .grid{position:absolute;inset:-80px;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:74px 74px;transform:rotate(-8deg) scale(1.2);animation:drift 8s linear infinite;opacity:.55}
        .orb{position:absolute;border-radius:999px;filter:blur(18px);opacity:.85;animation:float 5s ease-in-out infinite alternate}.one{width:520px;height:520px;background:#f59e0b;left:-120px;top:160px}.two{width:760px;height:760px;background:#2563eb;right:-260px;bottom:120px;animation-delay:-1.4s}.cta .two{background:#111827;opacity:.22}.cta .one{background:#ffffff;opacity:.28}
        .panel{position:absolute;left:76px;right:76px;top:270px;min-height:1180px;padding:88px 72px;border:3px solid rgba(255,255,255,.2);border-radius:54px;background:rgba(2,6,23,.55);box-shadow:0 40px 120px rgba(0,0,0,.38);animation:rise .9s cubic-bezier(.18,.8,.22,1) both}.cta .panel{background:rgba(255,255,255,.72);border-color:rgba(17,24,39,.24)}
        .kicker{font-size:42px;letter-spacing:4px;text-transform:uppercase;font-weight:900;color:${accent};margin-bottom:60px}.cta .kicker{color:#92400e}.number{font-size:210px;line-height:.8;font-weight:900;color:${accent};margin-bottom:70px;text-shadow:0 20px 60px rgba(0,0,0,.3)}
        h1{font-size:94px;line-height:1.02;margin:0 0 56px;font-weight:900;letter-spacing:0}p{font-size:52px;line-height:1.22;margin:0;color:#e5e7eb;font-weight:700}.cta p{color:#111827}
        @keyframes rise{from{opacity:0;transform:translateY(120px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes float{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(80px,-90px,0) scale(1.14)}}@keyframes drift{from{transform:rotate(-8deg) translateY(0) scale(1.2)}to{transform:rotate(-8deg) translateY(74px) scale(1.2)}}
      </style>`,
  });

  const roteiro = [
    `${args.titulo}. ${args.subtitulo}.`,
    ...beneficios.map((b, i) => `Benefício ${i + 1}: ${b}.`),
    `${args.ctaTexto}.`,
  ].join(" ");

  return {
    resolution: "custom",
    quality: "high",
    width: 1080,
    height: 1920,
    variables: { titulo: args.titulo, nicho: args.nicho },
    elements: [
      {
        type: "voice",
        model: "azure",
        voice: "pt-BR-AntonioNeural",
        text: roteiro,
        start: 0.4,
      },
    ],
    scenes: [
      {
        duration: 3.5,
        "background-color": "#111827",
        elements: [htmlScene({ kicker: args.nicho, headline: args.titulo, body: args.subtitulo })],
      },
      ...beneficios.map((b, i) => ({
        duration: 2.8,
        "background-color": "#111827",
        elements: [htmlScene({ kicker: "benefício", number: `0${i + 1}`, headline: b, body: "Ideia pronta para transformar em oferta e conteúdo de venda." })],
      })),
      {
        duration: 4,
        "background-color": accent,
        elements: [htmlScene({ kicker: "oferta", headline: args.ctaTexto, body: args.ctaLink ?? "Acesse agora e aproveite o material completo.", cta: true })],
      },
    ],
  };
}

export const gerarVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => GerarInput.parse(i))
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

    // Random per-render token for webhook authentication
    const tokenBytes = new Uint8Array(24);
    crypto.getRandomValues(tokenBytes);
    const webhookToken = Array.from(tokenBytes, (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");

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

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: tokenErr } = await supabaseAdmin
      .from("video_webhook_tokens")
      .upsert({ video_id: videoRow.id, token: webhookToken }, { onConflict: "video_id" });
    if (tokenErr) return { ok: false as const, error: "Falha ao proteger webhook do vídeo." };

    // Webhook URL pública e estável (token aleatório por render)
    const { getRequestHost } = await import("@tanstack/react-start/server");
    const host = getRequestHost();
    const webhookUrl = `https://${host}/api/public/webhook/json2video?video=${videoRow.id}&token=${webhookToken}`;

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
  .validator((i: unknown) => ObterInput.parse(i))
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
  .validator((i: unknown) => UltimoInput.parse(i))
  .handler(async ({ data, context }) => {
    const { data: row } = await context.supabase
      .from("videos")
      .select("id, status, video_url, erro")
      .eq("ebook_id", data.ebookId)
      .neq("status", "erro")
      .gt("created_at", "2026-06-14T01:12:00Z")
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

export const listarMeusVideos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("videos")
      .select("id, status, video_url, erro, created_at, ebook_id, ebooks!inner(titulo, nicho)")
      .eq("usuario_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[listarMeusVideos]", error);
      return { ok: false as const, error: "Falha ao carregar vídeos." };
    }
    return { ok: true as const, videos: data ?? [] };
  });

const DelVideoInput = z.object({ id: z.string().uuid() });
export const deletarVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => DelVideoInput.parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("videos")
      .delete()
      .eq("id", data.id)
      .eq("usuario_id", context.userId);
    if (error) return { ok: false as const, error: "Falha ao excluir vídeo." };
    return { ok: true as const };
  });
