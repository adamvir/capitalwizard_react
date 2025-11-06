/**
 * ============================================
 * useChat Hook
 * ============================================
 * Chat funkciók kezelése Supabase-zel
 *
 * FUNKCIÓK:
 * - Üzenetek lekérése két játékos között
 * - Üzenet küldése
 * - Real-time üzenet fogadás
 * - Olvasott jelölés
 * - Olvasatlan üzenetek száma
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../config/supabase';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { RealtimeChannel } from '@supabase/supabase-js';

// ============================================
// TYPES
// ============================================

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface ChatConversation {
  friendId: string;
  friendName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface UseChatReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendMessage: (receiverId: string, message: string) => Promise<boolean>;
  markAsRead: (messageId: string) => Promise<boolean>;
  markConversationAsRead: (friendId: string) => Promise<boolean>;
  refreshMessages: () => Promise<void>;
  unreadCount: number;
}

// ============================================
// HOOK
// ============================================

export function useChat(friendId?: string): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const playerIdRef = useRef<string | null>(null);

  // ============================================
  // GET CURRENT PLAYER ID
  // ============================================

  const getCurrentPlayerId = async (): Promise<string | null> => {
    if (playerIdRef.current) return playerIdRef.current;

    try {
      const playerId = await storage.getItem<string>(STORAGE_KEYS.PLAYER_DATA);
      playerIdRef.current = playerId;
      return playerId;
    } catch (error) {
      console.error('Error getting player_id:', error);
      return null;
    }
  };

  // ============================================
  // FETCH MESSAGES
  // ============================================

  const fetchMessages = useCallback(async () => {
    if (!friendId) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      const playerId = await getCurrentPlayerId();
      if (!playerId) {
        setError('No player_id found');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${playerId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${playerId})`
        )
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching messages:', fetchError);
        setError(fetchError.message);
        return;
      }

      setMessages(data || []);
      setError(null);
    } catch (err) {
      console.error('Exception fetching messages:', err);
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [friendId]);

  // ============================================
  // FETCH UNREAD COUNT
  // ============================================

  const fetchUnreadCount = useCallback(async () => {
    try {
      const playerId = await getCurrentPlayerId();
      if (!playerId) return;

      const { count, error: countError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', playerId)
        .eq('read', false);

      if (countError) {
        console.error('Error fetching unread count:', countError);
        return;
      }

      setUnreadCount(count || 0);
    } catch (err) {
      console.error('Exception fetching unread count:', err);
    }
  }, []);

  // ============================================
  // SEND MESSAGE
  // ============================================

  const sendMessage = async (receiverId: string, message: string): Promise<boolean> => {
    try {
      const playerId = await getCurrentPlayerId();
      if (!playerId) {
        console.error('No player_id found');
        return false;
      }

      if (!message || message.trim().length === 0) {
        console.error('Message cannot be empty');
        return false;
      }

      // ✅ OPTIMISTIC UI UPDATE - Add message immediately to state
      const tempMessage: Message = {
        id: `temp-${Date.now()}`, // Temporary ID
        sender_id: playerId,
        receiver_id: receiverId,
        message: message.trim(),
        created_at: new Date().toISOString(),
        read: false,
      };

      // Add to state immediately
      setMessages((prev) => [...prev, tempMessage]);

      // Send to Supabase
      const { data, error: sendError } = await supabase
        .from('messages')
        .insert({
          sender_id: playerId,
          receiver_id: receiverId,
          message: message.trim(),
          read: false,
        })
        .select()
        .single();

      if (sendError) {
        console.error('Error sending message:', sendError);
        // ❌ Remove temp message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
        return false;
      }

      // ✅ Replace temp message with real message from database
      if (data) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempMessage.id ? (data as Message) : msg))
        );
      }

      return true;
    } catch (err) {
      console.error('Exception sending message:', err);
      return false;
    }
  };

  // ============================================
  // MARK AS READ
  // ============================================

  const markAsRead = async (messageId: string): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (updateError) {
        console.error('Error marking message as read:', updateError);
        return false;
      }

      // Update local state
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
      );

      // Refresh unread count
      await fetchUnreadCount();
      return true;
    } catch (err) {
      console.error('Exception marking message as read:', err);
      return false;
    }
  };

  // ============================================
  // MARK CONVERSATION AS READ
  // ============================================

  const markConversationAsRead = async (friendId: string): Promise<boolean> => {
    try {
      const playerId = await getCurrentPlayerId();
      if (!playerId) return false;

      const { error: updateError } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', friendId)
        .eq('receiver_id', playerId)
        .eq('read', false);

      if (updateError) {
        console.error('Error marking conversation as read:', updateError);
        return false;
      }

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender_id === friendId && msg.receiver_id === playerId
            ? { ...msg, read: true }
            : msg
        )
      );

      // Refresh unread count
      await fetchUnreadCount();
      return true;
    } catch (err) {
      console.error('Exception marking conversation as read:', err);
      return false;
    }
  };

  // ============================================
  // REAL-TIME SUBSCRIPTION
  // ============================================

  useEffect(() => {
    if (!friendId) return;

    const setupRealtimeSubscription = async () => {
      const playerId = await getCurrentPlayerId();
      if (!playerId) return;

      // Clean up previous subscription
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
      }

      // ✅ Create new subscription - Listen to ALL messages in this conversation
      const channel = supabase
        .channel(`messages:${playerId}:${friendId}`, {
          config: {
            broadcast: { self: true },
            presence: { key: playerId },
          },
        })
        // ✅ Listen to ALL new messages (we'll filter in callback)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
          },
          (payload) => {
            const newMessage = payload.new as Message;
            console.log('🔥 Real-time INSERT received:', {
              id: newMessage.id,
              sender_id: newMessage.sender_id,
              receiver_id: newMessage.receiver_id,
              message: newMessage.message,
            });

            // ✅ Only process messages in THIS conversation
            const isRelevant =
              (newMessage.sender_id === playerId && newMessage.receiver_id === friendId) ||
              (newMessage.sender_id === friendId && newMessage.receiver_id === playerId);

            if (!isRelevant) {
              console.log('❌ Message not relevant for this conversation, ignoring');
              return;
            }

            console.log('✅ Message is relevant, adding to state');

            setMessages((prev) => {
              // Check if message already exists
              if (prev.some((msg) => msg.id === newMessage.id)) {
                console.log('⚠️ Message already exists, skipping');
                return prev;
              }

              // If this is our own message, replace temp message
              if (newMessage.sender_id === playerId) {
                const tempIndex = prev.findIndex((msg) => msg.id.startsWith('temp-'));
                if (tempIndex >= 0) {
                  console.log('🔄 Replacing temp message with real one');
                  return prev.map((msg, idx) => (idx === tempIndex ? newMessage : msg));
                }
              }

              console.log('➕ Adding new message to state');
              return [...prev, newMessage];
            });

            // Refresh unread count if message is from friend
            if (newMessage.sender_id === friendId) {
              fetchUnreadCount();
            }
          }
        )
        // ✅ Listen to message updates (e.g., read status)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
          },
          (payload) => {
            console.log('🔄 Real-time UPDATE received:', payload.new);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? (payload.new as Message) : msg
              )
            );
            fetchUnreadCount();
          }
        )
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Successfully subscribed to real-time messages!');
          }
          if (status === 'CHANNEL_ERROR') {
            console.error('❌ Channel error:', err);
          }
          if (status === 'TIMED_OUT') {
            console.error('⏱️ Subscription timed out');
          }
          if (status === 'CLOSED') {
            console.log('🔌 Subscription closed');
          }
        });

      channelRef.current = channel;
    };

    setupRealtimeSubscription();

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [friendId, fetchUnreadCount]);

  // ============================================
  // FETCH ON MOUNT
  // ============================================

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, [fetchMessages, fetchUnreadCount]);

  // ============================================
  // REFRESH
  // ============================================

  const refreshMessages = async () => {
    await fetchMessages();
    await fetchUnreadCount();
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    markConversationAsRead,
    refreshMessages,
    unreadCount,
  };
}
