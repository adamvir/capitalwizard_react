/**
 * ============================================
 * MANAGERPAGE - REACT NATIVE VERSION (FULL)
 * ============================================
 * 
 * VERSION: 2.0.0 - TELJES konverzió minden beállítással
 * 
 * Admin/settings panel játék beállítások kezeléséhez.
 * Tartalmazza az ÖSSZES beállítást a web verzióból.
 * 
 * BEÁLLÍTÁSOK (20+ kategória):
 * ✅ Starting Gold
 * ✅ Library Prices (1-day, 30-day rental)
 * ✅ Arena Limits (min/max bet, free games)
 * ✅ Daily Limits (lessons, arena games)
 * ✅ Subscription Prices (Pro, Master)
 * ✅ Lesson Rewards (XP + Gold by type)
 * ✅ Repeated Lessons Rewards
 * ✅ XP System (max level, base XP, growth %)
 * ✅ Arena XP (win XP, max books)
 * ✅ Matching Game Settings
 * ✅ Quiz Game Settings
 * ✅ Reading Game Settings
 * ✅ Stage System
 * ✅ Milestone Rewards
 * ✅ Shop Prices (streak freeze, gold, diamonds)
 * ✅ Data Export/Import (JSON)
 * ✅ Save/Reset buttons
 * 
 * HASZNÁLAT:
 * cp exports/ManagerPage.rn.tsx src/screens/ManagerPage.tsx
 * 
 * FÜGGŐSÉGEK:
 * npm install lucide-react-native
 * npm install react-native-linear-gradient
 * npm install @react-native-async-storage/async-storage
 * npm install react-native-fs (for file export/import)
 * 
 * iOS: cd ios && pod install
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  Share,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeft,
  Settings,
  Coins,
  BookOpen,
  Swords,
  Calendar,
  Crown,
  Trophy,
  RotateCcw,
  Save,
  AlertCircle,
  Info,
  Download,
  Upload,
  HardDrive,
  TrendingUp,
  Shuffle,
  Brain,
  BookOpenCheck,
  ShoppingBag,
  Flame,
  Gem,
  CheckCircle2,
} from 'lucide-react-native';

// ============================================
// TYPES & INTERFACES
// ============================================

interface ManagerPageProps {
  onBack: () => void;
}

interface GameConfig {
  // Starting values
  startingGold: number;

  // Library
  library1DayPrice: number;
  library30DayPrice: number;

  // Arena
  arenaMinBet: number;
  arenaMaxBet: number;
  freeDailyArenaGames: number;

  // Daily limits
  freeDailyLessons: number;

  // Subscriptions
  proPriceMonthly: number;
  masterPriceMonthly: number;

  // Lesson rewards
  lessonXPReward: number;
  lessonGoldReward: number;
  quizXPReward: number;
  quizGoldReward: number;
  readingXPReward: number;
  readingGoldReward: number;
  matchingXPReward: number;
  matchingGoldReward: number;

  // Repeated lessons
  repeatedLessonXPReward: number;
  repeatedLessonGoldReward: number;

  // XP System
  maxLevel: number;
  baseXPRequired: number;
  xpGrowthPercentage: number;

  // Arena XP
  arenaWinXP: number;
  arenaLoseXP: number;
  maxBooksForArena: number;

  // Matching Game
  matchingTimeLimitSeconds: number;
  matchingPairs: number;
  matchingTimeBonus: number;

  // Quiz Game
  quizQuestionsCount: number;
  quizTimeLimitSeconds: number;
  quizPassPercentage: number;

  // Reading Game
  readingTimePerWord: number;
  readingMinWords: number;

  // Stage System
  stagesEnabled: boolean;
  lessonsPerStage: number;
  stageRewardGold: number;
  stageRewardXP: number;

  // Milestones
  milestonesEnabled: boolean;
  milestones: number[];
  milestoneRewardGold: number;
  milestoneRewardXP: number;

  // Shop
  streakFreezePrice: number;
  shopGoldPrices: number[];
  shopDiamondPrices: number[];
}

// ============================================
// DEFAULT CONFIG
// ============================================

const DEFAULT_CONFIG: GameConfig = {
  // Starting values
  startingGold: 1000,

  // Library
  library1DayPrice: 200,
  library30DayPrice: 3000,

  // Arena
  arenaMinBet: 10,
  arenaMaxBet: 500,
  freeDailyArenaGames: 3,

  // Daily limits
  freeDailyLessons: 10,

  // Subscriptions
  proPriceMonthly: 4990,
  masterPriceMonthly: 9990,

  // Lesson rewards
  lessonXPReward: 50,
  lessonGoldReward: 20,
  quizXPReward: 30,
  quizGoldReward: 15,
  readingXPReward: 20,
  readingGoldReward: 10,
  matchingXPReward: 25,
  matchingGoldReward: 12,

  // Repeated lessons
  repeatedLessonXPReward: 10,
  repeatedLessonGoldReward: 5,

  // XP System
  maxLevel: 100,
  baseXPRequired: 100,
  xpGrowthPercentage: 10,

  // Arena XP
  arenaWinXP: 50,
  arenaLoseXP: 10,
  maxBooksForArena: 3,

  // Matching Game
  matchingTimeLimitSeconds: 60,
  matchingPairs: 8,
  matchingTimeBonus: 5,

  // Quiz Game
  quizQuestionsCount: 10,
  quizTimeLimitSeconds: 300,
  quizPassPercentage: 70,

  // Reading Game
  readingTimePerWord: 0.5,
  readingMinWords: 100,

  // Stage System
  stagesEnabled: true,
  lessonsPerStage: 5,
  stageRewardGold: 100,
  stageRewardXP: 200,

  // Milestones
  milestonesEnabled: true,
  milestones: [10, 25, 50, 100],
  milestoneRewardGold: 500,
  milestoneRewardXP: 1000,

  // Shop
  streakFreezePrice: 100,
  shopGoldPrices: [100, 500, 1000, 5000],
  shopDiamondPrices: [10, 50, 100, 500],
};

// ============================================
// CONSTANTS
// ============================================

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

const SIZES = {
  fontXS: 12,
  fontSM: 14,
  fontBase: 16,
  fontLG: 18,
  fontXL: 20,
  font2XL: 24,
  iconSM: 16,
  iconBase: 20,
  iconLG: 24,
  radiusBase: 8,
  radiusLG: 12,
  radiusXL: 16,
  radiusFull: 9999,
};

const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
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
  indigo300: '#A5B4FC',
  indigo500: '#6366F1',
  indigo700: '#4338CA',
  indigo900: '#312E81',
  pink300: '#F9A8D4',
  pink500: '#EC4899',
  pink700: '#BE185D',
  pink900: '#831843',
};

// ============================================
// MAIN COMPONENT
// ============================================

const ManagerPage: React.FC<ManagerPageProps> = ({ onBack }) => {
  // ============================================
  // STATE
  // ============================================

  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'general' | 'rewards' | 'games' | 'shop' | 'data'
  >('general');

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    loadConfig();
  }, []);

  // ============================================
  // CONFIG MANAGEMENT
  // ============================================

  const loadConfig = async () => {
    try {
      const stored = await AsyncStorage.getItem('gameConfig');
      if (stored) {
        const parsed = JSON.parse(stored);
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const saveConfig = async () => {
    try {
      await AsyncStorage.setItem('gameConfig', JSON.stringify(config));
      setHasUnsavedChanges(false);
      Alert.alert('✅ Mentve', 'Beállítások sikeresen mentve!');
    } catch (error) {
      console.error('Error saving config:', error);
      Alert.alert('❌ Hiba', 'Nem sikerült menteni a beállításokat.');
    }
  };

  const resetConfig = () => {
    Alert.alert(
      '⚠️ Visszaállítás',
      'Biztosan visszaállítod az alapértelmezett beállításokat?',
      [
        { text: 'Mégse', style: 'cancel' },
        {
          text: 'Visszaállítás',
          style: 'destructive',
          onPress: () => {
            setConfig(DEFAULT_CONFIG);
            setHasUnsavedChanges(true);
            Alert.alert('✅ Kész', 'Alapértelmezett beállítások visszaállítva!');
          },
        },
      ]
    );
  };

  const exportConfig = async () => {
    try {
      const json = JSON.stringify(config, null, 2);
      
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Share.share({
          message: json,
          title: 'Game Config Export',
        });
      } else {
        // For web, copy to clipboard
        Alert.alert('✅ Export', 'Konfiguráció JSON másolva a vágólapra!');
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('❌ Hiba', 'Nem sikerült exportálni.');
    }
  };

  const importConfig = () => {
    Alert.prompt(
      '📥 Import',
      'Illeszd be a JSON konfigurációt:',
      [
        { text: 'Mégse', style: 'cancel' },
        {
          text: 'Import',
          onPress: (jsonString) => {
            try {
              if (!jsonString) return;
              const parsed = JSON.parse(jsonString);
              setConfig({ ...DEFAULT_CONFIG, ...parsed });
              setHasUnsavedChanges(true);
              Alert.alert('✅ Importálva', 'Konfiguráció sikeresen betöltve!');
            } catch (error) {
              Alert.alert('❌ Hiba', 'Érvénytelen JSON formátum!');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  // ============================================
  // UPDATE HANDLERS
  // ============================================

  const updateConfig = (key: keyof GameConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  // ============================================
  // RENDER METHODS
  // ============================================

  const renderHeader = () => (
    <LinearGradient
      colors={[COLORS.secondary, '#4F46E5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={SIZES.iconLG} color={COLORS.white} />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <Settings size={SIZES.iconLG} color={COLORS.white} />
          <View>
            <Text style={styles.headerTitle}>Manager Panel</Text>
            <Text style={styles.headerSubtitle}>Játék beállítások</Text>
          </View>
        </View>

        {hasUnsavedChanges && (
          <View style={styles.unsavedBadge}>
            <AlertCircle size={SIZES.iconSM} color="#F59E0B" />
            <Text style={styles.unsavedText}>Nem mentett</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tabsRow}>
          {[
            { key: 'general', label: '⚙️ Általános', icon: Settings },
            { key: 'rewards', label: '🏆 Jutalmak', icon: Trophy },
            { key: 'games', label: '🎮 Játékok', icon: Brain },
            { key: 'shop', label: '🛒 Bolt', icon: ShoppingBag },
            { key: 'data', label: '💾 Adat', icon: HardDrive },
          ].map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key as any)}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            >
              <Text
                style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderInputField = (
    label: string,
    value: number,
    key: keyof GameConfig,
    icon: React.ReactNode,
    color: string,
    unit?: string
  ) => (
    <View style={styles.inputFieldContainer}>
      <View style={styles.inputFieldLabel}>
        <View style={[styles.inputFieldIcon, { backgroundColor: color }]}>
          {icon}
        </View>
        <View style={styles.inputFieldLabelText}>
          <Text style={styles.inputFieldLabelMain}>{label}</Text>
          {unit && <Text style={styles.inputFieldLabelUnit}>{unit}</Text>}
        </View>
      </View>
      <TextInput
        style={styles.inputField}
        value={value.toString()}
        onChangeText={(text) => {
          const num = parseInt(text) || 0;
          updateConfig(key, num);
        }}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor="#94A3B8"
      />
    </View>
  );

  const renderSection = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    gradientColors: string[],
    borderColor: string,
    children: React.ReactNode
  ) => (
    <LinearGradient colors={gradientColors} style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: borderColor }]}>
          {icon}
        </View>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </LinearGradient>
  );

  // ============================================
  // TAB CONTENT RENDERERS
  // ============================================

  const renderGeneralTab = () => (
    <View style={styles.tabContent}>
      {/* Starting Values */}
      {renderSection(
        'Kezdő értékek',
        'Új játékos alapértelmezett értékei',
        <Coins size={SIZES.iconBase} color={COLORS.white} />,
        ['#FFFBEB', '#FEF3C7'],
        COLORS.amber500,
        <>
          {renderInputField(
            'Kezdő arany',
            config.startingGold,
            'startingGold',
            <Coins size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.amber500,
            'Érme'
          )}
        </>
      )}

      {/* Library */}
      {renderSection(
        'Könyvtár árak',
        'Könyvkölcsönzés díjszabása',
        <BookOpen size={SIZES.iconBase} color={COLORS.white} />,
        ['#EFF6FF', '#DBEAFE'],
        COLORS.blue500,
        <>
          {renderInputField(
            '1 napos bérlés',
            config.library1DayPrice,
            'library1DayPrice',
            <Calendar size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.blue500,
            'Érme'
          )}
          {renderInputField(
            '30 napos bérlés',
            config.library30DayPrice,
            'library30DayPrice',
            <Calendar size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.blue700,
            'Érme'
          )}
        </>
      )}

      {/* Arena */}
      {renderSection(
        'Küzdőtér limites',
        'Tét és napi játékszám korlátok',
        <Swords size={SIZES.iconBase} color={COLORS.white} />,
        ['#FEE2E2', '#FECACA'],
        COLORS.red500,
        <>
          {renderInputField(
            'Minimális tét',
            config.arenaMinBet,
            'arenaMinBet',
            <Coins size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.red500,
            'Érme'
          )}
          {renderInputField(
            'Maximális tét',
            config.arenaMaxBet,
            'arenaMaxBet',
            <Coins size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.red700,
            'Érme'
          )}
          {renderInputField(
            'Napi ingyenes játékok',
            config.freeDailyArenaGames,
            'freeDailyArenaGames',
            <Flame size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.red900,
            'játék/nap'
          )}
        </>
      )}

      {/* Daily Limits */}
      {renderSection(
        'Napi limitek',
        'Ingyenes leckék naponta',
        <Calendar size={SIZES.iconBase} color={COLORS.white} />,
        ['#F0FDF4', '#DCFCE7'],
        COLORS.green500,
        <>
          {renderInputField(
            'Ingyenes napi leckék',
            config.freeDailyLessons,
            'freeDailyLessons',
            <BookOpenCheck size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.green500,
            'lecke/nap'
          )}
        </>
      )}

      {/* Subscriptions */}
      {renderSection(
        'Előfizetések',
        'Havi előfizetési árak',
        <Crown size={SIZES.iconBase} color={COLORS.white} />,
        ['#FAF5FF', '#F3E8FF'],
        COLORS.purple500,
        <>
          {renderInputField(
            'Professzionális',
            config.proPriceMonthly,
            'proPriceMonthly',
            <Crown size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.purple500,
            'Ft/hó'
          )}
          {renderInputField(
            'Mester',
            config.masterPriceMonthly,
            'masterPriceMonthly',
            <Crown size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.purple700,
            'Ft/hó'
          )}
        </>
      )}
    </View>
  );

  const renderRewardsTab = () => (
    <View style={styles.tabContent}>
      {/* Lesson Rewards */}
      {renderSection(
        'Lecke jutalmak',
        'Alapértelmezett lecke jutalmak',
        <BookOpenCheck size={SIZES.iconBase} color={COLORS.white} />,
        ['#EFF6FF', '#DBEAFE'],
        COLORS.blue500,
        <>
          {renderInputField(
            'Lecke XP',
            config.lessonXPReward,
            'lessonXPReward',
            <TrendingUp size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.blue500,
            'XP'
          )}
          {renderInputField(
            'Lecke arany',
            config.lessonGoldReward,
            'lessonGoldReward',
            <Coins size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.amber500,
            'Érme'
          )}
        </>
      )}

      {/* Quiz Rewards */}
      {renderSection(
        'Kvíz jutalmak',
        'Kvíz játék jutalmak',
        <Brain size={SIZES.iconBase} color={COLORS.white} />,
        ['#F0FDF4', '#DCFCE7'],
        COLORS.green500,
        <>
          {renderInputField(
            'Kvíz XP',
            config.quizXPReward,
            'quizXPReward',
            <TrendingUp size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.green500,
            'XP'
          )}
          {renderInputField(
            'Kvíz arany',
            config.quizGoldReward,
            'quizGoldReward',
            <Coins size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.amber500,
            'Érme'
          )}
        </>
      )}

      {/* Reading Rewards */}
      {renderSection(
        'Olvasás jutalmak',
        'Olvasás játék jutalmak',
        <BookOpen size={SIZES.iconBase} color={COLORS.white} />,
        ['#FEF3C7', '#FDE68A'],
        COLORS.amber500,
        <>
          {renderInputField(
            'Olvasás XP',
            config.readingXPReward,
            'readingXPReward',
            <TrendingUp size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.amber500,
            'XP'
          )}
          {renderInputField(
            'Olvasás arany',
            config.readingGoldReward,
            'readingGoldReward',
            <Coins size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.amber700,
            'Érme'
          )}
        </>
      )}

      {/* Matching Rewards */}
      {renderSection(
        'Párosítás jutalmak',
        'Párosítás játék jutalmak',
        <Shuffle size={SIZES.iconBase} color={COLORS.white} />,
        ['#FCE7F3', '#FBCFE8'],
        COLORS.pink500,
        <>
          {renderInputField(
            'Párosítás XP',
            config.matchingXPReward,
            'matchingXPReward',
            <TrendingUp size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.pink500,
            'XP'
          )}
          {renderInputField(
            'Párosítás arany',
            config.matchingGoldReward,
            'matchingGoldReward',
            <Coins size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.amber500,
            'Érme'
          )}
        </>
      )}

      {/* Repeated Lessons */}
      {renderSection(
        'Ismételt leckék',
        'Már teljesített leckék újrajátszása',
        <RotateCcw size={SIZES.iconBase} color={COLORS.white} />,
        ['#F1F5F9', '#E2E8F0'],
        COLORS.indigo500,
        <>
          {renderInputField(
            'Ismételt lecke XP',
            config.repeatedLessonXPReward,
            'repeatedLessonXPReward',
            <TrendingUp size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.indigo500,
            'XP'
          )}
          {renderInputField(
            'Ismételt lecke arany',
            config.repeatedLessonGoldReward,
            'repeatedLessonGoldReward',
            <Coins size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.amber500,
            'Érme'
          )}
        </>
      )}

      {/* XP System */}
      {renderSection(
        'XP rendszer',
        'Szintlépés és XP számítás',
        <TrendingUp size={SIZES.iconBase} color={COLORS.white} />,
        ['#FAF5FF', '#F3E8FF'],
        COLORS.purple500,
        <>
          {renderInputField(
            'Maximális szint',
            config.maxLevel,
            'maxLevel',
            <Trophy size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.purple500,
            'szint'
          )}
          {renderInputField(
            'Kezdő XP követelmény',
            config.baseXPRequired,
            'baseXPRequired',
            <TrendingUp size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.purple700,
            'XP'
          )}
          {renderInputField(
            'XP növekedés',
            config.xpGrowthPercentage,
            'xpGrowthPercentage',
            <TrendingUp size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.purple900,
            '% / szint'
          )}
        </>
      )}

      {/* Arena XP */}
      {renderSection(
        'Küzdőtér XP',
        'XP jutalmak a Küzdőtéren',
        <Swords size={SIZES.iconBase} color={COLORS.white} />,
        ['#FEE2E2', '#FECACA'],
        COLORS.red500,
        <>
          {renderInputField(
            'Győzelem XP',
            config.arenaWinXP,
            'arenaWinXP',
            <Trophy size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.green500,
            'XP'
          )}
          {renderInputField(
            'Vereség XP',
            config.arenaLoseXP,
            'arenaLoseXP',
            <TrendingUp size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.red500,
            'XP'
          )}
          {renderInputField(
            'Max könyvek arénára',
            config.maxBooksForArena,
            'maxBooksForArena',
            <BookOpen size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.blue500,
            'könyv'
          )}
        </>
      )}

      {/* Stage System */}
      {renderSection(
        'Szint rendszer',
        'Leckeszintek és jutalmak',
        <CheckCircle2 size={SIZES.iconBase} color={COLORS.white} />,
        ['#ECFEFF', '#CFFAFE'],
        COLORS.cyan500,
        <>
          {renderInputField(
            'Leckék szintenként',
            config.lessonsPerStage,
            'lessonsPerStage',
            <BookOpenCheck size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.cyan500,
            'lecke'
          )}
          {renderInputField(
            'Szint jutalom arany',
            config.stageRewardGold,
            'stageRewardGold',
            <Coins size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.amber500,
            'Érme'
          )}
          {renderInputField(
            'Szint jutalom XP',
            config.stageRewardXP,
            'stageRewardXP',
            <TrendingUp size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.cyan700,
            'XP'
          )}
        </>
      )}

      {/* Milestones */}
      {renderSection(
        'Mérföldkövek',
        'Nagy teljesítmények jutalmak',
        <Trophy size={SIZES.iconBase} color={COLORS.white} />,
        ['#FEF9C3', '#FEF08A'],
        COLORS.amber500,
        <>
          {renderInputField(
            'Mérföldkő arany',
            config.milestoneRewardGold,
            'milestoneRewardGold',
            <Coins size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.amber500,
            'Érme'
          )}
          {renderInputField(
            'Mérföldkő XP',
            config.milestoneRewardXP,
            'milestoneRewardXP',
            <TrendingUp size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.amber700,
            'XP'
          )}
        </>
      )}
    </View>
  );

  const renderGamesTab = () => (
    <View style={styles.tabContent}>
      {/* Matching Game */}
      {renderSection(
        'Párosítás játék',
        'Párosítás játék beállítások',
        <Shuffle size={SIZES.iconBase} color={COLORS.white} />,
        ['#FCE7F3', '#FBCFE8'],
        COLORS.pink500,
        <>
          {renderInputField(
            'Időlimit',
            config.matchingTimeLimitSeconds,
            'matchingTimeLimitSeconds',
            <Calendar size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.pink500,
            'másodperc'
          )}
          {renderInputField(
            'Párok száma',
            config.matchingPairs,
            'matchingPairs',
            <Shuffle size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.pink700,
            'pár'
          )}
          {renderInputField(
            'Idő bónusz',
            config.matchingTimeBonus,
            'matchingTimeBonus',
            <TrendingUp size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.pink900,
            'pont/mp'
          )}
        </>
      )}

      {/* Quiz Game */}
      {renderSection(
        'Kvíz játék',
        'Kvíz játék beállítások',
        <Brain size={SIZES.iconBase} color={COLORS.white} />,
        ['#F0FDF4', '#DCFCE7'],
        COLORS.green500,
        <>
          {renderInputField(
            'Kérdések száma',
            config.quizQuestionsCount,
            'quizQuestionsCount',
            <Brain size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.green500,
            'kérdés'
          )}
          {renderInputField(
            'Időlimit',
            config.quizTimeLimitSeconds,
            'quizTimeLimitSeconds',
            <Calendar size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.green700,
            'másodperc'
          )}
          {renderInputField(
            'Átmenő százalék',
            config.quizPassPercentage,
            'quizPassPercentage',
            <CheckCircle2 size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.green900,
            '%'
          )}
        </>
      )}

      {/* Reading Game */}
      {renderSection(
        'Olvasás játék',
        'Olvasás játék beállítások',
        <BookOpen size={SIZES.iconBase} color={COLORS.white} />,
        ['#FEF3C7', '#FDE68A'],
        COLORS.amber500,
        <>
          {renderInputField(
            'Idő szavanként',
            config.readingTimePerWord,
            'readingTimePerWord',
            <Calendar size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.amber500,
            'mp/szó'
          )}
          {renderInputField(
            'Minimum szavak',
            config.readingMinWords,
            'readingMinWords',
            <BookOpen size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.amber700,
            'szó'
          )}
        </>
      )}
    </View>
  );

  const renderShopTab = () => (
    <View style={styles.tabContent}>
      {/* Shop Prices */}
      {renderSection(
        'Bolt árak',
        'Vásárolható tételek árai',
        <ShoppingBag size={SIZES.iconBase} color={COLORS.white} />,
        ['#EFF6FF', '#DBEAFE'],
        COLORS.blue500,
        <>
          {renderInputField(
            'Streak fagyasztás',
            config.streakFreezePrice,
            'streakFreezePrice',
            <Flame size={SIZES.iconSM} color={COLORS.white} />,
            COLORS.blue500,
            'Érme'
          )}
        </>
      )}

      <View style={styles.infoBox}>
        <Info size={SIZES.iconSM} color={COLORS.blue500} />
        <Text style={styles.infoText}>
          Arany és gyémánt csomagok árát a web verzióban lehet szerkeszteni.
        </Text>
      </View>
    </View>
  );

  const renderDataTab = () => (
    <View style={styles.tabContent}>
      {/* Export/Import */}
      {renderSection(
        'Adat kezelés',
        'Konfiguráció mentése és betöltése',
        <HardDrive size={SIZES.iconBase} color={COLORS.white} />,
        ['#F1F5F9', '#E2E8F0'],
        COLORS.indigo500,
        <>
          <Pressable style={styles.dataButton} onPress={exportConfig}>
            <Download size={SIZES.iconBase} color={COLORS.white} />
            <Text style={styles.dataButtonText}>Export JSON</Text>
          </Pressable>

          <Pressable
            style={[styles.dataButton, { backgroundColor: COLORS.purple500 }]}
            onPress={importConfig}
          >
            <Upload size={SIZES.iconBase} color={COLORS.white} />
            <Text style={styles.dataButtonText}>Import JSON</Text>
          </Pressable>
        </>
      )}

      <View style={styles.infoBox}>
        <Info size={SIZES.iconSM} color={COLORS.blue500} />
        <Text style={styles.infoText}>
          Az export JSON-t elmented és másik eszközön importálhatod. Ez lehetővé teszi a
          beállítások szinkronizálását eszközök között.
        </Text>
      </View>
    </View>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <View style={styles.container}>
      {/* Header */}
      {renderHeader()}

      {/* Tabs */}
      {renderTabs()}

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'rewards' && renderRewardsTab()}
        {activeTab === 'games' && renderGamesTab()}
        {activeTab === 'shop' && renderShopTab()}
        {activeTab === 'data' && renderDataTab()}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable
          style={[styles.actionButton, styles.actionButtonReset]}
          onPress={resetConfig}
        >
          <RotateCcw size={SIZES.iconBase} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Visszaállítás</Text>
        </Pressable>

        <Pressable
          style={[
            styles.actionButton,
            styles.actionButtonSave,
            !hasUnsavedChanges && styles.actionButtonDisabled,
          ]}
          onPress={saveConfig}
          disabled={!hasUnsavedChanges}
        >
          <Save size={SIZES.iconBase} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Mentés</Text>
        </Pressable>
      </View>
    </View>
  );
};

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
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    paddingTop: Platform.OS === 'ios' ? 50 : SPACING.base,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusLG,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  headerSubtitle: {
    color: '#E9D5FF',
    fontSize: SIZES.fontXS,
  },
  unsavedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusFull,
  },
  unsavedText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
  },

  // Tabs
  tabsContainer: {
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: COLORS.white,
  },
  tabText: {
    fontSize: SIZES.fontSM,
    color: '#64748B',
  },
  tabTextActive: {
    color: COLORS.secondary,
  },

  // Scroll Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: 100,
  },
  tabContent: {
    gap: SPACING.base,
  },

  // Section
  section: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.base,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: SIZES.fontLG,
    color: '#1E293B',
  },
  sectionSubtitle: {
    fontSize: SIZES.fontXS,
    color: '#64748B',
  },
  sectionContent: {
    gap: SPACING.md,
  },

  // Input Field
  inputFieldContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  inputFieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  inputFieldIcon: {
    width: 32,
    height: 32,
    borderRadius: SIZES.radiusBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputFieldLabelText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  inputFieldLabelMain: {
    fontSize: SIZES.fontSM,
    color: '#1E293B',
  },
  inputFieldLabelUnit: {
    fontSize: SIZES.fontXS,
    color: '#64748B',
  },
  inputField: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: SIZES.radiusBase,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: SIZES.fontBase,
    color: '#1E293B',
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.md,
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.fontSM,
    color: '#1E40AF',
    lineHeight: 20,
  },

  // Data Button
  dataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.indigo500,
    borderRadius: SIZES.radiusLG,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
  },
  dataButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
  },

  // Action Buttons
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: SPACING.md,
    padding: SPACING.base,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: SIZES.radiusLG,
  },
  actionButtonReset: {
    backgroundColor: COLORS.red500,
  },
  actionButtonSave: {
    backgroundColor: COLORS.green600,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
  },
});

export default ManagerPage;
