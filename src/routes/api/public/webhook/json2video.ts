import { createFileRoute } from "@tanstack/react-router";

// JSON2Video webhook: enviado pela API quando o vídeo termina (success ou erro).
// Não há header de assinatura no payload — protegemos com um token único na própria
// URL (?video=<uuid>). O ID do vídeo já é um UUID aleatório, o que torna a URL
// efetivamente um segredo por renderização.
export const Route = createFileRoute("/api/public/webhook/json2video")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const videoId = url.searchParams.get("video");
        if (!videoId || !/^[0-9a-f-]{36}$/i.test(videoId)) {
          return new Response("video param inválido", { status: 400 });
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

        if (status === "done" && videoUrl) {
          await supabaseAdmin
            .from("videos")
            .update({ status: "concluido", video_url: videoUrl, erro: null })
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
