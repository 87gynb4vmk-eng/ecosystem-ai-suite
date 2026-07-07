CREATE OR REPLACE FUNCTION public.increment_counter(p_user_id uuid, p_column text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF p_column NOT IN ('ebooks_gerados_mes', 'videos_gerados_mes', 'paginas_publicadas_total') THEN
    RAISE EXCEPTION 'Coluna inválida: %', p_column;
  END IF;

  IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Você só pode atualizar seus próprios contadores.';
  END IF;

  EXECUTE format(
    'UPDATE public.usuarios SET %I = %I + 1 WHERE id = $1',
    p_column,
    p_column
  ) USING p_user_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_counter(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.increment_counter(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_counter(uuid, text) TO service_role;