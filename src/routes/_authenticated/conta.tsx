import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { excluirMinhaConta } from "@/lib/conta.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta | Alevi.ai" },
      { name: "description", content: "Gerencie sua conta e seus dados na Alevi.ai." },
    ],
  }),
  component: ContaPage,
});

function ContaPage() {
  const navigate = useNavigate();
  const excluir = useServerFn(excluirMinhaConta);
  const [confirmando, setConfirmando] = useState(false);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExcluir = async () => {
    if (texto.trim().toUpperCase() !== "EXCLUIR") {
      toast.error("Digite EXCLUIR para confirmar.");
      return;
    }
    setLoading(true);
    try {
      await excluir();
      await supabase.auth.signOut();
      toast.success("Sua conta foi excluída.");
      navigate({ to: "/", replace: true });
    } catch (err) {
      toast.error((err as Error).message ?? "Falha ao excluir a conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link to="/dashboard" className="text-sm text-gold hover:underline">
          ← Voltar para o painel
        </Link>
        <h1 className="font-display text-4xl font-bold mt-6 mb-8">Minha conta</h1>

        <section className="rounded-2xl bg-card p-6 space-y-4 mb-6">
          <h2 className="font-display text-xl font-semibold">Seus direitos LGPD</h2>
          <p className="text-sm text-muted-foreground">
            Você pode solicitar acesso, correção, portabilidade e outros direitos
            previstos no art. 18 da LGPD pelo canal de{" "}
            <Link to="/contato-privacidade" className="text-gold hover:underline">
              contato de privacidade
            </Link>
            . Para excluir sua conta imediatamente, use o botão abaixo.
          </p>
        </section>

        <section className="rounded-2xl border border-destructive/40 bg-card p-6">
          <h2 className="font-display text-xl font-semibold text-destructive">
            Excluir minha conta
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Esta ação é irreversível. Todos os seus ebooks, páginas, vídeos,
            pedidos e credenciais serão removidos. Registros exigidos por lei
            (ex.: fiscais) podem ser retidos pelo período legal.
          </p>

          {!confirmando ? (
            <button
              onClick={() => setConfirmando(true)}
              className="mt-4 rounded-md bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:opacity-90 transition"
            >
              Quero excluir minha conta
            </button>
          ) : (
            <div className="mt-4 space-y-3">
              <label className="text-sm block">
                Digite <strong>EXCLUIR</strong> para confirmar:
              </label>
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                autoComplete="off"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleExcluir}
                  disabled={loading}
                  className="rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground disabled:opacity-60"
                >
                  {loading ? "Excluindo..." : "Confirmar exclusão"}
                </button>
                <button
                  onClick={() => {
                    setConfirmando(false);
                    setTexto("");
                  }}
                  disabled={loading}
                  className="rounded-md border border-input px-4 py-2 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
