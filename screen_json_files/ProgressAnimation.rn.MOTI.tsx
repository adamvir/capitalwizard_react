/**
 * ============================================
 * PROGRESSANIMATION - REACT NATIVE VERSION (MOTI)
 * ============================================
 * 
 * "Továbbhaladás" button with animated sparkles
 * - Uses MOTI for Motion-like animations
 * - Identical visual to web version
 * - Smooth, professional animations
 * 
 * HASZNÁLAT:
 * cp exports/ProgressAnimation.rn.MOTI.tsx src/components/ProgressAnimation.tsx
 * 
 * FÜGGŐSÉGEK:
 * npm install moti
 * npm install react-native-reanimated
 * npm install react-native-linear-gradient
 * npm install lucide-react-native
 * npm install @react-native-async-storage/async-storage
 * 
 * BABEL CONFIG (babel.config.js):
 * module.exports = {
 *   presets: ['module:metro-react-native-babel-preset'],
 *   plugins: ['react-native-reanimated/plugin'],
 * };
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
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
  fontSM: 12,
  fontLG: 18,
  font2XL: 24,
  font4XL: 36,
  radiusFull: 9999,
  iconLG: 24,
};

// Mock lessons data (replace with actual import)
const TOTAL_LESSONS = 18; // Example: 6 book lessons * 3 game types

// ============================================
// TYPES
// ============================================

interface ProgressAnimationProps {
  onClick?: () => void;
  currentBookLessonIndex?: number;
  currentGameType?: 'reading' | 'matching' | 'quiz';
  isFirstRound?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function ProgressAnimation({
  onClick,
  currentBookLessonIndex = 0,
  currentGameType = 'reading',
  isFirstRound = true,
}: ProgressAnimationProps) {
  // ============================================
  // STATE
  // ============================================

  const [hasRentedBook, setHasRentedBook] = useState(false);

  // ============================================
  // EFFECTS
  // ============================================

  // Check if Pénzügyi Alapismeretek is rented
  useEffect(() => {
    const checkRentedBooks = async () => {
      try {
        const saved = await AsyncStorage.getItem('rentedBooks');
        if (saved) {
          const rentedBooks = JSON.parse(saved);
          const hasPenzugyiBook = rentedBooks.some(
            (book: any) =>
              book.title === 'Pénzügyi Alapismeretek' &&
              book.rentedUntil > Date.now()
          );
          setHasRentedBook(hasPenzugyiBook);
        } else {
          setHasRentedBook(false);
        }
      } catch (error) {
        console.error('Error checking rented books:', error);
        setHasRentedBook(false);
      }
    };

    checkRentedBooks();
  }, []);

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
          {/* Glow effect */}
          <View style={styles.noBookGlowEffect} />

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
            <LinearGradient
              colors={['#FCD34D', '#FDE047', '#FDBA74']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.noBookGradientContainer}
            >
              <Text style={styles.noBookMainText}>tankönyv</Text>
            </LinearGradient>
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
              scale: [1, 1.1, 1],
            }}
            transition={{
              type: 'timing',
              duration: 2000,
              loop: true,
            }}
            style={styles.textInner}
          >
            {/* Glow effect behind text */}
            <View style={styles.textGlow} />

            <View style={styles.textContent}>
              <Text style={styles.topLabel}>Tovább haladás</Text>

              <View style={styles.lessonNumber}>
                <LinearGradient
                  colors={['#FDE047', '#D8B4FE', '#F9A8D4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientTextContainer}
                >
                  <Text style={styles.lessonGradientText}>
                    {lessonNumber}. Lecke
                  </Text>
                </LinearGradient>
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
  },
  noBookGlowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 1000,
    transform: [{ scale: 1.5 }],
  },
  noBookTextContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  noBookTitle: {
    fontSize: SIZES.fontLG,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  noBookGradientContainer: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  noBookMainText: {
    fontSize: SIZES.font2XL,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  noBookSubtitle: {
    fontSize: SIZES.fontSM,
    color: COLORS.white,
    opacity: 0.75,
    marginTop: SPACING.sm,
    textAlign: 'center',
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
  textGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(168, 85, 247, 0.5)',
    borderRadius: 1000,
    transform: [{ scale: 1.5 }],
  },
  textContent: {
    position: 'relative',
    alignItems: 'center',
  },
  topLabel: {
    fontSize: SIZES.fontSM,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.sm,
  },
  lessonNumber: {
    marginBottom: SPACING.base,
  },
  gradientTextContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lessonGradientText: {
    fontSize: SIZES.font4XL,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  bottomLabel: {
    fontSize: SIZES.fontSM,
    color: COLORS.white,
    opacity: 0.9,
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
