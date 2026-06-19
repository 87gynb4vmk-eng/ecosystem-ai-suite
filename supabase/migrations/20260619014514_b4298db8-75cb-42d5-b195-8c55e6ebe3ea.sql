REVOKE UPDATE ON public.usuarios FROM authenticated;
GRANT UPDATE (email) ON public.usuarios TO authenticated;
GRANT ALL ON public.usuarios TO service_role;

DROP POLICY IF EXISTS "Usuario atualiza seu proprio perfil" ON public.usuarios;
CREATE POLICY "Usuario atualiza seu proprio perfil"
ON public.usuarios
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND email IS NOT NULL
  AND plano IN ('mensal', 'vitalicio')
);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;