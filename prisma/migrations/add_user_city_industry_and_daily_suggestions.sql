-- Add User.city / User.industry (Supabase production safe)
-- NOTE: This project uses manual SQL migrations (not Prisma migrate).

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "city" TEXT;

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "industry" TEXT;

-- Backfill default city for existing users
UPDATE "User"
SET "city" = COALESCE("city", '서울')
WHERE "city" IS NULL;

-- Optional: set default for new rows (Postgres default)
ALTER TABLE "User"
  ALTER COLUMN "city" SET DEFAULT '서울';

-- DailySuggestion cache table (for today's recommended post feature)
CREATE TABLE IF NOT EXISTS "DailySuggestion" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "city" TEXT NOT NULL,
  "weather" TEXT NOT NULL,
  "suggestion" TEXT NOT NULL,
  "regenerateCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

-- Foreign key to User
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'DailySuggestion_userId_fkey'
  ) THEN
    ALTER TABLE "DailySuggestion"
      ADD CONSTRAINT "DailySuggestion_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Index for (userId, date)
CREATE INDEX IF NOT EXISTS "daily_suggestions_user_date_idx"
  ON "DailySuggestion" ("userId", "date");

