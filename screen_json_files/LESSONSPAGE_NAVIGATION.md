# LessonsPage - Hogyan jutsz el oda?

## 📍 Mi az a LessonsPage?

A **LessonsPage** egy teljes képernyős oldal, ahol:
- ✅ Látod az összes kölcsönzött könyvedet
- ✅ Minden könyvhöz látod a 6 fejezetet (pages)
- ✅ Minden fejezethez 3 lecke típus: 📖 Olvasás, 🔗 Párosítás, ❓ Kvíz
- ✅ Látod melyik leckét fejezted be (zöld pipa)
- ✅ Látod melyik a jelenlegi lecke (sárga kör)
- ✅ **MANUÁLISAN** kiválaszthatsz bármelyik leckét és elindíthatod

**KÜLÖNBSÉG a MainScreen-hez képest:**
- **MainScreen:** "Továbbhaladás" gomb → automatikusan a következő lecke
- **LessonsPage:** Lecke lista → manuálisan választasz egy leckét

---

## 🗺️ NAVIGÁCIÓ - Hogyan jutsz el oda?

### 1️⃣ MÓDSZER: SideMenu bal oldali gomb

```
MainScreen
   ↓
Bal oldalt 3. gomb: "📚 Leckék" (BookOpen ikon, barna szín)
   ↓
LessonsPage megnyílik
```

**Kód:**
```typescript
// App.tsx
const handleLessonsClick = () => {
  setCurrentPage('lessons');  // ← Ez vált át
};

// MainScreen renderben:
<SideMenu 
  onLessonsClick={handleLessonsClick}  // ← Átadja a callback-et
  onShopClick={handleShopClick}
/>

// SideMenu.tsx
menuItems = [
  { icon: ShoppingBag, label: 'Bolt', onClick: onShopClick },
  { icon: MessageSquare, label: 'Üzenetek', onClick: undefined },
  { icon: BookOpen, label: 'Leckék', onClick: onLessonsClick }, // ← ITT!
  { icon: Sparkles, label: 'Speciális', onClick: undefined },
]
```

---

### 2️⃣ MÓDSZER: Lecke befejezése után (pendingReturnToLessons)

Ha **MANUÁLISAN** választottál egy leckét (nem a "Továbbhaladás" gombbal), akkor a lecke befejezése után automatikusan visszakerülsz a LessonsPage-re:

```
LessonsPage (manuális lecke választás)
   ↓
ReadingGame / MatchingGame / QuizGame
   ↓
Lecke befejezve
   ↓
LessonsPage (vissza, hogy újat válassz)
```

**Kód:**
```typescript
// App.tsx - handleLessonComplete()
if (pendingReturnToLessons) {
  console.log('↩️ Returning to lessons page (manual mode)');
  setPendingReturnToLessons(false);
  setCurrentPage('lessons');  // ← Visszatér a LessonsPage-re
}
```

---

## 🎮 LessonsPage UI Felépítés

```
┌─────────────────────────────────────────┐
│  ← Vissza                               │  ← Header (vissza gomb)
│                                         │
│  📚 Leckéim                             │  ← Cím
│  Válassz könyvet és leckét              │  ← Alcím
├─────────────────────────────────────────┤
│                                         │
│  📖 Pénzügyi Alapismeretek (KÖLCSÖNZÖTT)│  ← Könyv cím
│  ┌───────────────────────────────────┐ │
│  │ 1. Fejezet: Pénzügyi alapok       │ │  ← Fejezet (page)
│  │   ✅ 1. Lecke - 📖 Olvasás        │ │  ← Lecke (completed)
│  │   ✅ 2. Lecke - 🔗 Párosítás      │ │  ← Lecke (completed)
│  │   🟡 3. Lecke - ❓ Kvíz           │ │  ← Lecke (current)
│  │                                   │ │
│  │ 2. Fejezet: Hitel és kölcsön      │ │
│  │   ⚪ 4. Lecke - 📖 Olvasás        │ │  ← Lecke (available)
│  │   ⚪ 5. Lecke - 🔗 Párosítás      │ │
│  │   ⚪ 6. Lecke - ❓ Kvíz           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  📗 Másik könyv (HA van kölcsönzött)   │
│  ...                                    │
└─────────────────────────────────────────┘
```

---

## 🔑 Kulcs Funkciók

### Props:
```typescript
interface LessonsPageProps {
  onBack: () => void;  // Vissza gomb (→ MainScreen)
  
  onStartLesson: (
    bookTitle: string,      // pl. "Pénzügyi Alapismeretek"
    lessonIndex: number,    // 0-5 (page index)
    gameType: 'reading' | 'matching' | 'quiz'
  ) => void;  // Lecke indítása
  
  currentBookLessonIndex: number;  // Jelenlegi page index
  currentGameType: 'reading' | 'matching' | 'quiz';  // Jelenlegi game type
  isFirstRound: boolean;  // Első kör (lecke 1-18) vagy második (19-24)
}
```

### State-ek:
```typescript
const [rentedBooks, setRentedBooks] = useState<RentedBook[]>([]);
const [availableBooks, setAvailableBooks] = useState<AvailableBook[]>([]);
const [selectedBook, setSelectedBook] = useState<string | null>(null);
const [lessonProgress, setLessonProgress] = useState<LessonProgress>({});
```

### Lecke állapotok:
- ✅ **completed:** Zöld pipa, lecke befejezve
- 🟡 **current:** Sárga kör, jelenlegi lecke (ha MainScreen-ről jöttél)
- ⚪ **available:** Kék kör, elérhető lecke
- 🔒 **locked:** NINCS! (Minden lecke elérhető)

---

## 🧭 React Native Navigation

**FONTOS:** React Native-ben a navigation másként működik!

```typescript
// Web verzió (App.tsx):
const [currentPage, setCurrentPage] = useState('main');

// ❌ React Native-ben ez NEM így működik!
// ✅ React Navigation stack-et kell használni:

// NAVIGATION FIX - React Native:
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// MainScreen-ről:
<SideMenu 
  onLessonsClick={() => navigation.navigate('Lessons')}
/>

// LessonsPage-ről vissza:
<TouchableOpacity onPress={() => navigation.goBack()}>
  <ArrowLeft />
</TouchableOpacity>

// Lecke indítás:
const handleLessonClick = (pageIndex, gameType) => {
  navigation.navigate('LessonGame', {
    bookTitle: selectedBook,
    lessonIndex: pageIndex,
    gameType: gameType
  });
};
```

---

## 📦 Dependencies (React Native-hez)

```bash
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install lucide-react-native
```

---

## 🎯 Összefoglalás

**Ahol most vagy:** MainScreen  
**Hova akarsz menni:** LessonsPage  
**Hogyan:** Bal oldali 3. gomb (📚 BookOpen ikon, barna)  

**Mit látsz a LessonsPage-en:**
1. Kölcsönzött könyvek listája
2. Minden könyvhöz 6 fejezet (pages)
3. Minden fejezethez 3 lecke (reading, matching, quiz)
4. Lecke állapotok (completed, current, available)
5. Kattintással elindítasz egy leckét

**Mit csinál a LessonsPage:**
- Betölti a `localStorage`-ből a kölcsönzött könyveket
- Betölti a lecke progress-t (`lessonProgress` object)
- Mutatja melyik leckék vannak befejezve
- Meghívja `onStartLesson(bookTitle, pageIndex, gameType)` amikor leckét választasz
