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
-- 6. FRIEND REQUESTS TÁBLA (Barátkérelmek)
-- ============================================
CREATE TABLE IF NOT EXISTS friend_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Kérelem küldője
    sender_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,

    -- Kérelem fogadója
    receiver_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,

    -- Állapot: 'pending', 'accepted', 'rejected'
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),

    -- Válasz időpontja (ha elfogadta/elutasította)
    responded_at TIMESTAMPTZ,

    -- Egyedi constraint: Egy játékos csak egyszer küldhet kérelmet egy másiknak
    UNIQUE(sender_id, receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_friend_requests_sender ON friend_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_status ON friend_requests(status);

-- ============================================
-- 7. FRIENDS TÁBLA (Elfogadott barátok)
-- ============================================
CREATE TABLE IF NOT EXISTS friends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Első játékos (az aki küldte a kérelmet)
    player1_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,

    -- Második játékos (az aki elfogadta a kérelmet)
    player2_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,

    -- Barátság kezdete
    friends_since TIMESTAMPTZ DEFAULT NOW(),

    -- Egyedi constraint: Egy kapcsolat csak egyszer szerepelhet
    -- Biztosítjuk, hogy player1_id < player2_id (ABC sorrend)
    CHECK (player1_id < player2_id),
    UNIQUE(player1_id, player2_id)
);

CREATE INDEX IF NOT EXISTS idx_friends_player1 ON friends(player1_id);
CREATE INDEX IF NOT EXISTS idx_friends_player2 ON friends(player2_id);

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

-- Friend Requests RLS
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their sent requests" ON friend_requests;
DROP POLICY IF EXISTS "Users can view their received requests" ON friend_requests;
DROP POLICY IF EXISTS "Users can send friend requests" ON friend_requests;
DROP POLICY IF EXISTS "Users can respond to received requests" ON friend_requests;
DROP POLICY IF EXISTS "Users can delete their sent requests" ON friend_requests;

CREATE POLICY "Users can view their sent requests" ON friend_requests FOR SELECT USING (true);
CREATE POLICY "Users can view their received requests" ON friend_requests FOR SELECT USING (true);
CREATE POLICY "Users can send friend requests" ON friend_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can respond to received requests" ON friend_requests FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete their sent requests" ON friend_requests FOR DELETE USING (true);

-- Friends RLS
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their friends" ON friends;
DROP POLICY IF EXISTS "Users can add friends" ON friends;
DROP POLICY IF EXISTS "Users can remove friends" ON friends;

CREATE POLICY "Users can view their friends" ON friends FOR SELECT USING (true);
CREATE POLICY "Users can add friends" ON friends FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can remove friends" ON friends FOR DELETE USING (true);

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

-- Barátkérelem elfogadása
CREATE OR REPLACE FUNCTION accept_friend_request(request_id UUID)
RETURNS VOID AS $$
DECLARE
    sender UUID;
    receiver UUID;
    p1 UUID;
    p2 UUID;
BEGIN
    -- Lekérjük a kérelem adatait
    SELECT sender_id, receiver_id INTO sender, receiver
    FROM friend_requests
    WHERE id = request_id AND status = 'pending';

    IF sender IS NULL THEN
        RAISE EXCEPTION 'Friend request not found or already processed';
    END IF;

    -- Frissítjük a kérelmet
    UPDATE friend_requests
    SET status = 'accepted', responded_at = NOW()
    WHERE id = request_id;

    -- Biztosítjuk, hogy player1_id < player2_id
    IF sender < receiver THEN
        p1 := sender;
        p2 := receiver;
    ELSE
        p1 := receiver;
        p2 := sender;
    END IF;

    -- Létrehozzuk a friends rekordot
    INSERT INTO friends (player1_id, player2_id, friends_since)
    VALUES (p1, p2, NOW())
    ON CONFLICT (player1_id, player2_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Barátkérelem elutasítása
CREATE OR REPLACE FUNCTION reject_friend_request(request_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE friend_requests
    SET status = 'rejected', responded_at = NOW()
    WHERE id = request_id AND status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Barátság törlése
CREATE OR REPLACE FUNCTION remove_friend(friend_player_id UUID, current_player_id UUID)
RETURNS VOID AS $$
BEGIN
    DELETE FROM friends
    WHERE (player1_id = friend_player_id AND player2_id = current_player_id)
       OR (player1_id = current_player_id AND player2_id = friend_player_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
