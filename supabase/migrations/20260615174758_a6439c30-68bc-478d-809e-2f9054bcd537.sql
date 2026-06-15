
-- 1) Hide senha_temporaria from authenticated; service role still reads it
REVOKE SELECT (senha_temporaria) ON public.usuarios FROM authenticated;
REVOKE UPDATE (senha_temporaria) ON public.usuarios FROM authenticated;

-- 2) Webhook token on videos
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS webhook_token text;

-- 3) user_roles: explicit deny for self-management (only service_role can manage)
DROP POLICY IF EXISTS "Deny insert user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Deny update user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Deny delete user_roles" ON public.user_roles;
CREATE POLICY "Deny insert user_roles" ON public.user_roles FOR INSERT TO authenticated, anon WITH CHECK (false);
CREATE POLICY "Deny update user_roles" ON public.user_roles FOR UPDATE TO authenticated, anon USING (false) WITH CHECK (false);
CREATE POLICY "Deny delete user_roles" ON public.user_roles FOR DELETE TO authenticated, anon USING (false);
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated, anon;

-- 4) Lock down SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- has_role must remain callable by authenticated (used inside RLS policies)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
