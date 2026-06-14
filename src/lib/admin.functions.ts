import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PasswordSchema = z.string().min(1).max(200);

function checkPassword(provided: string) {
  const expected = process.env.ADMIN_MASTER_PASSWORD;
  if (!expected) throw new Error("Senha mestra não configurada no servidor.");
  if (provided !== expected) throw new Error("Senha incorreta.");
}

function gerarSenha(len = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let s = "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) s += chars[arr[i] % chars.length];
  return s;
}

export const adminVerificarSenha = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ senha: PasswordSchema }).parse(d))
  .handler(async ({ data }) => {
    checkPassword(data.senha);
    return { ok: true };
  });

export const adminListarUsuarios = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ senha: PasswordSchema }).parse(d))
  .handler(async ({ data }) => {
    checkPassword(data.senha);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("usuarios")
      .select("id, email, plano, senha_temporaria, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { usuarios: rows ?? [] };
  });

export const adminCriarUsuario = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        senha: PasswordSchema,
        email: z.string().trim().toLowerCase().email().max(255),
        plano: z.enum(["mensal", "vitalicio"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    checkPassword(data.senha);
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
        { id: userId, email: data.email, senha_temporaria: senha, plano: data.plano },
        { onConflict: "id" },
      );

    return { ok: true, email: data.email, senha };
  });

export const adminResetarSenha = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ senha: PasswordSchema, userId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    checkPassword(data.senha);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const novaSenha = gerarSenha(12);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      password: novaSenha,
    });
    if (error) throw new Error(error.message);
    await supabaseAdmin
      .from("usuarios")
      .update({ senha_temporaria: novaSenha })
      .eq("id", data.userId);
    return { ok: true, senha: novaSenha };
  });

export const adminExcluirUsuario = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ senha: PasswordSchema, userId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    checkPassword(data.senha);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
