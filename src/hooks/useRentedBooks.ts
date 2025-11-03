// ============================================
// RENTED BOOKS HOOK - REACT HOOK A KÖLCSÖNZÖTT KÖNYVEKHEZ
// ============================================

import { useState, useEffect, useCallback } from 'react';
import {
  getRentedBooks,
  getRentedBook,
  rentBook,
  updateBookProgress,
  returnBook,
  deleteExpiredRentals,
  getActiveRentalsCount,
} from '../services/rentedBooksService';
import { Database } from '../types/database';
import { storage, STORAGE_KEYS } from '../utils/storage';

type RentedBook = Database['public']['Tables']['rented_books']['Row'];

interface UseRentedBooksReturn {
  rentedBooks: RentedBook[];
  loading: boolean;
  error: string | null;
  refreshRentedBooks: () => Promise<void>;
  rentNewBook: (bookTitle: string, daysToRent: number) => Promise<RentedBook | null>;
  updateProgress: (
    bookTitle: string,
    lessonIndex: number,
    gameType: 'reading' | 'matching' | 'quiz',
    isFirstRound?: boolean
  ) => Promise<RentedBook | null>;
  returnBookById: (bookTitle: string) => Promise<boolean>;
  getBookByTitle: (bookTitle: string) => RentedBook | undefined;
  activeRentalsCount: number;
}

/**
 * React Hook a kölcsönzött könyvek kezeléséhez
 *
 * Használat:
 * ```tsx
 * const { rentedBooks, rentNewBook, updateProgress } = useRentedBooks();
 *
 * // Könyv kölcsönzése
 * await rentNewBook('Pénzügyi Alapismeretek', 7);
 *
 * // Előrehaladás frissítése
 * await updateProgress('Pénzügyi Alapismeretek', 5, 'reading');
 * ```
 */
export function useRentedBooks(): UseRentedBooksReturn {
  const [rentedBooks, setRentedBooks] = useState<RentedBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRentalsCount, setActiveRentalsCount] = useState<number>(0);

  // Get player ID from storage
  const getPlayerId = useCallback(async (): Promise<string | null> => {
    try {
      const playerId = await storage.getItem<string>(STORAGE_KEYS.PLAYER_DATA);
      return playerId;
    } catch (err) {
      console.error('Error getting player ID:', err);
      return null;
    }
  }, []);

  // Load rented books
  const loadRentedBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const playerId = await getPlayerId();
      if (!playerId) {
        setError('Nincs bejelentkezett játékos');
        return;
      }

      // Delete expired rentals first
      await deleteExpiredRentals(playerId);

      // Load active rentals
      const books = await getRentedBooks(playerId);
      setRentedBooks(books);

      // Get active rentals count
      const count = await getActiveRentalsCount(playerId);
      setActiveRentalsCount(count);

      console.log(`📚 Loaded ${books.length} rented books`);
    } catch (err) {
      setError('Hiba történt a könyvek betöltésekor');
      console.error('Load rented books error:', err);
    } finally {
      setLoading(false);
    }
  }, [getPlayerId]);

  // Initial load
  useEffect(() => {
    loadRentedBooks();
  }, [loadRentedBooks]);

  // Refresh rented books
  const refreshRentedBooks = useCallback(async () => {
    await loadRentedBooks();
  }, [loadRentedBooks]);

  // Rent a new book
  const rentNewBook = useCallback(
    async (bookTitle: string, daysToRent: number): Promise<RentedBook | null> => {
      const playerId = await getPlayerId();
      if (!playerId) {
        console.error('No player ID found');
        return null;
      }

      try {
        const book = await rentBook(playerId, bookTitle, daysToRent);
        if (book) {
          // Refresh the list
          await refreshRentedBooks();
        }
        return book;
      } catch (err) {
        console.error('Error renting book:', err);
        setError('Nem sikerült kölcsönözni a könyvet');
        return null;
      }
    },
    [getPlayerId, refreshRentedBooks]
  );

  // Update book progress
  const updateProgress = useCallback(
    async (
      bookTitle: string,
      lessonIndex: number,
      gameType: 'reading' | 'matching' | 'quiz',
      isFirstRound: boolean = true
    ): Promise<RentedBook | null> => {
      const playerId = await getPlayerId();
      if (!playerId) {
        console.error('No player ID found');
        return null;
      }

      try {
        const book = await updateBookProgress(
          playerId,
          bookTitle,
          lessonIndex,
          gameType,
          isFirstRound
        );
        if (book) {
          // Update local state
          setRentedBooks((prev) =>
            prev.map((b) =>
              b.book_title === bookTitle && b.player_id === playerId ? book : b
            )
          );
        }
        return book;
      } catch (err) {
        console.error('Error updating book progress:', err);
        setError('Nem sikerült frissíteni az előrehaladást');
        return null;
      }
    },
    [getPlayerId]
  );

  // Return book
  const returnBookById = useCallback(
    async (bookTitle: string): Promise<boolean> => {
      const playerId = await getPlayerId();
      if (!playerId) {
        console.error('No player ID found');
        return false;
      }

      try {
        const success = await returnBook(playerId, bookTitle);
        if (success) {
          // Refresh the list
          await refreshRentedBooks();
        }
        return success;
      } catch (err) {
        console.error('Error returning book:', err);
        setError('Nem sikerült visszaadni a könyvet');
        return false;
      }
    },
    [getPlayerId, refreshRentedBooks]
  );

  // Get book by title
  const getBookByTitle = useCallback(
    (bookTitle: string): RentedBook | undefined => {
      return rentedBooks.find((b) => b.book_title === bookTitle);
    },
    [rentedBooks]
  );

  return {
    rentedBooks,
    loading,
    error,
    refreshRentedBooks,
    rentNewBook,
    updateProgress,
    returnBookById,
    getBookByTitle,
    activeRentalsCount,
  };
}
