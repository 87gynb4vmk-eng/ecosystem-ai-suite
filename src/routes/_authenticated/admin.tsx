import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, RotateCcw, Shield, Trash2, UserPlus, Users } from "lucide-react";
import {
  adminCriarUsuario,
  adminExcluirUsuario,
  adminListarUsuarios,
  adminResetarSenha,
  adminSouAdmin,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Gerenciador | Alevi.ai" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Usuario = {
  id: string;
  email: string;
  plano: string;
  created_at: string;
};

function AdminPage() {
  const checkAdmin = useServerFn(adminSouAdmin);
  const adminQ = useQuery({ queryKey: ["sou-admin"], queryFn: () => checkAdmin() });

  if (adminQ.isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </main>
    );
  }

  if (!adminQ.data?.isAdmin) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-sm text-center bg-card border border-border rounded-2xl p-8 shadow-luxury">
          <div className="mx-auto h-12 w-12 rounded-full bg-destructive/15 flex items-center justify-center mb-5">
            <Shield className="h-5 w-5 text-destructive" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Acesso negado</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Somente administradores podem acessar esta página.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Voltar ao painel
          </Link>
        </div>
      </main>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const listar = useServerFn(adminListarUsuarios);
  const criar = useServerFn(adminCriarUsuario);
  const resetar = useServerFn(adminResetarSenha);
  const excluir = useServerFn(adminExcluirUsuario);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [novoEmail, setNovoEmail] = useState("");
  const [novoPlano, setNovoPlano] = useState<"mensal" | "vitalicio">("mensal");
  const [criando, setCriando] = useState(false);

  const carregar = async () => {
    setCarregando(true);
    try {
      const { usuarios } = await listar();
      setUsuarios(usuarios as Usuario[]);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCriar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCriando(true);
    try {
      const res = await criar({ data: { email: novoEmail, plano: novoPlano } });
      toast.success(`Conta criada. Senha: ${res.senha}`);
      navigator.clipboard.writeText(res.senha).catch(() => {});
      setNovoEmail("");
      await carregar();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setCriando(false);
    }
  };

  const handleResetar = async (u: Usuario) => {
    if (!confirm(`Gerar nova senha para ${u.email}?`)) return;
    try {
      const res = await resetar({ data: { userId: u.id } });
      navigator.clipboard.writeText(res.senha).catch(() => {});
      toast.success(`Nova senha: ${res.senha} (copiada)`);
      await carregar();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleExcluir = async (u: Usuario) => {
    if (!confirm(`Excluir ${u.email} permanentemente?`)) return;
    try {
      await excluir({ data: { userId: u.id } });
      toast.success("Usuário excluído.");
      await carregar();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-3xl lg:max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-gold/15 flex items-center justify-center">
            <Users className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Gerenciador</h1>
            <p className="text-xs text-muted-foreground">Painel administrativo Alevi.ai</p>
          </div>
        </div>

        <section className="bg-card border border-border rounded-2xl p-5 mb-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="h-4 w-4 text-gold" />
            <h2 className="font-semibold">Liberar acesso manualmente</h2>
          </div>
          <form onSubmit={handleCriar} className="grid sm:grid-cols-[1fr_auto_auto] gap-3">
            <input
              type="email"
              required
              value={novoEmail}
              onChange={(e) => setNovoEmail(e.target.value)}
              placeholder="email@usuario.com"
              className="rounded-md border border-input bg-background px-3 py-2.5 text-sm"
            />
            <select
              value={novoPlano}
              onChange={(e) => setNovoPlano(e.target.value as "mensal" | "vitalicio")}
              className="rounded-md border border-input bg-background px-3 py-2.5 text-sm"
            >
              <option value="mensal">Mensal</option>
              <option value="vitalicio">Vitalício</option>
            </select>
            <button
              type="submit"
              disabled={criando}
              className="rounded-md bg-gradient-gold px-4 py-2.5 text-sm font-bold text-gold-foreground disabled:opacity-60"
            >
              {criando ? "Criando..." : "Criar"}
            </button>
          </form>
        </section>

        <section className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Usuários ({usuarios.length})</h2>
            <button
              onClick={carregar}
              className="text-xs text-gold hover:underline"
              disabled={carregando}
            >
              {carregando ? "Atualizando..." : "Atualizar"}
            </button>
          </div>

          {usuarios.length === 0 && !carregando ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum usuário ainda.
            </p>
          ) : (
            <ul className="space-y-2">
              {usuarios.map((u) => (
                <li
                  key={u.id}
                  className="border border-border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{u.email}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Criado em {new Date(u.created_at).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="mt-1.5">
                      {u.plano === "vitalicio" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 border border-gold/40 text-gold px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider">
                          ⭐ Acesso Vitalício
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 border border-primary/40 text-primary-foreground px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider">
                          📅 Acesso Mensal
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleResetar(u)}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-muted"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Senha
                    </button>
                    <button
                      onClick={() => handleExcluir(u)}
                      className="inline-flex items-center gap-1 rounded-md border border-destructive/40 text-destructive px-2.5 py-1.5 text-xs hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
