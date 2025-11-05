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
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

// Import alkomponensek
import { TopBar } from '../components/ui/TopBar';
import { SideMenu } from '../components/ui/SideMenu';
import { EventCards } from '../components/ui/EventCards';
import { TipBar } from '../components/ui/TipBar';
import { CharacterLineup } from '../components/ui/CharacterLineup';
import { PlayerStatusBar } from '../components/ui/PlayerStatusBar';
import { ProgressAnimation } from '../components/animations/ProgressAnimation';
import { LinearGradient } from 'expo-linear-gradient';

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
  '2xl': 32,
  '3xl': 48,
};

const SIZES = {
  width12: 48,
  width16: 64,
  width20: 80,
  width24: 96,
  width32: 128,
  width40: 160,
  height16: 64,
  height20: 80,
  height24: 96,
  height28: 112,
  height32: 128,
  height40: 160,
  radiusLG: 12,
  radiusFull: 9999,
};

const OPACITY = {
  30: 0.3,
  40: 0.4,
  100: 1.0,
};

const Z_INDEX = {
  base: 1,
  overlay: 10,
  content: 20,
};

const COLORS = {
  transparent: 'transparent',
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  playerAvatar?: string | null;

  // Lesson state
  currentBookLessonIndex: number;
  currentGameType: 'reading' | 'matching' | 'quiz';
  isFirstRound: boolean;
  hasRentedBook: boolean;

  // Navigation callbacks
  onAvatarClick: () => void;
  onLessonsClick: () => void;
  onShopClick: () => void;
  onFriendsClick: () => void;
  onArenaClick: () => void;
  onUniversityClick: () => void;
  onProfileClick: () => void;
  onSubscriptionClick: () => void;
  onManagerClick: () => void;
  onStreakClick: () => void;
  onProgressClick: () => void;
  onJumpToLesson: (lesson: number) => void;

  // Friend requests badge
  pendingFriendRequestsCount?: number;

  // Utils
  getTotalXpForNextLevel: (level: number) => number;

  // Video background
  hasVideoBackground?: boolean;
  videoUrl?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

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
  playerAvatar,
  currentBookLessonIndex,
  currentGameType,
  isFirstRound,
  hasRentedBook,
  onAvatarClick,
  onLessonsClick,
  onShopClick,
  onFriendsClick,
  onArenaClick,
  onUniversityClick,
  onProfileClick,
  onSubscriptionClick,
  onManagerClick,
  onStreakClick,
  onProgressClick,
  onJumpToLesson,
  pendingFriendRequestsCount = 0,
  getTotalXpForNextLevel,
  hasVideoBackground = false,
  videoUrl,
}: MainScreenProps) {
  // ===== COMPUTED VALUES =====
  const totalXpForNextLevel = getTotalXpForNextLevel(playerLevel + 1);

  // Dinamikus háttérszín - Videó jelenlététől függ
  const containerBackgroundColor = hasVideoBackground
    ? COLORS.transparent
    : 'rgba(15, 23, 42, 1)';

  // Dinamikus overlay opacity és z-index
  const overlayOpacity = hasVideoBackground ? OPACITY[40] : OPACITY[100];
  const overlayZIndex = hasVideoBackground ? Z_INDEX.overlay : Z_INDEX.base;

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={[styles.container, { backgroundColor: containerBackgroundColor }]}>
      {/* Videó háttér - Leghátsó réteg (Z-index 0) */}
      {videoUrl && (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
          />
        </View>
      )}

      {/* Háttér fantasy kristálybarlang téma overlay-el */}
      <View style={[styles.backgroundOverlay, { opacity: overlayOpacity, zIndex: overlayZIndex }]}>
        {/* Gradiens háttér - Radial és linear kombináció (approximation) */}
        <LinearGradient
          colors={[
            'rgba(139, 92, 246, 0.24)', // 30% pozícióban purple
            'rgba(15, 23, 42, 0.8)',     // középen
            'rgba(88, 28, 135, 0.4)',    // alul
          ]}
          start={{ x: 0.3, y: 0.4 }}
          end={{ x: 0.7, y: 0.6 }}
          style={styles.gradientBackground}
        />

        {/* Kristály dekorációk - Sarkok */}
        <LinearGradient
          colors={['rgba(147, 51, 234, 0.4)', COLORS.transparent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.crystalBottomLeft}
        />

        <LinearGradient
          colors={['rgba(37, 99, 235, 0.3)', COLORS.transparent]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.crystalBottomRight}
        />

        <LinearGradient
          colors={['rgba(168, 85, 247, 0.2)', COLORS.transparent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.crystalTopLeftCenter}
        />

        <LinearGradient
          colors={['rgba(236, 72, 153, 0.2)', COLORS.transparent]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.crystalTopRightCenter}
        />

        {/* Barlang kristályok - Szétszórva alul */}
        <LinearGradient
          colors={['rgba(147, 51, 234, 0.5)', 'rgba(168, 85, 247, 0.3)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.caveCrystalBottomLeft1}
        />

        <LinearGradient
          colors={['rgba(37, 99, 235, 0.4)', 'rgba(96, 165, 250, 0.2)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.caveCrystalBottomLeft2}
        />

        <LinearGradient
          colors={['rgba(219, 39, 119, 0.4)', 'rgba(244, 114, 182, 0.2)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.caveCrystalBottomRight}
        />
      </View>

      {/* Fő tartalom - Videó és kristály overlay felett */}
      <View style={styles.mainContent}>
        {/* Felső szekció - TopBar */}
        <TopBar
          coins={coins}
          gems={gems}
          progressPosition={progressPosition}
          playerLevel={playerLevel}
          currentLesson={currentLesson}
          onAvatarClick={onAvatarClick}
          currentStageInSection={currentStageInSection}
          playerAvatar={playerAvatar}
          totalXp={totalXp}
          totalXpForNextLevel={totalXpForNextLevel}
        />

        {/* Középső szekció - Játék világ (SideMenu + EventCards) */}
        <View style={styles.middleSection}>
          <SideMenu
            onLessonsClick={onLessonsClick}
            onShopClick={onShopClick}
            onFriendsClick={onFriendsClick}
            pendingFriendRequestsCount={pendingFriendRequestsCount}
          />
          <EventCards onArenaClick={onArenaClick} subscriptionTier={subscriptionTier} />
        </View>

        {/* Tipp sáv */}
        <TipBar />

        {/* Alsó menü - Character lineup */}
        <CharacterLineup
          onJumpToLesson={onJumpToLesson}
          onUniversityClick={onUniversityClick}
          onProfileClick={onProfileClick}
          onSubscriptionClick={onSubscriptionClick}
          onManagerClick={onManagerClick}
        />

        {/* Játékos státusz sáv */}
        <PlayerStatusBar
          playerName={playerName}
          subscriptionTier={subscriptionTier}
          streak={currentStreak}
          totalXp={totalXp}
          totalXpForNextLevel={totalXpForNextLevel}
          playerLevel={playerLevel}
          onStreakClick={onStreakClick}
        />

        {/* Progress animáció - "Tovább" gomb */}
        <ProgressAnimation
          onClick={onProgressClick}
          currentBookLessonIndex={currentBookLessonIndex}
          currentGameType={currentGameType}
          isFirstRound={isFirstRound}
          hasRentedBook={hasRentedBook}
        />
      </View>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Fő konténer - Teljes képernyő, overflow hidden
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },

  // Videó konténer - Leghátsó réteg (Z-index 0)
  videoContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
    overflow: 'hidden',
  },

  // Videó elem - teljes láthatóság
  video: {
    width: '100%',
    height: '100%',
    opacity: 1.0,
  },

  // Háttér overlay - Fantasy kristálybarlang téma
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },

  // Gradiens háttér - Radial és linear gradiens kombinálva
  gradientBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: OPACITY[30],
  },

  // Kristály dekoráció - Bal alsó sarok
  crystalBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: SIZES.width32,
    height: SIZES.height40,
    borderTopRightRadius: SIZES.radiusFull,
  },

  // Kristály dekoráció - Jobb alsó sarok
  crystalBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: SIZES.width40,
    height: SIZES.height32,
    borderTopLeftRadius: SIZES.radiusFull,
  },

  // Kristály dekoráció - Bal középső rész (forgatva)
  crystalTopLeftCenter: {
    position: 'absolute',
    top: '33.333333%',
    left: '25%',
    width: SIZES.width24,
    height: SIZES.height32,
    transform: [{ rotate: '-12deg' }],
  },

  // Kristály dekoráció - Jobb középső rész (forgatva)
  crystalTopRightCenter: {
    position: 'absolute',
    top: '50%',
    right: '33.333333%',
    width: SIZES.width20,
    height: SIZES.height28,
    transform: [{ rotate: '12deg' }],
  },

  // Barlang kristályok - Bal alsó scatter 1
  caveCrystalBottomLeft1: {
    position: 'absolute',
    bottom: 192,
    left: SPACING['2xl'],
    width: SIZES.width16,
    height: SIZES.height20,
    borderTopLeftRadius: SIZES.radiusLG,
    borderTopRightRadius: SIZES.radiusLG,
    transform: [{ rotate: '12deg' }],
  },

  // Barlang kristályok - Bal alsó scatter 2
  caveCrystalBottomLeft2: {
    position: 'absolute',
    bottom: 208,
    left: 80,
    width: SIZES.width12,
    height: SIZES.height16,
    borderTopLeftRadius: SIZES.radiusLG,
    borderTopRightRadius: SIZES.radiusLG,
    transform: [{ rotate: '-6deg' }],
  },

  // Barlang kristályok - Jobb alsó scatter
  caveCrystalBottomRight: {
    position: 'absolute',
    bottom: 192,
    right: SPACING['3xl'],
    width: SIZES.width20,
    height: SIZES.height24,
    borderTopLeftRadius: SIZES.radiusLG,
    borderTopRightRadius: SIZES.radiusLG,
    transform: [{ rotate: '6deg' }],
  },

  // Fő tartalom konténer - Flex column layout
  mainContent: {
    position: 'relative',
    height: '100%',
    flexDirection: 'column',
    paddingTop: SPACING.md,
    zIndex: Z_INDEX.content,
  },

  // Középső szekció - Játék világ (flex-1)
  middleSection: {
    flex: 1,
    position: 'relative',
    paddingBottom: SPACING['2xl'],
  },
});
