import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { gerarEcossistema, listarProjetos } from "@/lib/projetos.functions";
import { toast } from "sonner";
import { Sparkles, LogOut, Inbox, FileText, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Painel | Alevi.ai" }] }),
  component: DashboardPage,
});

type Projeto = {
  id: string;
  nome_negocio: string;
  nicho: string;
  descricao: string | null;
  paginas_ia: unknown;
  created_at: string;
};

function DashboardPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const listar = useServerFn(listarProjetos);
  const gerar = useServerFn(gerarEcossistema);

  const { data, isLoading } = useQuery({
    queryKey: ["projetos"],
    queryFn: () => listar(),
  });
  const projetos = (data?.projetos ?? []) as Projeto[];

  const [nome, setNome] = useState("");
  const [nicho, setNicho] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selected, setSelected] = useState<Projeto | null>(null);

  const mutation = useMutation({
    mutationFn: (input: { nome_negocio: string; nicho: string; descricao: string }) =>
      gerar({ data: input }),
    onSuccess: (res) => {
      toast.success("Ecossistema gerado com sucesso!");
      setNome("");
      setNicho("");
      setDescricao("");
      qc.invalidateQueries({ queryKey: ["projetos"] });
      setSelected(res.projeto as Projeto);
    },
    onError: (err: Error) => toast.error(err.message || "Falha ao gerar ecossistema."),
  });

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !nicho.trim() || descricao.trim().length < 10) {
      toast.error("Preencha todos os campos. A descrição precisa ter pelo menos 10 caracteres.");
      return;
    }
    mutation.mutate({ nome_negocio: nome, nicho, descricao });
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border">
        <div className="container mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-primary">Alevi</span>
            <span className="font-display text-2xl font-bold text-gradient-gold">.ai</span>
            <span className="ml-3 text-xs uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-0.5">
              Painel
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-6 py-10 grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <section className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-card h-fit">
          <h2 className="font-display text-xl font-bold mb-1">Criar novo ecossistema</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Descreva seu negócio e a IA monta tudo para você.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Nome do negócio</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={120}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ex: Mentoria Diamante"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Nicho</label>
              <input
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                maxLength={120}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ex: Emagrecimento feminino"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Descreva seu negócio</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                maxLength={2000}
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Para quem é, qual a proposta única, principais serviços e diferenciais..."
              />
              <div className="text-xs text-muted-foreground mt-1">{descricao.length} / 2000</div>
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-gold px-4 py-3 text-sm font-semibold text-gold-foreground shadow-gold-glow hover:opacity-95 transition disabled:opacity-60"
            >
              {mutation.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Gerando com IA...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Gerar ecossistema com IA</>
              )}
            </button>
          </form>
        </section>

        {/* Histórico */}
        <section className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Seus ecossistemas</h2>
            <span className="text-xs text-muted-foreground">{projetos.length} {projetos.length === 1 ? "projeto" : "projetos"}</span>
          </div>

          {isLoading ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          ) : projetos.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">Nenhum ecossistema ainda</h3>
              <p className="text-sm text-muted-foreground">
                Preencha o formulário ao lado para criar o seu primeiro.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {projetos.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="text-left bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-luxury hover:border-gold transition"
                >
                  <FileText className="h-5 w-5 text-primary mb-3" />
                  <div className="font-semibold mb-1 line-clamp-1">{p.nome_negocio}</div>
                  <div className="text-xs text-gold uppercase tracking-wider mb-2">{p.nicho}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {selected && <ProjetoModal projeto={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}

type PaginasIa = {
  landing?: { headline?: string; subheadline?: string; cta?: string; beneficios?: string[] };
  sobre?: { titulo?: string; texto?: string };
  servicos?: Array<{ titulo?: string; descricao?: string }>;
  contato?: { titulo?: string; cta?: string };
};

function ProjetoModal({ projeto, onClose }: { projeto: Projeto; onClose: () => void }) {
  const p = (projeto.paginas_ia ?? {}) as PaginasIa;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-3xl w-full my-8 shadow-luxury" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-background rounded-t-2xl">
          <div>
            <h3 className="font-display text-2xl font-bold">{projeto.nome_negocio}</h3>
            <p className="text-sm text-gold uppercase tracking-wider">{projeto.nicho}</p>
          </div>
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md border border-border">
            Fechar
          </button>
        </div>

        <div className="p-6 space-y-8">
          {p.landing && (
            <Section label="Landing Page">
              <h4 className="font-display text-2xl font-bold mb-2">{p.landing.headline}</h4>
              <p className="text-muted-foreground mb-4">{p.landing.subheadline}</p>
              {p.landing.beneficios && (
                <ul className="space-y-2 mb-4">
                  {p.landing.beneficios.map((b, i) => (
                    <li key={i} className="text-sm flex gap-2"><span className="text-gold">✦</span> {b}</li>
                  ))}
                </ul>
              )}
              {p.landing.cta && <div className="inline-block bg-gradient-gold text-gold-foreground px-4 py-2 rounded-md text-sm font-semibold">{p.landing.cta}</div>}
            </Section>
          )}

          {p.sobre && (
            <Section label="Sobre">
              <h4 className="font-display text-xl font-bold mb-2">{p.sobre.titulo}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{p.sobre.texto}</p>
            </Section>
          )}

          {p.servicos && p.servicos.length > 0 && (
            <Section label="Serviços">
              <div className="grid sm:grid-cols-2 gap-3">
                {p.servicos.map((s, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-4">
                    <div className="font-semibold mb-1">{s.titulo}</div>
                    <div className="text-sm text-muted-foreground">{s.descricao}</div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {p.contato && (
            <Section label="Contato">
              <h4 className="font-display text-xl font-bold mb-2">{p.contato.titulo}</h4>
              {p.contato.cta && <div className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold">{p.contato.cta}</div>}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-3">{label}</div>
      <div className="bg-muted/30 rounded-xl p-5 border border-border">{children}</div>
    </section>
  );
}
