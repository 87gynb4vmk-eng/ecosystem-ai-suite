-- Tabela de pedidos/histórico de compras
CREATE TABLE public.pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  plano text NOT NULL CHECK (plano IN ('mensal', 'vitalicio')),
  valor numeric,
  status text NOT NULL DEFAULT 'aprovado' CHECK (status IN ('aprovado', 'cancelado', 'reembolsado', 'pendente')),
  gateway text NOT NULL DEFAULT 'cakto',
  gateway_event_id text,
  produto_nome text,
  email_enviado boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.pedidos TO authenticated;
GRANT ALL ON public.pedidos TO service_role;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON public.pedidos
  FOR SELECT TO authenticated USING (auth.uid() = usuario_id);

CREATE POLICY "Service role can manage orders" ON public.pedidos
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Adiciona colunas de controle na tabela usuarios
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'cancelado')),
  ADD COLUMN IF NOT EXISTS acesso_ate timestamp with time zone,
  ADD COLUMN IF NOT EXISTS trocar_senha_obrigatorio boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ebooks_gerados_mes integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS videos_gerados_mes integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paginas_publicadas_total integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();

-- Trigger para updated_at em usuarios
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_usuarios_updated_at ON public.usuarios;
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pedidos_updated_at ON public.pedidos;
CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON public.pedidos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();