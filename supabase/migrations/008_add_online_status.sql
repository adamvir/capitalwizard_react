-- ============================================
-- ADD ONLINE STATUS TO PLAYERS TABLE
-- ============================================
-- Játékos online/offline státusz követése
--
-- HASZNÁLAT:
-- 1. Másold be ezt a kódot a Supabase SQL editorba
-- 2. Futtasd le
--
-- VAGY
-- Ha van Supabase CLI:
-- supabase db push

-- ============================================
-- ADD COLUMNS
-- ============================================

-- Add is_online column (TRUE = online, FALSE = offline)
ALTER TABLE public.players
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT FALSE;

-- Add last_seen column (timestamp of last activity)
ALTER TABLE public.players
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================
-- CREATE INDEX
-- ============================================

-- Index for querying online players
CREATE INDEX IF NOT EXISTS idx_players_is_online
    ON public.players(is_online)
    WHERE is_online = TRUE;

-- Index for last_seen
CREATE INDEX IF NOT EXISTS idx_players_last_seen
    ON public.players(last_seen DESC);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON COLUMN public.players.is_online IS 'Játékos online státusza (TRUE = online, FALSE = offline)';
COMMENT ON COLUMN public.players.last_seen IS 'Utolsó aktivitás időpontja';

-- ============================================
-- FUNCTION TO AUTO-SET OFFLINE AFTER TIMEOUT
-- ============================================
-- Ez a függvény automatikusan offline-ra állítja azokat a játékosokat,
-- akik több mint 5 percig nem voltak aktívak

CREATE OR REPLACE FUNCTION public.set_inactive_players_offline()
RETURNS void AS $$
BEGIN
    UPDATE public.players
    SET is_online = FALSE
    WHERE is_online = TRUE
      AND last_seen < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT SELECT, UPDATE ON public.players TO authenticated;
GRANT SELECT, UPDATE ON public.players TO anon;

-- ============================================
-- ENABLE REALTIME
-- ============================================
-- ✅ CRITICAL: Enable realtime for instant online/offline status updates!
-- Note: If players table is already in publication, this will error but it's safe to ignore
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
