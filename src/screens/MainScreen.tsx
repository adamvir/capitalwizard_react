// ============================================
// MAIN SCREEN
// Főoldal - tartalmazza az összes fő UI elemet
// ============================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import { TopBar } from '../components/ui/TopBar';
import { SideMenu } from '../components/ui/SideMenu';
import { EventCards } from '../components/ui/EventCards';
import { TipBar } from '../components/ui/TipBar';
import { CharacterLineup } from '../components/ui/CharacterLineup';
import { PlayerStatusBar } from '../components/ui/PlayerStatusBar';
import { ProgressAnimation } from '../components/animations/ProgressAnimation';
import { BackgroundDecoration } from '../components/ui/BackgroundDecoration';
import { SPACING } from '../utils/styleConstants';

// ===== INTERFACES =====

interface MainScreenProps {
  // Player stats
  coins: number;
  gems: number;
  playerLevel: number;
  totalXp: number;
  progressPosition: number;
  currentLesson: number;
  currentStageInSection: number;
  playerName: string;
  subscriptionTier: 'free' | 'pro' | 'master';
  currentStreak: number;

  // Lesson state
  currentBookLessonIndex: number;
  currentGameType: 'reading' | 'matching' | 'quiz';
  isFirstRound: boolean;

  // Navigation callbacks
  onAvatarClick: () => void;
  onLessonsClick: () => void;
  onShopClick: () => void;
  onArenaClick: () => void;
  onUniversityClick: () => void;
  onProfileClick: () => void;
  onSubscriptionClick: () => void;
  onManagerClick: () => void;
  onStreakClick: () => void;
  onProgressClick: () => void;
  onJumpToLesson: (lesson: number) => void;

  // Utils
  getTotalXpForNextLevel: (level: number) => number;
}

// ===== COMPONENT =====

export default function MainScreen({
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
  onAvatarClick,
  onLessonsClick,
  onShopClick,
  onArenaClick,
  onUniversityClick,
  onProfileClick,
  onSubscriptionClick,
  onManagerClick,
  onStreakClick,
  onProgressClick,
  onJumpToLesson,
  getTotalXpForNextLevel
}: MainScreenProps) {

  // Check if this screen is focused
  const isFocused = useIsFocused();

  // ===== RENDER =====
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', 'rgba(88, 28, 135, 0.4)', '#0f172a']}
        style={styles.background}
      >
        <BackgroundDecoration />

        {/* Only show UI elements when screen is focused */}
        {isFocused && (
          <View style={styles.content}>
            <TopBar
              coins={coins}
              gems={gems}
              progressPosition={progressPosition}
              playerLevel={playerLevel}
              currentLesson={currentLesson}
              onAvatarClick={onAvatarClick}
              currentStageInSection={currentStageInSection}
            />

            <View style={styles.gameWorldContainer}>
              <SideMenu
                onLessonsClick={onLessonsClick}
                onShopClick={onShopClick}
              />

              <EventCards
                onArenaClick={onArenaClick}
                subscriptionTier={subscriptionTier}
              />
            </View>

            <TipBar />

            <CharacterLineup
              onJumpToLesson={onJumpToLesson}
              onUniversityClick={onUniversityClick}
              onProfileClick={onProfileClick}
              onSubscriptionClick={onSubscriptionClick}
              onManagerClick={onManagerClick}
            />

            <PlayerStatusBar
              playerName={playerName}
              subscriptionTier={subscriptionTier}
              streak={currentStreak}
              totalXp={totalXp}
              totalXpForNextLevel={getTotalXpForNextLevel(playerLevel + 1)}
              playerLevel={playerLevel}
              onStreakClick={onStreakClick}
            />

            <ProgressAnimation
              onClick={onProgressClick}
              currentBookLessonIndex={currentBookLessonIndex}
              currentGameType={currentGameType}
              isFirstRound={isFirstRound}
            />
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

// ===== STYLES =====

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  gameWorldContainer: {
    flex: 1,
    position: 'relative',
    paddingBottom: SPACING.xl,
  },
});
