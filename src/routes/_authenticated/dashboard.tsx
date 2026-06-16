import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { gerarVideo, obterVideo, obterUltimoVideoDoEbook, listarMeusVideos, deletarVideo } from "@/lib/videos.functions";
import type { ComponentType } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  gerarEbook,
  obterUltimoEbook,
  obterEbookPorId,
  atualizarAffiliateLink,
  listarMeusEbooks,
  listarMinhasPaginas,
  deletarEbook,
} from "@/lib/ebooks.functions";

import { EbookDocument } from "@/components/EbookDocument";
import { LandingPageTemplate } from "@/components/LandingPageTemplate";
import { Etapa5Grupos } from "@/components/Etapa5Grupos";
import { EbooksList, PaginasList, VideosList } from "@/components/ProjectLists";
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
  Link as LinkIcon,
  Copy,
  ExternalLink,
  LogOut,
  Mail,
  X,
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

type Tab = "inicio" | "ebooks" | "pdfs" | "paginas" | "videos" | "perfil";
type Period = "hoje" | "7d" | "30d";

const STEPS = [
  { id: 1, name: "E-book", icon: BookOpen },
  { id: 2, name: "Produto", icon: CreditCard },
  { id: 3, name: "Página", icon: Layout },
  { id: 4, name: "Vídeos", icon: Video },
  { id: 5, name: "Grupos", icon: Users },
];

const AMBER = "#E0B43A";

function DashboardRoot() {
  const [tab, setTab] = useState<Tab>("inicio");
  const [editingEbookId, setEditingEbookId] = useState<string | "new" | null>(null);
  const [autoDownloadId, setAutoDownloadId] = useState<string | null>(null);

  const openNew = () => {
    setAutoDownloadId(null);
    setEditingEbookId("new");
    setTab("ebooks");
  };
  const openEbook = (id: string) => {
    setAutoDownloadId(null);
    setEditingEbookId(id);
    setTab("ebooks");
  };
  const downloadEbook = (id: string) => {
    setAutoDownloadId(id);
    setEditingEbookId(id);
    setTab("ebooks");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-28">
      {tab === "inicio" && <Overview onNovo={openNew} />}
      {tab === "ebooks" &&
        (editingEbookId ? (
          <EbookFlow
            key={`${editingEbookId}-${autoDownloadId ?? ""}`}
            initialEbookId={editingEbookId === "new" ? null : editingEbookId}
            autoDownload={!!autoDownloadId && autoDownloadId === editingEbookId}
            onBack={() => {
              setEditingEbookId(null);
              setAutoDownloadId(null);
            }}
          />
        ) : (
          <EbooksList onNovo={openNew} onOpen={openEbook} />
        ))}
      {tab === "pdfs" && <PdfsList onNovo={openNew} onOpen={openEbook} onDownload={downloadEbook} />}
      {tab === "paginas" && <PaginasList onNovo={openNew} onOpen={openEbook} />}
      {tab === "videos" && <VideosList onNovo={openNew} onOpen={openEbook} />}
      {tab === "perfil" && <PerfilScreen />}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}



/* -------------------- OVERVIEW -------------------- */
function Overview({ onNovo }: { onNovo: () => void }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [period, setPeriod] = useState<Period>("hoje");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };


  const bars = [
    { label: "Pix", value: 0 },
    { label: "Cartão de Crédito", value: 0 },
    { label: "PicPay", value: 0 },
  ];

  const iconBtn =
    "w-11 h-11 rounded-full border border-zinc-800/80 bg-zinc-900/40 flex items-center justify-center text-zinc-400 hover:text-white transition";

  return (
    <div className="relative max-w-xl md:max-w-6xl mx-auto px-5 md:px-8 pt-6">
      {/* subtle green glow behind title */}
      <div className="pointer-events-none absolute -top-10 left-0 right-0 h-72 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.18),transparent_60%)]" />

      <div className="relative flex items-center justify-between mb-6">
        <button onClick={() => setMenuOpen(true)} className={iconBtn} aria-label="Menu">
          <Menu size={18} />
        </button>
        <button className={iconBtn} aria-label="Documentos">
          <FileIcon size={18} />
        </button>
        <button
          onClick={onNovo}
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
          onClick={onNovo}
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
      <AccountSheet open={menuOpen} onClose={() => setMenuOpen(false)} onSignOut={handleSignOut} />
    </div>
  );
}

/* -------------------- ACCOUNT SHEET / PERFIL -------------------- */
function useUserEmail() {
  return useQuery({
    queryKey: ["auth-user-email"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user?.email ?? "";
    },
    staleTime: 60_000,
  });
}

function AccountSheet({
  open,
  onClose,
  onSignOut,
}: {
  open: boolean;
  onClose: () => void;
  onSignOut: () => void;
}) {
  const { data: email } = useUserEmail();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="relative w-full sm:max-w-sm bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold">Conta</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white" aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 mb-4">
          <Mail size={18} className="text-zinc-400 mt-0.5" />
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1">E-mail</div>
            <div className="text-sm text-white break-all">{email || "Carregando..."}</div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition font-semibold"
        >
          <LogOut size={18} />
          Sair da conta
        </button>
      </div>
    </div>
  );
}

function PerfilScreen() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: email } = useUserEmail();

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="max-w-xl md:max-w-6xl mx-auto px-5 md:px-8 pt-10">
      <h1 className="text-5xl font-bold tracking-tight mb-8">Perfil</h1>
      <div className="flex items-start gap-3 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 mb-4">
        <Mail size={20} className="text-zinc-400 mt-0.5" />
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1">E-mail</div>
          <div className="text-base text-white break-all">{email || "Carregando..."}</div>
        </div>
      </div>
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition font-semibold"
      >
        <LogOut size={18} />
        Sair da conta
      </button>
    </div>
  );
}


/* -------------------- PLACEHOLDER -------------------- */
function Placeholder({ tab }: { tab: Tab }) {
  const labels: Record<Tab, string> = {
    inicio: "Início",
    ebooks: "Ebooks",
    pdfs: "PDFs",
    paginas: "Páginas",
    videos: "Vídeos",
    perfil: "Perfil",
  };
  return (
    <div className="max-w-xl md:max-w-6xl mx-auto px-5 md:px-8 pt-10">
      <h1 className="text-5xl font-bold tracking-tight mb-6">{labels[tab]}</h1>
      <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-3xl">
        Em desenvolvimento...
      </div>
    </div>
  );
}

/* -------------------- PDFS LIST -------------------- */
function PdfsList({
  onNovo,
  onOpen,
  onDownload,
}: {
  onNovo: () => void;
  onOpen: (id: string) => void;
  onDownload: (id: string) => void;
}) {
  const listar = useServerFn(listarMeusEbooks);
  const { data, isLoading } = useQuery({
    queryKey: ["meus-ebooks"],
    queryFn: () => listar(),
  });
  const ebooks = (data?.ok ? data.ebooks : []) as Array<{
    id: string;
    titulo: string;
    subtitulo: string;
    nicho: string;
    subnicho: string;
    created_at: string;
  }>;

  return (
    <div className="max-w-xl md:max-w-6xl mx-auto px-5 md:px-8 pt-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">PDFs</h1>
          <p className="text-zinc-500 text-sm mt-1">E-books por projeto — abra ou baixe o PDF</p>
        </div>
        <button
          onClick={onNovo}
          className="text-sm font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 text-black shrink-0"
          style={{ background: `linear-gradient(135deg, ${AMBER}, #c89725)` }}
        >
          <Plus size={16} strokeWidth={3} /> Novo
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16 text-zinc-500">
          <Loader2 className="animate-spin" />
        </div>
      ) : ebooks.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-3xl">
          <FileText size={28} className="mx-auto text-zinc-600 mb-3" />
          <p className="text-zinc-500 text-sm">Nenhum e-book em PDF ainda.</p>
          <p className="text-zinc-600 text-xs mt-1">Toque em + Novo para criar o primeiro</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ebooks.map((e) => (
            <div
              key={e.id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${AMBER}1A` }}
                >
                  <FileText size={22} style={{ color: AMBER }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{e.titulo}</p>
                  <p className="text-zinc-500 text-xs truncate mt-0.5">
                    {e.nicho} • {e.subnicho}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpen(e.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-sm font-medium text-white transition"
                >
                  <ExternalLink size={16} /> Abrir
                </button>
                <button
                  onClick={() => onDownload(e.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-black transition"
                  style={{ background: `linear-gradient(135deg, ${AMBER}, #c89725)` }}
                >
                  <Download size={16} /> Baixar PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
    { id: "pdfs", label: "PDFs", icon: FileText },
    { id: "paginas", label: "Páginas", icon: Layout },
    { id: "videos", label: "Vídeos", icon: Video },
    { id: "perfil", label: "Perfil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-zinc-900">
      <div className="max-w-xl md:max-w-4xl mx-auto flex justify-around items-end px-2 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
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

/* -------------------- EBOOK 5-STEP FLOW -------------------- */
function EbookFlow({
  initialEbookId = null,
  autoDownload = false,
  onBack,
}: {
  initialEbookId?: string | null;
  autoDownload?: boolean;
  onBack?: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPdfCaptureActive, setIsPdfCaptureActive] = useState(false);
  const [pdfRenderKey, setPdfRenderKey] = useState(0);
  const [generated, setGenerated] = useState<{
    id: string | null;
    titulo: string;
    subtitulo: string;
    conteudo: string;
    filename: string;
  } | null>(null);
  const [price, setPrice] = useState("");
  const [nicho, setNicho] = useState("");
  const [subnicho, setSubnicho] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingLast, setIsLoadingLast] = useState(false);
  const gerar = useServerFn(gerarEbook);
  const obterUltimo = useServerFn(obterUltimoEbook);
  const obterPorId = useServerFn(obterEbookPorId);
  const salvarLink = useServerFn(atualizarAffiliateLink);
  const docRef = useRef<HTMLDivElement>(null);

  const subnichos = useMemo(() => (nicho ? (NICHOS[nicho] ?? []) : []), [nicho]);
  const canGenerate = !!nicho && !!subnicho && !isGenerating;

  // Carrega automaticamente o e-book selecionado (ou o último, quando "Novo")
  useEffect(() => {
    let cancelled = false;
    if (generated) return;
    if (initialEbookId === null) return; // "Novo": começa em branco
    setIsLoadingLast(true);
    const loader = initialEbookId
      ? obterPorId({ data: { id: initialEbookId } })
      : obterUltimo();
    loader
      .then((res) => {
        if (cancelled) return;
        if (res && res.ok && res.ebook) {
          setGenerated({
            id: res.ebook.id,
            titulo: res.ebook.titulo,
            subtitulo: res.ebook.subtitulo,
            conteudo: res.ebook.conteudo,
            filename: `${res.ebook.titulo.replace(/[^a-zA-Z0-9-_ ]/g, "").slice(0, 60) || "Ebook"}.pdf`,
          });
          setNicho(res.ebook.nicho);
          setSubnicho(res.ebook.subnicho);
          setAffiliateLink(res.ebook.affiliate_link ?? "");
          if (res.ebook.affiliate_link || res.ebook.id) {
            setPublishedUrl(
              typeof window !== "undefined"
                ? `${window.location.origin}/view-page/${res.ebook.id}`
                : null,
            );
          }
        }
      })
      .catch((err) => {
        console.error("[load ebook]", err);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingLast(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const handlePublish = async () => {
    if (!generated?.id) {
      toast.error("Gere um e-book antes de criar a página.");
      return;
    }
    setIsPublishing(true);
    try {
      const res = await salvarLink({
        data: { id: generated.id, affiliate_link: affiliateLink.trim() },
      });
      if (!res.ok) throw new Error(res.error);
      const url = `${window.location.origin}/view-page/${generated.id}`;
      setPublishedUrl(url);
      toast.success("Página gerada! Copie e divulgue.");
    } catch (e) {
      toast.error((e as Error).message || "Falha ao gerar página.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopy = async () => {
    if (!publishedUrl) return;
    try {
      await navigator.clipboard.writeText(publishedUrl);
      toast.success("Link copiado!");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };


  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await gerar({ data: { nicho, subnicho } }).catch((err: unknown) => {
        console.error("[gerarEbook] call error:", err);
        throw new Error(
          (err as Error)?.message || "Falha de comunicação com o servidor.",
        );
      });
      if (!res) throw new Error("Resposta vazia do servidor.");
      if (!res.ok) throw new Error(res.error || "Falha ao gerar e-book.");
      const filename = `${res.titulo.replace(/[^a-zA-Z0-9-_ ]/g, "").slice(0, 60) || "Ebook"}.pdf`;
      setGenerated({
        id: res.id,
        titulo: res.titulo,
        subtitulo: res.subtitulo,
        conteudo: res.conteudo,
        filename,
      });
      setPublishedUrl(null);
      setAffiliateLink("");
    } catch (e) {
      console.error("[handleGenerate]", e);
      toast.error((e as Error).message || "Falha ao gerar e-book.");
    } finally {
      setIsGenerating(false);
    }
  };


  const handleDownload = async () => {
    if (!generated || isDownloading) return;
    setIsDownloading(true);
    try {
      const { downloadEbookPdf } = await import("@/lib/ebook-pdf");
      downloadEbookPdf({
        titulo: generated.titulo,
        subtitulo: generated.subtitulo,
        nicho: nicho || "E-book",
        conteudo: generated.conteudo,
        filename: generated.filename,
      });
      toast.success("PDF gerado com sucesso!");
    } catch (e) {
      console.error("[handleDownload]", e);
      toast.error(
        `Ocorreu um erro ao gerar o PDF: ${(e as Error).message || "Falha ao baixar PDF."}`,
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Auto-download quando vier da lista de PDFs
  const autoDownloadFiredRef = useRef(false);
  useEffect(() => {
    if (!autoDownload || autoDownloadFiredRef.current) return;
    if (!generated || isLoadingLast) return;
    autoDownloadFiredRef.current = true;
    setCurrentStep(1);
    void handleDownload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDownload, generated, isLoadingLast]);



  return (
    <div className="max-w-xl md:max-w-6xl mx-auto px-4 md:px-8 pt-6">
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
                <div className="bg-zinc-900 p-4 rounded-2xl flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText style={{ color: AMBER }} className="shrink-0" />
                    <span className="truncate text-sm">{generated.filename}</span>
                  </div>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="px-3 py-2 rounded-lg text-black shrink-0 flex items-center gap-2 text-xs font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: AMBER }}
                    aria-label="Baixar PDF"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Gerando PDF...
                      </>
                    ) : (
                      <Download size={18} />
                    )}
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
              <a
                href="https://kiwify.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-zinc-800 py-4 rounded-xl font-bold text-center"
              >
                Kiwify
              </a>
              <a
                href="https://cakto.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-zinc-800 py-4 rounded-xl font-bold text-center"
              >
                Cakto
              </a>
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

        {currentStep === 3 && (
          <div className="space-y-6">
            {isLoadingLast && !generated ? (
              <div className="bg-[#111] p-8 rounded-3xl border border-zinc-800 text-center text-sm text-zinc-500">
                <Loader2 className="animate-spin mx-auto mb-2" /> Carregando seu último e-book...
              </div>
            ) : !generated ? (
              <div className="bg-[#111] p-8 rounded-3xl border border-zinc-800 text-center">
                <p className="text-sm text-zinc-400 mb-4">
                  Você ainda não gerou um e-book. Volte para a Etapa 1 para começar.
                </p>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-black font-bold px-5 py-3 rounded-xl"
                  style={{ background: AMBER }}
                >
                  Gerar e-book agora
                </button>
              </div>
            ) : (
              <>
                {/* Resumo do e-book carregado */}
                <div className="bg-[#111] p-5 rounded-3xl border border-zinc-800">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                    E-book carregado
                  </span>
                  <h3 className="text-lg font-bold mt-1">{generated.titulo}</h3>
                  <p className="text-sm text-zinc-400 mt-1">{generated.subtitulo}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded"
                      style={{ background: `${AMBER}1a`, color: AMBER }}
                    >
                      {subnicho || nicho}
                    </span>
                  </div>
                </div>

                {/* Link de afiliado + publicação */}
                <div className="bg-[#111] p-6 rounded-3xl border border-zinc-800">
                  <h2 className="text-xl font-bold mb-2">Página de Vendas</h2>
                  <p className="text-sm text-zinc-400 mb-5">
                    Cole o link de pagamento (Kiwify ou Cakto). Ele será injetado automaticamente em
                    todos os botões da página.
                  </p>
                  <label className="text-zinc-400 text-xs uppercase tracking-wider mb-2 block">
                    Link de pagamento
                  </label>
                  <input
                    value={affiliateLink}
                    onChange={(e) => setAffiliateLink(e.target.value)}
                    placeholder="https://pay.kiwify.com.br/seu-link"
                    className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-white mb-4 text-sm"
                  />

                  <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ background: AMBER }}
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Gerando...
                      </>
                    ) : (
                      <>
                        <LinkIcon size={18} /> Gerar Link da Página
                      </>
                    )}
                  </button>

                  {publishedUrl && (
                    <div className="mt-5 p-4 rounded-2xl border border-emerald-600/30 bg-emerald-500/5">
                      <p className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">
                        Sua página está pronta
                      </p>
                      <div className="flex items-center gap-2 bg-black border border-zinc-800 rounded-xl p-3">
                        <span className="text-xs text-zinc-300 truncate flex-1">{publishedUrl}</span>
                        <button
                          onClick={handleCopy}
                          className="shrink-0 p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white"
                          aria-label="Copiar link"
                        >
                          <Copy size={14} />
                        </button>
                        <a
                          href={publishedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white"
                          aria-label="Abrir"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pré-visualização */}
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-3 px-1">
                    Pré-visualização
                  </p>
                  <LandingPageTemplate
                    titulo={generated.titulo}
                    subtitulo={generated.subtitulo}
                    nicho={subnicho || nicho}
                    price={price}
                    affiliateLink={affiliateLink}
                  />
                </div>
              </>
            )}


            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex-1 border border-zinc-800 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Voltar
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="flex-1 text-black py-3 rounded-xl font-bold"
                style={{ background: AMBER }}
              >
                Próxima Etapa
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <Etapa4Video
            ebookId={generated?.id ?? null}
            affiliateLink={affiliateLink}
            onBack={() => setCurrentStep(3)}
            onNext={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 5 && <Etapa5Grupos onBack={() => setCurrentStep(4)} />}

        {currentStep > 5 && (
          <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-3xl">
            Etapa {currentStep} em desenvolvimento...
          </div>
        )}
      </div>

      {/* Printable document rendered off-screen for PDF capture */}
      <div
        className="pointer-events-none"
        style={{
          position: isPdfCaptureActive ? "fixed" : "absolute",
          left: isPdfCaptureActive ? "0" : "-9999px",
          top: "0",
          width: "794px",
          minWidth: "794px",
          maxWidth: "794px",
          opacity: isPdfCaptureActive ? 1 : 0,
          zIndex: -1,
          overflow: "visible",
          background: "#ffffff",
        }}
        aria-hidden="true"
      >
        <EbookDocument
          key={pdfRenderKey}
          ref={docRef}
          titulo={generated?.titulo ?? ""}
          subtitulo={generated?.subtitulo ?? ""}
          nicho={nicho}
          conteudo={generated?.conteudo ?? ""}
        />
      </div>
    </div>
  );
}

/* -------------------- ETAPA 4: VÍDEO (JSON2Video) -------------------- */
function Etapa4Video({
  ebookId,
  affiliateLink,
  onBack,
  onNext,
}: {
  ebookId: string | null;
  affiliateLink: string;
  onBack: () => void;
  onNext: () => void;
}) {
  const gerar = useServerFn(gerarVideo);
  const obter = useServerFn(obterVideo);
  const obterUltimo = useServerFn(obterUltimoVideoDoEbook);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  // Recupera último vídeo do e-book ao montar
  useEffect(() => {
    let cancel = false;
    if (!ebookId || videoId) return;
    obterUltimo({ data: { ebookId } })
      .then((r) => {
        if (cancel) return;
        if (r.ok && r.video) setVideoId(r.video.id);
      })
      .catch(() => {});
    return () => {
      cancel = true;
    };
  }, [ebookId, videoId, obterUltimo]);

  const status = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => obter({ data: { id: videoId! } }),
    enabled: !!videoId,
    refetchInterval: (q) => {
      const d = q.state.data;
      if (!d || !d.ok) return 5000;
      return d.status === "processando" ? 5000 : false;
    },
  });

  async function handleGerar() {
    if (!ebookId) {
      toast.error("Volte para a Etapa 1 e gere um e-book primeiro.");
      return;
    }
    setVideoId(null);
    setIsStarting(true);
    try {
      const r = await gerar({ data: { ebookId, videoLink: affiliateLink || undefined } });
      if (!r.ok) {
        toast.error(r.error);
        return;
      }
      setVideoId(r.id);
      toast.success("Vídeo em processamento...");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao iniciar vídeo");
    } finally {
      setIsStarting(false);
    }
  }

  const data = status.data;
  const currentStatus = data?.ok ? data.status : null;

  return (
    <div className="space-y-6">
      <div className="border border-zinc-800 rounded-3xl p-6 bg-zinc-950/50">
        <div className="flex items-center gap-3 mb-2">
          <Video size={20} style={{ color: AMBER }} />
          <h2 className="text-xl font-bold">Vídeo de vendas</h2>
        </div>
        <p className="text-sm text-zinc-500 mb-6">
          Geramos um vídeo curto (formato vertical 9:16) a partir do seu e-book usando JSON2Video.
          A renderização leva ~1 a 3 minutos.
        </p>

        {!ebookId && (
          <div className="text-center py-10 text-zinc-500">
            Você ainda não gerou um e-book. Volte para a Etapa 1.
          </div>
        )}

        {ebookId && !videoId && (
          <button
            onClick={handleGerar}
            disabled={isStarting}
            className="w-full text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: AMBER }}
          >
            {isStarting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Iniciando...
              </>
            ) : (
              <>
                <Video size={16} /> Gerar vídeo de vendas
              </>
            )}
          </button>
        )}

        {videoId && currentStatus === "processando" && (
          <div className="flex flex-col items-center py-10 gap-3">
            <Loader2 size={32} className="animate-spin" style={{ color: AMBER }} />
            <p className="text-zinc-400">Renderizando seu vídeo... isso leva alguns minutos.</p>
            <p className="text-xs text-zinc-600">Pode deixar essa tela aberta — atualizamos sozinho.</p>
          </div>
        )}

        {videoId && currentStatus === "concluido" && data?.ok && data.videoUrl && (
          <div className="space-y-4">
            <video
              src={data.videoUrl}
              controls
              playsInline
              className="w-full rounded-2xl bg-black aspect-[9/16] max-h-[70vh] mx-auto"
            />
            <div className="flex gap-3">
              <a
                href={data.videoUrl}
                download
                className="flex-1 border border-zinc-800 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2"
              >
                <Download size={16} /> Baixar MP4
              </a>
              <button
                onClick={handleGerar}
                disabled={isStarting}
                className="flex-1 border border-zinc-800 py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {isStarting ? "Iniciando..." : "Gerar outro"}
              </button>
            </div>
          </div>
        )}

        {videoId && currentStatus === "erro" && data?.ok && (
          <div className="space-y-3">
            <div className="text-red-400 text-sm border border-red-900/50 bg-red-950/30 rounded-xl p-3">
              {data.erro ?? "Falha ao renderizar."}
            </div>
            <button
              onClick={handleGerar}
              disabled={isStarting}
              className="w-full text-black py-3 rounded-xl font-bold"
              style={{ background: AMBER }}
            >
              {isStarting ? "Iniciando..." : "Tentar de novo"}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-zinc-800 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <button
          onClick={onNext}
          className="flex-1 text-black py-3 rounded-xl font-bold"
          style={{ background: AMBER }}
        >
          Próxima Etapa
        </button>
      </div>
    </div>
  );
}
