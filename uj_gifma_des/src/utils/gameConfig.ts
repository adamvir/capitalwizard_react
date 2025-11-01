export interface GameConfig {
  // Starting gold after reset
  initialGold: number;
  
  // Library rental prices
  bookRental1Day: number;
  bookRental30Days: number;
  
  // Arena settings
  arenaMinBet: number;
  arenaMaxBet: number;
  
  // Daily limits
  freeDailyArenaGames: number;
  dailyLessonLimit: number;
  
  // Subscription prices (in HUF)
  subscriptionProPrice: number;
  subscriptionMasterPrice: number;
  
  // XP rewards per lesson by game type / difficulty
  xpPerLesson: number; // Default/fallback XP (kept for backwards compatibility)
  xpEasy: number;      // XP for Quiz (Easy)
  xpMedium: number;    // XP for Matching (Medium)
  xpHard: number;      // XP for Reading (Hard)
  
  // Gold rewards per lesson by game type / difficulty
  goldEasy: number;    // Gold for Quiz (Easy)
  goldMedium: number;  // Gold for Matching (Medium)
  goldHard: number;    // Gold for Reading (Hard)
  
  // Rewards for completed (repeated) lessons
  repeatedLessonXp: number; // XP for completing an already completed lesson
  repeatedLessonGold: number; // Gold for completing an already completed lesson
  
  // XP System
  maxLevel: number;
  baseXpPerLevel: number;
  xpGrowthPercentage: number; // percentage increase per level
  
  // Arena XP Settings
  xpPerArenaWin: number; // base XP for arena win
  maxBooksForArena: number; // maximum books that can be selected for arena
  
  // Matching Game (Párosító) Settings
  matchingPairsCount: number; // number of pairs to match
  matchingTimeLimit: number; // time limit in seconds
  
  // Quiz Game (Kvíz) Settings
  quizQuestionsCount: number; // number of quiz questions
  quizAnswersPerQuestion: number; // number of answers per question
  quizMinCorrectAnswers: number; // minimum correct answers to win
  
  // Reading Game (Olvasó) Settings
  readingQuestionsCount: number; // number of questions after reading
  readingMinCorrectAnswers: number; // minimum correct answers to win
  
  // Stage/Milestone System
  stagesPerMilestone: number; // number of stages before earning diamonds (default: 6)
  diamondsPerMilestone: number; // diamonds earned after completing a milestone
  
  // Shop - Streak Freeze (Széria Pont)
  streakFreezeGoldCost: number; // cost in gold to buy one streak freeze
  
  // Shop - Gold Purchase (Arany vásárlás forintért)
  gold100Price: number;    // 100 gold for X HUF
  gold500Price: number;    // 500 gold for X HUF
  gold1000Price: number;   // 1000 gold for X HUF
  gold5000Price: number;   // 5000 gold for X HUF
  
  // Shop - Diamond Purchase (Gyémánt vásárlás aranyért)
  diamond1GoldCost: number;    // cost in gold for 1 diamond
  diamond10GoldCost: number;   // cost in gold for 10 diamonds
  diamond50GoldCost: number;   // cost in gold for 50 diamonds
  diamond100GoldCost: number;  // cost in gold for 100 diamonds
}

export const DEFAULT_CONFIG: GameConfig = {
  initialGold: 1000,
  bookRental1Day: 50,
  bookRental30Days: 1000,
  arenaMinBet: 50,
  arenaMaxBet: 500,
  freeDailyArenaGames: 3,
  dailyLessonLimit: 10,
  subscriptionProPrice: 4990,
  subscriptionMasterPrice: 9990,
  xpPerLesson: 100,     // Default/fallback XP
  xpEasy: 50,           // Quiz (Easy) - 50 XP
  xpMedium: 100,        // Matching (Medium) - 100 XP
  xpHard: 150,          // Reading (Hard) - 150 XP
  goldEasy: 50,         // Quiz (Easy) - 50 Gold
  goldMedium: 100,      // Matching (Medium) - 100 Gold
  goldHard: 150,        // Reading (Hard) - 150 Gold
  repeatedLessonXp: 30,
  repeatedLessonGold: 20,
  maxLevel: 100,
  baseXpPerLevel: 1000,
  xpGrowthPercentage: 10,
  xpPerArenaWin: 50,
  maxBooksForArena: 5,
  matchingPairsCount: 15,
  matchingTimeLimit: 60,
  quizQuestionsCount: 10,
  quizAnswersPerQuestion: 4,
  quizMinCorrectAnswers: 8,
  readingQuestionsCount: 5,
  readingMinCorrectAnswers: 4,
  stagesPerMilestone: 6,
  diamondsPerMilestone: 5,
  
  // Shop - Streak Freeze
  streakFreezeGoldCost: 500,
  
  // Shop - Gold Purchase (in HUF)
  gold100Price: 490,
  gold500Price: 1990,
  gold1000Price: 3490,
  gold5000Price: 14990,
  
  // Shop - Diamond Purchase (in Gold)
  diamond1GoldCost: 100,
  diamond10GoldCost: 900,
  diamond50GoldCost: 4000,
  diamond100GoldCost: 7500,
};

const CONFIG_STORAGE_KEY = 'gameConfig';

export function getGameConfig(): GameConfig {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to ensure all fields exist
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (error) {
    console.error('Error loading game config:', error);
  }
  return DEFAULT_CONFIG;
}

export function saveGameConfig(config: GameConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving game config:', error);
  }
}

export function resetGameConfig(): void {
  try {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting game config:', error);
  }
}

// XP System Utilities
export function getXpRequiredForLevel(level: number): number {
  const config = getGameConfig();
  if (level <= 0) return 0;
  if (level === 1) return config.baseXpPerLevel;
  
  // Calculate XP required for a specific level using compound growth
  const growthMultiplier = 1 + (config.xpGrowthPercentage / 100);
  return Math.floor(config.baseXpPerLevel * Math.pow(growthMultiplier, level - 1));
}

export function getTotalXpForLevel(level: number): number {
  // Returns total XP needed to reach this level from level 0
  let totalXp = 0;
  for (let i = 1; i <= level; i++) {
    totalXp += getXpRequiredForLevel(i);
  }
  return totalXp;
}

export function getLevelFromXp(totalXp: number): { level: number; currentXp: number; xpForNextLevel: number } {
  const config = getGameConfig();
  let level = 0;
  let xpAccumulated = 0;
  
  while (level < config.maxLevel) {
    const xpNeeded = getXpRequiredForLevel(level + 1);
    if (xpAccumulated + xpNeeded > totalXp) {
      break;
    }
    xpAccumulated += xpNeeded;
    level++;
  }
  
  const currentXp = totalXp - xpAccumulated;
  const xpForNextLevel = level < config.maxLevel ? getXpRequiredForLevel(level + 1) : 0;
  
  return { level, currentXp, xpForNextLevel };
}
