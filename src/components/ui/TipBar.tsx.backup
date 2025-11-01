import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, SIZES } from '../../utils/styleConstants';

const tips = [
  "A részvények hosszú távon általában felülmúlják a kötvények teljesítményét.",
  "Diverzifikáció: Ne tedd minden tojásodat egy kosárba!",
  "Warren Buffett: 'Az ár az, amit fizetsz. Az érték az, amit kapsz.'",
  "A kamatos kamat a világ nyolcadik csodája - Albert Einstein",
  "Befektetés előtt mindig végezz alapos kutatást!",
  "Az ETF-ek kiváló lehetőséget kínálnak a diverzifikált portfólióhoz.",
  "Soha ne fektess be olyan pénzt, amire szükséged lehet rövidtávon.",
  "A kockázat és a hozam mindig együtt járnak.",
  "Reguláris megtakarítás: A legfontosabb az első lépés!",
  "A türelem a befektető legjobb barátja.",
  "Ne hagyd, hogy az érzelmek vezéreljenek a befektetési döntéseidben.",
  "Az infláció lassan, de biztosan csökkenti a készpénz értékét.",
  "Befektetési időhorizont: Minél hosszabb, annál jobb.",
  "A tanulás soha nem áll meg - folyamatosan képezd magad!",
  "Kockázatkezelés: Soha ne kockáztass többet, mint amennyit elveszíthetsz.",
  "Osztalékbefektetés: Passzív jövedelem generálása részvényekből.",
  "A piaci volatilitás normális jelenség - ne ess pánikba!",
  "Dollar-cost averaging: Rendszeres befektetés csökkenti az időzítési kockázatot.",
  "Sürgősségi alap: Tarts fenn 3-6 havi kiadásra elegendő tartalékot.",
  "Az adók hatással vannak a befektetési hozamaidra - tervezz előre!",
  "Index alapok: Alacsony költségű befektetés a teljes piacba.",
  "Ne próbálj időzíteni a piacot - szinte senki sem képes rá következetesen.",
  "Vállalati kötvények: Magasabb hozam, magasabb kockázat.",
  "Részvény opciók nagy kockázattal járnak - csak tapasztalt befektetőknek!",
  "A diverzifikáció nemcsak eszközosztályokra, hanem földrajzilag is fontos.",
  "Befektetési célok meghatározása az első lépés minden stratégiában.",
  "A befektetési költségek évtizedek alatt milliókat emészthetnek fel.",
  "Rebalancing: Tartsd fenn a célportfóliód arányait!",
  "Ne kövess vak tippeket - végezd el a saját kutatásodat!",
  "A múltbeli teljesítmény nem garantálja a jövőbeli eredményeket.",
  "Tanulj a hibáidból, de ne hagyd, hogy megbénítsanak.",
  "Kezdd el fiatalon: Az idő a legnagyobb szövetségesed a befektetésben.",
  "Kötvények: Stabilitás és rendszeres jövedelem a portfólióban.",
  "Kriptovaluták: Magas kockázat, nagy volatilitás - csak okosan!",
  "Ingatlan befektetés: Kézzelfogható eszköz, de alacsony likviditás."
];

export function TipBar() {
  const [currentTip, setCurrentTip] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Select random tip on mount
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(randomTip);

    // Change tip every 20 seconds (matching animation duration)
    const interval = setInterval(() => {
      const newTip = tips[Math.floor(Math.random() * tips.length)];
      setCurrentTip(newTip);
      setAnimationKey(prev => prev + 1);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(107, 33, 168, 0.4)', 'rgba(30, 64, 175, 0.4)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        <View style={styles.content}>
          {/* Lightbulb icon */}
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={SIZES.iconBase}
              color="#FBBF24"
            />
          </View>

          {/* Tip label */}
          <Text style={styles.label}>Tipp:</Text>

          {/* Tip text container */}
          {/* NOTE: For marquee animation, use react-native-marquee or react-native-text-ticker */}
          <View style={styles.textContainer}>
            <Text
              key={animationKey}
              style={styles.text}
              numberOfLines={1}
            >
              {currentTip}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 196,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: SPACING.base,
  },
  card: {
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    borderRadius: SIZES.radiusXL,
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Shadow for Android
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: 10,
  },
  iconContainer: {
    flexShrink: 0,
    marginRight: SPACING.sm,
  },
  label: {
    color: '#FBBF24',
    flexShrink: 0,
    marginRight: SPACING.sm,
    fontSize: SIZES.fontBase,
  },
  textContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  text: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
  },
});
