# 🎯 SideMenu - React Native Útmutató

**Left-side navigation menu with 4 quick action buttons**

---

## 🚀 GYORS HASZNÁLAT (2 perc)

### **1. Telepítsd a függőségeket:**
```bash
npm install lucide-react-native
```

### **2. Másold a fájlt:**
```bash
cp exports/SideMenu.rn.tsx src/components/SideMenu.tsx
```

### **3. Használd:**
```tsx
import { SideMenu } from './components/SideMenu';

<SideMenu
  onLessonsClick={() => navigation.navigate('Lessons')}
  onShopClick={() => navigation.navigate('Shop')}
/>
```

**KÉSZ! 🎉**

---

## 📋 MI VAN BENNE?

### **4 menü gomb:**
| # | Ikon | Label | Szín | Állapot |
|---|------|-------|------|---------|
| 1 | 🛍️ ShoppingBag | Bolt | Yellow (#EAB308) | ✅ Active |
| 2 | 💬 MessageSquare | Üzenetek | Amber (#D97706) | ⏸️ Disabled |
| 3 | 📖 BookOpen | Leckék | Amber Dark (#B45309) | ✅ Active |
| 4 | ✨ Sparkles | Speciális | Orange (#EA580C) | ⏸️ Disabled |

### **Features:**
- 🎨 **Színes gombok** (4 különböző szín)
- 🔘 **TouchableOpacity** (press feedback)
- 🚫 **Disabled state** (Üzenetek, Speciális)
- 💡 **Icon + Label** (minden gombhoz)
- 📍 **Absolute positioned** (left side)
- ✨ **Shadow** (iOS + Android)

---

## 🎯 PROPS INTERFÉSZ

```tsx
interface SideMenuProps {
  onLessonsClick?: () => void;  // Leckék gomb callback
  onShopClick?: () => void;     // Bolt gomb callback
}
```

### **Használati példák:**

#### **Alap használat:**
```tsx
<SideMenu
  onLessonsClick={() => console.log('Leckék')}
  onShopClick={() => console.log('Bolt')}
/>
```

#### **React Navigation:**
```tsx
<SideMenu
  onLessonsClick={() => navigation.navigate('Lessons')}
  onShopClick={() => navigation.navigate('Shop')}
/>
```

#### **Állapot módosítás:**
```tsx
<SideMenu
  onLessonsClick={() => setCurrentScreen('lessons')}
  onShopClick={() => setCurrentScreen('shop')}
/>
```

---

## 📐 MENÜ KONFIGURÁCIÓ

### **MenuItem interfész:**
```tsx
interface MenuItem {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  backgroundColor: string;
  onClick?: () => void;  // undefined = disabled
}
```

### **Menü elemek:**
```tsx
const menuItems: MenuItem[] = [
  {
    icon: ShoppingBag,       // Lucide icon
    label: 'Bolt',
    backgroundColor: '#EAB308',  // Yellow
    onClick: onShopClick,    // ✅ Active
  },
  {
    icon: MessageSquare,
    label: 'Üzenetek',
    backgroundColor: '#D97706',  // Amber
    onClick: undefined,      // ⏸️ Disabled
  },
  // ... stb.
];
```

### **Új menü elem hozzáadása:**
```tsx
const getMenuItems = (...): MenuItem[] => [
  // ... meglévő elemek
  {
    icon: Star,  // Új icon
    label: 'Kedvencek',
    backgroundColor: '#10B981',  // Green
    onClick: onFavoritesClick,  // Új callback
  },
];
```

---

## 🎨 STYLING

### **Pozíció:**
```tsx
container: {
  position: 'absolute',  // ✅ RN támogatja
  left: 8,
  top: 111,  // TopBar alatt
  zIndex: 10,
}
```

### **Gomb méret:**
```tsx
const SIZES = {
  buttonSize: 56,    // 56x56 dp
  iconSize: 28,      // Icon méret
  radiusLG: 12,      // Border radius
  fontXS: 10,        // Label font size
};
```

### **Színek:**
```tsx
// Menü elem színek (gradient-szerűen):
#EAB308  // Yellow (Bolt)
#D97706  // Amber (Üzenetek)
#B45309  // Amber Dark (Leckék)
#EA580C  // Orange (Speciális)
```

### **Árnyék (iOS + Android):**
```tsx
iconContainer: {
  // iOS shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.15,
  shadowRadius: 15,
  
  // Android shadow
  elevation: 5,
}
```

### **Text shadow:**
```tsx
labelText: {
  // Text shadow (iOS + Android is támogatja)
  textShadowColor: 'rgba(0, 0, 0, 0.25)',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 4,
}
```

---

## 🔄 DISABLED STATE

### **Működés:**
```tsx
const isDisabled = !item.onClick;  // Ha nincs onClick, disabled

<TouchableOpacity
  disabled={isDisabled}          // Letiltja a press-t
  activeOpacity={isDisabled ? 1 : 0.7}  // Nincs opacity change
  style={[
    styles.menuItem,
    isDisabled && styles.menuItemDisabled,  // Opacity 0.7
  ]}
>
```

### **Disabled style:**
```tsx
menuItemDisabled: {
  opacity: 0.7,  // Halványabb megjelenés
}
```

### **Disabled elemek:**
- Üzenetek (MessageSquare)
- Speciális (Sparkles)

**Miért disabled?**
- Még nem implementált funkciók
- Vagy nem elérhető a felhasználónak (pl. subscription kell)

---

## 📱 TOUCH FEEDBACK

### **Web verzió:**
```tsx
// Hover, active, press states CSS-el:
onMouseEnter, onMouseLeave, onMouseDown, onMouseUp
transform: 'scale(1.05)'
```

### **React Native verzió:**
```tsx
<TouchableOpacity
  activeOpacity={0.7}  // Press feedback (automatic!)
  // ...
>
```

**TouchableOpacity előnyei:**
- Automatikus press feedback
- Nincs szükség manual scale animációra
- Platform-agnostic (iOS + Android)

---

## 🎯 PÉLDA HASZNÁLAT

### **MainScreen-ben:**
```tsx
import React from 'react';
import { View } from 'react-native';
import { SideMenu } from './components/SideMenu';

export function MainScreen() {
  const handleLessonsClick = () => {
    console.log('Navigating to Lessons...');
    // navigation.navigate('Lessons');
  };

  const handleShopClick = () => {
    console.log('Navigating to Shop...');
    // navigation.navigate('Shop');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Többi komponens */}
      
      {/* SideMenu - absolute positioned */}
      <SideMenu
        onLessonsClick={handleLessonsClick}
        onShopClick={handleShopClick}
      />
    </View>
  );
}
```

### **Navigációval (React Navigation):**
```tsx
import { useNavigation } from '@react-navigation/native';

export function MainScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <SideMenu
        onLessonsClick={() => navigation.navigate('Lessons')}
        onShopClick={() => navigation.navigate('Shop')}
      />
    </View>
  );
}
```

---

## ⚙️ TESTRESZABÁS

### **1. Új menü elem hozzáadása:**
```tsx
import { Heart } from 'lucide-react-native';

// Props bővítése:
interface SideMenuProps {
  onLessonsClick?: () => void;
  onShopClick?: () => void;
  onFavoritesClick?: () => void;  // ← Új!
}

// Menu items bővítése:
const getMenuItems = (..., onFavoritesClick?: () => void) => [
  // ... meglévő elemek
  {
    icon: Heart,
    label: 'Kedvencek',
    backgroundColor: '#10B981',  // Green
    onClick: onFavoritesClick,
  },
];
```

### **2. Pozíció módosítása:**
```tsx
container: {
  position: 'absolute',
  left: 16,    // ← Távolabb a széltől
  top: 150,    // ← Lejjebb
  // ...
}
```

### **3. Gomb méret módosítása:**
```tsx
const SIZES = {
  buttonSize: 64,    // ← Nagyobb gomb
  iconSize: 32,      // ← Nagyobb icon
  radiusLG: 16,      // ← Kerekebb
  fontXS: 12,        // ← Nagyobb text
};
```

### **4. Színek módosítása:**
```tsx
{
  icon: ShoppingBag,
  label: 'Bolt',
  backgroundColor: '#3B82F6',  // ← Blue
  onClick: onShopClick,
}
```

---

## 🐛 HIBAKERESÉS

### **1. Icons nem jelennek meg:**
```bash
# Ellenőrizd, hogy telepítve van-e:
npm list lucide-react-native

# Ha nincs:
npm install lucide-react-native
```

### **2. Position absolute nem működik:**
```tsx
// Szülő komponensnek kell layout-ot biztosítania:
<View style={{ flex: 1, position: 'relative' }}>
  <SideMenu />
</View>
```

### **3. Touch feedback nem működik:**
```tsx
// Ellenőrizd, hogy TouchableOpacity-t használsz:
import { TouchableOpacity } from 'react-native';

// NE használd a View-t gombként!
```

### **4. Disabled gombok még mindig kattinthatók:**
```tsx
<TouchableOpacity
  disabled={isDisabled}  // ← Ez fontos!
  // ...
>
```

### **5. Shadow nem látszik Androidon:**
```tsx
// Android elevation hozzáadása:
iconContainer: {
  // ...
  elevation: 5,  // ← Ez kell Androidhoz
}
```

---

## 📊 STATISZTIKÁK

| Metric | Érték |
|--------|-------|
| **Teljes sor** | ~170 |
| **Props** | 2 (onLessonsClick, onShopClick) |
| **Menu items** | 4 db |
| **Active items** | 2 (Bolt, Leckék) |
| **Disabled items** | 2 (Üzenetek, Speciális) |
| **Icons** | 4 (Lucide) |
| **Függőségek** | 1 (lucide-react-native) |
| **Konverzió idő** | 2 perc |
| **Komplexitás** | Alacsony |

---

## ✅ KONVERZIÓS ELLENŐRZŐ LISTA

- [x] SideMenu.rn.tsx létrehozva
- [x] TouchableOpacity használva (button helyett)
- [x] Inline styles → StyleSheet
- [x] Lucide icons (react-native verzió)
- [x] 4 menu item átmásolva
- [x] Disabled state implementálva
- [x] Absolute positioning (működik RN-ben)
- [x] Shadow (iOS + Android)
- [x] Text shadow (iOS + Android)
- [x] Kommentek hozzáadva

---

## 🎉 KÉSZ!

Most már van egy **teljes SideMenu React Native** komponensed!

**Mit kaptál:**
- ✅ 4 quick action gomb
- ✅ 2 active + 2 disabled
- ✅ Lucide icons
- ✅ Touch feedback (TouchableOpacity)
- ✅ Absolute positioning
- ✅ iOS + Android shadow
- ✅ Text shadow

**Következő lépés:**
→ Másold be és használd! 🎯✨

---

**Készült:** 2025-01-01  
**Verzió:** 1.0.0  
**Fájl:** `SideMenu.rn.tsx` (~170 sor)  
**Komplexitás:** Alacsony (egyszerű nav menu)
