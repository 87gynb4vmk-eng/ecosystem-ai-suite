import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen, CreditCard, Layout, Video, Users, FileText,
  Loader2, Download, ArrowRight, ArrowLeft, LogOut,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Início | Alevi.ai" }] }),
  component: EbookWorkflow,
});

const STEPS = [
  { id: 1, name: "E-book", icon: BookOpen },
  { id: 2, name: "Produto", icon: CreditCard },
  { id: 3, name: "Página", icon: Layout },
  { id: 4, name: "Vídeos", icon: Video },
  { id: 5, name: "Grupos", icon: Users },
];

function EbookWorkflow() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [price, setPrice] = useState("");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    qc.cancelQueries();
    qc.clear();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 font-sans">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>

        {/* Barra de Navegação */}
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
    </div>
  );
}
