# SubscriptionPage - React Native Conversion Guide

## Overview
Előfizetési csomagok képernyő - 3 tier (Free, Pro, Master) pricing táblázattal.

## Changes from Web Version

### 1. Layout & Styling
- ❌ `<div>` → ✅ `<View>`
- ❌ `<h1>`, `<h2>`, `<h3>`, `<p>`, `<span>` → ✅ `<Text>`
- ❌ `<motion.*>` (Framer Motion) → ✅ Basic components (no animations)
- ❌ CSS Grid (benefits grid) → ✅ Flexbox with `flexWrap`
- ❌ Sticky header (`position: sticky`) → ✅ Normal header
- ❌ `position: absolute` (crystal decorations) → ✅ Removed (too complex)

### 2. Animations
- ❌ Framer Motion (`motion.div`, `animate`, `whileHover`, etc.) → ✅ **REMOVED** (can be added back with Moti)
- ❌ Crystal background animations → ✅ Removed
- ❌ Badge pulse animation → ✅ Static badge
- ❌ Toggle animation → ✅ Simple position change (can be animated with Moti)

### 3. Components
- ❌ lucide-react → ✅ lucide-react-native
- ❌ HTML button → ✅ TouchableOpacity
- ✅ LinearGradient for gradients
- ✅ ScrollView for scrollable content

### 4. Gradient Text
- ❌ `WebkitBackgroundClip` + gradient → ✅ Solid color (white/yellow)
- Note: Gradient text in RN requires MaskedView or react-native-linear-gradient-text

### 5. Toggle Switch
- ❌ Custom HTML button + Framer Motion → ✅ Custom TouchableOpacity + animated thumb position

### 6. Removed Features
- ❌ Hover effects (`whileHover`)
- ❌ Tap animations (`whileTap`)
- ❌ Entry animations (`initial`, `animate`)
- ❌ Crystal background decorations
- ❌ Sticky header
- ❌ Animated toggle transition (can add with Moti)

## Key Differences

### Billing Toggle

```typescript
// WEB (Framer Motion):
<button onClick={() => setBillingPeriod(...)} style={styles.toggleButton}>
  <motion.div
    animate={{ x: billingPeriod === 'yearly' ? 28 : 2 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    style={styles.toggleThumb}
  />
</button>

// RN (Simple):
<TouchableOpacity style={styles.toggleButton} onPress={toggleBilling}>
  <View
    style={[
      styles.toggleThumb,
      billingPeriod === 'yearly' && styles.toggleThumbActive,
    ]}
  />
</TouchableOpacity>

// Styles:
toggleThumb: {
  position: 'absolute',
  left: 4, // Monthly position
  // ...
},
toggleThumbActive: {
  left: 32, // Yearly position
},
```

### Gradient Text → Solid Color

```typescript
// WEB:
<h2 style={{
  background: 'linear-gradient(to right, #FBBF24, #FB923C, #EF4444)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}}>
  Fejleszd tudásod prémiummal
</h2>

// RN:
<Text style={styles.heroTitle}>
  Fejleszd tudásod prémiummal
</Text>

// Style:
heroTitle: {
  fontSize: SIZES.font2XL,
  color: COLORS.yellow400, // Solid color instead of gradient
  fontWeight: FONT_WEIGHT.bold,
  textAlign: 'center',
},
```

### Popular Badge

```typescript
// WEB:
<motion.div
  animate={{ scale: [1, 1.05, 1] }}
  transition={{ duration: 2, repeat: Infinity }}
  style={styles.popularBadge}
>
  <Star fill="#FDE047" />
  <span>{plan.badge}</span>
  <Star fill="#FDE047" />
</motion.div>

// RN (Static):
<LinearGradient
  colors={[COLORS.purple600, COLORS.pink500]}
  style={styles.popularBadge}
>
  <Star size={12} color={COLORS.yellow300} fill={COLORS.yellow300} />
  <Text style={styles.popularBadgeText}>{plan.badge}</Text>
  <Star size={12} color={COLORS.yellow300} fill={COLORS.yellow300} />
</LinearGradient>
```

### Benefits Grid (2x2)

```typescript
// WEB (CSS Grid):
const styles = {
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: SPACING.md,
  },
};

// RN (Flexbox):
const styles = StyleSheet.create({
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  benefitItem: {
    width: '47%', // 2 columns (slightly less than 50% to account for gap)
    // ...
  },
});
```

## Component Structure

### 3 Main Sections

1. **Header**
   - Back button
   - Title + subtitle
   - Current tier badge (if Pro/Master)

2. **Hero Section**
   - Crown icon (64px)
   - Title text
   - Subtitle text

3. **Billing Toggle**
   - Monthly/Yearly toggle switch
   - Savings badge (-17% when yearly)

4. **Pricing Cards** (3 cards)
   - Free tier
   - Pro tier (POPULAR badge)
   - Master tier

5. **Benefits Section** (2x2 grid)
   - 4 key benefits with icons

6. **Trust Section**
   - Shield icon + trust message
   - User count text

## Pricing Cards

### Card Structure

Each card contains:
1. **Badge** (top): "Ingyenes" / "Legtöbb választás" / "Legjobb érték"
2. **Header**: Icon + Name + Subtitle
3. **Price**: Large amount + period + yearly info (if applicable)
4. **Features**: List with checkmark icons
5. **CTA Button**: "Váltás erre a csomagra" / "Jelenlegi csomag"

### Free Card

```typescript
{
  id: 'free',
  name: 'Alapszint',
  subtitle: 'Kezdőknek',
  icon: BookOpen,
  price: { monthly: 0, yearly: 0 },
  features: [
    { icon: BookOpen, text: '3 lecke naponta' },
    { icon: Trophy, text: '5 küzdőtéri játék naponta' },
    { icon: Star, text: 'Alapvető könyvtár hozzáférés' },
    { icon: TrendingUp, text: 'Napi sorozat követés' },
    { icon: Target, text: 'Alapvető statisztikák' },
  ],
  gradientColors: [COLORS.slate600, COLORS.slate700],
  borderColor: COLORS.slate500,
}
```

### Pro Card (Popular)

```typescript
{
  id: 'pro',
  name: 'Professzionális',
  subtitle: 'Legtöbbeknek',
  icon: Zap,
  price: { monthly: 4990, yearly: 49990 },
  popular: true, // ← Shows "Legtöbb választás" badge
  features: [
    { icon: Infinity, text: 'Korlátlan leckék', highlight: true },
    { icon: Infinity, text: 'Korlátlan küzdőtér játékok', highlight: true },
    { icon: BookOpen, text: 'Teljes könyvtár (15 könyv)' },
    { icon: Download, text: 'Offline mód' },
    { icon: TrendingUp, text: 'Részletes statisztikák' },
    { icon: Flame, text: '2x gyorsabb XP gyűjtés' },
    { icon: Crown, text: 'Exkluzív jelvények' },
  ],
  gradientColors: [COLORS.purple600, COLORS.pink500],
  borderColor: COLORS.purple400,
}
```

### Master Card (Ultimate)

```typescript
{
  id: 'ultimate', // Note: ID is 'ultimate', but maps to 'master' tier
  name: 'Mester',
  subtitle: 'Elkötelezetteknek',
  icon: Crown,
  price: { monthly: 9990, yearly: 99990 },
  features: [
    { icon: Sparkles, text: 'Minden Pro funkció', highlight: true },
    { icon: Users, text: '1-1 mentori támogatás' },
    { icon: Target, text: 'Személyre szabott tanulási terv' },
    { icon: Trophy, text: 'Exkluzív kihívások' },
    { icon: Star, text: 'Korai hozzáférés új funkciókhoz' },
    { icon: Shield, text: 'Prioritás támogatás' },
    { icon: Crown, text: 'Arany mester jelvény' },
    { icon: Flame, text: '3x gyorsabb XP gyűjtés' },
  ],
  gradientColors: [COLORS.yellow500, COLORS.orange600],
  borderColor: COLORS.yellow400,
}
```

## Pricing Logic

### Monthly Price Display

```typescript
const getMonthlyPrice = (plan: Plan) => {
  if (plan.price.monthly === 0) return formatPrice(0);
  
  if (billingPeriod === 'yearly') {
    const monthly = Math.floor(plan.price.yearly / 12);
    return `${monthly.toLocaleString('hu-HU')} Ft`;
  }
  
  return formatPrice(plan.price.monthly);
};

// Examples:
// Pro Monthly: 4,990 Ft/hó
// Pro Yearly: 4,166 Ft/hó (49,990 / 12) + "49,990 Ft évente" below
```

### Savings Calculation

```typescript
const getSavings = (plan: Plan) => {
  if (plan.price.yearly === 0) return 0;
  
  const yearlyMonthly = plan.price.yearly / 12;
  const savings = ((plan.price.monthly - yearlyMonthly) / plan.price.monthly) * 100;
  
  return Math.round(savings);
};

// Example (Pro):
// Monthly: 4,990 Ft
// Yearly: 49,990 Ft (4,166 Ft/month)
// Savings: ((4990 - 4166) / 4990) * 100 = 17%
```

## Feature Highlights

Features with `highlight: true` have:
- **Gradient background** on checkmark icon (plan's gradient colors)
- **White text** instead of grey
- Emphasizes premium features

```typescript
// In render:
<LinearGradient
  colors={
    feature.highlight
      ? plan.gradientColors // Gradient for highlighted features
      : [COLORS.slate700, COLORS.slate700] // Solid grey for normal
  }
  style={styles.featureIconContainer}
>
  <Check size={12} color={feature.highlight ? COLORS.white : COLORS.slate400} />
</LinearGradient>
<Text
  style={[
    styles.featureText,
    feature.highlight && styles.featureTextHighlight,
  ]}
>
  {feature.text}
</Text>
```

## Current Plan Detection

```typescript
const isCurrentPlan = (planId: 'free' | 'pro' | 'ultimate') => {
  if (planId === 'ultimate') {
    return subscriptionTier === 'master'; // Map 'ultimate' → 'master'
  }
  return subscriptionTier === planId;
};

// CTA Button changes based on current plan:
{isCurrentPlan(plan.id) ? (
  <View style={styles.ctaButtonCurrent}>
    <Text style={styles.ctaButtonTextCurrent}>Jelenlegi csomag</Text>
  </View>
) : (
  <LinearGradient colors={plan.gradientColors} style={styles.ctaButton}>
    <Text style={styles.ctaButtonText}>Váltás erre a csomagra</Text>
  </LinearGradient>
)}
```

## Benefits Grid (2x2)

4 key benefits in 2 columns:

```typescript
<View style={styles.benefitsGrid}>
  {[
    { icon: BookOpen, text: 'Teljes könyvtár' },
    { icon: Infinity, text: 'Korlátlan tanulás' },
    { icon: TrendingUp, text: 'Gyorsabb fejlődés' },
    { icon: Shield, text: 'Prioritás támogatás' },
  ].map((benefit, idx) => (
    <View key={idx} style={styles.benefitItem}>
      <benefit.icon size={SIZES.iconSM} color={COLORS.purple400} />
      <Text style={styles.benefitText}>{benefit.text}</Text>
    </View>
  ))}
</View>

// Styles:
benefitsGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: SPACING.md,
},
benefitItem: {
  width: '47%', // 2 columns
  flexDirection: 'row',
  alignItems: 'center',
  gap: SPACING.sm,
  // ...
},
```

## Navigation Setup

```typescript
// App.tsx (React Navigation Stack)
<Stack.Screen 
  name="SubscriptionPage" 
  component={SubscriptionPage}
  options={{ headerShown: false }}
/>

// Navigate from Settings/Profile:
navigation.navigate('SubscriptionPage', {
  subscriptionTier: 'free', // Current tier
});

// SubscriptionPage.tsx
const navigation = useNavigation();
const route = useRoute();
const { subscriptionTier } = route.params;

const handleBack = () => {
  navigation.goBack();
};

const handleSelectPlan = (planId) => {
  // In real app, trigger in-app purchase flow
  onSubscriptionChange(planId);
  navigation.goBack();
};
```

## Testing Checklist

1. ✅ Header shows correct current tier badge (Free/Pro/Master)
2. ✅ Back button navigates correctly
3. ✅ Billing toggle switches between Monthly/Yearly
4. ✅ Savings badge (-17%) shows when Yearly selected
5. ✅ All 3 pricing cards render correctly
6. ✅ Popular badge shows on Pro card
7. ✅ Regular badge shows on Free/Master cards
8. ✅ Monthly price updates when toggle changes
9. ✅ Yearly price info shows when Yearly selected
10. ✅ Savings percentage calculates correctly
11. ✅ Feature highlights render with gradient icons
12. ✅ Current plan button is disabled and styled differently
13. ✅ CTA buttons trigger onSubscriptionChange
14. ✅ Benefits grid shows 2x2 layout
15. ✅ Trust section renders at bottom
16. ✅ ScrollView scrolls correctly

## Props Reference

```typescript
interface SubscriptionPageProps {
  onBack: () => void;                                    // Callback for back button
  subscriptionTier: 'free' | 'pro' | 'master';          // Current subscription tier
  onSubscriptionChange: (tier: 'free' | 'pro' | 'master') => void; // Callback when user selects a plan
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

- No animations (can be added with Moti/Reanimated)
- No hover effects (mobile doesn't need them)
- No sticky header (complex in RN without extra libs)
- No gradient text (solid color instead, or use MaskedView)
- No crystal background decorations (too complex)
- No real in-app purchase flow (needs react-native-iap)

## Future Enhancements

### Add Animations with Moti

```bash
npm install moti
```

```typescript
import { MotiView } from 'moti';

// Animated toggle thumb:
<MotiView
  animate={{ translateX: billingPeriod === 'yearly' ? 28 : 0 }}
  transition={{ type: 'timing', duration: 200 }}
  style={styles.toggleThumb}
/>

// Pulsing popular badge:
<MotiView
  from={{ scale: 1 }}
  animate={{ scale: [1, 1.05, 1] }}
  transition={{ type: 'timing', duration: 2000, loop: true }}
  style={styles.popularBadge}
>
  {/* Badge content */}
</MotiView>

// Entry animations:
<MotiView
  from={{ opacity: 0, translateY: 20 }}
  animate={{ opacity: 1, translateY: 0 }}
  transition={{ type: 'timing', duration: 300, delay: index * 100 }}
>
  {/* Card content */}
</MotiView>
```

### Add Gradient Text

```bash
npm install react-native-masked-view @react-native-masked-view/masked-view
```

```typescript
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

// Gradient Text:
<MaskedView maskElement={<Text style={styles.heroTitle}>Fejleszd tudásod</Text>}>
  <LinearGradient
    colors={[COLORS.yellow400, COLORS.orange400, COLORS.red600]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{ flex: 1 }}
  >
    <Text style={[styles.heroTitle, { opacity: 0 }]}>Fejleszd tudásod</Text>
  </LinearGradient>
</MaskedView>
```

### Add In-App Purchases

```bash
npm install react-native-iap
```

```typescript
import * as RNIap from 'react-native-iap';

const productIds = ['pro_monthly', 'pro_yearly', 'master_monthly', 'master_yearly'];

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

const handleSelectPlan = async (planId: string) => {
  if (planId === 'free') {
    onSubscriptionChange('free');
    return;
  }

  try {
    const sku = billingPeriod === 'yearly' 
      ? `${planId}_yearly` 
      : `${planId}_monthly`;
    
    const purchase = await RNIap.requestSubscription({ sku });
    console.log('Purchase successful:', purchase);
    
    // Verify purchase with backend
    // Then update subscription tier
    if (planId === 'pro') {
      onSubscriptionChange('pro');
    } else if (planId === 'ultimate') {
      onSubscriptionChange('master');
    }
    
    // Finish transaction
    await RNIap.finishTransaction({ purchase });
    
    Alert.alert('Sikeres!', 'Előfizetés aktiválva!');
    navigation.goBack();
  } catch (error) {
    console.error('Purchase error:', error);
    Alert.alert('Hiba', 'Előfizetés sikertelen');
  }
};
```

### Add Haptic Feedback

```typescript
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const toggleBilling = () => {
  ReactNativeHapticFeedback.trigger('impactLight');
  setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly');
};

const handleSelectPlan = (planId: string) => {
  if (!isCurrentPlan(planId)) {
    ReactNativeHapticFeedback.trigger('impactMedium');
  }
  // ... rest of purchase logic
};
```

## Color Reference

```typescript
const COLORS = {
  // Base
  white: '#FFFFFF',
  
  // Slate (Free tier, backgrounds)
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748B',
  slate400: '#94A3B8',
  slate300: '#CBD5E1',
  
  // Purple (Pro tier)
  purple900: '#581C87',
  purple800: '#6B21A8',
  purple700: '#7E22CE',
  purple600: '#9333EA',
  purple500: '#A855F7',
  purple400: '#C084FC',
  purple200: '#E9D5FF',
  purple100: '#D8B4FE',
  
  // Pink (Pro tier accent)
  pink500: '#EC4899',
  
  // Blue (Pro tier alternative)
  blue600: '#2563EB',
  cyan600: '#06B6D4',
  
  // Yellow/Orange (Master tier)
  yellow500: '#EAB308',
  yellow400: '#FBBF24',
  yellow300: '#FDE047', // Star icon
  orange600: '#EA580C',
  
  // Green (Savings badge)
  green600: '#16A34A',
  green500: '#059669',
  green400: '#4ADE80',
};
```

## Styling Notes

- **Gradients**: Use LinearGradient for all gradient backgrounds (cards, buttons, badges)
- **Borders**: Use semi-transparent borders (`${COLOR}80` = 50% opacity)
- **Shadows**: Use elevation (Android) + shadowOffset/Opacity/Radius (iOS)
- **Gap**: React Native 0.71+ supports gap in StyleSheet
- **Flexbox**: Use `flexWrap: 'wrap'` for multi-column layouts
- **Position**: Badges use `position: 'absolute'` with `zIndex`
- **toLocaleString**: Format prices with Hungarian locale (4,990 instead of 4990)

## Plan ID Mapping

Important: Plan IDs don't perfectly match subscription tiers!

```typescript
// Plan IDs in data:
'free' → 'free'
'pro' → 'pro'
'ultimate' → 'master' ← MISMATCH!

// Mapping in handlers:
const isCurrentPlan = (planId) => {
  if (planId === 'ultimate') {
    return subscriptionTier === 'master';
  }
  return subscriptionTier === planId;
};

const handleSelectPlan = (planId) => {
  if (planId === 'free') {
    onSubscriptionChange('free');
  } else if (planId === 'pro') {
    onSubscriptionChange('pro');
  } else if (planId === 'ultimate') {
    onSubscriptionChange('master'); // ← Map to 'master'
  }
};
```

## Performance Tips

- Use `React.memo()` for PricingCard component if rendering many
- Use `FlatList` instead of map() if you have many plans (currently only 3)
- Optimize LinearGradient by using fewer colors (max 2-3)
- Use `removeClippedSubviews` on ScrollView for long content
- Avoid re-renders by memoizing callbacks with useCallback

## Accessibility

Add accessibility props for screen readers:

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel={`Váltás ${plan.name} csomagra, ${getMonthlyPrice(plan)} havonta`}
  accessibilityRole="button"
  accessibilityState={{ disabled: isCurrentPlan(plan.id) }}
>
  {/* Button content */}
</TouchableOpacity>
```
