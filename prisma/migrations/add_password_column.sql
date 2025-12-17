-- Add password column to User table
-- Run this SQL directly in your Supabase SQL editor if prisma db push is too slow

ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "password" TEXT;


