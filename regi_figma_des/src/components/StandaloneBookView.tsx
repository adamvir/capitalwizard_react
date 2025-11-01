/**
 * Standalone Book View Component
 * 
 * Ez a komponens egy lapozható digitális könyv nézetet biztosít
 * bármilyen szótár vagy glossary típusú adathoz.
 * 
 * HASZNÁLAT:
 * 
 * 1. Importáld a komponenst:
 *    import { StandaloneBookView } from './components/StandaloneBookView';
 * 
 * 2. Használd a komponenst:
 *    <StandaloneBookView
 *      title="Szótár címe"
 *      subtitle="Alcím"
 *      data={yourGlossaryData}
 *      onBack={() => setShowBook(false)}
 *    />
 * 
 * 3. Az adat formátuma:
 *    [{
 *      id: string,
 *      term: string,
 *      definition: string,
 *      category: string
 *    }]
 * 
 * FÜGGŐSÉGEK:
 * - motion/react (Framer Motion)
 * - lucide-react
 * - ImageWithFallback komponens (vagy img tag)
 * - Button komponens (vagy natív button)
 */

import { useState, useEffect, CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, X, BookMarked, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

// === INTERFACES ===

export interface BookViewTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
}

export interface StandaloneBookViewProps {
  data: BookViewTerm[];
  title?: string;
  subtitle?: string;
  year?: number;
  onBack: () => void;
  coverColor?: string;
  accentColor?: string;
}

interface Page {
  type: 'cover' | 'intro' | 'toc' | 'letter-title' | 'content' | 'back';
  content?: any;
  letter?: string;
  terms?: BookViewTerm[];
  tocSection?: { letter: string; count: number }[];
}

// === UNSPLASH ILLUSTRATIONS (100% Free) ===

const illustrations = {
  stockMarket: "https://images.unsplash.com/photo-1651341050677-24dba59ce0fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9jayUyMG1hcmtldCUyMHRyYWRpbmd8ZW58MXx8fHwxNzYwOTQxNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  financialData: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBkYXRhJTIwY2hhcnRzfGVufDF8fHx8MTc2MDg3MDYyOXww&ixlib=rb-4.1.0&q=80&w=1080",
  businessAbstract: "https://images.unsplash.com/photo-1749631934602-13b05524e688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGZpbmFuY2UlMjBhYnN0cmFjdHxlbnwxfHx8fDE3NjA5ODAyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  booksVintage: "https://images.unsplash.com/photo-1687826188097-d06cb3673bec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3MlMjB2aW50YWdlfGVufDF8fHx8MTc2MDk0NTAzMnww&ixlib=rb-4.1.0&q=80&w=1080",
  geometric: "https://images.unsplash.com/photo-1729653809906-010c303eb11e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZ2VvbWV0cmljJTIwcGF0dGVybnxlbnwxfHx8fDE3NjA5MDcxNjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  goldCoins: "https://images.unsplash.com/photo-1653590501805-cce7dec267e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwY29pbnMlMjBtb25leXxlbnwxfHx8fDE3NjA5NDc5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  office: "https://images.unsplash.com/photo-1603985585179-3d71c35a537c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB3b3Jrc3BhY2UlMjBkZXNrfGVufDF8fHx8MTc2MDkyMDc3NXww&ixlib=rb-4.1.0&q=80&w=1080",
  techBlue: "https://images.unsplash.com/photo-1652212976547-16d7e2841b8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBibHVlfGVufDF8fHx8MTc2MDg4NDUzMXww&ixlib=rb-4.1.0&q=80&w=1080"
};

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  // Main Container
  container: {
    height: '100%',
    background: 'linear-gradient(to bottom right, #FFFBEB, #FFEDD5, #FEF3C7)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },

  // Control Bar
  controlBar: {
    flexShrink: 0,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid #FDE68A',
  },
  controlBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  closeButton: {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusFull,
    backgroundColor: '#FEF3C7',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
    border: 'none',
  },
  pageInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  pageInfoText: {
    fontSize: SIZES.fontSM,
    color: '#78350F',
  },
  exportButton: {
    fontSize: SIZES.fontXS,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.md,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: SIZES.radiusFull,
    color: '#78350F',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    cursor: 'pointer',
    border: 'none',
  },

  // Book Content Area
  bookContentArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: SPACING.md,
    paddingRight: SPACING.md,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
    overflow: 'hidden',
  },
  bookWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    maxHeight: 620,
  },

  // Navigation Buttons
  navButton: (disabled: boolean): CSSProperties => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 20,
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusFull,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    opacity: disabled ? 0.3 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s',
    border: 'none',
  }),
  navButtonLeft: {
    left: 0,
  },
  navButtonRight: {
    right: 0,
  },

  // Book Spine
  bookSpine: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    width: 24,
    background: 'linear-gradient(to right, #1E293B, #334155)',
    borderRadius: `${SIZES.radiusXL} 0 0 ${SIZES.radiusXL}`,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
    transform: 'perspective(800px) rotateY(5deg)',
    transformOrigin: 'right',
  },
  bookSpineOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.2), transparent)',
  },

  // Page Container
  pageContainer: {
    position: 'relative',
    height: '100%',
    marginLeft: 32,
    perspective: '1500px',
  },
  pageAnimationWrapper: {
    position: 'absolute',
    inset: 0,
    backgroundColor: COLORS.white,
    overflowY: 'auto',
    borderRadius: `0 ${SIZES.radiusXL} ${SIZES.radiusXL} 0`,
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    transformStyle: 'preserve-3d',
    backfaceVisibility: 'hidden',
  },

  // Cover Page
  coverPage: (gradientColors: string): CSSProperties => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(to bottom right, ${gradientColors})`,
    color: COLORS.white,
    padding: SPACING.lg,
    borderRadius: `0 ${SIZES.radiusXL} ${SIZES.radiusXL} 0`,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  }),
  coverContent: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.base,
  },
  coverBadge: (borderColor: string, textColor: string): CSSProperties => ({
    display: 'inline-block',
    paddingLeft: SPACING.base,
    paddingRight: SPACING.base,
    paddingTop: 6,
    paddingBottom: 6,
    border: `2px solid ${borderColor}`,
    borderRadius: SIZES.radiusFull,
    marginBottom: SPACING.md,
  }),
  coverBadgeText: (textColor: string): CSSProperties => ({
    color: textColor,
    letterSpacing: 1.5,
    fontSize: SIZES.fontXS,
  }),
  coverTitle1: {
    fontSize: SIZES.font3XL,
    letterSpacing: '-0.02em',
    margin: 0,
  },
  coverTitle2: {
    fontSize: SIZES.font4XL,
    letterSpacing: '-0.02em',
    marginBottom: SPACING.md,
    margin: 0,
  },
  coverDivider: {
    height: 2,
    width: 96,
    backgroundColor: '#FBBF24',
    margin: '0 auto',
    marginTop: SPACING.base,
    marginBottom: SPACING.base,
  },
  coverStats: {
    fontSize: SIZES.fontLG,
    color: '#CBD5E1',
    marginTop: SPACING.md,
  },
  coverSubtitle: {
    fontSize: SIZES.fontBase,
    color: '#94A3B8',
  },
  coverFooter: {
    marginTop: 32,
    paddingTop: SPACING.base,
    borderTop: '1px solid #475569',
  },
  coverFooterText: {
    color: '#94A3B8',
    fontSize: SIZES.fontSM,
  },

  // Intro Page
  introPage: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: `0 ${SIZES.radiusXL} ${SIZES.radiusXL} 0`,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    position: 'relative',
  },
  introImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '33%',
    height: '50%',
    opacity: 0.1,
  },
  introImageInner: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: `0 0 0 ${SIZES.radius3XL}`,
  },
  introContent: {
    position: 'relative',
    zIndex: 10,
  },
  introHeader: {
    borderLeft: '4px solid #0F172A',
    paddingLeft: SPACING.base,
    marginBottom: SPACING.base,
  },
  introTitle: {
    fontSize: SIZES.font2XL,
    marginBottom: SPACING.sm,
    margin: 0,
  },
  introSubtitle: {
    fontSize: SIZES.fontBase,
    color: '#475569',
  },
  introBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.md,
    color: '#334155',
  },
  introText: {
    fontSize: SIZES.fontSM,
    lineHeight: 1.6,
  },
  introStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: SPACING.md,
    marginTop: SPACING.base,
    paddingTop: SPACING.base,
    borderTop: '1px solid #E2E8F0',
  },
  introStatItem: {},
  introStatLabel: {
    fontSize: SIZES.fontXS,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#64748B',
    marginBottom: 4,
  },
  introStatValue: {
    fontSize: SIZES.fontXL,
  },
  introCategories: {
    marginTop: SPACING.base,
    padding: SPACING.md,
    backgroundColor: '#F8FAFC',
    borderRadius: SIZES.radiusLG,
    border: '1px solid #E2E8F0',
  },
  introCategoriesTitle: {
    fontSize: SIZES.fontXS,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#64748B',
    marginBottom: SPACING.sm,
  },
  introCategoriesList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 4,
    fontSize: SIZES.fontXS,
  },
  introFooter: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: SIZES.fontXS,
    marginTop: SPACING.base,
    position: 'relative',
    zIndex: 10,
  },

  // TOC Page
  tocPage: {
    height: '100%',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: `0 ${SIZES.radiusXL} ${SIZES.radiusXL} 0`,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    position: 'relative',
  },
  tocImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 128,
    height: 128,
    opacity: 0.05,
  },
  tocImageInner: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: `0 ${SIZES.radius3XL} 0 0`,
  },
  tocTitle: {
    fontSize: SIZES.font2XL,
    marginBottom: SPACING.base,
    paddingBottom: SPACING.md,
    borderBottom: '2px solid #0F172A',
    position: 'relative',
    zIndex: 10,
    margin: 0,
  },
  tocGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: SPACING.sm,
    marginTop: SPACING.base,
    position: 'relative',
    zIndex: 10,
  },
  tocButton: {
    padding: SPACING.sm,
    border: '2px solid #E2E8F0',
    borderRadius: SIZES.radiusLG,
    transition: 'all 0.3s',
    cursor: 'pointer',
    textAlign: 'left',
    backgroundColor: COLORS.white,
  },
  tocButtonLetter: {
    fontSize: SIZES.fontXL,
    marginBottom: 4,
  },
  tocButtonCount: {
    fontSize: SIZES.fontXS,
    color: '#475569',
  },

  // Letter Title Page
  letterTitlePage: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #F1F5F9, #FFFFFF)',
    borderRadius: `0 ${SIZES.radiusXL} ${SIZES.radiusXL} 0`,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    position: 'relative',
  },
  letterTitleImage: {
    position: 'absolute',
    inset: 0,
    opacity: 0.05,
  },
  letterTitleImageInner: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  letterTitleContent: {
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
  },
  letterTitleLetter: {
    fontSize: 128,
    color: '#0F172A',
    lineHeight: 1,
    marginBottom: SPACING.base,
  },
  letterTitleCount: {
    fontSize: SIZES.fontLG,
    color: '#475569',
  },

  // Content Page
  contentPage: {
    height: '100%',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: `0 ${SIZES.radiusXL} ${SIZES.radiusXL} 0`,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
  },
  contentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.xl,
  },
  contentItem: {
    borderLeft: '4px solid #E2E8F0',
    paddingLeft: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    transition: 'border-color 0.3s',
  },
  contentItemHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: SPACING.sm,
    marginBottom: 4,
  },
  contentItemTerm: {
    fontSize: SIZES.fontLG,
    color: '#0F172A',
  },
  contentItemCategory: {
    fontSize: SIZES.fontXS,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#64748B',
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: '#F1F5F9',
    borderRadius: SIZES.radiusSM,
  },
  contentItemDefinition: {
    color: '#334155',
    lineHeight: 1.6,
    fontSize: SIZES.fontSM,
  },

  // Back Page
  backPage: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'linear-gradient(to bottom right, #F8FAFC, #FFFFFF)',
    padding: SPACING.xl,
    borderRadius: `0 ${SIZES.radiusXL} ${SIZES.radiusXL} 0`,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
  },
  backContent: {
    maxWidth: 512,
  },
  backTitle: {
    fontSize: SIZES.font2XL,
    marginBottom: SPACING.base,
    margin: 0,
  },
  backText: {
    fontSize: SIZES.fontSM,
    color: '#334155',
    lineHeight: 1.6,
    marginBottom: SPACING.md,
  },
  backStats: {
    marginTop: 32,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: SPACING.base,
  },
  backStatItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  backStatValue: {
    fontSize: SIZES.font3XL,
  },
  backStatLabel: {
    fontSize: SIZES.fontXS,
    color: '#475569',
  },
  backFooter: {
    marginTop: 32,
    paddingTop: SPACING.base,
    borderTop: '1px solid #CBD5E1',
  },
  backFooterContent: {
    textAlign: 'center',
    color: '#475569',
    fontSize: SIZES.fontXS,
  },
  backFooterTitle: {
    marginBottom: 4,
  },
  backFooterDetails: {
    fontSize: SIZES.fontXS,
  },
};

// === MAIN COMPONENT ===

export function StandaloneBookView({
  data,
  title = "Tőkepiaci Szótár",
  subtitle = "Átfogó referencia",
  year = new Date().getFullYear(),
  onBack,
  coverColor = "from-slate-900 via-slate-800 to-slate-900",
  accentColor = "border-amber-400 text-amber-400"
}: StandaloneBookViewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Alfabetikus sorrend
  const sortedData = [...data].sort((a, b) => 
    a.term.localeCompare(b.term, 'hu')
  );

  // Betűk szerinti csoportosítás
  const groupedByLetter = sortedData.reduce((acc, term) => {
    const firstLetter = term.term[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(term);
    return acc;
  }, {} as Record<string, BookViewTerm[]>);

  const letters = Object.keys(groupedByLetter).sort();

  // Kategóriák gyűjtése
  const categories = Array.from(new Set(data.map(t => t.category)));

  // Oldalak generálása
  const generatePages = (): Page[] => {
    const pages: Page[] = [];
    
    pages.push({ type: 'cover' });
    pages.push({ type: 'intro' });
    
    const tocChunks: { letter: string; count: number }[][] = [];
    const tocData = letters.map(letter => ({ letter, count: groupedByLetter[letter].length }));
    
    for (let i = 0; i < tocData.length; i += 15) {
      tocChunks.push(tocData.slice(i, i + 15));
    }
    
    tocChunks.forEach(chunk => {
      pages.push({ type: 'toc', tocSection: chunk });
    });
    
    letters.forEach(letter => {
      const letterTerms = groupedByLetter[letter];
      pages.push({ type: 'letter-title', letter, content: letterTerms.length });
      
      for (let i = 0; i < letterTerms.length; i += 3) {
        pages.push({ 
          type: 'content', 
          letter,
          terms: letterTerms.slice(i, i + 3)
        });
      }
    });
    
    pages.push({ type: 'back' });
    
    return pages;
  };

  const pages = generatePages();

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setDirection('right');
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setDirection('left');
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 0 && pageNum < pages.length) {
      setDirection(pageNum > currentPage ? 'right' : 'left');
      setCurrentPage(pageNum);
    }
  };

  // Keyboard navigation
  // NAVIGATION NOTE: For React Native, use react-native's BackHandler or navigation listeners
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNextPage();
      if (e.key === 'ArrowLeft') goToPrevPage();
      if (e.key === 'Escape') onBack();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage]);

  const handleExportPDF = () => {
    // NAVIGATION NOTE: For React Native, use react-native-pdf or expo-print
    window.print();
  };

  const pageVariants = {
    enter: (direction: string) => ({
      x: direction === 'right' ? 1000 : -1000,
      opacity: 0,
      rotateY: direction === 'right' ? 45 : -45,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1
    },
    exit: (direction: string) => ({
      x: direction === 'right' ? -1000 : 1000,
      opacity: 0,
      rotateY: direction === 'right' ? -45 : 45,
      scale: 0.8
    })
  };

  const renderPage = (page: Page) => {
    // Parse cover and accent colors
    const coverGradient = coverColor.replace('from-', '').replace('via-', ', ').replace('to-', ', ');
    const accentBorderColor = '#FBBF24'; // amber-400
    const accentTextColor = '#FBBF24';

    switch (page.type) {
      case 'cover':
        return (
          <div style={styles.coverPage(coverGradient)}>
            <div style={styles.coverContent}>
              <div>
                <div style={styles.coverBadge(accentBorderColor, accentTextColor)}>
                  <span style={styles.coverBadgeText(accentTextColor)}>PROFESSZIONÁLIS REFERENCIA</span>
                </div>
                <h1 style={styles.coverTitle1}>
                  {title.split(' ')[0]}
                </h1>
                <h1 style={styles.coverTitle2}>
                  {title.split(' ').slice(1).join(' ')}
                </h1>
                <div style={styles.coverDivider}></div>
                <p style={styles.coverStats}>
                  {data.length} alapvető fogalom
                </p>
                <p style={styles.coverSubtitle}>
                  {subtitle}
                </p>
              </div>
              
              <div style={styles.coverFooter}>
                <p style={styles.coverFooterText}>
                  {year}. kiadás
                </p>
              </div>
            </div>
          </div>
        );

      case 'intro':
        return (
          <div style={styles.introPage}>
            <div style={styles.introImage}>
              <img
                src={illustrations.booksVintage}
                alt="Books"
                style={styles.introImageInner}
              />
            </div>
            
            <div style={styles.introContent}>
              <div style={styles.introHeader}>
                <h2 style={styles.introTitle}>{title}</h2>
                <p style={styles.introSubtitle}>
                  {subtitle}
                </p>
              </div>

              <div style={styles.introBody}>
                <p style={styles.introText}>
                  Ez a szótár {data.length} alapvető fogalmat tartalmaz, 
                  kategóriák szerint rendszerezve. Átfogó referencia a szakmai 
                  terminológiához.
                </p>
                
                <div style={styles.introStats}>
                  <div style={styles.introStatItem}>
                    <h3 style={styles.introStatLabel}>Tartalom</h3>
                    <p style={styles.introStatValue}>{data.length} fogalom</p>
                  </div>
                  <div style={styles.introStatItem}>
                    <h3 style={styles.introStatLabel}>Betűk</h3>
                    <p style={styles.introStatValue}>{letters.length}</p>
                  </div>
                </div>

                {categories.length > 0 && (
                  <div style={styles.introCategories}>
                    <h3 style={styles.introCategoriesTitle}>Kategóriák</h3>
                    <div style={styles.introCategoriesList}>
                      {categories.slice(0, 8).map((cat, idx) => (
                        <div key={idx}>• {cat}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.introFooter}>
              <p>© {year} • Minden jog fenntartva</p>
            </div>
          </div>
        );

      case 'toc':
        return (
          <div style={styles.tocPage}>
            <div style={styles.tocImage}>
              <img
                src={illustrations.financialData}
                alt="Financial"
                style={styles.tocImageInner}
              />
            </div>
            
            <h2 style={styles.tocTitle}>
              Tartalomjegyzék
            </h2>
            
            <div style={styles.tocGrid}>
              {page.tocSection?.map((item) => {
                const letterPageIndex = pages.findIndex(p => p.type === 'letter-title' && p.letter === item.letter);
                
                return (
                  <button
                    key={item.letter}
                    onClick={() => goToPage(letterPageIndex)}
                    style={styles.tocButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#0F172A';
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.backgroundColor = COLORS.white;
                    }}
                  >
                    <div style={styles.tocButtonLetter}>
                      {item.letter}
                    </div>
                    <div style={styles.tocButtonCount}>
                      {item.count} fogalom
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'letter-title':
        return (
          <div style={styles.letterTitlePage}>
            <div style={styles.letterTitleImage}>
              <img
                src={illustrations.geometric}
                alt="Pattern"
                style={styles.letterTitleImageInner}
              />
            </div>
            
            <div style={styles.letterTitleContent}>
              <div style={styles.letterTitleLetter}>
                {page.letter}
              </div>
              <div style={styles.letterTitleCount}>
                {page.content} fogalom
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <div style={styles.contentPage}>
            <div style={styles.contentList}>
              {page.terms?.map((term) => (
                <div 
                  key={term.id} 
                  style={styles.contentItem}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0F172A'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                >
                  <div style={styles.contentItemHeader}>
                    <h3 style={styles.contentItemTerm}>
                      {term.term}
                    </h3>
                    <span style={styles.contentItemCategory}>
                      {term.category}
                    </span>
                  </div>
                  <p style={styles.contentItemDefinition}>
                    {term.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'back':
        return (
          <div style={styles.backPage}>
            <div style={styles.backContent}>
              <h2 style={styles.backTitle}>
                Szakmai terminológia
              </h2>
              <p style={styles.backText}>
                Ez a szótár átfogó áttekintést nyújt a legfontosabb 
                szakmai fogalmakról. Mind a kezdők, mind a tapasztalt szakemberek 
                számára hasznos referenciaként szolgál.
              </p>
              <p style={styles.backText}>
                A {data.length} kifejezés {categories.length} különböző kategóriába sorolva 
                tartalmazza a legfontosabb terminológiát.
              </p>

              <div style={styles.backStats}>
                <div style={styles.backStatItem}>
                  <div style={styles.backStatValue}>{data.length}</div>
                  <div style={styles.backStatLabel}>Szakfogalom</div>
                </div>
                <div style={styles.backStatItem}>
                  <div style={styles.backStatValue}>{categories.length}</div>
                  <div style={styles.backStatLabel}>Kategória</div>
                </div>
                <div style={styles.backStatItem}>
                  <div style={styles.backStatValue}>100%</div>
                  <div style={styles.backStatLabel}>Magyar</div>
                </div>
              </div>
            </div>

            <div style={styles.backFooter}>
              <div style={styles.backFooterContent}>
                <p style={styles.backFooterTitle}>{title}</p>
                <p style={styles.backFooterDetails}>
                  {year}. kiadás • Magyar nyelven • {data.length} fogalom
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Vezérlő felület */}
      <div style={styles.controlBar}>
        <div style={styles.controlBarLeft}>
          <button 
            onClick={onBack} 
            style={styles.closeButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FDE68A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEF3C7'}
          >
            <X style={{ height: SIZES.iconSM, width: SIZES.iconSM, color: '#78350F' }} />
          </button>
          <div style={styles.pageInfo}>
            <BookMarked style={{ height: SIZES.iconSM, width: SIZES.iconSM, color: '#B45309' }} />
            <span style={styles.pageInfoText}>
              {currentPage + 1} / {pages.length}
            </span>
          </div>
        </div>

        <button 
          onClick={handleExportPDF} 
          style={styles.exportButton}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FDE68A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEF3C7'}
        >
          <Download style={{ height: 12, width: 12 }} />
          PDF
        </button>
      </div>

      {/* Könyv tartalom */}
      <div style={styles.bookContentArea}>
        <div style={styles.bookWrapper}>
          
          {/* Bal oldali lapozó */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            style={{ ...styles.navButton(currentPage === 0), ...styles.navButtonLeft }}
            onMouseEnter={(e) => {
              if (currentPage !== 0) e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft style={{ height: SIZES.iconBase, width: SIZES.iconBase, color: '#78350F' }} />
          </button>

          {/* Jobb oldali lapozó */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === pages.length - 1}
            style={{ ...styles.navButton(currentPage === pages.length - 1), ...styles.navButtonRight }}
            onMouseEnter={(e) => {
              if (currentPage !== pages.length - 1) e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight style={{ height: SIZES.iconBase, width: SIZES.iconBase, color: '#78350F' }} />
          </button>

          {/* Könyv gerinc - bal oldal */}
          <div style={styles.bookSpine}>
            <div style={styles.bookSpineOverlay}></div>
          </div>

          {/* Oldal animáció */}
          {/* NAVIGATION NOTE: AnimatePresence + motion work in React web */}
          {/* For React Native, use react-native-reanimated or Animated API */}
          <div style={styles.pageContainer}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentPage}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  rotateY: { duration: 0.5 },
                  scale: { duration: 0.3 }
                }}
                style={styles.pageAnimationWrapper}
              >
                {renderPage(pages[currentPage])}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default StandaloneBookView;
