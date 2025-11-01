# Lecke Hozzáadási Útmutató

## ✅ Pénzügyi Alapismeretek - TELJES KÖNYV

A **Pénzügyi Alapismeretek** könyv mind a **60 oldalát** feldolgozták a lecke rendszerbe!

**Elérhető leckék:**
- 📖 60 oldal
- 🎮 180 lecke az első körben (60 × 3 játék)
- 🔄 60 lecke a második körben (ismétlés)
- 🎯 **Összesen: 240 lecke**

## Hogyan adj hozzá további leckéket más könyvekhez

Ha más könyvekhez szeretnél leckéket hozzáadni, kövesd az alábbi lépéseket:

### 1. Adatstruktúra

Minden oldal 3 részből áll:

#### a) Reading (Olvasó játék)
```typescript
reading: {
  title: "Oldal címe",
  content: `Szöveges tartalom...`,
  questions: [
    {
      question: "Kérdés szövege?",
      answer: "helyes válasz",
      keywords: ["kulcsszó1", "kulcsszó2", "kulcsszó3"]
    }
    // 3-5 kérdés oldalanként
  ]
}
```

**Tippek:**
- A `content` az oldalról vett szöveg
- A `questions` tömbben 3-5 kérdés legyen
- Az `answer` a várt válasz szövege (kis/nagybetű nem számít)
- A `keywords` tömbben olyan szavak, amiknek szerepelniük kell a válaszban

#### b) Matching (Párosító játék)
```typescript
matching: [
  { id: 1, left: "Fogalom", right: "Jelentése" },
  { id: 2, left: "Szó", right: "Szinonímája" },
  // 10-15 pár oldalanként
]
```

**Tippek:**
- 10-15 párosítás oldalanként
- Fogalom-definíció, szó-szinonima párosítások
- Minden `id` egyedi legyen

#### c) Quiz (Kvíz játék)
```typescript
quiz: [
  {
    question: "Kérdés szövege?",
    options: [
      "Rossz válasz 1",
      "Helyes válasz",
      "Rossz válasz 2",
      "Rossz válasz 3"
    ],
    correctAnswer: 1  // 0-based index, azaz a "Helyes válasz" indexe
  }
  // 3-5 kérdés oldalanként
]
```

**Tippek:**
- 3-5 kvíz kérdés oldalanként
- 4 válaszlehetőség mindegyikhez
- A `correctAnswer` 0-tól kezdődő index (0 = első válasz, 1 = második, stb.)

### 2. Lecke hozzáadása a `penzugyiAlapismeretkLessons.ts` fájlhoz

```typescript
{
  id: 13,  // Folytatólagos ID
  pageNumber: 13,
  reading: {
    // ... reading adatok
  },
  matching: [
    // ... matching párok
  ],
  quiz: [
    // ... quiz kérdések
  ]
}
```

### 3. Példa - Új lecke hozzáadása

```typescript
// Fájl: /data/penzugyiAlapismeretkLessons.ts
// Hozzáadás a tömb végéhez a záró ]; előtt

  // 13. oldal - Példa
  {
    id: 13,
    pageNumber: 13,
    reading: {
      title: "Új fejezet címe",
      content: `Itt jön a szöveges tartalom az oldalról...`,
      questions: [
        {
          question: "Mi a fő témája ennek az oldalnak?",
          answer: "pénzügyi ismeretek",
          keywords: ["pénzügyi", "pénz", "ismeretek", "tudás"]
        }
      ]
    },
    matching: [
      { id: 1, left: "Fogalom1", right: "Definíció1" },
      { id: 2, left: "Fogalom2", right: "Definíció2" }
    ],
    quiz: [
      {
        question: "Teszt kérdés?",
        options: ["A", "B", "C", "D"],
        correctAnswer: 1
      }
    ]
  },
```

### 4. Tesztelés

A lecke hozzáadása után:
1. Nyisd meg az alkalmazást
2. Menj a "Leckék" menüpontra
3. Válaszd ki a "Pénzügyi Alapismeretek" könyvet
4. Az új lecke automatikusan megjelenik a térképen

### 5. Megjegyzések

- **Szerzői jogok**: Csak olyan tartalmat adj hozzá, amihez van jogod!
- **Minőség**: Gondoskodj róla, hogy a kérdések relevánsak és érthetőek legyenek
- **Konzisztencia**: Tartsd be az eddigi formátumot és stílust
- **Tesztelés**: Minden új leckét tesztelj le mielőtt véglegesíted

### 6. Automatikus frissítések

A rendszer automatikusan:
- ✅ Számlálja a leckéket
- ✅ Megjeleníti a haladást
- ✅ Menti a teljesített leckéket
- ✅ Megjeleníti a lecke térképet

Nincs szükség más fájlok módosítására!
