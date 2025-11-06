-- ============================================
-- MESSAGES TABLE
-- ============================================
-- Tábla az üzenetek tárolásához játékosok között
--
-- HASZNÁLAT:
-- 1. Másold be ezt a kódot a Supabase SQL editorba
-- 2. Futtasd le
--
-- VAGY
-- Ha van Supabase CLI:
-- supabase db push

-- ============================================
-- CREATE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Index for faster queries by sender/receiver
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver
    ON public.messages(sender_id, receiver_id, created_at DESC);

-- Index for unread messages count
CREATE INDEX IF NOT EXISTS idx_messages_receiver_unread
    ON public.messages(receiver_id, read)
    WHERE read = FALSE;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Players can read messages where they are sender or receiver
CREATE POLICY "Players can read their own messages"
    ON public.messages
    FOR SELECT
    USING (
        sender_id = auth.uid() OR receiver_id = auth.uid()
    );

-- Players can insert messages where they are the sender
CREATE POLICY "Players can send messages"
    ON public.messages
    FOR INSERT
    WITH CHECK (
        sender_id = auth.uid()
    );

-- Players can update messages where they are the receiver (mark as read)
CREATE POLICY "Players can mark messages as read"
    ON public.messages
    FOR UPDATE
    USING (
        receiver_id = auth.uid()
    )
    WITH CHECK (
        receiver_id = auth.uid()
    );

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION public.update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_messages_updated_at();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages TO anon;

-- ============================================
-- ENABLE REALTIME
-- ============================================
-- ✅ CRITICAL: Enable realtime for instant message updates!
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE public.messages IS 'Üzenetek játékosok között';
COMMENT ON COLUMN public.messages.id IS 'Egyedi azonosító';
COMMENT ON COLUMN public.messages.sender_id IS 'Küldő játékos ID';
COMMENT ON COLUMN public.messages.receiver_id IS 'Fogadó játékos ID';
COMMENT ON COLUMN public.messages.message IS 'Üzenet szövege';
COMMENT ON COLUMN public.messages.read IS 'Olvasott-e az üzenet';
COMMENT ON COLUMN public.messages.created_at IS 'Létrehozás időpontja';
COMMENT ON COLUMN public.messages.updated_at IS 'Utolsó módosítás időpontja';
