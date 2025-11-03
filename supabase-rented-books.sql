-- ============================================
-- RENTED BOOKS TABLE - Kölcsönzött könyvek tárolása
-- ============================================
-- Ez a tábla tárolja, hogy egy játékos mely könyveket kölcsönözte
-- és pontosan melyik leckénél tart minden könyvben

-- 1. RENTED BOOKS TÁBLA LÉTREHOZÁSA
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

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Egy játékos csak egyszer kölcsönözheti ugyanazt a könyvet egyszerre
    UNIQUE(player_id, book_title)
);

-- 2. INDEXEK
CREATE INDEX IF NOT EXISTS idx_rented_books_player_id ON rented_books(player_id);
CREATE INDEX IF NOT EXISTS idx_rented_books_book_title ON rented_books(book_title);
CREATE INDEX IF NOT EXISTS idx_rented_books_rented_until ON rented_books(rented_until);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE rented_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rented books"
    ON rented_books FOR SELECT
    USING (true); -- Mindenki láthatja (leaderboard, stats miatt)

CREATE POLICY "Users can insert their own rented books"
    ON rented_books FOR INSERT
    WITH CHECK (true); -- Bárki kölcsönözhet könyvet

CREATE POLICY "Users can update their own rented books"
    ON rented_books FOR UPDATE
    USING (true) -- Egyelőre mindenki frissíthet
    WITH CHECK (true);

CREATE POLICY "Users can delete their own rented books"
    ON rented_books FOR DELETE
    USING (true); -- Mindenki törölheti (ha lejár a kölcsönzés)

-- 4. TRIGGER - AUTOMATIKUS UPDATED_AT FRISSÍTÉS
CREATE TRIGGER update_rented_books_updated_at
    BEFORE UPDATE ON rented_books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. HELPER FUNCTION - Lejárt kölcsönzések automatikus törlése
CREATE OR REPLACE FUNCTION delete_expired_rentals()
RETURNS void AS $$
BEGIN
    DELETE FROM rented_books
    WHERE rented_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- 6. TESZTELÉS (OPCIONÁLIS)
-- Kommenteld ki ha nem szeretnél teszt adatokat

-- Teszt kölcsönzés létrehozása (használd a saját player_id-dat)
-- INSERT INTO rented_books (player_id, book_title, rented_until, current_lesson_index, current_game_type)
-- VALUES (
--     'YOUR_PLAYER_ID_HERE',
--     'Pénzügyi Alapismeretek',
--     NOW() + INTERVAL '7 days',
--     5,
--     'matching'
-- )
-- ON CONFLICT (player_id, book_title)
-- DO UPDATE SET
--     rented_until = EXCLUDED.rented_until,
--     updated_at = NOW();

-- 7. LEKÉRDEZÉS PÉLDA
-- SELECT * FROM rented_books WHERE player_id = 'YOUR_PLAYER_ID';

-- 8. LEJÁRT KÖLCSÖNZÉSEK TÖRLÉSE (futtasd rendszeresen)
-- SELECT delete_expired_rentals();
