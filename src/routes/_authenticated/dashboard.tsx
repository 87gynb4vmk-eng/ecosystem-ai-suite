import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { ComponentType } from "react";
import { useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { gerarEbook } from "@/lib/ebooks.functions";
import { EbookDocument } from "@/components/EbookDocument";
import { toast } from "sonner";
import {
  BookOpen,
  CreditCard,
  Layout,
  Video,
  Users,
  FileText,
  Loader2,
  Download,
  ArrowRight,
  ArrowLeft,
  Home,
  User,
  Plus,
  TrendingUp,
  Menu,
  FileText as FileIcon,
  Gift,
} from "lucide-react";

const NICHOS: Record<string, string[]> = {
  Emagrecimento: ["Receitas Saudáveis", "Treino em Casa", "Biohacking", "Sono e Bem-estar"],
  Finanças: [
    "Investimentos para Iniciantes",
    "Planejamento Financeiro",
    "Milhas Aéreas",
    "Finanças para Crianças",
  ],
  "Marketing Digital": ["Vendas Online", "Marketing para Afiliados", "Dropshipping", "E-commerce"],
  "Saúde Mental": ["Ansiedade Digital", "Autoconhecimento", "Terapias Naturais"],
  "Desenvolvimento Pessoal": [
    "Produtividade",
    "Gestão de Tempo",
    "Carreira",
    "Estudo para Concursos",
  ],
  Beleza: ["Beleza Natural", "Skincare Masculino", "Moda Feminina"],
  "Casa e Estilo": [
    "Air Fryer Gourmet",
    "Horta Urbana",
    "Jardinagem",
    "Casa e Organização",
    "Crochê Moderno",
    "Pet",
  ],
  "Educação e Idiomas": ["Alfabetização em Casa", "Idiomas"],
  Outros: [
    "Relacionamento",
    "Religião",
    "Empreendedorismo",
    "Gestão de Negócios",
    "Artesanato",
    "Espiritualidade",
    "Tecnologia",
    "Escrita",
    "Fotografia com Celular",
    "Viagem Low Cost",
    "Fitness",
    "Musculação",
  ],
};

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Início | Alevi.ai" }] }),
  component: DashboardRoot,
});

type Tab = "inicio" | "ebooks" | "paginas" | "videos" | "perfil";
type Period = "hoje" | "7d" | "30d";

const STEPS = [
  { id: 1, name: "E-book", icon: BookOpen },
  { id: 2, name: "Produto", icon: CreditCard },
  { id: 3, name: "Página", icon: Layout },
  { id: 4, name: "Vídeos", icon: Video },
  { id: 5, name: "Grupos", icon: Users },
];

const AMBER = "#E0B43A";

function createPdfSafeClone(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("style, link[rel='stylesheet']").forEach((node) => node.remove());
  const safeColor = "#111827";
  const safeBorder = "#e5e7eb";
  const targets = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))];
  for (const el of targets) {
    el.removeAttribute("class");
    el.style.color ||= safeColor;
    el.style.borderColor ||= safeBorder;
    el.style.outlineColor = safeBorder;
    el.style.textDecorationColor = safeColor;
    el.style.boxShadow = "none";
    el.style.caretColor = safeColor;
  }
  return clone;
}

function DashboardRoot() {
  const [tab, setTab] = useState<Tab>("inicio");

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-28">
      {tab === "inicio" && <Overview />}
      {tab === "ebooks" && <EbookFlow />}
      {tab !== "inicio" && tab !== "ebooks" && <Placeholder tab={tab} />}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

/* -------------------- OVERVIEW -------------------- */
function Overview() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [period, setPeriod] = useState<Period>("hoje");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    qc.cancelQueries();
    qc.clear();
    navigate({ to: "/auth" });
  };

  const bars = [
    { label: "Pix", value: 0 },
    { label: "Cartão de Crédito", value: 0 },
    { label: "PicPay", value: 0 },
  ];

  const iconBtn =
    "w-11 h-11 rounded-full border border-zinc-800/80 bg-zinc-900/40 flex items-center justify-center text-zinc-400 hover:text-white transition";

  return (
    <div className="relative max-w-xl mx-auto px-5 pt-6">
      {/* subtle green glow behind title */}
      <div className="pointer-events-none absolute -top-10 left-0 right-0 h-72 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.18),transparent_60%)]" />

      <div className="relative flex items-center justify-between mb-6">
        <button onClick={handleSignOut} className={iconBtn} aria-label="Menu">
          <Menu size={18} />
        </button>
        <button className={iconBtn} aria-label="Documentos">
          <FileIcon size={18} />
        </button>
        <button
          className="w-11 h-11 rounded-full border flex items-center justify-center"
          style={{ borderColor: AMBER, color: AMBER, boxShadow: `0 0 0 4px ${AMBER}10` }}
          aria-label="Novo"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative mb-6">
        <h1 className="text-5xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-zinc-500 text-sm mt-2">Atualizado agora</p>
      </div>

      {/* period filters + Novo */}
      <div className="relative flex items-center gap-2 mb-6 flex-wrap">
        {(
          [
            ["hoje", "Hoje"],
            ["7d", "7 dias"],
            ["30d", "30 dias"],
          ] as [Period, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setPeriod(id)}
            className={`text-sm font-medium px-5 py-2.5 rounded-full border transition ${
              period === id
                ? "bg-black border-zinc-700 text-white"
                : "bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          className="ml-auto text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-1.5 text-black"
          style={{ background: `linear-gradient(135deg, ${AMBER}, #c89725)` }}
        >
          <Plus size={16} strokeWidth={3} /> Novo
        </button>
      </div>

      {/* Bonus banner */}
      <div
        className="relative rounded-2xl p-4 mb-6 flex items-center gap-3"
        style={{
          background: `${AMBER}0D`,
          border: `1px solid ${AMBER}40`,
        }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${AMBER}1A` }}
        >
          <Gift size={20} style={{ color: AMBER }} />
        </div>
        <p className="text-sm leading-snug">
          <span className="font-bold" style={{ color: AMBER }}>
            Bônus disponível em 6 dias
          </span>
          <span className="text-zinc-400"> • Continue usando a plataforma para desbloquear</span>
        </p>
      </div>

      {/* Faturamento card */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-br from-[#0d1410] to-[#0a0a0a] border border-zinc-800/80 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-10 h-60 w-60 bg-[radial-gradient(circle,rgba(16,185,129,0.18),transparent_70%)]" />

        <div className="relative flex items-center justify-between mb-3">
          <span className="text-[11px] tracking-[0.18em] text-zinc-500 font-semibold">
            VOCÊ FATUROU HOJE
          </span>
          <span className="flex items-center gap-1 text-zinc-400 text-xs font-semibold border border-zinc-800 px-2.5 py-1 rounded-full">
            <TrendingUp size={12} /> 0%
          </span>
        </div>

        <div className="relative text-5xl font-bold tracking-tight mb-5">R$ 0,00</div>

        <div className="relative flex items-center justify-between text-xs text-zinc-500 mb-5">
          <span>0 vendas aprovadas</span>
          <span className="text-zinc-700">•</span>
          <span>Ticket médio R$ 0,00</span>
        </div>

        <div className="relative flex items-center justify-end gap-1.5 text-xs text-zinc-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Sistema ativo
        </div>

        <div className="relative space-y-4">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">{b.label}</span>
                <span className="text-zinc-400 tabular-nums">{b.value}%</span>
              </div>
              <div className="h-[3px] bg-zinc-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${b.value}%`, background: AMBER }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------- PLACEHOLDER -------------------- */
function Placeholder({ tab }: { tab: Tab }) {
  const labels: Record<Tab, string> = {
    inicio: "Início",
    ebooks: "Ebooks",
    paginas: "Páginas",
    videos: "Vídeos",
    perfil: "Perfil",
  };
  return (
    <div className="max-w-xl mx-auto px-5 pt-10">
      <h1 className="text-5xl font-bold tracking-tight mb-6">{labels[tab]}</h1>
      <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-3xl">
        Em desenvolvimento...
      </div>
    </div>
  );
}

/* -------------------- BOTTOM NAV -------------------- */
function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: {
    id: Tab;
    label: string;
    icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  }[] = [
    { id: "inicio", label: "Início", icon: Home },
    { id: "ebooks", label: "Ebooks", icon: BookOpen },
    { id: "paginas", label: "Páginas", icon: Layout },
    { id: "videos", label: "Vídeos", icon: Video },
    { id: "perfil", label: "Perfil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-zinc-900">
      <div className="max-w-xl mx-auto flex justify-around items-end px-2 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {items.map((it) => {
          const Icon = it.icon;
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className="flex flex-col items-center gap-1 px-2 transition-all"
              style={{ color: active ? AMBER : "#71717a" }}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span className="text-[11px] font-semibold tracking-wide">{it.label}</span>
              <span
                className="h-[2px] w-6 rounded-full mt-0.5"
                style={{ background: active ? AMBER : "transparent" }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* -------------------- EBOOK 5-STEP FLOW (unchanged) -------------------- */
function EbookFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<{
    titulo: string;
    subtitulo: string;
    conteudo: string;
    filename: string;
  } | null>(null);
  const [price, setPrice] = useState("");
  const [nicho, setNicho] = useState("");
  const [subnicho, setSubnicho] = useState("");
  const gerar = useServerFn(gerarEbook);
  const docRef = useRef<HTMLDivElement>(null);

  const subnichos = useMemo(() => (nicho ? (NICHOS[nicho] ?? []) : []), [nicho]);
  const canGenerate = !!nicho && !!subnicho && !isGenerating;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await gerar({ data: { nicho, subnicho } });
      if (!res.ok) throw new Error(res.error);
      const filename = `${res.titulo.replace(/[^a-zA-Z0-9-_ ]/g, "").slice(0, 60) || "Ebook"}.pdf`;
      setGenerated({
        titulo: res.titulo,
        subtitulo: res.subtitulo,
        conteudo: res.conteudo,
        filename,
      });
    } catch (e) {
      toast.error((e as Error).message || "Falha ao gerar e-book.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generated || !docRef.current) return;
    try {
      const html2pdf = ((await import("html2pdf.js")) as { default: unknown }).default as (
        ...args: unknown[]
      ) => {
        set: (opts: Record<string, unknown>) => {
          from: (el: HTMLElement) => { save: () => Promise<void> };
        };
      };
      const pdfElement = createPdfSafeClone(docRef.current);
      pdfElement.style.position = "fixed";
      pdfElement.style.left = "0";
      pdfElement.style.top = "0";
      pdfElement.style.zIndex = "-1";
      pdfElement.style.opacity = "1";
      pdfElement.style.pointerEvents = "none";
      pdfElement.style.background = "#ffffff";
      document.body.appendChild(pdfElement);

      try {
        await html2pdf()
          .set({
            margin: 0,
            filename: generated.filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              backgroundColor: "#ffffff",
              onclone: (doc: Document) => {
                doc
                  .querySelectorAll("style, link[rel='stylesheet']")
                  .forEach((node) => node.remove());
                doc.documentElement.style.background = "#ffffff";
                doc.body.style.background = "#ffffff";
                doc.body.style.color = "#111827";
              },
            },
            jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
            pagebreak: { mode: ["css", "legacy"] },
          })
          .from(pdfElement)
          .save();
      } finally {
        pdfElement.remove();
      }
    } catch (e) {
      toast.error(
        `Ocorreu um erro ao gerar o PDF: ${(e as Error).message || "Falha ao baixar PDF."}`,
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 pt-6">
      <div className="flex justify-between items-center mb-8 bg-[#111] p-3 rounded-2xl border border-zinc-800">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                currentStep === step.id ? "bg-zinc-900" : "text-zinc-600 hover:text-zinc-400"
              }`}
              style={{ color: currentStep === step.id ? AMBER : undefined }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] uppercase font-bold">{step.name}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-6 animate-in fade-in duration-500">
        {currentStep === 1 && (
          <div className="bg-[#111] p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">Gerar E-book</h2>

            <label className="text-zinc-400 text-xs uppercase tracking-wider mb-2 block">
              Nicho principal
            </label>
            <select
              value={nicho}
              onChange={(e) => {
                setNicho(e.target.value);
                setSubnicho("");
              }}
              className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-white mb-5"
            >
              <option value="">Selecione um nicho...</option>
              {Object.keys(NICHOS).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <label className="text-zinc-400 text-xs uppercase tracking-wider mb-2 block">
              Sub-nicho
            </label>
            <select
              value={subnicho}
              onChange={(e) => setSubnicho(e.target.value)}
              disabled={!nicho}
              className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-white mb-6 disabled:opacity-40"
            >
              <option value="">
                {nicho ? "Selecione um sub-nicho..." : "Escolha o nicho primeiro"}
              </option>
              {subnichos.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: AMBER }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Gerando...
                </>
              ) : (
                "Gerar Conteúdo"
              )}
            </button>

            {generated && (
              <div className="mt-6 border-t border-zinc-800 pt-6">
                <div className="bg-zinc-900 p-4 rounded-2xl flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText style={{ color: AMBER }} className="shrink-0" />
                    <span className="truncate text-sm">{generated.filename}</span>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg text-black shrink-0"
                    style={{ background: AMBER }}
                    aria-label="Baixar PDF"
                  >
                    <Download size={18} />
                  </button>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-zinc-800 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  Continuar para próxima etapa <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-[#111] p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-xl font-bold mb-6">Cadastro na Plataforma de Vendas</h2>
            <div
              className="p-4 rounded-xl mb-6"
              style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}40` }}
            >
              <p className="text-sm font-bold flex items-center gap-2" style={{ color: AMBER }}>
                <FileText size={16} /> E-book gerado com sucesso!
              </p>
            </div>
            <label className="text-zinc-400 text-sm mb-2 block">PREÇO DO PRODUTO (R$)</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 29,90"
              className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-white mb-6"
            />
            <div className="flex gap-4">
              <button className="flex-1 bg-zinc-800 py-4 rounded-xl font-bold">Kiwify</button>
              <button className="flex-1 bg-zinc-800 py-4 rounded-xl font-bold">Cakto</button>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 border border-zinc-800 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Voltar
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex-1 text-black py-3 rounded-xl font-bold"
                style={{ background: AMBER }}
              >
                Próxima Etapa
              </button>
            </div>
          </div>
        )}

        {currentStep > 2 && (
          <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-3xl">
            Etapa {currentStep} em desenvolvimento...
          </div>
        )}
      </div>

      {/* Hidden printable document */}
      {generated && (
        <div
          style={{
            position: "fixed",
            left: "-10000px",
            top: 0,
            zIndex: -1,
            pointerEvents: "none",
            opacity: 0,
          }}
          aria-hidden
        >
          <EbookDocument
            ref={docRef}
            titulo={generated.titulo}
            subtitulo={generated.subtitulo}
            nicho={nicho}
            conteudo={generated.conteudo}
          />
        </div>
      )}
    </div>
  );
}
