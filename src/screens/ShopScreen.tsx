/**
 * ShopScreen - REACT NATIVE VERSION
 *
 * Bolt képernyő - Erőforrások és bónuszok vásárlása
 * - Balance card (Gold, Diamonds, Streak Freezes)
 * - Streak Freeze vásárlás (aranyért)
 * - Gold vásárlás (valódi pénzért - 4 csomag)
 * - Diamond vásárlás (aranyért - 4 csomag)
 * - 2-column grid layout
 * - "BEST" és "BONUS" badge-ek
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  ShoppingBag,
  Coins,
  Flame,
  Gem,
  CreditCard,
  Sparkles,
} from 'lucide-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type ShopScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Shop'>;
type ShopScreenRouteProp = RouteProp<RootStackParamList, 'Shop'>;

interface ShopScreenProps {
  navigation: ShopScreenNavigationProp;
  route: ShopScreenRouteProp;
}

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  purple900: '#581C87',
  purple800: '#7E22CE',
  purple600: '#9333EA',
  purple500: '#A855F7',
  purple400: '#C084FC',
  pink500: '#EC4899',
  orange900: '#7C2D12',
  orange800: '#9A3412',
  orange700: '#C2410C',
  orange600: '#EA580C',
  orange500: '#F97316',
  orange400: '#FB923C',
  yellow900: '#78350F',
  yellow800: '#92400E',
  yellow700: '#A16207',
  yellow600: '#CA8A04',
  yellow500: '#EAB308',
  yellow400: '#FACC15',
  yellow300: '#FDE047',
  yellow200: '#FEF08A',
  yellow100: '#FEF9C3',
  yellow50: '#FEFCE8',
  cyan800: '#164E63',
  cyan700: '#0E7490',
  cyan600: '#0891B2',
  cyan500: '#06B6D4',
  cyan400: '#22D3EE',
  cyan200: '#A5F3FC',
  cyan50: '#ECFEFF',
  blue600: '#2563EB',
  red600: '#DC2626',
  purple50: '#FAF5FF',
  orange50: '#FFF7ED',
  orangeBorder: '#FED7AA',
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
  font2XL: 24,
  borderThin: 1,
  borderMedium: 2,
  radiusSM: 8,
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
// GAME CONFIG
// ============================================

const GAME_CONFIG = {
  streakFreezeGoldCost: 50,
  gold100Price: 990,
  gold500Price: 4990,
  gold1000Price: 9990,
  gold5000Price: 39990,
  diamond1GoldCost: 10,
  diamond10GoldCost: 90,
  diamond50GoldCost: 400,
  diamond100GoldCost: 750,
};

// ============================================
// COMPONENT
// ============================================

export default function ShopScreen({ navigation, route }: ShopScreenProps) {
  const { coins, gems, onCoinsChange, onGemsChange } = route.params;

  // For this demo, we'll use coins as gold and gems as diamonds
  const gold = coins;
  const diamonds = gems;
  const streakFreezes = 2; // Mock value

  // ============================================
  // HANDLERS
  // ============================================

  const handleBack = () => {
    navigation.goBack();
  };

  const handleGoldPurchase = (amount: number, price: number) => {
    // Azonnal hozzáadjuk az aranyat
    onCoinsChange(gold + amount);
    Alert.alert('Sikeres!', `${amount} arany hozzáadva!`);
  };

  const handleDiamondPurchase = (amount: number, cost: number) => {
    if (gold < cost) {
      Alert.alert('Hiba', 'Nincs elég aranyad!');
      return;
    }
    onCoinsChange(gold - cost);
    onGemsChange(diamonds + amount);
    Alert.alert('Sikeres!', `${amount} gyémánt vásárlása sikeres!`);
  };

  const handleStreakFreezePurchase = () => {
    if (gold < GAME_CONFIG.streakFreezeGoldCost) {
      Alert.alert('Hiba', 'Nincs elég aranyad!');
      return;
    }
    onCoinsChange(gold - GAME_CONFIG.streakFreezeGoldCost);
    Alert.alert('Sikeres!', 'Széria pont vásárlása sikeres!');
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.purple50} translucent={false} />
      <LinearGradient
        colors={[COLORS.purple50, COLORS.white]}
        style={styles.gradient}
      >
        {/* Top spacer for iPhone notch/camera */}
        <View style={styles.topSpacer} />

        {/* Header - FIXED POSITION */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={SIZES.iconBase} color={COLORS.purple800} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <View style={styles.headerTitle}>
              <ShoppingBag size={SIZES.iconLG} color={COLORS.purple500} />
              <Text style={styles.headerTitleText}>Bolt</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Vásárolj erőforrásokat és bónuszokat
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Current Balance */}
          <LinearGradient
            colors={[COLORS.purple500, COLORS.pink500]}
            style={styles.balanceCard}
          >
            <Text style={styles.balanceText}>Jelenlegi egyenleged</Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <Coins size={SIZES.iconBase} color={COLORS.white} />
                <Text style={styles.balanceValue}>
                  {gold.toLocaleString('hu-HU')}
                </Text>
              </View>
              <View style={styles.balanceItem}>
                <Gem size={SIZES.iconBase} color={COLORS.white} />
                <Text style={styles.balanceValue}>{diamonds}</Text>
              </View>
              <View style={styles.balanceItem}>
                <Flame size={SIZES.iconBase} color={COLORS.white} />
                <Text style={styles.balanceValue}>{streakFreezes}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Streak Freeze Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Flame size={SIZES.iconBase} color={COLORS.orange500} />
              <Text style={[styles.sectionTitle, { color: COLORS.orange900 }]}>
                Széria Védelem
              </Text>
            </View>

            <View style={styles.streakCard}>
              <View style={styles.streakCardContent}>
                <View style={styles.streakTextContainer}>
                  <Text style={styles.streakTitle}>Széria Pont</Text>
                  <Text style={styles.streakDescription}>
                    Ha kihagysz egy napot, a széria pont automatikusan megvédi a
                    szériádat.
                  </Text>
                  <View style={styles.streakCurrent}>
                    <Flame size={SIZES.iconSM} color={COLORS.orange800} />
                    <Text style={styles.streakCurrentText}>
                      Jelenleg:{' '}
                      <Text style={styles.streakBold}>{streakFreezes} db</Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.streakPriceContainer}>
                  <Text style={styles.streakPrice}>
                    {GAME_CONFIG.streakFreezeGoldCost}
                  </Text>
                  <View style={styles.streakPriceLabel}>
                    <Coins size={12} color={COLORS.orange700} />
                    <Text style={styles.streakPriceLabelText}>arany</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.streakButton,
                      gold < GAME_CONFIG.streakFreezeGoldCost &&
                        styles.buttonDisabled,
                    ]}
                    onPress={handleStreakFreezePurchase}
                    disabled={gold < GAME_CONFIG.streakFreezeGoldCost}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.streakButtonText}>Vásárlás</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Gold Purchase Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Coins size={SIZES.iconBase} color={COLORS.yellow500} />
              <Text style={[styles.sectionTitle, { color: COLORS.yellow900 }]}>
                Arany vásárlása
              </Text>
            </View>

            <View style={styles.grid}>
              {/* Gold 100 */}
              <TouchableOpacity
                style={styles.goldCard}
                onPress={() =>
                  handleGoldPurchase(100, GAME_CONFIG.gold100Price)
                }
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <LinearGradient
                    colors={[COLORS.yellow400, COLORS.orange600]}
                    style={styles.iconCircle}
                  >
                    <Coins size={SIZES.iconLG} color={COLORS.white} />
                  </LinearGradient>
                  <Text style={styles.goldAmount}>100</Text>
                  <Text style={styles.goldLabel}>arany</Text>
                  <View style={styles.goldButton}>
                    <CreditCard size={14} color={COLORS.white} />
                    <Text style={styles.goldButtonText}>
                      {GAME_CONFIG.gold100Price.toLocaleString('hu-HU')} Ft
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Gold 500 */}
              <TouchableOpacity
                style={styles.goldCard}
                onPress={() =>
                  handleGoldPurchase(500, GAME_CONFIG.gold500Price)
                }
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <LinearGradient
                    colors={[COLORS.yellow400, COLORS.orange600]}
                    style={styles.iconCircle}
                  >
                    <Coins size={SIZES.iconLG} color={COLORS.white} />
                  </LinearGradient>
                  <Text style={styles.goldAmount}>500</Text>
                  <Text style={styles.goldLabel}>arany</Text>
                  <View style={styles.goldButton}>
                    <CreditCard size={14} color={COLORS.white} />
                    <Text style={styles.goldButtonText}>
                      {GAME_CONFIG.gold500Price.toLocaleString('hu-HU')} Ft
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Gold 1000 */}
              <TouchableOpacity
                style={styles.goldCard}
                onPress={() =>
                  handleGoldPurchase(1000, GAME_CONFIG.gold1000Price)
                }
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <LinearGradient
                    colors={[COLORS.yellow400, COLORS.orange600]}
                    style={styles.iconCircle}
                  >
                    <Coins size={SIZES.iconLG} color={COLORS.white} />
                  </LinearGradient>
                  <Text style={styles.goldAmount}>1,000</Text>
                  <Text style={styles.goldLabel}>arany</Text>
                  <View style={styles.goldButton}>
                    <CreditCard size={14} color={COLORS.white} />
                    <Text style={styles.goldButtonText}>
                      {GAME_CONFIG.gold1000Price.toLocaleString('hu-HU')} Ft
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Gold 5000 (BEST) */}
              <TouchableOpacity
                style={styles.goldCard}
                onPress={() =>
                  handleGoldPurchase(5000, GAME_CONFIG.gold5000Price)
                }
                activeOpacity={0.7}
              >
                <View style={styles.bestBadge}>
                  <Text style={styles.badgeText}>BEST</Text>
                </View>
                <View style={styles.cardContent}>
                  <LinearGradient
                    colors={[COLORS.orange400, COLORS.red600]}
                    style={styles.iconCircle}
                  >
                    <Sparkles size={SIZES.iconLG} color={COLORS.white} />
                  </LinearGradient>
                  <Text style={styles.goldAmount}>5,000</Text>
                  <Text style={styles.goldLabel}>arany</Text>
                  <LinearGradient
                    colors={[COLORS.yellow600, COLORS.orange600]}
                    style={styles.goldButton}
                  >
                    <CreditCard size={14} color={COLORS.white} />
                    <Text style={styles.goldButtonText}>
                      {GAME_CONFIG.gold5000Price.toLocaleString('hu-HU')} Ft
                    </Text>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Diamond Purchase Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Gem size={SIZES.iconBase} color={COLORS.cyan500} />
              <Text style={[styles.sectionTitle, { color: COLORS.cyan800 }]}>
                Gyémánt vásárlása aranyért
              </Text>
            </View>

            <View style={styles.grid}>
              {/* Diamond 1 */}
              <TouchableOpacity
                style={[
                  styles.diamondCard,
                  gold < GAME_CONFIG.diamond1GoldCost && styles.cardDisabled,
                ]}
                onPress={() =>
                  handleDiamondPurchase(1, GAME_CONFIG.diamond1GoldCost)
                }
                disabled={gold < GAME_CONFIG.diamond1GoldCost}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <LinearGradient
                    colors={[COLORS.cyan400, COLORS.blue600]}
                    style={styles.iconCircle}
                  >
                    <Gem size={SIZES.iconLG} color={COLORS.white} />
                  </LinearGradient>
                  <Text style={styles.diamondAmount}>1</Text>
                  <Text style={styles.diamondLabel}>gyémánt</Text>
                  <View style={styles.diamondButton}>
                    <Coins size={14} color={COLORS.white} />
                    <Text style={styles.diamondButtonText}>
                      {GAME_CONFIG.diamond1GoldCost} arany
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Diamond 10 */}
              <TouchableOpacity
                style={[
                  styles.diamondCard,
                  gold < GAME_CONFIG.diamond10GoldCost && styles.cardDisabled,
                ]}
                onPress={() =>
                  handleDiamondPurchase(10, GAME_CONFIG.diamond10GoldCost)
                }
                disabled={gold < GAME_CONFIG.diamond10GoldCost}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <LinearGradient
                    colors={[COLORS.cyan400, COLORS.blue600]}
                    style={styles.iconCircle}
                  >
                    <Gem size={SIZES.iconLG} color={COLORS.white} />
                  </LinearGradient>
                  <Text style={styles.diamondAmount}>10</Text>
                  <Text style={styles.diamondLabel}>gyémánt</Text>
                  <View style={styles.diamondButton}>
                    <Coins size={14} color={COLORS.white} />
                    <Text style={styles.diamondButtonText}>
                      {GAME_CONFIG.diamond10GoldCost} arany
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Diamond 50 */}
              <TouchableOpacity
                style={[
                  styles.diamondCard,
                  gold < GAME_CONFIG.diamond50GoldCost && styles.cardDisabled,
                ]}
                onPress={() =>
                  handleDiamondPurchase(50, GAME_CONFIG.diamond50GoldCost)
                }
                disabled={gold < GAME_CONFIG.diamond50GoldCost}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  <LinearGradient
                    colors={[COLORS.cyan400, COLORS.purple600]}
                    style={styles.iconCircle}
                  >
                    <Gem size={SIZES.iconLG} color={COLORS.white} />
                  </LinearGradient>
                  <Text style={styles.diamondAmount}>50</Text>
                  <Text style={styles.diamondLabel}>gyémánt</Text>
                  <View style={styles.diamondButton}>
                    <Coins size={14} color={COLORS.white} />
                    <Text style={styles.diamondButtonText}>
                      {GAME_CONFIG.diamond50GoldCost} arany
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Diamond 100 (BONUS) */}
              <TouchableOpacity
                style={[
                  styles.diamondCard,
                  gold < GAME_CONFIG.diamond100GoldCost && styles.cardDisabled,
                ]}
                onPress={() =>
                  handleDiamondPurchase(100, GAME_CONFIG.diamond100GoldCost)
                }
                disabled={gold < GAME_CONFIG.diamond100GoldCost}
                activeOpacity={0.7}
              >
                <View style={styles.bonusBadge}>
                  <Text style={styles.badgeText}>BONUS</Text>
                </View>
                <View style={styles.cardContent}>
                  <LinearGradient
                    colors={[COLORS.purple400, COLORS.pink500]}
                    style={styles.iconCircle}
                  >
                    <Sparkles size={SIZES.iconLG} color={COLORS.white} />
                  </LinearGradient>
                  <Text style={styles.diamondAmount}>100</Text>
                  <Text style={styles.diamondLabel}>gyémánt</Text>
                  <LinearGradient
                    colors={[COLORS.cyan600, COLORS.purple600]}
                    style={styles.diamondButton}
                  >
                    <Coins size={14} color={COLORS.white} />
                    <Text style={styles.diamondButtonText}>
                      {GAME_CONFIG.diamond100GoldCost} arany
                    </Text>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.purple50,
  },
  gradient: {
    flex: 1,
  },
  topSpacer: {
    height: 10,
    backgroundColor: COLORS.purple50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: 256,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingTop: 50,
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.purple50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(168, 85, 247, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitleText: {
    fontSize: SIZES.fontXL,
    color: COLORS.purple900,
    fontWeight: FONT_WEIGHT.bold,
  },
  headerSubtitle: {
    fontSize: SIZES.fontSM,
    color: COLORS.purple800,
  },

  // Balance Card
  balanceCard: {
    padding: SPACING.base,
    marginBottom: SPACING.lg,
    borderRadius: SIZES.radiusXL,
  },
  balanceText: {
    fontSize: SIZES.fontSM,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.sm,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  balanceValue: {
    fontSize: SIZES.fontXL,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
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
    fontWeight: FONT_WEIGHT.bold,
  },

  // Separator
  separator: {
    height: SIZES.borderThin,
    backgroundColor: '#E5E7EB',
    marginVertical: SPACING.lg,
  },

  // Streak Freeze Card
  streakCard: {
    padding: SPACING.base,
    borderWidth: SIZES.borderMedium,
    borderColor: COLORS.orangeBorder,
    backgroundColor: COLORS.orange50,
    borderRadius: SIZES.radiusXL,
  },
  streakCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.base,
  },
  streakTextContainer: {
    flex: 1,
  },
  streakTitle: {
    color: COLORS.orange900,
    marginBottom: SPACING.sm,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.semibold,
  },
  streakDescription: {
    fontSize: SIZES.fontSM,
    color: COLORS.orange700,
    marginBottom: SPACING.md,
  },
  streakCurrent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  streakCurrentText: {
    fontSize: SIZES.fontSM,
    color: COLORS.orange800,
  },
  streakBold: {
    fontWeight: FONT_WEIGHT.bold,
  },
  streakPriceContainer: {
    alignItems: 'center',
  },
  streakPrice: {
    fontSize: SIZES.font2XL,
    color: COLORS.orange600,
    marginBottom: SPACING.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  streakPriceLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SPACING.sm,
  },
  streakPriceLabelText: {
    fontSize: SIZES.fontXS,
    color: COLORS.orange700,
  },
  streakButton: {
    backgroundColor: COLORS.orange500,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
  },
  streakButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },

  // Gold Card
  goldCard: {
    width: '48%',
    padding: SPACING.base,
    borderWidth: SIZES.borderMedium,
    borderColor: COLORS.yellow300,
    backgroundColor: COLORS.yellow50,
    borderRadius: SIZES.radiusXL,
    position: 'relative',
  },
  cardContent: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    marginBottom: SPACING.sm,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldAmount: {
    fontSize: SIZES.font2XL,
    color: COLORS.yellow700,
    marginBottom: 4,
    fontWeight: FONT_WEIGHT.bold,
  },
  goldLabel: {
    fontSize: SIZES.fontXS,
    color: COLORS.yellow600,
    marginBottom: SPACING.md,
  },
  goldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: COLORS.yellow600,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    width: '100%',
  },
  goldButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Diamond Card
  diamondCard: {
    width: '48%',
    padding: SPACING.base,
    borderWidth: SIZES.borderMedium,
    borderColor: COLORS.cyan200,
    backgroundColor: COLORS.cyan50,
    borderRadius: SIZES.radiusXL,
    position: 'relative',
  },
  diamondAmount: {
    fontSize: SIZES.font2XL,
    color: COLORS.cyan700,
    marginBottom: 4,
    fontWeight: FONT_WEIGHT.bold,
  },
  diamondLabel: {
    fontSize: SIZES.fontXS,
    color: COLORS.cyan600,
    marginBottom: SPACING.md,
  },
  diamondButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: COLORS.cyan600,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    width: '100%',
  },
  diamondButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Badges
  bestBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.red600,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: SIZES.radiusFull,
    zIndex: 1,
  },
  bonusBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.purple600,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: SIZES.radiusFull,
    zIndex: 1,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
  },

  // Disabled States
  buttonDisabled: {
    opacity: 0.5,
  },
  cardDisabled: {
    opacity: 0.6,
  },
});
