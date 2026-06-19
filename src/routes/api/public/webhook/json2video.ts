import { createFileRoute } from "@tanstack/react-router";

// JSON2Video webhook: enviado pela API quando o vídeo termina.
// Autenticamos por (videoId, token) — token aleatório gerado por render e
// armazenado em `videos.webhook_token`. Sem o token correto, a requisição é rejeitada.
export const Route = createFileRoute("/api/public/webhook/json2video")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const videoId = url.searchParams.get("video");
        const token = url.searchParams.get("token");
        if (!videoId || !/^[0-9a-f-]{36}$/i.test(videoId)) {
          return new Response("video param inválido", { status: 400 });
        }
        if (!token || !/^[0-9a-f]{32,128}$/i.test(token)) {
          return new Response("token inválido", { status: 401 });
        }

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return new Response("payload inválido", { status: 400 });
        }

        const p = payload as {
          movie?: { status?: string; url?: string; message?: string };
          status?: string;
          url?: string;
          message?: string;
          success?: boolean;
        };
        const status = p.movie?.status ?? p.status;
        const videoUrl = p.movie?.url ?? p.url;
        const message = p.movie?.message ?? p.message;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Confere token armazenado para esse vídeo
        const { data: row } = await supabaseAdmin
          .from("video_webhook_tokens")
          .select("token")
          .eq("video_id", videoId)
          .maybeSingle();
        if (!row?.token || row.token !== token) {
          return new Response("não autorizado", { status: 401 });
        }

        // Aceita apenas URLs do CDN do JSON2Video para impedir injeção de URL arbitrária
        const isAllowedUrl = (u: string) => {
          try {
            const parsed = new URL(u);
            return (
              parsed.protocol === "https:" &&
              /(^|\.)json2video\.com$/i.test(parsed.hostname)
            );
          } catch {
            return false;
          }
        };

        if (status === "done" && videoUrl && isAllowedUrl(videoUrl)) {
          await supabaseAdmin
            .from("videos")
            .update({ status: "concluido", video_url: videoUrl, erro: null })
            .eq("id", videoId);
        } else if (status === "done" && videoUrl) {
          await supabaseAdmin
            .from("videos")
            .update({ status: "erro", erro: "URL de vídeo recusada (origem inválida)" })
            .eq("id", videoId);
        } else if (status === "error" || p.success === false) {
          await supabaseAdmin
            .from("videos")
            .update({ status: "erro", erro: message ?? "Falha na renderização" })
            .eq("id", videoId);
        }

        return Response.json({ ok: true });
      },
    },
  },
});
