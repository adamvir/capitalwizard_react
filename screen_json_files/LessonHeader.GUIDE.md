# LessonHeader - React Native Conversion Guide

## Overview
Lecke bevezető képernyő (játék előtt) - Információk és "KEZDÉS!" gomb.

## Changes from Web Version

### 1. Layout & Styling
- ❌ `<div>` → ✅ `<View>`
- ❌ `<button>` → ✅ `<TouchableOpacity>` + `<LinearGradient>`
- ❌ `<h1>`, `<span>` → ✅ `<Text>`
- ❌ `backdropFilter: 'blur(16px)'` → ✅ Remove (not supported)
- ❌ Hover effects (onMouseEnter/Leave) → ✅ Remove (not needed)
- ❌ CSS animations (pulse) → ✅ Can add with Animated API (optional)

### 2. Components
- ❌ lucide-react → ✅ lucide-react-native
- ✅ LinearGradient for coin icon
- ✅ LinearGradient for start button

### 3. Navigation
- ❌ `onBack()` callback → ✅ `navigation.goBack()`
- ❌ `onStart()` callback → ✅ Navigate to game (ReadingGame/QuizGame/MatchingGame)

### 4. Removed Features
- ❌ Backdrop blur effect
- ❌ Hover animations on buttons
- ❌ Mouse events
- ❌ Pulse animation on start button

## Key Differences

### Back Button
```typescript
// WEB:
<button 
  onClick={onBack}
  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
>
  <div style={styles.backButtonIcon}>
    <ArrowLeft />
  </div>
  <span>Vissza</span>
</button>

// RN:
<TouchableOpacity style={styles.backButton} onPress={handleBack}>
  <View style={styles.backButtonIcon}>
    <ArrowLeft size={SIZES.iconBase} color={COLORS.white} />
  </View>
  <Text style={styles.backButtonText}>Vissza</Text>
</TouchableOpacity>
```

### Info Cards (Same structure, different components)
```typescript
// WEB:
<div style={styles.infoCard}>
  <div style={styles.infoCardRow}>
    <span style={styles.infoLabel}>Téma:</span>
    <span style={styles.infoValue}>{lesson.theme}</span>
  </div>
</div>

// RN:
<View style={styles.infoCard}>
  <View style={styles.infoCardRow}>
    <Text style={styles.infoLabel}>Téma:</Text>
    <Text style={styles.infoValue}>{lesson.theme}</Text>
  </View>
</View>
```

### Coin Icon (Gradient background)
```typescript
// WEB:
<div style={styles.coinIcon}>
  <Coins style={{ width: SIZES.iconSM, height: SIZES.iconSM, color: '#78350F' }} />
</div>

// RN:
<LinearGradient
  colors={[COLORS.goldLight, COLORS.gold]}
  style={styles.coinIcon}
>
  <Coins size={SIZES.iconSM} color={COLORS.goldDarker} />
</LinearGradient>
```

### Start Button
```typescript
// WEB:
<button 
  style={styles.startButton}
  onClick={onStart}
  onMouseEnter={(e) => { ... }}
  onMouseLeave={(e) => { ... }}
>
  <span style={styles.startButtonText}>KEZDÉS!</span>
</button>

// RN:
<View style={styles.startButtonContainer}>
  <LinearGradient
    colors={[COLORS.success, COLORS.successDark]}
    style={styles.startButton}
  >
    <TouchableOpacity onPress={handleStart} activeOpacity={0.8}>
      <Text style={styles.startButtonText}>KEZDÉS!</Text>
    </TouchableOpacity>
  </LinearGradient>
</View>
```

## Game Details Logic

### getGameDetails() function (same logic)
```typescript
const getGameDetails = (): GameDetails => {
  switch (gameType) {
    case 'reading':
      return {
        theme: 'Pénzügyi Alapismeretek',
        difficulty: 'Könnyű',
        name: 'Olvasás',
        difficultyColor: COLORS.difficultyEasy, // Green
      };
    case 'matching':
      return {
        theme: 'Pénzügyi Alapismeretek',
        difficulty: 'Közepes',
        name: 'Párosítás',
        difficultyColor: COLORS.difficultyMedium, // Cyan
      };
    case 'quiz':
      return {
        theme: 'Pénzügyi Alapismeretek',
        difficulty: 'Nehéz',
        name: 'Kvíz',
        difficultyColor: COLORS.difficultyHard, // Red
      };
    default:
      return {
        theme: 'Pénzügyi Alapismeretek',
        difficulty: 'Könnyű',
        name: 'Olvasás',
        difficultyColor: COLORS.difficultyEasy,
      };
  }
};
```

### Round Text
```typescript
const roundText = isFirstRound ? '1. kör' : '2. kör';
```

## Navigation Setup

```typescript
// App.tsx (React Navigation Stack)
<Stack.Screen 
  name="LessonHeader" 
  component={LessonHeader}
  options={{ headerShown: false }}
/>

// LessonsPage.tsx (or wherever you navigate from)
navigation.navigate('LessonHeader', {
  lessonNumber: 1,
  gameType: 'reading', // or 'matching' or 'quiz'
  isFirstRound: true,
});

// LessonHeader.tsx
const navigation = useNavigation();
const route = useRoute();
const { lessonNumber, gameType, isFirstRound } = route.params;

// On back:
const handleBack = () => {
  navigation.goBack();
};

// On start:
const handleStart = () => {
  // Navigate to appropriate game based on gameType
  switch (gameType) {
    case 'reading':
      navigation.navigate('ReadingGame', { lessonNumber, lessonData });
      break;
    case 'matching':
      navigation.navigate('LessonGame', { lessonNumber, lessonData });
      break;
    case 'quiz':
      navigation.navigate('QuizGame', { lessonNumber, lessonData });
      break;
  }
};
```

## Info Cards Structure

The component displays 5 info cards in order:

1. **Téma** (Theme): Always "Pénzügyi Alapismeretek"
2. **Kör** (Round): "1. kör" or "2. kör"
3. **Nehézség** (Difficulty): 
   - Reading: "Könnyű" (green)
   - Matching: "Közepes" (cyan)
   - Quiz: "Nehéz" (red)
4. **Neve** (Name): 
   - Reading: "Olvasás"
   - Matching: "Párosítás"
   - Quiz: "Kvíz"
5. **Jutalom** (Reward): Always "150" + coin icon

## Difficulty Colors

```typescript
const COLORS = {
  difficultyEasy: '#4ADE80',   // Green (Reading)
  difficultyMedium: '#22D3EE', // Cyan (Matching)
  difficultyHard: '#F87171',   // Red (Quiz)
};
```

## Testing Checklist

1. ✅ Back button navigates correctly
2. ✅ Lesson number displays correctly
3. ✅ Info cards render all 5 items
4. ✅ Difficulty color changes based on gameType
5. ✅ Round text shows "1. kör" or "2. kör"
6. ✅ Game name matches gameType
7. ✅ Coin icon gradient renders
8. ✅ Start button navigates to correct game
9. ✅ Start button gradient renders
10. ✅ All text is properly styled

## Props Reference

```typescript
interface LessonHeaderProps {
  onBack?: () => void;          // Callback for back button
  onStart?: () => void;         // Callback for start button
  lessonNumber?: number;        // Lesson number (default: 1)
  gameType?: 'reading' | 'matching' | 'quiz'; // Game type (default: 'reading')
  isFirstRound?: boolean;       // First or second round (default: true)
}
```

## Dependencies

```bash
npm install react-native-linear-gradient
npm install lucide-react-native
npm install @react-navigation/native
npm install @react-navigation/native-stack
```

## Known Limitations

- No backdrop blur (not supported in RN)
- No hover effects (mobile doesn't need them)
- No pulse animation on start button (can add with Animated API)

## Future Enhancements

### Add Pulse Animation to Start Button

```typescript
import { Animated, Easing } from 'react-native';

const pulseAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);

// Apply to start button:
<Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
  <LinearGradient ...>
    <TouchableOpacity>
      <Text>KEZDÉS!</Text>
    </TouchableOpacity>
  </LinearGradient>
</Animated.View>
```

### Add Sound Effect on Start

```typescript
import Sound from 'react-native-sound';

const startSound = new Sound('start.mp3', Sound.MAIN_BUNDLE);

const handleStart = () => {
  startSound.play();
  // ... navigate to game
};
```

## Integration Example

```typescript
// Complete navigation flow:

// 1. LessonsPage → LessonHeader
<TouchableOpacity onPress={() => {
  navigation.navigate('LessonHeader', {
    lessonNumber: 1,
    gameType: 'reading',
    isFirstRound: true,
  });
}}>
  <Text>Start Lesson 1</Text>
</TouchableOpacity>

// 2. LessonHeader → ReadingGame/QuizGame/LessonGame
const handleStart = () => {
  switch (gameType) {
    case 'reading':
      navigation.navigate('ReadingGame', {
        lessonNumber,
        lessonData: penzugyiAlapismeretkLessons[lessonNumber - 1],
      });
      break;
    case 'matching':
      navigation.navigate('LessonGame', {
        lessonNumber,
        lessonData: penzugyiAlapismeretkLessons[lessonNumber - 1],
      });
      break;
    case 'quiz':
      navigation.navigate('QuizGame', {
        lessonNumber,
        lessonData: penzugyiAlapismeretkLessons[lessonNumber - 1],
      });
      break;
  }
};

// 3. Game completes → Go back to LessonsPage
const handleGameComplete = () => {
  navigation.navigate('LessonsPage', {
    lessonCompleted: lessonNumber,
  });
};
```

## Styling Notes

- **Start button width**: 50% (centered with marginLeft/Right auto)
- **Start button margin-top**: 44px (spacing from info cards)
- **Font family**: Georgia for start button (serif style)
- **Letter spacing**: 2 (0.1em equivalent) for start button
- **Card gap**: SPACING.md (12px)
- **Shadow**: elevation: 6 on start button

## Color Reference

```typescript
const COLORS = {
  slate800: '#1E293B',       // Card backgrounds
  slate600: '#475569',       // Card borders
  slate300: '#CBD5E1',       // Label text
  white: '#FFFFFF',          // Value text
  success: '#10B981',        // Start button gradient start
  successDark: '#059669',    // Start button gradient end
  goldLight: '#FDE047',      // Coin gradient start
  gold: '#EAB308',           // Coin gradient end
  goldDarker: '#78350F',     // Coin icon color
};
```
