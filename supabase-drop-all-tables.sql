-- ============================================
-- ⚠️ FIGYELEM: EZ TÖRLI AZ ÖSSZES TÁBLÁT! ⚠️
-- ============================================
-- Ez a script törli az összes Capital Wizard táblát
-- MINDEN ADAT ELVÉSZ!
--
-- Csak akkor futtasd, ha:
-- - Teljesen újra akarod kezdeni az adatbázist
-- - Teszt környezetben vagy
-- - Biztosan nincs szükséged a régi adatokra
--
-- Futtasd ezt ELŐTTE: supabase-drop-all-tables.sql
-- Majd UTÁNA: supabase-complete-setup.sql

-- ============================================
-- 1. TRIGGEREK TÖRLÉSE
-- ============================================

DROP TRIGGER IF EXISTS trigger_initialize_new_player ON players;
DROP TRIGGER IF EXISTS update_players_updated_at ON players;
DROP TRIGGER IF EXISTS update_streaks_updated_at ON streaks;
DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON lesson_progress;
DROP TRIGGER IF EXISTS update_daily_limits_updated_at ON daily_limits;
DROP TRIGGER IF EXISTS update_rented_books_updated_at ON rented_books;

-- ============================================
-- 2. FUNKCIÓK TÖRLÉSE
-- ============================================

DROP FUNCTION IF EXISTS initialize_new_player();
DROP FUNCTION IF EXISTS delete_expired_rentals();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- ============================================
-- 3. TÁBLÁK TÖRLÉSE (CASCADE = kapcsolódó adatok is törlődnek)
-- ============================================

-- Fontos: Fordított sorrendben töröljük (child táblák először)
DROP TABLE IF EXISTS rented_books CASCADE;
DROP TABLE IF EXISTS daily_limits CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS streaks CASCADE;
DROP TABLE IF EXISTS players CASCADE;

-- ============================================
-- ✅ KÉSZ!
-- ============================================
-- Az összes tábla törölve.
-- Most futtasd le: supabase-complete-setup.sql
--
-- Ellenőrzés (nem szabad táblákat látni):
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
