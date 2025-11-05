/**
 * ============================================
 * useFriends Hook
 * ============================================
 * Barátrendszer kezelése Supabase-zel
 *
 * FUNKCIÓK:
 * - Barátok listázása
 * - Barátkérelmek listázása (bejövő és kimenő)
 * - Barátkérelem küldése
 * - Barátkérelem elfogadása
 * - Barátkérelem elutasítása
 * - Barát törlése
 * - Játékos keresése username alapján
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { storage, STORAGE_KEYS } from '../utils/storage';

// ============================================
// TYPES
// ============================================

export interface Player {
  id: string;
  username: string | null;
  level: number;
  xp: number;
  coins: number;
  diamonds: number;
  avatar_id: number;
  subscription_type: 'free' | 'pro' | 'master';
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender?: Player; // Populated with player data
  receiver?: Player; // Populated with player data
}

export interface Friend {
  id: string;
  player1_id: string;
  player2_id: string;
  friends_since: string;
  friend?: Player; // The other player's data
}

// ============================================
// HOOK
// ============================================

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // GET CURRENT PLAYER ID
  // ============================================

  const getCurrentPlayerId = async (): Promise<string | null> => {
    try {
      const playerId = await storage.getItem<string>(STORAGE_KEYS.PLAYER_DATA);
      return playerId;
    } catch (error) {
      console.error('Error getting player_id:', error);
      return null;
    }
  };

  // ============================================
  // FETCH FRIENDS
  // ============================================

  const fetchFriends = useCallback(async () => {
    try {
      const playerId = await getCurrentPlayerId();
      if (!playerId) {
        setFriends([]);
        return;
      }

      // Query friends where current player is either player1 or player2
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select(`
          id,
          player1_id,
          player2_id,
          friends_since,
          player1:players!friends_player1_id_fkey(id, username, level, xp, coins, diamonds, avatar_id, subscription_type),
          player2:players!friends_player2_id_fkey(id, username, level, xp, coins, diamonds, avatar_id, subscription_type)
        `)
        .or(`player1_id.eq.${playerId},player2_id.eq.${playerId}`);

      if (friendsError) {
        console.error('Error fetching friends:', friendsError);
        setError(friendsError.message);
        return;
      }

      // Map friends data and determine which player is the "friend"
      const mappedFriends: Friend[] = (friendsData || []).map((f: any) => {
        const isFriendPlayer1 = f.player1_id !== playerId;
        const friendData = isFriendPlayer1 ? f.player1 : f.player2;

        return {
          id: f.id,
          player1_id: f.player1_id,
          player2_id: f.player2_id,
          friends_since: f.friends_since,
          friend: friendData as Player,
        };
      });

      setFriends(mappedFriends);
    } catch (error) {
      console.error('Error in fetchFriends:', error);
      setError('Failed to fetch friends');
    }
  }, []);

  // ============================================
  // FETCH INCOMING REQUESTS
  // ============================================

  const fetchIncomingRequests = useCallback(async () => {
    try {
      const playerId = await getCurrentPlayerId();
      if (!playerId) {
        setIncomingRequests([]);
        return;
      }

      const { data, error: requestsError } = await supabase
        .from('friend_requests')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          sender:players!friend_requests_sender_id_fkey(id, username, level, xp, coins, diamonds, avatar_id, subscription_type)
        `)
        .eq('receiver_id', playerId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching incoming requests:', requestsError);
        return;
      }

      setIncomingRequests((data as any[]) || []);
    } catch (error) {
      console.error('Error in fetchIncomingRequests:', error);
    }
  }, []);

  // ============================================
  // FETCH OUTGOING REQUESTS
  // ============================================

  const fetchOutgoingRequests = useCallback(async () => {
    try {
      const playerId = await getCurrentPlayerId();
      if (!playerId) {
        setOutgoingRequests([]);
        return;
      }

      const { data, error: requestsError } = await supabase
        .from('friend_requests')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          receiver:players!friend_requests_receiver_id_fkey(id, username, level, xp, coins, diamonds, avatar_id, subscription_type)
        `)
        .eq('sender_id', playerId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching outgoing requests:', requestsError);
        return;
      }

      setOutgoingRequests((data as any[]) || []);
    } catch (error) {
      console.error('Error in fetchOutgoingRequests:', error);
    }
  }, []);

  // ============================================
  // REFRESH ALL
  // ============================================

  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchFriends(), fetchIncomingRequests(), fetchOutgoingRequests()]);
    setLoading(false);
  }, [fetchFriends, fetchIncomingRequests, fetchOutgoingRequests]);

  // ============================================
  // SEARCH PLAYERS BY USERNAME
  // ============================================

  const searchPlayers = async (searchQuery: string): Promise<Player[]> => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      return [];
    }

    try {
      const playerId = await getCurrentPlayerId();

      const { data, error: searchError } = await supabase
        .from('players')
        .select('id, username, level, xp, coins, diamonds, avatar_id, subscription_type')
        .ilike('username', `%${searchQuery}%`)
        .limit(20);

      if (searchError) {
        console.error('Error searching players:', searchError);
        return [];
      }

      // Filter out current player
      const filtered = (data || []).filter((p: any) => p.id !== playerId);

      return filtered as Player[];
    } catch (error) {
      console.error('Error in searchPlayers:', error);
      return [];
    }
  };

  // ============================================
  // SEND FRIEND REQUEST
  // ============================================

  const sendFriendRequest = async (receiverId: string): Promise<boolean> => {
    try {
      const playerId = await getCurrentPlayerId();
      if (!playerId) {
        console.error('No player_id found');
        return false;
      }

      // Check if already friends
      const { data: existingFriends } = await supabase
        .from('friends')
        .select('id')
        .or(
          `and(player1_id.eq.${playerId},player2_id.eq.${receiverId}),and(player1_id.eq.${receiverId},player2_id.eq.${playerId})`
        )
        .limit(1);

      if (existingFriends && existingFriends.length > 0) {
        console.log('Already friends with this player');
        return false;
      }

      // Check if request already exists
      const { data: existingRequest } = await supabase
        .from('friend_requests')
        .select('id')
        .eq('sender_id', playerId)
        .eq('receiver_id', receiverId)
        .eq('status', 'pending')
        .limit(1);

      if (existingRequest && existingRequest.length > 0) {
        console.log('Friend request already sent');
        return false;
      }

      // Send request
      const { error: insertError } = await supabase.from('friend_requests').insert([
        {
          sender_id: playerId,
          receiver_id: receiverId,
          status: 'pending',
        },
      ]);

      if (insertError) {
        console.error('Error sending friend request:', insertError);
        return false;
      }

      console.log('✅ Friend request sent successfully');
      await refresh();
      return true;
    } catch (error) {
      console.error('Error in sendFriendRequest:', error);
      return false;
    }
  };

  // ============================================
  // ACCEPT FRIEND REQUEST
  // ============================================

  const acceptFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      // Use Supabase RPC to call the accept_friend_request function
      const { error: rpcError } = await supabase.rpc('accept_friend_request', {
        request_id: requestId,
      });

      if (rpcError) {
        console.error('Error accepting friend request:', rpcError);
        return false;
      }

      console.log('✅ Friend request accepted successfully');
      await refresh();
      return true;
    } catch (error) {
      console.error('Error in acceptFriendRequest:', error);
      return false;
    }
  };

  // ============================================
  // REJECT FRIEND REQUEST
  // ============================================

  const rejectFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      // Use Supabase RPC to call the reject_friend_request function
      const { error: rpcError } = await supabase.rpc('reject_friend_request', {
        request_id: requestId,
      });

      if (rpcError) {
        console.error('Error rejecting friend request:', rpcError);
        return false;
      }

      console.log('✅ Friend request rejected successfully');
      await refresh();
      return true;
    } catch (error) {
      console.error('Error in rejectFriendRequest:', error);
      return false;
    }
  };

  // ============================================
  // REMOVE FRIEND
  // ============================================

  const removeFriend = async (friendId: string): Promise<boolean> => {
    try {
      const playerId = await getCurrentPlayerId();
      if (!playerId) {
        console.error('No player_id found');
        return false;
      }

      // Use Supabase RPC to call the remove_friend function
      const { error: rpcError } = await supabase.rpc('remove_friend', {
        friend_player_id: friendId,
        current_player_id: playerId,
      });

      if (rpcError) {
        console.error('Error removing friend:', rpcError);
        return false;
      }

      console.log('✅ Friend removed successfully');
      await refresh();
      return true;
    } catch (error) {
      console.error('Error in removeFriend:', error);
      return false;
    }
  };

  // ============================================
  // CANCEL OUTGOING REQUEST
  // ============================================

  const cancelFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId);

      if (deleteError) {
        console.error('Error canceling friend request:', deleteError);
        return false;
      }

      console.log('✅ Friend request canceled successfully');
      await refresh();
      return true;
    } catch (error) {
      console.error('Error in cancelFriendRequest:', error);
      return false;
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    refresh();
  }, []);

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    friends,
    incomingRequests,
    outgoingRequests,
    pendingRequestsCount: incomingRequests.length, // Új: értesítési badge számhoz
    loading,
    error,

    // Actions
    refresh,
    searchPlayers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    cancelFriendRequest,
  };
}
