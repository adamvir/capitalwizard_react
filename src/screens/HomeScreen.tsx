// ============================================
// HOME SCREEN WRAPPER
// Főoldal wrapper - kezeli a state-t és átadja a MainScreen-nek
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import MainScreen from './MainScreen';
import { COLORS } from '../utils/styleConstants';
import { RootStackParamList } from '../navigation/types';
import { useCoins } from '../contexts/CoinsContext';
import { usePlayer, useStreak, useRentedBooks } from '../hooks';
import { useFriends } from '../hooks/useFriends';
import { penzugyiAlapismeretkLessons } from '../data/penzugyiAlapismeretkLessons';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

// Lesson progress type (matches LessonsScreen)
interface LessonProgress {
  [bookTitle: string]: {
    [lessonKey: string]: boolean; // lessonKey: "0-reading", "0-matching", "0-quiz", etc.
  };
}

// Default initial state
// NOTE: coins, gems, streak, and player data are now managed by Supabase
const DEFAULT_STATE = {
  playerLevel: 0,
  totalXp: 0,
  progressPosition: 0,
  currentLesson: 1,
  currentStageInSection: 1,
  playerName: 'Vendég',
  subscriptionTier: 'free' as 'free' | 'pro' | 'master',
  currentStreak: 0,
  currentBookLessonIndex: 0,
  currentGameType: 'reading' as 'reading' | 'matching' | 'quiz',
  isFirstRound: true,
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  // ============================================
  // SUPABASE HOOKS
  // ============================================
  const { player, loading: playerLoading, refreshPlayer } = usePlayer();
  const { streak } = useStreak();
  const { rentedBooks, loading: rentedBooksLoading, refreshRentedBooks } = useRentedBooks();
  const { pendingRequestsCount } = useFriends(); // Barát kérelmek száma

  // Global state (CoinsContext) - Sync with Supabase
  const { coins, gems, setCoins, setGems, setCoinsLocal, setGemsLocal } = useCoins();

  // Sync CoinsContext with Supabase player data (local only to avoid infinite loop)
  useEffect(() => {
    if (player) {
      setCoinsLocal(player.coins);
      setGemsLocal(player.diamonds);
    }
  }, [player?.coins, player?.diamonds]);

  // Game state (some still from AsyncStorage, some from Supabase)
  const playerLevel = player?.level || DEFAULT_STATE.playerLevel;
  const totalXp = player?.xp || DEFAULT_STATE.totalXp;
  const playerName = player?.username || DEFAULT_STATE.playerName;
  const subscriptionTier = player?.subscription_type || DEFAULT_STATE.subscriptionTier;
  const currentStreak = streak?.current_streak || DEFAULT_STATE.currentStreak;

  // Local state (still using AsyncStorage for now)
  const [progressPosition, setProgressPosition] = useState(DEFAULT_STATE.progressPosition);
  const [currentLesson, setCurrentLesson] = useState(DEFAULT_STATE.currentLesson);
  const [currentStageInSection, setCurrentStageInSection] = useState(DEFAULT_STATE.currentStageInSection);
  // NOTE: lastCompletionDate removed - now handled by Supabase (streaks table)
  const [currentBookLessonIndex, setCurrentBookLessonIndex] = useState(DEFAULT_STATE.currentBookLessonIndex);
  const [currentGameType, setCurrentGameType] = useState(DEFAULT_STATE.currentGameType);
  const [isFirstRound, setIsFirstRound] = useState(DEFAULT_STATE.isFirstRound);
  const [playerAvatar, setPlayerAvatar] = useState<string | null>(null);

  // Load game state on mount AND load fresh book progress from Supabase
  useEffect(() => {
    loadGameState();

    // ✅ ALSO load book progress from Supabase on mount (not just on focus)
    const loadInitialBookProgress = async () => {
      try {
        console.log('📚 HomeScreen MOUNT: Loading initial book progress from Supabase...');
        const { storage, STORAGE_KEYS } = require('../utils/storage');
        const { supabase } = require('../config/supabase');

        const playerId = await storage.getItem(STORAGE_KEYS.PLAYER_DATA);
        if (!playerId) {
          console.log('⚠️ No player ID found');
          return;
        }

        const { data: freshBooks, error } = await supabase
          .from('rented_books')
          .select('*')
          .eq('player_id', playerId)
          .order('rented_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching fresh books on mount:', error);
          return;
        }

        if (!freshBooks || freshBooks.length === 0) {
          console.log('⚠️ No rented books found on mount - using defaults');
          setCurrentBookLessonIndex(0);
          setCurrentGameType('reading');
          setIsFirstRound(true);
          return;
        }

        // ✅ ALWAYS use "Pénzügyi Alapismeretek" book for progress display
        // If not found, fall back to first book
        const primaryBook = freshBooks.find(book => book.book_title === 'Pénzügyi Alapismeretek') || freshBooks[0];

        const lessonIndex = primaryBook.current_lesson_index;
        const gameType = primaryBook.current_game_type as 'reading' | 'matching' | 'quiz';
        const isFirstRound = primaryBook.is_first_round;

        console.log(`📚 MOUNT: Loaded book progress (PRIMARY BOOK):`, {
          bookTitle: primaryBook.book_title,
          lessonIndex,
          gameType,
          isFirstRound,
          totalBooks: freshBooks.length,
        });

        setCurrentBookLessonIndex(lessonIndex);
        setCurrentGameType(gameType);
        setIsFirstRound(isFirstRound);
      } catch (error) {
        console.error('❌ Error loading initial book progress:', error);
      }
    };

    loadInitialBookProgress();
  }, []);

  // Load avatar when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadAvatar = async () => {
        try {
          const saved = await AsyncStorage.getItem('player_avatar');
          setPlayerAvatar(saved || null);
        } catch (error) {
          console.error('Error loading avatar:', error);
        }
      };
      loadAvatar();
    }, [])
  );

  // ============================================
  // REFRESH player and rented books data when screen comes into focus
  // ✅ KOMBINÁLT FRISSÍTÉS: refresh + sync egyben, DIRECT Supabase query
  // ============================================
  useFocusEffect(
    useCallback(() => {
      const refreshAndSync = async () => {
        try {
          console.log('🔄 HomeScreen focused - refreshing and syncing...');

          // 1. Refresh player
          if (refreshPlayer) {
            refreshPlayer();
          }

          // 2. Refresh rented books hook state
          if (refreshRentedBooks) {
            await refreshRentedBooks();
            console.log('✅ Rented books hook refreshed');
          }

          // 3. ✅ DIRECT SUPABASE QUERY - Garantáltan friss adatok!
          console.log('📚 HomeScreen: Getting FRESH lesson progress directly from Supabase...');
          const { storage, STORAGE_KEYS } = require('../utils/storage');
          const { supabase } = require('../config/supabase');

          const playerId = await storage.getItem(STORAGE_KEYS.PLAYER_DATA);
          if (!playerId) {
            console.log('⚠️ No player ID found');
            return;
          }

          // Query Supabase directly for FRESH data
          const { data: freshBooks, error } = await supabase
            .from('rented_books')
            .select('*')
            .eq('player_id', playerId)
            .order('rented_at', { ascending: false });

          console.log('📚 Fresh books from Supabase:', freshBooks);

          if (error) {
            console.error('❌ Error fetching fresh books:', error);
            return;
          }

          // ✅ ELLENŐRIZZÜK: Van-e kölcsönzött könyv?
          if (!freshBooks || freshBooks.length === 0) {
            console.log('⚠️ No rented books found - resetting to defaults');
            setCurrentBookLessonIndex(0);
            setCurrentGameType('reading');
            setIsFirstRound(true);
            return;
          }

          // ✅ ALWAYS use "Pénzügyi Alapismeretek" book for progress display
          // If not found, fall back to first book
          const primaryBook = freshBooks.find(book => book.book_title === 'Pénzügyi Alapismeretek') || freshBooks[0];

          const lessonIndex = primaryBook.current_lesson_index;
          const gameType = primaryBook.current_game_type as 'reading' | 'matching' | 'quiz';
          const isFirstRound = primaryBook.is_first_round;

          console.log(`📚 Supabase lesson progress (FRESH - PRIMARY BOOK):`, {
            bookTitle: primaryBook.book_title,
            lessonIndex,
            gameType,
            isFirstRound,
            totalBooks: freshBooks.length,
          });

          // Update local state
          setCurrentBookLessonIndex(lessonIndex);
          setCurrentGameType(gameType);
          setIsFirstRound(isFirstRound);
          console.log('✅ ProgressionAnimation state updated with FRESH data!');
        } catch (error) {
          console.error('❌ Error in refreshAndSync:', error);
        }
      };

      refreshAndSync();
    }, [refreshPlayer, refreshRentedBooks])
  );

  const loadGameState = async () => {
    try {
      const saved = await AsyncStorage.getItem('game_state');
      if (saved) {
        const state = JSON.parse(saved);

        // NOTE: Player data (level, xp, name, subscription) now comes from Supabase
        // Streak data also from Supabase (streaks table)
        // ✅ BOOK PROGRESS (currentBookLessonIndex, currentGameType, isFirstRound) now comes from Supabase (rented_books table)
        // Only load local UI state
        setProgressPosition(state.progressPosition || DEFAULT_STATE.progressPosition);
        setCurrentLesson(state.currentLesson || DEFAULT_STATE.currentLesson);
        setCurrentStageInSection(state.currentStageInSection || DEFAULT_STATE.currentStageInSection);

        // ❌ DON'T load book progress from AsyncStorage - it's in Supabase!
        // setCurrentBookLessonIndex, setCurrentGameType, setIsFirstRound are loaded from Supabase in useFocusEffect

        console.log('✅ Loaded local game state (UI only - book progress from Supabase)');
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
  };

  const saveGameState = async () => {
    try {
      const state = {
        // NOTE: Player data (level, xp, etc.) and streak now in Supabase
        // ✅ BOOK PROGRESS (currentBookLessonIndex, currentGameType, isFirstRound) now in Supabase (rented_books table)
        // Only save local UI state
        progressPosition,
        currentLesson,
        currentStageInSection,
        // ❌ DON'T save book progress to AsyncStorage - it's in Supabase!
      };
      await AsyncStorage.setItem('game_state', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  // Save state whenever it changes (only local UI state, not Supabase data)
  useEffect(() => {
    saveGameState();
  }, [progressPosition, currentLesson, currentStageInSection]);
  // ❌ Removed: currentBookLessonIndex, currentGameType, isFirstRound - they're in Supabase!

  // Navigation handlers
  const handleAvatarClick = () => {
    navigation.navigate('AvatarSelector', {
      subscriptionTier,
    });
  };

  const handleLessonsClick = () => {
    navigation.navigate('Lessons');
  };

  const handleShopClick = () => {
    navigation.navigate('Shop', {
      coins,
      gems,
      onCoinsChange: setCoins,
      onGemsChange: setGems,
    });
  };

  const handleFriendsClick = () => {
    navigation.navigate('Friends');
  };

  const handleArenaClick = () => {
    navigation.navigate('Arena', {
      coins,
      subscriptionTier,
      onCoinsChange: setCoins,
    });
  };

  const handleUniversityClick = () => {
    navigation.navigate('University');
  };

  const handleProfileClick = () => {
    navigation.navigate('Profile', {
      playerLevel,
      coins,
      gems,
      subscriptionTier,
    });
  };

  const handleSubscriptionClick = () => {
    navigation.navigate('Subscription', {
      subscriptionTier,
      // NOTE: No callback needed - Supabase auto-refresh will update subscriptionTier
    });
  };

  const handleManagerClick = () => {
    navigation.navigate('Manager');
  };

  const handleStreakClick = () => {
    navigation.navigate('Streak', {
      currentStreak,
      coins,
      onCoinsChange: setCoins,
    });
  };

  const handleLessonComplete = () => {
    console.log('✅ Lesson completed callback (DEPRECATED - progress now in Supabase)');

    // ✅ NO-OP: Progress is now handled entirely by Supabase (rented_books table)
    // The LessonGameScreen updates Supabase, and useFocusEffect loads fresh data when returning to HomeScreen
    // DO NOT update local state here - it would override the Supabase data!
  };

  const handleProgressClick = () => {
    console.log('🎯 ProgressClick called!', {
      lessonIndex: currentBookLessonIndex,
      gameType: currentGameType,
      isFirstRound,
      hasRentedBooks: rentedBooks.length > 0,
    });

    // ✅ ELLENŐRZÉS: Van-e kölcsönzött könyv?
    if (!rentedBooks || rentedBooks.length === 0) {
      console.log('⚠️ No rented books - navigating to Lessons screen');
      // Navigate to Lessons screen to rent a book
      navigation.navigate('Lessons');
      return;
    }

    // Navigate to lesson game with current progress
    navigation.navigate('LessonGame', {
      lessonIndex: currentBookLessonIndex,
      gameType: currentGameType,
      isFirstRound,
      onLessonComplete: handleLessonComplete,
    });
  };

  const handleJumpToLesson = (lesson: number) => {
    // TODO: Implement jump to lesson logic
    console.log('Jump to lesson:', lesson);
  };

  // Utility function - Uses exponential formula from playerService
  const getTotalXpForNextLevel = (level: number): number => {
    const { calculateXPForLevel } = require('../services/playerService');
    return calculateXPForLevel(level + 1);
  };

  // Calculate current lesson number based on book progress
  // Each page has 3 games: reading, matching, quiz
  const calculateCurrentLesson = (): number => {
    if (isFirstRound) {
      // First round: reading=1, matching=2, quiz=3 for each page
      return currentBookLessonIndex * 3 +
        (currentGameType === 'reading' ? 1 : currentGameType === 'matching' ? 2 : 3);
    } else {
      // Second round: only reading, starting from lesson 145
      return 144 + currentBookLessonIndex + 1;
    }
  };

  // Calculate stage position within section (1-6)
  // Each section = 6 lessons
  const calculateCurrentStageInSection = (): number => {
    const lessonNum = calculateCurrentLesson();
    return ((lessonNum - 1) % 6) + 1;
  };

  // Calculate progress position for TopBar zigzag (0-5)
  const calculateProgressPosition = (): number => {
    const lessonNum = calculateCurrentLesson();
    return (lessonNum - 1) % 6;
  };

  const dynamicCurrentLesson = calculateCurrentLesson();
  const dynamicCurrentStageInSection = calculateCurrentStageInSection();
  const dynamicProgressPosition = calculateProgressPosition();

  // Debug log
  console.log('📊 TopBar Progress:', {
    currentBookLessonIndex,
    currentGameType,
    isFirstRound,
    '→ Lesson #': dynamicCurrentLesson,
    '→ Stage': `${dynamicCurrentStageInSection}/6`,
    '→ Zigzag pos': dynamicProgressPosition,
  });

  // Debug streak (from Supabase)
  console.log('🔥 Current Streak:', currentStreak, 'Last Activity Date:', streak?.last_activity_date || 'N/A');

  // ============================================
  // LOADING STATE
  // ============================================

  if (playerLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Betöltés...</Text>
      </View>
    );
  }

  // ============================================
  // CALCULATE RENTED BOOK STATUS
  // ============================================

  // ✅ Check if player has any rented books (for ProgressAnimation)
  const hasRentedBook = rentedBooks && rentedBooks.length > 0;

  return (
    <View style={styles.container}>
      <MainScreen
        coins={coins}
        gems={gems}
        playerLevel={playerLevel}
        totalXp={totalXp}
        progressPosition={dynamicProgressPosition}
        currentLesson={dynamicCurrentLesson}
        currentStageInSection={dynamicCurrentStageInSection}
        playerName={playerName}
        subscriptionTier={subscriptionTier}
        currentStreak={currentStreak}
        currentBookLessonIndex={currentBookLessonIndex}
        currentGameType={currentGameType}
        isFirstRound={isFirstRound}
        playerAvatar={playerAvatar}
        hasRentedBook={hasRentedBook}
        pendingFriendRequestsCount={pendingRequestsCount}
        onAvatarClick={handleAvatarClick}
        onLessonsClick={handleLessonsClick}
        onShopClick={handleShopClick}
        onFriendsClick={handleFriendsClick}
        onArenaClick={handleArenaClick}
        onUniversityClick={handleUniversityClick}
        onProfileClick={handleProfileClick}
        onSubscriptionClick={handleSubscriptionClick}
        onManagerClick={handleManagerClick}
        onStreakClick={handleStreakClick}
        onProgressClick={handleProgressClick}
        onJumpToLesson={handleJumpToLesson}
        getTotalXpForNextLevel={getTotalXpForNextLevel}
        hasVideoBackground={true}
        videoUrl="https://videocdn.pollo.ai/web-cdn/pollo/production/cmh0vhqz20dozt1traxsl49z5/ori/1762020106914-f7200d01-c5e8-410e-a954-516bca08a854.mp4"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgDark,
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textLight,
    fontSize: 16,
  },
});
