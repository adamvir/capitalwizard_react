# StreakPage - React Native Conversion Guide

## Overview
Információs oldal, amely megjeleníti a felhasználó napi sorozat (streak) részleteit és 30 napos naptárt.

## Changes from Web Version

### 1. UI Components
- ❌ Shadcn Button → ✅ TouchableOpacity
- ❌ Shadcn Card → ✅ View with styled background/border
- ❌ CSS Grid → ✅ flexDirection: 'row' + flexWrap: 'wrap'

### 2. Layout
- ❌ `gridTemplateColumns: '1fr 1fr'` → ✅ `flexDirection: 'row'` with `flex: 1`
- ❌ `gridTemplateColumns: 'repeat(7, 1fr)'` → ✅ Manual width calculation
- ❌ `aspectRatio: '1'` (CSS) → ✅ `aspectRatio: 1` (RN supports this!)

### 3. Calendar Cell Sizing
- Web: Uses CSS grid auto-sizing
- RN: Manual calculation based on screen width

```typescript
const CELL_WIDTH = (SCREEN_WIDTH - 28 - 28 - 36) / 7;
// 28 = container padding (14 * 2)
// 28 = card padding (14 * 2)
// 36 = gaps between cells (6px * 6 gaps)
```

### 4. Alert
- ❌ Browser confirm/alert → ✅ `Alert.alert()` from React Native

### 5. Removed Features
- ❌ Button hover effects (`:hover` pseudo-class)
- ❌ Transition animations on hover

## Key Differences

### Stats Grid (2 columns)

```typescript
// WEB (CSS Grid):
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 10,
}}>
  <Card>...</Card>
  <Card>...</Card>
</div>

// RN (Flexbox):
<View style={{
  flexDirection: 'row',
  gap: 10,
}}>
  <LinearGradient colors={[...]} style={{ flex: 1 }}>
    ...
  </LinearGradient>
  <LinearGradient colors={[...]} style={{ flex: 1 }}>
    ...
  </LinearGradient>
</View>
```

### Calendar Grid (7 columns)

```typescript
// WEB (CSS Grid):
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: 6,
}}>
  {days.map(day => <div>...</div>)}
</div>

// RN (Flexbox + flexWrap):
<View style={{
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 6,
}}>
  {days.map(day => (
    <View style={{
      width: (SCREEN_WIDTH - 28 - 28 - 36) / 7,
      aspectRatio: 1,
    }}>
      ...
    </View>
  ))}
</View>
```

### Gradient Card

```typescript
// WEB (inline gradient):
<Card style={{
  background: 'linear-gradient(to bottom right, #F97316, #EF4444)',
  color: COLORS.white,
  border: 'none'
}}>
  <div>...</div>
</Card>

// RN (LinearGradient):
<LinearGradient
  colors={[COLORS.orange500, COLORS.red500]}
  style={styles.statCard}
>
  <View>...</View>
</LinearGradient>
```

### Day Cell Conditional Styling

```typescript
// WEB (function returning CSSProperties):
const dayCell = (isFuture: boolean, completed: boolean, isToday: boolean): CSSProperties => ({
  aspectRatio: '1',
  borderRadius: SIZES.radiusLG,
  ...(isFuture
    ? { backgroundColor: '#F3F4F6', color: '#9CA3AF' }
    : completed
    ? { background: 'linear-gradient(...)', color: COLORS.white }
    : { backgroundColor: '#E5E7EB', color: '#4B5563' }),
  ...(isToday && { outline: '2px solid #F97316' }),
});

<div style={styles.dayCell(day.isFuture, day.completed, isToday)}>...</div>

// RN (array of styles):
<View
  style={[
    styles.dayCell,
    day.isFuture && styles.dayCellFuture,
    day.completed && !day.isFuture && styles.dayCellCompleted,
    !day.completed && !day.isFuture && styles.dayCellMissed,
    isToday && styles.dayCellToday,
  ]}
>
  ...
</View>

// Styles:
dayCell: {
  width: CELL_WIDTH,
  aspectRatio: 1,
  borderRadius: SIZES.radiusLG,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
},
dayCellFuture: {
  backgroundColor: COLORS.gray100,
},
dayCellCompleted: {
  backgroundColor: COLORS.green500, // Can't do gradient background in RN (use LinearGradient)
},
dayCellMissed: {
  backgroundColor: COLORS.gray200,
},
dayCellToday: {
  borderWidth: 2,
  borderColor: COLORS.orange500,
},
```

### Purchase Button with Alert

```typescript
// WEB (direct callback):
<Button
  onClick={onPurchaseStreakFreeze}
  disabled={!canAffordStreakFreeze}
>
  ...
</Button>

// RN (Alert.alert confirmation):
const handlePurchaseStreakFreeze = () => {
  if (!canAffordStreakFreeze) {
    Alert.alert(
      'Nincs elég aranyad',
      `Széria pont vásárlásához ${STREAK_FREEZE_GOLD_COST} arany szükséges. Jelenleg ${gold} aranyad van.`,
      [{ text: 'OK' }]
    );
    return;
  }

  Alert.alert(
    'Széria Pont Vásárlás',
    `Biztosan vásárolsz 1 széria pontot ${STREAK_FREEZE_GOLD_COST} aranyért?`,
    [
      { text: 'Mégse', style: 'cancel' },
      { text: 'Vásárlás', onPress: onPurchaseStreakFreeze },
    ]
  );
};

<TouchableOpacity
  onPress={handlePurchaseStreakFreeze}
  disabled={!canAffordStreakFreeze}
>
  ...
</TouchableOpacity>
```

### Legend with Gradient Dot

```typescript
// WEB:
<div style={{
  width: 14,
  height: 14,
  borderRadius: SIZES.radiusSM,
  background: 'linear-gradient(to bottom right, #10B981, #059669)',
}}></div>

// RN (LinearGradient):
<LinearGradient
  colors={[COLORS.green500, COLORS.green600]}
  style={styles.legendDot}
/>

// Or for outline-only (today indicator):
<View style={[
  styles.legendDot,
  {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.orange500,
  }
]} />
```

## Component Structure

### 1. Header
- **Back button** (circular, white bg, shadow)
- **Title** ("Széria Napló" + Flame icon)
- **Subtitle** ("Napi teljesítmények nyomon követése")

### 2. Stats Grid (2 columns)
- **Current Streak** (orange → red gradient)
- **Longest Streak** (yellow → orange gradient)

### 3. Streak Freeze Info Card
- **Icon** (blue circle + ShoppingBag)
- **Title** ("Széria Védelem")
- **Description** (current freezes count + explanation)
- **Purchase button** (blue, disabled if not enough gold)
- **Warning text** (if not enough gold)

### 4. Calendar Card
- **Title** ("Utolsó 30 nap teljesítménye" + Calendar icon)
- **Day labels** (H, K, Sze, Cs, P, Szo, V)
- **Calendar grid** (7x4, last 30 days)
- **Legend** (Teljesítve / Kihagyva / Ma)

## Calendar Logic

### Generating Last 30 Days

```typescript
const generateLast30Days = (): DayData[] => {
  const today = new Date();
  const days: DayData[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Check if this day is in the current streak
    const daysAgo = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    const completed = daysAgo < currentStreak;
    const isFuture = date > today;

    days.push({ date, completed, isFuture });
  }

  return days;
};
```

### Example: Current Streak = 5

```
Days ago:  29  28  27  ...  7   6   5   4   3   2   1   0 (today)
Completed: ❌  ❌  ❌  ... ❌  ❌  ✅  ✅  ✅  ✅  ✅  ✅

Logic: daysAgo < currentStreak
- Day 0 (today): 0 < 5 → ✅ completed
- Day 1: 1 < 5 → ✅ completed
- Day 2: 2 < 5 → ✅ completed
- Day 3: 3 < 5 → ✅ completed
- Day 4: 4 < 5 → ✅ completed
- Day 5: 5 < 5 → ❌ not completed (5 is NOT less than 5)
- Day 6+: 6+ < 5 → ❌ not completed
```

### Day Cell States

```typescript
// State combinations:
1. Future day: gray background (COLORS.gray100)
2. Completed day: green gradient + CheckCircle2
3. Missed day: light gray (COLORS.gray200) + XCircle
4. Today: orange outline (borderWidth: 2, borderColor: orange500)

// Example:
- Day 25 days ago, not completed → Missed (gray + XCircle)
- Day 3 days ago, completed → Completed (green + CheckCircle2)
- Today, completed → Completed + Today (green + CheckCircle2 + orange outline)
- Tomorrow → Future (gray, no icon)
```

## Props

```typescript
interface StreakPageProps {
  onBack: () => void;              // Navigate back
  currentStreak: number;            // Current streak count (e.g., 5)
  longestStreak: number;            // Longest streak ever (e.g., 12)
  streakFreezes: number;            // Available freeze count (e.g., 2)
  onPurchaseStreakFreeze: () => void; // Purchase callback
  gold: number;                     // Player's gold (e.g., 1500)
}
```

## Usage Example

```typescript
// App.tsx
import { StreakPage } from './components/StreakPage';

function App() {
  const [showStreakPage, setShowStreakPage] = useState(false);
  const [playerData, setPlayerData] = useState({
    currentStreak: 5,
    longestStreak: 12,
    streakFreezes: 2,
    gold: 1500,
  });

  const handlePurchaseStreakFreeze = () => {
    if (playerData.gold >= 500) {
      setPlayerData(prev => ({
        ...prev,
        gold: prev.gold - 500,
        streakFreezes: prev.streakFreezes + 1,
      }));
      Alert.alert('Sikeres vásárlás!', 'Vásároltál 1 széria pontot!');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {showStreakPage ? (
        <StreakPage
          onBack={() => setShowStreakPage(false)}
          currentStreak={playerData.currentStreak}
          longestStreak={playerData.longestStreak}
          streakFreezes={playerData.streakFreezes}
          onPurchaseStreakFreeze={handlePurchaseStreakFreeze}
          gold={playerData.gold}
        />
      ) : (
        <MainScreen onOpenStreak={() => setShowStreakPage(true)} />
      )}
    </View>
  );
}
```

## Navigation Integration

```typescript
// If using React Navigation:
<Stack.Screen
  name="StreakPage"
  component={StreakPage}
  options={{
    headerShown: false, // Custom header in component
    animation: 'slide_from_right',
  }}
/>

// Navigate:
navigation.navigate('StreakPage', {
  currentStreak: 5,
  longestStreak: 12,
  streakFreezes: 2,
  gold: 1500,
});

// StreakPage.tsx
const navigation = useNavigation();
const route = useRoute();
const { currentStreak, longestStreak, streakFreezes, gold } = route.params;

const handleBack = () => {
  navigation.goBack();
};

const handlePurchaseStreakFreeze = () => {
  // Update data via context or callback
  navigation.goBack();
};
```

## Game Config

The component references `getGameConfig()` for the streak freeze cost:

```typescript
// utils/gameConfig.ts
export const getGameConfig = () => ({
  streakFreezeGoldCost: 500,
  // ... other config
});

// In StreakPage:
import { getGameConfig } from '../utils/gameConfig';

const config = getGameConfig();
const canAffordStreakFreeze = gold >= config.streakFreezeGoldCost;
```

If you don't have `gameConfig`, you can use a constant:

```typescript
const STREAK_FREEZE_GOLD_COST = 500;
```

## Day Labels (Hungarian)

```typescript
const DAY_LABELS = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];
// H = Hétfő (Monday)
// K = Kedd (Tuesday)
// Sze = Szerda (Wednesday)
// Cs = Csütörtök (Thursday)
// P = Péntek (Friday)
// Szo = Szombat (Saturday)
// V = Vasárnap (Sunday)
```

## Color Palette

```typescript
// Streak theme (orange/red/yellow):
Orange gradient: [#F97316, #EF4444] (current streak)
Yellow gradient: [#EAB308, #F97316] (longest streak)

// Freeze theme (blue):
Blue card: backgroundColor: #EFF6FF (blue50)
Blue border: borderColor: #BFDBFE (blue200)
Blue icon: backgroundColor: #3B82F6 (blue500)
Blue button: backgroundColor: #2563EB (blue600)

// Calendar:
Completed: backgroundColor: #10B981 (green500)
Missed: backgroundColor: #E5E7EB (gray200)
Future: backgroundColor: #F3F4F6 (gray100)
Today outline: borderColor: #F97316 (orange500)

// Legend:
Green gradient: [#10B981, #059669]
Gray: #E5E7EB
Orange outline: borderColor: #F97316
```

## Cell Width Calculation

```typescript
// Total width available for calendar:
const CALENDAR_WIDTH = SCREEN_WIDTH
  - 28  // Container padding (14 * 2)
  - 28  // Card padding (14 * 2)
  - 36; // Gaps between cells (6px * 6 gaps)

// Each cell width:
const CELL_WIDTH = CALENDAR_WIDTH / 7;

// Example (iPhone 14 Pro Max, width = 430):
CALENDAR_WIDTH = 430 - 28 - 28 - 36 = 338
CELL_WIDTH = 338 / 7 ≈ 48.3px

// Cell dimensions:
width: 48.3px
aspectRatio: 1 → height: 48.3px
```

## Dependencies

```bash
# Required
npm install lucide-react-native
npm install react-native-linear-gradient
```

## Testing Checklist

1. ✅ Header displays with back button + title + subtitle
2. ✅ Back button navigates back
3. ✅ Current streak card shows correct number
4. ✅ Longest streak card shows correct number
5. ✅ Streak freeze card shows correct freeze count
6. ✅ Purchase button enabled when gold >= 500
7. ✅ Purchase button disabled when gold < 500
8. ✅ Purchase button shows confirmation alert
9. ✅ Not enough gold shows warning alert
10. ✅ Calendar displays 30 days
11. ✅ Day labels show (H, K, Sze, Cs, P, Szo, V)
12. ✅ Completed days show green + CheckCircle2
13. ✅ Missed days show gray + XCircle
14. ✅ Future days show light gray + no icon
15. ✅ Today has orange outline
16. ✅ Calendar cells are square (aspectRatio: 1)
17. ✅ Legend displays correctly
18. ✅ ScrollView scrolls smoothly
19. ✅ Gradients render correctly
20. ✅ All text readable + proper sizing

## Known Limitations

- **No gradient in completed day cells** (could use LinearGradient wrapper for each cell, but solid green is simpler)
- **No hover effects** (mobile doesn't need them)
- **Fixed streak freeze cost** (hardcoded 500, or import from gameConfig)

## Future Enhancements

### 1. Add Streak Milestones

```typescript
const getStreakMilestoneMessage = (streak: number) => {
  if (streak >= 100) return '🔥 LEGENDÁS! 100+ nap!';
  if (streak >= 30) return '🏆 HÓNAP! 30+ nap!';
  if (streak >= 7) return '⭐ HÉTTŰ! 7+ nap!';
  return null;
};

// Show banner at top:
{getStreakMilestoneMessage(currentStreak) && (
  <View style={styles.milestoneBanner}>
    <Text>{getStreakMilestoneMessage(currentStreak)}</Text>
  </View>
)}
```

### 2. Add Month View Switcher

```typescript
const [monthOffset, setMonthOffset] = useState(0);

const generateDaysForMonth = (offset: number) => {
  // Generate days for current month - offset
  // offset = 0: current month
  // offset = 1: last month
  // etc.
};

<View style={styles.monthSwitcher}>
  <TouchableOpacity onPress={() => setMonthOffset(prev => prev + 1)}>
    <ChevronLeft />
  </TouchableOpacity>
  <Text>{getMonthName(monthOffset)}</Text>
  <TouchableOpacity
    onPress={() => setMonthOffset(prev => Math.max(0, prev - 1))}
    disabled={monthOffset === 0}
  >
    <ChevronRight />
  </TouchableOpacity>
</View>
```

### 3. Add Streak Freeze Auto-Use Notification

```typescript
// Show when streak freeze was used:
{streakFreezeUsedToday && (
  <View style={styles.notificationBanner}>
    <Info size={16} color={COLORS.blue600} />
    <Text>
      Egy széria pont felhasználódott ma, hogy megvédje a szériádat!
    </Text>
  </View>
)}
```

### 4. Add Calendar Cell Tap (Show Day Details)

```typescript
const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

const handleDayPress = (day: DayData) => {
  if (day.isFuture) return;
  setSelectedDay(day);
};

// Modal:
{selectedDay && (
  <Modal visible={!!selectedDay} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text>{selectedDay.date.toLocaleDateString()}</Text>
        <Text>{selectedDay.completed ? 'Teljesítve ✅' : 'Kihagyva ❌'}</Text>
        <TouchableOpacity onPress={() => setSelectedDay(null)}>
          <Text>Bezár</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}
```

### 5. Add Animated Counter

Use `react-native-reanimated` to animate the streak numbers:

```typescript
import Animated, { useSharedValue, useAnimatedProps, withSpring } from 'react-native-reanimated';

const animatedStreak = useSharedValue(0);

useEffect(() => {
  animatedStreak.value = withSpring(currentStreak);
}, [currentStreak]);

const animatedProps = useAnimatedProps(() => ({
  text: Math.round(animatedStreak.value).toString(),
}));

<AnimatedText animatedProps={animatedProps} style={styles.statCardValue} />
```

## Accessibility

```typescript
// Back button:
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Vissza"
  accessibilityRole="button"
  accessibilityHint="Visszatérés az előző képernyőre"
  onPress={onBack}
>
  <ArrowLeft />
</TouchableOpacity>

// Purchase button:
<TouchableOpacity
  accessible={true}
  accessibilityLabel={`Széria pont vásárlás ${STREAK_FREEZE_GOLD_COST} aranyért`}
  accessibilityRole="button"
  accessibilityState={{ disabled: !canAffordStreakFreeze }}
  accessibilityHint={
    canAffordStreakFreeze
      ? 'Vásárlás megerősítő ablakot nyit'
      : 'Nincs elég aranyad a vásárláshoz'
  }
  onPress={handlePurchaseStreakFreeze}
  disabled={!canAffordStreakFreeze}
>
  ...
</TouchableOpacity>

// Day cell:
<View
  accessible={true}
  accessibilityLabel={`${day.date.toLocaleDateString()}, ${
    day.isFuture
      ? 'jövőbeli nap'
      : day.completed
      ? 'teljesítve'
      : 'kihagyva'
  }${isToday ? ', ma' : ''}`}
  accessibilityRole="text"
>
  ...
</View>
```

## Troubleshooting

### Calendar cells not square?
- Check if `aspectRatio: 1` is set
- Verify cell width calculation
- Check if gap is accounted for in width calculation

### Gradients not showing?
- Make sure `react-native-linear-gradient` is installed
- Check if colors array has at least 2 colors
- Verify gradient component is imported correctly

### Purchase button not working?
- Check if `gold >= STREAK_FREEZE_GOLD_COST`
- Verify `onPurchaseStreakFreeze` callback is provided
- Check Alert.alert is working (might need permission on Android)

### Days showing incorrect completed state?
- Verify `currentStreak` prop is correct
- Check date calculation logic (`daysAgo < currentStreak`)
- Make sure today's date is calculated correctly

## Performance Tips

1. **Memoize calendar generation:**
   ```typescript
   const days = useMemo(() => generateLast30Days(), [currentStreak]);
   ```

2. **Use `keyExtractor` for lists:**
   ```typescript
   // If using FlatList instead of map:
   keyExtractor={(item, index) => `day-${index}`}
   ```

3. **Avoid inline styles in render:**
   ```typescript
   // ❌ Bad:
   {days.map(day => (
     <View style={{ width: calculateWidth() }}>...</View>
   ))}
   
   // ✅ Good:
   const cellWidth = useMemo(() => calculateWidth(), []);
   {days.map(day => (
     <View style={{ width: cellWidth }}>...</View>
   ))}
   ```

## Summary

This is a **streak details page** with:
- ✅ 2-column stats grid (current + longest)
- ✅ Streak freeze purchase card
- ✅ 30-day calendar grid (7x4)
- ✅ Completed/missed/today indicators
- ✅ Legend explanation
- ✅ Purchase confirmation with Alert.alert
- ✅ Responsive cell sizing
- ✅ ScrollView for longer content

Perfect for tracking daily learning streaks in your RPG app! 🔥📅
