// ============================================
// LESSON TYPES
// Types for lesson data structure
// ============================================

export interface ReadingQuestion {
  question: string;
  answer: string;
  keywords: string[];
}

export interface Reading {
  title: string;
  content: string;
  questions: ReadingQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reading: Reading;
  quiz: QuizQuestion[];
  matching: MatchingPair[];
  bookId?: string; // Optional: reference to parent book
}

export interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  coverImage?: string;
  lessons: Lesson[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  topics: string[];
}

// Game completion data
export interface LessonProgress {
  lessonId: string;
  bookId: string;
  completed: boolean;
  completedAt?: Date;
  score?: number;
  timeSpent?: number; // in seconds
  attempts: number;
}

// Game state
export type GameType = 'reading' | 'quiz' | 'matching';

export interface GameSession {
  lessonId: string;
  bookId: string;
  gameType: GameType;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  xpEarned: number;
  goldEarned: number;
}
