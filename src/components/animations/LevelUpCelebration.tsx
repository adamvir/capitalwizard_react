import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
  SlideInUp,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import { COLORS, SPACING, SIZES, FONT_WEIGHT, SHADOWS } from '../../utils/styleConstants';

interface LevelUpCelebrationProps {
  newLevel: number;
  onContinue: () => void;
}

const { width, height } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function LevelUpCelebration({ newLevel, onContinue }: LevelUpCelebrationProps) {
  // Confetti animation
  const ConfettiPiece = ({ index }: { index: number }) => {
    const colors = ['#fbbf24', '#a855f7', '#ec4899', '#3b82f6', '#10b981'];
    const color = colors[index % 5];
    const isRound = Math.random() > 0.5;

    const translateX = useSharedValue((Math.random() - 0.5) * width);
    const translateY = useSharedValue(-50);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(1);

    React.useEffect(() => {
      translateY.value = withDelay(
        index * 50,
        withTiming(height + 50, {
          duration: 2000 + Math.random() * 1000,
          easing: Easing.out(Easing.ease),
        })
      );

      rotate.value = withDelay(
        index * 50,
        withTiming(Math.random() * 720, {
          duration: 2000 + Math.random() * 1000,
          easing: Easing.linear,
        })
      );

      opacity.value = withDelay(
        index * 50,
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 1500 })
        )
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
      ],
      opacity: opacity.value,
    }));

    return (
      <Animated.View
        style={[
          styles.confetti,
          {
            backgroundColor: color,
            borderRadius: isRound ? 6 : 0,
          },
          animatedStyle,
        ]}
      />
    );
  };

  // Floating particles
  const FloatingParticle = ({ index }: { index: number }) => {
    const colors = ['#fbbf24', '#a855f7', '#ec4899', '#3b82f6'];
    const color = colors[index % 4];

    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    React.useEffect(() => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-50, { duration: 3000 + Math.random() * 2000 }),
          withTiming(0, { duration: 3000 + Math.random() * 2000 })
        ),
        -1,
        false
      );

      translateX.value = withRepeat(
        withSequence(
          withTiming(Math.random() * 20 - 10, { duration: 2000 }),
          withTiming(0, { duration: 2000 })
        ),
        -1,
        true
      );

      scale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 1500 }),
          withTiming(0, { duration: 1500 })
        ),
        -1,
        false
      );

      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        false
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    }));

    return (
      <Animated.View
        style={[
          styles.particle,
          {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: color,
          },
          animatedStyle,
        ]}
      />
    );
  };

  // Orbiting stars
  const OrbitingStar = ({ index }: { index: number }) => {
    const rotation = useSharedValue(index * 90);

    React.useEffect(() => {
      rotation.value = withRepeat(
        withTiming(index * 90 + 360, {
          duration: 4000,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
      <Animated.View style={[styles.orbitingStar, animatedStyle]}>
        <View style={styles.orbitingStarInner}>
          <MaterialCommunityIcons
            name="star"
            size={SIZES.iconLG}
            color="#FDE047"
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#0F172A', 'rgba(88, 28, 135, 0.6)', '#0F172A']}
      style={styles.container}
    >
      {/* Background effects */}
      <View style={styles.backgroundEffects}>
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <FloatingParticle key={`particle-${i}`} index={i} />
        ))}

        {/* Sparkles */}
        {[...Array(12)].map((_, i) => {
          const sparkleScale = useSharedValue(0);
          const sparkleRotate = useSharedValue(0);
          const sparkleOpacity = useSharedValue(0);

          React.useEffect(() => {
            sparkleScale.value = withDelay(
              i * 300,
              withRepeat(
                withSequence(
                  withTiming(1, { duration: 1000 }),
                  withTiming(0, { duration: 1000 })
                ),
                -1,
                false
              )
            );

            sparkleRotate.value = withDelay(
              i * 300,
              withRepeat(
                withTiming(360, { duration: 2000, easing: Easing.linear }),
                -1,
                false
              )
            );

            sparkleOpacity.value = withDelay(
              i * 300,
              withRepeat(
                withSequence(
                  withTiming(1, { duration: 1000 }),
                  withTiming(0, { duration: 1000 })
                ),
                -1,
                false
              )
            );
          }, []);

          const animatedStyle = useAnimatedStyle(() => ({
            transform: [
              { scale: sparkleScale.value },
              { rotate: `${sparkleRotate.value}deg` },
            ],
            opacity: sparkleOpacity.value,
          }));

          return (
            <Animated.View
              key={`sparkle-${i}`}
              style={[
                styles.sparkle,
                {
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                },
                animatedStyle,
              ]}
            >
              <MaterialCommunityIcons
                name="sparkles"
                size={SIZES.iconLG}
                color="#FBBF24"
              />
            </Animated.View>
          );
        })}

        {/* Radial glow */}
        <View style={styles.radialGlow} />
      </View>

      {/* Main content */}
      <View style={styles.mainContent}>
        {/* Trophy icon */}
        <Animated.View
          style={styles.trophyContainer}
          entering={ZoomIn.delay(200).springify().damping(15).stiffness(200)}
        >
          <View style={styles.trophyGlow} />
          <LinearGradient
            colors={['#FDE047', '#FBBF24', '#EAB308']}
            style={styles.trophyCircle}
          >
            <MaterialCommunityIcons name="trophy" size={64} color="#78350F" />
          </LinearGradient>

          {/* Orbiting stars */}
          {[...Array(4)].map((_, i) => (
            <OrbitingStar key={`star-${i}`} index={i} />
          ))}
        </Animated.View>

        {/* Text content */}
        <Animated.View
          style={styles.textContent}
          entering={FadeInDown.delay(500).duration(600)}
        >
          {/* Congratulations */}
          <Text style={styles.congratsTitle}>
            <LinearGradient
              colors={['#FDE047', '#D8B4FE', '#F9A8D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.congratsGradientWrapper}
            >
              <Text style={styles.congratsGradient}>Gratulálunk!</Text>
            </LinearGradient>
          </Text>

          {/* Level up message */}
          <View style={styles.levelUpMessage}>
            <Text style={styles.subMessage}>Szakaszt teljesítettél! 🎉</Text>
            <View style={styles.levelCard}>
              <Text style={styles.levelLabel}>Új szint elérve</Text>
              <LinearGradient
                colors={['#22D3EE', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.levelNumberGradientWrapper}
              >
                <Text style={styles.levelNumber}>Szint {newLevel}</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Achievement message */}
          <Animated.Text
            style={styles.achievementMessage}
            entering={FadeIn.delay(1000).duration(600)}
          >
            Folytatod a tanulást az új szakaszban!
          </Animated.Text>
        </Animated.View>

        {/* Continue button */}
        <AnimatedTouchable
          onPress={onContinue}
          style={styles.continueButtonWrapper}
          entering={FadeInDown.delay(1200).duration(600)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButton}
          >
            <Text style={styles.continueButtonText}>TOVÁBB</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={SIZES.iconLG}
              color={COLORS.white}
            />
          </LinearGradient>
        </AnimatedTouchable>
      </View>

      {/* Confetti effect */}
      {[...Array(30)].map((_, i) => (
        <ConfettiPiece key={`confetti-${i}`} index={i} />
      ))}
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
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Background effects
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
    borderRadius: 4,
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
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
    opacity: 0.3,
  },

  // Main content
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
    width: 128,
    height: 128,
  },
  trophyGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(251, 191, 36, 0.5)',
    borderRadius: 64,
    transform: [{ scale: 1.5 }],
  },
  trophyCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.xl,
    borderWidth: 4,
    borderColor: '#FEF08A',
  },
  orbitingStar: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
  },
  orbitingStarInner: {
    transform: [{ translateX: -12 }, { translateY: -80 }],
  },

  // Text content
  textContent: {
    alignItems: 'center',
    gap: SPACING.base,
  },
  congratsTitle: {
    fontSize: SIZES.font5XL,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.base,
  },
  congratsGradientWrapper: {
    paddingHorizontal: SPACING.sm,
  },
  congratsGradient: {
    color: COLORS.white,
    fontSize: SIZES.font5XL,
    fontWeight: FONT_WEIGHT.bold,
  },
  levelUpMessage: {
    gap: SPACING.sm,
    alignItems: 'center',
  },
  subMessage: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
  },
  levelCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    borderRadius: SIZES.radiusXL,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    ...SHADOWS.medium,
    alignItems: 'center',
  },
  levelLabel: {
    color: '#CBD5E1',
    fontSize: SIZES.fontSM,
    marginBottom: SPACING.sm,
  },
  levelNumberGradientWrapper: {
    paddingHorizontal: SPACING.sm,
    borderRadius: SIZES.radiusBase,
  },
  levelNumber: {
    fontSize: SIZES.font4XL,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  achievementMessage: {
    color: '#D8B4FE',
    fontSize: SIZES.fontSM,
    maxWidth: 320,
    textAlign: 'center',
  },

  // Continue button
  continueButtonWrapper: {
    marginTop: SPACING.base,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: 40,
    paddingVertical: SPACING.base,
    borderRadius: SIZES.radiusXL,
    ...SHADOWS.large,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1.6,
  },

  // Confetti
  confetti: {
    position: 'absolute',
    width: 12,
    height: 12,
    top: height / 5,
    left: width / 2,
  },
});
