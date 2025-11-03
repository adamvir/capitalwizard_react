// ============================================
// LESSON PROGRESS HOOK - LECKE ELŐREHALADÁS KEZELÉSE
// ============================================

import { useState, useEffect, useCallback } from 'react';
import {
  getPlayerLessonProgress,
  saveLessonProgress,
  getCompletedLessonsCount,
} from '../services/playerService';
import { Database } from '../types/database';
import { storage, STORAGE_KEYS } from '../utils/storage';

type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];

interface UseLessonProgressReturn {
  progress: LessonProgress[];
  completedCount: number;
  loading: boolean;
  error: string | null;
  refreshProgress: () => Promise<void>;
  saveProgress: (
    lessonId: string,
    completed: boolean,
    score?: number
  ) => Promise<void>;
  isLessonCompleted: (lessonId: string) => boolean;
  getLessonScore: (lessonId: string) => number | null;
}

/**
 * React Hook a lecke előrehaladás kezeléséhez
 *
 * Használat:
 * ```tsx
 * const { progress, saveProgress, isLessonCompleted } = useLessonProgress();
 *
 * // Lecke befejezése
 * await saveProgress('lesson-1', true, 85);
 *
 * // Ellenőrzés
 * const completed = isLessonCompleted('lesson-1');
 * ```
 */
export function useLessonProgress(): UseLessonProgressReturn {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Előrehaladás betöltése
  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const playerId = await getPlayerId();
      if (!playerId) {
        setError('Nincs bejelentkezve játékos');
        return;
      }

      const [progressData, count] = await Promise.all([
        getPlayerLessonProgress(playerId),
        getCompletedLessonsCount(playerId),
      ]);

      setProgress(progressData);
      setCompletedCount(count);
    } catch (err) {
      setError('Hiba történt az előrehaladás betöltésekor');
      console.error('Load progress error:', err);
    } finally {
      setLoading(false);
    }
  }, [getPlayerId]);

  // Első betöltés
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Lecke előrehaladás mentése
  const saveProgress = useCallback(
    async (lessonId: string, completed: boolean, score?: number) => {
      try {
        const playerId = await getPlayerId();
        if (!playerId) {
          console.error('No player ID found');
          return;
        }

        const saved = await saveLessonProgress(
          playerId,
          lessonId,
          completed,
          score || null
        );

        if (saved) {
          // Frissítjük a lokális állapotot
          await loadProgress();
        }
      } catch (err) {
        console.error('Error saving progress:', err);
        setError('Nem sikerült menteni az előrehaladást');
      }
    },
    [getPlayerId, loadProgress]
  );

  // Előrehaladás újratöltése
  const refreshProgress = useCallback(async () => {
    await loadProgress();
  }, [loadProgress]);

  // Lecke befejezettségének ellenőrzése
  const isLessonCompleted = useCallback(
    (lessonId: string): boolean => {
      const lessonProgress = progress.find((p) => p.lesson_id === lessonId);
      return lessonProgress?.completed || false;
    },
    [progress]
  );

  // Lecke pontszámának lekérése
  const getLessonScore = useCallback(
    (lessonId: string): number | null => {
      const lessonProgress = progress.find((p) => p.lesson_id === lessonId);
      return lessonProgress?.score || null;
    },
    [progress]
  );

  return {
    progress,
    completedCount,
    loading,
    error,
    refreshProgress,
    saveProgress,
    isLessonCompleted,
    getLessonScore,
  };
}
