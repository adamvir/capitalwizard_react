import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import { COLORS, SPACING, SIZES, FONT_WEIGHT } from '../../utils/styleConstants';

interface StreakCelebrationProps {
  newStreak: number;
  onContinue: () => void;
}

const { height } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function StreakCelebration({ newStreak, onContinue }: StreakCelebrationProps) {
  const [displayedNumber, setDisplayedNumber] = useState(0);

  // Counter animation effect
  useEffect(() => {
    console.log('🔥 StreakCelebration: newStreak =', newStreak);

    if (newStreak === 0) {
      console.warn('⚠️ StreakCelebration: newStreak is 0, skipping counter animation');
      return;
    }

    // Start counting after initial animations (0.8s delay)
    const startDelay = 800;

    // Calculate how long each step should take
    const stepDuration = newStreak <= 5 ? 50 : newStreak <= 20 ? 40 : 30;

    console.log('⏱️ StreakCelebration: Starting counter in', startDelay, 'ms, step duration:', stepDuration);

    const timeout = setTimeout(() => {
      console.log('🔢 StreakCelebration: Counter started');
      let currentNumber = 0;
      const interval = setInterval(() => {
        currentNumber += 1;
        setDisplayedNumber(currentNumber);
        console.log('🔢 Counter:', currentNumber, '/', newStreak);

        if (currentNumber >= newStreak) {
          console.log('✅ StreakCelebration: Counter finished at', currentNumber);
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [newStreak]);

  // Floating fire particles
  const FloatingFireParticle = ({ index }: { index: number }) => {
    const translateY = useSharedValue(height + 50);
    const opacity = useSharedValue(0);

    useEffect(() => {
      translateY.value = withDelay(
        Math.random() * 2000,
        withRepeat(
          withTiming(-50 - height, {
            duration: 3000 + Math.random() * 2000,
            easing: Easing.out(Easing.ease),
          }),
          -1,
          false
        )
      );

      opacity.value = withDelay(
        Math.random() * 2000,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1000 }),
            withTiming(1, { duration: 1000 }),
            withTiming(0, { duration: 1000 })
          ),
          -1,
          false
        )
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    }));

    return (
      <Animated.View
        style={[
          styles.fireParticle,
          {
            left: `${Math.random() * 100}%`,
          },
          animatedStyle,
        ]}
      >
        <MaterialCommunityIcons name="fire" size={12 + Math.random() * 20} color="#F97316" />
      </Animated.View>
    );
  };

  // Fire emoji animation
  const fireScale = useSharedValue(0);
  const fireRotate = useSharedValue(-180);

  useEffect(() => {
    fireScale.value = withSequence(
      withTiming(1.2, { duration: 300, easing: Easing.out(Easing.ease) }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );

    fireRotate.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    });
  }, []);

  const fireAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fireScale.value }, { rotate: `${fireRotate.value}deg` }],
  }));

  // Streak counter scale animation
  const counterScale = useSharedValue(1);

  useEffect(() => {
    if (displayedNumber === newStreak && newStreak > 0) {
      console.log('🎯 StreakCelebration: Counter reached target! Button should be clickable now.');
      counterScale.value = withSequence(
        withSpring(1.2, { damping: 5, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
    }
  }, [displayedNumber, newStreak]);

  const counterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: counterScale.value }],
  }));

  // Glow animation
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.2);

  useEffect(() => {
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 1000 }),
        withTiming(0.2, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#0F172A', 'rgba(124, 45, 18, 0.4)', '#0F172A']}
      style={styles.container}
    >
      {/* Floating fire particles */}
      <View style={styles.particlesContainer}>
        {[...Array(20)].map((_, i) => (
          <FloatingFireParticle key={i} index={i} />
        ))}
      </View>

      {/* Main content */}
      <View style={styles.mainContent}>
        {/* Fire emoji with animation */}
        <Animated.Text style={[styles.fireEmoji, fireAnimatedStyle]}>
          🔥
        </Animated.Text>

        {/* Title */}
        <Animated.Text
          style={styles.title}
          entering={FadeInDown.delay(300).duration(400)}
        >
          Napi sorozat!
        </Animated.Text>

        {/* Streak counter with counting animation */}
        <Animated.View
          style={styles.streakCounterContainer}
          entering={ZoomIn.delay(500).springify().damping(10).stiffness(200)}
        >
          <LinearGradient
            colors={['#EA580C', '#DC2626', '#EA580C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.streakCounter}
          >
            <Animated.View
              style={styles.streakCounterContent}
              entering={FadeIn.delay(700).duration(400)}
            >
              <MaterialCommunityIcons name="fire" size={40} color="#FDE047" />
              <Animated.Text style={[styles.streakNumber, counterAnimatedStyle]}>
                {displayedNumber}
              </Animated.Text>
              <Text style={styles.streakLabel}>nap</Text>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* Message */}
        <Animated.Text
          style={[
            styles.message,
            { opacity: displayedNumber === newStreak ? 1 : 0 },
          ]}
          entering={FadeIn.delay(1500).duration(500)}
        >
          {newStreak === 1 ? (
            <>
              Kezdted a napi sorozatodat!{'\n'}
              Térj vissza holnap is!
            </>
          ) : (
            <>
              Gratulálunk!{'\n'}
              Így tovább, ne hagyd abba!
            </>
          )}
        </Animated.Text>

        {/* Continue button */}
        <AnimatedTouchable
          onPress={() => {
            console.log('🔘 Continue button pressed!');
            onContinue();
          }}
          style={[
            styles.continueButtonWrapper,
            {
              opacity: displayedNumber === newStreak ? 1 : 0,
              pointerEvents: displayedNumber === newStreak ? 'auto' : 'none',
            },
          ]}
          entering={FadeInDown.delay(1700).duration(500)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#F97316', '#EF4444', '#F97316']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButton}
          >
            <Text style={styles.continueButtonText}>Tovább</Text>
          </LinearGradient>
        </AnimatedTouchable>

        {/* Glow effect */}
        <Animated.View style={[styles.glowEffect, glowAnimatedStyle]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },

  // Floating particles
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  fireParticle: {
    position: 'absolute',
  },

  // Main content
  mainContent: {
    position: 'relative',
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 10,
  },
  fireEmoji: {
    fontSize: 144,
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.font5XL,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.base,
    letterSpacing: 0.4,
  },

  // Streak counter
  streakCounterContainer: {
    marginBottom: SPACING.lg,
  },
  streakCounter: {
    borderRadius: SIZES.radius2XL,
    paddingHorizontal: 32,
    paddingVertical: SPACING.base,
    borderWidth: 4,
    borderColor: '#FB923C',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  streakCounterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  streakNumber: {
    color: COLORS.white,
    fontSize: SIZES.font6XL || 72,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
    fontVariant: ['tabular-nums'],
  },
  streakLabel: {
    color: COLORS.white,
    fontSize: SIZES.font3XL,
    fontWeight: FONT_WEIGHT.medium,
  },

  // Message
  message: {
    color: '#FDBA74',
    fontSize: SIZES.fontXL,
    marginBottom: 32,
    lineHeight: SIZES.fontXL * 1.6,
    textAlign: 'center',
  },

  // Continue button
  continueButtonWrapper: {
    marginTop: SPACING.base,
  },
  continueButton: {
    paddingHorizontal: 48,
    paddingVertical: SPACING.base,
    borderRadius: SIZES.radiusXL,
    borderWidth: 2,
    borderColor: '#FDBA74',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.4,
  },

  // Glow effect
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#EA580C',
    borderRadius: SIZES.radius3XL || 32,
    zIndex: -10,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.1 }],
  },
});
