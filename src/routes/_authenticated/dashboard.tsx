import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen, Plus, Menu, Home, Layers, Video, User,
  CheckCircle2, Download, ArrowRight, Maximize2, Sparkles,
  ChevronLeft, ChevronRight, X, LayoutGrid, Gift, LogOut,
  FileText, ArrowUpRight,
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
    <div className="min-h-screen bg-black text-white flex justify-center items-start font-sans antialiased selection:bg-[#e2b35c]/30">
      <div className="w-full max-w-md bg-black min-h-screen flex flex-col justify-between shadow-2xl relative border-x border-zinc-900 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-emerald-950/20 rounded-full blur-[120px] pointer-events-none z-0" />

        {isSidebarOpen && (
          <div className="absolute inset-0 z-50 flex">
            <div className="w-[85%] bg-[#09090b] h-full border-r border-zinc-900 p-5 flex flex-col justify-between z-10">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="border border-zinc-800 bg-[#0d0d0f] p-2 rounded-xl">
                    <BookOpen className="w-5 h-5 text-[#e2b35c]" />
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 hover:bg-zinc-950 rounded-lg text-zinc-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => { setIsSidebarOpen(false); setCurrentScreen("niche_selection"); }}
                  className="w-full bg-[#e2b35c] hover:bg-[#d0a34c] text-black font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>Nova Estrutura</span>
                </button>
                <nav className="space-y-1 pt-2">
                  <button onClick={() => { setCurrentScreen("dashboard"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white text-xs font-medium rounded-xl transition hover:bg-zinc-900/40">
                    <LayoutGrid className="w-4 h-4 text-zinc-600" />
                    <span>Dashboard</span>
                  </button>
                  <button onClick={() => { setCurrentScreen("niche_selection"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white text-xs font-medium rounded-xl transition hover:bg-zinc-900/40">
                    <BookOpen className="w-4 h-4 text-zinc-600" />
                    <span>Ebooks</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-3 text-zinc-600 text-xs font-medium rounded-xl opacity-40"><Gift className="w-4 h-4" /><span>Presente</span></button>
                  <button className="w-full flex items-center gap-3 px-3 py-3 text-zinc-600 text-xs font-medium rounded-xl opacity-40"><User className="w-4 h-4" /><span>Perfil</span></button>
                </nav>
              </div>
              <div className="pt-4 border-t border-zinc-900">
                <div className="flex items-center gap-3 px-1 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-900/80 flex items-center justify-center font-bold text-xs text-white">F</div>
                  <span className="text-xs font-medium text-zinc-500 truncate max-w-[150px]">Flávia Alessandra...</span>
                </div>
                <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-2 py-2 text-xs text-zinc-600 hover:text-red-400 transition">
                  <LogOut className="w-4 h-4" />
                  <span>Sair da Conta</span>
                </button>
              </div>
            </div>
            <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          </div>
        )}

        {currentScreen === "dashboard" && (
          <>
            <div className="p-4 flex justify-between items-center z-10 relative">
              <button onClick={() => setIsSidebarOpen(true)} className="w-11 h-11 flex items-center justify-center bg-[#0d0d0f] border border-zinc-900 rounded-xl hover:bg-zinc-900 transition">
                <Menu className="w-5 h-5 text-zinc-300" />
              </button>
              <div className="w-11 h-11 flex items-center justify-center bg-[#0d0d0f] border border-zinc-900 rounded-xl">
                <FileText className="w-5 h-5 text-zinc-500" />
              </div>
              <button onClick={() => setCurrentScreen("niche_selection")} className="w-11 h-11 flex items-center justify-center bg-[#0d0d0f] border border-[#e2b35c]/20 rounded-xl group hover:border-[#e2b35c]/40 transition">
                <Plus className="w-5 h-5 text-[#e2b35c]" />
              </button>
            </div>

            <div className="px-5 flex-1 overflow-y-auto space-y-5 z-10 relative pt-2">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Visão Geral</h1>
                <p className="text-[13px] text-zinc-500 mt-0.5">Atualizado agora</p>
              </div>

              <div className="flex justify-between items-center pt-1">
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 bg-[#141417] text-white rounded-full text-xs font-medium border border-zinc-700/60">Hoje</button>
                  <button className="px-4 py-1.5 bg-transparent border border-emerald-950/40 text-emerald-700/80 rounded-full text-xs font-medium">7 dias</button>
                  <button className="px-4 py-1.5 bg-transparent border border-emerald-950/40 text-emerald-700/80 rounded-full text-xs font-medium">30 dias</button>
                </div>
                <button
                  onClick={() => setCurrentScreen("niche_selection")}
                  className="px-4 py-1.5 bg-[#e2b35c] hover:bg-[#d0a34c] text-black rounded-full text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
                  <span>Novo</span>
                </button>
              </div>

              <div className="border border-[#e2b35c]/10 bg-[#070708]/30 rounded-2xl p-3 flex items-center gap-3">
                <div className="bg-[#e2b35c]/5 p-2 rounded-xl border border-[#e2b35c]/10">
                  <Gift className="w-4 h-4 text-[#e2b35c]" />
                </div>
                <p className="text-[11px] leading-tight font-medium">
                  <span className="text-[#e2b35c]">Bônus disponível em 6 dias</span>
                  <span className="text-zinc-500"> • Continue usando a plataforma para desbloquear</span>
                </p>
              </div>

              <div className="bg-gradient-to-b from-[#060c09] to-[#020303] border border-emerald-900/20 rounded-[28px] p-5 space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Você faturou hoje</span>
                  <span className="text-[10px] bg-emerald-950/50 text-emerald-400 border border-emerald-900/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" /> 0%
                  </span>
                </div>
                <div>
                  <span className="text-4xl font-bold block tracking-tight text-white font-sans">R$ 0,00</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-medium pt-0.5">
                  <span>0 vendas aprovadas</span>
                  <span className="text-zinc-700 text-xs">•</span>
                  <span>Ticket médio R$ 0,00</span>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-[11px] text-zinc-400 pr-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse" />
                  <span className="text-zinc-400">Sistema ativo</span>
                </div>
                <div className="space-y-4 pt-2 border-t border-zinc-900/80">
                  {["Pix", "Cartão de Crédito", "PicPay"].map((m) => (
                    <div key={m} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium text-zinc-400">
                        <span>{m}</span>
                        <span>0%</span>
                      </div>
                      <div className="w-full h-[5px] bg-black border border-zinc-900/60 rounded-full overflow-hidden" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {currentScreen === "niche_selection" && (
          <>
            <div className="p-4 bg-black border-b border-zinc-900/60 sticky top-0 z-10 space-y-4">
              <div className="flex justify-between items-center">
                <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-zinc-400"><Menu className="w-6 h-6" /></button>
                <div className="border border-zinc-900 bg-[#0d0d0f] p-2 rounded-xl"><BookOpen className="w-5 h-5 text-emerald-500" /></div>
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
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${item.step === 1 ? "bg-emerald-600 text-white" : "bg-zinc-900 text-zinc-600"}`}>{item.step}</div>
                    <span className={`text-[10px] mt-1 ${item.step === 1 ? "text-emerald-400 font-medium" : "text-zinc-600"}`}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-6 z-10 relative">
              <div className="text-center space-y-2 pt-1">
                <div className="inline-flex bg-emerald-950/30 border border-emerald-900/30 p-3 rounded-2xl text-emerald-400 mb-1">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Criar E-book</h2>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  Escolha o nicho e o sub-nicho — a IA entrega o e-book pronto
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-400 block pl-1">Selecione um Nicho</label>
                <div className="flex flex-wrap gap-2">
                  {niches.map((niche) => (
                    <button
                      key={niche}
                      onClick={() => setSelectedNiche(niche)}
                      className={`px-3.5 py-2 rounded-xl text-xs transition-all border ${
                        selectedNiche === niche
                          ? "bg-[#141417] border-[#e2b35c] text-[#e2b35c] font-medium"
                          : "bg-[#0a0a0c] text-zinc-400 border-zinc-900 hover:border-zinc-800"
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
                  className="w-full bg-[#e2b35c] hover:bg-[#d0a34c] text-black py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 text-black" />
                      <Sparkles className="w-3.5 h-3.5 text-black" />
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
            <div className="p-4 flex justify-between items-center border-b border-zinc-900/60 bg-black">
              <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-zinc-400"><Menu className="w-6 h-6" /></button>
              <div className="border border-zinc-900 bg-[#0d0d0f] p-2 rounded-lg"><BookOpen className="w-5 h-5 text-emerald-500" /></div>
              <button onClick={() => setCurrentScreen("niche_selection")} className="p-1 text-[#e2b35c]"><Plus className="w-6 h-6" /></button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-5 flex flex-col items-center z-10 relative">
              <div className="bg-emerald-950/40 border border-emerald-900/30 px-4 py-1.5 rounded-full flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
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

              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative border border-zinc-900 bg-zinc-900">
                <img
                  src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=600"
                  alt="Capa do Ebook"
                  className="w-full h-full object-cover grayscale-[10%] brightness-75"
                />
              </div>

              <div className="w-full flex items-center justify-between bg-zinc-950/40 border border-zinc-900 rounded-xl p-2 text-xs">
                <div className="flex items-center gap-1">
                  <button className="p-1 text-zinc-600"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-zinc-500 px-1">1 / 9</span>
                  <button className="p-1 text-zinc-400"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <span className="text-[9px] bg-zinc-900 text-[#e2b35c] border border-zinc-800 px-2 py-0.5 rounded uppercase font-semibold">
                  {selectedNiche}
                </span>
                <button className="flex items-center gap-1 text-[10px] text-zinc-400 border border-zinc-900 px-2 py-1 rounded bg-black">
                  <Maximize2 className="w-3 h-3" /> Tela cheia
                </button>
              </div>

              <div className="w-full space-y-2 pt-2">
                <button className="w-full bg-[#e2b35c] hover:bg-[#d0a34c] text-black py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition">
                  <Download className="w-4 h-4 text-black" />
                  <span>Baixar E-book em PDF</span>
                </button>
                <button
                  onClick={() => setCurrentScreen("dashboard")}
                  className="w-full bg-transparent hover:bg-zinc-900 text-zinc-400 border border-zinc-900 py-3.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition"
                >
                  <span>Continuar para próxima etapa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}

        <div className="bg-black border-t border-zinc-900/80 p-2.5 grid grid-cols-5 text-center sticky bottom-0 z-10">
          <button onClick={() => setCurrentScreen("dashboard")} className={`flex flex-col items-center justify-center py-0.5 ${currentScreen === "dashboard" ? "text-[#e2b35c]" : "text-zinc-600"}`}>
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-wide">Início</span>
            {currentScreen === "dashboard" && <span className="w-4 h-[2px] bg-[#e2b35c] rounded-full mt-0.5" />}
          </button>
          <button onClick={() => setCurrentScreen("niche_selection")} className={`flex flex-col items-center justify-center py-0.5 ${currentScreen === "niche_selection" || currentScreen === "result" ? "text-[#e2b35c]" : "text-zinc-600"}`}>
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium tracking-wide">Ebooks</span>
            {(currentScreen === "niche_selection" || currentScreen === "result") && <span className="w-4 h-[2px] bg-[#e2b35c] rounded-full mt-0.5" />}
          </button>
          <button className="flex flex-col items-center justify-center py-0.5 text-zinc-600 opacity-40"><Layers className="w-5 h-5 mb-1" /><span className="text-[10px] font-medium tracking-wide">Páginas</span></button>
          <button className="flex flex-col items-center justify-center py-0.5 text-zinc-600 opacity-40"><Video className="w-5 h-5 mb-1" /><span className="text-[10px] font-medium tracking-wide">Vídeos</span></button>
          <button className="flex flex-col items-center justify-center py-0.5 text-zinc-600 opacity-40"><User className="w-5 h-5 mb-1" /><span className="text-[10px] font-medium tracking-wide">Perfil</span></button>
        </div>
      </div>
    </div>
  );
}
