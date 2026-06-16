import jsPDF from "jspdf";

type Section = {
  type: "intro" | "chapter" | "conclusion";
  number?: number;
  heading: string;
  paragraphs: string[];
};

function parseConteudo(conteudo: string): Section[] {
  const cleaned = conteudo
    .replace(/^\s*T[IÍ]TULO\s*:.+$/im, "")
    .replace(/^\s*SUBT[IÍ]TULO\s*:.+$/im, "")
    .trim();
  const lines = cleaned.split(/\n/);
  const sections: Section[] = [];
  let current: Section | null = null;
  let buffer: string[] = [];
  const flushPara = () => {
    if (!current) return;
    const text = buffer.join(" ").trim();
    if (text) current.paragraphs.push(text);
    buffer = [];
  };
  const pushSection = (s: Section) => {
    flushPara();
    if (current) sections.push(current);
    current = s;
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      continue;
    }
    const introM = /^INTRODU[ÇC][ÃA]O\b\s*[-—:]?\s*(.*)$/i.exec(line);
    const capM = /^CAP[IÍ]TULO\s+(\d+)\s*[-—:]?\s*(.*)$/i.exec(line);
    const concM = /^CONCLUS[ÃA]O\b\s*[-—:]?\s*(.*)$/i.exec(line);
    if (introM) pushSection({ type: "intro", heading: "Introdução", paragraphs: [] });
    else if (capM)
      pushSection({
        type: "chapter",
        number: Number(capM[1]),
        heading: capM[2]?.trim() || `Capítulo ${capM[1]}`,
        paragraphs: [],
      });
    else if (concM) pushSection({ type: "conclusion", heading: "Conclusão", paragraphs: [] });
    else if (current) buffer.push(line);
  }
  flushPara();
  if (current) sections.push(current);
  return sections;
}

export type EbookPdfInput = {
  titulo: string;
  subtitulo: string;
  nicho: string;
  conteudo: string;
  filename?: string;
};

export function buildEbookPdf({ titulo, subtitulo, nicho, conteudo }: EbookPdfInput): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const PW = doc.internal.pageSize.getWidth(); // 595
  const PH = doc.internal.pageSize.getHeight(); // 842
  const M = 56; // margin
  const CW = PW - M * 2; // content width
  const GREEN: [number, number, number] = [16, 185, 129];
  const DARK: [number, number, number] = [10, 10, 10];
  const TEXT: [number, number, number] = [31, 41, 55];
  const MUTED: [number, number, number] = [156, 163, 175];
  const year = new Date().getFullYear();

  const footer = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`© ${year} Alevi.ai — Todos os direitos reservados.`, PW / 2, PH - 24, {
      align: "center",
    });
  };

  // ---------- COVER ----------
  doc.setFillColor(...DARK);
  doc.rect(0, 0, PW, PH, "F");
  // Green accent bar
  doc.setFillColor(...GREEN);
  doc.rect(M, PH / 2 + 40, 60, 4, "F");
  // Niche pill
  doc.setFillColor(209, 250, 229);
  const pillText = (nicho || "E-book").toUpperCase();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const pillW = doc.getTextWidth(pillText) + 24;
  doc.roundedRect(M, M, pillW, 22, 11, 11, "F");
  doc.setTextColor(...GREEN);
  doc.text(pillText, M + 12, M + 15);

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  const titleLines = doc.splitTextToSize(titulo, CW);
  doc.text(titleLines, M, PH / 2 - 20);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(229, 231, 235);
  const subLines = doc.splitTextToSize(subtitulo, CW);
  doc.text(subLines, M, PH / 2 + 20);

  // Brand
  doc.setFontSize(9);
  doc.setTextColor(212, 212, 216);
  doc.text("ALEVI.AI · E-BOOK DIGITAL", M, PH - 40);

  const sections = parseConteudo(conteudo);

  // ---------- TOC ----------
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, PW, PH, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...DARK);
  doc.text("O que você vai aprender", M, M + 20);
  doc.setFillColor(...GREEN);
  doc.rect(M, M + 32, 48, 3, "F");

  let tocY = M + 70;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...TEXT);
  // page numbers: cover=1, toc=2, sections start at 3
  sections.forEach((s, i) => {
    const label =
      s.type === "chapter" ? `Capítulo ${s.number} — ${s.heading}` : s.heading;
    const pageNum = String(3 + i).padStart(2, "0");
    const labelLines = doc.splitTextToSize(label, CW - 40);
    doc.setTextColor(...TEXT);
    doc.text(labelLines, M, tocY);
    doc.setTextColor(...GREEN);
    doc.setFont("helvetica", "bold");
    doc.text(pageNum, PW - M, tocY, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setDrawColor(229, 231, 235);
    doc.setLineDashPattern([1, 2], 0);
    doc.line(M, tocY + 6, PW - M, tocY + 6);
    doc.setLineDashPattern([], 0);
    tocY += Math.max(20, labelLines.length * 16) + 8;
    if (tocY > PH - 80) {
      footer();
      doc.addPage();
      tocY = M;
    }
  });
  footer();

  // ---------- SECTIONS ----------
  for (const s of sections) {
    doc.addPage();
    // Heading block
    const headerH = 70;
    doc.setFillColor(...DARK);
    doc.roundedRect(M, M, CW, headerH, 10, 10, "F");
    if (s.type === "chapter") {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...GREEN);
      doc.text(`CAPÍTULO ${s.number}`, M + 20, M + 24);
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    const headLines = doc.splitTextToSize(s.heading, CW - 40);
    doc.text(headLines, M + 20, M + (s.type === "chapter" ? 48 : 40));

    // Body
    let y = M + headerH + 30;
    const lineHeight = 16;
    const paraGap = 10;
    const writeLine = (text: string, opts?: { bullet?: boolean; quote?: boolean }) => {
      const indent = opts?.bullet || opts?.quote ? 20 : 0;
      const width = CW - indent - (opts?.quote ? 16 : 0);
      const wrapped = doc.splitTextToSize(text, width);
      const blockH = wrapped.length * lineHeight;
      if (y + blockH > PH - 60) {
        footer();
        doc.addPage();
        y = M;
      }
      if (opts?.bullet) {
        doc.setFillColor(...GREEN);
        doc.circle(M + 6, y - 4, 2.5, "F");
      }
      if (opts?.quote) {
        doc.setFillColor(243, 244, 246);
        doc.rect(M, y - lineHeight + 2, CW, blockH + 10, "F");
        doc.setFillColor(...GREEN);
        doc.rect(M, y - lineHeight + 2, 3, blockH + 10, "F");
      }
      doc.setTextColor(...TEXT);
      doc.setFont("helvetica", opts?.quote ? "italic" : "normal");
      doc.setFontSize(11);
      doc.text(wrapped, M + indent + (opts?.quote ? 12 : 0), y);
      y += blockH + (opts?.quote ? 14 : paraGap);
    };

    for (const p of s.paragraphs) {
      const bullet = /^[-*•]\s+/.test(p);
      const quote = /^["“].+["”]$/.test(p) || p.startsWith(">");
      const text = bullet ? p.replace(/^[-*•]\s+/, "") : quote ? p.replace(/^>\s*/, "") : p;
      writeLine(text, { bullet, quote });
    }
    footer();
  }

  return doc;
}

export function downloadEbookPdf(input: EbookPdfInput) {
  const doc = buildEbookPdf(input);
  const filename =
    input.filename ||
    `${(input.titulo || "ebook").replace(/[^a-zA-Z0-9-_ ]/g, "").slice(0, 60) || "ebook"}.pdf`;

  // jsPDF.save() handles cross-browser (incl. iOS Safari) download/open correctly.
  doc.save(filename);
}
