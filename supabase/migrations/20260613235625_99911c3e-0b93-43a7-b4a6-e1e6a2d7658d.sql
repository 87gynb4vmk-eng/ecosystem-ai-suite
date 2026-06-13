CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ebook_id uuid NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  usuario_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'processando',
  render_id text,
  video_url text,
  erro text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario gerencia seus videos"
ON public.videos FOR ALL TO authenticated
USING (auth.uid() = usuario_id) WITH CHECK (auth.uid() = usuario_id);

CREATE INDEX idx_videos_ebook ON public.videos(ebook_id);
CREATE INDEX idx_videos_render ON public.videos(render_id);

CREATE TRIGGER trg_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();