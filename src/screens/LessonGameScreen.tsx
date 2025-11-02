import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { COLORS } from '../utils/styleConstants';
import { LessonGame } from '../components/games/LessonGame';
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
  const { lessonIndex = 0, gameType = 'matching', isFirstRound = true } = route.params || {};

  // Get lesson data from imported lessons
  const lessonData = useMemo(() => {
    // Get the lesson based on lessonIndex (0-based)
    const sourceLessonData = penzugyiAlapismeretkLessons[lessonIndex];

    if (!sourceLessonData) {
      // Fallback if lesson doesn't exist
      console.warn(`Lesson ${lessonIndex} not found, using default data`);
      return {
        id: lessonIndex + 1,
        title: `${lessonIndex + 1}. Lecke`,
        content: 'Lecke tartalma nem található',
        matching: [],
      };
    }

    // Convert to the format expected by LessonGame component
    return {
      id: sourceLessonData.id,
      title: sourceLessonData.reading.title,
      content: sourceLessonData.reading.content,
      matching: sourceLessonData.matching,
    };
  }, [lessonIndex]);

  const lessonNumber = lessonIndex + 1;

  // Navigation handlers
  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const handleWin = () => {
    // TODO: Award coins/XP, update progress
    console.log('Lesson completed!');

    // Navigate back to home after a short delay
    setTimeout(() => {
      navigation.navigate('Home');
    }, 2000);
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
});
