import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/redefinir-senha")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Redefinir senha | Alevi.ai" },
      { name: "description", content: "Defina uma nova senha para sua conta." },
    ],
  }),
  component: RedefinirSenhaPage,
});

const schema = z
  .object({
    senha: z
      .string()
      .min(8, "Mínimo de 8 caracteres")
      .max(72, "Máximo de 72 caracteres"),
    confirmar: z.string(),
  })
  .refine((d) => d.senha === d.confirmar, {
    message: "As senhas não conferem",
    path: ["confirmar"],
  });

function RedefinirSenhaPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase entrega tokens no hash da URL para o fluxo de recovery.
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // Também verifica sessão já existente
    supabase.auth.getSession().then(({ data: s }) => {
      if (s.session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ senha, confirmar });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: parsed.data.senha });
      if (error) throw error;
      toast.success("Senha redefinida! Faça login com a nova senha.");
      await supabase.auth.signOut();
      navigate({ to: "/auth", replace: true });
    } catch (err) {
      toast.error((err as Error).message ?? "Falha ao redefinir a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-dark px-6">
      <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-luxury">
        <h1 className="text-2xl font-bold mb-2">Redefinir senha</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Escolha uma senha forte. Mínimo de 8 caracteres.
        </p>

        {!ready ? (
          <div className="text-sm text-muted-foreground">
            Validando link de recuperação...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Nova senha</label>
              <input
                type="password"
                required
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Confirmar nova senha</label>
              <input
                type="password"
                required
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gradient-gold px-4 py-3 text-sm font-semibold text-gold-foreground shadow-gold-glow hover:opacity-95 transition disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
