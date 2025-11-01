# 🎮 ArenaPage - React Native Útmutató

**Teljes konverzió a Figma designból → React Native**

---

## 🚀 GYORS HASZNÁLAT (5 perc)

### **1. Másold a fájlt:**
```bash
cp exports/ArenaPage.rn.tsx src/screens/ArenaPage.tsx
```

### **2. Telepítsd a függőségeket:**
```bash
npm install react-native-linear-gradient
npm install @react-native-community/slider
npm install react-native-reanimated
npm install lucide-react-native
npm install @react-native-async-storage/async-storage
```

### **3. iOS setup:**
```bash
cd ios && pod install && cd ..
```

### **4. Használd:**
```tsx
import { ArenaPage } from './screens/ArenaPage';

<ArenaPage
  onClose={() => navigation.goBack()}
  coins={1000}
  onCoinsChange={setCoins}
  subscriptionTier="free"
  onNavigateToLibrary={() => navigation.navigate('Library')}
/>
```

**KÉSZ! 🎉**

---

## 📋 FIGMA DESIGN → REACT NATIVE VÁLTOZÁSOK

### **Szövegek (Magyar)**
| Elem | Szöveg |
|------|--------|
| Cím | "Küzdőtér" |
| Tab 1 | "Számok" |
| Tab 2, 3 | "Hamarosan" |
| Betting | "Válassz tétet" |
| Start | "Küzdelem kezdése" |
| Könyvek | "Kölcsönzött könyvek" |

### **Header Layout**
```
┌─────────────────────────────────┐
│ ◄ Küzdőtér       ⚔️ (animált)   │
│   ⚡ 1,000                       │
└─────────────────────────────────┘
```

### **Tabok**
```
┌───────────┬───────────┬───────────┐
│ 🔥 Számok │ Hamarosan │ Hamarosan │
│  (aktív)  │ (disabled)│ (disabled)│
└───────────┴───────────┴───────────┘
```

### **Betting Card**
- Slider: **min 10** (nem 50!)
- Quick bet: **50, 100, 200, 500** (számok, nem százalékok!)
- Start gomb: "Küzdelem kezdése"

### **Szabályok (Rules)**
1. "10 kérdés • Tippeld a számot"
2. "Közelebb = nyersz"
3. "Győzelem: +{betAmount}" (zöld)
4. "Vereség: -{betAmount}" (piros)

### **Sorrend**
1. Betting Card (tét, slider, quick bet, start gomb, **szabályok**)
2. Könyvek Card

---

## 🎨 ANIMÁCIÓK

### **1. Kristályok (háttér)**
```tsx
const AnimatedCrystal = () => {
  const opacity = useSharedValue(0.3);
  
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.6, { duration: 2000 }),
      -1,
      true
    );
  }, []);
  
  return <Animated.View style={{ opacity }} />;
};
```

### **2. Swords ikon (header jobb oldal)**
```tsx
const AnimatedSwordsIcon = () => {
  const rotation = useSharedValue(0);
  
  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 500 }),  // Jobbra
        withTiming(10, { duration: 500 }),   // Balra
        withTiming(-10, { duration: 500 }),  // Jobbra
        withTiming(0, { duration: 500 }),    // Vissza
        withTiming(0, { duration: 3000 })    // Szünet
      ),
      -1
    );
  }, []);
  
  return <Animated.View style={{ rotate: rotation }} />;
};
```

---

## 📐 PIXEL-PERFECT LAYOUT

### **Header:**
```typescript
{
  paddingVertical: 10,
  paddingHorizontal: 10,
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(168, 85, 247, 0.3)',
}
```

**ChevronLeft gomb:**
```typescript
{
  width: 32,
  height: 32,
  borderRadius: 12,
  backgroundColor: '#1E293B',
  borderWidth: 1,
  borderColor: 'rgba(71, 85, 105, 0.5)',
}
```

### **Slider:**
```tsx
<Slider
  minimumValue={10}        // ✅ 10 (nem 50!)
  maximumValue={maxBet}
  step={10}
  minimumTrackTintColor="#9333EA"
  maximumTrackTintColor="rgba(51, 65, 85, 0.5)"
  thumbTintColor="#A855F7"
/>
```

### **Quick Bet Buttonok:**
```tsx
{[50, 100, 200, maxBet].map(amount => (
  <Pressable onPress={() => setBetAmount(Math.min(amount, maxBet))}>
    <Text>{amount}</Text>  // ✅ Számok (nem százalékok!)
  </Pressable>
))}
```

---

## 🔄 GAME STATES

### **1. Betting (Tét választás)**
- Tabok
- Betting card (slider, quick bet, start, rules)
- Könyvek card

### **2. Playing (Játék)**
- Progress header (Kérdés X/10, Score)
- Timer (10s visszaszámlálás)
- Kérdés card
- Válasz input
- Számbillentyűzet
- Round result overlay (3s)

### **3. Result (Eredmény)**
- Ikon (Trophy/Star/Flame)
- Eredmény szöveg (Győzelem/Döntetlen/Vesztettél)
- Score (X - Y)
- Új játék / Kilépés gombok

---

## 💾 ASYNC STORAGE HASZNÁLATA

### **Kölcsönzött könyvek:**
```tsx
// Mentés
await AsyncStorage.setItem('rentedBooks', JSON.stringify(books));

// Betöltés
const saved = await AsyncStorage.getItem('rentedBooks');
const books = JSON.parse(saved);
```

### **Napi limit (free tier):**
```tsx
await AsyncStorage.setItem('arena_daily_games', JSON.stringify({
  date: new Date().toDateString(),
  gamesPlayed: 3
}));
```

---

## 🎯 PROPS INTERFÉSZ

```tsx
interface ArenaPageProps {
  onClose: () => void;                      // Vissza navigáció
  coins: number;                            // Aktuális pénzmennyiség
  onCoinsChange: (newCoins: number) => void;// Coins frissítés
  subscriptionTier?: 'free' | 'pro' | 'master'; // Előfizetés
  onLimitReached?: () => void;              // Napi limit elérve
  onXpGain?: (xpAmount: number) => void;    // XP növelés
  onNavigateToLibrary?: () => void;         // Könyvtár navigáció
  onStageAdvance?: () => void;              // Szint előrelépés
  onStreakUpdate?: (newStreak: number, isFirstToday: boolean) => void; // Streak frissítés
}
```

---

## 📱 HASZNÁLATI PÉLDÁK

### **1. Alap használat:**
```tsx
import { ArenaPage } from './screens/ArenaPage';

function GameScreen() {
  const [coins, setCoins] = useState(1000);
  
  return (
    <ArenaPage
      onClose={() => navigation.goBack()}
      coins={coins}
      onCoinsChange={setCoins}
    />
  );
}
```

### **2. Teljes integráció:**
```tsx
function GameScreen() {
  const [coins, setCoins] = useState(1000);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  
  return (
    <ArenaPage
      onClose={() => navigation.goBack()}
      coins={coins}
      onCoinsChange={setCoins}
      subscriptionTier="free"
      
      onLimitReached={() => {
        Alert.alert('Napi limit', 'Előfizess a korlátlan játékért!');
        navigation.navigate('Subscription');
      }}
      
      onXpGain={(amount) => setXp(prev => prev + amount)}
      
      onNavigateToLibrary={() => navigation.navigate('Library')}
      
      onStageAdvance={() => {
        console.log('Szint előrelépés!');
      }}
      
      onStreakUpdate={(newStreak, isFirstToday) => {
        setStreak(newStreak);
        if (isFirstToday) {
          console.log('Első játék ma!');
        }
      }}
    />
  );
}
```

---

## 🐛 HIBAKERESÉS

### **1. "Cannot find module 'react-native-linear-gradient'"**
```bash
npm install react-native-linear-gradient
cd ios && pod install && cd ..
```

### **2. "@react-native-community/slider not found"**
```bash
npm install @react-native-community/slider
cd ios && pod install && cd ..
```

### **3. "Reanimated not configured"**
```bash
# babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],  // ✅ Ezt add hozzá!
};

# Majd:
npm start -- --reset-cache
```

### **4. "AsyncStorage is null"**
```bash
npm install @react-native-async-storage/async-storage
cd ios && pod install && cd ..
```

### **5. iOS: "Undefined symbol: _OBJC_CLASS_$_RNCSlider"**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

---

## 📖 TOVÁBBI TESTRESZABÁS

### **1. Színek változtatása:**
```tsx
// Főbb színek a fájl tetején:
const COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  // Add hozzá a sajátjaidat:
  primary: '#9333EA',
  secondary: '#DC2626',
};
```

### **2. Játék konfiguráció:**
```tsx
const GAME_CONFIG = {
  maxBooksForArena: 3,           // Max könyvek száma
  freeDailyArenaGames: 3,        // Napi limit (free)
  maxBet: 500,                   // Max tét
};
```

### **3. Kérdések hozzáadása:**
```tsx
const generateQuestions = (): Question[] => {
  const exampleQuestions: Question[] = [
    {
      question: 'A te kérdésed?',
      correctAnswer: 42,
      source: 'A könyv neve',
    },
    // Add hozzá a többit...
  ];
  
  return exampleQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
};
```

---

## ✅ ELLENŐRZŐ LISTA

Használat előtt ellenőrizd:

- [ ] Függőségek telepítve (5 db)
- [ ] iOS: `pod install` lefutott
- [ ] `babel.config.js` tartalmazza a Reanimated plugint
- [ ] Props-ok megfelelően átadva
- [ ] Navigáció működik (onClose, onNavigateToLibrary)
- [ ] Coins state kezelve
- [ ] AsyncStorage engedélyek rendben (iOS Info.plist)

---

## 📊 FÁJL MÉRET

| Kategória | Sorok |
|-----------|-------|
| Imports | ~50 |
| Types/Interfaces | ~30 |
| Constants | ~40 |
| Animated Components | ~60 |
| Main Component | ~600 |
| Render Methods | ~400 |
| Styles | ~500 |
| **ÖSSZESEN** | **~1,680 sor** |

---

## 🎉 KÉSZ!

Most már van egy **teljes, működő React Native ArenaPage** komponensed! 🚀

**Mi van benne:**
- ✅ Pixel-perfect Figma design
- ✅ Magyar szövegek
- ✅ Animációk (kristályok, Swords)
- ✅ 3 game state (betting, playing, result)
- ✅ AsyncStorage integráció
- ✅ Inline styles (minden StyleSheet-ben)
- ✅ React Native kompatibilis
- ✅ Zero web-specifikus kód

**Következő lépés:**
→ Használd a projektetben, és élvezd! 🎮✨

---

**Készült:** 2025-01-01  
**Verzió:** 1.0.0 (Clean version)  
**Fájl:** `ArenaPage.rn.tsx` (~1,680 sor)
