import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInLeft, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { penzugyiAlapismeretkLessons } from '../data/penzugyiAlapismeretkLessons';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

// NAVIGATION: Navigáció típusa
type NavigationProp = NativeStackNavigationProp<any>;

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
    [lessonKey: string]: boolean; // lessonKey: "0-reading", "0-matching", "0-quiz", etc.
  };
}

interface LessonsScreenProps {
  route?: {
    params?: {
      currentBookLessonIndex?: number;
      currentGameType?: 'reading' | 'matching' | 'quiz';
      isFirstRound?: boolean;
    };
  };
}

export default function LessonsScreen({ route }: LessonsScreenProps) {
  const navigation = useNavigation<NavigationProp>();

  // Route params with defaults
  const currentBookLessonIndex = route?.params?.currentBookLessonIndex ?? 0;
  const currentGameType = route?.params?.currentGameType ?? 'reading';
  const isFirstRound = route?.params?.isFirstRound ?? true;

  const [rentedBooks, setRentedBooks] = useState<RentedBook[]>([]);
  const [availableBooks, setAvailableBooks] = useState<AvailableBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({});

  // Load rented books and books with progress
  useEffect(() => {
    loadAvailableBooks();
  }, []);

  // Debug selected book progress
  useEffect(() => {
    if (selectedBook) {
      console.log('🔍 Selected book changed:', {
        selectedBook,
        bookProgress: lessonProgress[selectedBook],
        allProgressKeys: lessonProgress[selectedBook] ? Object.keys(lessonProgress[selectedBook]) : 'NO DATA',
        completedKeys: lessonProgress[selectedBook] ? Object.keys(lessonProgress[selectedBook]).filter(k => lessonProgress[selectedBook][k]) : []
      });
    }
  }, [selectedBook, lessonProgress]);

  // Load lesson progress from AsyncStorage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const saved = await AsyncStorage.getItem('lessonProgress');
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log('📚 LessonsScreen: Loading progress from AsyncStorage:', parsed);
          setLessonProgress(parsed);
        } else {
          console.log('📚 LessonsScreen: No progress found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error loading lesson progress:', error);
      }
    };

    loadProgress();
  }, []);

  const loadAvailableBooks = async () => {
    try {
      const saved = await AsyncStorage.getItem('rentedBooks');
      const allBooks: AvailableBook[] = [];

      if (saved) {
        const parsed: RentedBook[] = JSON.parse(saved);
        const active = parsed.filter(book => book.rentedUntil > Date.now());
        setRentedBooks(active);

        // Add rented books
        active.forEach(book => {
          allBooks.push({
            title: book.title,
            color: book.color,
            textColor: book.textColor,
            isRented: true,
            rentedUntil: book.rentedUntil
          });
        });
      }

      // Check if there are books with progress that aren't currently rented
      const progressData = await AsyncStorage.getItem('lessonProgress');
      if (progressData) {
        const progress = JSON.parse(progressData);
        Object.keys(progress).forEach(bookTitle => {
          const hasProgress = Object.keys(progress[bookTitle]).length > 0;
          const alreadyAdded = allBooks.some(b => b.title === bookTitle);

          if (hasProgress && !alreadyAdded) {
            // Add book with progress but not currently rented
            allBooks.push({
              title: bookTitle,
              color: '#D97706', // amber-600
              textColor: '#FFFFFF',
              isRented: false
            });
          }
        });
      }

      setAvailableBooks(allBooks);
    } catch (error) {
      console.error('Error loading available books:', error);
    }
  };

  // Check if a lesson is completed
  const isLessonCompleted = (bookTitle: string, pageIndex: number, gameType: 'reading' | 'matching' | 'quiz'): boolean => {
    const lessonKey = `${pageIndex}-${gameType}`;
    const isCompleted = lessonProgress[bookTitle]?.[lessonKey] || false;

    return isCompleted;
  };

  // Get lesson status for styling
  const getLessonStatus = (bookTitle: string, pageIndex: number, gameType: 'reading' | 'matching' | 'quiz'): 'completed' | 'current' | 'locked' | 'available' => {
    const isCompleted = isLessonCompleted(bookTitle, pageIndex, gameType);

    if (isCompleted) return 'completed';

    // For Pénzügyi Alapismeretek, check if it's the current lesson
    if (bookTitle === 'Pénzügyi Alapismeretek') {
      if (isFirstRound && pageIndex === currentBookLessonIndex && gameType === currentGameType) {
        return 'current';
      }
    }

    // All lessons are available - no locking!
    return 'available';
  };

  const getLessonIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return { name: 'check-circle', color: '#4ADE80' };
      case 'current':
        return { name: 'circle', color: '#FBBF24' };
      default:
        return { name: 'circle-outline', color: '#60A5FA' };
    }
  };

  const getLessonColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: 'rgba(34, 197, 94, 0.3)', border: '#4ADE80' };
      case 'current':
        return { bg: 'rgba(234, 179, 8, 0.3)', border: '#FBBF24' };
      default:
        return { bg: 'rgba(59, 130, 246, 0.3)', border: '#60A5FA' };
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

  const handleLessonClick = (pageIndex: number, gameType: 'reading' | 'matching' | 'quiz') => {
    if (selectedBook) {
      console.log('🎯 Starting lesson:', {
        selectedBook,
        pageIndex,
        gameType,
        expectedKey: `${pageIndex}-${gameType}`
      });
      // NAVIGATION: Navigate to lesson game screen
      navigation.navigate('LessonGame', {
        bookTitle: selectedBook,
        lessonIndex: pageIndex,
        gameType: gameType,
      });
    }
  };

  if (!selectedBook) {
    // Book selection view
    return (
      <View style={styles.outerContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" translucent={false} />
        <LinearGradient
          colors={['#0F172A', '#581C87', '#0F172A']}
          style={styles.gradient}
        >
          {/* Top spacer for iPhone notch/camera */}
          <View style={styles.topSpacer} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
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
          contentContainerStyle={styles.booksContentContainer}
        >
          {availableBooks.length === 0 ? (
            <Animated.View entering={FadeIn} style={styles.emptyState}>
              <MaterialCommunityIcons name="book-open-variant" size={64} color="#6B7280" />
              <Text style={styles.emptyTitle}>Nincs elérhető könyved</Text>
              <Text style={styles.emptySubtitle}>Kölcsönözz könyveket az Egyetem → Könyvtár menüpontban!</Text>
            </Animated.View>
          ) : (
            <View style={styles.bookGrid}>
              {availableBooks.map((book, index) => {
                const daysLeft = book.rentedUntil
                  ? Math.ceil((book.rentedUntil - Date.now()) / (1000 * 60 * 60 * 24))
                  : 0;

                // Calculate progress for this book
                const bookProgress = lessonProgress[book.title] || {};
                const completedLessons = Object.keys(bookProgress).filter(key => bookProgress[key]).length;
                const totalLessons = book.title === 'Pénzügyi Alapismeretek'
                  ? penzugyiAlapismeretkLessons.length * 3
                  : 0;
                const progressPercentage = totalLessons > 0
                  ? Math.round((completedLessons / totalLessons) * 100)
                  : 0;

                return (
                  <Animated.View
                    key={index}
                    entering={FadeInUp.delay(index * 100)}
                  >
                    <TouchableOpacity
                      onPress={() => setSelectedBook(book.title)}
                      style={[
                        styles.bookCard,
                        { backgroundColor: book.color }
                      ]}
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
                        <MaterialCommunityIcons name="book-open-variant" size={32} color="rgba(255, 255, 255, 0.8)" />
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
                            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                          </View>
                        </View>
                      )}

                      {!book.isRented && (
                        <View style={styles.warningBox}>
                          <Text style={styles.warningText}>⚠️ Könyv nincs kölcsönözve - csak megtekintés</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          )}
        </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  // Lesson map view (Duolingo-style)
  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" translucent={false} />
      <LinearGradient
        colors={['#0F172A', '#581C87', '#0F172A']}
        style={styles.gradient}
      >
        {/* Top spacer for iPhone notch/camera */}
        <View style={styles.topSpacer} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setSelectedBook(null)}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
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
                {Object.keys(lessonProgress[selectedBook] || {}).filter(key => lessonProgress[selectedBook][key]).length} / {penzugyiAlapismeretkLessons.length * 3}
              </Text>
            </View>
            <View style={[styles.progressSummaryItem, { alignItems: 'flex-end' }]}>
              <Text style={styles.progressSummaryLabel}>1. kör haladás</Text>
              <Text style={styles.progressSummaryValue}>
                {Math.round((Object.keys(lessonProgress[selectedBook] || {}).filter(key => lessonProgress[selectedBook][key]).length / (penzugyiAlapismeretkLessons.length * 3)) * 100)}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.lessonContent}
        contentContainerStyle={styles.lessonContentContainer}
      >
        {/* Lesson Info Box */}
        <View style={styles.infoBoxes}>
          <View style={[styles.infoBox, { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(96, 165, 250, 0.5)' }]}>
            <Text style={[styles.infoTitle, { color: '#93C5FD' }]}>📚 Lecke rendszer</Text>
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: 'bold' }}>1. Kör:</Text> Minden oldalhoz 3 játék (Olvasás → Párosítás → Kvíz)
            </Text>
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: 'bold' }}>2. Kör:</Text> Minden oldalhoz 1 ismétlő olvasás
            </Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: 'rgba(34, 197, 94, 0.2)', borderColor: 'rgba(74, 222, 128, 0.5)' }]}>
            <Text style={[styles.infoTitle, { color: '#86EFAC' }]}>✅ TELJES KÖNYV ELÉRHETŐ!</Text>
            <Text style={styles.infoText}>
              Mind a <Text style={{ fontWeight: 'bold' }}>60 oldal</Text> feldolgozva ({penzugyiAlapismeretkLessons.length * 3} lecke az 1. körben + {penzugyiAlapismeretkLessons.length} lecke a 2. körben)
            </Text>
            <Text style={styles.infoTextSmall}>
              <Text style={{ fontWeight: 'bold' }}>Összesen: {penzugyiAlapismeretkLessons.length * 4} lecke</Text> érhető el! 🎓
            </Text>
          </View>
        </View>

        {/* Lesson Map */}
        <View style={styles.lessonMap}>
          {penzugyiAlapismeretkLessons.map((lesson, pageIndex) => (
            <View key={lesson.id} style={styles.pageSection}>
              {/* Page Title */}
              <View style={styles.pageTitle}>
                <Text style={styles.pageTitleText}>
                  {lesson.pageNumber}. oldal: {lesson.reading.title}
                </Text>
              </View>

              {/* First Round Lessons */}
              <View style={styles.lessonList}>
                {(['reading', 'matching', 'quiz'] as const).map((gameType, gameIndex) => {
                  const status = getLessonStatus(selectedBook, pageIndex, gameType);
                  const lessonNumber = pageIndex * 3 + gameIndex + 1;
                  const colors = getLessonColor(status);
                  const icon = getLessonIcon(status);

                  return (
                    <Animated.View
                      key={`${pageIndex}-${gameType}`}
                      entering={FadeInLeft.delay(gameIndex * 100)}
                    >
                      <TouchableOpacity
                        onPress={() => handleLessonClick(pageIndex, gameType)}
                        style={[
                          styles.lessonButton,
                          {
                            backgroundColor: colors.bg,
                            borderColor: colors.border,
                          }
                        ]}
                        activeOpacity={0.7}
                      >
                        <View style={styles.lessonButtonInner}>
                          <View style={styles.lessonButtonLeft}>
                            <MaterialCommunityIcons name={icon.name as any} size={24} color={icon.color} />
                            <View style={styles.lessonTextContainer}>
                              <View style={styles.lessonTitleText}>
                                <Text style={styles.lessonTitleTextContent}>
                                  {lessonNumber}. lecke: {getGameTypeLabel(gameType)}
                                </Text>
                                {status === 'completed' && (
                                  <View style={styles.lessonCompletedBadge}>
                                    <Text style={styles.lessonCompletedBadgeText}>✓ Kész</Text>
                                  </View>
                                )}
                              </View>
                              <Text style={styles.lessonDescription}>
                                {gameType === 'reading' && 'Olvasd el a szöveget és válaszolj a kérdésekre'}
                                {gameType === 'matching' && 'Párosítsd össze a fogalmakat'}
                                {gameType === 'quiz' && 'Válaszolj a kérdésekre'}
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
                    </Animated.View>
                  );
                })}
              </View>

              {/* Connector line to next page */}
              {pageIndex < penzugyiAlapismeretkLessons.length - 1 && (
                <View style={styles.connector} />
              )}
            </View>
          ))}

          {/* Second Round Indicator */}
          <View style={styles.secondRoundBox}>
            <Text style={styles.secondRoundTitle}>🎉 2. Kör (Ismétlés)</Text>
            <Text style={styles.secondRoundText}>
              Az első kör teljesítése után az összes oldalt ismételheted olvasással!
            </Text>
          </View>
        </View>
      </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  gradient: {
    flex: 1,
  },
  topSpacer: {
    height: 48,
    backgroundColor: 'transparent',
  },

  // Header
  header: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.base,
    zIndex: 30,
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
    marginBottom: SPACING.sm,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#E9D5FF',
    fontSize: SIZES.fontBase,
  },

  // Books List
  booksContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  booksContentContainer: {
    paddingBottom: 96,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    color: '#9CA3AF',
    fontSize: SIZES.fontLG,
    marginTop: SPACING.base,
  },
  emptySubtitle: {
    color: '#6B7280',
    fontSize: SIZES.fontSM,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },

  // Book Grid
  bookGrid: {
    gap: SPACING.base,
  },

  // Book Card
  bookCard: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    marginBottom: SPACING.base,
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
    marginBottom: SPACING.sm,
    fontWeight: 'bold',
  },
  bookRentalInfo: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: SIZES.fontSM,
  },

  // Progress Bar
  progressSection: {
    marginTop: SPACING.md,
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
  },
  progressBarBg: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.radiusFull,
    height: 8,
    overflow: 'hidden',
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
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    alignItems: 'center',
  },
  warningText: {
    fontSize: SIZES.fontXS,
    color: 'rgba(255, 255, 255, 0.5)',
  },

  // Lesson View
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
    fontWeight: 'bold',
  },
  lessonSubtitle: {
    color: '#E9D5FF',
    fontSize: SIZES.fontSM,
  },

  // Progress Summary
  progressSummary: {
    marginTop: SPACING.md,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderColor: 'rgba(192, 132, 252, 0.5)',
    borderWidth: 1,
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
    color: '#E9D5FF',
    fontSize: SIZES.fontXS,
    marginBottom: 4,
  },
  progressSummaryValue: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
  },

  // Lesson Content
  lessonContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  lessonContentContainer: {
    paddingBottom: 96,
  },

  // Info Boxes
  infoBoxes: {
    marginBottom: SPACING.base,
    gap: SPACING.md,
  },
  infoBox: {
    borderRadius: SIZES.radiusXL,
    borderWidth: 1,
    padding: SPACING.base,
  },
  infoTitle: {
    marginBottom: SPACING.sm,
    fontSize: SIZES.fontBase,
    fontWeight: 'bold',
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
  pageSection: {},
  pageTitle: {
    marginBottom: SPACING.base,
  },
  pageTitleText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: 'bold',
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
    borderRadius: SIZES.radiusXL,
    borderWidth: 2,
    padding: SPACING.base,
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
  lessonTitleText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  lessonTitleTextContent: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
  },
  lessonCompletedBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radiusSM,
  },
  lessonCompletedBadgeText: {
    color: '#4ADE80',
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
    paddingVertical: 4,
    borderRadius: SIZES.radiusSM,
  },
  currentBadgeText: {
    color: '#FBBF24',
    fontSize: SIZES.fontXS,
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
    marginTop: 32,
    padding: SPACING.lg,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(192, 132, 252, 0.5)',
    borderRadius: SIZES.radiusXL,
  },
  secondRoundTitle: {
    color: '#D8B4FE',
    fontSize: SIZES.fontLG,
    marginBottom: SPACING.sm,
    fontWeight: 'bold',
  },
  secondRoundText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: SIZES.fontSM,
  },
});
