import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen, Plus, Menu, Home, Layers, Video, User,
  CheckCircle2, Download, ArrowRight, Maximize2, Sparkles,
  ChevronLeft, ChevronRight, X, LayoutGrid, Gift, ChevronDown, LogOut,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Início | Alevi.ai" }] }),
  component: EbookWorkflow,
});

type ScreenState = "dashboard" | "niche_selection" | "result";

function EbookWorkflow() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [currentScreen, setCurrentScreen] = useState<ScreenState>("dashboard");
  const [selectedNiche, setSelectedNiche] = useState<string>("Finanças para Crianças");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const niches = [
    "Emagrecimento", "Finanças", "Relacionamento", "Marketing Digital",
    "Produtividade", "Saúde Mental", "Culinária", "Fitness", "Maternidade",
    "Desenvolvimento Pessoal", "Educação", "Religião", "Empreendedorismo",
    "Gestão de Negócios", "Beleza", "Carreira", "Idiomas", "Musculação",
    "Artesanato", "Casa e Organização", "Espiritualidade", "Pet", "Tecnologia",
    "Air Fryer Gourmet", "Alfabetização em Casa", "Ansiedade Digital",
    "Beleza Natural", "Biohacking", "Escrita Criativa", "Fotografia com Celular",
    "Horta Urbana", "Milhas Aéreas", "Skincare Masculino", "Viagem Low Cost",
    "Investimentos para Iniciantes", "Sono e Bem-estar", "Minimalismo",
    "Crochê Moderno", "Terapias Naturais", "Inteligência Artificial",
    "E-commerce", "Gestão de Tempo", "Autoconhecimento", "Receitas Saudáveis",
    "Jardinagem", "Moda Feminina", "Vendas Online", "Treino em Casa",
    "Planejamento Financeiro", "Marketing para Afiliados", "Estudo para Concursos",
    "Finanças para Crianças", "Dropshipping",
  ];

  const handleGenerateEbook = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentScreen("result");
    }, 2000);
  };

  const handleSignOut = async () => {
    setIsSidebarOpen(false);
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex justify-center items-start font-sans antialiased">
      <div className="w-full max-w-md bg-[#0c0c0e] min-h-screen flex flex-col justify-between shadow-2xl relative border-x border-zinc-800/40 overflow-hidden">

        {isSidebarOpen && (
          <div className="absolute inset-0 z-50 flex">
            <div className="w-[85%] bg-[#0f0f12] h-full border-r border-zinc-900 p-5 flex flex-col justify-between animate-in slide-in-from-left duration-200">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => { setIsSidebarOpen(false); setCurrentScreen("niche_selection"); }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/5"
                >
                  <Plus className="w-4 h-4 text-zinc-950" />
                  <span>Nova Estrutura</span>
                </button>

                <nav className="space-y-1 pt-2">
                  <button onClick={() => { setCurrentScreen("dashboard"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white text-xs font-medium rounded-xl transition hover:bg-zinc-900/30">
                    <LayoutGrid className="w-4 h-4 text-zinc-500" />
                    <span>Dashboard</span>
                  </button>
                  <button onClick={() => { setCurrentScreen("niche_selection"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white text-xs font-medium rounded-xl transition hover:bg-zinc-900/30">
                    <BookOpen className="w-4 h-4 text-zinc-500" />
                    <span>Ebooks</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-3 text-zinc-500 text-xs font-medium rounded-xl opacity-50"><Gift className="w-4 h-4" /><span>Presente</span></button>
                  <button className="w-full flex items-center gap-3 px-3 py-3 text-zinc-500 text-xs font-medium rounded-xl opacity-50"><User className="w-4 h-4" /><span>Perfil</span></button>
                  <div className="pt-4 border-t border-zinc-900 mt-2">
                    <button className="w-full flex items-center justify-between px-3 py-2 text-zinc-500 text-xs font-medium rounded-xl opacity-50">
                      <div className="flex items-center gap-3"><LayoutGrid className="w-4 h-4" /><span>Ferramentas</span></div>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </nav>
              </div>

              <div className="pt-4 border-t border-zinc-900 space-y-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white">F</div>
                  <span className="text-xs font-medium text-zinc-400 truncate max-w-[150px]">Flávia Alessandra Silva Nasci...</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Tema: Ouro e Rolex</span>
                  </div>
                  <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-2 py-2 text-xs text-zinc-500 hover:text-red-400 transition">
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          </div>
        )}

        {currentScreen === "dashboard" && (
          <>
            <div className="p-4 flex justify-between items-center bg-[#0c0c0e] border-b border-zinc-900/60 sticky top-0 z-10">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-zinc-900 rounded-lg transition">
                <Menu className="w-6 h-6 text-zinc-400" />
              </button>
              <BookOpen className="w-6 h-6 text-emerald-500" />
              <button onClick={() => setCurrentScreen("niche_selection")} className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-full transition">
                <Plus className="w-5 h-5 text-amber-400" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Visão Geral</h1>
                <p className="text-xs text-zinc-500 mt-1">Atualizado agora</p>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-zinc-900 rounded-full text-xs font-medium border border-zinc-800">Hoje</button>
                <button className="px-4 py-1.5 text-zinc-500 text-xs font-medium">7 dias</button>
                <button className="px-4 py-1.5 text-zinc-500 text-xs font-medium">30 dias</button>
              </div>

              <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/60 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Você faturou hoje</span>
                  <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium">↗ 0%</span>
                </div>
                <span className="text-3xl font-bold block tracking-tight">R$ 0,00</span>
              </div>
            </div>
          </>
        )}

        {currentScreen === "niche_selection" && (
          <>
            <div className="p-4 bg-[#0c0c0e] border-b border-zinc-900/60 sticky top-0 z-10 space-y-4">
              <div className="flex justify-between items-center">
                <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-zinc-400"><Menu className="w-6 h-6" /></button>
                <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/10"><BookOpen className="w-5 h-5 text-emerald-500" /></div>
                <button onClick={() => setCurrentScreen("dashboard")} className="p-1 text-zinc-400"><Plus className="w-6 h-6" /></button>
              </div>

              <div className="w-full flex justify-between items-center px-4 relative pt-1">
                <div className="absolute top-3.5 left-8 right-8 h-[1px] bg-zinc-900 -z-0" />
                {[
                  { step: 1, name: "E-book" },
                  { step: 2, name: "Produto" },
                  { step: 3, name: "Página" },
                  { step: 4, name: "Vídeos" },
                  { step: 5, name: "Grupos" },
                ].map((item) => (
                  <div key={item.step} className="flex flex-col items-center z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.step === 1 ? "bg-emerald-600 text-white" : "bg-zinc-900 text-zinc-600"
                    }`}>
                      {item.step}
                    </div>
                    <span className={`text-[10px] mt-1 ${item.step === 1 ? "text-emerald-400 font-medium" : "text-zinc-600"}`}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              <div className="text-center space-y-2 pt-2">
                <div className="inline-flex bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl text-emerald-400 mb-1">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Criar E-book</h2>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  Escolha o nicho e o sub-nicho — a IA entrega o e-book pronto
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-300 block pl-1">Selecione um Nicho</label>
                <div className="flex flex-wrap gap-2">
                  {niches.map((niche) => (
                    <button
                      key={niche}
                      onClick={() => setSelectedNiche(niche)}
                      className={`px-3.5 py-2 rounded-xl text-xs transition-all border ${
                        selectedNiche === niche
                          ? "bg-zinc-900 border-amber-500 text-amber-400 font-medium shadow-sm"
                          : "bg-[#0f0f12]/60 text-zinc-400 border-zinc-800/80 hover:border-zinc-700"
                      }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleGenerateEbook}
                  disabled={isGenerating}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 text-zinc-950" />
                      <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                      <span>Gerar E-book com IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {currentScreen === "result" && (
          <>
            <div className="p-4 flex justify-between items-center border-b border-zinc-900/60 bg-[#0c0c0e]">
              <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-zinc-400"><Menu className="w-6 h-6" /></button>
              <div className="bg-emerald-500/10 p-2 rounded-lg"><BookOpen className="w-5 h-5 text-emerald-500" /></div>
              <button onClick={() => setCurrentScreen("niche_selection")} className="p-1 text-amber-500"><Plus className="w-6 h-6" /></button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-5 flex flex-col items-center">
              <div className="bg-emerald-950/40 border border-emerald-500/20 px-4 py-1.5 rounded-full flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>E-book pronto para download</span>
              </div>

              <div className="text-center space-y-1.5 max-w-sm">
                <h2 className="text-lg font-bold tracking-tight leading-snug">
                  {selectedNiche === "Finanças para Crianças"
                    ? "Criem Crianças Empreendedoras em 21 Dias: 5 Steps Certeiros"
                    : `Guia Prático Whitelabel: ${selectedNiche}`}
                </h2>
                <p className="text-xs text-zinc-500">Seu e-book foi gerado com sucesso!</p>
              </div>

              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative border border-zinc-800 bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=600"
                  alt="Capa do Ebook"
                  className="w-full h-full object-cover grayscale-[10%] brightness-75"
                />
                <span className="absolute top-3 right-3 bg-black/70 backdrop-blur px-2 py-1 rounded text-[9px] text-zinc-400">
                  clique para expandir
                </span>
              </div>

              <div className="w-full flex items-center justify-between bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-2 text-xs">
                <div className="flex items-center gap-1">
                  <button className="p-1 text-zinc-600"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-zinc-400 px-1">1 / 9</span>
                  <button className="p-1 text-zinc-400"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <span className="text-[9px] bg-zinc-900 text-amber-400 border border-zinc-800 px-2 py-0.5 rounded uppercase font-semibold">
                  {selectedNiche}
                </span>
                <button className="flex items-center gap-1 text-[10px] text-zinc-400 border border-zinc-800 px-2 py-1 rounded bg-zinc-950/40">
                  <Maximize2 className="w-3 h-3" /> Tela cheia
                </button>
              </div>

              <div className="w-full space-y-2 pt-2">
                <button className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition">
                  <Download className="w-4 h-4 text-zinc-950" />
                  <span>Baixar E-book em PDF</span>
                </button>
                <button
                  onClick={() => setCurrentScreen("dashboard")}
                  className="w-full bg-transparent hover:bg-zinc-900 text-zinc-400 border border-zinc-800 py-3.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition"
                >
                  <span>Continuar para próxima etapa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}

        <div className="bg-[#0c0c0e] border-t border-zinc-900/80 p-2 grid grid-cols-5 text-center sticky bottom-0 z-10">
          <button onClick={() => setCurrentScreen("dashboard")} className={`flex flex-col items-center justify-center py-1 ${currentScreen === "dashboard" ? "text-white" : "text-zinc-600"}`}>
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-medium">Início</span>
          </button>
          <button onClick={() => setCurrentScreen("niche_selection")} className={`flex flex-col items-center justify-center py-1 ${currentScreen === "niche_selection" || currentScreen === "result" ? "text-amber-400" : "text-zinc-600"}`}>
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-medium">Ebooks</span>
          </button>
          <button className="flex flex-col items-center justify-center py-1 text-zinc-600 opacity-40"><Layers className="w-5 h-5 mb-0.5" /><span className="text-[9px] font-medium">Páginas</span></button>
          <button className="flex flex-col items-center justify-center py-1 text-zinc-600 opacity-40"><Video className="w-5 h-5 mb-0.5" /><span className="text-[9px] font-medium">Vídeos</span></button>
          <button className="flex flex-col items-center justify-center py-1 text-zinc-600 opacity-40"><User className="w-5 h-5 mb-0.5" /><span className="text-[9px] font-medium">Perfil</span></button>
        </div>
      </div>
    </div>
  );
}
