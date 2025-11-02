// ============================================
// NAVIGATION TYPES
// Type-safe navigation paramok
// ============================================

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  University: undefined;
  Library: undefined;
  Arena: { coins: number; subscriptionTier: 'free' | 'pro' | 'master'; onCoinsChange: (coins: number) => void };
  Profile: { playerLevel: number; coins: number; gems: number; subscriptionTier: 'free' | 'pro' | 'master' };
  Manager: undefined;
  Lessons: undefined;
  LessonHeader: {
    bookTitle?: string;
    lessonIndex?: number;
    gameType?: 'reading' | 'matching' | 'quiz';
    isFirstRound?: boolean;
  };
  LessonGame: {
    bookTitle?: string;
    lessonIndex?: number;
    gameType?: 'reading' | 'matching' | 'quiz';
    isFirstRound?: boolean;
    onLessonComplete?: () => void;
  };
  BookView: { bookTitle: string; content: string };
  Subscription: { subscriptionTier: 'free' | 'pro' | 'master'; onSubscriptionChange: (tier: 'free' | 'pro' | 'master') => void };
  Shop: { coins: number; gems: number; onCoinsChange: (coins: number) => void; onGemsChange: (gems: number) => void };
  Streak: { currentStreak: number; coins: number; onCoinsChange: (coins: number) => void };
  AvatarSelector: { subscriptionTier?: 'free' | 'pro' | 'master' };
  DailyLimit: undefined;
};
