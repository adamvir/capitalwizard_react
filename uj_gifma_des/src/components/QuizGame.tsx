import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, ThumbsDown } from 'lucide-react';
import { getGameConfig } from '../utils/gameConfig';
import type { Lesson } from '../data/penzugyiAlapismeretkLessons';
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS, Z_INDEX } from '../utils/styleConstants';

interface QuizGameProps {
  onBackToHome?: () => void;
  onWin?: () => void;
  lessonNumber?: number;
  lessonData?: Lesson;
}

interface Question {
  question: string;
  answers: string[];
  correctAnswer: number; // 0-based index
}

export function QuizGame({ onBackToHome, onWin, lessonNumber = 1, lessonData }: QuizGameProps) {
  console.log('❓ QuizGame mounted/updated:', { lessonNumber, hasLessonData: !!lessonData });
  
  const config = getGameConfig();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  // Initialize with ALL questions from the lesson
  useEffect(() => {
    // Only works with lessonData from penzugyiAlapismeretkLessons
    if (lessonData) {
      const allQuestions: Question[] = lessonData.quiz.map(q => ({
        question: q.question,
        answers: q.options,
        correctAnswer: q.correctAnswer
      }));
      
      // Use ALL questions from the lesson (shuffle for variety but include all)
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      
      setSelectedQuestions(shuffled);
    }
  }, [lessonData]);

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  const handleAnswerClick = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    setSelectedAnswer(answerIndex);

    // Check if answer is correct
    if (currentQuestion && answerIndex === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Wait a moment to show feedback, then move to next question or finish
    setTimeout(() => {
      if (currentQuestionIndex < selectedQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setGameFinished(true);
      }
    }, 1000);
  };

  useEffect(() => {
    if (gameFinished && !showResult) {
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }
  }, [gameFinished, showResult]);

  // Calculate minimum required answers as 80% of total questions
  const minRequired = Math.ceil(selectedQuestions.length * 0.8); // 80% of questions
  const isWin = correctAnswers >= minRequired;

  // ============================================
  // STYLE DEFINITIONS - React Native Compatible
  // ============================================
  
  const styles = {
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    centerContainer: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      color: COLORS.white,
    },
    resultContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: SPACING.xl,
      paddingRight: SPACING.xl,
    },
    trophyIcon: {
      width: 96,
      height: 96,
      background: `linear-gradient(to bottom right, ${COLORS.goldLight}, ${COLORS.gold})`,
      borderRadius: SIZES.radiusFull,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.xl,
      ...SHADOWS.xl,
      animation: 'pulse 2s infinite',
    },
    thumbsDownIcon: {
      width: 96,
      height: 96,
      background: `linear-gradient(to bottom right, ${COLORS.danger}, #b91c1c)`,
      borderRadius: SIZES.radiusFull,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.xl,
      ...SHADOWS.xl,
    },
    iconInner: {
      width: 64,
      height: 64,
    },
    resultTitle: {
      color: COLORS.white,
      fontSize: 30,
      marginBottom: SPACING.sm,
    },
    resultScore: {
      color: COLORS.gray300,
      textAlign: 'center' as const,
      marginBottom: SPACING.xxl,
    },
    resultScoreSmall: {
      fontSize: SIZES.fontSM,
    },
    continueButton: {
      background: `linear-gradient(to right, ${COLORS.crystalPurple}, ${COLORS.secondary})`,
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
    },
    header: {
      paddingLeft: SPACING.xl,
      paddingRight: SPACING.xl,
      paddingTop: SPACING.base,
      paddingBottom: SPACING.base,
    },
    headerRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.xl,
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.sm,
      color: COLORS.white,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      opacity: 1,
      transition: 'opacity 0.3s',
    },
    backButtonInner: {
      width: 32,
      height: 32,
      backgroundColor: `${COLORS.gray800}99`,
      backdropFilter: 'blur(12px)',
      border: `${SIZES.borderThin}px solid ${COLORS.gray600}80`,
      borderRadius: SIZES.radiusLG,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS.large,
    },
    lessonTitle: {
      color: COLORS.white,
    },
    spacer: {
      width: 32,
      height: 32,
    },
    progressContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.sm,
      marginBottom: SPACING.xl,
    },
    progressDot: (isCurrent: boolean, isPast: boolean) => ({
      height: 8,
      borderRadius: SIZES.radiusFull,
      transition: 'all 0.3s',
      width: isCurrent ? 32 : 8,
      backgroundColor: isCurrent 
        ? COLORS.crystalPurple 
        : isPast 
          ? COLORS.success 
          : COLORS.gray600,
    }),
    contentArea: {
      flex: 1,
      paddingLeft: SPACING.xl,
      paddingRight: SPACING.xl,
      paddingBottom: SPACING.xl,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    questionCard: {
      backgroundColor: `${COLORS.gray800}99`,
      backdropFilter: 'blur(12px)',
      border: `${SIZES.borderThin}px solid ${COLORS.gray600}80`,
      borderRadius: SIZES.radiusXL,
      padding: SPACING.xl,
      marginBottom: SPACING.xl,
      ...SHADOWS.large,
    },
    questionMeta: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: SPACING.sm,
    },
    questionNumber: {
      color: COLORS.gray300,
      fontSize: SIZES.fontSM,
    },
    questionStats: {
      color: COLORS.gray400,
      fontSize: SIZES.fontSM,
    },
    correctStat: {
      color: COLORS.success,
    },
    questionText: {
      color: COLORS.white,
    },
    answersContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: SPACING.md,
      flex: 1,
    },
    answerButton: (
      showFeedback: boolean,
      isSelected: boolean,
      isCorrect: boolean
    ) => {
      let baseStyle: any = {
        width: '100%',
        borderRadius: SIZES.radiusXL,
        padding: SPACING.base,
        ...SHADOWS.large,
        transition: 'all 0.3s',
        textAlign: 'left' as const,
        border: 'none',
        cursor: showFeedback ? 'default' : 'pointer',
      };

      if (showFeedback) {
        if (isSelected && isCorrect) {
          return {
            ...baseStyle,
            backgroundColor: `${COLORS.success}cc`,
            border: `${SIZES.borderThin}px solid ${COLORS.success}`,
            boxShadow: `0 10px 25px -5px ${COLORS.success}30`,
          };
        } else if (isSelected && !isCorrect) {
          return {
            ...baseStyle,
            backgroundColor: `${COLORS.danger}cc`,
            border: `${SIZES.borderThin}px solid ${COLORS.danger}`,
            boxShadow: `0 10px 25px -5px ${COLORS.danger}30`,
          };
        } else if (isCorrect) {
          return {
            ...baseStyle,
            backgroundColor: `${COLORS.success}99`,
            border: `${SIZES.borderThin}px solid ${COLORS.success}80`,
          };
        }
      }

      return {
        ...baseStyle,
        backgroundColor: `${COLORS.gray800}99`,
        backdropFilter: 'blur(12px)',
        border: `${SIZES.borderThin}px solid ${COLORS.gray600}80`,
      };
    },
    answerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    answerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.md,
    },
    answerLetter: {
      width: 32,
      height: 32,
      backgroundColor: `${COLORS.gray700}99`,
      borderRadius: SIZES.radiusLG,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: COLORS.white,
    },
    answerText: {
      color: COLORS.white,
    },
    feedbackIcon: {
      width: 24,
      height: 24,
    },
  };

  // Wait for questions to load (AFTER all hooks)
  if (!currentQuestion && !gameFinished) {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.loadingText}>Betöltés...</div>
      </div>
    );
  }

  const handleContinue = () => {
    console.log('❓ QuizGame handleContinue:', {
      isWin,
      correctAnswers,
      totalQuestions: selectedQuestions.length,
      minRequired,
      hasOnWin: !!onWin
    });
    
    if (isWin && onWin) {
      console.log('✅ QuizGame calling onWin!');
      onWin();
    } else if (onBackToHome) {
      console.log('⬅️ QuizGame calling onBackToHome');
      onBackToHome();
    }
  };

  if (gameFinished && showResult) {
    return (
      <div style={styles.container}>
        {/* Result screen */}
        {/* NOTE: React Native - Convert to View with appropriate components */}
        <div style={styles.resultContainer}>
          {isWin ? (
            <>
              <div style={styles.trophyIcon}>
                <Trophy style={{
                  ...styles.iconInner,
                  color: '#78350F',
                }} />
              </div>
              <h2 style={styles.resultTitle}>Győzelem!</h2>
              <p style={styles.resultScore}>
                {correctAnswers}/{selectedQuestions.length} helyes válasz
              </p>
            </>
          ) : (
            <>
              <div style={styles.thumbsDownIcon}>
                <ThumbsDown style={{
                  ...styles.iconInner,
                  color: COLORS.white,
                }} />
              </div>
              <h2 style={styles.resultTitle}>Vereség</h2>
              <p style={styles.resultScore}>
                {correctAnswers}/{selectedQuestions.length} helyes válasz<br />
                <span style={styles.resultScoreSmall}>Minimum {Math.ceil(selectedQuestions.length * 0.8)} helyes válasz szükséges</span>
              </p>
            </>
          )}

          <button
            onClick={handleContinue}
            style={styles.continueButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(139, 92, 246, 0.4), 0 10px 10px -5px rgba(139, 92, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = SHADOWS.large.shadowColor;
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          >
            Folytatás
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      {/* NOTE: React Native - Convert to SafeAreaView with header component */}
      <div style={styles.header}>
        <div style={styles.headerRow}>
          <button 
            onClick={onBackToHome}
            style={styles.backButton}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <div style={styles.backButtonInner}>
              <ArrowLeft style={{ width: 20, height: 20 }} />
            </div>
          </button>
          
          <h1 style={styles.lessonTitle}>{lessonNumber}. Lecke</h1>
          
          <div style={styles.spacer}></div> {/* Spacer for centering */}
        </div>

        {/* Progress indicator */}
        {/* NOTE: React Native - Use custom progress component */}
        <div style={styles.progressContainer}>
          {selectedQuestions.map((_, index) => (
            <div
              key={index}
              style={styles.progressDot(
                index === currentQuestionIndex,
                index < currentQuestionIndex
              )}
            />
          ))}
        </div>
      </div>

      {/* Question and answers */}
      {/* NOTE: React Native - Use ScrollView for overflow handling */}
      <div style={styles.contentArea}>
        {/* Question */}
        <div style={styles.questionCard}>
          <div style={styles.questionMeta}>
            <div style={styles.questionNumber}>Kérdés {currentQuestionIndex + 1}/10</div>
            <div style={styles.questionStats}>
              Helyes: <span style={styles.correctStat}>{correctAnswers}</span>/{currentQuestionIndex + (selectedAnswer !== null ? 1 : 0)}
            </div>
          </div>
          <h2 style={styles.questionText}>{currentQuestion.question}</h2>
        </div>

        {/* Answers */}
        {/* NOTE: React Native - Use FlatList for better performance */}
        <div style={styles.answersContainer}>
          {currentQuestion.answers.map((answer, index) => {
            if (!answer) return null; // Skip empty answers
            
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showFeedback = selectedAnswer !== null;

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={selectedAnswer !== null}
                style={styles.answerButton(showFeedback, isSelected, isCorrect)}
                onMouseEnter={(e) => {
                  if (!showFeedback) {
                    e.currentTarget.style.backgroundColor = `${COLORS.gray700}99`;
                    e.currentTarget.style.borderColor = COLORS.gray500;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showFeedback) {
                    e.currentTarget.style.backgroundColor = `${COLORS.gray800}99`;
                    e.currentTarget.style.borderColor = `${COLORS.gray600}80`;
                  }
                }}
                onMouseDown={(e) => {
                  if (!showFeedback) {
                    e.currentTarget.style.transform = 'scale(0.98)';
                  }
                }}
                onMouseUp={(e) => {
                  if (!showFeedback) {
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <div style={styles.answerContent}>
                  <div style={styles.answerLeft}>
                    <div style={styles.answerLetter}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span style={styles.answerText}>{answer}</span>
                  </div>
                  {showFeedback && (
                    <>
                      {isSelected && isCorrect && (
                        <CheckCircle2 style={{
                          ...styles.feedbackIcon,
                          color: '#86EFAC',
                        }} />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle style={{
                          ...styles.feedbackIcon,
                          color: '#FCA5A5',
                        }} />
                      )}
                      {!isSelected && isCorrect && (
                        <CheckCircle2 style={{
                          ...styles.feedbackIcon,
                          color: '#86EFAC',
                        }} />
                      )}
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
