import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/esqueci-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha | Alevi.ai" },
      {
        name: "description",
        content: "Receba por e-mail um link seguro para redefinir sua senha.",
      },
    ],
  }),
  component: EsqueciSenhaPage,
});

const schema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido").max(255),
});

function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "E-mail inválido");
      return;
    }
    setLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(parsed.data.email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });
      // Sempre exibir mensagem genérica (não vazar existência de conta)
      setEnviado(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-dark px-6">
      <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-luxury">
        <Link to="/auth" className="text-sm text-gold hover:underline">
          ← Voltar para o login
        </Link>
        <h1 className="text-2xl font-bold mt-4 mb-2">Recuperar senha</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        {enviado ? (
          <div className="rounded-md border border-border bg-background p-4 text-sm">
            Se o e-mail informado estiver cadastrado, você receberá em breve um
            link seguro para redefinir a senha. O link expira em 1 hora.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">E-mail</label>
              <input
                type="email"
                required
                autoComplete="email"
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gradient-gold px-4 py-3 text-sm font-semibold text-gold-foreground shadow-gold-glow hover:opacity-95 transition disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
