# ProfilePage - React Native Conversion Guide

## Overview
Profil képernyő - Statisztikák és személyes adatok view/edit móddal.

## Changes from Web Version

### 1. Layout & Styling
- ❌ `<div>` → ✅ `<View>`
- ❌ `<button>` → ✅ `<TouchableOpacity>` + `<LinearGradient>`
- ❌ `<h1>`, `<h2>`, `<span>` → ✅ `<Text>`
- ❌ `<input>` → ✅ `<TextInput>`
- ❌ `<textarea>` → ✅ `<TextInput multiline>`
- ❌ `backdropFilter: 'blur(8px)'` → ✅ Remove (not supported)
- ❌ Hover effects (onMouseEnter/Leave) → ✅ Remove (not needed)
- ❌ `position: sticky` → ✅ Remove (use fixed header in ScrollView)
- ❌ `overflowY: 'auto'` → ✅ `<ScrollView>`

### 2. Storage
- ❌ `localStorage` → ✅ `AsyncStorage`
- ❌ Synchronous `loadProfile()` → ✅ Async `await loadProfile()`
- ❌ Synchronous `saveProfile()` → ✅ Async `await saveProfile()`

### 3. Components
- ❌ lucide-react → ✅ lucide-react-native
- ✅ KeyboardAvoidingView wrapper for inputs
- ✅ ScrollView for content overflow
- ✅ LinearGradient for backgrounds and tier badge

### 4. Date Picker
- ❌ `<input type="date">` → ✅ `<TextInput>` (can use DateTimePicker library)
- Web uses native date picker, RN needs external library or manual input

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
const loadProfile = (): UserProfile => {
  const saved = localStorage.getItem('user_profile');
  if (saved) {
    return JSON.parse(saved);
  }
  return DEFAULT_PROFILE;
};

const saveProfile = (profile: UserProfile) => {
  localStorage.setItem('user_profile', JSON.stringify(profile));
};

// RN:
const loadProfile = async (): Promise<UserProfile> => {
  const saved = await AsyncStorage.getItem('user_profile');
  if (saved) {
    return JSON.parse(saved);
  }
  return DEFAULT_PROFILE;
};

const saveProfile = async (profile: UserProfile): Promise<void> => {
  await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
};

// Usage in component:
useEffect(() => {
  loadProfile().then((loadedProfile) => {
    setProfile(loadedProfile);
    setEditedProfile(loadedProfile);
  });
}, []);
```

### Input Fields

```typescript
// WEB:
<input
  type="text"
  value={editedProfile.name}
  onChange={(e) => handleChange('name', e.target.value)}
  style={styles.input}
  placeholder="Teljes név"
  onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'}
/>

// RN:
<TextInput
  value={editedProfile.name}
  onChangeText={(text) => handleChange('name', text)}
  style={styles.input}
  placeholder="Teljes név"
  placeholderTextColor={COLORS.slate500}
/>
```

### Textarea

```typescript
// WEB:
<textarea
  value={editedProfile.bio}
  onChange={(e) => handleChange('bio', e.target.value)}
  style={styles.textarea}
  placeholder="Írj magadról..."
  rows={3}
/>

// RN:
<TextInput
  value={editedProfile.bio}
  onChangeText={(text) => handleChange('bio', text)}
  style={styles.textarea}
  placeholder="Írj magadról..."
  placeholderTextColor={COLORS.slate500}
  multiline
  numberOfLines={3}
  textAlignVertical="top"
/>
```

### Progress Bar

```typescript
// WEB:
<div style={styles.progressBar}>
  <div style={styles.progressFill(xpProgress)}></div>
</div>

// RN:
<View style={styles.progressBar}>
  <LinearGradient
    colors={[COLORS.blue500, COLORS.cyan500]}
    style={[styles.progressFill, { width: `${xpProgress}%` }]}
  />
</View>
```

### Tier Badge

```typescript
// WEB:
<div style={styles.tierBadge(subscriptionTier)}>
  {(subscriptionTier === 'master' || subscriptionTier === 'pro') && (
    <Crown />
  )}
  <span>Master</span>
</div>

// RN:
<LinearGradient
  colors={tierColors.gradient}
  style={styles.tierBadge}
>
  {(subscriptionTier === 'master' || subscriptionTier === 'pro') && (
    <Crown size={SIZES.iconSM} color={COLORS.white} />
  )}
  <Text style={[styles.tierBadgeText, { color: tierColors.textColor }]}>
    Master
  </Text>
</LinearGradient>
```

## Component Structure

### 1. KeyboardAvoidingView Wrapper
Ensures keyboard doesn't cover inputs on mobile.

```typescript
<KeyboardAvoidingView
  style={styles.container}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  {/* Content */}
</KeyboardAvoidingView>
```

### 2. Header (Fixed)
Back button, title, edit/save button.

### 3. ScrollView Content
- Stats Card (Level, XP, Coins, Gems, Tier)
- Profile Info Card (Fields)
- Save Button (when editing)

## Edit/View Mode Toggle

### View Mode
- All fields are read-only `<View>` containers with `<Text>`
- Shows "Nem megadva" placeholder if empty
- Edit button shows Edit2 icon

### Edit Mode
- All fields become `<TextInput>`
- Cancel button (X) appears next to "Személyes Adatok"
- Edit button becomes Save button (checkmark icon)
- Save button appears at bottom

## Stats Card

### Level Progress
- TrendingUp icon
- "Szint X" text
- XP text (current / total)
- Progress bar with gradient fill

### Resources Grid
2-column grid:
1. **Coins** (Gold icon, amber color)
2. **Gems** (Gem icon, cyan color)

### Tier Badge
- **Free**: Gray background, no icon
- **Pro**: Blue→Cyan gradient, Crown icon
- **Master**: Purple→Pink gradient, Crown icon

## Profile Fields

1. **Name** (User icon)
   - TextInput (text)
   - Placeholder: "Teljes név"

2. **Email** (Mail icon)
   - TextInput (email keyboard)
   - Placeholder: "email@example.com"
   - autoCapitalize="none"

3. **Birth Date** (Calendar icon)
   - TextInput (manual input)
   - Placeholder: "YYYY-MM-DD"
   - Can replace with DateTimePicker

4. **Location** (MapPin icon)
   - TextInput (text)
   - Placeholder: "Város, Ország"

5. **Bio** (No icon)
   - TextInput (multiline)
   - Placeholder: "Írj magadról..."
   - 3 lines, textAlignVertical="top"

## Navigation Setup

```typescript
// App.tsx (React Navigation Stack)
<Stack.Screen 
  name="ProfilePage" 
  component={ProfilePage}
  options={{ headerShown: false }}
/>

// MainScreen.tsx (or wherever you navigate from)
navigation.navigate('ProfilePage', {
  playerLevel: 5,
  coins: 1200,
  gems: 50,
  subscriptionTier: 'pro',
});

// ProfilePage.tsx
const navigation = useNavigation();
const route = useRoute();
const { playerLevel, coins, gems, subscriptionTier } = route.params;

const handleBack = () => {
  navigation.goBack();
};
```

## XP Calculation

```typescript
const xpForCurrentLevel = playerLevel * 1000;
const currentXp = 650; // This should come from props/state
const xpProgress = Math.min((currentXp / xpForCurrentLevel) * 100, 100);
```

Formula:
- Each level requires `level * 1000` XP
- Level 5 = 5000 XP to next level
- Progress bar shows percentage (0-100%)

## AsyncStorage Keys

```typescript
const PROFILE_STORAGE_KEY = 'user_profile';
```

Stored data structure:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "birthDate": "1995-05-15",
  "location": "Budapest, Hungary",
  "bio": "I love learning finance!"
}
```

## Testing Checklist

1. ✅ Back button navigates correctly
2. ✅ Stats card renders (Level, XP, Coins, Gems, Tier)
3. ✅ Tier badge shows correct color/icon
4. ✅ Progress bar fills correctly
5. ✅ Edit button toggles to Save button
6. ✅ All fields become TextInput in edit mode
7. ✅ Cancel button discards changes
8. ✅ Save button persists changes
9. ✅ Profile loads from AsyncStorage on mount
10. ✅ Profile saves to AsyncStorage on change
11. ✅ Keyboard avoidance works
12. ✅ ScrollView scrolls correctly
13. ✅ Placeholder text shows when fields empty
14. ✅ Email keyboard type works
15. ✅ Multiline bio input works

## Props Reference

```typescript
interface ProfilePageProps {
  onBack: () => void;              // Callback for back button
  playerLevel: number;             // Current player level
  coins: number;                   // Total coins
  gems?: number;                   // Total gems (default: 0)
  subscriptionTier?: 'free' | 'pro' | 'master'; // Tier (default: 'free')
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
- Date picker is manual text input (can add DateTimePicker library)
- No custom event dispatch (use EventEmitter or Context/Redux)
- No CSS transitions (can add with Animated API)

## Future Enhancements

### Add DateTimePicker for Birth Date

```bash
npm install @react-native-community/datetimepicker
```

```typescript
import DateTimePicker from '@react-native-community/datetimepicker';

const [showDatePicker, setShowDatePicker] = useState(false);

const handleDateChange = (event: any, selectedDate?: Date) => {
  setShowDatePicker(false);
  if (selectedDate) {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    handleChange('birthDate', formattedDate);
  }
};

// In render:
{isEditing ? (
  <>
    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
      <View style={styles.input}>
        <Text style={{ color: COLORS.white }}>
          {editedProfile.birthDate || 'Válassz dátumot'}
        </Text>
      </View>
    </TouchableOpacity>
    {showDatePicker && (
      <DateTimePicker
        value={editedProfile.birthDate ? new Date(editedProfile.birthDate) : new Date()}
        mode="date"
        display="default"
        onChange={handleDateChange}
      />
    )}
  </>
) : (
  // ... display mode
)}
```

### Add Profile Photo Upload

```bash
npm install react-native-image-picker
```

```typescript
import { launchImageLibrary } from 'react-native-image-picker';

const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

const handleSelectPhoto = () => {
  launchImageLibrary(
    {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.8,
    },
    (response) => {
      if (response.assets && response.assets[0]) {
        setProfilePhoto(response.assets[0].uri);
      }
    }
  );
};

// Add to profile data:
interface UserProfile {
  // ... existing fields
  profilePhoto?: string;
}
```

### Add Event Emitter for Profile Updates

```typescript
import { EventEmitter } from 'events';

export const profileEmitter = new EventEmitter();

const handleSave = () => {
  setProfile(editedProfile);
  setIsEditing(false);
  
  // Emit event for other components to listen
  profileEmitter.emit('profileUpdated', editedProfile);
};

// In other components:
useEffect(() => {
  const listener = (profile: UserProfile) => {
    console.log('Profile updated:', profile);
    // Update UI
  };
  
  profileEmitter.on('profileUpdated', listener);
  
  return () => {
    profileEmitter.off('profileUpdated', listener);
  };
}, []);
```

### Add Form Validation

```typescript
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleSave = () => {
  // Validate email
  if (editedProfile.email && !validateEmail(editedProfile.email)) {
    Alert.alert('Hiba', 'Érvénytelen email cím');
    return;
  }
  
  // Validate birth date
  if (editedProfile.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(editedProfile.birthDate)) {
    Alert.alert('Hiba', 'Érvénytelen dátum formátum (YYYY-MM-DD)');
    return;
  }
  
  setProfile(editedProfile);
  setIsEditing(false);
};
```

## Integration with MainScreen

```typescript
// MainScreen.tsx
const [playerLevel, setPlayerLevel] = useState(5);
const [coins, setCoins] = useState(1200);
const [gems, setGems] = useState(50);
const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro' | 'master'>('pro');

const handleOpenProfile = () => {
  navigation.navigate('ProfilePage', {
    playerLevel,
    coins,
    gems,
    subscriptionTier,
  });
};
```

## Color Reference

```typescript
const COLORS = {
  // Tier badges
  purple500: '#A855F7',  // Master gradient start
  pink500: '#EC4899',    // Master gradient end
  blue500: '#3B82F6',    // Pro gradient start
  cyan500: '#06B6D4',    // Pro gradient end
  slate700: '#334155',   // Free background
  
  // Resources
  amber500: '#F59E0B',   // Coins icon background
  amber300: '#FCD34D',   // Coins value text
  cyan500: '#06B6D4',    // Gems icon background
  cyan300: '#67E8F9',    // Gems value text
  
  // Actions
  green600: '#16A34A',   // Save button
  green700: '#15803D',   // Save button gradient end
  red600: '#DC2626',     // Cancel button
  
  // Text
  white: '#FFFFFF',      // Primary text
  blue300: '#93C5FD',    // Field labels, XP text
  slate500: '#64748B',   // Placeholder text
};
```

## Styling Notes

- **KeyboardAvoidingView**: Prevents keyboard from covering inputs
- **ScrollView**: Allows scrolling when content overflows
- **Gap property**: React Native 0.71+ supports gap in StyleSheet
- **Flex: 1**: Resource cards use flex: 1 for equal width
- **BorderWidth**: Use SIZES.borderThin (1) for consistency
- **Shadow**: Use elevation on Android, shadowOffset/Opacity/Radius on iOS
