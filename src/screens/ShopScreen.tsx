import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface ShopScreenProps {
  navigation: any;
  route: {
    params: {
      gold: number;
      gems: number;
      streakFreezes: number;
    };
  };
}

export default function ShopScreen({ navigation, route }: ShopScreenProps) {
  const { gold = 1000, gems = 0, streakFreezes = 0 } = route?.params || {};

  const handlePurchaseStreakFreeze = () => {
    const cost = 100;
    if (gold < cost) {
      Alert.alert('Nincs elég aranyad!', `Szükséges: ${cost} arany`);
      return;
    }
    Alert.alert('Vásárlás sikeres!', 'Széria pont vásárlása sikeres!');
  };

  const handleGoldPurchase = (amount: number, price: number) => {
    Alert.alert('Arany vásárlás', `${amount} arany vásárlása ${price.toLocaleString('hu-HU')} Ft-ért`);
  };

  const handleDiamondPurchase = (amount: number, cost: number) => {
    if (gold < cost) {
      Alert.alert('Nincs elég aranyad!', `Szükséges: ${cost} arany`);
      return;
    }
    Alert.alert('Vásárlás sikeres!', `${amount} gyémánt vásárlása sikeres!`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FAF5FF', '#FFFFFF']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={SIZES.iconBase} color="#7E22CE" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <View style={styles.headerTitleRow}>
              <MaterialCommunityIcons name="shopping" size={SIZES.iconLG} color="#A855F7" />
              <Text style={styles.headerTitle}>Bolt</Text>
            </View>
            <Text style={styles.headerSubtitle}>Vásárolj erőforrásokat és bónuszokat</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Current Balance */}
          <LinearGradient colors={['#A855F7', '#EC4899']} style={styles.balanceCard}>
            <Text style={styles.balanceText}>Jelenlegi egyenleged</Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <MaterialCommunityIcons name="coin" size={SIZES.iconBase} color={COLORS.white} />
                <Text style={styles.balanceValue}>{gold.toLocaleString('hu-HU')}</Text>
              </View>
              <View style={styles.balanceItem}>
                <MaterialCommunityIcons name="diamond-stone" size={SIZES.iconBase} color={COLORS.white} />
                <Text style={styles.balanceValue}>{gems}</Text>
              </View>
              <View style={styles.balanceItem}>
                <MaterialCommunityIcons name="fire" size={SIZES.iconBase} color={COLORS.white} />
                <Text style={styles.balanceValue}>{streakFreezes}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Streak Freeze Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="fire" size={SIZES.iconBase} color="#F97316" />
              <Text style={styles.sectionTitle}>Széria Védelem</Text>
            </View>

            <View style={styles.streakCard}>
              <View style={styles.streakCardContent}>
                <View style={styles.streakTextContainer}>
                  <Text style={styles.streakTitle}>Széria Pont</Text>
                  <Text style={styles.streakDescription}>
                    Ha kihagysz egy napot, a széria pont automatikusan megvédi a szériádat.
                  </Text>
                  <View style={styles.streakCurrent}>
                    <MaterialCommunityIcons name="fire" size={SIZES.iconSM} color="#9A3412" />
                    <Text style={styles.streakCurrentText}>
                      Jelenleg: <Text style={styles.streakBold}>{streakFreezes} db</Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.streakPriceContainer}>
                  <Text style={styles.streakPrice}>100</Text>
                  <View style={styles.streakPriceLabel}>
                    <MaterialCommunityIcons name="coin" size={12} color="#C2410C" />
                    <Text style={styles.streakPriceLabelText}>arany</Text>
                  </View>
                  <TouchableOpacity onPress={handlePurchaseStreakFreeze} style={styles.purchaseButton}>
                    <Text style={styles.purchaseButtonText}>Vásárlás</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Gold Purchase Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="coin" size={SIZES.iconBase} color="#EAB308" />
              <Text style={[styles.sectionTitle, { color: '#78350F' }]}>Arany vásárlása</Text>
            </View>

            <View style={styles.grid}>
              {[
                { amount: 100, price: 990 },
                { amount: 500, price: 4490 },
                { amount: 1000, price: 7990 },
                { amount: 5000, price: 34990, best: true },
              ].map((pack, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleGoldPurchase(pack.amount, pack.price)}
                  style={styles.goldCard}
                >
                  {pack.best && (
                    <View style={styles.bestBadge}>
                      <Text style={styles.bestBadgeText}>BEST</Text>
                    </View>
                  )}
                  <View style={styles.goldIconCircle}>
                    <MaterialCommunityIcons name="coin" size={SIZES.iconLG} color={COLORS.white} />
                  </View>
                  <Text style={styles.goldAmount}>{pack.amount.toLocaleString('hu-HU')}</Text>
                  <Text style={styles.goldLabel}>arany</Text>
                  <View style={styles.goldPriceButton}>
                    <MaterialCommunityIcons name="credit-card" size={14} color={COLORS.white} />
                    <Text style={styles.goldPriceText}>{pack.price.toLocaleString('hu-HU')} Ft</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Diamond Purchase Section */}
          <View style={[styles.section, { marginBottom: SPACING.xl }]}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="diamond-stone" size={SIZES.iconBase} color="#06B6D4" />
              <Text style={[styles.sectionTitle, { color: '#164E63' }]}>Gyémánt vásárlása aranyért</Text>
            </View>

            <View style={styles.grid}>
              {[
                { amount: 1, cost: 100 },
                { amount: 10, cost: 900 },
                { amount: 50, cost: 4000 },
                { amount: 100, cost: 7500, bonus: true },
              ].map((pack, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDiamondPurchase(pack.amount, pack.cost)}
                  style={styles.diamondCard}
                >
                  {pack.bonus && (
                    <View style={styles.bonusBadge}>
                      <Text style={styles.bonusBadgeText}>BONUS</Text>
                    </View>
                  )}
                  <View style={styles.diamondIconCircle}>
                    <MaterialCommunityIcons name="diamond-stone" size={SIZES.iconLG} color={COLORS.white} />
                  </View>
                  <Text style={styles.diamondAmount}>{pack.amount}</Text>
                  <Text style={styles.diamondLabel}>gyémánt</Text>
                  <View style={styles.diamondPriceButton}>
                    <MaterialCommunityIcons name="coin" size={14} color={COLORS.white} />
                    <Text style={styles.diamondPriceText}>{pack.cost} arany</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: 48,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.base,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTextContainer: { flex: 1 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  headerTitle: { fontSize: SIZES.fontXL, color: '#581C87', fontWeight: 'bold' },
  headerSubtitle: { fontSize: SIZES.fontSM, color: '#7E22CE' },
  scrollView: { flex: 1, paddingHorizontal: SPACING.base },
  balanceCard: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    marginBottom: SPACING.lg,
  },
  balanceText: { fontSize: SIZES.fontSM, color: COLORS.white, opacity: 0.9, marginBottom: SPACING.sm },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },
  balanceItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  balanceValue: { fontSize: SIZES.fontXL, color: COLORS.white, fontWeight: 'bold' },
  section: { marginBottom: SPACING.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  sectionTitle: { fontSize: SIZES.fontLG, color: '#7C2D12', fontWeight: 'bold' },
  streakCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 2,
    borderColor: '#FED7AA',
  },
  streakCardContent: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.base },
  streakTextContainer: { flex: 1 },
  streakTitle: { fontSize: SIZES.fontBase, color: '#7C2D12', fontWeight: 'bold', marginBottom: SPACING.sm },
  streakDescription: { fontSize: SIZES.fontSM, color: '#C2410C', marginBottom: SPACING.md },
  streakCurrent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  streakCurrentText: { fontSize: SIZES.fontSM, color: '#9A3412' },
  streakBold: { fontWeight: 'bold' },
  streakPriceContainer: { alignItems: 'center' },
  streakPrice: { fontSize: SIZES.font2XL, color: '#EA580C', fontWeight: 'bold', marginBottom: SPACING.sm },
  streakPriceLabel: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.sm },
  streakPriceLabelText: { fontSize: SIZES.fontXS, color: '#C2410C' },
  purchaseButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
  },
  purchaseButtonText: { color: COLORS.white, fontSize: SIZES.fontSM, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  goldCard: {
    width: '48%',
    backgroundColor: '#FEFCE8',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 2,
    borderColor: '#FDE047',
    alignItems: 'center',
  },
  bestBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: SIZES.radiusFull,
  },
  bestBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
  goldIconCircle: {
    width: 48,
    height: 48,
    backgroundColor: '#FBBF24',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  goldAmount: { fontSize: SIZES.font2XL, color: '#A16207', fontWeight: 'bold', marginBottom: 4 },
  goldLabel: { fontSize: SIZES.fontXS, color: '#CA8A04', marginBottom: SPACING.md },
  goldPriceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CA8A04',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: SIZES.radiusLG,
  },
  goldPriceText: { color: COLORS.white, fontSize: SIZES.fontXS, fontWeight: 'bold' },
  diamondCard: {
    width: '48%',
    backgroundColor: '#ECFEFF',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 2,
    borderColor: '#A5F3FC',
    alignItems: 'center',
  },
  bonusBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#9333EA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: SIZES.radiusFull,
  },
  bonusBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
  diamondIconCircle: {
    width: 48,
    height: 48,
    backgroundColor: '#22D3EE',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  diamondAmount: { fontSize: SIZES.font2XL, color: '#0E7490', fontWeight: 'bold', marginBottom: 4 },
  diamondLabel: { fontSize: SIZES.fontXS, color: '#0891B2', marginBottom: SPACING.md },
  diamondPriceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0891B2',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: SIZES.radiusLG,
  },
  diamondPriceText: { color: COLORS.white, fontSize: SIZES.fontXS, fontWeight: 'bold' },
});
