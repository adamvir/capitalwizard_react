# AvatarSelectorPage - React Native Conversion Guide

## Overview
Avatar választó képernyő - 3 tier rendszer (Free, Pro, Master) emoji alapú avatarokkal.

## Changes from Web Version

### 1. Layout & Styling
- ❌ `<div>` → ✅ `<View>`
- ❌ `<button>` → ✅ `<TouchableOpacity>` + `<LinearGradient>`
- ❌ `<h1>`, `<h2>`, `<h3>`, `<p>`, `<span>` → ✅ `<Text>`
- ❌ `backdropFilter: 'blur(8px)'` → ✅ Remove (not supported)
- ❌ Hover effects (onMouseEnter/Leave) → ✅ Remove (not needed)
- ❌ `overflowY: 'auto'` → ✅ `<ScrollView>`
- ❌ CSS Grid (`gridTemplateColumns: 'repeat(3, 1fr)'`) → ✅ Flexbox with `flexWrap`

### 2. Storage
- ❌ `localStorage` → ✅ `AsyncStorage`
- ❌ Synchronous `localStorage.getItem()` → ✅ Async `await AsyncStorage.getItem()`

### 3. Components
- ❌ lucide-react → ✅ lucide-react-native
- ✅ ScrollView for avatar grid overflow
- ✅ LinearGradient for backgrounds and avatar buttons

### 4. Grid Layout
- ❌ CSS Grid → ✅ Flexbox
- Each avatar button: `width: '31%'` (3 columns with gap)
- `flexWrap: 'wrap'` for multi-row layout

### 5. Navigation
- ❌ `onBack()` callback → ✅ `navigation.goBack()`

### 6. Removed Features
- ❌ Backdrop blur effect
- ❌ Hover animations on buttons
- ❌ Mouse events
- ❌ CSS transitions
- ❌ Custom event dispatch (`window.dispatchEvent`)

## Key Differences

### localStorage → AsyncStorage

```typescript
// WEB:
const saved = localStorage.getItem('player_avatar');
if (saved) {
  setSelectedAvatar(saved);
}

localStorage.setItem('player_avatar', emoji);

// RN:
const loadAvatar = async (): Promise<string> => {
  try {
    const saved = await AsyncStorage.getItem('player_avatar');
    return saved || '🧙‍♂️';
  } catch (error) {
    console.error('Error loading avatar:', error);
    return '🧙‍♂️';
  }
};

const saveAvatar = async (emoji: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('player_avatar', emoji);
  } catch (error) {
    console.error('Error saving avatar:', error);
  }
};

// Usage:
useEffect(() => {
  loadAvatar().then(setSelectedAvatar);
}, []);

const handleSelectAvatar = (emoji: string, isLocked: boolean) => {
  if (!isLocked) {
    setSelectedAvatar(emoji);
    saveAvatar(emoji);
  }
};
```

### CSS Grid → Flexbox

```typescript
// WEB:
const styles = {
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: SPACING.md,
  },
};

// RN:
const styles = StyleSheet.create({
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  avatarButton: {
    width: '31%', // 3 columns (100% / 3 - gap compensation)
    // ... other styles
  },
});
```

### Avatar Button (Gradient Background)

```typescript
// WEB:
<button
  style={styles.avatarButton(colors.gradient, colors.border, isLocked, isSelected)}
  onClick={() => handleSelectAvatar(avatar.emoji, isLocked)}
>
  {/* Content */}
</button>

// RN:
<TouchableOpacity
  onPress={() => handleSelectAvatar(avatar.emoji, isLocked)}
  disabled={isLocked}
  activeOpacity={0.7}
>
  <LinearGradient
    colors={colors.gradient}
    style={[
      styles.avatarButton,
      { borderColor: colors.border },
      isLocked && styles.avatarButtonLocked,
      isSelected && styles.avatarButtonSelected,
    ]}
  >
    {/* Content */}
  </LinearGradient>
</TouchableOpacity>
```

### Current Avatar Display

```typescript
// WEB:
<div style={styles.currentAvatarCircle}>
  <span style={styles.currentAvatarEmoji}>{selectedAvatar}</span>
</div>

// RN:
<LinearGradient
  colors={[COLORS.purple600, COLORS.pink500]}
  style={styles.currentAvatarCircle}
>
  <Text style={styles.currentAvatarEmoji}>{selectedAvatar}</Text>
</LinearGradient>
```

### Lock Overlay

```typescript
// WEB:
<div style={styles.avatarEmojiContainer}>
  {avatar.emoji}
  {isLocked && (
    <div style={styles.avatarLockOverlay}>
      <Lock />
    </div>
  )}
</div>

// RN:
<View style={styles.avatarEmojiContainer}>
  <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
  {isLocked && (
    <View style={styles.avatarLockOverlay}>
      <Lock size={SIZES.iconLG} color={COLORS.white} />
    </View>
  )}
</View>
```

## Avatar Data Structure

### 3 Tiers

```typescript
const avatars = {
  free: [
    { emoji: '🧙‍♂️', name: 'Varázsló', rarity: 'Közönséges' },
    { emoji: '⚔️', name: 'Harcos', rarity: 'Közönséges' },
    { emoji: '🏹', name: 'Íjász', rarity: 'Közönséges' },
    { emoji: '🛡️', name: 'Védő', rarity: 'Közönséges' },
    { emoji: '🗡️', name: 'Lovag', rarity: 'Közönséges' },
    { emoji: '🎯', name: 'Célzó', rarity: 'Közönséges' },
  ],
  pro: [
    { emoji: '🐉', name: 'Sárkány', rarity: 'Ritka', locked: true },
    { emoji: '🦅', name: 'Sas', rarity: 'Ritka', locked: true },
    { emoji: '🦁', name: 'Oroszlán', rarity: 'Ritka', locked: true },
    { emoji: '🔮', name: 'Látnok', rarity: 'Ritka', locked: true },
    { emoji: '⚡', name: 'Villám', rarity: 'Ritka', locked: true },
    { emoji: '🌟', name: 'Csillag', rarity: 'Ritka', locked: true },
    { emoji: '🔥', name: 'Láng', rarity: 'Ritka', locked: true },
    { emoji: '💎', name: 'Gyémánt', rarity: 'Ritka', locked: true },
  ],
  master: [
    { emoji: '👑', name: 'Király', rarity: 'Legendás', locked: true },
    { emoji: '🌌', name: 'Galaxis', rarity: 'Legendás', locked: true },
    { emoji: '🦄', name: 'Egyszarvú', rarity: 'Legendás', locked: true },
    { emoji: '🎭', name: 'Maszk', rarity: 'Legendás', locked: true },
    { emoji: '🏆', name: 'Bajnok', rarity: 'Legendás', locked: true },
    { emoji: '💫', name: 'Csillaghullás', rarity: 'Legendás', locked: true },
  ],
};
```

### Lock Logic

```typescript
const isAvatarLocked = (avatar: Avatar): boolean => {
  if (!avatar.locked) return false;

  // Check if user has required subscription
  if (subscriptionTier === 'master') return false; // Master unlocks everything
  if (subscriptionTier === 'pro' && avatar.rarity !== 'Legendás') return false; // Pro unlocks Ritka
  return true; // Free users: locked
};
```

**Lock Rules:**
- **Free tier**: Only "Közönséges" avatars unlocked (6 avatars)
- **Pro tier**: "Közönséges" + "Ritka" avatars unlocked (6 + 8 = 14 avatars)
- **Master tier**: All avatars unlocked (6 + 8 + 6 = 20 avatars)

## Rarity Colors

```typescript
const getRarityColors = (rarity: string) => {
  switch (rarity) {
    case 'Közönséges':
      return {
        gradient: [COLORS.slate500, COLORS.slate700],    // Gray
        border: COLORS.slate600,
        text: COLORS.slate300,
      };
    case 'Ritka':
      return {
        gradient: [COLORS.blue600, COLORS.blue700],      // Blue
        border: COLORS.blue500,
        text: COLORS.blue300,
      };
    case 'Legendás':
      return {
        gradient: [COLORS.purple600, COLORS.pink500],    // Purple→Pink
        border: COLORS.purple500,
        text: COLORS.purple100,
      };
  }
};
```

## Component Structure

### 1. Header
- Back button
- Title with Sparkles icon
- Current avatar display (large circle with gradient)

### 2. ScrollView Content
- **Free Avatars Section** (6 avatars, 3 columns)
- **Pro Avatars Section** (8 avatars, 3 columns, Crown icon)
- **Master Avatars Section** (6 avatars, 3 columns, Crown icon)
- **Info Card** (tier explanation)

### 3. Avatar Button States
- **Normal**: Default gradient + border
- **Selected**: Scale(1.05) + stronger shadow + checkmark badge
- **Locked**: Opacity 0.5 + Lock overlay + disabled

## Selected Badge

A green checkmark badge appears in the top-right corner of selected avatars:

```typescript
{isSelected && !isLocked && (
  <View style={styles.selectedBadge}>
    <Text style={styles.checkmark}>✓</Text>
  </View>
)}

// Styles:
selectedBadge: {
  position: 'absolute',
  top: -4,
  right: -4,
  width: 24,
  height: 24,
  backgroundColor: COLORS.green500,
  borderRadius: SIZES.radiusFull,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: SIZES.borderMedium,
  borderColor: COLORS.white,
},
```

## Info Card

Explains the tier system at the bottom of the scroll view:

```typescript
<LinearGradient colors={[...]} style={styles.infoCard}>
  <View style={styles.infoCardContent}>
    <Sparkles size={SIZES.iconBase} color={COLORS.blue400} />
    <View style={styles.infoCardTextContainer}>
      <Text style={styles.infoCardTitle}>Avatar Tier-ek</Text>
      <View style={styles.infoCardList}>
        <View style={styles.infoCardItem}>
          <View style={[styles.tierDot, { backgroundColor: COLORS.slate500 }]} />
          <Text>Közönséges - Mindenki számára elérhető</Text>
        </View>
        {/* Pro and Master items */}
      </View>
    </View>
  </View>
</LinearGradient>
```

## Navigation Setup

```typescript
// App.tsx (React Navigation Stack)
<Stack.Screen 
  name="AvatarSelectorPage" 
  component={AvatarSelectorPage}
  options={{ headerShown: false }}
/>

// MainScreen.tsx (or wherever you navigate from)
navigation.navigate('AvatarSelectorPage', {
  subscriptionTier: 'pro', // or 'free' or 'master'
});

// AvatarSelectorPage.tsx
const navigation = useNavigation();
const route = useRoute();
const { subscriptionTier } = route.params;

const handleBack = () => {
  navigation.goBack();
};
```

## Testing Checklist

1. ✅ Back button navigates correctly
2. ✅ Current avatar displays in header circle
3. ✅ All 3 sections render (Free, Pro, Master)
4. ✅ Section badges show correct count
5. ✅ Free avatars are never locked
6. ✅ Pro avatars locked for Free tier
7. ✅ Master avatars locked for Free and Pro tiers
8. ✅ Selected avatar has checkmark badge
9. ✅ Selected avatar has scale effect
10. ✅ Locked avatars show lock icon overlay
11. ✅ Locked avatars have reduced opacity
12. ✅ Locked avatars are disabled (can't click)
13. ✅ Avatar selection saves to AsyncStorage
14. ✅ Avatar loads from AsyncStorage on mount
15. ✅ Info card displays tier explanations
16. ✅ ScrollView scrolls correctly
17. ✅ 3-column grid layout works

## Props Reference

```typescript
interface AvatarSelectorPageProps {
  onBack: () => void;                          // Callback for back button
  subscriptionTier: 'free' | 'pro' | 'master'; // User's subscription tier
}
```

## Dependencies

```bash
npm install @react-native-async-storage/async-storage
npm install react-native-linear-gradient
npm install lucide-react-native
npm install @react-navigation/native
npm install @react-navigation/native-stack
```

## Known Limitations

- No backdrop blur (not supported in RN)
- No hover effects (mobile doesn't need them)
- No CSS Grid (using Flexbox instead)
- No custom event dispatch (use EventEmitter or Context/Redux)

## Future Enhancements

### Add Haptic Feedback

```typescript
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const handleSelectAvatar = (emoji: string, isLocked: boolean) => {
  if (!isLocked) {
    ReactNativeHapticFeedback.trigger('impactLight');
    setSelectedAvatar(emoji);
    saveAvatar(emoji);
  } else {
    ReactNativeHapticFeedback.trigger('notificationError');
  }
};
```

### Add Animated Selection

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

const handleSelectAvatar = (emoji: string, isLocked: boolean) => {
  if (!isLocked) {
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1);
    });
    setSelectedAvatar(emoji);
    saveAvatar(emoji);
  }
};

// In render:
<Animated.View style={[animatedStyle]}>
  <LinearGradient ...>
    {/* Avatar content */}
  </LinearGradient>
</Animated.View>
```

### Add Search/Filter

```typescript
const [searchQuery, setSearchQuery] = useState('');

const filteredAvatars = {
  free: avatars.free.filter((a) => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  ),
  pro: avatars.pro.filter((a) => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  ),
  master: avatars.master.filter((a) => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  ),
};

// Add search input in header:
<TextInput
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Keresés..."
  style={styles.searchInput}
/>
```

### Add Avatar Preview Modal

```typescript
import { Modal } from 'react-native';

const [previewAvatar, setPreviewAvatar] = useState<Avatar | null>(null);

// On long press:
<TouchableOpacity
  onPress={() => handleSelectAvatar(avatar.emoji, isLocked)}
  onLongPress={() => setPreviewAvatar(avatar)}
>
  {/* Avatar content */}
</TouchableOpacity>

// Modal:
<Modal visible={previewAvatar !== null} transparent>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.previewEmoji}>{previewAvatar?.emoji}</Text>
      <Text style={styles.previewName}>{previewAvatar?.name}</Text>
      <Text style={styles.previewRarity}>{previewAvatar?.rarity}</Text>
      <TouchableOpacity onPress={() => setPreviewAvatar(null)}>
        <Text>Bezárás</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
```

## Integration with TopBar/ProfilePage

### TopBar Integration

The TopBar should listen for avatar changes and update accordingly:

```typescript
// TopBar.tsx (web version uses storage event)
// In RN, use EventEmitter or Context

// Option 1: EventEmitter
import { EventEmitter } from 'events';
export const avatarEmitter = new EventEmitter();

// AvatarSelectorPage:
const handleSelectAvatar = (emoji: string, isLocked: boolean) => {
  if (!isLocked) {
    setSelectedAvatar(emoji);
    saveAvatar(emoji);
    avatarEmitter.emit('avatarChanged', emoji);
  }
};

// TopBar:
useEffect(() => {
  const listener = (emoji: string) => {
    setPlayerAvatar(emoji);
  };
  
  avatarEmitter.on('avatarChanged', listener);
  
  return () => {
    avatarEmitter.off('avatarChanged', listener);
  };
}, []);

// Option 2: React Context
const AvatarContext = createContext();

// In App.tsx:
const [avatar, setAvatar] = useState('🧙‍♂️');

<AvatarContext.Provider value={{ avatar, setAvatar }}>
  {/* App content */}
</AvatarContext.Provider>

// In AvatarSelectorPage:
const { setAvatar } = useContext(AvatarContext);

const handleSelectAvatar = (emoji: string, isLocked: boolean) => {
  if (!isLocked) {
    setSelectedAvatar(emoji);
    saveAvatar(emoji);
    setAvatar(emoji); // Update global context
  }
};

// In TopBar:
const { avatar } = useContext(AvatarContext);
```

## Color Reference

```typescript
const COLORS = {
  // Background
  slate900: '#0F172A',   // Main background
  purple900: '#581C87',  // Background gradient middle
  
  // Header
  purple700: '#7E22CE',  // Header gradient start
  purple800: '#6B21A8',  // Header gradient end, circle border
  purple500: '#A855F7',  // Border bottom
  
  // Current Avatar
  purple600: '#9333EA',  // Circle gradient start
  pink500: '#EC4899',    // Circle gradient end
  purple200: '#E9D5FF',  // Label text
  
  // Közönséges (Common)
  slate500: '#475569',   // Gradient start
  slate700: '#334155',   // Gradient end, badge background
  slate600: '#64748B',   // Border
  slate300: '#CBD5E1',   // Text, badge text
  
  // Ritka (Rare)
  blue600: '#2563EB',    // Gradient start, tier dot
  blue700: '#1D4ED8',    // Gradient end
  blue500: '#3B82F6',    // Border
  blue300: '#93C5FD',    // Text, badge text
  blue400: '#60A5FA',    // Crown icon, info card icon
  
  // Legendás (Legendary)
  purple600: '#9333EA',  // Gradient start, tier dot
  pink500: '#EC4899',    // Gradient end
  purple500: '#A855F7',  // Border
  purple100: '#D8B4FE',  // Text, badge text
  purple400: '#C084FC',  // Crown icon
  
  // Selected Badge
  green500: '#10B981',   // Background
  white: '#FFFFFF',      // Border, checkmark
};
```

## Styling Notes

- **3-column grid**: Each avatar button is `width: '31%'` to account for gaps
- **Gap property**: React Native 0.71+ supports gap in StyleSheet
- **Flex wrap**: `flexWrap: 'wrap'` creates multi-row grid
- **Shadow**: Use elevation on Android, shadowOffset/Opacity/Radius on iOS
- **Position absolute**: Selected badge and lock overlay use absolute positioning
- **BorderWidth**: Use SIZES constants (borderThin: 1, borderMedium: 2, borderThick: 4)
