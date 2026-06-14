import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listarGruposDoMeuNicho } from "@/lib/grupos.functions";
import { Search, ExternalLink, Loader2, ArrowLeft, Facebook } from "lucide-react";

const AMBER = "#f59e0b";

export function Etapa5Grupos({ onBack }: { onBack: () => void }) {
  const fetchGrupos = useServerFn(listarGruposDoMeuNicho);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["grupos-meu-nicho"],
    queryFn: () => fetchGrupos(),
  });

  const facebookSearchUrl = data?.nicho
    ? `https://www.facebook.com/search/groups/?q=${encodeURIComponent(data.nicho)}`
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Grupos do seu nicho</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Encontre comunidades ativas no Facebook com base no tema do seu último e-book
          {data?.nicho ? <> — <span style={{ color: AMBER }}>{data.nicho}</span></> : null}.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-zinc-400 py-20 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Buscando nicho...
        </div>
      )}

      {isError && (
        <div className="border border-red-900/40 bg-red-950/20 rounded-2xl p-6 text-red-300">
          <p className="font-semibold mb-2">Não foi possível carregar o nicho.</p>
          <p className="text-sm opacity-80 mb-4">{(error as Error)?.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-sm font-bold"
          >
            Tentar de novo
          </button>
        </div>
      )}

      {!isLoading && !isError && data && !data.nicho && (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-3xl px-6">
          <Search className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <p className="text-zinc-300 font-semibold">
            Nenhum e-book encontrado no seu perfil.
          </p>
          <p className="text-sm text-zinc-500 mt-2">
            Crie um e-book primeiro para que o sistema identifique o seu nicho e sugira grupos.
          </p>
        </div>
      )}

      {!isLoading && !isError && data && data.nicho && facebookSearchUrl && (
        <div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "#1877F220" }}
          >
            <Facebook className="w-7 h-7" style={{ color: "#1877F2" }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">
              Buscar grupos de <span style={{ color: AMBER }}>{data.nicho}</span>
            </h3>
            <p className="text-sm text-zinc-400 mt-1 max-w-md">
              O Facebook exibirá os grupos mais ativos e recentes sobre esse tema. Você pode filtrar por público, privado e localização.
            </p>
          </div>
          <a
            href={facebookSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-black font-bold py-3 px-6 rounded-xl text-sm w-full sm:w-auto"
            style={{ background: AMBER }}
          >
            <Search className="w-4 h-4" /> Abrir busca no Facebook <ExternalLink className="w-4 h-4" />
          </a>
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
