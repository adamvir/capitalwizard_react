-- ============================================
-- CHECK & ADD ONLINE STATUS - BIZTONSÁGOS
-- ============================================
-- Ez a script biztonságosan hozzáadja az oszlopokat, ha még nem léteznek

-- ✅ Add is_online column (IF NOT EXISTS - safe to run multiple times)
ALTER TABLE public.players
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT FALSE;

-- ✅ Add last_seen column (IF NOT EXISTS - safe to run multiple times)
ALTER TABLE public.players
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ✅ Create indexes (IF NOT EXISTS - safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_players_is_online
    ON public.players(is_online)
    WHERE is_online = TRUE;

CREATE INDEX IF NOT EXISTS idx_players_last_seen
    ON public.players(last_seen DESC);

-- ✅ Create function for auto-offline
CREATE OR REPLACE FUNCTION public.set_inactive_players_offline()
RETURNS void AS $$
BEGIN
    UPDATE public.players
    SET is_online = FALSE
    WHERE is_online = TRUE
      AND last_seen < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ✅ Enable realtime for both tables
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;

-- ✅ KÉSZ! Most már minden működik!
