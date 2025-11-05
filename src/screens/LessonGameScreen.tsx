import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/styleConstants';
import { LessonGame } from '../components/games/LessonGame';
import { ReadingGame } from '../components/games/ReadingGame';
import { QuizGame } from '../components/games/QuizGame';
import { StreakCelebration } from '../components/animations/StreakCelebration';
import { RootStackParamList } from '../navigation/types';
import { penzugyiAlapismeretkLessons, Lesson as LessonData } from '../data/penzugyiAlapismeretkLessons';
import { usePlayer, useStreak, useLessonProgress, useRentedBooks } from '../hooks';

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
  // Celebration state
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(0);

  // Supabase hooks
  const { player, addPlayerXP, addCoins } = usePlayer();
  const { streak, recordActivity } = useStreak();
  const { saveProgress } = useLessonProgress();
  const { updateProgress } = useRentedBooks();

  // CoinsContext for gems update
  const { setGems } = require('../contexts/CoinsContext').useCoins();

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

  const handleCelebrationContinue = () => {
    console.log('🎉 handleCelebrationContinue called');

    // Hide celebration
    setShowStreakCelebration(false);
    console.log('✅ Celebration hidden');

    // Call the onLessonComplete callback
    if (onLessonComplete) {
      console.log('📞 Calling onLessonComplete callback');
      onLessonComplete();
    }

    // Navigate back to home
    console.log('🏠 Navigating to Home screen');
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

      // 2. Check if lesson already completed (REPEATED COMPLETION CHECK)
      const { supabase } = require('../config/supabase');
      const { storage, STORAGE_KEYS } = require('../utils/storage');
      const playerId = await storage.getItem(STORAGE_KEYS.PLAYER_DATA);

      const { data: existingProgress } = await supabase
        .from('lesson_progress')
        .select('completed')
        .eq('player_id', playerId)
        .eq('lesson_id', lessonId)
        .eq('completed', true)
        .maybeSingle();

      const isRepeated = existingProgress !== null;

      // 3. Calculate rewards based on game type and completion status
      // FIRST COMPLETION rewards (according to XP_ES_GYEMANT_RENDSZER.md)
      const firstCompletionRewards = {
        quiz: { xp: 50, coins: 50 },       // Easy
        matching: { xp: 100, coins: 100 }, // Medium
        reading: { xp: 150, coins: 150 }   // Hard
      };

      // REPEATED COMPLETION rewards
      const repeatedRewards = { xp: 30, coins: 20 };

      // Select rewards based on completion status
      const { xp: earnedXP, coins: earnedCoins } = isRepeated
        ? repeatedRewards
        : (firstCompletionRewards[gameType as keyof typeof firstCompletionRewards] || firstCompletionRewards.matching);

      console.log(`📚 Lesson ${isRepeated ? 'REPEATED' : 'FIRST'} completion: +${earnedXP} XP, +${earnedCoins} coins`);

      // 3. Save lesson progress to Supabase
      await saveProgress(lessonId, true, 100);
      console.log('✅ Lesson progress saved to Supabase');

      // 3.5. Complete lesson and check for diamond reward
      const { completeLesson } = require('../services/playerService');

      const lessonCompletionResult = await completeLesson(playerId);
      const diamondAwarded = lessonCompletionResult?.diamondAwarded || false;
      const totalLessonsCompleted = lessonCompletionResult?.lessonsCompleted || 0;
      const totalDiamonds = lessonCompletionResult?.diamonds || 0;

      console.log(`✅ Lesson completion tracked: ${totalLessonsCompleted} total lessons, Diamond awarded: ${diamondAwarded}`);

      // ✅ Always update gems in CoinsContext with fresh value from Supabase
      setGems(totalDiamonds);
      if (diamondAwarded) {
        console.log(`💎 Diamond awarded! New total: ${totalDiamonds} gems`);
      }
      console.log(`💎 Gems synced to CoinsContext: ${totalDiamonds}`);

      // 4. Add XP and check for level up
      const { leveledUp } = await addPlayerXP(earnedXP);
      console.log(`✅ Added ${earnedXP} XP`);

      // 5. Add coins
      await addCoins(earnedCoins);
      console.log(`✅ Added ${earnedCoins} coins`);

      // 6. Update streak - EGYSZERŰ, DIRECT MEGOLDÁS
      console.log('🔥 === STREAK UPDATE START ===');
      // supabase already imported on line 127

      const today = new Date().toISOString().split('T')[0];

      console.log('🔥 Player ID:', playerId);
      console.log('🔥 Today:', today);

      // TEST: Ellenőrizzük, hogy a Supabase kapcsolat működik
      console.log('🔥 Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('players')
        .select('id, username')
        .eq('id', playerId)
        .maybeSingle();

      console.log('🔥 Test query - Player data:', testData);
      console.log('🔥 Test query - Error:', testError);

      if (testError) {
        console.error('❌ SUPABASE CONNECTION FAILED:', testError);
        Alert.alert('Hiba', 'Nem sikerült kapcsolódni az adatbázishoz: ' + testError.message);
        return;
      }

      const previousStreak = streak?.current_streak || 0;
      console.log('🔥 Previous streak from hook:', previousStreak);

      // Lekérjük a jelenlegi streak-et
      const { data: existingStreak, error: fetchError } = await supabase
        .from('streaks')
        .select('*')
        .eq('player_id', playerId)
        .maybeSingle();

      console.log('🔥 Existing streak from DB:', existingStreak);
      console.log('🔥 Fetch error:', fetchError);

      if (fetchError) {
        console.error('❌ STREAK FETCH FAILED:', fetchError);
      }

      let updatedStreak = null;
      let newStreakValue = 1;

      if (!existingStreak) {
        // ✅ NINCS STREAK - Létrehozzuk
        console.log('🔥 Creating new streak...');
        const { data: created, error: createError } = await supabase
          .from('streaks')
          .insert({
            player_id: playerId,
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: today,
          })
          .select()
          .single();

        console.log('🔥 Created streak:', created);
        console.log('🔥 Create error:', createError);
        updatedStreak = created;
        newStreakValue = 1;
      } else {
        // ✅ VAN STREAK - Frissítjük
        const lastDate = new Date(existingStreak.last_activity_date);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        console.log('🔥 Last activity:', existingStreak.last_activity_date);
        console.log('🔥 Days difference:', diffDays);
        console.log('🔥 Current streak value:', existingStreak.current_streak);

        // ✅ FIX: Ha current_streak = 0, akkor ez az első aktivitás!
        if (existingStreak.current_streak === 0) {
          console.log('🔥 First activity ever - initializing streak to 1');
          newStreakValue = 1;

          const { data: updated, error: updateError } = await supabase
            .from('streaks')
            .update({
              current_streak: 1,
              longest_streak: 1,
              last_activity_date: today,
              updated_at: new Date().toISOString(),
            })
            .eq('player_id', playerId)
            .select()
            .single();

          console.log('🔥 Initialized streak:', updated);
          console.log('🔥 Update error:', updateError);
          updatedStreak = updated;
        } else if (diffDays === 0) {
          console.log('🔥 Same day - no update');
          updatedStreak = existingStreak;
          newStreakValue = existingStreak.current_streak;
        } else if (diffDays === 1) {
          console.log('🔥 Next day - streak continues!');
          newStreakValue = existingStreak.current_streak + 1;

          const { data: updated, error: updateError } = await supabase
            .from('streaks')
            .update({
              current_streak: newStreakValue,
              longest_streak: Math.max(newStreakValue, existingStreak.longest_streak),
              last_activity_date: today,
              updated_at: new Date().toISOString(),
            })
            .eq('player_id', playerId)
            .select()
            .single();

          console.log('🔥 Updated streak:', updated);
          console.log('🔥 Update error:', updateError);
          updatedStreak = updated;
        } else {
          console.log('🔥 Gap detected - streak resets');
          newStreakValue = 1;

          const { data: updated, error: updateError } = await supabase
            .from('streaks')
            .update({
              current_streak: 1,
              longest_streak: Math.max(1, existingStreak.longest_streak),
              last_activity_date: today,
              updated_at: new Date().toISOString(),
            })
            .eq('player_id', playerId)
            .select()
            .single();

          console.log('🔥 Reset streak:', updated);
          console.log('🔥 Update error:', updateError);
          updatedStreak = updated;
        }
      }

      console.log('🔥 Final streak value:', newStreakValue);
      console.log('🔥 === STREAK UPDATE END ===');

      // 6.5. Calculate NEXT lesson and update rented_books progress
      // This ensures HomeScreen shows correct progress when returning
      let nextLessonIndex = lessonIndex;
      let nextGameType: 'reading' | 'matching' | 'quiz' = gameType;
      let nextIsFirstRound = isFirstRound;

      if (isFirstRound) {
        if (gameType === 'reading') {
          nextGameType = 'matching';
        } else if (gameType === 'matching') {
          nextGameType = 'quiz';
        } else {
          // Quiz done -> next page, start with Reading
          const nextPage = lessonIndex + 1;
          if (nextPage >= 48) {
            // First round complete -> start second round
            nextIsFirstRound = false;
            nextLessonIndex = 0;
            nextGameType = 'reading';
          } else {
            nextLessonIndex = nextPage;
            nextGameType = 'reading';
          }
        }
      } else {
        // Second round - only reading
        const nextPage = lessonIndex + 1;
        if (nextPage >= 48) {
          // Book complete - restart
          nextLessonIndex = 0;
          nextGameType = 'reading';
          nextIsFirstRound = true;
        } else {
          nextLessonIndex = nextPage;
        }
      }

      // Update rented_books with NEXT lesson
      await updateProgress(bookTitle, nextLessonIndex, nextGameType, nextIsFirstRound);
      console.log('✅ Rented books progress updated to NEXT lesson:', {
        nextLessonIndex,
        nextGameType,
        nextIsFirstRound,
      });

      // Check if streak increased
      let streakBonus = 0;
      let streakMessage = '';

      console.log('🎊 === CELEBRATION CHECK ===');
      console.log('🎊 Previous streak:', previousStreak);
      console.log('🎊 New streak:', newStreakValue);
      console.log('🎊 Should celebrate?', newStreakValue > previousStreak);

      // ✅ Ha a streak nőtt, celebration!
      if (newStreakValue > previousStreak) {
        // Streak increased! Give bonus rewards
        streakBonus = 50 + (newStreakValue * 10); // 60, 70, 80...
        await addCoins(streakBonus);
        streakMessage = `\n\n🔥 ${newStreakValue} napos sorozat!\n+${streakBonus} Bónusz Érme`;
        console.log(`🎊 CELEBRATION! Streak: ${previousStreak} → ${newStreakValue}, Bonus: ${streakBonus} coins`);

        // Show streak celebration animation!
        setCelebrationStreak(newStreakValue);
        setShowStreakCelebration(true);
        console.log('🎊 Celebration state set! Returning...');
        // Don't show alert yet - it will be shown after celebration
        return;
      } else {
        console.log(`🎊 No celebration - streak stayed at ${newStreakValue}`);
      }

      // 7. Show success message with all rewards (only if no streak celebration)
      const baseRewards = `+${earnedXP} XP\n+${earnedCoins} Érme`;
      const diamondMessage = diamondAwarded
        ? `\n\n💎 +5 Gyémánt jutalom!\n6 lecke milestone teljesítve!\n(Össz gyémánt: ${totalDiamonds})`
        : '';
      const rewardMessage = leveledUp
        ? `Szintlépés! 🎉\nElérted a ${player?.level}. szintet!\n\n${baseRewards}${diamondMessage}${streakMessage}`
        : `${baseRewards}${diamondMessage}${streakMessage}`;

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

      {/* Streak Celebration Overlay */}
      {showStreakCelebration && (
        <StreakCelebration
          newStreak={celebrationStreak}
          onContinue={handleCelebrationContinue}
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
