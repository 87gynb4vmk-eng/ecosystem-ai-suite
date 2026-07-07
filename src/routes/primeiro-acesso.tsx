import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/primeiro-acesso")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: "Trocar senha | Alevi.ai" },
      {
        name: "description",
        content: "Defina sua nova senha de acesso ao Alevi.ai.",
      },
    ],
  }),
  component: PrimeiroAcessoPage,
});

function PrimeiroAcessoPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase
          .from("usuarios")
          .update({ trocar_senha_obrigatorio: false })
          .eq("id", userData.user.id);
      }

      toast.success("Senha definida com sucesso!");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error((err as Error).message ?? "Falha ao definir senha.");
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

        <h1 className="text-2xl font-bold text-center mb-2">Defina sua senha</h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Por segurança, crie uma senha nova para acessar o painel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Nova senha</label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Confirmar nova senha</label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gradient-gold px-4 py-3 text-sm font-semibold text-gold-foreground shadow-gold-glow hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? "Aguarde..." : "Definir senha e entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
