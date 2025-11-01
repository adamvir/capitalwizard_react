interface StreakData {
  lastCompletionDate: string; // YYYY-MM-DD format
  currentStreak: number;
  completedToday: boolean;
  longestStreak: number; // Track the longest streak ever achieved
  streakFreezes: number; // Number of streak freezes available
  lastStreakFreezeDate?: string; // Date when last streak freeze was used
}

const STREAK_STORAGE_KEY = 'daily_streak';

// Get today's date in YYYY-MM-DD format (using local timezone)
function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get yesterday's date in YYYY-MM-DD format (using local timezone)
function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Calculate days between two date strings (YYYY-MM-DD format)
function getDaysBetween(date1: string, date2: string): number {
  if (!date1 || !date2) return 0;
  const d1 = new Date(date1 + 'T00:00:00');
  const d2 = new Date(date2 + 'T00:00:00');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Save streak data to localStorage
function saveStreakData(data: StreakData): void {
  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving streak data:', error);
  }
}

// Result type for streak freeze usage notification
interface StreakLoadResult {
  data: StreakData;
  freezeUsed: boolean;
  freezesUsedCount: number;
}

// Load streak data from localStorage (internal version)
function loadStreakDataInternal(): StreakLoadResult {
  let freezeUsed = false;
  let freezesUsedCount = 0;
  try {
    const saved = localStorage.getItem(STREAK_STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved) as StreakData;
      const today = getTodayString();
      const yesterday = getYesterdayString();
      
      // Ensure streakFreezes field exists (for backward compatibility)
      if (typeof data.streakFreezes !== 'number') {
        data.streakFreezes = 0;
      }
      
      // Check if the saved date is today - if yes, keep completedToday flag
      // If not today, reset completedToday to false for the new day
      if (data.lastCompletionDate !== today) {
        data.completedToday = false;
        
        // If last completion was NOT yesterday, streak might be broken
        if (data.lastCompletionDate !== yesterday) {
          const daysSkipped = getDaysBetween(data.lastCompletionDate, today) - 1; // -1 because the completion day doesn't count
          
          console.log('📅 Streak would expire. Last completion:', data.lastCompletionDate, 'Today:', today, 'Days skipped:', daysSkipped);
          console.log('📊 Current state - Streak:', data.currentStreak, 'Freezes available:', data.streakFreezes, 'Last freeze used:', data.lastStreakFreezeDate);
          
          // Check if we have enough streak freezes to cover the skipped days
          if (data.currentStreak > 0 && data.streakFreezes >= daysSkipped && daysSkipped > 0) {
            console.log(`❄️ Using ${daysSkipped} streak freeze(s) to save the streak! Remaining freezes:`, data.streakFreezes - daysSkipped);
            
            // Use the required number of streak freezes
            data.streakFreezes -= daysSkipped;
            data.lastStreakFreezeDate = today;
            // Set last completion to yesterday to keep the streak alive
            data.lastCompletionDate = yesterday;
            
            // Mark that freeze was used
            freezeUsed = true;
            freezesUsedCount = daysSkipped;
            
            console.log('✅ Streak saved! New state - Last completion:', data.lastCompletionDate, 'Freezes left:', data.streakFreezes);
            
            // Save the updated data
            saveStreakData(data);
          } else {
            // Not enough streak freezes available, reset the streak
            if (data.currentStreak > 0) {
              console.log('💔 Streak broken! Reason:', {
                hasStreak: data.currentStreak > 0,
                freezesAvailable: data.streakFreezes,
                freezesNeeded: daysSkipped,
                hasEnoughFreezes: data.streakFreezes >= daysSkipped
              });
            }
            data.currentStreak = 0;
            data.lastCompletionDate = '';
            // Save the reset data
            saveStreakData(data);
          }
        }
      }
      
      // Ensure longestStreak is never less than currentStreak
      if (data.currentStreak > (data.longestStreak || 0)) {
        console.log('🔧 Fixing longestStreak to match currentStreak:', data.currentStreak);
        data.longestStreak = data.currentStreak;
        saveStreakData(data);
      }
      
      return {
        data,
        freezeUsed,
        freezesUsedCount
      };
    }
  } catch (error) {
    console.error('Error loading streak data:', error);
  }
  
  return {
    data: {
      lastCompletionDate: '',
      currentStreak: 0,
      completedToday: false,
      longestStreak: 0,
      streakFreezes: 0
    },
    freezeUsed: false,
    freezesUsedCount: 0
  };
}

// Load streak data from localStorage (public version)
export function loadStreakData(): StreakData {
  const result = loadStreakDataInternal();
  return result.data;
}

// Record a task completion and update streak
export function recordTaskCompletion(): { isFirstToday: boolean; newStreak: number; longestStreak: number } {
  const data = loadStreakData();
  const today = getTodayString();
  const yesterday = getYesterdayString();
  
  console.log('🔥 recordTaskCompletion:', {
    today,
    yesterday,
    lastCompletionDate: data.lastCompletionDate,
    currentStreak: data.currentStreak,
    completedToday: data.completedToday,
    longestStreak: data.longestStreak
  });
  
  // If already completed today, just return current streak
  if (data.completedToday) {
    console.log('✅ Already completed today, returning current streak:', data.currentStreak);
    return {
      isFirstToday: false,
      newStreak: data.currentStreak,
      longestStreak: data.longestStreak || 0
    };
  }
  
  // This is the first completion today
  let newStreak = 1;
  
  if (data.lastCompletionDate === yesterday) {
    // Completed yesterday, so increment streak
    newStreak = data.currentStreak + 1;
    console.log('📈 Completed yesterday! Incrementing streak:', newStreak);
  } else if (data.lastCompletionDate === today) {
    // Already completed today (shouldn't happen, but just in case)
    newStreak = data.currentStreak;
    console.log('✅ Already completed today (edge case)');
  } else {
    // Streak broken or first time, reset to 1
    newStreak = 1;
    console.log('🔄 Streak broken or first time. Starting new streak:', newStreak);
  }
  
  // Update longest streak if new streak is higher
  const newLongestStreak = Math.max(newStreak, data.longestStreak || 0);
  if (newStreak > (data.longestStreak || 0)) {
    console.log('🏆 New longest streak record!', newStreak);
  }
  
  // Update and save
  const updatedData: StreakData = {
    lastCompletionDate: today,
    currentStreak: newStreak,
    completedToday: true,
    longestStreak: newLongestStreak,
    streakFreezes: data.streakFreezes || 0,
    lastStreakFreezeDate: data.lastStreakFreezeDate
  };
  
  saveStreakData(updatedData);
  console.log('💾 Saved new streak data:', updatedData);
  
  return {
    isFirstToday: true,
    newStreak: newStreak,
    longestStreak: newLongestStreak
  };
}

// Get current streak count
export function getCurrentStreak(): number {
  const data = loadStreakData();
  const today = getTodayString();
  const yesterday = getYesterdayString();
  
  console.log('📊 getCurrentStreak check:', {
    today,
    yesterday,
    lastCompletionDate: data.lastCompletionDate,
    currentStreak: data.currentStreak,
    completedToday: data.completedToday,
    streakFreezes: data.streakFreezes
  });
  
  // If last completion was today or yesterday, return current streak
  if (data.lastCompletionDate === today || data.lastCompletionDate === yesterday) {
    return data.currentStreak;
  }
  
  // Streak is broken - reset streak data (but keep longestStreak)
  // Note: loadStreakData already handles streak freeze usage, so if we get here,
  // the streak is truly broken (no freeze available or already used)
  if (data.currentStreak > 0) {
    console.warn('⚠️ Streak broken! Resetting to 0');
    // Ensure longestStreak is at least as high as the streak that just ended
    const preservedLongestStreak = Math.max(data.currentStreak, data.longestStreak || 0);
    const resetData: StreakData = {
      lastCompletionDate: '',
      currentStreak: 0,
      completedToday: false,
      longestStreak: preservedLongestStreak, // Preserve longest streak
      streakFreezes: data.streakFreezes || 0,
      lastStreakFreezeDate: data.lastStreakFreezeDate
    };
    saveStreakData(resetData);
  }
  
  return 0;
}

// Get longest streak ever achieved
export function getLongestStreak(): number {
  const data = loadStreakData();
  return data.longestStreak || 0;
}

// Reset streak (for game reset/restart)
export function resetStreak(): void {
  try {
    localStorage.removeItem(STREAK_STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting streak data:', error);
  }
}

// Add streak freezes
export function addStreakFreeze(count: number = 1): number {
  const data = loadStreakData();
  data.streakFreezes = (data.streakFreezes || 0) + count;
  saveStreakData(data);
  console.log('❄️ Added streak freeze(s). Total:', data.streakFreezes);
  return data.streakFreezes;
}

// Get number of streak freezes available
export function getStreakFreezes(): number {
  const data = loadStreakData();
  return data.streakFreezes || 0;
}
