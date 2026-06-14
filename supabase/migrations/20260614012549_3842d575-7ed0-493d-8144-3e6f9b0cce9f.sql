CREATE TABLE public.community_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plataforma text NOT NULL,
  nicho text NOT NULL,
  link text NOT NULL,
  descricao text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.community_groups TO authenticated;
GRANT ALL ON public.community_groups TO service_role;

ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados leem grupos"
ON public.community_groups
FOR SELECT
TO authenticated
USING (true);

CREATE INDEX idx_community_groups_nicho ON public.community_groups (lower(nicho));

INSERT INTO public.community_groups (plataforma, nicho, link, descricao) VALUES
('Telegram', 'Marketing Digital', 'https://t.me/+exemplo1', 'Comunidade ativa de marketing digital com networking diário.'),
('WhatsApp', 'Marketing Digital', 'https://chat.whatsapp.com/exemplo2', 'Grupo de afiliados e produtores de marketing digital.'),
('Discord', 'Marketing Digital', 'https://discord.gg/exemplo3', 'Servidor com canais de tráfego pago, copy e mentoria.'),
('Telegram', 'Saúde e Bem-estar', 'https://t.me/+exemplo4', 'Grupo de profissionais e entusiastas de saúde holística.'),
('WhatsApp', 'Saúde e Bem-estar', 'https://chat.whatsapp.com/exemplo5', 'Comunidade focada em nutrição e hábitos saudáveis.'),
('Telegram', 'Finanças', 'https://t.me/+exemplo6', 'Análises e oportunidades do mercado financeiro.'),
('Discord', 'Finanças', 'https://discord.gg/exemplo7', 'Servidor de investidores iniciantes e avançados.'),
('Telegram', 'Emagrecimento', 'https://t.me/+exemplo8', 'Grupo de apoio e dicas para emagrecimento saudável.'),
('WhatsApp', 'Relacionamento', 'https://chat.whatsapp.com/exemplo9', 'Grupo sobre conquista, autoestima e relacionamentos.'),
('Telegram', 'Desenvolvimento Pessoal', 'https://t.me/+exemplo10', 'Comunidade de alta performance e produtividade.');