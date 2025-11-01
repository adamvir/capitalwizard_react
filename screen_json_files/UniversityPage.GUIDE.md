# 🎓 UniversityPage - React Native Útmutató

**University Campus screen with slide-up menu and building selection**

---

## 🚀 GYORS HASZNÁLAT (5 perc)

### **1. Telepítsd a függőségeket:**
```bash
npm install react-native-linear-gradient lucide-react-native
cd ios && pod install && cd ..
```

### **2. Add hozzá a campus map image-et:**
```
assets/
└── campus_map.png
```

**Web verzió import:**
```tsx
import campusMap from 'figma:asset/c558539c9d306455dfd5af15f072594f408ff9a0.png';
```

**RN verzió:**
```tsx
<Image source={require('../assets/campus_map.png')} />
```

### **3. Másold a fájlt:**
```bash
cp exports/UniversityPage.rn.tsx src/components/UniversityPage.tsx
```

### **4. Használd:**
```tsx
import { UniversityPage } from './components/UniversityPage';

<UniversityPage
  onBack={() => navigation.goBack()}
  onOpenBookView={(bookTitle) => console.log('Open:', bookTitle)}
  coins={680}
  onCoinsChange={(newCoins) => setCoins(newCoins)}
/>
```

**KÉSZ! 🎉**

---

## 📋 MI VAN BENNE?

### **Screen elemek:**
1. 📸 **Campus map background** (Image)
2. 💎 **3× Crystal effects** (animated pulse)
3. 🏢 **Slide-up menu** (6 building)
4. 🔍 **Building selection modal**
5. 📚 **LibraryPage integration** (Könyvtár)

### **6 épület:**
| # | Név | Icon | Szín | Funkció |
|---|-----|------|------|---------|
| 1 | Recepció | 🏢 Building2 | Purple | Disabled |
| 2 | Könyvtár | 📖 BookOpen | Blue | ✅ Opens LibraryPage |
| 3 | Előadó | 👥 Users | Indigo | Disabled |
| 4 | Vizsgáztató | 📝 FileCheck | Red | Disabled |
| 5 | Tanulmányi osztály | 🎓 GraduationCap | Green | Disabled |
| 6 | Kollégium | 🏠 Home | Orange | Disabled |

---

## 🎯 PROPS INTERFÉSZ

```tsx
interface UniversityPageProps {
  onBack: () => void;                        // Vissza gomb callback
  onOpenBookView: (bookTitle: string) => void;  // Könyv megnyitás
  coins: number;                             // Játékos érmék
  onCoinsChange: (newCoins: number) => void;   // Érmék módosítás
}
```

### **Használati példák:**

#### **React Navigation:**
```tsx
<UniversityPage
  onBack={() => navigation.goBack()}
  onOpenBookView={(bookTitle) => {
    navigation.navigate('BookView', { bookTitle });
  }}
  coins={playerCoins}
  onCoinsChange={(newCoins) => setPlayerCoins(newCoins)}
/>
```

#### **State management:**
```tsx
const [showUniversity, setShowUniversity] = useState(false);

{showUniversity && (
  <UniversityPage
    onBack={() => setShowUniversity(false)}
    onOpenBookView={handleOpenBook}
    coins={coins}
    onCoinsChange={setCoins}
  />
)}
```

---

## 📸 CAMPUS MAP IMAGE

### **Web verzió:**
```tsx
import campusMap from 'figma:asset/...png';

<img src={campusMap} alt="Campus Map" style={...} />
```

### **React Native verzió:**
```tsx
<Image
  source={require('../assets/campus_map.png')}
  style={styles.campusImage}
  resizeMode="cover"
/>
```

### **Image elhelyezés:**
```
project/
├── assets/
│   └── campus_map.png   ← Campus térkép
└── components/
    └── UniversityPage.tsx
```

### **Alternatíva - Remote image:**
```tsx
<Image
  source={{ uri: 'https://your-cdn.com/campus_map.png' }}
  style={styles.campusImage}
  resizeMode="cover"
/>
```

---

## 💎 CRYSTAL ANIMATIONS

### **3 crystal effect:**
```tsx
// Crystal 1 (top-left)
{
  top: 40,
  left: 40,
  width: 80,
  height: 112,
  rotation: '12deg',
  delay: 0s,
}

// Crystal 2 (top-right)
{
  top: 80,
  right: 64,
  width: 64,
  height: 96,
  rotation: '-6deg',
  delay: 1s,
}

// Crystal 3 (bottom-left)
{
  bottom: 128,
  left: 80,
  width: 48,
  height: 80,
  rotation: '6deg',
  delay: 2s,
}
```

### **Pulse animation:**
```tsx
// Animated.Value: 0.3 → 0.6 → 0.3 (loop)
const crystal1Opacity = useRef(new Animated.Value(0.3)).current;

Animated.loop(
  Animated.sequence([
    Animated.delay(0),      // Stagger
    Animated.timing(animValue, {
      toValue: 0.6,
      duration: 2000,
      useNativeDriver: true,
    }),
    Animated.timing(animValue, {
      toValue: 0.3,
      duration: 2000,
      useNativeDriver: true,
    }),
  ])
).start();
```

---

## 🏢 SLIDE-UP MENU

### **Működés:**
- **Kezdő állapot:** 56px látszik (tab/handle)
- **Open állapot:** Teljes menu látszik (max 400px)
- **Animation:** 500ms ease-out

### **Animation:**
```tsx
const slideUpAnim = useRef(new Animated.Value(SCREEN_HEIGHT - 56)).current;

// Menu toggle
Animated.timing(slideUpAnim, {
  toValue: menuOpen ? 0 : SCREEN_HEIGHT - 56,
  duration: 500,
  useNativeDriver: false,  // translateY needs false
}).start();
```

### **Tab/Handle button:**
```tsx
<TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
  <LinearGradient colors={[...]} style={styles.tabButton}>
    <View style={styles.tabContent}>
      <Map /> <Text>Épületek Térképe</Text>
    </View>
    <ChevronUp style={{ rotate: menuOpen ? '180deg' : '0deg' }} />
  </LinearGradient>
</TouchableOpacity>
```

### **Building grid:**
```tsx
<ScrollView style={styles.buildingsScrollView}>
  <View style={styles.buildingsGrid}>
    {BUILDINGS.map((building) => (
      <TouchableOpacity key={building.id} onPress={...}>
        <LinearGradient colors={building.colors}>
          <View style={styles.buildingNumberBadge}>
            <Text>{building.number}</Text>
          </View>
          <building.icon />
          <Text>{building.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    ))}
  </View>
</ScrollView>
```

---

## 🔍 BUILDING SELECTION MODAL

### **Megjelenés:**
- Modal (fade animation)
- Selected building info
- "Hamarosan elérhető..." placeholder
- Close button (X icon)

### **Logic:**
```tsx
const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

const handleBuildingClick = (buildingId: string) => {
  setSelectedBuilding(buildingId);
  setMenuOpen(false);

  if (buildingId === 'library') {
    setShowLibrary(true);  // Special case: Library
  }
};
```

### **Modal content:**
```tsx
{selectedBuilding && selectedBuilding !== 'library' && (
  <Modal transparent visible animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.selectedBuildingModal}>
        <LinearGradient colors={[...]} style={styles.modalContent}>
          {/* Building icon + text */}
          <Text style={styles.modalTitle}>{building.name}</Text>
          <Text style={styles.modalSubtitle}>Hamarosan elérhető...</Text>
          <Text style={styles.modalDescription}>
            Itt tudsz majd különböző tevékenységeket végezni.
          </Text>
          
          {/* Close button */}
          <TouchableOpacity onPress={handleCloseModal}>
            <X />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  </Modal>
)}
```

---

## 📚 LIBRARYPAGE INTEGRATION

### **Special case: Könyvtár (Library):**
```tsx
if (showLibrary) {
  return (
    <View style={styles.libraryOverlay}>
      <LibraryPage
        onBack={handleCloseLibrary}
        onOpenBookView={onOpenBookView}
        coins={coins}
        onCoinsChange={onCoinsChange}
      />
    </View>
  );
}
```

### **LibraryPage props:**
```tsx
interface LibraryPageProps {
  onBack: () => void;
  onOpenBookView: (bookTitle: string) => void;
  coins: number;
  onCoinsChange: (newCoins: number) => void;
}
```

### **Integration lépések:**
1. Import LibraryPage komponens
2. Pass props (onBack, onOpenBookView, coins, onCoinsChange)
3. Full-screen overlay (zIndex: 50)

**Megjegyzés:** A placeholder comment-ből vedd ki a LibraryPage-et amikor kész!

---

## 🎨 BUILDING COLORS

| Building | Gradient |
|----------|----------|
| Recepció | Purple (#A855F7 → #7C3AED) |
| Könyvtár | Blue (#3B82F6 → #1D4ED8) |
| Előadó | Indigo (#6366F1 → #4338CA) |
| Vizsgáztató | Red (#EF4444 → #B91C1C) |
| Tanulmányi osztály | Green (#10B981 → #047857) |
| Kollégium | Orange (#F97316 → #C2410C) |

---

## 📱 PÉLDA HASZNÁLAT

### **MainApp.tsx:**
```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { UniversityPage } from './components/UniversityPage';

export function MainApp() {
  const [showUniversity, setShowUniversity] = useState(false);
  const [coins, setCoins] = useState(680);

  const handleOpenBook = (bookTitle: string) => {
    console.log('Opening book:', bookTitle);
    // Navigate to BookView or show BookReader
  };

  return (
    <View style={{ flex: 1 }}>
      {showUniversity ? (
        <UniversityPage
          onBack={() => setShowUniversity(false)}
          onOpenBookView={handleOpenBook}
          coins={coins}
          onCoinsChange={setCoins}
        />
      ) : (
        <MainScreen
          onUniversityClick={() => setShowUniversity(true)}
        />
      )}
    </View>
  );
}
```

---

## ⚙️ TESTRESZABÁS

### **1. Campus map módosítása:**
```tsx
// Másik image használata:
<Image
  source={require('../assets/my_custom_map.png')}
  style={styles.campusImage}
/>
```

### **2. Crystal effektek kikapcsolása:**
```tsx
// crystalContainer kommentezd ki:
{/* <View style={styles.crystalContainer}>...</View> */}
```

### **3. Új épület hozzáadása:**
```tsx
const BUILDINGS: Building[] = [
  // ... meglévő épületek
  {
    id: 'cafeteria',
    name: 'Kávézó',
    icon: Coffee,  // lucide-react-native
    colors: ['#8B5CF6', '#6D28D9'],
    number: 7,
  },
];
```

### **4. Building funkció aktiválása:**
```tsx
// reception épület aktiválása:
const handleBuildingClick = (buildingId: string) => {
  setSelectedBuilding(buildingId);
  setMenuOpen(false);

  if (buildingId === 'library') {
    setShowLibrary(true);
  } else if (buildingId === 'reception') {
    // Új funkció!
    navigation.navigate('Reception');
  }
};
```

---

## 🐛 HIBAKERESÉS

### **1. Campus map image nem jelenik meg:**
```bash
# Ellenőrizd az image path-et:
assets/campus_map.png

# Vagy használj remote URL-t:
source={{ uri: 'https://...' }}
```

### **2. Gradients nem jelennek meg:**
```bash
npm install react-native-linear-gradient
cd ios && pod install && cd ..
```

### **3. Slide-up menu nem animál:**
```tsx
// useNativeDriver: false kell translateY-hoz!
Animated.timing(slideUpAnim, {
  toValue: ...,
  duration: 500,
  useNativeDriver: false,  // ← Fontos!
}).start();
```

### **4. Modal nem nyílik meg:**
```tsx
// Ellenőrizd a state-et:
console.log('selectedBuilding:', selectedBuilding);

// Modal visibility:
{selectedBuilding && selectedBuilding !== 'library' && (
  <Modal transparent visible>...</Modal>
)}
```

### **5. LibraryPage nem jelenik meg:**
```tsx
// Uncomment a LibraryPage import-ot:
import { LibraryPage } from './LibraryPage';

// És a render-ben:
if (showLibrary) {
  return (
    <LibraryPage
      onBack={handleCloseLibrary}
      // ...
    />
  );
}
```

---

## 📊 STATISZTIKÁK

| Metric | Érték |
|--------|-------|
| **Teljes sor** | ~750 |
| **Props** | 4 |
| **Buildings** | 6 |
| **Animations** | 4 (3× crystal + 1× slide-up) |
| **Modals** | 1 (building detail) |
| **Gradients** | 8+ |
| **Images** | 1 (campus map) |
| **Függőségek** | 2 npm package |
| **Konverzió idő** | 15 perc |
| **Komplexitás** | Közepes-Magas |

---

## ✅ KONVERZIÓS ELLENŐRZŐ LISTA

- [x] UniversityPage.rn.tsx létrehozva
- [x] Campus map image (Image component)
- [x] Crystal animations (3× Animated.Value)
- [x] Slide-up menu (Animated translateY)
- [x] 6 building button (LinearGradient)
- [x] Building selection modal
- [x] LibraryPage integration (placeholder)
- [x] Inline styles → StyleSheet
- [x] LinearGradient használva (8+×)
- [x] Lucide icons (react-native verzió)
- [x] Absolute positioning (működik RN-ben)
- [x] Shadow (iOS + Android)
- [x] Kommentek hozzáadva

---

## 🎉 KÉSZ!

Most már van egy **teljes UniversityPage React Native** komponensed!

**Mit kaptál:**
- ✅ Campus map background
- ✅ 3× animated crystal effects
- ✅ Slide-up menu (500ms animation)
- ✅ 6 building button (gradient backgrounds)
- ✅ Building selection modal
- ✅ LibraryPage integration
- ✅ iOS + Android shadow
- ✅ Responsive design

**Következő lépés:**
1. Add hozzá a `campus_map.png` image-et
2. Másold be a komponenst
3. Uncomment a LibraryPage import-ot
4. Használd! 🎓✨

---

**Készült:** 2025-01-01  
**Verzió:** 1.0.0  
**Fájl:** `UniversityPage.rn.tsx` (~750 sor)  
**Komplexitás:** Közepes-Magas (animations + modal + integration)
