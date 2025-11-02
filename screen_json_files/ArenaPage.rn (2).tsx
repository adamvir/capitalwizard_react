/**
 * ============================================
 * ARENAPAGE - REACT NATIVE VERSION
 * ============================================
 * 
 * VERSION: 3.0.0 - TELJES fight mód frissítés
 * 
 * ÚJ FUNKCIÓK ebben a verzióban:
 * ✅ Avatárok fight módban (player & AI)
 * ✅ VS ikon középen (narancs körrel)
 * ✅ Score boxok "Te" és "AI" feliratokkal
 * ✅ "Kérdés X/10" badge a felső sorban
 * ✅ "Válaszod:" címke (nem "A te tipped:")
 * ✅ "Beküldés" gomb (nem "Beküld")
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
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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

interface ArenaPageProps {
  onClose: () => void;
  coins: number;
  onCoinsChange: (newCoins: number) => void;
  subscriptionTier?: 'free' | 'pro' | 'master';
  onLimitReached?: () => void;
  onXpGain?: (xpAmount: number) => void;
  onNavigateToLibrary?: () => void;
  onStageAdvance?: () => void;
  onStreakUpdate?: (newStreak: number, isFirstToday: boolean) => void;
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
// MOCK DATA (Book data imports equivalent)
// ============================================

// Replace with actual imports from your data files
const MOCK_ARENA_QUESTIONS: Question[] = [
  { question: 'Mekkora az inflációs cél Magyarországon?', correctAnswer: 3, source: 'Pénzügyi Alapismeretek' },
  { question: 'Hány százalék a magyar társasági adó kulcsa?', correctAnswer: 9, source: 'Pénzügyi Alapismeretek' },
  { question: 'Hány százalékos kamatot adsz 100 forint után 10% esetén?', correctAnswer: 10, source: 'Pénzügyi Matematika' },
  { question: 'Mi az optimális megtakarítási ráta?', correctAnswer: 20, source: 'Befektetés Alapjai' },
  { question: 'Mekkora az osztalékhozam egy 100 Ft-os részvénynél, ha 5 Ft osztalékot fizet?', correctAnswer: 5, source: 'Részvények' },
  { question: 'Hány év a hosszú távú befektetési horizont?', correctAnswer: 10, source: 'Portfóliókezelés' },
  { question: 'Mi az átlagos P/E ráta értéke a piacokon?', correctAnswer: 15, source: 'Fundamentális Elemzés' },
  { question: 'Hány százalékos hozam az S&P 500 történelmi átlaga?', correctAnswer: 10, source: 'Részvények' },
  { question: 'Mi az ajánlott készpénz arány egy portfólióban?', correctAnswer: 5, source: 'Portfóliókezelés' },
  { question: 'Hány százalékos a magyar áfa kulcsa?', correctAnswer: 27, source: 'Pénzügyi Alapismeretek' },
];

// ============================================
// ANIMATED COMPONENTS
// ============================================

const AnimatedCrystal: React.FC<{
  delay: number;
  style: any;
}> = ({ delay, style }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withDelay(delay, withTiming(0.6, { duration: 2000 })),
        withTiming(0.3, { duration: 2000 })
      ),
      -1,
      false
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[style, animatedStyle]} />;
};

const AnimatedSword: React.FC = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1000 }),
        withTiming(10, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Swords size={SIZES.iconLG} color="#FBBF24" />
    </Animated.View>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const ArenaPage: React.FC<ArenaPageProps> = ({
  onClose,
  coins,
  onCoinsChange,
  subscriptionTier = 'free',
  onLimitReached,
  onXpGain,
  onNavigateToLibrary,
  onStageAdvance,
  onStreakUpdate,
}) => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [selectedMode, setSelectedMode] = useState<GameMode>('numbers');
  const [gameState, setGameState] = useState<GameState>('menu');
  const [betAmount, setBetAmount] = useState<number>(50);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [playerAnswer, setPlayerAnswer] = useState<string>('');
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [aiScore, setAiScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(10);
  const [showRoundResult, setShowRoundResult] = useState<boolean>(false);
  const [roundWinner, setRoundWinner] = useState<'player' | 'ai' | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [rentedBooks, setRentedBooks] = useState<RentedBook[]>([]);
  const [gamesPlayedToday, setGamesPlayedToday] = useState<number>(0);
  const [lastPlayedDate, setLastPlayedDate] = useState<string>('');

  // Avatar URLs - replace with your actual avatar images
  const playerAvatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop';
  const aiAvatarUrl = 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop';

  // ============================================
  // EFFECTS
  // ============================================

  // Load rented books and play count
  useEffect(() => {
    loadRentedBooks();
    loadPlayCount();
  }, []);

  // Timer countdown during playing
  useEffect(() => {
    if (gameState === 'playing' && !showRoundResult) {
      if (timer > 0) {
        const interval = setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
      } else {
        // Time's up - submit empty answer
        handleSubmitAnswer();
      }
    }
  }, [timer, gameState, showRoundResult]);

  // ============================================
  // ASYNC STORAGE FUNCTIONS
  // ============================================

  const loadRentedBooks = async () => {
    try {
      const stored = await AsyncStorage.getItem('rentedBooks');
      if (stored) {
        const books: RentedBook[] = JSON.parse(stored);
        const now = Date.now();
        const validBooks = books.filter((book) => book.rentedUntil > now);
        setRentedBooks(validBooks);
      }
    } catch (error) {
      console.error('Error loading rented books:', error);
    }
  };

  const loadPlayCount = async () => {
    try {
      const today = new Date().toDateString();
      const storedDate = await AsyncStorage.getItem('lastArenaPlayDate');
      const storedCount = await AsyncStorage.getItem('arenaGamesPlayedToday');

      if (storedDate === today && storedCount) {
        setGamesPlayedToday(parseInt(storedCount));
      } else {
        setGamesPlayedToday(0);
        await AsyncStorage.setItem('lastArenaPlayDate', today);
        await AsyncStorage.setItem('arenaGamesPlayedToday', '0');
      }
      setLastPlayedDate(storedDate || '');
    } catch (error) {
      console.error('Error loading play count:', error);
    }
  };

  const incrementPlayCount = async () => {
    const newCount = gamesPlayedToday + 1;
    setGamesPlayedToday(newCount);
    await AsyncStorage.setItem('arenaGamesPlayedToday', newCount.toString());
  };

  // ============================================
  // GAME LOGIC
  // ============================================

  const canPlayGame = (): boolean => {
    if (subscriptionTier === 'master') return true;
    if (subscriptionTier === 'pro') return true;
    return gamesPlayedToday < GAME_CONFIG.freeDailyArenaGames;
  };

  const startGame = () => {
    if (!canPlayGame()) {
      if (onLimitReached) onLimitReached();
      return;
    }

    if (coins < betAmount) {
      // Show toast/alert: "Nincs elég Érméd!"
      return;
    }

    // Deduct bet amount
    onCoinsChange(coins - betAmount);

    // Generate 10 random questions
    const shuffled = [...MOCK_ARENA_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 10));

    // Reset game state
    setPlayerScore(0);
    setAiScore(0);
    setCurrentQuestionIndex(0);
    setPlayerAnswer('');
    setTimer(10);
    setShowRoundResult(false);
    setRoundWinner(null);

    setGameState('playing');
    incrementPlayCount();
  };

  const handleNumberInput = (num: string) => {
    if (playerAnswer.length < 4) {
      setPlayerAnswer(playerAnswer + num);
    }
  };

  const handleDeleteInput = () => {
    setPlayerAnswer(playerAnswer.slice(0, -1));
  };

  const handleSubmitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const playerNum = parseInt(playerAnswer) || 0;
    const correctAnswer = currentQuestion.correctAnswer;

    // Generate AI answer (random between 0-100)
    const aiNum = Math.floor(Math.random() * 101);

    // Calculate distances
    const playerDistance = Math.abs(playerNum - correctAnswer);
    const aiDistance = Math.abs(aiNum - correctAnswer);

    // Determine winner
    let winner: 'player' | 'ai' | null = null;
    if (playerDistance < aiDistance) {
      winner = 'player';
      setPlayerScore(playerScore + 1);
    } else if (aiDistance < playerDistance) {
      winner = 'ai';
      setAiScore(aiScore + 1);
    }

    setRoundWinner(winner);
    setShowRoundResult(true);

    // Move to next question after 2 seconds
    setTimeout(() => {
      setShowRoundResult(false);
      setRoundWinner(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setPlayerAnswer('');
        setTimer(10);
      } else {
        // Game over
        endGame();
      }
    }, 2000);
  };

  const endGame = () => {
    const finalPlayerScore = roundWinner === 'player' ? playerScore + 1 : playerScore;
    const finalAiScore = roundWinner === 'ai' ? aiScore + 1 : aiScore;

    if (finalPlayerScore > finalAiScore) {
      // Player wins - return bet + winnings
      onCoinsChange(coins + betAmount * 2);
      if (onXpGain) onXpGain(50);
    } else {
      // Player loses - bet already deducted
      if (onXpGain) onXpGain(10);
    }

    setGameState('result');

    // Update streak if provided
    if (onStreakUpdate) {
      // This would normally call recordTaskCompletion
      // For now, just a placeholder
    }
  };

  const handleNewGame = () => {
    setGameState('betting');
    setPlayerAnswer('');
  };

  const handleExit = () => {
    setGameState('menu');
    setPlayerAnswer('');
  };

  // ============================================
  // RENDER METHODS
  // ============================================

  const renderHeader = () => (
    <LinearGradient
      colors={['rgba(15, 23, 42, 0.95)', 'rgba(88, 28, 135, 0.8)', 'rgba(15, 23, 42, 0.95)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Pressable onPress={onClose} style={styles.backButton}>
            <ChevronLeft size={SIZES.iconLG} color={COLORS.white} />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Küzdőtér</Text>
            <View style={styles.headerCoinsRow}>
              <Zap size={SIZES.iconSM} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.headerCoinsText}>{coins.toLocaleString()}</Text>
            </View>
          </View>
        </View>
        <AnimatedSword />
      </View>
    </LinearGradient>
  );

  const renderModeTabs = () => (
    <View style={styles.modeTabsContainer}>
      <Pressable
        style={[styles.modeTab, selectedMode === 'numbers' && styles.modeTabActive]}
        onPress={() => setSelectedMode('numbers')}
      >
        <Flame
          size={SIZES.iconSM}
          color={selectedMode === 'numbers' ? '#FBBF24' : '#64748B'}
          fill={selectedMode === 'numbers' ? '#FBBF24' : 'transparent'}
        />
        <Text style={[styles.modeTabText, selectedMode === 'numbers' && styles.modeTabTextActive]}>
          Számok
        </Text>
      </Pressable>

      <Pressable style={[styles.modeTab, styles.modeTabDisabled]} disabled>
        <TrendingUp size={SIZES.iconSM} color="#475569" />
        <Text style={styles.modeTabTextDisabled}>Hamarosan</Text>
      </Pressable>

      <Pressable style={[styles.modeTab, styles.modeTabDisabled]} disabled>
        <BarChart3 size={SIZES.iconSM} color="#475569" />
        <Text style={styles.modeTabTextDisabled}>Hamarosan</Text>
      </Pressable>
    </View>
  );

  const renderBettingCard = () => (
    <LinearGradient
      colors={['rgba(30, 41, 59, 0.9)', 'rgba(88, 28, 135, 0.3)']}
      style={styles.bettingCard}
    >
      <Text style={styles.bettingTitle}>Válassz tétet</Text>

      <View style={styles.betAmountContainer}>
        <Text style={styles.betAmountLabel}>Tét összege</Text>
        <View style={styles.betAmountDisplay}>
          <Zap size={SIZES.iconBase} color="#FBBF24" fill="#FBBF24" />
          <Text style={styles.betAmountText}>{betAmount}</Text>
        </View>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={10}
        maximumValue={GAME_CONFIG.maxBet}
        step={10}
        value={betAmount}
        onValueChange={setBetAmount}
        minimumTrackTintColor="#A855F7"
        maximumTrackTintColor="#334155"
        thumbTintColor="#C084FC"
      />

      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabelText}>10</Text>
        <Text style={styles.sliderLabelText}>{GAME_CONFIG.maxBet}</Text>
      </View>

      <View style={styles.quickBetRow}>
        {[50, 100, 200, 500].map((amount) => (
          <Pressable
            key={amount}
            style={[styles.quickBetButton, betAmount === amount && styles.quickBetButtonActive]}
            onPress={() => setBetAmount(amount)}
          >
            <Text
              style={[styles.quickBetText, betAmount === amount && styles.quickBetTextActive]}
            >
              {amount}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.startGameButton} onPress={startGame}>
        <Swords size={SIZES.iconSM} color={COLORS.white} />
        <Text style={styles.startGameText}>Küzdelem kezdése</Text>
      </Pressable>

      {/* Rules Card */}
      <View style={styles.rulesCard}>
        <View style={styles.rulesHeader}>
          <Star size={12} color="#C084FC" fill="#C084FC" />
          <Text style={styles.rulesTitle}>Szabályok</Text>
        </View>
        <View style={styles.rulesList}>
          <View style={styles.ruleItem}>
            <View style={[styles.ruleDot, { backgroundColor: '#A855F7' }]} />
            <Text style={styles.ruleText}>10 kérdés • Tippeld a számot</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={[styles.ruleDot, { backgroundColor: '#A855F7' }]} />
            <Text style={styles.ruleText}>Közelebb = nyersz</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={[styles.ruleDot, { backgroundColor: '#22C55E' }]} />
            <Text style={[styles.ruleText, { color: '#22C55E' }]}>
              Győzelem: +{betAmount}
            </Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={[styles.ruleDot, { backgroundColor: '#EF4444' }]} />
            <Text style={[styles.ruleText, { color: '#EF4444' }]}>
              Vereség: -{betAmount}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const renderBooksCard = () => {
    if (rentedBooks.length === 0) {
      return (
        <View style={styles.noBooksCard}>
          <BookOpen size={SIZES.iconLG} color="#64748B" />
          <Text style={styles.noBooksText}>Nincs kölcsönzött könyv</Text>
          <Pressable style={styles.goToLibraryButton} onPress={onNavigateToLibrary}>
            <Text style={styles.goToLibraryText}>Irány a Könyvtár</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.booksContainer}>
        <Text style={styles.booksTitle}>Kölcsönzött könyvek</Text>
        {rentedBooks.map((book, index) => (
          <LinearGradient
            key={index}
            colors={[book.color, 'rgba(15, 23, 42, 0.5)']}
            style={styles.bookCard}
          >
            <View style={styles.bookHeader}>
              <View style={styles.bookHeaderLeft}>
                <View style={[styles.bookIconBox, { backgroundColor: book.textColor }]}>
                  <BookOpen size={SIZES.iconSM} color={COLORS.white} />
                </View>
                <Text style={[styles.bookTitle, { color: book.textColor }]}>{book.title}</Text>
              </View>
            </View>
            <Text style={styles.bookDaysRemaining}>
              Még {Math.ceil((book.rentedUntil - Date.now()) / (1000 * 60 * 60 * 24))} nap
            </Text>
          </LinearGradient>
        ))}
      </View>
    );
  };

  const renderPlayingState = () => {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <View style={styles.playingContent}>
        {/* Header: Badge + Score + Timer */}
        <View style={styles.playingHeaderRow}>
          {/* Question Badge */}
          <View style={styles.questionBadge}>
            <Text style={styles.questionBadgeText}>
              Kérdés {currentQuestionIndex + 1}/10
            </Text>
          </View>

          {/* Score */}
          <View style={styles.scoreDisplay}>
            <Text style={styles.scoreText}>
              {playerScore}-{aiScore}
            </Text>
          </View>

          {/* Timer */}
          <View style={styles.timerBadge}>
            <Text style={styles.timerBadgeText}>{timer}s</Text>
          </View>
        </View>

        {/* Score Boxes Row */}
        <View style={styles.scoreBoxesRow}>
          {/* Player Score Box */}
          <View style={styles.scoreBoxPlayer}>
            <Trophy size={SIZES.iconSM} color="#3B82F6" />
            <Text style={styles.scoreBoxLabel}>Te</Text>
            <Text style={styles.scoreBoxValue}>{playerScore}</Text>
          </View>

          {/* AI Score Box */}
          <View style={styles.scoreBoxAi}>
            <Trophy size={SIZES.iconSM} color="#EF4444" />
            <Text style={styles.scoreBoxLabel}>AI</Text>
            <Text style={styles.scoreBoxValue}>{aiScore}</Text>
          </View>
        </View>

        {/* Avatars Row with VS Icon */}
        <View style={styles.avatarsRow}>
          {/* Player Avatar */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: playerAvatarUrl }} style={styles.avatarImage} />
            <View style={styles.avatarBadgePlayer}>
              <Crown size={12} color="#FBBF24" fill="#FBBF24" />
            </View>
          </View>

          {/* VS Icon */}
          <View style={styles.vsIconContainer}>
            <LinearGradient
              colors={['#F97316', '#EA580C']}
              style={styles.vsIconGradient}
            >
              <Swords size={SIZES.iconLG} color={COLORS.white} />
            </LinearGradient>
          </View>

          {/* AI Avatar */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: aiAvatarUrl }} style={styles.avatarImage} />
            <View style={styles.avatarBadgeAi}>
              <Flame size={12} color="#EF4444" fill="#EF4444" />
            </View>
          </View>
        </View>

        {/* Question Card */}
        <LinearGradient
          colors={['rgba(30, 41, 59, 0.9)', 'rgba(88, 28, 135, 0.3)']}
          style={styles.questionCard}
        >
          <Text style={styles.questionSource}>{currentQuestion.source}</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </LinearGradient>

        {/* Answer Input */}
        <View style={styles.answerContainer}>
          <View style={styles.answerLabel}>
            <Text style={styles.answerLabelText}>Válaszod:</Text>
            <View style={styles.answerDisplay}>
              <Text style={styles.answerDisplayText}>{playerAnswer || '---'}</Text>
            </View>
          </View>

          {/* Number Keyboard */}
          <View style={styles.numberKeyboard}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Pressable
                key={num}
                style={styles.keyButton}
                onPress={() => handleNumberInput(num.toString())}
              >
                <Text style={styles.keyText}>{num}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.keyButtonDelete} onPress={handleDeleteInput}>
              <X size={SIZES.iconBase} color={COLORS.white} />
            </Pressable>
            <Pressable
              style={styles.keyButton}
              onPress={() => handleNumberInput('0')}
            >
              <Text style={styles.keyText}>0</Text>
            </Pressable>
            <View style={styles.keyButtonEmpty} />
          </View>

          {/* Submit Button */}
          <Pressable
            style={[styles.submitButton, !playerAnswer && styles.submitButtonDisabled]}
            onPress={handleSubmitAnswer}
            disabled={!playerAnswer}
          >
            <Text style={styles.submitButtonText}>Beküldés</Text>
          </Pressable>
        </View>

        {/* Round Result Overlay */}
        {showRoundResult && (
          <View style={styles.roundResultOverlay}>
            <LinearGradient
              colors={
                roundWinner === 'player'
                  ? ['rgba(34, 197, 94, 0.9)', 'rgba(22, 163, 74, 0.9)']
                  : roundWinner === 'ai'
                  ? ['rgba(239, 68, 68, 0.9)', 'rgba(220, 38, 38, 0.9)']
                  : ['rgba(100, 116, 139, 0.9)', 'rgba(71, 85, 105, 0.9)']
              }
              style={styles.roundResultCard}
            >
              <Text style={styles.roundResultTitle}>
                {roundWinner === 'player' ? '🎉 Nyertél!' : roundWinner === 'ai' ? '😔 Vesztettél' : '🤝 Döntetlen'}
              </Text>
              <Text style={styles.roundResultCorrect}>
                Helyes válasz: {currentQuestion.correctAnswer}
              </Text>
            </LinearGradient>
          </View>
        )}
      </View>
    );
  };

  const renderResultState = () => {
    const playerWon = playerScore > aiScore;
    const isDraw = playerScore === aiScore;

    return (
      <View style={styles.resultContainer}>
        <LinearGradient
          colors={
            playerWon
              ? ['rgba(34, 197, 94, 0.2)', 'rgba(22, 163, 74, 0.1)']
              : isDraw
              ? ['rgba(100, 116, 139, 0.2)', 'rgba(71, 85, 105, 0.1)']
              : ['rgba(239, 68, 68, 0.2)', 'rgba(220, 38, 38, 0.1)']
          }
          style={styles.resultCard}
        >
          <Text style={styles.resultTitle}>
            {playerWon ? '🏆 Győzelem!' : isDraw ? '🤝 Döntetlen' : '😔 Vereség'}
          </Text>

          <View style={styles.resultScoreRow}>
            <Text style={styles.resultScorePlayer}>{playerScore}</Text>
            <Text style={styles.resultScoreSeparator}>-</Text>
            <Text style={styles.resultScoreAi}>{aiScore}</Text>
          </View>

          <Text style={styles.resultCoins}>
            {playerWon
              ? `+${betAmount * 2} Érme`
              : isDraw
              ? `+${betAmount} Érme (visszatérítve)`
              : `${betAmount} Érme elveszett`}
          </Text>

          <View style={styles.resultActionsRow}>
            <Pressable style={styles.newGameButton} onPress={handleNewGame}>
              <Swords size={SIZES.iconSM} color={COLORS.white} />
              <Text style={styles.newGameButtonText}>Új játék</Text>
            </Pressable>
            <Pressable style={styles.exitButton} onPress={handleExit}>
              <ChevronLeft size={SIZES.iconSM} color={COLORS.white} />
              <Text style={styles.exitButtonText}>Kilépés</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderContent = () => {
    if (gameState === 'playing') {
      return renderPlayingState();
    }

    if (gameState === 'result') {
      return renderResultState();
    }

    // Menu/Betting state
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderModeTabs()}
        {renderBettingCard()}
        {renderBooksCard()}
      </ScrollView>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <View style={styles.container}>
      {/* Background Decorations */}
      <View style={styles.backgroundDecorations}>
        <AnimatedCrystal
          delay={0}
          style={[styles.crystal, { top: 50, left: 20, width: 60, height: 80 }]}
        />
        <AnimatedCrystal
          delay={500}
          style={[styles.crystal, { top: 150, right: 30, width: 50, height: 70 }]}
        />
        <AnimatedCrystal
          delay={1000}
          style={[styles.crystal, { bottom: 100, left: 40, width: 70, height: 90 }]}
        />
      </View>

      {/* Header */}
      {renderHeader()}

      {/* Content */}
      {renderContent()}
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  backgroundDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  crystal: {
    position: 'absolute',
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  // Header
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(168, 85, 247, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#581C87',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
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
    borderRadius: 16,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    gap: 2,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
  },
  headerCoinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerCoinsText: {
    color: '#FBBF24',
    fontSize: SIZES.fontSM,
  },

  // Mode Tabs
  modeTabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.xs,
    marginBottom: SPACING.base,
    gap: SPACING.xs,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusBase,
  },
  modeTabActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
  },
  modeTabDisabled: {
    opacity: 0.5,
  },
  modeTabText: {
    color: '#64748B',
    fontSize: SIZES.fontSM,
  },
  modeTabTextActive: {
    color: '#FBBF24',
  },
  modeTabTextDisabled: {
    color: '#475569',
    fontSize: SIZES.fontSM,
  },

  // ScrollView
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
  bettingTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    marginBottom: SPACING.base,
  },
  betAmountContainer: {
    marginBottom: SPACING.sm,
  },
  betAmountLabel: {
    color: '#94A3B8',
    fontSize: SIZES.fontXS,
    marginBottom: SPACING.xs,
  },
  betAmountDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  betAmountText: {
    color: '#FBBF24',
    fontSize: SIZES.fontXL,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  sliderLabelText: {
    color: '#64748B',
    fontSize: SIZES.fontXS,
  },
  quickBetRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  quickBetButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(71, 85, 105, 0.5)',
    borderRadius: SIZES.radiusBase,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.5)',
    alignItems: 'center',
  },
  quickBetButtonActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
    borderColor: '#A855F7',
  },
  quickBetText: {
    color: '#94A3B8',
    fontSize: SIZES.fontSM,
  },
  quickBetTextActive: {
    color: '#C084FC',
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

  // Books
  noBooksCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    alignItems: 'center',
    gap: SPACING.md,
  },
  noBooksText: {
    color: '#94A3B8',
    fontSize: SIZES.fontSM,
  },
  goToLibraryButton: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    backgroundColor: '#6366F1',
    borderRadius: SIZES.radiusBase,
  },
  goToLibraryText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
  },
  booksContainer: {
    gap: SPACING.sm,
  },
  booksTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    marginBottom: SPACING.sm,
  },
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
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: SIZES.fontSM,
    flex: 1,
  },
  bookDaysRemaining: {
    color: '#CBD5E1',
    fontSize: SIZES.fontXS,
  },

  // Playing State
  playingContent: {
    flex: 1,
    padding: SPACING.md,
  },
  playingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  questionBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  questionBadgeText: {
    color: '#C084FC',
    fontSize: SIZES.fontXS,
  },
  scoreDisplay: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  scoreText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
  },
  timerBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.5)',
  },
  timerBadgeText: {
    color: '#FBBF24',
    fontSize: SIZES.fontSM,
  },

  // Score Boxes Row
  scoreBoxesRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.base,
  },
  scoreBoxPlayer: {
    flex: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: SIZES.radiusLG,
    borderWidth: 2,
    borderColor: '#3B82F6',
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  scoreBoxAi: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: SIZES.radiusLG,
    borderWidth: 2,
    borderColor: '#EF4444',
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  scoreBoxLabel: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
  },
  scoreBoxValue: {
    color: COLORS.white,
    fontSize: SIZES.font2XL,
  },

  // Avatars Row
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    gap: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  avatarBadgePlayer: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#FBBF24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgeAi: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsIconContainer: {
    marginHorizontal: SPACING.base,
  },
  vsIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },

  // Question Card
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

  // Answer Input
  answerContainer: {
    marginBottom: SPACING.base,
  },
  answerLabel: {
    marginBottom: SPACING.md,
  },
  answerLabelText: {
    color: '#94A3B8',
    fontSize: SIZES.fontSM,
    marginBottom: SPACING.xs,
  },
  answerDisplay: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    alignItems: 'center',
  },
  answerDisplayText: {
    color: COLORS.white,
    fontSize: SIZES.font2XL,
  },

  // Number Keyboard
  numberKeyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  keyButton: {
    width: '31%',
    paddingVertical: 12,
    backgroundColor: 'rgba(71, 85, 105, 0.5)',
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyButtonEmpty: {
    width: '31%',
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

  // Submit Button
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
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
  },

  // Round Result Overlay
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
    alignItems: 'center',
  },
  roundResultTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  roundResultCorrect: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
  },

  // Result State
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  resultCard: {
    width: '100%',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
    alignItems: 'center',
    gap: SPACING.base,
  },
  resultTitle: {
    color: COLORS.white,
    fontSize: SIZES.font2XL,
    textAlign: 'center',
  },
  resultScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  resultScorePlayer: {
    color: '#3B82F6',
    fontSize: 48,
  },
  resultScoreSeparator: {
    color: '#94A3B8',
    fontSize: SIZES.fontXL,
  },
  resultScoreAi: {
    color: '#EF4444',
    fontSize: 48,
  },
  resultCoins: {
    color: '#FBBF24',
    fontSize: SIZES.fontLG,
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

export default ArenaPage;
