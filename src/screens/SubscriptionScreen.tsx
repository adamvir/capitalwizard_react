import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

// NAVIGATION: Navigáció típusa
type NavigationProp = NativeStackNavigationProp<any>;

type BillingPeriod = 'monthly' | 'yearly';

interface Plan {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  price: {
    monthly: number;
    yearly: number;
  };
  popular?: boolean;
  features: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    text: string;
    highlight?: boolean;
  }[];
  badge?: string;
}

interface SubscriptionScreenProps {
  route?: {
    params?: {
      subscriptionTier?: 'free' | 'pro' | 'master';
      onSubscriptionChange?: (tier: 'free' | 'pro' | 'master') => void;
    };
  };
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Alapszint',
    icon: 'book-open-variant',
    color: 'slate',
    gradientFrom: 'from-slate-600',
    gradientTo: 'to-slate-700',
    borderColor: 'border-slate-500/50',
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      { icon: 'book-open-variant', text: '3 lecke naponta' },
      { icon: 'trophy', text: '5 küzdőtéri játék naponta' },
      { icon: 'star', text: 'Alapvető könyvtár hozzáférés' },
      { icon: 'trending-up', text: 'Napi sorozat követés' },
      { icon: 'target', text: 'Alapvető statisztikák' },
    ],
    badge: 'Ingyenes',
  },
  {
    id: 'pro',
    name: 'Professzionális',
    icon: 'flash',
    color: 'purple',
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-pink-600',
    borderColor: 'border-purple-400/50',
    price: {
      monthly: 4990,
      yearly: 49990,
    },
    popular: true,
    features: [
      { icon: 'infinity', text: 'Korlátlan leckék', highlight: true },
      { icon: 'infinity', text: 'Korlátlan küzdőtér játékok', highlight: true },
      { icon: 'book-open-variant', text: 'Teljes könyvtár (15 könyv)' },
      { icon: 'download', text: 'Offline mód' },
      { icon: 'trending-up', text: 'Részletes statisztikák' },
      { icon: 'fire', text: '2x gyorsabb XP gyűjtés' },
      { icon: 'crown', text: 'Exkluzív jelvények' },
    ],
    badge: 'Legtöbb választás',
  },
  {
    id: 'ultimate',
    name: 'Mester',
    icon: 'crown',
    color: 'yellow',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-orange-600',
    borderColor: 'border-yellow-400/50',
    price: {
      monthly: 9990,
      yearly: 99990,
    },
    features: [
      { icon: 'shimmer', text: 'Minden Pro funkció', highlight: true },
      { icon: 'account-group', text: '1-1 mentori támogatás' },
      { icon: 'target', text: 'Személyre szabott tanulási terv' },
      { icon: 'trophy', text: 'Exkluzív kihívások' },
      { icon: 'star', text: 'Korai hozzáférés új funkciókhoz' },
      { icon: 'shield', text: 'Prioritás támogatás' },
      { icon: 'crown', text: 'Arany mester jelvény' },
      { icon: 'fire', text: '3x gyorsabb XP gyűjtés' },
    ],
    badge: 'Legjobb érték',
  },
];

const planGradients: Record<string, string[]> = {
  free: ['#475569', '#334155'],
  pro: ['#9333EA', '#EC4899'],
  ultimate: ['#EAB308', '#EA580C'],
};

export default function SubscriptionScreen({ route }: SubscriptionScreenProps) {
  const navigation = useNavigation<NavigationProp>();
  const subscriptionTier = route?.params?.subscriptionTier ?? 'free';
  const onSubscriptionChange = route?.params?.onSubscriptionChange;

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('yearly');

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      onSubscriptionChange?.('free');
    } else if (planId === 'pro') {
      onSubscriptionChange?.('pro');
    } else if (planId === 'ultimate') {
      onSubscriptionChange?.('master');
    }
    // NAVIGATION: Navigate back after selection
    navigation.goBack();
  };

  const isCurrentPlan = (planId: string) => {
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
    const savings = ((plan.price.monthly - yearlyMonthly) / plan.price.monthly) * 100;
    return Math.round(savings);
  };

  return (
    <View style={styles.container}>
      {/* Crystal Background Decorations - React Native doesn't support blur well, skipping */}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="chevron-left" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerTitleRow}>
              <MaterialCommunityIcons name="crown" size={24} color="#FBBF24" />
              <Text style={styles.headerTitle}>Előfizetési Csomagok</Text>
            </View>
            <Text style={styles.headerSubtitle}>Válaszd a számodra megfelelő csomagot</Text>
          </View>
          {subscriptionTier !== 'free' && (
            <Animated.View
              entering={FadeIn}
              style={[
                styles.currentTierBadge,
                { backgroundColor: subscriptionTier === 'master' ? '#9333EA' : '#2563EB' }
              ]}
            >
              <Text style={styles.currentTierText}>
                {subscriptionTier === 'master' ? 'Master előfizető' : 'Pro előfizető'}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hero Section */}
        <Animated.View entering={FadeIn} style={styles.heroContainer}>
          <MaterialCommunityIcons name="crown" size={64} color="#FBBF24" />
          <Text style={styles.heroTitle}>Fejleszd tudásod prémiummal</Text>
          <Text style={styles.heroSubtitle}>Korlátlan hozzáférés, egyéni tanulási út, és több!</Text>
        </Animated.View>

        {/* Billing Toggle */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.billingToggleContainer}>
          <Text style={[styles.billingLabel, billingPeriod === 'monthly' && styles.billingLabelActive]}>
            Havi
          </Text>
          <TouchableOpacity
            onPress={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            style={styles.toggleButton}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.toggleThumb,
                { left: billingPeriod === 'yearly' ? 28 : 2 }
              ]}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[styles.billingLabel, billingPeriod === 'yearly' && styles.billingLabelActive]}>
              Éves
            </Text>
            {billingPeriod === 'yearly' && (
              <Animated.View entering={FadeIn} style={styles.savingsBadge}>
                <Text style={styles.savingsText}>-17%</Text>
              </Animated.View>
            )}
          </View>
        </Animated.View>

        {/* Pricing Cards */}
        <View style={styles.cardsContainer}>
          {plans.map((plan, index) => (
            <Animated.View
              key={plan.id}
              entering={FadeInUp.delay(200 + index * 100)}
              style={styles.cardWrapper}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <View style={styles.popularBadgeContainer}>
                  <View style={styles.popularBadge}>
                    <View style={styles.popularBadgeContent}>
                      <MaterialCommunityIcons name="star" size={12} color="#FDE047" />
                      <Text style={styles.popularBadgeText}>{plan.badge}</Text>
                      <MaterialCommunityIcons name="star" size={12} color="#FDE047" />
                    </View>
                  </View>
                </View>
              )}

              {plan.badge && !plan.popular && (
                <View style={styles.regularBadgeContainer}>
                  <View style={styles.regularBadge}>
                    <Text style={styles.regularBadgeText}>{plan.badge}</Text>
                  </View>
                </View>
              )}

              {/* Card */}
              <View
                style={[
                  styles.card,
                  plan.popular && styles.cardPopular,
                ]}
              >
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={[styles.cardIcon, { backgroundColor: planGradients[plan.id][0] }]}>
                      <MaterialCommunityIcons name={plan.icon} size={24} color={COLORS.white} />
                    </View>
                    <View style={styles.cardTitleContainer}>
                      <Text style={styles.cardTitle}>{plan.name}</Text>
                      <Text style={styles.cardSubtitle}>
                        {plan.id === 'free' ? 'Kezdőknek' : plan.id === 'pro' ? 'Legtöbbeknek' : 'Elkötelezetteknek'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Price */}
                <View style={styles.priceContainer}>
                  <View style={styles.priceRow}>
                    <Text style={[styles.priceAmount, { color: planGradients[plan.id][0] }]}>
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
                      <View style={[
                        styles.featureIcon,
                        feature.highlight && { backgroundColor: planGradients[plan.id][0] }
                      ]}>
                        <MaterialCommunityIcons
                          name="check"
                          size={12}
                          color={feature.highlight ? COLORS.white : '#94A3B8'}
                        />
                      </View>
                      <Text style={[
                        styles.featureText,
                        feature.highlight && styles.featureTextHighlight
                      ]}>
                        {feature.text}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* CTA Button */}
                <TouchableOpacity
                  onPress={() => handleSelectPlan(plan.id)}
                  style={[
                    styles.ctaButton,
                    isCurrentPlan(plan.id) && styles.ctaButtonCurrent,
                    !isCurrentPlan(plan.id) && { backgroundColor: planGradients[plan.id][0] },
                  ]}
                  activeOpacity={isCurrentPlan(plan.id) ? 1 : 0.7}
                  disabled={isCurrentPlan(plan.id)}
                >
                  <Text style={styles.ctaButtonText}>
                    {isCurrentPlan(plan.id) ? 'Jelenlegi csomag' : 'Váltás erre a csomagra'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Benefits Section */}
        <Animated.View
          entering={FadeInUp.delay(600)}
          style={styles.benefitsContainer}
        >
          <View style={styles.benefitsHeader}>
            <MaterialCommunityIcons name="shimmer" size={24} color="#C084FC" />
            <Text style={styles.benefitsTitle}>Miért érdemes prémiumra váltani?</Text>
          </View>
          <View style={styles.benefitsGrid}>
            {[
              { icon: 'book-open-variant', text: 'Teljes könyvtár' },
              { icon: 'infinity', text: 'Korlátlan tanulás' },
              { icon: 'trending-up', text: 'Gyorsabb fejlődés' },
              { icon: 'shield', text: 'Prioritás támogatás' },
            ].map((benefit, idx) => (
              <View key={idx} style={styles.benefitItem}>
                <MaterialCommunityIcons name={benefit.icon as any} size={16} color="#C084FC" />
                <Text style={styles.benefitText}>{benefit.text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Trust Section */}
        <Animated.View
          entering={FadeIn.delay(800)}
          style={styles.trustContainer}
        >
          <View style={styles.trustRow}>
            <MaterialCommunityIcons name="shield" size={16} color="#94A3B8" />
            <Text style={styles.trustRowText}>Biztonságos fizetés • Bármikor lemondható</Text>
          </View>
          <Text style={styles.trustText}>
            Több mint 10,000 tanuló fejleszti pénzügyi tudását a platformunkon
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  // Header
  header: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(168, 85, 247, 0.3)',
    padding: SPACING.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    width: 36,
    height: 36,
    backgroundColor: '#1E293B',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
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
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#D8B4FE',
    fontSize: SIZES.fontXS,
  },
  currentTierBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.5)',
  },
  currentTierText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
  },

  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.base,
    paddingBottom: 96,
  },

  // Hero section
  heroContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: SIZES.font2XL,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  heroSubtitle: {
    color: '#CBD5E1',
    fontSize: SIZES.fontSM,
    textAlign: 'center',
  },

  // Billing toggle
  billingToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  billingLabel: {
    fontSize: SIZES.fontSM,
    color: '#94A3B8',
  },
  billingLabelActive: {
    color: COLORS.white,
  },
  toggleButton: {
    width: 56,
    height: 28,
    backgroundColor: '#334155',
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: '#475569',
    justifyContent: 'center',
  },
  toggleThumb: {
    position: 'absolute',
    top: 4,
    width: 20,
    height: 20,
    backgroundColor: '#A855F7',
    borderRadius: 10,
  },
  savingsBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.5)',
  },
  savingsText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
  },

  // Pricing cards
  cardsContainer: {
    gap: SPACING.base,
  },
  cardWrapper: {
    position: 'relative',
  },

  // Popular badge
  popularBadgeContainer: {
    position: 'absolute',
    top: -12,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  popularBadge: {
    backgroundColor: '#9333EA',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusFull,
    borderWidth: 2,
    borderColor: '#C084FC',
  },
  popularBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  popularBadgeText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
  },

  // Regular badge
  regularBadgeContainer: {
    position: 'absolute',
    top: -8,
    right: SPACING.base,
    zIndex: 10,
  },
  regularBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: '#475569',
  },
  regularBadgeText: {
    color: '#CBD5E1',
    fontSize: SIZES.fontXS,
  },

  // Card
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: SIZES.radius2XL,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: 'rgba(71, 85, 105, 0.5)',
  },
  cardPopular: {
    borderColor: 'rgba(168, 85, 247, 0.8)',
  },

  // Card header
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radiusXL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleContainer: {},
  cardTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#94A3B8',
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
    fontWeight: 'bold',
  },
  pricePeriod: {
    color: '#94A3B8',
    fontSize: SIZES.fontSM,
  },
  yearlyPriceInfo: {
    marginTop: SPACING.xs,
  },
  yearlyPriceText: {
    color: '#94A3B8',
    fontSize: SIZES.fontXS,
  },
  savingsText2: {
    color: '#4ADE80',
    fontSize: SIZES.fontXS,
  },

  // Features
  featuresContainer: {
    gap: 10,
    marginBottom: SPACING.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: SIZES.fontSM,
    color: '#CBD5E1',
    flex: 1,
  },
  featureTextHighlight: {
    color: COLORS.white,
  },

  // CTA Button
  ctaButton: {
    width: '100%',
    paddingVertical: SPACING.md,
    borderRadius: SIZES.radiusXL,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ctaButtonCurrent: {
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderColor: '#475569',
  },
  ctaButtonText: {
    fontSize: SIZES.fontSM,
    color: COLORS.white,
    textAlign: 'center',
  },

  // Benefits section
  benefitsContainer: {
    marginTop: 32,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  benefitsTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: 'bold',
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderRadius: SIZES.radiusLG,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    width: '47%',
  },
  benefitText: {
    color: '#CBD5E1',
    fontSize: SIZES.fontXS,
    flex: 1,
  },

  // Trust section
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
    color: '#94A3B8',
    fontSize: SIZES.fontXS,
  },
  trustText: {
    color: '#64748B',
    fontSize: SIZES.fontXS,
    textAlign: 'center',
  },
});
