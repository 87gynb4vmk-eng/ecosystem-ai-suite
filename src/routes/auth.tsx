import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar | Alevi.ai" },
      { name: "description", content: "Acesse seu painel Alevi.ai com o e-mail e a senha temporária enviados após a compra." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo!");
        if (data.session) {
          navigate({ to: "/dashboard", replace: true });
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Conta criada!");
          navigate({ to: "/dashboard", replace: true });
        } else {
          toast.success("Conta criada! Verifique seu e-mail para confirmar.");
        }
      }
    } catch (err) {
      toast.error((err as Error).message ?? "Falha na autenticação.");
    } finally {
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

        <h1 className="text-2xl font-bold text-center mb-2">
          {mode === "signin" ? "Entrar no painel" : "Criar conta"}
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          {mode === "signin"
            ? "Use o e-mail e a senha temporária enviados após a compra."
            : "Crie sua conta para acessar o painel Alevi.ai."}
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
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
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
            {loading ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="w-full mt-6 text-sm text-muted-foreground hover:text-foreground transition"
        >
          {mode === "signin" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
        </button>
      </div>
    </main>
  );
}
