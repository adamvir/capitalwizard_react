# ✨ ProgressAnimation - React Native Útmutató

**"Továbbhaladás" button with animated sparkles**

---

## 🚀 GYORS HASZNÁLAT

```bash
npm install react-native-linear-gradient lucide-react-native
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

- **Lesson number** (gradient text)
- **Game type label** ("Olvasás", "Párosítás", "Kvíz")
- **Progress bar** (0%, 33%, 66% based on game type)
- **Animated sparkles** (3× Sparkles icons)
- **Glow effect** (purple blur)

---

## 🎯 PROPS

```tsx
interface ProgressAnimationProps {
  onClick?: () => void;                       // Továbbhaladás callback
  currentBookLessonIndex?: number;            // Lecke index (0-based)
  currentGameType?: 'reading' | 'matching' | 'quiz';  // Játék típus
  isFirstRound?: boolean;                     // Első kör? (placeholder)
}
```

---

## ✨ ANIMATIONS

**Sparkles (Animated API):**
- 3 sparkles (különböző méret & pozíció)
- Fade in/out loop (2s)
- Staggered start (0ms, 500ms, 1000ms)

---

## 📊 STATISZTIKÁK

| Metric | Érték |
|--------|-------|
| **Sor** | ~400 |
| **Props** | 4 |
| **Animations** | 3 (sparkles) |
| **Gradients** | 2 |
| **Konverzió** | 6 perc |

---

**Készült:** 2025-01-01 | **Fájl:** `ProgressAnimation.rn.tsx` (~400 sor)
