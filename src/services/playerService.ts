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

// ============================================
// XP & LEVEL CALCULATION (Exponential Formula)
// According to XP_ES_GYEMANT_RENDSZER.md
// ============================================

/**
 * Calculate total XP required to reach a specific level
 * Formula: XP(level) = baseXP × (1 + growthRate)^(level-1)
 *
 * @param level Target level (1-100)
 * @returns Total XP required from level 0 to reach this level
 */
export function calculateXPForLevel(level: number): number {
  const baseXP = 1000; // baseXpPerLevel
  const growthRate = 0.10; // 10% growth per level (xpGrowthPercentage)
  const maxLevel = 100;

  if (level <= 0) return 0;
  if (level > maxLevel) return Infinity;

  let totalXP = 0;
  for (let i = 1; i <= level; i++) {
    totalXP += baseXP * Math.pow(1 + growthRate, i - 1);
  }

  return Math.floor(totalXP);
}

/**
 * Calculate player level from total XP
 *
 * @param totalXP Player's total XP
 * @returns Current level (0-100)
 */
export function calculateLevelFromXP(totalXP: number): number {
  if (totalXP < 0) return 0;

  let level = 0;
  const maxLevel = 100;

  // Find the highest level where XP threshold is met
  while (level < maxLevel && calculateXPForLevel(level + 1) <= totalXP) {
    level++;
  }

  return level;
}

/**
 * XP hozzáadása játékoshoz (szint ellenőrzéssel)
 * Uses exponential level calculation
 */
export async function addXP(
  playerId: string,
  xpAmount: number
): Promise<{ player: Player; leveledUp: boolean } | null> {
  try {
    const player = await getPlayer(playerId);
    if (!player) return null;

    const newXP = player.xp + xpAmount;
    const newLevel = calculateLevelFromXP(newXP);
    const leveledUp = newLevel > player.level;

    const updatedPlayer = await updatePlayer(playerId, {
      xp: newXP,
      level: newLevel,
    });

    if (!updatedPlayer) return null;

    console.log(`✅ XP added: ${xpAmount} → Total: ${newXP} XP, Level: ${newLevel}${leveledUp ? ' (LEVEL UP!)' : ''}`);

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
// LECKE BEFEJEZÉS ÉS GYÉMÁNT JUTALOM
// ============================================

/**
 * Lecke befejezése és gyémánt jutalom kiosztása
 * Minden 6. lecke után 1 gyémántot kap a játékos
 *
 * @returns {
 *   lessonsCompleted: total lessons completed,
 *   diamonds: current diamond count,
 *   diamondAwarded: true if diamond was awarded this time,
 *   progressPosition: position in current 6-lesson cycle (0-5)
 * }
 */
export async function completeLesson(
  playerId: string
): Promise<{
  lessonsCompleted: number;
  diamonds: number;
  diamondAwarded: boolean;
  progressPosition: number;
} | null> {
  try {
    console.log('📚 Completing lesson for player:', playerId);

    // Call Supabase RPC function
    const { data, error } = await supabase.rpc('complete_lesson', {
      player_uuid: playerId,
    });

    if (error) {
      console.error('❌ Error completing lesson:', error);
      return null;
    }

    const result = data[0];
    const progressPosition = (result.new_lessons_completed - 1) % 6;

    console.log('✅ Lesson completed:', {
      lessonsCompleted: result.new_lessons_completed,
      diamonds: result.new_diamonds,
      diamondAwarded: result.diamond_awarded,
      progressPosition,
    });

    if (result.diamond_awarded) {
      console.log('💎 DIAMOND AWARDED! New total:', result.new_diamonds);
    }

    return {
      lessonsCompleted: result.new_lessons_completed,
      diamonds: result.new_diamonds,
      diamondAwarded: result.diamond_awarded,
      progressPosition,
    };
  } catch (error) {
    console.error('Exception completing lesson:', error);
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
    console.log('📅 updateStreak called for player:', playerId);
    const existingStreak = await getStreak(playerId);
    const player = await getPlayer(playerId);
    const today = new Date().toISOString().split('T')[0];
    console.log('📅 Today date:', today);
    console.log('📅 Existing streak:', existingStreak);

    if (!existingStreak) {
      // Új streak létrehozása
      console.log('🆕 Creating new streak...');
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
        console.error('❌ Error creating streak:', error);
        return null;
      }

      console.log('✅ New streak created:', data);
      return data;
    }

    // Meglévő streak frissítése
    const lastDate = new Date(existingStreak.last_activity_date);
    const todayDate = new Date(today);
    const diffDays = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    console.log('📅 Last activity date:', existingStreak.last_activity_date);
    console.log('📅 Days difference:', diffDays);

    let newStreak = existingStreak.current_streak;
    let streakFreezesUsed = 0;

    if (diffDays === 0) {
      // Ma már volt aktivitás
      console.log('⚠️ Already recorded activity today, returning existing streak');
      return existingStreak;
    } else if (diffDays === 1) {
      // Folytatódik a streak (tegnap volt)
      newStreak += 1;
      console.log('✅ Streak continues! New streak:', newStreak);
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
    console.log('💾 Updating streak in database...', {
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, existingStreak.longest_streak),
      last_activity_date: today,
    });

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
      console.error('❌ Error updating streak:', error);
      return null;
    }

    console.log('✅ Streak updated in database:', data);

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
