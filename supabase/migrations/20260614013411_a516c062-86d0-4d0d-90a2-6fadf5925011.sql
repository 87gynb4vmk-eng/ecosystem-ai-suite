ALTER TABLE public.community_groups
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS community_groups_nicho_active_idx
  ON public.community_groups (lower(nicho)) WHERE is_active;