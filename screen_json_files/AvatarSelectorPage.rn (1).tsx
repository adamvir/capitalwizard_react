/**
 * AvatarSelectorPage - REACT NATIVE VERSION (FIXED)
 * 
 * Avatar választó képernyő - 3 tier (Free, Pro, Master)
 * - Emoji alapú avatarok
 * - Lock/unlock alapján subscription tier
 * - AsyncStorage persistence
 * - 3-column grid layout (FIXED: aspect ratio + proper sizing)
 * - Selected badge (checkmark)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Crown, Lock, Sparkles } from 'lucide-react-native';

// NAVIGATION: React Navigation használata
// import { useNavigation } from '@react-navigation/native';

// ============================================
// CONSTANTS
// ============================================

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  white: '#FFFFFF',
  slate900: '#0F172A',
  slate700: '#334155',
  slate600: '#64748B',
  slate500: '#475569',
  slate300: '#CBD5E1',
  purple900: '#581C87',
  purple800: '#6B21A8',
  purple700: '#7E22CE',
  purple600: '#9333EA',
  purple500: '#A855F7',
  purple400: '#C084FC',
  purple200: '#E9D5FF',
  purple100: '#D8B4FE',
  pink500: '#EC4899',
  blue900: '#1E3A8A',
  blue800: '#1E40AF',
  blue700: '#1D4ED8',
  blue600: '#2563EB',
  blue500: '#3B82F6',
  blue400: '#60A5FA',
  blue300: '#93C5FD',
  blue200: '#BFDBFE',
  green500: '#10B981',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
};

const SIZES = {
  fontXS: 10,
  fontSM: 12,
  fontBase: 14,
  fontLG: 18,
  fontXL: 20,
  font4XL: 36,
  font5XL: 48,
  borderThin: 1,
  borderMedium: 2,
  borderThick: 4,
  radiusSM: 8,
  radiusLG: 12,
  radiusXL: 16,
  radiusFull: 9999,
  iconBase: 18,
  iconLG: 24,
};

const FONT_WEIGHT = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// ============================================
// TYPES
// ============================================

interface AvatarSelectorPageProps {
  onBack: () => void;
  subscriptionTier: 'free' | 'pro' | 'master';
}

interface Avatar {
  emoji: string;
  name: string;
  rarity: 'Közönséges' | 'Ritka' | 'Legendás';
  locked?: boolean;
}

// ============================================
// AVATAR DATA
// ============================================

const avatars = {
  free: [
    { emoji: '🧙‍♂️', name: 'Varázsló', rarity: 'Közönséges' as const },
    { emoji: '⚔️', name: 'Harcos', rarity: 'Közönséges' as const },
    { emoji: '🏹', name: 'Íjász', rarity: 'Közönséges' as const },
    { emoji: '🛡️', name: 'Védő', rarity: 'Közönséges' as const },
    { emoji: '🗡️', name: 'Lovag', rarity: 'Közönséges' as const },
    { emoji: '🎯', name: 'Célzó', rarity: 'Közönséges' as const },
  ],
  pro: [
    { emoji: '🐉', name: 'Sárkány', rarity: 'Ritka' as const, locked: true },
    { emoji: '🦅', name: 'Sas', rarity: 'Ritka' as const, locked: true },
    { emoji: '🦁', name: 'Oroszlán', rarity: 'Ritka' as const, locked: true },
    { emoji: '🔮', name: 'Látnok', rarity: 'Ritka' as const, locked: true },
    { emoji: '⚡', name: 'Villám', rarity: 'Ritka' as const, locked: true },
    { emoji: '🌟', name: 'Csillag', rarity: 'Ritka' as const, locked: true },
    { emoji: '🔥', name: 'Láng', rarity: 'Ritka' as const, locked: true },
    { emoji: '💎', name: 'Gyémánt', rarity: 'Ritka' as const, locked: true },
  ],
  master: [
    { emoji: '👑', name: 'Király', rarity: 'Legendás' as const, locked: true },
    { emoji: '🌌', name: 'Galaxis', rarity: 'Legendás' as const, locked: true },
    { emoji: '🦄', name: 'Egyszarvú', rarity: 'Legendás' as const, locked: true },
    { emoji: '🎭', name: 'Maszk', rarity: 'Legendás' as const, locked: true },
    { emoji: '🏆', name: 'Bajnok', rarity: 'Legendás' as const, locked: true },
    { emoji: '💫', name: 'Csillaghullás', rarity: 'Legendás' as const, locked: true },
  ],
};

// ============================================
// ASYNC STORAGE HELPERS
// ============================================

const AVATAR_STORAGE_KEY = 'player_avatar';

const loadAvatar = async (): Promise<string> => {
  try {
    const saved = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
    return saved || '🧙‍♂️';
  } catch (error) {
    console.error('Error loading avatar:', error);
    return '🧙‍♂️';
  }
};

const saveAvatar = async (emoji: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(AVATAR_STORAGE_KEY, emoji);
  } catch (error) {
    console.error('Error saving avatar:', error);
  }
};

// ============================================
// COMPONENT
// ============================================

export function AvatarSelectorPage({
  onBack,
  subscriptionTier,
}: AvatarSelectorPageProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🧙‍♂️');

  // NAVIGATION FIX - React Native:
  // const navigation = useNavigation();

  // ============================================
  // LOAD AVATAR ON MOUNT
  // ============================================

  useEffect(() => {
    loadAvatar().then(setSelectedAvatar);
  }, []);

  // ============================================
  // HELPERS
  // ============================================

  const isAvatarLocked = (avatar: Avatar): boolean => {
    if (!avatar.locked) return false;

    // Check if user has required subscription
    if (subscriptionTier === 'master') return false;
    if (subscriptionTier === 'pro' && avatar.rarity !== 'Legendás') return false;
    return true;
  };

  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case 'Közönséges':
        return {
          gradient: [COLORS.slate500, COLORS.slate700],
          border: COLORS.slate600,
          text: COLORS.slate300,
        };
      case 'Ritka':
        return {
          gradient: [COLORS.blue600, COLORS.blue700],
          border: COLORS.blue500,
          text: COLORS.blue300,
        };
      case 'Legendás':
        return {
          gradient: [COLORS.purple600, COLORS.pink500],
          border: COLORS.purple500,
          text: COLORS.purple100,
        };
      default:
        return {
          gradient: [COLORS.slate500, COLORS.slate700],
          border: COLORS.slate600,
          text: COLORS.slate300,
        };
    }
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleBack = () => {
    // NAVIGATION: navigation.goBack()
    if (onBack) {
      onBack();
    }
  };

  const handleSelectAvatar = (emoji: string, isLocked: boolean) => {
    if (!isLocked) {
      setSelectedAvatar(emoji);
      saveAvatar(emoji);
      // NOTE: In web version, this dispatches storage event
      // In RN, use EventEmitter or Context/Redux for global state updates
    }
  };

  // ============================================
  // CALCULATE CARD SIZE
  // ============================================
  
  // 3 columns: (screen width - padding - gaps) / 3
  const cardWidth = (SCREEN_WIDTH - SPACING.base * 2 - SPACING.md * 2) / 3;

  // ============================================
  // RENDER AVATAR BUTTON
  // ============================================

  const renderAvatarButton = (avatar: Avatar, index: number) => {
    const isLocked = isAvatarLocked(avatar);
    const isSelected = selectedAvatar === avatar.emoji;
    const colors = getRarityColors(avatar.rarity);

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleSelectAvatar(avatar.emoji, isLocked)}
        disabled={isLocked}
        activeOpacity={0.7}
        style={{ width: cardWidth }}
      >
        <LinearGradient
          colors={colors.gradient}
          style={[
            styles.avatarButton,
            { borderColor: colors.border },
            isLocked && styles.avatarButtonLocked,
            isSelected && styles.avatarButtonSelected,
          ]}
        >
          {/* Avatar Content */}
          <View style={styles.avatarContent}>
            {/* Emoji Container */}
            <View style={styles.avatarEmojiContainer}>
              <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
              {isLocked && (
                <View style={styles.avatarLockOverlay}>
                  <Lock size={SIZES.iconLG} color={COLORS.white} />
                </View>
              )}
            </View>
            
            {/* Name */}
            <Text style={styles.avatarName} numberOfLines={1}>
              {avatar.name}
            </Text>
            
            {/* Rarity */}
            <Text style={[styles.avatarRarity, { color: colors.text }]}>
              {avatar.rarity}
            </Text>
          </View>

          {/* Selected Badge */}
          {isSelected && !isLocked && (
            <View style={styles.selectedBadge}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <LinearGradient
      colors={[COLORS.slate900, COLORS.purple900, COLORS.slate900]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header */}
      <LinearGradient
        colors={[`${COLORS.purple700}e6`, `${COLORS.purple800}e6`]}
        style={styles.header}
      >
        {/* Header Top */}
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={SIZES.iconBase} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Sparkles size={SIZES.iconLG} color={COLORS.white} />
            <Text style={styles.headerTitle}>Avatar Választó</Text>
          </View>

          <View style={styles.spacer} />
        </View>

        {/* Current Avatar Display */}
        <View style={styles.currentAvatarSection}>
          <LinearGradient
            colors={[COLORS.purple600, COLORS.pink500]}
            style={styles.currentAvatarCircle}
          >
            <Text style={styles.currentAvatarEmoji}>{selectedAvatar}</Text>
          </LinearGradient>
          <Text style={styles.currentAvatarLabel}>Kiválasztott Avatar</Text>
        </View>
      </LinearGradient>

      {/* Avatar Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Free Avatars */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingyenes Avatarok</Text>
            <View
              style={[
                styles.sectionBadge,
                { backgroundColor: COLORS.slate700 },
              ]}
            >
              <Text style={[styles.sectionBadgeText, { color: COLORS.slate300 }]}>
                {avatars.free.length} db
              </Text>
            </View>
          </View>
          <View style={styles.avatarGrid}>
            {avatars.free.map((avatar, index) => renderAvatarButton(avatar, index))}
          </View>
        </View>

        {/* Pro Avatars */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pro Avatarok</Text>
            <Crown size={SIZES.iconBase} color={COLORS.blue400} />
            <View
              style={[
                styles.sectionBadge,
                { backgroundColor: `${COLORS.blue700}80` },
              ]}
            >
              <Text style={[styles.sectionBadgeText, { color: COLORS.blue300 }]}>
                {avatars.pro.length} db
              </Text>
            </View>
          </View>
          <View style={styles.avatarGrid}>
            {avatars.pro.map((avatar, index) => renderAvatarButton(avatar, index))}
          </View>
        </View>

        {/* Master Avatars */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Master Avatarok</Text>
            <Crown size={SIZES.iconBase} color={COLORS.purple400} />
            <View
              style={[
                styles.sectionBadge,
                { backgroundColor: `${COLORS.purple700}80` },
              ]}
            >
              <Text style={[styles.sectionBadgeText, { color: COLORS.purple100 }]}>
                {avatars.master.length} db
              </Text>
            </View>
          </View>
          <View style={styles.avatarGrid}>
            {avatars.master.map((avatar, index) => renderAvatarButton(avatar, index))}
          </View>
        </View>

        {/* Info Card */}
        <LinearGradient
          colors={[`${COLORS.blue800}66`, `${COLORS.blue900}66`]}
          style={styles.infoCard}
        >
          <View style={styles.infoCardContent}>
            <Sparkles
              size={SIZES.iconBase}
              color={COLORS.blue400}
              style={{ marginTop: 2 }}
            />
            <View style={styles.infoCardTextContainer}>
              <Text style={styles.infoCardTitle}>Avatar Tier-ek</Text>
              <View style={styles.infoCardList}>
                <View style={styles.infoCardItem}>
                  <View
                    style={[
                      styles.tierDot,
                      { backgroundColor: COLORS.slate500 },
                    ]}
                  />
                  <Text style={styles.infoCardItemText}>
                    Közönséges - Mindenki számára elérhető
                  </Text>
                </View>
                <View style={styles.infoCardItem}>
                  <View
                    style={[
                      styles.tierDot,
                      { backgroundColor: COLORS.blue600 },
                    ]}
                  />
                  <Text style={styles.infoCardItemText}>
                    Ritka - Pro előfizetés szükséges
                  </Text>
                </View>
                <View style={styles.infoCardItem}>
                  <View
                    style={[
                      styles.tierDot,
                      { backgroundColor: COLORS.purple600 },
                    ]}
                  />
                  <Text style={styles.infoCardItemText}>
                    Legendás - Master előfizetés szükséges
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
    borderBottomWidth: SIZES.borderMedium,
    borderBottomColor: COLORS.purple500,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: `${COLORS.purple600}99`,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    fontSize: SIZES.fontXL,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },
  spacer: {
    width: 40,
    height: 40,
  },

  // Current Avatar Display
  currentAvatarSection: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  currentAvatarCircle: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: SIZES.borderThick,
    borderColor: COLORS.purple800,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  currentAvatarEmoji: {
    fontSize: SIZES.font5XL,
  },
  currentAvatarLabel: {
    fontSize: SIZES.fontSM,
    color: COLORS.purple200,
  },

  // Avatar Grid Container
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    padding: SPACING.base,
    paddingBottom: 100,
  },

  // Section
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontLG,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },
  sectionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSM,
  },
  sectionBadgeText: {
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.medium,
  },

  // Avatar Grid
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },

  // Avatar Button (FIXED: minHeight + proper aspect ratio)
  avatarButton: {
    aspectRatio: 1, // IMPORTANT: Makes it square
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: SIZES.borderMedium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
    justifyContent: 'center',
  },
  avatarButtonLocked: {
    opacity: 0.5,
  },
  avatarButtonSelected: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  avatarContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  
  // Emoji Container
  avatarEmojiContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  avatarLockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: SIZES.radiusSM,
  },
  
  // Name & Rarity
  avatarName: {
    fontSize: SIZES.fontXS,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: FONT_WEIGHT.semibold,
  },
  avatarRarity: {
    fontSize: 9,
    fontWeight: FONT_WEIGHT.medium,
    textAlign: 'center',
  },
  
  // Selected Badge
  selectedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: COLORS.green500,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: SIZES.borderMedium,
    borderColor: COLORS.white,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.bold,
  },

  // Info Card
  infoCard: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.blue500}4d`,
    marginTop: SPACING.lg,
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  infoCardTextContainer: {
    flex: 1,
  },
  infoCardTitle: {
    color: COLORS.white,
    marginBottom: 4,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.semibold,
  },
  infoCardList: {
    gap: 4,
  },
  infoCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoCardItemText: {
    fontSize: SIZES.fontSM,
    color: COLORS.blue200,
    flex: 1,
  },
  tierDot: {
    width: 12,
    height: 12,
    borderRadius: SIZES.radiusFull,
  },
});
