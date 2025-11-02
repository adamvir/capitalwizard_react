/**
 * LevelUpCelebration - REACT NATIVE VERSION (MOTI)
 * 
 * Szint növekedés animációs képernyő
 * - Full-screen overlay
 * - Trophy icon + orbiting stars
 * - Floating particles
 * - Sparkles
 * - Confetti effect
 * - Continue button
 * 
 * DEPENDENCIES:
 * npm install moti
 * npm install lucide-react-native
 * npm install react-native-linear-gradient
 * npm install react-native-reanimated (Moti dependency)
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MotiView } from 'moti';
import LinearGradient from 'react-native-linear-gradient';
import {
  Trophy,
  Star,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';

// ============================================
// CONSTANTS
// ============================================

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  white: '#FFFFFF',
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate300: '#CBD5E1',
  purple900: '#581C87',
  purple500: '#A855F7',
  purple400: '#C084FC',
  purple200: '#D8B4FE',
  pink400: '#F9A8D4',
  yellow900: '#78350F',
  yellow500: '#EAB308',
  yellow400: '#FBBF24',
  yellow300: '#FDE047',
  yellow200: '#FEF08A',
  blue600: '#3B82F6',
  cyan500: '#22D3EE',
  green600: '#10B981',
  green700: '#059669',
  green800: '#047857',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
};

const SIZES = {
  fontSM: 12,
  fontBase: 14,
  fontXL: 20,
  font4XL: 36,
  font5XL: 48,
  borderMedium: 2,
  borderThick: 4,
  radiusXL: 16,
  radiusFull: 9999,
  iconBase: 18,
  iconLG: 24,
};

const FONT_WEIGHT = {
  normal: '400' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// ============================================
// TYPES
// ============================================

interface LevelUpCelebrationProps {
  newLevel: number;
  onContinue: () => void;
}

// ============================================
// PARTICLE COLORS
// ============================================

const PARTICLE_COLORS = [
  COLORS.yellow400,
  COLORS.purple500,
  '#ec4899', // pink
  COLORS.blue600,
];

const CONFETTI_COLORS = [
  COLORS.yellow400,
  COLORS.purple500,
  '#ec4899',
  COLORS.blue600,
  COLORS.green600,
];

// ============================================
// COMPONENT
// ============================================

export function LevelUpCelebration({
  newLevel,
  onContinue,
}: LevelUpCelebrationProps) {
  // ============================================
  // RENDER
  // ============================================

  return (
    <LinearGradient
      colors={[COLORS.slate900, `${COLORS.purple900}99`, COLORS.slate900]}
      style={styles.container}
    >
      {/* Background Effects */}
      <View style={styles.backgroundEffects}>
        {/* Floating Particles (10 instead of 20 for performance) */}
        {[...Array(10)].map((_, i) => {
          const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
          const randomX = Math.random() * SCREEN_WIDTH;
          const randomY = Math.random() * SCREEN_HEIGHT;
          const delay = Math.random() * 2000;

          return (
            <MotiView
              key={`particle-${i}`}
              from={{
                translateY: 0,
                translateX: 0,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                translateY: -50,
                translateX: Math.random() * 20 - 10,
                opacity: 1,
                scale: 1.5,
              }}
              transition={{
                type: 'timing',
                duration: 3000 + Math.random() * 2000,
                loop: true,
                delay,
              }}
              style={[
                styles.particle,
                {
                  left: randomX,
                  top: randomY,
                  backgroundColor: color,
                },
              ]}
            />
          );
        })}

        {/* Sparkles (6 instead of 12) */}
        {[...Array(6)].map((_, i) => {
          const randomX = 20 + Math.random() * 60;
          const randomY = 20 + Math.random() * 60;

          return (
            <MotiView
              key={`sparkle-${i}`}
              from={{
                scale: 0,
                rotate: '0deg',
                opacity: 0,
              }}
              animate={{
                scale: 1,
                rotate: '360deg',
                opacity: 1,
              }}
              transition={{
                type: 'timing',
                duration: 2000,
                loop: true,
                delay: i * 300,
              }}
              style={[
                styles.sparkle,
                {
                  left: `${randomX}%`,
                  top: `${randomY}%`,
                },
              ]}
            >
              <Sparkles
                size={SIZES.iconLG}
                color={COLORS.yellow400}
                fill={COLORS.yellow400}
              />
            </MotiView>
          );
        })}

        {/* Radial Glow */}
        <View style={styles.radialGlow} />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Trophy Icon */}
        <MotiView
          from={{
            scale: 0,
            rotate: '-180deg',
          }}
          animate={{
            scale: 1,
            rotate: '0deg',
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 200,
          }}
          style={styles.trophyContainer}
        >
          <View style={styles.trophyGlow} />
          <LinearGradient
            colors={[COLORS.yellow300, COLORS.yellow400, COLORS.yellow500]}
            style={styles.trophyCircle}
          >
            <Trophy size={64} color={COLORS.yellow900} />
          </LinearGradient>

          {/* Orbiting Stars (4 stars) */}
          {[...Array(4)].map((_, i) => (
            <MotiView
              key={`star-${i}`}
              from={{
                rotate: `${i * 90}deg`,
              }}
              animate={{
                rotate: `${i * 90 + 360}deg`,
              }}
              transition={{
                type: 'timing',
                duration: 4000,
                loop: true,
              }}
              style={styles.orbitingStar}
            >
              <View style={styles.orbitingStarInner}>
                <Star
                  size={SIZES.iconLG}
                  color={COLORS.yellow300}
                  fill={COLORS.yellow300}
                />
              </View>
            </MotiView>
          ))}
        </MotiView>

        {/* Text Content */}
        <MotiView
          from={{
            opacity: 0,
            translateY: 20,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            type: 'timing',
            duration: 600,
            delay: 500,
          }}
          style={styles.textContent}
        >
          {/* Congratulations Title */}
          <MotiView
            from={{
              scale: 1,
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              type: 'timing',
              duration: 2000,
              loop: true,
            }}
          >
            <Text style={styles.congratsTitle}>Gratulálunk!</Text>
          </MotiView>

          {/* Level Up Message */}
          <View style={styles.levelUpMessage}>
            <Text style={styles.subMessage}>
              Szakaszt teljesítettél! 🎉
            </Text>
            <View style={styles.levelCard}>
              <Text style={styles.levelLabel}>Új szint elérve</Text>
              <Text style={styles.levelNumber}>Szint {newLevel}</Text>
            </View>
          </View>

          {/* Achievement Message */}
          <MotiView
            from={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              type: 'timing',
              duration: 600,
              delay: 1000,
            }}
          >
            <Text style={styles.achievementMessage}>
              Folytatod a tanulást az új szakaszban!
            </Text>
          </MotiView>
        </MotiView>

        {/* Continue Button */}
        <MotiView
          from={{
            opacity: 0,
            translateY: 20,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            type: 'timing',
            duration: 600,
            delay: 1200,
          }}
        >
          <TouchableOpacity
            onPress={onContinue}
            activeOpacity={0.8}
            style={styles.continueButtonWrapper}
          >
            <LinearGradient
              colors={[COLORS.green600, COLORS.green700]}
              style={styles.continueButton}
            >
              <Text style={styles.continueButtonText}>TOVÁBB</Text>
              <ChevronRight size={SIZES.iconLG} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>
      </View>

      {/* Confetti Effect (20 particles) */}
      {[...Array(20)].map((_, i) => {
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const borderRadius = Math.random() > 0.5 ? SIZES.radiusFull : 0;
        const randomX = (Math.random() - 0.5) * SCREEN_WIDTH * 1.2;
        const randomY = Math.random() * SCREEN_HEIGHT * 1.5 + 200;
        const randomRotate = Math.random() * 720;

        return (
          <MotiView
            key={`confetti-${i}`}
            from={{
              translateX: 0,
              translateY: 0,
              opacity: 1,
              rotate: '0deg',
            }}
            animate={{
              translateX: randomX,
              translateY: randomY,
              opacity: 0,
              rotate: `${randomRotate}deg`,
            }}
            transition={{
              type: 'timing',
              duration: 2000 + Math.random() * 2000,
              delay: i * 50,
            }}
            style={[
              styles.confetti,
              {
                left: SCREEN_WIDTH / 2,
                top: SCREEN_HEIGHT * 0.2,
                backgroundColor: color,
                borderRadius,
              },
            ]}
          />
        );
      })}
    </LinearGradient>
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

  // Background Effects
  backgroundEffects: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: SIZES.radiusFull,
  },
  sparkle: {
    position: 'absolute',
  },
  radialGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${COLORS.purple500}4d`,
    opacity: 0.3,
  },

  // Main Content
  mainContent: {
    position: 'relative',
    zIndex: 10,
    alignItems: 'center',
    gap: 32,
    paddingHorizontal: 32,
  },

  // Trophy
  trophyContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyGlow: {
    position: 'absolute',
    top: -24,
    left: -24,
    right: -24,
    bottom: -24,
    backgroundColor: `${COLORS.yellow400}80`,
    borderRadius: SIZES.radiusFull,
    opacity: 0.5,
  },
  trophyCircle: {
    position: 'relative',
    width: 128,
    height: 128,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: SIZES.borderThick,
    borderColor: COLORS.yellow200,
    // Shadow (iOS)
    shadowColor: COLORS.yellow500,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    // Shadow (Android)
    elevation: 8,
  },
  orbitingStar: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  orbitingStarInner: {
    transform: [
      { translateX: -12 }, // Half of star size (24/2)
      { translateY: -92 }, // -50% of parent - orbit distance
    ],
  },

  // Text Content
  textContent: {
    alignItems: 'center',
    gap: SPACING.base,
  },
  congratsTitle: {
    fontSize: SIZES.font5XL,
    color: COLORS.yellow300,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
  },
  levelUpMessage: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  subMessage: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.semibold,
    textAlign: 'center',
  },
  levelCard: {
    backgroundColor: `${COLORS.slate800}99`,
    borderWidth: 1,
    borderColor: `${COLORS.slate600}80`,
    borderRadius: SIZES.radiusXL,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    alignItems: 'center',
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Shadow (Android)
    elevation: 4,
  },
  levelLabel: {
    color: COLORS.slate300,
    fontSize: SIZES.fontSM,
    marginBottom: SPACING.sm,
  },
  levelNumber: {
    fontSize: SIZES.font4XL,
    color: COLORS.cyan500,
    fontWeight: FONT_WEIGHT.bold,
  },
  achievementMessage: {
    color: COLORS.purple200,
    fontSize: SIZES.fontSM,
    textAlign: 'center',
    maxWidth: 320,
  },

  // Continue Button
  continueButtonWrapper: {
    marginTop: SPACING.lg,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: 40,
    paddingVertical: SPACING.base,
    borderRadius: SIZES.radiusXL,
    // Shadow (iOS)
    shadowColor: COLORS.green600,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    // Shadow (Android)
    elevation: 8,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
  },

  // Confetti
  confetti: {
    position: 'absolute',
    width: 12,
    height: 12,
  },
});
