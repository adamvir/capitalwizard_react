-- ============================================
-- ENABLE REALTIME - AZONNALI JAVÍTÁS
-- ============================================
-- Ezt futtasd le MOST a Supabase SQL Editorban!
-- Ez engedélyezi a real-time frissítéseket az üzenetekhez és online státuszhoz

-- ✅ Enable realtime for messages table (instant message updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ✅ Enable realtime for players table (instant online/offline status)
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;

-- KÉSZ! Most már azonnal látod:
-- 1. Ha a barátod küld neked üzenetet
-- 2. Ha valaki online/offline lesz
