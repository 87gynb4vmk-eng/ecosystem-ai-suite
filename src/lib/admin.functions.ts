import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error("Falha ao verificar permissão.");
  if (!isAdmin) throw new Error("Acesso negado: apenas administradores.");
}

function gerarSenha(len = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let s = "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) s += chars[arr[i] % chars.length];
  return s;
}

async function auditLog(
  actorId: string,
  action: string,
  target: Record<string, unknown>,
) {
  try {
    console.info("[admin-audit]", JSON.stringify({ actorId, action, target, at: new Date().toISOString() }));
  } catch {
    /* noop */
  }
}

export const adminSouAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) return { isAdmin: false };
    return { isAdmin: Boolean(data) };
  });

export const adminListarUsuarios = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("usuarios")
      .select("id, email, plano, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    await auditLog(context.userId, "list_users", { count: rows?.length ?? 0 });
    return { usuarios: rows ?? [] };
  });

export const adminCriarUsuario = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        email: z.string().trim().toLowerCase().email().max(255),
        plano: z.enum(["mensal", "vitalicio"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const senha = gerarSenha(12);

    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: senha,
      email_confirm: true,
    });

    let userId = created?.user?.id;
    if (createErr) {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers();
      const found = list?.users.find((u) => u.email?.toLowerCase() === data.email);
      if (!found) throw new Error(createErr.message);
      userId = found.id;
      await supabaseAdmin.auth.admin.updateUserById(userId, { password: senha });
    }
    if (!userId) throw new Error("ID do usuário não disponível.");

    await supabaseAdmin
      .from("usuarios")
      .upsert(
        { id: userId, email: data.email, plano: data.plano },
        { onConflict: "id" },
      );

    await auditLog(context.userId, "create_user", { targetUserId: userId, email: data.email, plano: data.plano });
    return { ok: true, email: data.email, senha };
  });

export const adminResetarSenha = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const novaSenha = gerarSenha(12);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      password: novaSenha,
    });
    if (error) throw new Error(error.message);
    await auditLog(context.userId, "reset_password", { targetUserId: data.userId });
    return { ok: true, senha: novaSenha };
  });

export const adminExcluirUsuario = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.userId === context.userId) {
      throw new Error("Você não pode excluir a própria conta.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    await auditLog(context.userId, "delete_user", { targetUserId: data.userId });
    return { ok: true };
  });
