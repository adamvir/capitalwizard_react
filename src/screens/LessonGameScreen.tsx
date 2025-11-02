import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../utils/styleConstants';
import { LessonGame } from '../components/games/LessonGame';

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
  onBackToHome?: () => void;
  onWin?: () => void;
  lessonNumber?: number;
  lessonData?: Lesson;
}

export default function LessonGameScreen({
  onBackToHome,
  onWin,
  lessonNumber = 1,
  lessonData
}: LessonGameScreenProps) {
  return (
    <View style={styles.container}>
      <LessonGame
        lessonNumber={lessonNumber}
        lessonData={lessonData}
        onWin={onWin}
        onBackToHome={onBackToHome}
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
