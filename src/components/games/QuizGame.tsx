/**
 * ============================================
 * QUIZGAME - REACT NATIVE VERSION
 * ============================================
 *
 * Kvíz játék:
 * - 5 kérdés
 * - 4 válaszlehetőség
 * - 1 helyes válasz
 * - 5/5 helyes = WIN
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, XCircle } from 'lucide-react-native';

// ============================================
// TYPES
// ============================================

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizGameProps {
  lessonNumber: number;
  quizData: QuizQuestion[];
  onWin?: () => void;
  onBackToHome?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function QuizGame({
  lessonNumber,
  quizData,
  onWin,
  onBackToHome,
}: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions] = useState(5);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');

  const currentQuestion = quizData[currentQuestionIndex];

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    if (showFeedback) return;

    setSelectedOption(optionIndex);
    setShowFeedback(true);

    const isCorrect = optionIndex === currentQuestion.correctAnswer;

    setTimeout(() => {
      if (isCorrect) {
        const newCorrectAnswers = correctAnswers + 1;
        setCorrectAnswers(newCorrectAnswers);

        if (newCorrectAnswers >= totalQuestions) {
          setGameStatus('won');
          setTimeout(() => {
            onWin?.();
          }, 2000);
        } else {
          // Next question
          const nextIndex = (currentQuestionIndex + 1) % quizData.length;
          setCurrentQuestionIndex(nextIndex);
          setSelectedOption(null);
          setShowFeedback(false);
        }
      } else {
        // Wrong answer - reset
        setSelectedOption(null);
        setShowFeedback(false);
      }
    }, 1500);
  };

  // Get option style
  const getOptionStyle = (optionIndex: number) => {
    if (!showFeedback) {
      return selectedOption === optionIndex ? styles.optionSelected : styles.option;
    }

    if (optionIndex === currentQuestion.correctAnswer) {
      return styles.optionCorrect;
    }

    if (selectedOption === optionIndex && optionIndex !== currentQuestion.correctAnswer) {
      return styles.optionWrong;
    }

    return styles.option;
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
        <Text style={styles.lessonTitle}>{lessonNumber}. Lecke - Kvíz</Text>
        <Text style={styles.progressText}>
          {correctAnswers}/{totalQuestions} helyes
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Kérdés {currentQuestionIndex + 1}/{totalQuestions}</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleOptionSelect(index)}
              disabled={showFeedback}
              style={getOptionStyle(index)}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIndexBadge}>
                  <Text style={styles.optionIndexText}>{String.fromCharCode(65 + index)}</Text>
                </View>
                <Text style={styles.optionText}>{option}</Text>

                {/* Feedback icons */}
                {showFeedback && index === currentQuestion.correctAnswer && (
                  <CheckCircle size={24} color="#10B981" />
                )}
                {showFeedback && selectedOption === index && index !== currentQuestion.correctAnswer && (
                  <XCircle size={24} color="#EF4444" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      </View>
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
  questionCard: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A855F7',
    marginBottom: 12,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  optionCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  optionWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIndexBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIndexText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: '#FFF',
    lineHeight: 22,
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
