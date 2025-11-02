# ReadingGame - React Native Conversion Guide

## Overview
Olvasás játék (1/3 lecke típus) - 3 állapot: reading → questions → result

## Changes from Web Version

### 1. Layout & Styling
- ❌ `<div>` → ✅ `<View>`
- ❌ `<button>` → ✅ `<TouchableOpacity>` + `<LinearGradient>`
- ❌ `<input>` → ✅ `<TextInput>`
- ❌ `overflowY: 'auto'` → ✅ `<ScrollView>`
- ❌ `backdropFilter: 'blur(12px)'` → ✅ Remove (not supported)
- ❌ Hover effects (onMouseEnter/Leave) → ✅ Remove (not needed)
- ❌ CSS transitions → ✅ Use `activeOpacity` on TouchableOpacity

### 2. Components
- ❌ `<h2>`, `<p>`, `<span>` → ✅ `<Text>`
- ❌ `<label>` → ✅ `<Text>` (no label component in RN)
- ❌ lucide-react → ✅ lucide-react-native

### 3. Keyboard Handling
- ✅ `KeyboardAvoidingView` wrapper (iOS behavior)
- ✅ `keyboardVerticalOffset` for proper spacing
- ✅ `Platform.OS` check for iOS/Android differences

### 4. Navigation
- ❌ `onBackToHome()` callback → ✅ `navigation.goBack()`
- ❌ `onWin()` callback → ✅ Pass completion data or navigate

### 5. Removed Features
- ❌ Backdrop blur effect
- ❌ Hover animations
- ❌ Mouse events
- ❌ CSS box-shadow animations
- ❌ Pulse animation on win button

## Key Differences

### Reading State
```typescript
// WEB:
<div style={{ overflowY: 'auto' }}>
  {readingContent.split('\n\n').map(p => <p>{p}</p>)}
</div>
<button onClick={handleReadComplete}>Elolvastam</button>

// RN:
<ScrollView>
  {readingContent.split('\n\n').map(p => <Text>{p}</Text>)}
</ScrollView>
<LinearGradient colors={[...]} style={styles.primaryButton}>
  <TouchableOpacity onPress={handleReadComplete}>
    <Text>Elolvastam</Text>
  </TouchableOpacity>
</LinearGradient>
```

### Questions State
```typescript
// WEB:
<input
  type="text"
  value={answers[index]}
  onChange={(e) => setAnswers(...)}
  onFocus={(e) => e.currentTarget.style.borderColor = ...}
/>

// RN:
<TextInput
  value={answers[index]}
  onChangeText={(value) => handleAnswerChange(index, value)}
  style={styles.questionInput}
  placeholder="Válaszod..."
  placeholderTextColor={COLORS.gray500}
/>
```

### Result State
```typescript
// WEB:
<button 
  onClick={handleFinish}
  onMouseEnter={(e) => { ... }}
  style={{ animation: 'pulse 2s infinite' }}
>
  GYŐZELEM!
</button>

// RN:
<LinearGradient colors={[COLORS.success, COLORS.successDark]}>
  <TouchableOpacity onPress={handleFinish} activeOpacity={0.8}>
    <Text>GYŐZELEM!</Text>
  </TouchableOpacity>
</LinearGradient>
```

## Game Logic

### Answer Checking
```typescript
const checkAnswer = (userAnswer: string, question: Question): boolean => {
  const normalized = userAnswer.toLowerCase().trim();
  return question.keywords.some(keyword => 
    normalized.includes(keyword.toLowerCase())
  );
};
```

### Win Condition
- 80% correct answers required
- `Math.ceil(selectedQuestions.length * 0.8)` minimum

### States Flow
1. **reading**: Display text → "Elolvastam" button → questions
2. **questions**: Answer inputs → "Ellenőrzés" button → result
3. **result**: 
   - Score >= 80%: "GYŐZELEM!" button → onWin()
   - Score < 80%: "Próbáld újra" button → questions

## Data Structure

```typescript
interface Lesson {
  id: string;
  pageNumber: number;
  reading: {
    title: string;
    content: string; // "\n\n" separated paragraphs
    questions: Array<{
      question: string;
      answer: string;
      keywords: string[]; // For flexible answer matching
    }>;
  };
}
```

## Navigation Setup

```typescript
// App.tsx (React Navigation Stack)
<Stack.Screen 
  name="ReadingGame" 
  component={ReadingGame}
  options={{ headerShown: false }}
/>

// LessonGame.tsx (or wherever you navigate from)
navigation.navigate('ReadingGame', {
  lessonNumber: 1,
  lessonData: penzugyiAlapismeretkLessons[0],
});

// ReadingGame.tsx
const navigation = useNavigation();
const route = useRoute();
const { lessonNumber, lessonData } = route.params;

// On back:
const handleBack = () => {
  navigation.goBack();
};

// On win:
const handleFinish = () => {
  if (correctCount >= minRequired) {
    navigation.navigate('LessonGame', { 
      lessonCompleted: true,
      score: score 
    });
    // Or: navigation.goBack() and pass event
  }
};
```

## KeyboardAvoidingView

```typescript
<KeyboardAvoidingView
  style={styles.container}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
>
```

**Why?**
- iOS: Keyboard pushes content up
- Android: Handled by system (windowSoftInputMode="adjustResize")

## TextInput Styling

```typescript
<TextInput
  value={answers[index]}
  onChangeText={(value) => handleAnswerChange(index, value)}
  style={styles.questionInput}
  placeholder="Válaszod..."
  placeholderTextColor={COLORS.gray500} // Important! Default is invisible
  autoCapitalize="sentences"
  autoCorrect={false}
  returnKeyType="next" // Or "done" for last input
/>
```

## ScrollView Performance

For large question lists, consider using `FlatList`:

```typescript
// Instead of:
<ScrollView>
  {selectedQuestions.map((q, i) => <QuestionItem key={i} />)}
</ScrollView>

// Use:
<FlatList
  data={selectedQuestions}
  renderItem={({ item, index }) => <QuestionItem question={item} index={index} />}
  keyExtractor={(item, index) => `question-${index}`}
  contentContainerStyle={styles.questionsContainer}
/>
```

## Dependencies

```bash
npm install react-native-linear-gradient
npm install lucide-react-native
npm install @react-navigation/native
npm install @react-navigation/native-stack
```

## Testing Checklist

1. ✅ Reading state displays correctly
2. ✅ Paragraph splitting works (`\n\n`)
3. ✅ "Elolvastam" button transitions to questions
4. ✅ All questions render with TextInput
5. ✅ Keyboard doesn't cover inputs (KeyboardAvoidingView)
6. ✅ Answer validation works (keyword matching)
7. ✅ Result screen shows correct/incorrect answers
8. ✅ Score calculation (80% threshold)
9. ✅ Win button appears when score >= 80%
10. ✅ Retry button appears when score < 80%
11. ✅ Navigation back to lesson list works
12. ✅ onWin callback fires correctly

## Known Limitations

- No backdrop blur (not supported in RN)
- No hover effects (mobile doesn't need them)
- No pulse animation on win button (can add with Animated API)
- Gradient buttons wrapped in LinearGradient (extra nesting)

## Future Enhancements

### Add Pulse Animation (Optional)

```typescript
import { Animated, Easing } from 'react-native';

const pulseAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  if (gameState === 'result' && score >= 80) {
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
  }
}, [gameState, score]);

// Apply to win button:
<Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
  <LinearGradient ...>
    <TouchableOpacity>
      <Text>GYŐZELEM!</Text>
    </TouchableOpacity>
  </LinearGradient>
</Animated.View>
```

## Integration with LessonGame

```typescript
// LessonGame should call ReadingGame like this:
<ReadingGame
  lessonNumber={currentLessonNumber}
  lessonData={currentLessonData}
  onWin={handleLessonComplete}
  onBackToHome={() => navigation.goBack()}
/>

// Where handleLessonComplete:
const handleLessonComplete = () => {
  // Save progress to AsyncStorage
  // Update UI
  // Show next lesson or go back
};
```
