// ============================================
// RENTED BOOKS SERVICE - SUPABASE
// Kölcsönzött könyvek kezelése Supabase-ben
// ============================================

import { supabase } from '../config/supabase';
import { Database } from '../types/database';

type RentedBook = Database['public']['Tables']['rented_books']['Row'];
type RentedBookInsert = Database['public']['Tables']['rented_books']['Insert'];
type RentedBookUpdate = Database['public']['Tables']['rented_books']['Update'];

// ============================================
// KÖLCSÖNZÖTT KÖNYVEK MŰVELETEK
// ============================================

/**
 * Kölcsönzött könyvek lekérése egy játékoshoz
 */
export async function getRentedBooks(playerId: string): Promise<RentedBook[]> {
  try {
    const { data, error } = await supabase
      .from('rented_books')
      .select('*')
      .eq('player_id', playerId)
      .gte('rented_until', new Date().toISOString()) // Csak az aktív kölcsönzések
      .order('rented_at', { ascending: false });

    if (error) {
      console.error('Error fetching rented books:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching rented books:', error);
    return [];
  }
}

/**
 * Egy adott könyv lekérése egy játékostól
 */
export async function getRentedBook(
  playerId: string,
  bookTitle: string
): Promise<RentedBook | null> {
  try {
    const { data, error } = await supabase
      .from('rented_books')
      .select('*')
      .eq('player_id', playerId)
      .eq('book_title', bookTitle)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching rented book:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching rented book:', error);
    return null;
  }
}

/**
 * Könyv kölcsönzése (vagy meghosszabbítása)
 */
export async function rentBook(
  playerId: string,
  bookTitle: string,
  daysToRent: number
): Promise<RentedBook | null> {
  try {
    const rentedUntil = new Date();
    rentedUntil.setDate(rentedUntil.getDate() + daysToRent);

    // Check if book already rented
    const existing = await getRentedBook(playerId, bookTitle);

    if (existing) {
      // Update existing rental (extend)
      const { data, error } = await supabase
        .from('rented_books')
        .update({
          rented_until: rentedUntil.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('player_id', playerId)
        .eq('book_title', bookTitle)
        .select()
        .single();

      if (error) {
        console.error('Error updating rented book:', error);
        return null;
      }

      console.log(`📚 Book rental extended: ${bookTitle} until ${rentedUntil.toLocaleDateString()}`);
      return data;
    } else {
      // Insert new rental
      const { data, error } = await supabase
        .from('rented_books')
        .insert({
          player_id: playerId,
          book_title: bookTitle,
          rented_until: rentedUntil.toISOString(),
          current_lesson_index: 0,
          current_game_type: 'reading',
          is_first_round: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Error renting book:', error);
        return null;
      }

      console.log(`📚 Book rented: ${bookTitle} until ${rentedUntil.toLocaleDateString()}`);
      return data;
    }
  } catch (error) {
    console.error('Exception renting book:', error);
    return null;
  }
}

/**
 * Lecke előrehaladás frissítése
 */
export async function updateBookProgress(
  playerId: string,
  bookTitle: string,
  lessonIndex: number,
  gameType: 'reading' | 'matching' | 'quiz',
  isFirstRound: boolean = true
): Promise<RentedBook | null> {
  try {
    const { data, error } = await supabase
      .from('rented_books')
      .update({
        current_lesson_index: lessonIndex,
        current_game_type: gameType,
        is_first_round: isFirstRound,
        updated_at: new Date().toISOString(),
      })
      .eq('player_id', playerId)
      .eq('book_title', bookTitle)
      .select()
      .single();

    if (error) {
      console.error('Error updating book progress:', error);
      return null;
    }

    console.log(`📖 Progress updated: ${bookTitle} - Lesson ${lessonIndex} (${gameType})`);
    return data;
  } catch (error) {
    console.error('Exception updating book progress:', error);
    return null;
  }
}

/**
 * Könyv visszaadása (törlés)
 */
export async function returnBook(
  playerId: string,
  bookTitle: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('rented_books')
      .delete()
      .eq('player_id', playerId)
      .eq('book_title', bookTitle);

    if (error) {
      console.error('Error returning book:', error);
      return false;
    }

    console.log(`📚 Book returned: ${bookTitle}`);
    return true;
  } catch (error) {
    console.error('Exception returning book:', error);
    return false;
  }
}

/**
 * Lejárt kölcsönzések törlése
 */
export async function deleteExpiredRentals(playerId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('rented_books')
      .delete()
      .eq('player_id', playerId)
      .lt('rented_until', new Date().toISOString())
      .select();

    if (error) {
      console.error('Error deleting expired rentals:', error);
      return 0;
    }

    const count = data?.length || 0;
    if (count > 0) {
      console.log(`🗑️ Deleted ${count} expired rentals`);
    }

    return count;
  } catch (error) {
    console.error('Exception deleting expired rentals:', error);
    return 0;
  }
}

/**
 * Összes aktív kölcsönzés száma
 */
export async function getActiveRentalsCount(playerId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('rented_books')
      .select('*', { count: 'exact', head: true })
      .eq('player_id', playerId)
      .gte('rented_until', new Date().toISOString());

    if (error) {
      console.error('Error counting active rentals:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Exception counting active rentals:', error);
    return 0;
  }
}
