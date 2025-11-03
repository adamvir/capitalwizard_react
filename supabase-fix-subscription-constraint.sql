-- ============================================
-- FIX: Subscription Type Constraint Frissítés
-- ============================================
-- Futtasd ezt a Supabase SQL Editor-ban
-- https://app.supabase.com -> SQL Editor -> New query

-- 1. Töröld a régi constraint-et
ALTER TABLE players
DROP CONSTRAINT IF EXISTS players_subscription_type_check;

-- 2. Adj hozzá új constraint-et a helyes értékekkel ('free', 'pro', 'master')
ALTER TABLE players
ADD CONSTRAINT players_subscription_type_check
CHECK (subscription_type IN ('free', 'pro', 'master'));

-- 3. Frissítsd a meglévő értékeket (ha vannak 'premium' vagy 'vip' értékek)
UPDATE players
SET subscription_type = 'pro'
WHERE subscription_type = 'premium';

UPDATE players
SET subscription_type = 'master'
WHERE subscription_type = 'vip';

-- 4. Ellenőrzés: Nézd meg az összes subscription_type értéket
SELECT subscription_type, COUNT(*) as count
FROM players
GROUP BY subscription_type;
