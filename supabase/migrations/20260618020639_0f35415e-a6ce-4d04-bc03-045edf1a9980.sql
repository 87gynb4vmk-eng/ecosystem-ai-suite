-- Revoga UPDATE amplo e concede apenas na coluna email
REVOKE UPDATE ON public.usuarios FROM authenticated;
GRANT UPDATE (email) ON public.usuarios TO authenticated;

-- Reforça com WITH CHECK para evitar qualquer brecha futura
DROP POLICY IF EXISTS "Usuario atualiza seu proprio perfil" ON public.usuarios;
CREATE POLICY "Usuario atualiza seu proprio perfil"
ON public.usuarios
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);