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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS } from '../../utils/styleConstants';

const { width, height } = Dimensions.get('window');

interface BookReaderProps {
  title: string;
  content: string; // Full book content with chapters
  onBack: () => void;
}

export function BookReader({ title, content, onBack }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // Split content into pages by chapters and sections
  const pages = content.split('\n\n\n').filter(p => p.trim());

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPageContent = (pageContent: string) => {
    return pageContent.split('\n').map((line, idx) => {
      const trimmed = line.trim();

      // Chapter headers (ALL CAPS lines)
      if (trimmed === trimmed.toUpperCase() && trimmed.length > 0 && trimmed.length < 50) {
        return (
          <Text key={idx} style={styles.chapterHeading}>
            {trimmed}
          </Text>
        );
      }

      // Section titles (Title Case, shorter lines)
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
      if (trimmed.length > 0) {
        return (
          <Text key={idx} style={styles.paragraph}>
            {line}
          </Text>
        );
      }

      return <View key={idx} style={styles.spacer} />;
    });
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
          colors={['#FFFBEB', '#FEF3C7']}
          style={styles.bookContainer}
        >
          {/* Header */}
          <LinearGradient
            colors={['#1E293B', '#334155']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons
                name="book-open-variant"
                size={SIZES.iconLG}
                color="#FBBF24"
              />
              <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.pageCounter}>
                {currentPage + 1} / {pages.length}
              </Text>
              <TouchableOpacity
                onPress={onBack}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={SIZES.iconBase}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Page Content */}
          <View style={styles.pageContentContainer}>
            <Animated.View
              key={currentPage}
              entering={SlideInRight.duration(300)}
              exiting={SlideOutLeft.duration(200)}
              style={styles.pageContentWrapper}
            >
              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <View style={styles.pageContent}>
                  {renderPageContent(pages[currentPage])}
                </View>

                {/* Page number at bottom */}
                <Text style={styles.pageNumber}>— {currentPage + 1} —</Text>
              </ScrollView>
            </Animated.View>
          </View>

          {/* Navigation */}
          <LinearGradient
            colors={['#1E293B', '#334155']}
            style={styles.navigation}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity
              onPress={prevPage}
              disabled={currentPage === 0}
              style={[
                styles.navButton,
                currentPage === 0 && styles.navButtonDisabled
              ]}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={SIZES.iconBase}
                color={COLORS.white}
              />
              <Text style={styles.navButtonText}>Előző</Text>
            </TouchableOpacity>

            <Text style={styles.navInfo}>
              {currentPage + 1} / {pages.length} oldal
            </Text>

            <TouchableOpacity
              onPress={nextPage}
              disabled={currentPage === pages.length - 1}
              style={[
                styles.navButton,
                currentPage === pages.length - 1 && styles.navButtonDisabled
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.navButtonText}>Következő</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={SIZES.iconBase}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </LinearGradient>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  bookContainer: {
    flex: 1,
    margin: SPACING.base,
    borderRadius: SIZES.radius2XL,
    overflow: 'hidden',
    ...SHADOWS.xl,
  },

  // Header
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 4,
    borderBottomColor: '#D97706',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
  },
  pageCounter: {
    color: '#FCD34D',
    fontSize: SIZES.fontSM,
    fontWeight: FONT_WEIGHT.medium,
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Page Content
  pageContentContainer: {
    flex: 1,
    position: 'relative',
  },
  pageContentWrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  pageContent: {
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },

  // Text Styles
  chapterHeading: {
    fontSize: SIZES.font2XL,
    fontWeight: FONT_WEIGHT.bold,
    color: '#1E293B',
    marginBottom: SPACING.lg,
    marginTop: SPACING.xl,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#D97706',
    paddingBottom: SPACING.sm,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  sectionHeading: {
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#334155',
    marginBottom: SPACING.base,
    marginTop: SPACING.lg,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  paragraph: {
    fontSize: SIZES.fontBase,
    color: '#1E293B',
    lineHeight: 28,
    marginBottom: SPACING.base,
    textAlign: 'justify',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  spacer: {
    height: SPACING.base,
  },
  pageNumber: {
    textAlign: 'center',
    marginTop: SPACING.xxxl,
    color: '#64748B',
    fontSize: SIZES.fontSM,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },

  // Navigation
  navigation: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 4,
    borderTopColor: '#D97706',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#D97706',
    borderRadius: SIZES.radiusLG,
    ...SHADOWS.medium,
  },
  navButtonDisabled: {
    backgroundColor: '#475569',
    opacity: 0.5,
  },
  navButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.semibold,
  },
  navInfo: {
    color: '#FCD34D',
    fontSize: SIZES.fontBase,
    fontWeight: FONT_WEIGHT.medium,
  },
});
