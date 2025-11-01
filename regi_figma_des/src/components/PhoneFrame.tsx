import { COLORS, PHONE_DIMENSIONS, SPACING, SIZES } from '../utils/styleConstants';

// ============================================
// PHONEFRAME KOMPONENS
// iPhone 16 Pro Max keret megjelenítése
// ============================================

interface PhoneFrameProps {
  children: React.ReactNode;
  showDynamicIsland?: boolean;
}

export function PhoneFrame({ children, showDynamicIsland = true }: PhoneFrameProps) {
  
  // ===== STYLES =====
  // Stílusok a komponens alján a könnyű konvertálhatóság érdekében
  
  const styles = {
    // Container (külső wrapper)
    container: {
      position: 'relative' as const,
    },
    
    // iPhone keret (telefon teste)
    phoneFrame: {
      position: 'relative' as const,
      width: 450,
      height: 920,
      backgroundColor: COLORS.gray800,
      borderRadius: 60,
      padding: SPACING.md,
      boxShadow: `0 25px 50px -12px ${COLORS.shadowDark}`,
    },
    
    // Belső keret (kijelző körüli fekete szegély)
    innerBezel: {
      position: 'relative' as const,
      width: '100%',
      height: '100%',
      backgroundColor: COLORS.black,
      borderRadius: 48,
      overflow: 'hidden' as const,
    },
    
    // Dynamic Island (felső kivágás iPhone 16 Pro Max-en)
    dynamicIsland: {
      position: 'absolute' as const,
      top: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 120,
      height: 35,
      backgroundColor: COLORS.black,
      borderRadius: SIZES.radiusFull,
      zIndex: 30,
      border: `1px solid ${COLORS.gray800}`,
    },
    
    // Képernyő tartalom (tényleges app megjelenítése)
    screenContent: {
      position: 'relative' as const,
      width: '100%',
      height: '100%',
      backgroundColor: COLORS.white,
      overflowY: 'auto' as const,
    },
    
    // Oldalsó gombok
    // Hangerő gombok
    volumeButtonTop: {
      position: 'absolute' as const,
      left: 0,
      top: 180,
      width: 4,
      height: 50,
      backgroundColor: COLORS.gray800,
      borderTopRightRadius: SIZES.radiusXS,
      borderBottomRightRadius: SIZES.radiusXS,
    },
    
    volumeButtonBottom: {
      position: 'absolute' as const,
      left: 0,
      top: 240,
      width: 4,
      height: 50,
      backgroundColor: COLORS.gray800,
      borderTopRightRadius: SIZES.radiusXS,
      borderBottomRightRadius: SIZES.radiusXS,
    },
    
    // Bekapcsológomb (jobb oldal)
    powerButton: {
      position: 'absolute' as const,
      right: 0,
      top: 200,
      width: 4,
      height: 80,
      backgroundColor: COLORS.gray800,
      borderTopLeftRadius: SIZES.radiusXS,
      borderBottomLeftRadius: SIZES.radiusXS,
    },
    
    // Action gomb (bal oldal, felső)
    actionButton: {
      position: 'absolute' as const,
      left: 0,
      top: 150,
      width: 4,
      height: 30,
      backgroundColor: COLORS.gray800,
      borderTopRightRadius: SIZES.radiusXS,
      borderBottomRightRadius: SIZES.radiusXS,
    },
  };
  
  return (
    <div style={styles.container}>
      {/* iPhone 16 Pro Max keret */}
      <div style={styles.phoneFrame}>
        {/* Belső keret (kijelző szegély) */}
        <div style={styles.innerBezel}>
          {/* Dynamic Island megjelenítése (ha engedélyezett) */}
          {showDynamicIsland && (
            <div style={styles.dynamicIsland}></div>
          )}
          
          {/* Képernyő tartalom - itt jelenik meg az alkalmazás */}
          <div style={styles.screenContent}>
            {children}
          </div>
        </div>

        {/* Oldalsó gombok */}
        {/* Hangerő gombok (bal oldal) */}
        <div style={styles.volumeButtonTop}></div>
        <div style={styles.volumeButtonBottom}></div>
        
        {/* Bekapcsológomb (jobb oldal) */}
        <div style={styles.powerButton}></div>
        
        {/* Action gomb (bal oldal, felső) */}
        <div style={styles.actionButton}></div>
      </div>
    </div>
  );
}
