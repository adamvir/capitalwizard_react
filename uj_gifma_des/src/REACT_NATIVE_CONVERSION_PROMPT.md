# 🚀 REACT NATIVE KONVERZIÓS PROMPT - CLAUDE AI-NAK

## 📋 KONTEXTUS

Egy **teljes RPG-stílusú pénzügyi oktatási mobil alkalmazást** konvertálunk React Web technológiából **React Native**-re. Az alkalmazás jelenleg 30 komponenst tartalmaz (~15,660+ sor kód), amelyek **100%-osan előkészítve vannak** a React Native konverzióra inline style objektumokkal.

---

## 🎯 FELADAT

Konvertáld a teljes React web alkalmazást **React Native** projektté, szigorúan követve az alábbi irányelveket és struktúrát.

---

## 📦 PROJEKT STRUKTÚRA

```
FinanceEducationApp/
├── App.tsx                          # Fő belépési pont
├── src/
│   ├── components/                  # UI komponensek
│   │   ├── game/                   # Játék komponensek
│   │   │   ├── LessonGame.tsx
│   │   │   ├── ReadingGame.tsx
│   │   │   ├── QuizGame.tsx
│   │   │   └── BookReader.tsx
│   │   ├── screens/                # Screen komponensek
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── UniversityPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── ArenaPage.tsx
│   │   │   ├── LibraryPage.tsx
│   │   │   ├── LessonsPage.tsx
│   │   │   ├── SubscriptionPage.tsx
│   │   │   ├── ShopPage.tsx
│   │   │   └── ...
│   │   ├── ui/                     # UI alapkomponensek
│   │   │   ├── TopBar.tsx
│   │   │   ├── SideMenu.tsx
│   │   │   ├── PlayerStatusBar.tsx
│   │   │   ├── CharacterLineup.tsx
│   │   │   ├── TipBar.tsx
│   │   │   └── EventCards.tsx
│   │   ├── animations/             # Animációk
│   │   │   ├── ProgressAnimation.tsx
│   │   │   ├── LevelUpCelebration.tsx
│   │   │   └── StreakCelebration.tsx
│   │   └── books/                  # Könyv nézetek
│   │       ├── StandaloneBookView.tsx
│   │       └── PenzugyiAlapismeretkBookView.tsx
│   ├── navigation/                  # React Navigation
│   │   ├── AppNavigator.tsx
│   │   ├── BottomTabNavigator.tsx
│   │   └── StackNavigator.tsx
│   ├── data/                        # Adatfájlok
│   │   ├── penzugyiAlapismeretkLessons.ts
│   │   ├── penzugyiAlapismeretkArenaQuestions.ts
│   │   ├── tokepiaciSzotar.ts
│   │   └── ...
│   ├── utils/                       # Utility funkciók
│   │   ├── styleConstants.ts       # ✅ Már konvertálva!
│   │   ├── gameConfig.ts
│   │   ├── streakManager.ts
│   │   └── storage.ts              # AsyncStorage wrapper
│   ├── hooks/                       # Custom hooks
│   │   ├── usePlayerData.ts
│   │   ├── useStreak.ts
│   │   └── useGameProgress.ts
│   └── types/                       # TypeScript típusok
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 TECHNOLÓGIAI STACK

### Core
- **React Native** 0.73+
- **TypeScript** 5.0+
- **Expo** 50+ (opcionális, de ajánlott)

### Navigáció
- **@react-navigation/native** - Stack, Tab, Drawer navigáció
- **@react-navigation/stack**
- **@react-navigation/bottom-tabs**
- **@react-navigation/drawer**

### UI Library
- **react-native-paper** - Material Design (Shadcn/ui helyett)
- **react-native-vector-icons** - Ikonok (lucide-react helyett)

### Animációk
- **react-native-reanimated** 3.0+ - Komplex animációk
- **react-native-gesture-handler** - Gesture kezelés
- **lottie-react-native** - Lottie animációk (opcionális)

### Adattárolás
- **@react-native-async-storage/async-storage** - localStorage helyett

### Egyéb
- **react-native-linear-gradient** - Gradient háttér
- **react-native-svg** - SVG támogatás
- **react-native-safe-area-context** - Safe area kezelés

---

## 📝 KONVERZIÓS SZABÁLYOK

### 1. Style Objektumok

**FONTOS**: Minden komponens már tartalmaz inline style objektumokat!

**Előtte (Web - Tailwind):**
```tsx
<div className="flex items-center gap-2 bg-blue-500 p-4 rounded-lg">
```

**Utána (React Native - Már megvan!):**
```tsx
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    padding: SPACING.base,
    borderRadius: SIZES.radiusLG,
  },
});

<View style={styles.container}>
```

**⚠️ VÁLTOZTATÁSOK:**
- `CSSProperties` → `StyleSheet.create()`
- `display: 'flex'` → TÖRÖLD (default React Native-ben)
- `gap` → NEM TÁMOGATOTT! Használj `marginRight`/`marginBottom`
- Font méretek: `'16px'` → `16` (szám)
- `cursor: 'pointer'` → TÖRÖLD (nincs RN-ben)
- `transition` tulajdonságok → TÖRÖLD, használj Animated API-t

### 2. HTML → React Native Elemek

| Web | React Native |
|-----|--------------|
| `<div>` | `<View>` |
| `<span>` | `<Text>` |
| `<p>` | `<Text>` |
| `<h1>`, `<h2>`, etc. | `<Text style={styles.heading}>` |
| `<button>` | `<TouchableOpacity>` vagy `<Pressable>` |
| `<input>` | `<TextInput>` |
| `<img>` | `<Image>` |
| `<a>` | `<TouchableOpacity>` + navigation |
| `<ul>`, `<li>` | `<FlatList>` vagy `<ScrollView>` |

### 3. Event Handlers

| Web | React Native |
|-----|--------------|
| `onClick` | `onPress` |
| `onMouseEnter` | `onPressIn` |
| `onMouseLeave` | `onPressOut` |
| `onChange` | `onChangeText` (TextInput) |

### 4. localStorage → AsyncStorage

**Előtte (Web):**
```tsx
localStorage.setItem('key', 'value');
const value = localStorage.getItem('key');
```

**Utána (React Native):**
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('key', 'value');
const value = await AsyncStorage.getItem('key');
```

**⚠️ FONTOS:** AsyncStorage async! Minden localStorage hívást async/await-tel cserélj!

### 5. Navigáció

**Előtte (Web - setState):**
```tsx
const [currentPage, setCurrentPage] = useState('home');
// NAVIGATION NOTE: setState hívás navigációhoz
setCurrentPage('profile');
```

**Utána (React Native - React Navigation):**
```tsx
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('Profile');
```

### 6. Motion Animációk → Reanimated

**Előtte (motion/react):**
```tsx
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

**Utána (Reanimated):**
```tsx
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue 
} from 'react-native-reanimated';

const opacity = useSharedValue(0);
const translateY = useSharedValue(20);

useEffect(() => {
  opacity.value = withTiming(1, { duration: 300 });
  translateY.value = withTiming(0, { duration: 300 });
}, []);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
  transform: [{ translateY: translateY.value }],
}));

<Animated.View style={animatedStyle}>
```

### 7. Shadcn/ui → React Native Paper

| Shadcn | React Native Paper |
|--------|-------------------|
| `<Button>` | `<Button mode="contained">` |
| `<Card>` | `<Card>` |
| `<Dialog>` | `<Modal>` vagy `<Portal>` |
| `<Tabs>` | `<SegmentedButtons>` |
| `<Dropdown>` | `<Menu>` |
| `<Switch>` | `<Switch>` |

### 8. Lucide Icons → Vector Icons

**Előtte:**
```tsx
import { ChevronRight, Star, Trophy } from 'lucide-react';
<ChevronRight className="w-6 h-6" />
```

**Utána:**
```tsx
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
<Icon name="chevron-right" size={24} color={COLORS.primary} />
```

**Icon mappelés:**
- `ChevronRight` → `chevron-right`
- `Star` → `star`
- `Trophy` → `trophy`
- `Coins` → `currency-usd`
- `BookOpen` → `book-open-variant`

---

## 🎨 STYLECONSTANTS.TS - MÁR KÉSZ!

A `utils/styleConstants.ts` fájl **teljesen készen áll** React Native-re! Csak át kell másolni:

```typescript
// ✅ Ezek már használhatók közvetlenül React Native-ben!
export const COLORS = { ... };
export const SIZES = { ... };
export const SPACING = { ... };
export const SHADOWS = { ... };
export const ANIMATION = { ... };
```

**⚠️ Egyetlen változtatás:**
- Font méretek: `fontBase: '1rem'` → `fontBase: 16`
- String → Szám konverzió

---

## 📱 NAVIGATION STRUKTÚRA

### App.tsx (Root)
```tsx
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
```

### AppNavigator.tsx (Main Navigator)
```tsx
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../components/screens/WelcomeScreen';
import MainTabs from './BottomTabNavigator';

const Stack = createStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}
```

### BottomTabNavigator.tsx
```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UniversityPage from '../components/screens/UniversityPage';
import ProfilePage from '../components/screens/ProfilePage';
import ArenaPage from '../components/screens/ArenaPage';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="University" component={UniversityPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
      <Tab.Screen name="Arena" component={ArenaPage} />
      {/* ... további tabok */}
    </Tab.Navigator>
  );
}
```

---

## 🔄 KOMPONENS KONVERZIÓS PÉLDA

### TopBar.tsx - ELŐTTE (Web - inline styles)

```tsx
import { CSSProperties } from 'react';
import { COLORS, SIZES, SPACING } from '../utils/styleConstants';

const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.white,
    padding: SPACING.base,
  },
  text: {
    color: COLORS.black,
    fontSize: SIZES.fontBase,
  },
};

export function TopBar({ coins }: { coins: number }) {
  return (
    <div style={styles.container}>
      <span style={styles.text}>{coins}</span>
    </div>
  );
}
```

### TopBar.tsx - UTÁNA (React Native)

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../utils/styleConstants';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap NEM TÁMOGATOTT! Használj marginRight-ot
    backgroundColor: COLORS.white,
    padding: SPACING.base,
  },
  text: {
    color: COLORS.black,
    fontSize: SIZES.fontBase, // Már szám, nem string!
    marginRight: SPACING.sm, // gap helyett
  },
});

export function TopBar({ coins }: { coins: number }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{coins}</Text>
    </View>
  );
}
```

---

## 🎯 KONVERZIÓS CHECKLIST

Minden komponensnél kövesd ezt a checklistet:

### 1. Import-ok
- [ ] `import React from 'react'` → `import React, { ... } from 'react'`
- [ ] `import { motion } from 'motion/react'` → `import Animated from 'react-native-reanimated'`
- [ ] Lucide icons → Vector Icons
- [ ] Shadcn/ui → React Native Paper

### 2. Style Objektumok
- [ ] `CSSProperties` → `StyleSheet.create()`
- [ ] `gap` → `marginRight`/`marginBottom`
- [ ] `cursor`, `transition` → TÖRÖLD
- [ ] Font méretek: string → number
- [ ] `display: 'flex'` → TÖRÖLD

### 3. JSX Elemek
- [ ] `<div>` → `<View>`
- [ ] `<span>`, `<p>`, `<h1>` → `<Text>`
- [ ] `<button>` → `<TouchableOpacity>`
- [ ] `<img>` → `<Image>`

### 4. Event Handlers
- [ ] `onClick` → `onPress`
- [ ] `onMouseEnter`/`onMouseLeave` → `onPressIn`/`onPressOut`

### 5. State & Effects
- [ ] localStorage → AsyncStorage (async!)
- [ ] window.addEventListener → BackHandler (Android back button)

### 6. Navigáció
- [ ] `setState('page')` → `navigation.navigate('Page')`
- [ ] NAVIGATION kommentek követése

### 7. Animációk
- [ ] motion → Reanimated
- [ ] AnimatePresence → conditional rendering + Animated

---

## 📋 KOMPONENSEK PRIORITÁSI SORRENDBEN

### 1. Alapkomponensek (Kezdd ezekkel!)
1. ✅ **styleConstants.ts** - MÁR KÉSZ, csak átmásolás
2. ⏳ **WelcomeScreen.tsx** - Splash screen
3. ⏳ **TopBar.tsx** - Felső sáv
4. ⏳ **PlayerStatusBar.tsx** - Játékos állapot
5. ⏳ **TipBar.tsx** - Tippek

### 2. Screen Komponensek
6. ⏳ **UniversityPage.tsx** - Főmenü
7. ⏳ **ProfilePage.tsx** - Profil
8. ⏳ **ArenaPage.tsx** - Aréna
9. ⏳ **LibraryPage.tsx** - Könyvtár (~850 sor!)
10. ⏳ **LessonsPage.tsx** - Leckék
11. ⏳ **SubscriptionPage.tsx** - Előfizetés
12. ⏳ **ShopPage.tsx** - Bolt

### 3. Játék Komponensek
13. ⏳ **LessonGame.tsx** - Játék wrapper
14. ⏳ **ReadingGame.tsx** - Olvasás játék (~850 sor!)
15. ⏳ **QuizGame.tsx** - Kvíz
16. ⏳ **BookReader.tsx** - Könyv olvasó

### 4. Animációk
17. ⏳ **ProgressAnimation.tsx** - XP animáció
18. ⏳ **LevelUpCelebration.tsx** - Szintlépés
19. ⏳ **StreakCelebration.tsx** - Streak ünneplés

### 5. Könyv Nézetek
20. ⏳ **StandaloneBookView.tsx** - Könyv nézet
21. ⏳ **PenzugyiAlapismeretkBookView.tsx** - Pénzügyi könyv

---

## 🚨 KRITIKUS PONTOK

### 1. Gap Property - NEM TÁMOGATOTT!
```tsx
// ❌ ROSSZ
const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});

// ✅ JÓ
const styles = StyleSheet.create({
  container: {
    // Gyerekeken használd:
  },
  item: {
    marginRight: 8,
    marginBottom: 8,
  },
});
```

### 2. AsyncStorage - ASYNC!
```tsx
// ❌ ROSSZ
const value = localStorage.getItem('key');

// ✅ JÓ
const value = await AsyncStorage.getItem('key');
```

### 3. Navigation
```tsx
// ❌ ROSSZ
setCurrentPage('profile');

// ✅ JÓ
navigation.navigate('Profile');
```

### 4. Animációk - Reanimated
```tsx
// ❌ ROSSZ
<motion.div animate={{ opacity: 1 }}>

// ✅ JÓ
const opacity = useSharedValue(0);
useEffect(() => {
  opacity.value = withTiming(1);
}, []);
const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));
<Animated.View style={animatedStyle}>
```

---

## 📦 PACKAGE.JSON FÜGGŐSÉGEK

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/drawer": "^6.6.6",
    "react-native-paper": "^5.11.0",
    "react-native-vector-icons": "^10.0.2",
    "react-native-reanimated": "^3.6.0",
    "react-native-gesture-handler": "^2.14.0",
    "react-native-linear-gradient": "^2.8.3",
    "react-native-svg": "^14.0.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "react-native-safe-area-context": "^4.8.0",
    "react-native-screens": "^3.29.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.73.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 🎯 FELADAT ÖSSZEFOGLALÁS

1. **Hozz létre egy új React Native projektet** (Expo vagy React Native CLI)
2. **Másold át a styleConstants.ts fájlt** - ez már kész!
3. **Konvertálj minden komponenst** a fenti szabályok szerint:
   - HTML elemek → React Native komponensek
   - inline style objektumok → StyleSheet.create()
   - localStorage → AsyncStorage
   - motion → Reanimated
   - setState navigáció → React Navigation
4. **Állítsd be a navigációt** - 3 szintű stack/tab struktúra
5. **Teszteld minden screent** - UX/UI megtartása
6. **Optimalizáld az animációkat** - smooth 60fps

---

## 📚 DOKUMENTÁCIÓK A PROJEKTBEN

A következő dokumentációk segítenek:
- ✅ `CONVERSION_COMPLETE.md` - Teljes konverziós összefoglaló
- ✅ `CONVERSION_STATUS.md` - Komponens státuszok
- ✅ `REACT_NATIVE_CONVERSION_GUIDE.md` - RN útmutató
- ✅ `LECKE_RENDSZER.md` - Játék mechanika
- ✅ `TARTALMI_OSSZEFOGLALO.md` - App tartalom

---

## ✅ VALIDÁCIÓ

Minden konvertált komponensnél ellenőrizd:
- [ ] Nincs `className` használat
- [ ] Nincs `<div>`, `<span>`, `<button>` elem
- [ ] Nincs `CSSProperties` import
- [ ] Minden style `StyleSheet.create()`-ben
- [ ] Nincs `gap` property
- [ ] Nincs `cursor`, `transition`
- [ ] Font méretek számok, nem stringek
- [ ] AsyncStorage async/await használat
- [ ] React Navigation használat setState helyett
- [ ] Anim��ciók Reanimated-del

---

## 🎉 VÉGEREDMÉNY

Egy **teljesen natív React Native alkalmazás**:
- 📱 iOS & Android támogatás
- 🎨 Pixel-perfect UI a web verzióhoz képest
- ⚡ Smooth 60fps animációk
- 🗂️ Tiszta komponens struktúra
- 📦 Type-safe TypeScript kód
- 🚀 Készen áll a production release-re

---

**Jó munkát! 🚀**

*Ha bármilyen kérdés merül fel a konverzió során, nézd meg a NAVIGATION kommenteket a komponensekben!*
