import { motion } from 'motion/react';
import { Trophy, Star, Sparkles, ChevronRight } from 'lucide-react';
import { CSSProperties } from 'react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface LevelUpCelebrationProps {
  newLevel: number;
  onContinue: () => void;
}

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  container: {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom, #0F172A, rgba(88, 28, 135, 0.6), #0F172A)',
  },

  // Background effects
  backgroundEffects: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
  },
  particle: (left: string, top: string, gradient: string): CSSProperties => ({
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: '50%',
    left,
    top,
    background: gradient,
  }),
  sparkle: (left: string, top: string): CSSProperties => ({
    position: 'absolute',
    left,
    top,
  }),
  radialGlow: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent, transparent)',
  },

  // Main content
  mainContent: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 32,
    paddingLeft: 32,
    paddingRight: 32,
  },

  // Trophy
  trophyContainer: {
    position: 'relative',
  },
  trophyGlow: {
    position: 'absolute',
    inset: 0,
    filter: 'blur(48px)',
    backgroundColor: 'rgba(251, 191, 36, 0.5)',
    transform: 'scale(1.5)',
  },
  trophyCircle: {
    position: 'relative',
    width: 128,
    height: 128,
    background: 'linear-gradient(to bottom right, #FDE047, #FBBF24, #EAB308)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(234, 179, 8, 0.5)',
    border: '4px solid #FEF08A',
  },
  orbitingStar: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  orbitingStarInner: {
    transform: 'translate(-50%, -50%) translateY(-80px)',
  },

  // Text content
  textContent: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.base,
  },
  congratsTitle: {
    fontSize: SIZES.font5XL,
    color: COLORS.white,
    margin: 0,
  },
  congratsGradient: {
    background: 'linear-gradient(to right, #FDE047, #D8B4FE, #F9A8D4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  levelUpMessage: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.sm,
  },
  subMessage: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
  },
  levelCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    borderRadius: SIZES.radiusXL,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  levelLabel: {
    color: '#CBD5E1',
    fontSize: SIZES.fontSM,
    marginBottom: SPACING.sm,
  },
  levelNumber: {
    fontSize: SIZES.font4XL,
    background: 'linear-gradient(to right, #22D3EE, #3B82F6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  achievementMessage: {
    color: '#D8B4FE',
    fontSize: SIZES.fontSM,
    maxWidth: 320,
  },

  // Continue button
  continueButton: {
    position: 'relative',
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
    background: 'linear-gradient(to right, #10B981, #059669)',
    borderRadius: SIZES.radiusXL,
    boxShadow: '0 8px 12px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.3s',
    cursor: 'pointer',
    border: 'none',
  },
  continueButtonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontFamily: 'Georgia, serif',
    fontWeight: 700,
    letterSpacing: '0.1em',
  },
  buttonGlow: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.radiusXL,
    opacity: 0,
    transition: 'opacity 0.3s',
    filter: 'blur(24px)',
  },

  // Confetti
  confetti: (left: string, top: string, bg: string, borderRadius: string): CSSProperties => ({
    position: 'absolute',
    width: 12,
    height: 12,
    left,
    top,
    background: bg,
    borderRadius,
  }),
};

export function LevelUpCelebration({ newLevel, onContinue }: LevelUpCelebrationProps) {
  return (
    <div style={styles.container}>
      {/* Background effects */}
      <div style={styles.backgroundEffects}>
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => {
          const colors = ['#fbbf24', '#a855f7', '#ec4899', '#3b82f6'];
          const gradient = `linear-gradient(135deg, ${colors[i % 4]}, transparent)`;
          
          return (
            <motion.div
              key={`particle-${i}`}
              style={styles.particle(`${Math.random() * 100}%`, `${Math.random() * 100}%`, gradient)}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          );
        })}

        {/* Sparkles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            style={styles.sparkle(`${20 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`)}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          >
            <Sparkles style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: '#FBBF24', fill: 'currentColor' }} />
          </motion.div>
        ))}

        {/* Radial glow */}
        <div style={styles.radialGlow}></div>
      </div>

      {/* Main content */}
      <div style={styles.mainContent}>
        {/* Trophy icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2
          }}
          style={styles.trophyContainer}
        >
          <div style={styles.trophyGlow}></div>
          <div style={styles.trophyCircle}>
            <Trophy style={{ width: 64, height: 64, color: '#78350F' }} />
          </div>
          
          {/* Orbiting stars */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              style={styles.orbitingStar}
              animate={{
                rotate: [i * 90, i * 90 + 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div style={styles.orbitingStarInner}>
                <Star style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: '#FDE047', fill: '#FDE047' }} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={styles.textContent}
        >
          {/* Congratulations */}
          <motion.h1
            style={styles.congratsTitle}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span style={styles.congratsGradient}>
              Gratulálunk!
            </span>
          </motion.h1>

          {/* Level up message */}
          <div style={styles.levelUpMessage}>
            <p style={styles.subMessage}>
              Szakaszt teljesítettél! 🎉
            </p>
            <div style={styles.levelCard}>
              <p style={styles.levelLabel}>Új szint elérve</p>
              <div style={styles.levelNumber}>
                Szint {newLevel}
              </div>
            </div>
          </div>

          {/* Achievement message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            style={styles.achievementMessage}
          >
            Folytatod a tanulást az új szakaszban!
          </motion.p>
        </motion.div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          onClick={onContinue}
          style={styles.continueButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #059669, #047857)';
            e.currentTarget.style.boxShadow = '0 12px 16px rgba(16, 185, 129, 0.4)';
            e.currentTarget.style.transform = 'scale(1.05)';
            const glow = e.currentTarget.querySelector('.button-glow') as HTMLElement;
            if (glow) glow.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #10B981, #059669)';
            e.currentTarget.style.boxShadow = '0 8px 12px rgba(16, 185, 129, 0.3)';
            e.currentTarget.style.transform = 'scale(1)';
            const glow = e.currentTarget.querySelector('.button-glow') as HTMLElement;
            if (glow) glow.style.opacity = '0';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
        >
          <div style={styles.continueButtonContent}>
            <span style={styles.continueButtonText}>
              TOVÁBB
            </span>
            <ChevronRight style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white, transition: 'transform 0.3s' }} />
          </div>
          
          {/* Button glow */}
          <div className="button-glow" style={styles.buttonGlow}></div>
        </motion.button>
      </div>

      {/* Confetti effect */}
      {[...Array(30)].map((_, i) => {
        const colors = ['#fbbf24', '#a855f7', '#ec4899', '#3b82f6', '#10b981'];
        const borderRadius = Math.random() > 0.5 ? '50%' : '0%';
        
        return (
          <motion.div
            key={`confetti-${i}`}
            style={styles.confetti('50%', '20%', colors[i % 5], borderRadius)}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: (Math.random() - 0.5) * 600,
              y: Math.random() * 800 + 200,
              opacity: 0,
              rotate: Math.random() * 720,
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: i * 0.05,
              ease: "easeOut"
            }}
          />
        );
      })}
    </div>
  );
}
