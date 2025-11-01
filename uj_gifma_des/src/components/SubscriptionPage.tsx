import { useState, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Infinity
} from 'lucide-react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface SubscriptionPageProps {
  onBack: () => void;
  subscriptionTier: 'free' | 'pro' | 'master';
  onSubscriptionChange: (tier: 'free' | 'pro' | 'master') => void;
}

type BillingPeriod = 'monthly' | 'yearly';

interface Plan {
  id: string;
  name: string;
  icon: any;
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
    icon: any;
    text: string;
    highlight?: boolean;
  }[];
  badge?: string;
}

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, #0F172A, rgba(88, 28, 135, 0.2), #0F172A)',
    overflowY: 'auto',
    overflowX: 'hidden',
  },

  // Crystal decorations
  crystalContainer: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  crystal: (top?: number, right?: number, left?: number, bottom?: number, width?: number, height?: number, rotation?: string, delay?: string): CSSProperties => ({
    position: 'absolute',
    top,
    right,
    left,
    bottom,
    width,
    height,
    background: 'linear-gradient(to bottom right, rgba(147, 51, 234, 0.2), transparent)',
    transform: rotation,
    borderRadius: '12px 12px 0 0',
    filter: 'blur(4px)',
    animation: 'pulse 2s infinite',
    animationDelay: delay,
  }),

  // Header
  header: {
    position: 'relative',
    background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(88, 28, 135, 0.8), rgba(15, 23, 42, 0.95))',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
    padding: SPACING.md,
    boxShadow: '0 4px 6px rgba(88, 28, 135, 0.5)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    width: 36,
    height: 36,
    background: 'linear-gradient(to bottom right, #1E293B, #0F172A)',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    cursor: 'pointer',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    color: COLORS.white,
    margin: 0,
  },
  headerSubtitle: {
    color: '#D8B4FE',
    fontSize: SIZES.fontXS,
  },
  currentTierBadge: (tier: 'pro' | 'master'): CSSProperties => ({
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    borderRadius: SIZES.radiusLG,
    border: tier === 'master' ? '1px solid rgba(192, 132, 252, 0.5)' : '1px solid rgba(96, 165, 250, 0.5)',
    background: tier === 'master' 
      ? 'linear-gradient(to right, #9333EA, #EC4899)' 
      : 'linear-gradient(to right, #2563EB, #06B6D4)',
  }),
  currentTierText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
  },

  // Content
  content: {
    position: 'relative',
    padding: SPACING.base,
    paddingBottom: 96,
  },

  // Hero section
  heroContainer: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  heroIconContainer: {
    display: 'inline-block',
    marginBottom: SPACING.md,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: SIZES.font2XL,
    marginBottom: SPACING.sm,
    background: 'linear-gradient(to right, #FBBF24, #FB923C, #EF4444)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
  },
  heroSubtitle: {
    color: '#CBD5E1',
    fontSize: SIZES.fontSM,
  },

  // Billing toggle
  billingToggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  billingLabel: (isActive: boolean): CSSProperties => ({
    fontSize: SIZES.fontSM,
    transition: 'color 0.3s',
    color: isActive ? COLORS.white : '#94A3B8',
  }),
  toggleButton: {
    position: 'relative',
    width: 56,
    height: 28,
    backgroundColor: '#334155',
    borderRadius: SIZES.radiusFull,
    transition: 'all 0.3s',
    border: '1px solid #475569',
    cursor: 'pointer',
  },
  toggleThumb: {
    position: 'absolute',
    top: 4,
    width: 20,
    height: 20,
    background: 'linear-gradient(to right, #A855F7, #EC4899)',
    borderRadius: '50%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  savingsBadge: {
    background: 'linear-gradient(to right, #16A34A, #059669)',
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: SIZES.radiusFull,
    border: '1px solid rgba(74, 222, 128, 0.5)',
  },
  savingsText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
  },

  // Pricing cards
  cardsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.base,
  },
  cardWrapper: {
    position: 'relative',
  },

  // Popular badge
  popularBadgeContainer: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
  },
  popularBadge: {
    background: 'linear-gradient(to right, #9333EA, #EC4899, #9333EA)',
    paddingLeft: SPACING.base,
    paddingRight: SPACING.base,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    borderRadius: SIZES.radiusFull,
    border: '2px solid #C084FC',
    boxShadow: '0 4px 6px rgba(147, 51, 234, 0.5)',
  },
  popularBadgeContent: {
    display: 'flex',
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
    background: 'linear-gradient(to right, #334155, #1E293B)',
    paddingLeft: SPACING.md,
    paddingRight: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    borderRadius: SIZES.radiusFull,
    border: '1px solid #475569',
  },
  regularBadgeText: {
    color: '#CBD5E1',
    fontSize: SIZES.fontXS,
  },

  // Card
  card: (popular: boolean, borderColor: string): CSSProperties => ({
    position: 'relative',
    background: 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.8))',
    borderRadius: SIZES.radius2XL,
    padding: SPACING.lg,
    border: popular ? '2px solid rgba(168, 85, 247, 0.8)' : `2px solid ${borderColor}`,
    boxShadow: popular ? '0 8px 16px rgba(147, 51, 234, 0.3)' : 'none',
    backdropFilter: 'blur(8px)',
    overflow: 'hidden',
  }),
  cardGlow: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1), rgba(147, 51, 234, 0.1))',
    animation: 'pulse 2s infinite',
    pointerEvents: 'none',
  },

  // Card header
  cardHeader: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
  },
  cardIcon: (gradient: string): CSSProperties => ({
    width: 48,
    height: 48,
    background: gradient,
    borderRadius: SIZES.radiusXL,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  }),
  cardTitleContainer: {},
  cardTitle: {
    color: COLORS.white,
    margin: 0,
  },
  cardSubtitle: {
    color: '#94A3B8',
    fontSize: SIZES.fontXS,
  },

  // Price
  priceContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: SPACING.xs,
  },
  priceAmount: (gradient: string): CSSProperties => ({
    fontSize: SIZES.font4XL,
    background: gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }),
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
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: SPACING.lg,
  },
  featureRow: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  featureIcon: (highlight: boolean, gradient?: string): CSSProperties => ({
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: highlight ? gradient : '#334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  featureText: (highlight: boolean): CSSProperties => ({
    fontSize: SIZES.fontSM,
    color: highlight ? COLORS.white : '#CBD5E1',
  }),

  // CTA Button
  ctaButton: (isCurrent: boolean, gradient?: string, popular?: boolean): CSSProperties => ({
    width: '100%',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderRadius: SIZES.radiusXL,
    transition: 'all 0.3s',
    border: isCurrent ? '2px solid #475569' : '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isCurrent ? 'rgba(51, 65, 85, 0.5)' : gradient,
    color: isCurrent ? '#CBD5E1' : COLORS.white,
    cursor: isCurrent ? 'default' : 'pointer',
    boxShadow: (!isCurrent && popular) ? '0 4px 6px rgba(147, 51, 234, 0.5)' : 'none',
  }),
  ctaButtonText: {
    fontSize: SIZES.fontSM,
    textAlign: 'center',
  },

  // Benefits section
  benefitsContainer: {
    marginTop: 32,
    background: 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.6), rgba(88, 28, 135, 0.3))',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.lg,
    border: '1px solid rgba(168, 85, 247, 0.3)',
  },
  benefitsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  benefitsTitle: {
    color: COLORS.white,
    margin: 0,
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: SPACING.md,
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    background: 'rgba(15, 23, 42, 0.4)',
    borderRadius: SIZES.radiusLG,
    padding: 10,
    border: '1px solid rgba(51, 65, 85, 0.5)',
  },
  benefitText: {
    color: '#CBD5E1',
    fontSize: SIZES.fontXS,
  },

  // Trust section
  trustContainer: {
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  trustRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    color: '#94A3B8',
    fontSize: SIZES.fontXS,
    marginBottom: SPACING.sm,
  },
  trustText: {
    color: '#64748B',
    fontSize: SIZES.fontXS,
  },
};

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Alapszint',
    icon: BookOpen,
    color: 'slate',
    gradientFrom: 'from-slate-600',
    gradientTo: 'to-slate-700',
    borderColor: 'border-slate-500/50',
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
  },
  {
    id: 'pro',
    name: 'Professzionális',
    icon: Zap,
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
      { icon: Infinity, text: 'Korlátlan leckék', highlight: true },
      { icon: Infinity, text: 'Korlátlan küzdőtér játékok', highlight: true },
      { icon: BookOpen, text: 'Teljes könyvtár (15 könyv)' },
      { icon: Download, text: 'Offline mód' },
      { icon: TrendingUp, text: 'Részletes statisztikák' },
      { icon: Flame, text: '2x gyorsabb XP gyűjtés' },
      { icon: Crown, text: 'Exkluzív jelvények' },
    ],
    badge: 'Legtöbb választás',
  },
  {
    id: 'ultimate',
    name: 'Mester',
    icon: Crown,
    color: 'yellow',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-orange-600',
    borderColor: 'border-yellow-400/50',
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
  },
];

// Gradient mappings
const planGradients: Record<string, string> = {
  free: 'linear-gradient(to bottom right, #475569, #334155)',
  pro: 'linear-gradient(to bottom right, #9333EA, #EC4899)',
  ultimate: 'linear-gradient(to bottom right, #EAB308, #EA580C)',
};

const planBorderColors: Record<string, string> = {
  free: 'rgba(100, 116, 139, 0.5)',
  pro: 'rgba(192, 132, 252, 0.5)',
  ultimate: 'rgba(251, 191, 36, 0.5)',
};

export function SubscriptionPage({ onBack, subscriptionTier, onSubscriptionChange }: SubscriptionPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('yearly');
  
  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      onSubscriptionChange('free');
    } else if (planId === 'pro') {
      onSubscriptionChange('pro');
    } else if (planId === 'ultimate') {
      onSubscriptionChange('master');
    }
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
    <div style={styles.container}>
      {/* Crystal Background Decorations */}
      <div style={styles.crystalContainer}>
        <div style={styles.crystal(80, 40, undefined, undefined, 96, 128, 'rotate(12deg)', '0s')}></div>
        <div style={styles.crystal(160, undefined, 32, undefined, 80, 112, 'rotate(-12deg)', '1s')}></div>
        <div style={styles.crystal(undefined, 48, undefined, 240, 64, 96, 'rotate(6deg)', '2s')}></div>
        <div style={styles.crystal(undefined, undefined, 24, 160, 56, 80, 'rotate(-6deg)', '1.5s')}></div>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={styles.backButton}
          >
            <ChevronLeft style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: COLORS.white }} />
          </motion.button>
          <div style={styles.headerTitleContainer}>
            <div style={styles.headerTitleRow}>
              <Crown style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#FBBF24' }} />
              <h1 style={styles.headerTitle}>Előfizetési Csomagok</h1>
            </div>
            <p style={styles.headerSubtitle}>Válaszd a számodra megfelelő csomagot</p>
          </div>
          {subscriptionTier !== 'free' && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={styles.currentTierBadge(subscriptionTier === 'master' ? 'master' : 'pro')}
            >
              <span style={styles.currentTierText}>
                {subscriptionTier === 'master' ? 'Master előfizető' : 'Pro előfizető'}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.heroContainer}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            style={styles.heroIconContainer}
          >
            <Crown style={{ width: 64, height: 64, color: '#FBBF24', filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))' }} />
          </motion.div>
          <h2 style={styles.heroTitle}>
            Fejleszd tudásod prémiummal
          </h2>
          <p style={styles.heroSubtitle}>
            Korlátlan hozzáférés, egyéni tanulási út, és több!
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={styles.billingToggleContainer}
        >
          <span style={styles.billingLabel(billingPeriod === 'monthly')}>
            Havi
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            style={styles.toggleButton}
          >
            <motion.div
              animate={{ x: billingPeriod === 'yearly' ? 28 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={styles.toggleThumb}
            />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={styles.billingLabel(billingPeriod === 'yearly')}>
              Éves
            </span>
            {billingPeriod === 'yearly' && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                style={styles.savingsBadge}
              >
                <span style={styles.savingsText}>-17%</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div style={styles.cardsContainer}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              style={styles.cardWrapper}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div style={styles.popularBadgeContainer}>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={styles.popularBadge}
                  >
                    <div style={styles.popularBadgeContent}>
                      <Star style={{ width: 12, height: 12, color: '#FDE047', fill: '#FDE047' }} />
                      <span style={styles.popularBadgeText}>{plan.badge}</span>
                      <Star style={{ width: 12, height: 12, color: '#FDE047', fill: '#FDE047' }} />
                    </div>
                  </motion.div>
                </div>
              )}

              {plan.badge && !plan.popular && (
                <div style={styles.regularBadgeContainer}>
                  <div style={styles.regularBadge}>
                    <span style={styles.regularBadgeText}>{plan.badge}</span>
                  </div>
                </div>
              )}

              {/* Card */}
              <motion.div
                whileHover={{ scale: plan.id === 'free' ? 1 : 1.02 }}
                style={styles.card(!!plan.popular, planBorderColors[plan.id])}
              >
                {/* Glow effect for popular */}
                {plan.popular && (
                  <div style={styles.cardGlow} />
                )}

                {/* Header */}
                <div style={styles.cardHeader}>
                  <div style={styles.cardHeaderLeft}>
                    <div style={styles.cardIcon(planGradients[plan.id])}>
                      <plan.icon style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
                    </div>
                    <div style={styles.cardTitleContainer}>
                      <h3 style={styles.cardTitle}>{plan.name}</h3>
                      <p style={styles.cardSubtitle}>
                        {plan.id === 'free' ? 'Kezdőknek' : plan.id === 'pro' ? 'Legtöbbeknek' : 'Elkötelezetteknek'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div style={styles.priceContainer}>
                  <div style={styles.priceRow}>
                    <span style={styles.priceAmount(planGradients[plan.id])}>
                      {getMonthlyPrice(plan)}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span style={styles.pricePeriod}>/hó</span>
                    )}
                  </div>
                  {billingPeriod === 'yearly' && plan.price.yearly > 0 && (
                    <div style={styles.yearlyPriceInfo}>
                      <p style={styles.yearlyPriceText}>
                        {formatPrice(plan.price.yearly)} évente
                      </p>
                      <p style={styles.savingsText2}>
                        Spórolj {getSavings(plan)}%-ot évente!
                      </p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div style={styles.featuresContainer}>
                  {plan.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 + idx * 0.05 }}
                      style={styles.featureRow}
                    >
                      <div style={styles.featureIcon(!!feature.highlight, planGradients[plan.id])}>
                        <Check style={{ width: 12, height: 12, color: feature.highlight ? COLORS.white : '#94A3B8' }} />
                      </div>
                      <span style={styles.featureText(!!feature.highlight)}>
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: isCurrentPlan(plan.id) ? 1 : 1.02 }}
                  whileTap={{ scale: isCurrentPlan(plan.id) ? 1 : 0.98 }}
                  onClick={() => handleSelectPlan(plan.id)}
                  style={styles.ctaButton(isCurrentPlan(plan.id), planGradients[plan.id], plan.popular)}
                  disabled={isCurrentPlan(plan.id)}
                >
                  <span style={styles.ctaButtonText}>
                    {isCurrentPlan(plan.id) ? 'Jelenlegi csomag' : 'Váltás erre a csomagra'}
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={styles.benefitsContainer}
        >
          <div style={styles.benefitsHeader}>
            <Sparkles style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#C084FC' }} />
            <h3 style={styles.benefitsTitle}>Miért érdemes prémiumra váltani?</h3>
          </div>
          <div style={styles.benefitsGrid}>
            {[
              { icon: BookOpen, text: 'Teljes könyvtár' },
              { icon: Infinity, text: 'Korlátlan tanulás' },
              { icon: TrendingUp, text: 'Gyorsabb fejlődés' },
              { icon: Shield, text: 'Prioritás támogatás' },
            ].map((benefit, idx) => (
              <div key={idx} style={styles.benefitItem}>
                <benefit.icon style={{ width: SIZES.iconSM, height: SIZES.iconSM, color: '#C084FC' }} />
                <span style={styles.benefitText}>{benefit.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={styles.trustContainer}
        >
          <div style={styles.trustRow}>
            <Shield style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
            <span>Biztonságos fizetés • Bármikor lemondható</span>
          </div>
          <p style={styles.trustText}>
            Több mint 10,000 tanuló fejleszti pénzügyi tudását a platformunkon
          </p>
        </motion.div>
      </div>
    </div>
  );
}
