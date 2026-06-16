import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listarGruposDoMeuNicho } from "@/lib/grupos.functions";
import { Search, Loader2, ArrowLeft, Facebook, MessageCircle, Send, ExternalLink } from "lucide-react";

const PLATAFORMA_STYLE: Record<string, { color: string; bg: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  WhatsApp: { color: "#25D366", bg: "#25D36620", icon: MessageCircle },
  Telegram: { color: "#229ED9", bg: "#229ED920", icon: Send },
  Facebook: { color: "#1877F2", bg: "#1877F220", icon: Facebook },
  Discord: { color: "#5865F2", bg: "#5865F220", icon: MessageCircle },
};

const AMBER = "#f59e0b";

type Grupo = { id: string; plataforma: string; nicho: string; link: string; descricao: string };

function Card({
  icon,
  iconBg,
  title,
  subtitle,
  href,
  cta = "Entrar",
  ctaStyle,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  href: string;
  cta?: string;
  ctaStyle?: React.CSSProperties;
}) {
  return (
    <div className="flex items-center gap-4 border border-zinc-800 bg-zinc-900/40 rounded-2xl p-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-zinc-100 font-semibold text-sm truncate">{title}</h3>
        <p className="text-xs text-zinc-500 truncate">{subtitle}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-black font-bold py-2 px-4 rounded-lg text-xs shrink-0"
        style={ctaStyle ?? { background: AMBER }}
      >
        {cta}
      </a>
    </div>
  );
}

export function Etapa5Grupos({ onBack }: { onBack: () => void }) {
  const fetchGrupos = useServerFn(listarGruposDoMeuNicho);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["grupos-meu-nicho"],
    queryFn: () => fetchGrupos(),
  });

  const facebookSearchUrl = data?.nicho
    ? `https://www.facebook.com/search/groups/?q=${encodeURIComponent(data.nicho)}`
    : null;
  const whatsappGroups: Grupo[] = (data?.grupos ?? []) as Grupo[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Grupos do seu nicho</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Comunidades selecionadas para
          {data?.nicho ? <> <span style={{ color: AMBER }}>{data.nicho}</span></> : " o seu nicho"}.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-zinc-400 py-20 justify-center">
          <Loader2 className="w-5 h-5 animate-spin" /> Carregando...
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

      {!isLoading && !isError && data && !data.nicho && (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-3xl px-6">
          <Search className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <p className="text-zinc-300 font-semibold">
            Nenhum e-book encontrado no seu perfil.
          </p>
          <p className="text-sm text-zinc-500 mt-2">
            Crie um e-book primeiro para que o sistema identifique o seu nicho.
          </p>
        </div>
      )}

      {!isLoading && !isError && data?.nicho && (
        <div className="space-y-3">
          {whatsappGroups.length === 0 && (
            <div className="border border-zinc-800 bg-zinc-900/20 rounded-2xl p-4 text-sm text-zinc-400">
              Ainda não temos grupos fixos para esse nicho. Use a busca do Facebook abaixo.
            </div>
          )}

          {whatsappGroups.map((g) => {
            const style = PLATAFORMA_STYLE[g.plataforma] ?? PLATAFORMA_STYLE.WhatsApp;
            const Icon = style.icon;
            return (
              <Card
                key={g.id}
                icon={<Icon className="w-6 h-6" style={{ color: style.color }} />}
                iconBg={style.bg}
                title={g.descricao}
                subtitle={`${g.plataforma} · ${g.nicho}`}
                href={g.link}
              />
            );
          })}

          {facebookSearchUrl && (
            <Card
              icon={<Facebook className="w-6 h-6" style={{ color: "#1877F2" }} />}
              iconBg="#1877F220"
              title={`Buscar mais grupos de ${data.nicho} no Facebook`}
              subtitle="Facebook · resultados ao vivo"
              href={facebookSearchUrl}
            />
          )}
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
