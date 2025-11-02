/**
 * StreakPage - REACT NATIVE VERSION
 * 
 * Széria (streak) részletek oldal:
 * - Jelenlegi és leghosszabb széria statisztikák
 * - Széria védelem vásárlás
 * - 30 napos naptár grid (teljesítve/kihagyva)
 * 
 * DEPENDENCIES:
 * npm install lucide-react-native
 * npm install react-native-linear-gradient
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ArrowLeft,
  Flame,
  Calendar,
  ShoppingBag,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';

// ============================================
// CONSTANTS
// ============================================

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  orange50: '#FFF7ED',
  orange300: '#FDBA74',
  orange400: '#FB923C',
  orange500: '#F97316',
  orange600: '#EA580C',
  orange700: '#C2410C',
  brown900: '#7C2D12',
  yellow500: '#EAB308',
  red500: '#EF4444',
  green500: '#10B981',
  green600: '#059669',
  blue50: '#EFF6FF',
  blue200: '#BFDBFE',
  blue500: '#3B82F6',
  blue600: '#2563EB',
  blue700: '#1D4ED8',
  blue900: '#1E3A8A',
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
  fontXS: 12,
  fontSM: 14,
  fontBase: 16,
  font2XL: 24,
  borderMedium: 2,
  radiusSM: 4,
  radiusMD: 8,
  radiusLG: 12,
  radiusXL: 16,
  radiusFull: 9999,
  iconSM: 16,
  iconBase: 18,
};

const FONT_WEIGHT = {
  normal: '400' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// ============================================
// TYPES
// ============================================

interface StreakPageProps {
  onBack: () => void;
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  onPurchaseStreakFreeze: () => void;
  gold: number;
}

interface DayData {
  date: Date;
  completed: boolean;
  isFuture: boolean;
}

// ============================================
// GAME CONFIG (Mock)
// ============================================

// TODO: Import from actual gameConfig if available
const STREAK_FREEZE_GOLD_COST = 500;

// ============================================
// COMPONENT
// ============================================

export function StreakPage({
  onBack,
  currentStreak,
  longestStreak,
  streakFreezes,
  onPurchaseStreakFreeze,
  gold,
}: StreakPageProps) {
  // ============================================
  // CALENDAR GENERATION
  // ============================================

  const generateLast30Days = (): DayData[] => {
    const today = new Date();
    const days: DayData[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Check if this day is in the current streak
      const daysAgo = Math.floor(
        (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );
      const completed = daysAgo < currentStreak;
      const isFuture = date > today;

      days.push({ date, completed, isFuture });
    }

    return days;
  };

  const days = generateLast30Days();
  const today = new Date();
  const canAffordStreakFreeze = gold >= STREAK_FREEZE_GOLD_COST;

  // ============================================
  // HANDLERS
  // ============================================

  const handlePurchaseStreakFreeze = () => {
    if (!canAffordStreakFreeze) {
      Alert.alert(
        'Nincs elég aranyad',
        `Széria pont vásárlásához ${STREAK_FREEZE_GOLD_COST} arany szükséges. Jelenleg ${gold} aranyad van.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Széria Pont Vásárlás',
      `Biztosan vásárolsz 1 széria pontot ${STREAK_FREEZE_GOLD_COST} aranyért?`,
      [
        { text: 'Mégse', style: 'cancel' },
        { text: 'Vásárlás', onPress: onPurchaseStreakFreeze },
      ]
    );
  };

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  const renderStatCard = (
    gradient: string[],
    icon: React.ReactNode,
    label: string,
    value: number,
    footer: string
  ) => (
    <LinearGradient colors={gradient} style={styles.statCard}>
      <View style={styles.statCardHeader}>
        {icon}
        <Text style={styles.statCardLabel}>{label}</Text>
      </View>
      <Text style={styles.statCardValue}>{value}</Text>
      <Text style={styles.statCardFooter}>{footer}</Text>
    </LinearGradient>
  );

  const renderDayCell = (day: DayData, index: number) => {
    const isToday = day.date.toDateString() === today.toDateString();

    return (
      <View
        key={index}
        style={[
          styles.dayCell,
          day.isFuture && styles.dayCellFuture,
          day.completed && !day.isFuture && styles.dayCellCompleted,
          !day.completed && !day.isFuture && styles.dayCellMissed,
          isToday && styles.dayCellToday,
        ]}
      >
        <Text
          style={[
            styles.dayCellDate,
            day.isFuture && styles.dayCellDateFuture,
            day.completed && !day.isFuture && styles.dayCellDateCompleted,
            !day.completed && !day.isFuture && styles.dayCellDateMissed,
          ]}
        >
          {day.date.getDate()}
        </Text>
        {!day.isFuture && (
          <View>
            {day.completed ? (
              <CheckCircle2 size={14} color={COLORS.white} />
            ) : (
              <XCircle size={14} color={COLORS.gray600} />
            )}
          </View>
        )}
      </View>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={18} color={COLORS.brown900} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <View style={styles.headerTitleRow}>
            <Flame size={SIZES.iconBase} color={COLORS.orange500} />
            <Text style={styles.headerTitle}>Széria Napló</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Napi teljesítmények nyomon követése
          </Text>
        </View>
      </View>

      {/* Streak Stats */}
      <View style={styles.statsGrid}>
        {renderStatCard(
          [COLORS.orange500, COLORS.red500],
          <Flame size={SIZES.iconSM} color={COLORS.white} />,
          'Jelenlegi széria',
          currentStreak,
          'nap egymás után'
        )}
        {renderStatCard(
          [COLORS.yellow500, COLORS.orange500],
          <Calendar size={SIZES.iconSM} color={COLORS.white} />,
          'Leghosszabb',
          longestStreak,
          'nap rekord'
        )}
      </View>

      {/* Streak Freeze Info */}
      <View style={styles.freezeCard}>
        <View style={styles.freezeCardContent}>
          <View style={styles.freezeIcon}>
            <ShoppingBag size={SIZES.iconSM} color={COLORS.white} />
          </View>
          <View style={styles.freezeTextContainer}>
            <Text style={styles.freezeTitle}>Széria Védelem</Text>
            <Text style={styles.freezeDescription}>
              Van <Text style={styles.freezeBold}>{streakFreezes} széria pont</Text> tartalékod.
              Ha kihagysz egy napot, automatikusan felhasználódik és megvédi a
              szériádat!
            </Text>
            <TouchableOpacity
              onPress={handlePurchaseStreakFreeze}
              disabled={!canAffordStreakFreeze}
              style={[
                styles.purchaseButton,
                !canAffordStreakFreeze && styles.purchaseButtonDisabled,
              ]}
              activeOpacity={0.8}
            >
              <ShoppingBag size={14} color={COLORS.white} />
              <Text style={styles.purchaseButtonText}>
                Vásárolj Széria Pontot ({STREAK_FREEZE_GOLD_COST} arany)
              </Text>
            </TouchableOpacity>
            {!canAffordStreakFreeze && (
              <Text style={styles.freezeWarning}>
                Nincs elég aranyad ({gold} / {STREAK_FREEZE_GOLD_COST})
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarCard}>
        <View style={styles.calendarTitleRow}>
          <Calendar size={SIZES.iconSM} color={COLORS.brown900} />
          <Text style={styles.calendarTitle}>Utolsó 30 nap teljesítménye</Text>
        </View>

        {/* Day Labels */}
        <View style={styles.dayLabelsGrid}>
          {['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'].map((day) => (
            <Text key={day} style={styles.dayLabel}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Cells */}
        <View style={styles.calendarGrid}>
          {days.map((day, index) => renderDayCell(day, index))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <LinearGradient
              colors={[COLORS.green500, COLORS.green600]}
              style={styles.legendDot}
            />
            <Text style={styles.legendLabel}>Teljesítve</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendDotGray]} />
            <Text style={styles.legendLabel}>Kihagyva</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendDotToday]} />
            <Text style={styles.legendLabel}>Ma</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.orange50,
  },
  contentContainer: {
    padding: 14,
    paddingBottom: 100, // Extra bottom padding
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.base,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow (Android)
    elevation: 2,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: COLORS.brown900,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.bold,
  },
  headerSubtitle: {
    fontSize: SIZES.fontXS,
    color: COLORS.orange700,
  },

  // Streak Stats
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.base,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: SIZES.radiusLG,
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow (Android)
    elevation: 2,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statCardLabel: {
    fontSize: SIZES.fontXS,
    color: COLORS.white,
    opacity: 0.9,
  },
  statCardValue: {
    fontSize: SIZES.font2XL,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
  statCardFooter: {
    fontSize: 10,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 2,
  },

  // Streak Freeze Info
  freezeCard: {
    padding: 14,
    marginBottom: SPACING.base,
    borderRadius: SIZES.radiusLG,
    borderWidth: SIZES.borderMedium,
    borderColor: COLORS.blue200,
    backgroundColor: COLORS.blue50,
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Shadow (Android)
    elevation: 1,
  },
  freezeCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  freezeIcon: {
    width: 36,
    height: 36,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.blue500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freezeTextContainer: {
    flex: 1,
  },
  freezeTitle: {
    color: COLORS.blue900,
    fontSize: SIZES.fontSM,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: 4,
  },
  freezeDescription: {
    fontSize: SIZES.fontXS,
    color: COLORS.blue700,
    marginBottom: 10,
    lineHeight: SIZES.fontXS * 1.5,
  },
  freezeBold: {
    fontWeight: FONT_WEIGHT.bold,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.blue600,
    paddingVertical: 10,
    borderRadius: SIZES.radiusMD,
    // Shadow (iOS)
    shadowColor: COLORS.blue600,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Shadow (Android)
    elevation: 2,
  },
  purchaseButtonDisabled: {
    backgroundColor: COLORS.gray400,
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.semibold,
  },
  freezeWarning: {
    fontSize: 10,
    color: COLORS.blue600,
    marginTop: 6,
    textAlign: 'center',
  },

  // Calendar Card
  calendarCard: {
    padding: 14,
    borderRadius: SIZES.radiusLG,
    borderWidth: SIZES.borderMedium,
    borderColor: COLORS.orange300,
    backgroundColor: COLORS.white,
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Shadow (Android)
    elevation: 1,
  },
  calendarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  calendarTitle: {
    color: COLORS.brown900,
    fontSize: SIZES.fontSM,
    fontWeight: FONT_WEIGHT.bold,
  },

  // Day Labels
  dayLabelsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dayLabel: {
    width: (SCREEN_WIDTH - 28 - 28 - 36) / 7, // Screen - padding - card padding - gaps
    textAlign: 'center',
    fontSize: 10,
    color: COLORS.orange700,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Calendar Grid
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayCell: {
    width: (SCREEN_WIDTH - 28 - 28 - 36) / 7, // Match day label width
    aspectRatio: 1,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayCellFuture: {
    backgroundColor: COLORS.gray100,
  },
  dayCellCompleted: {
    backgroundColor: COLORS.green500,
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow (Android)
    elevation: 2,
  },
  dayCellMissed: {
    backgroundColor: COLORS.gray200,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: COLORS.orange500,
  },
  dayCellDate: {
    fontSize: 9,
    fontWeight: FONT_WEIGHT.semibold,
  },
  dayCellDateFuture: {
    color: COLORS.gray400,
  },
  dayCellDateCompleted: {
    color: COLORS.white,
  },
  dayCellDateMissed: {
    color: COLORS.gray600,
  },

  // Legend
  legend: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.orange300,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: SIZES.radiusSM,
  },
  legendDotGray: {
    backgroundColor: COLORS.gray200,
  },
  legendDotToday: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.orange500,
  },
  legendLabel: {
    fontSize: 10,
    color: COLORS.gray700,
  },
});
