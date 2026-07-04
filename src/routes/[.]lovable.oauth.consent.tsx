import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type AuthOauthClient = {
  getAuthorizationDetails: (
    authorizationId: string,
  ) => Promise<{
    data: {
      client?: { name?: string } | null;
      redirect_url?: string;
      redirect_to?: string;
    } | null;
    error: { message: string } | null;
  }>;
  approveAuthorization: (
    authorizationId: string,
  ) => Promise<{ data: { redirect_url?: string; redirect_to?: string } | null; error: { message: string } | null }>;
  denyAuthorization: (
    authorizationId: string,
  ) => Promise<{ data: { redirect_url?: string; redirect_to?: string } | null; error: { message: string } | null }>;
};

function oauth(): AuthOauthClient {
  return (supabase.auth as unknown as { oauth: AuthOauthClient }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) throw redirect({ to: "/auth", search: { next } });
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="min-h-screen flex items-center justify-center px-6 text-center">
      <p>Could not load this authorization request: {String((error as Error)?.message ?? error)}</p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an app";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-dark px-6">
      <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-luxury text-center">
        <h1 className="text-2xl font-bold mb-3">Connect {clientName} to your account</h1>
        <p className="text-sm text-muted-foreground mb-6">
          This lets {clientName} access your Alevi.ai e-books as you.
        </p>
        {error && (
          <p role="alert" className="text-sm text-destructive mb-4">
            {error}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            disabled={busy}
            onClick={() => decide(false)}
            className="rounded-md border border-input px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            Deny
          </button>
          <button
            disabled={busy}
            onClick={() => decide(true)}
            className="rounded-md bg-gradient-gold px-4 py-2.5 text-sm font-semibold text-gold-foreground shadow-gold-glow disabled:opacity-60"
          >
            Approve
          </button>
        </div>
      </div>
    </main>
  );
}
