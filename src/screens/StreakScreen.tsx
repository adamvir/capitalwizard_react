import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface StreakScreenProps {
  navigation: any;
  route: {
    params: {
      currentStreak: number;
      longestStreak: number;
      streakFreezes: number;
      gold: number;
    };
  };
}

export default function StreakScreen({ navigation, route }: StreakScreenProps) {
  const { currentStreak = 7, longestStreak = 15, streakFreezes = 0, gold = 1000 } = route?.params || {};
  const [days, setDays] = useState<Array<{ date: Date; completed: boolean; isFuture: boolean; isToday: boolean }>>([]);

  useEffect(() => {
    const today = new Date();
    const generatedDays: Array<{ date: Date; completed: boolean; isFuture: boolean; isToday: boolean }> = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      const completed = daysAgo < currentStreak;
      const isFuture = date > today;
      const isToday = date.toDateString() === today.toDateString();

      generatedDays.push({ date, completed, isFuture, isToday });
    }

    setDays(generatedDays);
  }, [currentStreak]);

  const handlePurchaseStreakFreeze = () => {
    const cost = 100;
    if (gold < cost) {
      Alert.alert('Nincs elég aranyad!', `Szükséges: ${cost} arany, van: ${gold}`);
      return;
    }
    Alert.alert('Vásárlás sikeres!', 'Széria pont vásárlása sikeres!');
  };

  const getDayLabel = (day: number) => {
    const labels = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];
    return labels[day];
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFF7ED', '#FFFFFF']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={SIZES.iconBase} color="#C2410C" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <View style={styles.headerTitleRow}>
              <MaterialCommunityIcons name="fire" size={SIZES.iconBase} color="#F97316" />
              <Text style={styles.headerTitle}>Széria Napló</Text>
            </View>
            <Text style={styles.headerSubtitle}>Napi teljesítmények nyomon követése</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Streak Stats */}
          <View style={styles.statsGrid}>
            <LinearGradient colors={['#F97316', '#EF4444']} style={styles.statCard}>
              <View style={styles.statCardHeader}>
                <MaterialCommunityIcons name="fire" size={SIZES.iconSM} color={COLORS.white} />
                <Text style={styles.statCardLabel}>Jelenlegi széria</Text>
              </View>
              <Text style={styles.statCardValue}>{currentStreak}</Text>
              <Text style={styles.statCardFooter}>nap egymás után</Text>
            </LinearGradient>

            <LinearGradient colors={['#EAB308', '#F97316']} style={styles.statCard}>
              <View style={styles.statCardHeader}>
                <MaterialCommunityIcons name="calendar" size={SIZES.iconSM} color={COLORS.white} />
                <Text style={styles.statCardLabel}>Leghosszabb</Text>
              </View>
              <Text style={styles.statCardValue}>{longestStreak}</Text>
              <Text style={styles.statCardFooter}>nap rekord</Text>
            </LinearGradient>
          </View>

          {/* Streak Freeze Info */}
          <View style={styles.freezeCard}>
            <View style={styles.freezeCardContent}>
              <View style={styles.freezeIcon}>
                <MaterialCommunityIcons name="shopping" size={SIZES.iconSM} color={COLORS.white} />
              </View>
              <View style={styles.freezeTextContainer}>
                <Text style={styles.freezeTitle}>Széria Védelem</Text>
                <Text style={styles.freezeDescription}>
                  Van <Text style={styles.freezeBold}>{streakFreezes} széria pont</Text> tartalékod. Ha kihagysz egy
                  napot, automatikusan felhasználódik és megvédi a szériádat!
                </Text>
                <TouchableOpacity onPress={handlePurchaseStreakFreeze} style={styles.freezeButton}>
                  <MaterialCommunityIcons name="shopping" size={14} color={COLORS.white} />
                  <Text style={styles.freezeButtonText}>Vásárolj Széria Pontot (100 arany)</Text>
                </TouchableOpacity>
                {gold < 100 && (
                  <Text style={styles.freezeWarning}>Nincs elég aranyad ({gold} / 100)</Text>
                )}
              </View>
            </View>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <MaterialCommunityIcons name="calendar" size={SIZES.iconSM} color="#7C2D12" />
              <Text style={styles.calendarTitle}>Utolsó 30 nap teljesítménye</Text>
            </View>

            {/* Day labels */}
            <View style={styles.dayLabelsGrid}>
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <Text key={day} style={styles.dayLabel}>
                  {getDayLabel(day)}
                </Text>
              ))}
            </View>

            {/* Calendar cells */}
            <View style={styles.calendarGrid}>
              {days.map((day, index) => (
                <View
                  key={index}
                  style={[
                    styles.dayCell,
                    day.isFuture && styles.dayCellFuture,
                    day.completed && !day.isFuture && styles.dayCellCompleted,
                    !day.completed && !day.isFuture && styles.dayCellMissed,
                    day.isToday && styles.dayCellToday,
                  ]}
                >
                  <Text style={[styles.dayCellDate, day.completed && styles.dayCellDateCompleted]}>
                    {day.date.getDate()}
                  </Text>
                  {!day.isFuture && (
                    <MaterialCommunityIcons
                      name={day.completed ? 'check-circle' : 'close-circle'}
                      size={14}
                      color={day.completed ? COLORS.white : '#6B7280'}
                    />
                  )}
                </View>
              ))}
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={styles.legendDotCompleted} />
                <Text style={styles.legendLabel}>Teljesítve</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.legendDotMissed} />
                <Text style={styles.legendLabel}>Kihagyva</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.legendDotToday} />
                <Text style={styles.legendLabel}>Ma</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: 48,
    marginBottom: SPACING.base,
    paddingHorizontal: SPACING.base,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTextContainer: { flex: 1 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  headerTitle: { fontSize: SIZES.fontXL, color: '#7C2D12', fontWeight: 'bold' },
  headerSubtitle: { fontSize: SIZES.fontXS, color: '#C2410C' },
  scrollView: { flex: 1, paddingHorizontal: SPACING.base },
  statsGrid: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.base },
  statCard: {
    flex: 1,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
  },
  statCardHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  statCardLabel: { fontSize: SIZES.fontXS, color: COLORS.white, opacity: 0.9 },
  statCardValue: { fontSize: SIZES.font2XL, color: COLORS.white, fontWeight: 'bold' },
  statCardFooter: { fontSize: 10, color: COLORS.white, opacity: 0.8, marginTop: 2 },
  freezeCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 2,
    borderColor: '#BFDBFE',
    marginBottom: SPACING.base,
  },
  freezeCardContent: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
  freezeIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#3B82F6',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freezeTextContainer: { flex: 1 },
  freezeTitle: { fontSize: SIZES.fontSM, color: '#1E3A8A', fontWeight: 'bold', marginBottom: 2 },
  freezeDescription: { fontSize: SIZES.fontXS, color: '#1D4ED8', marginBottom: SPACING.md },
  freezeBold: { fontWeight: 'bold' },
  freezeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: '#2563EB',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    justifyContent: 'center',
  },
  freezeButtonText: { color: COLORS.white, fontSize: SIZES.fontXS, fontWeight: 'bold' },
  freezeWarning: { fontSize: 10, color: '#2563EB', marginTop: SPACING.sm, textAlign: 'center' },
  calendarCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 2,
    borderColor: '#FED7AA',
    marginBottom: SPACING.xl,
  },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.base },
  calendarTitle: { fontSize: SIZES.fontSM, color: '#7C2D12', fontWeight: 'bold' },
  dayLabelsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  dayLabel: { flex: 1, textAlign: 'center', fontSize: 10, color: '#C2410C', fontWeight: '600' },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  dayCell: {
    width: '13%',
    aspectRatio: 1,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayCellFuture: { backgroundColor: '#F3F4F6' },
  dayCellCompleted: { backgroundColor: '#10B981' },
  dayCellMissed: { backgroundColor: '#E5E7EB' },
  dayCellToday: { borderWidth: 2, borderColor: '#F97316' },
  dayCellDate: { fontSize: 9, fontWeight: '600', color: '#4B5563' },
  dayCellDateCompleted: { color: COLORS.white },
  legend: {
    marginTop: SPACING.base,
    paddingTop: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: '#FED7AA',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  legendDotCompleted: {
    width: 14,
    height: 14,
    backgroundColor: '#10B981',
    borderRadius: SIZES.radiusSM,
  },
  legendDotMissed: {
    width: 14,
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: SIZES.radiusSM,
  },
  legendDotToday: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#F97316',
    borderRadius: SIZES.radiusSM,
  },
  legendLabel: { fontSize: 10, color: '#374151' },
});
