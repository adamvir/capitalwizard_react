import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/styleConstants';
import { LessonGame } from '../components/games/LessonGame';
import { ReadingGame } from '../components/games/ReadingGame';
import { QuizGame } from '../components/games/QuizGame';
import { RootStackParamList } from '../navigation/types';
import { penzugyiAlapismeretkLessons, Lesson as LessonData } from '../data/penzugyiAlapismeretkLessons';

type LessonGameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LessonGame'>;
type LessonGameScreenRouteProp = RouteProp<RootStackParamList, 'LessonGame'>;

interface Pair {
  id: number;
  left: string;
  right: string;
}

interface Lesson {
  id: number;
  title: string;
  content: string;
  matching?: Pair[];
}

interface LessonGameScreenProps {
  navigation: LessonGameScreenNavigationProp;
  route: LessonGameScreenRouteProp;
}

export default function LessonGameScreen({ navigation, route }: LessonGameScreenProps) {
  // Get params from navigation
  const {
    bookTitle = 'Pénzügyi Alapismeretek',
    lessonIndex = 0,
    gameType = 'matching',
    isFirstRound = true,
    onLessonComplete
  } = route.params || {};

  // Get lesson data from imported lessons
  const lessonData = useMemo(() => {
    // Get the lesson based on lessonIndex (0-based)
    const sourceLessonData = penzugyiAlapismeretkLessons[lessonIndex];

    if (!sourceLessonData) {
      // Fallback if lesson doesn't exist
      console.warn(`Lesson ${lessonIndex} not found, using default data`);
      return {
        id: lessonIndex + 1,
        reading: {
          title: 'Lecke nem található',
          content: '',
          questions: [],
        },
        matching: [],
        quiz: [],
      };
    }

    // Return the lesson data as-is (it already has reading, matching, quiz)
    return sourceLessonData;
  }, [lessonIndex]);

  const lessonNumber = lessonIndex + 1;

  // Navigation handlers
  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const handleWin = async () => {
    console.log('🎉 Lesson completed!', {
      bookTitle,
      lessonIndex,
      gameType,
      isFirstRound
    });

    // Save lesson progress to AsyncStorage
    try {
      const saved = await AsyncStorage.getItem('lessonProgress');
      const progress = saved ? JSON.parse(saved) : {};

      // Initialize book progress if it doesn't exist
      if (!progress[bookTitle]) {
        progress[bookTitle] = {};
      }

      // Mark this lesson as completed
      const lessonKey = `${lessonIndex}-${gameType}`;
      progress[bookTitle][lessonKey] = true;

      await AsyncStorage.setItem('lessonProgress', JSON.stringify(progress));
      console.log('✅ Lesson progress saved:', {
        bookTitle,
        lessonKey,
        allProgress: progress
      });
    } catch (error) {
      console.error('❌ Error saving lesson progress:', error);
    }

    // Call the onLessonComplete callback to update HomeScreen state
    if (onLessonComplete) {
      onLessonComplete();
    }

    // Navigate back to home screen after a short delay
    setTimeout(() => {
      navigation.navigate('Home');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Render the appropriate game based on gameType */}
      {gameType === 'reading' && (
        <ReadingGame
          lessonNumber={lessonNumber}
          readingData={lessonData.reading}
          onWin={handleWin}
          onBackToHome={handleBackToHome}
        />
      )}

      {gameType === 'matching' && (
        <LessonGame
          lessonNumber={lessonNumber}
          lessonData={lessonData}
          onWin={handleWin}
          onBackToHome={handleBackToHome}
          config={{
            matchingTimeLimit: 60,
            matchingPairsCount: lessonData?.matching?.length || 8,
          }}
        />
      )}

      {gameType === 'quiz' && (
        <QuizGame
          lessonNumber={lessonNumber}
          quizData={lessonData.quiz}
          onWin={handleWin}
          onBackToHome={handleBackToHome}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
});
