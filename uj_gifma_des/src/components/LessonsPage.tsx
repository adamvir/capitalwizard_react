import { ArrowLeft, BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { useState, useEffect, CSSProperties } from 'react';
import { motion } from 'motion/react';
import { penzugyiAlapismeretkLessons } from '../data/penzugyiAlapismeretkLessons';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface LessonsPageProps {
  onBack: () => void;
  onStartLesson: (bookTitle: string, lessonIndex: number, gameType: 'reading' | 'matching' | 'quiz') => void;
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
    [lessonKey: string]: boolean; // lessonKey: "0-reading", "0-matching", "0-quiz", etc.
  };
}

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  // Container
  container: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(to bottom, #0F172A, rgba(88, 28, 135, 0.4), #0F172A)',
  },

  // Header
  header: {
    position: 'relative',
    zIndex: 30,
    paddingLeft: SPACING.base,
    paddingRight: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.base,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    color: COLORS.white,
    transition: 'color 0.3s',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
  },

  // Title Section
  titleSection: {
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
    paddingBottom: SPACING.base,
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.font3XL,
    marginBottom: SPACING.sm,
    margin: 0,
  },
  subtitle: {
    color: '#E9D5FF',
  },

  // Books List
  booksContainer: {
    flex: 1,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
    paddingBottom: 96,
    overflowY: 'auto',
  },
  emptyState: {
    textAlign: 'center',
    paddingTop: 48,
    paddingBottom: 48,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    color: '#6B7280',
    margin: '0 auto',
    marginBottom: SPACING.base,
  },
  emptyTitle: {
    color: '#9CA3AF',
    fontSize: SIZES.fontLG,
  },
  emptySubtitle: {
    color: '#6B7280',
    fontSize: SIZES.fontSM,
    marginTop: SPACING.sm,
  },

  // Book Grid
  bookGrid: {
    display: 'grid',
    gap: SPACING.base,
  },

  // Book Card (uses Motion with inline styles)
  bookCardTop: {
    display: 'flex',
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
  },
  bookRentalInfo: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: SIZES.fontSM,
  },

  // Progress Bar
  progressSection: {},
  progressHeader: {
    display: 'flex',
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
  },
  progressBarFill: (percentage: number): CSSProperties => ({
    backgroundColor: COLORS.white,
    height: 8,
    borderRadius: SIZES.radiusFull,
    transition: 'width 0.5s',
    width: `${percentage}%`,
  }),

  // Warning Box
  warningBox: {
    marginTop: SPACING.md,
    fontSize: SIZES.fontXS,
    color: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.radiusSM,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    paddingTop: 4,
    paddingBottom: 4,
    textAlign: 'center',
  },

  // Lesson View
  lessonTitleSection: {
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
    paddingBottom: SPACING.base,
  },
  lessonTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  lessonTitle: {
    color: COLORS.white,
    fontSize: SIZES.font2XL,
    margin: 0,
  },
  debugButton: {
    color: '#D8B4FE',
    fontSize: SIZES.fontXS,
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
    paddingLeft: SPACING.md,
    paddingRight: SPACING.md,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: SIZES.radiusSM,
    transition: 'color 0.3s',
    cursor: 'pointer',
    border: 'none',
  },
  lessonSubtitle: {
    color: '#E9D5FF',
    fontSize: SIZES.fontSM,
  },

  // Progress Summary
  progressSummary: {
    marginTop: SPACING.md,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    border: '1px solid rgba(192, 132, 252, 0.5)',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.md,
  },
  progressSummaryRow: {
    display: 'flex',
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
  },

  // Lesson Content
  lessonContent: {
    flex: 1,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
    paddingBottom: 96,
    overflowY: 'auto',
  },

  // Info Boxes
  infoBoxes: {
    marginBottom: SPACING.base,
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.md,
  },
  infoBox: (bg: string, border: string): CSSProperties => ({
    backgroundColor: bg,
    border: `1px solid ${border}`,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
  }),
  infoTitle: (color: string): CSSProperties => ({
    color,
    marginBottom: SPACING.sm,
    fontSize: SIZES.fontBase,
    margin: 0,
  }),
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
    display: 'flex',
    flexDirection: 'column',
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
    margin: 0,
  },

  // Lesson List
  lessonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.md,
    marginLeft: SPACING.base,
    borderLeft: '2px solid rgba(168, 85, 247, 0.5)',
    paddingLeft: SPACING.lg,
  },

  // Lesson Button (uses Motion)
  lessonButtonInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonButtonLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
  },
  lessonTextContainer: {
    textAlign: 'left',
  },
  lessonTitleText: {
    color: COLORS.white,
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  lessonCompletedBadge: {
    color: '#4ADE80',
    fontSize: SIZES.fontXS,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: SIZES.radiusSM,
  },
  lessonDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: SIZES.fontXS,
    marginTop: 4,
  },
  currentBadge: {
    color: '#FBBF24',
    fontSize: SIZES.fontXS,
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: SIZES.radiusSM,
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },

  // Connector
  connector: {
    height: 24,
    marginLeft: SPACING.base,
    borderLeft: '2px solid rgba(168, 85, 247, 0.5)',
  },

  // Second Round Box
  secondRoundBox: {
    marginTop: 32,
    padding: SPACING.lg,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    border: '2px solid rgba(192, 132, 252, 0.5)',
    borderRadius: SIZES.radiusXL,
  },
  secondRoundTitle: {
    color: '#D8B4FE',
    fontSize: SIZES.fontLG,
    marginBottom: SPACING.sm,
    margin: 0,
  },
  secondRoundText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: SIZES.fontSM,
  },
};

export function LessonsPage({ 
  onBack, 
  onStartLesson, 
  currentBookLessonIndex, 
  currentGameType,
  isFirstRound 
}: LessonsPageProps) {
  const [rentedBooks, setRentedBooks] = useState<RentedBook[]>([]);
  const [availableBooks, setAvailableBooks] = useState<AvailableBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({});

  // Load rented books and books with progress
  useEffect(() => {
    const saved = localStorage.getItem('rentedBooks');
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
    const progressData = localStorage.getItem('lessonProgress');
    if (progressData) {
      const progress = JSON.parse(progressData);
      Object.keys(progress).forEach(bookTitle => {
        const hasProgress = Object.keys(progress[bookTitle]).length > 0;
        const alreadyAdded = allBooks.some(b => b.title === bookTitle);
        
        if (hasProgress && !alreadyAdded) {
          // Add book with progress but not currently rented
          allBooks.push({
            title: bookTitle,
            color: 'bg-gradient-to-br from-amber-600 to-orange-700',
            textColor: 'text-white',
            isRented: false
          });
        }
      });
    }
    
    setAvailableBooks(allBooks);
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

  // Load lesson progress from localStorage
  useEffect(() => {
    const loadProgress = () => {
      const saved = localStorage.getItem('lessonProgress');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('📚 LessonsPage: Loading progress from localStorage:', parsed);
        setLessonProgress(parsed);
      } else {
        console.log('📚 LessonsPage: No progress found in localStorage');
      }
    };
    
    loadProgress();
    
    // Listen for storage changes (when lessons are completed)
    const handleStorageChange = () => {
      loadProgress();
      // Also reload available books to update progress bars
      loadAvailableBooks();
    };
    
    const loadAvailableBooks = () => {
      const saved = localStorage.getItem('rentedBooks');
      const allBooks: AvailableBook[] = [];
      
      if (saved) {
        const parsed: RentedBook[] = JSON.parse(saved);
        const active = parsed.filter(book => book.rentedUntil > Date.now());
        
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
      
      const progressData = localStorage.getItem('lessonProgress');
      if (progressData) {
        const progress = JSON.parse(progressData);
        Object.keys(progress).forEach(bookTitle => {
          const hasProgress = Object.keys(progress[bookTitle]).length > 0;
          const alreadyAdded = allBooks.some(b => b.title === bookTitle);
          
          if (hasProgress && !alreadyAdded) {
            allBooks.push({
              title: bookTitle,
              color: 'bg-gradient-to-br from-amber-600 to-orange-700',
              textColor: 'text-white',
              isRented: false
            });
          }
        });
      }
      
      setAvailableBooks(allBooks);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('lessonCompleted', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('lessonCompleted', handleStorageChange);
    };
  }, []);

  // Check if a lesson is completed
  const isLessonCompleted = (bookTitle: string, pageIndex: number, gameType: 'reading' | 'matching' | 'quiz'): boolean => {
    const lessonKey = `${pageIndex}-${gameType}`;
    const isCompleted = lessonProgress[bookTitle]?.[lessonKey] || false;
    
    // Debug log - show ALL lesson checks for first 5 lessons
    const lessonNumber = pageIndex * 3 + (gameType === 'reading' ? 1 : gameType === 'matching' ? 2 : 3);
    if (lessonNumber <= 5) {
      console.log(`📝 Checking lesson ${lessonNumber} (${lessonKey}):`, {
        bookTitle,
        lessonKey,
        isCompleted,
        hasBookProgress: !!lessonProgress[bookTitle],
        allProgressKeys: lessonProgress[bookTitle] ? Object.keys(lessonProgress[bookTitle]) : 'NO BOOK DATA',
        allBookProgress: lessonProgress[bookTitle]
      });
    }
    
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
        return <CheckCircle2 style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: '#4ADE80' }} />;
      case 'current':
        return <Circle style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: '#FBBF24', fill: '#FBBF24' }} />;
      default:
        return <Circle style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: '#60A5FA' }} />;
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
      onStartLesson(selectedBook, pageIndex, gameType);
    }
  };

  if (!selectedBook) {
    // Book selection view
    return (
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button
            onClick={onBack}
            style={styles.backButton}
            onMouseEnter={(e) => e.currentTarget.style.color = '#D8B4FE'}
            onMouseLeave={(e) => e.currentTarget.style.color = COLORS.white}
          >
            <ArrowLeft style={{ width: SIZES.iconLG, height: SIZES.iconLG }} />
            <span>Vissza</span>
          </button>
        </div>

        {/* Title */}
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Leckék</h1>
          <p style={styles.subtitle}>Válassz egy kölcsönzött könyvet!</p>
        </div>

        {/* Books List */}
        <div style={styles.booksContainer}>
          {availableBooks.length === 0 ? (
            <div style={styles.emptyState}>
              <BookOpen style={styles.emptyIcon} />
              <p style={styles.emptyTitle}>Nincs elérhető könyved</p>
              <p style={styles.emptySubtitle}>Kölcsönözz könyveket az Egyetem → Könyvtár menüpontban!</p>
            </div>
          ) : (
            <div style={styles.bookGrid}>
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
                  <motion.button
                    key={index}
                    onClick={() => setSelectedBook(book.title)}
                    className={`${book.color} border-2 ${book.textColor} rounded-xl p-6 text-left transition-all hover:scale-105 active:scale-95 shadow-lg`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    <div style={styles.bookCardTop}>
                      <div style={styles.bookCardTextContainer}>
                        <h3 style={styles.bookTitle}>{book.title}</h3>
                        {book.isRented ? (
                          <p style={styles.bookRentalInfo}>
                            Kölcsönözve még {daysLeft} napig
                          </p>
                        ) : (
                          <p style={styles.bookRentalInfo}>
                            📚 Előző haladásod elérhető
                          </p>
                        )}
                      </div>
                      <BookOpen style={{ width: 32, height: 32, color: 'rgba(255, 255, 255, 0.8)' }} />
                    </div>
                    
                    {/* Progress Bar */}
                    {totalLessons > 0 && (
                      <div style={styles.progressSection}>
                        <div style={styles.progressHeader}>
                          <span style={styles.progressLabel}>Haladás</span>
                          <span style={styles.progressText}>
                            {completedLessons}/{totalLessons} lecke ({progressPercentage}%)
                          </span>
                        </div>
                        <div style={styles.progressBarBg}>
                          <div style={styles.progressBarFill(progressPercentage)} />
                        </div>
                      </div>
                    )}
                    
                    {!book.isRented && (
                      <div style={styles.warningBox}>
                        ⚠️ Könyv nincs kölcsönözve - csak megtekintés
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Lesson map view (Duolingo-style)
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => setSelectedBook(null)}
          style={styles.backButton}
          onMouseEnter={(e) => e.currentTarget.style.color = '#D8B4FE'}
          onMouseLeave={(e) => e.currentTarget.style.color = COLORS.white}
        >
          <ArrowLeft style={{ width: SIZES.iconLG, height: SIZES.iconLG }} />
          <span>Vissza a könyvekhez</span>
        </button>
      </div>

      {/* Title */}
      <div style={styles.lessonTitleSection}>
        <div style={styles.lessonTitleRow}>
          <h1 style={styles.lessonTitle}>{selectedBook}</h1>
          <button
            onClick={() => {
              const saved = localStorage.getItem('lessonProgress');
              console.log('🔍 RAW localStorage lessonProgress:', saved);
              if (saved) {
                const parsed = JSON.parse(saved);
                console.log('📚 Parsed progress:', parsed);
                console.log(`📖 Progress for "${selectedBook}":`, parsed[selectedBook]);
                if (parsed[selectedBook]) {
                  console.log('✅ Completed lessons:', Object.keys(parsed[selectedBook]).filter(k => parsed[selectedBook][k]));
                }
              }
            }}
            style={styles.debugButton}
            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.white}
            onMouseLeave={(e) => e.currentTarget.style.color = '#D8B4FE'}
          >
            🔍 Debug
          </button>
        </div>
        <p style={styles.lessonSubtitle}>Válassz egy leckét és kezdj el tanulni!</p>
        
        {/* Progress Summary */}
        <div style={styles.progressSummary}>
          <div style={styles.progressSummaryRow}>
            <div style={styles.progressSummaryItem}>
              <div style={styles.progressSummaryLabel}>Teljesített leckék</div>
              <div style={styles.progressSummaryValue}>
                {Object.keys(lessonProgress[selectedBook] || {}).filter(key => lessonProgress[selectedBook][key]).length} / {penzugyiAlapismeretkLessons.length * 3}
              </div>
            </div>
            <div style={{ ...styles.progressSummaryItem, textAlign: 'right' }}>
              <div style={styles.progressSummaryLabel}>1. kör haladás</div>
              <div style={styles.progressSummaryValue}>
                {Math.round((Object.keys(lessonProgress[selectedBook] || {}).filter(key => lessonProgress[selectedBook][key]).length / (penzugyiAlapismeretkLessons.length * 3)) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={styles.lessonContent}>
        {/* Lesson Info Box */}
        <div style={styles.infoBoxes}>
          <div style={styles.infoBox('rgba(59, 130, 246, 0.2)', 'rgba(96, 165, 250, 0.5)')}>
            <h3 style={styles.infoTitle('#93C5FD')}>📚 Lecke rendszer</h3>
            <p style={styles.infoText}>
              <strong>1. Kör:</strong> Minden oldalhoz 3 játék (Olvasás → Párosítás → Kvíz)
            </p>
            <p style={styles.infoText}>
              <strong>2. Kör:</strong> Minden oldalhoz 1 ismétlő olvasás
            </p>
          </div>
          
          <div style={styles.infoBox('rgba(34, 197, 94, 0.2)', 'rgba(74, 222, 128, 0.5)')}>
            <h3 style={styles.infoTitle('#86EFAC')}>✅ TELJES KÖNYV ELÉRHETŐ!</h3>
            <p style={styles.infoText}>
              Mind a <strong>60 oldal</strong> feldolgozva ({penzugyiAlapismeretkLessons.length * 3} lecke az 1. körben + {penzugyiAlapismeretkLessons.length} lecke a 2. körben)
            </p>
            <p style={styles.infoTextSmall}>
              <strong>Összesen: {penzugyiAlapismeretkLessons.length * 4} lecke</strong> érhető el! 🎓
            </p>
          </div>
        </div>

        {/* Lesson Map */}
        <div style={styles.lessonMap}>
          {penzugyiAlapismeretkLessons.map((lesson, pageIndex) => (
            <div key={lesson.id} style={styles.pageSection}>
              {/* Page Title */}
              <div style={styles.pageTitle}>
                <h3 style={styles.pageTitleText}>
                  {lesson.pageNumber}. oldal: {lesson.reading.title}
                </h3>
              </div>

              {/* First Round Lessons */}
              <div style={styles.lessonList}>
                {(['reading', 'matching', 'quiz'] as const).map((gameType, gameIndex) => {
                  const status = getLessonStatus(selectedBook, pageIndex, gameType);
                  const lessonNumber = pageIndex * 3 + gameIndex + 1;
                  const colors = getLessonColor(status);
                  
                  return (
                    <motion.button
                      key={`${pageIndex}-${gameType}`}
                      onClick={() => handleLessonClick(pageIndex, gameType)}
                      style={{ 
                        width: '100%',
                        backgroundColor: colors.bg,
                        border: `2px solid ${colors.border}`,
                        borderRadius: SIZES.radiusXL,
                        padding: SPACING.base,
                        transition: 'all 0.3s',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        cursor: 'pointer',
                      }}
                      whileHover={{ x: 8, backgroundColor: status === 'available' ? 'rgba(59, 130, 246, 0.4)' : colors.bg }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: gameIndex * 0.1 }}
                    >
                      <div style={styles.lessonButtonInner}>
                        <div style={styles.lessonButtonLeft}>
                          {getLessonIcon(status)}
                          <div style={styles.lessonTextContainer}>
                            <div style={styles.lessonTitleText}>
                              {lessonNumber}. lecke: {getGameTypeLabel(gameType)}
                              {status === 'completed' && (
                                <span style={styles.lessonCompletedBadge}>
                                  ✓ Kész
                                </span>
                              )}
                            </div>
                            <div style={styles.lessonDescription}>
                              {gameType === 'reading' && 'Olvasd el a szöveget és válaszolj a kérdésekre'}
                              {gameType === 'matching' && 'Párosítsd össze a fogalmakat'}
                              {gameType === 'quiz' && 'Válaszolj a kérdésekre'}
                            </div>
                          </div>
                        </div>
                        {status === 'current' && (
                          <div style={styles.currentBadge}>
                            Jelenlegi
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Connector line to next page */}
              {pageIndex < penzugyiAlapismeretkLessons.length - 1 && (
                <div style={styles.connector}></div>
              )}
            </div>
          ))}

          {/* Second Round Indicator */}
          <div style={styles.secondRoundBox}>
            <h3 style={styles.secondRoundTitle}>🎉 2. Kör (Ismétlés)</h3>
            <p style={styles.secondRoundText}>
              Az első kör teljesítése után az összes oldalt ismételheted olvasással!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
