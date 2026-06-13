import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen, CreditCard, Layout, Video, Users, FileText,
  Loader2, Download, ArrowRight, ArrowLeft, LogOut,
  Home, User, Plus, TrendingUp, Activity,
} from "lucide-react";

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

function DashboardRoot() {
  const [tab, setTab] = useState<Tab>("inicio");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans pb-24">
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
    { label: "Pix", value: 62, color: "bg-emerald-500" },
    { label: "Cartão de Crédito", value: 28, color: "bg-sky-500" },
    { label: "PicPay", value: 10, color: "bg-violet-500" },
  ];

  return (
    <div className="max-w-xl mx-auto px-5 pt-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Visão Geral</h1>
          <p className="text-zinc-500 text-sm mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Atualizado agora
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="text-zinc-500 hover:text-white p-2"
          aria-label="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="flex bg-[#111] border border-zinc-800 rounded-full p-1 flex-1">
          {([
            ["hoje", "Hoje"],
            ["7d", "7 dias"],
            ["30d", "30 dias"],
          ] as [Period, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setPeriod(id)}
              className={`flex-1 text-xs font-semibold py-2 rounded-full transition-all ${
                period === id
                  ? "bg-white text-black"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm py-2.5 px-4 rounded-full flex items-center gap-1">
          <Plus size={16} strokeWidth={3} /> Novo
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#141414] to-[#0d0d0d] border border-zinc-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] tracking-[0.2em] text-zinc-500 font-bold">
            VOCÊ FATUROU HOJE
          </span>
          <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
            <TrendingUp size={12} /> +18,4%
          </span>
        </div>

        <div className="flex items-end gap-2 mb-4">
          <span className="text-5xl font-bold tracking-tight">R$ 2.847</span>
          <span className="text-zinc-500 text-lg mb-1.5">,90</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-6 pb-6 border-b border-zinc-800/80">
          <Activity size={14} className="text-emerald-400" />
          <span className="text-emerald-400 font-semibold">Sistema ativo</span>
          <span className="text-zinc-600">·</span>
          <span>34 vendas processadas</span>
        </div>

        <div className="space-y-4">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-zinc-400 font-medium">{b.label}</span>
                <span className="text-zinc-300 font-bold tabular-nums">
                  {b.value}%
                </span>
              </div>
              <div className="h-2 bg-zinc-800/80 rounded-full overflow-hidden">
                <div
                  className={`h-full ${b.color} rounded-full transition-all duration-700`}
                  style={{ width: `${b.value}%` }}
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
    <div className="max-w-xl mx-auto px-5 pt-8">
      <h1 className="text-4xl font-bold tracking-tight mb-6">{labels[tab]}</h1>
      <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-3xl">
        Em desenvolvimento...
      </div>
    </div>
  );
}

/* -------------------- BOTTOM NAV -------------------- */
function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: "inicio", label: "Início", icon: Home },
    { id: "ebooks", label: "Ebooks", icon: BookOpen },
    { id: "paginas", label: "Páginas", icon: Layout },
    { id: "videos", label: "Vídeos", icon: Video },
    { id: "perfil", label: "Perfil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#111]/95 backdrop-blur-xl border-t border-zinc-800">
      <div className="max-w-xl mx-auto flex justify-around items-center px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {items.map((it) => {
          const Icon = it.icon;
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                active ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon size={20} className={active ? "scale-110" : ""} />
              <span className="text-[10px] font-bold tracking-wide">
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* -------------------- EBOOK 5-STEP FLOW -------------------- */
function EbookFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [price, setPrice] = useState("");

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
                currentStep === step.id
                  ? "text-emerald-400 bg-emerald-950/20"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
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
            <h2 className="text-2xl font-bold mb-2">Gerar E-book</h2>
            <input
              placeholder="Ex: Emagrecimento..."
              className="w-full bg-black border border-zinc-700 p-4 rounded-xl text-white mb-4"
            />
            <button
              onClick={() => {
                setIsGenerating(true);
                setTimeout(() => {
                  setIsGenerating(false);
                  setGenerated(true);
                }, 1500);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : "Gerar Conteúdo"}
            </button>

            {generated && (
              <div className="mt-6 border-t border-zinc-800 pt-6">
                <div className="bg-zinc-900 p-4 rounded-2xl flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="text-emerald-500" />
                    <span>Ebook_Final.pdf</span>
                  </div>
                  <button className="bg-emerald-500 p-2 rounded-lg text-black">
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
            <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl mb-6">
              <p className="text-emerald-400 text-sm font-bold flex items-center gap-2">
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
                className="flex-1 bg-emerald-500 text-black py-3 rounded-xl font-bold"
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
    </div>
  );
}
