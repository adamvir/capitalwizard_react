import { motion } from 'motion/react';
import { Sparkles, Coins } from 'lucide-react';
import { getGameConfig } from '../utils/gameConfig';
import { useState, useEffect } from 'react';
import { COLORS, SIZES, SPACING, FONT_WEIGHT } from '../utils/styleConstants';

// ============================================
// WELCOMESCREEN KOMPONENS
// Üdvözlő képernyő első indításkor kezdő ajándékkal
// ============================================

// FIGYELEM: React Native konverzióhoz
// A motion/react helyett használd: react-native-reanimated vagy react-native-animatable
// Flutter-hez: AnimatedContainer, AnimatedOpacity, stb.

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  
  // ===== STATE MANAGEMENT =====
  
  // Kezdő arany mennyisége (config-ból betöltve)
  const [initialGold, setInitialGold] = useState(1000);

  // ===== EFFECTS =====
  
  // Kezdő arany betöltése game config-ból
  useEffect(() => {
    const config = getGameConfig();
    setInitialGold(config.initialGold);
  }, []);

  // ===== EVENT HANDLERS =====
  
  // Kezdés gomb klikk kezelése
  const handleGetStarted = () => {
    onGetStarted();
  };

  // ===== STYLES =====
  
  const styles = {
    // Fő container (teljes képernyő)
    container: {
      position: 'absolute' as const,
      inset: 0,
      zIndex: 50,
      backgroundImage: 'linear-gradient(to bottom, #581C87, #312E81, #0F172A)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING.xxxl,
    },
    
    // Háttér animációs réteg
    backgroundLayer: {
      position: 'absolute' as const,
      inset: 0,
      overflow: 'hidden' as const,
    },
    
    // Kristály lebegő elem
    floatingCrystal: {
      position: 'absolute' as const,
      width: 8,
      height: 8,
      backgroundColor: '#22D3EE',
      borderRadius: SIZES.radiusFull,
      boxShadow: `0 0 10px rgba(34, 211, 238, 0.5)`,
    },
    
    // Fő tartalom container
    mainContent: {
      position: 'relative' as const,
      zIndex: 10,
      textAlign: 'center' as const,
      maxWidth: 448,
    },
    
    // Logo/Cím terület
    logoArea: {
      marginBottom: SPACING.xxxl,
    },
    
    // Logo ikon container
    logoIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 96,
      height: 96,
      backgroundImage: 'linear-gradient(to bottom right, #A855F7, #4F46E5)',
      borderRadius: SIZES.radius2XL,
      boxShadow: `0 25px 50px -12px rgba(168, 85, 247, 0.5)`,
      marginBottom: SPACING.xl,
    },
    
    // Főcím
    title: {
      fontSize: 48,
      color: COLORS.white,
      marginBottom: SPACING.sm,
      letterSpacing: '0.025em',
    },
    
    // Elválasztó vonal
    divider: {
      width: 128,
      height: 4,
      backgroundImage: 'linear-gradient(to right, transparent, #22D3EE, transparent)',
      margin: '0 auto',
    },
    
    // Üdvözlő üzenet kártya
    welcomeCard: {
      backgroundImage: 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))',
      backdropFilter: 'blur(8px)',
      borderRadius: SIZES.radius2XL,
      padding: SPACING.xxxl,
      border: '1px solid rgba(168, 85, 247, 0.3)',
      boxShadow: `0 25px 50px -12px ${COLORS.shadowDark}`,
      marginBottom: SPACING.xxxl,
    },
    
    // Üdvözlő címsor
    welcomeTitle: {
      fontSize: SIZES.font2XL,
      color: COLORS.white,
      marginBottom: SPACING.base,
    },
    
    // Ajándék doboz container
    giftBox: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.base,
    },
    
    // Ajándék doboz ikon háttér
    giftIconBg: {
      backgroundImage: 'linear-gradient(to bottom right, #FBBF24, #F59E0B)',
      borderRadius: SIZES.radiusFull,
      padding: SPACING.xl,
      boxShadow: `0 25px 50px -12px rgba(251, 191, 36, 0.5)`,
    },
    
    // Ajándék szöveg
    giftText: {
      color: '#67E8F9',
      fontSize: SIZES.fontXL,
      marginBottom: SPACING.sm,
    },
    
    // Arany mennyiség sor
    goldAmountRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.sm,
      marginBottom: SPACING.base,
    },
    
    // Arany mennyiség szám
    goldAmount: {
      fontSize: 48,
      color: '#FBBF24',
    },
    
    // Arany szöveg
    goldText: {
      color: '#67E8F9',
      fontSize: SIZES.fontXL,
    },
    
    // Búcsú szöveg
    farewellText: {
      color: '#CBD5E1',
      marginTop: SPACING.xl,
      fontSize: SIZES.fontLG,
    },
    
    // Kezdés gomb
    startButton: {
      position: 'relative' as const,
      paddingLeft: 48,
      paddingRight: 48,
      paddingTop: SPACING.base,
      paddingBottom: SPACING.base,
      backgroundImage: 'linear-gradient(to right, #9333EA, #4F46E5)',
      color: COLORS.white,
      fontSize: SIZES.fontXL,
      borderRadius: SIZES.radiusFull,
      boxShadow: `0 25px 50px -12px rgba(147, 51, 234, 0.5)`,
      transition: 'all 0.2s',
      overflow: 'hidden' as const,
      border: 'none',
      cursor: 'pointer',
    },
    
    // Gomb szöveg (z-index miatt külön)
    buttonText: {
      position: 'relative' as const,
      zIndex: 10,
    },
    
    // Gomb fény effekt
    buttonShine: {
      position: 'absolute' as const,
      inset: 0,
      backgroundImage: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)',
    },
    
    // Hint szöveg
    hintText: {
      color: COLORS.gray400,
      fontSize: SIZES.fontSM,
      marginTop: SPACING.xl,
    },
    
    // Alsó glow effekt
    bottomGlow: {
      position: 'absolute' as const,
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 384,
      height: 384,
      backgroundColor: 'rgba(147, 51, 234, 0.3)',
      borderRadius: SIZES.radiusFull,
      filter: 'blur(96px)',
    },
  };

  return (
    <div style={styles.container}>
      {/* ANIMÁLT HÁTTÉR ELEMEK */}
      {/* MEGJEGYZÉS: React Native-ben ezeket react-native-reanimated-del kell megvalósítani */}
      <div style={styles.backgroundLayer}>
        {/* Lebegő kristályok */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              ...styles.floatingCrystal,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            initial={{
              opacity: 0.3,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
        
        {/* Csillogás effektek */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            style={{
              position: 'absolute',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            initial={{
              scale: 0,
              rotate: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          >
            <Sparkles style={{ width: 16, height: 16, color: '#FBBF24' }} />
          </motion.div>
        ))}
      </div>

      {/* FŐ TARTALOM */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={styles.mainContent}
      >
        {/* LOGO/CÍM TERÜLET */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={styles.logoArea}
        >
          <div style={styles.logoIcon}>
            <Sparkles style={{ width: 48, height: 48, color: COLORS.white }} />
          </div>
          
          <h1 style={styles.title}>
            CapitalWizard
          </h1>
          <div style={styles.divider} />
        </motion.div>

        {/* ÜDVÖZLŐ ÜZENET */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={styles.welcomeCard}
        >
          <h2 style={styles.welcomeTitle}>
            A CapitalWizard üdvözöl!
          </h2>
          
          {/* Ajándék doboz animáció */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.9, duration: 0.6, type: 'spring', stiffness: 200 }}
            style={styles.giftBox}
          >
            <div style={styles.giftIconBg}>
              <Coins style={{ width: 48, height: 48, color: '#78350F' }} />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <p style={styles.giftText}>
              Kezdésnek adunk
            </p>
            <div style={styles.goldAmountRow}>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: 'spring', stiffness: 300 }}
                style={styles.goldAmount}
              >
                {initialGold.toLocaleString('hu-HU')}
              </motion.span>
              <Coins style={{ width: 32, height: 32, color: '#FBBF24' }} />
            </div>
            <p style={styles.goldText}>
              arany ajándékot!
            </p>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            style={styles.farewellText}
          >
            Jó szórakozást!
          </motion.p>
        </motion.div>

        {/* KEZDÉS GOMB */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.6 }}
          onClick={handleGetStarted}
          style={styles.startButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #7C3AED, #4338CA)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #9333EA, #4F46E5)';
          }}
          type="button"
        >
          <span style={styles.buttonText}>Kezdjük!</span>
          
          {/* Gomb fény effekt */}
          <motion.div
            style={styles.buttonShine}
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'linear',
              repeatDelay: 1,
            }}
          />
        </motion.button>
        
        {/* HINT SZÖVEG */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          style={styles.hintText}
        >
          Tapasztalj meg egy izgalmas pénzügyi kalandot
        </motion.p>
      </motion.div>

      {/* ALSÓ GLOW EFFEKT */}
      <div style={styles.bottomGlow} />
    </div>
  );
}
