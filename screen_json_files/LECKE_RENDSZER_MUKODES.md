# 📚 LECKE RENDSZER MŰKÖDÉSI ELVE

## 🎯 ÁTTEKINTÉS

Ez a dokumentáció részletesen leírja, hogyan működik a leckerendszer az alkalmazásban, hogyan kapcsolódnak össze a komponensek, hogyan kezelődik az adat, és hogyan nyithatók meg a leckék.

---

## 🗂️ FŐ KOMPONENSEK

### 1. **App.tsx** - Központi Vezérlő
- **Felelősség:** A teljes alkalmazás állapotkezelése és navigáció
- **Lecke státusz tárolása:** 
  - `currentBookLessonIndex` - Jelenleg hol tart a player (0-47 a Pénzügyi Alapismereték könyvben)
  - `currentGameType` - Milyen típusú lecke következik: `'reading'` | `'matching'` | `'quiz'`
  - `isFirstRound` - Első vagy második kört játszunk (true/false)
  - `isManualLessonMode` - A lecke manuálisan lett kiválasztva a LessonsPage-ről (true/false)

### 2. **LessonsPage.tsx** - Lecke Kiválasztó
- **Felelősség:** Megjeleníti az összes elérhető leckét és állapotukat
- **Funkciók:**
  - Kölcsönzött könyvek listája
  - Minden lecke haladásának megjelenítése
  - Lecke kattintás kezelése
  - Teljesített leckék jelölése

### 3. **ProgressAnimation.tsx** - "Továbbhaladás" Gomb
- **Felelősség:** A következő lecke indítása
- **Megjelenítés:**
  - Ha van kölcsönzött könyv: **"Továbbhaladás - X. Lecke - következik"**
  - Ha nincs: **"Nincs kölcsönzött tankönyv"**

### 4. **LessonGame.tsx / QuizGame.tsx / ReadingGame.tsx** - Játék Motorok
- **Felelősség:** Különböző játéktípusok megjelenítése és logika
- **Típusok:**
  - **ReadingGame.tsx** - Szövegértés (kérdések a szövegből)
  - **LessonGame.tsx** - Párosítás (15 párosítós feladat)
  - **QuizGame.tsx** - Kvíz (feleletválasztós)

---

## 📊 ADATSTRUKTÚRA

### Lecke Adatok (`/data/penzugyiAlapismeretkLessons.ts`)

```typescript
export interface Lesson {
  id: number;              // Lecke azonosító
  pageNumber: number;      // Könyv oldal száma
  reading: ReadingContent; // Olvasás game data
  matching: MatchingPair[]; // Párosítás game data (15 pár)
  quiz: QuizQuestion[];    // Kvíz game data
}

export const penzugyiAlapismeretkLessons: Lesson[] = [
  // 48 lecke (0-47 index)
  { id: 1, pageNumber: 1, ... },
  { id: 2, pageNumber: 2, ... },
  // ...
]
```

**FONTOS:** 
- **1 könyvoldalhoz = 1 Lesson objektum = 3 játék** (reading, matching, quiz)
- A `Lesson[]` tömbben **48 elem** van (48 oldal)
- Minden `Lesson` tartalmazza mind a 3 játéktípus adatait

### Haladás Mentése (`localStorage: lessonProgress`)

```json
{
  "Pénzügyi Alapismeretek": {
    "0-reading": true,      // 1. lecke - Olvasás ✅
    "0-matching": true,     // 2. lecke - Párosítás ✅
    "0-quiz": true,         // 3. lecke - Kvíz ✅
    "1-reading": true,      // 4. lecke - Olvasás ✅
    "1-matching": false,    // 5. lecke - Párosítás ❌ (következő)
    "1-quiz": false,        // 6. lecke - Kvíz ❌
    // ...
    "47-quiz": true,        // 144. lecke (utolsó első körös)
    "0-reading-round2": true, // 145. lecke (második kör első)
    // ...
  }
}
```

**Kulcs Formátum:**
- **Első kör:** `"{pageIndex}-{gameType}"` pl. `"0-reading"`, `"0-matching"`, `"0-quiz"`
- **Második kör:** `"{pageIndex}-reading-round2"` pl. `"0-reading-round2"`

---

## 🔄 LECKE SORREND ÉS PROGRESSZIÓ

### Első Kör (144 lecke)

Minden oldalhoz 3 játék tartozik **fix sorrendben:**

```
1. oldal (pageIndex=0):
  ├─ 1. lecke: 📖 Olvasás (0-reading)
  ├─ 2. lecke: 🔗 Párosítás (0-matching)
  └─ 3. lecke: ❓ Kvíz (0-quiz)

2. oldal (pageIndex=1):
  ├─ 4. lecke: 📖 Olvasás (1-reading)
  ├─ 5. lecke: 🔗 Párosítás (1-matching)
  └─ 6. lecke: ❓ Kvíz (1-quiz)

...

48. oldal (pageIndex=47):
  ├─ 142. lecke: 📖 Olvasás (47-reading)
  ├─ 143. lecke: 🔗 Párosítás (47-matching)
  └─ 144. lecke: ❓ Kvíz (47-quiz)
```

**Számítás:**
- **Lecke szám** = `(pageIndex * 3) + (gameType pozíció)`
- **gameType pozíció:** reading=1, matching=2, quiz=3

### Második Kör (48 lecke)

Csak **Reading** van, de nehezebb kérdésekkel:

```
145. lecke: 📖 1. oldal - Olvasás 2. kör (0-reading-round2)
146. lecke: 📖 2. oldal - Olvasás 2. kör (1-reading-round2)
...
192. lecke: 📖 48. oldal - Olvasás 2. kör (47-reading-round2)
```

---

## 🚀 LECKE MEGNYITÁSA - 2 MÓD

### 1. **"Továbbhaladás" Gomb** (ProgressAnimation.tsx)

**Folyamat:**

1. **Kattintás:** User rákattint a "Továbbhaladás" gombra
   
2. **App.tsx - handleProgressClick():**
   ```typescript
   const handleProgressClick = () => {
     // Ellenőrzi a daily limit-et
     if (!checkLessonLimit()) {
       setCurrentPage('dailylimit'); // Daily limit elérve
       return;
     }
     
     // Beállítja a manuális mód flag-et
     setIsManualLessonMode(false); // Automatikus progresszió
     
     // Átváltás game page-re
     setCurrentPage('game');
   }
   ```

3. **App.tsx - Render:**
   ```typescript
   {currentPage === 'game' && (
     <>
       <LessonHeader 
         lessonNumber={currentLessonNumber}
         onBack={handleBackToMain}
       />
       
       {/* Játék típus alapján renderelés */}
       {currentGameType === 'reading' && (
         <ReadingGame 
           lessonData={penzugyiAlapismeretkLessons[currentBookLessonIndex]}
           onWin={handleWin}
         />
       )}
       
       {currentGameType === 'matching' && (
         <LessonGame 
           lessonData={penzugyiAlapismeretkLessons[currentBookLessonIndex]}
           onWin={handleWin}
         />
       )}
       
       {currentGameType === 'quiz' && (
         <QuizGame 
           lessonData={penzugyiAlapismeretkLessons[currentBookLessonIndex]}
           onWin={handleWin}
         />
       )}
     </>
   )}
   ```

4. **Játék Teljesítése - handleWin():**
   ```typescript
   const handleWin = () => {
     // 1. Jutalom számítás (arany, XP)
     const reward = wasAlreadyCompleted ? 50 : (
       currentGameType === 'reading' ? 150 :  // Nehéz
       currentGameType === 'matching' ? 100 : // Közepes
       50  // Könnyű (quiz)
     );
     
     // 2. Haladás mentése
     const progressKey = isFirstRound 
       ? `${currentBookLessonIndex}-${currentGameType}` 
       : `${currentBookLessonIndex}-reading-round2`;
     
     localStorage.setItem('lessonProgress', JSON.stringify({
       ...progress,
       [selectedBookTitle]: {
         ...progress[selectedBookTitle],
         [progressKey]: true
       }
     }));
     
     // 3. Következő lecke meghatározása
     if (isFirstRound) {
       if (currentGameType === 'reading') {
         setCurrentGameType('matching'); // Következő: Párosítás
       } else if (currentGameType === 'matching') {
         setCurrentGameType('quiz'); // Következő: Kvíz
       } else {
         // Quiz vége - következő oldal
         const nextPage = currentBookLessonIndex + 1;
         if (nextPage >= 48) {
           // Első kör vége - 2. kör kezdése
           setIsFirstRound(false);
           setCurrentBookLessonIndex(0);
           setCurrentGameType('reading');
         } else {
           setCurrentBookLessonIndex(nextPage);
           setCurrentGameType('reading');
         }
       }
     } else {
       // Második kör - csak reading
       const nextPage = currentBookLessonIndex + 1;
       if (nextPage >= 48) {
         // Könyv vége!
         setCurrentBookLessonIndex(0);
         setCurrentGameType('reading');
         setIsFirstRound(true);
       } else {
         setCurrentBookLessonIndex(nextPage);
       }
     }
     
     // 4. Visszatérés main page-re (celebrációk után)
     setCurrentPage('main');
   }
   ```

### 2. **Manuális Kiválasztás** (LessonsPage.tsx)

**Folyamat:**

1. **Leckék Megjelenítése:**
   ```typescript
   // LessonsPage.tsx
   const renderLessons = () => {
     return penzugyiAlapismeretkLessons.map((lesson, pageIndex) => {
       const gameTypes: ('reading' | 'matching' | 'quiz')[] = 
         ['reading', 'matching', 'quiz'];
       
       return gameTypes.map(gameType => {
         const lessonNumber = (pageIndex * 3) + 
           (gameType === 'reading' ? 1 : gameType === 'matching' ? 2 : 3);
         
         const status = getLessonStatus(bookTitle, pageIndex, gameType);
         // status lehet: 'completed' | 'current' | 'available'
         
         return (
           <button onClick={() => handleLessonClick(pageIndex, gameType)}>
             {lessonNumber}. Lecke - {getGameTypeLabel(gameType)}
             {status === 'completed' && '✅'}
             {status === 'current' && '⭐'}
           </button>
         );
       });
     });
   }
   ```

2. **Lecke Kattintás:**
   ```typescript
   // LessonsPage.tsx
   const handleLessonClick = (pageIndex: number, gameType: 'reading' | 'matching' | 'quiz') => {
     onStartLesson('Pénzügyi Alapismeretek', pageIndex, gameType);
   }
   ```

3. **App.tsx - handleStartLessonFromMap():**
   ```typescript
   const handleStartLessonFromMap = (
     bookTitle: string, 
     lessonIndex: number, 
     gameType: 'reading' | 'matching' | 'quiz'
   ) => {
     // Beállítjuk a lecke státuszt
     setSelectedBookTitle(bookTitle);
     setCurrentBookLessonIndex(lessonIndex); // 0-47
     setCurrentGameType(gameType);           // 'reading' | 'matching' | 'quiz'
     setIsManualLessonMode(true);            // Manuális mód
     
     // Játék oldal megnyitása
     setCurrentPage('game');
   }
   ```

4. **Játék után visszatérés:**
   ```typescript
   // App.tsx - handleWin() végén
   if (isManualLessonMode) {
     setPendingReturnToLessons(true); // Lessons page-re megy vissza
   } else {
     setCurrentPage('main'); // Main page-re megy vissza
   }
   ```

---

## 🎮 JÁTÉKTÍPUSOK RÉSZLETESEN

### 1. **ReadingGame.tsx** - Szövegértés

**Adat:**
```typescript
reading: {
  title: "Bevezetés",
  content: "Ez a könyv azért készült...",
  questions: [
    {
      question: "Milyen ismereteket nyújt a könyv?",
      answer: "általános pénzügyi és tőkepiaci ismereteket",
      keywords: ["általános", "pénzügy", "tőkepiac"]
    }
  ]
}
```

**Működés:**
1. Megjelenik a szöveg
2. Random kérdés a questions listából
3. User beírja a választ
4. Keyword alapú ellenőrzés (kis/nagybetű független)
5. 5/5 helyes válasz = WIN

### 2. **LessonGame.tsx** - Párosítás

**Adat:**
```typescript
matching: [
  { id: 1, left: "Tőkepiac", right: "Pénzügyi világ" },
  { id: 2, left: "Befektetés", right: "Pénzügyi döntés" },
  // ... összesen 15 pár
]
```

**Működés:**
1. Egyszerre max **5 pár** látható (összesen 15-ből)
2. Bal és jobb oldali boxok külön-külön keverve
3. User kiválaszt egy bal és egy jobb box-ot
4. Ha a `pairId` egyezik = helyes párosítás
5. Helyes párosítás után új pár jön be
6. Összes pár megtalálása = WIN
7. Időlimit: 180 másodperc

### 3. **QuizGame.tsx** - Kvíz

**Adat:**
```typescript
quiz: [
  {
    question: "Mi a könyv fő célja?",
    options: [
      "Szakemberré képezni azonnal",
      "Általános pénzügyi ismereteket nyújtani", // helyes
      "Tőzsdei kereskedést tanítani",
      "Számviteli tudást adni"
    ],
    correctAnswer: 1 // index a options tömbben
  }
]
```

**Működés:**
1. Random kérdés választása
2. 4 opció megjelenítése
3. User kiválaszt egy opciót
4. `selectedIndex === correctAnswer` ellenőrzés
5. 5/5 helyes válasz = WIN

---

## 💾 ADATMENTÉS ÉS SZINKRONIZÁLÁS

### LocalStorage Kulcsok

```typescript
{
  // Lecke haladás
  "lessonProgress": {
    "Pénzügyi Alapismeretek": {
      "0-reading": true,
      "0-matching": true,
      // ...
    }
  },
  
  // Kölcsönzött könyvek
  "rentedBooks": [
    {
      title: "Pénzügyi Alapismeretek",
      rentedUntil: 1732345678901, // timestamp
      daysRented: 7,
      color: "bg-gradient-to-br from-slate-700...",
      textColor: "text-white"
    }
  ],
  
  // Fő játék állapot
  "rpg_game_state": {
    currentBookLessonIndex: 5,
    currentGameType: "matching",
    isFirstRound: true,
    coins: 1500,
    gems: 25,
    playerLevel: 3,
    totalXp: 1200,
    // ...
  }
}
```

### Szinkronizálás

**1. LessonsPage figyelése:**
```typescript
useEffect(() => {
  const handleStorageChange = () => {
    loadProgress(); // Újratöltés localStorage-ból
  };
  
  window.addEventListener('lessonCompleted', handleStorageChange);
  
  return () => {
    window.removeEventListener('lessonCompleted', handleStorageChange);
  };
}, []);
```

**2. App.tsx mentés minden állapot változásnál:**
```typescript
useEffect(() => {
  saveGameState({
    currentBookLessonIndex,
    currentGameType,
    isFirstRound,
    coins,
    gems,
    playerLevel,
    totalXp,
    // ...
  });
}, [currentBookLessonIndex, currentGameType, isFirstRound, ...]);
```

---

## 🔍 DEBUG ÉS HIBAELHÁRÍTÁS

### Console Log Rendszer

**App.tsx:**
```typescript
console.log('🎯 Továbbhaladás clicked! Current state:', {
  currentBookLessonIndex,
  currentGameType,
  isFirstRound
});

console.log('🎮 handleWin called!', {
  currentLessonNumber,
  progressKey,
  reward,
  xpReward
});
```

**LessonsPage.tsx:**
```typescript
console.log('📝 Checking lesson:', {
  lessonNumber,
  lessonKey,
  isCompleted,
  allProgressKeys
});
```

**ProgressAnimation.tsx:**
```typescript
console.log('📚 Current lesson:', {
  bookLessonIndex: currentBookLessonIndex,
  gameType: currentGameType,
  isFirstRound: isFirstRound,
  lessonNumber: lessonNumber
});
```

### Gyakori Hibák

**1. Lecke nem nyílik meg:**
- ✅ Ellenőrizd: Van-e kölcsönzött könyv (`localStorage: rentedBooks`)
- ✅ Ellenőrizd: Daily limit nincs elérve (`localStorage: daily_lessons`)
- ✅ Console log: `handleProgressClick()` meghívódik-e

**2. Rossz lecke nyílik meg:**
- ✅ Ellenőrizd: `currentBookLessonIndex` (0-47)
- ✅ Ellenőrizd: `currentGameType` ('reading', 'matching', 'quiz')
- ✅ Ellenőrizd: `isFirstRound` (true/false)

**3. Haladás nem mentődik:**
- ✅ Ellenőrizd: `handleWin()` meghívódik-e
- ✅ Ellenőrizd: `localStorage.getItem('lessonProgress')`
- ✅ Console log: `lessonCompleted` event triggered

---

## 📝 ÖSSZEFOGLALÁS - MŰKÖDÉSI FOLYAMAT

```
┌─────────────────────────────────────────────────────────┐
│ USER RÁKATTINT A "TOVÁBBHALADÁS" GOMBRA                │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ App.tsx - handleProgressClick()                        │
│ • Ellenőrzi daily limit-et                             │
│ • setCurrentPage('game')                               │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ App.tsx - Render game page                             │
│ • Kiolvassa: currentBookLessonIndex (pl. 5)            │
│ • Kiolvassa: currentGameType (pl. 'matching')          │
│ • Betölti: penzugyiAlapismeretkLessons[5]              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ LessonGame.tsx - Párosítás játék renderelése           │
│ • Megjeleníti a 15 párt (5 egyszerre)                  │
│ • Timer indul (180 sec)                                │
│ • User párosít                                         │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼ (ha minden pár megtalálva)
┌─────────────────────────────────────────────────────────┐
│ LessonGame.tsx - onWin() hívás                         │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ App.tsx - handleWin()                                  │
│ 1. Jutalom számítás:                                   │
│    - Matching = 100 gold, 100 XP (első alkalom)        │
│    - Vagy 50 gold, 50 XP (ismétlés)                    │
│ 2. Haladás mentése:                                     │
│    - progressKey: "5-matching"                          │
│    - localStorage: lessonProgress[book][key] = true     │
│ 3. Következő lecke beállítása:                          │
│    - currentGameType = 'quiz' (matching után quiz jön)  │
│    - (currentBookLessonIndex változatlan: 5)            │
│ 4. Visszatérés:                                         │
│    - setCurrentPage('main')                             │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ MainScreen - ProgressAnimation frissül                 │
│ • Most mutatja: "Továbbhaladás - 18. Lecke - következik"│
│ • (5 * 3 + 3 = 18. lecke = quiz az 5. oldalon)         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 GYORS REFERENCIA

### Lecke Szám Számítás

```typescript
// Első kör (0-143)
const lessonNumber = (pageIndex * 3) + (
  gameType === 'reading' ? 1 : 
  gameType === 'matching' ? 2 : 
  3
);

// Második kör (144-191)
const lessonNumber = 144 + pageIndex;
```

### Progress Key Formátum

```typescript
// Első kör
const progressKey = `${pageIndex}-${gameType}`;
// pl. "0-reading", "5-matching", "47-quiz"

// Második kör
const progressKey = `${pageIndex}-reading-round2`;
// pl. "0-reading-round2", "47-reading-round2"
```

### Következő Lecke Logika

```typescript
if (isFirstRound) {
  if (gameType === 'reading') nextGameType = 'matching';
  else if (gameType === 'matching') nextGameType = 'quiz';
  else {
    // quiz után következő oldal
    nextPageIndex = pageIndex + 1;
    nextGameType = 'reading';
    if (nextPageIndex >= 48) {
      // Első kör vége
      isFirstRound = false;
      nextPageIndex = 0;
    }
  }
} else {
  // Második kör
  nextPageIndex = pageIndex + 1;
  if (nextPageIndex >= 48) {
    // Könyv vége
    isFirstRound = true;
    nextPageIndex = 0;
  }
}
```

---

## ✅ ELLENŐRZŐ LISTA - Lecke Megnyitáshoz

- [ ] Van kölcsönzött könyv? (`localStorage: rentedBooks`)
- [ ] Daily limit nincs elérve? (`localStorage: daily_lessons`)
- [ ] `currentBookLessonIndex` helyes? (0-47)
- [ ] `currentGameType` helyes? ('reading' | 'matching' | 'quiz')
- [ ] `isFirstRound` helyes? (true/false)
- [ ] `penzugyiAlapismeretkLessons[index]` létezik?
- [ ] A megfelelő Game komponens renderelődik?

---

**Dokumentáció vége** 🎓
