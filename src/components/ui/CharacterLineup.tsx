import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS, Z_INDEX } from '../../utils/styleConstants';
import { useCoins } from '../../contexts/CoinsContext';

interface CharacterLineupProps {
  onJumpToLesson?: (lesson: number) => void;
  onUniversityClick?: () => void;
  onProfileClick?: () => void;
  onSubscriptionClick?: () => void;
  onManagerClick?: () => void;
}

export function CharacterLineup({
  onJumpToLesson,
  onUniversityClick,
  onProfileClick,
  onSubscriptionClick,
  onManagerClick
}: CharacterLineupProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { reloadBalance } = useCoins();

  const characters = [
    {
      colors: ['#9333EA', '#581C87'],
      name: 'Shadow',
      icon: 'school-outline',
      label: 'Egyetem',
      onClick: onUniversityClick
    },
    {
      colors: ['#3B82F6', '#1D4ED8'],
      name: 'Frost',
      icon: 'account-outline',
      label: 'Diák',
      onClick: onProfileClick
    },
    {
      colors: ['#6B7280', '#374151'],
      name: 'Steel',
      icon: 'trophy-outline',
      label: 'Eredmények'
    },
    {
      colors: ['#EC4899', '#BE185D'],
      name: 'Sakura',
      icon: 'medal-outline',
      label: 'Helyezés'
    },
    {
      colors: ['#F97316', '#C2410C'],
      name: 'Fire',
      icon: 'newspaper-variant-outline',
      label: 'Hírek'
    },
    {
      colors: ['#EAB308', '#CA8A04'],
      name: 'Wave',
      icon: 'crown-outline',
      label: 'Előfizetés',
      onClick: onSubscriptionClick
    },
  ];

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleExportData = () => {
    // TODO: Implement data export
    Alert.alert('Export', 'Adatok exportálva!');
    setMenuOpen(false);
  };

  const handleImportData = () => {
    // TODO: Implement data import with file picker
    Alert.alert('Import', 'Import funkció - fájl választó szükséges');
    setMenuOpen(false);
  };

  const handleLessonSelect = (lesson: number) => {
    if (onJumpToLesson) {
      onJumpToLesson(lesson);
    }
    setMenuOpen(false);
  };

  const handleManagerOpen = () => {
    if (onManagerClick) {
      onManagerClick();
    }
    setMenuOpen(false);
  };

  const handleSaveLesson12State = () => {
    // TODO: Implement lesson 12 state save using AsyncStorage
    Alert.alert('Mentés', '12. lecke állapot elmentve!');
    setMenuOpen(false);
  };

  const handleResetToStart = async () => {
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
              console.log('🗑️ Dev Menu: Resetting all data...');

              // Törlés az AsyncStorage-ból
              await AsyncStorage.multiRemove([
                'game_state',
                'rentedBooks',
                'lessonProgress',
                'player_avatar',
                'userCoins',
                'userGems',
              ]);

              // Alapértelmezett értékek beállítása
              await AsyncStorage.setItem('userCoins', '1000');
              await AsyncStorage.setItem('userGems', '0');

              console.log('✅ Dev Menu: All data reset successfully!');

              // Reload balance
              await reloadBalance();

              setMenuOpen(false);

              Alert.alert(
                'Siker! ✅',
                'Minden adat törölve lett!\n\n• 1000 arany 💰\n• 0 gyémánt 💎\n• 1. szint 🎓\n\nA főoldal automatikusan frissült!',
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error('❌ Dev Menu: Error resetting data:', error);
              Alert.alert('Hiba', 'Nem sikerült törölni az adatokat.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Character lineup */}
      <View style={styles.lineupWrapper}>
        <View style={styles.lineupInner}>
          {characters.map((char, index) => (
            <View key={index} style={styles.characterButtonWrapper}>
              <TouchableOpacity
                onPress={char.onClick}
                disabled={!char.onClick}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={char.colors}
                  style={[
                    styles.characterButton,
                    !char.onClick && styles.characterButtonDisabled
                  ]}
                >
                  <View style={styles.characterOverlay} />
                  <MaterialCommunityIcons
                    name={char.icon as any}
                    size={28}
                    color={COLORS.white}
                    style={styles.characterIcon}
                  />
                  <Text style={styles.characterLabel}>{char.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}

          {/* Developer Menu Button */}
          <View style={styles.devButtonWrapper}>
            <TouchableOpacity onPress={handleMenuToggle} activeOpacity={0.8}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.devButton}
              >
                <View style={styles.devButtonOverlay} />
                <MaterialCommunityIcons
                  name="menu"
                  size={14}
                  color={COLORS.white}
                  style={styles.devIcon}
                />
                <Text style={styles.devLabel}>Dev</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Developer Menu Modal */}
      <Modal
        visible={menuOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        {/* Backdrop */}
        <Pressable
          style={styles.backdrop}
          onPress={() => setMenuOpen(false)}
        >
          {/* Menu content - prevent backdrop click from closing when tapping menu */}
          <Pressable style={styles.menuContainer} onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={[COLORS.gray900, `${COLORS.crystalPurple}95`, COLORS.gray900]}
              style={styles.menu}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>Fejlesztői Menü</Text>

                  {onManagerClick && (
                    <TouchableOpacity
                      onPress={handleManagerOpen}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={[COLORS.primary, COLORS.crystalPurple]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.menuButton}
                      >
                        <MaterialCommunityIcons
                          name="cog-outline"
                          size={SIZES.iconSM}
                          color={COLORS.white}
                        />
                        <Text style={styles.menuButtonText}>Menedzser Panel</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  {onJumpToLesson && (
                    <>
                      <View style={styles.menuDivider} />

                      <TouchableOpacity
                        onPress={handleResetToStart}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={[COLORS.crystalPurple, COLORS.secondary]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.menuButton}
                        >
                          <Text style={styles.menuButtonText}>1. Vissza az elejére</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleLessonSelect(999)}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={[COLORS.primary, COLORS.xpBlueDark]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.menuButton}
                        >
                          <Text style={styles.menuButtonText}>2. Vissza az aktuális állapotra</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleLessonSelect(12)}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={[COLORS.gold, COLORS.warning]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.menuButton}
                        >
                          <Text style={styles.menuButtonText}>3. 📚 12. lecke állapot betöltése</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <View style={styles.menuDivider} />

                      <TouchableOpacity
                        onPress={handleExportData}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={[COLORS.success, '#059669']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.menuButton}
                        >
                          <MaterialCommunityIcons
                            name="download-outline"
                            size={SIZES.iconSM}
                            color={COLORS.white}
                          />
                          <Text style={styles.menuButtonText}>Állapot exportálása</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleImportData}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={[COLORS.crystalCyan, COLORS.primary]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.menuButton}
                        >
                          <MaterialCommunityIcons
                            name="upload-outline"
                            size={SIZES.iconSM}
                            color={COLORS.white}
                          />
                          <Text style={styles.menuButtonText}>Állapot importálása</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <View style={styles.menuDivider} />

                      <TouchableOpacity
                        onPress={handleSaveLesson12State}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={[COLORS.gold, COLORS.warning]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.menuButton}
                        >
                          <Text style={styles.menuButtonText}>💾 12. lecke állapot mentése</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </ScrollView>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 98,
    left: 0,
    right: 0,
    zIndex: Z_INDEX.overlay,
  },
  lineupWrapper: {
    height: 80,
    marginHorizontal: SPACING.sm,
  },
  lineupInner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: SPACING.base,
  },
  characterButtonWrapper: {
    marginHorizontal: SPACING.xs / 2,
  },
  characterButton: {
    width: 56,
    height: 72,
    borderRadius: SIZES.radiusLG,
    borderWidth: SIZES.borderBase,
    borderColor: COLORS.gray800,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
    ...SHADOWS.large,
  },
  characterButtonDisabled: {
    opacity: 0.7,
  },
  characterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlayLight,
    borderRadius: SIZES.radiusLG,
  },
  characterIcon: {
    zIndex: Z_INDEX.content + 1,
    marginBottom: SPACING.xs,
  },
  characterLabel: {
    color: COLORS.white,
    fontSize: 8,
    zIndex: Z_INDEX.content + 1,
    textAlign: 'center',
    lineHeight: 10,
  },
  devButtonWrapper: {
    marginLeft: SPACING.sm,
  },
  devButton: {
    width: 28,
    height: 36,
    borderRadius: SIZES.radiusLG,
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.gray800,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    ...SHADOWS.large,
  },
  devButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlayLight,
    borderRadius: SIZES.radiusLG,
  },
  devIcon: {
    zIndex: Z_INDEX.content + 1,
    marginBottom: 2,
  },
  devLabel: {
    color: COLORS.white,
    fontSize: 6,
    zIndex: Z_INDEX.content + 1,
    textAlign: 'center',
    lineHeight: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: 256,
    maxHeight: '80%',
  },
  menu: {
    borderRadius: SIZES.radiusXL,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.gray700}50`,
    padding: SPACING.base,
    ...SHADOWS.xl,
  },
  menuContent: {
    gap: SPACING.sm,
  },
  menuTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: SIZES.borderThin,
    borderBottomColor: `${COLORS.gray700}50`,
    fontWeight: FONT_WEIGHT.semibold,
  },
  menuButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    borderRadius: SIZES.radiusLG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    ...SHADOWS.large,
  },
  menuButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.medium,
  },
  menuDivider: {
    borderTopWidth: SIZES.borderThin,
    borderTopColor: `${COLORS.gray700}50`,
    marginVertical: SPACING.xs,
  },
});
