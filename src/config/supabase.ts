// ============================================
// SUPABASE CONFIGURATION
// ============================================

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// FONTOS: Cseréld le ezeket a saját Supabase projekt értékeiddel!
// Ezeket a Supabase dashboard-on találod: https://app.supabase.com
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Supabase client létrehozása
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // AsyncStorage használata session tárolásra
    storage: undefined, // Később AsyncStorage-t fogunk használni ha kell auth
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper függvény a kapcsolat tesztelésére
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('players').select('count').single();
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned, ami oké
      console.error('Supabase connection error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}
