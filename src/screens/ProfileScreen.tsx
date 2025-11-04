/**
 * ProfileScreen - REACT NATIVE VERSION
 *
 * Profil képernyő - Statisztikák és személyes adatok
 * - View/Edit mód
 * - Level & XP progress bar
 * - Resources (Coins, Gems)
 * - Subscription tier badge
 * - Personal data fields (Name, Email, BirthDate, Location, Bio)
 * - AsyncStorage persistence
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  MapPin,
  Edit2,
  Save,
  X,
  Crown,
  Coins,
  Gem,
  TrendingUp,
  AtSign,
} from 'lucide-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { usePlayer } from '../hooks';
import { useCallback } from 'react';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748B',
  slate400: '#94A3B8',
  slate300: '#CBD5E1',
  blue900: '#1E3A8A',
  blue800: '#1E40AF',
  blue700: '#1D4ED8',
  blue600: '#2563EB',
  blue500: '#3B82F6',
  blue400: '#60A5FA',
  blue300: '#93C5FD',
  cyan500: '#06B6D4',
  cyan300: '#67E8F9',
  amber500: '#F59E0B',
  amber300: '#FCD34D',
  green600: '#16A34A',
  green700: '#15803D',
  green800: '#14532D',
  red600: '#DC2626',
  red700: '#B91C1C',
  purple500: '#A855F7',
  pink500: '#EC4899',
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
  fontXS: 10,
  fontSM: 12,
  fontBase: 14,
  fontLG: 18,
  fontXL: 20,
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
};

// ============================================
// TYPES
// ============================================

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

interface UserProfile {
  name: string;
  email: string;
  birthDate: string;
  location: string;
  bio: string;
}

// ============================================
// DEFAULT PROFILE
// ============================================

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  birthDate: '',
  location: '',
  bio: '',
};

// ============================================
// ASYNC STORAGE HELPERS
// ============================================

const PROFILE_STORAGE_KEY = 'user_profile';

const loadProfile = async (): Promise<UserProfile> => {
  try {
    const saved = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
  return DEFAULT_PROFILE;
};

const saveProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

// ============================================
// COMPONENT
// ============================================

export default function ProfileScreen({ navigation, route }: ProfileScreenProps) {
  // Supabase integration
  const { player, loading: playerLoading, updatePlayerData, refreshPlayer } = usePlayer();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Felhasználónév state (Supabase-ből)
  const [username, setUsername] = useState<string>('');
  const [editedUsername, setEditedUsername] = useState<string>('');

  // Refresh player data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 ProfileScreen focused - refreshing player data...');
      if (refreshPlayer) {
        refreshPlayer();
      }
    }, [refreshPlayer])
  );

  // ============================================
  // LOAD PROFILE ON MOUNT
  // ============================================

  useEffect(() => {
    loadProfile().then((loadedProfile) => {
      setProfile(loadedProfile);
      setEditedProfile(loadedProfile);
    });
  }, []);

  // ============================================
  // LOAD USERNAME FROM SUPABASE
  // ============================================

  useEffect(() => {
    if (player?.username) {
      setUsername(player.username);
      setEditedUsername(player.username);
    }
  }, [player?.username]);

  // ============================================
  // SAVE PROFILE WHEN CHANGED
  // ============================================

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    setProfile(editedProfile);

    // ✅ Save username to Supabase if provided
    if (editedUsername && updatePlayerData) {
      try {
        console.log('💾 Saving username to Supabase:', editedUsername);
        await updatePlayerData({ username: editedUsername });
        setUsername(editedUsername);
        console.log('✅ Username saved to Supabase successfully');
      } catch (error) {
        console.error('❌ Error saving username to Supabase:', error);
      }
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setEditedUsername(username);
    setIsEditing(false);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  // ============================================
  // XP CALCULATION (from Supabase)
  // ============================================

  const playerLevel = player?.level || 1;
  const currentXp = player?.xp || 0;
  const coins = player?.coins || 0;
  const gems = player?.diamonds || 0;
  const subscriptionTier = player?.subscription_type || 'free';

  const xpForCurrentLevel = playerLevel * 1000;
  const xpProgress = Math.min((currentXp / xpForCurrentLevel) * 100, 100);

  // ============================================
  // TIER COLORS
  // ============================================

  const getTierColors = (tier: string) => {
    switch (tier) {
      case 'master':
        return {
          gradient: [COLORS.purple500, COLORS.pink500],
          textColor: COLORS.white,
        };
      case 'pro':
        return {
          gradient: [COLORS.blue500, COLORS.cyan500],
          textColor: COLORS.white,
        };
      default:
        return {
          gradient: [COLORS.slate700, COLORS.slate700],
          textColor: COLORS.slate300,
        };
    }
  };

  const tierColors = getTierColors(subscriptionTier);

  // ============================================
  // LOADING STATE
  // ============================================

  if (playerLoading) {
    return (
      <View style={[styles.outerContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.blue500} />
        <Text style={styles.loadingText}>Betöltés...</Text>
      </View>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" translucent={false} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={[COLORS.slate900, COLORS.blue900, COLORS.slate900]}
          style={styles.gradient}
        >
          {/* Top Spacer for iPhone notch */}
          <View style={styles.topSpacer} />

          {/* Header */}
          <LinearGradient
            colors={[`${COLORS.blue700}e6`, `${COLORS.blue800}e6`]}
            style={styles.header}
          >
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={SIZES.iconBase} color={COLORS.white} />
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <User size={SIZES.iconLG} color={COLORS.white} />
              <Text style={styles.headerTitle}>Diák Profil</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.editButton,
                { backgroundColor: isEditing ? COLORS.green600 : `${COLORS.blue600}99` },
              ]}
              onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? (
                <Save size={SIZES.iconBase} color={COLORS.white} />
              ) : (
                <Edit2 size={SIZES.iconBase} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </LinearGradient>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
          >
            {/* Stats Card */}
            <LinearGradient
              colors={[`${COLORS.blue800}66`, `${COLORS.blue900}66`]}
              style={styles.statsCard}
            >
              {/* Stats Header */}
              <View style={styles.statsHeader}>
                <Text style={styles.statsTitle}>Statisztikák</Text>
                <LinearGradient
                  colors={tierColors.gradient as [string, string]}
                  style={styles.tierBadge}
                >
                  {(subscriptionTier === 'master' || subscriptionTier === 'pro') && (
                    <Crown size={SIZES.iconSM} color={COLORS.white} />
                  )}
                  <Text
                    style={[
                      styles.tierBadgeText,
                      { color: tierColors.textColor },
                    ]}
                  >
                    {subscriptionTier === 'master'
                      ? 'Master'
                      : subscriptionTier === 'pro'
                      ? 'Pro'
                      : 'Free'}
                  </Text>
                </LinearGradient>
              </View>

              {/* Level Progress */}
              <View style={styles.levelContainer}>
                <View style={styles.levelHeader}>
                  <View style={styles.levelInfo}>
                    <TrendingUp size={SIZES.iconBase} color={COLORS.blue400} />
                    <Text style={styles.levelText}>Szint {playerLevel}</Text>
                  </View>
                  <Text style={styles.xpText}>
                    {currentXp} / {xpForCurrentLevel} XP
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={[COLORS.blue500, COLORS.cyan500]}
                    style={[styles.progressFill, { width: `${xpProgress}%` }]}
                  />
                </View>
              </View>

              {/* Resources */}
              <View style={styles.resourcesGrid}>
                {/* Coins */}
                <View style={styles.resourceCard}>
                  <View
                    style={[
                      styles.resourceIcon,
                      { backgroundColor: COLORS.amber500 },
                    ]}
                  >
                    <Coins size={SIZES.iconLG} color={COLORS.white} />
                  </View>
                  <View>
                    <Text style={styles.resourceLabel}>Arany</Text>
                    <Text
                      style={[
                        styles.resourceValue,
                        { color: COLORS.amber300 },
                      ]}
                    >
                      {coins}
                    </Text>
                  </View>
                </View>

                {/* Gems */}
                <View style={styles.resourceCard}>
                  <View
                    style={[
                      styles.resourceIcon,
                      { backgroundColor: COLORS.cyan500 },
                    ]}
                  >
                    <Gem size={SIZES.iconLG} color={COLORS.white} />
                  </View>
                  <View>
                    <Text style={styles.resourceLabel}>Gyémánt</Text>
                    <Text
                      style={[
                        styles.resourceValue,
                        { color: COLORS.cyan300 },
                      ]}
                    >
                      {gems}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>

            {/* Profile Info Card */}
            <LinearGradient
              colors={[`${COLORS.blue800}66`, `${COLORS.blue900}66`]}
              style={styles.profileCard}
            >
              {/* Profile Header */}
              <View style={styles.profileHeader}>
                <Text style={styles.statsTitle}>Személyes Adatok</Text>
                {isEditing && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                  >
                    <X size={SIZES.iconSM} color={COLORS.white} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Fields */}
              <View style={styles.fieldsContainer}>
                {/* Name */}
                <View>
                  <View style={styles.fieldLabel}>
                    <User size={SIZES.iconSM} color={COLORS.blue300} />
                    <Text style={styles.fieldLabelText}>Név</Text>
                  </View>
                  {isEditing ? (
                    <TextInput
                      value={editedProfile.name}
                      onChangeText={(text) => handleChange('name', text)}
                      style={styles.input}
                      placeholder="Teljes név"
                      placeholderTextColor={COLORS.slate500}
                    />
                  ) : (
                    <View style={styles.displayValue}>
                      <Text
                        style={[
                          styles.displayValueText,
                          !profile.name && styles.placeholder,
                        ]}
                      >
                        {profile.name || 'Nem megadva'}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Username (Supabase) */}
                <View>
                  <View style={styles.fieldLabel}>
                    <AtSign size={SIZES.iconSM} color={COLORS.blue300} />
                    <Text style={styles.fieldLabelText}>Felhasználónév</Text>
                  </View>
                  {isEditing ? (
                    <TextInput
                      value={editedUsername}
                      onChangeText={(text) => setEditedUsername(text)}
                      style={styles.input}
                      placeholder="felhasznalonev123"
                      placeholderTextColor={COLORS.slate500}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  ) : (
                    <View style={styles.displayValue}>
                      <Text
                        style={[
                          styles.displayValueText,
                          !username && styles.placeholder,
                        ]}
                      >
                        {username || 'Nem megadva'}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Email */}
                <View>
                  <View style={styles.fieldLabel}>
                    <Mail size={SIZES.iconSM} color={COLORS.blue300} />
                    <Text style={styles.fieldLabelText}>Email</Text>
                  </View>
                  {isEditing ? (
                    <TextInput
                      value={editedProfile.email}
                      onChangeText={(text) => handleChange('email', text)}
                      style={styles.input}
                      placeholder="email@example.com"
                      placeholderTextColor={COLORS.slate500}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  ) : (
                    <View style={styles.displayValue}>
                      <Text
                        style={[
                          styles.displayValueText,
                          !profile.email && styles.placeholder,
                        ]}
                      >
                        {profile.email || 'Nem megadva'}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Birth Date */}
                <View>
                  <View style={styles.fieldLabel}>
                    <Calendar size={SIZES.iconSM} color={COLORS.blue300} />
                    <Text style={styles.fieldLabelText}>Születési dátum</Text>
                  </View>
                  {isEditing ? (
                    <TextInput
                      value={editedProfile.birthDate}
                      onChangeText={(text) => handleChange('birthDate', text)}
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={COLORS.slate500}
                    />
                  ) : (
                    <View style={styles.displayValue}>
                      <Text
                        style={[
                          styles.displayValueText,
                          !profile.birthDate && styles.placeholder,
                        ]}
                      >
                        {profile.birthDate || 'Nem megadva'}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Location */}
                <View>
                  <View style={styles.fieldLabel}>
                    <MapPin size={SIZES.iconSM} color={COLORS.blue300} />
                    <Text style={styles.fieldLabelText}>Helyszín</Text>
                  </View>
                  {isEditing ? (
                    <TextInput
                      value={editedProfile.location}
                      onChangeText={(text) => handleChange('location', text)}
                      style={styles.input}
                      placeholder="Város, Ország"
                      placeholderTextColor={COLORS.slate500}
                    />
                  ) : (
                    <View style={styles.displayValue}>
                      <Text
                        style={[
                          styles.displayValueText,
                          !profile.location && styles.placeholder,
                        ]}
                      >
                        {profile.location || 'Nem megadva'}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Bio */}
                <View>
                  <Text style={styles.fieldLabelText}>Bemutatkozás</Text>
                  {isEditing ? (
                    <TextInput
                      value={editedProfile.bio}
                      onChangeText={(text) => handleChange('bio', text)}
                      style={styles.textarea}
                      placeholder="Írj magadról..."
                      placeholderTextColor={COLORS.slate500}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  ) : (
                    <View style={styles.textareaDisplay}>
                      <Text
                        style={[
                          styles.displayValueText,
                          !profile.bio && styles.placeholder,
                        ]}
                      >
                        {profile.bio || 'Nem megadva'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </LinearGradient>

            {/* Save Button (mobile friendly) */}
            {isEditing && (
              <LinearGradient
                colors={[COLORS.green600, COLORS.green700]}
                style={styles.saveButton}
              >
                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.saveButtonInner}
                >
                  <Save size={SIZES.iconBase} color={COLORS.white} />
                  <Text style={styles.saveButtonText}>Változások mentése</Text>
                </TouchableOpacity>
              </LinearGradient>
            )}
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.slate900,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.base,
    color: COLORS.slate400,
    fontSize: SIZES.fontBase,
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  topSpacer: {
    height: 48,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.blue500,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: `${COLORS.blue600}99`,
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.base,
    gap: SPACING.base,
  },

  // Stats Card
  statsCard: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.blue500}4d`,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  statsTitle: {
    fontSize: SIZES.fontLG,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusFull,
  },
  tierBadgeText: {
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Level Progress
  levelContainer: {
    marginBottom: SPACING.base,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  levelText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.medium,
  },
  xpText: {
    fontSize: SIZES.fontSM,
    color: COLORS.blue300,
  },
  progressBar: {
    width: '100%',
    backgroundColor: COLORS.slate700,
    borderRadius: SIZES.radiusFull,
    height: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },

  // Resources Grid
  resourcesGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  resourceCard: {
    flex: 1,
    backgroundColor: `${COLORS.slate800}80`,
    borderRadius: SIZES.radiusLG,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceLabel: {
    fontSize: SIZES.fontXS,
    color: COLORS.slate400,
  },
  resourceValue: {
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.bold,
  },

  // Profile Info Card
  profileCard: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.blue500}4d`,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  cancelButton: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.red600,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Form Fields
  fieldsContainer: {
    gap: SPACING.md,
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  fieldLabelText: {
    fontSize: SIZES.fontSM,
    color: COLORS.blue300,
  },
  input: {
    width: '100%',
    backgroundColor: `${COLORS.slate800}80`,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.blue500}4d`,
    borderRadius: SIZES.radiusLG,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.white,
    fontSize: SIZES.fontBase,
  },
  displayValue: {
    backgroundColor: `${COLORS.slate800}80`,
    borderRadius: SIZES.radiusLG,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  displayValueText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
  },
  placeholder: {
    color: COLORS.slate500,
  },
  textarea: {
    width: '100%',
    backgroundColor: `${COLORS.slate800}80`,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.blue500}4d`,
    borderRadius: SIZES.radiusLG,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    minHeight: 80,
  },
  textareaDisplay: {
    backgroundColor: `${COLORS.slate800}80`,
    borderRadius: SIZES.radiusLG,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 80,
  },

  // Save Button
  saveButton: {
    borderRadius: SIZES.radiusXL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  saveButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
