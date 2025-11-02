# ⚠️ DEPRECATED - HASZNÁLD A MOTI VERZIÓT!

**Ez a verzió Animated API-t használ → LIMITÁLT animációk!**

👉 **ÚJ MOTI VERZIÓ:**
- Fájl: `ProgressAnimation.rn.MOTI.tsx`
- Guide: `ProgressAnimation.MOTI.GUIDE.md`
- **Miért jobb:** Motion-szerű API, gazdagabb animációk, könnyebb maintenance

---

# ✨ ProgressAnimation - React Native Útmutató (DEPRECATED)

**\"Továbbhaladás\" button with animated sparkles + No Book State**

---

## 🚀 GYORS HASZNÁLAT

```bash
npm install react-native-linear-gradient lucide-react-native
npm install @react-native-async-storage/async-storage
cd ios && pod install && cd ..
cp exports/ProgressAnimation.rn.tsx src/components/ProgressAnimation.tsx
```

```tsx
<ProgressAnimation
  onClick={() => handleNextLesson()}
  currentBookLessonIndex={10}      // 0-based
  currentGameType="reading"        // 'reading' | 'matching' | 'quiz'
  isFirstRound={true}
/>
```

---

## 📋 ELEMEK

### **Has Book State:**
- **"Tovább haladás"** label
- **Lesson number** (gradient text: "X. Lecke")
- **"következik"** bottom label
- **Progress bar** (0%, 50%, 100% based on game type)
- **Animated sparkles** (3× Sparkles icons)
- **Glow effect** (purple blur)

### **No Book State:**
- **BookOpen icon** (64px, amber)
- **"Nincs kölcsönzött"** text
- **"tankönyv"** (gradient text, amber/yellow)
- **"Kölcsönözz ki könyvet a könyvtárból!"** subtitle
- **Glow effect** (amber blur)

---

## 🎯 PROPS

```tsx
interface ProgressAnimationProps {
  onClick?: () => void;                       // Továbbhaladás callback
  currentBookLessonIndex?: number;            // Lecke index (0-based)
  currentGameType?: 'reading' | 'matching' | 'quiz';  // Játék típus
  isFirstRound?: boolean;                     // Első kör?
}
```

---

## 🔄 RENTED BOOK DETECTION

**AsyncStorage check:**
```tsx
useEffect(() => {
  const checkRentedBooks = async () => {
    const saved = await AsyncStorage.getItem('rentedBooks');
    if (saved) {
      const rentedBooks = JSON.parse(saved);
      const hasPenzugyiBook = rentedBooks.some(
        (book) =>
          book.title === 'Pénzügyi Alapismeretek' &&
          book.rentedUntil > Date.now()
      );
      setHasRentedBook(hasPenzugyiBook);
    }
  };

  checkRentedBooks();
  const interval = setInterval(checkRentedBooks, 3000); // Poll every 3s
  return () => clearInterval(interval);
}, []);
```

**States:**
- `hasRentedBook === false` → Show "Nincs kölcsönzött tankönyv"
- `hasRentedBook === true` → Show "X. Lecke következik"

---

## ✨ ANIMATIONS

**Sparkles (Animated API):**
- 3 sparkles (különböző méret & pozíció)
- Fade in/out loop (2s)
- Staggered start (0ms, 500ms, 1000ms)

---

## 📊 LESSON NUMBER CALCULATION

### **First Round:**
```tsx
lessonNumber = currentBookLessonIndex * 3 +
  (currentGameType === 'reading' ? 1 :
   currentGameType === 'matching' ? 2 : 3)
```

**Example:**
- Page 0, reading → Lesson 1
- Page 0, matching → Lesson 2
- Page 0, quiz → Lesson 3
- Page 1, reading → Lesson 4
- ...
- Page 10, reading → Lesson 31

### **Second Round:**
```tsx
lessonNumber = 60 * 3 + currentBookLessonIndex + 1
```

**Example:**
- Page 0 → Lesson 181
- Page 1 → Lesson 182
- ...

---

## 🎨 DESIGN TOKENS

### **No Book State:**
```tsx
// Glow
backgroundColor: 'rgba(245, 158, 11, 0.3)'  // Amber

// Icon
<BookOpen size={64} color="#FBBF24" />

// Text colors
noBookTitle: white (opacity 0.9)
noBookGradientText: white (gradient: #FCD34D, #FDE047, #FDBA74)
noBookSubtitle: white (opacity 0.75)
```

### **Has Book State:**
```tsx
// Glow
backgroundColor: 'rgba(168, 85, 247, 0.5)'  // Purple

// Gradient text
colors: ['#FDE047', '#D8B4FE', '#F9A8D4']  // Yellow → Purple → Pink

// Progress bar
colors: ['#FDE047', '#C084FC', '#F9A8D4']  // Yellow → Purple → Pink
```

---

## 🔧 TESTRESZABÁS

### **1. Change polling interval:**
```tsx
const interval = setInterval(checkRentedBooks, 5000); // 5 seconds instead of 3
```

### **2. Change book title to check:**
```tsx
const hasPenzugyiBook = rentedBooks.some(
  (book) =>
    book.title === 'Your Book Title' &&  // ← Change this
    book.rentedUntil > Date.now()
);
```

### **3. Change progress percentages:**
```tsx
const progressPercentage =
  currentGameType === 'reading' ? 0 :
  currentGameType === 'matching' ? 50 :  // ← 33 → 50
  100;  // ← 66 → 100
```

### **4. Add haptic feedback (iOS/Android):**
```bash
npm install react-native-haptic-feedback
```

```tsx
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const handleClick = () => {
  ReactNativeHapticFeedback.trigger('impactLight');
  onClick?.();
};
```

---

## 🐛 HIBAKERESÉS

### **1. AsyncStorage not working:**
```bash
# Install
npm install @react-native-async-storage/async-storage

# iOS
cd ios && pod install && cd ..

# Check imports
import AsyncStorage from '@react-native-async-storage/async-storage';
```

### **2. Book state not updating:**
```tsx
// Check AsyncStorage data
AsyncStorage.getItem('rentedBooks').then(console.log);

// Check polling interval
console.log('Checking books...', Date.now());
```

### **3. LinearGradient not rendering:**
```bash
# Install
npm install react-native-linear-gradient

# iOS
cd ios && pod install && cd ..

# Android: Add to android/settings.gradle
include ':react-native-linear-gradient'
project(':react-native-linear-gradient').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-linear-gradient/android')
```

### **4. Sparkles not animating:**
```tsx
// Check that animations start
useEffect(() => {
  console.log('Starting animations...');
  Animated.parallel(animations).start();
}, []);
```

---

## 📊 STATISZTIKÁK

| Metric | Érték |
|--------|-------|
| **Sor** | ~450 |
| **Props** | 4 |
| **States** | 2 (no book / has book) |
| **Animations** | 3 (sparkles) |
| **Gradients** | 3 (glow + text + progress) |
| **Dependencies** | 3 (linear-gradient, lucide, async-storage) |
| **Polling interval** | 3 seconds |
| **Konverzió** | 8 perc |

---

## ✅ KONVERZIÓS CHECKLIST

- [x] ProgressAnimation.rn.tsx létrehozva
- [x] AsyncStorage integration (book detection)
- [x] No book state ("Nincs kölcsönzött tankönyv")
- [x] Has book state ("X. Lecke következik")
- [x] Sparkles animations (3× particles)
- [x] Progress bar (0%, 50%, 100%)
- [x] Lesson number calculation (first/second round)
- [x] Glow effects (amber/purple)
- [x] Gradient text (yellow → purple → pink)
- [x] Polling (check books every 3s)
- [x] TouchableOpacity (click handler)
- [x] Inline styles → StyleSheet
- [x] BookOpen icon (lucide)
- [x] Kommentek hozzáadva

---

## 🎉 KÉSZ!

Most már van egy **teljes ProgressAnimation React Native** komponensed!

**Mit kaptál:**
- ✅ "Nincs kölcsönzött tankönyv" state
- ✅ "X. Lecke következik" state
- ✅ AsyncStorage book detection
- ✅ 3-second polling (automatic updates)
- ✅ Animated sparkles (3× particles)
- ✅ Progress bar (0%, 50%, 100%)
- ✅ Beautiful gradients (amber/purple/pink)
- ✅ iOS + Android support

**Következő lépés:**
1. Másold be a komponenst
2. Telepítsd a függőségeket
3. iOS: pod install
4. Használd! ✨

**Opcionális fejlesztések:**
- Add hozzá a haptic feedback-et
- Implementálj manual refresh-t (pull-to-refresh)
- Add hozzá a loading state-t
- Customizáld a book title-t
- Add hozzá a debug mode-ot

---

**Készült:** 2025-01-01  
**Verzió:** 2.0.0 (+ Book Detection)  
**Fájl:** `ProgressAnimation.rn.tsx` (~450 sor)  
**Komplexitás:** Közepes (AsyncStorage + polling + animations)
