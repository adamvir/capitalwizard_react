/**
 * ProgressAnimation - REACT NATIVE (MOTI)
 *
 * FIXES (2025-01-02):
 * ✅ Blur effect → Shadow effect (CSS blur NEM működik RN-ben)
 * ✅ Gradient text → Solid color + text shadow (backgroundClip NEM működik RN-ben)
 * ✅ Font sizes javítva (48px lessonNumber)
 * ✅ Letter spacing hozzáadva
 * ✅ Simplified no-book state
 *
 * BABEL CONFIG (babel.config.js):
 * module.exports = {
 *   presets: ['babel-preset-expo'],
 *   plugins: ['react-native-reanimated/plugin'],
 * };
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, BookOpen } from 'lucide-react-native';
import { MotiView } from 'moti';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
};

const SPACING = {
  sm: 8,
  base: 16,
  lg: 20,
};

const SIZES = {
  fontXS: 10,
  fontSM: 14,
  fontMD: 16,
  fontLG: 18,
  font2XL: 28,
  font4XL: 48,
  radiusFull: 9999,
  iconLG: 24,
};

const TOTAL_LESSONS = 18;

// ============================================
// TYPES
// ============================================

interface ProgressAnimationProps {
  onClick?: () => void;
  currentBookLessonIndex?: number;
  currentGameType?: 'reading' | 'matching' | 'quiz';
  isFirstRound?: boolean;
  hasRentedBook?: boolean; // ✅ Új prop - Supabase-ből jön
}

// ============================================
// COMPONENT
// ============================================

export function ProgressAnimation({
  onClick,
  currentBookLessonIndex = 0,
  currentGameType = 'reading',
  isFirstRound = true,
  hasRentedBook = false, // ✅ Prop-ból jön (Supabase)
}: ProgressAnimationProps) {

  // ============================================
  // CALCULATIONS
  // ============================================

  // Calculate current lesson number (every game is a separate lesson)
  const lessonNumber = isFirstRound
    ? currentBookLessonIndex * 3 +
      (currentGameType === 'reading' ? 1 : currentGameType === 'matching' ? 2 : 3)
    : TOTAL_LESSONS + currentBookLessonIndex + 1;

  // ============================================
  // RENDER - NO BOOK
  // ============================================

  if (!hasRentedBook) {
    return (
      <View style={styles.container}>
        <MotiView
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'timing',
            duration: 600,
          }}
          style={styles.noBookContent}
        >
          <View style={styles.noBookTextContainer}>
            <MotiView
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                type: 'timing',
                duration: 2000,
                loop: true,
              }}
            >
              <BookOpen
                size={64}
                color="#FBBF24"
                style={{ alignSelf: 'center', marginBottom: SPACING.base }}
              />
            </MotiView>

            <Text style={styles.noBookTitle}>Nincs kölcsönzött</Text>
            <Text style={styles.noBookMainText}>tankönyv</Text>
            <Text style={styles.noBookSubtitle}>
              Kölcsönözz ki könyvet a könyvtárból!
            </Text>
          </View>
        </MotiView>
      </View>
    );
  }

  // ============================================
  // RENDER - HAS BOOK
  // ============================================

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.contentWrapper}
        onPress={onClick}
        activeOpacity={0.9}
      >
        {/* Sparkles around the center - 8 icons in a circle */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 8;
          const top = 50 + Math.cos(angle) * 120;
          const left = Math.sin(angle) * 120;

          return (
            <MotiView
              key={i}
              style={[
                styles.sparkleAbsolute,
                { top, left: left + 150 }, // Offset for centering
              ]}
              animate={{
                scale: [0, 1, 0],
                rotate: ['0deg', '180deg', '360deg'],
                opacity: [0, 1, 0],
              }}
              transition={{
                type: 'timing',
                duration: 2000,
                delay: i * 250,
                loop: true,
              }}
            >
              <Sparkles size={SIZES.iconLG} color="#FBBF24" fill="#FBBF24" />
            </MotiView>
          );
        })}

        {/* Main text */}
        <MotiView
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'timing',
            duration: 600,
          }}
          style={styles.textContainer}
        >
          <MotiView
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              type: 'timing',
              duration: 2000,
              loop: true,
            }}
            style={styles.textInner}
          >
            <View style={styles.textContent}>
              <Text style={styles.topLabel}>Tovább haladás</Text>

              <View style={styles.lessonNumber}>
                <Text style={styles.lessonNumberText}>
                  {lessonNumber}. Lecke
                </Text>
              </View>

              <Text style={styles.bottomLabel}>következik</Text>
            </View>
          </MotiView>
        </MotiView>

        {/* Progress bar */}
        <MotiView
          from={{ width: 0, opacity: 0 }}
          animate={{ width: 200, opacity: 1 }}
          transition={{
            type: 'timing',
            delay: 300,
            duration: 500,
          }}
          style={styles.progressBarContainer}
        >
          <MotiView
            from={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              type: 'timing',
              duration: 2000,
              loop: true,
            }}
            style={styles.progressBarFillWrapper}
          >
            <LinearGradient
              colors={['#FDE047', '#C084FC', '#F9A8D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressBarFill}
            />
          </MotiView>
        </MotiView>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => {
          const top = Math.random() * 200 - 100 + 100; // Offset for centering
          const left = Math.random() * 300 - 150 + 150;
          const colors = ['#fbbf24', '#a855f7', '#ec4899'];
          const color = colors[i % 3];

          return (
            <MotiView
              key={`particle-${i}`}
              style={[styles.particle, { top, left, backgroundColor: color }]}
              animate={{
                translateY: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                type: 'timing',
                duration: 3000,
                delay: i * 200,
                loop: true,
              }}
            />
          );
        })}
      </TouchableOpacity>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Container
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'box-none',
  },

  // No book view
  noBookContent: {
    position: 'relative',
    alignItems: 'center',
    gap: SPACING.base,
    paddingHorizontal: 32,
    paddingVertical: 48,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  noBookTextContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  noBookTitle: {
    fontSize: SIZES.fontLG,
    color: COLORS.white,
    opacity: 1.0,
    marginBottom: SPACING.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  noBookMainText: {
    fontSize: SIZES.font2XL,
    color: '#FCD34D',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 0.5,
  },
  noBookSubtitle: {
    fontSize: SIZES.fontMD,
    color: COLORS.white,
    opacity: 1.0,
    marginTop: SPACING.sm,
    textAlign: 'center',
    letterSpacing: 0.3,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Has book view
  contentWrapper: {
    position: 'relative',
    alignItems: 'center',
    gap: SPACING.lg,
    paddingHorizontal: 32,
    paddingVertical: 48,
  },

  // Sparkles
  sparkleAbsolute: {
    position: 'absolute',
  },

  // Main text
  textContainer: {
    alignItems: 'center',
  },
  textInner: {
    position: 'relative',
    alignItems: 'center',
  },
  textContent: {
    position: 'relative',
    alignItems: 'center',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  topLabel: {
    fontSize: SIZES.fontSM,
    color: COLORS.white,
    opacity: 1.0,
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  lessonNumber: {
    marginBottom: SPACING.sm,
  },
  lessonNumberText: {
    fontSize: SIZES.font4XL,
    color: '#FDE68A',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 1,
  },
  bottomLabel: {
    fontSize: SIZES.fontSM,
    color: COLORS.white,
    opacity: 1.0,
    letterSpacing: 0.5,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Progress bar
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
  },
  progressBarFillWrapper: {
    height: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: SIZES.radiusFull,
  },

  // Floating particles
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
