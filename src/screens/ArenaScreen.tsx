import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, SIZES, FONT_WEIGHT } from '../utils/styleConstants';

interface ArenaScreenProps {
  navigation: any;
  route: {
    params: {
      coins: number;
      onCoinsChange: (newCoins: number) => void;
      subscriptionTier?: 'free' | 'pro' | 'master';
    };
  };
}

interface RentedBook {
  title: string;
  rentedUntil: number;
  daysRented: number;
  color: string;
  textColor: string;
}

type TabType = 'numbers' | 'soon1' | 'soon2';

export default function ArenaScreen({ navigation, route }: ArenaScreenProps) {
  const { coins, onCoinsChange, subscriptionTier = 'free' } = route.params;
  const [activeTab, setActiveTab] = useState<TabType>('numbers');
  const [betAmount, setBetAmount] = useState<number>(50);
  const [rentedBooks, setRentedBooks] = useState<RentedBook[]>([]);
  const maxBet = Math.min(coins, 500);

  useEffect(() => {
    loadRentedBooks();
  }, []);

  const loadRentedBooks = async () => {
    try {
      const saved = await AsyncStorage.getItem('rentedBooks');
      if (saved) {
        const parsed: RentedBook[] = JSON.parse(saved);
        const active = parsed.filter(book => book.rentedUntil > Date.now());
        setRentedBooks(active);
      }
    } catch (error) {
      console.error('Error loading rented books:', error);
    }
  };

  const startGame = () => {
    console.log('Starting game with bet:', betAmount);
  };

  return (
    <View style={styles.container}>
      {/* Semi-transparent overlay */}
      <View style={styles.overlay} />

      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#7C3AED', '#9333EA', '#A855F7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <MaterialCommunityIcons name="crown" size={22} color="#FBBF24" />
            <Text style={styles.headerTitle}>Küzdőtér</Text>
          </View>
          <View style={styles.headerCoins}>
            <MaterialCommunityIcons name="lightning-bolt" size={18} color="#FBBF24" />
            <Text style={styles.headerCoinsText}>{coins}</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('numbers')}
          style={styles.tab}
        >
          {activeTab === 'numbers' ? (
            <LinearGradient
              colors={['#EC4899', '#D946EF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tabActiveGradient}
            >
              <MaterialCommunityIcons name="fire" size={18} color={COLORS.white} />
              <Text style={styles.tabActiveText}>Számok</Text>
            </LinearGradient>
          ) : (
            <View style={styles.tabInactive}>
              <MaterialCommunityIcons name="fire" size={18} color="#64748B" />
              <Text style={styles.tabInactiveText}>Számok</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('soon1')}
          style={styles.tab}
          disabled
        >
          <View style={styles.tabInactive}>
            <MaterialCommunityIcons name="chart-line" size={18} color="#64748B" />
            <Text style={styles.tabInactiveText}>Hamarosan</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('soon2')}
          style={styles.tab}
          disabled
        >
          <View style={styles.tabInactive}>
            <MaterialCommunityIcons name="chart-bar" size={18} color="#64748B" />
            <Text style={styles.tabInactiveText}>Hamarosan</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Betting Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="trophy" size={22} color="#FBBF24" />
            <Text style={styles.cardTitle}>Válassz tétet</Text>
          </View>

          {/* Slider */}
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={10}
              maximumValue={maxBet}
              step={10}
              value={betAmount}
              onValueChange={setBetAmount}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#475569"
              thumbTintColor="#60A5FA"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelMin}>10</Text>
              <Text style={styles.sliderLabelCurrent}>{betAmount}</Text>
              <Text style={styles.sliderLabelMax}>500</Text>
            </View>
          </View>

          {/* Quick bet buttons */}
          <View style={styles.quickBetGrid}>
            {[50, 100, 200, 500].map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => setBetAmount(Math.min(amount, maxBet))}
                style={[
                  styles.quickBetButton,
                  betAmount === amount && styles.quickBetButtonActive
                ]}
              >
                <Text style={styles.quickBetButtonText}>{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Start button */}
          <TouchableOpacity onPress={startGame} style={styles.startButton}>
            <LinearGradient
              colors={['#DC2626', '#EA580C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButtonGradient}
            >
              <MaterialCommunityIcons name="sword-cross" size={22} color={COLORS.white} />
              <Text style={styles.startButtonText}>Küzdelem kezdése</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Rules Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="star-outline" size={22} color="#C084FC" />
            <Text style={styles.cardTitle}>Szabályok</Text>
          </View>
          <View style={styles.rulesList}>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.ruleText}>10 kérdés • Tippeld a számot</Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.ruleText}>Közelebb = nyersz</Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={[styles.ruleBullet, { color: '#4ADE80' }]}>•</Text>
              <Text style={[styles.ruleText, { color: '#4ADE80' }]}>Győzelem: +50</Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={[styles.ruleBullet, { color: '#F87171' }]}>•</Text>
              <Text style={[styles.ruleText, { color: '#F87171' }]}>Vereség: -50</Text>
            </View>
          </View>
        </View>

        {/* Rented Books Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.booksHeaderLeft}>
              <View style={styles.booksIcon}>
                <MaterialCommunityIcons name="book-open-variant" size={22} color="#60A5FA" />
              </View>
              <Text style={styles.cardTitle}>Kölcsönzött könyvek</Text>
            </View>
            <View style={styles.booksCounter}>
              <Text style={styles.booksCounterText}>0/0</Text>
            </View>
          </View>

          <View style={styles.noBooksContainer}>
            <Text style={styles.noBooksTitle}>Nincs kölcsönzött könyv</Text>
            <Text style={styles.noBooksSubtitle}>
              Küzdőtérben csak a kölcsönzött könyvek kérdéseit kapod
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  header: {
    marginTop: 48,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: 14,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
  },
  headerCoins: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  headerCoinsText: {
    color: '#FBBF24',
    fontSize: 16,
    fontWeight: FONT_WEIGHT.bold,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: 10,
  },
  tab: {
    flex: 1,
  },
  tabActiveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 24,
  },
  tabActiveText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: FONT_WEIGHT.semibold,
  },
  tabInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  tabInactiveText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: FONT_WEIGHT.semibold,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
  },
  card: {
    backgroundColor: 'rgba(51, 65, 85, 0.85)',
    borderRadius: 20,
    padding: 18,
    marginBottom: SPACING.base,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: FONT_WEIGHT.bold,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: -8,
  },
  sliderLabelMin: {
    color: '#94A3B8',
    fontSize: 13,
  },
  sliderLabelCurrent: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: FONT_WEIGHT.bold,
  },
  sliderLabelMax: {
    color: '#94A3B8',
    fontSize: 13,
  },
  quickBetGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  quickBetButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#3B4A5A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickBetButtonActive: {
    borderColor: '#3B82F6',
  },
  quickBetButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: FONT_WEIGHT.semibold,
  },
  startButton: {
    marginTop: 2,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: FONT_WEIGHT.bold,
  },
  rulesList: {
    gap: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  ruleBullet: {
    color: '#CBD5E1',
    fontSize: 16,
    lineHeight: 22,
  },
  ruleText: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  booksHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  booksIcon: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  booksCounter: {
    backgroundColor: 'rgba(99, 102, 241, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  booksCounterText: {
    color: '#A5B4FC',
    fontSize: 13,
    fontWeight: FONT_WEIGHT.semibold,
  },
  noBooksContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noBooksTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: 8,
  },
  noBooksSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
