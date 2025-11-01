import { TopBar } from './TopBar';
import { SideMenu } from './SideMenu';
import { EventCards } from './EventCards';
import { TipBar } from './TipBar';
import { CharacterLineup } from './CharacterLineup';
import { PlayerStatusBar } from './PlayerStatusBar';
import { ProgressAnimation } from './ProgressAnimation';
import { SPACING } from '../utils/styleConstants';

// ===== INTERFACES =====

interface MainScreenProps {
  // Player stats
  coins: number;
  gems: number;
  playerLevel: number;
  totalXp: number;
  progressPosition: number;
  currentLesson: number;
  currentStageInSection: number;
  playerName: string;
  subscriptionTier: 'free' | 'pro' | 'master';
  currentStreak: number;
  
  // Lesson state
  currentBookLessonIndex: number;
  currentGameType: 'reading' | 'matching' | 'quiz';
  isFirstRound: boolean;
  
  // Navigation callbacks
  onAvatarClick: () => void;
  onLessonsClick: () => void;
  onShopClick: () => void;
  onArenaClick: () => void;
  onUniversityClick: () => void;
  onProfileClick: () => void;
  onSubscriptionClick: () => void;
  onManagerClick: () => void;
  onStreakClick: () => void;
  onProgressClick: () => void;
  onJumpToLesson: (lesson: number) => void;
  
  // Utils
  getTotalXpForNextLevel: (level: number) => number;
}

// ===== COMPONENT =====

export function MainScreen({
  coins,
  gems,
  playerLevel,
  totalXp,
  progressPosition,
  currentLesson,
  currentStageInSection,
  playerName,
  subscriptionTier,
  currentStreak,
  currentBookLessonIndex,
  currentGameType,
  isFirstRound,
  onAvatarClick,
  onLessonsClick,
  onShopClick,
  onArenaClick,
  onUniversityClick,
  onProfileClick,
  onSubscriptionClick,
  onManagerClick,
  onStreakClick,
  onProgressClick,
  onJumpToLesson,
  getTotalXpForNextLevel
}: MainScreenProps) {
  
  // ===== STYLES =====
  const styles = {
    gameWorldContainer: {
      flex: 1,
      position: 'relative' as const,
      paddingBottom: SPACING.xl
    }
  };

  // ===== RENDER =====
  return (
    <>
      {/* Top section */}
      {/* NOTE: TopBar shows player resources (coins, gems) and level */}
      <TopBar 
        coins={coins} 
        gems={gems} 
        progressPosition={progressPosition} 
        playerLevel={playerLevel} 
        currentLesson={currentLesson} 
        onAvatarClick={onAvatarClick}
        currentStageInSection={currentStageInSection}
      />

      {/* Middle section - Game world */}
      {/* NOTE: This contains side menu and event cards */}
      <div style={styles.gameWorldContainer}>
        {/* Left side menu with quick actions */}
        <SideMenu 
          onLessonsClick={onLessonsClick} 
          onShopClick={onShopClick} 
        />
        
        {/* Center event cards showing current activities */}
        <EventCards 
          onArenaClick={onArenaClick} 
          subscriptionTier={subscriptionTier} 
        />
      </div>

      {/* Tip Bar */}
      {/* NOTE: Shows helpful tips and guidance */}
      <TipBar />

      {/* Bottom menu */}
      {/* NOTE: Main navigation bar with 5 sections */}
      <CharacterLineup 
        onJumpToLesson={onJumpToLesson} 
        onUniversityClick={onUniversityClick}
        onProfileClick={onProfileClick}
        onSubscriptionClick={onSubscriptionClick}
        onManagerClick={onManagerClick}
      />

      {/* Player Status Bar */}
      {/* NOTE: Shows player name, level, XP progress, and streak */}
      <PlayerStatusBar 
        playerName={playerName} 
        subscriptionTier={subscriptionTier} 
        streak={currentStreak}
        totalXp={totalXp}
        totalXpForNextLevel={getTotalXpForNextLevel(playerLevel + 1)}
        playerLevel={playerLevel}
        onStreakClick={onStreakClick}
      />

      {/* Progress Animation */}
      {/* NOTE: "Továbbhaladás" button - main CTA for starting next lesson */}
      <ProgressAnimation 
        onClick={onProgressClick} 
        currentBookLessonIndex={currentBookLessonIndex}
        currentGameType={currentGameType}
        isFirstRound={isFirstRound}
      />
    </>
  );
}
