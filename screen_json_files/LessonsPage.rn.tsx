/**
 * LessonsPage - REACT NATIVE VERSION
 * 
 * Lecke választó képernyő - Duolingo stílusú térkép
 * - 2 nézet: Könyv lista ÉS lecke térkép
 * - Könyv választás → Lecke lista
 * - Haladás követés (completed, current, available)
 * - Progress bar könyvenként
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, BookOpen, CheckCircle2, Circle } from 'lucide-react-native';

// NAVIGATION: React Navigation használata
// import { useNavigation, useRoute } from '@react-navigation/native';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  slate900: '#0F172A',
  purple800: '#581C87',
  purple300: '#D8B4FE',
  purple200: '#E9D5FF',
  purple400: '#C084FC',
  purple500: '#A855F7',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
  green400: '#4ADE80',
  green500: '#22C55E',
  blue400: '#60A5FA',
  blue500: '#3B82F6',
  amber400: '#FBBF24',
  amber500: '#EAB308',
};

const SPACING = {
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
  fontXS: 10,
  fontSM: 12,
  fontBase: 14,
  fontLG: 18,
  fontXL: 20,
  font2XL: 24,
  font3XL: 30,
  radiusSM: 4,
  radiusMD: 8,
  radiusLG: 12,
  radiusXL: 16,
  radiusFull: 9999,
  iconSM: 16,
  iconMD: 20,
  iconLG: 24,
  iconXL: 32,
};

const TOTAL_LESSONS_PER_PAGE = 3; // reading, matching, quiz

// ============================================
// TYPES
// ============================================

interface LessonsPageProps {
  onBack: () => void;
  onStartLesson: (
    bookTitle: string,
    lessonIndex: number,
    gameType: 'reading' | 'matching' | 'quiz'
  ) => void;
  currentBookLessonIndex: number;
  currentGameType: 'reading' | 'matching' | 'quiz';
  isFirstRound: boolean;
}

interface RentedBook {
  title: string;
  rentedUntil: number;
  daysRented: number;
  color: string;
  textColor: string;
}

interface AvailableBook {
  title: string;
  color: string;
  textColor: string;
  isRented: boolean;
  rentedUntil?: number;
}

interface LessonProgress {
  [bookTitle: string]: {
    [lessonKey: string]: boolean; // "0-reading", "0-matching", "0-quiz"
  };
}

interface LessonData {
  id: string;
  pageNumber: number;
  reading: {
    title: string;
    content: string;
  };
  matching: {
    pairs: Array<{ term: string; definition: string }>;
  };
  quiz: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
    }>;
  };
}

// Mock lesson data (importáld a valódi adatot!)
// import { penzugyiAlapismeretkLessons } from '../data/penzugyiAlapismeretkLessons';
const mockLessons: LessonData[] = Array.from({ length: 6 }, (_, i) => ({
  id: `lesson-${i + 1}`,
  pageNumber: i + 1,
  reading: {
    title: `${i + 1}. fejezet: Példa cím`,
    content: 'Példa szöveg...',
  },
  matching: {
    pairs: [
      { term: 'Példa', definition: 'Definíció' },
    ],
  },
  quiz: {
    questions: [
      {
        question: 'Példa kérdés?',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
      },
    ],
  },
}));

// ============================================
// COMPONENT
// ============================================

export function LessonsPage({
  onBack,
  onStartLesson,
  currentBookLessonIndex,
  currentGameType,
  isFirstRound,
}: LessonsPageProps) {
  const [rentedBooks, setRentedBooks] = useState<RentedBook[]>([]);
  const [availableBooks, setAvailableBooks] = useState<AvailableBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({});

  // NAVIGATION FIX - React Native:
  // const navigation = useNavigation();
  // const route = useRoute();

  // ============================================
  // LOAD DATA
  // ============================================

  useEffect(() => {
    loadAvailableBooks();
    loadLessonProgress();

    // Listen for lesson completion events
    // In RN, use EventEmitter or custom event system
    // DeviceEventEmitter.addListener('lessonCompleted', handleRefresh);

    return () => {
      // DeviceEventEmitter.removeListener('lessonCompleted', handleRefresh);
    };
  }, []);

  const loadAvailableBooks = async () => {
    try {
      const saved = await AsyncStorage.getItem('rentedBooks');
      const allBooks: AvailableBook[] = [];

      if (saved) {
        const parsed: RentedBook[] = JSON.parse(saved);
        const active = parsed.filter((book) => book.rentedUntil > Date.now());
        setRentedBooks(active);

        active.forEach((book) => {
          allBooks.push({
            title: book.title,
            color: book.color,
            textColor: book.textColor,
            isRented: true,
            rentedUntil: book.rentedUntil,
          });
        });
      }

      // Check for books with progress
      const progressData = await AsyncStorage.getItem('lessonProgress');
      if (progressData) {
        const progress = JSON.parse(progressData);
        Object.keys(progress).forEach((bookTitle) => {
          const hasProgress = Object.keys(progress[bookTitle]).length > 0;
          const alreadyAdded = allBooks.some((b) => b.title === bookTitle);

          if (hasProgress && !alreadyAdded) {
            allBooks.push({
              title: bookTitle,
              color: '#D97706', // amber-600
              textColor: '#FFFFFF',
              isRented: false,
            });
          }
        });
      }

      setAvailableBooks(allBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const loadLessonProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem('lessonProgress');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('📚 LessonsPage: Loaded progress:', parsed);
        setLessonProgress(parsed);
      } else {
        console.log('📚 LessonsPage: No progress found');
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleRefresh = () => {
    loadAvailableBooks();
    loadLessonProgress();
  };

  // ============================================
  // LESSON STATUS HELPERS
  // ============================================

  const isLessonCompleted = (
    bookTitle: string,
    pageIndex: number,
    gameType: 'reading' | 'matching' | 'quiz'
  ): boolean => {
    const lessonKey = `${pageIndex}-${gameType}`;
    return lessonProgress[bookTitle]?.[lessonKey] || false;
  };

  const getLessonStatus = (
    bookTitle: string,
    pageIndex: number,
    gameType: 'reading' | 'matching' | 'quiz'
  ): 'completed' | 'current' | 'available' => {
    const isCompleted = isLessonCompleted(bookTitle, pageIndex, gameType);

    if (isCompleted) return 'completed';

    // Check if current lesson
    if (bookTitle === 'Pénzügyi Alapismeretek') {
      if (
        isFirstRound &&
        pageIndex === currentBookLessonIndex &&
        gameType === currentGameType
      ) {
        return 'current';
      }
    }

    return 'available';
  };

  const getLessonIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <CheckCircle2 size={SIZES.iconLG} color={COLORS.green400} fill={COLORS.green400} />
        );
      case 'current':
        return <Circle size={SIZES.iconLG} color={COLORS.amber400} fill={COLORS.amber400} />;
      default:
        return <Circle size={SIZES.iconLG} color={COLORS.blue400} />;
    }
  };

  const getLessonColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: 'rgba(34, 197, 94, 0.3)', border: COLORS.green400 };
      case 'current':
        return { bg: 'rgba(234, 179, 8, 0.3)', border: COLORS.amber400 };
      default:
        return { bg: 'rgba(59, 130, 246, 0.3)', border: COLORS.blue400 };
    }
  };

  const getGameTypeLabel = (gameType: 'reading' | 'matching' | 'quiz') => {
    switch (gameType) {
      case 'reading':
        return '📖 Olvasás';
      case 'matching':
        return '🔗 Párosítás';
      case 'quiz':
        return '❓ Kvíz';
    }
  };

  const getGameTypeDescription = (gameType: 'reading' | 'matching' | 'quiz') => {
    switch (gameType) {
      case 'reading':
        return 'Olvasd el a szöveget és válaszolj a kérdésekre';
      case 'matching':
        return 'Párosítsd össze a fogalmakat';
      case 'quiz':
        return 'Válaszolj a kérdésekre';
    }
  };

  // Convert Tailwind gradient classes to gradient colors for LinearGradient
  const getGradientColors = (tailwindClass: string): string[] => {
    const gradientMap: Record<string, string[]> = {
      'bg-gradient-to-r from-amber-700 to-amber-900': ['#B45309', '#78350F'],
      'bg-gradient-to-r from-slate-700 to-slate-900': ['#334155', '#0F172A'],
      'bg-gradient-to-r from-blue-700 to-blue-900': ['#1D4ED8', '#1E3A8A'],
      'bg-gradient-to-r from-green-700 to-green-900': ['#15803D', '#14532D'],
      'bg-gradient-to-r from-purple-700 to-purple-900': ['#7E22CE', '#581C87'],
      'bg-gradient-to-r from-red-700 to-red-900': ['#B91C1C', '#7F1D1D'],
      'bg-gradient-to-r from-indigo-700 to-indigo-900': ['#4338CA', '#312E81'],
      'bg-gradient-to-r from-teal-700 to-teal-900': ['#0F766E', '#134E4A'],
      'bg-gradient-to-r from-orange-700 to-orange-900': ['#C2410C', '#7C2D12'],
      'bg-gradient-to-r from-pink-700 to-pink-900': ['#BE185D', '#831843'],
      'bg-gradient-to-r from-cyan-700 to-cyan-900': ['#0E7490', '#164E63'],
      'bg-gradient-to-r from-emerald-700 to-emerald-900': ['#047857', '#064E3B'],
      'bg-gradient-to-r from-rose-700 to-rose-900': ['#BE123C', '#881337'],
      'bg-gradient-to-br from-amber-600 to-orange-700': ['#D97706', '#C2410C'],
    };
    
    return gradientMap[tailwindClass] || ['#7E22CE', '#581C87']; // purple fallback
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleBackPress = () => {
    // NAVIGATION: navigation.goBack() vagy navigation.navigate('Main')
    onBack();
  };

  const handleBookSelect = (bookTitle: string) => {
    setSelectedBook(bookTitle);
  };

  const handleBookBackPress = () => {
    setSelectedBook(null);
  };

  const handleLessonClick = (
    pageIndex: number,
    gameType: 'reading' | 'matching' | 'quiz'
  ) => {
    if (selectedBook) {
      console.log('🎯 Starting lesson:', {
        selectedBook,
        pageIndex,
        gameType,
        expectedKey: `${pageIndex}-${gameType}`,
      });

      // NAVIGATION: navigation.navigate('LessonGame', { bookTitle, pageIndex, gameType })
      onStartLesson(selectedBook, pageIndex, gameType);
    }
  };

  // ============================================
  // RENDER - BOOK SELECTION VIEW
  // ============================================

  if (!selectedBook) {
    return (
      <LinearGradient
        colors={[COLORS.slate900, COLORS.purple800, COLORS.slate900]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={SIZES.iconLG} color={COLORS.white} />
            <Text style={styles.backButtonText}>Vissza</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Leckék</Text>
          <Text style={styles.subtitle}>Válassz egy kölcsönzött könyvet!</Text>
        </View>

        {/* Books List */}
        <ScrollView
          style={styles.booksContainer}
          contentContainerStyle={styles.booksScrollContent}
        >
          {availableBooks.length === 0 ? (
            <View style={styles.emptyState}>
              <BookOpen size={64} color={COLORS.gray500} />
              <Text style={styles.emptyTitle}>Nincs elérhető könyved</Text>
              <Text style={styles.emptySubtitle}>
                Kölcsönözz könyveket az Egyetem → Könyvtár menüpontban!
              </Text>
            </View>
          ) : (
            <View style={styles.bookGrid}>
              {availableBooks.map((book, index) => {
                const daysLeft = book.rentedUntil
                  ? Math.ceil((book.rentedUntil - Date.now()) / (1000 * 60 * 60 * 24))
                  : 0;

                // Calculate progress
                const bookProgress = lessonProgress[book.title] || {};
                const completedLessons = Object.keys(bookProgress).filter(
                  (key) => bookProgress[key]
                ).length;
                const totalLessons =
                  book.title === 'Pénzügyi Alapismeretek'
                    ? mockLessons.length * TOTAL_LESSONS_PER_PAGE
                    : 0;
                const progressPercentage =
                  totalLessons > 0
                    ? Math.round((completedLessons / totalLessons) * 100)
                    : 0;

                const gradientColors = getGradientColors(book.color);

                return (
                  <LinearGradient
                    key={index}
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.bookCard}
                  >
                    <TouchableOpacity
                      style={styles.bookCardTouchable}
                      onPress={() => handleBookSelect(book.title)}
                      activeOpacity={0.8}
                    >
                    <View style={styles.bookCardTop}>
                      <View style={styles.bookCardTextContainer}>
                        <Text style={styles.bookTitle}>{book.title}</Text>
                        {book.isRented ? (
                          <Text style={styles.bookRentalInfo}>
                            Kölcsönözve még {daysLeft} napig
                          </Text>
                        ) : (
                          <Text style={styles.bookRentalInfo}>
                            📚 Előző haladásod elérhető
                          </Text>
                        )}
                      </View>
                      <BookOpen size={SIZES.iconXL} color="rgba(255, 255, 255, 0.8)" />
                    </View>

                    {/* Progress Bar */}
                    {totalLessons > 0 && (
                      <View style={styles.progressSection}>
                        <View style={styles.progressHeader}>
                          <Text style={styles.progressLabel}>Haladás</Text>
                          <Text style={styles.progressText}>
                            {completedLessons}/{totalLessons} lecke ({progressPercentage}%)
                          </Text>
                        </View>
                        <View style={styles.progressBarBg}>
                          <View
                            style={[
                              styles.progressBarFill,
                              { width: `${progressPercentage}%` },
                            ]}
                          />
                        </View>
                      </View>
                    )}

                    {!book.isRented && (
                      <View style={styles.warningBox}>
                        <Text style={styles.warningText}>
                          ⚠️ Könyv nincs kölcsönözve - csak megtekintés
                        </Text>
                      </View>
                    )}
                    </TouchableOpacity>
                  </LinearGradient>
                );
              })}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    );
  }

  // ============================================
  // RENDER - LESSON MAP VIEW
  // ============================================

  const bookLessons = mockLessons; // Replace with actual data
  const totalLessons = bookLessons.length * TOTAL_LESSONS_PER_PAGE;
  const completedLessons = Object.keys(lessonProgress[selectedBook] || {}).filter(
    (key) => lessonProgress[selectedBook][key]
  ).length;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <LinearGradient
      colors={[COLORS.slate900, COLORS.purple800, COLORS.slate900]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBookBackPress}>
          <ArrowLeft size={SIZES.iconLG} color={COLORS.white} />
          <Text style={styles.backButtonText}>Vissza a könyvekhez</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.lessonTitleSection}>
        <View style={styles.lessonTitleRow}>
          <Text style={styles.lessonTitle}>{selectedBook}</Text>
        </View>
        <Text style={styles.lessonSubtitle}>Válassz egy leckét és kezdj el tanulni!</Text>

        {/* Progress Summary */}
        <View style={styles.progressSummary}>
          <View style={styles.progressSummaryRow}>
            <View style={styles.progressSummaryItem}>
              <Text style={styles.progressSummaryLabel}>Teljesített leckék</Text>
              <Text style={styles.progressSummaryValue}>
                {completedLessons} / {totalLessons}
              </Text>
            </View>
            <View style={[styles.progressSummaryItem, { alignItems: 'flex-end' }]}>
              <Text style={styles.progressSummaryLabel}>1. kör haladás</Text>
              <Text style={styles.progressSummaryValue}>{progressPercentage}%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.lessonContent}
        contentContainerStyle={styles.lessonScrollContent}
      >
        {/* Info Boxes */}
        <View style={styles.infoBoxes}>
          <View style={[styles.infoBox, styles.infoBoxBlue]}>
            <Text style={[styles.infoTitle, { color: '#93C5FD' }]}>
              📚 Lecke rendszer
            </Text>
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: '700' }}>1. Kör:</Text> Minden oldalhoz 3 játék
              (Olvasás → Párosítás → Kvíz)
            </Text>
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: '700' }}>2. Kör:</Text> Minden oldalhoz 1 ismétlő
              olvasás
            </Text>
          </View>

          <View style={[styles.infoBox, styles.infoBoxGreen]}>
            <Text style={[styles.infoTitle, { color: '#86EFAC' }]}>
              ✅ TELJES KÖNYV ELÉRHETŐ!
            </Text>
            <Text style={styles.infoText}>
              Mind a <Text style={{ fontWeight: '700' }}>60 oldal</Text> feldolgozva (
              {bookLessons.length * 3} lecke az 1. körben + {bookLessons.length} lecke a 2.
              körben)
            </Text>
            <Text style={styles.infoTextSmall}>
              <Text style={{ fontWeight: '700' }}>
                Összesen: {bookLessons.length * 4} lecke
              </Text>{' '}
              érhető el! 🎓
            </Text>
          </View>
        </View>

        {/* Lesson Map */}
        <View style={styles.lessonMap}>
          {bookLessons.map((lesson, pageIndex) => (
            <View key={lesson.id} style={styles.pageSection}>
              {/* Page Title */}
              <View style={styles.pageTitle}>
                <Text style={styles.pageTitleText}>
                  {lesson.pageNumber}. oldal: {lesson.reading.title}
                </Text>
              </View>

              {/* Lesson List */}
              <View style={styles.lessonList}>
                {(['reading', 'matching', 'quiz'] as const).map((gameType, gameIndex) => {
                  const status = getLessonStatus(selectedBook, pageIndex, gameType);
                  const lessonNumber = pageIndex * 3 + gameIndex + 1;
                  const colors = getLessonColor(status);

                  return (
                    <TouchableOpacity
                      key={`${pageIndex}-${gameType}`}
                      style={[
                        styles.lessonButton,
                        {
                          backgroundColor: colors.bg,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => handleLessonClick(pageIndex, gameType)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.lessonButtonInner}>
                        <View style={styles.lessonButtonLeft}>
                          {getLessonIcon(status)}
                          <View style={styles.lessonTextContainer}>
                            <View style={styles.lessonTitleRow2}>
                              <Text style={styles.lessonTitleText}>
                                {lessonNumber}. lecke: {getGameTypeLabel(gameType)}
                              </Text>
                              {status === 'completed' && (
                                <View style={styles.lessonCompletedBadge}>
                                  <Text style={styles.lessonCompletedText}>✓ Kész</Text>
                                </View>
                              )}
                            </View>
                            <Text style={styles.lessonDescription}>
                              {getGameTypeDescription(gameType)}
                            </Text>
                          </View>
                        </View>
                        {status === 'current' && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>Jelenlegi</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Connector */}
              {pageIndex < bookLessons.length - 1 && <View style={styles.connector} />}
            </View>
          ))}

          {/* Second Round Box */}
          <View style={styles.secondRoundBox}>
            <Text style={styles.secondRoundTitle}>🎉 2. Kör (Ismétlés)</Text>
            <Text style={styles.secondRoundText}>
              Az első kör teljesítése után az összes oldalt ismételheted olvasással!
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    position: 'relative',
    zIndex: 30,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.base,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
  },

  // Title Section
  titleSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.base,
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.font3XL,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.purple200,
    fontSize: SIZES.fontBase,
  },

  // Books Container
  booksContainer: {
    flex: 1,
  },
  booksScrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 96,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyTitle: {
    color: COLORS.gray400,
    fontSize: SIZES.fontLG,
    marginTop: SPACING.base,
  },
  emptySubtitle: {
    color: COLORS.gray500,
    fontSize: SIZES.fontSM,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },

  // Book Grid
  bookGrid: {
    gap: SPACING.base,
  },

  // Book Card (LinearGradient wrapper)
  bookCard: {
    borderRadius: SIZES.radiusXL,
    marginBottom: SPACING.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookCardTouchable: {
    padding: SPACING.lg,
  },
  bookCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  bookCardTextContainer: {
    flex: 1,
  },
  bookTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  bookRentalInfo: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: SIZES.fontSM,
  },

  // Progress Bar
  progressSection: {
    marginTop: SPACING.base,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: SIZES.fontXS,
  },
  progressText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
    fontWeight: '600',
  },
  progressBarBg: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.radiusFull,
    height: 8,
  },
  progressBarFill: {
    backgroundColor: COLORS.white,
    height: 8,
    borderRadius: SIZES.radiusFull,
  },

  // Warning Box
  warningBox: {
    marginTop: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.radiusSM,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  warningText: {
    fontSize: SIZES.fontXS,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },

  // Lesson Title Section
  lessonTitleSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.base,
  },
  lessonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  lessonTitle: {
    color: COLORS.white,
    fontSize: SIZES.font2XL,
    fontWeight: '700',
  },
  lessonSubtitle: {
    color: COLORS.purple200,
    fontSize: SIZES.fontSM,
  },

  // Progress Summary
  progressSummary: {
    marginTop: SPACING.md,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.5)',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.md,
  },
  progressSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressSummaryItem: {},
  progressSummaryLabel: {
    color: COLORS.purple200,
    fontSize: SIZES.fontXS,
    marginBottom: 4,
  },
  progressSummaryValue: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: '700',
  },

  // Lesson Content
  lessonContent: {
    flex: 1,
  },
  lessonScrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 96,
  },

  // Info Boxes
  infoBoxes: {
    marginBottom: SPACING.base,
    gap: SPACING.md,
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
  },
  infoBoxBlue: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(96, 165, 250, 0.5)',
  },
  infoBoxGreen: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(74, 222, 128, 0.5)',
  },
  infoTitle: {
    marginBottom: SPACING.sm,
    fontSize: SIZES.fontBase,
    fontWeight: '700',
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: SIZES.fontSM,
    marginBottom: SPACING.sm,
  },
  infoTextSmall: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: SIZES.fontXS,
  },

  // Lesson Map
  lessonMap: {
    gap: SPACING.base,
  },

  // Page Section
  pageSection: {
    position: 'relative',
  },
  pageTitle: {
    marginBottom: SPACING.base,
  },
  pageTitleText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: '700',
  },

  // Lesson List
  lessonList: {
    gap: SPACING.md,
    marginLeft: SPACING.base,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(168, 85, 247, 0.5)',
    paddingLeft: SPACING.lg,
  },

  // Lesson Button
  lessonButton: {
    borderWidth: 2,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  lessonButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  lessonTextContainer: {
    flex: 1,
  },
  lessonTitleRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  lessonTitleText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: '600',
  },
  lessonCompletedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radiusSM,
  },
  lessonCompletedText: {
    color: COLORS.green400,
    fontSize: SIZES.fontXS,
  },
  lessonDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: SIZES.fontXS,
    marginTop: 4,
  },
  currentBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusSM,
  },
  currentBadgeText: {
    color: COLORS.amber400,
    fontSize: SIZES.fontXS,
    fontWeight: '600',
  },

  // Connector
  connector: {
    height: 24,
    marginLeft: SPACING.base,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(168, 85, 247, 0.5)',
  },

  // Second Round Box
  secondRoundBox: {
    marginTop: SPACING.xxl,
    padding: SPACING.lg,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(192, 132, 252, 0.5)',
    borderRadius: SIZES.radiusXL,
  },
  secondRoundTitle: {
    color: COLORS.purple300,
    fontSize: SIZES.fontLG,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  secondRoundText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: SIZES.fontSM,
  },
});
