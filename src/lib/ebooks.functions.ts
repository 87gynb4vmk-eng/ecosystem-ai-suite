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
  .handler(async ({ data, context }) => {
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

      // Persistir o e-book no banco para a Etapa 3 conseguir carregar
      const { data: row, error } = await context.supabase
        .from("ebooks")
        .insert({
          usuario_id: context.userId,
          nicho: data.nicho,
          subnicho: data.subnicho,
          titulo,
          subtitulo,
          conteudo,
        })
        .select("id")
        .single();

      if (error) {
        console.error("[gerarEbook] DB insert error:", error);
        return { ok: true as const, id: null, titulo, subtitulo, conteudo };
      }

      return { ok: true as const, id: row.id as string, titulo, subtitulo, conteudo };
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

export const obterUltimoEbook = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("ebooks")
      .select("id, nicho, subnicho, titulo, subtitulo, conteudo, affiliate_link, created_at")
      .eq("usuario_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.error("[obterUltimoEbook]", error);
      return { ok: false as const, error: "Falha ao carregar e-book." };
    }
    return { ok: true as const, ebook: data };
  });

const LinkInput = z.object({
  id: z.string().uuid(),
  affiliate_link: z.string().url().max(500).or(z.literal("")),
});

export const atualizarAffiliateLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => LinkInput.parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("ebooks")
      .update({ affiliate_link: data.affiliate_link || null })
      .eq("id", data.id)
      .eq("usuario_id", context.userId);
    if (error) {
      console.error("[atualizarAffiliateLink]", error);
      return { ok: false as const, error: "Falha ao salvar link." };
    }
    return { ok: true as const };
  });

const PubInput = z.object({ id: z.string().uuid() });

export const obterEbookPublico = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => PubInput.parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("ebooks")
      .select("id, nicho, subnicho, titulo, subtitulo, affiliate_link")
      .eq("id", data.id)
      .maybeSingle();
    if (error) {
      console.error("[obterEbookPublico]", error);
      return { ok: false as const, error: "Não encontrado." };
    }
    if (!row) return { ok: false as const, error: "Página não encontrada." };
    return { ok: true as const, ebook: row };
  });
