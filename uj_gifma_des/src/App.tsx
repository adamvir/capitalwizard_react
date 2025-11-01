import { StandaloneBookView } from './components/StandaloneBookView';
import { PenzugyiAlapismeretkBookView } from './components/PenzugyiAlapismeretkBookView';
import { MainScreen } from './components/MainScreen';
import { CharacterLineup } from './components/CharacterLineup';
import { PhoneFrame } from './components/PhoneFrame';
import { LessonHeader } from './components/LessonHeader';
import { LessonGame } from './components/LessonGame';
import { QuizGame } from './components/QuizGame';
import { ReadingGame } from './components/ReadingGame';
import { LevelUpCelebration } from './components/LevelUpCelebration';
import { StreakCelebration } from './components/StreakCelebration';
import { UniversityPage } from './components/UniversityPage';
import { ArenaPage } from './components/ArenaPage';
import { ProfilePage } from './components/ProfilePage';
import { SubscriptionPage } from './components/SubscriptionPage';
import { DailyLimitPage } from './components/DailyLimitPage';
import { AvatarSelectorPage } from './components/AvatarSelectorPage';
import { ManagerPage } from './components/ManagerPage';
import { LessonsPage } from './components/LessonsPage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StreakPage } from './components/StreakPage';
import { ShopPage } from './components/ShopPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { recordTaskCompletion, getCurrentStreak, getLongestStreak, resetStreak, addStreakFreeze, getStreakFreezes, loadStreakData } from './utils/streakManager';
import { getGameConfig, getLevelFromXp, getTotalXpForLevel } from './utils/gameConfig';
import { tokepiaciSzotarData } from './data/tokepiaciSzotar';
import { befektetesAlapjaiData } from './data/befektetesAlapjai';
import { penzugyiAlapismeretkData } from './data/penzugyiAlapismeretek';
import { reszvenyekData } from './data/reszvenyekData';
import { kotvenyekData } from './data/kotvenyekData';
import { portfolioKezelesData } from './data/portfolioKezeles';
import { technikaiElemzesData } from './data/technikaiElemzes';
import { fundamentalisElemzesData } from './data/fundamentalisElemzes';
import { penzugyimatematikaData } from './data/penzugyiMatematika';
import { opciokData } from './data/opciok';
import { hatariidosUgyletekData } from './data/hatariidosUgyletek';
import { kockazatkezelesData } from './data/kockazatkezeles';
import { makrogazdasagData } from './data/makrogazdasag';
import { kriptoEsBlockchainData } from './data/kriptoEsBlockchain';
import { pszichologiaEsTradingData } from './data/pszichologiaEsTrading';
import { ingatlanBefektetesData } from './data/ingatlanBefektetes';
import { penzugyiAlapismeretkLessons, getTotalLessonsInFirstRound, getTotalLessonsInSecondRound } from './data/penzugyiAlapismeretkLessons';
import { useState, useEffect } from 'react';
import { COLORS, SPACING } from './utils/styleConstants';

// Lesson rewards mapping
const lessonRewards: Record<number, number> = {
  7: 150,
  8: 300,
  9: 100
};

// Initial welcome state (for first time users)
const getWelcomeState = () => {
  const config = getGameConfig();
  return {
    currentPage: 'main' as const,
    coins: config.initialGold,
    gems: 0,
    currentLesson: 7,
    progressPosition: 0,
    playerLevel: 0,
    totalXp: 0,
    selectedBookTitle: 'Tőkepiaci Szótár',
    subscriptionTier: 'free' as 'free' | 'pro' | 'master',
    hasSeenWelcome: false,
    currentStageInSection: 1,
    totalStagesCompleted: 0,
    longestStreak: 0,
    streakFreezes: 0
  };
};

// Default game state
const DEFAULT_GAME_STATE = {
  currentPage: 'main' as const,
  coins: 680,
  gems: 25,
  currentLesson: 7,
  progressPosition: 3,
  playerLevel: 2,
  totalXp: 1000,
  selectedBookTitle: 'Tőkepiaci Szótár',
  subscriptionTier: 'free' as 'free' | 'pro' | 'master',
  hasSeenWelcome: true,
  currentStageInSection: 4,
  totalStagesCompleted: 3,
  longestStreak: 0,
  streakFreezes: 0
};

// Load from localStorage or use defaults
const loadGameState = () => {
  try {
    const saved = localStorage.getItem('rpg_game_state');
    if (saved) {
      const state = JSON.parse(saved);
      // Ensure progressPosition is synced with currentStageInSection
      if (state.currentStageInSection !== undefined && state.progressPosition === undefined) {
        state.progressPosition = state.currentStageInSection - 1;
      }
      return state;
    }
  } catch (error) {
    console.error('Error loading game state:', error);
  }
  // First time user - show welcome screen
  return getWelcomeState();
};

// Save to localStorage
const saveGameState = (state: any) => {
  try {
    localStorage.setItem('rpg_game_state', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

export default function App() {
  const initialState = loadGameState();
  
  const [currentPage, setCurrentPage] = useState<'main' | 'lesson' | 'game' | 'university' | 'bookview' | 'arena' | 'profile' | 'subscription' | 'dailylimit' | 'avatar' | 'manager' | 'lessons' | 'streak' | 'shop'>(initialState.currentPage);
  const [coins, setCoins] = useState(initialState.coins);
  const [gems, setGems] = useState(initialState.gems || 0);
  const [currentLesson, setCurrentLesson] = useState(initialState.currentLesson);
  const [currentStageInSection, setCurrentStageInSection] = useState(initialState.currentStageInSection || 1);
  const [progressPosition, setProgressPosition] = useState(
    initialState.progressPosition !== undefined 
      ? initialState.progressPosition 
      : (initialState.currentStageInSection ? initialState.currentStageInSection - 1 : 0)
  ); // 0-based index, synced with currentStageInSection
  const [totalXp, setTotalXp] = useState(initialState.totalXp || 0);
  const [playerLevel, setPlayerLevel] = useState(initialState.playerLevel);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'master'>(initialState.subscriptionTier || 'free');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [celebratedStreakNumber, setCelebratedStreakNumber] = useState(0);
  const [justLeveledUp, setJustLeveledUp] = useState(false); // Track if we just leveled up
  const [pendingReturnToLessons, setPendingReturnToLessons] = useState(false); // Track if we should return to lessons page after celebrations
  const [selectedBookTitle, setSelectedBookTitle] = useState<string>(initialState.selectedBookTitle);
  const [playerName, setPlayerName] = useState<string>('');
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(initialState.longestStreak || 0);
  const [streakFreezes, setStreakFreezes] = useState<number>(initialState.streakFreezes || 0);
  const [limitType, setLimitType] = useState<'lessons' | 'arena'>('lessons');
  const [hasSeenWelcome, setHasSeenWelcome] = useState(initialState.hasSeenWelcome ?? true);
  const [totalStagesCompleted, setTotalStagesCompleted] = useState(initialState.totalStagesCompleted || 0);
  
  // New lesson system for Pénzügyi Alapismeretek
  const [currentBookLessonIndex, setCurrentBookLessonIndex] = useState(initialState.currentBookLessonIndex || 0);
  const [currentGameType, setCurrentGameType] = useState<'reading' | 'matching' | 'quiz'>(initialState.currentGameType || 'reading');
  const [isFirstRound, setIsFirstRound] = useState(initialState.isFirstRound ?? true);
  const [isManualLessonMode, setIsManualLessonMode] = useState(false); // Track if lesson was manually selected from LessonsPage

  // Find next incomplete lesson on mount - ONLY if no saved state exists
  useEffect(() => {
    const findNextIncompleteLesson = () => {
      // Check if we have a saved game state with lesson position
      const savedGameState = localStorage.getItem('rpg_game_state');
      if (savedGameState) {
        try {
          const state = JSON.parse(savedGameState);
          // If we have saved lesson state, use that instead of calculating
          if (state.currentBookLessonIndex !== undefined) {
            console.log('📚 Using saved lesson state from localStorage');
            return;
          }
        } catch (error) {
          console.error('Error checking saved state:', error);
        }
      }

      const savedProgress = localStorage.getItem('lessonProgress');
      if (!savedProgress) {
        // No progress yet, start from the beginning
        console.log('📚 No progress found, starting from first lesson');
        return;
      }

      const progress = JSON.parse(savedProgress);
      const bookProgress = progress['Pénzügyi Alapismeretek'] || {};
      
      // First Round: Find first incomplete lesson
      for (let pageIndex = 0; pageIndex < penzugyiAlapismeretkLessons.length; pageIndex++) {
        const gameTypes: ('reading' | 'matching' | 'quiz')[] = ['reading', 'matching', 'quiz'];
        for (const gameType of gameTypes) {
          const progressKey = `${pageIndex}-${gameType}`;
          if (!bookProgress[progressKey]) {
            // Found first incomplete lesson
            console.log('🎯 Found next incomplete lesson:', { pageIndex, gameType });
            setCurrentBookLessonIndex(pageIndex);
            setCurrentGameType(gameType);
            setIsFirstRound(true);
            return;
          }
        }
      }

      // All first round lessons completed, check second round
      console.log('✅ First round completed, checking second round');
      for (let pageIndex = 0; pageIndex < penzugyiAlapismeretkLessons.length; pageIndex++) {
        const progressKey = `${pageIndex}-reading-round2`;
        if (!bookProgress[progressKey]) {
          // Found first incomplete second round lesson
          console.log('🎯 Found next second round lesson:', { pageIndex });
          setCurrentBookLessonIndex(pageIndex);
          setCurrentGameType('reading');
          setIsFirstRound(false);
          return;
        }
      }

      // Everything completed!
      console.log('🏆 All lessons completed! Restarting from beginning.');
      setCurrentBookLessonIndex(0);
      setCurrentGameType('reading');
      setIsFirstRound(true);
    };

    // Only run once on mount
    findNextIncompleteLesson();
  }, []); // Empty dependency array - only run on mount

  // Debug: Log lesson state changes
  useEffect(() => {
    console.log('📊 Lesson state changed:', {
      currentBookLessonIndex,
      currentGameType,
      isFirstRound
    });
  }, [currentBookLessonIndex, currentGameType, isFirstRound]);

  // Debug: Log progress position changes and ensure sync
  useEffect(() => {
    const expectedProgressPosition = currentStageInSection - 1;
    console.log('🎯 Progress state:', {
      currentStageInSection,
      progressPosition,
      expectedProgressPosition,
      synced: progressPosition === expectedProgressPosition
    });
    
    // Auto-fix if out of sync
    if (progressPosition !== expectedProgressPosition) {
      console.warn('⚠️ Progress position out of sync! Fixing...');
      setProgressPosition(expectedProgressPosition);
    }
  }, [currentStageInSection, progressPosition]);

  // Load initial streak on mount
  useEffect(() => {
    const streak = getCurrentStreak();
    setCurrentStreak(streak);
    
    // Load longest streak from streakManager
    const longest = getLongestStreak();
    // Ensure longestStreak is never less than currentStreak
    const correctedLongest = Math.max(longest, streak);
    setLongestStreak(correctedLongest);
    
    // Debug: Log localStorage content on App mount
    console.log('🔍 DEBUG - localStorage content on App mount:');
    const lessonProgress = localStorage.getItem('lessonProgress');
    if (lessonProgress) {
      try {
        const parsed = JSON.parse(lessonProgress);
        console.log('📚 Lesson Progress:', parsed);
        
        // Count lessons for Pénzügyi Alapismeretek
        if (parsed['Pénzügyi Alapismeretek']) {
          const completedLessons = Object.keys(parsed['Pénzügyi Alapismeretek']).filter(
            key => parsed['Pénzügyi Alapismeretek'][key]
          );
          console.log('✅ Completed lessons for Pénzügyi Alapismeretek:', completedLessons);
        }
      } catch (error) {
        console.error('Error parsing lesson progress:', error);
      }
    } else {
      console.log('📚 No lesson progress found in localStorage');
    }
  }, []);

  // Initialize and sync streak freezes on mount
  useEffect(() => {
    // First, check if we have streak freezes in streakManager localStorage
    const freezesFromManager = getStreakFreezes();
    const gameStateFreezes = initialState.streakFreezes || 0;
    
    // If the game state has more freezes than the manager, sync them
    if (gameStateFreezes > freezesFromManager) {
      console.log('❄️ Syncing streak freezes from game state to manager:', gameStateFreezes);
      // Add the difference to the manager
      const difference = gameStateFreezes - freezesFromManager;
      if (difference > 0) {
        addStreakFreeze(difference);
      }
    }
    
    // Then set the state to the current value from manager
    const currentFreezes = getStreakFreezes();
    console.log('❄️ Setting initial streak freezes state to:', currentFreezes);
    setStreakFreezes(currentFreezes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check and update streak daily at midnight
  useEffect(() => {
    const updateStreakIfNeeded = () => {
      const streak = getCurrentStreak();
      const longest = getLongestStreak();
      const freezes = getStreakFreezes();
      
      if (streak !== currentStreak || longest !== longestStreak || freezes !== streakFreezes) {
        console.log('📅 New day detected! Updating streak:', streak, 'Longest:', longest, 'Freezes:', freezes);
        setCurrentStreak(streak);
        setLongestStreak(longest);
        setStreakFreezes(freezes);
      }
    };

    // Check immediately
    updateStreakIfNeeded();

    // Check every minute to detect midnight crossover
    const interval = setInterval(updateStreakIfNeeded, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [currentStreak, streakFreezes]);

  // Auto-save game state to sessionStorage for backup
  useEffect(() => {
    const gameState = {
      coins,
      gems,
      playerLevel,
      totalXp,
      currentStreak,
      longestStreak,
      streakFreezes,
      subscriptionTier,
      currentStageInSection,
      totalStagesCompleted,
      timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem('auto_backup_state', JSON.stringify(gameState));
  }, [coins, gems, playerLevel, totalXp, currentStreak, longestStreak, streakFreezes, subscriptionTier, currentStageInSection, totalStagesCompleted]);

  // Load player name from profile
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setPlayerName(profile.name || '');
      }
    } catch (error) {
      console.error('Error loading player name:', error);
    }
  }, []);

  // Listen for profile updates
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedProfile = localStorage.getItem('user_profile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setPlayerName(profile.name || '');
        }
      } catch (error) {
        console.error('Error loading player name:', error);
      }
    };

    const handleProfileUpdate = () => {
      handleStorageChange();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleProfileUpdate);
    // Also check when returning from profile page
    if (currentPage === 'main') {
      handleStorageChange();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [currentPage]);

  // Listen for streak updates from Arena or other components
  useEffect(() => {
    const handleStreakUpdate = (event: CustomEvent) => {
      if (event.detail && typeof event.detail.streak === 'number') {
        setCurrentStreak(event.detail.streak);
        
        // Show celebration if this is a first completion today
        if (event.detail.isFirstToday) {
          setCelebratedStreakNumber(event.detail.streak);
          setShowStreakCelebration(true);
        }
      }
    };

    window.addEventListener('streakUpdated', handleStreakUpdate as EventListener);

    return () => {
      window.removeEventListener('streakUpdated', handleStreakUpdate as EventListener);
    };
  }, []);

  // Track and save max progress state
  useEffect(() => {
    // Calculate total completed lessons to compare progress
    const savedProgress = localStorage.getItem('lessonProgress');
    let completedLessonsCount = 0;
    
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        Object.values(progress).forEach((bookProgress: any) => {
          completedLessonsCount += Object.keys(bookProgress).filter(key => bookProgress[key]).length;
        });
      } catch (error) {
        console.error('Error calculating progress:', error);
      }
    }

    // Load current max progress
    const maxProgressStr = localStorage.getItem('max_progress_state');
    let shouldUpdate = false;
    
    if (!maxProgressStr) {
      // No max progress saved yet
      shouldUpdate = true;
    } else {
      try {
        const maxProgress = JSON.parse(maxProgressStr);
        const maxCompletedLessons = maxProgress.completedLessonsCount || 0;
        
        // Update if current progress is greater
        if (completedLessonsCount > maxCompletedLessons || totalXp > (maxProgress.totalXp || 0)) {
          shouldUpdate = true;
        }
      } catch (error) {
        shouldUpdate = true;
      }
    }

    if (shouldUpdate && completedLessonsCount > 0) {
      // Collect all localStorage data that should be saved
      const lessonProgress = localStorage.getItem('lessonProgress');
      const rentedBooks = localStorage.getItem('rentedBooks');
      const userProfile = localStorage.getItem('user_profile');
      const playerAvatar = localStorage.getItem('player_avatar');
      const dailyStreak = localStorage.getItem('daily_streak');
      const dailyLessons = localStorage.getItem('daily_lessons');
      const arenaDailyGames = localStorage.getItem('arena_daily_games');
      
      const maxProgressState = {
        // Game state
        coins,
        gems,
        currentLesson,
        progressPosition,
        playerLevel,
        totalXp,
        selectedBookTitle,
        subscriptionTier,
        currentStageInSection,
        totalStagesCompleted,
        currentBookLessonIndex,
        currentGameType,
        isFirstRound,
        completedLessonsCount,
        currentStreak,
        longestStreak,
        streakFreezes,
        timestamp: Date.now(),
        
        // localStorage snapshots
        lessonProgress,
        rentedBooks,
        userProfile,
        playerAvatar,
        dailyStreak,
        dailyLessons,
        arenaDailyGames
      };
      
      localStorage.setItem('max_progress_state', JSON.stringify(maxProgressState));
      console.log('💾 Max progress state updated:', maxProgressState);
    }
  }, [coins, gems, currentLesson, progressPosition, playerLevel, totalXp, selectedBookTitle, subscriptionTier, currentStageInSection, totalStagesCompleted, currentBookLessonIndex, currentGameType, isFirstRound, currentStreak, longestStreak, streakFreezes]);

  // Save game state whenever it changes
  useEffect(() => {
    saveGameState({
      currentPage,
      coins,
      gems,
      currentLesson,
      progressPosition,
      totalXp,
      playerLevel,
      subscriptionTier,
      selectedBookTitle,
      hasSeenWelcome,
      currentStageInSection,
      totalStagesCompleted,
      currentBookLessonIndex,
      currentGameType,
      isFirstRound,
      longestStreak,
      streakFreezes
    });
  }, [currentPage, coins, gems, currentLesson, progressPosition, totalXp, playerLevel, subscriptionTier, selectedBookTitle, hasSeenWelcome, currentStageInSection, totalStagesCompleted, currentBookLessonIndex, currentGameType, isFirstRound, longestStreak, streakFreezes]);

  // Check daily lesson limit (3 lessons per day for free users)
  const checkLessonLimit = () => {
    if (subscriptionTier !== 'free') {
      return true; // Pro and Master have unlimited lessons
    }

    const today = new Date().toDateString();
    const savedData = localStorage.getItem('daily_lessons');
    
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.date === today) {
        return data.lessonsCompleted < 3;
      }
    }
    
    return true; // New day or first time
  };

  const incrementLessonsCompleted = () => {
    if (subscriptionTier !== 'free') {
      return; // No need to track for premium users
    }

    const today = new Date().toDateString();
    const savedData = localStorage.getItem('daily_lessons');
    
    let lessonsCompleted = 1;
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.date === today) {
        lessonsCompleted = data.lessonsCompleted + 1;
      }
    }

    localStorage.setItem('daily_lessons', JSON.stringify({
      date: today,
      lessonsCompleted: lessonsCompleted
    }));
  };

  const handleProgressClick = () => {
    console.log('🎯 Továbbhaladás clicked! Current state:', {
      currentBookLessonIndex,
      currentGameType,
      isFirstRound,
      isManualLessonMode,
      pendingReturnToLessons
    });
    
    // Check lesson limit before allowing to start
    if (!checkLessonLimit()) {
      setLimitType('lessons');
      setCurrentPage('dailylimit');
      return;
    }
    // Reset flags for normal progression mode
    setIsManualLessonMode(false);
    setPendingReturnToLessons(false);
    setCurrentPage('lesson');
  };

  const handleBackClick = () => {
    setCurrentPage('main');
  };

  const handleStartClick = () => {
    // Increment lesson counter when starting a lesson
    incrementLessonsCompleted();
    setCurrentPage('game');
  };

  const handleUniversityClick = () => {
    setCurrentPage('university');
  };

  const handleArenaClick = () => {
    setCurrentPage('arena');
  };

  const handleOpenBookView = (bookTitle: string) => {
    setSelectedBookTitle(bookTitle);
    setCurrentPage('bookview');
  };

  const handleBackFromBookView = () => {
    setCurrentPage('university');
  };

  const handleProfileClick = () => {
    setCurrentPage('profile');
  };

  const handleSubscriptionClick = () => {
    setCurrentPage('subscription');
  };

  const handleLessonsClick = () => {
    setCurrentPage('lessons');
  };

  const handleStartLessonFromMap = (bookTitle: string, lessonIndex: number, gameType: 'reading' | 'matching' | 'quiz') => {
    // Set the lesson state
    setSelectedBookTitle(bookTitle);
    setCurrentBookLessonIndex(lessonIndex);
    setCurrentGameType(gameType);
    setIsManualLessonMode(true); // Mark as manually selected
    // Start the game directly
    setCurrentPage('game');
  };

  const handleXpGain = (xpAmount: number) => {
    const newTotalXp = totalXp + xpAmount;
    setTotalXp(newTotalXp);
    
    // Calculate new level
    const { level: newLevel } = getLevelFromXp(newTotalXp);
    
    // Check if leveled up
    if (newLevel > playerLevel) {
      setPlayerLevel(newLevel);
      setShowLevelUp(true);
      setJustLeveledUp(true); // Mark that we just leveled up
    }
  };

  const handleArenaLimitReached = () => {
    setLimitType('arena');
    setCurrentPage('dailylimit');
  };

  const handleDailyLimitUpgrade = () => {
    setCurrentPage('subscription');
  };

  const handleAvatarClick = () => {
    setCurrentPage('avatar');
  };

  const handleManagerClick = () => {
    setCurrentPage('manager');
  };

  // Get book data and styling based on selected book title
  const getBookData = () => {
    switch (selectedBookTitle) {
      case 'Tőkepiaci Szótár':
        return {
          data: tokepiaciSzotarData,
          coverColor: 'from-amber-700 via-amber-800 to-amber-900',
          accentColor: 'border-amber-400 text-amber-400'
        };
      case 'Befektetés Alapjai':
        return {
          data: befektetesAlapjaiData,
          coverColor: 'from-blue-700 via-blue-800 to-blue-900',
          accentColor: 'border-blue-400 text-blue-400'
        };
      case 'Pénzügyi Alapismeretek':
        return {
          data: penzugyiAlapismeretkData,
          coverColor: 'from-slate-700 via-slate-800 to-slate-900',
          accentColor: 'border-slate-400 text-slate-400'
        };
      case 'Részvények':
        return {
          data: reszvenyekData,
          coverColor: 'from-green-700 via-green-800 to-green-900',
          accentColor: 'border-green-400 text-green-400'
        };
      case 'Kötvények':
        return {
          data: kotvenyekData,
          coverColor: 'from-purple-700 via-purple-800 to-purple-900',
          accentColor: 'border-purple-400 text-purple-400'
        };
      case 'Portfolió Kezelés':
        return {
          data: portfolioKezelesData,
          coverColor: 'from-red-700 via-red-800 to-red-900',
          accentColor: 'border-red-400 text-red-400'
        };
      case 'Technikai Elemzés':
        return {
          data: technikaiElemzesData,
          coverColor: 'from-indigo-700 via-indigo-800 to-indigo-900',
          accentColor: 'border-indigo-400 text-indigo-400'
        };
      case 'Fundamentális Elemzés':
        return {
          data: fundamentalisElemzesData,
          coverColor: 'from-teal-700 via-teal-800 to-teal-900',
          accentColor: 'border-teal-400 text-teal-400'
        };
      case 'Pénzügyi Matematika':
        return {
          data: penzugyimatematikaData,
          coverColor: 'from-orange-700 via-orange-800 to-orange-900',
          accentColor: 'border-orange-400 text-orange-400'
        };
      case 'Opciók':
        return {
          data: opciokData,
          coverColor: 'from-pink-700 via-pink-800 to-pink-900',
          accentColor: 'border-pink-400 text-pink-400'
        };
      case 'Határidős Ügyletek':
        return {
          data: hatariidosUgyletekData,
          coverColor: 'from-cyan-700 via-cyan-800 to-cyan-900',
          accentColor: 'border-cyan-400 text-cyan-400'
        };
      case 'Kockázatkezelés':
        return {
          data: kockazatkezelesData,
          coverColor: 'from-gray-700 via-gray-800 to-gray-900',
          accentColor: 'border-gray-400 text-gray-400'
        };
      case 'Makrogazdaság':
        return {
          data: makrogazdasagData,
          coverColor: 'from-yellow-700 via-yellow-800 to-yellow-900',
          accentColor: 'border-yellow-400 text-yellow-400'
        };
      case 'Kripto és Blockchain':
        return {
          data: kriptoEsBlockchainData,
          coverColor: 'from-green-700 via-green-800 to-green-900',
          accentColor: 'border-green-400 text-green-400'
        };
      case 'Pszichológia és Trading':
        return {
          data: pszichologiaEsTradingData,
          coverColor: 'from-blue-700 via-blue-800 to-blue-900',
          accentColor: 'border-blue-400 text-blue-400'
        };
      case 'Ingatlan Befektetés':
        return {
          data: ingatlanBefektetesData,
          coverColor: 'from-red-700 via-red-800 to-red-900',
          accentColor: 'border-red-400 text-red-400'
        };
      default:
        return {
          data: tokepiaciSzotarData,
          coverColor: 'from-amber-700 via-amber-800 to-amber-900',
          accentColor: 'border-amber-400 text-amber-400'
        };
    }
  };

  const bookConfig = getBookData();

  const advanceStage = () => {
    const config = getGameConfig();
    const newStageInSection = currentStageInSection + 1;
    const newTotalStages = totalStagesCompleted + 1;
    
    // Check if completing a milestone (6 stages)
    if (newStageInSection > config.stagesPerMilestone) {
      // Reset to stage 1 and award diamonds
      setCurrentStageInSection(1);
      setProgressPosition(0); // Reset progressPosition to 0 (first position)
      setTotalStagesCompleted(newTotalStages);
      
      const diamondReward = config.diamondsPerMilestone;
      setGems(prev => prev + diamondReward);
      
      // Show diamond reward toast
      toast.success(`🏆 Mérföldkő teljesítve! +${diamondReward} gyémánt!`, {
        duration: 4000,
      });
    } else {
      // Just advance to next stage
      setCurrentStageInSection(newStageInSection);
      setProgressPosition(newStageInSection - 1); // progressPosition is 0-indexed (0-5)
      setTotalStagesCompleted(newTotalStages);
    }
  };

  const handleWin = () => {
    const config = getGameConfig();
    
    // Calculate current lesson number (every game is a separate lesson)
    const currentLessonNumber = isFirstRound 
      ? (currentBookLessonIndex * 3) + (currentGameType === 'reading' ? 1 : currentGameType === 'matching' ? 2 : 3)
      : penzugyiAlapismeretkLessons.length * 3 + currentBookLessonIndex + 1;
    
    console.log('🎮 handleWin called!', {
      currentBookLessonIndex,
      currentGameType,
      isFirstRound,
      currentLessonNumber
    });

    // Record task completion and update streak
    const { isFirstToday, newStreak, longestStreak: newLongestStreak } = recordTaskCompletion();
    
    console.log('🔥 Streak updated:', {
      isFirstToday,
      newStreak,
      previousStreak: currentStreak,
      longestStreak: newLongestStreak
    });
    
    // Update streak state and longest streak
    setCurrentStreak(newStreak);
    setLongestStreak(newLongestStreak);
    
    // Advance stage
    advanceStage();
    
    // Check if this lesson was already completed before
    const progressKey = isFirstRound 
      ? `${currentBookLessonIndex}-${currentGameType}` 
      : `${currentBookLessonIndex}-reading-round2`;
    const savedProgress = localStorage.getItem('lessonProgress');
    const progress = savedProgress ? JSON.parse(savedProgress) : {};
    
    const wasAlreadyCompleted = progress[selectedBookTitle]?.[progressKey] === true;
    
    // Calculate rewards based on whether this is a repeated lesson
    let reward: number;
    let xpReward: number;
    
    if (wasAlreadyCompleted) {
      // Repeated lesson - use reduced rewards
      reward = config.repeatedLessonGold;
      xpReward = config.repeatedLessonXp;
      console.log('🔁 Repeated lesson detected - reduced rewards');
    } else {
      // First time completing this lesson - full rewards based on game type difficulty
      // Reading = Hard (goldHard, xpHard), Matching = Medium (goldMedium, xpMedium), Quiz = Easy (goldEasy, xpEasy)
      if (currentGameType === 'reading') {
        reward = config.goldHard;    // Nehéz - Reading - 150 gold
        xpReward = config.xpHard;    // Nehéz - Reading - 150 XP
      } else if (currentGameType === 'matching') {
        reward = config.goldMedium;  // Közepes - Matching - 100 gold
        xpReward = config.xpMedium;  // Közepes - Matching - 100 XP
      } else {
        reward = config.goldEasy;    // Könnyű - Quiz - 50 gold
        xpReward = config.xpEasy;    // Könnyű - Quiz - 50 XP
      }
      console.log('✨ First time completing - full rewards', { gameType: currentGameType, reward, xpReward });
    }
    
    // Add reward coins
    setCoins(prev => prev + reward);
    
    // Check if this will cause a level up BEFORE adding XP
    const newTotalXp = totalXp + xpReward;
    const { level: newLevel } = getLevelFromXp(newTotalXp);
    const willLevelUp = newLevel > playerLevel;
    
    // Add XP reward (this will trigger level up celebration if applicable)
    handleXpGain(xpReward);
    
    // Save lesson progress to localStorage
    if (!progress[selectedBookTitle]) {
      progress[selectedBookTitle] = {};
    }
    progress[selectedBookTitle][progressKey] = true;
    
    console.log('💾 Saving lesson progress:', {
      bookTitle: selectedBookTitle,
      progressKey,
      wasAlreadyCompleted,
      reward,
      xpReward,
      allProgress: progress[selectedBookTitle]
    });
    
    localStorage.setItem('lessonProgress', JSON.stringify(progress));
    
    // Notify LessonsPage component about completion
    window.dispatchEvent(new Event('lessonCompleted'));
    
    // Determine next lesson based on new book system - ALWAYS advance to next lesson
    if (isFirstRound) {
      // First round: Reading -> Matching -> Quiz for each page
      if (currentGameType === 'reading') {
        // Move to matching - prepare for next game
        console.log('📖 Reading completed, moving to matching');
        setCurrentGameType('matching');
        toast.success(`✅ ${currentLessonNumber}. lecke (Szövegértés) teljesítve! +${xpReward} XP, +${reward} arany`, { duration: 3000 });
      } else if (currentGameType === 'matching') {
        // Move to quiz - prepare for next game
        console.log('🔗 Matching completed, moving to quiz');
        setCurrentGameType('quiz');
        toast.success(`✅ ${currentLessonNumber}. lecke (Párosítás) teljesítve! +${xpReward} XP, +${reward} arany`, { duration: 3000 });
      } else {
        // Completed quiz - move to next page
        const nextPageIndex = currentBookLessonIndex + 1;
        console.log('❓ Quiz completed, next page index:', nextPageIndex);
        
        if (nextPageIndex >= penzugyiAlapismeretkLessons.length) {
          // Completed first round - start second round
          console.log('🎉 First round completed!');
          setIsFirstRound(false);
          setCurrentBookLessonIndex(0);
          setCurrentGameType('reading');
          toast.success(`✅ ${currentLessonNumber}. lecke (Kvíz) teljesítve! +${xpReward} XP, +${reward} arany`, { duration: 3000 });
          toast.success('🎉 Első kör teljesítve! Kezdődik a második kör!', { duration: 5000 });
        } else {
          // Move to next page - prepare for next lesson
          console.log('➡️ Moving to next lesson:', nextPageIndex);
          setCurrentBookLessonIndex(nextPageIndex);
          setCurrentGameType('reading');
          toast.success(`✅ ${currentLessonNumber}. lecke (Kvíz) teljesítve! +${xpReward} XP, +${reward} arany`, { duration: 3000 });
        }
      }
    } else {
      // Second round: Only reading for each page
      const nextPageIndex = currentBookLessonIndex + 1;
      console.log('📚 Second round, next page:', nextPageIndex);
      
      if (nextPageIndex >= penzugyiAlapismeretkLessons.length) {
        // Book completed!
        console.log('🏆 Book completed!');
        setCurrentBookLessonIndex(0);
        setCurrentGameType('reading');
        setIsFirstRound(true);
        toast.success(`✅ ${currentLessonNumber}. lecke (2. kör) teljesítve! +${xpReward} XP, +${reward} arany`, { duration: 3000 });
        toast.success('🏆 Gratulálok! Teljesítetted a könyvet!', { duration: 6000 });
      } else {
        // Move to next page - prepare for next lesson
        console.log('➡️ Second round - moving to next lesson:', nextPageIndex);
        setCurrentBookLessonIndex(nextPageIndex);
        toast.success(`✅ ${currentLessonNumber}. lecke (2. kör) teljesítve! +${xpReward} XP, +${reward} arany`, { duration: 3000 });
      }
    }
    
    // Handle post-lesson flow - ALWAYS return to main page after celebrations
    setIsManualLessonMode(false); // Reset manual mode flag
    setPendingReturnToLessons(false); // Always return to main page, not lessons page
    
    if (willLevelUp) {
      // If level up will occur, the celebration will be shown automatically by handleXpGain
      // Store streak celebration for after level up if needed
      if (isFirstToday) {
        setCelebratedStreakNumber(newStreak);
        // Streak celebration will be shown after level up celebration
      }
      // Level up celebration will take the player back to main page
    } else {
      // No level up - show streak celebration if needed, then return to main page
      if (isFirstToday) {
        setCelebratedStreakNumber(newStreak);
        setShowStreakCelebration(true);
        // Streak celebration will return to main page
      } else {
        // No celebrations at all - return to main page immediately
        console.log('🏠 No celebrations, returning to main page');
        setCurrentPage('main');
      }
    }
  };

  const handleLevelUpContinue = () => {
    setShowLevelUp(false);
    
    // Check if we need to show streak celebration after level up
    if (celebratedStreakNumber > 0) {
      setShowStreakCelebration(true);
      // Keep justLeveledUp flag for streak celebration handler
    } else {
      // After level up, check if we should return to lessons or main page
      setJustLeveledUp(false); // Reset flag
      if (pendingReturnToLessons) {
        setPendingReturnToLessons(false);
        setCurrentPage('lessons');
      } else {
        setCurrentPage('main');
      }
    }
  };

  const handleStreakCelebrationContinue = () => {
    console.log('🎊 Streak celebration continue! Flags:', {
      pendingReturnToLessons,
      isManualLessonMode,
      currentBookLessonIndex,
      currentGameType,
      isFirstRound
    });
    
    setShowStreakCelebration(false);
    setCelebratedStreakNumber(0);
    
    // Always reset flags
    setJustLeveledUp(false);
    
    // Check where we should return
    if (pendingReturnToLessons) {
      // Manual lesson was completed - return to lessons page
      console.log('↩️ Returning to lessons page (manual mode)');
      setPendingReturnToLessons(false);
      setCurrentPage('lessons');
    } else {
      // Normal progression - return to main page
      // Player can continue with "Továbbhaladás" button
      console.log('↩️ Returning to main page (normal progression)');
      setCurrentPage('main');
    }
  };

  const handleJumpToLesson = (lesson: number) => {
    // Calculate coins and progress based on lesson number
    if (lesson === 7) {
      // Jump to start (lesson 7) - RESET TO WELCOME STATE
      // NOTE: Max progress state is NOT deleted here - it will be preserved
      // and only updated when user surpasses their previous best
      const welcomeState = getWelcomeState();
      setCoins(welcomeState.coins);
      setGems(welcomeState.gems);
      setCurrentLesson(welcomeState.currentLesson);
      setProgressPosition(welcomeState.progressPosition);
      setPlayerLevel(welcomeState.playerLevel);
      setTotalXp(welcomeState.totalXp);
      setSelectedBookTitle(welcomeState.selectedBookTitle);
      setSubscriptionTier(welcomeState.subscriptionTier);
      setHasSeenWelcome(false); // Show welcome screen
      setCurrentStageInSection(welcomeState.currentStageInSection);
      setTotalStagesCompleted(welcomeState.totalStagesCompleted);
      
      // Reset lesson progress to start
      setCurrentBookLessonIndex(0);
      setCurrentGameType('reading');
      setIsFirstRound(true);
      
      // Reset streak
      resetStreak();
      setCurrentStreak(0);
      
      // Reset daily limits to free tier defaults
      localStorage.removeItem('daily_lessons');
      localStorage.removeItem('arena_daily_games');
      
      // Clear user profile
      localStorage.removeItem('user_profile');
      setPlayerName('');
      
      // Clear avatar
      localStorage.removeItem('player_avatar');
      window.dispatchEvent(new Event('storage'));
      
      // Clear library rentals
      localStorage.removeItem('rentedBooks');
      
      // Clear lesson progress
      localStorage.removeItem('lessonProgress');
      
      // Notify components about the reset
      window.dispatchEvent(new Event('arenaGameCompleted'));
      
      console.log('🔄 Reset to beginning - max progress preserved for later restore');
    } else if (lesson === 12) {
      // Restore lesson 12 state
      const lesson12StateStr = localStorage.getItem('lesson_12_state');
      if (lesson12StateStr) {
        try {
          const lesson12State = JSON.parse(lesson12StateStr);
          
          console.log('📚 Restoring Lesson 12 State:', lesson12State);
          
          // Restore game state
          setCoins(lesson12State.coins || 1700);
          setGems(lesson12State.gems || 0);
          setCurrentLesson(lesson12State.currentLesson || 7);
          setProgressPosition(lesson12State.progressPosition || 0);
          setPlayerLevel(lesson12State.playerLevel || 6);
          setTotalXp(lesson12State.totalXp || 1200);
          setSelectedBookTitle(lesson12State.selectedBookTitle || 'Pénzügyi Alapismeretek');
          setSubscriptionTier(lesson12State.subscriptionTier || 'free');
          setCurrentStageInSection(lesson12State.currentStageInSection || 1);
          setTotalStagesCompleted(lesson12State.totalStagesCompleted || 12);
          setCurrentBookLessonIndex(lesson12State.currentBookLessonIndex || 4);
          setCurrentGameType(lesson12State.currentGameType || 'reading');
          setIsFirstRound(lesson12State.isFirstRound ?? true);
          setHasSeenWelcome(true);
          
          // Restore streak
          if (lesson12State.currentStreak !== undefined) {
            setCurrentStreak(lesson12State.currentStreak);
          }
          if (lesson12State.longestStreak !== undefined) {
            setLongestStreak(lesson12State.longestStreak);
          }
          if (lesson12State.streakFreezes !== undefined) {
            setStreakFreezes(lesson12State.streakFreezes);
          }
          
          // Restore localStorage data
          if (lesson12State.lessonProgressJson) {
            localStorage.setItem('lessonProgress', lesson12State.lessonProgressJson);
          }
          if (lesson12State.rentedBooks) {
            localStorage.setItem('rentedBooks', lesson12State.rentedBooks);
          }
          if (lesson12State.userProfile) {
            localStorage.setItem('user_profile', lesson12State.userProfile);
            try {
              const profile = JSON.parse(lesson12State.userProfile);
              setPlayerName(profile.name || '');
            } catch (e) {
              console.error('Error parsing restored profile:', e);
            }
          }
          if (lesson12State.playerAvatar) {
            localStorage.setItem('player_avatar', lesson12State.playerAvatar);
          }
          if (lesson12State.dailyStreak) {
            localStorage.setItem('daily_streak', lesson12State.dailyStreak);
          }
          if (lesson12State.dailyLessons) {
            localStorage.setItem('daily_lessons', lesson12State.dailyLessons);
          }
          if (lesson12State.arenaDailyGames) {
            localStorage.setItem('arena_daily_games', lesson12State.arenaDailyGames);
          }
          
          // Notify components about the restore
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('lessonCompleted'));
          window.dispatchEvent(new Event('arenaGameCompleted'));
          
          console.log('✅ Restored Lesson 12 State successfully');
          toast.success('12. lecke állapot visszaállítva! 📚', { duration: 3000 });
        } catch (error) {
          console.error('Error restoring lesson 12 state:', error);
          toast.error('Nem sikerült visszaállítani a 12. lecke állapotát');
        }
      } else {
        console.log('⚠️ No lesson 12 state found');
        toast.info('Még nincs mentett 12. lecke állapot. Először mentsd el!');
      }
    } else if (lesson === 999) {
      // Restore max progress state
      const maxProgressStr = localStorage.getItem('max_progress_state');
      if (maxProgressStr) {
        try {
          const maxProgress = JSON.parse(maxProgressStr);
          
          // Restore game state
          setCoins(maxProgress.coins || 680);
          setGems(maxProgress.gems || 0);
          setCurrentLesson(maxProgress.currentLesson || 7);
          setProgressPosition(maxProgress.progressPosition || 0);
          setPlayerLevel(maxProgress.playerLevel || 0);
          setTotalXp(maxProgress.totalXp || 0);
          setSelectedBookTitle(maxProgress.selectedBookTitle || 'Tőkepiaci Szótár');
          setSubscriptionTier(maxProgress.subscriptionTier || 'free');
          setCurrentStageInSection(maxProgress.currentStageInSection || 1);
          setTotalStagesCompleted(maxProgress.totalStagesCompleted || 0);
          setCurrentBookLessonIndex(maxProgress.currentBookLessonIndex || 0);
          setCurrentGameType(maxProgress.currentGameType || 'reading');
          setIsFirstRound(maxProgress.isFirstRound ?? true);
          
          // Restore localStorage data
          if (maxProgress.lessonProgress) {
            localStorage.setItem('lessonProgress', maxProgress.lessonProgress);
          }
          if (maxProgress.rentedBooks) {
            localStorage.setItem('rentedBooks', maxProgress.rentedBooks);
          }
          if (maxProgress.userProfile) {
            localStorage.setItem('user_profile', maxProgress.userProfile);
            // Update player name from restored profile
            try {
              const profile = JSON.parse(maxProgress.userProfile);
              setPlayerName(profile.name || '');
            } catch (e) {
              console.error('Error parsing restored profile:', e);
            }
          }
          if (maxProgress.playerAvatar) {
            localStorage.setItem('player_avatar', maxProgress.playerAvatar);
          }
          if (maxProgress.dailyStreak) {
            localStorage.setItem('daily_streak', maxProgress.dailyStreak);
          }
          // Restore current streak from saved state
          if (maxProgress.currentStreak !== undefined) {
            setCurrentStreak(maxProgress.currentStreak);
          } else {
            // Fallback: calculate from localStorage
            const streak = getCurrentStreak();
            setCurrentStreak(streak);
          }
          if (maxProgress.dailyLessons) {
            localStorage.setItem('daily_lessons', maxProgress.dailyLessons);
          }
          if (maxProgress.arenaDailyGames) {
            localStorage.setItem('arena_daily_games', maxProgress.arenaDailyGames);
          }
          
          // Notify components about the restore
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('lessonCompleted'));
          window.dispatchEvent(new Event('arenaGameCompleted'));
          
          console.log('🔄 Restored max progress state:', maxProgress);
          toast.success('Visszaállítva a legjobb állapotodra! 🎉', { duration: 3000 });
        } catch (error) {
          console.error('Error restoring max progress:', error);
          toast.error('Nem sikerült visszaállítani az állapotot');
        }
      } else {
        console.log('⚠️ No max progress state found');
        toast.info('Még nincs mentett haladás');
      }
    }
    // Always return to main page
    setCurrentPage('main');
  };

  const handleWelcomeComplete = () => {
    setHasSeenWelcome(true);
  };

  // Shop and Streak Functions
  const handleStreakClick = () => {
    setCurrentPage('streak');
  };

  const handleShopClick = () => {
    setCurrentPage('shop');
  };

  const handlePurchaseStreakFreeze = () => {
    const config = getGameConfig();
    if (coins >= config.streakFreezeGoldCost) {
      setCoins(coins - config.streakFreezeGoldCost);
      const newTotal = addStreakFreeze(1);
      setStreakFreezes(newTotal);
      toast.success('Széria pont vásárlása sikeres! 🔥');
    } else {
      toast.error('Nincs elég aranyad!');
    }
  };

  const handlePurchaseGoldWithMoney = (amount: number, price: number) => {
    // In production, this would integrate with payment gateway
    // For now, we simulate the purchase
    setCoins(coins + amount);
    toast.success(`${amount} arany vásárlása sikeres! 🪙`);
  };

  const handlePurchaseDiamondsWithGold = (amount: number, cost: number) => {
    if (coins >= cost) {
      setCoins(coins - cost);
      setGems(gems + amount);
      toast.success(`${amount} gyémánt vásárlása sikeres! 💎`);
    } else {
      toast.error('Nincs elég aranyad!');
    }
  };

  // ===== STYLES =====
  const styles = {
    container: {
      position: 'relative' as const,
      width: '100%',
      minHeight: '100vh',
      backgroundColor: COLORS.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING.xl
    },
    managerOverlay: {
      position: 'fixed' as const,
      inset: 0,
      zIndex: 10000,
      width: '100%',
      height: '100%',
      backgroundColor: COLORS.white
    },
    managerInner: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #e2e8f0, #f1f5f9, #e2e8f0)',
      padding: SPACING.xl
    },
    screenContent: {
      position: 'relative' as const,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(to bottom, #0f172a, rgba(88, 28, 135, 0.4), #0f172a)',
      overflow: 'hidden'
    },
    backgroundContainer: {
      position: 'absolute' as const,
      inset: 0
    },
    backgroundGradient: {
      position: 'absolute' as const,
      inset: 0,
      opacity: 0.3
    },
    // Crystal decorations
    crystalBottomLeft: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      width: 128,
      height: 160,
      background: 'linear-gradient(to bottom right, rgba(147, 51, 234, 0.4), transparent)',
      borderTopRightRadius: 9999
    },
    crystalBottomRight: {
      position: 'absolute' as const,
      bottom: 0,
      right: 0,
      width: 160,
      height: 128,
      background: 'linear-gradient(to bottom left, rgba(37, 99, 235, 0.3), transparent)',
      borderTopLeftRadius: 9999
    },
    crystalTopLeft: {
      position: 'absolute' as const,
      top: '33.333333%',
      left: '25%',
      width: 96,
      height: 128,
      background: 'linear-gradient(to bottom right, rgba(168, 85, 247, 0.2), transparent)',
      transform: 'rotate(-12deg)'
    },
    crystalTopRight: {
      position: 'absolute' as const,
      top: '50%',
      right: '33.333333%',
      width: 80,
      height: 112,
      background: 'linear-gradient(to bottom left, rgba(236, 72, 153, 0.2), transparent)',
      transform: 'rotate(12deg)'
    },
    crystalScatter1: {
      position: 'absolute' as const,
      bottom: 192,
      left: 32,
      width: 64,
      height: 80,
      background: 'linear-gradient(to top, rgba(147, 51, 234, 0.5), rgba(168, 85, 247, 0.3))',
      transform: 'rotate(12deg)',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    },
    crystalScatter2: {
      position: 'absolute' as const,
      bottom: 208,
      left: 80,
      width: 48,
      height: 64,
      background: 'linear-gradient(to top, rgba(37, 99, 235, 0.4), rgba(59, 130, 246, 0.2))',
      transform: 'rotate(-6deg)',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    },
    crystalScatter3: {
      position: 'absolute' as const,
      bottom: 192,
      right: 48,
      width: 80,
      height: 96,
      background: 'linear-gradient(to top, rgba(219, 39, 119, 0.4), rgba(236, 72, 153, 0.2))',
      transform: 'rotate(6deg)',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    },
    mainContentContainer: {
      position: 'relative' as const,
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      paddingTop: 48
    },
    spacer: {
      flex: 1
    }
  };

  return (
    <div style={styles.container}>
      {/* Manager Page - Completely separate full-screen view */}
      {/* NOTE: Manager page uses fixed positioning for fullscreen overlay */}
      {currentPage === 'manager' ? (
        <div style={styles.managerOverlay}>
          <div style={styles.managerInner}>
            <PhoneFrame showDynamicIsland={false}>
              <ManagerPage onBack={handleBackClick} />
            </PhoneFrame>
          </div>
        </div>
      ) : (
      <PhoneFrame showDynamicIsland={true}>
        {/* iPhone screen content */}
        {/* NOTE: Background gradient creates fantasy cave theme */}
        <div style={styles.screenContent}>
          {/* Background with fantasy cave theme */}
          <div style={styles.backgroundContainer}>
            <div 
              style={{
                ...styles.backgroundGradient,
                background: `
                  radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
                  linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(88, 28, 135, 0.4))
                `
              }}
            />
            
            {/* Crystal decorations */}
            {/* NOTE: These create the fantasy cave crystal aesthetic */}
            <div style={styles.crystalBottomLeft}></div>
            <div style={styles.crystalBottomRight}></div>
            <div style={styles.crystalTopLeft}></div>
            <div style={styles.crystalTopRight}></div>
            
            {/* Cave crystals scattered */}
            <div style={styles.crystalScatter1}></div>
            <div style={styles.crystalScatter2}></div>
            <div style={styles.crystalScatter3}></div>
          </div>

          {/* Welcome Screen */}
          {!hasSeenWelcome ? (
            <WelcomeScreen onGetStarted={handleWelcomeComplete} />
          ) : (
            <>
              {/* Main content */}
              {/* NOTE: Main content area contains all game screens */}
              <div style={styles.mainContentContainer}>
                {/* NAVIGATION NOTE: currentPage state controls which screen is shown */}
                {currentPage === 'main' ? (
                  <MainScreen
                    coins={coins}
                    gems={gems}
                    playerLevel={playerLevel}
                    totalXp={totalXp}
                    progressPosition={progressPosition}
                    currentLesson={currentLesson}
                    currentStageInSection={currentStageInSection}
                    playerName={playerName}
                    subscriptionTier={subscriptionTier}
                    currentStreak={currentStreak}
                    currentBookLessonIndex={currentBookLessonIndex}
                    currentGameType={currentGameType}
                    isFirstRound={isFirstRound}
                    onAvatarClick={handleAvatarClick}
                    onLessonsClick={handleLessonsClick}
                    onShopClick={handleShopClick}
                    onArenaClick={handleArenaClick}
                    onUniversityClick={handleUniversityClick}
                    onProfileClick={handleProfileClick}
                    onSubscriptionClick={handleSubscriptionClick}
                    onManagerClick={handleManagerClick}
                    onStreakClick={handleStreakClick}
                    onProgressClick={handleProgressClick}
                    onJumpToLesson={handleJumpToLesson}
                    getTotalXpForNextLevel={getTotalXpForLevel}
                  />
            ) : currentPage === 'lesson' ? (
              <>
                {/* Lesson page with header and bottom menu */}
                {/* NOTE: Shows lesson preview before starting the game */}
                {(() => {
                  // Calculate lesson number based on page index, game type, and round
                  const lessonNumber = isFirstRound 
                    ? (currentBookLessonIndex * 3) + (currentGameType === 'reading' ? 1 : currentGameType === 'matching' ? 2 : 3)
                    : penzugyiAlapismeretkLessons.length * 3 + currentBookLessonIndex + 1;
                  
                  return (
                    <LessonHeader 
                      onBack={handleBackClick} 
                      onStart={handleStartClick} 
                      lessonNumber={lessonNumber}
                      gameType={currentGameType}
                      isFirstRound={isFirstRound}
                    />
                  );
                })()}
                <div style={styles.spacer}></div>
                <CharacterLineup />
              </>
            ) : currentPage === 'university' ? (
              <UniversityPage 
                onBack={handleBackClick} 
                onOpenBookView={handleOpenBookView}
                coins={coins}
                onCoinsChange={setCoins}
              />
            ) : currentPage === 'bookview' ? (
              selectedBookTitle === 'Pénzügyi Alapismeretek' ? (
                <PenzugyiAlapismeretkBookView onBack={handleBackFromBookView} />
              ) : (
                <StandaloneBookView
                  title={selectedBookTitle}
                  subtitle="Átfogó szakmai referencia"
                  data={bookConfig.data}
                  onBack={handleBackFromBookView}
                  coverColor={bookConfig.coverColor}
                  accentColor={bookConfig.accentColor}
                />
              )
            ) : currentPage === 'arena' ? (
              <ArenaPage 
                onClose={handleBackClick} 
                coins={coins} 
                onCoinsChange={setCoins} 
                subscriptionTier={subscriptionTier}
                onLimitReached={handleArenaLimitReached}
                onXpGain={handleXpGain}
                onStageAdvance={advanceStage}
                onStreakUpdate={(newStreak, isFirstToday) => {
                  console.log('🎯 Arena streak callback received:', { newStreak, isFirstToday });
                  setCurrentStreak(newStreak);
                }}
              />
            ) : currentPage === 'profile' ? (
              <ProfilePage 
                onBack={handleBackClick} 
                playerLevel={playerLevel} 
                coins={coins}
                gems={gems}
                subscriptionTier={subscriptionTier}
              />
            ) : currentPage === 'subscription' ? (
              <SubscriptionPage 
                onBack={handleBackClick} 
                subscriptionTier={subscriptionTier}
                onSubscriptionChange={setSubscriptionTier}
              />
            ) : currentPage === 'dailylimit' ? (
              <DailyLimitPage 
                onBack={handleBackClick}
                onUpgrade={handleDailyLimitUpgrade}
                limitType={limitType}
                subscriptionTier={subscriptionTier}
              />
            ) : currentPage === 'avatar' ? (
              <AvatarSelectorPage 
                onBack={handleBackClick}
                subscriptionTier={subscriptionTier}
              />
            ) : currentPage === 'lessons' ? (
              <LessonsPage 
                onBack={handleBackClick}
                onStartLesson={handleStartLessonFromMap}
                currentBookLessonIndex={currentBookLessonIndex}
                currentGameType={currentGameType}
                isFirstRound={isFirstRound}
              />
            ) : currentPage === 'streak' ? (
              <StreakPage 
                onBack={handleBackClick}
                currentStreak={currentStreak}
                longestStreak={longestStreak}
                streakFreezes={streakFreezes}
                onPurchaseStreakFreeze={handlePurchaseStreakFreeze}
                gold={coins}
              />
            ) : currentPage === 'shop' ? (
              <ShopPage 
                onBack={handleBackClick}
                gold={coins}
                diamonds={gems}
                streakFreezes={streakFreezes}
                onPurchaseStreakFreeze={handlePurchaseStreakFreeze}
                onPurchaseGoldWithMoney={handlePurchaseGoldWithMoney}
                onPurchaseDiamondsWithGold={handlePurchaseDiamondsWithGold}
              />
            ) : currentPage === 'manager' ? (
              // Manager page is rendered outside PhoneFrame as overlay
              <></>
            ) : (
              <>
                {/* Game page with title and bottom menu */}
                {(() => {
                  const lessonData = penzugyiAlapismeretkLessons[currentBookLessonIndex];
                  
                  // Calculate actual lesson number (every game is a separate lesson)
                  const displayLessonNumber = isFirstRound 
                    ? (currentBookLessonIndex * 3) + (currentGameType === 'reading' ? 1 : currentGameType === 'matching' ? 2 : 3)
                    : penzugyiAlapismeretkLessons.length * 3 + currentBookLessonIndex + 1;
                  
                  const gameKey = `${currentBookLessonIndex}-${currentGameType}-${isFirstRound ? 'round1' : 'round2'}`;
                  
                  if (currentGameType === 'reading') {
                    return <ReadingGame 
                      key={gameKey}
                      onBackToHome={handleBackClick} 
                      onWin={handleWin} 
                      lessonNumber={displayLessonNumber}
                      lessonData={lessonData}
                    />;
                  } else if (currentGameType === 'matching') {
                    return <LessonGame 
                      key={gameKey}
                      onBackToHome={handleBackClick} 
                      onWin={handleWin} 
                      lessonNumber={displayLessonNumber}
                      lessonData={lessonData}
                    />;
                  } else {
                    return <QuizGame 
                      key={gameKey}
                      onBackToHome={handleBackClick} 
                      onWin={handleWin} 
                      lessonNumber={displayLessonNumber}
                      lessonData={lessonData}
                    />;
                  }
                })()}
                {/* Show bottom menu only for matching and quiz games */}
                {currentGameType !== 'reading' && <CharacterLineup />}
              </>
            )}

            {/* Level Up Celebration */}
            {showLevelUp && (
              <LevelUpCelebration newLevel={playerLevel} onContinue={handleLevelUpContinue} />
            )}

            {/* Streak Celebration */}
            {showStreakCelebration && (
              <StreakCelebration newStreak={celebratedStreakNumber} onContinue={handleStreakCelebrationContinue} />
            )}
          </div>
            </>
          )}
        </div>
      </PhoneFrame>
      )}
      <Toaster position="top-center" />
    </div>
  );
}