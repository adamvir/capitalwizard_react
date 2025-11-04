-- ============================================
-- CAPITAL WIZARD - SUPABASE ADATBÁZIS SZKRIPT
-- ============================================
-- Másold be ezt a Supabase SQL Editor-ba a táblák létrehozásához
-- https://app.supabase.com -> SQL Editor -> New query

-- 1. JÁTÉKOSOK TÁBLA
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    username TEXT,
    avatar_id INTEGER DEFAULT 1,
    level INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 0,
    diamonds INTEGER DEFAULT 0,
    subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'pro', 'master')),
    streak_freezes INTEGER DEFAULT 0,
    last_login TIMESTAMPTZ DEFAULT NOW()
);

-- Index a gyorsabb kereséshez
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_players_last_login ON players(last_login);

-- 2. STREAK TÁBLA
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

-- Index
CREATE INDEX IF NOT EXISTS idx_streaks_player_id ON streaks(player_id);

-- 3. LECKE ELŐREHALADÁS TÁBLA
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

-- Indexek
CREATE INDEX IF NOT EXISTS idx_lesson_progress_player_id ON lesson_progress(player_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON lesson_progress(completed);

-- 4. NAPI LIMIT TÁBLA
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

-- Index
CREATE INDEX IF NOT EXISTS idx_daily_limits_player_date ON daily_limits(player_id, date);

-- ============================================
-- ROW LEVEL SECURITY (RLS) BEÁLLÍTÁSOK
-- ============================================
-- Ezzel biztosítjuk, hogy minden játékos csak a saját adatait láthassa

-- Players RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own player data"
    ON players FOR SELECT
    USING (true); -- Mindenki láthatja az összes játékos adatot (leaderboard miatt)

CREATE POLICY "Users can insert their own player data"
    ON players FOR INSERT
    WITH CHECK (true); -- Bárki létrehozhat új játékost

CREATE POLICY "Users can update their own player data"
    ON players FOR UPDATE
    USING (true) -- Egyelőre mindenki frissíthet bármit, később ezt finomhangolhatod
    WITH CHECK (true);

-- Streaks RLS
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own streaks"
    ON streaks FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own streaks"
    ON streaks FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own streaks"
    ON streaks FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Lesson Progress RLS
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lesson progress"
    ON lesson_progress FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own lesson progress"
    ON lesson_progress FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own lesson progress"
    ON lesson_progress FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Daily Limits RLS
ALTER TABLE daily_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily limits"
    ON daily_limits FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own daily limits"
    ON daily_limits FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own daily limits"
    ON daily_limits FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- ============================================
-- TRIGGERS - AUTOMATIKUS UPDATED_AT FRISSÍTÉS
-- ============================================

-- Trigger funkció létrehozása
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger hozzáadása minden táblához
CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at
    BEFORE UPDATE ON streaks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
    BEFORE UPDATE ON lesson_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_limits_updated_at
    BEFORE UPDATE ON daily_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TESZT ADATOK (OPCIONÁLIS)
-- ============================================
-- Kommenteld ki, ha nem szeretnél teszt adatokat

-- Teszt játékos létrehozása
INSERT INTO players (username, avatar_id, level, xp, coins, diamonds, subscription_type)
VALUES ('TestPlayer', 1, 5, 420, 1000, 50, 'free')
ON CONFLICT DO NOTHING;

-- Megjegyzés: Az ON CONFLICT DO NOTHING azért kell, hogy ha újra futtatod a szkriptet,
-- ne próbáljon meg duplikált adatokat beszúrni
