# 🚀 TELJES REACT NATIVE KONVERZIÓS PROMPT - CLAUDE AI

## 📌 KRITIKUS INFORMÁCIÓ

**EZ A PROMPT TARTALMAZZA A TELJES 100%-OS KONVERZIÓHOZ SZÜKSÉGES ÖSSZES INFORMÁCIÓT!**

Az alábbi projekt egy **teljesen előkészített React Web alkalmazás**, amely 30 komponenst tartalmaz (~15,660+ sor kód) **inline style objektumokkal**. A feladatod: konvertáld a teljes projektet **production-ready React Native alkalmazássá**.

---

## 🎯 FELADAT ÖSSZEFOGLALÁS

**Cél**: Egy RPG-stílusú pénzügyi oktatási mobil alkalmazás teljes konvertálása React Web-ről React Native-re.

**Időkeret**: Teljes konverzió egy munkamenetben.

**Követelmények**:
- ✅ 100% funkcionalitás megtartása
- ✅ Pixel-perfect UI (amennyire lehetséges)
- ✅ Smooth 60fps animációk
- ✅ Type-safe TypeScript kód
- ✅ Clean code principles
- ✅ Production-ready minőség

---

## 📦 JELENLEGI PROJEKT STRUKTÚRA

```
CurrentProject/
├── App.tsx                          # ⚠️ Web verzió - át kell írni
├── components/                      # 30 komponens
│   ├── ArenaPage.tsx               # ✅ Inline styles
│   ├── AvatarSelectorPage.tsx      # ✅ Inline styles
│   ├── BookReader.tsx              # ✅ Inline styles
│   ├── CharacterLineup.tsx         # ✅ Inline styles
│   ├── DailyLimitPage.tsx          # ✅ Inline styles
│   ├── EventCards.tsx              # ✅ Inline styles
│   ├── LessonGame.tsx              # ✅ Inline styles
│   ├── LessonHeader.tsx            # ✅ Inline styles
│   ├── LessonsPage.tsx             # ✅ Inline styles (~560 sor)
│   ├── LevelUpCelebration.tsx      # ✅ Inline styles
│   ├── LibraryPage.tsx             # ✅ Inline styles (~850 sor!)
│   ├── ManagerPage.tsx             # ✅ Inline styles
│   ├── PenzugyiAlapismeretkBookView.tsx  # ✅ Inline styles
│   ├── PhoneFrame.tsx              # ⚠️ Törlendő (csak web preview)
│   ├── PlayerStatusBar.tsx         # ✅ Inline styles
│   ├── ProfilePage.tsx             # ✅ Inline styles
│   ├── ProgressAnimation.tsx       # ✅ Inline styles + Motion
│   ├── QuizGame.tsx                # ✅ Inline styles
│   ├── ReadingGame.tsx             # ✅ Inline styles (~850 sor!)
│   ├── ShopPage.tsx                # ✅ Inline styles
│   ├── SideMenu.tsx                # ✅ Inline styles + Motion
│   ├── StandaloneBookView.tsx      # ✅ Inline styles
│   ├── StreakCelebration.tsx       # ✅ Inline styles + Motion
│   ├── StreakPage.tsx              # ✅ Inline styles
│   ├── SubscriptionPage.tsx        # ✅ Inline styles
│   ├── TipBar.tsx                  # ✅ Inline styles
│   ├── TopBar.tsx                  # ✅ Inline styles
│   ├── UniversityPage.tsx          # ✅ Inline styles
│   ├── WelcomeScreen.tsx           # ✅ Inline styles + Motion
│   ├── ui/                         # ⚠️ Shadcn komponensek - CSERÉLD!
│   │   ├── button.tsx              # → React Native Paper
│   │   ├── card.tsx                # → React Native Paper
│   │   ├── tabs.tsx                # → SegmentedButtons
│   │   ├── dropdown-menu.tsx       # → Menu
│   │   ├── separator.tsx           # → Divider
│   │   └── ...                     # → Paper equivalents
│   └── figma/
│       └── ImageWithFallback.tsx   # ⚠️ → Image component
├── data/                           # ✅ 15+ adat fájl (TypeScript)
│   ├── penzugyiAlapismeretkLessons.ts
│   ├── penzugyiAlapismeretkArenaQuestions.ts
│   ├── tokepiaciSzotar.ts
│   ├── befektetesAlapjai.ts
│   └── ...                         # Másold át változatlanul!
├── utils/                          # Utility fájlok
│   ├── styleConstants.ts           # ✅ MÁR KÉSZ! Csak fontméret fix
│   ├── gameConfig.ts               # ✅ Másold át
│   ├── streakManager.ts            # ⚠️ localStorage → AsyncStorage
│   └── dataSync.ts                 # ⚠️ localStorage → AsyncStorage
└── styles/
    └── globals.css                 # ⚠️ NE HASZNÁLD! RN-ben nincs CSS
```

---

## 🎨 CÉL REACT NATIVE STRUKTÚRA

```
NewReactNativeProject/
├── App.tsx                          # NavigationContainer root
├── app.json                         # Expo config
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── src/
│   ├── navigation/                  # 🆕 ÚJ!
│   │   ├── types.ts                # Navigation types
│   │   ├── AppNavigator.tsx        # Main Stack Navigator
│   │   ├── BottomTabNavigator.tsx  # Bottom tabs
│   │   └── UniversityStack.tsx     # Nested stack
│   ├── screens/                     # 🆕 Screen komponensek
│   │   ├── WelcomeScreen.tsx       # Splash screen
│   │   ├── UniversityScreen.tsx    # Egyetem menü
│   │   ├── ProfileScreen.tsx       # Profil
│   │   ├── ArenaScreen.tsx         # Aréna
│   │   ├── LibraryScreen.tsx       # Könyvtár
│   │   ├── LessonsScreen.tsx       # Leckék lista
│   │   ├── LessonGameScreen.tsx    # Játék wrapper
│   │   ├── SubscriptionScreen.tsx  # Előfizetés
│   │   ├── ShopScreen.tsx          # Bolt
│   │   ├── StreakScreen.tsx        # Streak részletek
│   │   ├── AvatarSelectorScreen.tsx # Avatar választó
│   │   ├── DailyLimitScreen.tsx    # Napi limit
│   │   ├── BookViewScreen.tsx      # Könyv nézet
│   │   └── ManagerScreen.tsx       # Diák menü
│   ├── components/                  # Reusable components
│   │   ├── ui/                     # Basic UI
│   │   │   ├── TopBar.tsx
│   │   │   ├── SideMenu.tsx
│   │   │   ├── PlayerStatusBar.tsx
│   │   │   ├── CharacterLineup.tsx
│   │   │   ├── TipBar.tsx
│   │   │   └── EventCards.tsx
│   │   ├── game/                   # Game components
│   │   │   ├── ReadingGame.tsx
│   │   │   ├── QuizGame.tsx
│   │   │   ├── BookReader.tsx      # Match game
│   │   │   └── LessonHeader.tsx
│   │   ├── animations/             # Animated components
│   │   │   ├── ProgressAnimation.tsx
│   │   │   ├── LevelUpCelebration.tsx
│   │   │   └── StreakCelebration.tsx
│   │   └── books/                  # Book viewers
│   │       ├── StandaloneBookView.tsx
│   │       └── PenzugyiAlapismeretkBookView.tsx
│   ├── data/                       # ✅ Másold át!
│   │   └── ...                     # Minden .ts fájl
│   ├── utils/                      # Utilities
│   │   ├── styleConstants.ts       # ✅ Font méret fix
│   │   ├── gameConfig.ts
│   │   ├── storage.ts              # 🆕 AsyncStorage wrapper
│   │   └── streakManager.ts        # AsyncStorage update
│   ├── hooks/                      # 🆕 Custom hooks
│   │   ├── usePlayerData.ts
│   │   ├── useStreak.ts
│   │   └── useNavigation.ts
│   └── types/                      # 🆕 TypeScript types
│       └── index.ts                # Global types
└── assets/                         # 🆕 Images, fonts
```

---

## 🔧 TECHNOLÓGIAI STACK & FÜGGŐSÉGEK

### Core Dependencies

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.2",
    "expo": "~50.0.0",
    
    // Navigation
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/drawer": "^6.6.6",
    "react-native-screens": "^3.29.0",
    "react-native-safe-area-context": "^4.8.0",
    
    // UI Library
    "react-native-paper": "^5.11.0",
    "react-native-vector-icons": "^10.0.2",
    
    // Animations
    "react-native-reanimated": "^3.6.0",
    "react-native-gesture-handler": "^2.14.0",
    "lottie-react-native": "^6.4.1",
    
    // Storage
    "@react-native-async-storage/async-storage": "^1.21.0",
    
    // Graphics
    "react-native-linear-gradient": "^2.8.3",
    "react-native-svg": "^14.0.0",
    
    // DnD (BookReader match game)
    "react-native-draggable-flatlist": "^4.0.1",
    
    // Toast notifications
    "react-native-toast-message": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.73.0",
    "typescript": "^5.3.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0"
  }
}
```

---

## 📝 RÉSZLETES KONVERZIÓS SZABÁLYOK

### 1. STYLE OBJEKTUMOK KONVERZIÓJA

#### ❌ ELŐTTE (Web - CSSProperties)
```tsx
import { CSSProperties } from 'react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    padding: SPACING.base,
    borderRadius: SIZES.radiusLG,
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  text: {
    fontSize: '16px',  // String!
    color: COLORS.white,
  },
};
```

#### ✅ UTÁNA (React Native - StyleSheet)
```tsx
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

const styles = StyleSheet.create({
  container: {
    // display: 'flex' → TÖRÖLD (default)
    flexDirection: 'row',
    alignItems: 'center',
    // gap → NEM TÁMOGATOTT! Lásd alább
    backgroundColor: COLORS.primary,
    padding: SPACING.base,
    borderRadius: SIZES.radiusLG,
    // cursor → TÖRÖLD (nincs RN-ben)
    // transition → TÖRÖLD (használj Reanimated-et)
  },
  item: {
    marginRight: SPACING.sm, // gap helyett!
  },
  text: {
    fontSize: 16, // SZÁM, nem string!
    color: COLORS.white,
  },
});
```

### 2. GAP PROPERTY KEZELÉSE

**⚠️ KRITIKUS: A `gap` NEM TÁMOGATOTT React Native-ben!**

#### Megoldások:

**A) Horizontal gap (flexDirection: 'row')**
```tsx
// ❌ ROSSZ
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
});

// ✅ JÓ - Margin használat
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  item: {
    marginRight: 8,
  },
  itemLast: {
    marginRight: 0, // Utolsó elem
  },
});

// Használat
<View style={styles.container}>
  <View style={[styles.item, index === items.length - 1 && styles.itemLast]}>
    ...
  </View>
</View>
```

**B) Vertical gap (flexDirection: 'column')**
```tsx
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  item: {
    marginBottom: 8,
  },
  itemLast: {
    marginBottom: 0,
  },
});
```

**C) FlatList használat (automatikus spacing)**
```tsx
<FlatList
  data={items}
  ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
  renderItem={({ item }) => <ItemComponent item={item} />}
/>
```

### 3. HTML → REACT NATIVE ELEMEK

| Web Element | React Native | Példa |
|-------------|--------------|-------|
| `<div>` | `<View>` | `<View style={styles.container}>` |
| `<span>` | `<Text>` | `<Text style={styles.label}>` |
| `<p>` | `<Text>` | `<Text>Text here</Text>` |
| `<h1>`, `<h2>` | `<Text style={styles.heading}>` | Font méret a style-ban |
| `<button>` | `<TouchableOpacity>` vagy `<Pressable>` | `<TouchableOpacity onPress={...}>` |
| `<a>` | `<TouchableOpacity>` + navigation | `onPress={() => navigation.navigate(...)}` |
| `<input>` | `<TextInput>` | `<TextInput value={...} onChangeText={...} />` |
| `<img>` | `<Image>` | `<Image source={{ uri: ... }} />` |
| `<ul>`, `<li>` | `<FlatList>` | `<FlatList data={...} renderItem={...} />` |

**Teljes példa:**
```tsx
// ❌ WEB
<div className="container">
  <h1>Title</h1>
  <p>Description</p>
  <button onClick={handleClick}>Click me</button>
  <img src="image.png" alt="Image" />
</div>

// ✅ REACT NATIVE
<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
  <Text style={styles.description}>Description</Text>
  <TouchableOpacity onPress={handleClick} style={styles.button}>
    <Text style={styles.buttonText}>Click me</Text>
  </TouchableOpacity>
  <Image source={require('./image.png')} style={styles.image} />
</View>
```

### 4. EVENT HANDLERS

| Web | React Native | Megjegyzés |
|-----|--------------|------------|
| `onClick` | `onPress` | TouchableOpacity, Pressable |
| `onMouseEnter` | `onPressIn` | Pressable |
| `onMouseLeave` | `onPressOut` | Pressable |
| `onChange` | `onChangeText` | TextInput |
| `onSubmit` | - | Nincs form submit RN-ben |

**Hover állapot kezelése:**
```tsx
// ❌ WEB
<button
  style={styles.button}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'blue'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'red'}
>

// ✅ REACT NATIVE (Pressable)
const [isPressed, setIsPressed] = useState(false);

<Pressable
  onPressIn={() => setIsPressed(true)}
  onPressOut={() => setIsPressed(false)}
  style={[
    styles.button,
    isPressed && styles.buttonPressed
  ]}
>
  <Text>Button</Text>
</Pressable>

// Vagy használd a Pressable style function-t:
<Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && styles.buttonPressed
  ]}
>
```

### 5. LOCALSTORAGE → ASYNCSTORAGE

**⚠️ KRITIKUS: AsyncStorage ASZINKRON!**

#### ❌ ELŐTTE (localStorage)
```tsx
// Setters
localStorage.setItem('playerLevel', '5');
localStorage.setItem('playerData', JSON.stringify(data));

// Getters
const level = localStorage.getItem('playerLevel');
const data = JSON.parse(localStorage.getItem('playerData') || '{}');

// Removers
localStorage.removeItem('playerLevel');
localStorage.clear();
```

#### ✅ UTÁNA (AsyncStorage)
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Setters (async!)
await AsyncStorage.setItem('playerLevel', '5');
await AsyncStorage.setItem('playerData', JSON.stringify(data));

// Getters (async!)
const level = await AsyncStorage.getItem('playerLevel');
const dataStr = await AsyncStorage.getItem('playerData');
const data = dataStr ? JSON.parse(dataStr) : {};

// Removers (async!)
await AsyncStorage.removeItem('playerLevel');
await AsyncStorage.clear();
```

#### Storage Wrapper (ajánlott)
```tsx
// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async setItem(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },

  async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue || null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return defaultValue || null;
    }
  },

  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  },

  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};

// Használat
await storage.setItem('playerLevel', 5);
const level = await storage.getItem<number>('playerLevel', 1);
```

### 6. NAVIGÁCIÓ - REACT NAVIGATION

#### ❌ ELŐTTE (setState)
```tsx
const [currentPage, setCurrentPage] = useState<string>('home');
const [showProfile, setShowProfile] = useState(false);

// NAVIGATION NOTE: setState hívás navigációhoz
setCurrentPage('profile');
setShowProfile(true);

// JSX
{currentPage === 'home' && <HomePage />}
{currentPage === 'profile' && <ProfilePage />}
{showProfile && <ProfileModal />}
```

#### ✅ UTÁNA (React Navigation)

**1. Navigation Setup (App.tsx)**
```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="University" component={UniversityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Arena" component={ArenaScreen} />
    </Tab.Navigator>
  );
}

// Main Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="LessonGame" component={LessonGameScreen} />
        <Stack.Screen name="BookView" component={BookViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**2. Navigation Usage**
```tsx
import { useNavigation } from '@react-navigation/native';

function MyComponent() {
  const navigation = useNavigation();

  const handlePress = () => {
    // Screen navigáció
    navigation.navigate('Profile');
    
    // Params átadás
    navigation.navigate('LessonGame', { 
      bookTitle: 'Pénzügyi Alapismeretek',
      lessonIndex: 0 
    });
    
    // Vissza navigáció
    navigation.goBack();
    
    // Reset navigation stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>Navigate</Text>
    </TouchableOpacity>
  );
}
```

**3. Params fogadása**
```tsx
import { useRoute } from '@react-navigation/native';

function LessonGameScreen() {
  const route = useRoute();
  const { bookTitle, lessonIndex } = route.params;

  return (
    <View>
      <Text>{bookTitle}</Text>
      <Text>Lesson {lessonIndex}</Text>
    </View>
  );
}
```

**4. Type-safe Navigation**
```tsx
// src/navigation/types.ts
export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  LessonGame: { bookTitle: string; lessonIndex: number };
  BookView: { bookTitle: string };
};

// Használat
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'LessonGame'>;

function MyComponent() {
  const navigation = useNavigation<NavigationProp>();
  
  navigation.navigate('LessonGame', { 
    bookTitle: 'Test', 
    lessonIndex: 0 
  }); // Type-safe!
}
```

### 7. MOTION ANIMÁCIÓK → REANIMATED

#### ❌ ELŐTTE (motion/react)
```tsx
import { motion, AnimatePresence } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  <p>Animated content</p>
</motion.div>

<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      Modal
    </motion.div>
  )}
</AnimatePresence>
```

#### ✅ UTÁNA (Reanimated)
```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
} from 'react-native-reanimated';

function MyComponent() {
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

  return (
    <Animated.View style={animatedStyle}>
      <Text>Animated content</Text>
    </Animated.View>
  );
}

// AnimatePresence equivalent
function ModalComponent({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <Text>Modal</Text>
    </Animated.View>
  );
}
```

**Gyakori animációk:**

```tsx
// Fade In/Out
import { FadeIn, FadeOut } from 'react-native-reanimated';
<Animated.View entering={FadeIn} exiting={FadeOut}>

// Slide
import { SlideInUp, SlideOutDown } from 'react-native-reanimated';
<Animated.View entering={SlideInUp} exiting={SlideOutDown}>

// Zoom
import { ZoomIn, ZoomOut } from 'react-native-reanimated';
<Animated.View entering={ZoomIn} exiting={ZoomOut}>

// Spring animation
const scale = useSharedValue(0);
scale.value = withSpring(1, {
  damping: 10,
  stiffness: 100,
});

// Sequence
import { withSequence, withDelay } from 'react-native-reanimated';
scale.value = withSequence(
  withTiming(1.2, { duration: 200 }),
  withTiming(1, { duration: 200 })
);
```

### 8. SHADCN/UI → REACT NATIVE PAPER

| Shadcn Component | React Native Paper | Példa |
|------------------|-------------------|-------|
| `<Button>` | `<Button mode="contained">` | `<Button mode="contained" onPress={...}>` |
| `<Card>` | `<Card>` | `<Card><Card.Content>...</Card.Content></Card>` |
| `<Dialog>` | `<Modal>` vagy `<Portal>` | `<Modal visible={...}>` |
| `<Tabs>` | `<SegmentedButtons>` | `<SegmentedButtons value={...} onValueChange={...} buttons={...} />` |
| `<DropdownMenu>` | `<Menu>` | `<Menu visible={...} onDismiss={...} anchor={...}>` |
| `<Separator>` | `<Divider>` | `<Divider />` |
| `<Switch>` | `<Switch>` | `<Switch value={...} onValueChange={...} />` |

**Paper Setup:**
```tsx
// App.tsx
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    accent: COLORS.accent,
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        ...
      </NavigationContainer>
    </PaperProvider>
  );
}
```

**Használat példák:**
```tsx
import { Button, Card, Divider } from 'react-native-paper';

// Button
<Button mode="contained" onPress={handlePress}>
  Click me
</Button>

// Card
<Card>
  <Card.Title title="Card Title" subtitle="Card Subtitle" />
  <Card.Content>
    <Text>Card content</Text>
  </Card.Content>
  <Card.Actions>
    <Button>Cancel</Button>
    <Button>Ok</Button>
  </Card.Actions>
</Card>

// Divider
<Divider />
```

### 9. LUCIDE ICONS → VECTOR ICONS

#### ❌ ELŐTTE (lucide-react)
```tsx
import { ChevronRight, Star, Trophy, Coins, BookOpen } from 'lucide-react';

<ChevronRight className="w-6 h-6 text-blue-500" />
<Star className="w-5 h-5" />
```

#### ✅ UTÁNA (react-native-vector-icons)
```tsx
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '../utils/styleConstants';

<Icon name="chevron-right" size={24} color={COLORS.primary} />
<Icon name="star" size={20} color={COLORS.yellow} />
```

**Icon Mapping Table:**

| Lucide | MaterialCommunityIcons | Megjegyzés |
|--------|------------------------|-----------|
| `ChevronRight` | `chevron-right` | |
| `ChevronLeft` | `chevron-left` | |
| `Star` | `star` | Filled |
| `StarOff` | `star-outline` | Outline |
| `Trophy` | `trophy` | |
| `Coins` | `currency-usd` | vagy `cash-multiple` |
| `BookOpen` | `book-open-variant` | vagy `book-open-page-variant` |
| `User` | `account` | vagy `account-circle` |
| `Settings` | `cog` | |
| `Home` | `home` | |
| `Menu` | `menu` | |
| `X` | `close` | |
| `Check` | `check` | |
| `ArrowLeft` | `arrow-left` | |
| `Lock` | `lock` | |
| `Unlock` | `lock-open` | |

**Icon Component Helper:**
```tsx
// src/components/ui/Icon.tsx
import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SIZES } from '../../utils/styleConstants';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ name, size = SIZES.iconBase, color }: IconProps) {
  return <MaterialIcon name={name} size={size} color={color} />;
}

// Használat
<Icon name="star" size={24} color={COLORS.yellow} />
```

---

## 🚀 LÉPÉSRŐL LÉPÉSRE KONVERZIÓS FOLYAMAT

### FÁZIS 1: PROJEKT SETUP (5 perc)

1. **Új React Native projekt létrehozása**
```bash
# Expo (ajánlott)
npx create-expo-app FinanceEducationApp --template typescript

# Vagy React Native CLI
npx react-native init FinanceEducationApp --template react-native-template-typescript
```

2. **Függőségek telepítése**
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer
npm install react-native-paper react-native-vector-icons
npm install react-native-reanimated react-native-gesture-handler
npm install @react-native-async-storage/async-storage
npm install react-native-linear-gradient react-native-svg
npm install react-native-screens react-native-safe-area-context
npm install react-native-draggable-flatlist
npm install react-native-toast-message

# Dev dependencies
npm install --save-dev @types/react @types/react-native
```

3. **Babel config (Reanimated)**
```js
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

4. **Mappa struktúra létrehozása**
```bash
mkdir -p src/{navigation,screens,components/{ui,game,animations,books},data,utils,hooks,types}
```

### FÁZIS 2: UTILS & DATA ÁTMÁSOLÁSA (10 perc)

1. **styleConstants.ts konvertálása**
```tsx
// src/utils/styleConstants.ts
export const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  primary: '#8B5CF6',
  // ... másold át az összes színt
};

export const SPACING = {
  xs: 4,
  sm: 8,
  base: 16,
  // ... másold át
};

export const SIZES = {
  // ⚠️ VÁLTOZÁS: String → Number
  fontXS: 12,        // volt: '0.75rem'
  fontSM: 14,        // volt: '0.875rem'
  fontBase: 16,      // volt: '1rem'
  fontLG: 18,        // volt: '1.125rem'
  fontXL: 20,        // volt: '1.25rem'
  font2XL: 24,       // volt: '1.5rem'
  font3XL: 30,       // volt: '1.875rem'
  font4XL: 36,       // volt: '2.25rem'
  
  iconSM: 16,
  iconBase: 20,
  iconLG: 24,
  iconXL: 32,
  
  radiusSM: 4,
  radiusBase: 8,
  radiusLG: 12,
  radiusXL: 16,
  radius2XL: 24,
  radius3XL: 32,
  radiusFull: 9999,
};

// SHADOWS - React Native shadow properties
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const ANIMATION = {
  durationFast: 150,
  durationBase: 300,
  durationSlow: 500,
};
```

2. **Storage wrapper létrehozása**
```tsx
// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async setItem(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  },

  async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue || null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return defaultValue || null;
    }
  },

  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  },

  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};
```

3. **Data fájlok átmásolása**
```bash
# Másold át az ÖSSZES .ts fájlt a data mappából
cp -r OriginalProject/data/* NewProject/src/data/
```

4. **gameConfig.ts, streakManager.ts frissítése**
- Cseréld `localStorage` → `storage` (az új wrapper)
- Adj hozzá `async/await`-et minden storage híváshoz

### FÁZIS 3: NAVIGATION SETUP (20 perc)

1. **Navigation types**
```tsx
// src/navigation/types.ts
export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  LessonGame: { 
    bookTitle: string; 
    lessonIndex: number; 
    gameType: 'reading' | 'matching' | 'quiz';
  };
  BookView: { bookTitle: string };
  Subscription: undefined;
  Shop: undefined;
  Streak: undefined;
  AvatarSelector: undefined;
  DailyLimit: undefined;
};

export type MainTabParamList = {
  University: undefined;
  Profile: undefined;
  Arena: undefined;
  Manager: undefined;
};
```

2. **App Navigator**
```tsx
// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import MainTabs from './BottomTabNavigator';
import LessonGameScreen from '../screens/LessonGameScreen';
import BookViewScreen from '../screens/BookViewScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ShopScreen from '../screens/ShopScreen';
import StreakScreen from '../screens/StreakScreen';
import AvatarSelectorScreen from '../screens/AvatarSelectorScreen';
import DailyLimitScreen from '../screens/DailyLimitScreen';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress,
          },
        }),
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="LessonGame" component={LessonGameScreen} />
      <Stack.Screen name="BookView" component={BookViewScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="Streak" component={StreakScreen} />
      <Stack.Screen name="AvatarSelector" component={AvatarSelectorScreen} />
      <Stack.Screen name="DailyLimit" component={DailyLimitScreen} />
    </Stack.Navigator>
  );
}
```

3. **Bottom Tab Navigator**
```tsx
// src/navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UniversityScreen from '../screens/UniversityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ArenaScreen from '../screens/ArenaScreen';
import ManagerScreen from '../screens/ManagerScreen';
import { MainTabParamList } from './types';
import { COLORS } from '../utils/styleConstants';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        },
      }}
    >
      <Tab.Screen 
        name="University" 
        component={UniversityScreen}
        options={{
          tabBarLabel: 'Egyetem',
          tabBarIcon: ({ color, size }) => (
            <Icon name="school" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Arena" 
        component={ArenaScreen}
        options={{
          tabBarLabel: 'Aréna',
          tabBarIcon: ({ color, size }) => (
            <Icon name="sword-cross" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Manager" 
        component={ManagerScreen}
        options={{
          tabBarLabel: 'Diák',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

4. **App.tsx Root**
```tsx
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
          <Toast />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

### FÁZIS 4: KOMPONENSEK KONVERTÁLÁSA (PRIORITÁS SZERINT)

#### 1. UI KOMPONENSEK (30 perc)

**TopBar.tsx**
```tsx
// src/components/ui/TopBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, SIZES, SHADOWS } from '../../utils/styleConstants';

interface TopBarProps {
  onMenuPress: () => void;
  coins: number;
  diamonds: number;
  streak: number;
}

export function TopBar({ onMenuPress, coins, diamonds, streak }: TopBarProps) {
  return (
    <View style={styles.container}>
      {/* Menu button */}
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Icon name="menu" size={SIZES.iconLG} color={COLORS.white} />
      </TouchableOpacity>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {/* Coins */}
        <View style={styles.statItem}>
          <Icon name="currency-usd" size={SIZES.iconBase} color={COLORS.yellow} />
          <Text style={styles.statText}>{coins}</Text>
        </View>

        {/* Diamonds */}
        <View style={styles.statItem}>
          <Icon name="diamond-stone" size={SIZES.iconBase} color={COLORS.cyan} />
          <Text style={styles.statText}>{diamonds}</Text>
        </View>

        {/* Streak */}
        <View style={styles.statItem}>
          <Icon name="fire" size={SIZES.iconBase} color={COLORS.orange} />
          <Text style={styles.statText}>{streak}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    ...SHADOWS.base,
  },
  menuButton: {
    padding: SPACING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.base, // gap helyett
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
  },
  statText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    marginLeft: SPACING.xs, // icon és text közti gap
  },
});
```

**PlayerStatusBar.tsx**
```tsx
// src/components/ui/PlayerStatusBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue,
  useEffect as useReanimatedEffect,
} from 'react-native-reanimated';
import { COLORS, SPACING, SIZES } from '../../utils/styleConstants';

interface PlayerStatusBarProps {
  level: number;
  xp: number;
  maxXp: number;
  characterName: string;
}

export function PlayerStatusBar({ level, xp, maxXp, characterName }: PlayerStatusBarProps) {
  const progressWidth = useSharedValue(0);
  const xpPercentage = (xp / maxXp) * 100;

  useReanimatedEffect(() => {
    progressWidth.value = withTiming(xpPercentage, { duration: 500 });
  }, [xpPercentage]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.characterName}>{characterName}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lvl {level}</Text>
        </View>
      </View>

      <View style={styles.xpBarContainer}>
        <View style={styles.xpBarBg}>
          <Animated.View style={[styles.xpBarFill, progressStyle]} />
        </View>
        <Text style={styles.xpText}>
          {xp} / {maxXp} XP
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    borderRadius: SIZES.radiusXL,
    marginHorizontal: SPACING.base,
    marginVertical: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  characterName: {
    fontSize: SIZES.fontLG,
    color: COLORS.gray900,
  },
  levelBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusFull,
  },
  levelText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
  },
  xpBarContainer: {
    position: 'relative',
  },
  xpBarBg: {
    height: 24,
    backgroundColor: COLORS.gray200,
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusFull,
  },
  xpText: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    textAlign: 'center',
    lineHeight: 24,
    color: COLORS.gray700,
    fontSize: SIZES.fontSM,
  },
});
```

**⚠️ FOLYTATÁS MINDEN TÖBBI KOMPONENSRE:**
- TipBar.tsx
- SideMenu.tsx (drawer használat)
- CharacterLineup.tsx
- EventCards.tsx

#### 2. SCREEN KOMPONENSEK (60 perc)

**WelcomeScreen.tsx**
```tsx
// src/screens/WelcomeScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SPACING } from '../utils/styleConstants';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation();
  
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(30);

  useEffect(() => {
    // Logo animation
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 600, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(1, { duration: 200 })
    );
    logoOpacity.value = withTiming(1, { duration: 600 });

    // Title animation
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    titleY.value = withDelay(400, withTiming(0, { duration: 800 }));

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.purple700, COLORS.primary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Icon name="book-open-variant" size={120} color={COLORS.white} />
        </Animated.View>

        <Animated.View style={titleStyle}>
          <Text style={styles.title}>Pénzügyi</Text>
          <Text style={styles.title}>Oktatás</Text>
          <Text style={styles.subtitle}>RPG Kaland</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: SPACING.xl * 2,
  },
  title: {
    fontSize: SIZES.font4XL,
    color: COLORS.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.fontXL,
    color: COLORS.gray200,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
```

**⚠️ FOLYTASD AZ ÖSSZES SCREEN-NEL:**
- UniversityScreen.tsx
- ProfileScreen.tsx
- ArenaScreen.tsx
- LibraryScreen.tsx (~850 sor!)
- LessonsScreen.tsx
- LessonGameScreen.tsx
- SubscriptionScreen.tsx
- ShopScreen.tsx
- stb.

#### 3. GAME KOMPONENSEK (90 perc)

**ReadingGame.tsx** (~850 sor!)
- Konvertáld motion → Reanimated
- localStorage → storage
- button → TouchableOpacity
- div → View
- p, span → Text

**QuizGame.tsx**
**BookReader.tsx** (DnD → react-native-draggable-flatlist)

#### 4. ANIMÁCIÓK (30 perc)

**ProgressAnimation.tsx**
**LevelUpCelebration.tsx** (Lottie vagy Reanimated)
**StreakCelebration.tsx**

#### 5. KÖNYV NÉZETEK (60 perc)

**StandaloneBookView.tsx**
**PenzugyiAlapismeretkBookView.tsx**

---

## 🚨 KRITIKUS ELLENŐRZŐ LISTA

Minden komponensnél ezen a checklistán menj végig:

### Style Objektumok
- [ ] `CSSProperties` → `StyleSheet.create()`
- [ ] Töröld: `display: 'flex'`
- [ ] `gap` → `marginRight` / `marginBottom`
- [ ] Font méretek: `'16px'` → `16`
- [ ] Töröld: `cursor`, `transition`, `hover`, `focus`

### HTML Elemek
- [ ] `<div>` → `<View>`
- [ ] `<span>`, `<p>`, `<h1>` → `<Text>`
- [ ] `<button>` → `<TouchableOpacity>` vagy `<Pressable>`
- [ ] `<img>` → `<Image>`

### Event Handlers
- [ ] `onClick` → `onPress`
- [ ] `onMouseEnter`/`onMouseLeave` → `onPressIn`/`onPressOut`

### Storage
- [ ] `localStorage.setItem` → `await storage.setItem`
- [ ] `localStorage.getItem` → `await storage.getItem`
- [ ] Minden függvény `async`

### Navigáció
- [ ] `setState('page')` → `navigation.navigate('Page')`
- [ ] `setShowModal(true)` → `navigation.navigate('Modal')`

### Animációk
- [ ] `motion.div` → `Animated.View`
- [ ] `AnimatePresence` → conditional render + entering/exiting
- [ ] `import { motion }` → `import Animated`

### Icons
- [ ] `import { Icon } from 'lucide-react'` → `import Icon from 'react-native-vector-icons/MaterialCommunityIcons'`
- [ ] `<Icon className="w-6"/>` → `<Icon size={24} />`

### Shadcn
- [ ] `<Button>` → `<Button mode="contained">`
- [ ] `<Card>` → `<Card>`
- [ ] `<Tabs>` → `<SegmentedButtons>`
- [ ] `<DropdownMenu>` → `<Menu>`

---

## 📊 ELVÁRT KIMENET

### Működő React Native Alkalmazás
- ✅ iOS és Android kompatibilis
- ✅ Minden screen navigálható
- ✅ Smooth animációk (60fps)
- ✅ AsyncStorage működik
- ✅ Összes játékmechanika működik
- ✅ UI pixel-perfect

### Kód Minőség
- ✅ Type-safe TypeScript
- ✅ Nincs `any` type
- ✅ Clean code
- ✅ Kommentezett kód
- ✅ Konzisztens stílus

### Struktúra
- ✅ Tiszta mappa struktúra
- ✅ Komponensek külön fájlokban
- ✅ Navigation jól szeparált
- ✅ Utils reusable

---

## 🎯 ZÁRÓ MEGJEGYZÉSEK

1. **NE VÁLTOZTASD MEG A LOGIKÁT** - csak a technológiai stack-et cseréld
2. **MINDEN NAVIGATION KOMMENTET HASZNÁLJ** - segítenek a konverzióban
3. **TESZTELJ MINDEN SCREEN-T** - navigáció, animációk, storage
4. **ASYNC/AWAIT** - minden storage művelet async!
5. **GAP PROPERTY** - ne használd, margin-t használj!

---

**HA KÉSZEN VAGY, KEZDHETED A KONVERZIÓT! 🚀**

**Siker a munkához! Ha elakadnál, nézd meg a REACT_NATIVE_CONVERSION_PROMPT.md részletes útmutatót!**
