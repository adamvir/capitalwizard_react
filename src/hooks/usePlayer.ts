// ============================================
// PLAYER HOOK - REACT HOOK A JÁTÉKOS ADATOKHOZ
// ============================================

import { useState, useEffect, useCallback } from 'react';
import {
  getPlayer,
  updatePlayer,
  addXP,
  updateCoins,
  updateDiamonds,
  createPlayer,
} from '../services/playerService';
import { Database } from '../types/database';
import { storage, STORAGE_KEYS } from '../utils/storage';

type Player = Database['public']['Tables']['players']['Row'];

interface UsePlayerReturn {
  player: Player | null;
  loading: boolean;
  error: string | null;
  refreshPlayer: () => Promise<void>;
  updatePlayerData: (updates: Partial<Player>) => Promise<void>;
  addPlayerXP: (amount: number) => Promise<{ leveledUp: boolean }>;
  addCoins: (amount: number) => Promise<void>;
  addDiamonds: (amount: number) => Promise<void>;
}

/**
 * React Hook a játékos adatok kezeléséhez
 *
 * Használat:
 * ```tsx
 * const { player, loading, addPlayerXP, addCoins } = usePlayer();
 *
 * // XP hozzáadása
 * await addPlayerXP(50);
 *
 * // Érmék hozzáadása
 * await addCoins(100);
 * ```
 */
export function usePlayer(): UsePlayerReturn {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Játékos ID lekérése vagy létrehozása
  const getOrCreatePlayerId = useCallback(async (): Promise<string | null> => {
    try {
      // Próbáljuk meg lekérni a lokálisan tárolt ID-t
      let playerId = await storage.getItem<string>(STORAGE_KEYS.PLAYER_DATA);

      if (!playerId) {
        // Ha nincs, akkor hozzunk létre egy új játékost
        const newPlayer = await createPlayer({
          username: null,
          avatar_id: 1,
          level: 0,
          xp: 0,
          coins: 1000,
          diamonds: 0,
          subscription_type: 'free',
          streak_freezes: 0,
        });

        if (newPlayer) {
          playerId = newPlayer.id;
          await storage.setItem(STORAGE_KEYS.PLAYER_DATA, playerId);
        }
      }

      return playerId;
    } catch (err) {
      console.error('Error getting or creating player ID:', err);
      return null;
    }
  }, []);

  // Játékos adatok betöltése
  // silent=true esetén nem mutat loading screent (háttérben frissít)
  const loadPlayer = useCallback(async (silent = false) => {
    try {
      // Csak akkor állítsuk loading=true ha nem silent refresh
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      const playerId = await getOrCreatePlayerId();
      if (!playerId) {
        setError('Nem sikerült létrehozni vagy betölteni a játékost');
        return;
      }

      const playerData = await getPlayer(playerId);
      if (playerData) {
        setPlayer(playerData);
      } else {
        // Player nem létezik a Supabase-ben (törölve lett?)
        // Töröld a lokális ID-t és hozz létre újat
        console.log('⚠️ Player nem található a Supabase-ben. Új player létrehozása...');
        await storage.removeItem(STORAGE_KEYS.PLAYER_DATA);

        // Hozz létre új player-t
        const newPlayer = await createPlayer({
          username: null,
          avatar_id: 1,
          level: 0,
          xp: 0,
          coins: 1000,
          diamonds: 0,
          subscription_type: 'free',
          streak_freezes: 0,
        });

        if (newPlayer) {
          await storage.setItem(STORAGE_KEYS.PLAYER_DATA, newPlayer.id);
          setPlayer(newPlayer);
          console.log('✅ Új player létrehozva:', newPlayer.id);
        } else {
          setError('Nem sikerült létrehozni az új játékost');
        }
      }
    } catch (err) {
      setError('Hiba történt a játékos betöltésekor');
      console.error('Load player error:', err);
    } finally {
      // Csak akkor állítsuk false-ra ha be volt állítva
      if (!silent) {
        setLoading(false);
      }
    }
  }, [getOrCreatePlayerId]);

  // Első betöltés
  useEffect(() => {
    loadPlayer();
  }, [loadPlayer]);

  // ============================================
  // AUTO-REFRESH: Automatikus frissítés 10 másodpercenként (silent mode)
  // ============================================
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing player data (silent)...');
      loadPlayer(true); // silent=true → nem mutat loading screent
    }, 10000); // 10 másodperc

    return () => clearInterval(interval);
  }, [loadPlayer]);

  // Játékos adatok frissítése
  const updatePlayerData = useCallback(
    async (updates: Partial<Player>) => {
      if (!player) {
        console.error('No player loaded');
        return;
      }

      try {
        const updated = await updatePlayer(player.id, updates);
        if (updated) {
          setPlayer(updated);
        }
      } catch (err) {
        console.error('Error updating player:', err);
        setError('Nem sikerült frissíteni a játékos adatokat');
      }
    },
    [player]
  );

  // XP hozzáadása
  const addPlayerXP = useCallback(
    async (amount: number): Promise<{ leveledUp: boolean }> => {
      if (!player) {
        console.error('No player loaded');
        return { leveledUp: false };
      }

      try {
        const result = await addXP(player.id, amount);
        if (result) {
          setPlayer(result.player);
          return { leveledUp: result.leveledUp };
        }
        return { leveledUp: false };
      } catch (err) {
        console.error('Error adding XP:', err);
        setError('Nem sikerült XP-t hozzáadni');
        return { leveledUp: false };
      }
    },
    [player]
  );

  // Érmék hozzáadása
  const addCoins = useCallback(
    async (amount: number) => {
      if (!player) {
        console.error('No player loaded');
        return;
      }

      try {
        const updated = await updateCoins(player.id, amount);
        if (updated) {
          setPlayer(updated);
        }
      } catch (err) {
        console.error('Error adding coins:', err);
        setError('Nem sikerült érméket hozzáadni');
      }
    },
    [player]
  );

  // Gyémántok hozzáadása
  const addDiamonds = useCallback(
    async (amount: number) => {
      if (!player) {
        console.error('No player loaded');
        return;
      }

      try {
        const updated = await updateDiamonds(player.id, amount);
        if (updated) {
          setPlayer(updated);
        }
      } catch (err) {
        console.error('Error adding diamonds:', err);
        setError('Nem sikerült gyémántokat hozzáadni');
      }
    },
    [player]
  );

  // Játékos újratöltése
  // silent=true (default) esetén háttérben frissít loading screen nélkül
  const refreshPlayer = useCallback(async (silent = true) => {
    await loadPlayer(silent);
  }, [loadPlayer]);

  return {
    player,
    loading,
    error,
    refreshPlayer,
    updatePlayerData,
    addPlayerXP,
    addCoins,
    addDiamonds,
  };
}
