# 🎓 LESSONGAME - React Native Konverzió Összefoglaló

**Dátum:** 2025-01-01  
**Komponens:** LessonGame (Matching game for lessons)  
**Státusz:** ✅ KÉSZ

---

## 📊 GYORS ÁTTEKINTÉS

| Metric | Web verzió | React Native verzió |
|--------|-----------|---------------------|
| **Fájlnév** | `LessonGame.tsx` | `LessonGame.rn.tsx` |
| **Sorok száma** | ~490 | ~500 |
| **Props** | 4 | 5 (+ config) |
| **Game states** | 3 | 3 ✅ |
| **Max visible pairs** | 5 | 5 ✅ |
| **Animations lib** | framer-motion | Reanimated ✅ |
| **Timer** | setInterval | setInterval ✅ |
| **Layout** | CSS Grid | Flexbox ✅ |

---

## ✅ MIT CSINÁLTUNK?

### **1. Layout Conversion**

#### **Web verzió (CSS Grid):**
```tsx
const styles = {
  gameGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: SPACING.base,
  },
};

<div style={styles.gameGrid}>
  <div style={styles.columnWrapper}>
    {leftBoxes.map(...)}
  </div>
  <div style={styles.columnWrapper}>
    {rightBoxes.map(...)}
  </div>
</div>
```

#### **React Native verzió (Flexbox):**
```tsx
const styles = StyleSheet.create({
  gameGrid: {
    flexDirection: 'row',
    gap: SPACING.base,
  },
  columnWrapper: {
    flex: 1,
    gap: SPACING.md,
  },
});

<View style={styles.gameGrid}>
  <View style={styles.columnWrapper}>
    {leftBoxes.map(...)}
  </View>
  <View style={styles.columnWrapper}>
    {rightBoxes.map(...)}
  </View>
</View>
```

### **2. Box Rendering**

#### **Web verzió:**
```tsx
<button
  key={box.id}
  onClick={() => handleLeftClick(box)}
  style={styles.matchBox(
    selectedLeft?.id === box.id,
    false,
    'left'
  )}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = `${COLORS.crystalPurple}40`;
  }}
>
  <span style={styles.matchBoxText}>{box.text}</span>
</button>
```

#### **React Native verzió:**
```tsx
const renderMatchBox = (box: BoxItem, side: 'left' | 'right') => {
  const isSelected = side === 'left' 
    ? selectedLeft?.id === box.id 
    : selectedRight?.id === box.id;
  const isFlashing = flashingBox === box.id;

  return (
    <TouchableOpacity
      key={box.id}
      onPress={() => side === 'left' ? handleLeftClick(box) : handleRightClick(box)}
      activeOpacity={0.8}
    >
      <View style={[
        styles.matchBox,
        side === 'left' ? styles.matchBoxLeft : styles.matchBoxRight,
        isSelected && styles.matchBoxSelected,
        isFlashing && styles.matchBoxFlashing,
      ]}>
        <Text style={styles.matchBoxText}>{box.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Render:
{leftBoxes.map((box) => renderMatchBox(box, 'left'))}
{rightBoxes.map((box) => renderMatchBox(box, 'right'))}
```

### **3. Emoji Animation**

#### **Web verzió (framer-motion):**
```tsx
<motion.div
  style={styles.emojiAnimated}
  animate={{
    y: [0, -20, 0],  // Win: bounce up
  }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: "easeInOut"
  }}
>
  👆
</motion.div>
```

#### **React Native verzió (Reanimated):**
```tsx
// State
const emojiTranslateY = useSharedValue(0);

// Start animation
useEffect(() => {
  if (gameStatus === 'won' || gameStatus === 'lost') {
    const offset = gameStatus === 'won' ? -20 : 20;
    
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

// Animated style
const emojiAnimatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: emojiTranslateY.value }],
}));

// Render
<Animated.Text style={[styles.emojiAnimated, emojiAnimatedStyle]}>
  👆
</Animated.Text>
```

---

## 🎮 GAME LOGIC (Ugyanaz!)

### **Initialization:**
```tsx
// 1. Shuffle all pairs
const shuffled = [...sourcePairs].sort(() => Math.random() - 0.5);

// 2. Show max 5 pairs
const initialPairs = shuffled.slice(0, 5);
const remaining = shuffled.slice(5);

// 3. Create left/right boxes
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

// 4. Shuffle each column
setLeftBoxes(leftItems.sort(() => Math.random() - 0.5));
setRightBoxes(rightItems.sort(() => Math.random() - 0.5));
```

### **Match checking:**
```tsx
const checkMatch = (left: BoxItem, right: BoxItem) => {
  if (left.pairId === right.pairId) {
    // ✅ CORRECT MATCH
    setFlashingBox(right.id);  // Green flash

    setTimeout(() => {
      // Remove boxes
      setLeftBoxes(prev => prev.filter(b => b.id !== left.id));
      setRightBoxes(prev => prev.filter(b => b.id !== right.id));
      
      // Clear selection
      setSelectedLeft(null);
      setSelectedRight(null);
      setFlashingBox(null);
      
      // Increment count
      setMatchedCount(prev => prev + 1);
      
      // Add new pair if available
      if (remainingPairs.length > 0) {
        const newPair = remainingPairs[0];
        setRemainingPairs(prev => prev.slice(1));
        
        // Create new boxes
        const newLeft = { pairId: newPair.id, text: newPair.left, side: 'left', id: `left-${newPair.id}-${Date.now()}` };
        const newRight = { pairId: newPair.id, text: newPair.right, side: 'right', id: `right-${newPair.id}-${Date.now()}` };
        
        // Add and reshuffle
        setLeftBoxes(prev => [...prev, newLeft].sort(() => Math.random() - 0.5));
        setRightBoxes(prev => [...prev, newRight].sort(() => Math.random() - 0.5));
      }
    }, 500);
  } else {
    // ❌ WRONG MATCH
    setTimeout(() => {
      setSelectedLeft(null);
      setSelectedRight(null);
    }, 500);
  }
};
```

**Same logic in both versions!** ✅

---

## 🎨 BOX STYLING

### **State-based styling:**

| State | Left Box (Purple) | Right Box (Pink) |
|-------|-------------------|------------------|
| **Default** | `#A855F730` bg + `#A855F780` border | `#EC489930` bg + `#EC489980` border |
| **Selected** | `#3B82F680` bg + `#60A5FA` border + scale 1.05 | Same |
| **Flashing** | `#10B981` bg + border (green) | Same |

### **Web version (dynamic style function):**
```tsx
const styles = {
  matchBox: (isSelected, isFlashing, side) => ({
    backgroundColor: isFlashing 
      ? COLORS.success
      : isSelected 
        ? `${COLORS.primary}80`
        : side === 'left'
          ? `${COLORS.crystalPurple}30`
          : `${COLORS.crystalPink}30`,
    borderColor: isFlashing 
      ? COLORS.success
      : isSelected 
        ? COLORS.xpBlueLight
        : side === 'left'
          ? `${COLORS.crystalPurple}80`
          : `${COLORS.crystalPink}80`,
    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
  }),
};
```

### **React Native version (style array):**
```tsx
const styles = StyleSheet.create({
  matchBox: {
    padding: SPACING.base,
    borderRadius: SIZES.radiusXL,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: SIZES.borderBase,
  },
  matchBoxLeft: {
    backgroundColor: `${COLORS.crystalPurple}30`,
    borderColor: `${COLORS.crystalPurple}80`,
  },
  matchBoxRight: {
    backgroundColor: `${COLORS.crystalPink}30`,
    borderColor: `${COLORS.crystalPink}80`,
  },
  matchBoxSelected: {
    backgroundColor: `${COLORS.primary}80`,
    borderColor: COLORS.xpBlueLight,
    transform: [{ scale: 1.05 }],
  },
  matchBoxFlashing: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
});

// Usage:
<View style={[
  styles.matchBox,
  side === 'left' ? styles.matchBoxLeft : styles.matchBoxRight,
  isSelected && styles.matchBoxSelected,
  isFlashing && styles.matchBoxFlashing,
]} />
```

---

## ⏱️ TIMER

### **Same logic (setInterval):**
```tsx
// Both versions use the same timer logic
useEffect(() => {
  if (gameStatus !== 'playing') return;

  if (timeLeft <= 0) {
    setGameStatus('lost');
    return;
  }

  const timer = setInterval(() => {
    setTimeLeft(prev => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft, gameStatus]);
```

### **Visual warning (≤ 10s):**
```tsx
// Web:
<div style={styles.timerBadge(timeLeft <= 10)}>
  {timeLeft}s
</div>

// React Native:
<View style={[
  styles.timerBadge,
  timeLeft <= 10 && styles.timerBadgeLowTime
]}>
  <Text style={[
    styles.timerText,
    timeLeft <= 10 && styles.timerTextLowTime
  ]}>
    {timeLeft}s
  </Text>
</View>
```

**Blue → Red when ≤ 10 seconds!**

---

## 🏆 WIN/LOSE SCREENS

### **Web version:**
```tsx
if (gameStatus === 'won') {
  return (
    <div style={styles.centerContainer}>
      <motion.div style={styles.emojiAnimated} animate={{ y: [0, -20, 0] }}>
        👆
      </motion.div>
      <h1 style={styles.resultTitle}>GYŐZTÉL!</h1>
      <p style={styles.winSubtitle}>Minden párt sikeresen megtaláltál!</p>
      <button onClick={onWin} style={styles.continueButton(true)}>
        <span>TOVÁBB</span>
      </button>
    </div>
  );
}
```

### **React Native version:**
```tsx
if (gameStatus === 'won') {
  return (
    <View style={styles.centerContainer}>
      <Animated.Text style={[styles.emojiAnimated, emojiAnimatedStyle]}>
        👆
      </Animated.Text>
      <Text style={styles.resultTitle}>GYŐZTÉL!</Text>
      <Text style={styles.winSubtitle}>Minden párt sikeresen megtaláltál!</Text>
      <TouchableOpacity onPress={onWin} style={styles.continueButtonWin}>
        <Text style={styles.continueButtonText}>TOVÁBB</Text>
      </TouchableOpacity>
    </View>
  );
}
```

**Same structure, different components!** ✅

---

## 🎨 COLOR PALETTE

| Color | Hex | Usage |
|-------|-----|-------|
| **Crystal Purple** | #A855F7 | Left boxes (background + border) |
| **Crystal Pink** | #EC4899 | Right boxes (background + border) |
| **Primary Blue** | #3B82F6 | Selected boxes |
| **XP Blue Light** | #60A5FA | Selected border + timer (normal) |
| **Success Green** | #10B981 | Flashing (correct match) + win button |
| **Danger Red** | #EF4444 | Timer (≤ 10s) |
| **White** | #FFFFFF | Text |

---

## 📊 GAME STATES

| State | Description | UI |
|-------|-------------|-----|
| **playing** | Game in progress | Game grid + timer + counter |
| **won** | All pairs matched | 👆 + "GYŐZTÉL!" + TOVÁBB button |
| **lost** | Timer reached 0 | 👇 + "VESZTETTÉL!" + TOVÁBB button |

---

## 🔧 MAIN DIFFERENCES

| Aspect | Web | React Native |
|--------|-----|--------------|
| **Layout** | CSS Grid | Flexbox |
| **Boxes** | `<button>` + dynamic style function | `<TouchableOpacity>` + style array |
| **Hover** | onMouseEnter/Leave | Not needed (activeOpacity) |
| **Emoji animation** | framer-motion | Reanimated |
| **Text** | `<span>`, `<h1>`, `<p>` | `<Text>` |
| **Scrolling** | `<div>` with overflow | `<ScrollView>` |

---

## 📦 DEPENDENCIES

### **Web:**
```json
{
  "framer-motion": "^11.x"
}
```

### **React Native:**
```json
{
  "react-native-reanimated": "^3.x"
}
```

### **Setup:**
```bash
# Install
npm install react-native-reanimated

# Add Babel plugin (babel.config.js)
plugins: ['react-native-reanimated/plugin']

# iOS
cd ios && pod install && cd ..

# Reset cache
npx react-native start --reset-cache
```

---

## 🎉 EREDMÉNY

**LessonGame React Native konverzió kész! ✅**

### **Mit kaptál:**
- ✅ Matching game with timer
- ✅ Two-column layout (left/right boxes)
- ✅ Selection logic (tap to select/deselect)
- ✅ Match checking (correct → green flash, wrong → deselect)
- ✅ Progress tracking (X/Y pairs matched)
- ✅ Timer countdown (with red warning at ≤ 10s)
- ✅ Max 5 visible pairs (new pairs on match)
- ✅ Win screen (animated 👆 + "GYŐZTÉL!")
- ✅ Lose screen (animated 👇 + "VESZTETTÉL!")
- ✅ ~500 lines of clean code

### **Következő lépés:**
1. Másold be: `cp exports/LessonGame.rn.tsx src/components/LessonGame.tsx`
2. Telepítsd: `npm install react-native-reanimated`
3. **FONTOS:** Add hozzá a Reanimated Babel plugin-t!
4. iOS: `cd ios && pod install && cd ..`
5. Reset cache: `npx react-native start --reset-cache`
6. Készítsd el a lesson data-t (pairs array)
7. Használd! 🎓✨

### **Opcionális fejlesztések:**
- Add hozzá a sound effects-t (correct/wrong sounds)
- Implementálj vibration feedback-et
- Add hozzá a hint system-et (reveal one pair)
- Implementálj streak counter-t (X correct in a row)
- Add hozzá a leaderboard-ot (fastest time)

---

**Készült:** 2025-01-01  
**Verzió:** 1.0.0  
**Fájl:** `LessonGame.rn.tsx` (~500 sor)  
**Komplexitás:** Közepes (matching logic + timer + animations)  
**Státusz:** ✅ Production Ready
