# QuizGame - React Native Conversion Guide

## Overview
Kvíz játék (3/3 lecke típus) - Feleletválasztós kérdések azonnali visszajelzéssel.

## Changes from Web Version

### 1. Layout & Styling
- ❌ `<div>` → ✅ `<View>`
- ❌ `<button>` → ✅ `<TouchableOpacity>` + `<LinearGradient>`
- ❌ `<h1>`, `<h2>`, `<p>`, `<span>` → ✅ `<Text>`
- ❌ `backdropFilter: 'blur(12px)'` → ✅ Remove (not supported)
- ❌ Hover effects (onMouseEnter/Leave) → ✅ Remove (not needed)
- ❌ CSS animations (pulse) → ✅ Can add with Animated API (optional)

### 2. Components
- ❌ lucide-react → ✅ lucide-react-native
- ✅ Progress dots with dynamic width (same as web)
- ✅ ScrollView for question/answer overflow

### 3. Answer Feedback
- ✅ Same logic: Green for correct, Red for incorrect
- ✅ 1 second delay before next question
- ✅ Icons show on selected/correct answers

### 4. Navigation
- ❌ `onBackToHome()` callback → ✅ `navigation.goBack()`
- ❌ `onWin()` callback → ✅ Pass completion data or navigate

### 5. Removed Features
- ❌ Backdrop blur effect
- ❌ Hover animations
- ❌ Mouse events
- ❌ Pulse animation on trophy icon

## Key Differences

### Progress Dots
```typescript
// WEB & RN: Same logic, different implementation
{selectedQuestions.map((_, index) => {
  const isCurrent = index === currentQuestionIndex;
  const isPast = index < currentQuestionIndex;
  
  return (
    // WEB:
    <div style={styles.progressDot(isCurrent, isPast)} />
    
    // RN:
    <View style={[
      styles.progressDot,
      { 
        width: isCurrent ? 32 : 8,
        backgroundColor: isCurrent ? COLORS.crystalPurple : 
                        isPast ? COLORS.success : COLORS.gray600
      }
    ]} />
  );
})}
```

### Answer Buttons
```typescript
// WEB:
<button
  onClick={() => handleAnswerClick(index)}
  disabled={selectedAnswer !== null}
  style={styles.answerButton(showFeedback, isSelected, isCorrect)}
  onMouseEnter={(e) => { ... }}
>
  ...
</button>

// RN:
<TouchableOpacity
  onPress={() => handleAnswerClick(index)}
  disabled={selectedAnswer !== null}
  style={[
    styles.answerButton,
    showFeedback && isSelected && isCorrect && styles.answerButtonCorrect,
    showFeedback && isSelected && !isCorrect && styles.answerButtonWrong,
    showFeedback && !isSelected && isCorrect && styles.answerButtonShowCorrect
  ]}
  activeOpacity={showFeedback ? 1 : 0.7}
>
  ...
</TouchableOpacity>
```

### Result Screen
```typescript
// WEB:
<div style={styles.trophyIcon}>
  <Trophy style={{ ...styles.iconInner, color: '#78350F' }} />
</div>

// RN:
<LinearGradient colors={[COLORS.goldLight, COLORS.gold]} style={styles.trophyIcon}>
  <Trophy size={SIZES.icon2XL} color={COLORS.goldDark} />
</LinearGradient>
```

## Game Logic

### Answer Selection Flow
1. User taps answer → `handleAnswerClick(index)`
2. `setSelectedAnswer(index)` → Feedback shows
3. Check if correct → Update `correctAnswers`
4. 1000ms delay (show feedback)
5. Next question or finish game

### Auto-advance
```typescript
setTimeout(() => {
  if (currentQuestionIndex < selectedQuestions.length - 1) {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
  } else {
    setGameFinished(true);
  }
}, 1000);
```

### Win Condition
- 80% correct answers required
- `Math.ceil(selectedQuestions.length * 0.8)` minimum

### States Flow
1. **Quiz**: Display question → User selects answer → Feedback → Auto next
2. **Finished**: Wait 500ms → Show result screen
3. **Result**: Win/Lose screen → "Folytatás" button → onWin() or onBackToHome()

## Data Structure

```typescript
interface Lesson {
  id: string;
  pageNumber: number;
  quiz: Array<{
    question: string;
    options: string[];
    correctAnswer: number; // 0-based index
  }>;
}
```

## Navigation Setup

```typescript
// App.tsx (React Navigation Stack)
<Stack.Screen 
  name="QuizGame" 
  component={QuizGame}
  options={{ headerShown: false }}
/>

// LessonGame.tsx (or wherever you navigate from)
navigation.navigate('QuizGame', {
  lessonNumber: 1,
  lessonData: penzugyiAlapismeretkLessons[0],
});

// QuizGame.tsx
const navigation = useNavigation();
const route = useRoute();
const { lessonNumber, lessonData } = route.params;

// On back:
const handleBack = () => {
  navigation.goBack();
};

// On continue:
const handleContinue = () => {
  if (isWin && onWin) {
    navigation.navigate('LessonGame', { 
      lessonCompleted: true,
      score: correctAnswers 
    });
  } else {
    navigation.goBack();
  }
};
```

## Answer Button States

### 1. Default (No selection yet)
```typescript
backgroundColor: `${COLORS.gray800}99`,
borderColor: `${COLORS.gray600}80`,
```

### 2. Selected & Correct
```typescript
backgroundColor: `${COLORS.success}cc`,
borderColor: COLORS.success,
// Icon: CheckCircle2 (green)
```

### 3. Selected & Wrong
```typescript
backgroundColor: `${COLORS.danger}cc`,
borderColor: COLORS.danger,
// Icon: XCircle (red)
```

### 4. Not Selected but Correct (show correct answer)
```typescript
backgroundColor: `${COLORS.success}99`,
borderColor: `${COLORS.success}80`,
// Icon: CheckCircle2 (green)
```

## Progress Dots Animation

Current implementation uses instant state change. For smooth animation:

```typescript
// Add Animated.Value for each dot
const dotAnimations = useRef(
  selectedQuestions.map(() => new Animated.Value(0))
).current;

// Animate on question change
useEffect(() => {
  Animated.parallel([
    // Shrink previous dot
    Animated.timing(dotAnimations[currentQuestionIndex - 1], {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }),
    // Expand current dot
    Animated.timing(dotAnimations[currentQuestionIndex], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }),
  ]).start();
}, [currentQuestionIndex]);

// In render:
<Animated.View
  style={[
    styles.progressDot,
    {
      width: dotAnimations[index].interpolate({
        inputRange: [0, 1],
        outputRange: [8, 32],
      }),
    },
  ]}
/>
```

## Testing Checklist

1. ✅ Questions load from lessonData
2. ✅ Progress dots show correctly (current/past/future)
3. ✅ Answer selection works (only one selection per question)
4. ✅ Feedback shows immediately (green/red)
5. ✅ Correct answer counter updates
6. ✅ Auto-advance to next question (1s delay)
7. ✅ Game finishes after last question
8. ✅ Result screen shows after 500ms delay
9. ✅ Win/Lose logic (80% threshold)
10. ✅ Trophy icon for win, ThumbsDown for lose
11. ✅ "Folytatás" button navigates correctly
12. ✅ Back button works

## Performance Optimization

### Use FlatList for Large Question Sets

If you have many questions (>20), consider using FlatList for answers:

```typescript
<FlatList
  data={currentQuestion.answers.filter(a => a)} // Remove empty
  keyExtractor={(item, index) => `answer-${index}`}
  renderItem={({ item, index }) => (
    <AnswerButton 
      answer={item}
      index={index}
      isSelected={selectedAnswer === index}
      isCorrect={index === currentQuestion.correctAnswer}
      showFeedback={selectedAnswer !== null}
      onPress={() => handleAnswerClick(index)}
    />
  )}
  contentContainerStyle={styles.answersContainer}
/>
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
- No pulse animation on trophy (can add with Animated API)
- Progress dots don't animate (can add with Animated API)

## Future Enhancements

### Add Pulse Animation to Trophy

```typescript
const pulseAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  if (gameFinished && showResult && isWin) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }
}, [gameFinished, showResult, isWin]);

// Apply to trophy icon:
<Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
  <LinearGradient ...>
    <Trophy ... />
  </LinearGradient>
</Animated.View>
```

### Add Sound Effects

```typescript
import Sound from 'react-native-sound';

const correctSound = new Sound('correct.mp3', Sound.MAIN_BUNDLE);
const wrongSound = new Sound('wrong.mp3', Sound.MAIN_BUNDLE);

const handleAnswerClick = (answerIndex: number) => {
  // ... existing code
  
  if (answerIndex === currentQuestion.correctAnswer) {
    correctSound.play();
  } else {
    wrongSound.play();
  }
};
```

## Integration with LessonGame

```typescript
// LessonGame should call QuizGame like this:
<QuizGame
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

## Color Reference

```typescript
const COLORS = {
  success: '#10B981',        // Correct answer background
  successLight: '#86EFAC',   // Check icon
  danger: '#EF4444',         // Wrong answer background
  dangerLight: '#FCA5A5',    // X icon
  goldLight: '#FDE047',      // Trophy gradient start
  gold: '#F59E0B',           // Trophy gradient end
  goldDark: '#78350F',       // Trophy icon color
  crystalPurple: '#A855F7',  // Current question dot
  gray600: '#4B5563',        // Future question dot
};
```
