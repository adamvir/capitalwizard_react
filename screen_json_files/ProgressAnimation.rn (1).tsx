/**
 * ============================================
 * PROGRESSANIMATION - REACT NATIVE VERSION
 * ============================================
 * 
 * "Továbbhaladás" button with animated sparkles
 * - Displays lesson number
 * - Progress indicator
 * - Sparkles animation
 * - Gradient text
 * 
 * HASZNÁLAT:
 * cp exports/ProgressAnimation.rn.tsx src/components/ProgressAnimation.tsx
 * 
 * FÜGGŐSÉGEK:
 * npm install react-native-linear-gradient
 * npm install lucide-react-native
 * npm install @react-native-async-storage/async-storage
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Sparkles, BookOpen } from 'lucide-react-native';

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
};

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
  // ANIMATION
  // ============================================

  const sparkle1 = useRef(new Animated.Value(0)).current;
  const sparkle2 = useRef(new Animated.Value(0)).current;
  const sparkle3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sparkle animations
    const animations = [
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkle1, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(sparkle1, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.delay(500),
          Animated.timing(sparkle2, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(sparkle2, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.delay(1000),
          Animated.timing(sparkle3, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(sparkle3, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ];

    Animated.parallel(animations).start();
  }, []);

  // ============================================
  // STATE & EFFECTS
  // ============================================

  const [hasRentedBook, setHasRentedBook] = useState(false);

  // Check if Pénzügyi Alapismeretek is rented
  useEffect(() => {
    const checkRentedBooks = async () => {
      try {
        // For React Native, use AsyncStorage instead of localStorage
        const saved = await AsyncStorage.getItem('rentedBooks');
        if (saved) {
          const rentedBooks = JSON.parse(saved);
          const hasPenzugyiBook = rentedBooks.some(
            (book: any) =>
              book.title === 'Pénzügyi Alapismeretek' && book.rentedUntil > Date.now()
          );
          setHasRentedBook(hasPenzugyiBook);
        } else {
          setHasRentedBook(false);
        }
      } catch (error) {
        setHasRentedBook(false);
      }
    };

    checkRentedBooks();

    // Poll every 3 seconds to check for changes
    const interval = setInterval(checkRentedBooks, 3000);

    return () => clearInterval(interval);
  }, []);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  // Calculate current lesson number (every game is a separate lesson)
  const lessonNumber = isFirstRound
    ? currentBookLessonIndex * 3 + (currentGameType === 'reading' ? 1 : currentGameType === 'matching' ? 2 : 3)
    : 60 * 3 + currentBookLessonIndex + 1; // Assuming 60 pages in first round

  // Progress percentage for progress bar
  const progressPercentage =
    currentGameType === 'reading' ? 0 : currentGameType === 'matching' ? 50 : 100;

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleClick = () => {
    onClick?.();
  };

  // ============================================
  // RENDER
  // ============================================

  // No book rented state
  if (!hasRentedBook) {
    return (
      <View style={styles.container} pointerEvents="none">
        <View style={styles.noBookContent} pointerEvents="auto">
          {/* Glow effect */}
          <View style={styles.glowEffect} />

          {/* Book icon */}
          <BookOpen size={64} color="#FBBF24" style={{ marginBottom: SPACING.base }} />

          {/* Text */}
          <View style={styles.noBookTextContainer}>
            <Text style={styles.noBookTitle}>Nincs kölcsönzött</Text>
            <Text style={styles.noBookMainText}>
              <Text style={styles.noBookGradientText}>tankönyv</Text>
            </Text>
            <Text style={styles.noBookSubtitle}>Kölcsönözz ki könyvet a könyvtárból!</Text>
          </View>
        </View>
      </View>
    );
  }

  // Has book selected state
  return (
    <View style={styles.container} pointerEvents="none">
      <TouchableOpacity
        onPress={handleClick}
        activeOpacity={0.8}
        style={styles.contentWrapper}
        pointerEvents="auto"
      >
        {/* Sparkles */}
        <Animated.View
          style={[
            styles.sparkle,
            {
              top: -20,
              left: -30,
              opacity: sparkle1,
              transform: [{ scale: sparkle1 }],
            },
          ]}
        >
          <Sparkles size={24} color="#FDE047" />
        </Animated.View>

        <Animated.View
          style={[
            styles.sparkle,
            {
              top: -15,
              right: -40,
              opacity: sparkle2,
              transform: [{ scale: sparkle2 }],
            },
          ]}
        >
          <Sparkles size={20} color="#D8B4FE" />
        </Animated.View>

        <Animated.View
          style={[
            styles.sparkle,
            {
              bottom: 0,
              right: -20,
              opacity: sparkle3,
              transform: [{ scale: sparkle3 }],
            },
          ]}
        >
          <Sparkles size={18} color="#F9A8D4" />
        </Animated.View>

        {/* Main Text */}
        <View style={styles.textContainer}>
          <View style={styles.textInner}>
            {/* Glow effect */}
            <View style={styles.textGlow} />

            {/* Text content */}
            <View style={styles.textContent}>
              <Text style={styles.topLabel}>Tovább haladás</Text>

              {/* Lesson number (gradient text) */}
              <Text style={styles.lessonNumber}>
                <LinearGradient
                  colors={['#FDE047', '#D8B4FE', '#F9A8D4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 4 }}
                >
                  <Text style={styles.lessonGradientText}>{lessonNumber}. Lecke</Text>
                </LinearGradient>
              </Text>

              <Text style={styles.bottomLabel}>következik</Text>
            </View>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View style={{ width: `${progressPercentage}%` }}>
            <LinearGradient
              colors={['#FDE047', '#C084FC', '#F9A8D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressBarFill}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // No book view
  noBookContent: {
    position: 'relative',
    alignItems: 'center',
    gap: SPACING.base,
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 9999,
    transform: [{ scale: 1.5 }],
  },
  noBookTextContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  noBookTitle: {
    fontSize: SIZES.fontLG,
    opacity: 0.9,
    marginBottom: SPACING.sm,
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  noBookMainText: {
    fontSize: SIZES.font2XL,
    marginBottom: SPACING.sm,
  },
  noBookGradientText: {
    fontSize: SIZES.font2XL,
    color: COLORS.white,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  noBookSubtitle: {
    fontSize: SIZES.fontSM,
    opacity: 0.75,
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
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
  sparkle: {
    position: 'absolute',
  },

  // Main text
  textContainer: {
    alignItems: 'center',
  },
  textInner: {
    position: 'relative',
  },
  textGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(168, 85, 247, 0.5)',
    borderRadius: 9999,
    transform: [{ scale: 1.5 }],
  },
  textContent: {
    position: 'relative',
    alignItems: 'center',
  },
  topLabel: {
    fontSize: SIZES.fontSM,
    opacity: 0.9,
    marginBottom: SPACING.sm,
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  lessonNumber: {
    fontSize: SIZES.font4XL,
    marginBottom: SPACING.base,
  },
  lessonGradientText: {
    fontSize: SIZES.font4XL,
    color: COLORS.white,
    fontWeight: '700',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  bottomLabel: {
    fontSize: SIZES.fontSM,
    opacity: 0.9,
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },

  // Progress bar
  progressBarContainer: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
});
