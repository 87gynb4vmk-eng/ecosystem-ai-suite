import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  BookOpen,
  Layout,
  Video as VideoIcon,
  ExternalLink,
  Download,
  Copy,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import {
  listarMeusEbooks,
  listarMinhasPaginas,
  deletarEbook,
} from "@/lib/ebooks.functions";
import { listarMeusVideos, deletarVideo } from "@/lib/videos.functions";

const AMBER = "#E0B43A";

type EbookRow = {
  id: string;
  titulo: string;
  subtitulo: string;
  nicho: string;
  subnicho: string;
  affiliate_link: string | null;
  is_published?: boolean;
  created_at: string;
};

type VideoRow = {
  id: string;
  status: string;
  video_url: string | null;
  erro: string | null;
  ebook_id: string;
  created_at: string;
  ebooks: { titulo: string; nicho: string } | { titulo: string; nicho: string }[] | null;
};

function Header({
  title,
  subtitle,
  onNovo,
}: {
  title: string;
  subtitle: string;
  onNovo: () => void;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>
      </div>
      <button
        onClick={onNovo}
        className="text-sm font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 text-black shrink-0"
        style={{ background: `linear-gradient(135deg, ${AMBER}, #c89725)` }}
      >
        <Plus size={16} strokeWidth={3} /> Novo
      </button>
    </div>
  );
}

function Empty({ icon: Icon, label }: { icon: typeof BookOpen; label: string }) {
  return (
    <div className="text-center py-16 border border-dashed border-zinc-800 rounded-3xl">
      <Icon size={28} className="mx-auto text-zinc-600 mb-3" />
      <p className="text-zinc-500 text-sm">{label}</p>
      <p className="text-zinc-600 text-xs mt-1">Toque em + Novo para começar</p>
    </div>
  );
}

function ProjectCard({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  status,
  onClick,
}: {
  icon: typeof BookOpen;
  iconColor: string;
  title: string;
  subtitle: string;
  status?: { text: string; color: string };
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/70 transition p-4 flex items-center gap-4"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${iconColor}1A` }}
      >
        <Icon size={22} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{title}</p>
        <p className="text-zinc-500 text-xs truncate mt-0.5">{subtitle}</p>
      </div>
      {status && (
        <span
          className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full shrink-0"
          style={{ background: `${status.color}1A`, color: status.color }}
        >
          {status.text}
        </span>
      )}
    </button>
  );
}

function ActionsSheet({
  open,
  onClose,
  title,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  actions: {
    icon: typeof ExternalLink;
    label: string;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
  }[];
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-zinc-950 border-t border-zinc-800 rounded-t-3xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold truncate pr-3">{title}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white" aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {actions.map((a, i) => {
            const ActionIcon = a.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  if (a.disabled) return;
                  a.onClick();
                }}
                disabled={a.disabled}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition ${
                  a.danger
                    ? "border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10"
                    : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-white"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <ActionIcon size={18} />
                <span className="text-sm font-medium">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function useEbookActions(
  onOpen: (id: string) => void,
  refetchKey: string[],
) {
  const qc = useQueryClient();
  const remover = useServerFn(deletarEbook);
  const del = useMutation({
    mutationFn: (id: string) => remover({ data: { id } }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Projeto excluído.");
      qc.invalidateQueries({ queryKey: refetchKey });
      qc.invalidateQueries({ queryKey: ["meus-ebooks"] });
      qc.invalidateQueries({ queryKey: ["minhas-paginas"] });
      qc.invalidateQueries({ queryKey: ["meus-videos"] });
    },
  });

  const buildActions = (e: EbookRow) => {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}/view-page/${e.id}` : "";
    return [
      {
        icon: ExternalLink,
        label: "Abrir página pública",
        onClick: () => {
          if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
        },
      },
      {
        icon: Download,
        label: "Abrir / Baixar e-book (PDF)",
        onClick: () => onOpen(e.id),
      },
      {
        icon: Copy,
        label: "Copiar link da página",
        onClick: async () => {
          try {
            await navigator.clipboard.writeText(url);
            toast.success("Link copiado!");
          } catch {
            toast.error("Falha ao copiar.");
          }
        },
      },
      {
        icon: Trash2,
        label: del.isPending ? "Excluindo..." : "Excluir projeto",
        onClick: () => {
          if (confirm("Excluir este projeto? Esta ação não pode ser desfeita.")) {
            del.mutate(e.id);
          }
        },
        danger: true,
        disabled: del.isPending,
      },
    ];
  };

  return { buildActions };
}

export function EbooksList({
  onNovo,
  onOpen,
}: {
  onNovo: () => void;
  onOpen: (id: string) => void;
}) {
  const listar = useServerFn(listarMeusEbooks);
  const { data, isLoading } = useQuery({
    queryKey: ["meus-ebooks"],
    queryFn: () => listar(),
  });
  const ebooks = (data?.ok ? data.ebooks : []) as EbookRow[];
  const [selected, setSelected] = useState<EbookRow | null>(null);
  const { buildActions } = useEbookActions(onOpen, ["meus-ebooks"]);

  return (
    <div className="max-w-xl mx-auto px-5 pt-8">
      <Header title="Ebooks" subtitle="Todos os e-books que você criou" onNovo={onNovo} />
      {isLoading ? (
        <div className="flex justify-center py-16 text-zinc-500">
          <Loader2 className="animate-spin" />
        </div>
      ) : ebooks.length === 0 ? (
        <Empty icon={BookOpen} label="Você ainda não criou nenhum e-book." />
      ) : (
        <div className="space-y-3">
          {ebooks.map((e) => (
            <ProjectCard
              key={e.id}
              icon={BookOpen}
              iconColor={AMBER}
              title={e.titulo}
              subtitle={`${e.nicho} • ${e.subnicho}`}
              status={
                e.is_published
                  ? { text: "Publicado", color: "#10b981" }
                  : { text: "Rascunho", color: "#71717a" }
              }
              onClick={() => setSelected(e)}
            />
          ))}
        </div>
      )}
      <ActionsSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.titulo ?? ""}
        actions={selected ? buildActions(selected) : []}
      />
    </div>
  );
}

export function PaginasList({
  onNovo,
  onOpen,
}: {
  onNovo: () => void;
  onOpen: (id: string) => void;
}) {
  const listar = useServerFn(listarMinhasPaginas);
  const { data, isLoading } = useQuery({
    queryKey: ["minhas-paginas"],
    queryFn: () => listar(),
  });
  const paginas = (data?.ok ? data.paginas : []) as EbookRow[];
  const [selected, setSelected] = useState<EbookRow | null>(null);
  const { buildActions } = useEbookActions(onOpen, ["minhas-paginas"]);

  return (
    <div className="max-w-xl mx-auto px-5 pt-8">
      <Header
        title="Páginas"
        subtitle="Páginas de vendas que você publicou"
        onNovo={onNovo}
      />
      {isLoading ? (
        <div className="flex justify-center py-16 text-zinc-500">
          <Loader2 className="animate-spin" />
        </div>
      ) : paginas.length === 0 ? (
        <Empty icon={Layout} label="Você ainda não publicou nenhuma página." />
      ) : (
        <div className="space-y-3">
          {paginas.map((e) => (
            <ProjectCard
              key={e.id}
              icon={Layout}
              iconColor="#10b981"
              title={e.titulo}
              subtitle={e.affiliate_link ? "Link de afiliado configurado" : "Sem link de afiliado"}
              onClick={() => setSelected(e)}
            />
          ))}
        </div>
      )}
      <ActionsSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.titulo ?? ""}
        actions={selected ? buildActions(selected) : []}
      />
    </div>
  );
}

export function VideosList({
  onNovo,
  onOpen,
}: {
  onNovo: () => void;
  onOpen: (ebookId: string) => void;
}) {
  const qc = useQueryClient();
  const listar = useServerFn(listarMeusVideos);
  const remover = useServerFn(deletarVideo);
  const { data, isLoading } = useQuery({
    queryKey: ["meus-videos"],
    queryFn: () => listar(),
  });
  const videos = (data?.ok ? data.videos : []) as VideoRow[];
  const [selected, setSelected] = useState<VideoRow | null>(null);

  const del = useMutation({
    mutationFn: (id: string) => remover({ data: { id } }),
    onSuccess: (res) => {
      if (!res.ok) return toast.error(res.error);
      toast.success("Vídeo excluído.");
      qc.invalidateQueries({ queryKey: ["meus-videos"] });
      setSelected(null);
    },
  });

  const ebookOf = (v: VideoRow) => (Array.isArray(v.ebooks) ? v.ebooks[0] : v.ebooks);

  return (
    <div className="max-w-xl mx-auto px-5 pt-8">
      <Header title="Vídeos" subtitle="Vídeos gerados a partir dos seus e-books" onNovo={onNovo} />
      {isLoading ? (
        <div className="flex justify-center py-16 text-zinc-500">
          <Loader2 className="animate-spin" />
        </div>
      ) : videos.length === 0 ? (
        <Empty icon={VideoIcon} label="Você ainda não gerou nenhum vídeo." />
      ) : (
        <div className="space-y-3">
          {videos.map((v) => {
            const eb = ebookOf(v);
            const statusColor =
              v.status === "concluido" ? "#10b981" : v.status === "erro" ? "#ef4444" : AMBER;
            return (
              <ProjectCard
                key={v.id}
                icon={VideoIcon}
                iconColor="#3b82f6"
                title={eb?.titulo ?? "Vídeo"}
                subtitle={eb?.nicho ?? ""}
                status={{
                  text:
                    v.status === "concluido"
                      ? "Pronto"
                      : v.status === "erro"
                        ? "Erro"
                        : "Processando",
                  color: statusColor,
                }}
                onClick={() => setSelected(v)}
              />
            );
          })}
        </div>
      )}
      <ActionsSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? (ebookOf(selected)?.titulo ?? "Vídeo") : ""}
        actions={
          selected
            ? [
                {
                  icon: ExternalLink,
                  label: selected.video_url ? "Abrir vídeo" : "Vídeo ainda não disponível",
                  onClick: () => {
                    if (selected.video_url && typeof window !== "undefined") {
                      window.open(selected.video_url, "_blank", "noopener,noreferrer");
                    }
                  },
                  disabled: !selected.video_url,
                },
                {
                  icon: Copy,
                  label: "Copiar link do vídeo",
                  onClick: async () => {
                    if (!selected.video_url) return;
                    try {
                      await navigator.clipboard.writeText(selected.video_url);
                      toast.success("Link copiado!");
                    } catch {
                      toast.error("Falha ao copiar.");
                    }
                  },
                  disabled: !selected.video_url,
                },
                {
                  icon: BookOpen,
                  label: "Abrir e-book deste vídeo",
                  onClick: () => onOpen(selected.ebook_id),
                },
                {
                  icon: Trash2,
                  label: del.isPending ? "Excluindo..." : "Excluir vídeo",
                  onClick: () => {
                    if (confirm("Excluir este vídeo?")) del.mutate(selected.id);
                  },
                  danger: true,
                  disabled: del.isPending,
                },
              ]
            : []
        }
      />
    </div>
  );
}
