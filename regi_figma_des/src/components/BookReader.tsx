import { useState, CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface BookReaderProps {
  title: string;
  content: string; // Full book content with chapters
  onBack: () => void;
}

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(8px)',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.base,
  },

  // Book Container
  bookContainer: {
    width: '100%',
    maxWidth: 896,
    height: '90vh',
    background: 'linear-gradient(to bottom right, #FFFBEB, #FEF3C7)',
    borderRadius: SIZES.radius2XL,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  // Header
  header: {
    background: 'linear-gradient(to right, #1E293B, #334155)',
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '4px solid #D97706',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerTitle: {
    fontSize: SIZES.fontXL,
    color: COLORS.white,
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.base,
  },
  pageCounter: {
    color: '#FCD34D',
    fontSize: SIZES.fontSM,
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
    border: 'none',
  },

  // Page Content
  pageContentContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  pageContent: {
    position: 'absolute',
    inset: 0,
    overflowY: 'auto',
    padding: 32,
  },
  pageContentInner: {
    maxWidth: 768,
    margin: '0 auto',
  },
  proseContainer: {
    fontFamily: 'Georgia, serif',
    lineHeight: 1.8,
    textAlign: 'justify',
  },

  // Chapter/Section styles
  chapterHeading: {
    fontSize: SIZES.font2XL,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: SPACING.lg,
    marginTop: 32,
    textAlign: 'center',
    borderBottom: '2px solid #D97706',
    paddingBottom: SPACING.sm,
    fontFamily: 'Georgia, serif',
  },
  sectionHeading: {
    fontSize: SIZES.fontXL,
    fontWeight: 600,
    color: '#334155',
    marginBottom: SPACING.base,
    marginTop: SPACING.lg,
    fontFamily: 'Georgia, serif',
  },
  paragraph: {
    color: '#1E293B',
    marginBottom: SPACING.base,
  },
  spacer: {
    height: SPACING.base,
  },
  pageNumber: {
    textAlign: 'center',
    marginTop: 48,
    color: '#64748B',
    fontSize: SIZES.fontSM,
  },

  // Navigation
  navigation: {
    background: 'linear-gradient(to right, #1E293B, #334155)',
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '4px solid #D97706',
  },
  navButton: (disabled: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: disabled ? '#475569' : '#D97706',
    color: COLORS.white,
    borderRadius: SIZES.radiusLG,
    transition: 'background-color 0.3s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
  }),
  navInfo: {
    color: '#FCD34D',
  },
};

export function BookReader({ title, content, onBack }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Split content into pages by chapters and sections
  const pages = content.split('\n\n\n').filter(p => p.trim());
  
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div style={styles.overlay}>
      {/* Book Container */}
      <div style={styles.bookContainer}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <BookOpen style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: '#FBBF24' }} />
            <h1 style={styles.headerTitle}>{title}</h1>
          </div>
          <div style={styles.headerRight}>
            <span style={styles.pageCounter}>
              {currentPage + 1} / {pages.length}
            </span>
            <button
              onClick={onBack}
              style={styles.closeButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(71, 85, 105, 0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(51, 65, 85, 0.6)'}
            >
              <X style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: COLORS.white }} />
            </button>
          </div>
        </div>

        {/* Page Content */}
        {/* NAVIGATION NOTE: AnimatePresence and motion animations work in React web */}
        {/* For React Native, use react-native-reanimated or Animated API */}
        <div style={styles.pageContentContainer}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              style={styles.pageContent}
            >
              {/* Page styling - book-like */}
              <div style={styles.pageContentInner}>
                <div style={styles.proseContainer}>
                  {/* Detect and render chapter titles */}
                  {pages[currentPage].split('\n').map((line, idx) => {
                    const trimmed = line.trim();
                    
                    // Chapter headers (ALL CAPS lines)
                    if (trimmed === trimmed.toUpperCase() && trimmed.length > 0 && trimmed.length < 50) {
                      return (
                        <h2 
                          key={idx} 
                          style={styles.chapterHeading}
                        >
                          {trimmed}
                        </h2>
                      );
                    }
                    
                    // Section titles (Title Case, shorter lines)
                    if (trimmed.length > 0 && trimmed.length < 100 && /^[A-ZÁÉÍÓÖŐÚÜŰ]/.test(trimmed) && !trimmed.endsWith('.')) {
                      return (
                        <h3 
                          key={idx} 
                          style={styles.sectionHeading}
                        >
                          {trimmed}
                        </h3>
                      );
                    }
                    
                    // Regular paragraphs
                    if (trimmed.length > 0) {
                      return (
                        <p key={idx} style={styles.paragraph}>
                          {line}
                        </p>
                      );
                    }
                    
                    return <div key={idx} style={styles.spacer} />;
                  })}
                </div>
              </div>

              {/* Page number at bottom */}
              <div style={styles.pageNumber}>
                — {currentPage + 1} —
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div style={styles.navigation}>
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            style={styles.navButton(currentPage === 0)}
            onMouseEnter={(e) => {
              if (currentPage !== 0) e.currentTarget.style.backgroundColor = '#B45309';
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 0) e.currentTarget.style.backgroundColor = '#D97706';
            }}
          >
            <ChevronLeft style={{ width: SIZES.iconBase, height: SIZES.iconBase }} />
            <span>Előző</span>
          </button>

          <div style={styles.navInfo}>
            {currentPage + 1} / {pages.length} oldal
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            style={styles.navButton(currentPage === pages.length - 1)}
            onMouseEnter={(e) => {
              if (currentPage !== pages.length - 1) e.currentTarget.style.backgroundColor = '#B45309';
            }}
            onMouseLeave={(e) => {
              if (currentPage !== pages.length - 1) e.currentTarget.style.backgroundColor = '#D97706';
            }}
          >
            <span>Következő</span>
            <ChevronRight style={{ width: SIZES.iconBase, height: SIZES.iconBase }} />
          </button>
        </div>
      </div>
    </div>
  );
}
