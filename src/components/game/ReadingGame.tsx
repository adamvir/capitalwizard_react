import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInRight, SlideInLeft } from 'react-native-reanimated';
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS } from '../../utils/styleConstants';

interface ReadingGameProps {
  onBackToHome?: () => void;
  onComplete?: (xp: number, gold: number) => void;
  lessonNumber?: number;
  lessonData?: Lesson;
}

interface Lesson {
  id: string;
  title: string;
  reading: {
    title: string;
    content: string;
    questions: QuestionData[];
  };
  quiz: any[];
  matching: any[];
}

interface QuestionData {
  question: string;
  answer: string;
  keywords: string[];
}

type GameState = 'reading' | 'questions' | 'result';

export function ReadingGame({
  onBackToHome,
  onComplete,
  lessonNumber = 1,
  lessonData
}: ReadingGameProps) {
  console.log('📖 ReadingGame mounted:', { lessonNumber, hasLessonData: !!lessonData });

  const [gameState, setGameState] = useState<GameState>('reading');
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionData[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);

  // Use lessonData from props
  const readingContent = lessonData?.reading.content || "";
  const readingTitle = lessonData?.reading.title || "";

  // Initialize questions
  useEffect(() => {
    if (lessonData && lessonData.reading.questions) {
      const allQuestions: QuestionData[] = lessonData.reading.questions.map(q => ({
        question: q.question,
        answer: q.answer,
        keywords: q.keywords
      }));

      // Shuffle questions for variety
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);

      setSelectedQuestions(shuffled);
      setAnswers(Array(shuffled.length).fill(''));
    }
  }, [lessonData]);

  const handleReadComplete = () => {
    setGameState('questions');
  };

  const checkAnswer = (userAnswer: string, question: QuestionData): boolean => {
    const normalized = userAnswer.toLowerCase().trim();
    // Check if any keyword is in the answer
    return question.keywords.some(keyword =>
      normalized.includes(keyword.toLowerCase())
    );
  };

  const handleSubmitAnswers = () => {
    const checkedResults = selectedQuestions.map((q, index) => checkAnswer(answers[index], q));
    const correctCount = checkedResults.filter(r => r).length;
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
    const correctCount = results.filter(r => r).length;
    const minRequired = Math.ceil(selectedQuestions.length * 0.8); // 80% required

    console.log('📖 ReadingGame handleFinish:', {
      correctCount,
      totalQuestions: selectedQuestions.length,
      minRequired,
      willCallOnComplete: correctCount >= minRequired
    });

    if (correctCount >= minRequired && onComplete) {
      // Hard difficulty rewards (as per gameConfig)
      const xpReward = 150;
      const goldReward = 150;
      console.log('✅ ReadingGame calling onComplete with rewards:', { xpReward, goldReward });
      onComplete(xpReward, goldReward);
    } else if (onBackToHome) {
      console.log('⬅️ ReadingGame calling onBackToHome');
      onBackToHome();
    }
  };

  // READING STATE
  if (gameState === 'reading') {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onBackToHome}
              style={styles.backButton}
            >
              <View style={styles.backButtonInner}>
                <MaterialCommunityIcons name="arrow-left" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.backButtonText}>Vissza</Text>
            </TouchableOpacity>

            <View style={styles.headerRight}>
              <MaterialCommunityIcons name="book-open-variant" size={20} color={COLORS.white} />
              <Text style={styles.headerText}>{lessonNumber}. Lecke - Szövegértés</Text>
            </View>
          </View>

          {/* Reading Content */}
          <View style={styles.contentCard}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.readingTitle}>{readingTitle}</Text>

              {readingContent.split('\n\n').map((paragraph, index) => (
                <Text key={index} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </ScrollView>
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleReadComplete}
            style={styles.primaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Elolvastam</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // QUESTIONS STATE
  if (gameState === 'questions') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <Animated.View entering={SlideInRight.duration(400)} style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={onBackToHome}
                style={styles.backButton}
              >
                <View style={styles.backButtonInner}>
                  <MaterialCommunityIcons name="arrow-left" size={20} color={COLORS.white} />
                </View>
                <Text style={styles.backButtonText}>Vissza</Text>
              </TouchableOpacity>

              <View style={styles.headerRight}>
                <MaterialCommunityIcons name="book-open-variant" size={20} color={COLORS.white} />
                <Text style={styles.headerText}>{lessonNumber}. Lecke</Text>
              </View>
            </View>

            {/* Questions Content */}
            <View style={styles.contentCard}>
              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.questionsTitle}>Válaszolj a kérdésekre!</Text>

                {selectedQuestions.map((q, index) => (
                  <View key={index} style={styles.questionItem}>
                    <Text style={styles.questionLabel}>
                      {index + 1}. {q.question}
                    </Text>
                    <TextInput
                      value={answers[index]}
                      onChangeText={(text) => {
                        const newAnswers = [...answers];
                        newAnswers[index] = text;
                        setAnswers(newAnswers);
                      }}
                      style={styles.questionInput}
                      placeholder="Válaszod..."
                      placeholderTextColor={COLORS.gray400}
                      multiline
                    />
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmitAnswers}
              style={styles.submitButton}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Ellenőrzés</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // RESULT STATE
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBackToHome}
            style={styles.backButton}
          >
            <View style={styles.backButtonInner}>
              <MaterialCommunityIcons name="arrow-left" size={20} color={COLORS.white} />
            </View>
            <Text style={styles.backButtonText}>Vissza</Text>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <MaterialCommunityIcons name="trophy" size={20} color={COLORS.goldLight} />
            <Text style={styles.headerText}>Eredmény</Text>
          </View>
        </View>

        {/* Results Content */}
        <View style={styles.contentCard}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.resultTitle}>
              {score >= 80 ? '🎉 Gratulálunk!' : '😔 Próbáld újra!'}
            </Text>

            <View style={styles.scoreDisplay}>
              <Text style={styles.scorePercent}>{score.toFixed(0)}%</Text>
              <Text style={styles.scoreText}>
                {results.filter(r => r).length} helyes válasz {selectedQuestions.length}-ből
              </Text>
            </View>

            {/* Results List */}
            {selectedQuestions.map((q, index) => (
              <View
                key={index}
                style={[
                  styles.resultCard,
                  results[index] ? styles.resultCardCorrect : styles.resultCardWrong
                ]}
              >
                <View style={styles.resultCardContent}>
                  <MaterialCommunityIcons
                    name={results[index] ? "check-circle" : "close-circle"}
                    size={20}
                    color={results[index] ? COLORS.success : COLORS.danger}
                    style={styles.resultIcon}
                  />
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultQuestion}>{q.question}</Text>
                    <Text style={styles.userAnswerText}>
                      A te válaszod: <Text style={styles.userAnswerValue}>{answers[index] || '(üres)'}</Text>
                    </Text>
                    {!results[index] && (
                      <Text style={styles.correctAnswerText}>
                        Helyes válasz: <Text style={styles.correctAnswerValue}>{q.answer}</Text>
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          {score >= 80 ? (
            <TouchableOpacity
              onPress={handleFinish}
              style={styles.winButton}
              activeOpacity={0.8}
            >
              <Text style={styles.winButtonText}>GYŐZELEM!</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleRetry}
              style={styles.retryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Próbáld újra</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
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
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.xl,
  },
  keyboardAvoid: {
    flex: 1,
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
    ...SHADOWS.large,
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
  headerText: {
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
    padding: SPACING.lg,
    marginBottom: SPACING.base,
    ...SHADOWS.large,
  },
  scrollView: {
    flex: 1,
  },

  // Reading Content
  readingTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.crystalPurple,
    textAlign: 'center',
    marginBottom: SPACING.base,
  },
  paragraph: {
    fontSize: SIZES.fontBase,
    color: COLORS.gray200,
    lineHeight: 24,
    marginBottom: SPACING.base,
  },

  // Buttons
  primaryButton: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: SIZES.radiusXL,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.bold,
  },

  // Questions
  questionsTitle: {
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.crystalPurple,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  questionItem: {
    marginBottom: SPACING.base,
  },
  questionLabel: {
    fontSize: SIZES.fontBase,
    color: COLORS.gray200,
    marginBottom: SPACING.sm,
  },
  questionInput: {
    width: '100%',
    backgroundColor: `${COLORS.gray700}99`,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.gray600}80`,
    borderRadius: SIZES.radiusLG,
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    minHeight: 44,
  },

  // Submit Button
  submitButton: {
    width: '100%',
    backgroundColor: COLORS.crystalPurple,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: SIZES.radiusXL,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.bold,
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
    fontSize: 48,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  scoreText: {
    fontSize: SIZES.fontBase,
    color: COLORS.gray300,
  },
  resultCard: {
    padding: SPACING.md,
    borderRadius: SIZES.radiusLG,
    borderWidth: SIZES.borderThin,
    marginBottom: SPACING.md,
  },
  resultCardCorrect: {
    backgroundColor: `${COLORS.success}20`,
    borderColor: `${COLORS.success}80`,
  },
  resultCardWrong: {
    backgroundColor: `${COLORS.danger}20`,
    borderColor: `${COLORS.danger}80`,
  },
  resultCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  resultIcon: {
    marginTop: 2,
    marginRight: SPACING.sm,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultQuestion: {
    fontSize: SIZES.fontSM,
    color: COLORS.gray200,
    marginBottom: SPACING.xs,
  },
  userAnswerText: {
    fontSize: SIZES.fontXS,
    color: COLORS.gray400,
  },
  userAnswerValue: {
    color: COLORS.white,
  },
  correctAnswerText: {
    fontSize: SIZES.fontXS,
    color: COLORS.gray400,
    marginTop: SPACING.xs,
  },
  correctAnswerValue: {
    color: '#86EFAC',
  },

  // Action Buttons
  buttonsContainer: {
    gap: SPACING.md,
  },
  winButton: {
    width: '100%',
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: SIZES.radiusXL,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  winButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1.2,
  },
  retryButton: {
    width: '100%',
    backgroundColor: COLORS.warning,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: SIZES.radiusXL,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.bold,
  },
});
