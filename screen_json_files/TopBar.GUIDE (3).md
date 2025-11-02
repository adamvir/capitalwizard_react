# 🎮 TopBar - React Native Útmutató

**Player information display with avatar, resources, level, and stage progression**

⚠️ **FONTOS VÁLTOZÁSOK:**
- **2025-01-02:** Lecke információ megjelenítés hozzáadva (emoji + típus + sorszám)
- **2025-01-01:** "Szint X" text: Cyan color (#22D3EE) - gradient text NOT supported in RN
- LinearGradient wrapper eltávolítva (web: backgroundClip: 'text' → RN: solid color)
- **Container height:** 90px fixed height (prevents clipping of player card)

---

## 🚀 GYORS HASZNÁLAT (5 perc)

### **1. Telepítsd a függőségeket:**
```bash
npm install @react-native-async-storage/async-storage
npm install react-native-linear-gradient
npm install lucide-react-native
cd ios && pod install && cd ..
```

### **2. Másold a fájlt:**
```bash
cp exports/TopBar.rn.tsx src/components/TopBar.tsx
```

### **3. Használd:**
```tsx
import { TopBar } from './components/TopBar';

<TopBar
  coins={680}
  gems={0}
  progressPosition={3}
  playerLevel={2}
  currentLesson={7}
  currentStageInSection={4}
  currentGameType="reading"  // 'reading' | 'matching' | 'quiz'
  currentBookLessonIndex={0}  // 0-based
  onAvatarClick={() => navigation.navigate('AvatarSelector')}
/>
```

**KÉSZ! 🎉**

---

## 📋 MI VAN BENNE?

### **Left side - Player Info Card:**
- 👤 **Avatar** (clickable, stored in AsyncStorage)
  - Emoji megjelenítés
  - Placeholder "+" ha nincs avatar
  - Glow effect (gradient)
- 📊 **Level & XP progress bar**
  - "Szint X." text (gradient)
  - Horizontal progress bar
- 💰 **Coins** (Arany ikon + szám)
- 💎 **Gems** (Gyémánt ikon + szám)

### **Right side - Stage Progression Card:**
- 🗺️ **Zigzag path** (6 node-dal)
  - 5 square/circle node
  - 1 gem node (végpont)
  - Dashed connection lines
  - Active/inactive/current states
- 📚 **Lesson info badge** (emoji + típus + sorszám)
  - 📖 "1. Olvasás" / 🎴 "2. Párosítás" / ❓ "3. Kvíz"
  - Cyan színezés (#67E8F9)
- 📍 **Stage counter** ("Szakasz 4/6")

---

## 🎯 PROPS INTERFÉSZ

```tsx
interface TopBarProps {
  coins?: number;                    // Arany mennyiség (default: 680)
  gems?: number;                     // Gyémánt mennyiség (default: 0)
  progressPosition?: number;         // Stage progress (0-5, default: 3)
  playerLevel?: number;              // Játékos szintje (default: 2)
  currentLesson?: number;            // Aktuális lecke (default: 7)
  onAvatarClick?: () => void;        // Avatar klikk callback
  currentStageInSection?: number;    // Aktuális szakasz (1-6, default: 1)
  currentGameType?: 'reading' | 'matching' | 'quiz';  // Játék típusa (default: 'reading')
  currentBookLessonIndex?: number;   // Könyv lecke index (0-based, default: 0)
}
```

### **Használati példák:**

#### **Minimális:**
```tsx
<TopBar onAvatarClick={() => console.log('Avatar clicked')} />
```

#### **Teljes:**
```tsx
<TopBar
  coins={1200}
  gems={25}
  progressPosition={4}           // 0-5 (0 = start, 5 = end)
  playerLevel={10}
  currentLesson={12}
  currentStageInSection={5}      // 1-6
  currentGameType="matching"     // 'reading' | 'matching' | 'quiz'
  currentBookLessonIndex={1}     // 0-based (display: 2. Párosítás)
  onAvatarClick={() => navigation.navigate('AvatarSelector')}
/>
```

---

## 👤 AVATAR KEZELÉS

### **AsyncStorage tárolás:**
```tsx
// Avatar mentése (AvatarSelectorPage-ben):
await AsyncStorage.setItem('player_avatar', '😎');

// TopBar automatikusan betölti:
useEffect(() => {
  loadAvatar();
}, []);

const loadAvatar = async () => {
  try {
    const saved = await AsyncStorage.getItem('player_avatar');
    setCurrentAvatar(saved || null);
  } catch (error) {
    console.error('Error loading avatar:', error);
  }
};
```

### **AppState listener:**
```tsx
// Újratöltés amikor app előtérbe kerül:
useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      loadAvatar();  // Reload avatar
    }
  });

  return () => subscription.remove();
}, []);
```

### **Avatar megjelenés:**
```tsx
// Van avatar:
{currentAvatar ? (
  <Text style={styles.avatarEmoji}>{currentAvatar}</Text>
) : (
  <Text style={styles.avatarPlaceholder}>+</Text>
)}

// Avatar container styles:
currentAvatar ? styles.avatarWithImage : styles.avatarWithoutImage
```

---

## 📊 LEVEL & XP PROGRESS

### **Level display:**
```tsx
<LinearGradient
  colors={['#22D3EE', '#60A5FA']}  // Cyan → Blue
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
>
  <Text style={styles.levelText}>Szint {playerLevel}.</Text>
</LinearGradient>
```

### **Progress bar:**
```tsx
<View style={styles.progressBarBg}>
  <LinearGradient
    colors={['#FBBF24', '#FB923C', '#F97316']}  // Yellow → Orange
    style={[
      styles.progressBarFill,
      { width: playerLevel === 1 ? '0%' : '1%' },  // Minimal progress
    ]}
  />
</View>
```

**Megjegyzés:**  
A progress bar jelenleg csak "placeholder" (1% width), mert a teljes XP rendszer nem implementált. Ha szükséges, adj hozzá `currentXp` és `totalXpForNextLevel` props-okat:

```tsx
// Teljes XP rendszer:
const progressPercentage = (currentXp / totalXpForNextLevel) * 100;
{ width: `${progressPercentage}%` }
```

---

## 💰 COINS & GEMS

### **Coins (Arany):**
```tsx
<LinearGradient
  colors={['#FDE047', '#EAB308']}  // Yellow gradient
  style={styles.coinIconBg}
>
  <Coins size={12} color="#78350F" />
</LinearGradient>
<Text>{coins}</Text>
```

### **Gems (Gyémánt):**
```tsx
<LinearGradient
  colors={['#C084FC', '#9333EA']}  // Purple gradient
  style={styles.gemIconBg}
>
  <Gem size={12} color="#FFFFFF" />
</LinearGradient>
<Text>{gems}</Text>
```

---

## 🗺️ STAGE PROGRESSION (Zigzag Path)

### **Node types (6 db):**

| Index | Position | Type | State |
|-------|----------|------|-------|
| 0 | (10, 35) | square | active/inactive |
| 1 | (40, 15) | square | active/inactive |
| 2 | (70, 35) | square | active/inactive |
| 3 | (100, 15) | circle | active/inactive |
| 4 | (130, 35) | square | active/inactive |
| 5 | (150, 10) | gem | endpoint |

### **Node states:**

1. **Gem node** (index 5):
   - Purple gradient
   - Gem icon
   - Endpoint

2. **Current node** (index === progressPosition):
   - White color
   - Pulse effect
   - Border

3. **Active node** (index < progressPosition):
   - Red gradient
   - Shadow

4. **Inactive node** (index > progressPosition):
   - Gray color
   - No shadow

### **Connection lines:**
```tsx
// Dashed line between nodes:
const deltaX = to.x - from.x;
const deltaY = to.y - from.y;
const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

<View
  style={{
    width: length,
    borderColor: isActive ? 'rgba(220, 38, 38, 0.7)' : 'rgba(71, 85, 105, 0.4)',
    transform: [{ rotate: `${angle}deg` }],
    borderStyle: 'dashed',
  }}
/>
```

---

## 📚 LESSON INFO BADGE (ÚJ!)

### **Lecke információ megjelenítés:**

A jobb oldali stage progression card mostantól megmutatja az **aktuális lecke számát és típusát** emoji-val együtt.

### **Játék típusok:**

| Típus | Emoji | Szöveg | Leírás |
|-------|-------|--------|--------|
| `reading` | 📖 | Olvasás | Tananyag olvasása |
| `matching` | 🎴 | Párosítás | Párosító játék |
| `quiz` | ❓ | Kvíz | Kvíz kérdések |

### **Megjelenítés:**

```tsx
// Props:
currentGameType="reading"     // Játék típusa
currentBookLessonIndex={0}    // 0-based lecke index

// Megjelenés:
"📖 1. Olvasás"
```

### **Példák:**

```tsx
// 1. lecke - Olvasás:
<TopBar currentGameType="reading" currentBookLessonIndex={0} />
// → 📖 1. Olvasás

// 2. lecke - Párosítás:
<TopBar currentGameType="matching" currentBookLessonIndex={1} />
// → 🎴 2. Párosítás

// 3. lecke - Kvíz:
<TopBar currentGameType="quiz" currentBookLessonIndex={2} />
// → ❓ 3. Kvíz
```

### **Stílusok:**

```tsx
lessonInfoBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
  paddingHorizontal: 8,
  paddingVertical: 3,
  backgroundColor: 'rgba(6, 182, 212, 0.15)',  // Cyan tint
  borderColor: 'rgba(34, 211, 238, 0.3)',
  borderRadius: 4,
  borderWidth: 1,
}

lessonEmoji: {
  fontSize: 12,
}

lessonInfoText: {
  color: '#67E8F9',  // Cyan
  fontSize: 10,
}
```

### **Implementáció:**

```tsx
// Helper függvény:
const getGameTypeInfo = () => {
  switch (currentGameType) {
    case 'reading':
      return { emoji: '📖', text: 'Olvasás' };
    case 'matching':
      return { emoji: '🎴', text: 'Párosítás' };
    case 'quiz':
      return { emoji: '❓', text: 'Kvíz' };
    default:
      return { emoji: '📚', text: 'Lecke' };
  }
};

const gameTypeInfo = getGameTypeInfo();
const displayLessonNumber = currentBookLessonIndex + 1; // 1-based

// Render:
<View style={styles.lessonInfoBadge}>
  <Text style={styles.lessonEmoji}>{gameTypeInfo.emoji}</Text>
  <Text style={styles.lessonInfoText}>
    {displayLessonNumber}. {gameTypeInfo.text}
  </Text>
</View>
```

---

## 🎯 DIFFICULTY BADGE (DEPRECATED)

### **Nehézségi szintek:**
```tsx
const LESSON_DIFFICULTIES: Record<number, 'Könnyű' | 'Közepes' | 'Nehéz'> = {
  7: 'Közepes',
  8: 'Nehéz',
  9: 'Könnyű',
  10: 'Nehéz',
  // ...
};
```

### **Színek nehézség szerint:**

| Nehézség | Background | Border | Text |
|----------|-----------|--------|------|
| **Könnyű** | `rgba(16, 185, 129, 0.2)` | `rgba(52, 211, 153, 0.3)` | `#6EE7B7` (Green) |
| **Közepes** | `rgba(6, 182, 212, 0.2)` | `rgba(34, 211, 238, 0.3)` | `#67E8F9` (Cyan) |
| **Nehéz** | `rgba(239, 68, 68, 0.2)` | `rgba(248, 113, 113, 0.3)` | `#FCA5A5` (Red) |

### **Badge megjelenítés:**
```tsx
<View
  style={[
    styles.difficultyBadge,
    {
      backgroundColor: getDifficultyBackgroundColor(),
      borderColor: getDifficultyBorderColor(),
    },
  ]}
>
  <Text style={{ color: getDifficultyTextColor() }}>
    Nehézség
  </Text>
</View>
```

---

## 🎨 STYLING

### **Absolute positioning:**
```tsx
// Left side (Player Info):
playerInfoContainer: {
  position: 'absolute',
  left: 8,
  top: 14,
  zIndex: 100,
}

// Right side (Stage Progression):
stageProgressContainer: {
  position: 'absolute',
  right: 8,
  top: 14,
  zIndex: 40,
}
```

### **Gradients:**
```tsx
// Player card background:
<LinearGradient
  colors={['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 0.95)']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}  // Diagonal gradient
>
```

### **Shadows (iOS + Android):**
```tsx
playerCard: {
  // iOS shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 20 },
  shadowOpacity: 0.3,
  shadowRadius: 25,
  
  // Android shadow
  elevation: 8,
}
```

---

## 📱 PÉLDA HASZNÁLAT

### **MainScreen-ben:**
```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { TopBar } from './components/TopBar';

export function MainScreen() {
  const [coins, setCoins] = useState(680);
  const [gems, setGems] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(2);
  const [currentLesson, setCurrentLesson] = useState(7);
  const [currentStageInSection, setCurrentStageInSection] = useState(4);
  const [currentGameType, setCurrentGameType] = useState<'reading' | 'matching' | 'quiz'>('reading');
  const [currentBookLessonIndex, setCurrentBookLessonIndex] = useState(0);

  const handleAvatarClick = () => {
    console.log('Opening avatar selector...');
    // navigation.navigate('AvatarSelector');
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        coins={coins}
        gems={gems}
        progressPosition={currentStageInSection - 1}  // 0-based
        playerLevel={playerLevel}
        currentLesson={currentLesson}
        currentStageInSection={currentStageInSection}  // 1-based
        currentGameType={currentGameType}  // 'reading' | 'matching' | 'quiz'
        currentBookLessonIndex={currentBookLessonIndex}  // 0-based
        onAvatarClick={handleAvatarClick}
      />
      
      {/* Többi komponens */}
    </View>
  );
}
```

---

## 🔄 STAGE PROGRESSION FRISSÍTÉSE (LECKE TELJESÍTÉSKOR)

### **⚠️ FONTOS: Állapot kezelés a szülő komponensben**

A TopBar **NEM KEZELI** az állapotot - csak MEGJELENÍTI a kapott `currentStageInSection` prop értékét.  
Az állapot frissítés a **SZÜLŐ KOMPONENS** (App.tsx vagy MainScreen) felelőssége!

### **1. Lecke teljesítés kezelése (handleWin):**

```tsx
// App.tsx vagy MainScreen.tsx
const handleLessonWin = () => {
  // ===== 1. JUTALMAK =====
  const goldReward = 100;
  const xpReward = 100;
  
  setCoins(prev => prev + goldReward);
  setTotalXp(prev => prev + xpReward);
  
  // ===== 2. STAGE PROGRESSION =====
  advanceStage();  // 👈 Ez frissíti a szakasz számot!
  
  // ===== 3. LECKE PROGRESSZIÓ =====
  moveToNextLesson();
};

// ===== STAGE ADVANCEMENT LOGIKA =====
const advanceStage = () => {
  const STAGES_PER_MILESTONE = 6;
  const DIAMONDS_PER_MILESTONE = 1;
  
  const newStageInSection = currentStageInSection + 1;
  
  // Ha eléri a mérföldkövet (6. stage)
  if (newStageInSection > STAGES_PER_MILESTONE) {
    // Reset 1-re és gyémánt jutalom
    setCurrentStageInSection(1);
    setProgressPosition(0);  // 0-based (0-5)
    setGems(prev => prev + DIAMONDS_PER_MILESTONE);
    
    // Toast/Alert
    console.log('🏆 Mérföldkő teljesítve! +1 gyémánt!');
  } else {
    // Következő stage
    setCurrentStageInSection(newStageInSection);
    setProgressPosition(newStageInSection - 1);  // 0-based
  }
};
```

### **2. Prop átadás TopBar-nak:**

```tsx
<TopBar
  coins={coins}
  gems={gems}
  progressPosition={currentStageInSection - 1}  // 👈 0-based: 0, 1, 2, 3, 4, 5
  playerLevel={playerLevel}
  currentLesson={currentLesson}
  currentStageInSection={currentStageInSection}  // 👈 1-based: 1, 2, 3, 4, 5, 6
  onAvatarClick={handleAvatarClick}
/>
```

### **3. Teljes példa App.tsx-ben:**

```tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { TopBar } from './components/TopBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  // ===== STATE =====
  const [coins, setCoins] = useState(680);
  const [gems, setGems] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(2);
  const [currentLesson, setCurrentLesson] = useState(7);
  const [currentStageInSection, setCurrentStageInSection] = useState(1);
  const [progressPosition, setProgressPosition] = useState(0);
  const [totalXp, setTotalXp] = useState(0);

  // ===== LOAD STATE FROM ASYNCSTORAGE =====
  useEffect(() => {
    loadGameState();
  }, []);

  const loadGameState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('game_state');
      if (savedState) {
        const state = JSON.parse(savedState);
        setCoins(state.coins || 680);
        setGems(state.gems || 0);
        setPlayerLevel(state.playerLevel || 2);
        setCurrentLesson(state.currentLesson || 7);
        setCurrentStageInSection(state.currentStageInSection || 1);
        setProgressPosition(state.progressPosition || 0);
        setTotalXp(state.totalXp || 0);
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
  };

  // ===== SAVE STATE TO ASYNCSTORAGE =====
  useEffect(() => {
    saveGameState();
  }, [coins, gems, playerLevel, currentLesson, currentStageInSection, totalXp]);

  const saveGameState = async () => {
    try {
      await AsyncStorage.setItem('game_state', JSON.stringify({
        coins,
        gems,
        playerLevel,
        currentLesson,
        currentStageInSection,
        progressPosition: currentStageInSection - 1,
        totalXp,
      }));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  // ===== STAGE ADVANCEMENT =====
  const advanceStage = () => {
    const STAGES_PER_MILESTONE = 6;
    const DIAMONDS_PER_MILESTONE = 1;
    
    const newStageInSection = currentStageInSection + 1;
    
    if (newStageInSection > STAGES_PER_MILESTONE) {
      // Mérföldkő teljesítve - reset és gyémánt
      setCurrentStageInSection(1);
      setProgressPosition(0);
      setGems(prev => prev + DIAMONDS_PER_MILESTONE);
      console.log('🏆 Mérföldkő teljesítve! +' + DIAMONDS_PER_MILESTONE + ' gyémánt!');
    } else {
      // Következő stage
      setCurrentStageInSection(newStageInSection);
      setProgressPosition(newStageInSection - 1);
    }
  };

  // ===== LESSON WIN HANDLER =====
  const handleLessonWin = () => {
    console.log('🎮 Lecke teljesítve!');
    
    // Jutalmak
    const goldReward = 100;
    const xpReward = 100;
    
    setCoins(prev => prev + goldReward);
    setTotalXp(prev => prev + xpReward);
    
    // Stage progression
    advanceStage();  // 👈 Ez frissíti a TopBar szakasz számlálót!
    
    // Következő lecke
    setCurrentLesson(prev => prev + 1);
  };

  // ===== RENDER =====
  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* TopBar - Automatikusan frissül amikor currentStageInSection változik */}
      <TopBar
        coins={coins}
        gems={gems}
        progressPosition={progressPosition}
        playerLevel={playerLevel}
        currentLesson={currentLesson}
        currentStageInSection={currentStageInSection}
        onAvatarClick={() => console.log('Avatar clicked')}
      />
      
      {/* Teszt gomb */}
      <View style={{ padding: 20, marginTop: 100 }}>
        <Text style={{ color: '#fff', marginBottom: 10 }}>
          Aktuális szakasz: {currentStageInSection}/6
        </Text>
        <Button title="Lecke teljesítése (teszt)" onPress={handleLessonWin} />
      </View>
    </View>
  );
}
```

### **4. Szinkronizálás currentStageInSection és progressPosition között:**

```tsx
// ⚠️ FONTOS: Mindig tartsd szinkronban a két értéket!

// currentStageInSection: 1-based (1, 2, 3, 4, 5, 6)
// progressPosition: 0-based (0, 1, 2, 3, 4, 5)

// Konverzió:
const progressPosition = currentStageInSection - 1;

// VAGY fordítva:
const currentStageInSection = progressPosition + 1;

// Használat:
useEffect(() => {
  // Auto-sync ha valami miatt eltér
  if (progressPosition !== currentStageInSection - 1) {
    console.warn('⚠️ Progress position out of sync! Fixing...');
    setProgressPosition(currentStageInSection - 1);
  }
}, [currentStageInSection, progressPosition]);
```

### **5. Debug logging (ajánlott):**

```tsx
// A stage változások követése
useEffect(() => {
  console.log('🎯 Stage changed:', {
    currentStageInSection,
    progressPosition,
    expectedProgressPosition: currentStageInSection - 1,
    synced: progressPosition === currentStageInSection - 1
  });
}, [currentStageInSection, progressPosition]);

// Lecke teljesítés követése
const handleLessonWin = () => {
  console.log('📊 BEFORE advancement:', {
    currentStageInSection,
    progressPosition,
    coins,
    gems
  });
  
  advanceStage();
  
  console.log('📊 AFTER advancement:', {
    currentStageInSection: currentStageInSection + 1,
    progressPosition: progressPosition + 1,
    gems: currentStageInSection + 1 > 6 ? gems + 1 : gems
  });
};
```

---

## 🎮 STAGE PROGRESSION MŰKÖDÉSE

### **Teljes életciklus:**

```
START: Szakasz 1/6 (progressPosition = 0)
  ↓
Lecke teljesítése → handleLessonWin()
  ↓
advanceStage() → currentStageInSection = 2, progressPosition = 1
  ↓
TopBar frissül automatikusan → "Szakasz 2/6" 🎉
  ↓
Lecke teljesítése → handleLessonWin()
  ↓
advanceStage() → currentStageInSection = 3, progressPosition = 2
  ↓
TopBar frissül automatikusan → "Szakasz 3/6" 🎉
  ↓
... (folytatódik)
  ↓
Lecke teljesítése (6. alkalom)
  ↓
advanceStage() → currentStageInSection = 6 + 1 = 7 > 6
  ↓
MÉRFÖLDKŐ! → currentStageInSection = 1, gems = gems + 1
  ↓
TopBar frissül automatikusan → "Szakasz 1/6" + +1 gyémánt 💎
```

### **Vizuális visszajelzés:**

```tsx
// Node színek változása:
// progressPosition = 0 → csak 1. node active (piros)
// progressPosition = 1 → 1-2. node active (piros)
// progressPosition = 2 → 1-3. node active (piros)
// progressPosition = 3 → 1-4. node active (piros)
// progressPosition = 4 → 1-5. node active (piros)
// progressPosition = 5 → Mind active + gem node (lila) 💎
```

---

## ⚙️ TESTRESZABÁS

### **1. XP progress bar (teljes implementáció):**
```tsx
interface TopBarProps {
  // ... meglévő props
  currentXp?: number;
  totalXpForNextLevel?: number;
}

// Progress számítás:
const progressPercentage = (currentXp / totalXpForNextLevel) * 100;

// Használat:
<LinearGradient
  style={[
    styles.progressBarFill,
    { width: `${progressPercentage}%` },
  ]}
/>
```

### **2. Avatar glow animáció:**
```tsx
import { Animated } from 'react-native';

// Animated value:
const glowOpacity = useRef(new Animated.Value(0.2)).current;

// Pulse animation:
useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(glowOpacity, {
        toValue: 0.5,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0.2,
        duration: 1000,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);
```

### **3. Új currency hozzáadása:**
```tsx
// Props:
interface TopBarProps {
  // ...
  tokens?: number;
}

// Megjelenítés:
<View style={styles.tokensContainer}>
  <LinearGradient colors={['#10B981', '#059669']} style={styles.tokenIconBg}>
    <Star size={12} color="#FFFFFF" />
  </LinearGradient>
  <Text>{tokens}</Text>
</View>
```

---

## 🐛 HIBAKERESÉS

### **1. Avatar nem töltődik be:**
```tsx
// Ellenőrizd AsyncStorage-t:
import AsyncStorage from '@react-native-async-storage/async-storage';

const checkAvatar = async () => {
  const avatar = await AsyncStorage.getItem('player_avatar');
  console.log('Stored avatar:', avatar);
};
```

### **2. Gradients nem jelennek meg:**
```bash
# Ellenőrizd a telepítést:
npm list react-native-linear-gradient

# Ha nincs:
npm install react-native-linear-gradient
cd ios && pod install && cd ..
```

### **3. Player card lecsapva / nem látszik teljesen:**
```tsx
// MEGOLDÁS: Fixed height a container-en
container: {
  height: 90,  // Avatar (56px) + padding (34px) = 90px
  position: 'relative',
}

// Ha még mindig lecsapva:
// 1. Ellenőrizd a parent component padding-jét
// 2. Növeld a height-ot (pl. 100px)
// 3. Csökkentsd az absolute position top értékét (pl. 8 helyett 10)
```

### **4. Zigzag path nem látszik:**
```tsx
// Ellenőrizd a container méretet:
stagePathContainer: {
  width: 160,   // Elég széles?
  height: 55,   // Elég magas?
}
```

### **5. Dashed border nem jelenik meg Androidon:**
```tsx
// Android limitation: dashed borders limited support
// Alternatíva: használj SVG vonalat
import Svg, { Line } from 'react-native-svg';
```

### **6. ⚠️ SZAKASZ SZÁM NEM FRISSÜL LECKE TELJESÍTÉS UTÁN:**

**Probléma:**  
A TopBar "Szakasz X/6" szöveg nem változik amikor lecke teljesül.

**OK:**  
A TopBar komponens **NEM KEZELI** az állapotot, csak MEGJELENÍTI a `currentStageInSection` prop értékét. Az állapot frissítés a SZÜLŐ komponens felelőssége!

**MEGOLDÁS:**

```tsx
// ❌ ROSSZ - TopBar-ban próbálod frissíteni:
// Ez NEM fog működni, mert TopBar nem kezeli az állapotot!

// ✅ HELYES - Szülő komponensben (App.tsx):
const handleLessonWin = () => {
  // 1. Jutalmak
  setCoins(prev => prev + 100);
  setTotalXp(prev => prev + 100);
  
  // 2. STAGE ADVANCEMENT - Ez frissíti a TopBar-t! 👈
  advanceStage();
  
  // 3. Következő lecke
  moveToNextLesson();
};

const advanceStage = () => {
  const newStageInSection = currentStageInSection + 1;
  
  if (newStageInSection > 6) {
    // Mérföldkő - reset
    setCurrentStageInSection(1);
    setProgressPosition(0);
    setGems(prev => prev + 1);
  } else {
    // Következő stage
    setCurrentStageInSection(newStageInSection);  // 👈 Ez frissíti!
    setProgressPosition(newStageInSection - 1);
  }
};
```

**Ellenőrző lista:**
- [ ] Van `handleLessonWin` vagy `handleWin` függvény?
- [ ] Van benne `advanceStage()` hívás?
- [ ] `advanceStage()` hívja a `setCurrentStageInSection()`-t?
- [ ] `currentStageInSection` state átadódik a TopBar-nak prop-ként?
- [ ] AsyncStorage-ban mentődik az állapot?

**Debug:**
```tsx
// Adj hozzá console.log-ot:
const advanceStage = () => {
  console.log('🎯 BEFORE:', { currentStageInSection });
  
  const newStageInSection = currentStageInSection + 1;
  setCurrentStageInSection(newStageInSection);
  
  console.log('🎯 AFTER:', { currentStageInSection: newStageInSection });
};

// TopBar-ban:
useEffect(() => {
  console.log('🔝 TopBar received new stage:', currentStageInSection);
}, [currentStageInSection]);
```

**Ha még mindig nem frissül:**
1. Ellenőrizd hogy a `setCurrentStageInSection` useState hook-e?
2. Ellenőrizd hogy a TopBar újra-renderelődik-e? (console.log a TopBar tetejére)
3. Ellenőrizd hogy a prop név egyezik-e? (`currentStageInSection` mindkét helyen)
4. Próbáld ki teszt gombbal: `<Button onPress={() => setCurrentStageInSection(3)} />`

---

## 📊 STATISZTIKÁK

| Metric | Érték |
|--------|-------|
| **Teljes sor** | ~800 |
| **Props** | 9 (2 új: currentGameType, currentBookLessonIndex) |
| **Sub-components** | 4 (GemNode, CurrentNode, RegularNode, ConnectionLine) |
| **AsyncStorage keys** | 1 (`player_avatar`) |
| **Gradients** | 8 |
| **Icons** | 2 (Coins, Gem) |
| **Emojis** | 3 (📖 Olvasás, 🎴 Párosítás, ❓ Kvíz) |
| **Függőségek** | 3 npm package |
| **Konverzió idő** | 10 perc |
| **Komplexitás** | Közepes-Magas |

---

## 🚀 GYORS REFERENCIA - STAGE FRISSÍTÉS

### **Minimális implementáció (3 lépés):**

```tsx
// 1️⃣ STATE
const [currentStageInSection, setCurrentStageInSection] = useState(1);

// 2️⃣ ADVANCEMENT FÜGGVÉNY
const advanceStage = () => {
  const newStage = currentStageInSection + 1;
  setCurrentStageInSection(newStage > 6 ? 1 : newStage);
};

// 3️⃣ PROP ÁTADÁS
<TopBar
  currentStageInSection={currentStageInSection}
  progressPosition={currentStageInSection - 1}
  // ... többi prop
/>
```

### **Teljes implementáció (gyémánttal):**

```tsx
const advanceStage = () => {
  const newStage = currentStageInSection + 1;
  
  if (newStage > 6) {
    setCurrentStageInSection(1);
    setProgressPosition(0);
    setGems(prev => prev + 1);  // Mérföldkő jutalom
  } else {
    setCurrentStageInSection(newStage);
    setProgressPosition(newStage - 1);
  }
};
```

---

## ✅ KONVERZIÓS ELLENŐRZŐ LISTA

- [x] TopBar.rn.tsx létrehozva
- [x] localStorage → AsyncStorage
- [x] AppState listener (foreground reload)
- [x] Inline styles → StyleSheet
- [x] LinearGradient használva (8×)
- [x] Lucide icons (Coins, Gem)
- [x] Zigzag path rendering (6 node)
- [x] Sub-components (4 db)
- [x] Difficulty badge (dynamic colors)
- [x] Absolute positioning (left + right)
- [x] Shadow (iOS + Android)
- [x] Kommentek hozzáadva
- [x] Stage progression frissítés dokumentálva
- [x] Lecke információ badge hozzáadva (emoji + típus + sorszám)

---

## 🎉 KÉSZ!

Most már van egy **teljes TopBar React Native** komponensed!

**Mit kaptál:**
- ✅ Avatar (AsyncStorage + AppState)
- ✅ Level & XP progress
- ✅ Coins & Gems
- ✅ Zigzag stage path (6 nodes)
- ✅ Difficulty badge (dynamic)
- ✅ 8 gradient background
- ✅ iOS + Android shadow
- ✅ Sub-components (clean structure)

**Következő lépés:**
→ Másold be és használd! 🎮✨

---

**Készült:** 2025-01-01  
**Verzió:** 1.0.0  
**Fájl:** `TopBar.rn.tsx` (~700 sor)  
**Komplexitás:** Közepes-Magas (sok feature)
