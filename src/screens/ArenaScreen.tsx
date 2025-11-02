/**
 * ============================================
 * ARENAPAGE - REACT NATIVE VERSION
 * ============================================
 * 
 * Teljes konverzió a Figma designból
 * - Magyar szövegek ✅
 * - Inline styles ✅
 * - Pixel-perfect layout ✅
 * - React Native kompatibilis ✅
 * 
 * HASZNÁLAT:
 * cp exports/ArenaPage.rn.tsx src/screens/ArenaPage.tsx
 * 
 * FÜGGŐSÉGEK:
 * npm install react-native-linear-gradient
 * npm install @react-native-community/slider
 * npm install react-native-reanimated
 * npm install lucide-react-native
 * npm install @react-native-async-storage/async-storage
 * 
 * iOS: cd ios && pod install
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lucide Icons
import {
  ChevronLeft,
  Swords,
  Crown,
  Zap,
  Flame,
  TrendingUp,
  BarChart3,
  Trophy,
  Star,
  BookOpen,
  X,
} from 'lucide-react-native';

// ============================================
// TYPES & INTERFACES
// ============================================

// React Navigation types
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type ArenaScreenProps = NativeStackScreenProps<RootStackParamList, 'Arena'>;

interface ArenaPageProps {
  navigation: ArenaScreenProps['navigation'];
  route: ArenaScreenProps['route'];
}

interface RentedBook {
  title: string;
  rentedUntil: number;
  daysRented: number;
  color: string;
  textColor: string;
}

type GameMode = 'numbers' | 'patterns' | 'stocks';
type GameState = 'menu' | 'betting' | 'playing' | 'result';

interface Question {
  question: string;
  correctAnswer: number;
  source: string;
}

// ============================================
// CONSTANTS (StyleConstants.ts equivalent)
// ============================================

const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

const SIZES = {
  fontXS: 12,
  fontSM: 14,
  fontBase: 16,
  fontLG: 18,
  fontXL: 20,
  font2XL: 24,
  iconXS: 12,
  iconSM: 16,
  iconBase: 20,
  iconLG: 24,
  radiusBase: 8,
  radiusLG: 12,
  radiusXL: 16,
  radiusFull: 9999,
};

const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// GAME CONFIG (gameConfig.ts equivalent)
// ============================================

const GAME_CONFIG = {
  maxBooksForArena: 3,
  freeDailyArenaGames: 3,
  maxBet: 500,
};

// ============================================
// ANIMATED COMPONENTS
// ============================================

const AnimatedCrystal: React.FC<{
  delay: number;
  style: any;
}> = ({ delay, style }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0.6, { duration: 2000 }), -1, true)
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[style, animatedStyle]} />;
};

const AnimatedSwordsIcon: React.FC = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 500 }),
        withTiming(10, { duration: 500 }),
        withTiming(-10, { duration: 500 }),
        withTiming(0, { duration: 500 }),
        withTiming(0, { duration: 3000 })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Swords size={24} color="#EF4444" />
    </Animated.View>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function ArenaScreen({ navigation, route }: ArenaPageProps) {
  // Extract props from route params
  const { coins, onCoinsChange, subscriptionTier = 'free' } = route.params;
  // ============================================
  // STATE
  // ============================================

  const [activeTab, setActiveTab] = useState<GameMode>('numbers');
  const [gameState, setGameState] = useState<GameState>('betting');
  const [betAmount, setBetAmount] = useState<number>(50);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerAnswer, setPlayerAnswer] = useState<string>('');
  const [opponentAnswer, setOpponentAnswer] = useState<number>(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [roundResults, setRoundResults] = useState<
    { player: number; opponent: number; correct: number }[]
  >([]);
  const [showRoundResult, setShowRoundResult] = useState(false);
  const [rentedBooks, setRentedBooks] = useState<RentedBook[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [playerResponseTime, setPlayerResponseTime] = useState<number>(0);
  const [opponentResponseTime, setOpponentResponseTime] = useState<number>(0);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const maxBet = Math.min(coins, GAME_CONFIG.maxBet);

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    loadRentedBooks();
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing' || showRoundResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, showRoundResult, currentQuestionIndex]);

  // ============================================
  // FUNCTIONS
  // ============================================

  const loadRentedBooks = async () => {
    try {
      const saved = await AsyncStorage.getItem('rentedBooks');
      if (saved) {
        const parsed: RentedBook[] = JSON.parse(saved);
        const active = parsed.filter((book) => book.rentedUntil > Date.now());
        setRentedBooks(active);
        const rentedTitles = active.map((b) => b.title);
        setSelectedBooks(rentedTitles);
      }
    } catch (error) {
      console.error('Error loading rented books:', error);
    }
  };

  const canPlay = async (): Promise<boolean> => {
    if (subscriptionTier !== 'free') {
      return true;
    }

    try {
      const today = new Date().toDateString();
      const savedData = await AsyncStorage.getItem('arena_daily_games');

      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.date === today) {
          return data.gamesPlayed < GAME_CONFIG.freeDailyArenaGames;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking play limit:', error);
      return true;
    }
  };

  const generateQuestions = (): Question[] => {
    const exampleQuestions: Question[] = [
      {
        question: 'Hány kereskedési nap van egy évben átlagosan?',
        correctAnswer: 252,
        source: 'Tőkepiaci Szótár',
      },
      {
        question: 'Mennyi a maximális napközbeni árfolyamváltozás az OTC piacon (%)?',
        correctAnswer: 10,
        source: 'Tőkepiaci Szótár',
      },
      {
        question: 'Hány másodperc alatt kell teljesíteni egy HFT megbízást?',
        correctAnswer: 1,
        source: 'Tőkepiaci Szótár',
      },
      {
        question: 'Mekkora a bid-ask spread átlagosan likvid részvényeknél (%)?',
        correctAnswer: 1,
        source: 'Tőkepiaci Szótár',
      },
      {
        question: 'Hány kereskedési szünet van a tőzsdén naponta?',
        correctAnswer: 1,
        source: 'Tőkepiaci Szótár',
      },
      {
        question: 'Hány százalékos ETF kezelési díj számít alacsonynak?',
        correctAnswer: 1,
        source: 'Befektetés alapjai',
      },
      {
        question: 'Hány évre szól egy standard kötvény lejárata?',
        correctAnswer: 10,
        source: 'Kötvények',
      },
      {
        question: 'Hány százalékos diverzifikáció ajánlott portfólióban?',
        correctAnswer: 20,
        source: 'Portfólió kezelés',
      },
      {
        question: 'Hány ponton mozog a BUX index átlagosan naponta?',
        correctAnswer: 500,
        source: 'Technikai elemzés',
      },
      {
        question: 'Hány százalék a magyar GDP növekedés átlagosan?',
        correctAnswer: 3,
        source: 'Makrogazdaság',
      },
    ];

    return exampleQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
  };

  const handleStartGame = async () => {
    const canStart = await canPlay();

    if (!canStart) {
      // onLimitReached?.();  // Optional callback - not used for now
      return;
    }

    if (coins < betAmount) {
      return;
    }

    const newQuestions = generateQuestions();
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setPlayerScore(0);
    setOpponentScore(0);
    setRoundResults([]);
    setPlayerAnswer('');
    setTimeLeft(10);
    setQuestionStartTime(Date.now());
    setGameState('playing');
  };

  const handleSubmitAnswer = (autoSubmit = false) => {
    if (!playerAnswer && !autoSubmit) return;

    const currentQuestion = questions[currentQuestionIndex];
    const playerNum = parseInt(playerAnswer || '0', 10);
    const responseTime = Date.now() - questionStartTime;

    // AI answer
    const aiAccuracy = Math.random();
    let opponentNum: number;

    if (aiAccuracy < 0.5) {
      opponentNum = currentQuestion.correctAnswer;
    } else {
      const offset = Math.floor(Math.random() * 50) + 1;
      opponentNum =
        currentQuestion.correctAnswer + (Math.random() > 0.5 ? offset : -offset);
    }

    const opponentTime = Math.floor(Math.random() * 6000) + 2000;

    let newPlayerScore = playerScore;
    let newOpponentScore = opponentScore;

    const playerDiff = Math.abs(playerNum - currentQuestion.correctAnswer);
    const opponentDiff = Math.abs(opponentNum - currentQuestion.correctAnswer);

    if (playerDiff < opponentDiff) {
      newPlayerScore += 1;
    } else if (opponentDiff < playerDiff) {
      newOpponentScore += 1;
    }

    setPlayerScore(newPlayerScore);
    setOpponentScore(newOpponentScore);
    setOpponentAnswer(opponentNum);
    setPlayerResponseTime(responseTime);
    setOpponentResponseTime(opponentTime);

    setRoundResults([
      ...roundResults,
      {
        player: playerNum,
        opponent: opponentNum,
        correct: currentQuestion.correctAnswer,
      },
    ]);

    setShowRoundResult(true);

    setTimeout(() => {
      setShowRoundResult(false);
      setPlayerAnswer('');

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(10);
        setQuestionStartTime(Date.now());
      } else {
        handleGameEnd(newPlayerScore, newOpponentScore);
      }
    }, 3000);
  };

  const handleGameEnd = async (
    finalPlayerScore: number,
    finalOpponentScore: number
  ) => {
    const isWin = finalPlayerScore > finalOpponentScore;
    const isDraw = finalPlayerScore === finalOpponentScore;

    let coinsChange = 0;
    if (isWin) {
      coinsChange = betAmount * 2;
      // onXpGain?.(50);  // Optional callbacks - not used for now
      // onStreakUpdate?.(1, true);
      // onStageAdvance?.();
    } else if (isDraw) {
      coinsChange = betAmount;
      // onXpGain?.(25);
      // onStreakUpdate?.(1, true);
    } else {
      coinsChange = 0;
      // onXpGain?.(10);
    }

    onCoinsChange(coins - betAmount + coinsChange);

    // Update daily games count
    if (subscriptionTier === 'free') {
      try {
        const today = new Date().toDateString();
        const savedData = await AsyncStorage.getItem('arena_daily_games');
        let gamesPlayed = 1;

        if (savedData) {
          const data = JSON.parse(savedData);
          if (data.date === today) {
            gamesPlayed = data.gamesPlayed + 1;
          }
        }

        await AsyncStorage.setItem(
          'arena_daily_games',
          JSON.stringify({ date: today, gamesPlayed })
        );
      } catch (error) {
        console.error('Error updating daily games:', error);
      }
    }

    setGameState('result');
  };

  const handleBookToggle = (title: string) => {
    if (selectedBooks.includes(title)) {
      setSelectedBooks(selectedBooks.filter((t) => t !== title));
    } else {
      if (selectedBooks.length < GAME_CONFIG.maxBooksForArena) {
        setSelectedBooks([...selectedBooks, title]);
      }
    }
  };

  const handleNumberInput = (num: string) => {
    if (showRoundResult) return;
    setPlayerAnswer(playerAnswer + num);
  };

  const handleBackspace = () => {
    setPlayerAnswer(playerAnswer.slice(0, -1));
  };

  const handleClear = () => {
    setPlayerAnswer('');
  };

  // ============================================
  // RENDER METHODS
  // ============================================

  const renderHeader = () => (
    <LinearGradient
      colors={[
        'rgba(15, 23, 42, 0.95)',
        'rgba(88, 28, 135, 0.8)',
        'rgba(15, 23, 42, 0.95)',
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={SIZES.iconBase} color={COLORS.white} />
          </Pressable>

          <View>
            <View style={styles.headerTitleRow}>
              <Crown size={SIZES.iconSM} color="#FBBF24" />
              <Text style={styles.headerTitle}>Küzdőtér</Text>
            </View>
            <View style={styles.headerCoinsRow}>
              <Zap size={SIZES.iconXS} color="#FBBF24" />
              <Text style={styles.headerCoinsText}>{coins}</Text>
            </View>
          </View>
        </View>

        <AnimatedSwordsIcon />
      </View>
    </LinearGradient>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <View style={styles.tabsRow}>
        <Pressable
          onPress={() => setActiveTab('numbers')}
          style={[
            styles.tabBase,
            activeTab === 'numbers' ? styles.tabActive : styles.tabInactive,
          ]}
        >
          <Flame
            size={SIZES.iconSM}
            color={activeTab === 'numbers' ? COLORS.white : '#94A3B8'}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'numbers' ? COLORS.white : '#94A3B8' },
            ]}
          >
            Számok
          </Text>
        </Pressable>

        <Pressable disabled style={[styles.tabBase, styles.tabDisabled]}>
          <TrendingUp size={SIZES.iconXS} color="#475569" />
          <Text style={[styles.tabText, { color: '#475569' }]}>Hamarosan</Text>
        </Pressable>

        <Pressable disabled style={[styles.tabBase, styles.tabDisabled]}>
          <BarChart3 size={SIZES.iconXS} color="#475569" />
          <Text style={[styles.tabText, { color: '#475569' }]}>Hamarosan</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderBettingState = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Betting Card */}
      <LinearGradient
        colors={[
          'rgba(30, 41, 59, 0.8)',
          'rgba(88, 28, 135, 0.3)',
          'rgba(30, 41, 59, 0.8)',
        ]}
        style={styles.bettingCard}
      >
        <View style={styles.bettingHeader}>
          <Trophy size={SIZES.iconSM} color="#FBBF24" />
          <Text style={styles.bettingTitle}>Válassz tétet</Text>
        </View>

        {/* Slider */}
        <View style={styles.sliderContainer}>
          <Slider
            minimumValue={10}
            maximumValue={maxBet}
            step={10}
            value={betAmount}
            onValueChange={setBetAmount}
            minimumTrackTintColor="#9333EA"
            maximumTrackTintColor="rgba(51, 65, 85, 0.5)"
            thumbTintColor="#A855F7"
            style={styles.slider}
          />

          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>10</Text>
            <Text style={styles.sliderLabelValue}>{Math.round(betAmount)}</Text>
            <Text style={styles.sliderLabelText}>{maxBet}</Text>
          </View>
        </View>

        {/* Quick Bet Buttons */}
        <View style={styles.quickBetGrid}>
          {[50, 100, 200, maxBet].map((amount, index) => (
            <Pressable
              key={index}
              onPress={() => setBetAmount(Math.min(amount, maxBet))}
              style={styles.quickBetButton}
            >
              <Text style={styles.quickBetText}>{amount}</Text>
            </Pressable>
          ))}
        </View>

        {/* Start Game Button */}
        <Pressable onPress={handleStartGame} style={styles.startGameButton}>
          <Swords size={SIZES.iconSM} color={COLORS.white} />
          <Text style={styles.startGameText}>Küzdelem kezdése</Text>
        </Pressable>

        {/* Rules Card (inside betting card) */}
        <View style={styles.rulesCard}>
          <View style={styles.rulesHeader}>
            <Star size={SIZES.iconXS} color="#C084FC" />
            <Text style={styles.rulesTitle}>Szabályok</Text>
          </View>

          <View style={styles.rulesList}>
            <View style={styles.ruleItem}>
              <View style={[styles.ruleDot, { backgroundColor: '#C084FC' }]} />
              <Text style={styles.ruleText}>10 kérdés • Tippeld a számot</Text>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleDot, { backgroundColor: '#C084FC' }]} />
              <Text style={styles.ruleText}>Közelebb = nyersz</Text>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleDot, { backgroundColor: '#4ADE80' }]} />
              <Text style={[styles.ruleText, { color: '#86EFAC' }]}>
                Győzelem: +{betAmount}
              </Text>
            </View>

            <View style={styles.ruleItem}>
              <View style={[styles.ruleDot, { backgroundColor: '#F87171' }]} />
              <Text style={[styles.ruleText, { color: '#FCA5A5' }]}>
                Vereség: -{betAmount}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Book Selection Card */}
      <LinearGradient
        colors={[
          'rgba(30, 41, 59, 0.8)',
          'rgba(67, 56, 202, 0.3)',
          'rgba(30, 41, 59, 0.8)',
        ]}
        style={styles.bookCard}
      >
        <View style={styles.bookHeader}>
          <View style={styles.bookHeaderLeft}>
            <View style={styles.bookIconBox}>
              <Text style={styles.bookIconEmoji}>📚</Text>
            </View>
            <Text style={styles.bookTitle}>Kölcsönzött könyvek</Text>
          </View>

          <View style={styles.bookCounter}>
            <Text style={styles.bookCounterText}>
              {selectedBooks.length}/{Math.min(rentedBooks.length, GAME_CONFIG.maxBooksForArena)}
            </Text>
          </View>
        </View>

        {rentedBooks.length === 0 ? (
          <View style={styles.emptyBooksContainer}>
            <Text style={styles.emptyBooksText}>Nincs kölcsönzött könyv</Text>
            <Text style={styles.emptyBooksSubtext}>
              Kölcsönözz könyveket a Könyvtárban, hogy kérdéseket kaphass!
            </Text>
            <Pressable
              onPress={() => navigation.navigate('Library')}
              style={styles.libraryButton}
            >
              <Text style={styles.libraryButtonText}>Könyvtár megnyitása</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.booksGrid}>
            {rentedBooks.map((book, index) => {
              const isSelected = selectedBooks.includes(book.title);
              return (
                <Pressable
                  key={index}
                  onPress={() => handleBookToggle(book.title)}
                  style={[
                    styles.bookButton,
                    isSelected
                      ? styles.bookButtonSelected
                      : styles.bookButtonUnselected,
                  ]}
                >
                  <View
                    style={[
                      styles.bookButtonDot,
                      { backgroundColor: isSelected ? '#4ADE80' : '#475569' },
                    ]}
                  />
                  <Text
                    style={[
                      styles.bookButtonText,
                      { color: isSelected ? COLORS.white : '#94A3B8' },
                    ]}
                    numberOfLines={2}
                  >
                    {book.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </LinearGradient>
    </ScrollView>
  );

  const renderPlayingState = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.playingContent}
      >
        {/* Progress Header */}
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Kérdés {currentQuestionIndex + 1} / {questions.length}
          </Text>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreText}>
              {playerScore} - {opponentScore}
            </Text>
          </View>
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>

        {/* Question Card */}
        <LinearGradient
          colors={[
            'rgba(30, 41, 59, 0.9)',
            'rgba(88, 28, 135, 0.4)',
            'rgba(30, 41, 59, 0.9)',
          ]}
          style={styles.questionCard}
        >
          <Text style={styles.questionSource}>{currentQuestion.source}</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </LinearGradient>

        {/* Answer Input */}
        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>A te tipped:</Text>
          <View style={styles.answerDisplay}>
            <Text style={styles.answerText}>{playerAnswer || '---'}</Text>
          </View>
        </View>

        {/* Number Keyboard */}
        <View style={styles.keyboardContainer}>
          <View style={styles.keyboardGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Pressable
                key={num}
                onPress={() => handleNumberInput(num.toString())}
                style={styles.keyButton}
              >
                <Text style={styles.keyText}>{num}</Text>
              </Pressable>
            ))}
            <Pressable onPress={handleClear} style={styles.keyButtonClear}>
              <Text style={styles.keyText}>C</Text>
            </Pressable>
            <Pressable
              onPress={() => handleNumberInput('0')}
              style={styles.keyButton}
            >
              <Text style={styles.keyText}>0</Text>
            </Pressable>
            <Pressable onPress={handleBackspace} style={styles.keyButtonDelete}>
              <Text style={styles.keyText}>⌫</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => handleSubmitAnswer(false)}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Beküldés</Text>
          </Pressable>
        </View>

        {/* Round Result */}
        {showRoundResult && (
          <View style={styles.roundResultOverlay}>
            <LinearGradient
              colors={[
                'rgba(15, 23, 42, 0.95)',
                'rgba(88, 28, 135, 0.6)',
                'rgba(15, 23, 42, 0.95)',
              ]}
              style={styles.roundResultCard}
            >
              <Text style={styles.roundResultTitle}>
                {Math.abs(parseInt(playerAnswer || '0', 10) - currentQuestion.correctAnswer) <
                Math.abs(opponentAnswer - currentQuestion.correctAnswer)
                  ? '✓ Nyertél ezt a kört!'
                  : '✗ Vesztettél ezt a kört!'}
              </Text>
              <View style={styles.roundResultDetails}>
                <Text style={styles.roundResultText}>
                  A helyes válasz: {currentQuestion.correctAnswer}
                </Text>
                <Text style={styles.roundResultText}>
                  Te: {playerAnswer || '0'} | Ellenfél: {opponentAnswer}
                </Text>
              </View>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderResultState = () => {
    const isWin = playerScore > opponentScore;
    const isDraw = playerScore === opponentScore;

    return (
      <View style={styles.resultContainer}>
        <LinearGradient
          colors={
            isWin
              ? ['rgba(22, 163, 74, 0.1)', 'rgba(8, 145, 178, 0.1)']
              : isDraw
              ? ['rgba(234, 179, 8, 0.1)', 'rgba(147, 51, 234, 0.1)']
              : ['rgba(220, 38, 38, 0.1)', 'rgba(234, 88, 12, 0.1)']
          }
          style={styles.resultCard}
        >
          <View style={styles.resultIconContainer}>
            {isWin ? (
              <Trophy size={48} color="#4ADE80" />
            ) : isDraw ? (
              <Star size={48} color="#FBBF24" />
            ) : (
              <Flame size={48} color="#F87171" />
            )}
          </View>

          <Text
            style={[
              styles.resultTitle,
              {
                color: isWin ? '#4ADE80' : isDraw ? '#FBBF24' : '#F87171',
              },
            ]}
          >
            {isWin ? 'Győzelem!' : isDraw ? 'Döntetlen!' : 'Vesztettél'}
          </Text>

          <View style={styles.resultScoreRow}>
            <Text style={styles.resultScore}>{playerScore}</Text>
            <Text style={styles.resultScoreSeparator}>-</Text>
            <Text style={styles.resultScore}>{opponentScore}</Text>
          </View>

          <View style={styles.resultActionsRow}>
            <Pressable onPress={handleStartGame} style={styles.newGameButton}>
              <Swords size={16} color={COLORS.white} />
              <Text style={styles.newGameButtonText}>Új játék</Text>
            </Pressable>

            <Pressable onPress={() => navigation.goBack()} style={styles.exitButton}>
              <X size={16} color={COLORS.white} />
              <Text style={styles.exitButtonText}>Kilépés</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Background Gradient */}
        <LinearGradient
          colors={['#0F172A', 'rgba(88, 28, 135, 0.2)', '#0F172A']}
          style={styles.backgroundGradient}
        />

        {/* Crystal Decorations */}
        <View style={styles.crystalContainer}>
          <AnimatedCrystal delay={0} style={styles.crystal1} />
          <AnimatedCrystal delay={500} style={styles.crystal2} />
          <AnimatedCrystal delay={1000} style={styles.crystal3} />
          <AnimatedCrystal delay={1500} style={styles.crystal4} />
        </View>

        {/* Header */}
        {renderHeader()}

        {/* Tabs (only in betting state) */}
        {gameState === 'betting' && renderTabs()}

        {/* Content based on game state */}
        {gameState === 'betting' && renderBettingState()}
        {gameState === 'playing' && renderPlayingState()}
        {gameState === 'result' && renderResultState()}
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
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  crystalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  crystal1: {
    position: 'absolute',
    top: 40,
    right: 32,
    width: 80,
    height: 96,
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    transform: [{ rotate: '12deg' }],
  },
  crystal2: {
    position: 'absolute',
    top: 128,
    left: 24,
    width: 64,
    height: 80,
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    transform: [{ rotate: '-12deg' }],
  },
  crystal3: {
    position: 'absolute',
    bottom: 160,
    right: 40,
    width: 56,
    height: 72,
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    transform: [{ rotate: '6deg' }],
  },
  crystal4: {
    position: 'absolute',
    bottom: 80,
    left: 32,
    width: 48,
    height: 64,
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    transform: [{ rotate: '-6deg' }],
  },

  // Header
  header: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(168, 85, 247, 0.3)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  backButton: {
    width: 32,
    height: 32,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
  },
  headerCoinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: 2,
  },
  headerCoinsText: {
    color: '#FDE047',
    fontSize: SIZES.fontXS,
  },

  // Tabs
  tabsContainer: {
    padding: SPACING.md,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  tabBase: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusLG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
  },
  tabActive: {
    backgroundColor: '#9333EA',
    borderColor: 'rgba(147, 51, 234, 0.3)',
  },
  tabInactive: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderColor: 'rgba(51, 65, 85, 0.3)',
  },
  tabDisabled: {
    backgroundColor: 'rgba(30, 41, 59, 0.2)',
    borderColor: 'rgba(51, 65, 85, 0.2)',
  },
  tabText: {
    fontSize: SIZES.fontXS,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },

  // Betting Card
  bettingCard: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    marginBottom: SPACING.base,
  },
  bettingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  bettingTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
  },
  sliderContainer: {
    marginBottom: SPACING.base,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  sliderLabelText: {
    fontSize: SIZES.fontXS,
    color: '#94A3B8',
  },
  sliderLabelValue: {
    fontSize: SIZES.fontXS,
    color: '#FBBF24',
  },
  quickBetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  quickBetButton: {
    flex: 1,
    minWidth: '22%',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#334155',
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickBetText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
  },
  startGameButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#DC2626',
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  startGameText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
  },

  // Rules Card (inside betting card)
  rulesCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  rulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  rulesTitle: {
    color: '#C084FC',
    fontSize: SIZES.fontXS,
  },
  rulesList: {
    gap: 4,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ruleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  ruleText: {
    color: '#CBD5E1',
    fontSize: SIZES.fontXS,
  },

  // Book Card
  bookCard: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  bookHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  bookIconBox: {
    width: 24,
    height: 24,
    backgroundColor: '#6366F1',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookIconEmoji: {
    fontSize: SIZES.fontSM,
  },
  bookTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
  },
  bookCounter: {
    backgroundColor: 'rgba(67, 56, 202, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
  },
  bookCounterText: {
    color: '#A5B4FC',
    fontSize: SIZES.fontXS,
  },
  emptyBooksContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyBooksText: {
    color: '#94A3B8',
    fontSize: SIZES.fontSM,
    marginBottom: SPACING.md,
  },
  emptyBooksSubtext: {
    color: '#64748B',
    fontSize: SIZES.fontXS,
    textAlign: 'center',
    marginBottom: SPACING.base,
  },
  libraryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2563EB',
    borderRadius: SIZES.radiusLG,
  },
  libraryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  bookButton: {
    minWidth: '30%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  bookButtonSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.8)',
    borderColor: 'rgba(129, 140, 248, 0.5)',
  },
  bookButtonUnselected: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderColor: 'rgba(71, 85, 105, 0.5)',
  },
  bookButtonDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bookButtonText: {
    fontSize: SIZES.fontXS,
    flex: 1,
  },

  // Playing State
  playingContent: {
    padding: SPACING.md,
  },
  progressHeader: {
    marginBottom: SPACING.base,
  },
  progressText: {
    color: '#94A3B8',
    fontSize: SIZES.fontXS,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  scoreRow: {
    alignItems: 'center',
  },
  scoreText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  timerText: {
    color: '#FBBF24',
    fontSize: SIZES.font2XL,
  },
  questionCard: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    marginBottom: SPACING.base,
  },
  questionSource: {
    color: '#94A3B8',
    fontSize: SIZES.fontXS,
    marginBottom: SPACING.xs,
  },
  questionText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
  },
  answerContainer: {
    marginBottom: SPACING.base,
  },
  answerLabel: {
    color: '#67E8F9',
    fontSize: SIZES.fontXS,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  answerDisplay: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.3)',
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerText: {
    color: COLORS.white,
    fontSize: SIZES.font2XL,
    letterSpacing: 2,
  },
  keyboardContainer: {
    marginBottom: SPACING.base,
  },
  keyboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  keyButton: {
    width: '31%',
    paddingVertical: 12,
    backgroundColor: '#334155',
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyButtonClear: {
    width: '31%',
    paddingVertical: 12,
    backgroundColor: '#EA580C',
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyButtonDelete: {
    width: '31%',
    paddingVertical: 12,
    backgroundColor: '#C2410C',
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
  },
  submitButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#16A34A',
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
  },
  roundResultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  roundResultCard: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
    width: '80%',
  },
  roundResultTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  roundResultDetails: {
    gap: SPACING.xs,
  },
  roundResultText: {
    color: '#94A3B8',
    fontSize: SIZES.fontSM,
    textAlign: 'center',
  },

  // Result State
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  resultCard: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    width: '100%',
    alignItems: 'center',
  },
  resultIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.base,
  },
  resultTitle: {
    fontSize: SIZES.fontXL,
    marginBottom: SPACING.base,
  },
  resultScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  resultScore: {
    color: COLORS.white,
    fontSize: SIZES.font2XL,
  },
  resultScoreSeparator: {
    color: '#94A3B8',
    fontSize: SIZES.fontXL,
  },
  resultActionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  newGameButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#9333EA',
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  newGameButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
  },
  exitButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#334155',
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  exitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
  },
});
