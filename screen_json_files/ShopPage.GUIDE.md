# ShopPage - React Native Conversion Guide

## Overview
Bolt képernyő - Erőforrások és bónuszok vásárlása 3 kategóriában.

## Changes from Web Version

### 1. Layout & Styling
- ❌ `<div>` → ✅ `<View>`
- ❌ Shadcn `<Button>` → ✅ `<TouchableOpacity>` + `<LinearGradient>`
- ❌ Shadcn `<Card>` → ✅ `<View>` + `<LinearGradient>`
- ❌ Shadcn `<Separator>` → ✅ `<View>` (border)
- ❌ `<h1>`, `<h2>`, `<h3>`, `<p>`, `<span>` → ✅ `<Text>`
- ❌ CSS Grid (`gridTemplateColumns: '1fr 1fr'`) → ✅ Flexbox with `flexWrap`
- ❌ Hover effects (onMouseEnter/Leave) → ✅ Remove (not needed)
- ❌ `minHeight: 1600` → ✅ ScrollView with flexible content

### 2. Toast/Alert
- ❌ `toast` from sonner → ✅ `Alert.alert()` from React Native

### 3. Components
- ❌ lucide-react → ✅ lucide-react-native
- ✅ ScrollView for overflow content
- ✅ LinearGradient for backgrounds and buttons

### 4. Grid Layout
- ❌ CSS Grid → ✅ Flexbox
- Each card: `width: '48%'` (2 columns with gap)
- `flexWrap: 'wrap'` for multi-row layout

### 5. In-App Purchases
- ❌ Web payment flow → ✅ React Native In-App Purchase (IAP) library
- Mock implementation with Alert dialogs

### 6. Removed Features
- ❌ Hover animations on cards
- ❌ Mouse events
- ❌ CSS transitions
- ❌ Shadcn components (Button, Card, Separator)

## Key Differences

### Button → TouchableOpacity + LinearGradient

```typescript
// WEB:
<Button
  onClick={handleGoldPurchase}
  className="bg-yellow-600 hover:bg-yellow-700"
  size="sm"
>
  <CreditCard /> {price} Ft
</Button>

// RN:
<View style={styles.goldButton}>
  <CreditCard size={14} color={COLORS.white} />
  <Text style={styles.goldButtonText}>{price} Ft</Text>
</View>

// Or with gradient:
<LinearGradient
  colors={[COLORS.yellow600, COLORS.orange600]}
  style={styles.goldButton}
>
  <CreditCard size={14} color={COLORS.white} />
  <Text style={styles.goldButtonText}>{price} Ft</Text>
</LinearGradient>
```

### Card → View + LinearGradient

```typescript
// WEB:
<Card style={{ 
  padding: SPACING.base, 
  border: '2px solid #FDE047', 
  backgroundColor: '#FEFCE8' 
}}>
  {/* Content */}
</Card>

// RN:
<View style={styles.goldCard}>
  {/* Content */}
</View>

// Or with gradient:
<LinearGradient
  colors={[COLORS.purple500, COLORS.pink500]}
  style={styles.balanceCard}
>
  {/* Content */}
</LinearGradient>
```

### CSS Grid → Flexbox

```typescript
// WEB:
const styles = {
  goldGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: SPACING.md,
  },
};

// RN:
const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  goldCard: {
    width: '48%', // 2 columns (100% / 2 - gap compensation)
    // ... other styles
  },
});
```

### Toast → Alert

```typescript
// WEB:
import { toast } from 'sonner@2.0.3';

const handleDiamondPurchase = (amount: number, cost: number) => {
  if (gold < cost) {
    toast.error('Nincs elég aranyad!');
    return;
  }
  toast.success(`${amount} gyémánt vásárlása sikeres!`);
  onPurchaseDiamondsWithGold(amount, cost);
};

// RN:
import { Alert } from 'react-native';

const handleDiamondPurchase = (amount: number, cost: number) => {
  if (gold < cost) {
    Alert.alert('Hiba', 'Nincs elég aranyad!');
    return;
  }
  onPurchaseDiamondsWithGold(amount, cost);
  Alert.alert('Sikeres!', `${amount} gyémánt vásárlása sikeres!`);
};
```

### Separator

```typescript
// WEB:
<Separator style={{ marginTop: SPACING.lg, marginBottom: SPACING.lg }} />

// RN:
<View style={styles.separator} />

// Styles:
separator: {
  height: SIZES.borderThin,
  backgroundColor: '#E5E7EB',
  marginVertical: SPACING.lg,
},
```

## Shop Structure

### 3 Main Sections

1. **Streak Freeze** (1 item)
   - Protects streak if user misses a day
   - Cost: 50 gold (configurable)
   - Icon: Flame 🔥

2. **Gold Purchase** (4 packages)
   - Purchased with real money (IAP)
   - Packages: 100, 500, 1000, 5000
   - "BEST" badge on 5000 package
   - Icon: Coins 💰

3. **Diamond Purchase** (4 packages)
   - Purchased with gold
   - Packages: 1, 10, 50, 100
   - "BONUS" badge on 100 package
   - Icon: Gem 💎

## Balance Card

Displays current resources at the top:

```typescript
<LinearGradient
  colors={[COLORS.purple500, COLORS.pink500]}
  style={styles.balanceCard}
>
  <Text style={styles.balanceText}>Jelenlegi egyenleged</Text>
  <View style={styles.balanceRow}>
    <View style={styles.balanceItem}>
      <Coins size={SIZES.iconBase} color={COLORS.white} />
      <Text style={styles.balanceValue}>{gold.toLocaleString('hu-HU')}</Text>
    </View>
    <View style={styles.balanceItem}>
      <Gem size={SIZES.iconBase} color={COLORS.white} />
      <Text style={styles.balanceValue}>{diamonds}</Text>
    </View>
    <View style={styles.balanceItem}>
      <Flame size={SIZES.iconBase} color={COLORS.white} />
      <Text style={styles.balanceValue}>{streakFreezes}</Text>
    </View>
  </View>
</LinearGradient>
```

## Streak Freeze Card

Special layout with text on left, price on right:

```typescript
<View style={styles.streakCard}>
  <View style={styles.streakCardContent}>
    {/* Left side: Description */}
    <View style={styles.streakTextContainer}>
      <Text style={styles.streakTitle}>Széria Pont</Text>
      <Text style={styles.streakDescription}>
        Ha kihagysz egy napot, a széria pont automatikusan megvédi a szériádat.
      </Text>
      <View style={styles.streakCurrent}>
        <Flame size={SIZES.iconSM} />
        <Text>Jelenleg: <Text style={styles.streakBold}>{streakFreezes} db</Text></Text>
      </View>
    </View>
    
    {/* Right side: Price & Button */}
    <View style={styles.streakPriceContainer}>
      <Text style={styles.streakPrice}>50</Text>
      <View style={styles.streakPriceLabel}>
        <Coins size={12} />
        <Text>arany</Text>
      </View>
      <TouchableOpacity style={styles.streakButton}>
        <Text>Vásárlás</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>
```

## Gold Cards (2-column grid)

4 packages in 2x2 grid:

```typescript
<View style={styles.grid}>
  <TouchableOpacity style={styles.goldCard} onPress={() => handleGoldPurchase(100, 990)}>
    <View style={styles.cardContent}>
      <LinearGradient colors={[...]} style={styles.iconCircle}>
        <Coins size={SIZES.iconLG} color={COLORS.white} />
      </LinearGradient>
      <Text style={styles.goldAmount}>100</Text>
      <Text style={styles.goldLabel}>arany</Text>
      <View style={styles.goldButton}>
        <CreditCard size={14} color={COLORS.white} />
        <Text style={styles.goldButtonText}>990 Ft</Text>
      </View>
    </View>
  </TouchableOpacity>
  {/* Repeat for 500, 1000, 5000 */}
</View>
```

### Gold 5000 (BEST Badge)

```typescript
<TouchableOpacity style={styles.goldCard}>
  <View style={styles.bestBadge}>
    <Text style={styles.badgeText}>BEST</Text>
  </View>
  <View style={styles.cardContent}>
    <LinearGradient colors={[COLORS.orange400, COLORS.red600]} style={styles.iconCircle}>
      <Sparkles size={SIZES.iconLG} color={COLORS.white} />
    </LinearGradient>
    <Text style={styles.goldAmount}>5,000</Text>
    <Text style={styles.goldLabel}>arany</Text>
    <LinearGradient colors={[COLORS.yellow600, COLORS.orange600]} style={styles.goldButton}>
      <CreditCard size={14} color={COLORS.white} />
      <Text style={styles.goldButtonText}>39,990 Ft</Text>
    </LinearGradient>
  </View>
</TouchableOpacity>
```

## Diamond Cards (2-column grid)

4 packages in 2x2 grid with gold cost:

```typescript
<TouchableOpacity 
  style={[
    styles.diamondCard,
    gold < cost && styles.cardDisabled,
  ]}
  onPress={() => handleDiamondPurchase(1, 10)}
  disabled={gold < 10}
>
  <View style={styles.cardContent}>
    <LinearGradient colors={[COLORS.cyan400, COLORS.blue600]} style={styles.iconCircle}>
      <Gem size={SIZES.iconLG} color={COLORS.white} />
    </LinearGradient>
    <Text style={styles.diamondAmount}>1</Text>
    <Text style={styles.diamondLabel}>gyémánt</Text>
    <View style={styles.diamondButton}>
      <Coins size={14} color={COLORS.white} />
      <Text style={styles.diamondButtonText}>10 arany</Text>
    </View>
  </View>
</TouchableOpacity>
```

### Diamond 100 (BONUS Badge)

```typescript
<TouchableOpacity style={styles.diamondCard}>
  <View style={styles.bonusBadge}>
    <Text style={styles.badgeText}>BONUS</Text>
  </View>
  <View style={styles.cardContent}>
    <LinearGradient colors={[COLORS.purple400, COLORS.pink500]} style={styles.iconCircle}>
      <Sparkles size={SIZES.iconLG} color={COLORS.white} />
    </LinearGradient>
    <Text style={styles.diamondAmount}>100</Text>
    <Text style={styles.diamondLabel}>gyémánt</Text>
    <LinearGradient colors={[COLORS.cyan600, COLORS.purple600]} style={styles.diamondButton}>
      <Coins size={14} color={COLORS.white} />
      <Text style={styles.diamondButtonText}>750 arany</Text>
    </LinearGradient>
  </View>
</TouchableOpacity>
```

## Badges (BEST & BONUS)

Position: absolute in top-right corner

```typescript
// Styles:
bestBadge: {
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: COLORS.red600,
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: SIZES.radiusFull,
  zIndex: 1,
},
bonusBadge: {
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: COLORS.purple600,
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: SIZES.radiusFull,
  zIndex: 1,
},
badgeText: {
  color: COLORS.white,
  fontSize: 10,
  fontWeight: FONT_WEIGHT.bold,
},
```

## Game Config

Prices are configurable via `gameConfig`:

```typescript
const GAME_CONFIG = {
  streakFreezeGoldCost: 50,
  gold100Price: 990,
  gold500Price: 4990,
  gold1000Price: 9990,
  gold5000Price: 39990,
  diamond1GoldCost: 10,
  diamond10GoldCost: 90,
  diamond50GoldCost: 400,
  diamond100GoldCost: 750,
};
```

In real app, import from `utils/gameConfig.ts`.

## Navigation Setup

```typescript
// App.tsx (React Navigation Stack)
<Stack.Screen 
  name="ShopPage" 
  component={ShopPage}
  options={{ headerShown: false }}
/>

// MainScreen.tsx (or wherever you navigate from)
navigation.navigate('ShopPage', {
  gold: 1200,
  diamonds: 50,
  streakFreezes: 2,
});

// ShopPage.tsx
const navigation = useNavigation();
const route = useRoute();
const { gold, diamonds, streakFreezes } = route.params;

const handleBack = () => {
  navigation.goBack();
};
```

## Testing Checklist

1. ✅ Back button navigates correctly
2. ✅ Balance card displays current resources
3. ✅ Streak Freeze card shows current count
4. ✅ Streak Freeze button disabled if not enough gold
5. ✅ All 4 gold packages render
6. ✅ BEST badge shows on gold 5000 package
7. ✅ Gold purchase shows alert dialog
8. ✅ All 4 diamond packages render
9. ✅ BONUS badge shows on diamond 100 package
10. ✅ Diamond purchase disabled if not enough gold
11. ✅ Diamond purchase shows error if insufficient gold
12. ✅ Diamond purchase shows success alert
13. ✅ ScrollView scrolls correctly
14. ✅ 2-column grid layout works
15. ✅ Numbers formatted with locale (toLocaleString)

## Props Reference

```typescript
interface ShopPageProps {
  onBack: () => void;                                    // Callback for back button
  gold: number;                                          // Current gold balance
  diamonds: number;                                      // Current diamond balance
  streakFreezes: number;                                 // Current streak freezes
  onPurchaseStreakFreeze: () => void;                   // Callback for streak freeze purchase
  onPurchaseGoldWithMoney: (amount: number, price: number) => void; // Callback for gold purchase
  onPurchaseDiamondsWithGold: (amount: number, cost: number) => void; // Callback for diamond purchase
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

- No hover effects (mobile doesn't need them)
- No CSS Grid (using Flexbox instead)
- No toast notifications (using Alert.alert instead)
- No Shadcn components (custom implementation)
- No real in-app purchases (mock with Alert)

## Future Enhancements

### Add React Native IAP

```bash
npm install react-native-iap
```

```typescript
import * as RNIap from 'react-native-iap';

const productIds = [
  'gold_100',
  'gold_500',
  'gold_1000',
  'gold_5000',
];

useEffect(() => {
  const initIAP = async () => {
    try {
      await RNIap.initConnection();
      const products = await RNIap.getProducts({ skus: productIds });
      console.log('Products:', products);
    } catch (error) {
      console.error('IAP Error:', error);
    }
  };

  initIAP();

  return () => {
    RNIap.endConnection();
  };
}, []);

const handleGoldPurchase = async (amount: number, price: number) => {
  try {
    const purchase = await RNIap.requestPurchase({ sku: `gold_${amount}` });
    console.log('Purchase successful:', purchase);
    
    // Verify purchase with backend
    // Then update user's gold balance
    onPurchaseGoldWithMoney(amount, price);
    
    // Finish transaction
    await RNIap.finishTransaction({ purchase });
    
    Alert.alert('Sikeres!', `${amount} arany hozzáadva!`);
  } catch (error) {
    console.error('Purchase error:', error);
    Alert.alert('Hiba', 'Vásárlás sikertelen');
  }
};
```

### Add Custom Toast

```bash
npm install react-native-toast-message
```

```typescript
import Toast from 'react-native-toast-message';

const handleDiamondPurchase = (amount: number, cost: number) => {
  if (gold < cost) {
    Toast.show({
      type: 'error',
      text1: 'Hiba',
      text2: 'Nincs elég aranyad!',
    });
    return;
  }
  
  onPurchaseDiamondsWithGold(amount, cost);
  
  Toast.show({
    type: 'success',
    text1: 'Sikeres!',
    text2: `${amount} gyémánt vásárlása sikeres!`,
  });
};

// In App.tsx:
<Toast />
```

### Add Haptic Feedback

```typescript
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const handleGoldPurchase = (amount: number, price: number) => {
  ReactNativeHapticFeedback.trigger('impactMedium');
  // ... rest of purchase logic
};
```

### Add Animated Card Press

```typescript
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const handlePressIn = () => {
  scale.value = withSpring(0.95);
};

const handlePressOut = () => {
  scale.value = withSpring(1);
};

// In render:
<Animated.View style={[animatedStyle]}>
  <TouchableOpacity
    onPressIn={handlePressIn}
    onPressOut={handlePressOut}
    onPress={() => handleGoldPurchase(100, 990)}
  >
    {/* Card content */}
  </TouchableOpacity>
</Animated.View>
```

## Color Reference

```typescript
const COLORS = {
  // Purple/Pink (Balance Card, Header)
  purple900: '#581C87',  // Header title
  purple800: '#7E22CE',  // Header subtitle
  purple600: '#9333EA',  // Bonus badge
  purple500: '#A855F7',  // Balance gradient start, icon
  purple400: '#C084FC',  // Diamond 100 icon gradient
  pink500: '#EC4899',    // Balance gradient end, Diamond 100 icon
  
  // Orange (Streak Freeze)
  orange900: '#7C2D12',  // Title
  orange800: '#9A3412',  // Current text
  orange700: '#C2410C',  // Description, price label
  orange600: '#EA580C',  // Price, Gold 1000 icon
  orange500: '#F97316',  // Icon, Button
  orange400: '#FB923C',  // Gold 5000 icon gradient
  orangeBorder: '#FED7AA', // Card border
  orange50: '#FFF7ED',   // Card background
  
  // Yellow (Gold)
  yellow900: '#78350F',  // Section title
  yellow700: '#A16207',  // Amount text
  yellow600: '#CA8A04',  // Label text, button
  yellow500: '#EAB308',  // Icon
  yellow400: '#FACC15',  // Icon gradient
  yellow300: '#FDE047',  // Card border
  yellow50: '#FEFCE8',   // Card background
  
  // Cyan (Diamond)
  cyan800: '#164E63',    // Section title
  cyan700: '#0E7490',    // Amount text
  cyan600: '#0891B2',    // Label text, button
  cyan500: '#06B6D4',    // Icon
  cyan400: '#22D3EE',    // Icon gradient
  cyan200: '#A5F3FC',    // Card border
  cyan50: '#ECFEFF',     // Card background
  
  // Other
  blue600: '#2563EB',    // Diamond icon gradient
  red600: '#DC2626',     // BEST badge, Gold 5000 icon
  white: '#FFFFFF',      // Text, icons
};
```

## Styling Notes

- **2-column grid**: Each card is `width: '48%'` to account for gaps
- **Gap property**: React Native 0.71+ supports gap in StyleSheet
- **Flex wrap**: `flexWrap: 'wrap'` creates multi-row grid
- **Position absolute**: Badges use absolute positioning
- **zIndex**: Badges have `zIndex: 1` to appear on top
- **Disabled state**: Use opacity: 0.5 or 0.6
- **Shadow**: Use elevation on Android, shadowOffset/Opacity/Radius on iOS
- **BorderWidth**: Use SIZES constants (borderThin: 1, borderMedium: 2)
- **toLocaleString**: Format numbers with Hungarian locale (1,234 instead of 1234)
