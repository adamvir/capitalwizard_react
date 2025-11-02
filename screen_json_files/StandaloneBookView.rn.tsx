/**
 * ============================================
 * STANDALONE BOOK VIEW - REACT NATIVE VERSION 1.0.0
 * ============================================
 * 
 * Általános digitális könyv viewer glossary/szótár típusú adatokhoz.
 * 
 * FUNKCIÓK:
 * ✅ Lapozható könyv formátum
 * ✅ Cover page (elegáns címlap)
 * ✅ Intro page (bevezető statisztikákkal)
 * ✅ TOC page (tartalomjegyzék betűk szerint)
 * ✅ Letter title pages (nagy betű oldal)
 * ✅ Content pages (kifejezések definíciókkal)
 * ✅ Back page (hátsó borító)
 * ✅ Prev/Next navigation
 * ✅ Page counter (X / Y)
 * ✅ Export JSON funkció
 * ✅ 3D book spine effect (könyv gerinc)
 * ✅ Customizable colors (coverColor, accentColor)
 * 
 * HASZNÁLAT:
 * cp exports/StandaloneBookView.rn.tsx src/components/StandaloneBookView.tsx
 * 
 * <StandaloneBookView
 *   data={glossaryData}
 *   title="Tőkepiaci"
 *   subtitle="Szótár"
 *   year={2025}
 *   onBack={() => navigation.goBack()}
 *   coverColor="#1E293B"
 *   accentColor="#FBBF24"
 * />
 * 
 * DATA FORMÁTUM:
 * [{
 *   id: string,
 *   term: string,
 *   definition: string,
 *   category: string
 * }]
 * 
 * FÜGGŐSÉGEK:
 * npm install lucide-react-native
 * npm install react-native-linear-gradient
 * npm install @react-native-async-storage/async-storage
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  Share,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ChevronLeft,
  ChevronRight,
  X,
  BookMarked,
  Download,
} from 'lucide-react-native';

// ============================================
// TYPES
// ============================================

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

// ============================================
// CONSTANTS
// ============================================

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

const SIZES = {
  fontXS: 12,
  fontSM: 14,
  fontBase: 16,
  fontLG: 18,
  fontXL: 20,
  font2XL: 24,
  font3XL: 30,
  font4XL: 36,
  iconBase: 20,
  iconLG: 24,
  radiusSM: 6,
  radiusLG: 12,
  radiusXL: 16,
  radiusFull: 9999,
};

const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748B',
  slate400: '#94A3B8',
  slate300: '#CBD5E1',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
  slate50: '#F8FAFC',
  amber50: '#FFFBEB',
  amber100: '#FEF3C7',
  amber200: '#FDE68A',
  amber400: '#FBBF24',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const groupTermsByLetter = (terms: BookViewTerm[]): { [key: string]: BookViewTerm[] } => {
  const grouped: { [key: string]: BookViewTerm[] } = {};
  
  terms.forEach(term => {
    const firstLetter = term.term.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(term);
  });
  
  return grouped;
};

const getUniqueCategories = (terms: BookViewTerm[]): string[] => {
  const categories = new Set<string>();
  terms.forEach(term => categories.add(term.category));
  return Array.from(categories).sort();
};

const generatePages = (
  data: BookViewTerm[],
  title: string,
  subtitle: string,
  year: number
): Page[] => {
  const pages: Page[] = [];
  
  // 1. Cover page
  pages.push({ type: 'cover', content: { title, subtitle, year } });
  
  // 2. Intro page
  const uniqueCategories = getUniqueCategories(data);
  pages.push({
    type: 'intro',
    content: {
      termCount: data.length,
      categoryCount: uniqueCategories.length,
      categories: uniqueCategories,
    },
  });
  
  // 3. TOC page
  const groupedByLetter = groupTermsByLetter(data);
  const letters = Object.keys(groupedByLetter).sort();
  const tocSections = letters.map(letter => ({
    letter,
    count: groupedByLetter[letter].length,
  }));
  pages.push({ type: 'toc', tocSection: tocSections });
  
  // 4. Letter title + content pages
  letters.forEach(letter => {
    // Letter title page
    pages.push({
      type: 'letter-title',
      letter,
      content: { count: groupedByLetter[letter].length },
    });
    
    // Content pages (3 terms per page)
    const termsForLetter = groupedByLetter[letter];
    for (let i = 0; i < termsForLetter.length; i += 3) {
      pages.push({
        type: 'content',
        terms: termsForLetter.slice(i, i + 3),
      });
    }
  });
  
  // 5. Back page
  pages.push({ type: 'back', content: { title, subtitle, year } });
  
  return pages;
};

// ============================================
// MAIN COMPONENT
// ============================================

const StandaloneBookView: React.FC<StandaloneBookViewProps> = ({
  data,
  title = 'Szótár',
  subtitle = 'Glosszárium',
  year = 2025,
  onBack,
  coverColor = '#1E293B',
  accentColor = '#FBBF24',
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    const generatedPages = generatePages(data, title, subtitle, year);
    setPages(generatedPages);
  }, [data, title, subtitle, year]);

  const nextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const jumpToLetter = (letterIndex: number) => {
    // Find the page index for the letter title
    const letterPageIndex = pages.findIndex(
      (p, idx) => idx > 2 && p.type === 'letter-title' && idx >= letterIndex + 3
    );
    if (letterPageIndex !== -1) {
      setCurrentPageIndex(letterPageIndex);
    }
  };

  const exportData = async () => {
    try {
      const json = JSON.stringify(data, null, 2);
      
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Share.share({
          message: json,
          title: `${title} ${subtitle} Export`,
        });
      } else {
        Alert.alert('✅ Export', 'Data exported!');
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to export data.');
    }
  };

  if (pages.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const currentPage = pages[currentPageIndex];

  // ============================================
  // RENDER PAGES
  // ============================================

  const renderCoverPage = () => {
    const { title: t, subtitle: s, year: y } = currentPage.content;
    
    return (
      <LinearGradient
        colors={[coverColor, '#334155']}
        style={styles.coverPage}
      >
        <View style={styles.coverContent}>
          <View style={[styles.coverBadge, { borderColor: accentColor }]}>
            <Text style={[styles.coverBadgeText, { color: accentColor }]}>
              SZÓTÁR / GLOSSARY
            </Text>
          </View>
          
          <Text style={styles.coverTitle1}>{t}</Text>
          <Text style={styles.coverTitle2}>{s}</Text>
          
          <View style={[styles.coverDivider, { backgroundColor: accentColor }]} />
          
          <Text style={styles.coverStats}>{data.length} kifejezés</Text>
          <Text style={styles.coverSubtitle}>Átfogó fogalomtár</Text>
        </View>
        
        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterText}>Budapest, {y}</Text>
        </View>
      </LinearGradient>
    );
  };

  const renderIntroPage = () => {
    const { termCount, categoryCount, categories } = currentPage.content;
    
    return (
      <View style={styles.introPage}>
        <View style={styles.introContent}>
          <View style={styles.introHeader}>
            <Text style={styles.introTitle}>Bevezetés</Text>
            <Text style={styles.introSubtitle}>Általános információk</Text>
          </View>
          
          <View style={styles.introBody}>
            <Text style={styles.introText}>
              Ez a szótár {termCount} szakmai kifejezést tartalmaz {categoryCount} különböző
              kategóriában. A tartalom betűrendben van rendszerezve a könnyebb
              kereshetőség érdekében.
            </Text>
            
            <Text style={styles.introText}>
              Minden kifejezés tartalmazza a definíciót és a kategória besorolást,
              segítve ezzel a szakmai terminológia elsajátítását.
            </Text>
          </View>
          
          <View style={styles.introStats}>
            <View style={styles.introStatItem}>
              <Text style={styles.introStatLabel}>KIFEJEZÉSEK</Text>
              <Text style={styles.introStatValue}>{termCount}</Text>
            </View>
            <View style={styles.introStatItem}>
              <Text style={styles.introStatLabel}>KATEGÓRIÁK</Text>
              <Text style={styles.introStatValue}>{categoryCount}</Text>
            </View>
          </View>
          
          <View style={styles.introCategories}>
            <Text style={styles.introCategoriesTitle}>KATEGÓRIÁK</Text>
            <View style={styles.introCategoriesList}>
              {categories.slice(0, 6).map((cat: string, idx: number) => (
                <Text key={idx} style={styles.introCategoryItem}>• {cat}</Text>
              ))}
            </View>
          </View>
        </View>
        
        <Text style={styles.introFooter}>
          Kérjük, használja felelősséggel ezt a szakmai anyagot.
        </Text>
      </View>
    );
  };

  const renderTOCPage = () => {
    const { tocSection } = currentPage;
    
    return (
      <View style={styles.tocPage}>
        <Text style={styles.tocTitle}>Tartalomjegyzék</Text>
        
        <ScrollView contentContainerStyle={styles.tocGrid}>
          {tocSection?.map((section, idx) => (
            <Pressable
              key={section.letter}
              onPress={() => jumpToLetter(idx)}
              style={styles.tocButton}
            >
              <Text style={styles.tocButtonLetter}>{section.letter}</Text>
              <Text style={styles.tocButtonCount}>{section.count} kifejezés</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderLetterTitlePage = () => {
    const { letter, content } = currentPage;
    
    return (
      <LinearGradient
        colors={['#F1F5F9', '#FFFFFF']}
        style={styles.letterTitlePage}
      >
        <View style={styles.letterTitleContent}>
          <Text style={styles.letterTitleLetter}>{letter}</Text>
          <Text style={styles.letterTitleCount}>{content.count} kifejezés</Text>
        </View>
      </LinearGradient>
    );
  };

  const renderContentPage = () => {
    const { terms } = currentPage;
    
    return (
      <ScrollView style={styles.contentPage} contentContainerStyle={styles.contentList}>
        {terms?.map((term) => (
          <View key={term.id} style={styles.contentItem}>
            <View style={styles.contentItemHeader}>
              <Text style={styles.contentItemTerm}>{term.term}</Text>
              <View style={styles.contentItemCategory}>
                <Text style={styles.contentItemCategoryText}>{term.category}</Text>
              </View>
            </View>
            <Text style={styles.contentItemDefinition}>{term.definition}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderBackPage = () => {
    const { title: t, subtitle: s, year: y } = currentPage.content;
    
    return (
      <LinearGradient
        colors={['#334155', coverColor]}
        style={styles.backPage}
      >
        <View style={styles.backContent}>
          <BookMarked size={64} color={accentColor} />
          
          <Text style={styles.backTitle}>{t} {s}</Text>
          
          <View style={[styles.backDivider, { backgroundColor: accentColor }]} />
          
          <Text style={styles.backSubtitle}>
            {data.length} szakmai kifejezés
          </Text>
          <Text style={styles.backSubtitle}>
            Köszönjük, hogy használta ezt a szótárat!
          </Text>
          
          <Text style={styles.backFooter}>© {y}</Text>
        </View>
      </LinearGradient>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <LinearGradient
      colors={[COLORS.amber50, COLORS.amber200, COLORS.amber100]}
      style={styles.container}
    >
      {/* Control Bar */}
      <View style={styles.controlBar}>
        <View style={styles.controlBarLeft}>
          <Pressable onPress={onBack} style={styles.closeButton}>
            <X size={SIZES.iconBase} color={COLORS.slate900} />
          </Pressable>
          <View style={styles.pageInfo}>
            <BookMarked size={SIZES.iconBase} color={COLORS.slate700} />
            <Text style={styles.pageInfoText}>
              {currentPageIndex + 1} / {pages.length}
            </Text>
          </View>
        </View>
        
        <Pressable onPress={exportData} style={styles.exportButton}>
          <Download size={14} color={COLORS.slate700} />
          <Text style={styles.exportButtonText}>Export</Text>
        </Pressable>
      </View>

      {/* Book Content Area */}
      <View style={styles.bookContentArea}>
        <View style={styles.bookWrapper}>
          {/* Navigation Buttons */}
          <Pressable
            onPress={prevPage}
            disabled={currentPageIndex === 0}
            style={[styles.navButton, styles.navButtonLeft, currentPageIndex === 0 && styles.navButtonDisabled]}
          >
            <ChevronLeft size={SIZES.iconLG} color={COLORS.slate900} />
          </Pressable>

          <Pressable
            onPress={nextPage}
            disabled={currentPageIndex === pages.length - 1}
            style={[
              styles.navButton,
              styles.navButtonRight,
              currentPageIndex === pages.length - 1 && styles.navButtonDisabled,
            ]}
          >
            <ChevronRight size={SIZES.iconLG} color={COLORS.slate900} />
          </Pressable>

          {/* Book Spine */}
          <LinearGradient
            colors={[COLORS.slate800, COLORS.slate700]}
            style={styles.bookSpine}
          >
            <View style={styles.bookSpineOverlay} />
          </LinearGradient>

          {/* Page Container */}
          <View style={styles.pageContainer}>
            <View style={styles.pageAnimationWrapper}>
              {currentPage.type === 'cover' && renderCoverPage()}
              {currentPage.type === 'intro' && renderIntroPage()}
              {currentPage.type === 'toc' && renderTOCPage()}
              {currentPage.type === 'letter-title' && renderLetterTitlePage()}
              {currentPage.type === 'content' && renderContentPage()}
              {currentPage.type === 'back' && renderBackPage()}
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: SIZES.fontLG,
    color: COLORS.slate600,
  },

  // Control Bar
  controlBar: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 50 : SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.amber200,
  },
  controlBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.amber100,
  },
  pageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  pageInfoText: {
    fontSize: SIZES.fontSM,
    color: '#78350F',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    fontSize: SIZES.fontXS,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    backgroundColor: COLORS.amber100,
    borderRadius: SIZES.radiusFull,
  },
  exportButtonText: {
    color: '#78350F',
    fontSize: SIZES.fontXS,
  },

  // Book Content Area
  bookContentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.base,
  },
  bookWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    maxHeight: 620,
  },

  // Navigation Buttons
  navButton: {
    position: 'absolute',
    top: '50%',
    zIndex: 20,
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusFull,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  navButtonLeft: {
    left: 0,
  },
  navButtonRight: {
    right: 0,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },

  // Book Spine
  bookSpine: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    width: 24,
    borderTopLeftRadius: SIZES.radiusXL,
    borderBottomLeftRadius: SIZES.radiusXL,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bookSpineOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  // Page Container
  pageContainer: {
    height: '100%',
    marginLeft: 32,
  },
  pageAnimationWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
    borderTopRightRadius: SIZES.radiusXL,
    borderBottomRightRadius: SIZES.radiusXL,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // Cover Page
  coverPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderTopRightRadius: SIZES.radiusXL,
    borderBottomRightRadius: SIZES.radiusXL,
  },
  coverContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.base,
  },
  coverBadge: {
    paddingHorizontal: SPACING.base,
    paddingVertical: 6,
    borderWidth: 2,
    borderRadius: SIZES.radiusFull,
    marginBottom: SPACING.md,
  },
  coverBadgeText: {
    letterSpacing: 1.5,
    fontSize: SIZES.fontXS,
  },
  coverTitle1: {
    fontSize: SIZES.font3XL,
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  coverTitle2: {
    fontSize: SIZES.font4XL,
    color: COLORS.white,
    letterSpacing: -0.5,
    marginBottom: SPACING.md,
  },
  coverDivider: {
    height: 2,
    width: 96,
    marginVertical: SPACING.base,
  },
  coverStats: {
    fontSize: SIZES.fontLG,
    color: COLORS.slate300,
    marginTop: SPACING.md,
  },
  coverSubtitle: {
    fontSize: SIZES.fontBase,
    color: COLORS.slate400,
  },
  coverFooter: {
    paddingTop: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate600,
  },
  coverFooterText: {
    color: COLORS.slate400,
    fontSize: SIZES.fontSM,
  },

  // Intro Page
  introPage: {
    flex: 1,
    justifyContent: 'space-between',
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  introContent: {
    flex: 1,
  },
  introHeader: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.slate900,
    paddingLeft: SPACING.base,
    marginBottom: SPACING.base,
  },
  introTitle: {
    fontSize: SIZES.font2XL,
    marginBottom: SPACING.sm,
    color: COLORS.slate900,
  },
  introSubtitle: {
    fontSize: SIZES.fontBase,
    color: COLORS.slate600,
  },
  introBody: {
    gap: SPACING.md,
    color: COLORS.slate700,
  },
  introText: {
    fontSize: SIZES.fontSM,
    lineHeight: 22,
    color: COLORS.slate700,
  },
  introStats: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.base,
    paddingTop: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
  },
  introStatItem: {
    flex: 1,
  },
  introStatLabel: {
    fontSize: SIZES.fontXS,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: COLORS.slate500,
    marginBottom: 4,
  },
  introStatValue: {
    fontSize: SIZES.fontXL,
    color: COLORS.slate900,
  },
  introCategories: {
    marginTop: SPACING.base,
    padding: SPACING.md,
    backgroundColor: COLORS.slate50,
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  introCategoriesTitle: {
    fontSize: SIZES.fontXS,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: COLORS.slate500,
    marginBottom: SPACING.sm,
  },
  introCategoriesList: {
    gap: 4,
  },
  introCategoryItem: {
    fontSize: SIZES.fontXS,
    color: COLORS.slate700,
  },
  introFooter: {
    textAlign: 'center',
    color: COLORS.slate500,
    fontSize: SIZES.fontXS,
    marginTop: SPACING.base,
  },

  // TOC Page
  tocPage: {
    flex: 1,
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  tocTitle: {
    fontSize: SIZES.font2XL,
    marginBottom: SPACING.base,
    paddingBottom: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.slate900,
    color: COLORS.slate900,
  },
  tocGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.base,
  },
  tocButton: {
    width: '30%',
    padding: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.slate200,
    borderRadius: SIZES.radiusLG,
    backgroundColor: COLORS.white,
  },
  tocButtonLetter: {
    fontSize: SIZES.fontXL,
    marginBottom: 4,
    color: COLORS.slate900,
  },
  tocButtonCount: {
    fontSize: SIZES.fontXS,
    color: COLORS.slate600,
  },

  // Letter Title Page
  letterTitlePage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterTitleContent: {
    alignItems: 'center',
  },
  letterTitleLetter: {
    fontSize: 128,
    color: COLORS.slate900,
    lineHeight: 128,
    marginBottom: SPACING.base,
  },
  letterTitleCount: {
    fontSize: SIZES.fontLG,
    color: COLORS.slate600,
  },

  // Content Page
  contentPage: {
    flex: 1,
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  contentList: {
    gap: SPACING.xl,
  },
  contentItem: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.slate200,
    paddingLeft: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  contentItemHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: SPACING.sm,
    marginBottom: 4,
  },
  contentItemTerm: {
    fontSize: SIZES.fontLG,
    color: COLORS.slate900,
  },
  contentItemCategory: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    backgroundColor: COLORS.slate100,
    borderRadius: SIZES.radiusSM,
  },
  contentItemCategoryText: {
    fontSize: SIZES.fontXS,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: COLORS.slate500,
  },
  contentItemDefinition: {
    color: COLORS.slate700,
    lineHeight: 22,
    fontSize: SIZES.fontSM,
  },

  // Back Page
  backPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  backContent: {
    alignItems: 'center',
    gap: SPACING.base,
  },
  backTitle: {
    fontSize: SIZES.font2XL,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  backDivider: {
    height: 2,
    width: 64,
    marginVertical: SPACING.base,
  },
  backSubtitle: {
    fontSize: SIZES.fontBase,
    color: COLORS.slate300,
    textAlign: 'center',
  },
  backFooter: {
    fontSize: SIZES.fontSM,
    color: COLORS.slate400,
    marginTop: SPACING.xxl,
  },
});

export default StandaloneBookView;
