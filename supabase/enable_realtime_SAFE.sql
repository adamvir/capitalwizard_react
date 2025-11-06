-- ============================================
-- ENABLE REALTIME - BIZTONSÁGOS VERZIÓ
-- ============================================
-- Használd ezt, ha a táblák már léteznek!
-- Ez először eltávolítja, majd újra hozzáadja a táblákat a realtime publikációhoz

-- ✅ Enable realtime for messages table (instant chat updates)
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ✅ Enable realtime for players table (instant online/offline status)
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;

-- ✅ KÉSZ! Most már valós időben működik minden!
