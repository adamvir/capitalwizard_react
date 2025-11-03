// ============================================
// PLAYER SERVICE - SUPABASE
// Játékos adatok kezelése Supabase-ben
// ============================================

import { supabase } from '../config/supabase';
import { Database } from '../types/database';

type Player = Database['public']['Tables']['players']['Row'];
type PlayerInsert = Database['public']['Tables']['players']['Insert'];
type PlayerUpdate = Database['public']['Tables']['players']['Update'];

type Streak = Database['public']['Tables']['streaks']['Row'];
type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];
type DailyLimit = Database['public']['Tables']['daily_limits']['Row'];

// ============================================
// JÁTÉKOS MŰVELETEK
// ============================================

/**
 * Új játékos létrehozása
 * ✅ A streak AUTOMATIKUSAN létrejön egy Supabase trigger által!
 */
export async function createPlayer(data: PlayerInsert): Promise<Player | null> {
  try {
    const { data: player, error } = await supabase
      .from('players')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating player:', error);
      return null;
    }

    // ✅ A streak automatikusan létrejön a database trigger által
    // Lásd: supabase-complete-setup.sql -> trigger_initialize_new_player
    console.log('✅ New player created:', player.id, '(streak auto-created by trigger)');

    return player;
  } catch (error) {
    console.error('Exception creating player:', error);
    return null;
  }
}

/**
 * Játékos lekérése ID alapján
 */
export async function getPlayer(playerId: string): Promise<Player | null> {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', playerId)
      .single();

    if (error) {
      console.error('Error fetching player:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching player:', error);
    return null;
  }
}

/**
 * Játékos adatok frissítése
 */
export async function updatePlayer(
  playerId: string,
  updates: PlayerUpdate
): Promise<Player | null> {
  try {
    const { data, error } = await supabase
      .from('players')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', playerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating player:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception updating player:', error);
    return null;
  }
}

/**
 * XP hozzáadása játékoshoz (szint ellenőrzéssel)
 */
export async function addXP(
  playerId: string,
  xpAmount: number
): Promise<{ player: Player; leveledUp: boolean } | null> {
  try {
    const player = await getPlayer(playerId);
    if (!player) return null;

    const newXP = player.xp + xpAmount;
    const xpPerLevel = 100; // Állítsd be a saját logikádnak megfelelően
    const newLevel = Math.floor(newXP / xpPerLevel) + 1;
    const leveledUp = newLevel > player.level;

    const updatedPlayer = await updatePlayer(playerId, {
      xp: newXP,
      level: newLevel,
    });

    if (!updatedPlayer) return null;

    return { player: updatedPlayer, leveledUp };
  } catch (error) {
    console.error('Exception adding XP:', error);
    return null;
  }
}

/**
 * Érmék hozzáadása/levonása
 */
export async function updateCoins(
  playerId: string,
  amount: number
): Promise<Player | null> {
  try {
    const player = await getPlayer(playerId);
    if (!player) return null;

    return await updatePlayer(playerId, {
      coins: player.coins + amount,
    });
  } catch (error) {
    console.error('Exception updating coins:', error);
    return null;
  }
}

/**
 * Gyémántok hozzáadása/levonása
 */
export async function updateDiamonds(
  playerId: string,
  amount: number
): Promise<Player | null> {
  try {
    const player = await getPlayer(playerId);
    if (!player) return null;

    return await updatePlayer(playerId, {
      diamonds: player.diamonds + amount,
    });
  } catch (error) {
    console.error('Exception updating diamonds:', error);
    return null;
  }
}

// ============================================
// STREAK MŰVELETEK
// ============================================

/**
 * Játékos streak adatainak lekérése
 */
export async function getStreak(playerId: string): Promise<Streak | null> {
  try {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('player_id', playerId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching streak:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching streak:', error);
    return null;
  }
}

/**
 * Streak frissítése (Széria Pont védelem támogatással)
 */
export async function updateStreak(playerId: string): Promise<Streak | null> {
  try {
    const existingStreak = await getStreak(playerId);
    const player = await getPlayer(playerId);
    const today = new Date().toISOString().split('T')[0];

    if (!existingStreak) {
      // Új streak létrehozása
      const { data, error } = await supabase
        .from('streaks')
        .insert({
          player_id: playerId,
          current_streak: 1,
          longest_streak: 1,
          last_activity_date: today,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating streak:', error);
        return null;
      }

      return data;
    }

    // Meglévő streak frissítése
    const lastDate = new Date(existingStreak.last_activity_date);
    const todayDate = new Date(today);
    const diffDays = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = existingStreak.current_streak;
    let streakFreezesUsed = 0;

    if (diffDays === 0) {
      // Ma már volt aktivitás
      return existingStreak;
    } else if (diffDays === 1) {
      // Folytatódik a streak (tegnap volt)
      newStreak += 1;
    } else {
      // Több nap telt el (megszakadt?)
      const missedDays = diffDays - 1; // Hány nap maradt ki
      const availableFreezes = player?.streak_freezes || 0;

      if (availableFreezes >= missedDays) {
        // Van elég Széria Pont → megvédi a streak-et
        newStreak += 1; // Folytatódik
        streakFreezesUsed = missedDays;
        console.log(`🔥 Széria Pont használva: ${missedDays} db. Streak megvédve!`);
      } else {
        // Nincs elég Széria Pont → streak reset
        newStreak = 1;
        console.log(`❌ Nincs elég Széria Pont (${availableFreezes}/${missedDays}). Streak reset!`);
      }
    }

    // Frissítsd a streak-et
    const { data, error } = await supabase
      .from('streaks')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, existingStreak.longest_streak),
        last_activity_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('player_id', playerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating streak:', error);
      return null;
    }

    // Ha Széria Pont felhasználódott, frissítsd a player táblát
    if (streakFreezesUsed > 0) {
      await supabase
        .from('players')
        .update({
          streak_freezes: (player?.streak_freezes || 0) - streakFreezesUsed,
        })
        .eq('id', playerId);
      console.log(`✅ Széria Pont levonva: ${streakFreezesUsed}`);
    }

    return data;
  } catch (error) {
    console.error('Exception updating streak:', error);
    return null;
  }
}

// ============================================
// LECKE ELŐREHALADÁS
// ============================================

/**
 * Lecke előrehaladás mentése
 */
export async function saveLessonProgress(
  playerId: string,
  lessonId: string,
  completed: boolean,
  score: number | null = null
): Promise<LessonProgress | null> {
  try {
    // Ellenőrizzük, van-e már ilyen bejegyzés
    const { data: existing } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('player_id', playerId)
      .eq('lesson_id', lessonId)
      .single();

    if (existing) {
      // Frissítjük a meglévőt
      const { data, error } = await supabase
        .from('lesson_progress')
        .update({
          completed,
          score,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('player_id', playerId)
        .eq('lesson_id', lessonId)
        .select()
        .single();

      if (error) {
        console.error('Error updating lesson progress:', error);
        return null;
      }

      return data;
    } else {
      // Új bejegyzés létrehozása
      const { data, error } = await supabase
        .from('lesson_progress')
        .insert({
          player_id: playerId,
          lesson_id: lessonId,
          completed,
          score,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating lesson progress:', error);
        return null;
      }

      return data;
    }
  } catch (error) {
    console.error('Exception saving lesson progress:', error);
    return null;
  }
}

/**
 * Összes lecke előrehaladás lekérése egy játékoshoz
 */
export async function getPlayerLessonProgress(
  playerId: string
): Promise<LessonProgress[]> {
  try {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lesson progress:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching lesson progress:', error);
    return [];
  }
}

/**
 * Befejezett leckék száma
 */
export async function getCompletedLessonsCount(playerId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('player_id', playerId)
      .eq('completed', true);

    if (error) {
      console.error('Error counting completed lessons:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Exception counting completed lessons:', error);
    return 0;
  }
}

// ============================================
// NAPI LIMIT
// ============================================

/**
 * Mai napi limit lekérése
 */
export async function getTodayLimit(playerId: string): Promise<DailyLimit | null> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('daily_limits')
      .select('*')
      .eq('player_id', playerId)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching daily limit:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching daily limit:', error);
    return null;
  }
}

/**
 * Napi limit frissítése vagy létrehozása
 */
export async function updateDailyLimit(
  playerId: string,
  maxLessons: number = 10
): Promise<DailyLimit | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const existing = await getTodayLimit(playerId);

    if (existing) {
      const { data, error } = await supabase
        .from('daily_limits')
        .update({
          lessons_completed: existing.lessons_completed + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('player_id', playerId)
        .eq('date', today)
        .select()
        .single();

      if (error) {
        console.error('Error updating daily limit:', error);
        return null;
      }

      return data;
    } else {
      const { data, error } = await supabase
        .from('daily_limits')
        .insert({
          player_id: playerId,
          date: today,
          lessons_completed: 1,
          max_lessons: maxLessons,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating daily limit:', error);
        return null;
      }

      return data;
    }
  } catch (error) {
    console.error('Exception updating daily limit:', error);
    return null;
  }
}
