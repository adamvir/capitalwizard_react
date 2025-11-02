/**
 * ============================================
 * READINGGAME - REACT NATIVE VERSION
 * ============================================
 *
 * Szövegértés játék:
 * - Szöveg megjelenítése
 * - 5 kérdés a szövegből
 * - Keyword alapú válaszolás
 * - 5/5 helyes = WIN
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react-native';

// ============================================
// TYPES
// ============================================

interface ReadingQuestion {
  question: string;
  answer: string;
  keywords: string[];
}

interface ReadingContent {
  title: string;
  content: string;
  questions: ReadingQuestion[];
}

interface ReadingGameProps {
  lessonNumber: number;
  readingData: ReadingContent;
  onWin?: () => void;
  onBackToHome?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function ReadingGame({
  lessonNumber,
  readingData,
  onWin,
  onBackToHome,
}: ReadingGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions] = useState(5);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');

  const currentQuestion = readingData.questions[currentQuestionIndex];

  // Check answer
  const checkAnswer = () => {
    const answerLower = userAnswer.toLowerCase().trim();
    const hasKeyword = currentQuestion.keywords.some(keyword =>
      answerLower.includes(keyword.toLowerCase())
    );

    setIsCorrect(hasKeyword);
    setShowFeedback(true);

    setTimeout(() => {
      if (hasKeyword) {
        const newCorrectAnswers = correctAnswers + 1;
        setCorrectAnswers(newCorrectAnswers);

        if (newCorrectAnswers >= totalQuestions) {
          setGameStatus('won');
          setTimeout(() => {
            onWin?.();
          }, 2000);
        } else {
          // Next question
          const nextIndex = (currentQuestionIndex + 1) % readingData.questions.length;
          setCurrentQuestionIndex(nextIndex);
          setUserAnswer('');
          setShowFeedback(false);
        }
      } else {
        // Wrong answer - try again
        setUserAnswer('');
        setShowFeedback(false);
      }
    }, 1500);
  };

  // ============================================
  // RENDER
  // ============================================

  if (gameStatus === 'won') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centerContainer}>
          <CheckCircle size={80} color="#10B981" />
          <Text style={styles.resultTitle}>GYŐZTÉL!</Text>
          <Text style={styles.resultSubtitle}>
            Minden kérdésre helyesen válaszoltál!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
        <Text style={styles.lessonTitle}>{lessonNumber}. Lecke - Szövegértés</Text>
        <Text style={styles.progressText}>
          {correctAnswers}/{totalQuestions} helyes
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Reading Content */}
        <View style={styles.contentCard}>
          <Text style={styles.contentTitle}>{readingData.title}</Text>
          <Text style={styles.contentText}>{readingData.content}</Text>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>Kérdés {currentQuestionIndex + 1}:</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          {/* Answer Input */}
          <TextInput
            style={styles.input}
            placeholder="Írja be a választ..."
            placeholderTextColor="#9CA3AF"
            value={userAnswer}
            onChangeText={setUserAnswer}
            multiline
            numberOfLines={2}
            editable={!showFeedback}
          />

          {/* Feedback */}
          {showFeedback && (
            <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
              {isCorrect ? (
                <>
                  <CheckCircle size={20} color="#10B981" />
                  <Text style={styles.feedbackTextCorrect}>Helyes válasz!</Text>
                </>
              ) : (
                <>
                  <XCircle size={20} color="#EF4444" />
                  <Text style={styles.feedbackTextWrong}>
                    Próbáld újra! Kulcsszavak: {currentQuestion.keywords.join(', ')}
                  </Text>
                </>
              )}
            </View>
          )}

          {/* Submit Button */}
          {!showFeedback && (
            <TouchableOpacity
              onPress={checkAnswer}
              disabled={!userAnswer.trim()}
              style={[styles.submitButton, !userAnswer.trim() && styles.submitButtonDisabled]}
            >
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.submitGradient}
              >
                <Text style={styles.submitButtonText}>Ellenőrzés</Text>
                <ArrowRight size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#60A5FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 22,
  },
  questionCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#60A5FA',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  feedbackCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  feedbackWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  feedbackTextCorrect: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackTextWrong: {
    color: '#EF4444',
    fontSize: 14,
    flex: 1,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    gap: 8,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 16,
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    textAlign: 'center',
  },
});
