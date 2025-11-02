/**
 * QuizGame - REACT NATIVE VERSION
 *
 * Kvíz játék (3/3 lecke típus)
 * - Feleletválasztós kérdések
 * - Azonnali visszajelzés (helyes/helytelen)
 * - 80% kell a győzelemhez
 * - Progress dots (animated)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  ThumbsDown,
} from 'lucide-react-native';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  slate900: '#0F172A',
  gray800: '#1F2937',
  gray700: '#374151',
  gray600: '#4B5563',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
  gray300: '#D1D5DB',
  gray200: '#E5E7EB',
  crystalPurple: '#A855F7',
  secondary: '#8B5CF6',
  success: '#10B981',
  successLight: '#86EFAC',
  danger: '#EF4444',
  dangerDark: '#B91C1C',
  dangerLight: '#FCA5A5',
  goldLight: '#FDE047',
  gold: '#F59E0B',
  goldDark: '#78350F',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

const SIZES = {
  fontXS: 10,
  fontSM: 12,
  fontBase: 14,
  fontLG: 18,
  fontXL: 20,
  font2XL: 24,
  font3XL: 30,
  borderThin: 1,
  radiusSM: 4,
  radiusMD: 8,
  radiusLG: 12,
  radiusXL: 16,
  radiusFull: 9999,
  iconSM: 16,
  iconMD: 20,
  iconLG: 24,
  iconXL: 32,
  icon2XL: 64,
};

const FONT_WEIGHT = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// ============================================
// TYPES
// ============================================

interface QuizGameProps {
  onBackToHome?: () => void;
  onWin?: () => void;
  lessonNumber?: number;
  quizData?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

interface Question {
  question: string;
  answers: string[];
  correctAnswer: number; // 0-based index
}

// ============================================
// COMPONENT
// ============================================

export function QuizGame({
  onBackToHome,
  onWin,
  lessonNumber = 1,
  quizData,
}: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  console.log('❓ QuizGame mounted/updated:', {
    lessonNumber,
    hasQuizData: !!quizData,
    quizDataLength: quizData?.length,
  });

  // ============================================
  // INITIALIZE QUESTIONS
  // ============================================

  useEffect(() => {
    if (quizData && quizData.length > 0) {
      const allQuestions: Question[] = quizData.map((q) => ({
        question: q.question,
        answers: q.options,
        correctAnswer: q.correctAnswer,
      }));

      // Use ALL questions from the lesson (shuffle for variety)
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);

      console.log('✅ QuizGame questions initialized:', {
        total: shuffled.length,
      });

      setSelectedQuestions(shuffled);
    } else {
      console.warn('⚠️ QuizGame: No quiz data provided!');
    }
  }, [quizData]);

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  // ============================================
  // HANDLERS
  // ============================================

  const handleAnswerClick = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    setSelectedAnswer(answerIndex);

    // Check if answer is correct
    if (currentQuestion && answerIndex === currentQuestion.correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    }

    // Wait a moment to show feedback, then move to next question or finish
    setTimeout(() => {
      if (currentQuestionIndex < selectedQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
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

  const handleContinue = () => {
    // Calculate minimum required answers as 80% of total questions
    const minRequired = Math.ceil(selectedQuestions.length * 0.8);
    const isWin = correctAnswers >= minRequired;

    console.log('❓ QuizGame handleContinue:', {
      isWin,
      correctAnswers,
      totalQuestions: selectedQuestions.length,
      minRequired,
      hasOnWin: !!onWin,
    });

    if (isWin && onWin) {
      console.log('✅ QuizGame calling onWin!');
      onWin();
    } else if (onBackToHome) {
      console.log('⬅️ QuizGame calling onBackToHome');
      onBackToHome();
    }
  };

  const handleBack = () => {
    if (onBackToHome) {
      onBackToHome();
    }
  };

  // ============================================
  // RENDER - LOADING STATE
  // ============================================

  if (!currentQuestion && !gameFinished) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Betöltés...</Text>
      </View>
    );
  }

  // ============================================
  // RENDER - RESULT STATE
  // ============================================

  const minRequired = Math.ceil(selectedQuestions.length * 0.8);
  const isWin = correctAnswers >= minRequired;

  if (gameFinished && showResult) {
    return (
      <LinearGradient
        colors={[COLORS.slate900, '#581C87', COLORS.slate900]}
        style={styles.container}
      >
        {/* Top Spacer for iPhone notch */}
        <View style={styles.topSpacer} />

        <View style={styles.resultContainer}>
          {isWin ? (
            <>
              <LinearGradient
                colors={[COLORS.goldLight, COLORS.gold]}
                style={styles.trophyIcon}
              >
                <Trophy size={SIZES.icon2XL} color={COLORS.goldDark} />
              </LinearGradient>
              <Text style={styles.resultTitle}>Győzelem!</Text>
              <Text style={styles.resultScore}>
                {correctAnswers}/{selectedQuestions.length} helyes válasz
              </Text>
            </>
          ) : (
            <>
              <LinearGradient
                colors={[COLORS.danger, COLORS.dangerDark]}
                style={styles.thumbsDownIcon}
              >
                <ThumbsDown size={SIZES.icon2XL} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.resultTitle}>Vereség</Text>
              <Text style={styles.resultScore}>
                {correctAnswers}/{selectedQuestions.length} helyes válasz{'\n'}
                <Text style={styles.resultScoreSmall}>
                  Minimum {Math.ceil(selectedQuestions.length * 0.8)} helyes
                  válasz szükséges
                </Text>
              </Text>
            </>
          )}

          <LinearGradient
            colors={[COLORS.crystalPurple, COLORS.secondary]}
            style={styles.continueButton}
          >
            <TouchableOpacity onPress={handleContinue} activeOpacity={0.8}>
              <Text style={styles.continueButtonText}>Folytatás</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </LinearGradient>
    );
  }

  // ============================================
  // RENDER - QUIZ STATE
  // ============================================

  return (
    <LinearGradient
      colors={[COLORS.slate900, '#581C87', COLORS.slate900]}
      style={styles.container}
    >
      {/* Top Spacer for iPhone notch */}
      <View style={styles.topSpacer} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <View style={styles.backButtonInner}>
              <ArrowLeft size={SIZES.iconMD} color={COLORS.white} />
            </View>
          </TouchableOpacity>

          <Text style={styles.lessonTitle}>{lessonNumber}. Lecke</Text>

          <View style={styles.spacer} />
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {selectedQuestions.map((_, index) => {
            const isCurrent = index === currentQuestionIndex;
            const isPast = index < currentQuestionIndex;

            return (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  {
                    width: isCurrent ? 32 : 8,
                    backgroundColor: isCurrent
                      ? COLORS.crystalPurple
                      : isPast
                      ? COLORS.success
                      : COLORS.gray600,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Question and answers */}
      <ScrollView
        style={styles.contentArea}
        contentContainerStyle={styles.contentAreaInner}
      >
        {/* Question */}
        <View style={styles.questionCard}>
          <View style={styles.questionMeta}>
            <Text style={styles.questionNumber}>
              Kérdés {currentQuestionIndex + 1}/{selectedQuestions.length}
            </Text>
            <Text style={styles.questionStats}>
              Helyes: <Text style={styles.correctStat}>{correctAnswers}</Text>/
              {currentQuestionIndex + (selectedAnswer !== null ? 1 : 0)}
            </Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* Answers */}
        <View style={styles.answersContainer}>
          {currentQuestion.answers.map((answer, index) => {
            if (!answer) return null; // Skip empty answers

            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showFeedback = selectedAnswer !== null;

            // Determine button style
            let buttonStyle = [styles.answerButton];
            if (showFeedback) {
              if (isSelected && isCorrect) {
                buttonStyle.push(styles.answerButtonCorrect);
              } else if (isSelected && !isCorrect) {
                buttonStyle.push(styles.answerButtonWrong);
              } else if (isCorrect) {
                buttonStyle.push(styles.answerButtonShowCorrect);
              }
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswerClick(index)}
                disabled={selectedAnswer !== null}
                style={buttonStyle}
                activeOpacity={showFeedback ? 1 : 0.7}
              >
                <View style={styles.answerContent}>
                  <View style={styles.answerLeft}>
                    <View style={styles.answerLetter}>
                      <Text style={styles.answerLetterText}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text style={styles.answerText}>{answer}</Text>
                  </View>
                  {showFeedback && (
                    <>
                      {isSelected && isCorrect && (
                        <CheckCircle2
                          size={SIZES.iconLG}
                          color={COLORS.successLight}
                          fill={COLORS.successLight}
                        />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle
                          size={SIZES.iconLG}
                          color={COLORS.dangerLight}
                          fill={COLORS.dangerLight}
                        />
                      )}
                      {!isSelected && isCorrect && (
                        <CheckCircle2
                          size={SIZES.iconLG}
                          color={COLORS.successLight}
                          fill={COLORS.successLight}
                        />
                      )}
                    </>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSpacer: {
    height: 48,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
  },

  // Result Screen
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  trophyIcon: {
    width: 96,
    height: 96,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  thumbsDownIcon: {
    width: 96,
    height: 96,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  resultTitle: {
    color: COLORS.white,
    fontSize: SIZES.font3XL,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.sm,
  },
  resultScore: {
    color: COLORS.gray300,
    fontSize: SIZES.fontLG,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  resultScoreSmall: {
    fontSize: SIZES.fontSM,
    color: COLORS.gray400,
  },
  continueButton: {
    borderRadius: SIZES.radiusXL,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xxxl,
  },

  // Header
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  backButtonInner: {
    width: 32,
    height: 32,
    backgroundColor: `${COLORS.gray800}99`,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.gray600}80`,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.bold,
  },
  spacer: {
    width: 32,
    height: 32,
  },

  // Progress Dots
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  progressDot: {
    height: 8,
    borderRadius: SIZES.radiusFull,
  },

  // Content Area
  contentArea: {
    flex: 1,
  },
  contentAreaInner: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },

  // Question Card
  questionCard: {
    backgroundColor: `${COLORS.gray800}99`,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.gray600}80`,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  questionMeta: {
    flexDirection: 'row',
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
    fontWeight: FONT_WEIGHT.semibold,
  },
  questionText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Answers Container
  answersContainer: {
    gap: SPACING.md,
  },

  // Answer Button
  answerButton: {
    backgroundColor: `${COLORS.gray800}99`,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.gray600}80`,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
  },
  answerButtonCorrect: {
    backgroundColor: `${COLORS.success}cc`,
    borderColor: COLORS.success,
  },
  answerButtonWrong: {
    backgroundColor: `${COLORS.danger}cc`,
    borderColor: COLORS.danger,
  },
  answerButtonShowCorrect: {
    backgroundColor: `${COLORS.success}99`,
    borderColor: `${COLORS.success}80`,
  },
  answerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  answerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  answerLetter: {
    width: 32,
    height: 32,
    backgroundColor: `${COLORS.gray700}99`,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerLetterText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.semibold,
  },
  answerText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    flex: 1,
  },
});
