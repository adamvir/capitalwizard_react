import { useState, useEffect, CSSProperties } from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface StreakCelebrationProps {
  newStreak: number;
  onContinue: () => void;
}

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  container: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, #0F172A, rgba(124, 45, 18, 0.4), #0F172A)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },

  // Floating particles
  particlesContainer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  particle: (x: number, y: number): CSSProperties => ({
    position: 'absolute',
    left: x,
    top: y,
  }),

  // Main content
  mainContent: {
    position: 'relative',
    textAlign: 'center',
    paddingLeft: 32,
    paddingRight: 32,
    zIndex: 10,
  },
  fireEmoji: {
    fontSize: 144,
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.font5XL,
    marginBottom: SPACING.base,
    letterSpacing: '0.025em',
    margin: 0,
  },

  // Streak counter
  streakCounterContainer: {
    marginBottom: SPACING.lg,
  },
  streakCounter: {
    display: 'inline-block',
    background: 'linear-gradient(to right, #EA580C, #DC2626, #EA580C)',
    borderRadius: SIZES.radius2XL,
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
    border: '4px solid #FB923C',
    boxShadow: '0 8px 16px rgba(234, 88, 12, 0.5)',
  },
  streakCounterContent: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
  },
  streakNumber: {
    color: COLORS.white,
    fontSize: SIZES.font6XL,
    letterSpacing: '0.05em',
    fontVariantNumeric: 'tabular-nums',
  },
  streakLabel: {
    color: COLORS.white,
    fontSize: SIZES.font3XL,
  },

  // Message
  message: {
    color: '#FDBA74',
    fontSize: SIZES.fontXL,
    marginBottom: 32,
    lineHeight: 1.6,
  },

  // Continue button
  continueButton: {
    background: 'linear-gradient(to right, #F97316, #EF4444, #F97316)',
    color: COLORS.white,
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
    borderRadius: SIZES.radiusXL,
    boxShadow: '0 8px 16px rgba(249, 115, 22, 0.5)',
    transition: 'all 0.3s',
    border: '2px solid #FDBA74',
    cursor: 'pointer',
  },
  continueButtonText: {
    fontSize: SIZES.fontXL,
    letterSpacing: '0.025em',
  },

  // Glow effect
  glowEffect: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, #EA580C, #DC2626, #EA580C)',
    borderRadius: SIZES.radius3XL,
    filter: 'blur(48px)',
    opacity: 0.2,
    zIndex: -10,
  },
};

export function StreakCelebration({ newStreak, onContinue }: StreakCelebrationProps) {
  const [displayedNumber, setDisplayedNumber] = useState(0);

  // Counter animation effect
  useEffect(() => {
    if (newStreak === 0) return;

    // Start counting after initial animations (0.8s delay)
    const startDelay = 800;
    
    // Calculate how long each step should take
    // For streak 1-5: 50ms per step
    // For streak 6-20: 40ms per step
    // For streak 21+: 30ms per step
    const stepDuration = newStreak <= 5 ? 50 : newStreak <= 20 ? 40 : 30;

    const timeout = setTimeout(() => {
      let currentNumber = 0;
      const interval = setInterval(() => {
        currentNumber += 1;
        setDisplayedNumber(currentNumber);

        if (currentNumber >= newStreak) {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [newStreak]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={styles.container}
    >
      {/* Floating fire particles */}
      <div style={styles.particlesContainer}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={styles.particle(Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400), (typeof window !== 'undefined' ? window.innerHeight : 800) + 50)}
            initial={{
              opacity: 0,
            }}
            animate={{
              y: -50 - ((typeof window !== 'undefined' ? window.innerHeight : 800) + 50),
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeOut',
            }}
          >
            <Flame style={{ color: '#F97316', width: 12 + Math.random() * 20, height: 12 + Math.random() * 20 }} />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div style={styles.mainContent}>
        {/* Fire emoji with animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: [0, 1.2, 1],
            rotate: 0,
          }}
          transition={{
            duration: 0.6,
            times: [0, 0.6, 1],
            ease: 'easeOut',
          }}
          style={styles.fireEmoji}
        >
          🔥
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={styles.title}
        >
          Napi sorozat!
        </motion.h1>

        {/* Streak counter with counting animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          style={styles.streakCounterContainer}
        >
          <div style={styles.streakCounter}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={styles.streakCounterContent}
            >
              <Flame style={{ width: 40, height: 40, color: '#FDE047' }} />
              <motion.span
                key={displayedNumber}
                animate={{ 
                  scale: displayedNumber === newStreak ? [1, 1.2, 1] : 1,
                }}
                transition={{ 
                  scale: { duration: 0.3, times: [0, 0.5, 1] }
                }}
                style={styles.streakNumber}
              >
                {displayedNumber}
              </motion.span>
              <span style={styles.streakLabel}>nap</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: displayedNumber === newStreak ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={styles.message}
        >
          {newStreak === 1 ? (
            <>
              Kezdted a napi sorozatodat!<br />
              Térj vissza holnap is!
            </>
          ) : (
            <>
              Gratulálunk!<br />
              Így tovább, ne hagyd abba!
            </>
          )}
        </motion.p>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: displayedNumber === newStreak ? 1 : 0,
            y: displayedNumber === newStreak ? 0 : 20
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={styles.continueButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #EA580C, #DC2626, #EA580C)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #F97316, #EF4444, #F97316)';
          }}
        >
          <span style={styles.continueButtonText}>Tovább</span>
        </motion.button>

        {/* Glow effect */}
        <motion.div
          style={styles.glowEffect}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </motion.div>
  );
}
