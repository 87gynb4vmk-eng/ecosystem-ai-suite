import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, CreditCard, Layout, Video, Users, LogOut } from "lucide-react";
import EbookGenerator from "@/components/EbookGenerator";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Início | Alevi.ai" }] }),
  component: DashboardPage,
});

const STEPS = [
  { id: 1, name: "E-book", icon: BookOpen },
  { id: 2, name: "Produto", icon: CreditCard },
  { id: 3, name: "Página", icon: Layout },
  { id: 4, name: "Vídeos", icon: Video },
  { id: 5, name: "Grupos", icon: Users },
];

function DashboardPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    qc.cancelQueries();
    qc.clear();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 font-sans">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-[#111] p-3 rounded-2xl border border-zinc-800">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const active = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  active ? "text-emerald-400 bg-emerald-950/20" : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] uppercase font-bold">{step.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end mb-3">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-red-400 transition px-3 py-1.5 rounded-lg border border-zinc-900"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>

        <div className="mt-4">
          {currentStep === 1 && <EbookGenerator />}
          {currentStep > 1 && (
            <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-3xl">
              Etapa {currentStep} em desenvolvimento...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
