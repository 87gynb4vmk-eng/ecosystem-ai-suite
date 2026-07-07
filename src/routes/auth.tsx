import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//") ? s.next : undefined,
  }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { data: usuario } = await supabase
          .from("usuarios")
          .select("trocar_senha_obrigatorio")
          .eq("id", userData.user.id)
          .single();
        if (usuario?.trocar_senha_obrigatorio) {
          throw redirect({ to: "/primeiro-acesso" });
        }
      }
      if (search.next) throw redirect({ href: search.next });
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "Entrar | Alevi.ai" },
      {
        name: "description",
        content:
          "Acesse seu painel Alevi.ai com o e-mail e a senha temporária enviados após a compra.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Bem-vindo!");
      setLoading(false);
      if (next) {
        window.location.href = next;
        return;
      }
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error((err as Error).message ?? "Falha na autenticação.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-dark px-6">
      <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-luxury">
        <Link to="/" className="block text-center mb-8">
          <span className="font-display text-3xl font-bold text-primary">Alevi</span>
          <span className="font-display text-3xl font-bold text-gradient-gold">.ai</span>
        </Link>

        <h1 className="text-2xl font-bold text-center mb-2">Entrar no painel</h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Use o e-mail e a senha temporária enviados após a compra.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">E-mail</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gradient-gold px-4 py-3 text-sm font-semibold text-gold-foreground shadow-gold-glow hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? "Aguarde..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ainda não tem acesso?{" "}
          <Link to="/" className="text-gold hover:underline">
            Veja os planos
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
