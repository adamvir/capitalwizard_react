# 🎓 LessonGame - React Native Útmutató

**Matching game for lessons with timer and win/lose screens**

---

## 🚀 GYORS HASZNÁLAT (5 perc)

### **1. Telepítsd a függőségeket:**
```bash
npm install react-native-reanimated
cd ios && pod install && cd ..
```

### **2. Másold a fájlt:**
```bash
cp exports/LessonGame.rn.tsx src/components/LessonGame.tsx
```

### **3. Használd:**
```tsx
import { LessonGame } from './components/LessonGame';

const lessonData = {
  id: 1,
  title: 'Pénzügyi alapfogalmak',
  matching: [
    { id: 1, left: 'Részvény', right: 'Tulajdonrész egy vállalatban' },
    { id: 2, left: 'Kötvény', right: 'Hitelpapír' },
    { id: 3, left: 'Befektetés', right: 'Pénz elhelyezése jövőbeli hozam céljából' },
    // ... 8 pairs total
  ],
};

<LessonGame
  lessonNumber={1}
  lessonData={lessonData}
  onWin={() => {
    // Award coins, advance to next lesson, etc.
    navigation.navigate('LessonComplete');
  }}
  onBackToHome={() => navigation.goBack()}
  config={{
    matchingTimeLimit: 60,     // 60 seconds
    matchingPairsCount: 8,     // Win when 8 pairs matched
  }}
/>
```

**KÉSZ! 🎉**

---

## 📋 MI VAN BENNE?

### **Game flow:**
1. 🎮 **Playing screen:**
   - Left column (purple boxes) + Right column (pink boxes)
   - Select one box from each side to make a match
   - Timer counts down
   - Progress tracker (X/Y pairs matched)
   - Maximum 5 pairs visible at once (new pairs appear when matched)

2. 🏆 **Win screen:**
   - Animated 👆 emoji (bouncing up/down)
   - "GYŐZTÉL!" message
   - "TOVÁBB" button (calls onWin)

3. 💀 **Lose screen:**
   - Animated 👇 emoji (bouncing up/down)
   - "VESZTETTÉL!" message
   - "TOVÁBB" button (calls onBackToHome)

### **Game mechanics:**
| Mechanic | Behavior |
|----------|----------|
| **Selection** | Click/tap a box to select it (purple/pink highlight) |
| **Matching** | Select one box from each column to check match |
| **Correct match** | Box flashes green, pair removed, new pair added |
| **Wrong match** | Boxes deselect after 500ms delay |
| **Timer** | Counts down from config.matchingTimeLimit |
| **Win condition** | Match all config.matchingPairsCount pairs |
| **Lose condition** | Timer reaches 0 |

---

## 🎯 PROPS INTERFÉSZ

```tsx
interface Pair {
  id: number;
  left: string;   // Left box text
  right: string;  // Right box text
}

interface Lesson {
  id: number;
  title: string;
  matching: Pair[];  // Array of pairs to match
}

interface LessonGameProps {
  onBackToHome?: () => void;  // Called on lose
  onWin?: () => void;         // Called on win
  lessonNumber?: number;      // Lesson number (display only)
  lessonData?: Lesson;        // Lesson data with pairs
  config?: {
    matchingTimeLimit: number;   // Time limit in seconds
    matchingPairsCount: number;  // Total pairs to match for win
  };
}
```

### **Használati példák:**

#### **Basic usage:**
```tsx
<LessonGame
  lessonNumber={1}
  lessonData={penzugyiAlapismeretkLessons[0]}
  onWin={() => console.log('User won!')}
  onBackToHome={() => navigation.goBack()}
/>
```

#### **Custom config:**
```tsx
<LessonGame
  lessonNumber={2}
  lessonData={lessonData}
  config={{
    matchingTimeLimit: 120,  // 2 minutes instead of 1
    matchingPairsCount: 10,  // 10 pairs instead of 8
  }}
  onWin={() => {
    // Award coins
    setCoins(prev => prev + 50);
    // Mark lesson complete
    markLessonComplete(2);
    // Navigate to next lesson
    navigation.navigate('Lesson', { lessonNumber: 3 });
  }}
/>
```

#### **With navigation:**
```tsx
function LessonGameScreen({ route, navigation }) {
  const { lessonNumber, lessonData } = route.params;

  return (
    <LessonGame
      lessonNumber={lessonNumber}
      lessonData={lessonData}
      onWin={() => {
        navigation.navigate('LessonComplete', { lessonNumber });
      }}
      onBackToHome={() => {
        navigation.goBack();
      }}
    />
  );
}
```

---

## 🎮 GAME LOGIC

### **1. Initialization (max 5 pairs visible):**
```tsx
useEffect(() => {
  const sourcePairs = lessonData.matching;  // e.g., 8 pairs total
  setTotalPairs(sourcePairs.length);

  // Shuffle all pairs
  const shuffled = [...sourcePairs].sort(() => Math.random() - 0.5);

  // Show maximum 5 pairs at once
  const maxVisiblePairs = 5;
  const initialPairs = shuffled.slice(0, 5);        // First 5 pairs (visible)
  const remaining = shuffled.slice(5);              // Remaining 3 pairs (hidden)
  setRemainingPairs(remaining);

  // Create left and right boxes
  const leftItems = initialPairs.map((pair) => ({
    pairId: pair.id,
    text: pair.left,
    side: 'left',
    id: `left-${pair.id}`,
  }));

  const rightItems = initialPairs.map((pair) => ({
    pairId: pair.id,
    text: pair.right,
    side: 'right',
    id: `right-${pair.id}`,
  }));

  // Shuffle each column separately
  setLeftBoxes(leftItems.sort(() => Math.random() - 0.5));
  setRightBoxes(rightItems.sort(() => Math.random() - 0.5));
}, [lessonData]);
```

**Result:**
- 5 purple boxes (left column)
- 5 pink boxes (right column)
- 3 pairs hidden (will appear when matches are made)

### **2. Selection logic:**
```tsx
const handleLeftClick = (box: BoxItem) => {
  // Deselect if already selected
  if (selectedLeft?.id === box.id) {
    setSelectedLeft(null);
    return;
  }

  // Select this box
  setSelectedLeft(box);

  // If right box already selected, check match
  if (selectedRight) {
    checkMatch(box, selectedRight);
  }
};

const handleRightClick = (box: BoxItem) => {
  // Same logic for right side
  if (selectedRight?.id === box.id) {
    setSelectedRight(null);
    return;
  }

  setSelectedRight(box);

  if (selectedLeft) {
    checkMatch(selectedLeft, box);
  }
};
```

### **3. Match checking:**
```tsx
const checkMatch = (left: BoxItem, right: BoxItem) => {
  if (left.pairId === right.pairId) {
    // ✅ CORRECT MATCH!
    setFlashingBox(right.id);  // Flash green

    setTimeout(() => {
      // Remove matched boxes
      setLeftBoxes(prev => prev.filter(b => b.id !== left.id));
      setRightBoxes(prev => prev.filter(b => b.id !== right.id));

      // Clear selection
      setSelectedLeft(null);
      setSelectedRight(null);
      setFlashingBox(null);

      // Increment match count
      setMatchedCount(prev => prev + 1);

      // Add new pair if available
      if (remainingPairs.length > 0) {
        const newPair = remainingPairs[0];
        setRemainingPairs(prev => prev.slice(1));

        const newLeft = {
          pairId: newPair.id,
          text: newPair.left,
          side: 'left',
          id: `left-${newPair.id}-${Date.now()}`,
        };

        const newRight = {
          pairId: newPair.id,
          text: newPair.right,
          side: 'right',
          id: `right-${newPair.id}-${Date.now()}`,
        };

        // Add and reshuffle
        setLeftBoxes(prev => [...prev, newLeft].sort(() => Math.random() - 0.5));
        setRightBoxes(prev => [...prev, newRight].sort(() => Math.random() - 0.5));
      }
    }, 500);  // 500ms delay for flash animation
  } else {
    // ❌ WRONG MATCH
    setTimeout(() => {
      setSelectedLeft(null);
      setSelectedRight(null);
    }, 500);  // 500ms delay for user to see wrong match
  }
};
```

### **4. Timer countdown:**
```tsx
useEffect(() => {
  if (gameStatus !== 'playing') return;

  if (timeLeft <= 0) {
    setGameStatus('lost');  // Time's up!
    return;
  }

  const timer = setInterval(() => {
    setTimeLeft(prev => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft, gameStatus]);
```

### **5. Win condition:**
```tsx
useEffect(() => {
  if (gameStatus === 'playing' && matchedCount === config.matchingPairsCount) {
    setGameStatus('won');  // All pairs matched!
  }
}, [matchedCount, gameStatus]);
```

---

## 🎨 BOX STYLING

### **Left boxes (purple):**
```tsx
matchBoxLeft: {
  backgroundColor: '#A855F730',  // Crystal purple (30% opacity)
  borderColor: '#A855F780',      // Crystal purple (80% opacity)
  borderWidth: 2,
}

// When selected:
matchBoxSelected: {
  backgroundColor: '#3B82F680',  // Primary blue (80% opacity)
  borderColor: '#60A5FA',        // XP blue light
  transform: [{ scale: 1.05 }],  // Slightly larger
}
```

### **Right boxes (pink):**
```tsx
matchBoxRight: {
  backgroundColor: '#EC489930',  // Crystal pink (30% opacity)
  borderColor: '#EC489980',      // Crystal pink (80% opacity)
  borderWidth: 2,
}
```

### **Flashing (correct match):**
```tsx
matchBoxFlashing: {
  backgroundColor: '#10B981',  // Success green
  borderColor: '#10B981',
}
```

### **Visual states:**
| State | Left Box | Right Box |
|-------|----------|-----------|
| **Default** | Purple (30%) + border (80%) | Pink (30%) + border (80%) |
| **Selected** | Blue (80%) + light blue border + scale 1.05 | Same |
| **Flashing** | Green background + green border | Same |

---

## 🏆 WIN/LOSE SCREENS

### **Win screen:**
```tsx
if (gameStatus === 'won') {
  return (
    <View style={styles.centerContainer}>
      <Animated.Text style={emojiAnimatedStyle}>
        👆  {/* Bounces up and down */}
      </Animated.Text>
      <Text style={styles.resultTitle}>GYŐZTÉL!</Text>
      <Text style={styles.winSubtitle}>
        Minden párt sikeresen megtaláltál!
      </Text>
      <TouchableOpacity onPress={onWin}>
        <Text>TOVÁBB</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### **Lose screen:**
```tsx
if (gameStatus === 'lost') {
  return (
    <View style={styles.centerContainer}>
      <Animated.Text style={emojiAnimatedStyle}>
        👇  {/* Bounces up and down */}
      </Animated.Text>
      <Text style={styles.resultTitle}>VESZTETTÉL!</Text>
      <Text style={styles.loseSubtitle}>Lejárt az idő!</Text>
      <TouchableOpacity onPress={onBackToHome}>
        <Text>TOVÁBB</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### **Emoji animation:**
```tsx
// Start animation when win/lose
useEffect(() => {
  if (gameStatus === 'won' || gameStatus === 'lost') {
    const offset = gameStatus === 'won' ? -20 : 20;  // Up for win, down for lose

    emojiTranslateY.value = withRepeat(
      withSequence(
        withTiming(offset, { duration: 500 }),
        withTiming(0, { duration: 500 })
      ),
      -1,  // Infinite
      false
    );
  }
}, [gameStatus]);
```

---

## ⏱️ TIMER DISPLAY

### **Normal state (> 10 seconds):**
```tsx
<View style={styles.timerBadge}>
  <Text style={styles.timerText}>{timeLeft}s</Text>
</View>

// Styling:
timerBadge: {
  backgroundColor: '#3B82F630',  // Blue (30% opacity)
}
timerText: {
  color: '#60A5FA',  // XP blue light
}
```

### **Low time state (≤ 10 seconds):**
```tsx
<View style={[styles.timerBadge, styles.timerBadgeLowTime]}>
  <Text style={[styles.timerText, styles.timerTextLowTime]}>
    {timeLeft}s
  </Text>
</View>

// Styling:
timerBadgeLowTime: {
  backgroundColor: '#EF444430',  // Red (30% opacity)
}
timerTextLowTime: {
  color: '#EF4444',  // Danger red
}
```

**Visual change:**
- **> 10s:** Blue background, light blue text
- **≤ 10s:** Red background, red text (warning!)

---

## 📊 PROGRESS TRACKING

### **Match counter:**
```tsx
<Text style={styles.matchCounter}>
  {matchedCount}/{totalPairs}
</Text>

// Example:
// "0/8"  → No matches yet
// "3/8"  → 3 out of 8 matched
// "8/8"  → All matched (WIN!)
```

**Position:** Header, next to timer

---

## 🔧 TESTRESZABÁS

### **1. Változtasd a time limit-et:**
```tsx
<LessonGame
  config={{
    matchingTimeLimit: 120,  // 2 minutes instead of 1
  }}
/>
```

### **2. Változtasd a max visible pairs-t:**
```tsx
// In LessonGame.tsx
const maxVisiblePairs = 7;  // 7 instead of 5
```

### **3. Változtasd a flash duration-t:**
```tsx
// Correct match flash
setTimeout(() => {
  // Remove boxes
}, 1000);  // 1000ms instead of 500ms
```

### **4. Add hozzá a sound effects-t:**
```bash
npm install react-native-sound
```

```tsx
import Sound from 'react-native-sound';

const correctSound = new Sound('correct.mp3', Sound.MAIN_BUNDLE);
const wrongSound = new Sound('wrong.mp3', Sound.MAIN_BUNDLE);

const checkMatch = (left, right) => {
  if (left.pairId === right.pairId) {
    correctSound.play();  // ✅ Play correct sound
    // ...
  } else {
    wrongSound.play();    // ❌ Play wrong sound
    // ...
  }
};
```

### **5. Add hozzá a vibration-t:**
```tsx
import { Vibration } from 'react-native';

const checkMatch = (left, right) => {
  if (left.pairId === right.pairId) {
    Vibration.vibrate(100);  // Short vibration (correct)
  } else {
    Vibration.vibrate([0, 100, 50, 100]);  // Pattern (wrong)
  }
};
```

---

## 🐛 HIBAKERESÉS

### **1. Reanimated not working:**
```bash
# Install reanimated
npm install react-native-reanimated

# Add Babel plugin (babel.config.js)
plugins: ['react-native-reanimated/plugin']

# Reset cache
npx react-native start --reset-cache
```

### **2. Boxes not rendering:**
```tsx
// Check lessonData structure
console.log('lessonData:', lessonData);
console.log('matching pairs:', lessonData?.matching);

// Ensure matching array exists
if (!lessonData?.matching) {
  return <Text>No lesson data</Text>;
}
```

### **3. Timer not counting down:**
```tsx
// Check gameStatus
console.log('gameStatus:', gameStatus);  // Should be 'playing'

// Check timeLeft
console.log('timeLeft:', timeLeft);
```

### **4. Win condition not triggering:**
```tsx
// Check config
console.log('config:', config);
console.log('matchedCount:', matchedCount);
console.log('matchingPairsCount:', config.matchingPairsCount);

// Ensure they match
if (matchedCount === config.matchingPairsCount) {
  console.log('WIN!');
}
```

### **5. Boxes not shuffling:**
```tsx
// Check shuffle function
const shuffled = [...array].sort(() => Math.random() - 0.5);
console.log('shuffled:', shuffled);
```

---

## 📊 STATISZTIKÁK

| Metric | Érték |
|--------|-------|
| **Teljes sor** | ~500 |
| **Props** | 5 |
| **Game states** | 3 (playing, won, lost) |
| **Max visible pairs** | 5 |
| **Selection states** | 4 (none, left, right, both) |
| **Box states** | 4 (default, selected, flashing, removed) |
| **Animations** | 1 (emoji bounce) |
| **Timers** | 1 (countdown) |
| **Függőségek** | 1 npm package (reanimated) |
| **Konverzió idő** | 10 perc |
| **Komplexitás** | Közepes |

---

## ✅ KONVERZIÓS ELLENŐRZŐ LISTA

- [x] LessonGame.rn.tsx létrehozva
- [x] Game playing screen
- [x] Win screen (animated emoji)
- [x] Lose screen (animated emoji)
- [x] Left/right box columns
- [x] Selection logic (left + right)
- [x] Match checking (correct/wrong)
- [x] Flash animation (green on match)
- [x] Timer countdown
- [x] Progress tracking (X/Y)
- [x] Max 5 visible pairs logic
- [x] New pair addition on match
- [x] Win condition check
- [x] Lose condition check
- [x] Inline styles → StyleSheet
- [x] Reanimated használva (emoji animation)
- [x] Kommentek hozzáadva

---

## 🎉 KÉSZ!

Most már van egy **teljes LessonGame React Native** komponensed!

**Mit kaptál:**
- ✅ Matching game with timer
- ✅ Left/right box columns (purple/pink)
- ✅ Selection logic (tap to select)
- ✅ Match checking (correct → green flash, wrong → deselect)
- ✅ Progress tracking (X/Y pairs matched)
- ✅ Timer countdown (with red warning at ≤ 10s)
- ✅ Max 5 visible pairs (new pairs appear on match)
- ✅ Win screen (animated 👆 emoji + "GYŐZTÉL!")
- ✅ Lose screen (animated 👇 emoji + "VESZTETTÉL!")
- ✅ iOS + Android support

**Következő lépés:**
1. Másold be a komponenst
2. Telepítsd a függőségeket (reanimated!)
3. Készítsd el a lesson data-t (pairs array)
4. Használd! 🎓✨

**Opcionális fejlesztések:**
- Add hozzá a sound effects-t (correct/wrong sounds)
- Implementálj vibration feedback-et
- Add hozzá a hint system-et (reveal one pair)
- Implementálj streak counter-t (X correct matches in a row)
- Add hozzá a leaderboard-ot (fastest completion time)

---

**Készült:** 2025-01-01  
**Verzió:** 1.0.0  
**Fájl:** `LessonGame.rn.tsx` (~500 sor)  
**Komplexitás:** Közepes (matching logic + timer + animations)
