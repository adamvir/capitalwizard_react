import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { storage } from '../utils/storage';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface AvatarSelectorScreenProps {
  navigation: any;
  route?: {
    params?: {
      subscriptionTier?: 'free' | 'pro' | 'master';
    };
  };
}

const avatars = {
  free: [
    { emoji: '🧙‍♂️', name: 'Varázsló', rarity: 'Közönséges' },
    { emoji: '⚔️', name: 'Harcos', rarity: 'Közönséges' },
    { emoji: '🏹', name: 'Íjász', rarity: 'Közönséges' },
    { emoji: '🛡️', name: 'Védő', rarity: 'Közönséges' },
    { emoji: '🗡️', name: 'Lovag', rarity: 'Közönséges' },
    { emoji: '🎯', name: 'Célzó', rarity: 'Közönséges' },
  ],
  pro: [
    { emoji: '🐉', name: 'Sárkány', rarity: 'Ritka', locked: true },
    { emoji: '🦅', name: 'Sas', rarity: 'Ritka', locked: true },
    { emoji: '🦁', name: 'Oroszlán', rarity: 'Ritka', locked: true },
    { emoji: '🔮', name: 'Látnok', rarity: 'Ritka', locked: true },
    { emoji: '⚡', name: 'Villám', rarity: 'Ritka', locked: true },
    { emoji: '🌟', name: 'Csillag', rarity: 'Ritka', locked: true },
  ],
  master: [
    { emoji: '👑', name: 'Király', rarity: 'Legendás', locked: true },
    { emoji: '🌌', name: 'Galaxis', rarity: 'Legendás', locked: true },
    { emoji: '🦄', name: 'Egyszarvú', rarity: 'Legendás', locked: true },
    { emoji: '🎭', name: 'Maszk', rarity: 'Legendás', locked: true },
    { emoji: '🏆', name: 'Bajnok', rarity: 'Legendás', locked: true },
    { emoji: '💫', name: 'Csillaghullás', rarity: 'Legendás', locked: true },
  ],
};

export default function AvatarSelectorScreen({ navigation, route }: AvatarSelectorScreenProps) {
  const subscriptionTier = route?.params?.subscriptionTier || 'free';
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🧙‍♂️');

  // Load current avatar from storage
  useEffect(() => {
    loadCurrentAvatar();
  }, []);

  const loadCurrentAvatar = async () => {
    try {
      const saved = await storage.getItem<string>('player_avatar');
      if (saved) {
        setSelectedAvatar(saved);
      }
    } catch (error) {
      console.error('Error loading avatar:', error);
    }
  };

  const saveAvatar = async () => {
    try {
      await storage.setItem('player_avatar', selectedAvatar);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  };

  const isAvatarLocked = (avatar: any) => {
    if (!avatar.locked) return false;
    if (subscriptionTier === 'master') return false;
    if (subscriptionTier === 'pro' && avatar.rarity !== 'Legendás') return false;
    return true;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Közönséges':
        return { bg: '#475569', border: '#64748B', text: '#CBD5E1' };
      case 'Ritka':
        return { bg: '#2563EB', border: '#3B82F6', text: '#93C5FD' };
      case 'Legendás':
        return { bg: '#9333EA', border: '#A855F7', text: '#D8B4FE' };
      default:
        return { bg: '#475569', border: '#64748B', text: '#CBD5E1' };
    }
  };

  const handleSelectAvatar = (emoji: string, isLocked: boolean) => {
    if (!isLocked) {
      setSelectedAvatar(emoji);
    }
  };

  const renderAvatarSection = (title: string, avatarList: any[], tierIcon?: string, tierColor?: string) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {tierIcon && tierColor && (
          <MaterialCommunityIcons name={tierIcon as any} size={SIZES.iconBase} color={tierColor} />
        )}
        <View style={[styles.sectionBadge, tierColor && { backgroundColor: tierColor + '40' }]}>
          <Text style={[styles.sectionBadgeText, tierColor && { color: tierColor }]}>
            {avatarList.length} db
          </Text>
        </View>
      </View>
      <View style={styles.avatarGrid}>
        {avatarList.map((avatar, index) => {
          const isLocked = isAvatarLocked(avatar);
          const isSelected = selectedAvatar === avatar.emoji;
          const colors = getRarityColor(avatar.rarity);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectAvatar(avatar.emoji, isLocked)}
              disabled={isLocked}
              style={[
                styles.avatarCard,
                { backgroundColor: colors.bg, borderColor: colors.border },
                isSelected && styles.avatarCardSelected,
                isLocked && styles.avatarCardLocked,
              ]}
            >
              <View style={styles.avatarContent}>
                <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                {isLocked && (
                  <View style={styles.lockOverlay}>
                    <MaterialCommunityIcons name="lock" size={SIZES.iconLG} color={COLORS.white} />
                  </View>
                )}
                <Text style={styles.avatarName}>{avatar.name}</Text>
                <Text style={[styles.avatarRarity, { color: colors.text }]}>{avatar.rarity}</Text>
              </View>
              {isSelected && !isLocked && (
                <View style={styles.selectedBadge}>
                  <MaterialCommunityIcons name="check" size={12} color={COLORS.white} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#581C87', '#0F172A']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient colors={['rgba(126, 34, 206, 0.9)', 'rgba(107, 33, 168, 0.9)']} style={styles.headerGradient}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={SIZES.iconBase} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <MaterialCommunityIcons name="emoticon" size={SIZES.iconLG} color={COLORS.white} />
              <Text style={styles.headerTitle}>Avatar Választó</Text>
            </View>
            <TouchableOpacity onPress={saveAvatar} style={styles.saveButton}>
              <MaterialCommunityIcons name="check" size={SIZES.iconBase} color={COLORS.white} />
            </TouchableOpacity>
          </LinearGradient>

          {/* Current Avatar Display */}
          <View style={styles.currentAvatarSection}>
            <LinearGradient colors={['#9333EA', '#EC4899']} style={styles.currentAvatarCircle}>
              <Text style={styles.currentAvatarEmoji}>{selectedAvatar}</Text>
            </LinearGradient>
            <Text style={styles.currentAvatarLabel}>Kiválasztott Avatar</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderAvatarSection('Ingyenes Avatarok', avatars.free)}
          {renderAvatarSection('Pro Avatarok', avatars.pro, 'crown', '#60A5FA')}
          {renderAvatarSection('Master Avatarok', avatars.master, 'crown', '#C084FC')}

          {/* Info Card */}
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="information" size={SIZES.iconBase} color="#60A5FA" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Avatar Tier-ek</Text>
              <View style={styles.infoList}>
                <View style={styles.infoItem}>
                  <View style={[styles.tierDot, { backgroundColor: '#475569' }]} />
                  <Text style={styles.infoText}>Közönséges - Mindenki számára elérhető</Text>
                </View>
                <View style={styles.infoItem}>
                  <View style={[styles.tierDot, { backgroundColor: '#2563EB' }]} />
                  <Text style={styles.infoText}>Ritka - Pro előfizetés szükséges</Text>
                </View>
                <View style={styles.infoItem}>
                  <View style={[styles.tierDot, { backgroundColor: '#9333EA' }]} />
                  <Text style={styles.infoText}>Legendás - Master előfizetés szükséges</Text>
                </View>
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
  header: { marginTop: 48 },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    borderBottomWidth: 2,
    borderBottomColor: '#A855F7',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(147, 51, 234, 0.6)',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  headerTitle: { fontSize: SIZES.fontXL, color: COLORS.white, fontWeight: 'bold' },
  currentAvatarSection: {
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.base,
  },
  currentAvatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#6B21A8',
  },
  currentAvatarEmoji: { fontSize: SIZES.font5XL },
  currentAvatarLabel: { fontSize: SIZES.fontSM, color: '#E9D5FF' },
  scrollView: { flex: 1, paddingHorizontal: SPACING.base },
  section: { marginBottom: SPACING.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  sectionTitle: { fontSize: SIZES.fontLG, color: COLORS.white, fontWeight: 'bold' },
  sectionBadge: {
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSM,
  },
  sectionBadgeText: { fontSize: SIZES.fontXS, color: '#CBD5E1' },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  avatarCard: {
    width: '30%',
    aspectRatio: 0.85,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCardSelected: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarCardLocked: { opacity: 0.5 },
  avatarContent: { alignItems: 'center', gap: SPACING.xs, position: 'relative' },
  avatarEmoji: { fontSize: SIZES.font4XL },
  lockOverlay: {
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
  avatarName: { fontSize: SIZES.fontXS, color: COLORS.white, textAlign: 'center' },
  avatarRarity: { fontSize: 10 },
  selectedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: '#10B981',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  infoCard: {
    flexDirection: 'row',
    gap: SPACING.md,
    backgroundColor: 'rgba(30, 64, 175, 0.4)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginBottom: SPACING.xl,
  },
  infoTextContainer: { flex: 1 },
  infoTitle: { fontSize: SIZES.fontBase, color: COLORS.white, fontWeight: 'bold', marginBottom: 4 },
  infoList: { gap: 4 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  tierDot: { width: 12, height: 12, borderRadius: 6 },
  infoText: { fontSize: SIZES.fontSM, color: '#BFDBFE' },
});
