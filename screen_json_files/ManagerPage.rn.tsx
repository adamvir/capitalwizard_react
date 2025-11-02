/**
 * ManagerPage - REACT NATIVE VERSION (SIMPLIFIED)
 * 
 * Admin/settings panel játék beállítások kezeléséhez.
 * 
 * IMPORTANT: This is a SIMPLIFIED version for React Native.
 * The web version has 20+ setting sections with 50+ inputs.
 * This RN version includes only the MOST IMPORTANT settings.
 * 
 * Full settings included in web version (not all in RN):
 * - Starting Gold
 * - Library Prices (1-day, 30-day rental)
 * - Arena Limits (min/max bet)
 * - Daily Limits (lessons, arena games)
 * - Subscription Prices (Pro, Master)
 * - Lesson Rewards (XP + Gold by type)
 * - Repeated Lessons Rewards
 * - XP System (max level, base XP, growth %)
 * - Arena XP (win XP, max books)
 * - Matching/Quiz/Reading Game Settings
 * - Stage/Milestone System
 * - Shop Prices (streak freeze, gold, diamonds)
 * - Data Export/Import (JSON)
 * 
 * RN version includes:
 * - Starting Gold
 * - Library/Arena/Daily Limits
 * - Subscription Prices
 * - Basic XP System
 * - Save/Reset buttons
 * 
 * DEPENDENCIES:
 * npm install lucide-react-native
 * npm install react-native-linear-gradient
 * 
 * For full settings, use web version or implement AsyncStorage sync.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ArrowLeft,
  Settings,
  Coins,
  BookOpen,
  Swords,
  Calendar,
  Crown,
  Save,
  RotateCcw,
  AlertCircle,
  TrendingUp,
} from 'lucide-react-native';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  primary: '#8B5CF6',
  secondary: '#7C3AED',
  amber50: '#FFFBEB',
  amber300: '#FCD34D',
  amber500: '#F59E0B',
  amber700: '#B45309',
  amber900: '#78350F',
  blue50: '#EFF6FF',
  blue300: '#93C5FD',
  blue500: '#3B82F6',
  blue700: '#1D4ED8',
  blue900: '#1E3A8A',
  red300: '#FCA5A5',
  red500: '#EF4444',
  red700: '#B91C1C',
  red900: '#7F1D1D',
  green300: '#86EFAC',
  green500: '#10B981',
  green600: '#059669',
  green700: '#047857',
  green900: '#064E3B',
  purple300: '#D8B4FE',
  purple500: '#A855F7',
  purple700: '#7E22CE',
  purple900: '#581C87',
  cyan300: '#67E8F9',
  cyan500: '#06B6D4',
  cyan700: '#0E7490',
  cyan900: '#164E63',
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
  fontXS: 12,
  fontSM: 14,
  fontBase: 16,
  fontLG: 18,
  borderThin: 1,
  borderMedium: 2,
  radiusSM: 4,
  radiusMD: 8,
  radiusLG: 12,
  radiusXL: 16,
  radius2XL: 20,
  radiusFull: 9999,
  iconBase: 18,
  iconLG: 24,
};

const FONT_WEIGHT = {
  normal: '400' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// ============================================
// TYPES
// ============================================

interface ManagerPageProps {
  onBack: () => void;
}

interface GameConfig {
  initialGold: number;
  bookRental1Day: number;
  bookRental30Days: number;
  arenaMinBet: number;
  arenaMaxBet: number;
  freeDailyArenaGames: number;
  dailyLessonLimit: number;
  subscriptionProPrice: number;
  subscriptionMasterPrice: number;
  maxLevel: number;
  baseXpPerLevel: number;
  xpGrowthPercentage: number;
}

// ============================================
// DEFAULT CONFIG
// ============================================

const DEFAULT_CONFIG: GameConfig = {
  initialGold: 1000,
  bookRental1Day: 50,
  bookRental30Days: 300,
  arenaMinBet: 10,
  arenaMaxBet: 500,
  freeDailyArenaGames: 5,
  dailyLessonLimit: 3,
  subscriptionProPrice: 4990,
  subscriptionMasterPrice: 9990,
  maxLevel: 100,
  baseXpPerLevel: 100,
  xpGrowthPercentage: 10,
};

// ============================================
// COMPONENT
// ============================================

export function ManagerPage({ onBack }: ManagerPageProps) {
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [hasChanges, setHasChanges] = useState(false);

  // Check for changes
  useEffect(() => {
    const isDifferent =
      JSON.stringify(DEFAULT_CONFIG) !== JSON.stringify(config);
    setHasChanges(isDifferent);
  }, [config]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSave = () => {
    // TODO: Save to AsyncStorage or context
    Alert.alert('Mentés', 'Beállítások mentve!', [{ text: 'OK' }]);
    setHasChanges(false);
  };

  const handleReset = () => {
    Alert.alert(
      'Visszaállítás',
      'Biztosan visszaállítod az alapértelmezett beállításokat?',
      [
        { text: 'Mégse', style: 'cancel' },
        {
          text: 'Visszaállítás',
          onPress: () => {
            setConfig(DEFAULT_CONFIG);
            setHasChanges(false);
            Alert.alert('Siker', 'Alapértelmezett beállítások visszaállítva!');
          },
        },
      ]
    );
  };

  const updateConfig = (key: keyof GameConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  const renderSectionHeader = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    gradient: [string, string]
  ) => (
    <View style={styles.sectionHeader}>
      <LinearGradient
        colors={gradient}
        style={styles.iconContainer}
      >
        {icon}
      </LinearGradient>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );

  const renderInputField = (
    label: string,
    configKey: keyof GameConfig,
    helperText?: string
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={String(config[configKey])}
        onChangeText={(text) => {
          const num = parseInt(text) || 0;
          updateConfig(configKey, num);
        }}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor={COLORS.secondary}
      />
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.secondary, '#4F46E5']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={SIZES.iconLG} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Settings size={28} color={COLORS.white} />
            <View>
              <Text style={styles.headerTitle}>Menedzser Panel</Text>
              <Text style={styles.headerSubtitle}>
                Játék beállítások kezelése
              </Text>
            </View>
          </View>
          {hasChanges && (
            <View style={styles.unsavedIndicator}>
              <AlertCircle size={SIZES.iconBase} color={COLORS.white} />
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Notice */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            ⚠️ Ez egy egyszerűsített verzió. A teljes admin panel a webes
            verzióban érhető el 50+ beállítással.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!hasChanges}
            style={[styles.button, styles.saveButton, !hasChanges && styles.buttonDisabled]}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                hasChanges ? [COLORS.green600, COLORS.green500] : ['#D1D5DB', '#9CA3AF']
              }
              style={styles.buttonGradient}
            >
              <Save size={20} color={COLORS.white} />
              <Text style={styles.buttonText}>Mentés</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleReset}
            style={[styles.button, styles.resetButton]}
            activeOpacity={0.8}
          >
            <RotateCcw size={20} color={COLORS.purple700} />
            <Text style={styles.resetButtonText}>Alapértelmezett</Text>
          </TouchableOpacity>
        </View>

        {/* Starting Gold */}
        <View style={styles.settingsCard}>
          {renderSectionHeader(
            <Coins size={SIZES.iconLG} color={COLORS.white} />,
            'Kezdő arany',
            'Reset után kapott arany',
            [COLORS.amber500, '#D97706']
          )}
          {renderInputField('Kezdő arany mennyiség', 'initialGold')}
        </View>

        {/* Library Settings */}
        <View style={styles.settingsCard}>
          {renderSectionHeader(
            <BookOpen size={SIZES.iconLG} color={COLORS.white} />,
            'Könyvtár',
            'Kölcsönzési díjak',
            [COLORS.blue500, '#4F46E5']
          )}
          {renderInputField('1 napos kölcsönzés (arany)', 'bookRental1Day')}
          {renderInputField('30 napos kölcsönzés (arany)', 'bookRental30Days')}
        </View>

        {/* Arena Settings */}
        <View style={styles.settingsCard}>
          {renderSectionHeader(
            <Swords size={SIZES.iconLG} color={COLORS.white} />,
            'Küzdőtér',
            'Fogadás limitek',
            [COLORS.red500, '#F97316']
          )}
          {renderInputField('Minimum fogadás (arany)', 'arenaMinBet')}
          {renderInputField('Maximum fogadás (arany)', 'arenaMaxBet')}
        </View>

        {/* Daily Limits */}
        <View style={styles.settingsCard}>
          {renderSectionHeader(
            <Calendar size={SIZES.iconLG} color={COLORS.white} />,
            'Napi limitek',
            'Free felhasználók limitjei',
            [COLORS.green500, COLORS.green700]
          )}
          {renderInputField(
            'Küzdőtér játékok naponta',
            'freeDailyArenaGames'
          )}
          {renderInputField('Leckék naponta', 'dailyLessonLimit')}
        </View>

        {/* Subscription Prices */}
        <View style={styles.settingsCard}>
          {renderSectionHeader(
            <Crown size={SIZES.iconLG} color={COLORS.white} />,
            'Előfizetési árak',
            'Havi díjak Ft-ban',
            [COLORS.purple500, '#EC4899']
          )}
          {renderInputField(
            'Professzionális (Ft/hó)',
            'subscriptionProPrice'
          )}
          {renderInputField('Mester (Ft/hó)', 'subscriptionMasterPrice')}
        </View>

        {/* XP System */}
        <View style={styles.settingsCard}>
          {renderSectionHeader(
            <TrendingUp size={SIZES.iconLG} color={COLORS.white} />,
            'XP rendszer',
            'Szintrendszer beállítások',
            [COLORS.cyan500, COLORS.cyan700]
          )}
          {renderInputField('Maximális szint', 'maxLevel')}
          {renderInputField('Alap XP / szint', 'baseXpPerLevel')}
          {renderInputField(
            'XP növekedés / szint (%)',
            'xpGrowthPercentage',
            'Minden szint után ennyi %-kal nő a szükséges XP'
          )}
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // Header
  header: {
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
    paddingHorizontal: SPACING.base,
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Shadow (Android)
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
    borderRadius: SIZES.radiusLG,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.bold,
  },
  headerSubtitle: {
    color: '#E9D5FF',
    fontSize: SIZES.fontXS,
  },
  unsavedIndicator: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusFull,
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.base,
    gap: SPACING.xl,
  },

  // Info Card
  infoCard: {
    backgroundColor: COLORS.blue50,
    borderWidth: SIZES.borderMedium,
    borderColor: '#BFDBFE',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
  },
  infoText: {
    fontSize: SIZES.fontSM,
    color: COLORS.blue900,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  button: {
    flex: 1,
    borderRadius: SIZES.radiusXL,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  saveButton: {},
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.semibold,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderWidth: SIZES.borderMedium,
    borderColor: COLORS.purple300,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusXL,
  },
  resetButtonText: {
    color: COLORS.purple700,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Settings Card
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: SIZES.borderMedium,
    borderColor: '#E5E7EB',
    gap: SPACING.base,
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow (Android)
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.bold,
    color: '#1F2937',
  },
  sectionSubtitle: {
    fontSize: SIZES.fontXS,
    color: '#6B7280',
  },

  // Input Field
  inputContainer: {
    gap: SPACING.xs,
  },
  inputLabel: {
    fontSize: SIZES.fontSM,
    color: '#374151',
    fontWeight: FONT_WEIGHT.semibold,
  },
  input: {
    borderWidth: SIZES.borderMedium,
    borderColor: '#D1D5DB',
    borderRadius: SIZES.radiusMD,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: SIZES.fontBase,
    color: '#1F2937',
    backgroundColor: COLORS.white,
  },
  helperText: {
    fontSize: SIZES.fontXS,
    color: '#6B7280',
    marginTop: SPACING.xs,
  },
});
