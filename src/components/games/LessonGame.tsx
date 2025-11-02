/**
 * ============================================
 * LESSONGAME - REACT NATIVE VERSION
 * ============================================
 *
 * Matching game for lessons:
 * - Match left and right boxes (pairs)
 * - Maximum 5 pairs visible at once
 * - Timer countdown
 * - Win/Lose screens with animations
 * - Progress tracking (X/Y pairs matched)
 *
 * HASZNÁLAT:
 * <LessonGame
 *   lessonNumber={1}
 *   lessonData={lessonData}
 *   onWin={() => navigation.navigate('Next')}
 *   onBackToHome={() => navigation.goBack()}
 *   config={{
 *     matchingTimeLimit: 60,
 *     matchingPairsCount: 8,
 *   }}
 * />
 *
 * FÜGGŐSÉGEK:
 * - React Native Animated API (built-in)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  primary: '#3B82F6',
  success: '#10B981',
  danger: '#EF4444',
  crystalCyan: '#22D3EE',
  crystalPurple: '#A855F7',
  crystalPink: '#EC4899',
  xpBlueLight: '#60A5FA',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

const SIZES = {
  fontSM: 12,
  fontBase: 14,
  fontLG: 16,
  fontXL: 18,
  font2XL: 24,
  radiusLG: 12,
  radiusXL: 16,
  borderBase: 2,
};

const FONT_WEIGHT = {
  bold: '700' as const,
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================

interface Pair {
  id: number;
  left: string;
  right: string;
}

interface BoxItem {
  pairId: number;
  text: string;
  side: 'left' | 'right';
  id: string;
}

interface Lesson {
  id: number;
  title: string;
  matching: Pair[];
}

interface LessonGameProps {
  onBackToHome?: () => void;
  onWin?: () => void;
  lessonNumber?: number;
  lessonData?: Lesson;
  config?: {
    matchingTimeLimit: number;
    matchingPairsCount: number;
  };
}

// ============================================
// COMPONENT
// ============================================

export function LessonGame({
  onBackToHome,
  onWin,
  lessonNumber = 1,
  lessonData,
  config = {
    matchingTimeLimit: 60,
    matchingPairsCount: 8,
  },
}: LessonGameProps) {
  // ============================================
  // STATE
  // ============================================

  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [timeLeft, setTimeLeft] = useState(config.matchingTimeLimit);
  const [remainingPairs, setRemainingPairs] = useState<Pair[]>([]);
  const [leftBoxes, setLeftBoxes] = useState<BoxItem[]>([]);
  const [rightBoxes, setRightBoxes] = useState<BoxItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<BoxItem | null>(null);
  const [selectedRight, setSelectedRight] = useState<BoxItem | null>(null);
  const [flashingBox, setFlashingBox] = useState<string | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);

  // ============================================
  // ANIMATIONS
  // ============================================

  const emojiTranslateY = useRef(new Animated.Value(0)).current;

  // ============================================
  // EFFECTS
  // ============================================

  // Initialize game with maximum 5 pairs visible at once
  useEffect(() => {
    if (!lessonData?.matching) return;

    const sourcePairs = lessonData.matching;
    setTotalPairs(sourcePairs.length);

    // Shuffle all pairs
    const shuffled = [...sourcePairs].sort(() => Math.random() - 0.5);

    // Show maximum 5 pairs at once
    const maxVisiblePairs = 5;
    const initialPairs = shuffled.slice(0, maxVisiblePairs);
    const remaining = shuffled.slice(maxVisiblePairs);
    setRemainingPairs(remaining);

    const leftItems: BoxItem[] = initialPairs.map((pair, idx) => ({
      pairId: pair.id,
      text: pair.left,
      side: 'left' as const,
      id: `left-${pair.id}-${idx}`,
    }));

    const rightItems: BoxItem[] = initialPairs.map((pair, idx) => ({
      pairId: pair.id,
      text: pair.right,
      side: 'right' as const,
      id: `right-${pair.id}-${idx}`,
    }));

    // Shuffle left and right separately
    setLeftBoxes(leftItems.sort(() => Math.random() - 0.5));
    setRightBoxes(rightItems.sort(() => Math.random() - 0.5));
  }, [lessonData]);

  // Timer countdown
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    if (timeLeft <= 0) {
      setGameStatus('lost');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameStatus]);

  // Check for win condition
  useEffect(() => {
    if (gameStatus === 'playing' && matchedCount === config.matchingPairsCount) {
      setGameStatus('won');
    }
  }, [matchedCount, gameStatus, config.matchingPairsCount]);

  // Start emoji animation when win/lose
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      const offset = gameStatus === 'won' ? -20 : 20;

      Animated.loop(
        Animated.sequence([
          Animated.timing(emojiTranslateY, {
            toValue: offset,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(emojiTranslateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [gameStatus]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleLeftClick = (box: BoxItem) => {
    if (selectedLeft?.id === box.id) {
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(box);

    // Check if we already have a right selection
    if (selectedRight) {
      checkMatch(box, selectedRight);
    }
  };

  const handleRightClick = (box: BoxItem) => {
    if (selectedRight?.id === box.id) {
      setSelectedRight(null);
      return;
    }
    setSelectedRight(box);

    // Check if we already have a left selection
    if (selectedLeft) {
      checkMatch(selectedLeft, box);
    }
  };

  const checkMatch = (left: BoxItem, right: BoxItem) => {
    if (left.pairId === right.pairId) {
      // Correct match!
      setFlashingBox(right.id);

      setTimeout(() => {
        // Remove matched boxes
        setLeftBoxes((prev) => prev.filter((b) => b.id !== left.id));
        setRightBoxes((prev) => prev.filter((b) => b.id !== right.id));
        setSelectedLeft(null);
        setSelectedRight(null);
        setFlashingBox(null);
        setMatchedCount((prev) => prev + 1);

        // Add new pair if available
        if (remainingPairs.length > 0) {
          const newPair = remainingPairs[0];
          setRemainingPairs((prev) => prev.slice(1));

          const newLeft: BoxItem = {
            pairId: newPair.id,
            text: newPair.left,
            side: 'left',
            id: `left-${newPair.id}-${Date.now()}`,
          };

          const newRight: BoxItem = {
            pairId: newPair.id,
            text: newPair.right,
            side: 'right',
            id: `right-${newPair.id}-${Date.now()}`,
          };

          // Add to existing boxes and reshuffle
          setLeftBoxes((prev) => [...prev, newLeft].sort(() => Math.random() - 0.5));
          setRightBoxes((prev) => [...prev, newRight].sort(() => Math.random() - 0.5));
        }
      }, 500);
    } else {
      // Wrong match - deselect after brief delay
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderMatchBox = (box: BoxItem, side: 'left' | 'right') => {
    const isSelected =
      side === 'left' ? selectedLeft?.id === box.id : selectedRight?.id === box.id;
    const isFlashing = flashingBox === box.id;

    return (
      <TouchableOpacity
        key={box.id}
        onPress={() => (side === 'left' ? handleLeftClick(box) : handleRightClick(box))}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.matchBox,
            side === 'left' ? styles.matchBoxLeft : styles.matchBoxRight,
            isSelected && styles.matchBoxSelected,
            isFlashing && styles.matchBoxFlashing,
          ]}
        >
          <Text style={styles.matchBoxText}>{box.text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  // Win screen
  if (gameStatus === 'won') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centerContainer}>
        <View style={styles.resultContent}>
          {/* Animated emoji (pointing up) */}
          <Animated.Text
            style={[
              styles.emojiAnimated,
              { transform: [{ translateY: emojiTranslateY }] },
            ]}
          >
            👆
          </Animated.Text>

          <Text style={styles.resultTitle}>GYŐZTÉL!</Text>
          <Text style={styles.winSubtitle}>Minden párt sikeresen megtaláltál!</Text>

          <TouchableOpacity
            onPress={() => {
              console.log('LessonGame TOVÁBB button clicked, calling onWin');
              if (onWin) {
                onWin();
              } else {
                console.log('⚠️ LessonGame: onWin is not defined!');
              }
            }}
            activeOpacity={0.8}
            style={styles.continueButtonWin}
          >
            <Text style={styles.continueButtonText}>TOVÁBB</Text>
          </TouchableOpacity>
        </View>
        </View>
      </SafeAreaView>
    );
  }

  // Lose screen
  if (gameStatus === 'lost') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centerContainer}>
        <View style={styles.resultContent}>
          {/* Animated emoji (pointing down) */}
          <Animated.Text
            style={[
              styles.emojiAnimated,
              { transform: [{ translateY: emojiTranslateY }] },
            ]}
          >
            👇
          </Animated.Text>

          <Text style={styles.resultTitle}>VESZTETTÉL!</Text>
          <Text style={styles.loseSubtitle}>Lejárt az idő!</Text>

          <TouchableOpacity
            onPress={onBackToHome}
            activeOpacity={0.8}
            style={styles.continueButtonLose}
          >
            <Text style={styles.continueButtonText}>TOVÁBB</Text>
          </TouchableOpacity>
        </View>
        </View>
      </SafeAreaView>
    );
  }

  // Game playing screen
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.gameContainer}>
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <View style={styles.headerSection}>
        <View style={styles.headerRow}>
          <Text style={styles.lessonTitle}>{lessonNumber}. Lecke</Text>
          <View style={styles.headerStatsRow}>
            <Text style={styles.matchCounter}>
              {matchedCount}/{totalPairs}
            </Text>
            <View
              style={[
                styles.timerBadge,
                timeLeft <= 10 && styles.timerBadgeLowTime,
              ]}
            >
              <Text
                style={[
                  styles.timerText,
                  timeLeft <= 10 && styles.timerTextLowTime,
                ]}
              >
                {timeLeft}s
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ============================================ */}
      {/* GAME CONTENT */}
      {/* ============================================ */}
      <ScrollView
        style={styles.gameContentArea}
        contentContainerStyle={styles.gameContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gameGrid}>
          {/* Left column */}
          <View style={styles.columnWrapper}>
            {leftBoxes.map((box) => renderMatchBox(box, 'left'))}
          </View>

          {/* Right column */}
          <View style={styles.columnWrapper}>
            {rightBoxes.map((box) => renderMatchBox(box, 'right'))}
          </View>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  // ===== RESULT SCREENS =====
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContent: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emojiAnimated: {
    fontSize: 96,
    marginBottom: SPACING.xxxl,
    textAlign: 'center',
  },
  resultTitle: {
    color: COLORS.white,
    fontSize: 48,
    fontWeight: '700',
    marginBottom: SPACING.base,
    fontFamily: 'Georgia',
    textAlign: 'center',
  },
  winSubtitle: {
    color: COLORS.success,
    fontSize: 20,
    marginBottom: SPACING.xxl,
    textAlign: 'center',
  },
  loseSubtitle: {
    color: COLORS.danger,
    fontSize: 20,
    marginBottom: SPACING.xxl,
    textAlign: 'center',
  },

  // Continue buttons
  continueButtonWin: {
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xxxl,
    borderRadius: SIZES.radiusXL,
    backgroundColor: COLORS.success,
    // Shadow
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  continueButtonLose: {
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xxxl,
    borderRadius: SIZES.radiusXL,
    backgroundColor: COLORS.primary,
    // Shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  continueButtonText: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    letterSpacing: 1,
    textAlign: 'center',
  },

  // ===== GAME SCREEN =====
  gameContainer: {
    flex: 1,
  },

  // Header
  headerSection: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.base,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  lessonTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: '700',
  },
  headerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
  },
  matchCounter: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: '600',
  },
  timerBadge: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    backgroundColor: `${COLORS.primary}30`,
  },
  timerBadgeLowTime: {
    backgroundColor: `${COLORS.danger}30`,
  },
  timerText: {
    color: COLORS.xpBlueLight,
    fontSize: SIZES.fontSM,
    fontWeight: '700',
  },
  timerTextLowTime: {
    color: COLORS.danger,
  },

  // Game content
  gameContentArea: {
    flex: 1,
  },
  gameContentContainer: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 128, // Space for bottom navigation
  },
  gameGrid: {
    flexDirection: 'row',
    gap: SPACING.base,
  },
  columnWrapper: {
    flex: 1,
    gap: SPACING.md,
  },

  // Match boxes
  matchBox: {
    padding: SPACING.base,
    borderRadius: SIZES.radiusXL,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: SIZES.borderBase,
  },
  matchBoxLeft: {
    backgroundColor: `${COLORS.crystalPurple}30`,
    borderColor: `${COLORS.crystalPurple}80`,
  },
  matchBoxRight: {
    backgroundColor: `${COLORS.crystalPink}30`,
    borderColor: `${COLORS.crystalPink}80`,
  },
  matchBoxSelected: {
    backgroundColor: `${COLORS.primary}80`,
    borderColor: COLORS.xpBlueLight,
    transform: [{ scale: 1.05 }],
  },
  matchBoxFlashing: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  matchBoxText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: SIZES.fontSM,
  },
});
