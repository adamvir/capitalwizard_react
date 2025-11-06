// ============================================
// PLAYER HOOK - REACT HOOK A JÁTÉKOS ADATOKHOZ
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getPlayer,
  updatePlayer,
  addXP,
  updateCoins,
  updateDiamonds,
  createPlayer,
} from '../services/playerService';
import { Database } from '../types/database';
import { useAuth } from './useAuth';
import { supabase } from '../config/supabase';

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

  // ✅ USE AUTH HOOK for persistent user ID (no more duplicates!)
  const { userId: authUserId, loading: authLoading } = useAuth();

  // ✅ VÉDŐ FLAG: Megakadályozza a duplikált player létrehozást
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const hasInitialLoad = useRef<boolean>(false);

  // Játékos adatok betöltése
  // silent=true esetén nem mutat loading screent (háttérben frissít)
  const loadPlayer = useCallback(async (silent = false) => {
    try {
      // Csak akkor állítsuk loading=true ha nem silent refresh
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      // ✅ Wait for auth to finish loading
      if (authLoading) {
        console.log('⏳ Waiting for auth to finish loading...');
        return;
      }

      // ✅ Use authUserId instead of AsyncStorage
      if (!authUserId) {
        setError('Nincs bejelentkezve (auth session hiányzik)');
        console.log('❌ No auth user ID - authentication required');
        return;
      }

      console.log('📊 Loading player data for user:', authUserId);

      const playerData = await getPlayer(authUserId);
      if (playerData) {
        setPlayer(playerData);
        console.log('✅ Player loaded successfully');
      } else {
        // Player doesn't exist in database - create new one
        // ✅ VÉDELEM: Ha már folyamatban van létrehozás, ne csináljunk semmit
        if (isCreating) {
          console.log('⚠️ Player létrehozás már folyamatban van, skip...');
          return;
        }

        console.log('🆕 Player not found in database. Creating new player with auth ID:', authUserId);
        setIsCreating(true);

        try {
          // ✅ Create player with the SAME ID as auth user ID (prevents duplicates!)
          const { data: newPlayer, error: insertError } = await supabase
            .from('players')
            .insert({
              id: authUserId, // ✅ USE AUTH USER ID!
              username: null,
              avatar_id: 1,
              level: 0,
              xp: 0,
              coins: 1000,
              diamonds: 0,
              subscription_type: 'free',
              streak_freezes: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError) {
            console.error('❌ Error creating player:', insertError);
            setError('Nem sikerült létrehozni az új játékost');
            return;
          }

          if (newPlayer) {
            setPlayer(newPlayer);
            console.log('✅ New player created with auth ID:', newPlayer.id);
          }
        } finally {
          setIsCreating(false);
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
  }, [authUserId, authLoading, isCreating]);

  // Első betöltés - csak egyszer, mount-kor
  useEffect(() => {
    // ✅ VÉDELEM: Ha már fut az initial load, ne futtassuk újra
    if (hasInitialLoad.current) {
      console.log('⚠️ Initial load már lefutott, skip...');
      return;
    }

    hasInitialLoad.current = true;
    console.log('🚀 Initial player load started...');
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
