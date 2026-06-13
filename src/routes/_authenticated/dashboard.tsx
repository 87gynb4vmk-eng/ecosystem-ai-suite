import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen, Plus, Menu, Home, Layers, Video, User,
  Download, ArrowRight, Maximize2, Sparkles,
  ChevronLeft, ChevronRight, X, LayoutGrid, Gift, LogOut,
  FileText, ArrowUpRight,
} from "lucide-react";
import { jsPDF } from "jspdf";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Início | Alevi.ai" }] }),
  component: EbookWorkflow,
});

type ScreenState = "dashboard" | "niche_selection" | "result";

function EbookWorkflow() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('dashboard');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const nicheStructure: Record<string, string[]> = {
    'Saúde & Fitness': [
      'Emagrecimento', 'Fitness', 'Musculação', 'Treino em Casa',
      'Receitas Saudáveis', 'Air Fryer Gourmet', 'Skincare Masculino',
      'Beleza Natural', 'Sono e Bem-estar', 'Terapias Naturais'
    ],
    'Finanças & Negócios': [
      'Finanças', 'Investimentos para Iniciantes', 'Planejamento Financeiro',
      'Finanças para Crianças', 'Milhas Aéreas', 'Empreendedorismo', 'Gestão de Negócios'
    ],
    'Marketing Digital': [
      'Marketing Digital', 'Vendas Online', 'Marketing para Afiliados',
      'Dropshipping', 'E-commerce'
    ],
    'Mentalidade & Carreira': [
      'Produtividade', 'Saúde Mental', 'Ansiedade Digital', 'Gestão de Tempo',
      'Autoconhecimento', 'Minimalismo', 'Carreira', 'Estudo para Concursos', 'Biohacking'
    ],
    'Hobbies & Estilo de Vida': [
      'Relacionamento', 'Culinária', 'Maternidade', 'Educação', 'Religião',
      'Beleza', 'Idiomas', 'Artesanato', 'Casa e Organização', 'Espiritualidade',
      'Pet', 'Tecnologia', 'Alfabetização em Casa', 'Escrita Criativa',
      'Fotografia com Celular', 'Horta Urbana', 'Crochê Moderno',
      'Inteligência Artificial', 'Jardinagem', 'Moda Feminina'
    ]
  };

  const [selectedMainNiche, setSelectedMainNiche] = useState<string>('Marketing Digital');
  const [selectedSubNiche, setSelectedSubNiche] = useState<string>('E-commerce');
  const [ebookPage, setEbookPage] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    qc.cancelQueries();
    qc.clear();
    navigate({ to: "/auth" });
  };

  const handleMainNicheChange = (mainNiche: string) => {
    setSelectedMainNiche(mainNiche);
    setSelectedSubNiche(nicheStructure[mainNiche][0]);
  };

  const generateEbookContent = (subNiche: string) => {
    const images: Record<string, string> = {
      'E-commerce': 'https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&q=80&w=600',
      'Finanças para Crianças': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600',
      'Emagrecimento': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
      'Finanças': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600',
      'Marketing Digital': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600'
    };
    const keywords: Record<string, string> = {
      'Relacionamento': 'couple', 'Produtividade': 'clock', 'Saúde Mental': 'zen',
      'Dropshipping': 'package', 'Inteligência Artificial': 'code', 'Milhas Aéreas': 'airplane'
    };
    const chosenImage = images[subNiche] || `https://images.unsplash.com/featured/600x450?${keywords[subNiche] || 'notebook,workspace'}`;
    return {
      title: subNiche === 'Finanças para Crianças' ? 'Criem Crianças Empreendedoras em 21 Dias' : `Guia Prático Whitelabel: ${subNiche}`,
      coverImage: chosenImage,
      pages: [
        { title: "📚 CAPA DO PRODUTO", text: `Este é o início do seu novo Império Whitelabel focado em ${subNiche}. Pronto para distribuição e vendas escaláveis.` },
        { title: "📌 Introdução Estratégica", text: `O mercado de ${subNiche} é um dos pilares mais lucrativos da atualidade. Este guia abordará os fundamentos necessários para transformar de forma previsível e escalável a atenção da sua audiência em faturamento real.` },
        { title: "⚡ Capítulo 1: O Segredo do Posicionamento", text: `Para dominar o ecossistema de ${subNiche}, seu infoproduto precisa resolver a dor central do cliente logo nos minutos iniciais de leitura. Foque em entregar soluções acionáveis de imediato.` },
        { title: "💰 Capítulo 2: Estratégia de Monetização", text: `Configure o funil focado em ofertas complementares. A estrutura de ${subNiche} se paga na aquisição inicial, mas a escala real vive no LTV com esteiras de produtos avançados.` },
        { title: "🏁 Conclusão & Plano de Ação", text: `Agora, aplique sua identidade proprietária sobre este material de ${subNiche} e realize o upload na sua plataforma de checkout preferida. O ativo digital está estruturado e pronto para rodar.` }
      ]
    };
  };

  const currentEbook = generateEbookContent(selectedSubNiche);

  const handleDownloadEbook = () => {
    setIsDownloading(true);
    setTimeout(() => {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      doc.setFillColor(18, 18, 20);
      doc.rect(0, 0, 210, 297, 'F');
      doc.setFillColor(226, 179, 92);
      doc.rect(20, 45, 8, 8, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(226, 179, 92);
      doc.text("CONTEÚDO PREMIUM WHITELABEL", 33, 51);
      doc.setFontSize(26);
      doc.setTextColor(255, 255, 255);
      const titleLines = doc.splitTextToSize(currentEbook.title.toUpperCase(), 160);
      doc.text(titleLines, 20, 80);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text(`Nicho Principal: ${selectedMainNiche}`, 20, 130);
      doc.text(`Sub-nicho Alvo: ${selectedSubNiche}`, 20, 138);
      doc.setDrawColor(40, 40, 45);
      doc.line(20, 250, 190, 250);
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("© Inteligência Artificial Whitelabel Builder - Todos os direitos de revenda liberados.", 20, 262);

      currentEbook.pages.forEach((page, idx) => {
        if (idx === 0) return;
        doc.addPage();
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(160, 160, 160);
        doc.text(`MATERIAL DE DISTRIBUIÇÃO EXCLUSIVA | SUB-NICHO: ${selectedSubNiche.toUpperCase()}`, 20, 15);
        doc.setDrawColor(230, 230, 230);
        doc.line(20, 18, 190, 18);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(20, 20, 20);
        doc.text(page.title, 20, 35);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        const textLines = doc.splitTextToSize(page.text, 170);
        doc.text(textLines, 20, 52, { lineHeightFactor: 1.5 });
        doc.setDrawColor(240, 240, 240);
        doc.line(20, 275, 190, 275);
        doc.setFontSize(8);
        doc.setTextColor(180, 180, 180);
        doc.text(`Documentação Licenciada para Direitos de Marca Própria (PLR)`, 20, 283);
        doc.text(`Página ${idx + 1}`, 180, 283);
      });

      const filename = `Ebook_${selectedSubNiche.replace(/\s+/g, '_')}.pdf`;
      doc.save(filename);
      setIsDownloading(false);
    }, 1200);
  };

  const handleGenerateEbook = () => {
    setIsGenerating(true);
    setEbookPage(0);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentScreen('result');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-start font-sans antialiased selection:bg-[#e2b35c]/30">
      <div className="w-full max-w-md bg-black min-h-screen flex flex-col justify-between shadow-2xl relative border-x border-zinc-900 overflow-hidden">
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[380px] h-[380px] bg-emerald-950/20 rounded-full blur-[130px] pointer-events-none z-0" />

        {isSidebarOpen && (
          <div className="absolute inset-0 z-50 flex">
            <div className="w-[85%] bg-[#09090b] h-full border-r border-zinc-900 p-5 flex flex-col justify-between z-10">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="border border-zinc-900 bg-[#0d0d0f] p-2 rounded-xl">
                    <BookOpen className="w-5 h-5 text-[#e2b35c]" />
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 hover:bg-zinc-950 rounded-lg text-zinc-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => { setIsSidebarOpen(false); setCurrentScreen('niche_selection'); }}
                  className="w-full bg-[#e2b35c] hover:bg-[#d0a34c] text-black font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4 text-black stroke-[3]" />
                  <span>Nova Estrutura</span>
                </button>
                <nav className="space-y-1 pt-2">
                  <button onClick={() => { setCurrentScreen('dashboard'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white text-xs font-medium rounded-xl transition hover:bg-zinc-900/40">
                    <LayoutGrid className="w-4 h-4 text-zinc-600" />
                    <span>Dashboard</span>
                  </button>
                  <button onClick={() => { setCurrentScreen('niche_selection'); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white text-xs font-medium rounded-xl transition hover:bg-zinc-900/40">
                    <BookOpen className="w-4 h-4 text-zinc-600" />
                    <span>Ebooks</span>
                  </button>
                </nav>
              </div>
              <div className="pt-4 border-t border-zinc-900">
                <div className="flex items-center gap-3 px-1 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-900/30 flex items-center justify-center font-bold text-xs text-white">F</div>
                  <span className="text-xs font-medium text-zinc-400 truncate max-w-[150px]">Flávia Alessandra...</span>
                </div>
                <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-2 py-2 text-xs text-zinc-600 hover:text-red-400 transition"><LogOut className="w-4 h-4" /><span>Sair da Conta</span></button>
              </div>
            </div>
            <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          </div>
        )}

        {currentScreen === 'dashboard' && (
          <>
            <div className="p-4 flex justify-between items-center z-10 relative">
              <button onClick={() => setIsSidebarOpen(true)} className="w-11 h-11 flex items-center justify-center bg-[#0d0d0f] border border-zinc-900 rounded-xl hover:bg-zinc-900 transition"><Menu className="w-5 h-5 text-zinc-300" /></button>
              <div className="w-11 h-11 flex items-center justify-center bg-[#0d0d0f] border border-zinc-900 rounded-xl"><FileText className="w-5 h-5 text-zinc-500" /></div>
              <button onClick={() => setCurrentScreen('niche_selection')} className="w-11 h-11 flex items-center justify-center bg-[#0d0d0f] border border-[#e2b35c]/20 rounded-xl hover:border-[#e2b35c]/40 transition"><Plus className="w-5 h-5 text-[#e2b35c]" /></button>
            </div>
            <div className="px-5 flex-1 overflow-y-auto space-y-5 z-10 relative pt-2">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Visão Geral</h1>
                <p className="text-[13px] text-zinc-500 mt-0.5">Atualizado agora</p>
              </div>
              <div className="flex justify-between items-center pt-1">
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 bg-[#141417] text-white rounded-full text-xs font-medium border border-zinc-700/60">Hoje</button>
                  <button className="px-4 py-1.5 bg-transparent border border-emerald-950/40 text-emerald-700/80 rounded-full text-xs font-medium">7 dias</button>
                </div>
                <button onClick={() => setCurrentScreen('niche_selection')} className="px-4 py-1.5 bg-[#e2b35c] hover:bg-[#d0a34c] text-black rounded-full text-xs font-semibold flex items-center gap-1 transition"><Plus className="w-3.5 h-3.5 text-black stroke-[3]" /><span>Novo</span></button>
              </div>
              <div className="border border-[#e2b35c]/10 bg-[#070708]/30 rounded-2xl p-3 flex items-center gap-3">
                <div className="bg-[#e2b35c]/5 p-2 rounded-xl border border-[#e2b35c]/10"><Gift className="w-4 h-4 text-[#e2b35c]" /></div>
                <p className="text-[11px] leading-tight font-medium"><span className="text-[#e2b35c]">Bônus disponível em 6 dias</span><span className="text-zinc-500"> • Continue usando</span></p>
              </div>
              <div className="bg-gradient-to-b from-[#060c09] to-[#020303] border border-emerald-900/20 rounded-[28px] p-5 space-y-5">
                <div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Você faturou hoje</span><span className="text-[10px] bg-emerald-950/50 text-emerald-400 border border-emerald-900/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3" /> 0%</span></div>
                <div><span className="text-4xl font-bold block tracking-tight text-white">R$ 0,00</span></div>
                <div className="space-y-4 pt-2 border-t border-zinc-900/80">
                  {['Pix', 'Cartão de Crédito', 'PicPay'].map((payment) => (
                    <div key={payment} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium text-zinc-400"><span>{payment}</span><span>0%</span></div>
                      <div className="w-full h-[5px] bg-black border border-zinc-900/60 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {currentScreen === 'niche_selection' && (
          <>
            <div className="p-4 bg-black border-b border-zinc-900/60 sticky top-0 z-10 space-y-4">
              <div className="flex justify-between items-center">
                <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-zinc-400"><Menu className="w-6 h-6" /></button>
                <div className="border border-zinc-900 bg-[#0d0d0f] p-2 rounded-xl"><BookOpen className="w-5 h-5 text-emerald-500" /></div>
                <button onClick={() => setCurrentScreen('dashboard')} className="p-1 text-zinc-400"><Plus className="w-6 h-6" /></button>
              </div>
              <div className="w-full flex justify-between items-center px-4 relative pt-1">
                <div className="absolute top-3.5 left-8 right-8 h-[1px] bg-zinc-900 -z-0" />
                {['E-book', 'Produto', 'Página', 'Vídeos', 'Grupos'].map((name, index) => (
                  <div key={name} className="flex flex-col items-center z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-emerald-600 text-white' : 'bg-zinc-900 text-zinc-600'}`}>{index + 1}</div>
                    <span className={`text-[10px] mt-1 ${index === 0 ? 'text-emerald-400 font-medium' : 'text-zinc-600'}`}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-5 z-10 relative">
              <div className="text-center space-y-1.5">
                <div className="inline-flex bg-emerald-950/30 border border-emerald-900/30 p-2.5 rounded-xl text-emerald-400 mb-1"><BookOpen className="w-5 h-5" /></div>
                <h2 className="text-xl font-bold tracking-tight">Configurar Estrutura</h2>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">Filtre por nicho principal para ver os sub-nichos mapeados</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider pl-0.5">1. Nicho Principal</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(nicheStructure).map((mainNiche) => (
                    <button
                      key={mainNiche}
                      onClick={() => handleMainNicheChange(mainNiche)}
                      className={`p-3 rounded-xl text-xs text-left transition-all border ${selectedMainNiche === mainNiche ? 'bg-[#141417] border-[#e2b35c] text-[#e2b35c] font-semibold' : 'bg-[#0a0a0c] text-zinc-500 border-zinc-900 hover:border-zinc-850'}`}
                    >
                      {mainNiche}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center pl-0.5">
                  <label className="text-xs font-bold text-[#e2b35c] uppercase tracking-wider">2. Sub-nichos Disponíveis</label>
                  <span className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded-full font-medium">
                    {nicheStructure[selectedMainNiche]?.length || 0} opções
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-[190px] overflow-y-auto p-2 border border-zinc-900 rounded-xl bg-zinc-950/40 scrollbar-none">
                  {nicheStructure[selectedMainNiche]?.map((subNiche) => (
                    <button
                      key={subNiche}
                      onClick={() => setSelectedSubNiche(subNiche)}
                      className={`px-3 py-2 rounded-lg text-xs transition-all border ${selectedSubNiche === subNiche ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400 font-medium' : 'bg-black text-zinc-400 border-zinc-900 hover:border-zinc-800'}`}
                    >
                      {subNiche}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-3">
                <button onClick={handleGenerateEbook} disabled={isGenerating} className="w-full bg-[#e2b35c] hover:bg-[#d0a34c] text-black py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition">
                  {isGenerating ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><BookOpen className="w-4 h-4 text-black" /><Sparkles className="w-3.5 h-3.5 text-black" /><span>Criar E-book do Sub-nicho</span></>}
                </button>
              </div>
            </div>
          </>
        )}

        {currentScreen === 'result' && (
          <>
            <div className="p-4 flex justify-between items-center border-b border-zinc-900/60 bg-black">
              <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-zinc-400"><Menu className="w-6 h-6" /></button>
              <div className="border border-zinc-900 bg-[#0d0d0f] p-2 rounded-lg"><BookOpen className="w-5 h-5 text-emerald-500" /></div>
              <button onClick={() => setCurrentScreen('niche_selection')} className="p-1 text-[#e2b35c]"><Plus className="w-6 h-6" /></button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4 flex flex-col items-center z-10 relative">
              <div className="bg-[#05160e] border border-emerald-900/40 px-4 py-1.5 rounded-full flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span>PDF estruturado com sucesso</span>
              </div>
              <div className="text-center space-y-1 max-w-sm px-2">
                <h2 className="text-md font-bold tracking-tight leading-snug text-white font-sans">{currentEbook.title}</h2>
                <p className="text-[11px] text-zinc-500">Nicho: {selectedMainNiche} &rsaquo; <span className="text-zinc-300 font-medium">{selectedSubNiche}</span></p>
              </div>
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative border border-zinc-900 bg-zinc-950 shadow-xl flex flex-col justify-between p-5">
                {ebookPage === 0 ? (
                  <>
                    <img src={currentEbook.coverImage} alt="Capa" className="absolute inset-0 w-full h-full object-cover brightness-[25%] contrast-[105%]" />
                    <div className="relative z-10 flex flex-col h-full justify-between items-start">
                      <span className="text-[9px] bg-[#e2b35c] text-black font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">Sub-nicho: {selectedSubNiche}</span>
                      <div className="space-y-1">
                        <h3 className="text-base font-black text-white tracking-tight leading-tight uppercase font-sans text-left">{currentEbook.title}</h3>
                        <p className="text-[10px] text-[#e2b35c] font-medium">Pronto para exportação em .PDF</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="relative z-10 flex flex-col h-full justify-between text-left animate-in fade-in duration-200">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#e2b35c] uppercase tracking-wider">{currentEbook.pages[ebookPage].title}</h4>
                      <p className="text-xs text-zinc-300 leading-relaxed font-normal">{currentEbook.pages[ebookPage].text}</p>
                    </div>
                    <span className="text-[9px] text-zinc-600 font-medium border-t border-zinc-900 pt-1.5 block">Licença ativa para o sub-nicho {selectedSubNiche}</span>
                  </div>
                )}
              </div>
              <div className="w-full flex items-center justify-between bg-zinc-950/60 border border-zinc-900 rounded-xl p-2 text-xs">
                <div className="flex items-center gap-1">
                  <button onClick={() => setEbookPage(prev => Math.max(0, prev - 1))} className="p-1 text-zinc-500 hover:text-white transition"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-zinc-400 px-1 font-semibold min-w-[35px] text-center">{ebookPage + 1} / 5</span>
                  <button onClick={() => setEbookPage(prev => Math.min(currentEbook.pages.length - 1, prev + 1))} className="p-1 text-zinc-400 hover:text-white transition"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <span className="text-[9px] bg-[#141417] text-[#e2b35c] border border-zinc-800/80 px-2 py-0.5 rounded uppercase font-bold tracking-wider truncate max-w-[120px]">
                  {selectedSubNiche}
                </span>
                <button className="flex items-center gap-1 text-[10px] text-zinc-400 border border-zinc-900 px-2.5 py-1 rounded bg-black hover:text-white transition">
                  <Maximize2 className="w-3 h-3 text-zinc-500" /> Tela cheia
                </button>
              </div>
              <div className="w-full space-y-2 pt-1">
                <button
                  onClick={handleDownloadEbook}
                  disabled={isDownloading}
                  className="w-full bg-[#e2b35c] hover:bg-[#d0a34c] text-black py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md active:scale-[0.99]"
                >
                  {isDownloading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-black stroke-[2.5]" />
                      <span>Baixar E-book em PDF Real</span>
                    </>
                  )}
                </button>
                <button onClick={() => setCurrentScreen('dashboard')} className="w-full bg-transparent hover:bg-zinc-950 text-zinc-400 border border-zinc-900 py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition">
                  <span>Voltar para o Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>
            </div>
          </>
        )}

        <div className="bg-black border-t border-zinc-900/80 p-2.5 grid grid-cols-5 text-center sticky bottom-0 z-10">
          <button onClick={() => setCurrentScreen('dashboard')} className={`flex flex-col items-center justify-center py-0.5 ${currentScreen === 'dashboard' ? 'text-[#e2b35c]' : 'text-zinc-600'}`}>
            <Home className="w-5 h-5 mb-1" /><span className="text-[10px] font-medium tracking-wide">Início</span>
            {currentScreen === 'dashboard' && <span className="w-4 h-[2px] bg-[#e2b35c] rounded-full mt-0.5" />}
          </button>
          <button onClick={() => setCurrentScreen('niche_selection')} className={`flex flex-col items-center justify-center py-0.5 ${currentScreen === 'niche_selection' || currentScreen === 'result' ? 'text-[#e2b35c]' : 'text-zinc-600'}`}>
            <BookOpen className="w-5 h-5 mb-1" /><span className="text-[10px] font-medium tracking-wide">Ebooks</span>
            {(currentScreen === 'niche_selection' || currentScreen === 'result') && <span className="w-4 h-[2px] bg-[#e2b35c] rounded-full mt-0.5" />}
          </button>
          <button className="flex flex-col items-center justify-center py-0.5 text-zinc-600 opacity-40"><Layers className="w-5 h-5 mb-1" /><span className="text-[10px] font-medium tracking-wide">Páginas</span></button>
          <button className="flex flex-col items-center justify-center py-0.5 text-zinc-600 opacity-40"><Video className="w-5 h-5 mb-1" /><span className="text-[10px] font-medium tracking-wide">Vídeos</span></button>
          <button className="flex flex-col items-center justify-center py-0.5 text-zinc-600 opacity-40"><User className="w-5 h-5 mb-1" /><span className="text-[10px] font-medium tracking-wide">Perfil</span></button>
        </div>
      </div>
    </div>
  );
}
