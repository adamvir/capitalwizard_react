/**
 * ============================================
 * usePresence Hook
 * ============================================
 * Játékos online/offline státusz kezelése
 *
 * FUNKCIÓK:
 * - Online státusz beállítása (amikor app megnyílik)
 * - Offline státusz beállítása (amikor app bezárul)
 * - Periodikus last_seen frissítés
 * - Real-time figyelés más játékosok státuszára
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { supabase } from '../config/supabase';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { RealtimeChannel } from '@supabase/supabase-js';

// ============================================
// CONSTANTS
// ============================================

const HEARTBEAT_INTERVAL = 30000; // 30 seconds - Update last_seen every 30s
const OFFLINE_THRESHOLD = 60000; // 60 seconds - Consider offline after 1 minute

// ============================================
// TYPES
// ============================================

interface PlayerPresence {
  id: string;
  is_online: boolean;
  last_seen: string;
}

interface UsePresenceReturn {
  isOnline: (playerId: string) => boolean;
  getLastSeen: (playerId: string) => string | null;
  refreshPresence: (playerId: string) => Promise<void>;
}

// ============================================
// HOOK
// ============================================

export function usePresence(watchPlayerIds: string[] = []): UsePresenceReturn {
  const [presenceMap, setPresenceMap] = useState<Map<string, PlayerPresence>>(new Map());
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentPlayerIdRef = useRef<string | null>(null);

  // ============================================
  // SET ONLINE STATUS
  // ============================================

  const setOnlineStatus = async (isOnline: boolean) => {
    try {
      const playerId = await storage.getItem<string>(STORAGE_KEYS.PLAYER_DATA);
      if (!playerId) return;

      currentPlayerIdRef.current = playerId;

      const { error } = await supabase
        .from('players')
        .update({
          is_online: isOnline,
          last_seen: new Date().toISOString(),
        })
        .eq('id', playerId);

      if (error) {
        console.error('Error setting online status:', error);
      } else {
        console.log(`✅ Player ${playerId} is now ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
      }
    } catch (err) {
      console.error('Exception setting online status:', err);
    }
  };

  // ============================================
  // UPDATE HEARTBEAT (keep alive)
  // ============================================

  const updateHeartbeat = async () => {
    try {
      const playerId = await storage.getItem<string>(STORAGE_KEYS.PLAYER_DATA);
      if (!playerId) return;

      const { error } = await supabase
        .from('players')
        .update({
          last_seen: new Date().toISOString(),
        })
        .eq('id', playerId);

      if (error) {
        console.error('Error updating heartbeat:', error);
      }
    } catch (err) {
      console.error('Exception updating heartbeat:', err);
    }
  };

  // ============================================
  // FETCH PRESENCE FOR PLAYER
  // ============================================

  const fetchPresence = async (playerId: string) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('id, is_online, last_seen')
        .eq('id', playerId)
        .single();

      if (error) {
        console.error('Error fetching presence:', error);
        return;
      }

      if (data) {
        setPresenceMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(data.id, data as PlayerPresence);
          return newMap;
        });
      }
    } catch (err) {
      console.error('Exception fetching presence:', err);
    }
  };

  // ============================================
  // REFRESH PRESENCE (public API)
  // ============================================

  const refreshPresence = useCallback(async (playerId: string) => {
    await fetchPresence(playerId);
  }, []);

  // ============================================
  // CHECK IF PLAYER IS ONLINE
  // ============================================

  const isOnline = useCallback(
    (playerId: string): boolean => {
      const presence = presenceMap.get(playerId);
      if (!presence) return false;

      // Check if player is marked as online
      if (!presence.is_online) return false;

      // Check if last_seen is within threshold
      const lastSeen = new Date(presence.last_seen).getTime();
      const now = Date.now();
      const timeSinceLastSeen = now - lastSeen;

      return timeSinceLastSeen < OFFLINE_THRESHOLD;
    },
    [presenceMap]
  );

  // ============================================
  // GET LAST SEEN
  // ============================================

  const getLastSeen = useCallback(
    (playerId: string): string | null => {
      const presence = presenceMap.get(playerId);
      return presence?.last_seen || null;
    },
    [presenceMap]
  );

  // ============================================
  // APP STATE CHANGE HANDLER
  // ============================================

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App came to foreground - set online
        console.log('📱 App became ACTIVE - Setting online');
        setOnlineStatus(true);

        // Start heartbeat
        if (!heartbeatInterval.current) {
          heartbeatInterval.current = setInterval(() => {
            updateHeartbeat();
          }, HEARTBEAT_INTERVAL);
        }
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App went to background - set offline
        console.log('📱 App became BACKGROUND/INACTIVE - Setting offline');
        setOnlineStatus(false);

        // Stop heartbeat
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
          heartbeatInterval.current = null;
        }
      }
    };

    // Set online when component mounts
    setOnlineStatus(true);

    // Start heartbeat interval
    heartbeatInterval.current = setInterval(() => {
      updateHeartbeat();
    }, HEARTBEAT_INTERVAL);

    // Listen to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup
    return () => {
      // Set offline when component unmounts
      setOnlineStatus(false);

      // Clear heartbeat
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }

      // Remove listener
      subscription.remove();
    };
  }, []);

  // ============================================
  // REAL-TIME PRESENCE SUBSCRIPTION
  // ============================================

  useEffect(() => {
    if (watchPlayerIds.length === 0) return;

    const setupRealtimeSubscription = async () => {
      // Clean up previous subscription
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
      }

      // Fetch initial presence for all watched players
      watchPlayerIds.forEach((playerId) => {
        fetchPresence(playerId);
      });

      // Create new subscription - Watch for presence changes
      const channel = supabase
        .channel('player-presence')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'players',
            filter: `id=in.(${watchPlayerIds.join(',')})`,
          },
          (payload) => {
            console.log('🔄 Presence updated:', payload.new);
            const updatedPlayer = payload.new as PlayerPresence;
            setPresenceMap((prev) => {
              const newMap = new Map(prev);
              newMap.set(updatedPlayer.id, updatedPlayer);
              return newMap;
            });
          }
        )
        .subscribe();

      channelRef.current = channel;
    };

    setupRealtimeSubscription();

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [watchPlayerIds.join(',')]); // Re-subscribe when watched players change

  return {
    isOnline,
    getLastSeen,
    refreshPresence,
  };
}
