/**
 * ============================================
 * TIPBAR - REACT NATIVE VERSION
 * ============================================
 *
 * Displays rotating financial tips with marquee animation
 * - Random tip selection
 * - Auto-rotation every 20s
 * - Lightbulb icon
 * - Gradient background
 * - Marquee text animation (Animated API)
 *
 * HASZNÁLAT:
 * cp exports/TipBar.rn.tsx src/components/TipBar.tsx
 *
 * FÜGGŐSÉGEK:
 * npm install expo-linear-gradient
 * npm install lucide-react-native
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lightbulb } from 'lucide-react-native';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  yellow: '#FBBF24',
  purple: 'rgba(107, 33, 168, 0.4)',
  blue: 'rgba(30, 64, 175, 0.4)',
  purpleBorder: 'rgba(168, 85, 247, 0.3)',
};

const SPACING = {
  xs: 4,
  sm: 8,
  base: 16,
};

const SIZES = {
  iconBase: 20,
  radiusXL: 16,
  fontSize: 14,
};

// ============================================
// TIPS DATA (35 pénzügyi tanács)
// ============================================

const TIPS = [
  'A részvények hosszú távon általában felülmúlják a kötvények teljesítményét.',
  'Diverzifikáció: Ne tedd minden tojásodat egy kosárba!',
  "Warren Buffett: 'Az ár az, amit fizetsz. Az érték az, amit kapsz.'",
  'A kamatos kamat a világ nyolcadik csodája - Albert Einstein',
  'Befektetés előtt mindig végezz alapos kutatást!',
  'Az ETF-ek kiváló lehetőséget kínálnak a diverzifikált portfólióhoz.',
  'Soha ne fektess be olyan pénzt, amire szükséged lehet rövidtávon.',
  'A kockázat és a hozam mindig együtt járnak.',
  'Reguláris megtakarítás: A legfontosabb az első lépés!',
  'A türelem a befektető legjobb barátja.',
  'Ne hagyd, hogy az érzelmek vezéreljenek a befektetési döntéseidben.',
  'Az infláció lassan, de biztosan csökkenti a készpénz értékét.',
  'Befektetési időhorizont: Minél hosszabb, annál jobb.',
  'A tanulás soha nem áll meg - folyamatosan képezd magad!',
  'Kockázatkezelés: Soha ne kockáztass többet, mint amennyit elveszíthetsz.',
  'Osztalékbefektetés: Passzív jövedelem generálása részvényekből.',
  'A piaci volatilitás normális jelenség - ne ess pánikba!',
  'Dollar-cost averaging: Rendszeres befektetés csökkenti az időzítési kockázatot.',
  'Sürgősségi alap: Tarts fenn 3-6 havi kiadásra elegendő tartalékot.',
  'Az adók hatással vannak a befektetési hozamaidra - tervezz előre!',
  'Index alapok: Alacsony költségű befektetés a teljes piacba.',
  'Ne próbálj időzíteni a piacot - szinte senki sem képes rá következetesen.',
  'Vállalati kötvények: Magasabb hozam, magasabb kockázat.',
  'Részvény opciók nagy kockázattal járnak - csak tapasztalt befektetőknek!',
  'A diverzifikáció nemcsak eszközosztályokra, hanem földrajzilag is fontos.',
  'Befektetési célok meghatározása az első lépés minden stratégiában.',
  'A befektetési költségek évtizedek alatt milliókat emészthetnek fel.',
  'Rebalancing: Tartsd fenn a célportfóliód arányait!',
  'Ne kövess vak tippeket - végezd el a saját kutatásodat!',
  'A múltbeli teljesítmény nem garantálja a jövőbeli eredményeket.',
  'Tanulj a hibáidból, de ne hagyd, hogy megbénítsanak.',
  'Kezdd el fiatalon: Az idő a legnagyobb szövetségesed a befektetésben.',
  'Kötvények: Stabilitás és rendszeres jövedelem a portfólióban.',
  'Kriptovaluták: Magas kockázat, nagy volatilitás - csak okosan!',
  'Ingatlan befektetés: Kézzelfogható eszköz, de alacsony likviditás.',
];

// ============================================
// COMPONENT
// ============================================

export function TipBar() {
  const [currentTip, setCurrentTip] = useState('');
  const scrollX = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    // Select random tip on mount
    const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
    setCurrentTip(randomTip);

    // Change tip every 20 seconds
    const interval = setInterval(() => {
      const newTip = TIPS[Math.floor(Math.random() * TIPS.length)];
      setCurrentTip(newTip);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Start/restart marquee animation when tip changes
  useEffect(() => {
    if (currentTip) {
      scrollX.setValue(0); // Reset position
      startMarqueeAnimation();
    }
  }, [currentTip]);

  const startMarqueeAnimation = () => {
    // Animate from right to left continuously
    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -screenWidth * 2, // Scroll 2x screen width for full text visibility
        duration: 40000, // 40 seconds (slow and smooth)
        useNativeDriver: true,
      })
    ).start();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.purple, COLORS.blue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.card}>
          <View style={styles.content}>
            {/* Lightbulb icon */}
            <View style={styles.iconContainer}>
              <Lightbulb size={SIZES.iconBase} color={COLORS.yellow} />
            </View>

            {/* Tip label */}
            <Text style={styles.label}>Tipp:</Text>

            {/* Tip text with marquee animation */}
            <View style={styles.textContainer}>
              <Animated.Text
                style={[
                  styles.text,
                  {
                    transform: [{ translateX: scrollX }],
                  },
                ]}
              >
                {currentTip}    •    {currentTip}
              </Animated.Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 196,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: SPACING.base,
  },
  gradient: {
    borderRadius: SIZES.radiusXL,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Shadow for Android
    elevation: 4,
  },
  card: {
    overflow: 'hidden',
    borderRadius: SIZES.radiusXL,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: 10,
    gap: SPACING.sm,
  },
  iconContainer: {
    flexShrink: 0,
  },
  label: {
    color: COLORS.yellow,
    fontSize: SIZES.fontSize,
    fontWeight: '600',
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    overflow: 'hidden',
    height: 20, // Fix height to prevent text wrapping to multiple lines
  },
  text: {
    color: COLORS.white,
    fontSize: SIZES.fontSize,
    lineHeight: 20, // Match container height for vertical centering
    width: 2000, // Wide enough to hold duplicated text without wrapping
  },
});
