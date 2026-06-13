import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({
  nicho: z.string().min(2).max(80),
  subnicho: z.string().min(2).max(80),
});

const EbookSchema = z.object({
  titulo: z.string(),
  subtitulo: z.string(),
  introducao: z.string(),
  capitulos: z.array(z.object({
    titulo: z.string(),
    paragrafos: z.array(z.string()).min(2).max(8),
  })).min(4).max(8),
  conclusao: z.string(),
});

export const gerarEbook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => Input.parse(i))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("IA indisponível.");

    const { generateText, Output } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    let ebook: z.infer<typeof EbookSchema>;
    try {
      const result = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        prompt: `Escreva um e-book completo em português brasileiro sobre o sub-nicho "${data.subnicho}" dentro do nicho "${data.nicho}".
Tom profissional, prático e envolvente. Inclua título marcante, subtítulo, introdução, 5 capítulos com 4-6 parágrafos cada, e uma conclusão.`,
        experimental_output: Output.object({ schema: EbookSchema }),
      });
      ebook = (result as { experimental_output: z.infer<typeof EbookSchema> }).experimental_output;
    } catch (err) {
      const msg = (err as Error).message ?? "";
      if (msg.includes("429")) throw new Error("Limite de requisições. Tente novamente em instantes.");
      if (msg.includes("402")) throw new Error("Créditos de IA esgotados.");
      throw new Error("Falha ao gerar e-book.");
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
    draw(ebook.titulo, bold, 28, 10);
    y -= 10;
    draw(ebook.subtitulo, font, 16, 6);
    newPage();

    draw("Introdução", bold, 20, 12);
    draw(ebook.introducao, font, 12, 6);
    y -= 16;

    for (const cap of ebook.capitulos) {
      if (y < 200) newPage();
      draw(cap.titulo, bold, 18, 10);
      for (const p of cap.paragrafos) {
        draw(p, font, 12, 6);
        y -= 6;
      }
      y -= 12;
    }

    if (y < 200) newPage();
    draw("Conclusão", bold, 20, 12);
    draw(ebook.conclusao, font, 12, 6);

    const bytes = await pdf.save();
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const base64 = btoa(bin);

    return { titulo: ebook.titulo, pdfBase64: base64 };
  });
