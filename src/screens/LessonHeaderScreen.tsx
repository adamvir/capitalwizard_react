import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { LessonHeader } from '../components/LessonHeader';
import { RootStackParamList } from '../navigation/types';
import { penzugyiAlapismeretkLessons } from '../data/penzugyiAlapismeretkLessons';

type LessonHeaderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LessonHeader'>;
type LessonHeaderScreenRouteProp = RouteProp<RootStackParamList, 'LessonHeader'>;

interface LessonHeaderScreenProps {
  navigation: LessonHeaderScreenNavigationProp;
  route: LessonHeaderScreenRouteProp;
}

export default function LessonHeaderScreen({ navigation, route }: LessonHeaderScreenProps) {
  const {
    bookTitle = 'Pénzügyi Alapismeretek',
    lessonIndex = 0,
    gameType = 'reading',
    isFirstRound = true,
  } = route.params || {};

  const lessonNumber = lessonIndex + 1;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleStart = () => {
    // Navigate to the appropriate game
    navigation.navigate('LessonGame', {
      bookTitle,
      lessonIndex,
      gameType,
      isFirstRound,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" translucent={false} />
      <LinearGradient
        colors={['#0F172A', '#581C87', '#0F172A']}
        style={styles.gradient}
      >
        <LessonHeader
          lessonNumber={lessonNumber}
          gameType={gameType}
          isFirstRound={isFirstRound}
          onBack={handleBack}
          onStart={handleStart}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  gradient: {
    flex: 1,
  },
});
