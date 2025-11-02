// ============================================
// WELCOMESCREEN KOMPONENS
// Üdvözlő képernyő első indításkor kezdő ajándékkal
// ============================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getGameConfig } from '../utils/gameConfig';
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS } from '../utils/styleConstants';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  // ===== STATE MANAGEMENT =====
  const [initialGold, setInitialGold] = useState(1000);

  // ===== ANIMATION VALUES =====
  const containerOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0);
  const cardScale = useSharedValue(0.8);
  const cardOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const giftScale = useSharedValue(0);
  const goldScale = useSharedValue(0);

  // ===== EFFECTS =====
  useEffect(() => {
    // Load initial gold from config
    loadGameConfig();

    // Start animations
    containerOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withSpring(1, { damping: 10, stiffness: 100 });

    cardOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    cardScale.value = withDelay(300, withSpring(1, { damping: 12 }));

    giftScale.value = withDelay(900, withSpring(1, { damping: 10 }));
    goldScale.value = withDelay(1500, withSpring(1, { damping: 15 }));

    buttonOpacity.value = withDelay(2100, withTiming(1, { duration: 600 }));

    // Auto navigate after 5 seconds (optional)
    const timer = setTimeout(() => {
      handleGetStarted();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const loadGameConfig = async () => {
    try {
      const config = await getGameConfig();
      setInitialGold(config.initialGold);
    } catch (error) {
      console.error('Error loading game config:', error);
    }
  };

  // ===== EVENT HANDLERS =====
  const handleGetStarted = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  // ===== ANIMATED STYLES =====
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const giftAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: giftScale.value }],
  }));

  const goldAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: goldScale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#581C87', '#312E81', '#0F172A']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, containerAnimatedStyle]}>
        {/* LOGO/CÍM TERÜLET */}
        <Animated.View style={[styles.logoArea, logoAnimatedStyle]}>
          <LinearGradient
            colors={['#A855F7', '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoIcon}
          >
            <MaterialCommunityIcons name="shimmer" size={48} color={COLORS.white} />
          </LinearGradient>

          <Text style={styles.title}>CapitalWizard</Text>

          <View style={styles.divider} />
        </Animated.View>

        {/* ÜDVÖZLŐ ÜZENET */}
        <Animated.View style={[styles.welcomeCard, cardAnimatedStyle]}>
          <LinearGradient
            colors={['rgba(30, 41, 59, 0.9)', 'rgba(15, 23, 42, 0.9)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <Text style={styles.welcomeTitle}>A CapitalWizard üdvözöl!</Text>

            {/* Ajándék doboz animáció */}
            <Animated.View style={[styles.giftBox, giftAnimatedStyle]}>
              <LinearGradient
                colors={['#FBBF24', '#F59E0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.giftIconBg}
              >
                <MaterialCommunityIcons name="currency-usd" size={48} color="#78350F" />
              </LinearGradient>
            </Animated.View>

            <Text style={styles.giftText}>Kezdésnek adunk</Text>

            {/* Arany mennyiség */}
            <Animated.View style={[styles.goldAmountRow, goldAnimatedStyle]}>
              <Text style={styles.goldAmount}>
                {initialGold.toLocaleString('hu-HU')}
              </Text>
              <MaterialCommunityIcons name="currency-usd" size={32} color="#FBBF24" />
            </Animated.View>

            <Text style={styles.goldText}>arany ajándékot!</Text>

            <Text style={styles.farewellText}>Jó szórakozást!</Text>
          </LinearGradient>
        </Animated.View>

        {/* KEZDÉS GOMB */}
        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity
            onPress={handleGetStarted}
            activeOpacity={0.8}
            style={styles.startButtonContainer}
          >
            <LinearGradient
              colors={['#9333EA', '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButton}
            >
              <Text style={styles.buttonText}>Kezdjük!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* HINT SZÖVEG */}
        <Animated.Text style={[styles.hintText, buttonAnimatedStyle]}>
          Tapasztalj meg egy izgalmas pénzügyi kalandot
        </Animated.Text>
      </Animated.View>

      {/* ALSÓ GLOW EFFEKT */}
      <View style={styles.bottomGlow} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 448,
    width: '100%',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoIcon: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius2XL,
    marginBottom: SPACING.xl,
    ...SHADOWS.xl,
  },
  title: {
    fontSize: 48,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.5,
  },
  divider: {
    width: 128,
    height: 4,
    backgroundColor: '#22D3EE',
    opacity: 0.5,
  },
  welcomeCard: {
    width: '100%',
    marginBottom: SPACING.xxxl,
    borderRadius: SIZES.radius2XL,
    overflow: 'hidden',
    ...SHADOWS.xl,
  },
  cardGradient: {
    padding: SPACING.xxxl,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    borderRadius: SIZES.radius2XL,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: SIZES.font2XL,
    color: COLORS.white,
    marginBottom: SPACING.base,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
  },
  giftBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.base,
  },
  giftIconBg: {
    borderRadius: SIZES.radiusFull,
    padding: SPACING.xl,
    ...SHADOWS.large,
  },
  giftText: {
    color: '#67E8F9',
    fontSize: SIZES.fontXL,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  goldAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.base,
  },
  goldAmount: {
    fontSize: 48,
    color: '#FBBF24',
    fontWeight: FONT_WEIGHT.bold,
    marginRight: SPACING.sm,
  },
  goldText: {
    color: '#67E8F9',
    fontSize: SIZES.fontXL,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  farewellText: {
    color: '#CBD5E1',
    fontSize: SIZES.fontLG,
    textAlign: 'center',
  },
  startButtonContainer: {
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  startButton: {
    paddingHorizontal: 48,
    paddingVertical: SPACING.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    fontWeight: FONT_WEIGHT.bold,
  },
  hintText: {
    color: COLORS.gray400,
    fontSize: SIZES.fontSM,
    marginTop: SPACING.xl,
    textAlign: 'center',
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    width: 384,
    height: 384,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
    borderRadius: SIZES.radiusFull,
  },
});
