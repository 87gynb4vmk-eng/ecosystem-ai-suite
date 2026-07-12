import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { OfertaRelampago } from "@/components/landing/OfertaRelampago";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const LINK_VITALICIO = "https://pay.cakto.com.br/rrwtdn3_976866";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Descubra seu caminho no digital — Quiz Alevi.ai" },
      { name: "description", content: "Responda 4 perguntas rápidas e descubra o caminho ideal para começar no mercado digital com a Alevi." },
      { property: "og:title", content: "Quiz Alevi.ai — Descubra seu caminho no digital" },
      { property: "og:description", content: "60 segundos para descobrir por onde começar no mercado digital." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://suportealevi.store/quiz" },
    ],
    links: [{ rel: "canonical", href: "https://suportealevi.store/quiz" }],
  }),
  component: QuizPage,
});

type Pergunta = { titulo: string; opcoes: string[] };

const perguntas: Pergunta[] = [
  { titulo: "Qual seu objetivo?", opcoes: ["Criar uma renda extra", "Criar um negócio digital", "Criar eBooks", "Aprender IA", "Criar uma estrutura de vendas"] },
  { titulo: "Você já vende produtos digitais?", opcoes: ["Nunca vendi", "Já tentei", "Já vendo e quero melhorar"] },
  { titulo: "Quanto tempo você tem disponível?", opcoes: ["Menos de 1 hora", "1 a 3 horas", "Mais de 3 horas"] },
  { titulo: "Qual sua maior dificuldade?", opcoes: ["Criar o produto", "Criar página", "Divulgação", "Organização"] },
];

function calcularPerfil(respostas: number[]): { nome: string; descricao: string } {
  const [obj, exp] = respostas;
  if (exp === 0) return { nome: "Criador Digital Iniciante", descricao: "Você está começando e precisa de uma estrutura simples e guiada. A Alevi organiza cada etapa, do produto à página de vendas, para você lançar seu primeiro produto sem se perder no caminho." };
  if (exp === 2) return { nome: "Criador Digital em Escala", descricao: "Você já vende e quer acelerar. A Alevi tira o operacional do seu ombro para você focar em tráfego, ofertas e escala." };
  if (obj === 3) return { nome: "Explorador de IA", descricao: "Você quer aplicar IA no seu negócio. A Alevi coloca IA em cada etapa da criação — do eBook aos vídeos de divulgação." };
  return { nome: "Criador em Evolução", descricao: "Você já testou o digital e quer uma estrutura profissional. A Alevi centraliza criação e divulgação para você evoluir com consistência." };
}

function QuizPage() {
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  const finalizado = etapa >= perguntas.length;
  const progresso = Math.round((Math.min(etapa, perguntas.length) / perguntas.length) * 100);

  const responder = (i: number) => {
    const novas = [...respostas, i];
    setRespostas(novas);
    setEtapa(etapa + 1);
  };

  const reiniciar = () => { setEtapa(0); setRespostas([]); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          {!finalizado ? (
            <>
              <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  Quiz Alevi
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-3">
                  Descubra em 60 segundos qual caminho combina mais com você para começar no mercado digital.
                </h1>
              </div>
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Pergunta {etapa + 1} de {perguntas.length}</span>
                  <span>{progresso}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-gold transition-all duration-500" style={{ width: `${progresso}%` }} />
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
                <h2 className="font-display text-xl sm:text-2xl font-bold mb-6">{perguntas[etapa].titulo}</h2>
                <div className="grid gap-3">
                  {perguntas[etapa].opcoes.map((op, i) => (
                    <button
                      key={op}
                      onClick={() => responder(i)}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-5 py-4 text-left font-medium hover:border-gold/60 hover:bg-gold/5 transition-all"
                    >
                      <span>{op}</span>
                      <ArrowRight className="h-5 w-5 text-gold shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <ResultadoQuiz respostas={respostas} onReiniciar={reiniciar} />
          )}
        </div>
      </section>
      {finalizado && <OfertaRelampago />}
      <Footer />
    </div>
  );
}

function ResultadoQuiz({ respostas, onReiniciar }: { respostas: number[]; onReiniciar: () => void }) {
  const perfil = calcularPerfil(respostas);
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold mb-6">
        <CheckCircle2 className="h-4 w-4" />
        Seu resultado
      </div>
      <h1 className="font-display text-3xl sm:text-5xl font-extrabold mb-4">
        Seu perfil é <span className="text-gradient-gold">{perfil.nome}</span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
        {perfil.descricao}
      </p>
      <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-10">
        A Alevi pode montar a estrutura completa que você precisa para começar — eBook, página, vídeos e conteúdos de divulgação.
      </p>
      <a
        href={LINK_VITALICIO}
        target="_top"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-lg bg-gradient-gold px-8 py-4 text-base font-bold uppercase tracking-wider text-gold-foreground shadow-gold-glow hover:opacity-95 transition-all hover:scale-[1.02]"
      >
        Quero criar minha estrutura com a Alevi
      </a>
      <div className="mt-6">
        <button onClick={onReiniciar} className="text-sm text-muted-foreground hover:text-foreground underline">
          Refazer o quiz
        </button>
      </div>
    </div>
  );
}
