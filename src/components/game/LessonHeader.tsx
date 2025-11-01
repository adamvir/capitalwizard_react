import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { COLORS, SPACING, SIZES, FONT_WEIGHT, SHADOWS } from '../../utils/styleConstants';

interface LessonHeaderProps {
  onBack?: () => void;
  onStart?: () => void;
  lessonNumber?: number;
  gameType?: 'reading' | 'matching' | 'quiz';
  isFirstRound?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function LessonHeader({
  onBack,
  onStart,
  lessonNumber = 1,
  gameType = 'reading',
  isFirstRound = true
}: LessonHeaderProps) {
  // Determine game details based on type
  const getGameDetails = () => {
    switch (gameType) {
      case 'reading':
        return {
          theme: 'Pénzügyi Alapismeretek',
          difficulty: 'Könnyű',
          name: 'Olvasás',
          difficultyColor: '#4ADE80'
        };
      case 'matching':
        return {
          theme: 'Pénzügyi Alapismeretek',
          difficulty: 'Közepes',
          name: 'Párosítás',
          difficultyColor: '#22D3EE'
        };
      case 'quiz':
        return {
          theme: 'Pénzügyi Alapismeretek',
          difficulty: 'Nehéz',
          name: 'Kvíz',
          difficultyColor: '#F87171'
        };
      default:
        return {
          theme: 'Pénzügyi Alapismeretek',
          difficulty: 'Könnyű',
          name: 'Olvasás',
          difficultyColor: '#4ADE80'
        };
    }
  };

  const lesson = getGameDetails();
  const roundText = isFirstRound ? '1. kör' : '2. kör';

  return (
    <View style={styles.container}>
      {/* Back button */}
      <AnimatedTouchable
        onPress={onBack}
        style={styles.backButton}
        entering={FadeIn.duration(400)}
        activeOpacity={0.8}
      >
        <View style={styles.backButtonIcon}>
          <MaterialCommunityIcons name="arrow-left" size={SIZES.iconBase} color={COLORS.white} />
        </View>
        <Text style={styles.backButtonText}>Vissza</Text>
      </AnimatedTouchable>

      {/* Lesson Title */}
      <Animated.View
        style={styles.titleContainer}
        entering={FadeInDown.delay(100).duration(500)}
      >
        <Text style={styles.title}>{lessonNumber}. Lecke</Text>
      </Animated.View>

      {/* Lesson Info Cards */}
      <View style={styles.cardsContainer}>
        {/* Theme */}
        <Animated.View
          style={styles.infoCard}
          entering={FadeInDown.delay(200).duration(500)}
        >
          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>Téma:</Text>
            <Text style={styles.infoValue}>{lesson.theme}</Text>
          </View>
        </Animated.View>

        {/* Round */}
        <Animated.View
          style={styles.infoCard}
          entering={FadeInDown.delay(250).duration(500)}
        >
          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>Kör:</Text>
            <Text style={styles.infoValue}>{roundText}</Text>
          </View>
        </Animated.View>

        {/* Difficulty */}
        <Animated.View
          style={styles.infoCard}
          entering={FadeInDown.delay(300).duration(500)}
        >
          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>Nehézség:</Text>
            <Text style={[styles.infoValue, { color: lesson.difficultyColor }]}>
              {lesson.difficulty}
            </Text>
          </View>
        </Animated.View>

        {/* Name */}
        <Animated.View
          style={styles.infoCard}
          entering={FadeInDown.delay(350).duration(500)}
        >
          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>Neve:</Text>
            <Text style={styles.infoValue}>{lesson.name}</Text>
          </View>
        </Animated.View>

        {/* Reward */}
        <Animated.View
          style={styles.infoCard}
          entering={FadeInDown.delay(400).duration(500)}
        >
          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>Jutalom:</Text>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardAmount}>150</Text>
              <LinearGradient
                colors={['#FDE047', '#FBBF24', '#EAB308']}
                style={styles.coinIcon}
              >
                <MaterialCommunityIcons
                  name="cash-multiple"
                  size={SIZES.iconSM}
                  color="#78350F"
                />
              </LinearGradient>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Start Button */}
      <AnimatedTouchable
        onPress={onStart}
        style={styles.startButtonWrapper}
        entering={FadeInDown.delay(500).duration(600)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#10B981', '#059669']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.startButton}
        >
          <Text style={styles.startButtonText}>KEZDÉS!</Text>
        </LinearGradient>
      </AnimatedTouchable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.lg,
  },

  // Back button
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  backButtonIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
  },

  // Lesson title
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.font3XL,
    fontWeight: FONT_WEIGHT.bold,
  },

  // Info cards
  cardsContainer: {
    gap: SPACING.md,
  },
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    ...SHADOWS.medium,
  },
  infoCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#CBD5E1',
    fontSize: SIZES.fontBase,
  },
  infoValue: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.medium,
  },

  // Reward row
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rewardAmount: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.medium,
  },
  coinIcon: {
    width: SIZES.iconLG,
    height: SIZES.iconLG,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: 'rgba(202, 138, 4, 0.2)',
  },

  // Start button
  startButtonWrapper: {
    width: '50%',
    alignSelf: 'center',
    marginTop: 44,
  },
  startButton: {
    paddingVertical: SPACING.base,
    paddingHorizontal: 32,
    borderRadius: SIZES.radiusXL,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1.6,
  },
});
