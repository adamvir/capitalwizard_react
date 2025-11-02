/**
 * ============================================
 * BOOKREADER - REACT NATIVE VERSION
 * ============================================
 * 
 * Book reading screen with:
 * - Page-by-page book content navigation
 * - Swipe/button page turning
 * - Chapter/section detection and styling
 * - Book-like design (cream background, serif font)
 * - Page counter and navigation
 * 
 * HASZNÁLAT:
 * cp exports/BookReader.rn.tsx src/components/BookReader.tsx
 * 
 * FÜGGŐSÉGEK:
 * npm install react-native-linear-gradient
 * npm install lucide-react-native
 * npm install react-native-gesture-handler  # Optional: for swipe gestures
 * 
 * MEGJEGYZÉS:
 * - Content splitting: '\n\n\n' delimiter (3 newlines)
 * - Auto-detection: Chapter titles (ALL CAPS), Section titles (Title Case)
 * - Page animation: Slide transition (Animated API)
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
import LinearGradient from 'react-native-linear-gradient';
import {
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
} from 'lucide-react-native';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
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

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

const SIZES = {
  fontXS: 10,
  fontSM: 12,
  fontBase: 14,
  fontLG: 16,
  fontXL: 18,
  font2XL: 24,
  iconBase: 20,
  iconLG: 24,
  radiusLG: 12,
  radiusXL: 16,
  radius2XL: 20,
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================

interface BookReaderProps {
  title: string;
  content: string; // Full book content with chapters (split by '\n\n\n')
  onBack: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function BookReader({ title, content, onBack }: BookReaderProps) {
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

  // Split content into pages by '\n\n\n' delimiter
  const pages = content.split('\n\n\n').filter(p => p.trim());

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
    <Modal visible transparent animationType="fade" onRequestClose={onBack}>
      <View style={styles.overlay}>
        {/* Book Container */}
        <LinearGradient
          colors={[COLORS.cream[50], COLORS.cream[100]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bookContainer}
        >
          {/* ============================================ */}
          {/* HEADER */}
          {/* ============================================ */}
          <LinearGradient
            colors={[COLORS.slate[800], COLORS.slate[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <View style={styles.headerLeft}>
              <BookOpen size={SIZES.iconLG} color={COLORS.amber[400]} />
              <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.pageCounter}>
                {currentPage + 1} / {pages.length}
              </Text>
              <TouchableOpacity onPress={onBack} style={styles.closeButton} activeOpacity={0.7}>
                <X size={SIZES.iconBase} color={COLORS.white} />
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
                    .map((line, idx) => renderLine(line, idx))}
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
            colors={[COLORS.slate[800], COLORS.slate[700]]}
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
                <ChevronLeft size={SIZES.iconBase} color={COLORS.white} />
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
                <ChevronRight size={SIZES.iconBase} color={COLORS.white} />
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
    borderBottomColor: COLORS.amber[600],
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
    color: COLORS.white,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
  },
  pageCounter: {
    color: COLORS.amber[300],
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
    padding: SPACING['2xl'],
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
    color: COLORS.slate[800],
    marginBottom: SPACING.lg,
    marginTop: SPACING['2xl'],
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.amber[600],
    paddingBottom: SPACING.sm,
    fontFamily: 'Georgia', // Serif font (may need custom font setup)
  },
  sectionHeading: {
    fontSize: SIZES.fontXL,
    fontWeight: '600',
    color: COLORS.slate[700],
    marginBottom: SPACING.base,
    marginTop: SPACING.lg,
    fontFamily: 'Georgia',
  },
  paragraph: {
    fontSize: SIZES.fontBase,
    color: COLORS.slate[800],
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
    marginTop: SPACING['3xl'],
    color: COLORS.slate[500],
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
    borderTopColor: COLORS.amber[600],
    gap: SPACING.md,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.amber[600],
    borderRadius: SIZES.radiusLG,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  navButtonDisabled: {
    backgroundColor: COLORS.slate[600],
    opacity: 0.6,
  },
  navButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: '600',
  },
  navInfo: {
    flex: 1,
    alignItems: 'center',
  },
  navInfoText: {
    color: COLORS.amber[300],
    fontSize: SIZES.fontSM,
    fontWeight: '600',
  },
});
