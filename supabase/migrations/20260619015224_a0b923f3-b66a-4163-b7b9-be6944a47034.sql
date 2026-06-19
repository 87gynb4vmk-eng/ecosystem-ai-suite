CREATE TABLE IF NOT EXISTS public.video_webhook_tokens (
  video_id uuid PRIMARY KEY REFERENCES public.videos(id) ON DELETE CASCADE,
  token text NOT NULL CHECK (length(token) >= 32),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.video_webhook_tokens TO service_role;
ALTER TABLE public.video_webhook_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny select video webhook tokens" ON public.video_webhook_tokens;
CREATE POLICY "Deny select video webhook tokens"
ON public.video_webhook_tokens
FOR SELECT
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "Deny insert video webhook tokens" ON public.video_webhook_tokens;
CREATE POLICY "Deny insert video webhook tokens"
ON public.video_webhook_tokens
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "Deny update video webhook tokens" ON public.video_webhook_tokens;
CREATE POLICY "Deny update video webhook tokens"
ON public.video_webhook_tokens
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Deny delete video webhook tokens" ON public.video_webhook_tokens;
CREATE POLICY "Deny delete video webhook tokens"
ON public.video_webhook_tokens
FOR DELETE
TO anon, authenticated
USING (false);

INSERT INTO public.video_webhook_tokens (video_id, token)
SELECT id, webhook_token
FROM public.videos
WHERE webhook_token IS NOT NULL
ON CONFLICT (video_id) DO UPDATE SET token = EXCLUDED.token;

ALTER TABLE public.videos DROP COLUMN IF EXISTS webhook_token;

DROP POLICY IF EXISTS "Deny insert usuarios" ON public.usuarios;
CREATE POLICY "Deny insert usuarios"
ON public.usuarios
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "Deny update usuarios" ON public.usuarios;
CREATE POLICY "Deny update usuarios"
ON public.usuarios
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Deny delete usuarios" ON public.usuarios;
CREATE POLICY "Deny delete usuarios"
ON public.usuarios
FOR DELETE
TO anon, authenticated
USING (false);