// ============================================
// STREAK HOOK - REACT HOOK A STREAK ADATOKHOZ
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { getStreak, updateStreak } from '../services/playerService';
import { Database } from '../types/database';
import { storage, STORAGE_KEYS } from '../utils/storage';

type Streak = Database['public']['Tables']['streaks']['Row'];

interface UseStreakReturn {
  streak: Streak | null;
  loading: boolean;
  error: string | null;
  refreshStreak: () => Promise<void>;
  recordActivity: () => Promise<Streak | null>;
}

/**
 * React Hook a streak adatok kezeléséhez
 *
 * Használat:
 * ```tsx
 * const { streak, recordActivity } = useStreak();
 *
 * // Aktivitás rögzítése (automatikusan frissíti a streak-et)
 * await recordActivity();
 * ```
 */
export function useStreak(): UseStreakReturn {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ VÉDŐ FLAG: Megakadályozza a többszöri initial load-ot
  const hasInitialLoad = useRef<boolean>(false);

  // Játékos ID lekérése
  const getPlayerId = useCallback(async (): Promise<string | null> => {
    try {
      const playerId = await storage.getItem<string>(STORAGE_KEYS.PLAYER_DATA);
      return playerId;
    } catch (err) {
      console.error('Error getting player ID:', err);
      return null;
    }
  }, []);

  // Streak adatok betöltése
  const loadStreak = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const playerId = await getPlayerId();
      if (!playerId) {
        setError('Nincs bejelentkezve játékos');
        return;
      }

      const streakData = await getStreak(playerId);
      setStreak(streakData);
    } catch (err) {
      setError('Hiba történt a streak betöltésekor');
      console.error('Load streak error:', err);
    } finally {
      setLoading(false);
    }
  }, [getPlayerId]);

  // Első betöltés - csak egyszer, mount-kor
  useEffect(() => {
    // ✅ VÉDELEM: Ha már fut az initial load, ne futtassuk újra
    if (hasInitialLoad.current) {
      console.log('⚠️ Streak initial load már lefutott, skip...');
      return;
    }

    hasInitialLoad.current = true;
    console.log('🚀 Initial streak load started...');
    loadStreak();
  }, [loadStreak]);

  // Aktivitás rögzítése (napi bejelentkezés, lecke befejezése, stb.)
  // Visszaadja az új streak objektumot (hogy ellenőrizni lehessen a változást)
  const recordActivity = useCallback(async (): Promise<Streak | null> => {
    try {
      console.log('🔥 recordActivity called - updating streak...');
      const playerId = await getPlayerId();
      if (!playerId) {
        console.error('❌ No player ID found for streak update');
        return null;
      }

      console.log('📊 Calling updateStreak for player:', playerId);
      const updatedStreak = await updateStreak(playerId);
      if (updatedStreak) {
        console.log('✅ Streak updated successfully:', {
          current_streak: updatedStreak.current_streak,
          last_activity_date: updatedStreak.last_activity_date,
        });
        setStreak(updatedStreak);
        return updatedStreak;
      } else {
        console.error('❌ updateStreak returned null');
      }
      return null;
    } catch (err) {
      console.error('❌ Error recording activity:', err);
      setError('Nem sikerült rögzíteni az aktivitást');
      return null;
    }
  }, [getPlayerId]);

  // Streak újratöltése
  const refreshStreak = useCallback(async () => {
    await loadStreak();
  }, [loadStreak]);

  return {
    streak,
    loading,
    error,
    refreshStreak,
    recordActivity,
  };
}
