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

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

// Default initial state
const DEFAULT_STATE = {
  coins: 1000,
  gems: 0,
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
  // Game state
  const [coins, setCoins] = useState(DEFAULT_STATE.coins);
  const [gems, setGems] = useState(DEFAULT_STATE.gems);
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
        setCoins(state.coins || DEFAULT_STATE.coins);
        setGems(state.gems || DEFAULT_STATE.gems);
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
        coins,
        gems,
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
  }, [coins, gems, playerLevel, totalXp, progressPosition, currentLesson, currentStageInSection,
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
    navigation.navigate('University', {
      coins,
      onCoinsChange: setCoins,
    });
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

  const handleProgressClick = () => {
    // Navigate to lesson game with current progress
    navigation.navigate('LessonGame', {
      lessonIndex: currentBookLessonIndex,
      gameType: currentGameType,
      isFirstRound,
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

  return (
    <View style={styles.container}>
      <MainScreen
        coins={coins}
        gems={gems}
        playerLevel={playerLevel}
        totalXp={totalXp}
        progressPosition={progressPosition}
        currentLesson={currentLesson}
        currentStageInSection={currentStageInSection}
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
