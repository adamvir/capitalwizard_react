# CapitalWizard - React Native Alkalmazás 🎓💰

Pénzügyi oktatási játék React Native-ben, Figma Design alapján.

## 📱 Áttekintés

A CapitalWizard egy interaktív, gamifikált pénzügyi oktatási alkalmazás, amely játékos formában tanítja a pénzügyi ismereteket. Az alkalmazás React Native + Expo technológiával készült, teljes TypeScript támogatással.

## 🚀 Gyors Kezdés

### 1. Telepítés

```bash
npm install
```

### 2. Development Server Indítása

```bash
npm start
# vagy
npx expo start
```

### 3. App Futtatása

**iOS szimulátor:**
```bash
npm run ios
```

**Android emulátor:**
```bash
npm run android
```

**Expo Go (mobil eszközön):**
- Telepítsd az Expo Go app-ot (iOS/Android)
- Olvasd be a QR kódot a terminálból

## 📚 Legutóbbi Frissítések

### ✅ MainScreen Komponens (2025-11-01)
- **MainScreen** komponens külön fájlba szervezve
- **HomeScreen** wrapper a state management-hez
- Tiszta, konzisztens architektúra
- 📄 Részletek: [`MAINSCREEN_UPDATE.md`](./MAINSCREEN_UPDATE.md)

### ✅ Navigation Egyszerűsítés (2025-11-01)
- Bottom Tab Navigator eltávolítva
- Stack Navigator használata egyetlen navigációs sávval
- CharacterLineup komponens navigáció (6 gomb)
- Tiszta UI, nincs dupla navigáció
- 📄 Részletek: [`NAVIGATION_UPDATE.md`](./NAVIGATION_UPDATE.md)

## 🏗️ Architektúra

### Projekt Struktúra

```
ReactN_CW/
├── App.tsx                 # Root komponens
├── src/
│   ├── screens/           # Screen komponensek
│   │   ├── MainScreen.tsx        # Főoldal (új!)
│   │   ├── HomeScreen.tsx        # Home wrapper (új!)
│   │   ├── WelcomeScreen.tsx
│   │   ├── UniversityScreen.tsx
│   │   ├── ArenaScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── ManagerScreen.tsx
│   │   ├── LessonsScreen.tsx
│   │   └── ...
│   ├── navigation/        # Navigation konfiguráció
│   │   ├── AppNavigator.tsx      # Stack Navigator
│   │   └── types.ts              # Navigation types
│   ├── components/        # Komponensek
│   │   ├── ui/                   # UI komponensek
│   │   │   ├── TopBar.tsx
│   │   │   ├── SideMenu.tsx
│   │   │   ├── EventCards.tsx
│   │   │   ├── TipBar.tsx
│   │   │   ├── CharacterLineup.tsx
│   │   │   └── PlayerStatusBar.tsx
│   │   ├── animations/           # Animációs komponensek
│   │   │   ├── ProgressAnimation.tsx
│   │   │   ├── LevelUpCelebration.tsx
│   │   │   └── StreakCelebration.tsx
│   │   ├── game/                 # Játék komponensek
│   │   │   ├── LessonHeader.tsx
│   │   │   ├── ReadingGame.tsx
│   │   │   ├── QuizGame.tsx
│   │   │   └── BookReader.tsx
│   │   └── books/                # Könyv komponensek
│   ├── utils/             # Utility funkciók
│   │   ├── styleConstants.ts
│   │   ├── gameConfig.ts
│   │   └── storage.ts
│   └── data/              # Adatfájlok
│       └── ...
├── assets/                # Képek, ikonok
├── MAINSCREEN_UPDATE.md   # MainScreen dokumentáció
├── NAVIGATION_UPDATE.md   # Navigation dokumentáció
├── CONVERSION_SUMMARY.md  # Konverziós összefoglaló
└── package.json
```

### Navigation Flow

```
Welcome Screen (5 sec auto vagy gomb)
    ↓
Home Screen (MainScreen komponens)
    ├── TopBar (arany, gyémánt, szint)
    ├── SideMenu (Bolt, Leckék)
    ├── EventCards (Küzdőtér, Templomos)
    ├── TipBar (tippek)
    ├── CharacterLineup (6 navigációs gomb)
    ├── PlayerStatusBar (név, szint, XP, streak)
    └── ProgressAnimation (Továbbhaladás gomb)
```

### CharacterLineup Navigáció (6 gomb)
1. **Egyetem** → University Screen
2. **Diák** → Manager Screen
3. **Eredmények** → (TODO)
4. **Helyezés** → (TODO)
5. **Hírek** → (TODO)
6. **Előfizetés** → Subscription Screen

## 🎯 Főbb Funkciók

### ✅ Implementált
- [x] Welcome Screen (kezdő ajándék animációval)
- [x] Main Screen (7 komponens integráció)
- [x] Navigation (Stack Navigator)
- [x] University Screen (könyvtár)
- [x] Arena Screen (PvP játék)
- [x] Profile Screen
- [x] Subscription Screen (3 tier: Free, Pro, Master)
- [x] Shop Screen
- [x] Lessons Screen
- [x] Game komponensek (Reading, Quiz, Matching)
- [x] Animations (LevelUp, Streak, Progress)
- [x] AsyncStorage (state mentés)
- [x] TypeScript támogatás

### 🚧 Fejlesztés alatt
- [ ] Eredmények screen
- [ ] Helyezés/Rangsor screen
- [ ] Hírek screen
- [ ] Sound effects
- [ ] Haptic feedback
- [ ] Supabase integráció

## 🛠️ Technológiai Stack

### Core
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety

### Navigation
- **React Navigation** - Stack navigation
- **@react-navigation/stack** - Stack Navigator

### UI & Animations
- **React Native Reanimated** - 60fps animációk
- **expo-linear-gradient** - Gradient háttér
- **react-native-svg** - SVG komponensek
- **@expo/vector-icons** - MaterialCommunityIcons

### State & Storage
- **AsyncStorage** - Persistent storage
- **React Hooks** - State management

## 📖 Dokumentáció

| Dokumentum | Leírás |
|-----------|--------|
| [MAINSCREEN_UPDATE.md](./MAINSCREEN_UPDATE.md) | MainScreen komponens részletek |
| [NAVIGATION_UPDATE.md](./NAVIGATION_UPDATE.md) | Navigation változások |
| [CONVERSION_SUMMARY.md](./CONVERSION_SUMMARY.md) | Teljes konverziós összefoglaló |
| [CONVERSION_COMPLETE.md](./CONVERSION_COMPLETE.md) | Komponens lista |

## 🎨 Design

Az alkalmazás design-ja Figma alapján készült, két verzióban:
- **regi_figma_des** - Eredeti design (App.tsx-ben összerakva)
- **uj_gifma_des** - Refaktorált design (MainScreen komponenssel)

A React Native verzió az **új design** alapján készült.

## 🧪 Tesztelés

```bash
# TypeScript típus ellenőrzés
npx tsc --noEmit

# Expo start tiszta cache-sel
npm start -- --reset-cache
```

## 🔧 Gyakori Problémák

### Metro Bundler hiba
```bash
npm start -- --reset-cache
```

### iOS build probléma
```bash
cd ios && pod install && cd ..
npm run ios
```

### Android build probléma
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

## 📝 Fejlesztési Jegyzetek

### State Management
- HomeScreen kezeli az app-szintű state-et
- AsyncStorage auto-save minden változásnál
- State: coins, gems, playerLevel, totalXp, stb.

### Navigation Callbacks
A HomeScreen átadja a navigation callback-eket a MainScreen-nek:
```typescript
onUniversityClick={() => navigation.navigate('University')}
onProfileClick={() => navigation.navigate('Profile')}
onShopClick={() => navigation.navigate('Shop')}
// stb.
```

### Component Props
A MainScreen 29 prop-ot fogad:
- 14 state prop (coins, gems, playerLevel, stb.)
- 3 lesson state (currentBookLessonIndex, currentGameType, isFirstRound)
- 11 navigation callback
- 1 utility function (getTotalXpForNextLevel)

## 🤝 Közreműködés

Ez a projekt a CapitalWizard pénzügyi oktatási játék React Native verziója.

## 📜 Licenc

Minden jog fenntartva.

## 🚀 Következő Lépések

1. **Hiányzó screen-ek:**
   - Eredmények screen
   - Helyezés/Rangsor screen
   - Hírek screen

2. **Fejlesztések:**
   - Sound effects (expo-av)
   - Haptic feedback (expo-haptics)
   - Push notifications
   - Supabase backend integráció

3. **Optimalizáció:**
   - Image optimization
   - Bundle size csökkentés
   - Performance profiling

---

**Utolsó frissítés:** 2025-11-01
**Verzió:** 1.0.0
**Állapot:** Active Development 🚧
