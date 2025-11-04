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

  // Load game state on mount
  useEffect(() => {
    loadGameState();
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
  // ============================================
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 HomeScreen focused - refreshing player data and rented books...');
      if (refreshPlayer) {
        refreshPlayer();
      }
      if (refreshRentedBooks) {
        refreshRentedBooks();
      }
    }, [refreshPlayer, refreshRentedBooks])
  );

  // ============================================
  // SYNC LESSON PROGRESS - Get current lesson from Supabase rented_books table
  // ✅ SUPABASE SOURCE OF TRUTH - Directly from rented_books.current_lesson_index
  // ============================================
  useFocusEffect(
    useCallback(() => {
      const syncLessonProgress = async () => {
        try {
          console.log('📚 HomeScreen: Syncing lesson progress from Supabase...');

          // ✅ ELLENŐRIZZÜK: Van-e kölcsönzött könyv?
          if (!rentedBooks || rentedBooks.length === 0) {
            console.log('⚠️ No rented books found - resetting to defaults');
            setCurrentBookLessonIndex(0);
            setCurrentGameType('reading');
            setIsFirstRound(true);
            return;
          }

          // ✅ Take the first rented book's progress (Supabase source of truth)
          const firstBook = rentedBooks[0];
          const lessonIndex = firstBook.current_lesson_index;
          const gameType = firstBook.current_game_type as 'reading' | 'matching' | 'quiz';
          const isFirstRound = firstBook.is_first_round;

          console.log(`📚 Supabase lesson progress:`, {
            bookTitle: firstBook.book_title,
            lessonIndex,
            gameType,
            isFirstRound,
          });

          // Update local state
          setCurrentBookLessonIndex(lessonIndex);
          setCurrentGameType(gameType);
          setIsFirstRound(isFirstRound);
        } catch (error) {
          console.error('Error syncing lesson progress:', error);
        }
      };

      syncLessonProgress();
    }, [rentedBooks])
  );

  const loadGameState = async () => {
    try {
      const saved = await AsyncStorage.getItem('game_state');
      if (saved) {
        const state = JSON.parse(saved);

        // NOTE: Player data (level, xp, name, subscription) now comes from Supabase
        // Streak data also from Supabase (streaks table)
        // Only load local game state (progress, lessons, etc.)
        setProgressPosition(state.progressPosition || DEFAULT_STATE.progressPosition);
        setCurrentLesson(state.currentLesson || DEFAULT_STATE.currentLesson);
        setCurrentStageInSection(state.currentStageInSection || DEFAULT_STATE.currentStageInSection);
        setCurrentBookLessonIndex(state.currentBookLessonIndex || DEFAULT_STATE.currentBookLessonIndex);
        setCurrentGameType(state.currentGameType || DEFAULT_STATE.currentGameType);
        setIsFirstRound(state.isFirstRound !== undefined ? state.isFirstRound : DEFAULT_STATE.isFirstRound);

        console.log('✅ Loaded local game state (progress, lessons)');
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
  };

  const saveGameState = async () => {
    try {
      const state = {
        // NOTE: Player data (level, xp, etc.) and streak now in Supabase
        // Only save local game state (lesson progress)
        progressPosition,
        currentLesson,
        currentStageInSection,
        currentBookLessonIndex,
        currentGameType,
        isFirstRound,
      };
      await AsyncStorage.setItem('game_state', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  // Save state whenever it changes (only local game state, not Supabase data)
  useEffect(() => {
    saveGameState();
  }, [progressPosition, currentLesson, currentStageInSection,
      currentBookLessonIndex, currentGameType, isFirstRound]);

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
    console.log('✅ Lesson completed!', {
      currentBookLessonIndex,
      currentGameType,
      isFirstRound
    });

    // NOTE: Streak tracking is handled in LessonGameScreen (via Supabase)
    // This function only handles lesson progress navigation

    // Update progress based on current game type (following the LECKE_RENDSZER_MUKODES.md logic)
    if (isFirstRound) {
      if (currentGameType === 'reading') {
        // Reading done -> next is Matching
        setCurrentGameType('matching');
      } else if (currentGameType === 'matching') {
        // Matching done -> next is Quiz
        setCurrentGameType('quiz');
      } else {
        // Quiz done -> next page, start with Reading
        const nextPage = currentBookLessonIndex + 1;
        if (nextPage >= 48) {
          // First round complete -> start second round
          setIsFirstRound(false);
          setCurrentBookLessonIndex(0);
          setCurrentGameType('reading');
        } else {
          setCurrentBookLessonIndex(nextPage);
          setCurrentGameType('reading');
        }
      }
    } else {
      // Second round - only reading
      const nextPage = currentBookLessonIndex + 1;
      if (nextPage >= 48) {
        // Book complete - restart
        setCurrentBookLessonIndex(0);
        setCurrentGameType('reading');
        setIsFirstRound(true);
      } else {
        setCurrentBookLessonIndex(nextPage);
      }
    }
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

  // Utility function
  const getTotalXpForNextLevel = (level: number): number => {
    // Simple XP calculation: level * 100
    return level * 100;
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
