/**
 * LessonHeader - REACT NATIVE VERSION
 * 
 * Lecke bevezető képernyő (játék előtt)
 * - Lecke információk (téma, kör, nehézség, név, jutalom)
 * - "KEZDÉS!" gomb
 * - Vissza navigáció
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Coins, ArrowLeft } from 'lucide-react-native';

// NAVIGATION: React Navigation használata
// import { useNavigation } from '@react-navigation/native';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate300: '#CBD5E1',
  success: '#10B981',
  successDark: '#059669',
  successDarker: '#047857',
  gold: '#EAB308',
  goldLight: '#FDE047',
  goldDark: '#CA8A04',
  goldDarker: '#78350F',
  difficultyEasy: '#4ADE80',
  difficultyMedium: '#22D3EE',
  difficultyHard: '#F87171',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

const SIZES = {
  fontSM: 12,
  fontBase: 14,
  fontLG: 18,
  fontXL: 20,
  font2XL: 24,
  font3XL: 30,
  borderThin: 1,
  radiusLG: 12,
  radiusXL: 16,
  radiusFull: 9999,
  iconSM: 16,
  iconBase: 18,
  iconLG: 24,
};

const FONT_WEIGHT = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// ============================================
// TYPES
// ============================================

interface LessonHeaderProps {
  onBack?: () => void;
  onStart?: () => void;
  lessonNumber?: number;
  gameType?: 'reading' | 'matching' | 'quiz';
  isFirstRound?: boolean;
}

interface GameDetails {
  theme: string;
  difficulty: string;
  name: string;
  difficultyColor: string;
}

// ============================================
// COMPONENT
// ============================================

export function LessonHeader({
  onBack,
  onStart,
  lessonNumber = 1,
  gameType = 'reading',
  isFirstRound = true,
}: LessonHeaderProps) {
  // NAVIGATION FIX - React Native:
  // const navigation = useNavigation();

  // ============================================
  // GAME DETAILS BY TYPE
  // ============================================

  const getGameDetails = (): GameDetails => {
    switch (gameType) {
      case 'reading':
        return {
          theme: 'Pénzügyi Alapismeretek',
          difficulty: 'Könnyű',
          name: 'Olvasás',
          difficultyColor: COLORS.difficultyEasy,
        };
      case 'matching':
        return {
          theme: 'Pénzügyi Alapismeretek',
          difficulty: 'Közepes',
          name: 'Párosítás',
          difficultyColor: COLORS.difficultyMedium,
        };
      case 'quiz':
        return {
          theme: 'Pénzügyi Alapismeretek',
          difficulty: 'Nehéz',
          name: 'Kvíz',
          difficultyColor: COLORS.difficultyHard,
        };
      default:
        return {
          theme: 'Pénzügyi Alapismeretek',
          difficulty: 'Könnyű',
          name: 'Olvasás',
          difficultyColor: COLORS.difficultyEasy,
        };
    }
  };

  const lesson = getGameDetails();
  const roundText = isFirstRound ? '1. kör' : '2. kör';

  // ============================================
  // HANDLERS
  // ============================================

  const handleBack = () => {
    // NAVIGATION: navigation.goBack()
    if (onBack) {
      onBack();
    }
  };

  const handleStart = () => {
    // NAVIGATION: Navigate to game screen based on gameType
    if (onStart) {
      onStart();
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <View style={styles.backButtonIcon}>
          <ArrowLeft size={SIZES.iconBase} color={COLORS.white} />
        </View>
        <Text style={styles.backButtonText}>Vissza</Text>
      </TouchableOpacity>

      {/* Lesson Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{lessonNumber}. Lecke</Text>
      </View>

      {/* Lesson Info Cards */}
      <View style={styles.cardsContainer}>
        {/* Theme */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>Téma:</Text>
            <Text style={styles.infoValue}>{lesson.theme}</Text>
          </View>
        </View>

        {/* Round */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>Kör:</Text>
            <Text style={styles.infoValue}>{roundText}</Text>
          </View>
        </View>

        {/* Difficulty */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>Nehézség:</Text>
            <Text style={[styles.infoValue, { color: lesson.difficultyColor }]}>
              {lesson.difficulty}
            </Text>
          </View>
        </View>

        {/* Name */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>Neve:</Text>
            <Text style={styles.infoValue}>{lesson.name}</Text>
          </View>
        </View>

        {/* Reward */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>Jutalom:</Text>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardAmount}>150</Text>
              <LinearGradient
                colors={[COLORS.goldLight, COLORS.gold]}
                style={styles.coinIcon}
              >
                <Coins size={SIZES.iconSM} color={COLORS.goldDarker} />
              </LinearGradient>
            </View>
          </View>
        </View>
      </View>

      {/* Start Button */}
      <View style={styles.startButtonContainer}>
        <LinearGradient
          colors={[COLORS.success, COLORS.successDark]}
          style={styles.startButton}
        >
          <TouchableOpacity onPress={handleStart} activeOpacity={0.8}>
            <Text style={styles.startButtonText}>KEZDÉS!</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

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
    alignSelf: 'flex-start',
  },
  backButtonIcon: {
    width: 32,
    height: 32,
    backgroundColor: `${COLORS.slate800}99`,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.slate600}80`,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: `${COLORS.slate800}99`,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.slate600}80`,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
  },
  infoCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: COLORS.slate300,
    fontSize: SIZES.fontBase,
  },
  infoValue: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.semibold,
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
    fontWeight: FONT_WEIGHT.semibold,
  },
  coinIcon: {
    width: SIZES.iconLG,
    height: SIZES.iconLG,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.goldDark}33`,
  },

  // Start button
  startButtonContainer: {
    marginTop: 44,
    alignItems: 'center',
  },
  startButton: {
    width: '50%',
    borderRadius: SIZES.radiusXL,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 2,
    textAlign: 'center',
    paddingVertical: SPACING.base,
    paddingHorizontal: 32,
    fontFamily: 'Georgia',
  },
});
