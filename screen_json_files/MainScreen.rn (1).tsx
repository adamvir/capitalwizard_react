import { CSSProperties } from 'react';
import { TopBar } from './TopBar';
import { SideMenu } from './SideMenu';
import { EventCards } from './EventCards';
import { TipBar } from './TipBar';
import { CharacterLineup } from './CharacterLineup';
import { PlayerStatusBar } from './PlayerStatusBar';
import { ProgressAnimation } from './ProgressAnimation';
import { getTotalXpForLevel } from '../utils/gameConfig';
import { COLORS, SPACING, SIZES, OPACITY, Z_INDEX } from '../utils/styleConstants';

// ============================================
// MAIN SCREEN KOMPONENS
// A főoldal teljes nézete - minden komponenssel
// ============================================
// Ez a komponens a fő játék képernyő, amely tartalmazza:
// - TopBar: Játékos adatok (coins, gems, progress)
// - SideMenu: Bal oldali navigációs menü
// - EventCards: Esemény kártyák (arena, subscription)
// - TipBar: Tipp sáv a képernyő alján
// - CharacterLineup: Alsó menüsor (university, profile, stb.)
// - PlayerStatusBar: Játékos státusz sáv (név, streak, XP)
// - ProgressAnimation: Tovább gomb animáció

// ===== INTERFACES =====
interface MainScreenProps {
  // Top Bar
  coins: number;
  gems: number;
  progressPosition: number;
  playerLevel: number;
  currentLesson: number;
  currentStageInSection: number;
  onAvatarClick: () => void;
  
  // Side Menu & Event Cards
  onLessonsClick: () => void;
  onShopClick: () => void;
  onArenaClick: () => void;
  subscriptionTier: 'free' | 'pro' | 'master';
  
  // Character Lineup
  onJumpToLesson: () => void;
  onUniversityClick: () => void;
  onProfileClick: () => void;
  onSubscriptionClick: () => void;
  onManagerClick: () => void;
  
  // Player Status Bar
  playerName: string;
  streak: number;
  totalXp: number;
  onStreakClick: () => void;
  
  // Progress Animation
  onProgressClick: () => void;
  currentBookLessonIndex: number;
  currentGameType: 'reading' | 'matching' | 'quiz';
  isFirstRound: boolean;
  
  // Video background
  hasVideoBackground?: boolean;
}

// ===== STYLE OBJEKTUMOK =====
const styles: Record<string, CSSProperties> = {
  // Fő konténer - Teljes képernyő, overflow hidden
  container: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    overflow: 'hidden' as const,
  },
  
  // Háttér overlay - Fantasy kristálybarlang téma
  backgroundOverlay: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  
  // Gradiens háttér - Radial és linear gradiens kombinálva
  gradientBackground: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: OPACITY[30],
  },
  
  // Kristály dekoráció - Bal alsó sarok
  crystalBottomLeft: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    width: SIZES.width32,
    height: SIZES.height40,
    borderTopRightRadius: SIZES.radiusFull,
  },
  
  // Kristály dekoráció - Jobb alsó sarok
  crystalBottomRight: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: SIZES.width40,
    height: SIZES.height32,
    borderTopLeftRadius: SIZES.radiusFull,
  },
  
  // Kristály dekoráció - Bal középső rész (forgatva)
  crystalTopLeftCenter: {
    position: 'absolute' as const,
    top: '33.333333%',
    left: '25%',
    width: SIZES.width24,
    height: SIZES.height32,
    transform: 'rotate(-12deg)',
  },
  
  // Kristály dekoráció - Jobb középső rész (forgatva)
  crystalTopRightCenter: {
    position: 'absolute' as const,
    top: '50%',
    right: '33.333333%',
    width: SIZES.width20,
    height: SIZES.height28,
    transform: 'rotate(12deg)',
  },
  
  // Barlang kristályok - Bal alsó scatter 1
  caveCrystalBottomLeft1: {
    position: 'absolute' as const,
    bottom: 192,
    left: SPACING['2xl'],
    width: SIZES.width16,
    height: SIZES.height20,
    borderTopLeftRadius: SIZES.radiusLG,
    borderTopRightRadius: SIZES.radiusLG,
    transform: 'rotate(12deg)',
  },
  
  // Barlang kristályok - Bal alsó scatter 2
  caveCrystalBottomLeft2: {
    position: 'absolute' as const,
    bottom: 208,
    left: 80,
    width: SIZES.width12,
    height: SIZES.height16,
    borderTopLeftRadius: SIZES.radiusLG,
    borderTopRightRadius: SIZES.radiusLG,
    transform: 'rotate(-6deg)',
  },
  
  // Barlang kristályok - Jobb alsó scatter
  caveCrystalBottomRight: {
    position: 'absolute' as const,
    bottom: 192,
    right: SPACING['3xl'],
    width: SIZES.width20,
    height: SIZES.height24,
    borderTopLeftRadius: SIZES.radiusLG,
    borderTopRightRadius: SIZES.radiusLG,
    transform: 'rotate(6deg)',
  },
  
  // Fő tartalom konténer - Flex column layout
  mainContent: {
    position: 'relative' as const,
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    paddingTop: SPACING['3xl'],
    zIndex: Z_INDEX.content,
  },
  
  // Középső szekció - Játék világ (flex-1)
  middleSection: {
    flex: 1,
    position: 'relative' as const,
    paddingBottom: SPACING['2xl'],
  },
};

// ===== KOMPONENS =====
export function MainScreen({
  // Top Bar props
  coins,
  gems,
  progressPosition,
  playerLevel,
  currentLesson,
  currentStageInSection,
  onAvatarClick,
  
  // Side Menu & Event Cards props
  onLessonsClick,
  onShopClick,
  onArenaClick,
  subscriptionTier,
  
  // Character Lineup props
  onJumpToLesson,
  onUniversityClick,
  onProfileClick,
  onSubscriptionClick,
  onManagerClick,
  
  // Player Status Bar props
  playerName,
  streak,
  totalXp,
  onStreakClick,
  
  // Progress Animation props
  onProgressClick,
  currentBookLessonIndex,
  currentGameType,
  isFirstRound,
  
  // Video background
  hasVideoBackground = false,
}: MainScreenProps) {
  // ===== COMPUTED VALUES =====
  const totalXpForNextLevel = getTotalXpForLevel(playerLevel + 1);

  // Dinamikus háttérszín - Videó jelenlététől függ
  const containerBackgroundColor = hasVideoBackground 
    ? COLORS.transparent 
    : 'rgba(15, 23, 42, 1)';

  // Dinamikus overlay opacity és z-index
  const overlayOpacity = hasVideoBackground ? OPACITY[40] : OPACITY[100];
  const overlayZIndex = hasVideoBackground ? Z_INDEX.overlay : Z_INDEX.base;

  // ===== RENDER =====
  return (
    <div style={{ 
      ...styles.container, 
      backgroundColor: containerBackgroundColor 
    }}>
      {/* Háttér fantasy kristálybarlang téma overlay-el */}
      <div style={{ 
        ...styles.backgroundOverlay,
        opacity: overlayOpacity,
        zIndex: overlayZIndex,
      }}>
        {/* Gradiens háttér - Radial és linear kombináció */}
        <div 
          style={{
            ...styles.gradientBackground,
            background: `
              radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
              linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(88, 28, 135, 0.4))
            `,
          }}
        />
        
        {/* Kristály dekorációk - Sarkok */}
        <div 
          style={{
            ...styles.crystalBottomLeft,
            background: `linear-gradient(to bottom right, rgba(147, 51, 234, 0.4), ${COLORS.transparent})`,
          }}
        />
        <div 
          style={{
            ...styles.crystalBottomRight,
            background: `linear-gradient(to bottom left, rgba(37, 99, 235, 0.3), ${COLORS.transparent})`,
          }}
        />
        <div 
          style={{
            ...styles.crystalTopLeftCenter,
            background: `linear-gradient(to bottom right, rgba(168, 85, 247, 0.2), ${COLORS.transparent})`,
          }}
        />
        <div 
          style={{
            ...styles.crystalTopRightCenter,
            background: `linear-gradient(to bottom left, rgba(236, 72, 153, 0.2), ${COLORS.transparent})`,
          }}
        />
        
        {/* Barlang kristályok - Szétszórva alul */}
        <div 
          style={{
            ...styles.caveCrystalBottomLeft1,
            background: `linear-gradient(to top, rgba(147, 51, 234, 0.5), rgba(168, 85, 247, 0.3))`,
          }}
        />
        <div 
          style={{
            ...styles.caveCrystalBottomLeft2,
            background: `linear-gradient(to top, rgba(37, 99, 235, 0.4), rgba(96, 165, 250, 0.2))`,
          }}
        />
        <div 
          style={{
            ...styles.caveCrystalBottomRight,
            background: `linear-gradient(to top, rgba(219, 39, 119, 0.4), rgba(244, 114, 182, 0.2))`,
          }}
        />
      </div>

      {/* Fő tartalom - Videó és kristály overlay felett */}
      <div style={styles.mainContent}>
        {/* Felső szekció - TopBar */}
        <TopBar 
          coins={coins} 
          gems={gems} 
          progressPosition={progressPosition} 
          playerLevel={playerLevel} 
          currentLesson={currentLesson} 
          onAvatarClick={onAvatarClick}
          currentStageInSection={currentStageInSection}
        />

        {/* Középső szekció - Játék világ (SideMenu + EventCards) */}
        <div style={styles.middleSection}>
          <SideMenu onLessonsClick={onLessonsClick} onShopClick={onShopClick} />
          <EventCards onArenaClick={onArenaClick} subscriptionTier={subscriptionTier} />
        </div>

        {/* Tipp sáv */}
        <TipBar />

        {/* Alsó menü - Character lineup */}
        <CharacterLineup 
          onJumpToLesson={onJumpToLesson} 
          onUniversityClick={onUniversityClick}
          onProfileClick={onProfileClick}
          onSubscriptionClick={onSubscriptionClick}
          onManagerClick={onManagerClick}
        />

        {/* Játékos státusz sáv */}
        <PlayerStatusBar 
          playerName={playerName} 
          subscriptionTier={subscriptionTier} 
          streak={streak}
          totalXp={totalXp}
          totalXpForNextLevel={totalXpForNextLevel}
          playerLevel={playerLevel}
          onStreakClick={onStreakClick}
        />

        {/* Progress animáció - "Tovább" gomb */}
        <ProgressAnimation 
          onClick={onProgressClick} 
          currentBookLessonIndex={currentBookLessonIndex}
          currentGameType={currentGameType}
          isFirstRound={isFirstRound}
        />
      </div>
    </div>
  );
}
