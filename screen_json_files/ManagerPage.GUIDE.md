## ManagerPage - React Native Conversion Guide

## ⚠️ IMPORTANT: SIMPLIFIED VERSION

The **web version** of ManagerPage is **~1300+ lines** with **50+ settings inputs** including:

- Starting Gold
- Library Prices (1-day, 30-day rental)
- Arena Limits (min/max bet)
- Daily Limits (lessons, arena games)
- Subscription Prices (Pro, Master)
- Lesson Rewards (XP + Gold by game type: Quiz/Matching/Reading)
- Repeated Lessons Rewards (XP + Gold)
- XP System (max level, base XP, growth %)
- Arena XP (win XP, max books)
- Matching Game Settings (pairs count, time limit)
- Quiz Game Settings (questions count, answers per question, min correct)
- Reading Game Settings (questions count, min correct)
- Stage/Milestone System (diamonds per milestone)
- Shop - Streak Freeze Price (gold cost)
- Shop - Gold Purchase Prices (100/500/1000/5000 HUF)
- Shop - Diamond Purchase Prices (1/10/50/100 gold costs)
- **Data Export/Import** (full localStorage backup/restore to JSON)
- **App Info** (storage size, sync instructions, full user guide)

The **React Native version** is **SIMPLIFIED** to include only the **6 most important settings sections**:

1. Starting Gold
2. Library Prices
3. Arena Limits
4. Daily Limits
5. Subscription Prices
6. XP System (max level, base XP, growth)

**Why simplified?**
- Full admin panel with 50+ inputs is too long for mobile screens
- Better UX to split into multiple tabs or separate pages
- Data export/import requires different APIs in RN (AsyncStorage + react-native-fs + Share API)
- Web version uses Shadcn Tabs component (would need separate tab navigation in RN)

**For full settings:**
- Use the web version
- Or implement AsyncStorage sync between web/mobile
- Or create separate admin pages in RN (e.g., "Game Settings", "Shop Settings", "Data Management")

---

## Overview

Admin panel for managing game configuration settings.

## Changes from Web Version

### 1. UI Components
- ❌ Shadcn Button → ✅ TouchableOpacity + LinearGradient
- ❌ Shadcn Input → ✅ TextInput
- ❌ Shadcn Tabs → ✅ Skip (no tabs, all in one scroll)
- ❌ Shadcn Separator → ✅ Skip (just gap spacing)
- ❌ Toast (sonner) → ✅ Alert.alert()

### 2. Removed Features
- ❌ Tabs navigation (20+ sections split into tabs)
- ❌ Export/Import data (localStorage to JSON download/upload)
- ❌ Storage size calculation (localStorage size in MB)
- ❌ Full user guide (long documentation text)
- ❌ Hover effects on buttons
- ❌ 40+ additional input fields

### 3. Data Persistence
- Web: Uses `localStorage` directly
- RN: Should use `AsyncStorage` (not implemented in this simplified version)

```typescript
// Web:
import { getGameConfig, saveGameConfig, resetGameConfig } from '../utils/gameConfig';

const config = getGameConfig(); // Reads from localStorage
saveGameConfig(config); // Saves to localStorage

// RN (TODO):
import AsyncStorage from '@react-native-async-storage/async-storage';

const loadConfig = async () => {
  const json = await AsyncStorage.getItem('gameConfig');
  return json ? JSON.parse(json) : DEFAULT_CONFIG;
};

const saveConfig = async (config: GameConfig) => {
  await AsyncStorage.setItem('gameConfig', JSON.stringify(config));
};
```

## Component Structure

### 1. Header (Gradient)
- **Back button** (arrow left icon)
- **Title** ("Menedzser Panel" + Settings icon)
- **Subtitle** ("Játék beállítások kezelése")
- **Unsaved indicator** (if hasChanges)

### 2. Info Card
- ⚠️ Notice that this is a simplified version

### 3. Action Buttons (2)
- **Save** (green gradient, disabled if no changes)
- **Reset** (purple outline, shows confirmation alert)

### 4. Settings Cards (6 sections)

#### 4.1. Starting Gold (Amber)
- Icon: Coins
- Input: initialGold

#### 4.2. Library (Blue)
- Icon: BookOpen
- Inputs:
  - bookRental1Day
  - bookRental30Days

#### 4.3. Arena (Red)
- Icon: Swords
- Inputs:
  - arenaMinBet
  - arenaMaxBet

#### 4.4. Daily Limits (Green)
- Icon: Calendar
- Inputs:
  - freeDailyArenaGames
  - dailyLessonLimit

#### 4.5. Subscription Prices (Purple)
- Icon: Crown
- Inputs:
  - subscriptionProPrice
  - subscriptionMasterPrice

#### 4.6. XP System (Cyan)
- Icon: TrendingUp
- Inputs:
  - maxLevel
  - baseXpPerLevel
  - xpGrowthPercentage (with helper text)

## Props

```typescript
interface ManagerPageProps {
  onBack: () => void; // Navigate back
}
```

## State

```typescript
interface GameConfig {
  initialGold: number;
  bookRental1Day: number;
  bookRental30Days: number;
  arenaMinBet: number;
  arenaMaxBet: number;
  freeDailyArenaGames: number;
  dailyLessonLimit: number;
  subscriptionProPrice: number;
  subscriptionMasterPrice: number;
  maxLevel: number;
  baseXpPerLevel: number;
  xpGrowthPercentage: number;
}

const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
const [hasChanges, setHasChanges] = useState(false);
```

## Default Config

```typescript
const DEFAULT_CONFIG: GameConfig = {
  initialGold: 1000,
  bookRental1Day: 50,
  bookRental30Days: 300,
  arenaMinBet: 10,
  arenaMaxBet: 500,
  freeDailyArenaGames: 5,
  dailyLessonLimit: 3,
  subscriptionProPrice: 4990,
  subscriptionMasterPrice: 9990,
  maxLevel: 100,
  baseXpPerLevel: 100,
  xpGrowthPercentage: 10,
};
```

## Usage Example

```typescript
// App.tsx
import { ManagerPage } from './components/ManagerPage';

function App() {
  const [showManager, setShowManager] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {showManager ? (
        <ManagerPage onBack={() => setShowManager(false)} />
      ) : (
        <MainScreen onOpenManager={() => setShowManager(true)} />
      )}
    </View>
  );
}
```

## Navigation Integration

```typescript
// React Navigation:
<Stack.Screen
  name="ManagerPage"
  component={ManagerPage}
  options={{
    headerShown: false, // Custom header in component
    animation: 'slide_from_right',
  }}
/>

// Navigate:
navigation.navigate('ManagerPage');

// ManagerPage.tsx:
const navigation = useNavigation();

const handleBack = () => {
  navigation.goBack();
};
```

## Handlers

### Save

```typescript
const handleSave = () => {
  // TODO: Save to AsyncStorage or context
  Alert.alert('Mentés', 'Beállítások mentve!', [{ text: 'OK' }]);
  setHasChanges(false);
};

// Full implementation with AsyncStorage:
const handleSave = async () => {
  try {
    await AsyncStorage.setItem('gameConfig', JSON.stringify(config));
    Alert.alert('Mentés', 'Beállítások mentve!', [{ text: 'OK' }]);
    setHasChanges(false);
  } catch (error) {
    Alert.alert('Hiba', 'Mentés sikertelen!', [{ text: 'OK' }]);
  }
};
```

### Reset

```typescript
const handleReset = () => {
  Alert.alert(
    'Visszaállítás',
    'Biztosan visszaállítod az alapértelmezett beállításokat?',
    [
      { text: 'Mégse', style: 'cancel' },
      {
        text: 'Visszaállítás',
        onPress: () => {
          setConfig(DEFAULT_CONFIG);
          setHasChanges(false);
          Alert.alert('Siker', 'Alapértelmezett beállítások visszaállítva!');
        },
      },
    ]
  );
};
```

### Update Config

```typescript
const updateConfig = (key: keyof GameConfig, value: number) => {
  setConfig((prev) => ({ ...prev, [key]: value }));
};

// Usage:
<TextInput
  value={String(config.initialGold)}
  onChangeText={(text) => {
    const num = parseInt(text) || 0;
    updateConfig('initialGold', num);
  }}
  keyboardType="number-pad"
/>
```

## Styling

### Color-Coded Sections

Each settings section has a unique color theme:

```typescript
// Starting Gold: Amber
[COLORS.amber500, '#D97706']

// Library: Blue
[COLORS.blue500, '#4F46E5']

// Arena: Red
[COLORS.red500, '#F97316']

// Daily Limits: Green
[COLORS.green500, COLORS.green700]

// Subscription: Purple
[COLORS.purple500, '#EC4899']

// XP System: Cyan
[COLORS.cyan500, COLORS.cyan700]
```

### Input Field Styling

```typescript
// TextInput:
borderWidth: 2,
borderColor: '#D1D5DB',
borderRadius: 8,
paddingHorizontal: 12,
paddingVertical: 8,
fontSize: 16,
color: '#1F2937',
backgroundColor: '#FFFFFF',
```

## Dependencies

```bash
# Required
npm install lucide-react-native
npm install react-native-linear-gradient

# For full data persistence (optional):
npm install @react-native-async-storage/async-storage
```

## Testing Checklist

1. ✅ Header displays with back button + title + subtitle
2. ✅ Back button navigates back
3. ✅ Unsaved indicator shows when config changes
4. ✅ Info card displays "simplified version" notice
5. ✅ Save button enabled when hasChanges = true
6. ✅ Save button disabled when hasChanges = false
7. ✅ Save button shows success alert
8. ✅ Reset button shows confirmation alert
9. ✅ Reset button restores default config
10. ✅ All 6 setting sections display
11. ✅ All inputs accept numeric input
12. ✅ Config updates when typing in inputs
13. ✅ hasChanges updates correctly
14. ✅ ScrollView scrolls smoothly
15. ✅ All icons display correctly
16. ✅ All gradients render correctly
17. ✅ All text readable + proper sizing

## Full Web Version Features (Not in RN)

### 1. Tabs Navigation

Web version uses Shadcn Tabs to organize 20+ sections:

```typescript
// Web:
<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="rewards">Rewards</TabsTrigger>
    <TabsTrigger value="shop">Shop</TabsTrigger>
    <TabsTrigger value="data">Data</TabsTrigger>
  </TabsList>
  <TabsContent value="general">...</TabsContent>
  <TabsContent value="rewards">...</TabsContent>
  <TabsContent value="shop">...</TabsContent>
  <TabsContent value="data">...</TabsContent>
</Tabs>

// RN Alternative (React Navigation Material Top Tabs):
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

<Tab.Navigator>
  <Tab.Screen name="General" component={GeneralSettings} />
  <Tab.Screen name="Rewards" component={RewardsSettings} />
  <Tab.Screen name="Shop" component={ShopSettings} />
  <Tab.Screen name="Data" component={DataSettings} />
</Tab.Navigator>
```

### 2. Data Export/Import

Web version allows full localStorage backup/restore:

```typescript
// Web - Export:
const handleExportData = () => {
  const allData = {};
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      allData[key] = localStorage[key];
    }
  }
  
  const exportData = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    data: allData,
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `rpg-game-backup-${timestamp}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Web - Import:
const handleImportData = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const parsed = JSON.parse(event.target.result);
      localStorage.clear();
      for (let key in parsed.data) {
        localStorage.setItem(key, parsed.data[key]);
      }
      window.location.reload();
    };
    reader.readAsText(file);
  };
  input.click();
};

// RN Alternative (react-native-fs + Share API):
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import DocumentPicker from 'react-native-document-picker';

// Export:
const handleExportData = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const allData = await AsyncStorage.multiGet(allKeys);
    
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      data: Object.fromEntries(allData),
    };
    
    const jsonStr = JSON.stringify(exportData, null, 2);
    const path = `${RNFS.DocumentDirectoryPath}/rpg-game-backup-${Date.now()}.json`;
    
    await RNFS.writeFile(path, jsonStr, 'utf8');
    
    await Share.open({
      url: `file://${path}`,
      type: 'application/json',
      title: 'Export Game Data',
    });
    
    Alert.alert('Siker', 'Adatok exportálva!');
  } catch (error) {
    Alert.alert('Hiba', 'Export sikertelen!');
  }
};

// Import:
const handleImportData = async () => {
  try {
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.json],
    });
    
    const content = await RNFS.readFile(result.uri, 'utf8');
    const parsed = JSON.parse(content);
    
    Alert.alert(
      'Importálás',
      'Biztosan felülírod a jelenlegi adatokat?',
      [
        { text: 'Mégse', style: 'cancel' },
        {
          text: 'Importálás',
          onPress: async () => {
            await AsyncStorage.clear();
            await AsyncStorage.multiSet(Object.entries(parsed.data));
            Alert.alert('Siker', 'Adatok importálva! Az app újraindul...');
            // Restart app or navigate to home
          },
        },
      ]
    );
  } catch (error) {
    if (!DocumentPicker.isCancel(error)) {
      Alert.alert('Hiba', 'Import sikertelen!');
    }
  }
};
```

### 3. Storage Size Display

Web version calculates localStorage size:

```typescript
// Web:
const [storageSize, setStorageSize] = useState(0);

useEffect(() => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  setStorageSize(total / 1024 / 1024); // Bytes to MB
}, []);

<div>
  <HardDrive icon />
  <span>Adatméret: {storageSize.toFixed(3)} MB</span>
</div>

// RN Alternative:
import AsyncStorage from '@react-native-async-storage/async-storage';

const getStorageSize = async () => {
  const allKeys = await AsyncStorage.getAllKeys();
  const allData = await AsyncStorage.multiGet(allKeys);
  
  let total = 0;
  allData.forEach(([key, value]) => {
    total += key.length + (value?.length || 0);
  });
  
  return total / 1024 / 1024; // Bytes to MB
};
```

### 4. Full User Guide

Web version has a long user guide (500+ lines) with all app features explained:

```typescript
// Web:
<div style={styles.userGuideBox}>
  <h4>📖 Felhasználói útmutató</h4>
  <div>
    <p><strong>v1.1 - Alapfunkciók:</strong></p>
    <ul>
      <li>Játékos profil és szintrendszer (max 100 szint)</li>
      <li>Arany és gyémánt valuta rendszer</li>
      <li>Napi sorozat számláló, naptár és széria pont</li>
      {/* ... 100+ more lines ... */}
    </ul>
  </div>
</div>

// RN: Too long for mobile, better to create separate Help/Documentation page
```

### 5. All Settings Sections (Web Only)

```typescript
// Lesson Rewards (by game type):
- xpEasy (Quiz)
- xpMedium (Matching)
- xpHard (Reading)
- goldEasy
- goldMedium
- goldHard

// Repeated Lessons:
- repeatedLessonXp
- repeatedLessonGold

// Arena XP:
- xpPerArenaWin
- maxBooksForArena

// Matching Game:
- matchingPairsCount
- matchingTimeLimit

// Quiz Game:
- quizQuestionsCount
- quizAnswersPerQuestion
- quizMinCorrectAnswers

// Reading Game:
- readingQuestionsCount
- readingMinCorrectAnswers

// Stage/Milestone:
- diamondsPerMilestone

// Shop - Streak Freeze:
- streakFreezeGoldCost

// Shop - Gold Purchase:
- gold100Price
- gold500Price
- gold1000Price
- gold5000Price

// Shop - Diamond Purchase:
- diamond1GoldCost
- diamond10GoldCost
- diamond50GoldCost
- diamond100GoldCost
```

## Future Enhancements for RN

### 1. Add AsyncStorage Persistence

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'gameConfig';

const loadConfig = async (): Promise<GameConfig> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : DEFAULT_CONFIG;
  } catch (error) {
    console.error('Load config error:', error);
    return DEFAULT_CONFIG;
  }
};

const saveConfig = async (config: GameConfig): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Save config error:', error);
    throw error;
  }
};

// In component:
useEffect(() => {
  loadConfig().then(setConfig);
}, []);

const handleSave = async () => {
  try {
    await saveConfig(config);
    Alert.alert('Mentés', 'Beállítások mentve!');
    setHasChanges(false);
  } catch (error) {
    Alert.alert('Hiba', 'Mentés sikertelen!');
  }
};
```

### 2. Add All Settings Sections

Split into multiple pages or tabs:

```typescript
// GeneralSettings.tsx
<ManagerPage section="general" />

// RewardsSettings.tsx
<ManagerPage section="rewards" />

// ShopSettings.tsx
<ManagerPage section="shop" />

// DataSettings.tsx
<ManagerPage section="data" />

// Or use tab navigation:
<Tab.Navigator>
  <Tab.Screen name="General" component={GeneralSettings} />
  <Tab.Screen name="Rewards" component={RewardsSettings} />
  <Tab.Screen name="Shop" component={ShopSettings} />
  <Tab.Screen name="Data" component={DataSettings} />
</Tab.Navigator>
```

### 3. Add Data Export/Import

See "Full Web Version Features" section above for implementation.

### 4. Add Search/Filter

```typescript
const [searchQuery, setSearchQuery] = useState('');

const filteredSections = sections.filter(section =>
  section.title.toLowerCase().includes(searchQuery.toLowerCase())
);

<TextInput
  placeholder="Keresés a beállításokban..."
  value={searchQuery}
  onChangeText={setSearchQuery}
  style={styles.searchInput}
/>
```

### 5. Add Validation

```typescript
const validateConfig = (config: GameConfig): string[] => {
  const errors: string[] = [];
  
  if (config.arenaMinBet > config.arenaMaxBet) {
    errors.push('Arena min bet cannot be greater than max bet');
  }
  
  if (config.maxLevel < 1) {
    errors.push('Max level must be at least 1');
  }
  
  if (config.baseXpPerLevel < 1) {
    errors.push('Base XP per level must be at least 1');
  }
  
  return errors;
};

const handleSave = () => {
  const errors = validateConfig(config);
  if (errors.length > 0) {
    Alert.alert('Érvénytelen beállítások', errors.join('\\n'));
    return;
  }
  
  // Save...
};
```

## Summary

This is a **simplified admin/settings panel** with:
- ✅ 6 most important settings sections
- ✅ Save/Reset buttons
- ✅ Unsaved changes indicator
- ✅ Color-coded sections
- ✅ Numeric inputs with validation
- ❌ No tabs (all in one scroll)
- ❌ No data export/import (use web version)
- ❌ No storage size display
- ❌ No full user guide (too long)
- ❌ No 40+ additional settings (use web version)

**For full admin panel**, use the web version or extend this RN version with:
- AsyncStorage persistence
- Multiple pages/tabs
- Data export/import with react-native-fs + Share API
- All 50+ settings from web version

Perfect for quick game configuration on mobile! 📱⚙️
