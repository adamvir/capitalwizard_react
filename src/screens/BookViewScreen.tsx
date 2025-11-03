/**
 * ============================================
 * BOOKVIEWSCREEN - REACT NATIVE VERSION
 * ============================================
 *
 * Book reading screen with:
 * - Page-by-page book content navigation
 * - Chapter/section detection and styling
 * - Book-like design (cream background, serif font)
 * - Page counter and navigation
 * - Fade transition animation
 *
 * USAGE:
 * navigation.navigate('BookView', {
 *   bookTitle: 'Book Title',
 *   content: 'Book content...'
 * })
 *
 * CONTENT FORMAT:
 * - Pages split by '\n\n\n' (3 newlines)
 * - Chapter titles: ALL CAPS, < 50 chars
 * - Section titles: Title Case, < 100 chars, no period
 * - Paragraphs: Regular text with justify alignment
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, X, BookOpen } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, SIZES, SHADOWS } from '../utils/styleConstants';

// ============================================
// CONSTANTS
// ============================================

const BOOK_COLORS = {
  white: '#FFFFFF',
  slate: {
    700: '#334155',
    800: '#1E293B',
    600: '#475569',
    500: '#64748B',
  },
  amber: {
    300: '#FCD34D',
    400: '#FBBF24',
    600: '#D97706',
    700: '#B45309',
  },
  cream: {
    50: '#FFFBEB',
    100: '#FEF3C7',
  },
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================

type BookViewScreenProps = NativeStackScreenProps<RootStackParamList, 'BookView'>;

// ============================================
// COMPONENT
// ============================================

export default function BookViewScreen({ route, navigation }: BookViewScreenProps) {
  // ============================================
  // PARAMS
  // ============================================

  const { bookTitle, content } = route.params;

  // ============================================
  // STATE
  // ============================================

  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev

  // ============================================
  // ANIMATIONS
  // ============================================

  const pageAnim = useRef(new Animated.Value(0)).current;

  // ============================================
  // CONTENT PROCESSING
  // ============================================

  // Safety check: if no content provided, show error message
  if (!content) {
    console.error('❌ BookViewScreen: No content provided for book:', bookTitle);
    return (
      <View style={[styles.overlay, { justifyContent: 'center' }]}>
        <Text style={{ color: '#DC2626', fontSize: 18, textAlign: 'center', padding: 20 }}>
          Hiba: A könyv tartalma nem található.{'\n'}
          Kérjük, próbálja újra később.
        </Text>
      </View>
    );
  }

  // Split content into pages by '\n\n\n' delimiter
  const pages = content.split('\n\n\n').filter((p: string) => p.trim());

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setDirection(1);
      animatePageTransition(() => setCurrentPage(currentPage + 1));
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      animatePageTransition(() => setCurrentPage(currentPage - 1));
    }
  };

  const animatePageTransition = (callback: () => void) => {
    // Fade out current page
    Animated.timing(pageAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Change page
      callback();
      // Fade in new page
      pageAnim.setValue(0);
    });
  };

  const handleClose = () => {
    navigation.goBack();
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderLine = (line: string, idx: number) => {
    const trimmed = line.trim();

    // Empty line (spacer)
    if (trimmed.length === 0) {
      return <View key={idx} style={styles.spacer} />;
    }

    // Chapter headers (ALL CAPS lines, short)
    if (
      trimmed === trimmed.toUpperCase() &&
      trimmed.length > 0 &&
      trimmed.length < 50
    ) {
      return (
        <Text key={idx} style={styles.chapterHeading}>
          {trimmed}
        </Text>
      );
    }

    // Section titles (Title Case, shorter lines, no period at end)
    if (
      trimmed.length > 0 &&
      trimmed.length < 100 &&
      /^[A-ZÁÉÍÓÖŐÚÜŰ]/.test(trimmed) &&
      !trimmed.endsWith('.')
    ) {
      return (
        <Text key={idx} style={styles.sectionHeading}>
          {trimmed}
        </Text>
      );
    }

    // Regular paragraphs
    return (
      <Text key={idx} style={styles.paragraph}>
        {line}
      </Text>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <Modal visible transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        {/* Book Container */}
        <LinearGradient
          colors={[BOOK_COLORS.cream[50], BOOK_COLORS.cream[100]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bookContainer}
        >
          {/* ============================================ */}
          {/* HEADER */}
          {/* ============================================ */}
          <LinearGradient
            colors={[BOOK_COLORS.slate[800], BOOK_COLORS.slate[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <View style={styles.headerLeft}>
              <BookOpen size={SIZES.iconLG} color={BOOK_COLORS.amber[400]} />
              <Text style={styles.headerTitle} numberOfLines={1}>
                {bookTitle}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.pageCounter}>
                {currentPage + 1} / {pages.length}
              </Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.7}>
                <X size={SIZES.iconBase} color={BOOK_COLORS.white} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* ============================================ */}
          {/* PAGE CONTENT */}
          {/* ============================================ */}
          <View style={styles.pageContentContainer}>
            <Animated.View
              style={[
                styles.pageContent,
                {
                  opacity: pageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  }),
                },
              ]}
            >
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.pageContentInner}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.proseContainer}>
                  {/* Render page lines */}
                  {pages[currentPage]
                    .split('\n')
                    .map((line: string, idx: number) => renderLine(line, idx))}
                </View>

                {/* Page number at bottom */}
                <Text style={styles.pageNumber}>— {currentPage + 1} —</Text>
              </ScrollView>
            </Animated.View>
          </View>

          {/* ============================================ */}
          {/* NAVIGATION */}
          {/* ============================================ */}
          <LinearGradient
            colors={[BOOK_COLORS.slate[800], BOOK_COLORS.slate[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.navigation}
          >
            {/* Previous button */}
            <TouchableOpacity
              onPress={prevPage}
              disabled={currentPage === 0}
              activeOpacity={0.8}
              style={{ flex: 1 }}
            >
              <View
                style={[
                  styles.navButton,
                  currentPage === 0 && styles.navButtonDisabled,
                ]}
              >
                <ChevronLeft size={SIZES.iconBase} color={BOOK_COLORS.white} />
                <Text style={styles.navButtonText}>Előző</Text>
              </View>
            </TouchableOpacity>

            {/* Page info */}
            <View style={styles.navInfo}>
              <Text style={styles.navInfoText}>
                {currentPage + 1} / {pages.length} oldal
              </Text>
            </View>

            {/* Next button */}
            <TouchableOpacity
              onPress={nextPage}
              disabled={currentPage === pages.length - 1}
              activeOpacity={0.8}
              style={{ flex: 1 }}
            >
              <View
                style={[
                  styles.navButton,
                  currentPage === pages.length - 1 && styles.navButtonDisabled,
                ]}
              >
                <Text style={styles.navButtonText}>Következő</Text>
                <ChevronRight size={SIZES.iconBase} color={BOOK_COLORS.white} />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </LinearGradient>
      </View>
    </Modal>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.base,
  },

  // Book Container
  bookContainer: {
    width: '100%',
    maxWidth: 896,
    height: SCREEN_HEIGHT * 0.9,
    borderRadius: SIZES.radius2XL,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },

  // ===== HEADER =====
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 4,
    borderBottomColor: BOOK_COLORS.amber[600],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.fontXL,
    fontWeight: '700',
    color: BOOK_COLORS.white,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
  },
  pageCounter: {
    color: BOOK_COLORS.amber[300],
    fontSize: SIZES.fontSM,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ===== PAGE CONTENT =====
  pageContentContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  pageContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  pageContentInner: {
    padding: SPACING.xxl,
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  proseContainer: {
    // Book-like typography
  },

  // Chapter/Section styles
  chapterHeading: {
    fontSize: SIZES.font2XL,
    fontWeight: '700',
    color: BOOK_COLORS.slate[800],
    marginBottom: SPACING.lg,
    marginTop: SPACING.xxl,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: BOOK_COLORS.amber[600],
    paddingBottom: SPACING.sm,
    fontFamily: 'Georgia', // Serif font (may need custom font setup)
  },
  sectionHeading: {
    fontSize: SIZES.fontXL,
    fontWeight: '600',
    color: BOOK_COLORS.slate[700],
    marginBottom: SPACING.base,
    marginTop: SPACING.lg,
    fontFamily: 'Georgia',
  },
  paragraph: {
    fontSize: SIZES.fontBase,
    color: BOOK_COLORS.slate[800],
    marginBottom: SPACING.base,
    lineHeight: 24, // 1.8 line-height
    textAlign: 'justify',
    fontFamily: 'Georgia',
  },
  spacer: {
    height: SPACING.base,
  },
  pageNumber: {
    textAlign: 'center',
    marginTop: SPACING.xxxl,
    color: BOOK_COLORS.slate[500],
    fontSize: SIZES.fontSM,
    fontFamily: 'Georgia',
  },

  // ===== NAVIGATION =====
  navigation: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 4,
    borderTopColor: BOOK_COLORS.amber[600],
    gap: SPACING.md,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: BOOK_COLORS.amber[600],
    borderRadius: SIZES.radiusLG,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  navButtonDisabled: {
    backgroundColor: BOOK_COLORS.slate[600],
    opacity: 0.6,
  },
  navButtonText: {
    color: BOOK_COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: '600',
  },
  navInfo: {
    flex: 1,
    alignItems: 'center',
  },
  navInfoText: {
    color: BOOK_COLORS.amber[300],
    fontSize: SIZES.fontSM,
    fontWeight: '600',
  },
});
