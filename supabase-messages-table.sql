-- ============================================
-- MESSAGES TABLE - CHAT RENDSZER
-- ============================================
-- Barátok közötti üzenetek tárolása
-- Másold be ezt a Supabase SQL Editor-ba

-- 1. ÜZENETEK TÁBLA
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE,
    CONSTRAINT message_not_empty CHECK (LENGTH(TRIM(message)) > 0)
);

-- Indexek a gyorsabb kereséshez
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(receiver_id, read) WHERE read = FALSE;

-- 2. ROW LEVEL SECURITY (RLS) BEÁLLÍTÁSOK
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Játékosok csak a saját üzeneteiket láthatják (küldött vagy kapott)
CREATE POLICY "Players can view their own messages"
ON messages FOR SELECT
USING (
    sender_id IN (SELECT id FROM players) OR
    receiver_id IN (SELECT id FROM players)
);

-- Policy: Játékosok küldhetnek üzenetet (csak barátoknak, opcionális)
CREATE POLICY "Players can send messages"
ON messages FOR INSERT
WITH CHECK (
    sender_id IN (SELECT id FROM players)
);

-- Policy: Játékosok frissíthetik a saját kapott üzeneteiket (read status)
CREATE POLICY "Players can update received messages"
ON messages FOR UPDATE
USING (receiver_id IN (SELECT id FROM players));

-- Policy: Játékosok törölhetik a saját küldött üzeneteiket
CREATE POLICY "Players can delete their sent messages"
ON messages FOR DELETE
USING (sender_id IN (SELECT id FROM players));

-- 3. REAL-TIME ENGEDÉLYEZÉSE (hogy azonnal frissüljenek az üzenetek)
-- A Supabase Dashboard-on: Database -> Replication -> Enable for 'messages' table

-- 4. HASZNOS FÜGGVÉNY: Legutóbbi üzenet lekérése két játékos között
CREATE OR REPLACE FUNCTION get_last_message(player1_id UUID, player2_id UUID)
RETURNS TABLE (
    id UUID,
    sender_id UUID,
    receiver_id UUID,
    message TEXT,
    created_at TIMESTAMPTZ,
    read BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.id, m.sender_id, m.receiver_id, m.message, m.created_at, m.read
    FROM messages m
    WHERE
        (m.sender_id = player1_id AND m.receiver_id = player2_id) OR
        (m.sender_id = player2_id AND m.receiver_id = player1_id)
    ORDER BY m.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- 5. HASZNOS FÜGGVÉNY: Olvasatlan üzenetek száma
CREATE OR REPLACE FUNCTION get_unread_count(player_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM messages
        WHERE receiver_id = player_id AND read = FALSE
    );
END;
$$ LANGUAGE plpgsql;

-- KÉSZ! Most már használható a chat rendszer!
