/**
 * Standalone Book View Component - React Native
 *
 * Ez a komponens egy lapozható digitális könyv nézetet biztosít
 * bármilyen szótár vagy glossary típusú adathoz.
 *
 * HASZNÁLAT:
 *
 * 1. Importáld a komponenst:
 *    import { StandaloneBookView } from './components/books/StandaloneBookView';
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
 * - react-native-reanimated (AnimatePresence)
 * - expo-linear-gradient
 * - @expo/vector-icons/MaterialCommunityIcons
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS } from '../../utils/styleConstants';

const { width, height } = Dimensions.get('window');

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
  coverColors?: string[];
  accentColor?: string;
}

interface Page {
  type: 'cover' | 'intro' | 'toc' | 'letter-title' | 'content' | 'back';
  content?: any;
  letter?: string;
  terms?: BookViewTerm[];
  tocSection?: { letter: string; count: number }[];
}

// === MAIN COMPONENT ===

export function StandaloneBookView({
  data,
  title = "Tőkepiaci Szótár",
  subtitle = "Átfogó referencia",
  year = new Date().getFullYear(),
  onBack,
  coverColors = ['#0F172A', '#1E293B', '#0F172A'],
  accentColor = '#FBBF24'
}: StandaloneBookViewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

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
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 0 && pageNum < pages.length) {
      setDirection(pageNum > currentPage ? 1 : -1);
      setCurrentPage(pageNum);
    }
  };

  const renderPage = (page: Page) => {
    switch (page.type) {
      case 'cover':
        return (
          <LinearGradient
            colors={coverColors}
            style={styles.coverPage}
          >
            <View style={styles.coverContent}>
              <View>
                <View style={[styles.coverBadge, { borderColor: accentColor }]}>
                  <Text style={[styles.coverBadgeText, { color: accentColor }]}>
                    PROFESSZIONÁLIS REFERENCIA
                  </Text>
                </View>
                <Text style={styles.coverTitle1}>
                  {title.split(' ')[0]}
                </Text>
                <Text style={styles.coverTitle2}>
                  {title.split(' ').slice(1).join(' ')}
                </Text>
                <View style={styles.coverDivider} />
                <Text style={styles.coverStats}>
                  {data.length} alapvető fogalom
                </Text>
                <Text style={styles.coverSubtitle}>
                  {subtitle}
                </Text>
              </View>

              <View style={styles.coverFooter}>
                <Text style={styles.coverFooterText}>
                  {year}. kiadás
                </Text>
              </View>
            </View>
          </LinearGradient>
        );

      case 'intro':
        return (
          <ScrollView style={styles.scrollablePage} showsVerticalScrollIndicator={false}>
            <View style={styles.introPage}>
              <View style={styles.introContent}>
                <View style={styles.introHeader}>
                  <Text style={styles.introTitle}>{title}</Text>
                  <Text style={styles.introSubtitle}>
                    {subtitle}
                  </Text>
                </View>

                <View style={styles.introBody}>
                  <Text style={styles.introText}>
                    Ez a szótár {data.length} alapvető fogalmat tartalmaz,
                    kategóriák szerint rendszerezve. Átfogó referencia a szakmai
                    terminológiához.
                  </Text>

                  <View style={styles.introStats}>
                    <View style={styles.introStatItem}>
                      <Text style={styles.introStatLabel}>TARTALOM</Text>
                      <Text style={styles.introStatValue}>{data.length} fogalom</Text>
                    </View>
                    <View style={styles.introStatItem}>
                      <Text style={styles.introStatLabel}>BETŰK</Text>
                      <Text style={styles.introStatValue}>{letters.length}</Text>
                    </View>
                  </View>

                  {categories.length > 0 && (
                    <View style={styles.introCategories}>
                      <Text style={styles.introCategoriesTitle}>KATEGÓRIÁK</Text>
                      <View style={styles.introCategoriesList}>
                        {categories.slice(0, 8).map((cat, idx) => (
                          <Text key={idx} style={styles.introCategoryItem}>• {cat}</Text>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.introFooter}>
                <Text style={styles.introFooterText}>© {year} • Minden jog fenntartva</Text>
              </View>
            </View>
          </ScrollView>
        );

      case 'toc':
        return (
          <ScrollView style={styles.scrollablePage} showsVerticalScrollIndicator={false}>
            <View style={styles.tocPage}>
              <Text style={styles.tocTitle}>
                Tartalomjegyzék
              </Text>

              <View style={styles.tocGrid}>
                {page.tocSection?.map((item) => {
                  const letterPageIndex = pages.findIndex(p => p.type === 'letter-title' && p.letter === item.letter);

                  return (
                    <TouchableOpacity
                      key={item.letter}
                      onPress={() => goToPage(letterPageIndex)}
                      style={styles.tocButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.tocButtonLetter}>
                        {item.letter}
                      </Text>
                      <Text style={styles.tocButtonCount}>
                        {item.count} fogalom
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        );

      case 'letter-title':
        return (
          <View style={styles.letterTitlePage}>
            <View style={styles.letterTitleContent}>
              <Text style={styles.letterTitleLetter}>
                {page.letter}
              </Text>
              <Text style={styles.letterTitleCount}>
                {page.content} fogalom
              </Text>
            </View>
          </View>
        );

      case 'content':
        return (
          <ScrollView style={styles.scrollablePage} showsVerticalScrollIndicator={false}>
            <View style={styles.contentPage}>
              <View style={styles.contentList}>
                {page.terms?.map((term) => (
                  <View key={term.id} style={styles.contentItem}>
                    <View style={styles.contentItemHeader}>
                      <Text style={styles.contentItemTerm}>
                        {term.term}
                      </Text>
                      <View style={styles.contentItemCategoryBadge}>
                        <Text style={styles.contentItemCategory}>
                          {term.category}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.contentItemDefinition}>
                      {term.definition}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        );

      case 'back':
        return (
          <ScrollView style={styles.scrollablePage} showsVerticalScrollIndicator={false}>
            <View style={styles.backPage}>
              <View style={styles.backContent}>
                <Text style={styles.backTitle}>
                  Szakmai terminológia
                </Text>
                <Text style={styles.backText}>
                  Ez a szótár átfogó áttekintést nyújt a legfontosabb
                  szakmai fogalmakról. Mind a kezdők, mind a tapasztalt szakemberek
                  számára hasznos referenciaként szolgál.
                </Text>
                <Text style={styles.backText}>
                  A {data.length} kifejezés {categories.length} különböző kategóriába sorolva
                  tartalmazza a legfontosabb terminológiát.
                </Text>

                <View style={styles.backStats}>
                  <View style={styles.backStatItem}>
                    <Text style={styles.backStatValue}>{data.length}</Text>
                    <Text style={styles.backStatLabel}>Szakfogalom</Text>
                  </View>
                  <View style={styles.backStatItem}>
                    <Text style={styles.backStatValue}>{categories.length}</Text>
                    <Text style={styles.backStatLabel}>Kategória</Text>
                  </View>
                  <View style={styles.backStatItem}>
                    <Text style={styles.backStatValue}>100%</Text>
                    <Text style={styles.backStatLabel}>Magyar</Text>
                  </View>
                </View>
              </View>

              <View style={styles.backFooter}>
                <View style={styles.backFooterContent}>
                  <Text style={styles.backFooterTitle}>{title}</Text>
                  <Text style={styles.backFooterDetails}>
                    {year}. kiadás • Magyar nyelven • {data.length} fogalom
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent={false}
      onRequestClose={onBack}
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#FFFBEB', '#FFEDD5', '#FEF3C7']}
          style={styles.bookWrapper}
        >
          {/* Vezérlő felület */}
          <View style={styles.controlBar}>
            <View style={styles.controlBarLeft}>
              <TouchableOpacity
                onPress={onBack}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="close" size={SIZES.iconBase} color="#78350F" />
              </TouchableOpacity>
              <View style={styles.pageInfo}>
                <MaterialCommunityIcons name="book-open-variant" size={SIZES.iconBase} color="#B45309" />
                <Text style={styles.pageInfoText}>
                  {currentPage + 1} / {pages.length}
                </Text>
              </View>
            </View>
          </View>

          {/* Könyv tartalom */}
          <View style={styles.bookContentArea}>
            <View style={styles.bookContainer}>

              {/* Bal oldali lapozó */}
              <TouchableOpacity
                onPress={goToPrevPage}
                disabled={currentPage === 0}
                style={[styles.navButton, styles.navButtonLeft, currentPage === 0 && styles.navButtonDisabled]}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={SIZES.iconLG}
                  color="#78350F"
                />
              </TouchableOpacity>

              {/* Jobb oldali lapozó */}
              <TouchableOpacity
                onPress={goToNextPage}
                disabled={currentPage === pages.length - 1}
                style={[styles.navButton, styles.navButtonRight, currentPage === pages.length - 1 && styles.navButtonDisabled]}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={SIZES.iconLG}
                  color="#78350F"
                />
              </TouchableOpacity>

              {/* Könyv gerinc - bal oldal */}
              <LinearGradient
                colors={['#1E293B', '#334155']}
                style={styles.bookSpine}
              >
                <View style={styles.bookSpineOverlay} />
              </LinearGradient>

              {/* Oldal animáció */}
              <View style={styles.pageContainer}>
                <Animated.View
                  key={currentPage}
                  entering={direction === 1 ? SlideInRight.duration(400) : SlideInLeft.duration(400)}
                  exiting={direction === 1 ? SlideOutLeft.duration(300) : SlideOutRight.duration(300)}
                  style={styles.pageAnimationWrapper}
                >
                  {renderPage(pages[currentPage])}
                </Animated.View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
}

// === STYLES ===

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  bookWrapper: {
    flex: 1,
  },

  // Control Bar
  controlBar: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
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
    backgroundColor: '#FEF3C7',
  },
  pageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  pageInfoText: {
    fontSize: SIZES.fontSM,
    color: '#78350F',
    fontWeight: FONT_WEIGHT.medium,
  },

  // Book Content Area
  bookContentArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
  },
  bookContainer: {
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
    ...SHADOWS.medium,
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
    ...SHADOWS.xl,
  },
  bookSpineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  // Page Container
  pageContainer: {
    position: 'relative',
    height: '100%',
    marginLeft: 32,
  },
  pageAnimationWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    borderTopRightRadius: SIZES.radiusXL,
    borderBottomRightRadius: SIZES.radiusXL,
    ...SHADOWS.xl,
    overflow: 'hidden',
  },
  scrollablePage: {
    flex: 1,
  },

  // Cover Page
  coverPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    borderTopRightRadius: SIZES.radiusXL,
    borderBottomRightRadius: SIZES.radiusXL,
  },
  coverContent: {
    alignItems: 'center',
    gap: SPACING.xxxl,
  },
  coverBadge: {
    borderWidth: 2,
    borderRadius: SIZES.radiusFull,
    paddingHorizontal: SPACING.base,
    paddingVertical: 6,
    marginBottom: SPACING.md,
    alignSelf: 'center',
  },
  coverBadgeText: {
    letterSpacing: 1.5,
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.bold,
  },
  coverTitle1: {
    fontSize: SIZES.font3XL,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  coverTitle2: {
    fontSize: SIZES.font4XL,
    fontWeight: FONT_WEIGHT.extrabold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  coverDivider: {
    height: 2,
    width: 96,
    backgroundColor: '#FBBF24',
    marginVertical: SPACING.base,
  },
  coverStats: {
    fontSize: SIZES.fontLG,
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: SPACING.md,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  coverSubtitle: {
    fontSize: SIZES.fontBase,
    color: '#94A3B8',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  coverFooter: {
    marginTop: SPACING.xxxl,
    paddingTop: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: '#475569',
  },
  coverFooterText: {
    color: '#94A3B8',
    fontSize: SIZES.fontSM,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },

  // Intro Page
  introPage: {
    padding: SPACING.xl,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  introContent: {
    gap: SPACING.lg,
  },
  introHeader: {
    borderLeftWidth: 4,
    borderLeftColor: '#0F172A',
    paddingLeft: SPACING.base,
    marginBottom: SPACING.base,
  },
  introTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.sm,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  introSubtitle: {
    fontSize: SIZES.fontBase,
    color: '#475569',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  introBody: {
    gap: SPACING.md,
    color: '#334155',
  },
  introText: {
    fontSize: SIZES.fontSM,
    lineHeight: 22,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  introStats: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.base,
    paddingTop: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  introStatItem: {
    flex: 1,
  },
  introStatLabel: {
    fontSize: SIZES.fontXS,
    letterSpacing: 0.5,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: FONT_WEIGHT.semibold,
  },
  introStatValue: {
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.bold,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  introCategories: {
    marginTop: SPACING.base,
    padding: SPACING.md,
    backgroundColor: '#F8FAFC',
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  introCategoriesTitle: {
    fontSize: SIZES.fontXS,
    letterSpacing: 0.5,
    color: '#64748B',
    marginBottom: SPACING.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  introCategoriesList: {
    gap: 4,
  },
  introCategoryItem: {
    fontSize: SIZES.fontXS,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  introFooter: {
    marginTop: SPACING.xxxl,
    alignItems: 'center',
  },
  introFooterText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: SIZES.fontXS,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },

  // TOC Page
  tocPage: {
    padding: SPACING.xl,
  },
  tocTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.base,
    paddingBottom: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: '#0F172A',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  tocGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.base,
  },
  tocButton: {
    width: '31%',
    padding: SPACING.sm,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: SIZES.radiusLG,
    backgroundColor: COLORS.white,
  },
  tocButtonLetter: {
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  tocButtonCount: {
    fontSize: SIZES.fontXS,
    color: '#475569',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },

  // Letter Title Page
  letterTitlePage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  letterTitleContent: {
    alignItems: 'center',
  },
  letterTitleLetter: {
    fontSize: 128,
    color: '#0F172A',
    lineHeight: 128,
    marginBottom: SPACING.base,
    fontWeight: FONT_WEIGHT.extrabold,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  letterTitleCount: {
    fontSize: SIZES.fontLG,
    color: '#475569',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },

  // Content Page
  contentPage: {
    padding: SPACING.xl,
  },
  contentList: {
    gap: SPACING.xl,
  },
  contentItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#E2E8F0',
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
    color: '#0F172A',
    fontWeight: FONT_WEIGHT.bold,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  contentItemCategoryBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    backgroundColor: '#F1F5F9',
    borderRadius: SIZES.radiusSM,
  },
  contentItemCategory: {
    fontSize: SIZES.fontXS,
    letterSpacing: 0.8,
    color: '#64748B',
    fontWeight: FONT_WEIGHT.semibold,
  },
  contentItemDefinition: {
    color: '#334155',
    lineHeight: 22,
    fontSize: SIZES.fontSM,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },

  // Back Page
  backPage: {
    padding: SPACING.xl,
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    minHeight: '100%',
  },
  backContent: {
    maxWidth: 512,
  },
  backTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.base,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  backText: {
    fontSize: SIZES.fontSM,
    color: '#334155',
    lineHeight: 22,
    marginBottom: SPACING.md,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  backStats: {
    marginTop: SPACING.xxxl,
    flexDirection: 'row',
    gap: SPACING.base,
  },
  backStatItem: {
    flex: 1,
    gap: 4,
  },
  backStatValue: {
    fontSize: SIZES.font3XL,
    fontWeight: FONT_WEIGHT.bold,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  backStatLabel: {
    fontSize: SIZES.fontXS,
    color: '#475569',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  backFooter: {
    marginTop: SPACING.xxxl,
    paddingTop: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
  },
  backFooterContent: {
    alignItems: 'center',
  },
  backFooterTitle: {
    color: '#475569',
    fontSize: SIZES.fontSM,
    marginBottom: 4,
    fontWeight: FONT_WEIGHT.semibold,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  backFooterDetails: {
    fontSize: SIZES.fontXS,
    color: '#475569',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
});

export default StandaloneBookView;
