import React, { useState } from "react";
import {
  BookOpen, Download, ArrowRight, Maximize2, Sparkles,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { jsPDF } from "jspdf";

type Screen = "select" | "result";

const nicheStructure: Record<string, string[]> = {
  "Saúde & Fitness": [
    "Emagrecimento", "Fitness", "Musculação", "Treino em Casa",
    "Receitas Saudáveis", "Air Fryer Gourmet", "Skincare Masculino",
    "Beleza Natural", "Sono e Bem-estar", "Terapias Naturais",
  ],
  "Finanças & Negócios": [
    "Finanças", "Investimentos para Iniciantes", "Planejamento Financeiro",
    "Finanças para Crianças", "Milhas Aéreas", "Empreendedorismo", "Gestão de Negócios",
  ],
  "Marketing Digital": [
    "Marketing Digital", "Vendas Online", "Marketing para Afiliados",
    "Dropshipping", "E-commerce",
  ],
  "Mentalidade & Carreira": [
    "Produtividade", "Saúde Mental", "Ansiedade Digital", "Gestão de Tempo",
    "Autoconhecimento", "Minimalismo", "Carreira", "Estudo para Concursos", "Biohacking",
  ],
  "Hobbies & Estilo de Vida": [
    "Relacionamento", "Culinária", "Maternidade", "Educação", "Religião",
    "Beleza", "Idiomas", "Artesanato", "Casa e Organização", "Espiritualidade",
    "Pet", "Tecnologia", "Alfabetização em Casa", "Escrita Criativa",
    "Fotografia com Celular", "Horta Urbana", "Crochê Moderno",
    "Inteligência Artificial", "Jardinagem", "Moda Feminina",
  ],
};

function generateEbookContent(subNiche: string) {
  const images: Record<string, string> = {
    "E-commerce": "https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&q=80&w=600",
    "Finanças para Crianças": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600",
    "Emagrecimento": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600",
    "Finanças": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600",
    "Marketing Digital": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
  };
  const keywords: Record<string, string> = {
    "Relacionamento": "couple", "Produtividade": "clock", "Saúde Mental": "zen",
    "Dropshipping": "package", "Inteligência Artificial": "code", "Milhas Aéreas": "airplane",
  };
  const chosenImage = images[subNiche] || `https://images.unsplash.com/featured/600x450?${keywords[subNiche] || "notebook,workspace"}`;
  return {
    title: subNiche === "Finanças para Crianças" ? "Criem Crianças Empreendedoras em 21 Dias" : `Guia Prático Whitelabel: ${subNiche}`,
    coverImage: chosenImage,
    pages: [
      { title: "📚 CAPA DO PRODUTO", text: `Este é o início do seu novo Império Whitelabel focado em ${subNiche}. Pronto para distribuição e vendas escaláveis.` },
      { title: "📌 Introdução Estratégica", text: `O mercado de ${subNiche} é um dos pilares mais lucrativos da atualidade. Este guia abordará os fundamentos necessários para transformar de forma previsível e escalável a atenção da sua audiência em faturamento real.` },
      { title: "⚡ Capítulo 1: O Segredo do Posicionamento", text: `Para dominar o ecossistema de ${subNiche}, seu infoproduto precisa resolver a dor central do cliente logo nos minutos iniciais de leitura. Foque em entregar soluções acionáveis de imediato.` },
      { title: "💰 Capítulo 2: Estratégia de Monetização", text: `Configure o funil focado em ofertas complementares. A estrutura de ${subNiche} se paga na aquisição inicial, mas a escala real vive no LTV com esteiras de produtos avançados.` },
      { title: "🏁 Conclusão & Plano de Ação", text: `Agora, aplique sua identidade proprietária sobre este material de ${subNiche} e realize o upload na sua plataforma de checkout preferida. O ativo digital está estruturado e pronto para rodar.` },
    ],
  };
}

export default function EbookGenerator() {
  const [screen, setScreen] = useState<Screen>("select");
  const [selectedMainNiche, setSelectedMainNiche] = useState<string>("Marketing Digital");
  const [selectedSubNiche, setSelectedSubNiche] = useState<string>("E-commerce");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [ebookPage, setEbookPage] = useState(0);

  const currentEbook = generateEbookContent(selectedSubNiche);

  const handleMainNicheChange = (mainNiche: string) => {
    setSelectedMainNiche(mainNiche);
    setSelectedSubNiche(nicheStructure[mainNiche][0]);
  };

  const handleGenerateEbook = () => {
    setIsGenerating(true);
    setEbookPage(0);
    setTimeout(() => {
      setIsGenerating(false);
      setScreen("result");
    }, 1500);
  };

  const handleDownloadEbook = () => {
    setIsDownloading(true);
    setTimeout(() => {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      doc.setFillColor(18, 18, 20);
      doc.rect(0, 0, 210, 297, "F");
      doc.setFillColor(226, 179, 92);
      doc.rect(20, 45, 8, 8, "F");
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

      doc.save(`Ebook_${selectedSubNiche.replace(/\s+/g, "_")}.pdf`);
      setIsDownloading(false);
    }, 1200);
  };

  if (screen === "select") {
    return (
      <div className="space-y-5">
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
                className={`p-3 rounded-xl text-xs text-left transition-all border ${selectedMainNiche === mainNiche ? "bg-[#141417] border-[#e2b35c] text-[#e2b35c] font-semibold" : "bg-[#0a0a0c] text-zinc-500 border-zinc-900 hover:border-zinc-800"}`}
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
          <div className="flex flex-wrap gap-1.5 max-h-[190px] overflow-y-auto p-2 border border-zinc-900 rounded-xl bg-zinc-950/40">
            {nicheStructure[selectedMainNiche]?.map((subNiche) => (
              <button
                key={subNiche}
                onClick={() => setSelectedSubNiche(subNiche)}
                className={`px-3 py-2 rounded-lg text-xs transition-all border ${selectedSubNiche === subNiche ? "bg-emerald-950/60 border-emerald-500 text-emerald-400 font-medium" : "bg-black text-zinc-400 border-zinc-900 hover:border-zinc-800"}`}
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
    );
  }

  return (
    <div className="space-y-4 flex flex-col items-center">
      <div className="bg-[#05160e] border border-emerald-900/40 px-4 py-1.5 rounded-full flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium shadow-sm">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        <span>PDF estruturado com sucesso</span>
      </div>
      <div className="text-center space-y-1 max-w-sm px-2">
        <h2 className="text-md font-bold tracking-tight leading-snug text-white">{currentEbook.title}</h2>
        <p className="text-[11px] text-zinc-500">Nicho: {selectedMainNiche} &rsaquo; <span className="text-zinc-300 font-medium">{selectedSubNiche}</span></p>
      </div>
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative border border-zinc-900 bg-zinc-950 shadow-xl flex flex-col justify-between p-5">
        {ebookPage === 0 ? (
          <>
            <img src={currentEbook.coverImage} alt="Capa" className="absolute inset-0 w-full h-full object-cover brightness-[25%] contrast-[105%]" />
            <div className="relative z-10 flex flex-col h-full justify-between items-start">
              <span className="text-[9px] bg-[#e2b35c] text-black font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">Sub-nicho: {selectedSubNiche}</span>
              <div className="space-y-1">
                <h3 className="text-base font-black text-white tracking-tight leading-tight uppercase text-left">{currentEbook.title}</h3>
                <p className="text-[10px] text-[#e2b35c] font-medium">Pronto para exportação em .PDF</p>
              </div>
            </div>
          </>
        ) : (
          <div className="relative z-10 flex flex-col h-full justify-between text-left">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#e2b35c] uppercase tracking-wider">{currentEbook.pages[ebookPage].title}</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">{currentEbook.pages[ebookPage].text}</p>
            </div>
            <span className="text-[9px] text-zinc-600 font-medium border-t border-zinc-900 pt-1.5 block">Licença ativa para o sub-nicho {selectedSubNiche}</span>
          </div>
        )}
      </div>
      <div className="w-full flex items-center justify-between bg-zinc-950/60 border border-zinc-900 rounded-xl p-2 text-xs">
        <div className="flex items-center gap-1">
          <button onClick={() => setEbookPage((p) => Math.max(0, p - 1))} className="p-1 text-zinc-500 hover:text-white transition"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-zinc-400 px-1 font-semibold min-w-[35px] text-center">{ebookPage + 1} / 5</span>
          <button onClick={() => setEbookPage((p) => Math.min(currentEbook.pages.length - 1, p + 1))} className="p-1 text-zinc-400 hover:text-white transition"><ChevronRight className="w-4 h-4" /></button>
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
        <button onClick={() => setScreen("select")} className="w-full bg-transparent hover:bg-zinc-950 text-zinc-400 border border-zinc-900 py-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition">
          <span>Escolher outro sub-nicho</span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
        </button>
      </div>
    </div>
  );
}
