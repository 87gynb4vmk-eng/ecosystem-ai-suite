import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({
  nicho: z.string().min(2).max(80),
  subnicho: z.string().min(2).max(80),
});

function getAiGenerationErrorMessage(error: unknown) {
  const details = error as {
    message?: string;
    status?: number;
  };
  const status = details.status;
  const rawMessage = (details.message ?? "").toLowerCase();

  if (status === 401 || status === 403 || rawMessage.includes("api key")) {
    return "Chave da API do Google Gemini inválida ou não configurada. Verifique a variável GEMINI_API_KEY.";
  }
  if (status === 429 || rawMessage.includes("quota") || rawMessage.includes("rate")) {
    return "Limite de requisições da API Gemini atingido. Aguarde alguns instantes e tente novamente.";
  }
  if (status && status >= 500) {
    return "A API do Google Gemini está temporariamente indisponível. Tente novamente em instantes.";
  }
  return details.message
    ? `Falha ao gerar e-book: ${details.message}`
    : "Falha ao gerar e-book. Tente novamente.";
}

const GEMINI_MODEL = "gemini-2.5-flash";

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    let parsedMessage = bodyText;
    try {
      const parsed = JSON.parse(bodyText);
      parsedMessage = parsed?.error?.message ?? bodyText;
    } catch {
      /* ignore */
    }
    const err = new Error(parsedMessage || `Gemini HTTP ${res.status}`) as Error & {
      status?: number;
    };
    err.status = res.status;
    throw err;
  }

  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text =
    json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  return text.trim();
}

export const gerarEbook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => Input.parse(i))
  .handler(async ({ data, context }) => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return {
        ok: false as const,
        error: "GEMINI_API_KEY não configurada no servidor.",
      };
    }

    try {
      const prompt = `Crie um e-book COMPLETO, APROFUNDADO e PROFISSIONAL em português brasileiro sobre "${data.subnicho}" dentro do nicho "${data.nicho}".
Tom profissional, prático, envolvente e didático. Conteúdo extenso e de altíssimo valor, como um produto comercial premium.

REGRAS DE FORMATO (texto simples, SEM JSON, SEM markdown, SEM asteriscos):
TÍTULO: um título comercial curto, atrativo e impactante
SUBTÍTULO: uma promessa clara do conteúdo

INTRODUÇÃO
4 a 5 parágrafos densos contextualizando tema, problema, oportunidade e o que o leitor vai aprender.

Em seguida, escreva NO MÍNIMO 10 CAPÍTULOS detalhados, no formato exato:
CAPÍTULO 1 — título do capítulo
6 a 8 parágrafos longos com exemplos práticos, dados e dicas acionáveis. Inclua listas com "- " quando útil.

CAPÍTULO 2 — título do capítulo
(mesmo padrão)

... e assim por diante até pelo menos CAPÍTULO 10. Cada capítulo deve ter título único e ser profundo e prático.

CONCLUSÃO
4 a 5 parágrafos com síntese e fechamento inspirador.

CHAMADA PARA AÇÃO
2 a 3 parágrafos finais com uma chamada para ação clara, persuasiva e prática, convidando o leitor a aplicar o conteúdo e dar o próximo passo.`;

      const conteudo = await callGemini(key, prompt);
      if (!conteudo) {
        return { ok: false as const, error: "A IA retornou uma resposta vazia." };
      }

      let titulo = `E-book de ${data.subnicho}`;
      let subtitulo = `${data.nicho} • ${data.subnicho}`;
      const tituloMatch = conteudo.match(/^\s*T[IÍ]TULO\s*:\s*(.+)$/im);
      const subtituloMatch = conteudo.match(/^\s*SUBT[IÍ]TULO\s*:\s*(.+)$/im);
      if (tituloMatch?.[1]) titulo = tituloMatch[1].trim();
      if (subtituloMatch?.[1]) subtitulo = subtituloMatch[1].trim();

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
      console.error("[gerarEbook] Gemini error:", err);
      return { ok: false as const, error: getAiGenerationErrorMessage(err) };
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
  .validator((i: unknown) => LinkInput.parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("ebooks")
      .update({ affiliate_link: data.affiliate_link || null, is_published: true })
      .eq("id", data.id)
      .eq("usuario_id", context.userId);
    if (error) {
      console.error("[atualizarAffiliateLink]", error);
      return { ok: false as const, error: "Falha ao salvar link." };
    }
    return { ok: true as const };
  });

export const listarMeusEbooks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("ebooks")
      .select("id, titulo, subtitulo, nicho, subnicho, affiliate_link, is_published, created_at")
      .eq("usuario_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[listarMeusEbooks]", error);
      return { ok: false as const, error: "Falha ao carregar e-books." };
    }
    return { ok: true as const, ebooks: data ?? [] };
  });

export const listarMinhasPaginas = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("ebooks")
      .select("id, titulo, subtitulo, nicho, subnicho, affiliate_link, created_at")
      .eq("usuario_id", context.userId)
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[listarMinhasPaginas]", error);
      return { ok: false as const, error: "Falha ao carregar páginas." };
    }
    return { ok: true as const, paginas: data ?? [] };
  });

const IdInput = z.object({ id: z.string().uuid() });

export const deletarEbook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => IdInput.parse(i))
  .handler(async ({ data, context }) => {
    await context.supabase.from("videos").delete().eq("ebook_id", data.id).eq("usuario_id", context.userId);
    const { error } = await context.supabase
      .from("ebooks")
      .delete()
      .eq("id", data.id)
      .eq("usuario_id", context.userId);
    if (error) {
      console.error("[deletarEbook]", error);
      return { ok: false as const, error: "Falha ao excluir." };
    }
    return { ok: true as const };
  });

export const despublicarEbook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => IdInput.parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("ebooks")
      .update({ is_published: false })
      .eq("id", data.id)
      .eq("usuario_id", context.userId);
    if (error) return { ok: false as const, error: "Falha ao despublicar." };
    return { ok: true as const };
  });

export const obterEbookPorId = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((i: unknown) => IdInput.parse(i))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("ebooks")
      .select("id, nicho, subnicho, titulo, subtitulo, conteudo, affiliate_link, is_published, created_at")
      .eq("id", data.id)
      .eq("usuario_id", context.userId)
      .maybeSingle();
    if (error || !row) return { ok: false as const, error: "E-book não encontrado." };
    return { ok: true as const, ebook: row };
  });

const PubInput = z.object({ id: z.string().uuid() });

export const obterEbookPublico = createServerFn({ method: "GET" })
  .validator((i: unknown) => PubInput.parse(i))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("ebooks")
      .select("id, nicho, subnicho, titulo, subtitulo, affiliate_link")
      .eq("id", data.id)
      .eq("is_published", true)
      .maybeSingle();
    if (error) {
      console.error("[obterEbookPublico]", error);
      return { ok: false as const, error: "Não encontrado." };
    }
    if (!row) return { ok: false as const, error: "Página não encontrada." };
    return { ok: true as const, ebook: row };
  });
