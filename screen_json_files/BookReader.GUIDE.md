# 📖 BookReader - React Native Útmutató

**Book reading screen with page-by-page navigation and book-like design**

---

## 🚀 GYORS HASZNÁLAT (5 perc)

### **1. Telepítsd a függőségeket:**
```bash
npm install react-native-linear-gradient lucide-react-native
cd ios && pod install && cd ..
```

### **2. Másold a fájlt:**
```bash
cp exports/BookReader.rn.tsx src/components/BookReader.tsx
```

### **3. Használd:**
```tsx
import { BookReader } from './components/BookReader';

const bookContent = `
ELSŐ FEJEZET

Bevezetés a pénzügyekbe

A pénzügyi alapismeretek fontosak az életben...


MÁSODIK FEJEZET

Befektetési alapfogalmak

A befektetés hosszú távú vagyonépítés...
`;

<BookReader
  title="Pénzügyi Alapismeretek"
  content={bookContent}
  onBack={() => navigation.goBack()}
/>
```

**KÉSZ! 🎉**

---

## 📋 MI VAN BENNE?

### **Screen elemek:**
1. 📖 **Book header** (title + page counter + close button)
2. 📄 **Page content** (scrollable, book-like design)
3. 🎨 **Auto-formatting** (chapter titles, section titles, paragraphs)
4. ◀️▶️ **Navigation** (prev/next buttons + page info)
5. 🎞️ **Page transition** (fade animation)

### **Főbb funkciók:**
| Funkció | Leírás |
|---------|--------|
| **Page splitting** | Content split by `'\n\n\n'` (3 newlines) |
| **Chapter detection** | ALL CAPS lines (< 50 chars) |
| **Section detection** | Title Case lines (< 100 chars, no period) |
| **Paragraph rendering** | Regular text with justify alignment |
| **Page navigation** | Prev/Next buttons (disabled at edges) |
| **Page counter** | "X / Y oldal" display |
| **Fade animation** | Smooth page transitions |

---

## 🎯 PROPS INTERFÉSZ

```tsx
interface BookReaderProps {
  title: string;       // Book title (displayed in header)
  content: string;     // Full book content (split by '\n\n\n')
  onBack: () => void;  // Close button callback
}
```

### **Használati példák:**

#### **Basic usage:**
```tsx
<BookReader
  title="Pénzügyi Alapismeretek"
  content={bookContent}
  onBack={() => setShowBookReader(false)}
/>
```

#### **React Navigation:**
```tsx
<BookReader
  title={route.params.bookTitle}
  content={bookContentData[route.params.bookTitle]}
  onBack={() => navigation.goBack()}
/>
```

#### **State management:**
```tsx
const [showBookReader, setShowBookReader] = useState(false);
const [currentBook, setCurrentBook] = useState<string | null>(null);

{showBookReader && currentBook && (
  <BookReader
    title={currentBook}
    content={BOOK_DATA[currentBook]}
    onBack={() => {
      setShowBookReader(false);
      setCurrentBook(null);
    }}
  />
)}
```

---

## 📄 CONTENT FORMAT

### **Content structure:**
```tsx
const bookContent = `
CHAPTER TITLE (ALL CAPS)

Section Title (Title Case)

Regular paragraph text goes here. This will be automatically 
detected and formatted as a paragraph.

Another paragraph. Paragraphs are separated by single newlines.


NEXT CHAPTER TITLE

Another Section Title

More content...
`;
```

### **Page delimiter:**
```tsx
// Pages are split by triple newline: '\n\n\n'
const pages = content.split('\n\n\n').filter(p => p.trim());

// Example:
const bookContent = `
FIRST PAGE CONTENT
This is page 1.


SECOND PAGE CONTENT
This is page 2.


THIRD PAGE CONTENT
This is page 3.
`;
// Results in 3 pages
```

---

## 🎨 AUTO-FORMATTING RULES

### **1. Chapter Headings (ALL CAPS):**
```tsx
// Detected if:
// - Line is ALL UPPERCASE
// - Length > 0 and < 50 characters
// - Not a paragraph (short)

// Example:
"ELSŐ FEJEZET"  // ✅ Rendered as chapter heading
"BEVEZETÉS"     // ✅ Rendered as chapter heading
"This is a very long sentence that is not a chapter." // ❌ Too long
```

**Styling:**
```tsx
chapterHeading: {
  fontSize: 24,              // Large
  fontWeight: '700',         // Bold
  color: '#1E293B',          // Dark slate
  textAlign: 'center',       // Centered
  borderBottomWidth: 2,      // Underline
  borderBottomColor: '#D97706', // Amber
  fontFamily: 'Georgia',     // Serif
}
```

### **2. Section Headings (Title Case):**
```tsx
// Detected if:
// - Length > 0 and < 100 characters
// - Starts with uppercase letter (A-Z, Á-Ű)
// - Does not end with period ('.')
// - Not a chapter heading (not all caps)

// Example:
"Bevezetés a pénzügyekbe"     // ✅ Section heading
"Befektetési alapfogalmak"    // ✅ Section heading
"This is a regular sentence." // ❌ Ends with period
```

**Styling:**
```tsx
sectionHeading: {
  fontSize: 18,          // Medium
  fontWeight: '600',     // Semi-bold
  color: '#334155',      // Slate
  fontFamily: 'Georgia', // Serif
}
```

### **3. Paragraphs:**
```tsx
// Everything else (normal text)

// Example:
"A pénzügyi alapismeretek fontosak az életben..."
```

**Styling:**
```tsx
paragraph: {
  fontSize: 14,
  color: '#1E293B',
  lineHeight: 24,        // 1.8 line-height
  textAlign: 'justify',  // Justified text
  fontFamily: 'Georgia', // Serif
}
```

### **4. Empty lines (Spacers):**
```tsx
// Empty lines create vertical spacing
"\n\n" // Creates spacer (16px height)
```

---

## 📖 EXAMPLE BOOK CONTENT

### **Complete example:**
```tsx
const PENZUGYI_ALAPISMERETEK_CONTENT = `
ELSŐ FEJEZET: BEVEZETÉS

Mi a pénzügy?

A pénzügy a pénz kezelésének tudománya. Ez magában foglalja 
a bevételek, kiadások, megtakarítások és befektetések 
optimalizálását.

Miért fontosak a pénzügyi alapismeretek?

A pénzügyi tudás segít jobb döntéseket hozni a pénzzel 
kapcsolatban. Ez hosszú távon nagyobb anyagi biztonságot 
eredményezhet.


MÁSODIK FEJEZET: BEFEKTETÉSEK

Részvények

A részvény egy vállalat tulajdonrészét jelenti. Amikor 
részvényt vásárolsz, tulajdonosa leszel a vállalatnak.

Kötvények

A kötvény egy hitelviszonyt megtestesítő értékpapír. Amikor 
kötvényt vásárolsz, pénzt kölcsönzöl a kibocsátónak.


HARMADIK FEJEZET: ÖSSZEFOGLALÁS

Következtetés

A pénzügyi alapismeretek elsajátítása fontos lépés a 
pénzügyi szabadság felé. Kezdd el ma!
`;

// Usage:
<BookReader
  title="Pénzügyi Alapismeretek"
  content={PENZUGYI_ALAPISMERETEK_CONTENT}
  onBack={() => navigation.goBack()}
/>
```

**Result:**
- Page 1: ELSŐ FEJEZET (chapter) + Mi a pénzügy? (section) + paragraphs
- Page 2: MÁSODIK FEJEZET (chapter) + Részvények (section) + paragraphs
- Page 3: HARMADIK FEJEZET (chapter) + Következtetés (section) + paragraph

---

## 🎞️ ANIMATIONS

### **Page transition (fade):**
```tsx
const pageAnim = useRef(new Animated.Value(0)).current;

const animatePageTransition = (callback: () => void) => {
  // Fade out current page
  Animated.timing(pageAnim, {
    toValue: 1,
    duration: 150,
    useNativeDriver: true,
  }).start(() => {
    // Change page
    callback();
    // Fade in new page
    pageAnim.setValue(0);
  });
};

// Apply animation
<Animated.View
  style={{
    opacity: pageAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0], // 1 (visible) → 0 (hidden)
    }),
  }}
>
  {/* Page content */}
</Animated.View>
```

### **Animation flow:**
1. User clicks "Következő" button
2. `pageAnim` animates from 0 → 1 (fade out current page)
3. After animation completes, `currentPage` increments
4. `pageAnim` resets to 0 (new page fades in)

---

## 📱 NAVIGATION

### **Previous button:**
```tsx
<TouchableOpacity
  onPress={prevPage}
  disabled={currentPage === 0}
>
  <View style={[
    styles.navButton,
    currentPage === 0 && styles.navButtonDisabled,
  ]}>
    <ChevronLeft />
    <Text>Előző</Text>
  </View>
</TouchableOpacity>
```

**Logic:**
```tsx
const prevPage = () => {
  if (currentPage > 0) {
    setDirection(-1);
    animatePageTransition(() => setCurrentPage(currentPage - 1));
  }
};
```

### **Next button:**
```tsx
<TouchableOpacity
  onPress={nextPage}
  disabled={currentPage === pages.length - 1}
>
  <View style={[
    styles.navButton,
    currentPage === pages.length - 1 && styles.navButtonDisabled,
  ]}>
    <Text>Következő</Text>
    <ChevronRight />
  </View>
</TouchableOpacity>
```

**Logic:**
```tsx
const nextPage = () => {
  if (currentPage < pages.length - 1) {
    setDirection(1);
    animatePageTransition(() => setCurrentPage(currentPage + 1));
  }
};
```

### **Page counter:**
```tsx
// Header
<Text style={styles.pageCounter}>
  {currentPage + 1} / {pages.length}
</Text>

// Footer
<Text style={styles.navInfoText}>
  {currentPage + 1} / {pages.length} oldal
</Text>
```

---

## 🎨 DESIGN TOKENS

### **Colors (Book theme):**
```tsx
const COLORS = {
  white: '#FFFFFF',
  slate: {
    700: '#334155',  // Header background
    800: '#1E293B',  // Text, chapter titles
    600: '#475569',  // Disabled buttons
    500: '#64748B',  // Page number
  },
  amber: {
    300: '#FCD34D',  // Page counter
    400: '#FBBF24',  // BookOpen icon
    600: '#D97706',  // Borders, buttons
    700: '#B45309',  // Button hover
  },
  cream: {
    50: '#FFFBEB',   // Book background (light)
    100: '#FEF3C7',  // Book background (darker)
  },
};
```

### **Typography:**
```tsx
// Georgia serif font (book-like)
fontFamily: 'Georgia',

// Sizes
chapterHeading: 24px
sectionHeading: 18px
paragraph: 14px
pageCounter: 12px

// Line height
lineHeight: 24 (1.8 ratio for paragraphs)
```

---

## 🔧 TESTRESZABÁS

### **1. Változtasd a page delimiter-t:**
```tsx
// Current: '\n\n\n' (3 newlines)
const pages = content.split('\n\n\n').filter(p => p.trim());

// Custom: '---PAGE---'
const pages = content.split('---PAGE---').filter(p => p.trim());

// Example:
const bookContent = `
Page 1 content
---PAGE---
Page 2 content
---PAGE---
Page 3 content
`;
```

### **2. Módosítsd a chapter detection-t:**
```tsx
// Current: ALL CAPS, < 50 chars
if (
  trimmed === trimmed.toUpperCase() &&
  trimmed.length > 0 &&
  trimmed.length < 50
) {
  // Chapter heading
}

// Custom: Starts with "CHAPTER:"
if (trimmed.startsWith('CHAPTER:')) {
  // Chapter heading
}
```

### **3. Add hozzá a swipe gesture-t:**
```bash
npm install react-native-gesture-handler
```

```tsx
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const swipeGesture = Gesture.Pan()
  .onEnd((event) => {
    if (event.translationX < -50) {
      // Swipe left → Next page
      nextPage();
    } else if (event.translationX > 50) {
      // Swipe right → Previous page
      prevPage();
    }
  });

<GestureDetector gesture={swipeGesture}>
  <Animated.View style={styles.pageContent}>
    {/* Page content */}
  </Animated.View>
</GestureDetector>
```

### **4. Egyedi font használata:**
```bash
# 1. Add hozzá a fontot a projekthez
# /assets/fonts/Georgia.ttf

# 2. Link a fontot (react-native.config.js)
module.exports = {
  assets: ['./assets/fonts/'],
};

# 3. Run
npx react-native-asset
```

```tsx
// Use in styles
fontFamily: 'Georgia',
```

---

## 🐛 HIBAKERESÉS

### **1. Gradients not showing:**
```bash
npm install react-native-linear-gradient
cd ios && pod install && cd ..
```

### **2. Icons not showing:**
```bash
npm install lucide-react-native
```

### **3. Font not loading:**
```tsx
// Option 1: Use system fonts
fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',

// Option 2: Add custom font (see "Egyedi font használata")
```

### **4. Page content cut off:**
```tsx
// Increase ScrollView contentContainerStyle padding
contentContainerStyle={{
  padding: 40, // Increase from 32
}}
```

### **5. Animation stuttering:**
```tsx
// Ensure useNativeDriver: true
Animated.timing(pageAnim, {
  toValue: 1,
  duration: 150,
  useNativeDriver: true, // ✅ Native thread (60 FPS)
}).start();
```

---

## 📊 STATISZTIKÁK

| Metric | Érték |
|--------|-------|
| **Teljes sor** | ~450 |
| **Props** | 3 |
| **Pages** | Dynamic (split by `'\n\n\n'`) |
| **Auto-formatting** | 3 types (chapter, section, paragraph) |
| **Animations** | 1 (fade transition) |
| **Gradients** | 3 (background, header, navigation) |
| **Buttons** | 3 (close, prev, next) |
| **Függőségek** | 2 npm packages |
| **Konverzió idő** | 10 perc |
| **Komplexitás** | Közepes |

---

## ✅ KONVERZIÓS ELLENŐRZŐ LISTA

- [x] BookReader.rn.tsx létrehozva
- [x] Modal wrapper (full-screen overlay)
- [x] Book header (title + page counter + close button)
- [x] Page content (scrollable, auto-formatting)
- [x] Chapter detection (ALL CAPS)
- [x] Section detection (Title Case)
- [x] Paragraph rendering (justify alignment)
- [x] Navigation (prev/next buttons)
- [x] Page counter (header + footer)
- [x] Fade animation (page transitions)
- [x] Inline styles → StyleSheet
- [x] LinearGradient használva (3×)
- [x] Lucide icons (react-native verzió)
- [x] Animated API (fade transition)
- [x] Kommentek hozzáadva

---

## 🎉 KÉSZ!

Most már van egy **teljes BookReader React Native** komponensed!

**Mit kaptál:**
- ✅ Full-screen book reading experience
- ✅ Auto-formatting (chapter, section, paragraph)
- ✅ Page navigation (prev/next buttons)
- ✅ Page counter (X / Y oldal)
- ✅ Smooth fade transitions
- ✅ Book-like design (cream background, serif font)
- ✅ iOS + Android shadows
- ✅ Responsive layout

**Következő lépés:**
1. Másold be a komponenst
2. Telepítsd a függőségeket
3. Készítsd el a book content data-t
4. Használd! 📖✨

**Opcionális fejlesztések:**
- Add hozzá a swipe gesture-t (react-native-gesture-handler)
- Implementálj bookmark funkciót (save current page)
- Add hozzá a text size adjustment-et (small/medium/large)
- Implementálj search in book funkciót

---

**Készült:** 2025-01-01  
**Verzió:** 1.0.0  
**Fájl:** `BookReader.rn.tsx` (~450 sor)  
**Komplexitás:** Közepes (auto-formatting + animations)
