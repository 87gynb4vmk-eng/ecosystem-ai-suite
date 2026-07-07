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

  EXECUTE format(
    'UPDATE public.usuarios SET %I = %I + 1 WHERE id = $1',
    p_column,
    p_column
  ) USING p_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_counter(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_counter(uuid, text) TO service_role;