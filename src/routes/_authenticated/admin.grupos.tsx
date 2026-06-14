import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  verificarSouAdmin,
  adminListarGrupos,
  adminCriarGrupo,
  adminAtualizarGrupo,
  adminDeletarGrupo,
} from "@/lib/grupos.functions";
import { Loader2, Plus, Trash2, ExternalLink, Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/grupos")({
  component: AdminGruposPage,
});

type Grupo = {
  id: string;
  plataforma: string;
  nicho: string;
  link: string;
  descricao: string;
  is_active: boolean;
  created_at: string;
};

function AdminGruposPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const checkAdmin = useServerFn(verificarSouAdmin);
  const listar = useServerFn(adminListarGrupos);
  const criar = useServerFn(adminCriarGrupo);
  const atualizar = useServerFn(adminAtualizarGrupo);
  const deletar = useServerFn(adminDeletarGrupo);

  const adminQ = useQuery({ queryKey: ["sou-admin"], queryFn: () => checkAdmin() });
  const isAdmin = adminQ.data?.isAdmin;

  useEffect(() => {
    if (adminQ.isSuccess && !isAdmin) {
      toast.error("Acesso restrito a administradores.");
      navigate({ to: "/dashboard" });
    }
  }, [adminQ.isSuccess, isAdmin, navigate]);

  const gruposQ = useQuery({
    queryKey: ["admin-grupos"],
    queryFn: () => listar(),
    enabled: !!isAdmin,
  });

  const refetch = () => qc.invalidateQueries({ queryKey: ["admin-grupos"] });

  const createMut = useMutation({
    mutationFn: (input: Omit<Grupo, "id" | "created_at">) => criar({ data: input }),
    onSuccess: () => {
      toast.success("Grupo adicionado!");
      refetch();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: (input: Partial<Grupo> & { id: string }) => atualizar({ data: input }),
    onSuccess: () => refetch(),
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deletar({ data: { id } }),
    onSuccess: () => {
      toast.success("Removido");
      refetch();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [form, setForm] = useState({
    plataforma: "WhatsApp",
    nicho: "",
    link: "",
    descricao: "",
  });

  if (adminQ.isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Verificando acesso...
      </div>
    );
  }

  const grupos = (gruposQ.data ?? []) as Grupo[];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6" style={{ color: "#f59e0b" }} />
          <h1 className="text-2xl font-bold">Admin · Grupos da Comunidade</h1>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.nicho || !form.link || !form.descricao) {
              toast.error("Preencha todos os campos");
              return;
            }
            createMut.mutate({ ...form, is_active: true });
            setForm({ plataforma: "WhatsApp", nicho: "", link: "", descricao: "" });
          }}
          className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-5 space-y-3"
        >
          <h2 className="font-semibold">Adicionar novo grupo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={form.plataforma}
              onChange={(e) => setForm({ ...form, plataforma: e.target.value })}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
            >
              <option>WhatsApp</option>
              <option>Telegram</option>
              <option>Discord</option>
              <option>Facebook</option>
            </select>
            <input
              placeholder="Nicho (ex: Marketing Digital)"
              value={form.nicho}
              onChange={(e) => setForm({ ...form, nicho: e.target.value })}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Descrição (nome do grupo)"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm sm:col-span-2"
            />
            <input
              placeholder="https://chat.whatsapp.com/..."
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm sm:col-span-2"
            />
          </div>
          <button
            type="submit"
            disabled={createMut.isPending}
            className="inline-flex items-center gap-2 text-black font-bold py-2 px-4 rounded-lg text-sm"
            style={{ background: "#f59e0b" }}
          >
            <Plus className="w-4 h-4" /> {createMut.isPending ? "Adicionando..." : "Adicionar"}
          </button>
        </form>

        <div className="space-y-2">
          <h2 className="font-semibold">Grupos cadastrados ({grupos.length})</h2>
          {gruposQ.isLoading && (
            <div className="text-zinc-500 text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Carregando...
            </div>
          )}
          {grupos.map((g) => (
            <div
              key={g.id}
              className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-center"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="px-2 py-0.5 rounded bg-zinc-800">{g.plataforma}</span>
                  <span>{g.nicho}</span>
                </div>
                <p className="font-semibold text-sm mt-1 truncate">{g.descricao}</p>
                <a
                  href={g.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-500 inline-flex items-center gap-1 mt-1 truncate max-w-full"
                >
                  {g.link} <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={g.is_active}
                    onChange={(e) =>
                      updateMut.mutate({ id: g.id, is_active: e.target.checked })
                    }
                  />
                  Ativo
                </label>
                <button
                  onClick={() => {
                    if (confirm("Remover este grupo?")) deleteMut.mutate(g.id);
                  }}
                  className="p-2 rounded-lg border border-zinc-800 hover:bg-red-950/40 text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {!gruposQ.isLoading && grupos.length === 0 && (
            <p className="text-zinc-500 text-sm">Nenhum grupo cadastrado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
