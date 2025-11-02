/**
 * ============================================
 * WELCOMESCREEN - REACT NATIVE VERSION
 * ============================================
 * 
 * Welcome screen with animated gift reveal:
 * - Floating crystals (20 particles)
 * - Sparkles (15 particles)
 * - Gift box reveal animation
 * - Gold amount counter animation
 * - "Kezdjük!" button with shine effect
 * 
 * HASZNÁLAT:
 * cp exports/WelcomeScreen.rn.tsx src/components/WelcomeScreen.tsx
 * 
 * FÜGGŐSÉGEK:
 * npm install react-native-linear-gradient
 * npm install lucide-react-native
 * npm install react-native-reanimated  # Animations
 * 
 * MEGJEGYZÉS:
 * - Animációk: React Native Reanimated (useSharedValue, useAnimatedStyle)
 * - Floating particles: 20 crystals + 15 sparkles
 * - Gift reveal: Scale + rotate animation
 * - Button shine: Infinite loop animation
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Sparkles, Coins } from 'lucide-react-native';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  gray400: '#9CA3AF',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
};

const SPACING = {
  sm: 8,
  base: 16,
  xl: 24,
  xxxl: 48,
};

const SIZES = {
  fontSM: 12,
  fontLG: 16,
  fontXL: 18,
  font2XL: 24,
  radiusFull: 9999,
  radius2XL: 20,
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================

interface WelcomeScreenProps {
  onGetStarted: () => void;
  initialGold?: number; // Optional: default 1000
}

// ============================================
// FLOATING CRYSTAL COMPONENT
// ============================================

function FloatingCrystal({ index }: { index: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.3);

  // Start animation on mount
  useEffect(() => {
    const yOffset = Math.random() * 100 - 50;
    const duration = (3 + Math.random() * 4) * 1000; // 3-7 seconds

    translateY.value = withRepeat(
      withSequence(
        withTiming(yOffset, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.floatingCrystal,
        {
          left: Math.random() * SCREEN_WIDTH,
          top: Math.random() * SCREEN_HEIGHT,
        },
        animatedStyle,
      ]}
    />
  );
}

// ============================================
// SPARKLE COMPONENT
// ============================================

function SparkleParticle({ index }: { index: number }) {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const duration = (2 + Math.random() * 2) * 1000; // 2-4 seconds
    const delay = Math.random() * 2000; // 0-2 seconds

    // Wait for delay, then start animation
    setTimeout(() => {
      scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: duration / 3, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: duration / 3, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      rotate.value = withRepeat(
        withTiming(360, { duration, easing: Easing.linear }),
        -1,
        false
      );

      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: duration / 3 }),
          withTiming(0, { duration: duration / 3 })
        ),
        -1,
        false
      );
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.sparkleParticle,
        {
          left: Math.random() * SCREEN_WIDTH,
          top: Math.random() * SCREEN_HEIGHT,
        },
        animatedStyle,
      ]}
    >
      <Sparkles size={16} color="#FBBF24" />
    </Animated.View>
  );
}

// ============================================
// COMPONENT
// ============================================

export function WelcomeScreen({ onGetStarted, initialGold = 1000 }: WelcomeScreenProps) {
  // ============================================
  // ANIMATIONS
  // ============================================

  // Main content fade in + scale
  const contentScale = useSharedValue(0.8);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  // Logo fade in
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(-20);

  // Welcome card fade in
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(20);

  // Gift box scale + rotate
  const giftScale = useSharedValue(0);
  const giftRotate = useSharedValue(-180);

  // Gift text fade in
  const giftTextOpacity = useSharedValue(0);

  // Gold amount scale
  const goldScale = useSharedValue(0);

  // Farewell text fade in
  const farewellOpacity = useSharedValue(0);

  // Button fade in
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  // Button shine animation
  const buttonShineX = useSharedValue(-SCREEN_WIDTH);

  // Hint text fade in
  const hintOpacity = useSharedValue(0);

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    // Staggered animation sequence
    
    // 1. Main content (0ms)
    contentScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
    contentOpacity.value = withTiming(1, { duration: 800 });
    contentTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) });

    // 2. Logo (300ms delay)
    setTimeout(() => {
      logoOpacity.value = withTiming(1, { duration: 600 });
      logoTranslateY.value = withTiming(0, { duration: 600 });
    }, 300);

    // 3. Welcome card (600ms delay)
    setTimeout(() => {
      cardOpacity.value = withTiming(1, { duration: 600 });
      cardTranslateY.value = withTiming(0, { duration: 600 });
    }, 600);

    // 4. Gift box (900ms delay)
    setTimeout(() => {
      giftScale.value = withSpring(1, { stiffness: 200, damping: 10 });
      giftRotate.value = withSpring(0, { stiffness: 200, damping: 10 });
    }, 900);

    // 5. Gift text (1200ms delay)
    setTimeout(() => {
      giftTextOpacity.value = withTiming(1, { duration: 600 });
    }, 1200);

    // 6. Gold amount (1500ms delay)
    setTimeout(() => {
      goldScale.value = withSpring(1, { stiffness: 300, damping: 10 });
    }, 1500);

    // 7. Farewell text (1800ms delay)
    setTimeout(() => {
      farewellOpacity.value = withTiming(1, { duration: 600 });
    }, 1800);

    // 8. Button (2100ms delay)
    setTimeout(() => {
      buttonOpacity.value = withTiming(1, { duration: 600 });
      buttonTranslateY.value = withTiming(0, { duration: 600 });
    }, 2100);

    // 9. Hint text (2400ms delay)
    setTimeout(() => {
      hintOpacity.value = withTiming(1, { duration: 600 });
    }, 2400);

    // 10. Button shine animation (loop)
    setTimeout(() => {
      buttonShineX.value = withRepeat(
        withSequence(
          withTiming(SCREEN_WIDTH, { duration: 2000, easing: Easing.linear }),
          withTiming(-SCREEN_WIDTH, { duration: 0 }) // Reset instantly
        ),
        -1,
        false
      );
    }, 2100);
  }, []);

  // ============================================
  // ANIMATED STYLES
  // ============================================

  const mainContentStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: contentScale.value },
      { translateY: contentTranslateY.value },
    ],
    opacity: contentOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoTranslateY.value }],
    opacity: logoOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
    opacity: cardOpacity.value,
  }));

  const giftStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: giftScale.value },
      { rotate: `${giftRotate.value}deg` },
    ],
  }));

  const giftTextStyle = useAnimatedStyle(() => ({
    opacity: giftTextOpacity.value,
  }));

  const goldStyle = useAnimatedStyle(() => ({
    transform: [{ scale: goldScale.value }],
  }));

  const farewellStyle = useAnimatedStyle(() => ({
    opacity: farewellOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonTranslateY.value }],
    opacity: buttonOpacity.value,
  }));

  const buttonShineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: buttonShineX.value }],
  }));

  const hintStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
  }));

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#581C87', '#312E81', '#0F172A']}
        style={styles.backgroundGradient}
      />

      {/* ============================================ */}
      {/* ANIMATED BACKGROUND ELEMENTS */}
      {/* ============================================ */}
      <View style={styles.backgroundLayer}>
        {/* Floating Crystals (20 particles) */}
        {[...Array(20)].map((_, i) => (
          <FloatingCrystal key={i} index={i} />
        ))}

        {/* Sparkles (15 particles) */}
        {[...Array(15)].map((_, i) => (
          <SparkleParticle key={i} index={i} />
        ))}
      </View>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <Animated.View style={[styles.mainContent, mainContentStyle]}>
        {/* LOGO/TITLE AREA */}
        <Animated.View style={[styles.logoArea, logoStyle]}>
          <LinearGradient
            colors={['#A855F7', '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoIcon}
          >
            <Sparkles size={48} color={COLORS.white} />
          </LinearGradient>

          <Text style={styles.title}>CapitalWizard</Text>

          <LinearGradient
            colors={['transparent', '#22D3EE', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.divider}
          />
        </Animated.View>

        {/* WELCOME CARD */}
        <Animated.View style={cardStyle}>
          <LinearGradient
            colors={['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeCard}
          >
            <Text style={styles.welcomeTitle}>A CapitalWizard üdvözöl!</Text>

            {/* Gift Box Animation */}
            <Animated.View style={[styles.giftBox, giftStyle]}>
              <LinearGradient
                colors={['#FBBF24', '#F59E0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.giftIconBg}
              >
                <Coins size={48} color="#78350F" />
              </LinearGradient>
            </Animated.View>

            {/* Gift Text */}
            <Animated.View style={giftTextStyle}>
              <Text style={styles.giftText}>Kezdésnek adunk</Text>
              <View style={styles.goldAmountRow}>
                <Animated.Text style={[styles.goldAmount, goldStyle]}>
                  {initialGold.toLocaleString('hu-HU')}
                </Animated.Text>
                <Coins size={32} color="#FBBF24" />
              </View>
              <Text style={styles.goldText}>arany ajándékot!</Text>
            </Animated.View>

            {/* Farewell Text */}
            <Animated.Text style={[styles.farewellText, farewellStyle]}>
              Jó szórakozást!
            </Animated.Text>
          </LinearGradient>
        </Animated.View>

        {/* START BUTTON */}
        <Animated.View style={buttonStyle}>
          <TouchableOpacity onPress={onGetStarted} activeOpacity={0.8}>
            <LinearGradient
              colors={['#9333EA', '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButton}
            >
              <Text style={styles.buttonText}>Kezdjük!</Text>

              {/* Button Shine Effect */}
              <Animated.View style={[styles.buttonShine, buttonShineStyle]}>
                <LinearGradient
                  colors={['transparent', 'rgba(255, 255, 255, 0.2)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonShineGradient}
                />
              </Animated.View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* HINT TEXT */}
        <Animated.Text style={[styles.hintText, hintStyle]}>
          Tapasztalj meg egy izgalmas pénzügyi kalandot
        </Animated.Text>
      </Animated.View>

      {/* ============================================ */}
      {/* BOTTOM GLOW EFFECT */}
      {/* ============================================ */}
      <View style={styles.bottomGlow} />
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
    padding: SPACING.xxxl,
  },

  // Background
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Background Layer (particles)
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },

  // Floating Crystal
  floatingCrystal: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#22D3EE',
    borderRadius: SIZES.radiusFull,
    // Shadow (glow)
    shadowColor: '#22D3EE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },

  // Sparkle Particle
  sparkleParticle: {
    position: 'absolute',
  },

  // Main Content
  mainContent: {
    position: 'relative',
    zIndex: 10,
    alignItems: 'center',
    maxWidth: 448,
    width: '100%',
  },

  // Logo Area
  logoArea: {
    marginBottom: SPACING.xxxl,
    alignItems: 'center',
  },

  // Logo Icon
  logoIcon: {
    width: 96,
    height: 96,
    borderRadius: SIZES.radius2XL,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    // Shadow
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 20,
  },

  // Title
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
    textAlign: 'center',
  },

  // Divider
  divider: {
    width: 128,
    height: 4,
    borderRadius: 2,
  },

  // Welcome Card
  welcomeCard: {
    borderRadius: SIZES.radius2XL,
    padding: SPACING.xxxl,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    marginBottom: SPACING.xxxl,
    alignItems: 'center',
    width: '100%',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 20,
  },

  // Welcome Title
  welcomeTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.base,
    textAlign: 'center',
  },

  // Gift Box
  giftBox: {
    marginBottom: SPACING.base,
  },

  // Gift Icon Background
  giftIconBg: {
    borderRadius: SIZES.radiusFull,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 20,
  },

  // Gift Text
  giftText: {
    color: '#67E8F9',
    fontSize: SIZES.fontXL,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },

  // Gold Amount Row
  goldAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },

  // Gold Amount
  goldAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FBBF24',
  },

  // Gold Text
  goldText: {
    color: '#67E8F9',
    fontSize: SIZES.fontXL,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Farewell Text
  farewellText: {
    color: '#CBD5E1',
    marginTop: SPACING.xl,
    fontSize: SIZES.fontLG,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Start Button
  startButton: {
    position: 'relative',
    paddingHorizontal: 48,
    paddingVertical: SPACING.base,
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 20,
  },

  // Button Text
  buttonText: {
    position: 'relative',
    zIndex: 10,
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Button Shine
  buttonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  buttonShineGradient: {
    flex: 1,
  },

  // Hint Text
  hintText: {
    color: COLORS.gray400,
    fontSize: SIZES.fontSM,
    marginTop: SPACING.xl,
    textAlign: 'center',
  },

  // Bottom Glow Effect
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -192, // -(384/2)
    width: 384,
    height: 384,
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
    borderRadius: SIZES.radiusFull,
    // Blur effect simulated with shadow
    shadowColor: 'rgba(147, 51, 234, 0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 96,
  },
});
