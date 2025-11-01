import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS } from '../../utils/styleConstants';

// ============================================
// EVENTCARDS KOMPONENS
// Esemény kártyák megjelenítése: Küzdőtér és Templomos
// ============================================

interface EventCardsProps {
  onArenaClick?: () => void;
  subscriptionTier?: 'free' | 'pro' | 'master';
}

export function EventCards({ onArenaClick, subscriptionTier = 'free' }: EventCardsProps) {

  // ===== HELPER FUNCTIONS =====

  // Hátralévő játékok száma ma (Arena esetén)
  const getRemainingGames = async (): Promise<number | 'unlimited'> => {
    // Premium felhasználóknak korlátlan
    if (subscriptionTier !== 'free') {
      return 'unlimited';
    }

    // Ingyenes felhasználóknak napi limit
    const maxGames = 5; // Default config value
    const today = new Date().toDateString();

    try {
      const savedData = await AsyncStorage.getItem('arena_daily_games');

      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.date === today) {
          return Math.max(0, maxGames - data.gamesPlayed);
        }
      }

      return maxGames;
    } catch (error) {
      console.error('Error reading arena games:', error);
      return maxGames;
    }
  };

  // ===== STATE MANAGEMENT =====

  // Hátralévő játékok állapota
  const [remainingGames, setRemainingGames] = useState<number | 'unlimited'>('unlimited');

  // ===== EFFECTS =====

  // Hátralévő játékok frissítése előfizetési szint változásakor
  useEffect(() => {
    const loadRemainingGames = async () => {
      const games = await getRemainingGames();
      setRemainingGames(games);
    };

    loadRemainingGames();
  }, [subscriptionTier]);

  // ===== EVENT HANDLERS =====

  // Arena kártya klikk kezelése
  const handleArenaClick = () => {
    onArenaClick?.();
  };

  return (
    <View style={styles.container}>
      {/* KÜZDŐTÉR KÁRTYA */}
      <TouchableOpacity
        onPress={handleArenaClick}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#D97706', '#EA580C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.arenaCard}
        >
          {/* Overlay sötétítés */}
          <View style={styles.cardOverlay} />

          {/* Kártya tartalom */}
          <View style={styles.cardContent}>
            {/* Fejléc: Ikon + Cím */}
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="crown-outline"
                size={20}
                color="#FDE047"
              />
              <Text style={styles.cardTitle}>Küzdőtér</Text>
            </View>

            {/* Alsó info: Hátralévő játékok */}
            <View style={styles.cardInfo}>
              {remainingGames === 'unlimited' ? (
                <>
                  <MaterialCommunityIcons
                    name="infinity"
                    size={16}
                    color={COLORS.white}
                  />
                  <Text style={styles.infoText}>Korlátlan</Text>
                </>
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="crown-outline"
                    size={12}
                    color={COLORS.white}
                  />
                  <Text style={styles.infoText}>{remainingGames} játék</Text>
                </>
              )}
            </View>
          </View>

          {/* Karakter illusztráció */}
          <LinearGradient
            colors={['#3B82F6', '#9333EA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.arenaIllustration}
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* TEMPLOMOS KÁRTYA */}
      <View>
        <LinearGradient
          colors={['#2563EB', '#06B6D4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.templomosCard}
        >
          {/* Overlay sötétítés */}
          <View style={styles.cardOverlay} />

          {/* Kártya tartalom */}
          <View style={styles.cardContent}>
            {/* Cím */}
            <Text style={styles.cardTitle}>Templomos</Text>

            {/* Alsó info: Időzítő */}
            <View style={styles.cardInfo}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={12}
                color={COLORS.white}
              />
              <Text style={styles.infoText}>9h 6m</Text>
            </View>
          </View>

          {/* Sárkány illusztráció */}
          <LinearGradient
            colors={['#A855F7', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dragonIllustration}
          />
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Fő container (jobb felső sarok)
  container: {
    position: 'absolute',
    right: 8,
    top: 16,
    gap: SPACING.sm,
    zIndex: 10,
  },

  // Küzdőtér kártya
  arenaCard: {
    width: 140,
    height: 56,
    borderRadius: SIZES.radiusBase,
    borderWidth: 2,
    borderColor: '#FCD34D',
    overflow: 'hidden',
    ...SHADOWS.large,
  },

  // Templomos kártya
  templomosCard: {
    width: 140,
    height: 56,
    borderRadius: SIZES.radiusBase,
    borderWidth: 2,
    borderColor: '#22D3EE',
    overflow: 'hidden',
    ...SHADOWS.large,
  },

  // Kártya overlay (sötétítés)
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },

  // Kártya tartalom
  cardContent: {
    padding: SPACING.sm,
    height: '100%',
    justifyContent: 'space-between',
    zIndex: 1,
  },

  // Kártya fejléc sor (ikon + cím)
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Kártya cím
  cardTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.semibold,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Kártya alsó sor (info)
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // Info szöveg
  infoText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Karakter illusztráció (Küzdőtér)
  arenaIllustration: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderTopLeftRadius: SIZES.radiusFull,
  },

  // Sárkány illusztráció (Templomos)
  dragonIllustration: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderTopLeftRadius: SIZES.radiusFull,
  },
});
