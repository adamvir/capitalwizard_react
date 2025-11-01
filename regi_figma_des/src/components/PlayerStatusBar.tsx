import { Crown, Flame, Star, Sparkles, Zap } from 'lucide-react';
import { COLORS, SIZES, SPACING, FONT_WEIGHT } from '../utils/styleConstants';

// ============================================
// PLAYERSTATUSBAR KOMPONENS
// Játékos állapot megjelenítése: név, előfizetés, streak, XP progresszió
// ============================================

interface PlayerStatusBarProps {
  playerName: string;
  subscriptionTier: 'free' | 'pro' | 'master';
  streak?: number;
  totalXp?: number;
  totalXpForNextLevel?: number;
  playerLevel?: number;
  onStreakClick?: () => void;
}

export function PlayerStatusBar({ 
  playerName, 
  subscriptionTier, 
  streak = 0, 
  totalXp = 0, 
  totalXpForNextLevel = 0, 
  playerLevel = 0, 
  onStreakClick 
}: PlayerStatusBarProps) {
  
  // ===== COMPUTED VALUES =====
  // XP progresszió számítása százalékban
  const xpProgress = totalXpForNextLevel > 0 ? (totalXp / totalXpForNextLevel) * 100 : 0;

  // ===== EVENT HANDLERS =====
  
  // Streak badge klikk kezelése
  const handleStreakClick = () => {
    onStreakClick?.();
  };

  // ===== STYLES =====
  
  const styles = {
    // Fő container (képernyő alján)
    container: {
      position: 'absolute' as const,
      bottom: 12,
      left: 0,
      right: 0,
      zIndex: 10,
      paddingLeft: SPACING.base,
      paddingRight: SPACING.base,
    },
    
    // Kártya háttér
    card: {
      backgroundImage: 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
      backdropFilter: 'blur(12px)',
      borderRadius: SIZES.radius2XL,
      paddingLeft: SPACING.md,
      paddingRight: SPACING.md,
      paddingTop: 10,
      paddingBottom: 10,
      border: '2px solid rgba(71, 85, 105, 0.3)',
      boxShadow: `0 25px 50px -12px ${COLORS.shadowDark}`,
    },
    
    // Felső sor: Avatar, Név, Badge-ek
    topRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    
    // Bal oldal: Avatar és Név
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.sm,
    },
    
    // Avatar
    avatar: {
      width: 36,
      height: 36,
      backgroundImage: 'linear-gradient(to bottom right, #06B6D4, #2563EB, #9333EA)',
      borderRadius: SIZES.radiusFull,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid rgba(34, 211, 238, 0.5)',
      boxShadow: `0 10px 15px -3px ${COLORS.shadowMedium}`,
    },
    
    // Avatar betű
    avatarText: {
      color: COLORS.white,
      fontWeight: FONT_WEIGHT.bold,
      fontSize: SIZES.fontSM,
    },
    
    // Név szekció
    nameSection: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    
    // Név szöveg
    nameText: {
      color: COLORS.white,
      fontWeight: FONT_WEIGHT.bold,
    },
    
    // Jobb oldal: Badge-ek
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.sm,
    },
    
    // Streak badge gomb
    streakBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      backgroundImage: 'linear-gradient(to right, #EA580C, #DC2626)',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 4,
      paddingBottom: 4,
      borderRadius: SIZES.radiusFull,
      boxShadow: `0 10px 15px -3px ${COLORS.shadowMedium}`,
      border: '1px solid rgba(251, 146, 60, 0.3)',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: 'none',
    },
    
    // Streak szöveg
    streakText: {
      fontSize: SIZES.fontXS,
      fontWeight: FONT_WEIGHT.bold,
      color: COLORS.white,
    },
    
    // Master badge
    masterBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      backgroundImage: 'linear-gradient(to right, #9333EA, #DB2777)',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 4,
      paddingBottom: 4,
      borderRadius: SIZES.radiusFull,
      boxShadow: `0 10px 15px -3px ${COLORS.shadowMedium}`,
      border: '1px solid rgba(192, 132, 252, 0.3)',
    },
    
    // Pro badge
    proBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      backgroundImage: 'linear-gradient(to right, #2563EB, #06B6D4)',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 4,
      paddingBottom: 4,
      borderRadius: SIZES.radiusFull,
      boxShadow: `0 10px 15px -3px ${COLORS.shadowMedium}`,
      border: '1px solid rgba(96, 165, 250, 0.3)',
    },
    
    // Free badge
    freeBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(51, 65, 85, 0.8)',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 4,
      paddingBottom: 4,
      borderRadius: SIZES.radiusFull,
      border: '1px solid rgba(71, 85, 105, 0.3)',
    },
    
    // Badge szöveg
    badgeText: {
      fontSize: SIZES.fontXS,
      fontWeight: FONT_WEIGHT.bold,
      color: COLORS.white,
    },
    
    // Free badge szöveg (más szín)
    freeBadgeText: {
      fontSize: SIZES.fontXS,
      fontWeight: FONT_WEIGHT.semibold,
      color: '#CBD5E1',
    },
    
    // XP szekció
    xpSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 4,
    },
    
    // XP label sor
    xpLabelRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    
    // XP bal oldal (szint és aktuális XP)
    xpLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    
    // XP szöveg
    xpText: {
      fontSize: SIZES.fontXS,
      fontWeight: FONT_WEIGHT.semibold,
      color: '#67E8F9',
    },
    
    // XP cél szöveg
    xpTargetText: {
      fontSize: SIZES.fontXS,
      fontWeight: FONT_WEIGHT.semibold,
      color: COLORS.gray400,
    },
    
    // Progress bar háttér
    progressBarBg: {
      position: 'relative' as const,
      height: 8,
      backgroundColor: 'rgba(51, 65, 85, 0.5)',
      borderRadius: SIZES.radiusFull,
      overflow: 'hidden' as const,
      border: '1px solid rgba(71, 85, 105, 0.3)',
    },
    
    // Progress bar töltöttség
    progressBarFill: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      height: '100%',
      backgroundImage: 'linear-gradient(to right, #06B6D4, #3B82F6, #9333EA)',
      borderRadius: SIZES.radiusFull,
      transition: 'width 0.5s ease-out',
      boxShadow: `0 10px 15px -3px ${COLORS.shadowMedium}`,
    },
    
    // Progress bar pulzáló overlay
    progressBarPulse: {
      position: 'absolute' as const,
      inset: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* FELSŐ SOR: Avatar, Név, Badge-ek */}
        <div style={styles.topRow}>
          {/* BAL OLDAL: Avatar és Név */}
          <div style={styles.leftSection}>
            {/* Avatar */}
            <div style={styles.avatar}>
              <span style={styles.avatarText}>
                {playerName ? playerName.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
            {/* Név */}
            <div style={styles.nameSection}>
              <span style={styles.nameText}>
                {playerName || 'Vendég'}
              </span>
            </div>
          </div>

          {/* JOBB OLDAL: Badge-ek */}
          <div style={styles.rightSection}>
            {/* Streak Badge (csak ha van streak) */}
            {streak > 0 && (
              <button
                onClick={handleStreakClick}
                style={styles.streakBadge}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #C2410C, #B91C1C)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #EA580C, #DC2626)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.95)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                type="button"
              >
                <Flame style={{ width: 14, height: 14, color: COLORS.white }} />
                <span style={styles.streakText}>
                  {streak}
                </span>
              </button>
            )}
            
            {/* Előfizetési szint Badge */}
            {subscriptionTier === 'master' ? (
              <div style={styles.masterBadge}>
                <Sparkles style={{ width: 14, height: 14, color: COLORS.white }} />
                <span style={styles.badgeText}>Master</span>
              </div>
            ) : subscriptionTier === 'pro' ? (
              <div style={styles.proBadge}>
                <Star style={{ width: 14, height: 14, color: COLORS.white }} />
                <span style={styles.badgeText}>Pro</span>
              </div>
            ) : (
              <div style={styles.freeBadge}>
                <span style={styles.freeBadgeText}>Free</span>
              </div>
            )}
          </div>
        </div>

        {/* ALSÓ SOR: XP Progresszió */}
        {totalXpForNextLevel > 0 && (
          <div style={styles.xpSection}>
            {/* XP Label */}
            <div style={styles.xpLabelRow}>
              <div style={styles.xpLeft}>
                <Zap style={{ width: 14, height: 14, color: '#22D3EE' }} />
                <span style={styles.xpText}>
                  Szint {playerLevel} • {totalXp.toLocaleString('hu-HU')} XP
                </span>
              </div>
              <span style={styles.xpTargetText}>
                {totalXpForNextLevel.toLocaleString('hu-HU')} XP
              </span>
            </div>
            
            {/* Progress Bar */}
            <div style={styles.progressBarBg}>
              <div 
                style={{
                  ...styles.progressBarFill,
                  width: `${Math.min(xpProgress, 100)}%`
                }}
              >
                <div style={styles.progressBarPulse}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
