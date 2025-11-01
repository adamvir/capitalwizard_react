# Game Components - React Native

Ez a mappa tartalmazza az összes játék komponenst React Native verzióban.

## Komponensek

### 1. ReadingGame.tsx (590 sor)
Szövegértés játék - a leckét olvasás után kérdésekre kell válaszolni.

**Fő funkciók:**
- Szöveg megjelenítés ScrollView-ban
- Nyitott végű kérdések TextInput-tal
- Kulcsszó alapú válasz ellenőrzés
- 80% minimum teljesítmény a győzelemhez
- XP és arany jutalom (150/150 - Hard difficulty)

**Props:**
```typescript
interface ReadingGameProps {
  onBackToHome?: () => void;
  onComplete?: (xp: number, gold: number) => void;
  lessonNumber?: number;
  lessonData?: Lesson;
}
```

**Használat:**
```tsx
import { ReadingGame } from '@/components/game';

<ReadingGame
  lessonNumber={1}
  lessonData={lesson}
  onComplete={(xp, gold) => {
    console.log(`Earned ${xp} XP and ${gold} gold!`);
  }}
  onBackToHome={() => navigation.goBack()}
/>
```

### 2. QuizGame.tsx (548 sor)
Kvíz játék - feleletválasztós kérdések időzítéssel.

**Fő funkciók:**
- Többválasztós kérdések
- Azonnali vizuális visszajelzés
- Progress indicator (pontok)
- Animált átmenetek kérdések között
- XP és arany jutalom (50/50 - Easy difficulty)

**Props:**
```typescript
interface QuizGameProps {
  onBackToHome?: () => void;
  onComplete?: (xp: number, gold: number) => void;
  lessonNumber?: number;
  lessonData?: Lesson;
}
```

**Használat:**
```tsx
import { QuizGame } from '@/components/game';

<QuizGame
  lessonNumber={2}
  lessonData={lesson}
  onComplete={(xp, gold) => {
    // Handle rewards
  }}
  onBackToHome={() => navigation.goBack()}
/>
```

### 3. BookReader.tsx (358 sor)
Könyv olvasó komponens - teljes képernyős olvasó élmény.

**Fő funkciók:**
- Teljes képernyős modal megjelenítés
- Könyv stílusú megjelenés (sárga háttér)
- Lapozás animációkkal (SlideInRight/SlideOutLeft)
- Automatikus formázás (chapter/section felismerés)
- Progress indicator (oldal számláló)

**Props:**
```typescript
interface BookReaderProps {
  title: string;
  content: string; // Teljes könyv tartalom
  onBack: () => void;
}
```

**Használat:**
```tsx
import { BookReader } from '@/components/game';

<BookReader
  title="Tőkepiaci Szótár"
  content={bookContent}
  onBack={() => setShowReader(false)}
/>
```

## Közös jellemzők

### Animációk
Minden komponens `react-native-reanimated` animációkat használ:
- `FadeIn` - Lágy betűnés
- `SlideInRight` - Jobbról becsúszás
- `SlideOutLeft` - Balra kicsúszás
- `ZoomIn` - Nagyítás

### Ikonok
`@expo/vector-icons` MaterialCommunityIcons:
- `arrow-left` - Vissza gomb
- `book-open-variant` - Könyv ikon
- `trophy` - Győzelem
- `check-circle` / `close-circle` - Helyes/helytelen válasz
- `thumb-down` - Vereség

### Stílusok
Minden komponens a `styleConstants.ts`-ből importál:
```typescript
import { COLORS, SIZES, SPACING, FONT_WEIGHT, SHADOWS } from '@/utils/styleConstants';
```

### Típusok
A lecke típusok a `types/lesson.ts`-ben vannak definiálva:
```typescript
import type { Lesson, Reading, QuizQuestion } from '@/types/lesson';
```

## Jutalom rendszer

| Játék típus | Nehézség | XP  | Arany |
|-------------|----------|-----|-------|
| QuizGame    | Easy     | 50  | 50    |
| MatchingGame| Medium   | 100 | 100   |
| ReadingGame | Hard     | 150 | 150   |

## Teljesítési követelmények

- **ReadingGame**: 80% helyes válasz szükséges
- **QuizGame**: 80% helyes válasz szükséges
- **MatchingGame**: 80% helyes párosítás szükséges

## Platform specifikus tulajdonságok

### iOS
- `KeyboardAvoidingView` behavior: 'padding'
- Font family: 'Georgia' (BookReader)
- SafeAreaView automatikus kezelés

### Android
- `KeyboardAvoidingView` behavior: 'height'
- Font family: 'serif' (BookReader)
- Status bar átlátszó

## Függőségek

Minden komponens használja:
- `react-native` - Core komponensek
- `@expo/vector-icons` - Ikonok
- `react-native-reanimated` - Animációk
- `expo-linear-gradient` - Színátmenetek (BookReader)

## Példa lecke adat struktúra

```typescript
const exampleLesson: Lesson = {
  id: 'lesson-1',
  title: 'Bevezetés',
  description: 'Alapfogalmak',
  difficulty: 'hard',
  reading: {
    title: 'Mi az a tőzsde?',
    content: 'A tőzsde egy szervezett piac...',
    questions: [
      {
        question: 'Mi a tőzsde fő feladata?',
        answer: 'Értékpapírok kereskedése',
        keywords: ['értékpapír', 'kereskedés', 'piac']
      }
    ]
  },
  quiz: [
    {
      question: 'Melyik a legnagyobb tőzsde?',
      options: ['NYSE', 'NASDAQ', 'LSE', 'TSE'],
      correctAnswer: 0
    }
  ],
  matching: [
    {
      left: 'NYSE',
      right: 'New York Stock Exchange'
    }
  ]
};
```

## Hibakezelés

Minden komponens console.log-ot használ debug célokra:
```typescript
console.log('📖 ReadingGame mounted:', { lessonNumber, hasLessonData: !!lessonData });
console.log('✅ QuizGame calling onComplete with rewards:', { xpReward, goldReward });
```

## Performance optimalizáció

- ScrollView helyett FlatList nagyobb listáknál
- Memo használata pure komponenseknél
- useCallback a callback függvényeknél
- Animated API helyett Reanimated (60fps)

## További fejlesztési lehetőségek

1. **Timer hozzáadása** - QuizGame-hez visszaszámláló
2. **Hangeffektek** - expo-av használatával
3. **Offline támogatás** - AsyncStorage cache
4. **Analytics** - Firebase Analytics integráció
5. **Achievements** - Jutalmak és jelvények rendszer
