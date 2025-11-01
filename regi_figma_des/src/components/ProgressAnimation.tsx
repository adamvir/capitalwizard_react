import { motion } from 'motion/react';
import { Sparkles, BookOpen } from 'lucide-react';
import { useState, useEffect, CSSProperties } from 'react';
import { penzugyiAlapismeretkLessons } from '../data/penzugyiAlapismeretkLessons';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface ProgressAnimationProps {
  onClick?: () => void;
  currentBookLessonIndex?: number;
  currentGameType?: 'reading' | 'matching' | 'quiz';
  isFirstRound?: boolean;
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
    pointerEvents: 'none',
  },

  // No book view
  noBookContent: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING.base,
    pointerEvents: 'auto',
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 48,
    paddingBottom: 48,
  },
  glowEffect: {
    position: 'absolute',
    inset: 0,
    filter: 'blur(32px)',
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: '50%',
    transform: 'scale(1.5)',
  },
  noBookTextContainer: {
    position: 'relative',
    textAlign: 'center',
  },
  noBookTitle: {
    fontSize: SIZES.fontLG,
    opacity: 0.9,
    marginBottom: SPACING.sm,
    color: COLORS.white,
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
  },
  noBookMainText: {
    fontSize: SIZES.font2XL,
    marginBottom: SPACING.sm,
  },
  noBookGradientText: {
    background: 'linear-gradient(to right, #FCD34D, #FDE047, #FDBA74)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  noBookSubtitle: {
    fontSize: SIZES.fontSM,
    opacity: 0.75,
    color: COLORS.white,
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
  },

  // Has book view
  contentWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING.lg,
    cursor: 'pointer',
    pointerEvents: 'auto',
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 48,
    paddingBottom: 48,
  },

  // Sparkles
  sparkle: (top: number, left: number): CSSProperties => ({
    position: 'absolute',
    top,
    left,
  }),

  // Main text
  textContainer: {
    textAlign: 'center',
  },
  textInner: {
    position: 'relative',
  },
  textGlow: {
    position: 'absolute',
    inset: 0,
    filter: 'blur(32px)',
    backgroundColor: 'rgba(168, 85, 247, 0.5)',
    borderRadius: '50%',
    transform: 'scale(1.5)',
  },
  textContent: {
    position: 'relative',
    color: COLORS.white,
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
  },
  topLabel: {
    fontSize: SIZES.fontSM,
    opacity: 0.9,
    marginBottom: SPACING.sm,
  },
  lessonNumber: {
    fontSize: SIZES.font4XL,
    marginBottom: SPACING.base,
  },
  lessonGradientText: {
    background: 'linear-gradient(to right, #FDE047, #D8B4FE, #F9A8D4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  bottomLabel: {
    fontSize: SIZES.fontSM,
    opacity: 0.9,
  },

  // Progress bar
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
    backdropFilter: 'blur(8px)',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(to right, #FDE047, #C084FC, #F9A8D4)',
    borderRadius: SIZES.radiusFull,
    boxShadow: '0 4px 6px rgba(168, 85, 247, 0.5)',
  },

  // Floating particles
  particle: (top: number, left: number, gradient: string): CSSProperties => ({
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: '50%',
    top,
    left,
    background: gradient,
  }),
};

export function ProgressAnimation({ onClick, currentBookLessonIndex = 0, currentGameType = 'reading', isFirstRound = true }: ProgressAnimationProps) {
  const [hasRentedBook, setHasRentedBook] = useState(false);

  // Check if Pénzügyi Alapismeretek is rented
  useEffect(() => {
    const checkRentedBooks = () => {
      const saved = localStorage.getItem('rentedBooks');
      if (saved) {
        const rentedBooks = JSON.parse(saved);
        const hasPenzugyiBook = rentedBooks.some((book: any) => 
          book.title === 'Pénzügyi Alapismeretek' && book.rentedUntil > Date.now()
        );
        setHasRentedBook(hasPenzugyiBook);
      } else {
        setHasRentedBook(false);
      }
    };

    checkRentedBooks();

    // Listen for storage changes
    window.addEventListener('storage', checkRentedBooks);
    
    return () => {
      window.removeEventListener('storage', checkRentedBooks);
    };
  }, []);

  // Calculate current lesson number (every game is a separate lesson)
  const lessonNumber = isFirstRound 
    ? (currentBookLessonIndex * 3) + (currentGameType === 'reading' ? 1 : currentGameType === 'matching' ? 2 : 3)
    : penzugyiAlapismeretkLessons.length * 3 + currentBookLessonIndex + 1;

  // Don't show if no book is rented
  if (!hasRentedBook) {
    return (
      <div style={styles.container}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.6,
            ease: "backOut"
          }}
          style={styles.noBookContent}
        >
          {/* Glow effect */}
          <div style={styles.glowEffect}></div>
          
          <div style={styles.noBookTextContainer}>
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <BookOpen style={{ width: 64, height: 64, color: '#FBBF24', margin: '0 auto', marginBottom: SPACING.base }} />
            </motion.div>
            <div>
              <div style={styles.noBookTitle}>Nincs kölcsönzött</div>
              <div style={styles.noBookMainText}>
                <span style={styles.noBookGradientText}>
                  tankönyv
                </span>
              </div>
              <div style={styles.noBookSubtitle}>
                Kölcsönözz ki könyvet a könyvtárból!
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div 
        style={styles.contentWrapper}
        onClick={onClick}
      >
        {/* Sparkle icons around */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 8;
          const top = 50 + Math.cos(angle) * 120;
          const left = Math.sin(angle) * 120;
          
          return (
            <motion.div
              key={i}
              style={styles.sparkle(top, left)}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut"
              }}
            >
              <Sparkles style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: '#FBBF24', fill: 'currentColor' }} />
            </motion.div>
          );
        })}

        {/* Main text */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.6,
            ease: "backOut"
          }}
          style={styles.textContainer}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={styles.textInner}
          >
            {/* Glow effect behind text */}
            <div style={styles.textGlow}></div>
            
            <div style={styles.textContent}>
              <div style={styles.topLabel}>Tovább haladás</div>
              <div style={styles.lessonNumber}>
                <span style={styles.lessonGradientText}>
                  {lessonNumber}. Lecke
                </span>
              </div>
              <div style={styles.bottomLabel}>következik</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 200, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={styles.progressBarContainer}
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={styles.progressBarFill}
          />
        </motion.div>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => {
          const top = Math.random() * 200 - 100;
          const left = Math.random() * 300 - 150;
          const colors = ['#fbbf24', '#a855f7', '#ec4899'];
          const gradient = `linear-gradient(135deg, ${colors[i % 3]}, transparent)`;
          
          return (
            <motion.div
              key={`particle-${i}`}
              style={styles.particle(top, left, gradient)}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
