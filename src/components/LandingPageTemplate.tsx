import { useState } from "react";
import {
  Star,
  Check,
  ShieldCheck,
  Gift,
  BookOpen,
  Users,
  Sparkles,
  ChevronDown,
  Clock,
} from "lucide-react";

const GREEN = "#10b981";

export type LandingPageTemplateProps = {
  titulo: string;
  subtitulo: string;
  nicho: string;
  price: string; // ex: "29,90"
  affiliateLink: string;
  beneficios?: string[];
  capitulos?: string[];
  paraQuem?: string[];
  porqueFunciona?: string[];
  bonus?: { titulo: string; descricao: string }[];
  faq?: { pergunta: string; resposta: string }[];
};

const DEFAULT_BENEFICIOS = [
  "Método passo a passo validado por especialistas",
  "Estratégias práticas para aplicar hoje mesmo",
  "Resultados visíveis nas primeiras semanas",
  "Conteúdo direto ao ponto, sem enrolação",
  "Suporte da comunidade exclusiva",
  "Acesso vitalício ao material",
];

const DEFAULT_PARA_QUEM = [
  "Quem está começando do zero e quer um caminho claro",
  "Quem já tentou outros métodos e não viu resultado",
  "Quem busca uma transformação real e duradoura",
  "Quem quer economizar tempo com um guia objetivo",
];

const DEFAULT_PORQUE = [
  "Baseado em estudos e casos de sucesso reais",
  "Linguagem simples e acessível para qualquer pessoa",
  "Aplicável à rotina mesmo com pouco tempo disponível",
];

const DEFAULT_BONUS = [
  { titulo: "Checklist Imprimível", descricao: "Acompanhe sua evolução dia após dia." },
  { titulo: "Planilha de Metas", descricao: "Defina objetivos claros e mensuráveis." },
  { titulo: "Comunidade VIP", descricao: "Acesso ao grupo exclusivo de leitores." },
];

const DEFAULT_FAQ = [
  {
    pergunta: "Como recebo o e-book após a compra?",
    resposta:
      "Imediatamente após a confirmação do pagamento, você recebe o link de acesso no seu e-mail.",
  },
  {
    pergunta: "Posso ler em qualquer dispositivo?",
    resposta: "Sim. O e-book é em PDF e funciona em celular, tablet, computador e e-reader.",
  },
  {
    pergunta: "Existe garantia?",
    resposta:
      "Sim, garantia incondicional de 7 dias. Se não gostar, devolvemos 100% do seu dinheiro.",
  },
  {
    pergunta: "Preciso de conhecimento prévio?",
    resposta: "Não. O conteúdo foi escrito para iniciantes e também aprofunda para os avançados.",
  },
];

function priceParts(price: string) {
  const clean = (price || "29,90").replace(/[^\d,\.]/g, "").replace(",", ".");
  const num = Number(clean) || 29.9;
  const reais = Math.floor(num);
  const cents = Math.round((num - reais) * 100)
    .toString()
    .padStart(2, "0");
  const original = (num * 2.5).toFixed(2).replace(".", ",");
  return { reais, cents, original };
}

export function LandingPageTemplate(props: LandingPageTemplateProps) {
  const {
    titulo,
    subtitulo,
    nicho,
    price,
    affiliateLink,
    beneficios = DEFAULT_BENEFICIOS,
    capitulos,
    paraQuem = DEFAULT_PARA_QUEM,
    porqueFunciona = DEFAULT_PORQUE,
    bonus = DEFAULT_BONUS,
    faq = DEFAULT_FAQ,
  } = props;

  const { reais, cents, original } = priceParts(price);
  const safeAffiliateLink = /^https?:\/\//i.test(affiliateLink) ? affiliateLink : "";
  const cta = safeAffiliateLink || "#";
  const ctaTarget = safeAffiliateLink ? "_blank" : undefined;
  const ctaRel = safeAffiliateLink ? "noopener noreferrer" : undefined;


  const defaultCapitulos = [
    "Fundamentos essenciais",
    "Mentalidade vencedora",
    "Estratégias práticas",
    "Ferramentas indispensáveis",
    "Erros comuns a evitar",
    "Plano de ação em 30 dias",
  ];
  const caps = capitulos && capitulos.length ? capitulos : defaultCapitulos;

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const CtaBtn = ({ label, className = "" }: { label: string; className?: string }) => (
    <a
      href={cta}
      target={ctaTarget}
      rel={ctaRel}
      className={`block w-full text-center font-bold py-4 rounded-2xl text-white shadow-lg transition active:scale-[0.98] ${className}`}
      style={{
        background: `linear-gradient(135deg, ${GREEN}, #059669)`,
        boxShadow: `0 12px 30px -10px ${GREEN}80`,
      }}
    >
      {label}
    </a>
  );

  return (
    <div className="bg-[#0a0a0a] text-white rounded-3xl border border-zinc-800 overflow-hidden">
      {/* HERO */}
      <section className="relative px-6 pt-10 pb-8 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.18),transparent_60%)]" />
        <div className="relative">
          <span
            className="inline-block text-[11px] tracking-widest font-bold uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: `${GREEN}1a`, color: GREEN, border: `1px solid ${GREEN}40` }}
          >
            {nicho || "E-book Digital"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
            {titulo || "Transforme sua vida com este guia definitivo"}
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mb-6">
            {subtitulo || "O método completo para alcançar resultados reais em poucas semanas."}
          </p>
          <CtaBtn label="🚀 QUERO GARANTIR O MEU AGORA" />
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-500">
            <Clock size={14} /> Acesso imediato após a compra
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="px-6 py-5 border-y border-zinc-900 bg-black/40">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1" style={{ color: "#fbbf24" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
            <span className="text-white font-bold ml-2 text-sm">4.9/5</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Users size={14} style={{ color: GREEN }} />
            <span>
              <span className="text-white font-bold">+12.480</span> leitores satisfeitos
            </span>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="px-6 py-8">
        <h2 className="text-2xl font-bold mb-5 text-center">
          O que você vai <span style={{ color: GREEN }}>aprender</span>
        </h2>
        <ul className="space-y-3">
          {beneficios.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4"
            >
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: `${GREEN}1a`, color: GREEN }}
              >
                <Check size={16} strokeWidth={3} />
              </span>
              <span className="text-sm text-zinc-200 leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CAPÍTULOS */}
      <section className="px-6 py-8 bg-zinc-950/60 border-y border-zinc-900">
        <div className="flex items-center justify-center gap-2 mb-5">
          <BookOpen size={20} style={{ color: GREEN }} />
          <h2 className="text-2xl font-bold text-center">Conteúdo do e-book</h2>
        </div>
        <div className="grid gap-3">
          {caps.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800"
            >
              <span
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold"
                style={{ background: `${GREEN}1a`, color: GREEN }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-zinc-100">{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="px-6 py-8">
        <h2 className="text-2xl font-bold mb-5 text-center">
          Para quem <span style={{ color: GREEN }}>é</span>
        </h2>
        <ul className="space-y-3">
          {paraQuem.map((p, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check size={18} style={{ color: GREEN }} className="mt-1 shrink-0" />
              <span className="text-sm text-zinc-300">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* POR QUE FUNCIONA */}
      <section className="px-6 py-8 bg-zinc-950/60 border-y border-zinc-900">
        <h2 className="text-2xl font-bold mb-5 text-center">
          Por que <span style={{ color: GREEN }}>funciona</span>
        </h2>
        <div className="grid gap-3">
          {porqueFunciona.map((p, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3"
            >
              <Sparkles size={18} style={{ color: GREEN }} className="mt-0.5 shrink-0" />
              <span className="text-sm text-zinc-200">{p}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BÔNUS */}
      <section className="px-6 py-8">
        <div className="flex items-center justify-center gap-2 mb-5">
          <Gift size={20} style={{ color: GREEN }} />
          <h2 className="text-2xl font-bold text-center">Bônus exclusivos</h2>
        </div>
        <div className="grid gap-3">
          {bonus.map((b, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 border"
              style={{
                background: `linear-gradient(135deg, ${GREEN}10, transparent)`,
                borderColor: `${GREEN}40`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded"
                  style={{ background: GREEN, color: "#000" }}
                >
                  Bônus {i + 1}
                </span>
                <h3 className="text-base font-bold">{b.titulo}</h3>
              </div>
              <p className="text-sm text-zinc-300">{b.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OFERTA */}
      <section className="px-6 py-10">
        <div className="rounded-3xl p-6 border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Oferta por tempo limitado</p>
          <p className="text-zinc-500 line-through text-sm mb-1">De R$ {original}</p>
          <div className="flex items-end justify-center gap-1 mb-1">
            <span className="text-lg font-bold text-zinc-400">R$</span>
            <span className="text-6xl font-extrabold tracking-tight">{reais}</span>
            <span className="text-2xl font-bold text-zinc-400">,{cents}</span>
          </div>
          <p className="text-xs text-zinc-500 mb-6">à vista ou em até 12x no cartão</p>
          <CtaBtn label="🛒 COMPRAR AGORA" />
          <div
            className="flex items-center justify-center gap-2 mt-5 p-3 rounded-2xl border"
            style={{ background: `${GREEN}0d`, borderColor: `${GREEN}33` }}
          >
            <ShieldCheck size={18} style={{ color: GREEN }} />
            <span className="text-xs text-zinc-300">
              <span className="font-bold text-white">Garantia incondicional de 7 dias</span> — se não
              gostar, devolvemos seu dinheiro.
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-10">
        <h2 className="text-2xl font-bold mb-5 text-center">Perguntas frequentes</h2>
        <div className="space-y-2">
          {faq.map((f, i) => {
            const open = openFaq === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-left"
                >
                  <span className="text-sm font-semibold">{f.pergunta}</span>
                  <ChevronDown
                    size={18}
                    className="shrink-0 transition-transform"
                    style={{
                      transform: open ? "rotate(180deg)" : "none",
                      color: GREEN,
                    }}
                  />
                </button>
                {open && (
                  <div className="px-4 pb-4 text-sm text-zinc-400 leading-relaxed">{f.resposta}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="px-6 pb-10">
        <CtaBtn label="QUERO COMEÇAR AGORA →" />
        <p className="text-center text-[11px] text-zinc-600 mt-4">
          © {new Date().getFullYear()} — Todos os direitos reservados
        </p>
      </section>
    </div>
  );
}
