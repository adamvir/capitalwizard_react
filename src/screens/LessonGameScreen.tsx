import React, { useMemo } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/styleConstants';
import { LessonGame } from '../components/games/LessonGame';
import { ReadingGame } from '../components/games/ReadingGame';
import { QuizGame } from '../components/games/QuizGame';
import { RootStackParamList } from '../navigation/types';
import { penzugyiAlapismeretkLessons, Lesson as LessonData } from '../data/penzugyiAlapismeretkLessons';
import { usePlayer, useStreak, useLessonProgress } from '../hooks';

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
  // Supabase hooks
  const { player, addPlayerXP, addCoins } = usePlayer();
  const { streak, recordActivity } = useStreak();
  const { saveProgress } = useLessonProgress();

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

  // Calculate correct lesson number based on page index and game type
  // Each page has 3 lessons: reading (1), matching (2), quiz (3)
  // Example: page 0 reading = lesson 1, page 0 matching = lesson 2, page 1 reading = lesson 4
  const lessonNumber = isFirstRound
    ? lessonIndex * 3 + (gameType === 'reading' ? 1 : gameType === 'matching' ? 2 : 3)
    : 144 + lessonIndex + 1; // Second round starts at lesson 145

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

    try {
      // ============================================
      // SUPABASE INTEGRÁCIÓ - LECKE BEFEJEZÉS
      // ============================================

      // 1. Generate unique lesson ID
      const lessonId = `${bookTitle}-${lessonIndex}-${gameType}`;

      // 2. Calculate rewards based on game type
      const rewards = {
        reading: { xp: 30, coins: 50 },
        matching: { xp: 50, coins: 100 },
        quiz: { xp: 60, coins: 120 }
      };

      const { xp: earnedXP, coins: earnedCoins } = rewards[gameType as keyof typeof rewards] || rewards.matching;

      // 3. Save lesson progress to Supabase
      await saveProgress(lessonId, true, 100);
      console.log('✅ Lesson progress saved to Supabase');

      // 4. Add XP and check for level up
      const { leveledUp } = await addPlayerXP(earnedXP);
      console.log(`✅ Added ${earnedXP} XP`);

      // 5. Add coins
      await addCoins(earnedCoins);
      console.log(`✅ Added ${earnedCoins} coins`);

      // 6. Update streak (ONLY when completing lessons!)
      // This is the ONLY place where streak updates happen
      const previousStreak = streak?.current_streak || 0;
      const updatedStreak = await recordActivity();
      console.log('✅ Streak updated');

      // Check if it's a new day and streak increased
      const newStreak = updatedStreak?.current_streak || previousStreak;
      let streakBonus = 0;
      let streakMessage = '';

      if (newStreak > previousStreak) {
        // Streak increased! Give bonus rewards (ONLY if it's a NEW day)
        streakBonus = 50 + (newStreak * 10); // 60, 70, 80...
        await addCoins(streakBonus);
        streakMessage = `\n\n🔥 ${newStreak} napos sorozat!\n+${streakBonus} Bónusz Érme`;
        console.log(`🔥 Streak increased from ${previousStreak} to ${newStreak}! Bonus: ${streakBonus} coins`);
      } else {
        console.log(`🔥 Streak stayed at ${newStreak} (same day, no bonus)`);
      }

      // 7. Show success message with all rewards
      const baseRewards = `+${earnedXP} XP\n+${earnedCoins} Érme`;
      const rewardMessage = leveledUp
        ? `Szintlépés! 🎉\nElérted a ${player?.level}. szintet!\n\n${baseRewards}${streakMessage}`
        : `${baseRewards}${streakMessage}`;

      Alert.alert('Lecke Befejezve! ✅', rewardMessage, [
        {
          text: 'Folytatás',
          onPress: () => {
            // Call the onLessonComplete callback
            if (onLessonComplete) {
              onLessonComplete();
            }
            // Navigate back
            navigation.navigate('Home');
          }
        }
      ]);

      // ============================================
      // FALLBACK: AsyncStorage (backward compatibility)
      // ============================================
      const saved = await AsyncStorage.getItem('lessonProgress');
      const progress = saved ? JSON.parse(saved) : {};

      if (!progress[bookTitle]) {
        progress[bookTitle] = {};
      }

      const lessonKey = `${lessonIndex}-${gameType}`;
      progress[bookTitle][lessonKey] = true;

      await AsyncStorage.setItem('lessonProgress', JSON.stringify(progress));

    } catch (error) {
      console.error('❌ Error in handleWin:', error);
      Alert.alert('Hiba', 'Nem sikerült menteni az előrehaladást');

      // Still navigate back even if save failed
      setTimeout(() => {
        if (onLessonComplete) {
          onLessonComplete();
        }
        navigation.navigate('Home');
      }, 1000);
    }
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
