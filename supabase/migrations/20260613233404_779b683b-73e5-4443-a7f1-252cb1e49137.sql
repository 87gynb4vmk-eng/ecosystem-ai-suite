CREATE TABLE public.ebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nicho text NOT NULL,
  subnicho text NOT NULL,
  titulo text NOT NULL,
  subtitulo text NOT NULL,
  conteudo text NOT NULL,
  affiliate_link text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ebooks TO authenticated;
GRANT ALL ON public.ebooks TO service_role;

ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario gerencia seus ebooks"
  ON public.ebooks
  FOR ALL
  TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

CREATE INDEX ebooks_usuario_id_created_at_idx ON public.ebooks (usuario_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_ebooks_updated_at
  BEFORE UPDATE ON public.ebooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();