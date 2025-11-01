import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface UniversityScreenProps {
  navigation: any;
  route: any;
}

const buildings = [
  { id: 'reception', name: 'Recepció', icon: 'office-building', gradient: ['#A855F7', '#7C3AED'], number: 1 },
  { id: 'library', name: 'Könyvtár', icon: 'book-open-variant', gradient: ['#3B82F6', '#1D4ED8'], number: 2 },
  { id: 'lecture', name: 'Előadó', icon: 'account-group', gradient: ['#6366F1', '#4338CA'], number: 3 },
  { id: 'exam', name: 'Vizsgáztató', icon: 'file-check', gradient: ['#EF4444', '#B91C1C'], number: 4 },
  { id: 'office', name: 'Tanulmányi osztály', icon: 'school', gradient: ['#10B981', '#047857'], number: 5 },
  { id: 'dorm', name: 'Kollégium', icon: 'home', gradient: ['#F97316', '#C2410C'], number: 6 },
];

export default function UniversityScreen({ navigation }: UniversityScreenProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBuildingSelect = (buildingId: string) => {
    setSelectedBuilding(buildingId);
    setMenuOpen(false);
    // NAVIGATION: Navigate to library screen
    if (buildingId === 'library') {
      navigation.navigate('Library');
    }
  };

  const selectedBuildingData = buildings.find(b => b.id === selectedBuilding);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={SIZES.iconLG} color={COLORS.white} />
          <Text style={styles.backButtonText}>Vissza</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.campusContainer}>
        <Image source={require('../../assets/images/campus-map.png')} style={styles.campusImage} resizeMode="cover" />
        <LinearGradient colors={['rgba(15, 23, 42, 0.4)', 'rgba(88, 28, 135, 0.3)', 'rgba(15, 23, 42, 0.5)']} style={styles.darkOverlay} />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Egyetemi Város</Text>
          <Text style={styles.subtitle}>Válassz egy épületet a listából!</Text>
        </View>

        <View style={styles.bottomMenuContainer}>
          {menuOpen && (<TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setMenuOpen(false)} />)}

          <Animated.View style={[styles.slideUpPanel, { transform: [{ translateY: menuOpen ? 0 : 350 }] }]}>
            <View style={styles.tabContainer}>
              <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.tabButton}>
                <LinearGradient colors={['rgba(147, 51, 234, 0.9)', 'rgba(59, 130, 246, 0.9)']} style={styles.tabButtonGradient}>
                  <View style={styles.tabContent}>
                    <MaterialCommunityIcons name="map" size={SIZES.iconBase} color={COLORS.white} />
                    <Text style={styles.tabText}>Épületek Térképe</Text>
                  </View>
                  <MaterialCommunityIcons name={menuOpen ? 'chevron-down' : 'chevron-up'} size={SIZES.iconBase} color={COLORS.white} />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <LinearGradient colors={['rgba(15, 23, 42, 0.95)', 'rgba(88, 28, 135, 0.95)']} style={styles.menuContent}>
              <ScrollView contentContainerStyle={styles.buildingsGrid} showsVerticalScrollIndicator={false}>
                {buildings.map((building) => (
                  <TouchableOpacity key={building.id} onPress={() => handleBuildingSelect(building.id)} style={[styles.buildingButton, selectedBuilding === building.id && styles.buildingButtonSelected]}>
                    <LinearGradient colors={building.gradient} style={styles.buildingButtonGradient}>
                      <View style={styles.buildingNumberBadge}><Text style={styles.buildingNumberText}>{building.number}</Text></View>
                      <MaterialCommunityIcons name={building.icon as any} size={SIZES.iconBase} color={COLORS.white} />
                      <Text style={styles.buildingName}>{building.name}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </LinearGradient>
          </Animated.View>
        </View>

        {selectedBuilding && selectedBuilding !== 'library' && (
          <Modal visible={true} transparent animationType="fade" onRequestClose={() => setSelectedBuilding(null)}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedBuilding(null)}>
              <Animated.View style={styles.selectedBuildingModal}>
                <LinearGradient colors={['rgba(15, 23, 42, 0.98)', 'rgba(88, 28, 135, 0.98)']} style={styles.modalContent}>
                  <View style={styles.modalInner}>
                    {selectedBuildingData && (
                      <LinearGradient colors={selectedBuildingData.gradient} style={styles.modalIconContainer}>
                        <MaterialCommunityIcons name={selectedBuildingData.icon as any} size={32} color={COLORS.white} />
                      </LinearGradient>
                    )}
                    <View style={styles.modalTextContainer}>
                      <View style={styles.modalHeader}>
                        <View style={styles.modalNumberBadge}><Text style={styles.modalNumberText}>{selectedBuildingData?.number}</Text></View>
                        <Text style={styles.modalTitle} numberOfLines={1}>{selectedBuildingData?.name}</Text>
                      </View>
                      <Text style={styles.modalSubtitle}>Hamarosan elérhető...</Text>
                      <Text style={styles.modalDescription}>Itt tudsz majd különböző tevékenységeket végezni az egyetemen.</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedBuilding(null)} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBg },
  header: { paddingHorizontal: SPACING.base, paddingTop: SPACING.sm, paddingBottom: SPACING.base, zIndex: 30 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  backButtonText: { color: COLORS.white, fontSize: SIZES.fontBase },
  campusContainer: { flex: 1, position: 'relative' },
  campusImage: { position: 'absolute', width: '100%', height: '100%' },
  darkOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  titleContainer: { alignItems: 'center', paddingTop: SPACING.sm, paddingBottom: SPACING.base, zIndex: 10 },
  title: { color: COLORS.white, fontSize: SIZES.font3XL, marginBottom: SPACING.xs, textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 6 },
  subtitle: { color: '#E9D5FF', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  bottomMenuContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30 },
  backdrop: { position: 'absolute', top: -1000, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
  slideUpPanel: { position: 'relative' },
  tabContainer: { paddingHorizontal: SPACING.base },
  tabButton: { width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  tabButtonGradient: { paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderColor: 'rgba(168, 85, 247, 0.4)' },
  tabContent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  tabText: { color: COLORS.white, fontSize: SIZES.fontBase },
  menuContent: { borderTopWidth: 1, borderTopColor: 'rgba(168, 85, 247, 0.3)' },
  buildingsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: SPACING.base, gap: SPACING.sm },
  buildingButton: { width: '48%', borderRadius: SIZES.radiusLG, overflow: 'hidden', marginBottom: SPACING.sm },
  buildingButtonSelected: { borderWidth: 2, borderColor: COLORS.white },
  buildingButtonGradient: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: 10 },
  buildingNumberBadge: { width: 28, height: 28, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  buildingNumberText: { color: '#0F172A', fontSize: SIZES.fontSM, fontWeight: 'bold' },
  buildingName: { color: COLORS.white, fontSize: SIZES.fontSM, flex: 1, flexWrap: 'wrap' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' },
  selectedBuildingModal: { width: '85%', maxWidth: 400 },
  modalContent: { borderRadius: SIZES.radiusXL, padding: SPACING.lg, borderWidth: 2, borderColor: 'rgba(168, 85, 247, 0.5)' },
  modalInner: { flexDirection: 'row', gap: SPACING.base },
  modalIconContainer: { padding: SPACING.base, borderRadius: SIZES.radiusXL },
  modalTextContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  modalNumberBadge: { width: SIZES.iconLG, height: SIZES.iconLG, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: SIZES.iconLG / 2, alignItems: 'center', justifyContent: 'center' },
  modalNumberText: { color: '#0F172A', fontSize: SIZES.fontSM },
  modalTitle: { color: COLORS.white, fontSize: SIZES.fontXL, flex: 1 },
  modalSubtitle: { color: '#D8B4FE', marginBottom: SPACING.sm },
  modalDescription: { color: 'rgba(233, 213, 255, 0.7)', fontSize: SIZES.fontSM },
  closeButton: { position: 'absolute', top: SPACING.md, right: SPACING.md, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center', justifyContent: 'center' },
  closeButtonText: { color: COLORS.white, fontSize: SIZES.fontLG },
});
