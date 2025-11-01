# React Native / Flutter Konverziós Útmutató

## Áttekintés
Ez az alkalmazás át lett strukturálva úgy, hogy könnyen konvertálható legyen React Native vagy Flutter platformra. Az alábbi útmutató bemutatja a konverziós folyamatot és a mintákat.

## Főbb változtatások

### 1. Közös Stílus Konstansok (`/utils/styleConstants.ts`)
Minden szín, méret, távolság és egyéb stílus paraméter egy központi fájlban van definiálva.

```typescript
import { COLORS, SIZES, SPACING, FONT_WEIGHT } from '../utils/styleConstants';
```

**React Native konverzió:**
```typescript
// A COLORS, SIZES, SPACING objektumok közvetlenül használhatóak
// Csak importálni kell őket
```

**Flutter konverzió:**
```dart
// Dart konstans fájl létrehozása
class AppColors {
  static const Color primary = Color(0xFF3B82F6);
  static const Color white = Color(0xFFFFFFFF);
  // ... stb
}
```

### 2. Inline Style Objektumok

#### WEB verzió (jelenlegi):
```tsx
const styles = {
  container: {
    position: 'absolute' as const,
    top: 24,
    left: 16,
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    borderRadius: SIZES.radiusLG,
  }
};

<div style={styles.container}>...</div>
```

#### React Native konverzió:
```tsx
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 24,
    left: 16,
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    borderRadius: SIZES.radiusLG,
  }
});

<View style={styles.container}>...</View>
```

#### Flutter konverzió:
```dart
Widget build(BuildContext context) {
  return Positioned(
    top: 24,
    left: 16,
    child: Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppSizes.radiusLG),
      ),
      padding: EdgeInsets.all(AppSpacing.base),
      child: ...
    ),
  );
}
```

### 3. Komponens Struktúra

Minden komponens ugyanazt a struktúrát követi:

```tsx
// ============================================
// KOMPONENS NÉV
// Rövid leírás a komponensről
// ============================================

interface KomponensProps {
  // Props típusok
}

export function Komponens({ prop1, prop2 }: KomponensProps) {
  
  // ===== STATE MANAGEMENT =====
  // useState hook-ok kommentekkel
  const [state1, setState1] = useState(initialValue);
  
  // ===== EFFECTS =====
  // useEffect hook-ok kommentekkel
  useEffect(() => {
    // Effect logika
  }, [dependencies]);
  
  // ===== HELPER FUNCTIONS =====
  // Segédfüggvények
  const helperFunction = () => {
    // Logika
  };
  
  // ===== EVENT HANDLERS =====
  // Eseménykezelők
  const handleClick = () => {
    // Klikk logika
  };
  
  // ===== STYLES =====
  // Stílusok a komponens alján
  const styles = {
    container: { /* ... */ },
    text: { /* ... */ },
  };
  
  return (
    <div style={styles.container}>
      {/* JSX */}
    </div>
  );
}
```

### 4. Navigáció

#### WEB verzió:
```tsx
// Navigációs állapot
const [currentPage, setCurrentPage] = useState<'main' | 'profile'>('main');

// Navigációs handler
const handleNavigateToProfile = () => {
  setCurrentPage('profile');
};

// Feltételes renderelés
{currentPage === 'main' && <MainPage />}
{currentPage === 'profile' && <ProfilePage />}
```

#### React Native konverzió:
```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainPage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Navigálás
navigation.navigate('Profile');
```

### 5. Eseménykezelés

#### WEB verzió:
```tsx
const handlePress = () => {
  console.log('Pressed!');
};

<button onClick={handlePress} style={styles.button}>
  Click me
</button>
```

#### React Native konverzió:
```tsx
import { TouchableOpacity, Text } from 'react-native';

<TouchableOpacity onPress={handlePress} style={styles.button}>
  <Text>Click me</Text>
</TouchableOpacity>
```

### 6. Szöveg Renderelés

#### WEB verzió:
```tsx
<span style={styles.text}>Szöveg</span>
```

#### React Native konverzió:
```tsx
import { Text } from 'react-native';

<Text style={styles.text}>Szöveg</Text>
```

### 7. Ikonok

#### WEB verzió:
```tsx
import { User, Settings } from 'lucide-react';

<User style={{ width: 24, height: 24, color: COLORS.white }} />
```

#### React Native konverzió:
```tsx
import Icon from 'react-native-vector-icons/Feather';

<Icon name="user" size={24} color={COLORS.white} />
```

### 8. ScrollView

#### WEB verzió:
```tsx
<div style={{ overflowY: 'auto', height: 500 }}>
  {/* tartalom */}
</div>
```

#### React Native konverzió:
```tsx
import { ScrollView } from 'react-native';

<ScrollView style={{ height: 500 }}>
  {/* tartalom */}
</ScrollView>
```

### 9. Képek

#### WEB verzió:
```tsx
import { ImageWithFallback } from './components/figma/ImageWithFallback';

<ImageWithFallback 
  src="https://example.com/image.jpg"
  alt="Leírás"
  style={{ width: 100, height: 100 }}
/>
```

#### React Native konverzió:
```tsx
import { Image } from 'react-native';

<Image 
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 100, height: 100 }}
/>
```

### 10. localStorage

#### WEB verzió:
```tsx
// Mentés
localStorage.setItem('key', JSON.stringify(data));

// Betöltés
const data = JSON.parse(localStorage.getItem('key') || '{}');
```

#### React Native konverzió:
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mentés
await AsyncStorage.setItem('key', JSON.stringify(data));

// Betöltés
const dataStr = await AsyncStorage.getItem('key');
const data = JSON.parse(dataStr || '{}');
```

## Konvertált Komponensek

### Már konvertálva (inline style-okkal):
- ✅ `/utils/styleConstants.ts` - Központi stílus konstansok
- ✅ `/components/PhoneFrame.tsx` - iPhone keret
- ✅ `/components/TopBar.tsx` - Felső állapotsor
- ✅ `/components/PlayerStatusBar.tsx` - Játékos állapot
- ✅ `/components/EventCards.tsx` - Esemény kártyák
- ✅ `/components/SideMenu.tsx` - Oldalsó menü

### Még konvertálandó:
- ⏳ `/App.tsx` - Fő alkalmazás (nagy fájl)
- ⏳ `/components/CharacterLineup.tsx`
- ⏳ `/components/LessonGame.tsx`
- ⏳ `/components/QuizGame.tsx`
- ⏳ `/components/ReadingGame.tsx`
- ⏳ `/components/ArenaPage.tsx`
- ⏳ `/components/UniversityPage.tsx`
- ⏳ További komponensek...

## Konverziós Checklist

Amikor egy komponenst konvertálsz:

1. ✅ Import `COLORS`, `SIZES`, `SPACING`, `FONT_WEIGHT` from `styleConstants`
2. ✅ Távolítsd el az összes Tailwind class-t (`className`)
3. ✅ Hozz létre `styles` objektumot a komponens alján
4. ✅ Használj inline style-okat: `style={styles.container}`
5. ✅ Kommenteld a kód szekciót (STATE, EFFECTS, HANDLERS, STYLES)
6. ✅ Event handler-ek legyenek világosak és kommentezettek
7. ✅ Kerüld a web-specifikus dolgokat (később: `div` → `View`, `span` → `Text`)
8. ✅ Konstansokat használj hard-coded értékek helyett

## Példa: Teljes Komponens Konverzió

### ELŐTTE (Tailwind):
```tsx
export function Button({ label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      {label}
    </button>
  );
}
```

### UTÁNA (Inline styles):
```tsx
import { COLORS, SIZES, SPACING } from '../utils/styleConstants';

// ============================================
// BUTTON KOMPONENS
// Általános gomb komponens
// ============================================

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  
  // ===== EVENT HANDLERS =====
  const handleClick = () => {
    onClick();
  };
  
  // ===== STYLES =====
  const styles = {
    button: {
      paddingLeft: SPACING.base,
      paddingRight: SPACING.base,
      paddingTop: SPACING.sm,
      paddingBottom: SPACING.sm,
      backgroundColor: COLORS.primary,
      color: COLORS.white,
      borderRadius: SIZES.radiusLG,
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
  };
  
  return (
    <button 
      onClick={handleClick}
      style={styles.button}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#2563EB';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = COLORS.primary;
      }}
    >
      {label}
    </button>
  );
}
```

## További Megjegyzések

- **Flexbox**: A Flexbox ugyanúgy működik React Native-ben is
- **Position absolute**: React Native-ben is támogatott
- **Transform**: React Native-ben arrays-ként kell megadni: `transform: [{ translateX: 50 }]`
- **Shadow**: Web-en `boxShadow`, React Native-en külön `shadowColor`, `shadowOffset`, stb.
- **Border**: React Native-ben külön border property-k vannak minden oldalra

## Hasznos eszközök

- **React Native Paper**: Material Design komponensek
- **React Navigation**: Navigáció React Native-ben
- **Expo**: React Native fejlesztői eszköz
- **FlutterFlow**: Visual Flutter fejlesztés

## Összefoglalás

Ez a strukturált megközelítés garantálja, hogy:
1. ✅ A kód könnyen érthető és karbantartható
2. ✅ Minden stílus egy helyen van definiálva
3. ✅ A komponensek konzisztens struktúrát követnek
4. ✅ A konverzió React Native/Flutter-re egyszerű
5. ✅ A kód self-documenting kommentekkel ellátott
