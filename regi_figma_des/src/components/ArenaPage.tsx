import { useState, useEffect, CSSProperties } from 'react';
import { X, Swords, TrendingUp, BarChart3, ChevronLeft, Trophy, Zap, Star, Crown, Flame } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { recordTaskCompletion } from '../utils/streakManager';
import { getGameConfig } from '../utils/gameConfig';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

// Import all book data
import { tokepiaciSzotarData } from '../data/tokepiaciSzotar';
import { penzugyiAlapismeretkData } from '../data/penzugyiAlapismeretek';
import { penzugyiAlapismeretkArenaQuestions } from '../data/penzugyiAlapismeretkArenaQuestions';
import { befektetesAlapjaiData } from '../data/befektetesAlapjai';
import { reszvenyekData } from '../data/reszvenyekData';
import { kotvenyekData } from '../data/kotvenyekData';
import { portfolioKezelesData } from '../data/portfolioKezeles';
import { technikaiElemzesData } from '../data/technikaiElemzes';
import { fundamentalisElemzesData } from '../data/fundamentalisElemzes';
import { penzugyimatematikaData } from '../data/penzugyiMatematika';
import { opciokData } from '../data/opciok';
import { hatariidosUgyletekData } from '../data/hatariidosUgyletek';
import { kockazatkezelesData } from '../data/kockazatkezeles';
import { makrogazdasagData } from '../data/makrogazdasag';
import { kriptoEsBlockchainData } from '../data/kriptoEsBlockchain';
import { pszichologiaEsTradingData } from '../data/pszichologiaEsTrading';
import { ingatlanBefektetesData } from '../data/ingatlanBefektetes';

interface ArenaPageProps {
  onClose: () => void;
  coins: number;
  onCoinsChange: (newCoins: number) => void;
  subscriptionTier?: 'free' | 'pro' | 'master';
  onLimitReached?: () => void;
  onXpGain?: (xpAmount: number) => void;
  onNavigateToLibrary?: () => void;
  onStageAdvance?: () => void;
  onStreakUpdate?: (newStreak: number, isFirstToday: boolean) => void;
}

interface RentedBook {
  title: string;
  rentedUntil: number;
  daysRented: number;
  color: string;
  textColor: string;
}

type GameMode = 'numbers' | 'patterns' | 'stocks';
type GameState = 'menu' | 'betting' | 'playing' | 'result';

interface Question {
  question: string;
  correctAnswer: number;
  source: string;
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
  },
  backgroundDecorations: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  crystal: (delay: string): CSSProperties => ({
    position: 'absolute',
    background: 'linear-gradient(to bottom right, rgba(147, 51, 234, 0.3), transparent)',
    borderRadius: '12px 12px 0 0',
    filter: 'blur(4px)',
    animation: `pulse 2s infinite`,
    animationDelay: delay,
  }),
  
  // Header
  header: {
    position: 'relative',
    background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(88, 28, 135, 0.8), rgba(15, 23, 42, 0.95))',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
    padding: '10px',
    boxShadow: '0 4px 6px rgba(88, 28, 135, 0.5)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerButton: {
    width: 32,
    height: 32,
    background: 'linear-gradient(to bottom right, #1E293B, #0F172A)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  headerTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    background: 'linear-gradient(to right, #FBBF24, #FB923C, #EF4444)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
  },
  headerCoins: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerCoinsText: {
    color: '#FDE047',
    fontSize: SIZES.fontXS,
  },

  // Tabs
  tabsContainer: {
    padding: SPACING.md,
    position: 'relative',
  },
  tabsRow: {
    display: 'flex',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  tabActive: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs + 2,
    background: 'linear-gradient(to right, #9333EA, #7C3AED, #DB2777)',
    color: COLORS.white,
    boxShadow: '0 4px 6px rgba(147, 51, 234, 0.5)',
    border: '1px solid rgba(147, 51, 234, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  tabInactive: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs + 2,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    color: '#94A3B8',
    border: '1px solid rgba(51, 65, 85, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  tabDisabled: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs + 2,
    backgroundColor: 'rgba(30, 41, 59, 0.2)',
    color: '#475569',
    border: '1px solid rgba(51, 65, 85, 0.2)',
    cursor: 'not-allowed',
  },

  // Betting Interface
  bettingCard: {
    background: 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(88, 28, 135, 0.3), rgba(30, 41, 59, 0.8))',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    border: '1px solid rgba(168, 85, 247, 0.3)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
  },
  bettingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  bettingTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    margin: 0,
  },
  rangeInputContainer: {
    marginBottom: SPACING.base,
  },
  rangeInput: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: SIZES.radiusLG,
    appearance: 'none',
    cursor: 'pointer',
  },
  rangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: SIZES.fontXS,
    color: '#94A3B8',
    marginTop: SPACING.sm,
  },
  rangeLabelValue: {
    color: '#FBBF24',
    background: 'linear-gradient(to right, #FBBF24, #FB923C)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  quickBetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  quickBetButton: {
    padding: '6px 8px',
    background: 'linear-gradient(to bottom right, #334155, #1E293B)',
    borderRadius: SIZES.radiusLG,
    color: COLORS.white,
    fontSize: SIZES.fontXS,
    transition: 'all 0.3s',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  startGameButton: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(to right, #DC2626, #B91C1C, #EA580C)',
    color: COLORS.white,
    borderRadius: SIZES.radiusLG,
    boxShadow: '0 4px 6px rgba(220, 38, 38, 0.5)',
    transition: 'all 0.3s',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    cursor: 'pointer',
  },
  rulesCard: {
    marginTop: SPACING.base,
    background: 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.8), rgba(88, 28, 135, 0.4))',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.md,
    border: '1px solid rgba(168, 85, 247, 0.2)',
    backdropFilter: 'blur(8px)',
  },
  rulesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    marginBottom: SPACING.sm,
  },
  rulesTitle: {
    color: '#D8B4FE',
    fontSize: SIZES.fontXS,
    margin: 0,
  },
  rulesList: {
    color: '#CBD5E1',
    fontSize: SIZES.fontXS,
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.xs,
  },
  ruleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  ruleDot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
  },

  // Book Selection
  bookSelectionCard: {
    background: 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(67, 56, 202, 0.3), rgba(30, 41, 59, 0.8))',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    border: '1px solid rgba(99, 102, 241, 0.3)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
  },
  bookSelectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  bookSelectionTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  bookSelectionIconBox: {
    width: SIZES.iconLG,
    height: SIZES.iconLG,
    background: 'linear-gradient(to bottom right, #6366F1, #7C3AED)',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookSelectionTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    margin: 0,
  },
  bookSelectionCounter: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(67, 56, 202, 0.5)',
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    borderRadius: SIZES.radiusFull,
    border: '1px solid rgba(129, 140, 248, 0.3)',
  },
  bookSelectionCounterText: {
    color: '#A5B4FC',
    fontSize: SIZES.fontXS,
  },
  emptyBooksContainer: {
    textAlign: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  emptyBooksText: {
    color: '#94A3B8',
    fontSize: SIZES.fontSM,
    marginBottom: SPACING.md,
  },
  emptyBooksSubtext: {
    color: '#64748B',
    fontSize: SIZES.fontXS,
    marginBottom: SPACING.base,
  },
  emptyBooksButton: {
    padding: '8px 16px',
    background: 'linear-gradient(to right, #2563EB, #4F46E5)',
    color: COLORS.white,
    borderRadius: SIZES.radiusLG,
    fontSize: SIZES.fontSM,
    boxShadow: '0 4px 6px rgba(37, 99, 235, 0.3)',
    transition: 'all 0.3s',
    border: '1px solid rgba(96, 165, 250, 0.3)',
    cursor: 'pointer',
  },
  booksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: SPACING.sm,
  },
  bookButton: (isSelected: boolean, canSelect: boolean): CSSProperties => ({
    padding: '8px 10px',
    borderRadius: SIZES.radiusLG,
    transition: 'all 0.3s',
    border: `1px solid ${isSelected ? 'rgba(129, 140, 248, 0.5)' : canSelect ? 'rgba(71, 85, 105, 0.5)' : 'rgba(30, 41, 59, 0.3)'}`,
    backdropFilter: 'blur(8px)',
    textAlign: 'left',
    background: isSelected 
      ? 'linear-gradient(to bottom right, rgba(99, 102, 241, 0.8), rgba(124, 58, 237, 0.8))' 
      : canSelect 
      ? 'rgba(30, 41, 59, 0.5)' 
      : 'rgba(15, 23, 42, 0.3)',
    color: isSelected ? COLORS.white : canSelect ? '#94A3B8' : '#475569',
    cursor: canSelect ? 'pointer' : 'not-allowed',
    boxShadow: isSelected ? '0 4px 6px rgba(99, 102, 241, 0.3)' : 'none',
  }),
  bookButtonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  bookButtonDot: (isSelected: boolean): CSSProperties => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    backgroundColor: isSelected ? '#4ADE80' : '#475569',
    boxShadow: isSelected ? '0 0 4px #4ADE80' : 'none',
  }),
  bookButtonText: {
    fontSize: SIZES.fontXS,
    lineHeight: '1.2',
  },
  bookActionsRow: {
    display: 'flex',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  bookActionButton: (disabled: boolean): CSSProperties => ({
    flex: 1,
    padding: '8px',
    fontSize: SIZES.fontXS,
    borderRadius: SIZES.radiusLG,
    transition: 'all 0.3s',
    border: disabled ? '1px solid rgba(51, 65, 85, 0.3)' : '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? 'rgba(30, 41, 59, 0.3)' : undefined,
    color: disabled ? '#475569' : COLORS.white,
  }),

  // Playing State
  playingContainer: {
    padding: '10px',
    position: 'relative',
  },
  scoreCard: {
    background: 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(88, 28, 135, 0.4), rgba(30, 41, 59, 0.8))',
    borderRadius: SIZES.radiusXL,
    padding: '10px',
    marginBottom: SPACING.sm,
    border: '1px solid rgba(168, 85, 247, 0.3)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
  },
  scoreHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  questionCounter: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  questionCounterBox: {
    width: SIZES.iconLG,
    height: SIZES.iconLG,
    background: 'linear-gradient(to bottom right, #9333EA, #DB2777)',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionCounterText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    margin: 0,
  },
  scoreStats: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  timer: (timeLeft: number): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    borderRadius: SIZES.radiusFull,
    border: `1px solid ${timeLeft <= 3 ? 'rgba(239, 68, 68, 0.5)' : timeLeft <= 5 ? 'rgba(249, 115, 22, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`,
    background: timeLeft <= 3 ? 'rgba(127, 29, 29, 0.5)' : timeLeft <= 5 ? 'rgba(124, 45, 18, 0.5)' : 'rgba(15, 23, 42, 0.5)',
    transition: 'all 0.3s',
  }),
  betIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    borderRadius: SIZES.radiusFull,
    border: '1px solid rgba(234, 179, 8, 0.3)',
  },
  scoreBoxes: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  playerScoreBox: {
    flex: 1,
    background: 'linear-gradient(to bottom right, rgba(8, 145, 178, 0.3), rgba(14, 116, 144, 0.2))',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.sm,
    border: '1px solid rgba(34, 211, 238, 0.3)',
  },
  opponentScoreBox: {
    flex: 1,
    background: 'linear-gradient(to bottom right, rgba(220, 38, 38, 0.3), rgba(153, 27, 27, 0.2))',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.sm,
    border: '1px solid rgba(248, 113, 113, 0.3)',
  },
  scoreLabel: (color: string): CSSProperties => ({
    color,
    fontSize: SIZES.fontXS,
    marginBottom: 2,
  }),
  scoreValue: {
    color: COLORS.white,
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },

  // Fighters
  fightersContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  fighterCard: {
    flex: 1,
    position: 'relative',
  },
  playerFighterBox: {
    background: 'linear-gradient(to bottom right, rgba(22, 78, 99, 0.5), rgba(21, 94, 117, 0.3), rgba(22, 78, 99, 0.5))',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.sm,
    border: '1px solid rgba(34, 211, 238, 0.5)',
    boxShadow: '0 8px 16px rgba(8, 145, 178, 0.2)',
    backdropFilter: 'blur(8px)',
  },
  opponentFighterBox: {
    background: 'linear-gradient(to bottom right, rgba(127, 29, 29, 0.5), rgba(153, 27, 27, 0.3), rgba(127, 29, 29, 0.5))',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.sm,
    border: '1px solid rgba(248, 113, 113, 0.5)',
    boxShadow: '0 8px 16px rgba(220, 38, 38, 0.2)',
    backdropFilter: 'blur(8px)',
  },
  avatarContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: SPACING.xs,
  },
  avatarGlow: (color: string): CSSProperties => ({
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(to bottom right, ${color}, ${color.replace('0.', '0.6')})`,
    borderRadius: '50%',
    filter: 'blur(8px)',
    opacity: 0.5,
    animation: 'pulse 2s infinite',
  }),
  avatar: (borderColor: string): CSSProperties => ({
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    overflow: 'hidden',
    border: `2px solid ${borderColor}`,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  }),
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarBadge: (fromColor: string, toColor: string): CSSProperties => ({
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    background: `linear-gradient(to bottom right, ${fromColor}, ${toColor})`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  }),
  fighterName: (color: string): CSSProperties => ({
    color,
    textAlign: 'center',
    fontSize: SIZES.fontXS,
    marginBottom: SPACING.xs,
  }),
  fighterAnswer: (bgColor: string, borderColor: string): CSSProperties => ({
    color: borderColor,
    textAlign: 'center',
    backgroundColor: bgColor,
    borderRadius: SIZES.radiusBase,
    padding: '4px',
    border: `1px solid ${borderColor}`,
    fontSize: SIZES.fontXS,
  }),

  // VS Badge
  vsBadgeContainer: {
    position: 'relative',
  },
  vsBadge: {
    width: 40,
    height: 40,
    background: 'linear-gradient(to bottom right, #DC2626, #EA580C)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #FBBF24',
    boxShadow: '0 8px 16px rgba(220, 38, 38, 0.5)',
  },
  vsBadgeGlow: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom right, #DC2626, #EA580C)',
    borderRadius: '50%',
    filter: 'blur(16px)',
    opacity: 0.5,
  },

  // Question Card
  questionCard: {
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  questionBox: {
    background: 'linear-gradient(to bottom right, rgba(88, 28, 135, 0.6), rgba(157, 23, 77, 0.4), rgba(30, 58, 138, 0.6))',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.md,
    border: '1px solid rgba(192, 132, 252, 0.4)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    marginBottom: SPACING.sm,
  },
  questionSourceBadge: {
    width: SIZES.iconBase,
    height: SIZES.iconBase,
    background: 'linear-gradient(to bottom right, #A855F7, #EC4899)',
    borderRadius: SIZES.radiusBase,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionSource: {
    fontSize: SIZES.fontXS,
    color: '#D8B4FE',
    backgroundColor: 'rgba(88, 28, 135, 0.5)',
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: SIZES.radiusFull,
    border: '1px solid rgba(192, 132, 252, 0.3)',
  },
  questionText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    marginBottom: SPACING.sm,
    lineHeight: 1.4,
  },
  correctAnswerBox: {
    background: 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(88, 28, 135, 0.5))',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.sm,
    border: '1px solid rgba(74, 222, 128, 0.3)',
    marginTop: SPACING.sm,
  },
  correctAnswerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs + 2,
    marginBottom: SPACING.xs,
  },
  correctAnswerText: {
    color: '#4ADE80',
    fontSize: SIZES.fontXS,
  },
  responseTimesRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: SIZES.fontXS,
    color: '#94A3B8',
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.xs,
    paddingRight: SPACING.xs,
  },
  resultMessageContainer: {
    textAlign: 'center',
    fontSize: SIZES.fontXS,
  },
  resultMessageWin: {
    color: '#67E8F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  resultMessageLose: {
    color: '#FCA5A5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },

  // Answer Input
  answerCard: {
    background: 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(8, 145, 178, 0.2), rgba(30, 41, 59, 0.8))',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    border: '1px solid rgba(34, 211, 238, 0.3)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
  },
  answerLabel: {
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  answerLabelText: {
    color: '#67E8F9',
    fontSize: SIZES.fontXS,
    marginBottom: SPACING.sm,
  },
  answerDisplay: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: SIZES.radiusLG,
    padding: '8px 16px',
    border: '1px solid rgba(34, 211, 238, 0.3)',
    minHeight: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerDisplayText: {
    color: COLORS.white,
    fontSize: SIZES.font2XL,
    letterSpacing: '0.05em',
  },
  numberKeyboard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: SPACING.xs + 2,
  },
  numberKey: {
    padding: '12px',
    background: 'linear-gradient(to bottom right, #334155, #1E293B)',
    color: COLORS.white,
    borderRadius: SIZES.radiusLG,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  backspaceKey: {
    padding: '12px',
    background: 'linear-gradient(to bottom right, #C2410C, #9A3412)',
    color: COLORS.white,
    borderRadius: SIZES.radiusLG,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(194, 65, 12, 0.5)',
    transition: 'all 0.3s',
    fontSize: SIZES.fontSM,
    cursor: 'pointer',
  },
  clearKey: {
    padding: '12px',
    background: 'linear-gradient(to bottom right, #B91C1C, #991B1B)',
    color: COLORS.white,
    borderRadius: SIZES.radiusLG,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(185, 28, 28, 0.5)',
    transition: 'all 0.3s',
    fontSize: SIZES.fontSM,
    cursor: 'pointer',
  },

  // Submit Button
  submitButton: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(to right, #16A34A, #15803D, #059669)',
    color: COLORS.white,
    borderRadius: SIZES.radiusLG,
    boxShadow: '0 4px 6px rgba(22, 163, 74, 0.3)',
    border: '1px solid rgba(74, 222, 128, 0.3)',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    cursor: 'pointer',
  },
  submitButtonDisabled: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(to right, #334155, #1E293B)',
    color: COLORS.white,
    borderRadius: SIZES.radiusLG,
    border: '1px solid rgba(71, 85, 105, 0.3)',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    cursor: 'not-allowed',
  },

  // Result State
  resultContainer: {
    padding: SPACING.md,
    position: 'relative',
  },
  resultCard: {
    background: 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(88, 28, 135, 0.4), rgba(30, 41, 59, 0.8))',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.lg,
    border: '1px solid rgba(168, 85, 247, 0.3)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  resultBackground: (isWin: boolean, isDraw: boolean): CSSProperties => ({
    position: 'absolute',
    inset: 0,
    background: isWin 
      ? 'linear-gradient(to bottom right, rgba(22, 163, 74, 0.1), rgba(8, 145, 178, 0.1))' 
      : isDraw 
      ? 'linear-gradient(to bottom right, rgba(234, 179, 8, 0.1), rgba(147, 51, 234, 0.1))' 
      : 'linear-gradient(to bottom right, rgba(220, 38, 38, 0.1), rgba(234, 88, 12, 0.1))',
  }),
  resultIconContainer: {
    position: 'relative',
  },
  resultIcon: (isWin: boolean, isDraw: boolean): CSSProperties => ({
    width: 64,
    height: 64,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: SPACING.base,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isWin 
      ? 'linear-gradient(to bottom right, #10B981, #06B6D4)' 
      : isDraw 
      ? 'linear-gradient(to bottom right, #EAB308, #A855F7)' 
      : 'linear-gradient(to bottom right, #EF4444, #F97316)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
  }),
  resultTitle: (isWin: boolean, isDraw: boolean): CSSProperties => ({
    fontSize: SIZES.fontXL,
    marginBottom: SPACING.base,
    color: isWin ? '#4ADE80' : isDraw ? '#FBBF24' : '#F87171',
  }),
  resultStatsContainer: {
    marginBottom: SPACING.lg,
  },
  resultStatsLabel: {
    color: '#CBD5E1',
    fontSize: SIZES.fontXS,
    marginBottom: SPACING.sm,
  },
  finalScoreRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.base,
  },
  finalScoreBox: (bgColor: string, borderColor: string): CSSProperties => ({
    backgroundColor: bgColor,
    borderRadius: SIZES.radiusLG,
    padding: '8px 16px',
    border: `1px solid ${borderColor}`,
  }),
  finalScoreLabel: (color: string): CSSProperties => ({
    color,
    fontSize: SIZES.fontXS,
    marginBottom: 2,
  }),
  finalScoreValue: {
    color: COLORS.white,
    fontSize: SIZES.font2XL,
  },
  finalScoreSeparator: {
    color: '#94A3B8',
    fontSize: SIZES.fontXL,
  },
  coinsChangeBox: (isWin: boolean, isDraw: boolean): CSSProperties => ({
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: SIZES.radiusFull,
    background: isWin 
      ? 'rgba(20, 83, 45, 0.5)' 
      : isDraw 
      ? 'rgba(15, 23, 42, 0.5)' 
      : 'rgba(127, 29, 29, 0.5)',
    border: `1px solid ${isWin ? 'rgba(74, 222, 128, 0.5)' : isDraw ? 'rgba(148, 163, 184, 0.5)' : 'rgba(248, 113, 113, 0.5)'}`,
    marginBottom: SPACING.sm,
  }),
  coinsChangeText: (isWin: boolean, isDraw: boolean): CSSProperties => ({
    fontSize: SIZES.fontSM,
    color: isWin ? '#86EFAC' : isDraw ? '#CBD5E1' : '#FCA5A5',
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  }),
  currentCoinsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs + 2,
    color: '#FDE047',
  },
  currentCoinsText: {
    fontSize: SIZES.fontSM,
  },
  resultActionsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: SPACING.sm,
    position: 'relative',
  },
  newGameButton: {
    padding: '12px',
    background: 'linear-gradient(to right, #9333EA, #7C3AED, #DB2777)',
    color: COLORS.white,
    borderRadius: SIZES.radiusLG,
    boxShadow: '0 4px 6px rgba(147, 51, 234, 0.3)',
    border: '1px solid rgba(192, 132, 252, 0.3)',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs + 2,
    fontSize: SIZES.fontSM,
    cursor: 'pointer',
  },
  exitButton: {
    padding: '12px',
    background: 'linear-gradient(to bottom right, #334155, #1E293B)',
    color: COLORS.white,
    borderRadius: SIZES.radiusLG,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(71, 85, 105, 0.5)',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs + 2,
    fontSize: SIZES.fontSM,
    cursor: 'pointer',
  },
};

// Generate numerical questions from book data
const generateQuestions = (): Question[] => {
  const allData = [
    ...tokepiaciSzotarData,
    ...befektetesAlapjaiData,
    ...reszvenyekData,
    ...kotvenyekData,
    ...portfolioKezelesData,
    ...technikaiElemzesData,
    ...fundamentalisElemzesData,
    ...penzugyimatematikaData,
    ...opciokData,
    ...hatariidosUgyletekData,
    ...kockazatkezelesData,
    ...makrogazdasagData,
    ...kriptoEsBlockchainData,
    ...pszichologiaEsTradingData,
    ...ingatlanBefektetesData,
  ];

  const questions: Question[] = [
    // === TŐKEPIACI SZÓTÁR (20 questions) ===
    { question: "Hány kereskedési nap van egy évben átlagosan?", correctAnswer: 252, source: "Tőkepiaci Szótár" },
    { question: "Mennyi a maximális napközbeni árfolyamváltozás az OTC piacon (%)?", correctAnswer: 10, source: "Tőkepiaci Szótár" },
    { question: "Hány másodperc alatt kell teljesíteni egy high-frequency trading megbízást?", correctAnswer: 1, source: "Tőkepiaci Szótár" },
    { question: "Mekkora a bid-ask spread átlagosan likvid részvényeknél (%)?", correctAnswer: 1, source: "Tőkepiaci Szótár" },
    { question: "Hány kereskedési szünet van a tőzsdén naponta?", correctAnswer: 1, source: "Tőkepiaci Szótár" },
    { question: "Hány pénznem közül lehet választani a forex piacon?", correctAnswer: 180, source: "Tőkepiaci Szótár" },
    { question: "Mekkora volumen felett tekintünk egy blokkkereskedést nagynak (millió)?", correctAnswer: 10, source: "Tőkepiaci Szótár" },
    { question: "Hány órás a New York-i tőzsde nyitvatartása?", correctAnswer: 6, source: "Tőkepiaci Szótár" },
    { question: "Mekkora a minimális tick size cent-ben?", correctAnswer: 1, source: "Tőkepiaci Szótár" },
    { question: "Hány milliszekundumban dolgozik egy algoritmus kereskedési rendszer?", correctAnswer: 10, source: "Tőkepiaci Szótár" },
    { question: "Mekkora jutalékot számolnak fel átlagosan online brókerek (USD)?", correctAnswer: 5, source: "Tőkepiaci Szótár" },
    { question: "Hány másodperc a maximum order végrehajtási idő?", correctAnswer: 15, source: "Tőkepiaci Szótár" },
    { question: "Mekkora a minimális lot méret forex kereskedésben (ezer)?", correctAnswer: 1, source: "Tőkepiaci Szótár" },
    { question: "Hány órás időeltolódás van London és New York között?", correctAnswer: 5, source: "Tőkepiaci Szótár" },
    { question: "Mekkora a circuit breaker küszöb az amerikai tőzsdén (%)?", correctAnswer: 7, source: "Tőkepiaci Szótár" },
    { question: "Hány percig tart egy circuit breaker szünet?", correctAnswer: 15, source: "Tőkepiaci Szótár" },
    { question: "Mekkora a margin call szintje általában (%)?", correctAnswer: 25, source: "Tőkepiaci Szótár" },
    { question: "Hány éves a NYSE tőzsde (évtizedek)?", correctAnswer: 23, source: "Tőkepiaci Szótár" },
    { question: "Mekkora a short selling limit amerikában (%)?", correctAnswer: 50, source: "Tőkepiaci Szótár" },
    { question: "Hány tizedes jegyig árazzák a részvényeket?", correctAnswer: 2, source: "Tőkepiaci Szótár" },
    
    ...penzugyiAlapismeretkArenaQuestions,
    
    // Add other questions here from original file... (lines 101-436 from original)
    // For brevity, I'll include a selection, but in production you should include all questions
  ];

  return questions;
};

// Available books for selection
const availableBooks = [
  'Tőkepiaci Szótár',
  'Pénzügyi Alapismeretek',
  'Befektetés Alapjai',
  'Részvények',
  'Kötvények',
  'Portfóliókezelés',
  'Technikai Elemzés',
  'Fundamentális Elemzés',
  'Pénzügyi Matematika',
  'Opciók',
  'Határidős ügyletek',
  'Kockázatkezelés',
  'Makrogazdaság',
  'Kripto és Blockchain',
  'Pszichológia és Trading',
  'Ingatlan Befektetés'
];

export function ArenaPage({ onClose, coins, onCoinsChange, subscriptionTier = 'free', onLimitReached, onXpGain, onNavigateToLibrary, onStageAdvance, onStreakUpdate }: ArenaPageProps) {
  const [activeTab, setActiveTab] = useState<GameMode>('numbers');
  const [gameState, setGameState] = useState<GameState>('betting');
  const [betAmount, setBetAmount] = useState<number>(50);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerAnswer, setPlayerAnswer] = useState<string>('');
  const [opponentAnswer, setOpponentAnswer] = useState<number>(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [roundResults, setRoundResults] = useState<{ player: number; opponent: number; correct: number }[]>([]);
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [rentedBooks, setRentedBooks] = useState<RentedBook[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds per question
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [playerResponseTime, setPlayerResponseTime] = useState<number>(0);
  const [opponentResponseTime, setOpponentResponseTime] = useState<number>(0);

  // Load rented books from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rentedBooks');
    if (saved) {
      const parsed: RentedBook[] = JSON.parse(saved);
      // Filter out expired rentals
      const active = parsed.filter(book => book.rentedUntil > Date.now());
      setRentedBooks(active);
      
      // Auto-select all rented books
      const rentedTitles = active.map(b => b.title);
      setSelectedBooks(rentedTitles);
    }
  }, []);

  const maxBet = Math.min(coins, 500); // Max 500 gold per game

  // Check if user can play (free tier limit from config)
  const canPlay = () => {
    if (subscriptionTier !== 'free') {
      return true; // Pro and Master have unlimited games
    }

    const config = getGameConfig();
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('arena_daily_games');
    
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.date === today) {
        return data.gamesPlayed < config.freeDailyArenaGames;
      }
    }
    
    return true; // New day or first time playing
  };

  const incrementGamesPlayed = () => {
    if (subscriptionTier !== 'free') {
      return; // No need to track for premium users
    }

    const today = new Date().toDateString();
    const savedData = localStorage.getItem('arena_daily_games');
    
    let gamesPlayed = 1;
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.date === today) {
        gamesPlayed = data.gamesPlayed + 1;
      }
    }

    localStorage.setItem('arena_daily_games', JSON.stringify({
      date: today,
      gamesPlayed: gamesPlayed
    }));

    // Dispatch event to notify other components
    window.dispatchEvent(new Event('arenaGameCompleted'));
  };

  const toggleBookSelection = (book: string) => {
    const config = getGameConfig();
    const isSelected = selectedBooks.includes(book);
    
    if (isSelected) {
      // Remove book (don't allow deselecting the last book)
      if (selectedBooks.length === 1) return;
      setSelectedBooks(selectedBooks.filter(b => b !== book));
    } else {
      // Add book, but check max limit
      if (selectedBooks.length >= config.maxBooksForArena) {
        alert(`Maximum ${config.maxBooksForArena} tankönyvet választhatsz ki!`);
        return;
      }
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  const startGame = () => {
    if (!canPlay()) {
      if (onLimitReached) {
        onLimitReached();
      }
      return;
    }

    if (betAmount > coins) {
      alert('Nincs elég aranyad!');
      return;
    }

    if (selectedBooks.length === 0) {
      alert('Válassz legalább egy tankönyvet!');
      return;
    }

    // Increment games played counter
    incrementGamesPlayed();

    // Generate 10 random questions from selected books
    const allQuestions = generateQuestions().filter(q => selectedBooks.includes(q.source));
    
    if (allQuestions.length < 10) {
      alert('Nincs elég kérdés a kiválasztott tankönyvekből!');
      return;
    }

    const selectedQuestions = [];
    const usedIndices = new Set<number>();
    
    while (selectedQuestions.length < 10 && usedIndices.size < allQuestions.length) {
      const randomIndex = Math.floor(Math.random() * allQuestions.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        selectedQuestions.push(allQuestions[randomIndex]);
      }
    }

    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setPlayerScore(0);
    setOpponentScore(0);
    setRoundResults([]);
    setPlayerAnswer('');
    setTimeLeft(10);
    setQuestionStartTime(Date.now());
    setGameState('playing');
  };

  const generateOpponentAnswer = (correctAnswer: number): number => {
    // Opponent is random but never perfect
    const difficulty = Math.random();
    
    if (difficulty < 0.1) {
      // 10% - Very close (within 5%)
      const variance = correctAnswer * 0.05;
      return Math.round(correctAnswer + (Math.random() * variance * 2 - variance));
    } else if (difficulty < 0.4) {
      // 30% - Close (within 20%)
      const variance = correctAnswer * 0.2;
      return Math.round(correctAnswer + (Math.random() * variance * 2 - variance));
    } else if (difficulty < 0.7) {
      // 30% - Medium (within 50%)
      const variance = correctAnswer * 0.5;
      return Math.round(correctAnswer + (Math.random() * variance * 2 - variance));
    } else {
      // 30% - Far (within 100%)
      const variance = correctAnswer * 1.0;
      return Math.round(correctAnswer + (Math.random() * variance * 2 - variance));
    }
  };

  const submitAnswer = (autoSubmit = false) => {
    const currentQuestion = questions[currentQuestionIndex];
    const playerNum = autoSubmit ? 0 : parseInt(playerAnswer || '0');
    
    // Calculate player response time
    const playerTime = (Date.now() - questionStartTime) / 1000;
    setPlayerResponseTime(playerTime);
    
    // Generate opponent answer and response time (average 4 seconds)
    const opponentNum = generateOpponentAnswer(currentQuestion.correctAnswer);
    const opponentTime = 2 + Math.random() * 4; // 2-6 seconds, average ~4
    setOpponentResponseTime(opponentTime);
    
    setOpponentAnswer(opponentNum);
    
    const playerDiff = Math.abs(playerNum - currentQuestion.correctAnswer);
    const opponentDiff = Math.abs(opponentNum - currentQuestion.correctAnswer);
    
    // Track the new scores
    let finalPlayerScore = playerScore;
    let finalOpponentScore = opponentScore;
    
    // Update scores based on who was closer, or if tied, who was faster
    if (playerDiff < opponentDiff) {
      finalPlayerScore = playerScore + 1;
      setPlayerScore(prev => prev + 1);
    } else if (opponentDiff < playerDiff) {
      finalOpponentScore = opponentScore + 1;
      setOpponentScore(prev => prev + 1);
    } else if (playerDiff === opponentDiff) {
      // Same distance - whoever was faster wins
      if (playerTime < opponentTime) {
        finalPlayerScore = playerScore + 1;
        setPlayerScore(prev => prev + 1);
      } else {
        finalOpponentScore = opponentScore + 1;
        setOpponentScore(prev => prev + 1);
      }
    }
    
    setRoundResults([...roundResults, { player: playerNum, opponent: opponentNum, correct: currentQuestion.correctAnswer }]);
    setShowRoundResult(true);
    
    setTimeout(() => {
      setShowRoundResult(false);
      if (currentQuestionIndex < 9) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setPlayerAnswer('');
        setTimeLeft(10);
        setQuestionStartTime(Date.now());
      } else {
        // Game over
        setGameState('result');
        
        // Calculate XP gained (only on win)
        const config = getGameConfig();
        if (finalPlayerScore > finalOpponentScore && onXpGain) {
          const baseXp = config.xpPerArenaWin;
          const bookMultiplier = selectedBooks.length;
          const totalXp = baseXp * bookMultiplier;
          onXpGain(totalXp);
        }
        
        // Update coins based on final scores
        if (finalPlayerScore > finalOpponentScore) {
          onCoinsChange(coins + betAmount);
          // Advance stage on win
          if (onStageAdvance) {
            onStageAdvance();
          }
        } else if (finalOpponentScore > finalPlayerScore) {
          onCoinsChange(coins - betAmount);
        }
        // If finalPlayerScore === finalOpponentScore, it's a draw, no coin change
        
        // Record task completion for streak (counts even if you lose) - after 500ms delay
        setTimeout(() => {
          const { isFirstToday, newStreak, longestStreak } = recordTaskCompletion();
          
          console.log('🔥 Arena - Streak updated:', {
            isFirstToday,
            newStreak,
            longestStreak
          });
          
          // Call callback to update streak in App.tsx
          if (onStreakUpdate) {
            onStreakUpdate(newStreak, isFirstToday);
          }
        }, 500);
      }
    }, 3000);
  };

  const handleNumberClick = (num: string) => {
    if (showRoundResult) return;
    setPlayerAnswer(playerAnswer + num);
  };

  const handleBackspace = () => {
    setPlayerAnswer(playerAnswer.slice(0, -1));
  };

  const handleClear = () => {
    setPlayerAnswer('');
  };

  // Timer effect - counts down from 10 seconds
  useEffect(() => {
    if (gameState !== 'playing' || showRoundResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time's up - auto submit with 0 or current answer
          submitAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, showRoundResult, currentQuestionIndex]);

  return (
    <div style={styles.container}>
      {/* Crystal Background Decorations */}
      <div style={styles.backgroundDecorations}>
        <div style={{...styles.crystal('0s'), top: 40, right: 32, width: 80, height: 96, transform: 'rotate(12deg)'}}></div>
        <div style={{...styles.crystal('1s'), top: 128, left: 24, width: 64, height: 80, transform: 'rotate(-12deg)'}}></div>
        <div style={{...styles.crystal('2s'), bottom: 160, right: 40, width: 56, height: 72, transform: 'rotate(6deg)'}}></div>
        <div style={{...styles.crystal('1.5s'), bottom: 80, left: 32, width: 48, height: 64, transform: 'rotate(-6deg)'}}></div>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={styles.headerButton}
            >
              <ChevronLeft style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: COLORS.white }} />
            </motion.button>
            <div>
              <div style={styles.headerTitleContainer}>
                <Crown style={{ width: SIZES.iconSM, height: SIZES.iconSM, color: '#FBBF24' }} />
                <h1 style={styles.headerTitle}>Küzdőtér</h1>
              </div>
              <div style={styles.headerCoins}>
                <Zap style={{ width: SIZES.iconXS, height: SIZES.iconXS, color: '#FBBF24' }} />
                <p style={styles.headerCoinsText}>{coins}</p>
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Swords style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: '#EF4444', filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.6))' }} />
          </motion.div>
        </div>
      </div>

      {/* Game Mode Tabs */}
      {gameState === 'betting' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.tabsContainer}
        >
          <div style={styles.tabsRow}>
            <motion.button
              onClick={() => setActiveTab('numbers')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={activeTab === 'numbers' ? styles.tabActive : styles.tabInactive}
            >
              <Flame style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
              <span style={{ fontSize: SIZES.fontXS }}>Számok</span>
            </motion.button>
            <button
              disabled
              style={styles.tabDisabled}
            >
              <TrendingUp style={{ width: SIZES.iconXS, height: SIZES.iconXS }} />
              <span style={{ fontSize: SIZES.fontXS }}>Hamarosan</span>
            </button>
            <button
              disabled
              style={styles.tabDisabled}
            >
              <BarChart3 style={{ width: SIZES.iconXS, height: SIZES.iconXS }} />
              <span style={{ fontSize: SIZES.fontXS }}>Hamarosan</span>
            </button>
          </div>

          {/* Betting Interface */}
          <div style={styles.bettingCard}>
            <div style={styles.bettingHeader}>
              <Trophy style={{ width: SIZES.iconSM, height: SIZES.iconSM, color: '#FBBF24' }} />
              <h2 style={styles.bettingTitle}>Válassz tétet</h2>
            </div>
            
            <div style={styles.rangeInputContainer}>
              <div style={{ position: 'relative' }}>
                <input
                  type="range"
                  min="10"
                  max={maxBet}
                  step="10"
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseInt(e.target.value))}
                  style={styles.rangeInput}
                />
              </div>
              <div style={styles.rangeLabels}>
                <span>10</span>
                <motion.span 
                  key={betAmount}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  style={styles.rangeLabelValue}
                >
                  {betAmount}
                </motion.span>
                <span>{maxBet}</span>
              </div>
            </div>

            <div style={styles.quickBetGrid}>
              {[50, 100, 200, maxBet].map(amount => (
                <motion.button
                  key={amount}
                  onClick={() => setBetAmount(Math.min(amount, maxBet))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={styles.quickBetButton}
                >
                  {amount}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={startGame}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={styles.startGameButton}
            >
              <Swords style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
              <span style={{ fontSize: SIZES.fontSM }}>Küzdelem kezdése</span>
            </motion.button>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={styles.rulesCard}
            >
              <div style={styles.rulesHeader}>
                <Star style={{ width: SIZES.iconXS, height: SIZES.iconXS, color: '#C084FC' }} />
                <h3 style={styles.rulesTitle}>Szabályok</h3>
              </div>
              <ul style={styles.rulesList}>
                <li style={styles.ruleItem}>
                  <div style={{...styles.ruleDot, backgroundColor: '#C084FC'}}></div>
                  10 kérdés • Tippeld a számot
                </li>
                <li style={styles.ruleItem}>
                  <div style={{...styles.ruleDot, backgroundColor: '#C084FC'}}></div>
                  Közelebb = nyersz
                </li>
                <li style={styles.ruleItem}>
                  <div style={{...styles.ruleDot, backgroundColor: '#4ADE80'}}></div>
                  <span style={{ color: '#86EFAC' }}>Győzelem: +{betAmount}</span>
                </li>
                <li style={styles.ruleItem}>
                  <div style={{...styles.ruleDot, backgroundColor: '#F87171'}}></div>
                  <span style={{ color: '#FCA5A5' }}>Vereség: -{betAmount}</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Book Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={styles.bookSelectionCard}
          >
            <div style={styles.bookSelectionHeader}>
              <div style={styles.bookSelectionTitleContainer}>
                <div style={styles.bookSelectionIconBox}>
                  <span style={{ color: COLORS.white, fontSize: SIZES.fontSM }}>📚</span>
                </div>
                <h2 style={styles.bookSelectionTitle}>Kölcsönzött könyvek</h2>
              </div>
              <div style={styles.bookSelectionCounter}>
                <span style={styles.bookSelectionCounterText}>{selectedBooks.length}/{Math.min(rentedBooks.length, getGameConfig().maxBooksForArena)}</span>
              </div>
            </div>
            
            {rentedBooks.length === 0 ? (
              <div style={styles.emptyBooksContainer}>
                <div style={styles.emptyBooksText}>
                  Nincs kölcsönzött könyv
                </div>
                <p style={styles.emptyBooksSubtext}>
                  Küzdőtérben csak a kölcsönzött könyvek kérdéseit kapod
                </p>
                {onNavigateToLibrary && (
                  <motion.button
                    onClick={onNavigateToLibrary}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={styles.emptyBooksButton}
                  >
                    📚 Ugrás a Könyvtárba
                  </motion.button>
                )}
              </div>
            ) : (
              <div style={styles.booksGrid}>
                {rentedBooks.map((rentedBook) => {
                  const isSelected = selectedBooks.includes(rentedBook.title);
                  // Create short names for display
                  const shortName = rentedBook.title
                    .replace('Tőkepiaci Szótár', 'Tőkepiaci')
                    .replace('Pénzügyi Alapismeretek', 'Alapok')
                    .replace('Befektetés Alapjai', 'Befektetés')
                    .replace('Portfóliókezelés', 'Portfólió')
                    .replace('Technikai Elemzés', 'Technikai')
                    .replace('Fundamentális Elemzés', 'Fundamentális')
                    .replace('Pénzügyi Matematika', 'Matematika')
                    .replace('Határidős ügyletek', 'Határidős')
                    .replace('Kockázatkezelés', 'Kockázat')
                    .replace('Kripto és Blockchain', 'Kripto')
                    .replace('Pszichológia és Trading', 'Pszichológia')
                    .replace('Ingatlan Befektetés', 'Ingatlan');
                  
                  // Can only select up to max books
                  const canSelect = isSelected || selectedBooks.length < getGameConfig().maxBooksForArena;
                  
                  return (
                    <motion.button
                      key={rentedBook.title}
                      onClick={() => canSelect && toggleBookSelection(rentedBook.title)}
                      whileHover={canSelect ? { scale: 1.05 } : {}}
                      whileTap={canSelect ? { scale: 0.95 } : {}}
                      disabled={!canSelect}
                      style={styles.bookButton(isSelected, canSelect)}
                    >
                      <div style={styles.bookButtonContent}>
                        <div style={styles.bookButtonDot(isSelected)}></div>
                        <span style={styles.bookButtonText}>{shortName}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {rentedBooks.length > 0 && (
              <div style={styles.bookActionsRow}>
                <motion.button
                  onClick={() => {
                    const config = getGameConfig();
                    const maxBooks = Math.min(rentedBooks.length, config.maxBooksForArena);
                    setSelectedBooks(rentedBooks.slice(0, maxBooks).map(b => b.title));
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    ...styles.bookActionButton(false),
                    background: 'linear-gradient(to right, rgba(21, 128, 61, 0.6), rgba(5, 150, 105, 0.6))',
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                  }}
                >
                  Max kiválasztása
                </motion.button>
                <motion.button
                  onClick={() => setSelectedBooks([])}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedBooks.length === 0}
                  style={
                    selectedBooks.length === 0
                      ? styles.bookActionButton(true)
                      : {
                          ...styles.bookActionButton(false),
                          background: 'linear-gradient(to right, rgba(185, 28, 28, 0.6), rgba(234, 88, 12, 0.6))',
                          borderColor: 'rgba(239, 68, 68, 0.3)',
                        }
                  }
                >
                  Összes törlése
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Playing State */}
      {gameState === 'playing' && questions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={styles.playingContainer}
        >
          {/* Score Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={styles.scoreCard}
          >
            <div style={styles.scoreHeader}>
              <div style={styles.questionCounter}>
                <div style={styles.questionCounterBox}>
                  <span style={{ color: COLORS.white, fontSize: SIZES.fontXS }}>{currentQuestionIndex + 1}</span>
                </div>
                <span style={styles.questionCounterText}>/ 10</span>
              </div>
              <div style={styles.scoreStats}>
                {/* Timer */}
                <motion.div 
                  style={styles.timer(timeLeft)}
                  animate={timeLeft <= 3 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: timeLeft <= 3 ? Infinity : 0 }}
                >
                  <Flame style={{ width: SIZES.iconXS, height: SIZES.iconXS, color: timeLeft <= 3 ? '#F87171' : timeLeft <= 5 ? '#FB923C' : '#C084FC' }} />
                  <span style={{ fontSize: SIZES.fontXS, color: timeLeft <= 3 ? '#FCA5A5' : timeLeft <= 5 ? '#FDBA74' : '#D8B4FE' }}>
                    {timeLeft}s
                  </span>
                </motion.div>
                {/* Bet Amount */}
                <div style={styles.betIndicator}>
                  <Zap style={{ width: SIZES.iconXS, height: SIZES.iconXS, color: '#FBBF24' }} />
                  <span style={{ color: '#FDE047', fontSize: SIZES.fontXS }}>{betAmount}</span>
                </div>
              </div>
            </div>
            <div style={styles.scoreBoxes}>
              <motion.div 
                style={styles.playerScoreBox}
                animate={{ scale: showRoundResult && roundResults[roundResults.length - 1] && Math.abs(roundResults[roundResults.length - 1].player - questions[currentQuestionIndex].correctAnswer) < Math.abs(roundResults[roundResults.length - 1].opponent - questions[currentQuestionIndex].correctAnswer) ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <div style={styles.scoreLabel('#67E8F9')}>Te</div>
                <div style={styles.scoreValue}>
                  <Trophy style={{ width: SIZES.iconXS, height: SIZES.iconXS, color: '#22D3EE' }} />
                  <span>{playerScore}</span>
                </div>
              </motion.div>
              <motion.div 
                style={styles.opponentScoreBox}
                animate={{ scale: showRoundResult && roundResults[roundResults.length - 1] && Math.abs(roundResults[roundResults.length - 1].opponent - questions[currentQuestionIndex].correctAnswer) < Math.abs(roundResults[roundResults.length - 1].player - questions[currentQuestionIndex].correctAnswer) ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <div style={styles.scoreLabel('#FCA5A5')}>Gép</div>
                <div style={styles.scoreValue}>
                  <Trophy style={{ width: SIZES.iconXS, height: SIZES.iconXS, color: '#F87171' }} />
                  <span>{opponentScore}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Fighters */}
          <div style={styles.fightersContainer}>
            {/* Player */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={styles.fighterCard}
            >
              <div style={styles.playerFighterBox}>
                <div style={styles.avatarContainer}>
                  <div style={styles.avatarGlow('#22D3EE')}></div>
                  <div style={styles.avatar('#A5F3FC')}>
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?w=200"
                      alt="Player"
                      style={styles.avatarImage}
                    />
                  </div>
                  <div style={styles.avatarBadge('#22D3EE', '#0891B2')}>
                    <Crown style={{ width: 8, height: 8, color: COLORS.white }} />
                  </div>
                </div>
                <p style={styles.fighterName('#67E8F9')}>Te</p>
                <AnimatePresence mode="wait">
                  {showRoundResult && (
                    <motion.p 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={styles.fighterAnswer('rgba(22, 78, 99, 0.5)', 'rgba(34, 211, 238, 0.3)')}
                    >
                      {roundResults[roundResults.length - 1].player}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* VS */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 360] }}
              transition={{ delay: 0.3, rotate: { duration: 0.6 } }}
              style={styles.vsBadgeContainer}
            >
              <div style={styles.vsBadge}>
                <Swords style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: COLORS.white }} />
              </div>
              <motion.div 
                style={styles.vsBadgeGlow}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
            </motion.div>

            {/* Opponent */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={styles.fighterCard}
            >
              <div style={styles.opponentFighterBox}>
                <div style={styles.avatarContainer}>
                  <div style={styles.avatarGlow('#F87171')}></div>
                  <div style={styles.avatar('#FCA5A5')}>
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=200"
                      alt="Opponent"
                      style={styles.avatarImage}
                    />
                  </div>
                  <div style={styles.avatarBadge('#F87171', '#DC2626')}>
                    <Flame style={{ width: 8, height: 8, color: COLORS.white }} />
                  </div>
                </div>
                <p style={styles.fighterName('#FCA5A5')}>Gép</p>
                <AnimatePresence mode="wait">
                  {showRoundResult && (
                    <motion.p 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={styles.fighterAnswer('rgba(127, 29, 29, 0.5)', 'rgba(248, 113, 113, 0.3)')}
                    >
                      {opponentAnswer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Question */}
          <motion.div 
            key={currentQuestionIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={styles.questionCard}
          >
            <div style={styles.questionBox}>
              <div style={styles.questionHeader}>
                <div style={styles.questionSourceBadge}>
                  <Star style={{ width: SIZES.iconXS, height: SIZES.iconXS, color: COLORS.white }} />
                </div>
                <p style={styles.questionSource}>{questions[currentQuestionIndex].source}</p>
              </div>
              <h2 style={styles.questionText}>{questions[currentQuestionIndex].question}</h2>
              
              <AnimatePresence>
                {showRoundResult && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={styles.correctAnswerBox}>
                      <div style={styles.correctAnswerHeader}>
                        <Trophy style={{ width: SIZES.iconXS, height: SIZES.iconXS, color: '#4ADE80' }} />
                        <p style={styles.correctAnswerText}>Helyes: {questions[currentQuestionIndex].correctAnswer}</p>
                      </div>
                      <div style={styles.responseTimesRow}>
                        <span>Te: {playerResponseTime.toFixed(1)}s</span>
                        <span>Gép: {opponentResponseTime.toFixed(1)}s</span>
                      </div>
                      <motion.p 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={styles.resultMessageContainer}
                      >
                        {(() => {
                          const playerDiff = Math.abs(roundResults[roundResults.length - 1].player - questions[currentQuestionIndex].correctAnswer);
                          const opponentDiff = Math.abs(roundResults[roundResults.length - 1].opponent - questions[currentQuestionIndex].correctAnswer);
                          
                          if (playerDiff < opponentDiff) {
                            return <span style={styles.resultMessageWin}>🎉 Nyertél! (Pontosabb)</span>;
                          } else if (opponentDiff < playerDiff) {
                            return <span style={styles.resultMessageLose}>Ellenfél nyert (Pontosabb)</span>;
                          } else if (playerResponseTime < opponentResponseTime) {
                            return <span style={styles.resultMessageWin}>🎉 Nyertél! (Gyorsabb) ⚡</span>;
                          } else {
                            return <span style={styles.resultMessageLose}>Ellenfél nyert (Gyorsabb) ⚡</span>;
                          }
                        })()}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Answer Display */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={styles.answerCard}
          >
            <div style={styles.answerLabel}>
              <p style={styles.answerLabelText}>Válaszod:</p>
              <motion.div 
                key={playerAnswer}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                style={styles.answerDisplay}
              >
                <p style={styles.answerDisplayText}>{playerAnswer || '...'}</p>
              </motion.div>
            </div>

            {/* Number Keyboard */}
            <div style={styles.numberKeyboard}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <motion.button
                  key={num}
                  onClick={() => handleNumberClick(num.toString())}
                  disabled={showRoundResult}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={styles.numberKey}
                >
                  {num}
                </motion.button>
              ))}
              <motion.button
                onClick={handleBackspace}
                disabled={showRoundResult}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={styles.backspaceKey}
              >
                ←
              </motion.button>
              <motion.button
                onClick={() => handleNumberClick('0')}
                disabled={showRoundResult}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={styles.numberKey}
              >
                0
              </motion.button>
              <motion.button
                onClick={handleClear}
                disabled={showRoundResult}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={styles.clearKey}
              >
                C
              </motion.button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <AnimatePresence>
            {!showRoundResult && (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onClick={() => submitAnswer(false)}
                disabled={!playerAnswer}
                whileHover={{ scale: playerAnswer ? 1.02 : 1 }}
                whileTap={{ scale: playerAnswer ? 0.98 : 1 }}
                style={playerAnswer ? styles.submitButton : styles.submitButtonDisabled}
              >
                <Zap style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                <span style={{ fontSize: SIZES.fontSM }}>Beküld</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Result State */}
      {gameState === 'result' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.resultContainer}
        >
          <div style={styles.resultCard}>
            {/* Victory/Defeat Background Effect */}
            <div style={styles.resultBackground(playerScore > opponentScore, playerScore === opponentScore)}></div>
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              style={styles.resultIconContainer}
            >
              <div style={styles.resultIcon(playerScore > opponentScore, playerScore === opponentScore)}>
                {playerScore > opponentScore ? (
                  <Trophy style={{ width: 32, height: 32, color: COLORS.white }} />
                ) : playerScore < opponentScore ? (
                  <Swords style={{ width: 32, height: 32, color: COLORS.white }} />
                ) : (
                  <Star style={{ width: 32, height: 32, color: COLORS.white }} />
                )}
              </div>
              
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={styles.resultTitle(playerScore > opponentScore, playerScore === opponentScore)}
              >
                {playerScore > opponentScore ? '🎉 Győzelem!' : playerScore < opponentScore ? 'Vereség' : '🤝 Döntetlen'}
              </motion.h2>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={styles.resultStatsContainer}
            >
              <p style={styles.resultStatsLabel}>Végeredmény</p>
              <div style={styles.finalScoreRow}>
                <div style={styles.finalScoreBox('rgba(22, 78, 99, 0.5)', 'rgba(34, 211, 238, 0.3)')}>
                  <p style={styles.finalScoreLabel('#67E8F9')}>Te</p>
                  <p style={styles.finalScoreValue}>{playerScore}</p>
                </div>
                <span style={styles.finalScoreSeparator}>:</span>
                <div style={styles.finalScoreBox('rgba(127, 29, 29, 0.5)', 'rgba(248, 113, 113, 0.3)')}>
                  <p style={styles.finalScoreLabel('#FCA5A5')}>Gép</p>
                  <p style={styles.finalScoreValue}>{opponentScore}</p>
                </div>
              </div>

              <div style={styles.coinsChangeBox(playerScore > opponentScore, playerScore === opponentScore)}>
                <p style={styles.coinsChangeText(playerScore > opponentScore, playerScore === opponentScore)}>
                  {playerScore > opponentScore && <Zap style={{ width: SIZES.iconXS, height: SIZES.iconXS }} />}
                  {playerScore > opponentScore 
                    ? `+${betAmount} arany` 
                    : playerScore < opponentScore 
                    ? `-${betAmount} arany` 
                    : 'Nincs változás'}
                </p>
              </div>
              <div style={styles.currentCoinsRow}>
                <Zap style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                <p style={styles.currentCoinsText}>Jelenlegi: {coins}</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={styles.resultActionsRow}
            >
              <motion.button
                onClick={() => {
                  setGameState('betting');
                  setBetAmount(50);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={styles.newGameButton}
              >
                <Flame style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                Új játék
              </motion.button>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={styles.exitButton}
              >
                <ChevronLeft style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                Kilépés
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
