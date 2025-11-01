import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface ProfileScreenProps {
  navigation: any;
  route: {
    params: {
      playerLevel: number;
      coins: number;
      gems?: number;
      subscriptionTier?: 'free' | 'pro' | 'master';
    };
  };
}

interface UserProfile {
  name: string;
  email: string;
  birthDate: string;
  location: string;
  bio: string;
}

const DEFAULT_PROFILE: UserProfile = { name: '', email: '', birthDate: '', location: '', bio: '' };

export default function ProfileScreen({ navigation, route }: ProfileScreenProps) {
  const { playerLevel, coins, gems = 0, subscriptionTier = 'free' } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem('user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        setEditedProfile(parsed);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('user_profile', JSON.stringify(editedProfile));
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const xpForCurrentLevel = playerLevel * 1000;
  const currentXp = 650;
  const xpProgress = (currentXp / xpForCurrentLevel) * 100;

  const getTierColor = () => {
    if (subscriptionTier === 'master') return ['#A855F7', '#EC4899'];
    if (subscriptionTier === 'pro') return ['#3B82F6', '#06B6D4'];
    return ['#334155', '#334155'];
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', '#1E3A8A', '#0F172A']} style={styles.gradient}>
        <View style={styles.header}>
          <LinearGradient colors={['rgba(29, 78, 216, 0.9)', 'rgba(30, 64, 175, 0.9)']} style={styles.headerGradient}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={SIZES.iconBase} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.headerTitle}>
              <MaterialCommunityIcons name="account" size={SIZES.iconLG} color={COLORS.white} />
              <Text style={styles.headerTitleText}>Diák Profil</Text>
            </View>
            <TouchableOpacity onPress={() => isEditing ? saveProfile() : setIsEditing(true)} style={[styles.editButton, isEditing && styles.editButtonActive]}>
              <MaterialCommunityIcons name={isEditing ? 'content-save' : 'pencil'} size={SIZES.iconBase} color={COLORS.white} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statsCard}>
            <LinearGradient colors={['rgba(30, 64, 175, 0.4)', 'rgba(30, 58, 138, 0.4)']} style={styles.cardGradient}>
              <View style={styles.statsHeader}>
                <Text style={styles.statsTitle}>Statisztikák</Text>
                <LinearGradient colors={getTierColor()} style={styles.tierBadge}>
                  {(subscriptionTier === 'master' || subscriptionTier === 'pro') && (<MaterialCommunityIcons name="crown" size={SIZES.iconSM} color={COLORS.white} />)}
                  <Text style={styles.tierBadgeText}>{subscriptionTier === 'master' ? 'Master' : subscriptionTier === 'pro' ? 'Pro' : 'Free'}</Text>
                </LinearGradient>
              </View>

              <View style={styles.levelContainer}>
                <View style={styles.levelHeader}>
                  <View style={styles.levelInfo}>
                    <MaterialCommunityIcons name="trending-up" size={SIZES.iconBase} color="#60A5FA" />
                    <Text style={styles.levelText}>Szint {playerLevel}</Text>
                  </View>
                  <Text style={styles.xpText}>{currentXp} / {xpForCurrentLevel} XP</Text>
                </View>
                <View style={styles.progressBar}>
                  <LinearGradient colors={['#3B82F6', '#06B6D4']} style={[styles.progressFill, { width: `${xpProgress}%` }]} />
                </View>
              </View>

              <View style={styles.resourcesGrid}>
                <View style={styles.resourceCard}>
                  <View style={[styles.resourceIcon, { backgroundColor: '#F59E0B' }]}>
                    <MaterialCommunityIcons name="coin" size={SIZES.iconLG} color={COLORS.white} />
                  </View>
                  <View>
                    <Text style={styles.resourceLabel}>Arany</Text>
                    <Text style={[styles.resourceValue, { color: '#FCD34D' }]}>{coins}</Text>
                  </View>
                </View>
                <View style={styles.resourceCard}>
                  <View style={[styles.resourceIcon, { backgroundColor: '#06B6D4' }]}>
                    <MaterialCommunityIcons name="diamond-stone" size={SIZES.iconLG} color={COLORS.white} />
                  </View>
                  <View>
                    <Text style={styles.resourceLabel}>Gyémánt</Text>
                    <Text style={[styles.resourceValue, { color: '#67E8F9' }]}>{gems}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.profileCard}>
            <LinearGradient colors={['rgba(30, 64, 175, 0.4)', 'rgba(30, 58, 138, 0.4)']} style={styles.cardGradient}>
              <View style={styles.profileHeader}>
                <Text style={styles.statsTitle}>Személyes Adatok</Text>
                {isEditing && (<TouchableOpacity onPress={handleCancel} style={styles.cancelButton}><MaterialCommunityIcons name="close" size={SIZES.iconSM} color={COLORS.white} /></TouchableOpacity>)}
              </View>

              <View style={styles.fieldsContainer}>
                <View>
                  <View style={styles.fieldLabel}>
                    <MaterialCommunityIcons name="account" size={SIZES.iconSM} color="#93C5FD" />
                    <Text style={styles.fieldLabelText}>Név</Text>
                  </View>
                  {isEditing ? (<TextInput value={editedProfile.name} onChangeText={(text) => handleChange('name', text)} style={styles.input} placeholder="Teljes név" placeholderTextColor="#64748B" />) : (<View style={styles.displayValue}><Text style={styles.displayValueText}>{profile.name || <Text style={styles.placeholder}>Nem megadva</Text>}</Text></View>)}
                </View>

                <View>
                  <View style={styles.fieldLabel}>
                    <MaterialCommunityIcons name="email" size={SIZES.iconSM} color="#93C5FD" />
                    <Text style={styles.fieldLabelText}>Email</Text>
                  </View>
                  {isEditing ? (<TextInput value={editedProfile.email} onChangeText={(text) => handleChange('email', text)} style={styles.input} placeholder="email@example.com" placeholderTextColor="#64748B" keyboardType="email-address" autoCapitalize="none" />) : (<View style={styles.displayValue}><Text style={styles.displayValueText}>{profile.email || <Text style={styles.placeholder}>Nem megadva</Text>}</Text></View>)}
                </View>

                <View>
                  <View style={styles.fieldLabel}>
                    <MaterialCommunityIcons name="calendar" size={SIZES.iconSM} color="#93C5FD" />
                    <Text style={styles.fieldLabelText}>Születési dátum</Text>
                  </View>
                  {isEditing ? (<TextInput value={editedProfile.birthDate} onChangeText={(text) => handleChange('birthDate', text)} style={styles.input} placeholder="ÉÉÉÉ-HH-NN" placeholderTextColor="#64748B" />) : (<View style={styles.displayValue}><Text style={styles.displayValueText}>{profile.birthDate || <Text style={styles.placeholder}>Nem megadva</Text>}</Text></View>)}
                </View>

                <View>
                  <View style={styles.fieldLabel}>
                    <MaterialCommunityIcons name="map-marker" size={SIZES.iconSM} color="#93C5FD" />
                    <Text style={styles.fieldLabelText}>Helyszín</Text>
                  </View>
                  {isEditing ? (<TextInput value={editedProfile.location} onChangeText={(text) => handleChange('location', text)} style={styles.input} placeholder="Város, Ország" placeholderTextColor="#64748B" />) : (<View style={styles.displayValue}><Text style={styles.displayValueText}>{profile.location || <Text style={styles.placeholder}>Nem megadva</Text>}</Text></View>)}
                </View>

                <View>
                  <Text style={styles.fieldLabelText}>Bemutatkozás</Text>
                  {isEditing ? (<TextInput value={editedProfile.bio} onChangeText={(text) => handleChange('bio', text)} style={[styles.input, styles.textarea]} placeholder="Írj magadról..." placeholderTextColor="#64748B" multiline numberOfLines={3} />) : (<View style={[styles.displayValue, styles.textareaDisplay]}><Text style={styles.displayValueText}>{profile.bio || <Text style={styles.placeholder}>Nem megadva</Text>}</Text></View>)}
                </View>
              </View>
            </LinearGradient>
          </View>

          {isEditing && (
            <TouchableOpacity onPress={saveProfile} style={styles.saveButtonContainer}>
              <LinearGradient colors={['#16A34A', '#15803D']} style={styles.saveButton}>
                <MaterialCommunityIcons name="content-save" size={SIZES.iconBase} color={COLORS.white} />
                <Text style={styles.saveButtonText}>Változások mentése</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: { marginTop: 48 },
  headerGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, borderBottomWidth: 2, borderBottomColor: '#3B82F6' },
  backButton: { width: 40, height: 40, backgroundColor: 'rgba(37, 99, 235, 0.6)', borderRadius: SIZES.radiusLG, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  headerTitleText: { fontSize: SIZES.fontXL, color: COLORS.white },
  editButton: { width: 40, height: 40, backgroundColor: 'rgba(37, 99, 235, 0.6)', borderRadius: SIZES.radiusLG, alignItems: 'center', justifyContent: 'center' },
  editButtonActive: { backgroundColor: '#16A34A' },
  content: { flex: 1, padding: SPACING.base },
  statsCard: { marginBottom: SPACING.base },
  profileCard: { marginBottom: SPACING.base },
  cardGradient: { borderRadius: SIZES.radiusXL, padding: SPACING.base, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)' },
  statsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.base },
  statsTitle: { fontSize: SIZES.fontLG, color: COLORS.white },
  tierBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: SIZES.radiusFull },
  tierBadgeText: { fontSize: SIZES.fontXS, color: COLORS.white },
  levelContainer: { marginBottom: SPACING.base },
  levelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  levelInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  levelText: { color: COLORS.white },
  xpText: { fontSize: SIZES.fontSM, color: '#93C5FD' },
  progressBar: { width: '100%', backgroundColor: '#334155', borderRadius: SIZES.radiusFull, height: 12, overflow: 'hidden' },
  progressFill: { height: '100%' },
  resourcesGrid: { flexDirection: 'row', gap: SPACING.md },
  resourceCard: { flex: 1, backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: SIZES.radiusLG, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  resourceIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  resourceLabel: { fontSize: SIZES.fontXS, color: '#94A3B8' },
  resourceValue: { fontSize: SIZES.fontLG },
  profileHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.base },
  cancelButton: { width: 32, height: 32, backgroundColor: '#DC2626', borderRadius: SIZES.radiusLG, alignItems: 'center', justifyContent: 'center' },
  fieldsContainer: { gap: SPACING.md },
  fieldLabel: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  fieldLabelText: { fontSize: SIZES.fontSM, color: '#93C5FD' },
  input: { width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)', borderRadius: SIZES.radiusLG, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, color: COLORS.white },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  displayValue: { backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: SIZES.radiusLG, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  textareaDisplay: { minHeight: 80 },
  displayValueText: { color: COLORS.white },
  placeholder: { color: '#64748B' },
  saveButtonContainer: { marginBottom: SPACING.lg },
  saveButton: { width: '100%', paddingVertical: SPACING.md, borderRadius: SIZES.radiusXL, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm },
  saveButtonText: { color: COLORS.white, fontSize: SIZES.fontBase },
});
