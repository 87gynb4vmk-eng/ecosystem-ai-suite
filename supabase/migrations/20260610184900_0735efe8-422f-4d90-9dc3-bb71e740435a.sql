
-- Tabela usuarios (perfil estendido vinculado a auth.users)
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  senha_temporaria TEXT,
  plano TEXT NOT NULL DEFAULT 'mensal' CHECK (plano IN ('mensal', 'vitalicio')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.usuarios TO authenticated;
GRANT ALL ON public.usuarios TO service_role;

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario le seu proprio perfil" ON public.usuarios
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Usuario atualiza seu proprio perfil" ON public.usuarios
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Tabela projetos
CREATE TABLE public.projetos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  nome_negocio TEXT NOT NULL,
  nicho TEXT NOT NULL,
  descricao TEXT,
  paginas_ia JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projetos_usuario ON public.projetos(usuario_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.projetos TO authenticated;
GRANT ALL ON public.projetos TO service_role;

ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario gerencia seus projetos" ON public.projetos
  FOR ALL TO authenticated
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);
