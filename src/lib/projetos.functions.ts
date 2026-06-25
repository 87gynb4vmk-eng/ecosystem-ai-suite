import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const CriarInput = z.object({
  nome_negocio: z.string().trim().min(2).max(120),
  nicho: z.string().trim().min(2).max(120),
  descricao: z.string().trim().min(10).max(2000),
});

const PaginasIaSchema = z.object({
  landing: z.object({
    headline: z.string(),
    subheadline: z.string(),
    cta: z.string(),
    beneficios: z.array(z.string()).min(3).max(6),
  }),
  sobre: z.object({
    titulo: z.string(),
    texto: z.string(),
  }),
  servicos: z
    .array(
      z.object({
        titulo: z.string(),
        descricao: z.string(),
      }),
    )
    .min(3)
    .max(6),
  contato: z.object({
    titulo: z.string(),
    cta: z.string(),
  }),
});

export const garantirPerfil = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("usuarios")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (existing) return { ok: true };
    // Do NOT auto-create a profile here — accounts must come from the paid
    // checkout flow (Cakto webhook) or the admin panel.
    return { ok: false as const, error: "Conta sem plano ativo." };
  });

export const listarProjetos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("projetos")
      .select("id, nome_negocio, nicho, descricao, paginas_ia, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[listarProjetos]", error);
      throw new Error("Não foi possível carregar os projetos. Tente novamente.");
    }
    return { projetos: data ?? [] };
  });

export const gerarEcossistema = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CriarInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Require an existing paid profile — never auto-create a `mensal` account here.
    const { data: perfil } = await supabase
      .from("usuarios")
      .select("id, plano")
      .eq("id", userId)
      .maybeSingle();
    if (!perfil) {
      throw new Error("Conta sem plano ativo. Conclua a compra para liberar o acesso.");
    }



    const lovableKey = process.env.LOVABLE_API_KEY;
    if (!lovableKey) throw new Error("Configuração de IA indisponível.");

    const { generateText, Output } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(lovableKey);

    const prompt = `Você é um copywriter de alto padrão especializado em ecossistemas digitais premium.
Crie o conteúdo completo de um site/ecossistema para o seguinte negócio:

Nome do negócio: ${data.nome_negocio}
Nicho: ${data.nicho}
Descrição: ${data.descricao}

Gere copy persuasivo, sofisticado e em português brasileiro. Headlines diretas, benefícios claros, tom autoridade.`;

    let paginas: z.infer<typeof PaginasIaSchema>;
    try {
      const result = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        prompt,
        experimental_output: Output.object({ schema: PaginasIaSchema }),
      });
      paginas = (result as { experimental_output: z.infer<typeof PaginasIaSchema> })
        .experimental_output;
    } catch (err) {
      const msg = (err as Error).message ?? "";
      if (msg.includes("429"))
        throw new Error("Limite de requisições atingido. Tente novamente em alguns instantes.");
      if (msg.includes("402"))
        throw new Error("Créditos de IA esgotados no workspace. Adicione créditos para continuar.");
      throw new Error("Falha ao gerar conteúdo com IA. Tente novamente.");
    }

    const { data: inserted, error: insertErr } = await supabase
      .from("projetos")
      .insert({
        usuario_id: userId,
        nome_negocio: data.nome_negocio,
        nicho: data.nicho,
        descricao: data.descricao,
        paginas_ia: paginas,
      })
      .select("id, nome_negocio, nicho, descricao, paginas_ia, created_at")
      .single();
    if (insertErr) throw new Error(insertErr.message);

    return { projeto: inserted };
  });
