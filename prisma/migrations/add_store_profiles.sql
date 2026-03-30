-- Store profiles for per-user business defaults
-- Compatible with current app auth model (public."User".id text)

CREATE TABLE IF NOT EXISTS store_profiles (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id text NOT NULL UNIQUE REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  store_name text NOT NULL,
  category text NOT NULL,
  store_address text,
  store_phone text,
  store_hours text,
  store_off_day text,
  store_menu jsonb,
  store_feature text,
  store_intro text,
  store_link text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS store_profiles_user_id_idx ON store_profiles (user_id);

-- RLS
ALTER TABLE store_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "본인 프로필만 접근" ON store_profiles;
CREATE POLICY "본인 프로필만 접근"
  ON store_profiles
  FOR ALL
  USING (
    user_id = current_setting('request.jwt.claim.sub', true)
  )
  WITH CHECK (
    user_id = current_setting('request.jwt.claim.sub', true)
  );

