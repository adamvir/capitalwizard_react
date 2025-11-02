/**
 * SubscriptionPage - REACT NATIVE VERSION
 * 
 * Előfizetés képernyő - 3 tier (Free, Pro, Master)
 * - Pricing cards (Free/Pro/Master)
 * - Monthly/Yearly billing toggle
 * - Feature lists per tier
 * - Popular badge (Pro)
 * - Current subscription indicator
 * - Benefits section
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ChevronLeft,
  Crown,
  Zap,
  BookOpen,
  TrendingUp,
  Shield,
  Sparkles,
  Check,
  Star,
  Flame,
  Trophy,
  Target,
  Users,
  Download,
  Infinity,
} from 'lucide-react-native';

// NAVIGATION: React Navigation használata
// import { useNavigation } from '@react-navigation/native';

// ============================================
// CONSTANTS
// ============================================

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  white: '#FFFFFF',
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748B',
  slate400: '#94A3B8',
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
  blue700: '#1D4ED8',
  blue600: '#2563EB',
  blue500: '#3B82F6',
  blue400: '#60A5FA',
  blue300: '#93C5FD',
  cyan600: '#06B6D4',
  yellow500: '#EAB308',
  yellow400: '#FBBF24',
  orange600: '#EA580C',
  orange400: '#FB923C',
  red600: '#EF4444',
  green600: '#16A34A',
  green500: '#059669',
  green400: '#4ADE80',
  green300: '#86EFAC',
  yellow300: '#FDE047',
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
  font4XL: 36,
  borderThin: 1,
  borderMedium: 2,
  radiusSM: 8,
  radiusLG: 12,
  radiusXL: 16,
  radius2XL: 20,
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

interface SubscriptionPageProps {
  onBack: () => void;
  subscriptionTier: 'free' | 'pro' | 'master';
  onSubscriptionChange: (tier: 'free' | 'pro' | 'master') => void;
}

type BillingPeriod = 'monthly' | 'yearly';

interface Feature {
  icon: any;
  text: string;
  highlight?: boolean;
}

interface Plan {
  id: 'free' | 'pro' | 'ultimate';
  name: string;
  subtitle: string;
  icon: any;
  price: {
    monthly: number;
    yearly: number;
  };
  popular?: boolean;
  features: Feature[];
  badge?: string;
  gradientColors: string[];
  borderColor: string;
}

// ============================================
// PLAN DATA
// ============================================

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Alapszint',
    subtitle: 'Kezdőknek',
    icon: BookOpen,
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      { icon: BookOpen, text: '3 lecke naponta' },
      { icon: Trophy, text: '5 küzdőtéri játék naponta' },
      { icon: Star, text: 'Alapvető könyvtár hozzáférés' },
      { icon: TrendingUp, text: 'Napi sorozat követés' },
      { icon: Target, text: 'Alapvető statisztikák' },
    ],
    badge: 'Ingyenes',
    gradientColors: [COLORS.slate600, COLORS.slate700],
    borderColor: COLORS.slate500,
  },
  {
    id: 'pro',
    name: 'Professzionális',
    subtitle: 'Legtöbbeknek',
    icon: Zap,
    price: {
      monthly: 4990,
      yearly: 49990,
    },
    popular: true,
    features: [
      { icon: Infinity, text: 'Korlátlan leckék', highlight: true },
      { icon: Infinity, text: 'Korlátlan küzdőtér játékok', highlight: true },
      { icon: BookOpen, text: 'Teljes könyvtár (15 könyv)' },
      { icon: Download, text: 'Offline mód' },
      { icon: TrendingUp, text: 'Részletes statisztikák' },
      { icon: Flame, text: '2x gyorsabb XP gyűjtés' },
      { icon: Crown, text: 'Exkluzív jelvények' },
    ],
    badge: 'Legtöbb választás',
    gradientColors: [COLORS.purple600, COLORS.pink500],
    borderColor: COLORS.purple400,
  },
  {
    id: 'ultimate',
    name: 'Mester',
    subtitle: 'Elkötelezetteknek',
    icon: Crown,
    price: {
      monthly: 9990,
      yearly: 99990,
    },
    features: [
      { icon: Sparkles, text: 'Minden Pro funkció', highlight: true },
      { icon: Users, text: '1-1 mentori támogatás' },
      { icon: Target, text: 'Személyre szabott tanulási terv' },
      { icon: Trophy, text: 'Exkluzív kihívások' },
      { icon: Star, text: 'Korai hozzáférés új funkciókhoz' },
      { icon: Shield, text: 'Prioritás támogatás' },
      { icon: Crown, text: 'Arany mester jelvény' },
      { icon: Flame, text: '3x gyorsabb XP gyűjtés' },
    ],
    badge: 'Legjobb érték',
    gradientColors: [COLORS.yellow500, COLORS.orange600],
    borderColor: COLORS.yellow400,
  },
];

// ============================================
// COMPONENT
// ============================================

export function SubscriptionPage({
  onBack,
  subscriptionTier,
  onSubscriptionChange,
}: SubscriptionPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('yearly');

  // NAVIGATION FIX - React Native:
  // const navigation = useNavigation();

  // ============================================
  // HELPERS
  // ============================================

  const handleBack = () => {
    // NAVIGATION: navigation.goBack()
    if (onBack) {
      onBack();
    }
  };

  const handleSelectPlan = (planId: 'free' | 'pro' | 'ultimate') => {
    if (planId === 'free') {
      onSubscriptionChange('free');
    } else if (planId === 'pro') {
      onSubscriptionChange('pro');
    } else if (planId === 'ultimate') {
      onSubscriptionChange('master');
    }
  };

  const isCurrentPlan = (planId: 'free' | 'pro' | 'ultimate') => {
    if (planId === 'ultimate') {
      return subscriptionTier === 'master';
    }
    return subscriptionTier === planId;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Ingyenes';
    return `${price.toLocaleString('hu-HU')} Ft`;
  };

  const getMonthlyPrice = (plan: Plan) => {
    if (plan.price.monthly === 0) return formatPrice(0);
    if (billingPeriod === 'yearly') {
      const monthly = Math.floor(plan.price.yearly / 12);
      return `${monthly.toLocaleString('hu-HU')} Ft`;
    }
    return formatPrice(plan.price.monthly);
  };

  const getSavings = (plan: Plan) => {
    if (plan.price.yearly === 0) return 0;
    const yearlyMonthly = plan.price.yearly / 12;
    const savings =
      ((plan.price.monthly - yearlyMonthly) / plan.price.monthly) * 100;
    return Math.round(savings);
  };

  const toggleBilling = () => {
    setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly');
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <LinearGradient
      colors={[COLORS.slate900, `${COLORS.purple900}33`, COLORS.slate900]}
      style={styles.container}
    >
      {/* Header */}
      <LinearGradient
        colors={[`${COLORS.slate900}f2`, `${COLORS.purple900}cc`]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={SIZES.iconBase} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <View style={styles.headerTitleRow}>
              <Crown size={SIZES.iconBase} color={COLORS.yellow400} />
              <Text style={styles.headerTitle}>Előfizetési Csomagok</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Válaszd a számodra megfelelő csomagot
            </Text>
          </View>

          {subscriptionTier !== 'free' && (
            <LinearGradient
              colors={
                subscriptionTier === 'master'
                  ? [COLORS.purple600, COLORS.pink500]
                  : [COLORS.blue600, COLORS.cyan600]
              }
              style={styles.currentTierBadge}
            >
              <Text style={styles.currentTierText}>
                {subscriptionTier === 'master'
                  ? 'Master előfizető'
                  : 'Pro előfizető'}
              </Text>
            </LinearGradient>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Crown
            size={64}
            color={COLORS.yellow400}
            style={styles.heroIcon}
          />
          <Text style={styles.heroTitle}>Fejleszd tudásod prémiummal</Text>
          <Text style={styles.heroSubtitle}>
            Korlátlan hozzáférés, egyéni tanulási út, és több!
          </Text>
        </View>

        {/* Billing Toggle */}
        <View style={styles.billingToggleContainer}>
          <Text
            style={[
              styles.billingLabel,
              billingPeriod === 'monthly' && styles.billingLabelActive,
            ]}
          >
            Havi
          </Text>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleBilling}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.toggleThumb,
                billingPeriod === 'yearly' && styles.toggleThumbActive,
              ]}
            />
          </TouchableOpacity>

          <View style={styles.yearlyLabelContainer}>
            <Text
              style={[
                styles.billingLabel,
                billingPeriod === 'yearly' && styles.billingLabelActive,
              ]}
            >
              Éves
            </Text>
            {billingPeriod === 'yearly' && (
              <LinearGradient
                colors={[COLORS.green600, COLORS.green500]}
                style={styles.savingsBadge}
              >
                <Text style={styles.savingsText}>-17%</Text>
              </LinearGradient>
            )}
          </View>
        </View>

        {/* Pricing Cards */}
        <View style={styles.cardsContainer}>
          {plans.map((plan, index) => (
            <View key={plan.id} style={styles.cardWrapper}>
              {/* Popular Badge */}
              {plan.popular && (
                <View style={styles.popularBadgeContainer}>
                  <LinearGradient
                    colors={[COLORS.purple600, COLORS.pink500]}
                    style={styles.popularBadge}
                  >
                    <Star size={12} color={COLORS.yellow300} fill={COLORS.yellow300} />
                    <Text style={styles.popularBadgeText}>{plan.badge}</Text>
                    <Star size={12} color={COLORS.yellow300} fill={COLORS.yellow300} />
                  </LinearGradient>
                </View>
              )}

              {/* Regular Badge */}
              {plan.badge && !plan.popular && (
                <View style={styles.regularBadgeContainer}>
                  <View style={styles.regularBadge}>
                    <Text style={styles.regularBadgeText}>{plan.badge}</Text>
                  </View>
                </View>
              )}

              {/* Card */}
              <LinearGradient
                colors={[`${COLORS.slate800}cc`, `${COLORS.slate900}99`]}
                style={[
                  styles.card,
                  {
                    borderColor: plan.popular
                      ? `${COLORS.purple500}cc`
                      : `${plan.borderColor}80`,
                  },
                ]}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <LinearGradient
                    colors={plan.gradientColors}
                    style={styles.cardIconContainer}
                  >
                    <plan.icon size={SIZES.iconLG} color={COLORS.white} />
                  </LinearGradient>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>{plan.name}</Text>
                    <Text style={styles.cardSubtitle}>{plan.subtitle}</Text>
                  </View>
                </View>

                {/* Price */}
                <View style={styles.priceContainer}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceAmount}>
                      {getMonthlyPrice(plan)}
                    </Text>
                    {plan.price.monthly > 0 && (
                      <Text style={styles.pricePeriod}>/hó</Text>
                    )}
                  </View>
                  {billingPeriod === 'yearly' && plan.price.yearly > 0 && (
                    <View style={styles.yearlyPriceInfo}>
                      <Text style={styles.yearlyPriceText}>
                        {formatPrice(plan.price.yearly)} évente
                      </Text>
                      <Text style={styles.savingsText2}>
                        Spórolj {getSavings(plan)}%-ot évente!
                      </Text>
                    </View>
                  )}
                </View>

                {/* Features */}
                <View style={styles.featuresContainer}>
                  {plan.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureRow}>
                      <LinearGradient
                        colors={
                          feature.highlight
                            ? plan.gradientColors
                            : [COLORS.slate700, COLORS.slate700]
                        }
                        style={styles.featureIconContainer}
                      >
                        <Check
                          size={12}
                          color={feature.highlight ? COLORS.white : COLORS.slate400}
                        />
                      </LinearGradient>
                      <Text
                        style={[
                          styles.featureText,
                          feature.highlight && styles.featureTextHighlight,
                        ]}
                      >
                        {feature.text}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* CTA Button */}
                <TouchableOpacity
                  onPress={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan(plan.id)}
                  activeOpacity={0.7}
                  style={{ marginTop: SPACING.lg }}
                >
                  {isCurrentPlan(plan.id) ? (
                    <View style={styles.ctaButtonCurrent}>
                      <Text style={styles.ctaButtonTextCurrent}>
                        Jelenlegi csomag
                      </Text>
                    </View>
                  ) : (
                    <LinearGradient
                      colors={plan.gradientColors}
                      style={styles.ctaButton}
                    >
                      <Text style={styles.ctaButtonText}>
                        Váltás erre a csomagra
                      </Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Benefits Section */}
        <LinearGradient
          colors={[`${COLORS.slate800}99`, `${COLORS.purple900}4d`]}
          style={styles.benefitsContainer}
        >
          <View style={styles.benefitsHeader}>
            <Sparkles size={SIZES.iconBase} color={COLORS.purple400} />
            <Text style={styles.benefitsTitle}>
              Miért érdemes prémiumra váltani?
            </Text>
          </View>
          <View style={styles.benefitsGrid}>
            {[
              { icon: BookOpen, text: 'Teljes könyvtár' },
              { icon: Infinity, text: 'Korlátlan tanulás' },
              { icon: TrendingUp, text: 'Gyorsabb fejlődés' },
              { icon: Shield, text: 'Prioritás támogatás' },
            ].map((benefit, idx) => (
              <View key={idx} style={styles.benefitItem}>
                <benefit.icon size={SIZES.iconSM} color={COLORS.purple400} />
                <Text style={styles.benefitText}>{benefit.text}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Trust Section */}
        <View style={styles.trustContainer}>
          <View style={styles.trustRow}>
            <Shield size={SIZES.iconSM} color={COLORS.slate400} />
            <Text style={styles.trustRowText}>
              Biztonságos fizetés • Bármikor lemondható
            </Text>
          </View>
          <Text style={styles.trustText}>
            Több mint 10,000 tanuló fejleszti pénzügyi tudását a platformunkon
          </Text>
        </View>
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
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: SIZES.borderThin,
    borderBottomColor: `${COLORS.purple500}4d`,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    width: 36,
    height: 36,
    backgroundColor: `${COLORS.slate800}e6`,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.slate600}80`,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    fontSize: SIZES.fontLG,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },
  headerSubtitle: {
    color: COLORS.purple200,
    fontSize: SIZES.fontXS,
  },
  currentTierBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusLG,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.purple400}80`,
  },
  currentTierText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: 96,
  },

  // Hero Section
  heroContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroIcon: {
    marginBottom: SPACING.md,
  },
  heroTitle: {
    fontSize: SIZES.font2XL,
    color: COLORS.yellow400,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    color: COLORS.slate300,
    fontSize: SIZES.fontSM,
    textAlign: 'center',
  },

  // Billing Toggle
  billingToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  billingLabel: {
    fontSize: SIZES.fontSM,
    color: COLORS.slate400,
  },
  billingLabelActive: {
    color: COLORS.white,
  },
  toggleButton: {
    position: 'relative',
    width: 56,
    height: 28,
    backgroundColor: COLORS.slate700,
    borderRadius: SIZES.radiusFull,
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.slate600,
    justifyContent: 'center',
  },
  toggleThumb: {
    position: 'absolute',
    left: 4,
    width: 20,
    height: 20,
    backgroundColor: COLORS.purple500,
    borderRadius: SIZES.radiusFull,
  },
  toggleThumbActive: {
    left: 32,
  },
  yearlyLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  savingsBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radiusFull,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.green400}80`,
  },
  savingsText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Pricing Cards
  cardsContainer: {
    gap: SPACING.base,
  },
  cardWrapper: {
    position: 'relative',
    marginBottom: SPACING.base,
  },

  // Popular Badge
  popularBadgeContainer: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: [{ translateX: -80 }],
    zIndex: 10,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusFull,
    borderWidth: SIZES.borderMedium,
    borderColor: COLORS.purple400,
  },
  popularBadgeText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Regular Badge
  regularBadgeContainer: {
    position: 'absolute',
    top: -8,
    right: SPACING.base,
    zIndex: 10,
  },
  regularBadge: {
    backgroundColor: COLORS.slate800,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusFull,
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.slate600,
  },
  regularBadgeText: {
    color: COLORS.slate300,
    fontSize: SIZES.fontXS,
  },

  // Card
  card: {
    borderRadius: SIZES.radius2XL,
    padding: SPACING.lg,
    borderWidth: SIZES.borderMedium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.base,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radiusXL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: SIZES.fontLG,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },
  cardSubtitle: {
    color: COLORS.slate400,
    fontSize: SIZES.fontXS,
  },

  // Price
  priceContainer: {
    marginBottom: SPACING.lg,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
  },
  priceAmount: {
    fontSize: SIZES.font4XL,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
  pricePeriod: {
    color: COLORS.slate400,
    fontSize: SIZES.fontSM,
  },
  yearlyPriceInfo: {
    marginTop: SPACING.xs,
  },
  yearlyPriceText: {
    color: COLORS.slate400,
    fontSize: SIZES.fontXS,
  },
  savingsText2: {
    color: COLORS.green400,
    fontSize: SIZES.fontXS,
  },

  // Features
  featuresContainer: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  featureIconContainer: {
    width: 20,
    height: 20,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: SIZES.fontSM,
    color: COLORS.slate300,
    flex: 1,
  },
  featureTextHighlight: {
    color: COLORS.white,
  },

  // CTA Button
  ctaButton: {
    paddingVertical: SPACING.md,
    borderRadius: SIZES.radiusXL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontSize: SIZES.fontSM,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },
  ctaButtonCurrent: {
    paddingVertical: SPACING.md,
    borderRadius: SIZES.radiusXL,
    backgroundColor: `${COLORS.slate700}80`,
    borderWidth: SIZES.borderMedium,
    borderColor: COLORS.slate600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonTextCurrent: {
    fontSize: SIZES.fontSM,
    color: COLORS.slate300,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Benefits Section
  benefitsContainer: {
    marginTop: 32,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.lg,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.purple500}4d`,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  benefitsTitle: {
    fontSize: SIZES.fontLG,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  benefitItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: `${COLORS.slate900}66`,
    borderRadius: SIZES.radiusLG,
    padding: 10,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.slate700}80`,
  },
  benefitText: {
    color: COLORS.slate300,
    fontSize: SIZES.fontXS,
    flex: 1,
  },

  // Trust Section
  trustContainer: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  trustRowText: {
    color: COLORS.slate400,
    fontSize: SIZES.fontXS,
  },
  trustText: {
    color: COLORS.slate500,
    fontSize: SIZES.fontXS,
    textAlign: 'center',
  },
});
