-- ============================================
-- ADD lessons_completed TO players TABLE
-- ============================================
-- This tracks total lessons completed across all books
-- Used for calculating diamond rewards (1 diamond per 6 lessons)

ALTER TABLE players
ADD COLUMN IF NOT EXISTS lessons_completed INTEGER DEFAULT 0;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_players_lessons_completed ON players(lessons_completed);

-- ============================================
-- FUNCTION: Complete Lesson and Award Diamonds
-- ============================================
-- Increments lessons_completed and awards diamond every 6 lessons

CREATE OR REPLACE FUNCTION complete_lesson(player_uuid UUID)
RETURNS TABLE(
    new_lessons_completed INTEGER,
    new_diamonds INTEGER,
    diamond_awarded BOOLEAN
) AS $$
DECLARE
    current_lessons INTEGER;
    current_diamonds INTEGER;
    awarded BOOLEAN := FALSE;
BEGIN
    -- Get current values
    SELECT lessons_completed, diamonds INTO current_lessons, current_diamonds
    FROM players
    WHERE id = player_uuid;

    -- Increment lessons completed
    current_lessons := current_lessons + 1;

    -- Check if milestone reached (every 6 lessons)
    -- Award 5 diamonds per milestone (diamondsPerMilestone = 5)
    IF current_lessons % 6 = 0 THEN
        current_diamonds := current_diamonds + 5;
        awarded := TRUE;
    END IF;

    -- Update player
    UPDATE players
    SET
        lessons_completed = current_lessons,
        diamonds = current_diamonds,
        updated_at = NOW()
    WHERE id = player_uuid;

    -- Return results
    RETURN QUERY SELECT current_lessons, current_diamonds, awarded;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
