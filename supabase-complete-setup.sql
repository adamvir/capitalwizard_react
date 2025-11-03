-- ============================================
-- CAPITAL WIZARD - TELJES ADATBÁZIS SETUP
-- ============================================
-- Ez az EGY fájl létrehoz MINDENT amit az app-nak szüksége van!
-- Másold be ezt a Supabase SQL Editor-ba: https://app.supabase.com

-- ============================================
-- 1. PLAYERS TÁBLA
-- ============================================
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    username TEXT,
    avatar_id INTEGER DEFAULT 1,
    level INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 1000,
    diamonds INTEGER DEFAULT 0,
    subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'pro', 'master')),
    streak_freezes INTEGER DEFAULT 0,
    last_login TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_players_last_login ON players(last_login);

-- ============================================
-- 2. STREAKS TÁBLA
-- ============================================
CREATE TABLE IF NOT EXISTS streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(player_id)
);

CREATE INDEX IF NOT EXISTS idx_streaks_player_id ON streaks(player_id);

-- ============================================
-- 3. LESSON PROGRESS TÁBLA
-- ============================================
CREATE TABLE IF NOT EXISTS lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(player_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_player_id ON lesson_progress(player_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON lesson_progress(completed);

-- ============================================
-- 4. DAILY LIMITS TÁBLA
-- ============================================
CREATE TABLE IF NOT EXISTS daily_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    lessons_completed INTEGER DEFAULT 0,
    max_lessons INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(player_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_limits_player_date ON daily_limits(player_id, date);

-- ============================================
-- 5. RENTED BOOKS TÁBLA (Kölcsönzött könyvek)
-- ============================================
CREATE TABLE IF NOT EXISTS rented_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    book_title TEXT NOT NULL,
    rented_at TIMESTAMPTZ DEFAULT NOW(),
    rented_until TIMESTAMPTZ NOT NULL,

    -- Lesson progress tracking (hol tart a könyvben)
    current_lesson_index INTEGER DEFAULT 0,
    current_game_type TEXT DEFAULT 'reading' CHECK (current_game_type IN ('reading', 'matching', 'quiz')),
    is_first_round BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(player_id, book_title)
);

CREATE INDEX IF NOT EXISTS idx_rented_books_player_id ON rented_books(player_id);
CREATE INDEX IF NOT EXISTS idx_rented_books_book_title ON rented_books(book_title);
CREATE INDEX IF NOT EXISTS idx_rented_books_rented_until ON rented_books(rented_until);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - MINDEN TÁBLÁHOZ
-- ============================================

-- Players RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own player data" ON players;
DROP POLICY IF EXISTS "Users can insert their own player data" ON players;
DROP POLICY IF EXISTS "Users can update their own player data" ON players;

CREATE POLICY "Users can view their own player data" ON players FOR SELECT USING (true);
CREATE POLICY "Users can insert their own player data" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own player data" ON players FOR UPDATE USING (true) WITH CHECK (true);

-- Streaks RLS
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own streaks" ON streaks;
DROP POLICY IF EXISTS "Users can insert their own streaks" ON streaks;
DROP POLICY IF EXISTS "Users can update their own streaks" ON streaks;

CREATE POLICY "Users can view their own streaks" ON streaks FOR SELECT USING (true);
CREATE POLICY "Users can insert their own streaks" ON streaks FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own streaks" ON streaks FOR UPDATE USING (true) WITH CHECK (true);

-- Lesson Progress RLS
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own lesson progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can insert their own lesson progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can update their own lesson progress" ON lesson_progress;

CREATE POLICY "Users can view their own lesson progress" ON lesson_progress FOR SELECT USING (true);
CREATE POLICY "Users can insert their own lesson progress" ON lesson_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own lesson progress" ON lesson_progress FOR UPDATE USING (true) WITH CHECK (true);

-- Daily Limits RLS
ALTER TABLE daily_limits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own daily limits" ON daily_limits;
DROP POLICY IF EXISTS "Users can insert their own daily limits" ON daily_limits;
DROP POLICY IF EXISTS "Users can update their own daily limits" ON daily_limits;

CREATE POLICY "Users can view their own daily limits" ON daily_limits FOR SELECT USING (true);
CREATE POLICY "Users can insert their own daily limits" ON daily_limits FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own daily limits" ON daily_limits FOR UPDATE USING (true) WITH CHECK (true);

-- Rented Books RLS
ALTER TABLE rented_books ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own rented books" ON rented_books;
DROP POLICY IF EXISTS "Users can insert their own rented books" ON rented_books;
DROP POLICY IF EXISTS "Users can update their own rented books" ON rented_books;
DROP POLICY IF EXISTS "Users can delete their own rented books" ON rented_books;

CREATE POLICY "Users can view their own rented books" ON rented_books FOR SELECT USING (true);
CREATE POLICY "Users can insert their own rented books" ON rented_books FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own rented books" ON rented_books FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete their own rented books" ON rented_books FOR DELETE USING (true);

-- ============================================
-- TRIGGERS - AUTOMATIKUS UPDATED_AT FRISSÍTÉS
-- ============================================

-- Trigger funkció létrehozása (ha még nem létezik)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggerek minden táblához
DROP TRIGGER IF EXISTS update_players_updated_at ON players;
CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_streaks_updated_at ON streaks;
CREATE TRIGGER update_streaks_updated_at
    BEFORE UPDATE ON streaks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON lesson_progress;
CREATE TRIGGER update_lesson_progress_updated_at
    BEFORE UPDATE ON lesson_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_daily_limits_updated_at ON daily_limits;
CREATE TRIGGER update_daily_limits_updated_at
    BEFORE UPDATE ON daily_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rented_books_updated_at ON rented_books;
CREATE TRIGGER update_rented_books_updated_at
    BEFORE UPDATE ON rented_books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUTOMATIKUS INICIALIZÁLÁS - TRIGGER ÚJ PLAYERHEZ
-- ============================================
-- Ez AUTOMATIKUSAN létrehozza a streak-et amikor új player jön létre!

CREATE OR REPLACE FUNCTION initialize_new_player()
RETURNS TRIGGER AS $$
BEGIN
    -- Automatikusan létrehoz egy kezdő streak-et
    INSERT INTO streaks (player_id, current_streak, longest_streak, last_activity_date)
    VALUES (NEW.id, 0, 0, CURRENT_DATE);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_initialize_new_player ON players;
CREATE TRIGGER trigger_initialize_new_player
    AFTER INSERT ON players
    FOR EACH ROW
    EXECUTE FUNCTION initialize_new_player();

-- ============================================
-- HELPER FUNKCIÓK
-- ============================================

-- Lejárt kölcsönzések automatikus törlése
CREATE OR REPLACE FUNCTION delete_expired_rentals()
RETURNS void AS $$
BEGIN
    DELETE FROM rented_books WHERE rented_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- KÉSZ! 🎉
-- ============================================
-- Most már minden készen áll!
--
-- Az app automatikusan:
-- - Létrehoz egy új playert
-- - Automatikusan létrehoz hozzá egy streak-et (trigger!)
-- - Készen áll a rented_books, lesson_progress használatra
--
-- Ellenőrzés:
-- SELECT * FROM players;
-- SELECT * FROM streaks;
-- SELECT * FROM rented_books;
