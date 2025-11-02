/**
 * ============================================
 * EVENTCARDS - REACT NATIVE VERSION
 * ============================================
 *
 * Event cards display: Arena and Templomos
 * - Arena card (clickable, daily limit tracking)
 * - Templomos card (placeholder, disabled)
 *
 * HASZNÁLAT:
 * <EventCards
 *   onArenaClick={() => navigation.navigate('Arena')}
 *   subscriptionTier="free"  // 'free' | 'pro' | 'master'
 * />
 *
 * FÜGGŐSÉGEK:
 * npm install @react-native-async-storage/async-storage
 * npm install expo-linear-gradient
 * npm install lucide-react-native
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Crown, Infinity } from 'lucide-react-native';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
};

const SPACING = {
  sm: 8,
};

const SIZES = {
  radiusBase: 8,
  radiusFull: 9999,
  fontSM: 12,
  fontBase: 14,
};

// Game config (simple version)
const FREE_DAILY_ARENA_GAMES = 3;

// ============================================
// TYPES
// ============================================

interface EventCardsProps {
  onArenaClick?: () => void;
  subscriptionTier?: 'free' | 'pro' | 'master';
}

// ============================================
// COMPONENT
// ============================================

export function EventCards({ onArenaClick, subscriptionTier = 'free' }: EventCardsProps) {
  // ============================================
  // STATE
  // ============================================

  const [remainingGames, setRemainingGames] = useState<number | 'unlimited'>(
    FREE_DAILY_ARENA_GAMES
  );

  // ============================================
  // EFFECTS
  // ============================================

  // Load remaining games on mount and when app becomes active
  useEffect(() => {
    getRemainingGames();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        getRemainingGames();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [subscriptionTier]);

  // Periodic check for day change (every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      getRemainingGames();
    }, 60000);

    return () => clearInterval(interval);
  }, [subscriptionTier]);

  // ============================================
  // ASYNC STORAGE
  // ============================================

  const getRemainingGames = async () => {
    // Premium users have unlimited games
    if (subscriptionTier !== 'free') {
      setRemainingGames('unlimited');
      return;
    }

    // Free users have daily limit
    try {
      const today = new Date().toDateString();
      const savedData = await AsyncStorage.getItem('arena_daily_games');

      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.date === today) {
          const remaining = Math.max(0, FREE_DAILY_ARENA_GAMES - data.gamesPlayed);
          setRemainingGames(remaining);
          return;
        }
      }

      setRemainingGames(FREE_DAILY_ARENA_GAMES);
    } catch (error) {
      console.error('Error loading remaining games:', error);
      setRemainingGames(FREE_DAILY_ARENA_GAMES);
    }
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleArenaClick = () => {
    onArenaClick?.();
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={styles.container}>
      {/* ============================================ */}
      {/* ARENA CARD */}
      {/* ============================================ */}
      <TouchableOpacity onPress={handleArenaClick} activeOpacity={0.8}>
        <LinearGradient
          colors={['#D97706', '#EA580C']} // Amber → Orange
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.arenaCard}
        >
          {/* Overlay */}
          <View style={styles.cardOverlay} />

          {/* Content */}
          <View style={styles.cardContent}>
            {/* Header: Icon + Title */}
            <View style={styles.cardHeader}>
              <Crown size={20} color="#FDE047" />
              <Text style={styles.cardTitle}>Küzdőtér</Text>
            </View>

            {/* Info: Remaining games */}
            <View style={styles.cardInfo}>
              {remainingGames === 'unlimited' ? (
                <>
                  <Infinity size={16} color={COLORS.white} />
                  <Text style={styles.infoText}>Korlátlan</Text>
                </>
              ) : (
                <>
                  <Crown size={12} color={COLORS.white} />
                  <Text style={styles.infoText}>{remainingGames} játék</Text>
                </>
              )}
            </View>
          </View>

          {/* Character illustration */}
          <LinearGradient
            colors={['#3B82F6', '#9333EA']} // Blue → Purple
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.arenaIllustration}
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* ============================================ */}
      {/* TEMPLOMOS CARD (Placeholder) */}
      {/* ============================================ */}
      <LinearGradient
        colors={['#2563EB', '#06B6D4']} // Blue → Cyan
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.templomosCard}
      >
        {/* Overlay */}
        <View style={styles.cardOverlay} />

        {/* Content */}
        <View style={styles.cardContent}>
          {/* Title */}
          <Text style={styles.cardTitle}>Templomos</Text>

          {/* Info: Timer */}
          <View style={styles.cardInfo}>
            <Clock size={12} color={COLORS.white} />
            <Text style={styles.infoText}>9h 6m</Text>
          </View>
        </View>

        {/* Dragon illustration */}
        <LinearGradient
          colors={['#A855F7', '#EC4899']} // Purple → Pink
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.dragonIllustration}
        />
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
    right: 8,
    top: 80,
    flexDirection: 'column',
    gap: SPACING.sm,
    zIndex: 10,
  },

  // Arena card
  arenaCard: {
    position: 'relative',
    width: 160,
    height: 64,
    borderRadius: SIZES.radiusBase,
    borderWidth: 2,
    borderColor: '#FCD34D', // Yellow
    overflow: 'hidden',
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    // Shadow (Android)
    elevation: 5,
  },

  // Templomos card
  templomosCard: {
    position: 'relative',
    width: 160,
    height: 64,
    borderRadius: SIZES.radiusBase,
    borderWidth: 2,
    borderColor: '#22D3EE', // Cyan
    overflow: 'hidden',
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    // Shadow (Android)
    elevation: 5,
  },

  // Card overlay (darkening)
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },

  // Card content
  cardContent: {
    position: 'relative',
    padding: SPACING.sm,
    height: '100%',
    justifyContent: 'space-between',
  },

  // Card header (icon + title)
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Card title
  cardTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: '600',
    // Text shadow
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Card info row
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Info text
  infoText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    // Text shadow
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Arena illustration (character)
  arenaIllustration: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 48,
    height: 48,
    borderTopLeftRadius: SIZES.radiusFull,
  },

  // Dragon illustration (Templomos)
  dragonIllustration: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 48,
    height: 48,
    borderTopLeftRadius: SIZES.radiusFull,
  },
});
