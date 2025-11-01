# 🏠 MainScreen - React Native Útmutató

**Container komponens 7 alkomponenssel**

---

## 🚀 GYORS HASZNÁLAT (5 perc)

### **1. Másold a fájlt:**
```bash
cp exports/MainScreen.rn.tsx src/screens/MainScreen.tsx
```

### **2. Használd:**
```tsx
import { MainScreen } from './screens/MainScreen';

<MainScreen
  coins={1000}
  gems={50}
  playerLevel={5}
  totalXp={2500}
  progressPosition={15}
  currentLesson={3}
  currentStageInSection={2}
  playerName="Játékos"
  subscriptionTier="free"
  currentStreak={7}
  currentBookLessonIndex={10}
  currentGameType="reading"
  isFirstRound={true}
  
  onAvatarClick={() => navigation.navigate('Avatar')}
  onLessonsClick={() => navigation.navigate('Lessons')}
  onShopClick={() => navigation.navigate('Shop')}
  onArenaClick={() => navigation.navigate('Arena')}
  onUniversityClick={() => navigation.navigate('University')}
  onProfileClick={() => navigation.navigate('Profile')}
  onSubscriptionClick={() => navigation.navigate('Subscription')}
  onManagerClick={() => navigation.navigate('Manager')}
  onStreakClick={() => navigation.navigate('Streak')}
  onProgressClick={() => handleStartNextLesson()}
  onJumpToLesson={(lesson) => handleJumpToLesson(lesson)}
  
  getTotalXpForNextLevel={(level) => level * 500}
/>
```

**KÉSZ! 🎉**

---

## 📋 ALKOMPONENSEK (7 db)

A MainScreen **NEM önálló komponens** - csak egy wrapper/container a 7 alkomponens számára!

### **Struktúra:**

```
MainScreen (Container)
├── 1. TopBar            → Resources (coins, gems, level)
├── 2. SideMenu          → Quick actions (lessons, shop)
├── 3. EventCards        → Activities (arena)
├── 4. TipBar            → Helpful tips
├── 5. CharacterLineup   → Bottom navigation (5 sections)
├── 6. PlayerStatusBar   → Player info (name, XP, streak)
└── 7. ProgressAnimation → "Továbbhaladás" button (main CTA)
```

### **Alkomponensek leírása:**

| # | Komponens | Felelősség | Navigáció |
|---|-----------|------------|-----------|
| 1 | **TopBar** | Coins, gems, level megjelenítés | Avatar megnyitása |
| 2 | **SideMenu** | Gyorsműveletek (leckék, bolt) | Lessons, Shop |
| 3 | **EventCards** | Aktuális tevékenységek | Arena |
| 4 | **TipBar** | Hasznos tippek | - |
| 5 | **CharacterLineup** | Alsó navigáció (5 szekció) | University, Profile, Subscription, Manager |
| 6 | **PlayerStatusBar** | Játékos info (név, XP, streak) | Streak |
| 7 | **ProgressAnimation** | "Továbbhaladás" gomb | Következő lecke |

---

## 🎯 PROPS INTERFÉSZ

```tsx
interface MainScreenProps {
  // ============================================
  // PLAYER STATS (9 prop)
  // ============================================
  coins: number;                    // Játékos pénze
  gems: number;                     // Játékos gyémántjai
  playerLevel: number;              // Játékos szintje
  totalXp: number;                  // Összes XP
  progressPosition: number;         // Progress pozíció (0-100)
  currentLesson: number;            // Aktuális lecke száma
  currentStageInSection: number;    // Aktuális szakasz
  playerName: string;               // Játékos neve
  subscriptionTier: 'free' | 'pro' | 'master'; // Előfizetés
  currentStreak: number;            // Aktuális streak

  // ============================================
  // LESSON STATE (3 prop)
  // ============================================
  currentBookLessonIndex: number;   // Könyv lecke index
  currentGameType: 'reading' | 'matching' | 'quiz'; // Játék típus
  isFirstRound: boolean;            // Első kör?

  // ============================================
  // NAVIGATION CALLBACKS (11 prop)
  // ============================================
  onAvatarClick: () => void;        // Avatar megnyitása
  onLessonsClick: () => void;       // Leckék oldal
  onShopClick: () => void;          // Bolt oldal
  onArenaClick: () => void;         // Arena oldal
  onUniversityClick: () => void;    // Egyetem oldal
  onProfileClick: () => void;       // Profil oldal
  onSubscriptionClick: () => void;  // Előfizetés oldal
  onManagerClick: () => void;       // Manager oldal
  onStreakClick: () => void;        // Streak oldal
  onProgressClick: () => void;      // Továbbhaladás gomb
  onJumpToLesson: (lesson: number) => void; // Ugrás leckére

  // ============================================
  // UTILS (1 prop)
  // ============================================
  getTotalXpForNextLevel: (level: number) => number; // XP számítás
}
```

**Összesen: 24 prop**

---

## 📐 ALKOMPONENSEK PROP TOVÁBBÍTÁSA

### **1. TopBar**
```tsx
<TopBar
  coins={coins}                           // Player resources
  gems={gems}
  progressPosition={progressPosition}     // Progress bar
  playerLevel={playerLevel}               // Current level
  currentLesson={currentLesson}
  onAvatarClick={onAvatarClick}           // Avatar selection
  currentStageInSection={currentStageInSection}
/>
```

### **2. SideMenu**
```tsx
<SideMenu
  onLessonsClick={onLessonsClick}         // Navigate to Lessons
  onShopClick={onShopClick}               // Navigate to Shop
/>
```

### **3. EventCards**
```tsx
<EventCards
  onArenaClick={onArenaClick}             // Navigate to Arena
  subscriptionTier={subscriptionTier}     // Free/Pro/Master
/>
```

### **4. TipBar**
```tsx
<TipBar />
// Nincs props, csak helpful tips megjelenítés
```

### **5. CharacterLineup**
```tsx
<CharacterLineup
  onJumpToLesson={onJumpToLesson}         // Jump to specific lesson
  onUniversityClick={onUniversityClick}   // Navigate to University
  onProfileClick={onProfileClick}         // Navigate to Profile
  onSubscriptionClick={onSubscriptionClick} // Navigate to Subscription
  onManagerClick={onManagerClick}         // Navigate to Manager
/>
```

### **6. PlayerStatusBar**
```tsx
<PlayerStatusBar
  playerName={playerName}                 // Player name display
  subscriptionTier={subscriptionTier}     // Free/Pro/Master
  streak={currentStreak}                  // Current streak count
  totalXp={totalXp}                       // Total XP
  totalXpForNextLevel={getTotalXpForNextLevel(playerLevel + 1)} // XP needed
  playerLevel={playerLevel}               // Current level
  onStreakClick={onStreakClick}           // Navigate to Streak
/>
```

### **7. ProgressAnimation**
```tsx
<ProgressAnimation
  onClick={onProgressClick}               // Start next lesson
  currentBookLessonIndex={currentBookLessonIndex}
  currentGameType={currentGameType}       // reading/matching/quiz
  isFirstRound={isFirstRound}             // First round flag
/>
```

---

## 🔄 NAVIGÁCIÓS FOLYAMATOK

### **App.tsx → MainScreen → Alkomponensek**

```
App.tsx (State management)
  │
  ├─→ MainScreen (Container)
  │     │
  │     ├─→ TopBar
  │     │     └─→ onAvatarClick() → App.tsx navigál Avatar-hoz
  │     │
  │     ├─→ SideMenu
  │     │     ├─→ onLessonsClick() → App.tsx navigál Lessons-hoz
  │     │     └─→ onShopClick() → App.tsx navigál Shop-hoz
  │     │
  │     ├─→ EventCards
  │     │     └─→ onArenaClick() → App.tsx navigál Arena-hoz
  │     │
  │     ├─→ TipBar (nincs navigáció)
  │     │
  │     ├─→ CharacterLineup
  │     │     ├─→ onJumpToLesson() → App.tsx ugrik leckére
  │     │     ├─→ onUniversityClick() → App.tsx navigál University-hoz
  │     │     ├─→ onProfileClick() → App.tsx navigál Profile-hoz
  │     │     ├─→ onSubscriptionClick() → App.tsx navigál Subscription-hoz
  │     │     └─→ onManagerClick() → App.tsx navigál Manager-hez
  │     │
  │     ├─→ PlayerStatusBar
  │     │     └─→ onStreakClick() → App.tsx navigál Streak-hez
  │     │
  │     └─→ ProgressAnimation
  │           └─→ onProgressClick() → App.tsx indítja következő leckét
```

### **Navigációs callback-ek összegzése:**

| Callback | Melyik komponens használja? | Mit csinál? |
|----------|------------------------------|-------------|
| `onAvatarClick` | TopBar | Avatar választó megnyitása |
| `onLessonsClick` | SideMenu | Leckék oldal megnyitása |
| `onShopClick` | SideMenu | Bolt oldal megnyitása |
| `onArenaClick` | EventCards | Arena oldal megnyitása |
| `onUniversityClick` | CharacterLineup | Egyetem oldal megnyitása |
| `onProfileClick` | CharacterLineup | Profil oldal megnyitása |
| `onSubscriptionClick` | CharacterLineup | Előfizetés oldal megnyitása |
| `onManagerClick` | CharacterLineup | Manager oldal megnyitása |
| `onStreakClick` | PlayerStatusBar | Streak oldal megnyitása |
| `onProgressClick` | ProgressAnimation | Következő lecke indítása |
| `onJumpToLesson` | CharacterLineup | Ugrás adott leckére |

---

## 📱 HASZNÁLATI PÉLDA (App.tsx-ben)

```tsx
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { MainScreen } from './screens/MainScreen';
import { ArenaPage } from './screens/ArenaPage';
import { LessonsPage } from './screens/LessonsPage';
// ... többi import

export default function App() {
  // ============================================
  // STATE
  // ============================================
  const [currentScreen, setCurrentScreen] = useState<string>('main');
  const [coins, setCoins] = useState(1000);
  const [gems, setGems] = useState(50);
  const [playerLevel, setPlayerLevel] = useState(5);
  const [totalXp, setTotalXp] = useState(2500);
  const [playerName, setPlayerName] = useState('Játékos');
  const [currentStreak, setCurrentStreak] = useState(7);
  // ... többi state

  // ============================================
  // NAVIGATION HANDLERS
  // ============================================
  const handleAvatarClick = () => setCurrentScreen('avatar');
  const handleLessonsClick = () => setCurrentScreen('lessons');
  const handleShopClick = () => setCurrentScreen('shop');
  const handleArenaClick = () => setCurrentScreen('arena');
  const handleUniversityClick = () => setCurrentScreen('university');
  const handleProfileClick = () => setCurrentScreen('profile');
  const handleSubscriptionClick = () => setCurrentScreen('subscription');
  const handleManagerClick = () => setCurrentScreen('manager');
  const handleStreakClick = () => setCurrentScreen('streak');

  const handleProgressClick = () => {
    console.log('Starting next lesson...');
    // Következő lecke indítása
  };

  const handleJumpToLesson = (lesson: number) => {
    console.log(`Jumping to lesson ${lesson}`);
    // Ugrás adott leckére
  };

  // ============================================
  // UTILS
  // ============================================
  const getTotalXpForNextLevel = (level: number) => {
    return level * 500; // Példa: szint * 500 XP
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {currentScreen === 'main' && (
        <MainScreen
          coins={coins}
          gems={gems}
          playerLevel={playerLevel}
          totalXp={totalXp}
          progressPosition={15}
          currentLesson={3}
          currentStageInSection={2}
          playerName={playerName}
          subscriptionTier="free"
          currentStreak={currentStreak}
          currentBookLessonIndex={10}
          currentGameType="reading"
          isFirstRound={true}
          
          onAvatarClick={handleAvatarClick}
          onLessonsClick={handleLessonsClick}
          onShopClick={handleShopClick}
          onArenaClick={handleArenaClick}
          onUniversityClick={handleUniversityClick}
          onProfileClick={handleProfileClick}
          onSubscriptionClick={handleSubscriptionClick}
          onManagerClick={handleManagerClick}
          onStreakClick={handleStreakClick}
          onProgressClick={handleProgressClick}
          onJumpToLesson={handleJumpToLesson}
          
          getTotalXpForNextLevel={getTotalXpForNextLevel}
        />
      )}

      {currentScreen === 'arena' && (
        <ArenaPage
          onClose={() => setCurrentScreen('main')}
          coins={coins}
          onCoinsChange={setCoins}
          subscriptionTier="free"
        />
      )}

      {/* ... többi screen */}
    </SafeAreaView>
  );
}
```

---

## ⚠️ FONTOS MEGJEGYZÉSEK

### **1. Alkomponensek konverziója SZÜKSÉGES!**

A MainScreen **csak egy container**, az alkomponenseket is konvertálni kell:

```bash
# Ezeket is át kell írni React Native-re:
- TopBar.tsx → TopBar.rn.tsx
- SideMenu.tsx → SideMenu.rn.tsx
- EventCards.tsx → EventCards.rn.tsx
- TipBar.tsx → TipBar.rn.tsx
- CharacterLineup.tsx → CharacterLineup.rn.tsx
- PlayerStatusBar.tsx → PlayerStatusBar.rn.tsx
- ProgressAnimation.tsx → ProgressAnimation.rn.tsx
```

### **2. Import útvonalak**

```tsx
// Web verzió (React):
import { TopBar } from './TopBar';

// React Native verzió:
import { TopBar } from '../components/TopBar';
// VAGY
import { TopBar } from './components/TopBar';
```

Állítsd be az import útvonalakat a projekt struktúrádnak megfelelően!

### **3. Container styles**

```tsx
const styles = StyleSheet.create({
  gameWorldContainer: {
    flex: 1,
    position: 'relative',  // ✅ RN támogatja
    paddingBottom: 24,
  },
});
```

**Position: 'relative'** működik React Native-ben! ✅

---

## 🔄 ALKOMPONENSEK KONVERZIÓJÁNAK SORRENDJE

**Javasolt sorrend** (egyszerűtől a bonyolultig):

1. ✅ **TipBar** - Egyszerű (csak text megjelenítés)
2. **TopBar** - Közepes (resources megjelenítés)
3. **SideMenu** - Egyszerű (2 gomb)
4. **EventCards** - Közepes (card-ok megjelenítése)
5. **PlayerStatusBar** - Közepes (player info + progress bar)
6. **CharacterLineup** - Közepes (5 button)
7. **ProgressAnimation** - Bonyolult (animáció + CTA button)

---

## 📊 STATISZTIKÁK

| Metric | Érték |
|--------|-------|
| **Container sor** | ~220 |
| **Alkomponensek** | 7 |
| **Props összesen** | 24 |
| **Navigation callbacks** | 11 |
| **Konverziós idő** | 2 perc |
| **Komplexitás** | Alacsony (csak wrapper) |

---

## 🎯 KONVERZIÓS ELLENŐRZŐ LISTA

MainScreen konverziójához:

- [x] MainScreen.rn.tsx létrehozva
- [x] Props interfész átmásolva
- [x] View container használva (div helyett)
- [x] Inline styles (StyleSheet)
- [x] Kommentek hozzáadva (navigáció jelölése)
- [ ] **Alkomponensek konverziója (7 db)** ⚠️ EZT KELL MEGCSINÁLNI!

---

## 🎉 KÉSZ!

Most már van egy **teljes MainScreen React Native wrapper** komponensed!

**Mit kaptál:**
- ✅ Container komponens 7 alkomponenssel
- ✅ 24 prop átadva
- ✅ Világos kommentek minden alkomponensnél
- ✅ Navigációs logika dokumentálva
- ✅ Inline styles (StyleSheet)

**Következő lépés:**
→ Konvertáld az alkomponenseket is! (lásd a javasolt sorrendet)

---

**Készült:** 2025-01-01  
**Verzió:** 1.0.0  
**Fájl:** `MainScreen.rn.tsx` (~220 sor)  
**Komplexitás:** Container/Wrapper (alacsony)
