import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
} from 'react-native-reanimated';
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS } from '../../utils/styleConstants';

const { width } = Dimensions.get('window');

interface QuizGameProps {
  onBackToHome?: () => void;
  onComplete?: (xp: number, gold: number) => void;
  lessonNumber?: number;
  lessonData?: Lesson;
}

interface Lesson {
  id: string;
  title: string;
  reading: any;
  quiz: QuestionData[];
  matching: any[];
}

interface QuestionData {
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
}

export function QuizGame({
  onBackToHome,
  onComplete,
  lessonNumber = 1,
  lessonData
}: QuizGameProps) {
  console.log('❓ QuizGame mounted:', { lessonNumber, hasLessonData: !!lessonData });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionData[]>([]);

  // Initialize questions
  useEffect(() => {
    if (lessonData) {
      const allQuestions: QuestionData[] = lessonData.quiz.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));

      // Shuffle questions for variety
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

    // Wait for feedback animation, then move to next question or finish
    setTimeout(() => {
      if (currentQuestionIndex < selectedQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setGameFinished(true);
      }
    }, 1200);
  };

  useEffect(() => {
    if (gameFinished && !showResult) {
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }
  }, [gameFinished, showResult]);

  // Calculate if player won (80% required)
  const minRequired = Math.ceil(selectedQuestions.length * 0.8);
  const isWin = correctAnswers >= minRequired;

  const handleContinue = () => {
    console.log('❓ QuizGame handleContinue:', {
      isWin,
      correctAnswers,
      totalQuestions: selectedQuestions.length,
      minRequired,
      hasOnComplete: !!onComplete
    });

    if (isWin && onComplete) {
      // Easy difficulty rewards (as per gameConfig)
      const xpReward = 50;
      const goldReward = 50;
      console.log('✅ QuizGame calling onComplete with rewards:', { xpReward, goldReward });
      onComplete(xpReward, goldReward);
    } else if (onBackToHome) {
      console.log('⬅️ QuizGame calling onBackToHome');
      onBackToHome();
    }
  };

  // Loading state
  if (!currentQuestion && !gameFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Betöltés...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Result screen
  if (gameFinished && showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View entering={ZoomIn.duration(600)} style={styles.resultContainer}>
          {isWin ? (
            <>
              <Animated.View entering={ZoomIn.delay(200).duration(500)} style={styles.trophyIcon}>
                <MaterialCommunityIcons name="trophy" size={64} color="#78350F" />
              </Animated.View>
              <Animated.Text
                entering={FadeIn.delay(400).duration(500)}
                style={styles.resultTitle}
              >
                Győzelem!
              </Animated.Text>
              <Animated.Text
                entering={FadeIn.delay(600).duration(500)}
                style={styles.resultScore}
              >
                {correctAnswers}/{selectedQuestions.length} helyes válasz
              </Animated.Text>
            </>
          ) : (
            <>
              <Animated.View entering={ZoomIn.delay(200).duration(500)} style={styles.thumbsDownIcon}>
                <MaterialCommunityIcons name="thumb-down" size={64} color={COLORS.white} />
              </Animated.View>
              <Animated.Text
                entering={FadeIn.delay(400).duration(500)}
                style={styles.resultTitle}
              >
                Vereség
              </Animated.Text>
              <Animated.Text
                entering={FadeIn.delay(600).duration(500)}
                style={styles.resultScore}
              >
                {correctAnswers}/{selectedQuestions.length} helyes válasz{'\n'}
                <Text style={styles.resultScoreSmall}>
                  Minimum {minRequired} helyes válasz szükséges
                </Text>
              </Animated.Text>
            </>
          )}

          <Animated.View entering={FadeIn.delay(800).duration(500)}>
            <TouchableOpacity
              onPress={handleContinue}
              style={styles.continueButton}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Folytatás</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // Game screen
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBackToHome}
            style={styles.backButton}
          >
            <View style={styles.backButtonInner}>
              <MaterialCommunityIcons name="arrow-left" size={20} color={COLORS.white} />
            </View>
          </TouchableOpacity>

          <Text style={styles.lessonTitle}>{lessonNumber}. Lecke</Text>

          <View style={styles.spacer} />
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {selectedQuestions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentQuestionIndex && styles.progressDotCurrent,
                index < currentQuestionIndex && styles.progressDotPast,
              ]}
            />
          ))}
        </View>

        {/* Question Card */}
        <Animated.View
          key={currentQuestionIndex}
          entering={SlideInRight.duration(400)}
          exiting={SlideOutLeft.duration(300)}
          style={styles.questionCard}
        >
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
        </Animated.View>

        {/* Answers */}
        <View style={styles.answersContainer}>
          {currentQuestion.options.map((answer, index) => {
            if (!answer) return null;

            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showFeedback = selectedAnswer !== null;

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
                activeOpacity={0.7}
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
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={24}
                          color="#86EFAC"
                        />
                      )}
                      {isSelected && !isCorrect && (
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={24}
                          color="#FCA5A5"
                        />
                      )}
                      {!isSelected && isCorrect && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={24}
                          color="#86EFAC"
                        />
                      )}
                    </>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    flex: 1,
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
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
    ...SHADOWS.large,
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

  // Progress
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.gray600,
  },
  progressDotCurrent: {
    width: 32,
    backgroundColor: COLORS.crystalPurple,
  },
  progressDotPast: {
    backgroundColor: COLORS.success,
  },

  // Question Card
  questionCard: {
    backgroundColor: `${COLORS.gray800}99`,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.gray600}80`,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.xl,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
    ...SHADOWS.large,
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
  },
  questionText: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Answers
  answersContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  answerButton: {
    backgroundColor: `${COLORS.gray800}99`,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.gray600}80`,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    ...SHADOWS.large,
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
    backgroundColor: COLORS.goldLight,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.xl,
  },
  thumbsDownIcon: {
    width: 96,
    height: 96,
    backgroundColor: COLORS.danger,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.xl,
  },
  resultTitle: {
    color: COLORS.white,
    fontSize: SIZES.font3XL,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.sm,
  },
  resultScore: {
    color: COLORS.gray300,
    fontSize: SIZES.fontXL,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  resultScoreSmall: {
    fontSize: SIZES.fontSM,
    color: COLORS.gray400,
  },
  continueButton: {
    backgroundColor: COLORS.crystalPurple,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xxxl,
    borderRadius: SIZES.radiusXL,
    ...SHADOWS.large,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.bold,
  },
});
