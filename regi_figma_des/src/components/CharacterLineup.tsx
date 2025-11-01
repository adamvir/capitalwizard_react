import { Menu, GraduationCap, User, Trophy, Medal, Newspaper, Crown, Settings, Download, Upload } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner@2.0.3';
import { downloadGameBackup, uploadGameBackup, importGameData } from '../utils/dataSync';
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS, Z_INDEX } from '../utils/styleConstants';

interface CharacterLineupProps {
  onJumpToLesson?: (lesson: number) => void;
  onUniversityClick?: () => void;
  onProfileClick?: () => void;
  onSubscriptionClick?: () => void;
  onManagerClick?: () => void;
}

export function CharacterLineup({ onJumpToLesson, onUniversityClick, onProfileClick, onSubscriptionClick, onManagerClick }: CharacterLineupProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const characters = [
    { color: 'from-purple-600 to-purple-800', name: 'Shadow', icon: GraduationCap, label: 'Egyetem', onClick: onUniversityClick },
    { color: 'from-blue-500 to-blue-700', name: 'Frost', icon: User, label: 'Diák', onClick: onProfileClick },
    { color: 'from-gray-500 to-gray-700', name: 'Steel', icon: Trophy, label: 'Eredmények' },
    { color: 'from-pink-500 to-pink-700', name: 'Sakura', icon: Medal, label: 'Helyezés' },
    { color: 'from-orange-500 to-orange-700', name: 'Fire', icon: Newspaper, label: 'Hírek' },
    { color: 'from-yellow-500 to-orange-700', name: 'Wave', icon: Crown, label: 'Előfizetés', onClick: onSubscriptionClick },
  ];

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!menuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top - 10,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuOpen && buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        // Don't close if clicking inside the menu portal
        if (!target.closest('[data-dev-menu]')) {
          setMenuOpen(false);
        }
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleExportData = () => {
    try {
      downloadGameBackup();
      toast.success('✅ Adatok exportálva!', { duration: 2000 });
      setMenuOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('❌ Export sikertelen!');
    }
  };

  const handleImportData = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const backup = await uploadGameBackup(file);
        
        if (confirm('⚠️ Felülírod a jelenlegi adatokat?\n\nEz visszaállítja az összes mentett állapotot.\nNem vonható vissza!')) {
          const success = importGameData(backup);
          
          if (success) {
            toast.success('✅ Adatok betöltve! Újratöltés...', { duration: 2000 });
            setTimeout(() => window.location.reload(), 1500);
          } else {
            toast.error('❌ Import sikertelen!');
          }
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error('❌ Érvénytelen fájl!');
      }
    };
    input.click();
    setMenuOpen(false);
  };

  const handleLessonSelect = (lesson: number) => {
    if (onJumpToLesson) {
      onJumpToLesson(lesson);
    }
    setMenuOpen(false);
  };

  const handleManagerOpen = () => {
    if (onManagerClick) {
      onManagerClick();
    }
    setMenuOpen(false);
  };

  const handleSaveLesson12State = () => {
    // Create a comprehensive save state for lesson 12 completed (ready for lesson 13)
    // This includes: game state, progress, coins, XP, level, streak, etc.
    
    // Create lesson progress with first 12 lessons completed
    const lessonProgress: any = {
      'Pénzügyi Alapismeretek': {}
    };
    
    // Pages 0-3, all 3 game types (= 12 lessons)
    for (let pageIndex = 0; pageIndex < 4; pageIndex++) {
      lessonProgress['Pénzügyi Alapismeretek'][`${pageIndex}-reading`] = true;
      lessonProgress['Pénzügyi Alapismeretek'][`${pageIndex}-matching`] = true;
      lessonProgress['Pénzügyi Alapismeretek'][`${pageIndex}-quiz`] = true;
    }
    
    // Calculate expected XP and coins after 12 lessons
    // Assuming: Reading=150XP/150gold, Matching=100XP/100gold, Quiz=50XP/50gold
    // 4 pages * (150+100+50) = 4 * 300 = 1200 XP and 1200 gold
    const initialGold = 500;
    const earnedGold = 1200;
    const totalGold = initialGold + earnedGold;
    const totalXp = 1200;
    
    // Calculate level from XP (you'll need to import or calculate this)
    // For now, let's estimate: level 0 = 0 XP, level 1 = 100 XP, level 2 = 300 XP, etc.
    // 1200 XP should be around level 6-7
    const playerLevel = 6;
    
    const lesson12State = {
      // Lesson position
      currentBookLessonIndex: 4, // Next lesson is 13 (pageIndex 4)
      currentGameType: 'reading' as const,
      isFirstRound: true,
      
      // Game state
      coins: totalGold,
      gems: 0,
      currentLesson: 7,
      progressPosition: 0,
      playerLevel: playerLevel,
      totalXp: totalXp,
      selectedBookTitle: 'Pénzügyi Alapismeretek',
      subscriptionTier: 'free' as const,
      hasSeenWelcome: true,
      currentStageInSection: 1,
      totalStagesCompleted: 12,
      
      // Progress tracking
      completedLessonsCount: 12,
      
      // Streak data (assuming 12 days of lessons = 12 day streak)
      currentStreak: 12,
      longestStreak: 12,
      streakFreezes: 0,
      
      // Timestamp
      timestamp: Date.now(),
      
      // localStorage data as stringified JSON
      lessonProgressJson: JSON.stringify(lessonProgress),
      rentedBooks: null,
      userProfile: null,
      playerAvatar: null,
      dailyStreak: null,
      dailyLessons: null,
      arenaDailyGames: null
    };
    
    // Save to special localStorage key
    localStorage.setItem('lesson_12_state', JSON.stringify(lesson12State));
    
    console.log('💾 Saved Lesson 12 State:', lesson12State);
    toast.success('✅ 12. lecke állapot elmentve!', { duration: 2000 });
    setMenuOpen(false);
  };

  // ============================================
  // STYLE DEFINITIONS - React Native Compatible
  // ============================================
  
  const styles = {
    container: {
      position: 'absolute' as const,
      bottom: 98,
      left: 0,
      right: 0,
      zIndex: Z_INDEX.overlay,
    },
    lineupWrapper: {
      position: 'relative' as const,
      height: 80,
      marginLeft: SPACING.sm,
      marginRight: SPACING.sm,
    },
    lineupInner: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: SPACING.xs,
      paddingLeft: SPACING.base,
      paddingRight: SPACING.base,
    },
    characterButtonWrapper: {
      position: 'relative' as const,
    },
    characterButton: (color: string, hasOnClick: boolean) => ({
      width: 56,
      height: 72,
      background: color,
      borderRadius: SIZES.radiusLG,
      border: `${SIZES.borderBase}px solid ${COLORS.gray800}`,
      ...SHADOWS.large,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING.xs,
      cursor: hasOnClick ? 'pointer' : 'default',
      transition: 'transform 0.2s',
      position: 'relative' as const,
    }),
    characterOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: COLORS.overlayLight,
      borderRadius: SIZES.radiusLG,
    },
    characterIcon: {
      width: 28,
      height: 28,
      color: COLORS.white,
      position: 'relative' as const,
      zIndex: Z_INDEX.content + 1,
      marginBottom: SPACING.xs,
    },
    characterLabel: {
      color: COLORS.white,
      fontSize: 8,
      position: 'relative' as const,
      zIndex: Z_INDEX.content + 1,
      textAlign: 'center' as const,
      lineHeight: 1.2,
    },
    devButtonWrapper: {
      position: 'relative' as const,
      marginLeft: SPACING.sm,
    },
    devButton: {
      width: 28,
      height: 36,
      background: `linear-gradient(to bottom, ${COLORS.primary}, ${COLORS.primaryDark})`,
      borderRadius: SIZES.radiusLG,
      border: `${SIZES.borderThin}px solid ${COLORS.gray800}`,
      ...SHADOWS.large,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
      cursor: 'pointer',
      transition: 'transform 0.2s',
      position: 'relative' as const,
    },
    devButtonOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: COLORS.overlayLight,
      borderRadius: SIZES.radiusLG,
    },
    devIcon: {
      width: 14,
      height: 14,
      color: COLORS.white,
      position: 'relative' as const,
      zIndex: Z_INDEX.content + 1,
      marginBottom: 2,
    },
    devLabel: {
      color: COLORS.white,
      fontSize: 6,
      position: 'relative' as const,
      zIndex: Z_INDEX.content + 1,
      textAlign: 'center' as const,
      lineHeight: 1.2,
    },
  };

  return (
    <div style={styles.container}>
      {/* Character lineup */}
      <div style={styles.lineupWrapper}>
        <div style={styles.lineupInner}>
          {characters.map((char, index) => (
            <div
              key={index}
              style={styles.characterButtonWrapper}
            >
              <button
                onClick={char.onClick}
                disabled={!char.onClick}
                style={styles.characterButton(char.color, !!char.onClick)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div style={styles.characterOverlay}></div>
                {char.icon && (
                  <char.icon style={styles.characterIcon} strokeWidth={2} />
                )}
                {char.label && (
                  <span style={styles.characterLabel}>{char.label}</span>
                )}
              </button>
            </div>
          ))}
          
          {/* Developer Menu Button */}
          <div style={styles.devButtonWrapper}>
            <button 
              ref={buttonRef}
              onClick={handleMenuToggle}
              style={styles.devButton}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={styles.devButtonOverlay}></div>
              <Menu style={styles.devIcon} strokeWidth={2} />
              <span style={styles.devLabel}>Dev</span>
            </button>
          </div>
        </div>
      </div>

      {/* Developer Menu Popup - Using Portal to escape overflow-hidden */}
      {/* NOTE: React Native - Replace Portal with Modal component */}
      {menuOpen && (onJumpToLesson || onManagerClick) && createPortal(
        <>
          {/* Backdrop to close menu */}
          {/* NOTE: React Native - Use Pressable or TouchableOpacity */}
          <div 
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: Z_INDEX.modal - 1,
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          />
          
          {/* Menu content */}
          {/* NOTE: React Native - Convert to Modal with ScrollView */}
          <div 
            data-dev-menu
            style={{
              position: 'fixed',
              width: 256,
              background: `linear-gradient(to bottom, ${COLORS.gray900}, ${COLORS.crystalPurple}95, ${COLORS.gray900})`,
              backdropFilter: 'blur(16px)',
              border: `${SIZES.borderThin}px solid ${COLORS.gray700}50`,
              ...SHADOWS.xl,
              borderRadius: SIZES.radiusXL,
              padding: SPACING.base,
              zIndex: Z_INDEX.modal,
              userSelect: 'none',
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`,
              transform: 'translateY(-100%)',
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: SPACING.sm,
            }}>
              <h3 style={{
                color: COLORS.white,
                textAlign: 'center',
                marginBottom: SPACING.sm,
                paddingBottom: SPACING.sm,
                borderBottom: `${SIZES.borderThin}px solid ${COLORS.gray700}50`,
              }}>Fejlesztői Menü</h3>
              
              {onManagerClick && (
                <button
                  onClick={handleManagerOpen}
                  style={{
                    background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.crystalPurple})`,
                    color: COLORS.white,
                    paddingTop: SPACING.md,
                    paddingBottom: SPACING.md,
                    paddingLeft: SPACING.base,
                    paddingRight: SPACING.base,
                    borderRadius: SIZES.radiusLG,
                    border: 'none',
                    cursor: 'pointer',
                    ...SHADOWS.large,
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: SPACING.sm,
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Settings style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                  Menedzser Panel
                </button>
              )}
              
              {onJumpToLesson && (
                <>
                  <div style={{
                    borderTop: `${SIZES.borderThin}px solid ${COLORS.gray700}50`,
                    marginTop: SPACING.xs,
                    marginBottom: SPACING.xs,
                  }}></div>
                  
                  <button
                    onClick={() => handleLessonSelect(7)}
                    style={{
                      background: `linear-gradient(to right, ${COLORS.crystalPurple}, ${COLORS.secondary})`,
                      color: COLORS.white,
                      paddingTop: SPACING.md,
                      paddingBottom: SPACING.md,
                      paddingLeft: SPACING.base,
                      paddingRight: SPACING.base,
                      borderRadius: SIZES.radiusLG,
                      border: 'none',
                      cursor: 'pointer',
                      ...SHADOWS.large,
                      transition: 'all 0.3s',
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    1. Vissza az elejére
                  </button>
                  
                  <button
                    onClick={() => handleLessonSelect(999)}
                    style={{
                      background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.xpBlueDark})`,
                      color: COLORS.white,
                      paddingTop: SPACING.md,
                      paddingBottom: SPACING.md,
                      paddingLeft: SPACING.base,
                      paddingRight: SPACING.base,
                      borderRadius: SIZES.radiusLG,
                      border: 'none',
                      cursor: 'pointer',
                      ...SHADOWS.large,
                      transition: 'all 0.3s',
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    2. Vissza az aktuális állapotra
                  </button>
                  
                  <button
                    onClick={() => handleLessonSelect(12)}
                    style={{
                      background: `linear-gradient(to right, ${COLORS.gold}, ${COLORS.warning})`,
                      color: COLORS.white,
                      paddingTop: SPACING.md,
                      paddingBottom: SPACING.md,
                      paddingLeft: SPACING.base,
                      paddingRight: SPACING.base,
                      borderRadius: SIZES.radiusLG,
                      border: 'none',
                      cursor: 'pointer',
                      ...SHADOWS.large,
                      transition: 'all 0.3s',
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    3. 📚 12. lecke állapot betöltése
                  </button>
                  
                  <div style={{
                    borderTop: `${SIZES.borderThin}px solid ${COLORS.gray700}50`,
                    marginTop: SPACING.xs,
                    marginBottom: SPACING.xs,
                  }}></div>
                  
                  <button
                    onClick={handleExportData}
                    style={{
                      background: `linear-gradient(to right, ${COLORS.success}, #059669)`,
                      color: COLORS.white,
                      paddingTop: SPACING.md,
                      paddingBottom: SPACING.md,
                      paddingLeft: SPACING.base,
                      paddingRight: SPACING.base,
                      borderRadius: SIZES.radiusLG,
                      border: 'none',
                      cursor: 'pointer',
                      ...SHADOWS.large,
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: SPACING.sm,
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <Download style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                    Állapot exportálása
                  </button>
                  
                  <button
                    onClick={handleImportData}
                    style={{
                      background: `linear-gradient(to right, ${COLORS.crystalCyan}, ${COLORS.primary})`,
                      color: COLORS.white,
                      paddingTop: SPACING.md,
                      paddingBottom: SPACING.md,
                      paddingLeft: SPACING.base,
                      paddingRight: SPACING.base,
                      borderRadius: SIZES.radiusLG,
                      border: 'none',
                      cursor: 'pointer',
                      ...SHADOWS.large,
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: SPACING.sm,
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <Upload style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                    Állapot importálása
                  </button>
                  
                  <div style={{
                    borderTop: `${SIZES.borderThin}px solid ${COLORS.gray700}50`,
                    marginTop: SPACING.xs,
                    marginBottom: SPACING.xs,
                  }}></div>
                  
                  <button
                    onClick={handleSaveLesson12State}
                    style={{
                      background: `linear-gradient(to right, ${COLORS.gold}, ${COLORS.warning})`,
                      color: COLORS.white,
                      paddingTop: SPACING.md,
                      paddingBottom: SPACING.md,
                      paddingLeft: SPACING.base,
                      paddingRight: SPACING.base,
                      borderRadius: SIZES.radiusLG,
                      border: 'none',
                      cursor: 'pointer',
                      ...SHADOWS.large,
                      transition: 'all 0.3s',
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    💾 12. lecke állapot mentése
                  </button>
                </>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
