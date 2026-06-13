import { createFileRoute, notFound } from "@tanstack/react-router";
import { LandingPageTemplate } from "@/components/LandingPageTemplate";
import { obterEbookPublico } from "@/lib/ebooks.functions";

export const Route = createFileRoute("/view-page/$id")({
  ssr: true,
  loader: async ({ params }) => {
    const res = await obterEbookPublico({ data: { id: params.id } });
    if (!res.ok || !res.ebook) throw notFound();
    return res.ebook;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.titulo },
          { name: "description", content: loaderData.subtitulo },
          { property: "og:title", content: loaderData.titulo },
          { property: "og:description", content: loaderData.subtitulo },
        ]
      : [{ title: "Página de vendas" }],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <p className="text-zinc-400">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <p className="text-zinc-400">Página não encontrada.</p>
    </div>
  ),
  component: ViewPage,
});

function ViewPage() {
  const ebook = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-black p-0 sm:p-6">
      <div className="max-w-xl mx-auto">
        <LandingPageTemplate
          titulo={ebook.titulo}
          subtitulo={ebook.subtitulo}
          nicho={ebook.subnicho || ebook.nicho}
          price="29,90"
          affiliateLink={ebook.affiliate_link ?? ""}
        />
      </div>
    </div>
  );
}
