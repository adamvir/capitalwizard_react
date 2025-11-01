/**
 * ============================================
 * CHARACTERLINEUP - REACT NATIVE VERSION
 * ============================================
 * 
 * Bottom navigation menu with 6 character buttons + dev menu
 * - Egyetem (University) - Active
 * - Diák (Student/Profile) - Active
 * - Eredmények (Results) - Disabled
 * - Helyezés (Leaderboard) - Disabled
 * - Hírek (News) - Disabled
 * - Előfizetés (Subscription) - Active
 * - Dev Menu (Settings icon) - Debug/Dev tools
 * 
 * HASZNÁLAT:
 * cp exports/CharacterLineup.rn.tsx src/components/CharacterLineup.tsx
 * 
 * FÜGGŐSÉGEK:
 * npm install lucide-react-native
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  GraduationCap,
  User,
  Trophy,
  Medal,
  Newspaper,
  Crown,
  Settings,
} from 'lucide-react-native';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  gray800: '#1F2937',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
  primary: '#8B5CF6',
  primaryDark: '#7C3AED',
};

const SPACING = {
  xs: 4,
  sm: 8,
  base: 16,
};

const SIZES = {
  radiusLG: 12,
  borderBase: 2,
  borderThin: 1,
};

// ============================================
// TYPES
// ============================================

interface CharacterLineupProps {
  onJumpToLesson?: (lesson: number) => void;
  onUniversityClick?: () => void;
  onProfileClick?: () => void;
  onSubscriptionClick?: () => void;
  onManagerClick?: () => void;
}

interface Character {
  colors: string[];
  name: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  onClick?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function CharacterLineup({
  onJumpToLesson,
  onUniversityClick,
  onProfileClick,
  onSubscriptionClick,
  onManagerClick,
}: CharacterLineupProps) {
  // ============================================
  // STATE
  // ============================================

  const [menuOpen, setMenuOpen] = useState(false);

  // ============================================
  // CHARACTER CONFIGURATION
  // ============================================

  const characters: Character[] = [
    {
      colors: ['#9333EA', '#6B21A8'], // Purple
      name: 'Shadow',
      icon: GraduationCap,
      label: 'Egyetem',
      onClick: onUniversityClick,
    },
    {
      colors: ['#3B82F6', '#1D4ED8'], // Blue
      name: 'Frost',
      icon: User,
      label: 'Diák',
      onClick: onProfileClick,
    },
    {
      colors: ['#6B7280', '#4B5563'], // Gray
      name: 'Steel',
      icon: Trophy,
      label: 'Eredmények',
      onClick: undefined, // Disabled
    },
    {
      colors: ['#EC4899', '#DB2777'], // Pink
      name: 'Sakura',
      icon: Medal,
      label: 'Helyezés',
      onClick: undefined, // Disabled
    },
    {
      colors: ['#F97316', '#EA580C'], // Orange
      name: 'Fire',
      icon: Newspaper,
      label: 'Hírek',
      onClick: undefined, // Disabled
    },
    {
      colors: ['#EAB308', '#EA580C'], // Yellow → Orange
      name: 'Wave',
      icon: Crown,
      label: 'Előfizetés',
      onClick: onSubscriptionClick,
    },
  ];

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLessonSelect = (lesson: number) => {
    if (onJumpToLesson) {
      onJumpToLesson(lesson);
    }
    setMenuOpen(false);
  };

  const handleManagerOpen = () => {
    if (onManagerClick) {
      onManagerClick();
    }
    setMenuOpen(false);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={styles.container}>
      <View style={styles.lineupWrapper}>
        <View style={styles.lineupInner}>
          {/* Character buttons */}
          {characters.map((char, index) => {
            const IconComponent = char.icon;
            const hasOnClick = !!char.onClick;

            return (
              <View key={index} style={styles.characterButtonWrapper}>
                <TouchableOpacity
                  onPress={char.onClick}
                  disabled={!hasOnClick}
                  activeOpacity={hasOnClick ? 0.7 : 1}
                  style={[
                    styles.characterButton,
                    {
                      backgroundColor: char.colors[0], // Simplified: no gradient
                      opacity: hasOnClick ? 1 : 0.6,
                    },
                  ]}
                >
                  {/* Overlay */}
                  <View style={styles.characterOverlay} />

                  {/* Icon */}
                  <IconComponent
                    size={28}
                    color={COLORS.white}
                    style={styles.characterIcon}
                  />

                  {/* Label */}
                  <Text style={styles.characterLabel}>{char.label}</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Dev Menu Button */}
          <View style={styles.devButtonWrapper}>
            <TouchableOpacity
              onPress={handleMenuToggle}
              activeOpacity={0.7}
              style={styles.devButton}
            >
              {/* Overlay */}
              <View style={styles.devButtonOverlay} />

              {/* Icon */}
              <Settings size={14} color={COLORS.white} style={styles.devIcon} />

              {/* Label */}
              <Text style={styles.devLabel}>Dev</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ============================================ */}
      {/* DEV MENU MODAL */}
      {/* ============================================ */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🛠️ Dev Menu</Text>

            <ScrollView style={styles.modalScroll}>
              {/* Lesson Jump */}
              <Text style={styles.sectionTitle}>Jump to Lesson:</Text>
              <View style={styles.buttonGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((lesson) => (
                  <TouchableOpacity
                    key={lesson}
                    onPress={() => handleLessonSelect(lesson)}
                    style={styles.gridButton}
                  >
                    <Text style={styles.gridButtonText}>{lesson}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Manager */}
              <TouchableOpacity
                onPress={handleManagerOpen}
                style={styles.menuButton}
              >
                <Text style={styles.menuButtonText}>📊 Manager</Text>
              </TouchableOpacity>

              {/* Close */}
              <TouchableOpacity
                onPress={() => setMenuOpen(false)}
                style={[styles.menuButton, styles.closeButton]}
              >
                <Text style={styles.menuButtonText}>❌ Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 98,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  lineupWrapper: {
    position: 'relative',
    height: 80,
    marginHorizontal: SPACING.sm,
  },
  lineupInner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.base,
  },

  // Character button
  characterButtonWrapper: {
    position: 'relative',
  },
  characterButton: {
    width: 56,
    height: 72,
    borderRadius: SIZES.radiusLG,
    borderWidth: SIZES.borderBase,
    borderColor: COLORS.gray800,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
    position: 'relative',
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    // Shadow (Android)
    elevation: 6,
  },
  characterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlayLight,
    borderRadius: SIZES.radiusLG,
  },
  characterIcon: {
    zIndex: 2,
    marginBottom: SPACING.xs,
  },
  characterLabel: {
    color: COLORS.white,
    fontSize: 8,
    zIndex: 2,
    textAlign: 'center',
    lineHeight: 10,
  },

  // Dev button
  devButtonWrapper: {
    position: 'relative',
    marginLeft: SPACING.sm,
  },
  devButton: {
    width: 28,
    height: 36,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusLG,
    borderWidth: SIZES.borderThin,
    borderColor: COLORS.gray800,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    position: 'relative',
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    // Shadow (Android)
    elevation: 6,
  },
  devButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlayLight,
    borderRadius: SIZES.radiusLG,
  },
  devIcon: {
    zIndex: 2,
    marginBottom: 2,
  },
  devLabel: {
    color: COLORS.white,
    fontSize: 6,
    zIndex: 2,
    textAlign: 'center',
    lineHeight: 8,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 500,
  },

  // Section title
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 12,
  },

  // Button grid (lesson jump)
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  gridButton: {
    width: 50,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Menu buttons
  menuButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#DC2626',
  },
  menuButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
