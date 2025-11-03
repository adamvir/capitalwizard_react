-- ============================================
-- Széria Pont (Streak Freeze) Mező Hozzáadása
-- ============================================
-- Futtasd ezt a Supabase SQL Editor-ban
-- https://app.supabase.com -> SQL Editor -> New query

-- 1. Adj hozzá új mezőt a players táblához
ALTER TABLE players
ADD COLUMN IF NOT EXISTS streak_freezes INTEGER DEFAULT 0;

-- 2. Ellenőrzés: Nézd meg az összes játékos streak_freezes értékét
SELECT id, username, streak_freezes
FROM players
LIMIT 10;
