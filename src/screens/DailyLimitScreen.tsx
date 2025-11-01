import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface DailyLimitScreenProps {
  navigation: any;
  route?: {
    params?: {
      limitType?: 'lessons' | 'arena';
      subscriptionTier?: 'free' | 'pro' | 'master';
    };
  };
}

export default function DailyLimitScreen({ navigation, route }: DailyLimitScreenProps) {
  const limitType = route?.params?.limitType || 'lessons';
  const subscriptionTier = route?.params?.subscriptionTier || 'free';
  const [timeUntilReset, setTimeUntilReset] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilReset(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const limitInfo =
    limitType === 'lessons'
      ? {
          title: 'Napi lecke limit elérve',
          description: 'Elérted a napi 3 lecke limitet az ingyenes csomaggal.',
          emoji: '📚',
        }
      : {
          title: 'Napi küzdőtér limit elérve',
          description: 'Elérted a napi 5 játék limitet az ingyenes csomaggal.',
          emoji: '⚔️',
        };

  const handleUpgrade = () => {
    navigation.navigate('Subscription');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F172A', 'rgba(88, 28, 135, 0.4)', '#0F172A']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconGlow} />
            <View style={styles.iconCircle}>
              <Text style={styles.emoji}>{limitInfo.emoji}</Text>
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{limitInfo.title}</Text>
            <Text style={styles.description}>{limitInfo.description}</Text>
          </View>

          {/* Timer Card */}
          <View style={styles.timerCard}>
            <View style={styles.timerHeader}>
              <MaterialCommunityIcons name="clock-outline" size={SIZES.iconBase} color="#22D3EE" />
              <Text style={styles.timerTitle}>Reset időpontja</Text>
            </View>
            <View style={styles.timerContent}>
              <Text style={styles.timerDisplay}>{timeUntilReset}</Text>
              <Text style={styles.timerSubtext}>Holnap éjfélkor újra tudsz játszani</Text>
            </View>
          </View>

          {/* Upgrade Section */}
          <View style={styles.upgradeSection}>
            <Text style={styles.upgradeIntro}>Vagy válts prémium csomagra korlátlan játékért:</Text>

            {/* Pro Plan */}
            <TouchableOpacity onPress={handleUpgrade}>
              <LinearGradient colors={['#2563EB', '#06B6D4']} style={styles.upgradeButton}>
                <View style={styles.upgradeButtonContent}>
                  <View style={styles.upgradeButtonLeft}>
                    <View style={styles.upgradeIconCircle}>
                      <MaterialCommunityIcons name="star" size={SIZES.iconBase} color={COLORS.white} />
                    </View>
                    <View style={styles.upgradeTextLeft}>
                      <Text style={styles.upgradePlanName}>Pro csomag</Text>
                      <Text style={styles.upgradePlanDesc}>Korlátlan hozzáférés</Text>
                    </View>
                  </View>
                  <View style={styles.upgradeTextRight}>
                    <Text style={styles.upgradePrice}>4,990 Ft</Text>
                    <Text style={styles.upgradePeriod}>/hó</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Master Plan */}
            <TouchableOpacity onPress={handleUpgrade}>
              <LinearGradient colors={['#9333EA', '#EC4899']} style={styles.upgradeButton}>
                <View style={styles.upgradeButtonContent}>
                  <View style={styles.upgradeButtonLeft}>
                    <View style={styles.upgradeIconCircle}>
                      <MaterialCommunityIcons name="crown" size={SIZES.iconBase} color={COLORS.white} />
                    </View>
                    <View style={styles.upgradeTextLeft}>
                      <Text style={styles.upgradePlanName}>Master csomag</Text>
                      <Text style={styles.upgradePlanDesc}>Minden funkció + VIP előnyök</Text>
                    </View>
                  </View>
                  <View style={styles.upgradeTextRight}>
                    <Text style={styles.upgradePrice}>9,990 Ft</Text>
                    <Text style={styles.upgradePeriod}>/hó</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
            <Text style={styles.backButtonText}>Vissza a főoldalra</Text>
          </TouchableOpacity>

          {/* Benefits List */}
          <View style={styles.benefitsCard}>
            <View style={styles.benefitsHeader}>
              <MaterialCommunityIcons name="lightning-bolt" size={SIZES.iconSM} color="#FBBF24" />
              <Text style={styles.benefitsTitle}>Prémium előnyök:</Text>
            </View>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <View style={styles.bulletGreen} />
                <Text style={styles.benefitText}>Korlátlan leckék naponta</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.bulletGreen} />
                <Text style={styles.benefitText}>Korlátlan küzdőtér játékok</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.bulletGreen} />
                <Text style={styles.benefitText}>Exkluzív tartalmak</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.bulletGreen} />
                <Text style={styles.benefitText}>Gyorsabb haladás</Text>
              </View>
              {subscriptionTier === 'free' && (
                <View style={styles.benefitItem}>
                  <View style={styles.bulletPurple} />
                  <Text style={styles.vipText}>Master: VIP támogatás</Text>
                </View>
              )}
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
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingTop: 80,
  },
  iconContainer: { position: 'relative', marginBottom: SPACING.md },
  iconGlow: {
    position: 'absolute',
    width: 128,
    height: 128,
    backgroundColor: '#9333EA',
    borderRadius: 64,
    opacity: 0.3,
  },
  iconCircle: {
    width: 128,
    height: 128,
    backgroundColor: '#1E293B',
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  emoji: { fontSize: 64 },
  titleSection: { alignItems: 'center', gap: SPACING.sm },
  title: {
    fontSize: SIZES.font2XL,
    color: '#C084FC',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: SIZES.fontSM,
    color: '#CBD5E1',
    textAlign: 'center',
    maxWidth: 320,
  },
  timerCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: SIZES.radius2XL,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    width: '100%',
    maxWidth: 384,
  },
  timerHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.base },
  timerTitle: { fontSize: SIZES.fontBase, color: COLORS.white, fontWeight: 'bold' },
  timerContent: { alignItems: 'center' },
  timerDisplay: {
    fontSize: SIZES.font5XL,
    color: COLORS.white,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  timerSubtext: { fontSize: SIZES.fontSM, color: '#94A3B8' },
  upgradeSection: { gap: SPACING.md, width: '100%', maxWidth: 384 },
  upgradeIntro: { fontSize: SIZES.fontSM, color: '#CBD5E1', textAlign: 'center', marginBottom: SPACING.sm },
  upgradeButton: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  upgradeButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  upgradeButtonLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  upgradeIconCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeTextLeft: {},
  upgradePlanName: { fontSize: SIZES.fontBase, color: COLORS.white, fontWeight: 'bold' },
  upgradePlanDesc: { fontSize: SIZES.fontXS, color: COLORS.white, opacity: 0.9 },
  upgradeTextRight: { alignItems: 'flex-end' },
  upgradePrice: { fontSize: SIZES.fontBase, color: COLORS.white, fontWeight: 'bold' },
  upgradePeriod: { fontSize: SIZES.fontXS, color: COLORS.white, opacity: 0.9 },
  backButtonContainer: { marginTop: SPACING.md },
  backButtonText: { fontSize: SIZES.fontSM, color: '#94A3B8', textDecorationLine: 'underline' },
  benefitsCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    width: '100%',
    maxWidth: 384,
  },
  benefitsHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  benefitsTitle: { fontSize: SIZES.fontSM, color: COLORS.white, fontWeight: '600' },
  benefitsList: { gap: 6 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  bulletGreen: { width: 6, height: 6, backgroundColor: '#4ADE80', borderRadius: 3 },
  bulletPurple: { width: 6, height: 6, backgroundColor: '#C084FC', borderRadius: 3 },
  benefitText: { fontSize: SIZES.fontXS, color: '#CBD5E1' },
  vipText: { fontSize: SIZES.fontXS, color: '#D8B4FE' },
});
