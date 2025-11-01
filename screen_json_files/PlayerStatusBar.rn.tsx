/**
 * ============================================
 * PLAYERSTATUSBAR - REACT NATIVE VERSION
 * ============================================
 * 
 * Player status display:
 * - Avatar (first letter of name)
 * - Player name
 * - Streak badge (clickable, with Flame icon)
 * - Subscription tier badge (Free/Pro/Master)
 * - XP progress bar
 * 
 * HASZNÁLAT:
 * cp exports/PlayerStatusBar.rn.tsx src/components/PlayerStatusBar.tsx
 * 
 * FÜGGŐSÉGEK:
 * npm install react-native-linear-gradient
 * npm install lucide-react-native
 * cd ios && pod install && cd ..
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Flame, Star, Sparkles, Zap } from 'lucide-react-native';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  gray400: '#9CA3AF',
  shadowDark: 'rgba(0, 0, 0, 0.3)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
};

const SPACING = {
  sm: 8,
  md: 12,
  base: 16,
};

const SIZES = {
  fontXS: 10,
  fontSM: 12,
  fontBase: 14,
  radiusFull: 9999,
  radius2XL: 16,
};

// ============================================
// TYPES
// ============================================

interface PlayerStatusBarProps {
  playerName: string;
  subscriptionTier: 'free' | 'pro' | 'master';
  streak?: number;
  totalXp?: number;
  totalXpForNextLevel?: number;
  playerLevel?: number;
  onStreakClick?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function PlayerStatusBar({
  playerName,
  subscriptionTier,
  streak = 0,
  totalXp = 0,
  totalXpForNextLevel = 0,
  playerLevel = 0,
  onStreakClick,
}: PlayerStatusBarProps) {
  // ============================================
  // COMPUTED VALUES
  // ============================================

  const xpProgress = totalXpForNextLevel > 0 ? (totalXp / totalXpForNextLevel) * 100 : 0;
  const firstLetter = playerName ? playerName.charAt(0).toUpperCase() : '?';

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleStreakClick = () => {
    onStreakClick?.();
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.95)', 'rgba(30, 41, 59, 0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* ============================================ */}
        {/* TOP ROW: Avatar, Name, Badges */}
        {/* ============================================ */}
        <View style={styles.topRow}>
          {/* Left section: Avatar + Name */}
          <View style={styles.leftSection}>
            {/* Avatar */}
            <LinearGradient
              colors={['#06B6D4', '#2563EB', '#9333EA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{firstLetter}</Text>
            </LinearGradient>

            {/* Name */}
            <View style={styles.nameSection}>
              <Text style={styles.nameText}>{playerName || 'Vendég'}</Text>
            </View>
          </View>

          {/* Right section: Badges */}
          <View style={styles.rightSection}>
            {/* Streak Badge */}
            {streak > 0 && (
              <TouchableOpacity onPress={handleStreakClick} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#EA580C', '#DC2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.streakBadge}
                >
                  <Flame size={14} color={COLORS.white} />
                  <Text style={styles.streakText}>{streak}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Subscription tier Badge */}
            {subscriptionTier === 'master' ? (
              <LinearGradient
                colors={['#9333EA', '#DB2777']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.masterBadge}
              >
                <Sparkles size={14} color={COLORS.white} />
                <Text style={styles.badgeText}>Master</Text>
              </LinearGradient>
            ) : subscriptionTier === 'pro' ? (
              <LinearGradient
                colors={['#2563EB', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.proBadge}
              >
                <Star size={14} color={COLORS.white} />
                <Text style={styles.badgeText}>Pro</Text>
              </LinearGradient>
            ) : (
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>Free</Text>
              </View>
            )}
          </View>
        </View>

        {/* ============================================ */}
        {/* BOTTOM ROW: XP Progression */}
        {/* ============================================ */}
        {totalXpForNextLevel > 0 && (
          <View style={styles.xpSection}>
            {/* XP Label */}
            <View style={styles.xpLabelRow}>
              <View style={styles.xpLeft}>
                <Zap size={14} color="#22D3EE" />
                <Text style={styles.xpText}>
                  Szint {playerLevel} • {totalXp.toLocaleString('hu-HU')} XP
                </Text>
              </View>
              <Text style={styles.xpTargetText}>
                {totalXpForNextLevel.toLocaleString('hu-HU')} XP
              </Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={['#06B6D4', '#3B82F6', '#9333EA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(xpProgress, 100)}%` },
                ]}
              >
                {/* Pulse overlay (simplified) */}
                <View style={styles.progressBarPulse} />
              </LinearGradient>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

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
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.3,
    shadowRadius: 50,
    // Shadow (Android)
    elevation: 10,
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  // Left section
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(34, 211, 238, 0.5)',
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: SIZES.fontSM,
  },
  nameSection: {
    flexDirection: 'column',
  },
  nameText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: SIZES.fontBase,
  },

  // Right section
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  // Streak badge
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.3)',
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  streakText: {
    fontSize: SIZES.fontXS,
    fontWeight: '700',
    color: COLORS.white,
  },

  // Master badge
  masterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.3)',
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },

  // Pro badge
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },

  // Free badge
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.3)',
  },

  // Badge texts
  badgeText: {
    fontSize: SIZES.fontXS,
    fontWeight: '700',
    color: COLORS.white,
  },
  freeBadgeText: {
    fontSize: SIZES.fontXS,
    fontWeight: '600',
    color: '#CBD5E1',
  },

  // XP section
  xpSection: {
    gap: 4,
  },
  xpLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  xpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  xpText: {
    fontSize: SIZES.fontXS,
    fontWeight: '600',
    color: '#67E8F9',
  },
  xpTargetText: {
    fontSize: SIZES.fontXS,
    fontWeight: '600',
    color: COLORS.gray400,
  },

  // Progress bar
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
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  progressBarPulse: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    // Pulse animation (simplified - could use Animated API)
    opacity: 0.7,
  },
});
