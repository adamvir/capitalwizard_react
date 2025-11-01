import { Crown, Clock, Zap, Star, Sparkles, Trophy } from 'lucide-react';
import { useState, useEffect, CSSProperties } from 'react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface DailyLimitPageProps {
  onBack: () => void;
  onUpgrade: () => void;
  limitType: 'lessons' | 'arena';
  subscriptionTier: 'free' | 'pro' | 'master';
}

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  container: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, #0F172A, rgba(88, 28, 135, 0.4), #0F172A)',
    overflow: 'hidden',
  },

  // Background decorations
  decorations: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  crystal: (top?: number, right?: number, left?: number, bottom?: number, width?: number, height?: number, gradient: string, rotation: string, delay: string): CSSProperties => ({
    position: 'absolute',
    top,
    right,
    left,
    bottom,
    width,
    height,
    background: gradient,
    transform: rotation,
    borderRadius: '12px 12px 0 0',
    filter: 'blur(4px)',
    animation: 'pulse 2s infinite',
    animationDelay: delay,
  }),

  // Content
  content: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    gap: SPACING.lg,
  },

  // Icon container
  iconContainer: {
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, #9333EA, #EC4899)',
    borderRadius: '50%',
    filter: 'blur(32px)',
    opacity: 0.5,
    animation: 'pulse 2s infinite',
  },
  iconCircle: {
    position: 'relative',
    width: 128,
    height: 128,
    background: 'linear-gradient(to bottom right, #1E293B, #0F172A)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid rgba(168, 85, 247, 0.5)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
  },
  emoji: {
    fontSize: 64,
  },

  // Title section
  titleSection: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.sm,
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.font2XL,
    background: 'linear-gradient(to right, #C084FC, #F9A8D4, #C084FC)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
  },
  description: {
    color: '#CBD5E1',
    fontSize: SIZES.fontSM,
    maxWidth: 320,
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  // Timer card
  timerCard: {
    background: 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))',
    borderRadius: SIZES.radius2XL,
    padding: SPACING.lg,
    border: '1px solid rgba(168, 85, 247, 0.3)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: 384,
  },
  timerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  timerTitle: {
    color: COLORS.white,
  },
  timerContent: {
    textAlign: 'center',
  },
  timerDisplay: {
    fontSize: SIZES.font5XL,
    color: COLORS.white,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '0.05em',
    marginBottom: SPACING.sm,
  },
  timerSubtext: {
    color: '#94A3B8',
    fontSize: SIZES.fontSM,
  },

  // Upgrade section
  upgradeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.md,
    width: '100%',
    maxWidth: 384,
  },
  upgradeIntro: {
    textAlign: 'center',
    color: '#CBD5E1',
    fontSize: SIZES.fontSM,
    marginBottom: SPACING.sm,
  },
  upgradeButton: (gradient: string, hoverGradient: string, borderColor: string): CSSProperties => ({
    width: '100%',
    background: gradient,
    color: COLORS.white,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    transition: 'all 0.3s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${borderColor}`,
    cursor: 'pointer',
  }),
  upgradeButtonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upgradeButtonLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
  },
  upgradeIconCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeTextLeft: {
    textAlign: 'left',
  },
  upgradePlanName: {
    fontWeight: 'bold',
  },
  upgradePlanDesc: {
    fontSize: SIZES.fontXS,
    opacity: 0.9,
  },
  upgradeTextRight: {
    textAlign: 'right',
  },
  upgradePrice: {
    fontWeight: 'bold',
  },
  upgradePeriod: {
    fontSize: SIZES.fontXS,
    opacity: 0.9,
  },

  // Back button
  backButton: {
    color: '#94A3B8',
    transition: 'color 0.3s',
    fontSize: SIZES.fontSM,
    textDecoration: 'underline',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },

  // Benefits list
  benefitsCard: {
    background: 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.6))',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    border: '1px solid rgba(71, 85, 105, 0.5)',
    backdropFilter: 'blur(8px)',
    width: '100%',
    maxWidth: 384,
  },
  benefitsHeader: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    fontWeight: 600,
    marginBottom: SPACING.sm,
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  benefitsList: {
    color: '#CBD5E1',
    fontSize: SIZES.fontXS,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  bulletGreen: {
    width: 6,
    height: 6,
    backgroundColor: '#4ADE80',
    borderRadius: '50%',
  },
  bulletPurple: {
    width: 6,
    height: 6,
    backgroundColor: '#C084FC',
    borderRadius: '50%',
  },
  vipText: {
    color: '#D8B4FE',
  },
};

export function DailyLimitPage({ onBack, onUpgrade, limitType, subscriptionTier }: DailyLimitPageProps) {
  const [timeUntilReset, setTimeUntilReset] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilReset(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const limitInfo = limitType === 'lessons' 
    ? {
        title: 'Napi lecke limit elérve',
        description: 'Elérted a napi 3 lecke limitet az ingyenes csomaggal.',
        emoji: '📚'
      }
    : {
        title: 'Napi küzdőtér limit elérve',
        description: 'Elérted a napi 5 játék limitet az ingyenes csomaggal.',
        emoji: '⚔️'
      };

  return (
    <div style={styles.container}>
      {/* Background decorations */}
      <div style={styles.decorations}>
        <div style={styles.crystal(40, 32, undefined, undefined, 80, 96, 'linear-gradient(to bottom right, rgba(147, 51, 234, 0.3), transparent)', 'rotate(12deg)', '0s')}></div>
        <div style={styles.crystal(128, undefined, 24, undefined, 64, 80, 'linear-gradient(to bottom right, rgba(37, 99, 235, 0.3), transparent)', 'rotate(-12deg)', '1s')}></div>
        <div style={styles.crystal(undefined, 40, undefined, 160, 56, 72, 'linear-gradient(to bottom right, rgba(236, 72, 153, 0.3), transparent)', 'rotate(6deg)', '2s')}></div>
        <div style={styles.crystal(undefined, undefined, 32, 80, 48, 64, 'linear-gradient(to bottom right, rgba(6, 182, 212, 0.3), transparent)', 'rotate(-6deg)', '1.5s')}></div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Icon */}
        <div style={styles.iconContainer}>
          <div style={styles.iconGlow}></div>
          <div style={styles.iconCircle}>
            <span style={styles.emoji}>{limitInfo.emoji}</span>
          </div>
        </div>

        {/* Title */}
        <div style={styles.titleSection}>
          <h1 style={styles.title}>
            {limitInfo.title}
          </h1>
          <p style={styles.description}>
            {limitInfo.description}
          </p>
        </div>

        {/* Timer card */}
        <div style={styles.timerCard}>
          <div style={styles.timerHeader}>
            <Clock style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#22D3EE' }} />
            <span style={styles.timerTitle}>Reset időpontja</span>
          </div>
          <div style={styles.timerContent}>
            <div style={styles.timerDisplay}>
              {timeUntilReset}
            </div>
            <div style={styles.timerSubtext}>
              Holnap éjfélkor újra tudsz játszani
            </div>
          </div>
        </div>

        {/* Upgrade options */}
        <div style={styles.upgradeSection}>
          <div style={styles.upgradeIntro}>
            Vagy válts prémium csomagra korlátlan játékért:
          </div>

          {/* Pro Plan */}
          <button
            onClick={onUpgrade}
            style={styles.upgradeButton('linear-gradient(to right, #2563EB, #06B6D4)', 'linear-gradient(to right, #1D4ED8, #0891B2)', 'rgba(34, 211, 238, 0.3)')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #1D4ED8, #0891B2)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(34, 211, 238, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #2563EB, #06B6D4)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
            }}
          >
            <div style={styles.upgradeButtonContent}>
              <div style={styles.upgradeButtonLeft}>
                <div style={styles.upgradeIconCircle}>
                  <Star style={{ width: SIZES.iconBase, height: SIZES.iconBase }} />
                </div>
                <div style={styles.upgradeTextLeft}>
                  <div style={styles.upgradePlanName}>Pro csomag</div>
                  <div style={styles.upgradePlanDesc}>Korlátlan hozzáférés</div>
                </div>
              </div>
              <div style={styles.upgradeTextRight}>
                <div style={styles.upgradePrice}>4,990 Ft</div>
                <div style={styles.upgradePeriod}>/hó</div>
              </div>
            </div>
          </button>

          {/* Master Plan */}
          <button
            onClick={onUpgrade}
            style={styles.upgradeButton('linear-gradient(to right, #9333EA, #EC4899)', 'linear-gradient(to right, #7E22CE, #DB2777)', 'rgba(244, 114, 182, 0.3)')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #7E22CE, #DB2777)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(244, 114, 182, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #9333EA, #EC4899)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
            }}
          >
            <div style={styles.upgradeButtonContent}>
              <div style={styles.upgradeButtonLeft}>
                <div style={styles.upgradeIconCircle}>
                  <Sparkles style={{ width: SIZES.iconBase, height: SIZES.iconBase }} />
                </div>
                <div style={styles.upgradeTextLeft}>
                  <div style={styles.upgradePlanName}>Master csomag</div>
                  <div style={styles.upgradePlanDesc}>Minden funkció + VIP előnyök</div>
                </div>
              </div>
              <div style={styles.upgradeTextRight}>
                <div style={styles.upgradePrice}>9,990 Ft</div>
                <div style={styles.upgradePeriod}>/hó</div>
              </div>
            </div>
          </button>
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          style={styles.backButton}
          onMouseEnter={(e) => e.currentTarget.style.color = COLORS.white}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
        >
          Vissza a főoldalra
        </button>

        {/* Benefits list */}
        <div style={styles.benefitsCard}>
          <div style={styles.benefitsHeader}>
            <Zap style={{ width: SIZES.iconSM, height: SIZES.iconSM, color: '#FBBF24' }} />
            Prémium előnyök:
          </div>
          <ul style={styles.benefitsList}>
            <li style={styles.benefitItem}>
              <div style={styles.bulletGreen}></div>
              Korlátlan leckék naponta
            </li>
            <li style={styles.benefitItem}>
              <div style={styles.bulletGreen}></div>
              Korlátlan küzdőtér játékok
            </li>
            <li style={styles.benefitItem}>
              <div style={styles.bulletGreen}></div>
              Exkluzív tartalmak
            </li>
            <li style={styles.benefitItem}>
              <div style={styles.bulletGreen}></div>
              Gyorsabb haladás
            </li>
            {subscriptionTier === 'free' && (
              <li style={styles.benefitItem}>
                <div style={styles.bulletPurple}></div>
                <span style={styles.vipText}>Master: VIP támogatás</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
