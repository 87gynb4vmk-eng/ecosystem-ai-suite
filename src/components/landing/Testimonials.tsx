import { Star } from "lucide-react";

type Depoimento = {
  nome: string;
  cargo: string;
  texto: string;
  inicial: string;
};

const grupo1: Depoimento[] = [
  {
    nome: "Thiago M.",
    cargo: "Infoprodutor Premium",
    inicial: "T",
    texto:
      "Lancei meu ecossistema na sexta e fiz minha primeira venda no sábado. A copy gerada pela Alevi.ai converte de um jeito que eu não conseguia sozinho.",
  },
  {
    nome: "Camila P.",
    cargo: "Coach de Alta Performance",
    inicial: "C",
    texto:
      "Em uma semana eu já tinha faturado mais do que em três meses tentando montar tudo manualmente. O nível de profissionalismo é absurdo.",
  },
  {
    nome: "Rafael D.",
    cargo: "Consultor de Tráfego Pago",
    inicial: "R",
    texto:
      "Uso a Alevi.ai para entregar para meus clientes. Eles ficam impressionados. Aumentei meu ticket médio em 3x.",
  },
];

const grupo2: Depoimento[] = [
  {
    nome: "Sofia R.",
    cargo: "Mentora de Negócios",
    inicial: "S",
    texto:
      "Eu já paguei agências caríssimas que entregaram menos do que a Alevi.ai faz em minutos. O plano vitalício se pagou na primeira mentoria que vendi.",
  },
  {
    nome: "Lucas V.",
    cargo: "Especialista em Vendas",
    inicial: "L",
    texto:
      "O diferencial é a inteligência da IA na hora de quebrar objeções. Cada página vem com argumentos que eu, com 10 anos de mercado, ainda não tinha pensado.",
  },
  {
    nome: "Aline T.",
    cargo: "Fundadora de E-commerce",
    inicial: "A",
    texto:
      "Comprei o vitalício e nunca mais precisei pagar mensalidade de copywriter ou designer. Vale cada centavo.",
  },
];

function Card({ d }: { d: Depoimento }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-gold text-gold" />
        ))}
      </div>
      <p className="text-foreground/85 leading-relaxed mb-6">"{d.texto}"</p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-semibold">
          {d.inicial}
        </div>
        <div>
          <div className="font-semibold text-sm">{d.nome}</div>
          <div className="text-xs text-muted-foreground">{d.cargo}</div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsResultado() {
  return (
    <section id="depoimentos" className="py-24 bg-muted/40">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Resultados Reais
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold">Faturando desde o primeiro dia</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {grupo1.map((d) => (
            <Card key={d.nome} d={d} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsObjecao() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Por que escolher Alevi.ai
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold">Quem entra, não volta atrás</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {grupo2.map((d) => (
            <Card key={d.nome} d={d} />
          ))}
        </div>
      </div>
    </section>
  );
}
