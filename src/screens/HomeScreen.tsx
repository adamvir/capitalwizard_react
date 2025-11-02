// ============================================
// HOME SCREEN WRAPPER
// Főoldal wrapper - kezeli a state-t és átadja a MainScreen-nek
// ============================================

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import MainScreen from './MainScreen';
import { COLORS } from '../utils/styleConstants';
import { RootStackParamList } from '../navigation/types';
import { useCoins } from '../contexts/CoinsContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

// Default initial state
// NOTE: coins and gems are now managed by CoinsContext
const DEFAULT_STATE = {
  playerLevel: 1,
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
  // Global state (CoinsContext)
  const { coins, gems, setCoins, setGems } = useCoins();

  // Game state
  const [playerLevel, setPlayerLevel] = useState(DEFAULT_STATE.playerLevel);
  const [totalXp, setTotalXp] = useState(DEFAULT_STATE.totalXp);
  const [progressPosition, setProgressPosition] = useState(DEFAULT_STATE.progressPosition);
  const [currentLesson, setCurrentLesson] = useState(DEFAULT_STATE.currentLesson);
  const [currentStageInSection, setCurrentStageInSection] = useState(DEFAULT_STATE.currentStageInSection);
  const [playerName, setPlayerName] = useState(DEFAULT_STATE.playerName);
  const [subscriptionTier, setSubscriptionTier] = useState(DEFAULT_STATE.subscriptionTier);
  const [currentStreak, setCurrentStreak] = useState(DEFAULT_STATE.currentStreak);
  const [currentBookLessonIndex, setCurrentBookLessonIndex] = useState(DEFAULT_STATE.currentBookLessonIndex);
  const [currentGameType, setCurrentGameType] = useState(DEFAULT_STATE.currentGameType);
  const [isFirstRound, setIsFirstRound] = useState(DEFAULT_STATE.isFirstRound);

  // Load game state on mount
  useEffect(() => {
    loadGameState();
  }, []);

  const loadGameState = async () => {
    try {
      const saved = await AsyncStorage.getItem('game_state');
      if (saved) {
        const state = JSON.parse(saved);
        // NOTE: coins and gems are now managed by CoinsContext
        setPlayerLevel(state.playerLevel || DEFAULT_STATE.playerLevel);
        setTotalXp(state.totalXp || DEFAULT_STATE.totalXp);
        setProgressPosition(state.progressPosition || DEFAULT_STATE.progressPosition);
        setCurrentLesson(state.currentLesson || DEFAULT_STATE.currentLesson);
        setCurrentStageInSection(state.currentStageInSection || DEFAULT_STATE.currentStageInSection);
        setPlayerName(state.playerName || DEFAULT_STATE.playerName);
        setSubscriptionTier(state.subscriptionTier || DEFAULT_STATE.subscriptionTier);
        setCurrentStreak(state.currentStreak || DEFAULT_STATE.currentStreak);
        setCurrentBookLessonIndex(state.currentBookLessonIndex || DEFAULT_STATE.currentBookLessonIndex);
        setCurrentGameType(state.currentGameType || DEFAULT_STATE.currentGameType);
        setIsFirstRound(state.isFirstRound !== undefined ? state.isFirstRound : DEFAULT_STATE.isFirstRound);
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
  };

  const saveGameState = async () => {
    try {
      const state = {
        // NOTE: coins and gems are now managed by CoinsContext (separate AsyncStorage)
        playerLevel,
        totalXp,
        progressPosition,
        currentLesson,
        currentStageInSection,
        playerName,
        subscriptionTier,
        currentStreak,
        currentBookLessonIndex,
        currentGameType,
        isFirstRound,
      };
      await AsyncStorage.setItem('game_state', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  // Save state whenever it changes
  useEffect(() => {
    saveGameState();
  }, [playerLevel, totalXp, progressPosition, currentLesson, currentStageInSection,
      playerName, subscriptionTier, currentStreak, currentBookLessonIndex, currentGameType, isFirstRound]);

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
      onSubscriptionChange: setSubscriptionTier,
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
    });

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
        onAvatarClick={handleAvatarClick}
        onLessonsClick={handleLessonsClick}
        onShopClick={handleShopClick}
        onArenaClick={handleArenaClick}
        onUniversityClick={handleUniversityClick}
        onProfileClick={handleProfileClick}
        onSubscriptionClick={handleSubscriptionClick}
        onManagerClick={handleManagerClick}
        onStreakClick={handleStreakClick}
        onProgressClick={handleProgressClick}
        onJumpToLesson={handleJumpToLesson}
        getTotalXpForNextLevel={getTotalXpForNextLevel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
