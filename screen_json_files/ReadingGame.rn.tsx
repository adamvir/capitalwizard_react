/**
 * ReadingGame - REACT NATIVE VERSION
 * 
 * Olvasás játék (1/3 lecke típus)
 * - 3 state: reading → questions → result
 * - Szöveg olvasás
 * - Kérdések megválaszolása (TextInput)
 * - Eredmény megjelenítés (80% kell a győzelemhez)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, BookOpen, CheckCircle, XCircle } from 'lucide-react-native';

// NAVIGATION: React Navigation használata
// import { useNavigation } from '@react-navigation/native';

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
  primary: '#3B82F6',
  xpBlueDark: '#1D4ED8',
  crystalPurple: '#A855F7',
  secondary: '#8B5CF6',
  success: '#10B981',
  successDark: '#059669',
  danger: '#EF4444',
  warning: '#F59E0B',
  warningDark: '#EA580C',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
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
  iconSM: 16,
  iconMD: 20,
  iconLG: 24,
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

interface ReadingGameProps {
  onBackToHome?: () => void;
  onWin?: () => void;
  lessonNumber?: number;
  lessonData?: Lesson;
}

type GameState = 'reading' | 'questions' | 'result';

interface Question {
  question: string;
  answer: string;
  keywords: string[]; // Keywords for flexible matching
}

interface Lesson {
  id: string;
  pageNumber: number;
  reading: {
    title: string;
    content: string;
    questions: Array<{
      question: string;
      answer: string;
      keywords: string[];
    }>;
  };
  matching: {
    pairs: Array<{ term: string; definition: string }>;
  };
  quiz: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
    }>;
  };
}

// ============================================
// COMPONENT
// ============================================

export function ReadingGame({
  onBackToHome,
  onWin,
  lessonNumber = 1,
  lessonData,
}: ReadingGameProps) {
  const [gameState, setGameState] = useState<GameState>('reading');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);

  // NAVIGATION FIX - React Native:
  // const navigation = useNavigation();

  // Use lessonData from penzugyiAlapismeretkLessons
  const readingContent = lessonData?.reading.content || '';
  const readingTitle = lessonData?.reading.title || '';

  console.log('📖 ReadingGame mounted/updated:', {
    lessonNumber,
    hasLessonData: !!lessonData,
  });

  // ============================================
  // INITIALIZE QUESTIONS
  // ============================================

  useEffect(() => {
    if (lessonData && lessonData.reading.questions) {
      const allQuestions: Question[] = lessonData.reading.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
        keywords: q.keywords,
      }));

      // Use ALL questions from the lesson (shuffle for variety)
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      const selectedQs = shuffled;

      setSelectedQuestions(selectedQs);
      setAnswers(Array(selectedQs.length).fill(''));
    }
  }, [lessonData]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleReadComplete = () => {
    setGameState('questions');
  };

  const checkAnswer = (userAnswer: string, question: Question): boolean => {
    const normalized = userAnswer.toLowerCase().trim();
    // Check if any keyword is in the answer
    return question.keywords.some((keyword) =>
      normalized.includes(keyword.toLowerCase())
    );
  };

  const handleSubmitAnswers = () => {
    const checkedResults = selectedQuestions.map((q, index) =>
      checkAnswer(answers[index], q)
    );
    const correctCount = checkedResults.filter((r) => r).length;
    const percentage = (correctCount / selectedQuestions.length) * 100;

    setResults(checkedResults);
    setScore(percentage);
    setGameState('result');
  };

  const handleRetry = () => {
    setAnswers(Array(selectedQuestions.length).fill(''));
    setResults([]);
    setScore(0);
    setGameState('questions');
  };

  const handleFinish = () => {
    // Calculate minimum required answers as 80% of total questions
    const correctCount = results.filter((r) => r).length;
    const minRequired = Math.ceil(selectedQuestions.length * 0.8); // 80% of questions
    console.log('📖 ReadingGame handleFinish:', {
      correctCount,
      totalQuestions: selectedQuestions.length,
      minRequired,
      willCallOnWin: correctCount >= minRequired,
    });

    if (onWin && correctCount >= minRequired) {
      console.log('✅ ReadingGame calling onWin!');
      // NAVIGATION: navigation.goBack() or pass completion data
      onWin();
    } else if (onBackToHome) {
      console.log('⬅️ ReadingGame calling onBackToHome');
      // NAVIGATION: navigation.goBack()
      onBackToHome();
    }
  };

  const handleBack = () => {
    // NAVIGATION: navigation.goBack()
    if (onBackToHome) {
      onBackToHome();
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // ============================================
  // RENDER - READING STATE
  // ============================================

  if (gameState === 'reading') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LinearGradient
          colors={[COLORS.slate900, '#581C87', COLORS.slate900]}
          style={styles.gradientContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <View style={styles.backButtonInner}>
                <ArrowLeft size={SIZES.iconMD} color={COLORS.white} />
              </View>
              <Text style={styles.backButtonText}>Vissza</Text>
            </TouchableOpacity>

            <View style={styles.headerRight}>
              <BookOpen size={SIZES.iconMD} color={COLORS.white} />
              <Text style={styles.headerRightText}>
                {lessonNumber}. Lecke - Szövegértés
              </Text>
            </View>
          </View>

          {/* Reading Content */}
          <ScrollView
            style={styles.contentCard}
            contentContainerStyle={styles.contentCardInner}
          >
            <View style={styles.readingContent}>
              <Text style={styles.readingTitle}>{readingTitle}</Text>

              {readingContent.split('\n\n').map((paragraph, index) => (
                <Text key={index} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </View>
          </ScrollView>

          {/* Continue Button */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.xpBlueDark]}
            style={styles.primaryButton}
          >
            <TouchableOpacity onPress={handleReadComplete} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Elolvastam</Text>
            </TouchableOpacity>
          </LinearGradient>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }

  // ============================================
  // RENDER - QUESTIONS STATE
  // ============================================

  if (gameState === 'questions') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <LinearGradient
          colors={[COLORS.slate900, '#581C87', COLORS.slate900]}
          style={styles.gradientContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <View style={styles.backButtonInner}>
                <ArrowLeft size={SIZES.iconMD} color={COLORS.white} />
              </View>
              <Text style={styles.backButtonText}>Vissza</Text>
            </TouchableOpacity>

            <View style={styles.headerRight}>
              <BookOpen size={SIZES.iconMD} color={COLORS.white} />
              <Text style={styles.headerRightText}>
                {lessonNumber}. Lecke - Szövegértés
              </Text>
            </View>
          </View>

          {/* Questions Content */}
          <ScrollView
            style={styles.contentCard}
            contentContainerStyle={styles.contentCardInner}
          >
            <Text style={styles.questionsTitle}>Válaszolj a kérdésekre!</Text>
            <View style={styles.questionsContainer}>
              {selectedQuestions.map((q, index) => (
                <View key={index} style={styles.questionItem}>
                  <Text style={styles.questionLabel}>
                    {index + 1}. {q.question}
                  </Text>
                  <TextInput
                    value={answers[index]}
                    onChangeText={(value) => handleAnswerChange(index, value)}
                    style={styles.questionInput}
                    placeholder="Válaszod..."
                    placeholderTextColor={COLORS.gray500}
                  />
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Submit Button */}
          <LinearGradient
            colors={[COLORS.crystalPurple, COLORS.secondary]}
            style={styles.submitButton}
          >
            <TouchableOpacity onPress={handleSubmitAnswers} activeOpacity={0.8}>
              <Text style={styles.submitButtonText}>Ellenőrzés</Text>
            </TouchableOpacity>
          </LinearGradient>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }

  // ============================================
  // RENDER - RESULT STATE
  // ============================================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={[COLORS.slate900, '#581C87', COLORS.slate900]}
        style={styles.gradientContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <View style={styles.backButtonInner}>
              <ArrowLeft size={SIZES.iconMD} color={COLORS.white} />
            </View>
            <Text style={styles.backButtonText}>Vissza</Text>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <BookOpen size={SIZES.iconMD} color={COLORS.white} />
            <Text style={styles.headerRightText}>
              {lessonNumber}. Lecke - Szövegértés
            </Text>
          </View>
        </View>

        {/* Results Content */}
        <ScrollView
          style={styles.contentCard}
          contentContainerStyle={styles.contentCardInner}
        >
          <Text style={styles.resultTitle}>
            {score >= 80 ? '🎉 Gratulálunk!' : '😔 Próbáld újra!'}
          </Text>

          <View style={styles.scoreDisplay}>
            <Text style={styles.scorePercent}>{score.toFixed(0)}%</Text>
            <Text style={styles.scoreText}>
              {results.filter((r) => r).length} helyes válasz{' '}
              {selectedQuestions.length}-ből
            </Text>
          </View>

          <View style={styles.resultsContainer}>
            {selectedQuestions.map((q, index) => (
              <View
                key={index}
                style={[
                  styles.resultCard,
                  {
                    backgroundColor: results[index]
                      ? `${COLORS.success}20`
                      : `${COLORS.danger}20`,
                    borderColor: results[index]
                      ? `${COLORS.success}80`
                      : `${COLORS.danger}80`,
                  },
                ]}
              >
                <View style={styles.resultCardContent}>
                  {results[index] ? (
                    <CheckCircle
                      size={SIZES.iconMD}
                      color={COLORS.success}
                      fill={COLORS.success}
                    />
                  ) : (
                    <XCircle size={SIZES.iconMD} color={COLORS.danger} fill={COLORS.danger} />
                  )}
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultQuestion}>{q.question}</Text>
                    <Text style={styles.userAnswerText}>
                      A te válaszod:{' '}
                      <Text style={styles.userAnswerValue}>
                        {answers[index] || '(üres)'}
                      </Text>
                    </Text>
                    {!results[index] && (
                      <Text style={styles.correctAnswerText}>
                        Helyes válasz:{' '}
                        <Text style={styles.correctAnswerValue}>{q.answer}</Text>
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          {score >= 80 ? (
            <LinearGradient
              colors={[COLORS.success, COLORS.successDark]}
              style={styles.winButton}
            >
              <TouchableOpacity onPress={handleFinish} activeOpacity={0.8}>
                <Text style={styles.winButtonText}>GYŐZELEM!</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={[COLORS.warning, COLORS.warningDark]}
              style={styles.retryButton}
            >
              <TouchableOpacity onPress={handleRetry} activeOpacity={0.8}>
                <Text style={styles.retryButtonText}>Próbáld újra</Text>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.xl,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
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
  backButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerRightText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
  },

  // Content Card
  contentCard: {
    flex: 1,
    backgroundColor: `${COLORS.gray800}99`,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.gray600}80`,
    borderRadius: SIZES.radiusXL,
    marginBottom: SPACING.base,
  },
  contentCardInner: {
    padding: SPACING.lg,
  },

  // Reading Content
  readingContent: {},
  readingTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.crystalPurple,
    textAlign: 'center',
    marginBottom: SPACING.base,
  },
  paragraph: {
    color: COLORS.gray200,
    fontSize: SIZES.fontBase,
    lineHeight: 24,
    marginBottom: SPACING.base,
  },

  // Primary Button
  primaryButton: {
    borderRadius: SIZES.radiusXL,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },

  // Questions
  questionsTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.crystalPurple,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  questionsContainer: {
    gap: SPACING.base,
  },
  questionItem: {
    gap: SPACING.sm,
  },
  questionLabel: {
    color: COLORS.gray200,
    fontSize: SIZES.fontBase,
  },
  questionInput: {
    backgroundColor: `${COLORS.gray700}99`,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.gray600}80`,
    borderRadius: SIZES.radiusLG,
    color: COLORS.white,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
    fontSize: SIZES.fontBase,
  },

  // Submit Button
  submitButton: {
    borderRadius: SIZES.radiusXL,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },

  // Results
  resultTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  scoreDisplay: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  scorePercent: {
    fontSize: 30,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  scoreText: {
    fontSize: SIZES.fontBase,
    color: COLORS.gray300,
  },
  resultsContainer: {
    gap: SPACING.md,
  },
  resultCard: {
    padding: SPACING.md,
    borderRadius: SIZES.radiusLG,
    borderWidth: SIZES.borderThin,
  },
  resultCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultQuestion: {
    color: COLORS.gray200,
    fontSize: SIZES.fontSM,
    marginBottom: SPACING.xs,
  },
  userAnswerText: {
    fontSize: SIZES.fontXS,
    color: COLORS.gray400,
  },
  userAnswerValue: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },
  correctAnswerText: {
    fontSize: SIZES.fontXS,
    color: COLORS.gray400,
    marginTop: SPACING.xs,
  },
  correctAnswerValue: {
    color: '#86EFAC',
    fontWeight: FONT_WEIGHT.semibold,
  },

  // Buttons Container
  buttonsContainer: {
    gap: SPACING.md,
  },
  winButton: {
    borderRadius: SIZES.radiusXL,
  },
  winButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.extrabold,
    textAlign: 'center',
    letterSpacing: 2,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  retryButton: {
    borderRadius: SIZES.radiusXL,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
});
