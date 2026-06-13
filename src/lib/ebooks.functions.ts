import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({
  nicho: z.string().min(2).max(80),
  subnicho: z.string().min(2).max(80),
});

export const gerarEbook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { ok: false as const, error: "IA indisponível." };

    const { generateText } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const result = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        prompt: `Crie um e-book completo em português brasileiro sobre "${data.subnicho}" dentro do nicho "${data.nicho}".
Use tom profissional, prático e envolvente.

Formato obrigatório em texto simples, sem JSON e sem markdown:
TÍTULO: um título comercial curto
SUBTÍTULO: uma promessa clara do conteúdo

INTRODUÇÃO
2 parágrafos curtos.

CAPÍTULO 1 — título do capítulo
3 parágrafos curtos.

CAPÍTULO 2 — título do capítulo
3 parágrafos curtos.

CAPÍTULO 3 — título do capítulo
3 parágrafos curtos.

CAPÍTULO 4 — título do capítulo
3 parágrafos curtos.

CAPÍTULO 5 — título do capítulo
3 parágrafos curtos.

CONCLUSÃO
2 parágrafos curtos.`,
      });
      const conteudo = result.text.trim();
      if (!conteudo) return { ok: false as const, error: "A IA retornou uma resposta vazia." };

      let titulo = `E-book de ${data.subnicho}`;
      let subtitulo = `${data.nicho} • ${data.subnicho}`;
      const tituloMatch = conteudo.match(/^\s*T[IÍ]TULO\s*:\s*(.+)$/im);
      const subtituloMatch = conteudo.match(/^\s*SUBT[IÍ]TULO\s*:\s*(.+)$/im);
      if (tituloMatch?.[1]) titulo = tituloMatch[1].trim();
      if (subtituloMatch?.[1]) subtitulo = subtituloMatch[1].trim();

      return { ok: true as const, titulo, subtitulo, conteudo };
    } catch (err) {
      const msg = (err as Error).message ?? "";
      console.error("[gerarEbook] AI error:", err);
      if (msg.includes("429"))
        return {
          ok: false as const,
          error: "Limite de requisições. Tente novamente em instantes.",
        };
      if (msg.includes("402")) return { ok: false as const, error: "Créditos de IA esgotados." };
      return {
        ok: false as const,
        error: msg ? `Falha ao gerar e-book: ${msg}` : "Falha ao gerar e-book.",
      };
    }
  });
