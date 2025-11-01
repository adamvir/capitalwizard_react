import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGameConfig } from '../utils/gameConfig';
import type { Lesson } from '../data/penzugyiAlapismeretkLessons';
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS } from '../utils/styleConstants';

interface Pair {
  id: number;
  left: string;
  right: string;
}

interface BoxItem {
  pairId: number;
  text: string;
  side: 'left' | 'right';
  id: string;
}

interface LessonGameProps {
  onBackToHome?: () => void;
  onWin?: () => void;
  lessonNumber?: number;
  lessonData?: Lesson;
}

export function LessonGame({ onBackToHome, onWin, lessonNumber = 1, lessonData }: LessonGameProps) {
  console.log('🔗 LessonGame mounted/updated:', { lessonNumber, hasLessonData: !!lessonData });
  
  const config = getGameConfig();
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [timeLeft, setTimeLeft] = useState(config.matchingTimeLimit);
  const [remainingPairs, setRemainingPairs] = useState<Pair[]>([]);
  const [leftBoxes, setLeftBoxes] = useState<BoxItem[]>([]);
  const [rightBoxes, setRightBoxes] = useState<BoxItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<BoxItem | null>(null);
  const [selectedRight, setSelectedRight] = useState<BoxItem | null>(null);
  const [flashingBox, setFlashingBox] = useState<string | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);

  // Initialize game with maximum 5 pairs visible at once
  useEffect(() => {
    // Only works with lessonData from penzugyiAlapismeretkLessons
    if (!lessonData?.matching) return;
    
    const sourcePairs = lessonData.matching;
    setTotalPairs(sourcePairs.length);
    
    // Shuffle all pairs
    const shuffled = [...sourcePairs].sort(() => Math.random() - 0.5);
    
    // Show maximum 5 pairs at once
    const maxVisiblePairs = 5;
    const initialPairs = shuffled.slice(0, maxVisiblePairs);
    const remaining = shuffled.slice(maxVisiblePairs);
    setRemainingPairs(remaining);
    
    const leftItems: BoxItem[] = initialPairs.map((pair, idx) => ({
      pairId: pair.id,
      text: pair.left,
      side: 'left' as const,
      id: `left-${pair.id}-${idx}`
    }));
    
    const rightItems: BoxItem[] = initialPairs.map((pair, idx) => ({
      pairId: pair.id,
      text: pair.right,
      side: 'right' as const,
      id: `right-${pair.id}-${idx}`
    }));
    
    // Shuffle left and right separately
    setLeftBoxes(leftItems.sort(() => Math.random() - 0.5));
    setRightBoxes(rightItems.sort(() => Math.random() - 0.5));
  }, [lessonData]);

  // Timer countdown
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    if (timeLeft <= 0) {
      setGameStatus('lost');
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, gameStatus]);

  // Check for win condition
  useEffect(() => {
    if (gameStatus === 'playing' && matchedCount === config.matchingPairsCount) {
      setGameStatus('won');
    }
  }, [matchedCount, gameStatus, config.matchingPairsCount]);

  const handleLeftClick = (box: BoxItem) => {
    if (selectedLeft?.id === box.id) {
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(box);
    
    // Check if we already have a right selection
    if (selectedRight) {
      checkMatch(box, selectedRight);
    }
  };

  const handleRightClick = (box: BoxItem) => {
    if (selectedRight?.id === box.id) {
      setSelectedRight(null);
      return;
    }
    setSelectedRight(box);
    
    // Check if we already have a left selection
    if (selectedLeft) {
      checkMatch(selectedLeft, box);
    }
  };

  const checkMatch = (left: BoxItem, right: BoxItem) => {
    if (left.pairId === right.pairId) {
      // Correct match!
      setFlashingBox(right.id);
      
      setTimeout(() => {
        // Remove matched boxes
        setLeftBoxes(prev => prev.filter(b => b.id !== left.id));
        setRightBoxes(prev => prev.filter(b => b.id !== right.id));
        setSelectedLeft(null);
        setSelectedRight(null);
        setFlashingBox(null);
        setMatchedCount(prev => prev + 1);
        
        // Add new pair if available
        if (remainingPairs.length > 0) {
          const newPair = remainingPairs[0];
          setRemainingPairs(prev => prev.slice(1));
          
          const newLeft: BoxItem = {
            pairId: newPair.id,
            text: newPair.left,
            side: 'left',
            id: `left-${newPair.id}-${Date.now()}`
          };
          
          const newRight: BoxItem = {
            pairId: newPair.id,
            text: newPair.right,
            side: 'right',
            id: `right-${newPair.id}-${Date.now()}`
          };
          
          // Add to existing boxes and reshuffle
          setLeftBoxes(prev => [...prev, newLeft].sort(() => Math.random() - 0.5));
          setRightBoxes(prev => [...prev, newRight].sort(() => Math.random() - 0.5));
        }
      }, 500);
    } else {
      // Wrong match - deselect after brief delay
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  // ============================================
  // STYLE DEFINITIONS - React Native Compatible
  // ============================================
  
  const styles = {
    centerContainer: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    resultContent: {
      textAlign: 'center' as const,
      paddingLeft: SPACING.xl,
      paddingRight: SPACING.xl,
    },
    emojiAnimated: {
      fontSize: 96,
      marginBottom: SPACING.xxxl,
    },
    resultTitle: {
      color: COLORS.white,
      fontSize: 48,
      marginBottom: SPACING.base,
      fontFamily: 'Georgia, serif',
    },
    winSubtitle: {
      color: COLORS.success,
      fontSize: 20,
      marginBottom: SPACING.xxl,
    },
    loseSubtitle: {
      color: COLORS.danger,
      fontSize: 20,
      marginBottom: SPACING.xxl,
    },
    continueButton: (isWin: boolean) => ({
      background: isWin 
        ? `linear-gradient(to right, ${COLORS.success}, #059669)`
        : `linear-gradient(to right, ${COLORS.primary}, ${COLORS.crystalCyan})`,
      color: COLORS.white,
      paddingTop: SPACING.base,
      paddingBottom: SPACING.base,
      paddingLeft: SPACING.xxxl,
      paddingRight: SPACING.xxxl,
      borderRadius: SIZES.radiusXL,
      border: 'none',
      cursor: 'pointer',
      ...SHADOWS.large,
      transition: 'all 0.3s',
    }),
    continueButtonText: {
      fontFamily: 'Georgia, serif',
      fontSize: 20,
      fontWeight: FONT_WEIGHT.bold,
      letterSpacing: '0.1em',
    },
    gameContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
    },
    headerSection: {
      paddingLeft: SPACING.xl,
      paddingRight: SPACING.xl,
      paddingTop: SPACING.base,
      paddingBottom: SPACING.base,
    },
    headerRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.sm,
    },
    lessonTitle: {
      color: COLORS.white,
    },
    headerStatsRow: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.base,
    },
    matchCounter: {
      color: COLORS.white,
    },
    timerBadge: (lowTime: boolean) => ({
      paddingLeft: SPACING.base,
      paddingRight: SPACING.base,
      paddingTop: SPACING.sm,
      paddingBottom: SPACING.sm,
      borderRadius: SIZES.radiusLG,
      backgroundColor: lowTime ? `${COLORS.danger}30` : `${COLORS.primary}30`,
      color: lowTime ? COLORS.danger : COLORS.xpBlueLight,
    }),
    gameContentArea: {
      flex: 1,
      paddingLeft: SPACING.base,
      paddingRight: SPACING.base,
      paddingBottom: 128, // Space for bottom navigation
    },
    gameGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: SPACING.base,
      height: '100%',
    },
    columnWrapper: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: SPACING.md,
    },
    matchBox: (isSelected: boolean, isFlashing: boolean, side: 'left' | 'right') => ({
      padding: SPACING.base,
      borderRadius: SIZES.radiusXL,
      transition: 'all 0.3s',
      minHeight: 80,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: isFlashing 
        ? `${SIZES.borderBase}px solid ${COLORS.success}`
        : isSelected 
          ? `${SIZES.borderBase}px solid ${COLORS.xpBlueLight}`
          : side === 'left'
            ? `${SIZES.borderBase}px solid ${COLORS.crystalPurple}80`
            : `${SIZES.borderBase}px solid ${COLORS.crystalPink}80`,
      backgroundColor: isFlashing 
        ? COLORS.success
        : isSelected 
          ? `${COLORS.primary}80`
          : side === 'left'
            ? `${COLORS.crystalPurple}30`
            : `${COLORS.crystalPink}30`,
      cursor: 'pointer',
      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
      animation: isFlashing ? 'pulse 1s infinite' : 'none',
    }),
    matchBoxText: {
      color: COLORS.white,
      textAlign: 'center' as const,
      fontSize: SIZES.fontSM,
    },
  };

  if (gameStatus === 'won') {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.resultContent}>
          {/* Animated finger pointing up */}
          {/* NOTE: React Native - Use Animated.View instead of motion.div */}
          <motion.div
            style={styles.emojiAnimated}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            👆
          </motion.div>
          <h1 style={styles.resultTitle}>GYŐZTÉL!</h1>
          <p style={styles.winSubtitle}>Minden párt sikeresen megtaláltál!</p>
          <button
            onClick={() => {
              console.log('🔗 LessonGame TOVÁBB button clicked, calling onWin');
              if (onWin) {
                onWin();
              } else {
                console.log('⚠️ LessonGame: onWin is not defined!');
              }
            }}
            style={styles.continueButton(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(16, 185, 129, 0.4), 0 10px 10px -5px rgba(16, 185, 129, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = SHADOWS.large.shadowColor;
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          >
            <span style={styles.continueButtonText}>TOVÁBB</span>
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus === 'lost') {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.resultContent}>
          {/* Animated finger pointing down */}
          {/* NOTE: React Native - Use Animated.View instead of motion.div */}
          <motion.div
            style={styles.emojiAnimated}
            animate={{
              y: [0, 20, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            👇
          </motion.div>
          <h1 style={styles.resultTitle}>VESZTETTÉL!</h1>
          <p style={styles.loseSubtitle}>Lejárt az idő!</p>
          <button
            onClick={onBackToHome}
            style={styles.continueButton(false)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = SHADOWS.large.shadowColor;
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          >
            <span style={styles.continueButtonText}>TOVÁBB</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.gameContainer}>
      {/* Lesson Title and Timer */}
      <div style={styles.headerSection}>
        <div style={styles.headerRow}>
          <h1 style={styles.lessonTitle}>{lessonNumber}. Lecke</h1>
          <div style={styles.headerStatsRow}>
            <div style={styles.matchCounter}>
              {matchedCount}/{totalPairs}
            </div>
            <div style={styles.timerBadge(timeLeft <= 10)}>
              {timeLeft}s
            </div>
          </div>
        </div>
      </div>

      {/* Game content area */}
      {/* NOTE: React Native - Use ScrollView if needed */}
      <div style={styles.gameContentArea}>
        <div style={styles.gameGrid}>
          {/* Left side */}
          {/* NOTE: React Native - Use FlatList for better performance */}
          <div style={styles.columnWrapper}>
            {leftBoxes.map((box) => (
              <button
                key={box.id}
                onClick={() => handleLeftClick(box)}
                style={styles.matchBox(
                  selectedLeft?.id === box.id,
                  false,
                  'left'
                )}
                onMouseEnter={(e) => {
                  if (selectedLeft?.id !== box.id) {
                    e.currentTarget.style.backgroundColor = `${COLORS.crystalPurple}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedLeft?.id !== box.id) {
                    e.currentTarget.style.backgroundColor = `${COLORS.crystalPurple}30`;
                  }
                }}
              >
                <span style={styles.matchBoxText}>{box.text}</span>
              </button>
            ))}
          </div>

          {/* Right side */}
          {/* NOTE: React Native - Use FlatList for better performance */}
          <div style={styles.columnWrapper}>
            {rightBoxes.map((box) => (
              <button
                key={box.id}
                onClick={() => handleRightClick(box)}
                style={styles.matchBox(
                  selectedRight?.id === box.id,
                  flashingBox === box.id,
                  'right'
                )}
                onMouseEnter={(e) => {
                  if (selectedRight?.id !== box.id && flashingBox !== box.id) {
                    e.currentTarget.style.backgroundColor = `${COLORS.crystalPink}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedRight?.id !== box.id && flashingBox !== box.id) {
                    e.currentTarget.style.backgroundColor = `${COLORS.crystalPink}30`;
                  }
                }}
              >
                <span style={styles.matchBoxText}>{box.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
