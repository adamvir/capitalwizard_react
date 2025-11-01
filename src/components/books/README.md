# Books Komponensek - Könyv Olvasó Nézetek

Ez a mappa tartalmazza a különböző könyv olvasó komponenseket, amelyek teljes képernyős, lapozható digitális könyv élményt biztosítanak React Native-ben.

## Komponensek

### 1. StandaloneBookView

Általános célú könyv olvasó komponens szótárak és glossary típusú adatokhoz.

**Főbb jellemzők:**
- ✅ Lapozható tartalom animációval (előre/hátra)
- ✅ Borító oldal testreszabható színekkel
- ✅ Bevezető oldal statisztikákkal
- ✅ Tartalomjegyzék betűk szerint
- ✅ Betű címlapok
- ✅ Tartalom oldalak (3 fogalom/oldal)
- ✅ Hátsó borító
- ✅ Kategória címkék
- ✅ Oldal számozás
- ✅ Georgia font család (serif)

**Használat:**

```typescript
import { StandaloneBookView } from './components/books';

const glossaryData = [
  {
    id: '1',
    term: 'Részvény',
    definition: 'Részvény...',
    category: 'Értékpapír'
  },
  // ... további fogalmak
];

<StandaloneBookView
  title="Tőkepiaci Szótár"
  subtitle="Átfogó referencia"
  year={2025}
  data={glossaryData}
  onBack={() => setShowBook(false)}
  coverColors={['#0F172A', '#1E293B', '#0F172A']}
  accentColor="#FBBF24"
/>
```

**Props:**

| Prop | Típus | Alapértelmezett | Leírás |
|------|-------|----------------|--------|
| `data` | `BookViewTerm[]` | *kötelező* | Szótár adatok tömbje |
| `title` | `string` | "Tőkepiaci Szótár" | Könyv címe |
| `subtitle` | `string` | "Átfogó referencia" | Könyv alcíme |
| `year` | `number` | `new Date().getFullYear()` | Kiadás éve |
| `onBack` | `() => void` | *kötelező* | Bezárás callback |
| `coverColors` | `string[]` | `['#0F172A', '#1E293B', '#0F172A']` | Borító színei (LinearGradient) |
| `accentColor` | `string` | `'#FBBF24'` | Hangsúly szín |

**BookViewTerm interfész:**

```typescript
interface BookViewTerm {
  id: string;
  term: string;         // Fogalom neve
  definition: string;   // Fogalom definíciója
  category: string;     // Kategória
}
```

---

### 2. PenzugyiAlapismeretkBookView

Speciális könyv olvasó a "Pénzügyi Alapismeretek" könyv tartalmához. Előre definiált 61 oldalnyi tartalommal.

**Főbb jellemzők:**
- ✅ Lapozható oldalak animációval
- ✅ Fejezet és szakasz címek
- ✅ Címlap speciális formázással
- ✅ Vissza az elejére gomb
- ✅ Oldal számozás
- ✅ Navigációs lábléc fejezet információval
- ✅ Georgia font család (serif)
- ✅ Justify igazítású bekezdések

**Használat:**

```typescript
import { PenzugyiAlapismeretkBookView } from './components/books';

<PenzugyiAlapismeretkBookView
  onBack={() => setShowBook(false)}
/>
```

**Props:**

| Prop | Típus | Leírás |
|------|-------|--------|
| `onBack` | `() => void` | Bezárás callback |

**Tartalmi felépítés:**

A könyv 61 oldalból áll:
1. **Címlap** - "PÉNZÜGYI ALAPISMERETEK"
2. **Bevezetés** (5 oldal)
3. **A PÉNZ** fejezet (5 oldal)
4. **BEFEKTETÉS** fejezet
5. **PÉNZÜGYI KOCKÁZAT** fejezet (6 oldal)
6. **KOCKÁZATMEGOSZTÁS** fejezet (3 oldal)
7. **ZÁRÓ GONDOLATOK**

---

## Közös jellemzők

Mindkét komponens:
- ✅ **Modal alapú** - Teljes képernyős nézet
- ✅ **SafeAreaView** - Biztonságos terület kezelés
- ✅ **Animált lapozás** - react-native-reanimated SlideInRight/Left
- ✅ **ScrollView** - Scrollozható tartalom
- ✅ **LinearGradient** - Színátmenetes háttér
- ✅ **MaterialCommunityIcons** - Ikonok
- ✅ **Georgia font** - Elegáns serif betűtípus
- ✅ **Responsive** - Alkalmazkodik a képernyő méretéhez
- ✅ **Dark mode támogatás** - Sötét fejléc/lábléc

---

## Technológiai stack

**Függőségek:**
```json
{
  "react-native": "^0.76.x",
  "react-native-reanimated": "~3.16.x",
  "expo-linear-gradient": "~14.0.x",
  "@expo/vector-icons": "^14.0.x"
}
```

**Importált konstansok:**
```typescript
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS } from '../../utils/styleConstants';
```

---

## Stílus és formázás

### Font család
- **iOS**: 'Georgia' (beépített serif font)
- **Android**: 'serif' (rendszer serif font)

### Színpaletta

**StandaloneBookView:**
- Háttér: Meleg sárga/bézs gradiens (#FFFBEB, #FFEDD5, #FEF3C7)
- Borító: Testreszabható (alapértelmezett: sötét szürke)
- Hangsúly: Arany (#FBBF24)

**PenzugyiAlapismeretkBookView:**
- Háttér: Meleg sárga (#FFFBEB, #FEF3C7)
- Fejléc/Lábléc: Sötét szürke gradiens (#1E293B, #334155)
- Hangsúly: Arany (#D97706, #FCD34D)

### Tipográfia
- **Címlap**: 30-48px, extrabold
- **Fejezetek**: 24px, bold, kiemelve aláhúzással
- **Szakaszok**: 20px, semibold
- **Szövegtörzs**: 14px, normal, justify igazítás
- **Lábjegyzetek**: 12px, light

---

## Navigáció

### Lapozás módok
1. **Gombok**: Előző/Következő gombok (lábléc)
2. **Oldalsó nyilak**: Bal/jobb oldali navigációs gombok (csak StandaloneBookView)
3. **Tartalomjegyzék**: Kattintható betűk (csak StandaloneBookView)

### Animációk
- **Előre lapozás**: SlideInRight + SlideOutLeft (300ms)
- **Hátra lapozás**: SlideInLeft + SlideOutRight (300ms)
- **Easing**: Spring animáció (természetes mozgás)

---

## Példa integráció

```typescript
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import {
  StandaloneBookView,
  PenzugyiAlapismeretkBookView
} from './components/books';

export function BookShelf() {
  const [activeBook, setActiveBook] = useState<'glossary' | 'penzugy' | null>(null);

  const glossaryData = [
    {
      id: '1',
      term: 'Részvény',
      definition: 'Egy vállalat tulajdonjogát megtestesítő értékpapír.',
      category: 'Értékpapír'
    },
    // ... további fogalmak
  ];

  return (
    <View>
      <Button
        title="Tőkepiaci Szótár"
        onPress={() => setActiveBook('glossary')}
      />
      <Button
        title="Pénzügyi Alapismeretek"
        onPress={() => setActiveBook('penzugy')}
      />

      {activeBook === 'glossary' && (
        <StandaloneBookView
          title="Tőkepiaci Szótár"
          subtitle="Átfogó referencia"
          data={glossaryData}
          onBack={() => setActiveBook(null)}
        />
      )}

      {activeBook === 'penzugy' && (
        <PenzugyiAlapismeretkBookView
          onBack={() => setActiveBook(null)}
        />
      )}
    </View>
  );
}
```

---

## Testreszabás

### StandaloneBookView színek

```typescript
// Sötét borító
<StandaloneBookView
  coverColors={['#0F172A', '#1E293B', '#0F172A']}
  accentColor="#FBBF24"
  {...props}
/>

// Kék borító
<StandaloneBookView
  coverColors={['#1E40AF', '#1E3A8A', '#1E40AF']}
  accentColor="#60A5FA"
  {...props}
/>

// Zöld borító
<StandaloneBookView
  coverColors={['#065F46', '#064E3B', '#065F46']}
  accentColor="#34D399"
  {...props}
/>
```

---

## Optimalizáció tippek

1. **Nagy adathalmazok**: A StandaloneBookView 300+ fogalomnál is jól teljesít
2. **Lazy loading**: Az oldalak csak megjelenítéskor renderelődnek
3. **Memória**: Az animációk GPU-gyorsítottak (react-native-reanimated)
4. **Scroll teljesítmény**: `showsVerticalScrollIndicator={false}` gyorsabb scrollt eredményez

---

## Ismert problémák és megoldások

### Android serif font
- **Probléma**: Androdon nincs beépített Georgia font
- **Megoldás**: `Platform.select({ ios: 'Georgia', android: 'serif' })`

### Modal bezárás
- **Probléma**: Android back gomb nem zárja be a modalt
- **Megoldás**: `onRequestClose={onBack}` prop beállítva

### Hosszú tartalom
- **Probléma**: Nagyon hosszú oldalak nem férnek el
- **Megoldás**: ScrollView minden oldalon

---

## Továbbfejlesztési lehetőségek

- [ ] Könyvjelző funkció (mentés AsyncStorage-be)
- [ ] Keresés a tartalomban
- [ ] Highlight és jegyzetek
- [ ] PDF export
- [ ] Hang felolvasás (text-to-speech)
- [ ] Éjszakai mód
- [ ] Betűméret állítás
- [ ] Offline támogatás
- [ ] Több könyv támogatása dinamikusan

---

## Licensz

Ezek a komponensek a projekt részei, ugyanaz a licensz vonatkozik rájuk.

**Utolsó frissítés:** 2025. január
