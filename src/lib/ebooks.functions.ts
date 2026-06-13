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
    if (!key) throw new Error("IA indisponível.");

    const { generateText } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    let titulo = `E-book de ${data.subnicho}`;
    let subtitulo = `${data.nicho} • ${data.subnicho}`;
    let conteudo = "";
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
      conteudo = result.text.trim();
      if (!conteudo) throw new Error("A IA retornou uma resposta vazia.");

      const tituloMatch = conteudo.match(/^\s*T[IÍ]TULO\s*:\s*(.+)$/im);
      const subtituloMatch = conteudo.match(/^\s*SUBT[IÍ]TULO\s*:\s*(.+)$/im);
      if (tituloMatch?.[1]) titulo = tituloMatch[1].trim();
      if (subtituloMatch?.[1]) subtitulo = subtituloMatch[1].trim();
    } catch (err) {
      const msg = (err as Error).message ?? "";
      console.error("[gerarEbook] AI error:", err);
      if (msg.includes("429")) return { ok: false, error: "Limite de requisições. Tente novamente em instantes." };
      if (msg.includes("402")) return { ok: false, error: "Créditos de IA esgotados." };
      return { ok: false, error: msg ? `Falha ao gerar e-book: ${msg}` : "Falha ao gerar e-book." };
    }

    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    const PAGE_W = 595.28, PAGE_H = 841.89, MARGIN = 60;
    const sanitize = (s: string) => s.replace(/[^\x00-\xff]/g, "?");
    const wrap = (text: string, f: typeof font, size: number, maxW: number): string[] => {
      const words = sanitize(text).split(/\s+/);
      const lines: string[] = [];
      let line = "";
      for (const w of words) {
        const test = line ? line + " " + w : w;
        if (f.widthOfTextAtSize(test, size) > maxW) {
          if (line) lines.push(line);
          line = w;
        } else line = test;
      }
      if (line) lines.push(line);
      return lines;
    };

    let page = pdf.addPage([PAGE_W, PAGE_H]);
    let y = PAGE_H - MARGIN;
    const newPage = () => { page = pdf.addPage([PAGE_W, PAGE_H]); y = PAGE_H - MARGIN; };
    const draw = (text: string, f: typeof font, size: number, gap = 4) => {
      const lines = wrap(text, f, size, PAGE_W - MARGIN * 2);
      for (const ln of lines) {
        if (y < MARGIN + size) newPage();
        page.drawText(ln, { x: MARGIN, y, size, font: f, color: rgb(0.1, 0.1, 0.1) });
        y -= size + gap;
      }
    };

    // Cover
    y = PAGE_H / 2 + 60;
    draw(titulo, bold, 28, 10);
    y -= 10;
    draw(subtitulo, font, 16, 6);
    newPage();

    for (const bloco of conteudo.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)) {
      const normalized = bloco.replace(/^T[IÍ]TULO\s*:.+$/im, "").replace(/^SUBT[IÍ]TULO\s*:.+$/im, "").trim();
      if (!normalized) continue;
      const isHeading = /^(INTRODUÇÃO|CONCLUSÃO|CAP[IÍ]TULO\s+\d+)/i.test(normalized);
      if (isHeading && y < 180) newPage();
      draw(normalized, isHeading ? bold : font, isHeading ? 18 : 12, isHeading ? 10 : 6);
      if (!isHeading) y -= 8;
      }

    const bytes = await pdf.save();
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const base64 = btoa(bin);

    return { ok: true, titulo, pdfBase64: base64 };
  });
