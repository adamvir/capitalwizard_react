/**
 * ============================================
 * UNIVERSITYSCREEN - REACT NATIVE VERSION
 * ============================================
 *
 * University Campus screen with:
 * - Campus map background (image)
 * - Fantasy crystal effects (animated)
 * - Slide-up menu with 6 buildings
 * - Building selection modal
 * - LibraryPage integration (Könyvtár)
 *
 * NAVIGATION:
 * - Library épületre kattintva → navigation.navigate('Library')
 * - Vissza gomb → navigation.goBack()
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  ChevronUp,
  Map,
  Building2,
  BookOpen,
  Users,
  FileCheck,
  GraduationCap,
  Home,
  X,
} from 'lucide-react-native';

// ============================================
// TYPES
// ============================================

interface UniversityScreenProps {
  navigation: any;
  route: any;
}

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
};

const SIZES = {
  fontSM: 12,
  fontBase: 14,
  fontXL: 20,
  font3XL: 30,
  iconBase: 20,
  iconLG: 24,
  radiusLG: 12,
  radiusXL: 16,
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Slide-up menu dimensions
const TAB_HEIGHT = 70; // Increased for better visibility
const MENU_CONTENT_HEIGHT = 280; // 3 rows of buildings + padding + gaps
const PANEL_HEIGHT = TAB_HEIGHT + MENU_CONTENT_HEIGHT;

// ============================================
// BUILDING CONFIGURATION
// ============================================

interface Building {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  colors: string[];
  number: number;
}

const BUILDINGS: Building[] = [
  {
    id: 'reception',
    name: 'Recepció',
    icon: Building2,
    colors: ['#A855F7', '#7C3AED'], // Purple
    number: 1,
  },
  {
    id: 'library',
    name: 'Könyvtár',
    icon: BookOpen,
    colors: ['#3B82F6', '#1D4ED8'], // Blue
    number: 2,
  },
  {
    id: 'lecture',
    name: 'Előadó',
    icon: Users,
    colors: ['#6366F1', '#4338CA'], // Indigo
    number: 3,
  },
  {
    id: 'exam',
    name: 'Vizsgáztató',
    icon: FileCheck,
    colors: ['#EF4444', '#B91C1C'], // Red
    number: 4,
  },
  {
    id: 'office',
    name: 'Tanulmányi osztály',
    icon: GraduationCap,
    colors: ['#10B981', '#047857'], // Green
    number: 5,
  },
  {
    id: 'dorm',
    name: 'Kollégium',
    icon: Home,
    colors: ['#F97316', '#C2410C'], // Orange
    number: 6,
  },
];

// ============================================
// COMPONENT
// ============================================

export default function UniversityScreen({ navigation }: UniversityScreenProps) {
  // ============================================
  // STATE
  // ============================================

  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // ============================================
  // ANIMATIONS
  // ============================================

  // Crystal pulse animations
  const crystal1Opacity = useRef(new Animated.Value(0.3)).current;
  const crystal2Opacity = useRef(new Animated.Value(0.3)).current;
  const crystal3Opacity = useRef(new Animated.Value(0.3)).current;

  // Slide-up menu animation
  // Start with only tab visible (panel is pushed down)
  const slideUpAnim = useRef(new Animated.Value(PANEL_HEIGHT - TAB_HEIGHT)).current;

  useEffect(() => {
    // Crystal pulse animations
    const createPulseAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 0.6,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      createPulseAnimation(crystal1Opacity, 0),
      createPulseAnimation(crystal2Opacity, 1000),
      createPulseAnimation(crystal3Opacity, 2000),
    ]).start();
  }, []);

  useEffect(() => {
    // Slide-up menu animation
    // menuOpen = true: translateY = 0 (full panel visible)
    // menuOpen = false: translateY = PANEL_HEIGHT - TAB_HEIGHT (only tab visible)
    Animated.spring(slideUpAnim, {
      toValue: menuOpen ? 0 : PANEL_HEIGHT - TAB_HEIGHT,
      friction: 10,
      tension: 50,
      useNativeDriver: true, // Better performance!
    }).start();
  }, [menuOpen]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleBuildingClick = (buildingId: string) => {
    setSelectedBuilding(buildingId);
    setMenuOpen(false);

    // NAVIGATION: Library épület megnyitása
    if (buildingId === 'library') {
      navigation.navigate('Library');
      setSelectedBuilding(null); // Reset selection
    }
  };

  const handleCloseModal = () => {
    setSelectedBuilding(null);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={styles.container}>
      {/* ============================================ */}
      {/* HEADER - Back button */}
      {/* ============================================ */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
          <ArrowLeft size={SIZES.iconLG} color={COLORS.white} />
          <Text style={styles.backButtonText}>Vissza</Text>
        </TouchableOpacity>
      </View>

      {/* ============================================ */}
      {/* CAMPUS CONTAINER - Background + Title */}
      {/* ============================================ */}
      <View style={styles.campusContainer}>
        {/* Background image with overlay */}
        <View style={styles.backgroundContainer}>
          {/* Campus Map Image */}
          <Image
            source={require('../../assets/images/campus-map.png')}
            style={styles.campusImage}
            resizeMode="cover"
          />

          {/* Dark overlay for better contrast */}
          <LinearGradient
            colors={['rgba(15, 23, 42, 0.4)', 'rgba(88, 28, 135, 0.3)', 'rgba(15, 23, 42, 0.5)']}
            style={styles.darkOverlay}
          />

          {/* Fantasy crystal effects */}
          <View style={styles.crystalContainer}>
            <Animated.View
              style={[
                styles.crystal1,
                {
                  opacity: crystal1Opacity,
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(147, 51, 234, 0.3)', 'rgba(192, 132, 252, 0.15)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.crystalGradient}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.crystal2,
                {
                  opacity: crystal2Opacity,
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(147, 51, 234, 0.3)', 'rgba(192, 132, 252, 0.15)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.crystalGradient}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.crystal3,
                {
                  opacity: crystal3Opacity,
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(147, 51, 234, 0.3)', 'rgba(192, 132, 252, 0.15)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.crystalGradient}
              />
            </Animated.View>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Egyetemi Város</Text>
          <Text style={styles.subtitle}>Válassz egy épületet a listából!</Text>
        </View>

        {/* Map placeholder (empty space for map visual) */}
        <View style={styles.mapPlaceholder} />
      </View>

      {/* ============================================ */}
      {/* BOTTOM SLIDE-UP MENU */}
      {/* ============================================ */}
      <View style={styles.bottomMenuContainer}>
        {/* Backdrop (when menu open) */}
        {menuOpen && (
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setMenuOpen(false)}
          />
        )}

        {/* Slide-up panel */}
        <Animated.View
          style={[
            styles.slideUpPanel,
            {
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          {/* Tab/Handle to open menu */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => setMenuOpen(!menuOpen)}
              activeOpacity={0.8}
              style={{ width: '100%' }}
            >
              <LinearGradient
                colors={['rgba(147, 51, 234, 0.9)', 'rgba(59, 130, 246, 0.9)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tabButton}
              >
                <View style={styles.tabContent}>
                  <Map size={24} color={COLORS.white} />
                  <Text style={styles.tabText}>Épületek Térképe</Text>
                </View>
                <Animated.View
                  style={{
                    transform: [{ rotate: menuOpen ? '180deg' : '0deg' }],
                  }}
                >
                  <ChevronUp size={24} color={COLORS.white} />
                </Animated.View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Menu content */}
          <LinearGradient
            colors={['rgba(15, 23, 42, 0.95)', 'rgba(88, 28, 135, 0.95)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.menuContent}
          >
            <ScrollView
              style={styles.buildingsScrollView}
              contentContainerStyle={styles.buildingsGrid}
              showsVerticalScrollIndicator={false}
            >
              {BUILDINGS.map((building) => (
                <View key={building.id} style={styles.buildingWrapper}>
                  <TouchableOpacity
                    onPress={() => handleBuildingClick(building.id)}
                    activeOpacity={0.8}
                    style={{ width: '100%' }}
                  >
                  <LinearGradient
                    colors={building.colors as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.buildingButton,
                      selectedBuilding === building.id && styles.buildingButtonSelected,
                    ]}
                  >
                    {/* Number badge */}
                    <View style={styles.buildingNumberBadge}>
                      <Text style={styles.buildingNumberText}>{building.number}</Text>
                    </View>

                    {/* Building icon */}
                    <building.icon
                      size={SIZES.iconBase}
                      color={COLORS.white}
                      strokeWidth={2.5}
                    />

                    {/* Building name */}
                    <Text style={styles.buildingName}>{building.name}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* ============================================ */}
      {/* SELECTED BUILDING MODAL */}
      {/* ============================================ */}
      {selectedBuilding && selectedBuilding !== 'library' && (
        <Modal transparent visible animationType="fade" onRequestClose={handleCloseModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.selectedBuildingModal}>
              <LinearGradient
                colors={['rgba(15, 23, 42, 0.98)', 'rgba(88, 28, 135, 0.98)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalContent}
              >
                <View style={styles.modalInner}>
                  {/* Building icon */}
                  {(() => {
                    const building = BUILDINGS.find((b) => b.id === selectedBuilding);
                    if (!building) return null;
                    const IconComponent = building.icon;

                    return (
                      <LinearGradient
                        colors={building.colors as [string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.modalIconContainer}
                      >
                        <IconComponent size={32} color={COLORS.white} strokeWidth={2.5} />
                      </LinearGradient>
                    );
                  })()}

                  {/* Text content */}
                  <View style={styles.modalTextContainer}>
                    <View style={styles.modalHeader}>
                      <View style={styles.modalNumberBadge}>
                        <Text style={styles.modalNumberText}>
                          {BUILDINGS.find((b) => b.id === selectedBuilding)?.number}
                        </Text>
                      </View>
                      <Text style={styles.modalTitle} numberOfLines={1}>
                        {BUILDINGS.find((b) => b.id === selectedBuilding)?.name}
                      </Text>
                    </View>
                    <Text style={styles.modalSubtitle}>Hamarosan elérhető...</Text>
                    <Text style={styles.modalDescription}>
                      Itt tudsz majd különböző tevékenységeket végezni az egyetemen.
                    </Text>
                  </View>
                </View>

                {/* Close button */}
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <X size={18} color={COLORS.white} />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  // ===== HEADER =====
  header: {
    position: 'relative',
    zIndex: 30,
    paddingHorizontal: SPACING.base,
    paddingTop: 50, // Safe area padding for iPhone notch/camera
    paddingBottom: SPACING.base,
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

  // ===== CAMPUS CONTAINER =====
  campusContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  campusImage: {
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Crystal effects
  crystalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  crystal1: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 80,
    height: 112,
    transform: [{ rotate: '12deg' }],
  },
  crystal2: {
    position: 'absolute',
    top: 80,
    right: 64,
    width: 64,
    height: 96,
    transform: [{ rotate: '-6deg' }],
  },
  crystal3: {
    position: 'absolute',
    bottom: 128,
    left: 80,
    width: 48,
    height: 80,
    transform: [{ rotate: '6deg' }],
  },
  crystalGradient: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  // Title
  titleContainer: {
    position: 'relative',
    zIndex: 10,
    alignItems: 'center',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.base,
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.font3XL,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  subtitle: {
    color: '#E9D5FF',
    fontSize: SIZES.fontSM,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Map placeholder
  mapPlaceholder: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
  },

  // ===== BOTTOM MENU =====
  bottomMenuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  backdrop: {
    position: 'absolute',
    top: -SCREEN_HEIGHT,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  slideUpPanel: {
    position: 'relative',
  },

  // Tab/Handle
  tabContainer: {
    paddingHorizontal: SPACING.base,
  },
  tabButton: {
    width: '100%',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.base,
    paddingVertical: 18, // Increased for better visibility
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Shadow
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  tabText: {
    color: COLORS.white,
    fontSize: 16, // Increased for better visibility
    fontWeight: '600',
  },

  // Menu content
  menuContent: {
    borderTopWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    height: MENU_CONTENT_HEIGHT, // Fixed height for consistent animation
    // Shadow
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  buildingsScrollView: {
    maxHeight: 400,
  },
  buildingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  buildingWrapper: {
    width: '48%', // 2 columns (48% + 48% + gap = ~100%)
    marginBottom: SPACING.sm,
  },

  // Building button
  buildingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    padding: 10,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buildingButtonSelected: {
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  buildingNumberBadge: {
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buildingNumberText: {
    color: '#0F172A',
    fontSize: SIZES.fontSM,
    fontWeight: '700',
  },
  buildingName: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    fontWeight: '600',
    flex: 1,
  },

  // ===== SELECTED BUILDING MODAL =====
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.base,
  },
  selectedBuildingModal: {
    width: '85%',
    maxWidth: 400,
  },
  modalContent: {
    borderWidth: 2,
    borderColor: 'rgba(168, 85, 247, 0.5)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.lg,
    // Shadow
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.base,
  },
  modalIconContainer: {
    padding: SPACING.base,
    borderRadius: SIZES.radiusXL,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  modalNumberBadge: {
    width: SIZES.iconLG,
    height: SIZES.iconLG,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalNumberText: {
    color: '#0F172A',
    fontSize: SIZES.fontSM,
    fontWeight: '700',
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: '700',
    flex: 1,
  },
  modalSubtitle: {
    color: '#D8B4FE',
    fontSize: SIZES.fontBase,
    marginBottom: SPACING.xs,
  },
  modalDescription: {
    color: 'rgba(233, 213, 255, 0.7)',
    fontSize: SIZES.fontSM,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
