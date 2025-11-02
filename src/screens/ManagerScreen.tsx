import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';
import { useCoins } from '../contexts/CoinsContext';

interface ManagerScreenProps {
  navigation: any;
}

export default function ManagerScreen({ navigation }: ManagerScreenProps) {
  const { reloadBalance } = useCoins();
  const handleResetData = async () => {
    Alert.alert(
      'Vissza az elejére',
      'Biztosan vissza szeretnél állni az elejére? Ez törli:\n\n• Minden lecke progresst\n• Kölcsönzött könyveket\n• Avatárt\n• Game state-et\n\nÚj kezdés:\n• 1000 arany\n• 0 gyémánt\n• 1. szint',
      [
        { text: 'Mégse', style: 'cancel' },
        {
          text: 'Vissza az elejére',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Resetting all data...');

              // Törlés az AsyncStorage-ból
              await AsyncStorage.multiRemove([
                'game_state',
                'rentedBooks',
                'lessonProgress',
                'player_avatar',
                'userCoins',  // CoinsContext használja ezt a kulcsot
                'userGems',   // CoinsContext használja ezt a kulcsot
              ]);

              // Alapértelmezett értékek beállítása
              await AsyncStorage.setItem('userCoins', '1000');
              await AsyncStorage.setItem('userGems', '0');

              console.log('✅ All data reset successfully!');

              // Reload balance from AsyncStorage
              await reloadBalance();

              Alert.alert(
                'Siker! ✅',
                'Minden adat törölve lett!\n\nÚj kezdés:\n• 1000 arany 💰\n• 0 gyémánt 💎\n• 1. szint 🎓\n\nVisszalépsz a főoldalra...',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Reset navigation stack to Home (this forces HomeScreen to remount)
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{ name: 'Home' }],
                        })
                      );
                    },
                  },
                ]
              );
            } catch (error) {
              console.error('❌ Error resetting data:', error);
              Alert.alert('Hiba', 'Nem sikerült törölni az adatokat.');
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Exportálás', 'Az adatok exportálása funkció hamarosan elérhető lesz!');
  };

  const handleImportData = () => {
    Alert.alert('Importálás', 'Az adatok importálása funkció hamarosan elérhető lesz!');
  };

  const settingCategories = [
    {
      title: 'Játék beállítások',
      icon: 'gamepad-variant',
      color: '#6366F1',
      items: [
        { label: 'Kezdő arany', value: '1000', icon: 'coin' },
        { label: 'Max szint', value: '100', icon: 'trophy' },
        { label: 'XP növekedés', value: '10%', icon: 'trending-up' },
      ],
    },
    {
      title: 'Könyvtár',
      icon: 'book-open-variant',
      color: '#3B82F6',
      items: [
        { label: '1 napos kölcsönzés', value: '50 arany', icon: 'calendar-today' },
        { label: '30 napos kölcsönzés', value: '200 arany', icon: 'calendar-month' },
      ],
    },
    {
      title: 'Küzdőtér',
      icon: 'sword-cross',
      color: '#EF4444',
      items: [
        { label: 'Min. fogadás', value: '10 arany', icon: 'arrow-down' },
        { label: 'Max. fogadás', value: '500 arany', icon: 'arrow-up' },
        { label: 'XP / győzelem', value: '50 XP', icon: 'star' },
      ],
    },
    {
      title: 'Előfizetés',
      icon: 'crown',
      color: '#9333EA',
      items: [
        { label: 'Pro csomag', value: '4,990 Ft/hó', icon: 'star-circle' },
        { label: 'Master csomag', value: '9,990 Ft/hó', icon: 'crown-circle' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <LinearGradient colors={['#6366F1', '#4F46E5', '#0F172A']} style={styles.gradient}>
          {/* Header */}
          <View style={styles.header}>
          <LinearGradient colors={['rgba(29, 78, 216, 0.9)', 'rgba(30, 64, 175, 0.9)']} style={styles.headerGradient}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={SIZES.iconBase} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <MaterialCommunityIcons name="cog" size={SIZES.iconLG} color={COLORS.white} />
              <View>
                <Text style={styles.headerTitle}>Menedzser Panel</Text>
                <Text style={styles.headerSubtitle}>Játék beállítások kezelése</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* App Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons name="information" size={SIZES.iconBase} color="#6366F1" />
              <Text style={styles.infoTitle}>Alkalmazás információk</Text>
            </View>
            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="harddisk" size={SIZES.iconSM} color="#4F46E5" />
                <Text style={styles.infoLabel}>Adatméret:</Text>
                <Text style={styles.infoValue}>0.5 MB</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="package-variant" size={SIZES.iconSM} color="#4F46E5" />
                <Text style={styles.infoLabel}>Verzió:</Text>
                <Text style={styles.infoValue}>v1.0</Text>
              </View>
            </View>
          </View>

          {/* Settings Categories */}
          {settingCategories.map((category, index) => (
            <View key={index} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <MaterialCommunityIcons name={category.icon as any} size={SIZES.iconBase} color={COLORS.white} />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>
              {category.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <MaterialCommunityIcons name={item.icon as any} size={SIZES.iconSM} color="#93C5FD" />
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  <Text style={styles.settingValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          ))}

          {/* Data Management */}
          <View style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>Adatkezelés</Text>

            <TouchableOpacity onPress={handleExportData} style={styles.actionButton}>
              <MaterialCommunityIcons name="download" size={SIZES.iconBase} color="#10B981" />
              <Text style={[styles.actionButtonText, { color: '#10B981' }]}>Adatok exportálása</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleImportData} style={styles.actionButton}>
              <MaterialCommunityIcons name="upload" size={SIZES.iconBase} color="#3B82F6" />
              <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Adatok importálása</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResetData} style={[styles.actionButton, styles.dangerButton]}>
              <MaterialCommunityIcons name="restart" size={SIZES.iconBase} color="#EF4444" />
              <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>🔄 Vissza az elejére</Text>
            </TouchableOpacity>
          </View>

          {/* Info Note */}
          <View style={styles.noteCard}>
            <MaterialCommunityIcons name="alert-circle" size={SIZES.iconBase} color="#2563EB" />
            <Text style={styles.noteText}>
              Ez egy egyszerűsített Manager panel. A teljes beállítások szerkesztése hamarosan elérhető lesz a webes
              verzióban.
            </Text>
          </View>
        </ScrollView>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: { marginTop: 0 },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(37, 99, 235, 0.6)',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  headerTitle: { fontSize: SIZES.fontXL, color: COLORS.white, fontWeight: 'bold' },
  headerSubtitle: { fontSize: SIZES.fontXS, color: '#E9D5FF' },
  scrollView: { flex: 1, padding: SPACING.base },
  infoCard: {
    backgroundColor: 'rgba(238, 242, 255, 0.2)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 2,
    borderColor: 'rgba(199, 210, 254, 0.3)',
    marginBottom: SPACING.lg,
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  infoTitle: { fontSize: SIZES.fontLG, color: COLORS.white, fontWeight: 'bold' },
  infoContent: { gap: SPACING.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  infoLabel: { fontSize: SIZES.fontSM, color: '#93C5FD', flex: 1 },
  infoValue: { fontSize: SIZES.fontSM, color: COLORS.white, fontWeight: 'bold' },
  categoryCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginBottom: SPACING.lg,
  },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: { fontSize: SIZES.fontLG, color: COLORS.white, fontWeight: 'bold' },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: SIZES.radiusLG,
    marginBottom: SPACING.sm,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  settingLabel: { fontSize: SIZES.fontSM, color: '#93C5FD' },
  settingValue: { fontSize: SIZES.fontSM, color: COLORS.white, fontWeight: 'bold' },
  actionsCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginBottom: SPACING.lg,
  },
  actionsTitle: { fontSize: SIZES.fontLG, color: COLORS.white, fontWeight: 'bold', marginBottom: SPACING.md },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: SIZES.radiusLG,
    marginBottom: SPACING.sm,
  },
  dangerButton: { borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  actionButtonText: { fontSize: SIZES.fontBase, fontWeight: 'bold' },
  noteCard: {
    flexDirection: 'row',
    gap: SPACING.md,
    backgroundColor: 'rgba(239, 246, 255, 0.2)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 2,
    borderColor: 'rgba(191, 219, 254, 0.3)',
    marginBottom: SPACING.xl,
  },
  noteText: { flex: 1, fontSize: SIZES.fontSM, color: '#BFDBFE' },
});
