# 📱 ProgressAnimation - React Native (MOTI) Migration Guide

## 🎯 PROBLÉMA

A React Native `Animated` API **túl limitált** a web verzió gazdag animációihoz képest:

| Feature | Web (Motion) | RN Animated | RN Moti |
|---------|--------------|-------------|---------|
| Loop animations | ✅ | ⚠️ Bonyolult | ✅ |
| Sequence animations | ✅ | ⚠️ Verbose | ✅ |
| Scale/Rotate/Opacity | ✅ | ✅ | ✅ |
| Declarative API | ✅ | ❌ | ✅ |
| Motion-like syntax | ✅ | ❌ | ✅ |

## ✅ MEGOLDÁS: MOTI

**Moti** = Motion for React Native
- Motion-szerű deklaratív API
- Ugyanaz a syntax mint a web-en
- Reanimated 2/3 alapokon
- Smooth, 60 FPS animációk

---

## 📦 TELEPÍTÉS

### 1. Telepítsd a függőségeket:

```bash
npm install moti
npm install react-native-reanimated
npm install react-native-linear-gradient
npm install lucide-react-native
npm install @react-native-async-storage/async-storage
```

### 2. iOS setup (ha iOS-t használsz):

```bash
cd ios && pod install && cd ..
```

### 3. Babel config frissítés:

**babel.config.js:**
```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'], // Ez KELL!
};
```

⚠️ **FONTOS:** A `react-native-reanimated/plugin`-nak **utolsónak** kell lennie a plugins tömbben!

### 4. Tisztítsd meg a cache-t:

```bash
# Metro bundler cache törlése
npx react-native start --reset-cache

# Android build cache törlése
cd android && ./gradlew clean && cd ..

# iOS build cache törlése
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

---

## 🚀 HASZNÁLAT

### 1. Másold át a fájlt:

```bash
cp exports/ProgressAnimation.rn.MOTI.tsx src/components/ProgressAnimation.tsx
```

### 2. Import és használat:

```tsx
import { ProgressAnimation } from './components/ProgressAnimation';

function MainScreen() {
  const [currentBookLessonIndex, setCurrentBookLessonIndex] = useState(0);
  const [currentGameType, setCurrentGameType] = useState<'reading' | 'matching' | 'quiz'>('reading');
  const [isFirstRound, setIsFirstRound] = useState(true);

  const handleProgressClick = () => {
    console.log('Navigating to next lesson...');
    // Navigate to lessons page
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Your main content */}
      
      <ProgressAnimation
        onClick={handleProgressClick}
        currentBookLessonIndex={currentBookLessonIndex}
        currentGameType={currentGameType}
        isFirstRound={isFirstRound}
      />
    </View>
  );
}
```

---

## 🎨 ANIMÁCIÓK

### Web (Motion) → React Native (Moti) KONVERZIÓ:

#### ✅ 1. Scale + Fade In:

**WEB:**
```tsx
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.6 }}
>
```

**REACT NATIVE (MOTI):**
```tsx
<MotiView
  from={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: 'timing', duration: 600 }}
>
```

#### ✅ 2. Loop Animation:

**WEB:**
```tsx
<motion.div
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ duration: 2, repeat: Infinity }}
>
```

**REACT NATIVE (MOTI):**
```tsx
<MotiView
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ type: 'timing', duration: 2000, loop: true }}
>
```

#### ✅ 3. Staggered Animations:

**WEB:**
```tsx
{items.map((_, i) => (
  <motion.div
    key={i}
    animate={{ opacity: [0, 1, 0] }}
    transition={{ delay: i * 0.25, repeat: Infinity }}
  />
))}
```

**REACT NATIVE (MOTI):**
```tsx
{items.map((_, i) => (
  <MotiView
    key={i}
    animate={{ opacity: [0, 1, 0] }}
    transition={{ type: 'timing', delay: i * 250, loop: true }}
  />
))}
```

---

## 🎯 KOMPONENS PROPS

```tsx
interface ProgressAnimationProps {
  onClick?: () => void;                     // Klikk callback
  currentBookLessonIndex?: number;          // 0-based könyv lecke index
  currentGameType?: 'reading' | 'matching' | 'quiz';  // Játék típusa
  isFirstRound?: boolean;                   // Első kör (true) vagy második (false)
}
```

### Példa prop értékek:

```tsx
// 1. lecke - Olvasás játék (First round):
<ProgressAnimation
  currentBookLessonIndex={0}
  currentGameType="reading"
  isFirstRound={true}
/>
// → Megjelenítés: "1. Lecke következik"

// 2. lecke - Párosítás játék (First round):
<ProgressAnimation
  currentBookLessonIndex={0}
  currentGameType="matching"
  isFirstRound={true}
/>
// → Megjelenítés: "2. Lecke következik"

// 4. lecke - Kvíz játék (First round):
<ProgressAnimation
  currentBookLessonIndex={1}
  currentGameType="quiz"
  isFirstRound={true}
/>
// → Megjelenítés: "6. Lecke következik"

// Second round lesson:
<ProgressAnimation
  currentBookLessonIndex={2}
  currentGameType="reading"
  isFirstRound={false}
/>
// → Megjelenítés: "21. Lecke következik" (18 + 2 + 1)
```

---

## 🔍 LECKE SZÁM SZÁMÍTÁS

```tsx
const lessonNumber = isFirstRound
  ? currentBookLessonIndex * 3 + (currentGameType === 'reading' ? 1 : currentGameType === 'matching' ? 2 : 3)
  : TOTAL_LESSONS + currentBookLessonIndex + 1;
```

**Példa számítások (6 book lesson × 3 game type = 18 total):**

| Book Index | Game Type | Is First Round | Lecke szám |
|-----------|-----------|----------------|------------|
| 0 | reading | true | 1 |
| 0 | matching | true | 2 |
| 0 | quiz | true | 3 |
| 1 | reading | true | 4 |
| 1 | matching | true | 5 |
| 1 | quiz | true | 6 |
| ... | ... | ... | ... |
| 5 | quiz | true | 18 |
| 0 | reading | false | 19 |
| 1 | reading | false | 20 |

---

## 🎨 VIZUÁLIS ELEMEK

### 1. **Sparkles (8 db kör alakban):**
- Rotate + scale + fade animáció
- Delay: i * 250ms
- Loop: végtelen
- Pozíció: 120px sugárban kör mentén

### 2. **Main text:**
- Scale in animáció (0 → 1)
- Breathing effect (1 → 1.1 → 1)
- Gradient text: `#FDE047` → `#D8B4FE` → `#F9A8D4`
- Purple glow effect

### 3. **Progress bar:**
- Width expand (0 → 200px)
- Fill animation (0% → 100%)
- Gradient fill: `#FDE047` → `#C084FC` → `#F9A8D4`

### 4. **Floating particles (12 db):**
- Random position
- Float up + fade + scale animation
- 3 szín rotáció: gold, purple, pink

---

## 🐛 TROUBLESHOOTING

### ❌ **"Reanimated plugin not found"**

**Probléma:** Babel config nincs megfelelően beállítva.

**Megoldás:**
```javascript
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Ez UTOLSÓ kell legyen!
  ],
};
```

Majd:
```bash
npx react-native start --reset-cache
```

---

### ❌ **LinearGradient nem működik**

**Probléma:** iOS/Android native module nincs linkelve.

**Megoldás:**

**iOS:**
```bash
cd ios && pod install && cd ..
```

**Android:**
A React Native 0.60+ auto-link, de ha nem működik:
```
npx react-native link react-native-linear-gradient
```

---

### ❌ **"Cannot read property 'Value' of undefined"**

**Probléma:** Reanimated nem megfelelően inicializálva.

**Megoldás:**

1. App újraindítása:
```bash
# Kill metro bundler
pkill -f metro

# Restart
npx react-native start --reset-cache
```

2. Native build újraépítése:
```bash
# iOS
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# Android
cd android && ./gradlew clean && cd ..
```

---

### ❌ **Animációk lassúak/szakadoznak**

**Probléma:** `useNativeDriver: false` vagy performance issue.

**Megoldás:**

Moti **automatikusan** native driver-t használ, de ellenőrizd:
- Ne használj sokat nagy képet/blur effect-et
- Ne animálj layout property-ket (width, height) ha lehet
- Használj transform-okat (scale, translateX/Y)

**Jó:**
```tsx
<MotiView animate={{ scale: 1.1 }} /> // ✅ Native driver
```

**Kerülendő:**
```tsx
<MotiView animate={{ width: 200 }} /> // ⚠️ JS thread
```

---

## 📊 ÖSSZEHASONLÍTÁS

| Feature | Animated API | Moti | Motion (web) |
|---------|--------------|------|--------------|
| **API stílus** | Imperative | Declarative | Declarative |
| **Syntax** | `Animated.timing()` | `animate={{ }}` | `animate={{ }}` |
| **Loop** | `Animated.loop()` | `loop: true` | `repeat: Infinity` |
| **Delay** | `Animated.delay()` | `delay: 250` | `delay: 0.25` |
| **Duration** | ms (2000) | ms (2000) | s (2) |
| **Native driver** | Manual | Auto | N/A |
| **Performance** | ⚡⚡⚡ | ⚡⚡⚡ | ⚡⚡⚡ |
| **Learning curve** | 🔴 Hard | 🟢 Easy | 🟢 Easy |

---

## ✅ CHECKLIST

- [ ] `moti` telepítve
- [ ] `react-native-reanimated` telepítve
- [ ] `react-native-linear-gradient` telepítve
- [ ] `lucide-react-native` telepítve
- [ ] Babel config frissítve (reanimated plugin hozzáadva)
- [ ] Metro cache törölve
- [ ] iOS pods telepítve (ha iOS)
- [ ] Android gradle clean (ha Android)
- [ ] AsyncStorage működik (rentedBooks check)
- [ ] Animációk smooth-ok (60 FPS)
- [ ] Gradient text megjelenik
- [ ] Sparkles forognak/pulzálnak
- [ ] Progress bar animálódik

---

## 📚 TOVÁBBI FORRÁSOK

- **Moti docs:** https://moti.fyi
- **Reanimated docs:** https://docs.swmansion.com/react-native-reanimated/
- **Motion docs (referencia):** https://motion.dev

---

## 🎉 EREDMÉNY

✅ **Azonos vizuális megjelenés** mint a web verzió
✅ **Smooth animációk** (60 FPS)
✅ **Motion-szerű API**
✅ **Könnyű karbantartás**

**Migrációs idő:** 30-45 perc (telepítéssel együtt)
