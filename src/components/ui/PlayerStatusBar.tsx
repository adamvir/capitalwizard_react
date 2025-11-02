// ============================================
// PLAYERSTATUSBAR KOMPONENS
// Játékos állapot megjelenítése: név, előfizetés, streak, XP progresszió
// ============================================

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS } from '../../utils/styleConstants';

interface PlayerStatusBarProps {
  playerName: string;
  subscriptionTier: 'free' | 'pro' | 'master';
  streak?: number;
  totalXp?: number;
  totalXpForNextLevel?: number;
  playerLevel?: number;
  onStreakClick?: () => void;
}

export function PlayerStatusBar({
  playerName,
  subscriptionTier,
  streak = 0,
  totalXp = 0,
  totalXpForNextLevel = 0,
  playerLevel = 0,
  onStreakClick
}: PlayerStatusBarProps) {

  // ===== COMPUTED VALUES =====
  const xpProgress = totalXpForNextLevel > 0 ? (totalXp / totalXpForNextLevel) * 100 : 0;

  // ===== EVENT HANDLERS =====
  const handleStreakClick = () => {
    onStreakClick?.();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.95)', 'rgba(30, 41, 59, 0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* FELSŐ SOR: Avatar, Név, Badge-ek */}
        <View style={styles.topRow}>
          {/* BAL OLDAL: Avatar és Név */}
          <View style={styles.leftSection}>
            {/* Avatar */}
            <LinearGradient
              colors={['#06B6D4', '#2563EB', '#9333EA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {playerName ? playerName.charAt(0).toUpperCase() : '?'}
              </Text>
            </LinearGradient>
            {/* Név */}
            <View style={styles.nameSection}>
              <Text style={styles.nameText}>
                {playerName || 'Vendég'}
              </Text>
            </View>
          </View>

          {/* JOBB OLDAL: Badge-ek */}
          <View style={styles.rightSection}>
            {/* Streak Badge (csak ha van streak) */}
            {streak > 0 && (
              <Pressable
                onPress={handleStreakClick}
                style={({ pressed }) => [
                  styles.streakBadgeContainer,
                  pressed && styles.badgePressed
                ]}
              >
                <LinearGradient
                  colors={['#EA580C', '#DC2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.streakBadge}
                >
                  <MaterialCommunityIcons name="fire" size={14} color={COLORS.white} />
                  <Text style={styles.streakText}>{streak}</Text>
                </LinearGradient>
              </Pressable>
            )}

            {/* Előfizetési szint Badge */}
            {subscriptionTier === 'master' ? (
              <LinearGradient
                colors={['#9333EA', '#DB2777']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tierBadge}
              >
                <MaterialCommunityIcons name="shimmer" size={14} color={COLORS.white} />
                <Text style={styles.badgeText}>Master</Text>
              </LinearGradient>
            ) : subscriptionTier === 'pro' ? (
              <LinearGradient
                colors={['#2563EB', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tierBadge}
              >
                <MaterialCommunityIcons name="star" size={14} color={COLORS.white} />
                <Text style={styles.badgeText}>Pro</Text>
              </LinearGradient>
            ) : (
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>Free</Text>
              </View>
            )}
          </View>
        </View>

        {/* ALSÓ SOR: XP Progresszió */}
        {totalXpForNextLevel > 0 && (
          <View style={styles.xpSection}>
            {/* XP Label */}
            <View style={styles.xpLabelRow}>
              <View style={styles.xpLeft}>
                <MaterialCommunityIcons name="flash" size={14} color="#22D3EE" />
                <Text style={styles.xpText}>
                  Szint {playerLevel} • {totalXp.toLocaleString('hu-HU')} XP
                </Text>
              </View>
              <Text style={styles.xpTargetText}>
                {totalXpForNextLevel.toLocaleString('hu-HU')} XP
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={['#06B6D4', '#3B82F6', '#9333EA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(xpProgress, 100)}%` }
                ]}
              />
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: SPACING.base,
  },
  card: {
    borderRadius: SIZES.radius2XL,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: 'rgba(71, 85, 105, 0.3)',
    ...SHADOWS.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(34, 211, 238, 0.5)',
    marginRight: SPACING.sm,
    ...SHADOWS.medium,
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: SIZES.fontSM,
  },
  nameSection: {
    flexDirection: 'column',
  },
  nameText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: SIZES.fontBase,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakBadgeContainer: {
    marginRight: SPACING.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.3)',
    ...SHADOWS.medium,
  },
  badgePressed: {
    transform: [{ scale: 0.95 }],
  },
  streakText: {
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    marginLeft: 4,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.3)',
    ...SHADOWS.medium,
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.3)',
  },
  badgeText: {
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    marginLeft: 4,
  },
  freeBadgeText: {
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#CBD5E1',
  },
  xpSection: {
    flexDirection: 'column',
  },
  xpLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  xpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpText: {
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#67E8F9',
    marginLeft: 6,
  },
  xpTargetText: {
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.gray400,
  },
  progressBarBg: {
    position: 'relative',
    height: 8,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.3)',
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: SIZES.radiusFull,
    ...SHADOWS.medium,
  },
});
