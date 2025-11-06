/**
 * ============================================
 * AUTH HOOK - Supabase Anonymous Authentication
 * ============================================
 * Automatikus session kezelés, nem engedi a player duplikációt
 *
 * A Supabase Auth automatikusan:
 * - Perzisztens session-t tárol
 * - Refresh token-t kezel
 * - Egyedi user ID-t generál (UUID)
 * - Nem engedi a duplikációt
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { Session, User } from '@supabase/supabase-js';
import { storage, STORAGE_KEYS } from '../utils/storage';

interface UseAuthReturn {
  session: Session | null;
  user: User | null;
  userId: string | null;
  loading: boolean;
  signInAnonymously: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

/**
 * Supabase Anonymous Auth Hook
 *
 * Automatikusan kezeli a session-t és user-t.
 * Perzisztens, nem lehet duplikálni.
 *
 * Használat:
 * ```tsx
 * const { userId, loading, signInAnonymously } = useAuth();
 *
 * // First time user - sign in anonymously
 * if (!userId && !loading) {
 *   await signInAnonymously();
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Get current session on mount
  useEffect(() => {
    console.log('🔐 Checking for existing auth session...');

    // Get session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 Existing session:', session ? 'Found ✅' : 'Not found ❌');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // If no session, sign in anonymously
      if (!session) {
        console.log('🔐 No session found, signing in anonymously...');
        signInAnonymously();
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔐 Auth state changed:', _event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign in anonymously
   * This creates a persistent session that won't duplicate
   */
  const signInAnonymously = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔐 Signing in anonymously...');

      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.error('❌ Error signing in anonymously:', error);
        return false;
      }

      if (data.session) {
        console.log('✅ Anonymous sign-in successful!', data.user.id);
        setSession(data.session);
        setUser(data.user);

        // Store user ID in AsyncStorage for backwards compatibility
        await storage.setItem(STORAGE_KEYS.PLAYER_DATA, data.user.id);
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Exception signing in anonymously:', error);
      return false;
    }
  }, []);

  /**
   * Sign out (clear session)
   */
  const signOut = useCallback(async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      await storage.removeItem(STORAGE_KEYS.PLAYER_DATA);
      setSession(null);
      setUser(null);
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Error signing out:', error);
    }
  }, []);

  return {
    session,
    user,
    userId: user?.id ?? null,
    loading,
    signInAnonymously,
    signOut,
  };
}
