import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listarGruposDoMeuNicho } from "@/lib/grupos.functions";
import { Users, ExternalLink, Loader2, ArrowLeft } from "lucide-react";

const AMBER = "#f59e0b";

const PLATAFORMA_COLORS: Record<string, string> = {
  Telegram: "#229ED9",
  WhatsApp: "#25D366",
  Discord: "#5865F2",
  Facebook: "#1877F2",
};

export function Etapa5Grupos({ onBack }: { onBack: () => void }) {
  const fetchGrupos = useServerFn(listarGruposDoMeuNicho);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["grupos-meu-nicho"],
    queryFn: () => fetchGrupos(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Grupos do seu nicho</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Comunidades selecionadas com base no nicho do seu último e-book
          {data?.nicho ? <> — <span style={{ color: AMBER }}>{data.nicho}</span></> : null}.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-zinc-400 py-20 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Buscando grupos...
        </div>
      )}

      {isError && (
        <div className="border border-red-900/40 bg-red-950/20 rounded-2xl p-6 text-red-300">
          <p className="font-semibold mb-2">Não foi possível carregar os grupos.</p>
          <p className="text-sm opacity-80 mb-4">{(error as Error)?.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-sm font-bold"
          >
            Tentar de novo
          </button>
        </div>
      )}

      {!isLoading && !isError && data && data.grupos.length === 0 && (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-3xl px-6">
          <Users className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <p className="text-zinc-300 font-semibold">
            Ainda não temos grupos para o nicho
            {data.nicho ? <> <span style={{ color: AMBER }}>{data.nicho}</span></> : " selecionado"}.
          </p>
          <p className="text-sm text-zinc-500 mt-2">
            Estamos adicionando novas comunidades toda semana. Volte em breve.
          </p>
        </div>
      )}

      {!isLoading && !isError && data && data.grupos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.grupos.map((g) => {
            const cor = PLATAFORMA_COLORS[g.plataforma] ?? AMBER;
            return (
              <div
                key={g.id}
                className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-5 flex flex-col gap-3 hover:border-zinc-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: `${cor}20`, color: cor }}
                  >
                    {g.plataforma}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500">
                    {g.nicho}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed flex-1">{g.descricao}</p>
                <a
                  href={g.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-black font-bold py-2.5 rounded-xl text-sm"
                  style={{ background: AMBER }}
                >
                  Entrar no grupo <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-900"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      </div>
    </div>
  );
}
