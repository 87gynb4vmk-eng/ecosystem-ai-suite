import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      const next = typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}${window.location.hash}`
        : location.href;
      throw redirect({
        to: "/auth",
        search: { next },
      });
    }

    const { data: usuario } = await supabase
      .from("usuarios")
      .select("trocar_senha_obrigatorio, status, acesso_ate")
      .eq("id", data.user.id)
      .single();

    if (usuario?.trocar_senha_obrigatorio) {
      throw redirect({ to: "/primeiro-acesso" });
    }

    if (usuario?.status === "inativo" || usuario?.status === "cancelado") {
      throw redirect({ to: "/renovar" });
    }

    if (usuario?.acesso_ate && new Date(usuario.acesso_ate) < new Date()) {
      throw redirect({ to: "/renovar" });
    }

    return { user: data.user };
  },
  component: () => <Outlet />,
});
