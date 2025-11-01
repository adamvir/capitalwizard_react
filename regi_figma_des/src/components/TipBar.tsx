import { Lightbulb } from 'lucide-react';
import { useState, useEffect, CSSProperties } from 'react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

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

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  container: {
    position: 'absolute',
    bottom: 196,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingLeft: SPACING.base,
    paddingRight: SPACING.base,
  },
  card: {
    background: 'linear-gradient(to right, rgba(107, 33, 168, 0.4), rgba(30, 64, 175, 0.4))',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: SIZES.radiusXL,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingLeft: SPACING.base,
    paddingRight: SPACING.base,
    paddingTop: 10,
    paddingBottom: 10,
  },
  iconContainer: {
    flexShrink: 0,
  },
  label: {
    color: '#FBBF24',
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  text: {
    color: COLORS.white,
    whiteSpace: 'nowrap',
    animation: 'marquee 20s linear infinite',
  },
};

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
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.content}>
          {/* Lightbulb icon */}
          <div style={styles.iconContainer}>
            <Lightbulb style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#FBBF24' }} />
          </div>
          
          {/* Tip label */}
          <span style={styles.label}>Tipp:</span>
          
          {/* Tip text container */}
          {/* NAVIGATION NOTE: This marquee animation uses CSS keyframes defined in globals.css */}
          {/* For React Native, use react-native-marquee or similar library */}
          <div style={styles.textContainer}>
            <div
              key={animationKey}
              style={styles.text}
            >
              {currentTip}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
