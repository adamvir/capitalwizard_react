import { Coins, ArrowLeft } from 'lucide-react';
import { CSSProperties } from 'react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface LessonHeaderProps {
  onBack?: () => void;
  onStart?: () => void;
  lessonNumber?: number;
  gameType?: 'reading' | 'matching' | 'quiz';
  isFirstRound?: boolean;
}

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  container: {
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.lg,
  },

  // Back button
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    color: COLORS.white,
    marginBottom: SPACING.base,
    transition: 'opacity 0.3s',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
  },
  backButtonIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },

  // Lesson title
  titleContainer: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.font3XL,
    marginBottom: SPACING.sm,
    margin: 0,
  },

  // Info cards
  cardsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.md,
  },
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  infoCardRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#CBD5E1',
  },
  infoValue: {
    color: COLORS.white,
  },
  infoDifficulty: (color: string): CSSProperties => ({
    color,
  }),

  // Reward row
  rewardRow: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rewardAmount: {
    color: COLORS.white,
  },
  coinIcon: {
    width: SIZES.iconLG,
    height: SIZES.iconLG,
    background: 'linear-gradient(to bottom right, #FDE047, #EAB308)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(234, 179, 8, 0.3)',
    border: '1px solid rgba(202, 138, 4, 0.2)',
  },

  // Start button
  startButton: {
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    marginTop: 44,
    background: 'linear-gradient(to right, #10B981, #059669)',
    color: COLORS.white,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
    paddingLeft: 32,
    paddingRight: 32,
    borderRadius: SIZES.radiusXL,
    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.3s',
    cursor: 'pointer',
    border: 'none',
    animation: 'pulse 2s infinite',
  },
  startButtonText: {
    display: 'block',
    textAlign: 'center',
    fontFamily: 'Georgia, serif',
    fontSize: '1.25rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
  },
};

export function LessonHeader({ onBack, onStart, lessonNumber = 1, gameType = 'reading', isFirstRound = true }: LessonHeaderProps) {
  // Determine game details based on type
  const getGameDetails = () => {
    switch (gameType) {
      case 'reading':
        return {
          theme: 'Pénzügyi Alapismeretek',
          difficulty: 'Könnyű',
          name: 'Olvasás',
          difficultyColor: '#4ADE80'
        };
      case 'matching':
        return {
          theme: 'Pénzügyi Alapismeretek',
          difficulty: 'Közepes',
          name: 'Párosítás',
          difficultyColor: '#22D3EE'
        };
      case 'quiz':
        return {
          theme: 'Pénzügyi Alapismeretek',
          difficulty: 'Nehéz',
          name: 'Kvíz',
          difficultyColor: '#F87171'
        };
      default:
        return {
          theme: 'Pénzügyi Alapismeretek',
          difficulty: 'Könnyű',
          name: 'Olvasás',
          difficultyColor: '#4ADE80'
        };
    }
  };

  const lesson = getGameDetails();
  const roundText = isFirstRound ? '1. kör' : '2. kör';
  
  return (
    <div style={styles.container}>
      {/* Back button */}
      <button 
        onClick={onBack}
        style={styles.backButton}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        <div style={styles.backButtonIcon}>
          <ArrowLeft style={{ width: SIZES.iconBase, height: SIZES.iconBase }} />
        </div>
        <span>Vissza</span>
      </button>

      {/* Lesson Title */}
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>{lessonNumber}. Lecke</h1>
      </div>

      {/* Lesson Info Cards */}
      <div style={styles.cardsContainer}>
        {/* Theme */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardRow}>
            <span style={styles.infoLabel}>Téma:</span>
            <span style={styles.infoValue}>{lesson.theme}</span>
          </div>
        </div>

        {/* Round */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardRow}>
            <span style={styles.infoLabel}>Kör:</span>
            <span style={styles.infoValue}>{roundText}</span>
          </div>
        </div>

        {/* Difficulty */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardRow}>
            <span style={styles.infoLabel}>Nehézség:</span>
            <span style={styles.infoDifficulty(lesson.difficultyColor)}>{lesson.difficulty}</span>
          </div>
        </div>

        {/* Name */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardRow}>
            <span style={styles.infoLabel}>Neve:</span>
            <span style={styles.infoValue}>{lesson.name}</span>
          </div>
        </div>

        {/* Reward */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardRow}>
            <span style={styles.infoLabel}>Jutalom:</span>
            <div style={styles.rewardRow}>
              <span style={styles.rewardAmount}>150</span>
              <div style={styles.coinIcon}>
                <Coins style={{ width: SIZES.iconSM, height: SIZES.iconSM, color: '#78350F' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button 
        style={styles.startButton}
        onClick={onStart}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, #059669, #047857)';
          e.currentTarget.style.boxShadow = '0 8px 12px rgba(16, 185, 129, 0.4)';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.animation = 'none';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to right, #10B981, #059669)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.3)';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.animation = 'pulse 2s infinite';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
      >
        <span style={styles.startButtonText}>KEZDÉS!</span>
      </button>
    </div>
  );
}
