# Animation Components

Ez a könyvtár tartalmazza az összes React Native animációs komponenst a játék és haladási rendszerhez.

## Komponensek

### 1. ProgressAnimation
**Fájl:** `ProgressAnimation.tsx`

**Cél:** XP növekedés vizualizáció circular progress bar-ral és sparkles animációval.

**Props:**
- `onClick?: () => void` - Callback amikor a felhasználó rákattint
- `currentBookLessonIndex?: number` - Aktuális könyv lecke index
- `currentGameType?: 'reading' | 'matching' | 'quiz'` - Játék típusa
- `isFirstRound?: boolean` - Első vagy második kör

**Használat:**
```tsx
import { ProgressAnimation } from '@/components/animations';

<ProgressAnimation
  onClick={() => navigateToNextLesson()}
  currentBookLessonIndex={2}
  currentGameType="reading"
  isFirstRound={true}
/>
```

**Animációk:**
- Scale pulse animation (1 → 1.1 → 1)
- 8 sparkles rotating in circle (360° continuous)
- Circular progress bar (0% → 100%)
- Floating particles (12 db, random colors)
- Glow effect opacity animation

**Speciális működés:**
- Ellenőrzi AsyncStorage-ben a kölcsönzött könyveket
- Ha nincs könyv, "Nincs kölcsönzött tankönyv" üzenetet mutat

---

### 2. LevelUpCelebration
**Fájl:** `LevelUpCelebration.tsx`

**Cél:** Konfetti animációval kísért szint növekedés ünneplés.

**Props:**
- `newLevel: number` - Új elért szint száma
- `onContinue: () => void` - Callback a Tovább gombra

**Használat:**
```tsx
import { LevelUpCelebration } from '@/components/animations';

<LevelUpCelebration
  newLevel={5}
  onContinue={() => handleLevelUpComplete()}
/>
```

**Animációk:**
- Trophy icon: zoom in + rotate spring animation
- 4 orbiting stars around trophy (360° continuous)
- 30 confetti pieces falling with random rotation
- 20 floating particles (up-down movement)
- 12 sparkles with scale + rotate + opacity
- Text fade in from bottom
- Button glow effect on hover

**Színek:**
- Trophy: Gold gradient (#FDE047 → #FBBF24 → #EAB308)
- Confetti: 5 szín (#fbbf24, #a855f7, #ec4899, #3b82f6, #10b981)
- Background: Purple gradient overlay

---

### 3. StreakCelebration
**Fájl:** `StreakCelebration.tsx`

**Cél:** Tűz láng animáció napi sorozat (streak) növekedéshez.

**Props:**
- `newStreak: number` - Új streak érték
- `onContinue: () => void` - Callback a Tovább gombra

**Használat:**
```tsx
import { StreakCelebration } from '@/components/animations';

<StreakCelebration
  newStreak={7}
  onContinue={() => handleStreakComplete()}
/>
```

**Animációk:**
- Fire emoji: scale + rotate spring animation (0 → 1.2 → 1)
- Streak counter: counting animation (0 → newStreak)
  - Sebesség: 1-5 nap: 50ms/step, 6-20 nap: 40ms/step, 21+ nap: 30ms/step
- Streak badge: scale pulse amikor eléri a végső értéket
- 20 floating fire particles (bottom → top, continuous)
- Glow effect: scale + opacity pulse
- Message fade in after counter reaches target
- Button fade in after counter reaches target

**Színek:**
- Fire/Streak: Orange-red gradient (#F97316 → #EF4444)
- Flame icons: #F97316
- Background: Dark with brown overlay

**Speciális működés:**
- Késlelteti a számláló animációt 800ms-mal
- Csak akkor mutatja az üzenetet és gombot, ha a számláló elérte a célszámot

---

## Animációs Rendszer

Minden komponens **react-native-reanimated**-t használ 60fps smooth animációkhoz.

### Használt animáció típusok:

1. **withTiming** - Időzített animációk (fade, slide, scale)
2. **withSpring** - Spring-alapú fizikai animációk (bounce effect)
3. **withSequence** - Egymás utáni animációk láncolása
4. **withRepeat** - Végtelen loop animációk
5. **withDelay** - Késleltetett animációk
6. **FadeIn/FadeInDown/ZoomIn/SlideInUp** - Entering animációk

### Shared Values:
- `useSharedValue` - Animálható értékek
- `useAnimatedStyle` - Dinamikus style objektumok
- `useAnimatedProps` - SVG animációk (circular progress)

### Performance:
- Minden animáció a UI thread-en fut (60fps)
- Lazy loading particle komponensek
- Optimalizált re-render elkerülése

---

## Icon Mapping (Lucide → MaterialCommunityIcons)

| Web (Lucide) | React Native | Név |
|--------------|--------------|-----|
| Sparkles | sparkles | MaterialCommunityIcons |
| Trophy | trophy | MaterialCommunityIcons |
| Star | star | MaterialCommunityIcons |
| Flame | fire | MaterialCommunityIcons |
| BookOpen | book-open-variant | MaterialCommunityIcons |
| Coins | cash-multiple | MaterialCommunityIcons |
| ChevronRight | chevron-right | MaterialCommunityIcons |

---

## Konverziós Jegyzetek

### CSS → React Native StyleSheet
```tsx
// Web
background: 'linear-gradient(to right, #10B981, #059669)'

// React Native
<LinearGradient
  colors={['#10B981', '#059669']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
>
```

### motion/react → react-native-reanimated
```tsx
// Web
<motion.div
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ duration: 2, repeat: Infinity }}
/>

// React Native
const scale = useSharedValue(1);
scale.value = withRepeat(
  withSequence(
    withTiming(1.1, { duration: 1000 }),
    withTiming(1, { duration: 1000 })
  ),
  -1,
  false
);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }]
}));

<Animated.View style={animatedStyle} />
```

---

## Tesztelés

```bash
# Start the app
npm start

# Test individual components
# Navigate to screens that trigger these animations:
# - ProgressAnimation: After completing a game
# - LevelUpCelebration: After gaining enough XP for level up
# - StreakCelebration: Daily login bonus
```

---

## TODO / Fejlesztési Lehetőségek

- [ ] Haptic feedback hozzáadása (expo-haptics)
- [ ] Sound effects (expo-av)
- [ ] Particle system optimalizálás nagyobb screen-ekre
- [ ] Custom confetti shapes (triangles, circles, squares)
- [ ] Accessibility improvements (screen reader support)
