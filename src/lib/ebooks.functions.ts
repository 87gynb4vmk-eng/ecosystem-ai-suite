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
        prompt: `Crie um e-book COMPLETO, APROFUNDADO e PROFISSIONAL em português brasileiro sobre "${data.subnicho}" dentro do nicho "${data.nicho}".
Use tom profissional, prático, envolvente e didático. Conteúdo extenso e de alto valor, como um produto comercial premium.

REGRAS DE FORMATO (texto simples, SEM JSON, SEM markdown):
TÍTULO: um título comercial curto e impactante
SUBTÍTULO: uma promessa clara do conteúdo

INTRODUÇÃO
4 a 5 parágrafos densos contextualizando tema, problema, oportunidade e o que o leitor vai aprender.

CAPÍTULO 1 — título do capítulo
6 a 8 parágrafos longos com exemplos práticos, dados e dicas acionáveis. Inclua listas com "- " quando útil.

CAPÍTULO 2 — título do capítulo
Mesmo padrão (6 a 8 parágrafos + bullets quando útil).

CAPÍTULO 3 — título do capítulo
Mesmo padrão.

CAPÍTULO 4 — título do capítulo
Mesmo padrão.

CAPÍTULO 5 — título do capítulo
Mesmo padrão.

CAPÍTULO 6 — título do capítulo
Mesmo padrão.

CAPÍTULO 7 — título do capítulo
Mesmo padrão.

CAPÍTULO 8 — título do capítulo
Mesmo padrão.

CONCLUSÃO
4 a 5 parágrafos com síntese, chamada para ação e próximos passos.`,
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
