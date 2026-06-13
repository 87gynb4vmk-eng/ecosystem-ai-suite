import { forwardRef, useMemo } from "react";

const AMBER = "#E0B43A";
const GREEN = "#10B981";

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

    if (introM) {
      pushSection({ type: "intro", heading: "Introdução", paragraphs: [] });
    } else if (capM) {
      pushSection({
        type: "chapter",
        number: Number(capM[1]),
        heading: capM[2]?.trim() || `Capítulo ${capM[1]}`,
        paragraphs: [],
      });
    } else if (concM) {
      pushSection({ type: "conclusion", heading: "Conclusão", paragraphs: [] });
    } else if (current) {
      buffer.push(line);
    }
  }
  flushPara();
  if (current) sections.push(current);
  return sections;
}

export type EbookDocumentProps = {
  titulo: string;
  subtitulo: string;
  nicho: string;
  conteudo: string;
};

export const EbookDocument = forwardRef<HTMLDivElement, EbookDocumentProps>(
  ({ titulo, subtitulo, nicho, conteudo }, ref) => {
    const sections = useMemo(() => parseConteudo(conteudo), [conteudo]);
    const chapters = sections.filter((s) => s.type === "chapter");

    const year = new Date().getFullYear();
    const copyright = `© ${year} Alevi.ai — Todos os direitos reservados.`;

    // A4 @ 96dpi ≈ 794 x 1123. Use 794px width.
    const pageStyle: React.CSSProperties = {
      width: "794px",
      minHeight: "1123px",
      padding: "64px 72px",
      boxSizing: "border-box",
      backgroundColor: "#ffffff",
      color: "#111827",
      fontFamily:
        "'Inter', 'Helvetica Neue', Arial, sans-serif",
      position: "relative",
      pageBreakAfter: "always",
      breakAfter: "page",
    };

    const footer = (
      <div
        style={{
          position: "absolute",
          bottom: "28px",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "10px",
          color: "#9ca3af",
          letterSpacing: "0.04em",
        }}
      >
        {copyright}
      </div>
    );

    // TOC pages assumption: cover=1, toc=2, then each section starts on a new page
    let pageCursor = 3;
    const tocEntries = sections.map((s) => {
      const label =
        s.type === "chapter"
          ? `Capítulo ${s.number} — ${s.heading}`
          : s.heading;
      const entry = { label, page: pageCursor };
      pageCursor += 1; // assume 1 page per section (best-effort)
      return entry;
    });

    return (
      <div ref={ref} style={{ background: "#fff" }}>
        {/* COVER */}
        <div
          style={{
            ...pageStyle,
            backgroundColor: "#0a0a0a",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "inline-block",
              alignSelf: "flex-start",
              padding: "8px 16px",
              borderRadius: "999px",
              backgroundColor: `${GREEN}1F`,
              color: GREEN,
              border: `1px solid ${GREEN}66`,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {nicho}
          </div>

          <div style={{ marginTop: "auto" }}>
            <h1
              style={{
                fontSize: "56px",
                lineHeight: 1.05,
                fontWeight: 800,
                margin: 0,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              {titulo}
            </h1>
            <p
              style={{
                marginTop: "24px",
                fontSize: "20px",
                lineHeight: 1.5,
                color: "#9ca3af",
                fontWeight: 400,
              }}
            >
              {subtitulo}
            </p>
            <div
              style={{
                marginTop: "48px",
                height: "4px",
                width: "80px",
                background: GREEN,
                borderRadius: "999px",
              }}
            />
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "#6b7280",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Alevi.ai · E-book Digital
          </div>
        </div>

        {/* TOC */}
        <div style={pageStyle}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 800,
              margin: 0,
              color: "#0a0a0a",
              letterSpacing: "-0.01em",
            }}
          >
            O que você vai aprender
          </h2>
          <div
            style={{
              height: "3px",
              width: "56px",
              background: GREEN,
              borderRadius: "999px",
              marginTop: "16px",
              marginBottom: "40px",
            }}
          />
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {tocEntries.map((e, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "12px",
                  padding: "14px 0",
                  borderBottom: "1px dashed #e5e7eb",
                  fontSize: "16px",
                  color: "#111827",
                }}
              >
                <span style={{ fontWeight: 600, flexShrink: 0 }}>{e.label}</span>
                <span
                  style={{
                    flex: 1,
                    borderBottom: "1px dotted #d1d5db",
                    margin: "0 8px",
                    transform: "translateY(-4px)",
                  }}
                />
                <span style={{ color: GREEN, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {String(e.page).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>
          {footer}
        </div>

        {/* SECTIONS */}
        {sections.map((s, idx) => {
          const isChapter = s.type === "chapter";
          const bannerHue = (idx * 47) % 360;
          return (
            <div key={idx} style={pageStyle}>
              {/* Heading block */}
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  color: "#fff",
                  padding: "28px 32px",
                  borderRadius: "16px",
                }}
              >
                {isChapter && (
                  <div
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: GREEN,
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    Capítulo {s.number}
                  </div>
                )}
                <h2
                  style={{
                    margin: 0,
                    fontSize: "30px",
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.15,
                  }}
                >
                  {s.heading}
                </h2>
              </div>

              {/* Banner */}
              <div
                style={{
                  marginTop: "20px",
                  height: "180px",
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, hsl(${bannerHue} 70% 55%), hsl(${(bannerHue + 60) % 360} 70% 35%))`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(ellipse at top left, rgba(255,255,255,0.25), transparent 60%)",
                  }}
                />
              </div>

              {/* Body */}
              <div style={{ marginTop: "32px" }}>
                {s.paragraphs.map((p, i) => {
                  const isBullet = /^[-*•]\s+/.test(p);
                  const isQuote = /^["“].+["”]$/.test(p) || p.startsWith(">");
                  if (isBullet) {
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: "12px",
                          alignItems: "flex-start",
                          margin: "10px 0",
                          fontSize: "14px",
                          lineHeight: 1.75,
                          color: "#1f2937",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "999px",
                            background: GREEN,
                            marginTop: "9px",
                            flexShrink: 0,
                          }}
                        />
                        <span>{p.replace(/^[-*•]\s+/, "")}</span>
                      </div>
                    );
                  }
                  if (isQuote) {
                    return (
                      <blockquote
                        key={i}
                        style={{
                          margin: "20px 0",
                          padding: "20px 24px",
                          borderLeft: `4px solid ${GREEN}`,
                          background: "#f3f4f6",
                          borderRadius: "8px",
                          fontSize: "15px",
                          fontStyle: "italic",
                          color: "#374151",
                          lineHeight: 1.65,
                        }}
                      >
                        {p.replace(/^>\s*/, "")}
                      </blockquote>
                    );
                  }
                  return (
                    <p
                      key={i}
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.8,
                        color: "#1f2937",
                        margin: "0 0 16px 0",
                        textAlign: "justify",
                      }}
                    >
                      {p}
                    </p>
                  );
                })}
              </div>

              {footer}
            </div>
          );
        })}
      </div>
    );
  },
);
EbookDocument.displayName = "EbookDocument";
