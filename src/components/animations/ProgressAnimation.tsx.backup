import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
  ZoomIn,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Defs, RadialGradient as SvgRadialGradient, Stop, Rect } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, SIZES, FONT_WEIGHT } from '../../utils/styleConstants';

interface ProgressAnimationProps {
  onClick?: () => void;
  currentBookLessonIndex?: number;
  currentGameType?: 'reading' | 'matching' | 'quiz';
  isFirstRound?: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function ProgressAnimation({
  onClick,
  currentBookLessonIndex = 0,
  currentGameType = 'reading',
  isFirstRound = true
}: ProgressAnimationProps) {
  const [hasRentedBook, setHasRentedBook] = useState(false);
  const [totalLessons] = useState(15); // Total lessons for Pénzügyi Alapismeretek

  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);

  // Check if Pénzügyi Alapismeretek is rented
  useEffect(() => {
    const checkRentedBooks = async () => {
      try {
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
        console.error('Error checking rented books:', error);
        setHasRentedBook(false);
      }
    };

    checkRentedBooks();
  }, []);

  // Animate on mount
  useEffect(() => {
    // Scale animation - breathing effect
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Rotation animation for sparkles
    rotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );

    // Progress bar animation
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, []);

  // Calculate current lesson number
  const lessonNumber = isFirstRound
    ? currentBookLessonIndex * 3 +
      (currentGameType === 'reading' ? 1 : currentGameType === 'matching' ? 2 : 3)
    : totalLessons + currentBookLessonIndex + 1;

  // Animated styles
  const animatedScale = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedRotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const animatedProgressProps = useAnimatedProps(() => ({
    strokeDashoffset: 200 - 200 * progress.value,
  }));

  // Don't show if no book is rented
  if (!hasRentedBook) {
    return (
      <View style={styles.container}>
        <Animated.View style={styles.noBookContent} entering={ZoomIn.duration(600)}>
          {/* Lamp-like glow effect - SVG Radial Gradient (static, non-interactive) */}
          <View style={styles.lampGlow} pointerEvents="none">
            <Svg width="900" height="900" style={styles.svgGlow}>
              <Defs>
                <SvgRadialGradient id="lampGradient" cx="50%" cy="50%">
                  <Stop offset="0%" stopColor="#FDE047" stopOpacity="0.5" />
                  <Stop offset="8%" stopColor="#FCD34D" stopOpacity="0.45" />
                  <Stop offset="20%" stopColor="#FBBF24" stopOpacity="0.35" />
                  <Stop offset="35%" stopColor="#FBBF24" stopOpacity="0.25" />
                  <Stop offset="50%" stopColor="#FBBF24" stopOpacity="0.15" />
                  <Stop offset="70%" stopColor="#FBBF24" stopOpacity="0.08" />
                  <Stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                </SvgRadialGradient>
              </Defs>
              <Rect width="900" height="900" fill="url(#lampGradient)" />
            </Svg>
          </View>

          <View style={styles.noBookTextContainer}>
            <Animated.View
              style={[styles.bookIconWrapper, animatedScale]}
              entering={FadeIn.delay(200).duration(400)}
            >
              <MaterialCommunityIcons
                name="book-open-variant"
                size={64}
                color="#FBBF24"
              />
            </Animated.View>

            <View style={styles.noBookTexts}>
              <Text style={styles.noBookTitle}>Nincs kölcsönzött</Text>
              <MaskedView
                maskElement={
                  <Text style={styles.noBookMainText}>tankönyv</Text>
                }
              >
                <LinearGradient
                  colors={['#FCD34D', '#FDE047', '#FDBA74']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientContainer}
                >
                  <Text style={[styles.noBookMainText, { opacity: 0 }]}>tankönyv</Text>
                </LinearGradient>
              </MaskedView>
              <Text style={styles.noBookSubtitle}>
                Kölcsönözz ki könyvet a könyvtárból!
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedTouchable
        onPress={onClick}
        style={styles.contentWrapper}
        entering={ZoomIn.duration(600)}
        activeOpacity={0.9}
      >
        {/* Sparkles around - 8 sparkles in circle */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 8;
          const radius = 120;
          const top = 50 + Math.cos(angle) * radius;
          const left = Math.sin(angle) * radius;

          return (
            <Animated.View
              key={i}
              style={[
                styles.sparkle,
                { top, left },
                animatedRotation,
              ]}
              entering={FadeIn.delay(i * 100).duration(400)}
            >
              <MaterialCommunityIcons
                name="sparkles"
                size={SIZES.iconLG}
                color="#FBBF24"
              />
            </Animated.View>
          );
        })}

        {/* Main text */}
        <Animated.View
          style={styles.textContainer}
          entering={ZoomIn.delay(200).duration(600)}
        >
          <Animated.View style={animatedScale}>
            <View style={styles.textContent}>
              <Text style={styles.topLabel}>Tovább haladás</Text>
              <LinearGradient
                colors={['#FDE047', '#D8B4FE', '#F9A8D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.lessonNumberGradient}
              >
                <Text style={styles.lessonNumber}>{lessonNumber}. Lecke</Text>
              </LinearGradient>
              <Text style={styles.bottomLabel}>következik</Text>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Circular Progress Bar */}
        <Animated.View
          style={styles.progressContainer}
          entering={FadeIn.delay(300).duration(500)}
        >
          <Svg width="100" height="100" style={styles.progressSvg}>
            {/* Background circle */}
            <Circle
              cx="50"
              cy="50"
              r="32"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="4"
              fill="none"
            />
            {/* Progress circle */}
            <AnimatedCircle
              cx="50"
              cy="50"
              r="32"
              stroke="#FDE047"
              strokeWidth="4"
              fill="none"
              strokeDasharray="200"
              strokeDashoffset={200}
              strokeLinecap="round"
              animatedProps={animatedProgressProps}
            />
          </Svg>
        </Animated.View>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => {
          const top = Math.random() * 200 - 100;
          const left = Math.random() * 300 - 150;
          const colors = ['#fbbf24', '#a855f7', '#ec4899'];
          const color = colors[i % 3];

          return (
            <Animated.View
              key={`particle-${i}`}
              style={[
                styles.particle,
                { top, left, backgroundColor: color },
              ]}
              entering={FadeIn.delay(i * 50 + 400).duration(600)}
            />
          );
        })}
      </AnimatedTouchable>
    </View>
  );
}

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
    pointerEvents: 'box-none',
  },

  // No book view
  noBookContent: {
    position: 'relative',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  // Lamp-like radial glow - SVG based (centered on text)
  lampGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 900,
    height: 900,
    marginTop: -450,
    marginLeft: -450,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  svgGlow: {
    position: 'absolute',
  },
  noBookTextContainer: {
    position: 'relative',
    alignItems: 'center',
    zIndex: 10,
  },
  bookIconWrapper: {
    marginBottom: SPACING.base,
  },
  noBookTexts: {
    alignItems: 'center',
  },
  noBookTitle: {
    fontSize: SIZES.fontLG,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.normal,
    opacity: 0.9,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  gradientContainer: {
    marginBottom: SPACING.sm,
  },
  noBookMainText: {
    fontSize: SIZES.font2XL,
    fontWeight: FONT_WEIGHT.normal,
    textAlign: 'center',
  },
  noBookSubtitle: {
    fontSize: SIZES.fontSM,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.normal,
    opacity: 0.75,
    textAlign: 'center',
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
  lessonNumberGradient: {
    paddingHorizontal: SPACING.base,
    borderRadius: SIZES.radiusLG,
  },
  lessonNumber: {
    fontSize: SIZES.font4XL,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    marginBottom: SPACING.base,
  },
  bottomLabel: {
    fontSize: SIZES.fontSM,
    color: COLORS.white,
    opacity: 0.9,
  },

  // Progress bar
  progressContainer: {
    marginTop: SPACING.base,
  },
  progressSvg: {
    transform: [{ rotate: '-90deg' }],
  },

  // Floating particles
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
