# LessonsPage - React Native Conversion Guide

## Overview
Lecke választó képernyő - Duolingo stílusú térkép két nézettel.

## Changes from Web Version

### 1. Layout & Styling
- ❌ `display: 'flex'` → ✅ React Native default flexbox
- ❌ `display: 'grid'` → ✅ `gap` property (StyleSheet)
- ❌ `overflowY: 'auto'` → ✅ `ScrollView`
- ❌ `position: 'relative'` with `div` → ✅ `View` with `position: 'relative'`
- ❌ Tailwind classes → ✅ StyleSheet inline objects
- ❌ `linear-gradient` background → ✅ `LinearGradient` component

### 2. Components
- ❌ `<div>` → ✅ `<View>`
- ❌ `<button>` → ✅ `<TouchableOpacity>`
- ❌ `<span>`, `<p>`, `<h1>` → ✅ `<Text>`
- ❌ `motion.div`, `motion.button` → ✅ Remove animations (or use Reanimated)
- ❌ `onMouseEnter`, `onMouseLeave` → ✅ Remove (not needed on mobile)
- ❌ lucide-react → ✅ lucide-react-native

### 3. Data Storage
- ❌ `localStorage.getItem()` → ✅ `AsyncStorage.getItem()` (async)
- ❌ `window.addEventListener('storage')` → ✅ DeviceEventEmitter or custom event system
- ❌ `window.dispatchEvent()` → ✅ DeviceEventEmitter.emit()

### 4. Navigation
- ❌ `setCurrentPage('lessons')` → ✅ `navigation.navigate('Lessons')`
- ❌ `onBack()` callback → ✅ `navigation.goBack()`
- ❌ `onStartLesson()` callback → ✅ `navigation.navigate('LessonGame', { params })`

### 5. Removed Features
- ❌ Motion animations (initial, animate, whileHover)
- ❌ CSS transitions
- ❌ Hover effects (onMouseEnter/onMouseLeave)
- ❌ Debug button (console.log only)
- ❌ Tailwind classes (bg-gradient-to-br, from-amber-600, etc.)

## Key Differences

### Book Selection View
```typescript
// WEB:
<motion.button className="bg-gradient-to-br from-purple-600 to-blue-600">
  <div style={styles.bookCardTop}>...</div>
</motion.button>

// RN:
<TouchableOpacity 
  style={[styles.bookCard, { backgroundColor: book.color }]}
  onPress={() => handleBookSelect(book.title)}
>
  <View style={styles.bookCardTop}>...</View>
</TouchableOpacity>
```

### Lesson Map View
```typescript
// WEB:
<motion.button 
  whileHover={{ x: 8 }}
  style={{ backgroundColor: colors.bg }}
>

// RN:
<TouchableOpacity 
  style={[styles.lessonButton, { backgroundColor: colors.bg }]}
  activeOpacity={0.7}
>
```

### ScrollView
```typescript
// WEB:
<div style={{ overflowY: 'auto', flex: 1 }}>
  {content}
</div>

// RN:
<ScrollView style={styles.lessonContent} contentContainerStyle={styles.lessonScrollContent}>
  {content}
</ScrollView>
```

## Data Import

```typescript
// Import your actual lesson data:
import { penzugyiAlapismeretkLessons } from '../data/penzugyiAlapismeretkLessons';

// Replace mockLessons with actual data:
const bookLessons = penzugyiAlapismeretkLessons;
```

## Navigation Setup

```typescript
// App.tsx (React Navigation Stack)
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

<Stack.Navigator>
  <Stack.Screen name="Main" component={MainScreen} />
  <Stack.Screen name="Lessons" component={LessonsPage} />
  <Stack.Screen name="LessonGame" component={LessonGame} />
</Stack.Navigator>

// LessonsPage.tsx
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Navigate to lesson:
navigation.navigate('LessonGame', {
  bookTitle: selectedBook,
  lessonIndex: pageIndex,
  gameType: gameType,
});
```

## Event Handling

```typescript
// Web: window.addEventListener('lessonCompleted')
// RN: Use DeviceEventEmitter

import { DeviceEventEmitter } from 'react-native';

// Listen:
useEffect(() => {
  const listener = DeviceEventEmitter.addListener('lessonCompleted', handleRefresh);
  return () => listener.remove();
}, []);

// Emit (from LessonGame):
DeviceEventEmitter.emit('lessonCompleted', { bookTitle, lessonIndex, gameType });
```

## Dependencies

```bash
npm install react-native-linear-gradient
npm install @react-native-async-storage/async-storage
npm install lucide-react-native
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

## Testing

1. Test book selection view (empty state + books list)
2. Test progress bar calculations
3. Test lesson map rendering
4. Test lesson status (completed, current, available)
5. Test navigation (back button, book select, lesson select)
6. Test AsyncStorage loading
7. Test event listener (lesson completion)

## Known Limitations

- No animations (removed Motion)
- No hover effects (mobile doesn't need them)
- Mock lesson data (replace with actual import)
- Gradient colors hardcoded (book.color should be hex string, not Tailwind class)

## Color Fix ✅ FIXED!

Web version uses Tailwind classes for book colors:
```typescript
color: 'bg-gradient-to-br from-amber-600 to-orange-700'
```

**SOLUTION:** Convert Tailwind classes to gradients:

### Web Version:
```typescript
const getGradientFromTailwind = (tailwindClass: string): string => {
  const gradientMap: Record<string, string> = {
    'bg-gradient-to-r from-amber-700 to-amber-900': 'linear-gradient(to right, #B45309, #78350F)',
    // ... more mappings
  };
  return gradientMap[tailwindClass] || 'linear-gradient(to right, #7E22CE, #581C87)';
};

// Use in style:
style={{ background: getGradientFromTailwind(book.color) }}
```

### RN Version:
```typescript
const getGradientColors = (tailwindClass: string): string[] => {
  const gradientMap: Record<string, string[]> = {
    'bg-gradient-to-r from-amber-700 to-amber-900': ['#B45309', '#78350F'],
    // ... more mappings
  };
  return gradientMap[tailwindClass] || ['#7E22CE', '#581C87'];
};

// Wrap with LinearGradient:
<LinearGradient colors={getGradientColors(book.color)} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
  <TouchableOpacity>...</TouchableOpacity>
</LinearGradient>
```
