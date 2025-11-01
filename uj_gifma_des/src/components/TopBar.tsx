import { ImageWithFallback } from './figma/ImageWithFallback';
import { Coins, Gem, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { COLORS, SIZES, SPACING, FONT_WEIGHT } from '../utils/styleConstants';

// ============================================
// TOPBAR KOMPONENS
// Játékos információk megjelenítése: avatar, szint, pénz, szakasz progresszió
// ============================================

interface TopBarProps {
  coins?: number;
  gems?: number;
  progressPosition?: number;  // 0-based index (0-5)
  playerLevel?: number;
  currentLesson?: number;
  onAvatarClick?: () => void;
  currentStageInSection?: number;  // 1-based (1-6)
}

// Lecke nehézségi szintek - szinkronizálva a LessonHeader-rel
const lessonDifficulties: Record<number, 'Könnyű' | 'Közepes' | 'Nehéz'> = {
  7: 'Közepes',
  8: 'Nehéz',
  9: 'Könnyű',
  10: 'Nehéz',
  11: 'Nehéz',
  12: 'Nehéz',
  13: 'Nehéz',
  14: 'Nehéz',
  15: 'Nehéz'
};

export function TopBar({ 
  coins = 680, 
  gems = 0, 
  progressPosition = 3, 
  playerLevel = 2, 
  currentLesson = 7, 
  onAvatarClick, 
  currentStageInSection = 1 
}: TopBarProps) {
  
  // ===== STATE MANAGEMENT =====
  // Avatar állapot - localStorage-ból töltve
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);

  // ===== EFFECTS =====
  
  // Debug: Progresszió pozíció logolása
  useEffect(() => {
    console.log('🔝 TopBar received props:', {
      progressPosition,
      currentStageInSection,
      expectedProgressPosition: currentStageInSection - 1
    });
  }, [progressPosition, currentStageInSection]);

  // Avatar betöltése localStorage-ból inicializáláskor
  useEffect(() => {
    const saved = localStorage.getItem('player_avatar');
    if (saved) {
      setCurrentAvatar(saved);
    } else {
      setCurrentAvatar(null);
    }
  }, []);

  // Avatar újratöltése amikor visszatérünk az oldalra
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('player_avatar');
      if (saved) {
        setCurrentAvatar(saved);
      } else {
        setCurrentAvatar(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  // ===== HELPER FUNCTIONS =====
  
  // Következő lecke nehézségének lekérése
  const getNextLessonDifficulty = () => {
    const nextLesson = currentLesson;
    const difficulty = lessonDifficulties[nextLesson] || 'Közepes';
    
    switch (difficulty) {
      case 'Könnyű':
        return 'easy';
      case 'Nehéz':
        return 'hard';
      default: // Közepes
        return 'medium';
    }
  };

  const difficulty = getNextLessonDifficulty();

  // Nehézségi szint stílusok lekérése
  const getDifficultyBackgroundColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'rgba(16, 185, 129, 0.2)';
      case 'hard':
        return 'rgba(239, 68, 68, 0.2)';
      default: // medium
        return 'rgba(6, 182, 212, 0.2)';
    }
  };

  const getDifficultyBorderColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'rgba(52, 211, 153, 0.3)';
      case 'hard':
        return 'rgba(248, 113, 113, 0.3)';
      default: // medium
        return 'rgba(34, 211, 238, 0.3)';
    }
  };

  const getDifficultyTextColor = () => {
    switch (difficulty) {
      case 'easy':
        return '#6EE7B7';
      case 'hard':
        return '#FCA5A5';
      default: // medium
        return '#67E8F9';
    }
  };

  // ===== STYLES =====
  
  const styles = {
    // Fő container
    container: {
      position: 'relative' as const,
      paddingLeft: SPACING.base,
      paddingRight: SPACING.base,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.sm,
      zIndex: 100,
    },
    
    // Játékos információs kártya container
    playerInfoContainer: {
      position: 'absolute' as const,
      left: 8,
      top: 14,
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.md,
      zIndex: 100,
    },
    
    // Játékos kártya
    playerCard: {
      display: 'flex',
      alignItems: 'center',
      backgroundImage: 'linear-gradient(to bottom right, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
      backdropFilter: 'blur(12px)',
      borderRadius: SIZES.radiusLG,
      border: '1px solid rgba(71, 85, 105, 0.5)',
      boxShadow: `0 20px 25px -5px ${COLORS.shadowDark}`,
      padding: SPACING.sm,
      gap: 10,
    },
    
    // Avatar gomb
    avatarButton: {
      position: 'relative' as const,
      cursor: 'pointer',
      transition: 'transform 0.2s',
      zIndex: 100,
      background: 'none',
      border: 'none',
      padding: 0,
    },
    
    // Avatar container (van vs nincs avatar)
    avatarWithImage: {
      width: 56,
      height: 56,
      borderRadius: SIZES.radiusLG,
      border: '2px solid rgba(34, 211, 238, 0.8)',
      boxShadow: `0 4px 6px -1px rgba(34, 211, 238, 0.3)`,
      backgroundImage: 'linear-gradient(to bottom right, #9333EA, #DB2777)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'border-color 0.3s',
    },
    
    avatarWithoutImage: {
      width: 56,
      height: 56,
      borderRadius: SIZES.radiusLG,
      border: '2px solid rgba(100, 116, 139, 0.5)',
      boxShadow: `0 4px 6px -1px rgba(100, 116, 139, 0.2)`,
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'border-color 0.3s',
    },
    
    // Avatar emoji
    avatarEmoji: {
      fontSize: 30,
      pointerEvents: 'none' as const,
    },
    
    // Avatar placeholder
    avatarPlaceholder: {
      fontSize: 30,
      color: COLORS.gray400,
      pointerEvents: 'none' as const,
    },
    
    // Avatar glow effect
    avatarGlowWithImage: {
      position: 'absolute' as const,
      inset: -4,
      borderRadius: SIZES.radiusLG,
      opacity: 0.2,
      filter: 'blur(12px)',
      zIndex: -10,
      backgroundImage: 'linear-gradient(to right, #22D3EE, #3B82F6)',
      pointerEvents: 'none' as const,
    },
    
    avatarGlowWithoutImage: {
      position: 'absolute' as const,
      inset: -4,
      borderRadius: SIZES.radiusLG,
      opacity: 0.2,
      filter: 'blur(12px)',
      zIndex: -10,
      backgroundColor: COLORS.gray500,
      pointerEvents: 'none' as const,
    },
    
    // Info szekció
    infoSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 6,
      minWidth: 140,
    },
    
    // Szint progresszió sor
    levelRow: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.sm,
    },
    
    // Szint szöveg
    levelText: {
      color: COLORS.white,
      fontSize: SIZES.fontSM,
      backgroundImage: 'linear-gradient(to right, #22D3EE, #60A5FA)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    
    // XP progress bar háttér
    progressBarBg: {
      flex: 1,
      height: 8,
      backgroundColor: 'rgba(51, 65, 85, 0.5)',
      borderRadius: SIZES.radiusFull,
      overflow: 'hidden' as const,
      border: '1px solid rgba(71, 85, 105, 0.3)',
      boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },
    
    // XP progress bar töltöttség
    progressBarFill: {
      height: '100%',
      backgroundImage: 'linear-gradient(to right, #FBBF24, #FB923C, #F97316)',
      boxShadow: `0 4px 6px -1px rgba(249, 115, 22, 0.5)`,
      transition: 'width 0.3s',
    },
    
    // Pénznem sor
    currencyRow: {
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.md,
      fontSize: SIZES.fontXS,
    },
    
    // Arany container
    coinsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },
    
    // Arany ikon háttér
    coinIconBg: {
      width: 20,
      height: 20,
      backgroundImage: 'linear-gradient(to bottom right, #FDE047, #EAB308)',
      borderRadius: SIZES.radiusFull,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 4px 6px -1px rgba(234, 179, 8, 0.3)`,
      border: '1px solid rgba(202, 138, 4, 0.2)',
    },
    
    // Gyémánt container
    gemsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },
    
    // Gyémánt ikon háttér
    gemIconBg: {
      width: 20,
      height: 20,
      backgroundImage: 'linear-gradient(to bottom right, #C084FC, #9333EA)',
      borderRadius: SIZES.radiusFull,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 4px 6px -1px rgba(147, 51, 234, 0.3)`,
      border: '1px solid rgba(126, 34, 206, 0.2)',
    },
    
    // Pénznem szöveg
    currencyText: {
      color: COLORS.white,
      filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))',
    },
    
    // Szakasz progresszió container (jobb oldal)
    stageProgressContainer: {
      position: 'absolute' as const,
      right: 8,
      top: 14,
      zIndex: 40,
    },
    
    // Szakasz kártya
    stageCard: {
      padding: SPACING.md,
    },
    
    // Szakasz útvonal (path) container
    stagePathContainer: {
      position: 'relative' as const,
      width: 160,
      height: 55,
      marginBottom: SPACING.sm,
    },
    
    // Nehézség badge
    difficultyBadge: {
      paddingLeft: SPACING.sm,
      paddingRight: SPACING.sm,
      paddingTop: 2,
      paddingBottom: 2,
      backgroundColor: getDifficultyBackgroundColor(),
      borderColor: getDifficultyBorderColor(),
      color: getDifficultyTextColor(),
      borderRadius: SIZES.radiusXS,
      border: '1px solid',
    },
    
    // Szakasz info sor
    stageInfoRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: SPACING.md,
      fontSize: SIZES.fontXS,
    },
    
    // Szakasz szöveg
    stageText: {
      color: COLORS.white,
    },
  };

  // Szakasz node-ok pozíciói és típusai
  const stageNodes = [
    { x: 10, y: 35, type: 'square' },
    { x: 40, y: 15, type: 'square' },
    { x: 70, y: 35, type: 'square' },
    { x: 100, y: 15, type: 'circle' },
    { x: 130, y: 35, type: 'square' },
    { x: 150, y: 10, type: 'gem' }
  ];

  // ===== EVENT HANDLERS =====
  
  // Avatar klikk kezelése
  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Avatar clicked!', onAvatarClick);
    onAvatarClick?.();
  };

  return (
    <div style={styles.container}>
      {/* JÁTÉKOS INFORMÁCIÓS KÁRTYA */}
      <div style={styles.playerInfoContainer}>
        <div style={styles.playerCard}>
          {/* Avatar gomb */}
          <button
            onClick={handleAvatarClick}
            style={styles.avatarButton}
            type="button"
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
            <div style={currentAvatar ? styles.avatarWithImage : styles.avatarWithoutImage}>
              {currentAvatar ? (
                <span style={styles.avatarEmoji}>{currentAvatar}</span>
              ) : (
                <span style={styles.avatarPlaceholder}>+</span>
              )}
            </div>
            {/* Glow effect */}
            <div style={currentAvatar ? styles.avatarGlowWithImage : styles.avatarGlowWithoutImage}></div>
          </button>

          {/* Info szekció */}
          <div style={styles.infoSection}>
            {/* Szint progresszió */}
            <div style={styles.levelRow}>
              <span style={styles.levelText}>Szint {playerLevel}.</span>
              <div style={styles.progressBarBg}>
                <div 
                  style={{
                    ...styles.progressBarFill,
                    width: playerLevel === 1 ? '0%' : '1%'
                  }}
                ></div>
              </div>
            </div>
            
            {/* Pénznem (Arany és Gyémánt) */}
            <div style={styles.currencyRow}>
              <div style={styles.coinsContainer}>
                <div style={styles.coinIconBg}>
                  <Coins style={{ width: 12, height: 12, color: '#78350F' }} />
                </div>
                <span style={styles.currencyText}>{coins}</span>
              </div>
              <div style={styles.gemsContainer}>
                <div style={styles.gemIconBg}>
                  <Gem style={{ width: 12, height: 12, color: COLORS.white }} />
                </div>
                <span style={styles.currencyText}>{gems}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SZAKASZ PROGRESSZIÓ KÁRTYA */}
      <div style={styles.stageProgressContainer}>
        <div style={styles.stageCard}>
          {/* Szakasz útvonal - Zigzag minta */}
          <div style={styles.stagePathContainer}>
            {/* Szakasz node-ok zigzag útvonallal */}
            {stageNodes.map((node, index, arr) => {
              const isActive = index < progressPosition;
              const isCurrent = index === progressPosition;
              
              // Node specifikus stílusok
              const nodeStyles: React.CSSProperties = {
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
              };
              
              // Connection line stílus
              let connectionLineStyle: React.CSSProperties = {};
              if (index < arr.length - 1) {
                const nextNode = arr[index + 1];
                const deltaX = nextNode.x - node.x;
                const deltaY = nextNode.y - node.y;
                const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
                
                connectionLineStyle = {
                  position: 'absolute',
                  left: `${node.x + (node.type === 'circle' ? 6 : 4)}px`,
                  top: `${node.y + (node.type === 'circle' ? 6 : 4)}px`,
                  width: `${length}px`,
                  border: '2px dashed',
                  borderColor: isActive ? 'rgba(220, 38, 38, 0.7)' : 'rgba(71, 85, 105, 0.4)',
                  transformOrigin: 'left center',
                  transform: `rotate(${angle}deg)`,
                };
              }
              
              return (
                <div key={index}>
                  {/* Kapcsolat vonal következő node-hoz */}
                  {index < arr.length - 1 && (
                    <div style={connectionLineStyle}></div>
                  )}
                  
                  {/* Node megjelenítése */}
                  {node.type === 'gem' ? (
                    // Gyémánt node (végpont)
                    <div 
                      style={{
                        ...nodeStyles,
                        left: `${node.x - 2}px`,
                        top: `${node.y - 2}px`,
                        width: 20,
                        height: 20,
                        backgroundImage: 'linear-gradient(to bottom right, #C084FC, #9333EA)',
                        borderRadius: SIZES.radiusFull,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 6px -1px rgba(147, 51, 234, 0.3)`,
                        border: '1px solid rgba(126, 34, 206, 0.2)',
                      }}
                    >
                      <Gem style={{ width: 12, height: 12, color: COLORS.white }} />
                    </div>
                  ) : isCurrent ? (
                    // Jelenlegi pozíció node (fehér pulzáló)
                    <div
                      style={{
                        ...nodeStyles,
                        width: 12,
                        height: 12,
                        backgroundColor: COLORS.white,
                        borderRadius: SIZES.radiusFull,
                        boxShadow: `0 10px 15px -3px rgba(255, 255, 255, 0.5)`,
                        border: '2px solid white',
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: COLORS.white,
                        borderRadius: SIZES.radiusFull,
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      }}></div>
                    </div>
                  ) : (
                    // Aktív vagy inaktív node
                    <div
                      style={{
                        ...nodeStyles,
                        width: 10,
                        height: 10,
                        ...(isActive 
                          ? {
                              backgroundImage: 'linear-gradient(to bottom right, #DC2626, #991B1B)',
                              border: '1px solid rgba(127, 29, 29, 0.5)',
                              boxShadow: `0 4px 6px -1px rgba(220, 38, 38, 0.4)`,
                            }
                          : {
                              backgroundColor: 'rgba(51, 65, 85, 0.7)',
                              border: '1px solid rgba(71, 85, 105, 0.5)',
                            }
                        ),
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Szakasz információ */}
          <div style={styles.stageInfoRow}>
            <div style={styles.difficultyBadge}>
              Nehézség
            </div>
            <div style={styles.stageText}>
              Szakasz {currentStageInSection}/6
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
