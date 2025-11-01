import { Clock, Crown, Infinity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getGameConfig } from '../utils/gameConfig';
import { COLORS, SIZES, SPACING, FONT_WEIGHT } from '../utils/styleConstants';

// ============================================
// EVENTCARDS KOMPONENS
// Esemény kártyák megjelenítése: Küzdőtér és Templomos
// ============================================

interface EventCardsProps {
  onArenaClick?: () => void;
  subscriptionTier?: 'free' | 'pro' | 'master';
}

export function EventCards({ onArenaClick, subscriptionTier = 'free' }: EventCardsProps) {
  
  // ===== HELPER FUNCTIONS =====
  
  // Hátralévő játékok száma ma (Arena esetén)
  const getRemainingGames = () => {
    // Premium felhasználóknak korlátlan
    if (subscriptionTier !== 'free') {
      return 'unlimited';
    }
    
    // Ingyenes felhasználóknak napi limit (config-ból)
    const config = getGameConfig();
    const maxGames = config.freeDailyArenaGames;
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('arena_daily_games');
    
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.date === today) {
        return Math.max(0, maxGames - data.gamesPlayed);
      }
    }
    
    return maxGames;
  };

  // ===== STATE MANAGEMENT =====
  
  // Hátralévő játékok állapota
  const [remainingGames, setRemainingGames] = useState<number | 'unlimited'>(getRemainingGames());

  // ===== EFFECTS =====
  
  // Hátralévő játékok frissítése előfizetési szint változásakor
  useEffect(() => {
    setRemainingGames(getRemainingGames());
  }, [subscriptionTier]);

  // Storage változások és játék befejezések figyelése
  useEffect(() => {
    // Storage változás kezelése
    const handleStorageChange = () => {
      setRemainingGames(getRemainingGames());
    };

    // Arena játék befejezés egyedi esemény kezelése
    const handleArenaUpdate = () => {
      setRemainingGames(getRemainingGames());
    };

    // Event listener-ek hozzáadása
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('arenaGameCompleted', handleArenaUpdate);
    
    // Periodikus frissítés napváltás ellenőrzésére
    const interval = setInterval(() => {
      setRemainingGames(getRemainingGames());
    }, 60000); // Ellenőrzés minden percben

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('arenaGameCompleted', handleArenaUpdate);
      clearInterval(interval);
    };
  }, [subscriptionTier]);

  // ===== EVENT HANDLERS =====
  
  // Arena kártya klikk kezelése
  const handleArenaClick = () => {
    onArenaClick?.();
  };

  // ===== STYLES =====
  
  const styles = {
    // Fő container (jobb felső sarok)
    container: {
      position: 'absolute' as const,
      right: 8,
      top: 112,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: SPACING.sm,
      zIndex: 10,
    },
    
    // Küzdőtér kártya
    arenaCard: {
      position: 'relative' as const,
      width: 160,
      height: 64,
      backgroundImage: 'linear-gradient(to right, #D97706, #EA580C)',
      borderRadius: SIZES.radiusBase,
      border: '2px solid #FCD34D',
      boxShadow: `0 10px 15px -3px ${COLORS.shadowMedium}`,
      overflow: 'hidden' as const,
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    
    // Templomos kártya
    templomosCard: {
      position: 'relative' as const,
      width: 160,
      height: 64,
      backgroundImage: 'linear-gradient(to right, #2563EB, #06B6D4)',
      borderRadius: SIZES.radiusBase,
      border: '2px solid #22D3EE',
      boxShadow: `0 10px 15px -3px ${COLORS.shadowMedium}`,
      overflow: 'hidden' as const,
    },
    
    // Kártya overlay (sötétítés)
    cardOverlay: {
      position: 'absolute' as const,
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    
    // Kártya tartalom
    cardContent: {
      position: 'relative' as const,
      padding: SPACING.sm,
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
    },
    
    // Kártya fejléc sor (ikon + cím)
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },
    
    // Kártya cím
    cardTitle: {
      color: COLORS.white,
      filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
    },
    
    // Kártya alsó sor (info)
    cardInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      color: COLORS.white,
      fontSize: SIZES.fontSM,
    },
    
    // Info szöveg
    infoText: {
      filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
    },
    
    // Karakter illusztráció (Küzdőtér)
    arenaIllustration: {
      position: 'absolute' as const,
      right: 0,
      bottom: 0,
      width: 48,
      height: 48,
      backgroundImage: 'linear-gradient(to bottom right, #3B82F6, #9333EA)',
      borderTopLeftRadius: SIZES.radiusFull,
    },
    
    // Sárkány illusztráció (Templomos)
    dragonIllustration: {
      position: 'absolute' as const,
      right: 0,
      bottom: 0,
      width: 48,
      height: 48,
      backgroundImage: 'linear-gradient(to bottom right, #A855F7, #EC4899)',
      borderTopLeftRadius: SIZES.radiusFull,
    },
  };

  return (
    <div style={styles.container}>
      {/* KÜZDŐTÉR KÁRTYA */}
      <div 
        style={styles.arenaCard}
        onClick={handleArenaClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
      >
        {/* Overlay sötétítés */}
        <div style={styles.cardOverlay}></div>
        
        {/* Kártya tartalom */}
        <div style={styles.cardContent}>
          {/* Fejléc: Ikon + Cím */}
          <div style={styles.cardHeader}>
            <Crown style={{ width: 20, height: 20, color: '#FDE047' }} />
            <span style={styles.cardTitle}>Küzdőtér</span>
          </div>
          
          {/* Alsó info: Hátralévő játékok */}
          <div style={styles.cardInfo}>
            {remainingGames === 'unlimited' ? (
              <>
                <Infinity style={{ width: 16, height: 16 }} />
                <span style={styles.infoText}>Korlátlan</span>
              </>
            ) : (
              <>
                <Crown style={{ width: 12, height: 12 }} />
                <span style={styles.infoText}>{remainingGames} játék</span>
              </>
            )}
          </div>
        </div>
        
        {/* Karakter illusztráció */}
        <div style={styles.arenaIllustration}></div>
      </div>

      {/* TEMPLOMOS KÁRTYA */}
      <div style={styles.templomosCard}>
        {/* Overlay sötétítés */}
        <div style={styles.cardOverlay}></div>
        
        {/* Kártya tartalom */}
        <div style={styles.cardContent}>
          {/* Cím */}
          <span style={styles.cardTitle}>Templomos</span>
          
          {/* Alsó info: Időzítő */}
          <div style={styles.cardInfo}>
            <Clock style={{ width: 12, height: 12 }} />
            <span style={styles.infoText}>9h 6m</span>
          </div>
        </div>
        
        {/* Sárkány illusztráció */}
        <div style={styles.dragonIllustration}></div>
      </div>
    </div>
  );
}
