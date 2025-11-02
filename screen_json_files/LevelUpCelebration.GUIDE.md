# LevelUpCelebration - React Native Conversion Guide

## Overview
Full-screen animációs overlay, amely megjelenik amikor a játékos új szintet ér el.

## Changes from Web Version

### 1. Animation Library
- ❌ Framer Motion (`motion/react`) → ✅ Moti (`moti`)
- All `motion.div` → `<MotiView>`
- All `motion.h1`, `motion.p`, `motion.button` → `<MotiView>` wrapping native components

### 2. Reduced Particle Count (Performance)
- ❌ 20 floating particles → ✅ 10 particles
- ❌ 12 sparkles → ✅ 6 sparkles
- ❌ 30 confetti → ✅ 20 confetti

### 3. Gradient Text
- ❌ `WebkitBackgroundClip` gradient text → ✅ Solid color (yellow300)
- Web: 3-color gradient (yellow → purple → pink)
- RN: Single color for simplicity (can add MaskedView later)

### 4. Button Hover Effects
- ❌ `onMouseEnter`, `onMouseLeave`, `onMouseDown`, `onMouseUp` → ✅ `activeOpacity`
- Web: Complex hover state changes
- RN: Simple TouchableOpacity with activeOpacity={0.8}

### 5. Removed Features
- ❌ Button glow effect (`.button-glow` class)
- ❌ Gradient particles (solid colors instead)
- ❌ Filter blur on trophy glow (simple opacity instead)

## Key Differences

### Animation Syntax

```typescript
// WEB (Framer Motion):
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{
    type: "spring",
    stiffness: 200,
    damping: 15,
    delay: 0.2
  }}
>
  {/* Content */}
</motion.div>

// RN (Moti):
<MotiView
  from={{
    scale: 0,
    rotate: '-180deg',
  }}
  animate={{
    scale: 1,
    rotate: '0deg',
  }}
  transition={{
    type: 'spring',
    stiffness: 200,
    damping: 15,
    delay: 200, // Note: milliseconds instead of seconds
  }}
>
  {/* Content */}
</MotiView>
```

### Looping Animations

```typescript
// WEB (Framer Motion):
<motion.div
  animate={{
    y: [0, -50, 0],
    opacity: [0, 1, 0],
    scale: [0, 1.5, 0],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    delay: Math.random() * 2,
    ease: "easeInOut"
  }}
/>

// RN (Moti):
<MotiView
  from={{
    translateY: 0,
    opacity: 0,
    scale: 0,
  }}
  animate={{
    translateY: -50,
    opacity: 1,
    scale: 1.5,
  }}
  transition={{
    type: 'timing',
    duration: 3000, // milliseconds
    loop: true,
    delay: Math.random() * 2000,
  }}
/>
```

### Orbiting Stars

```typescript
// WEB (Framer Motion):
{[...Array(4)].map((_, i) => (
  <motion.div
    key={`star-${i}`}
    style={styles.orbitingStar}
    animate={{
      rotate: [i * 90, i * 90 + 360],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    <div style={styles.orbitingStarInner}>
      <Star />
    </div>
  </motion.div>
))}

// RN (Moti):
{[...Array(4)].map((_, i) => (
  <MotiView
    key={`star-${i}`}
    from={{
      rotate: `${i * 90}deg`,
    }}
    animate={{
      rotate: `${i * 90 + 360}deg`,
    }}
    transition={{
      type: 'timing',
      duration: 4000,
      loop: true,
    }}
    style={styles.orbitingStar}
  >
    <View style={styles.orbitingStarInner}>
      <Star size={SIZES.iconLG} color={COLORS.yellow300} fill={COLORS.yellow300} />
    </View>
  </MotiView>
))}
```

### Confetti Effect

```typescript
// WEB (Framer Motion):
{[...Array(30)].map((_, i) => (
  <motion.div
    key={`confetti-${i}`}
    style={styles.confetti('50%', '20%', colors[i % 5], borderRadius)}
    initial={{
      x: 0,
      y: 0,
      opacity: 1,
      rotate: 0,
    }}
    animate={{
      x: (Math.random() - 0.5) * 600,
      y: Math.random() * 800 + 200,
      opacity: 0,
      rotate: Math.random() * 720,
    }}
    transition={{
      duration: 2 + Math.random() * 2,
      delay: i * 0.05,
      ease: "easeOut"
    }}
  />
))}

// RN (Moti):
{[...Array(20)].map((_, i) => {
  const randomX = (Math.random() - 0.5) * SCREEN_WIDTH * 1.2;
  const randomY = Math.random() * SCREEN_HEIGHT * 1.5 + 200;
  const randomRotate = Math.random() * 720;
  
  return (
    <MotiView
      key={`confetti-${i}`}
      from={{
        translateX: 0,
        translateY: 0,
        opacity: 1,
        rotate: '0deg',
      }}
      animate={{
        translateX: randomX,
        translateY: randomY,
        opacity: 0,
        rotate: `${randomRotate}deg`,
      }}
      transition={{
        type: 'timing',
        duration: 2000 + Math.random() * 2000,
        delay: i * 50,
      }}
      style={[
        styles.confetti,
        {
          left: SCREEN_WIDTH / 2,
          top: SCREEN_HEIGHT * 0.2,
          backgroundColor: color,
          borderRadius,
        },
      ]}
    />
  );
})}
```

## Component Structure

### 1. Background Layer
- **Gradient background** (LinearGradient)
- **Floating particles** (10 particles, random positions, loop animation)
- **Sparkles** (6 Sparkles icons, scale/rotate/opacity loop)
- **Radial glow** (semi-transparent purple overlay)

### 2. Main Content
- **Trophy icon** (128px circle, spring entrance animation)
- **Orbiting stars** (4 stars, continuous rotation)
- **"Gratulálunk!" title** (pulsing scale animation)
- **Level card** ("Szint {newLevel}")
- **Achievement message**
- **Continue button** (green gradient)

### 3. Confetti Layer
- **20 confetti particles** (explosion effect from center)
- Random colors, positions, rotations
- One-time animation (no loop)

## Animation Timeline

```
0ms    - Component mounts, background effects start
200ms  - Trophy entrance (spring animation)
0ms    - Orbiting stars start rotating (continuous)
500ms  - Text content fades in
1000ms - Achievement message fades in
1200ms - Continue button fades in
0-1000ms - Confetti particles explode (staggered by 50ms)
```

## Moti Animation Types

### Spring Animation (Trophy)
```typescript
transition={{
  type: 'spring',
  stiffness: 200,
  damping: 15,
  delay: 200,
}}
```
- Used for: Trophy entrance
- Creates bounce effect

### Timing Animation (Most others)
```typescript
transition={{
  type: 'timing',
  duration: 3000,
  loop: true,
  delay: 1000,
}}
```
- Used for: Particles, sparkles, confetti, text fades
- Linear interpolation

### Loop Animation
```typescript
transition={{
  type: 'timing',
  duration: 4000,
  loop: true, // ← Infinite loop
}}
```
- Used for: Orbiting stars, floating particles, sparkles, pulsing title

## Performance Optimizations

### Reduced Particle Count
```typescript
// Original (Web):
Particles: 20
Sparkles: 12
Confetti: 30
Total: 62 animated elements

// Optimized (RN):
Particles: 10
Sparkles: 6
Confetti: 20
Total: 36 animated elements

// Reduction: 42% fewer animations
```

### Why?
- React Native animations are more expensive than CSS
- Mobile devices have less GPU power
- Moti uses Reanimated under the hood (worklet-based)
- Still looks great with fewer particles!

## Orbiting Stars Calculation

```typescript
// Star positions around trophy circle
// Trophy radius: 128px / 2 = 64px
// Orbit distance: 80px from center
// Total distance from center: 64 + 80 = 144px

// Transform calculation:
orbitingStarInner: {
  transform: [
    { translateX: -12 }, // Center the star (24/2 = 12)
    { translateY: -92 }, // Position above center (-64 - 28 ≈ -92)
  ],
},

// Rotation:
- Star 0: 0° → 360° (top)
- Star 1: 90° → 450° (right)
- Star 2: 180° → 540° (bottom)
- Star 3: 270° → 630° (left)

// All rotate in sync over 4 seconds
```

## Color Palette

```typescript
const PARTICLE_COLORS = [
  COLORS.yellow400,  // #FBBF24 (gold)
  COLORS.purple500,  // #A855F7 (purple)
  '#ec4899',         // pink
  COLORS.blue600,    // #3B82F6 (blue)
];

const CONFETTI_COLORS = [
  COLORS.yellow400,  // gold
  COLORS.purple500,  // purple
  '#ec4899',         // pink
  COLORS.blue600,    // blue
  COLORS.green600,   // #10B981 (green)
];
```

## Trophy Glow Effect

```typescript
// WEB (blur filter):
trophyGlow: {
  position: 'absolute',
  inset: 0,
  filter: 'blur(48px)', // ← Not supported in RN
  backgroundColor: 'rgba(251, 191, 36, 0.5)',
  transform: 'scale(1.5)',
},

// RN (simple opacity):
trophyGlow: {
  position: 'absolute',
  top: -24,
  left: -24,
  right: -24,
  bottom: -24,
  backgroundColor: `${COLORS.yellow400}80`,
  borderRadius: SIZES.radiusFull,
  opacity: 0.5, // Simple glow instead of blur
},
```

## Props

```typescript
interface LevelUpCelebrationProps {
  newLevel: number;      // New level reached (e.g., 2, 3, 4, ...)
  onContinue: () => void; // Callback when "TOVÁBB" button pressed
}
```

## Usage Example

```typescript
// App.tsx
import { LevelUpCelebration } from './components/LevelUpCelebration';

function App() {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleLevelUp = () => {
    const newLevel = currentLevel + 1;
    setCurrentLevel(newLevel);
    setShowLevelUp(true);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Main app content */}
      <MainScreen onLevelUp={handleLevelUp} />

      {/* Level up overlay */}
      {showLevelUp && (
        <LevelUpCelebration
          newLevel={currentLevel}
          onContinue={() => setShowLevelUp(false)}
        />
      )}
    </View>
  );
}
```

## Navigation Integration

```typescript
// If using React Navigation with modal:
<Stack.Screen
  name="LevelUpCelebration"
  component={LevelUpCelebration}
  options={{
    presentation: 'transparentModal', // Full-screen overlay
    headerShown: false,
    animation: 'fade',
  }}
/>

// Navigate:
navigation.navigate('LevelUpCelebration', {
  newLevel: 5,
});

// LevelUpCelebration.tsx
const navigation = useNavigation();
const route = useRoute();
const { newLevel } = route.params;

const handleContinue = () => {
  navigation.goBack();
};
```

## Dependencies

```bash
# Required
npm install moti
npm install react-native-reanimated
npm install react-native-linear-gradient
npm install lucide-react-native

# Moti requires Reanimated 2+
# Add to babel.config.js:
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // ← Must be last
  ],
};
```

## Testing Checklist

1. ✅ Full-screen overlay covers entire screen
2. ✅ Trophy appears with spring bounce animation
3. ✅ 4 stars orbit around trophy continuously
4. ✅ 10 floating particles animate up and down
5. ✅ 6 sparkles rotate and scale in/out
6. ✅ "Gratulálunk!" title pulses
7. ✅ Level card shows correct newLevel
8. ✅ Achievement message fades in after 1s
9. ✅ Continue button fades in after 1.2s
10. ✅ 20 confetti particles explode from center
11. ✅ Confetti uses 5 different colors
12. ✅ Some confetti are circles, some squares
13. ✅ Button press triggers onContinue callback
14. ✅ Animations don't lag on older devices
15. ✅ Component unmounts cleanly (no memory leaks)

## Known Limitations

- **No gradient text** (solid yellow instead, or add MaskedView)
- **No blur filter** (simple opacity glow instead)
- **No button hover effects** (mobile doesn't need them)
- **Fewer particles** (performance optimization)
- **No button glow pulse** (removed for simplicity)

## Future Enhancements

### 1. Add Gradient Text with MaskedView

```bash
npm install @react-native-masked-view/masked-view
```

```typescript
import MaskedView from '@react-native-masked-view/masked-view';

<MaskedView
  maskElement={
    <Text style={styles.congratsTitle}>Gratulálunk!</Text>
  }
>
  <LinearGradient
    colors={[COLORS.yellow300, COLORS.purple200, '#F9A8D4']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{ flex: 1 }}
  >
    <Text style={[styles.congratsTitle, { opacity: 0 }]}>
      Gratulálunk!
    </Text>
  </LinearGradient>
</MaskedView>
```

### 2. Add Confetti Cannon Library

```bash
npm install react-native-confetti-cannon
```

```typescript
import ConfettiCannon from 'react-native-confetti-cannon';

<ConfettiCannon
  count={200}
  origin={{ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 0.2 }}
  fadeOut={true}
  autoStart={true}
  explosionSpeed={350}
  fallSpeed={3000}
/>
```

### 3. Add Haptic Feedback

```bash
npm install react-native-haptic-feedback
```

```typescript
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// When component mounts:
useEffect(() => {
  ReactNativeHapticFeedback.trigger('notificationSuccess');
}, []);

// When button pressed:
const handleContinue = () => {
  ReactNativeHapticFeedback.trigger('impactMedium');
  onContinue();
};
```

### 4. Add Sound Effect

```bash
npm install react-native-sound
```

```typescript
import Sound from 'react-native-sound';

useEffect(() => {
  const levelUpSound = new Sound('level_up.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('Failed to load sound', error);
      return;
    }
    levelUpSound.play();
  });

  return () => {
    levelUpSound.release();
  };
}, []);
```

### 5. Add Blur Background (iOS)

```bash
npm install @react-native-community/blur
```

```typescript
import { BlurView } from '@react-native-community/blur';

<BlurView
  style={styles.container}
  blurType="dark"
  blurAmount={10}
  reducedTransparencyFallbackColor="black"
>
  {/* Content */}
</BlurView>
```

## Moti Cheat Sheet

### Basic Animation
```typescript
<MotiView
  from={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ type: 'timing', duration: 1000 }}
/>
```

### Loop Animation
```typescript
<MotiView
  from={{ scale: 1 }}
  animate={{ scale: 1.2 }}
  transition={{
    type: 'timing',
    duration: 1000,
    loop: true,
  }}
/>
```

### Spring Animation
```typescript
<MotiView
  from={{ translateY: -100 }}
  animate={{ translateY: 0 }}
  transition={{
    type: 'spring',
    stiffness: 200,
    damping: 15,
  }}
/>
```

### Sequence Animation (Array)
```typescript
<MotiView
  animate={{ opacity: [0, 1, 0.5] }}
  transition={{
    type: 'timing',
    duration: 2000,
  }}
/>
```

### Exit Animation
```typescript
<MotiView
  from={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ type: 'timing', duration: 300 }}
/>
```

### Delay
```typescript
<MotiView
  from={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{
    type: 'timing',
    duration: 500,
    delay: 1000, // Wait 1s before starting
  }}
/>
```

## Performance Tips

1. **Use `useNativeDriver`** (Moti does this automatically)
2. **Reduce particle count** on older devices:
   ```typescript
   const PARTICLE_COUNT = Platform.OS === 'ios' ? 10 : 6;
   ```
3. **Use `removeClippedSubviews`** for ScrollView (not applicable here)
4. **Avoid re-renders** during animation (use React.memo)
5. **Clean up animations** on unmount (Moti handles this)

## Accessibility

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel={`Új szint elérve: ${newLevel}. Nyomj a továbblépéshez.`}
  accessibilityRole="button"
  accessibilityHint="Bezárja a szint növekedés üzenetet"
  onPress={onContinue}
>
  {/* Button content */}
</TouchableOpacity>
```

## Troubleshooting

### Animation not working?
- Check if Reanimated is installed: `npm install react-native-reanimated`
- Add Reanimated plugin to `babel.config.js` (must be last!)
- Restart Metro bundler: `npm start -- --reset-cache`

### Trophy not appearing?
- Check zIndex values
- Make sure LinearGradient is installed
- Check if lucide-react-native is installed

### Confetti not visible?
- Check if particles are positioned correctly (left/top values)
- Check if backgroundColor is set
- Check if animation duration is reasonable

### Performance issues?
- Reduce particle count (10 → 5, 6 → 3, 20 → 10)
- Use `shouldComponentUpdate` or `React.memo`
- Profile with React DevTools

## Alternative: Simple Version (No Animations)

If animations cause issues, here's a simple static version:

```typescript
export function LevelUpCelebrationSimple({ newLevel, onContinue }) {
  return (
    <LinearGradient colors={[COLORS.slate900, COLORS.purple900]} style={styles.container}>
      <View style={styles.content}>
        <Trophy size={80} color={COLORS.yellow400} />
        <Text style={styles.title}>Gratulálunk!</Text>
        <Text style={styles.subtitle}>Szakaszt teljesítettél! 🎉</Text>
        <View style={styles.levelCard}>
          <Text style={styles.levelLabel}>Új szint elérve</Text>
          <Text style={styles.levelNumber}>Szint {newLevel}</Text>
        </View>
        <TouchableOpacity onPress={onContinue} style={styles.button}>
          <Text style={styles.buttonText}>TOVÁBB</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
```

## Summary

This is a **full-screen animated celebration** component with:
- ✅ Moti-powered animations (Reanimated under the hood)
- ✅ 36 total animated elements (10 particles + 6 sparkles + 20 confetti)
- ✅ Spring-based trophy entrance
- ✅ Continuous orbiting stars
- ✅ Looping particle effects
- ✅ One-time confetti explosion
- ✅ Staggered text fades
- ✅ Performance-optimized for mobile

Perfect for celebrating level achievements in your RPG learning app! 🎉✨
