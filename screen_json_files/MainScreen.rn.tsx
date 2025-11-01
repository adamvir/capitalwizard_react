/**
 * ============================================
 * MAINSCREEN - REACT NATIVE VERSION
 * ============================================
 * 
 * Container komponens 7 alkomponenssel
 * - TopBar (resources: coins, gems, level)
 * - SideMenu (quick actions: lessons, shop)
 * - EventCards (activities: arena)
 * - TipBar (helpful tips)
 * - CharacterLineup (bottom navigation)
 * - PlayerStatusBar (player info: name, XP, streak)
 * - ProgressAnimation ("Továbbhaladás" button)
 * 
 * HASZNÁLAT:
 * cp exports/MainScreen.rn.tsx src/screens/MainScreen.tsx
 * 
 * FÜGGŐSÉGEK:
 * Az alkomponenseket is konvertálni kell React Native-re!
 * - TopBar.rn.tsx
 * - SideMenu.rn.tsx
 * - EventCards.rn.tsx
 * - TipBar.rn.tsx
 * - CharacterLineup.rn.tsx
 * - PlayerStatusBar.rn.tsx
 * - ProgressAnimation.rn.tsx
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

// Import alkomponensek (ezeket is konvertálni kell RN-re!)
import { TopBar } from '../components/TopBar';
import { SideMenu } from '../components/SideMenu';
import { EventCards } from '../components/EventCards';
import { TipBar } from '../components/TipBar';
import { CharacterLineup } from '../components/CharacterLineup';
import { PlayerStatusBar } from '../components/PlayerStatusBar';
import { ProgressAnimation } from '../components/ProgressAnimation';

// ============================================
// CONSTANTS (styleConstants.ts equivalent)
// ============================================

const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// ============================================
// TYPES & INTERFACES
// ============================================

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

// ============================================
// MAIN COMPONENT
// ============================================

export function MainScreen({
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
  getTotalXpForNextLevel,
}: MainScreenProps) {
  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      {/* ============================================ */}
      {/* TOP SECTION - TopBar */}
      {/* ============================================ */}
      {/* Shows player resources (coins, gems) and level */}
      {/* NAVIGATION: Avatar megnyitása az App.tsx-ből */}
      <TopBar
        coins={coins}
        gems={gems}
        progressPosition={progressPosition}
        playerLevel={playerLevel}
        currentLesson={currentLesson}
        onAvatarClick={onAvatarClick}
        currentStageInSection={currentStageInSection}
      />

      {/* ============================================ */}
      {/* MIDDLE SECTION - Game World */}
      {/* ============================================ */}
      {/* Contains side menu and event cards */}
      <View style={styles.gameWorldContainer}>
        {/* Left side menu with quick actions */}
        {/* NAVIGATION: LessonsPage, ShopPage megnyitása */}
        <SideMenu onLessonsClick={onLessonsClick} onShopClick={onShopClick} />

        {/* Center event cards showing current activities */}
        {/* NAVIGATION: ArenaPage megnyitása */}
        <EventCards onArenaClick={onArenaClick} subscriptionTier={subscriptionTier} />
      </View>

      {/* ============================================ */}
      {/* TIP BAR */}
      {/* ============================================ */}
      {/* Shows helpful tips and guidance */}
      {/* Nincs navigáció, csak info megjelenítés */}
      <TipBar />

      {/* ============================================ */}
      {/* BOTTOM MENU - CharacterLineup */}
      {/* ============================================ */}
      {/* Main navigation bar with 5 sections */}
      {/* NAVIGATION: University, Profile, Subscription, Manager */}
      <CharacterLineup
        onJumpToLesson={onJumpToLesson}
        onUniversityClick={onUniversityClick}
        onProfileClick={onProfileClick}
        onSubscriptionClick={onSubscriptionClick}
        onManagerClick={onManagerClick}
      />

      {/* ============================================ */}
      {/* PLAYER STATUS BAR */}
      {/* ============================================ */}
      {/* Shows player name, level, XP progress, and streak */}
      {/* NAVIGATION: StreakPage megnyitása */}
      <PlayerStatusBar
        playerName={playerName}
        subscriptionTier={subscriptionTier}
        streak={currentStreak}
        totalXp={totalXp}
        totalXpForNextLevel={getTotalXpForNextLevel(playerLevel + 1)}
        playerLevel={playerLevel}
        onStreakClick={onStreakClick}
      />

      {/* ============================================ */}
      {/* PROGRESS ANIMATION */}
      {/* ============================================ */}
      {/* "Továbbhaladás" button - main CTA for starting next lesson */}
      {/* NAVIGATION: Következő lecke elindítása az App.tsx-ből */}
      <ProgressAnimation
        onClick={onProgressClick}
        currentBookLessonIndex={currentBookLessonIndex}
        currentGameType={currentGameType}
        isFirstRound={isFirstRound}
      />
    </>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  gameWorldContainer: {
    flex: 1,
    position: 'relative',
    paddingBottom: SPACING.xl,
  },
});
