-- ============================================
-- ENABLE ANONYMOUS AUTHENTICATION
-- ============================================
-- Engedélyezi az anonymous login-t a Supabase-ben
-- Ez megakadályozza a player duplikációt!
--
-- HASZNÁLAT:
-- 1. Másold be ezt a kódot a Supabase SQL editorba
-- 2. Futtasd le
--
-- VAGY
-- Ha van Supabase CLI:
-- supabase db push

-- ============================================
-- MAGYARÁZAT
-- ============================================
-- Az anonymous auth automatikusan:
-- ✅ Perzisztens session-t tárol
-- ✅ Egyedi user ID-t generál (UUID)
-- ✅ Refresh token-t kezel
-- ✅ NEM ENGEDI A DUPLIKÁCIÓT!
--
-- Ha az AsyncStorage törlődik, a session továbbra is megmarad
-- a Supabase-ben, így nem jön létre új player.

-- ============================================
-- ENABLE ANONYMOUS SIGN-INS
-- ============================================
-- FONTOS: Ezt NEM SQL-ben, hanem a Supabase Dashboard-on kell beállítani!
-- https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/providers
--
-- 1. Menj az Auth > Providers szekcióba
-- 2. Görgess le az "Email" részhez
-- 3. Kapcsold BE az "Enable anonymous sign-ins" opciót
-- 4. Kattints a "Save" gombra

-- ============================================
-- ELLENŐRZÉS - PLAYERS TABLE
-- ============================================
-- Ellenőrizd, hogy a players.id mező UUID típusú-e
-- (Ez már alapból így van beállítva, nem kell módosítani!)

-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'players' AND column_name = 'id';

-- Ha UUID típusú → Minden rendben! ✅
-- Ha nem UUID típusú → Manuálisan kell átállítani

-- ============================================
-- MEGJEGYZÉS
-- ============================================
-- A players tábla id mezője már UUID típusú, így kompatibilis
-- a Supabase auth user_id-val. Nem kell módosítani a táblát!
-- Csak a Dashboard-on kell engedélyezni az anonymous auth-ot.

-- ============================================
-- MANUAL DASHBOARD STEPS
-- ============================================
-- FONTOS: Ezt kézileg kell megcsinálni a Supabase Dashboard-on!
--
-- 1. Menj ide: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/providers
-- 2. Keresd meg az "Email" provider-t
-- 3. Görgess le és kapcsold BE: "Enable anonymous sign-ins"
-- 4. Kattints a "Save" gombra
--
-- VAGY használd a Supabase CLI-t:
-- supabase auth update --enable-anonymous-sign-ins=true
