/**
 * ============================================
 * TOPBAR - REACT NATIVE VERSION
 * ============================================
 * 
 * Player information display:
 * - Avatar (clickable, stored in AsyncStorage)
 * - Level & XP progress bar
 * - Coins & Gems
 * - Stage progression (zigzag path with nodes)
 * - Difficulty badge
 * 
 * HASZNÁLAT:
 * cp exports/TopBar.rn.tsx src/components/TopBar.tsx
 * 
 * FÜGGŐSÉGEK:
 * npm install @react-native-async-storage/async-storage
 * npm install react-native-linear-gradient
 * npm install lucide-react-native
 * cd ios && pod install && cd ..
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Coins, Gem } from 'lucide-react-native';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  shadowDark: 'rgba(0, 0, 0, 0.3)',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
};

const SIZES = {
  radiusXS: 4,
  radiusLG: 12,
  radiusFull: 9999,
  fontXS: 10,
  fontSM: 12,
};

// Lecke nehézségi szintek
const LESSON_DIFFICULTIES: Record<number, 'Könnyű' | 'Közepes' | 'Nehéz'> = {
  7: 'Közepes',
  8: 'Nehéz',
  9: 'Könnyű',
  10: 'Nehéz',
  11: 'Nehéz',
  12: 'Nehéz',
  13: 'Nehéz',
  14: 'Nehéz',
  15: 'Nehéz',
};

// Szakasz node-ok pozíciói és típusai
const STAGE_NODES = [
  { x: 10, y: 35, type: 'square' },
  { x: 40, y: 15, type: 'square' },
  { x: 70, y: 35, type: 'square' },
  { x: 100, y: 15, type: 'circle' },
  { x: 130, y: 35, type: 'square' },
  { x: 150, y: 10, type: 'gem' },
];

// ============================================
// TYPES
// ============================================

interface TopBarProps {
  coins?: number;
  gems?: number;
  progressPosition?: number; // 0-based index (0-5)
  playerLevel?: number;
  currentLesson?: number;
  onAvatarClick?: () => void;
  currentStageInSection?: number; // 1-based (1-6)
  currentGameType?: 'reading' | 'matching' | 'quiz'; // Játék típusa
  currentBookLessonIndex?: number; // Könyv lecke index (0-based)
}

type DifficultyType = 'easy' | 'medium' | 'hard';

// ============================================
// COMPONENT
// ============================================

export function TopBar({
  coins = 680,
  gems = 0,
  progressPosition = 3,
  playerLevel = 2,
  currentLesson = 7,
  onAvatarClick,
  currentStageInSection = 1,
  currentGameType = 'reading',
  currentBookLessonIndex = 0,
}: TopBarProps) {
  // ============================================
  // STATE
  // ============================================

  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);

  // ============================================
  // EFFECTS
  // ============================================

  // Load avatar from AsyncStorage on mount
  useEffect(() => {
    loadAvatar();

    // Listen for app state changes (foreground)
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadAvatar();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // ============================================
  // ASYNC STORAGE
  // ============================================

  const loadAvatar = async () => {
    try {
      const saved = await AsyncStorage.getItem('player_avatar');
      setCurrentAvatar(saved || null);
    } catch (error) {
      console.error('Error loading avatar:', error);
    }
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  // Játék típus emoji és szöveg lekérése
  const getGameTypeInfo = () => {
    switch (currentGameType) {
      case 'reading':
        return { emoji: '📖', text: 'Olvasás' };
      case 'matching':
        return { emoji: '🎴', text: 'Párosítás' };
      case 'quiz':
        return { emoji: '❓', text: 'Kvíz' };
      default:
        return { emoji: '📚', text: 'Lecke' };
    }
  };

  const gameTypeInfo = getGameTypeInfo();
  
  // Aktuális lecke sorszáma (1-based display)
  const displayLessonNumber = currentBookLessonIndex + 1;

  const getNextLessonDifficulty = (): DifficultyType => {
    const difficulty = LESSON_DIFFICULTIES[currentLesson] || 'Közepes';

    switch (difficulty) {
      case 'Könnyű':
        return 'easy';
      case 'Nehéz':
        return 'hard';
      default:
        return 'medium';
    }
  };

  const difficulty = getNextLessonDifficulty();

  const getDifficultyBackgroundColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'rgba(16, 185, 129, 0.2)';
      case 'hard':
        return 'rgba(239, 68, 68, 0.2)';
      default:
        return 'rgba(6, 182, 212, 0.2)';
    }
  };

  const getDifficultyBorderColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'rgba(52, 211, 153, 0.3)';
      case 'hard':
        return 'rgba(248, 113, 113, 0.3)';
      default:
        return 'rgba(34, 211, 238, 0.3)';
    }
  };

  const getDifficultyTextColor = () => {
    switch (difficulty) {
      case 'easy':
        return '#6EE7B7';
      case 'hard':
        return '#FCA5A5';
      default:
        return '#67E8F9';
    }
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleAvatarClick = () => {
    console.log('Avatar clicked!', onAvatarClick);
    onAvatarClick?.();
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={styles.container}>
      {/* ============================================ */}
      {/* PLAYER INFO CARD (Left side) */}
      {/* ============================================ */}
      <View style={styles.playerInfoContainer}>
        <LinearGradient
          colors={['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 0.95)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.playerCard}
        >
          {/* Avatar Button */}
          <TouchableOpacity
            onPress={handleAvatarClick}
            activeOpacity={0.8}
            style={styles.avatarButton}
          >
            <View
              style={[
                styles.avatarContainer,
                currentAvatar ? styles.avatarWithImage : styles.avatarWithoutImage,
              ]}
            >
              <Text style={currentAvatar ? styles.avatarEmoji : styles.avatarPlaceholder}>
                {currentAvatar || '+'}
              </Text>
            </View>

            {/* Glow effect */}
            <View
              style={[
                styles.avatarGlow,
                currentAvatar ? styles.avatarGlowWithImage : styles.avatarGlowWithoutImage,
              ]}
            />
          </TouchableOpacity>

          {/* Info Section */}
          <View style={styles.infoSection}>
            {/* Level progression */}
            <View style={styles.levelRow}>
              {/* Level text (Cyan color) */}
              <Text style={styles.levelText}>Szint {playerLevel}.</Text>

              {/* XP Progress bar */}
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={['#FBBF24', '#FB923C', '#F97316']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBarFill,
                    { width: playerLevel === 1 ? '0%' : '1%' },
                  ]}
                />
              </View>
            </View>

            {/* Currency (Coins & Gems) */}
            <View style={styles.currencyRow}>
              {/* Coins */}
              <View style={styles.coinsContainer}>
                <LinearGradient
                  colors={['#FDE047', '#EAB308']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.coinIconBg}
                >
                  <Coins size={12} color="#78350F" />
                </LinearGradient>
                <Text style={styles.currencyText}>{coins}</Text>
              </View>

              {/* Gems */}
              <View style={styles.gemsContainer}>
                <LinearGradient
                  colors={['#C084FC', '#9333EA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gemIconBg}
                >
                  <Gem size={12} color={COLORS.white} />
                </LinearGradient>
                <Text style={styles.currencyText}>{gems}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* ============================================ */}
      {/* STAGE PROGRESSION CARD (Right side) */}
      {/* ============================================ */}
      <View style={styles.stageProgressContainer}>
        <View style={styles.stageCard}>
          {/* Stage path - Zigzag pattern */}
          <View style={styles.stagePathContainer}>
            {STAGE_NODES.map((node, index) => {
              const isActive = index < progressPosition;
              const isCurrent = index === progressPosition;

              return (
                <View key={index}>
                  {/* Connection line to next node */}
                  {index < STAGE_NODES.length - 1 && (
                    <ConnectionLine
                      from={node}
                      to={STAGE_NODES[index + 1]}
                      isActive={isActive}
                    />
                  )}

                  {/* Node display */}
                  {node.type === 'gem' ? (
                    <GemNode x={node.x} y={node.y} />
                  ) : isCurrent ? (
                    <CurrentNode x={node.x} y={node.y} />
                  ) : (
                    <RegularNode x={node.x} y={node.y} isActive={isActive} />
                  )}
                </View>
              );
            })}
          </View>

          {/* Stage info */}
          <View style={styles.stageInfoRow}>
            <View style={styles.lessonInfoBadge}>
              <Text style={styles.lessonEmoji}>{gameTypeInfo.emoji}</Text>
              <Text style={styles.lessonInfoText}>
                {displayLessonNumber}. {gameTypeInfo.text}
              </Text>
            </View>
            <Text style={styles.stageText}>Szakasz {currentStageInSection}/6</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ============================================
// SUB-COMPONENTS (Nodes)
// ============================================

// Gem node (endpoint)
function GemNode({ x, y }: { x: number; y: number }) {
  return (
    <LinearGradient
      colors={['#C084FC', '#9333EA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.gemNode,
        {
          left: x - 2,
          top: y - 2,
        },
      ]}
    >
      <Gem size={12} color={COLORS.white} />
    </LinearGradient>
  );
}

// Current position node (white pulsing)
function CurrentNode({ x, y }: { x: number; y: number }) {
  return (
    <View
      style={[
        styles.currentNode,
        {
          left: x,
          top: y,
        },
      ]}
    >
      {/* Pulse effect (simplified - could use Animated API) */}
      <View style={styles.currentNodePulse} />
    </View>
  );
}

// Regular node (active or inactive)
function RegularNode({ x, y, isActive }: { x: number; y: number; isActive: boolean }) {
  if (isActive) {
    return (
      <LinearGradient
        colors={['#DC2626', '#991B1B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.regularNode,
          styles.regularNodeActive,
          {
            left: x,
            top: y,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.regularNode,
        styles.regularNodeInactive,
        {
          left: x,
          top: y,
        },
      ]}
    />
  );
}

// Connection line between nodes
function ConnectionLine({
  from,
  to,
  isActive,
}: {
  from: { x: number; y: number; type: string };
  to: { x: number; y: number };
  isActive: boolean;
}) {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  return (
    <View
      style={[
        styles.connectionLine,
        {
          left: from.x + (from.type === 'circle' ? 6 : 4),
          top: from.y + (from.type === 'circle' ? 6 : 4),
          width: length,
          borderColor: isActive ? 'rgba(220, 38, 38, 0.7)' : 'rgba(71, 85, 105, 0.4)',
          transform: [{ rotate: `${angle}deg` }],
        },
      ]}
    />
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 90, // Fixed height to prevent clipping (avatar:56 + padding:34)
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    zIndex: 100,
  },

  // ===== PLAYER INFO (Left) =====
  playerInfoContainer: {
    position: 'absolute',
    left: 8,
    top: 14,
    zIndex: 100,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    padding: SPACING.sm,
    gap: 10,
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    // Shadow (Android)
    elevation: 8,
  },

  // Avatar
  avatarButton: {
    position: 'relative',
    zIndex: 100,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: SIZES.radiusLG,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWithImage: {
    borderColor: 'rgba(34, 211, 238, 0.8)',
    // Shadow (iOS)
    shadowColor: '#22D3EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  avatarWithoutImage: {
    borderColor: 'rgba(100, 116, 139, 0.5)',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
  },
  avatarEmoji: {
    fontSize: 30,
  },
  avatarPlaceholder: {
    fontSize: 30,
    color: COLORS.gray400,
  },
  avatarGlow: {
    position: 'absolute',
    left: -4,
    right: -4,
    top: -4,
    bottom: -4,
    borderRadius: SIZES.radiusLG,
    opacity: 0.2,
    zIndex: -10,
  },
  avatarGlowWithImage: {
    backgroundColor: '#22D3EE',
  },
  avatarGlowWithoutImage: {
    backgroundColor: COLORS.gray500,
  },

  // Info section
  infoSection: {
    flex: 1,
    gap: 6,
    minWidth: 140,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  levelText: {
    color: '#22D3EE', // Cyan color (gradient text is not supported in RN)
    fontSize: SIZES.fontSM,
    fontWeight: '600',
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.3)',
  },
  progressBarFill: {
    height: '100%',
    // Shadow (iOS)
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },

  // Currency
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinIconBg: {
    width: 20,
    height: 20,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(202, 138, 4, 0.2)',
    // Shadow (iOS)
    shadowColor: '#EAB308',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  gemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gemIconBg: {
    width: 20,
    height: 20,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(126, 34, 206, 0.2)',
    // Shadow (iOS)
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  currencyText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
    // Text shadow
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // ===== STAGE PROGRESSION (Right) =====
  stageProgressContainer: {
    position: 'absolute',
    right: 8,
    top: 14,
    zIndex: 40,
  },
  stageCard: {
    padding: SPACING.md,
  },
  stagePathContainer: {
    position: 'relative',
    width: 160,
    height: 55,
    marginBottom: SPACING.sm,
  },

  // Nodes
  gemNode: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(126, 34, 206, 0.2)',
    // Shadow (iOS)
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  currentNode: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusFull,
    borderWidth: 2,
    borderColor: COLORS.white,
    // Shadow (iOS)
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  currentNodePulse: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusFull,
    // Pulse animation (simplified - could use Animated API)
    opacity: 0.7,
  },
  regularNode: {
    position: 'absolute',
    width: 10,
    height: 10,
  },
  regularNodeActive: {
    borderWidth: 1,
    borderColor: 'rgba(127, 29, 29, 0.5)',
    borderRadius: 2,
    // Shadow (iOS)
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  regularNodeInactive: {
    backgroundColor: 'rgba(51, 65, 85, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    borderRadius: 2,
  },

  // Connection line
  connectionLine: {
    position: 'absolute',
    height: 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    transformOrigin: 'left center',
  },

  // Stage info
  stageInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radiusXS,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: SIZES.fontXS,
  },
  
  // Lecke info badge (új verzió)
  lessonInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    backgroundColor: 'rgba(6, 182, 212, 0.15)', // Cyan tint
    borderColor: 'rgba(34, 211, 238, 0.3)',
    borderRadius: SIZES.radiusXS,
    borderWidth: 1,
  },
  lessonEmoji: {
    fontSize: 12,
  },
  lessonInfoText: {
    color: '#67E8F9', // Cyan text
    fontSize: SIZES.fontXS,
  },
  
  stageText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
  },
});
