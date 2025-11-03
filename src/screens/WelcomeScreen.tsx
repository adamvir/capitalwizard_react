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
 * <WelcomeScreen
 *   onGetStarted={() => navigation.navigate('Home')}
 *   initialGold={1000}
 * />
 *
 * FÜGGŐSÉGEK:
 * expo-linear-gradient (already installed)
 * lucide-react-native (already installed)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Coins, BookOpen } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  gray400: '#9CA3AF',
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

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
  onGetStarted?: () => void;
  initialGold?: number;
}

// ============================================
// FLOATING CRYSTAL COMPONENT
// ============================================

function FloatingCrystal({ index }: { index: number }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const yOffset = Math.random() * 100 - 50;
    const duration = (3 + Math.random() * 4) * 1000;

    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: yOffset,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.floatingCrystal,
        {
          left: Math.random() * SCREEN_WIDTH,
          top: Math.random() * SCREEN_HEIGHT,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    />
  );
}

// ============================================
// SPARKLE COMPONENT
// ============================================

function SparkleParticle({ index }: { index: number }) {
  const scale = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = (2 + Math.random() * 2) * 1000;
    const delay = Math.random() * 2000;

    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1,
            duration: duration / 3,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0,
            duration: duration / 3,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: duration / 3,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration / 3,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay);
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.sparkleParticle,
        {
          left: Math.random() * SCREEN_WIDTH,
          top: Math.random() * SCREEN_HEIGHT,
          transform: [{ scale }, { rotate: spin }],
          opacity,
        },
      ]}
    >
      <Sparkles size={16} color="#FBBF24" />
    </Animated.View>
  );
}

// ============================================
// COMPONENT
// ============================================

export default function WelcomeScreen({
  onGetStarted,
  initialGold = 1000,
}: WelcomeScreenProps) {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  // ============================================
  // NOTE: Streak only updates when completing lessons!
  // No automatic daily login rewards - must play to earn streak
  // ============================================

  // ============================================
  // ANIMATIONS
  // ============================================

  const contentScale = useRef(new Animated.Value(0.8)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(50)).current;

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(-20)).current;

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(20)).current;

  const giftScale = useRef(new Animated.Value(0)).current;
  const giftRotate = useRef(new Animated.Value(-180)).current;

  const giftTextOpacity = useRef(new Animated.Value(0)).current;
  const goldScale = useRef(new Animated.Value(0)).current;
  const farewellOpacity = useRef(new Animated.Value(0)).current;

  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;

  const hintOpacity = useRef(new Animated.Value(0)).current;

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    // Staggered animation sequence
    const animations = [
      // 1. Main content (0ms)
      Animated.parallel([
        Animated.timing(contentScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),

      // 2. Logo (300ms)
      Animated.parallel([
        Animated.delay(300),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // 3. Welcome card (600ms)
      Animated.parallel([
        Animated.delay(600),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // 4. Gift box (900ms)
      Animated.parallel([
        Animated.delay(900),
        Animated.spring(giftScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(giftRotate, {
          toValue: 0,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),

      // 5. Gift text (1200ms)
      Animated.sequence([
        Animated.delay(1200),
        Animated.timing(giftTextOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // 6. Gold amount (1500ms)
      Animated.sequence([
        Animated.delay(1500),
        Animated.spring(goldScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),

      // 7. Farewell text (1800ms)
      Animated.sequence([
        Animated.delay(1800),
        Animated.timing(farewellOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // 8. Button (2100ms)
      Animated.parallel([
        Animated.delay(2100),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // 9. Hint text (2400ms)
      Animated.sequence([
        Animated.delay(2400),
        Animated.timing(hintOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ];

    // Start all animations
    animations.forEach((anim) => anim.start());
  }, []);

  const giftRotateStyle = giftRotate.interpolate({
    inputRange: [-180, 0],
    outputRange: ['-180deg', '0deg'],
  });

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleGetStarted = () => {
    // Call onGetStarted callback if provided
    if (onGetStarted) {
      onGetStarted();
    }

    // Navigate to Home screen
    navigation.navigate('Home');
  };

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

      {/* Animated Background Particles */}
      <View style={styles.backgroundLayer}>
        {[...Array(20)].map((_, i) => (
          <FloatingCrystal key={`crystal-${i}`} index={i} />
        ))}
        {[...Array(15)].map((_, i) => (
          <SparkleParticle key={`sparkle-${i}`} index={i} />
        ))}
      </View>

      {/* Main Content */}
      <Animated.View
        style={[
          styles.mainContent,
          {
            transform: [{ scale: contentScale }, { translateY: contentTranslateY }],
            opacity: contentOpacity,
          },
        ]}
      >
        {/* Logo Area */}
        <Animated.View
          style={[
            styles.logoArea,
            {
              transform: [{ translateY: logoTranslateY }],
              opacity: logoOpacity,
            },
          ]}
        >
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

        {/* Welcome Card */}
        <Animated.View
          style={[
            {
              transform: [{ translateY: cardTranslateY }],
              opacity: cardOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeCard}
          >
            <Text style={styles.welcomeTitle}>A CapitalWizard üdvözöl!</Text>

            {/* Gift Box */}
            <Animated.View
              style={[
                styles.giftBox,
                {
                  transform: [{ scale: giftScale }, { rotate: giftRotateStyle }],
                },
              ]}
            >
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
            <Animated.View style={{ opacity: giftTextOpacity }}>
              <Text style={styles.giftText}>Kezdésnek adunk</Text>
              <View style={styles.goldAmountRow}>
                <Animated.Text
                  style={[styles.goldAmount, { transform: [{ scale: goldScale }] }]}
                >
                  {initialGold.toLocaleString('hu-HU')}
                </Animated.Text>
                <Coins size={32} color="#FBBF24" />
              </View>
              <Text style={styles.goldText}>arany ajándékot!</Text>
            </Animated.View>

            {/* Farewell */}
            <Animated.Text style={[styles.farewellText, { opacity: farewellOpacity }]}>
              Jó szórakozást!
            </Animated.Text>
          </LinearGradient>
        </Animated.View>

        {/* Start Button */}
        <Animated.View
          style={[
            {
              transform: [{ translateY: buttonTranslateY }],
              opacity: buttonOpacity,
            },
          ]}
        >
          <TouchableOpacity onPress={handleGetStarted} activeOpacity={0.8}>
            <LinearGradient
              colors={['#9333EA', '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButton}
            >
              <Text style={styles.buttonText}>Kezdjük!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Hint Text */}
        <Animated.Text style={[styles.hintText, { opacity: hintOpacity }]}>
          Tapasztalj meg egy izgalmas pénzügyi kalandot
        </Animated.Text>
      </Animated.View>

      {/* Bottom Glow Effect */}
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

  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },

  floatingCrystal: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#22D3EE',
    borderRadius: SIZES.radiusFull,
    shadowColor: '#22D3EE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },

  sparkleParticle: {
    position: 'absolute',
  },

  mainContent: {
    position: 'relative',
    zIndex: 10,
    alignItems: 'center',
    maxWidth: 448,
    width: '100%',
  },

  logoArea: {
    marginBottom: SPACING.xxxl,
    alignItems: 'center',
  },

  logoIcon: {
    width: 96,
    height: 96,
    borderRadius: SIZES.radius2XL,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 20,
  },

  title: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
    textAlign: 'center',
  },

  divider: {
    width: 128,
    height: 4,
    borderRadius: 2,
  },

  welcomeCard: {
    borderRadius: SIZES.radius2XL,
    padding: SPACING.xxxl,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    marginBottom: SPACING.xxxl,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 20,
  },

  welcomeTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.base,
    textAlign: 'center',
  },

  giftBox: {
    marginBottom: SPACING.base,
  },

  giftIconBg: {
    borderRadius: SIZES.radiusFull,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 20,
  },

  giftText: {
    color: '#67E8F9',
    fontSize: SIZES.fontXL,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },

  goldAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },

  goldAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FBBF24',
  },

  goldText: {
    color: '#67E8F9',
    fontSize: SIZES.fontXL,
    fontWeight: '600',
    textAlign: 'center',
  },

  farewellText: {
    color: '#CBD5E1',
    marginTop: SPACING.xl,
    fontSize: SIZES.fontLG,
    fontWeight: '500',
    textAlign: 'center',
  },

  startButton: {
    paddingHorizontal: 48,
    paddingVertical: SPACING.base,
    borderRadius: SIZES.radiusFull,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 20,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: '700',
    textAlign: 'center',
  },

  hintText: {
    color: COLORS.gray400,
    fontSize: SIZES.fontSM,
    marginTop: SPACING.xl,
    textAlign: 'center',
  },

  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -192,
    width: 384,
    height: 384,
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
    borderRadius: SIZES.radiusFull,
    shadowColor: 'rgba(147, 51, 234, 0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 96,
  },
});
