# 💎 XP ÉS GYÉMÁNT RENDSZER - Teljes Összefoglaló

Ez a dokumentum részletesen leírja az **XP (tapasztalati pont)** és **gyémánt** szerzési rendszert az alkalmazásban.

---

## 📊 TARTALOMJEGYZÉK

1. [XP Rendszer](#1-xp-rendszer)
2. [Gyémánt Rendszer](#2-gyémánt-rendszer)
3. [Arany (Gold/Coins) Rendszer](#3-arany-goldcoins-rendszer)
4. [Könyvkölcsönzés és Visszatérítés](#4-könyvkölcsönzés-és-visszatérítés)
5. [Küzdőtér (Aréna)](#5-küzdőtér-aréna)
6. [Összesített Táblázat](#6-összesített-táblázat)

---

## 1. XP RENDSZER

### 🎯 XP SZERZÉSI MÓDOK

#### **A) LECKÉK TELJESÍTÉSE (Lessons)**

Az XP mennyisége **nehézségi szinttől** függ:

| Játék Típus | Nehézség | XP Jutalom | Arany Jutalom |
|-------------|----------|------------|---------------|
| **Quiz (Kvíz)** | Könnyű (Easy) | **50 XP** | **50 Arany** |
| **Matching (Párosító)** | Közepes (Medium) | **100 XP** | **100 Arany** |
| **Reading (Olvasó)** | Nehéz (Hard) | **150 XP** | **150 Arany** |

**Fontos részletek:**
- **Első teljesítés:** Teljes XP + Arany (pl. 150 XP + 150 Arany Reading esetén)
- **Ismételt teljesítés:** Csökkentett jutalom
  - **30 XP** (repeatedLessonXp)
  - **20 Arany** (repeatedLessonGold)

**Példa:**
```
1. teljesítés: Reading → 150 XP + 150 Arany
2. teljesítés: Reading → 30 XP + 20 Arany
3. teljesítés: Reading → 30 XP + 20 Arany
```

---

#### **B) KÜZDŐTÉR (Aréna)**

Az Arena XP **könyv számtól** függ:

**Formula:**
```
Total XP = baseXpPerArenaWin × selectedBooksCount
```

**Értékek:**
- `baseXpPerArenaWin` = **50 XP**
- `selectedBooksCount` = 1-5 könyv (maxBooksForArena = 5)

**Példák:**

| Kiválasztott könyvek | XP Jutalom | Kockázat |
|---------------------|------------|----------|
| 1 könyv | 50 XP | Alacsony |
| 2 könyv | 100 XP | Közepes |
| 3 könyv | 150 XP | Közepes-Magas |
| 4 könyv | 200 XP | Magas |
| 5 könyv | **250 XP** | Nagyon Magas |

**Fontos:**
- XP-t **CSAK GYŐZELEM** esetén kapsz!
- Vereség esetén **0 XP**, csak arany veszteség
- Döntetlen esetén **0 XP**, arany változatlan

**Arany (Coins) változás Arena-ban:**
- **Győzelem:** `coins + betAmount` (50-500 arany között)
- **Vereség:** `coins - betAmount`
- **Döntetlen:** változatlan

---

### 📈 SZINTLÉPÉS RENDSZER

#### **Szükséges XP szintenként:**

**Formula:**
```typescript
XP(level) = baseXpPerLevel × (1 + xpGrowthPercentage/100)^(level-1)
```

**Konstansok:**
- `baseXpPerLevel` = **1000 XP** (1. szinthez)
- `xpGrowthPercentage` = **10%** (növekedés szintenként)
- `maxLevel` = **100**

**XP Táblázat (első 20 szint):**

| Szint | Szükséges XP (szinthez) | Összes XP (0-tól) |
|-------|------------------------|-------------------|
| 1 | 1,000 XP | 1,000 |
| 2 | 1,100 XP | 2,100 |
| 3 | 1,210 XP | 3,310 |
| 4 | 1,331 XP | 4,641 |
| 5 | 1,464 XP | 6,105 |
| 6 | 1,610 XP | 7,715 |
| 7 | 1,771 XP | 9,486 |
| 8 | 1,949 XP | 11,435 |
| 9 | 2,143 XP | 13,578 |
| 10 | 2,358 XP | 15,936 |
| 15 | 3,797 XP | 31,772 |
| 20 | 6,115 XP | 57,275 |
| 50 | 117,391 XP | ~1,163,909 |
| 100 | 13,780,612 XP | ~137,796,123 |

**Példa - Hány lecke kell 1→2 szinthez?**
- 1. szint → 2. szint: 1,100 XP kell
- Reading (Hard) leckék: 1100 / 150 = **~8 lecke**
- Matching (Medium) leckék: 1100 / 100 = **~11 lecke**
- Quiz (Easy) leckék: 1100 / 50 = **~22 lecke**

---

## 2. GYÉMÁNT RENDSZER

### 💎 GYÉMÁNT SZERZÉSI MÓDOK

#### **A) MILESTONE RENDSZER (Automatikus)**

**Hogyan működik:**
- Minden **6 stage után** (1 milestone) kapsz **5 gyémántot**
- Stage-ek akkor emelkednek, ha **leckét teljesítesz** vagy **Arenában nyersz**

**Konstansok:**
- `stagesPerMilestone` = **6 stage**
- `diamondsPerMilestone` = **5 gyémánt**

**Példa:**
```
Stage 0 → Stage 1: Lecke 1 teljesítve
Stage 1 → Stage 2: Lecke 2 teljesítve
Stage 2 → Stage 3: Lecke 3 teljesítve
Stage 3 → Stage 4: Lecke 4 teljesítve
Stage 4 → Stage 5: Lecke 5 teljesítve
Stage 5 → Stage 6: Lecke 6 teljesítve → ✨ +5 GYÉMÁNT! (1. milestone)

Stage 6 → Stage 7: Lecke 7 teljesítve
...
Stage 11 → Stage 12: Lecke 12 teljesítve → ✨ +5 GYÉMÁNT! (2. milestone)
```

**Gyémánt timeline:**
- 6 lecke: **5 gyémánt**
- 12 lecke: **10 gyémánt**
- 18 lecke: **15 gyémánt**
- 24 lecke: **20 gyémánt**
- 30 lecke: **25 gyémánt**
- 60 lecke: **50 gyémánt**

---

#### **B) SHOP - GYÉMÁNT VÁSÁRLÁS ARANYÉRT**

| Csomag | Gyémánt | Arany Költség | Érték/gyémánt |
|--------|---------|---------------|---------------|
| 1 gyémánt | 1 💎 | 100 🪙 | 100 arany/💎 |
| 10 gyémánt | 10 💎 | 900 🪙 | 90 arany/💎 (10% kedvezmény) |
| 50 gyémánt | 50 💎 | 4,000 🪙 | 80 arany/💎 (20% kedvezmény) |
| 100 gyémánt | 100 💎 | 7,500 🪙 | 75 arany/💎 (25% kedvezmény) |

**Legjobb deal:** 100 gyémánt = 7,500 arany (25% spórolás!)

---

#### **C) VALÓS PÉNZBŐL VÁSÁRLÁS (Tervezett)**

Ha előfizető vagy (Pro/Master), gyémántot kaphatsz:
- **Pro előfizetés (4,990 Ft/hó):** Havi jutalmak (tervezés alatt)
- **Master előfizetés (9,990 Ft/hó):** Havi jutalmak (tervezés alatt)

---

### 🎯 GYÉMÁNT FELHASZNÁLÁS

**Jelenleg (terv szerint):**
1. Premium tartalom feloldása
2. Speciális könyvek vásárlása
3. Exkluzív avatárok
4. Gyorsított progression
5. Extra slot-ok

---

## 3. ARANY (GOLD/COINS) RENDSZER

### 🪙 ARANY SZERZÉSI MÓDOK

#### **A) LECKÉK TELJESÍTÉSE**

| Játék Típus | Nehézség | Arany Jutalom |
|-------------|----------|---------------|
| Quiz | Könnyű | **50 🪙** |
| Matching | Közepes | **100 🪙** |
| Reading | Nehéz | **150 🪙** |
| Ismételt lecke | - | **20 🪙** |

#### **B) KÜZDŐTÉR (Aréna)**

- **Győzelem:** +50 - +500 arany (tét összege)
- **Vereség:** -50 - -500 arany (tét összege)
- **Döntetlen:** 0 változás

**Tét range:**
- Minimum tét: **50 arany**
- Maximum tét: **500 arany**

#### **C) SHOP - ARANY VÁSÁRLÁS FORINTÉRT**

| Csomag | Arany | Ár (HUF) | Érték/100 arany |
|--------|-------|----------|-----------------|
| 100 arany | 100 🪙 | 490 Ft | 490 Ft |
| 500 arany | 500 🪙 | 1,990 Ft | 398 Ft (19% kedvezmény) |
| 1,000 arany | 1,000 🪙 | 3,490 Ft | 349 Ft (29% kedvezmény) |
| 5,000 arany | 5,000 🪙 | 14,990 Ft | 300 Ft (39% kedvezmény) |

**Legjobb deal:** 5,000 arany = 14,990 Ft (39% spórolás!)

#### **D) KEZDŐ ÖSSZEG**

- Új játékosok: **1,000 arany** (initialGold)

---

### 💸 ARANY FELHASZNÁLÁS

1. **Könyvkölcsönzés** (50-1000 arany)
2. **Aréna tét** (50-500 arany)
3. **Gyémánt vásárlás** (100-7500 arany)
4. **Streak Freeze** (500 arany)

---

## 4. KÖNYVKÖLCSÖNZÉS ÉS VISSZATÉRÍTÉS

### 📚 KÖLCSÖNZÉSI ÁRAK

**Fix árak:**
- **1 nap:** 50 arany
- **30 nap:** 1,000 arany

**Progresszív árazás (2-29 nap):**

**Formula:**
```typescript
const basePrice = 50;
const maxDiscount = 0.33; // 33% kedvezmény max
const discountFactor = (days - 1) / 29; // 0-1 progresszió
const pricePerDay = basePrice * (1 - (maxDiscount * discountFactor));
const totalPrice = Math.round(pricePerDay * days);
```

**Példák:**

| Napok | Napi ár | Teljes ár | Megtakarítás |
|-------|---------|-----------|--------------|
| 1 | 50 | **50 🪙** | - |
| 3 | ~48.85 | **147 🪙** | ~3 arany |
| 7 | ~46.36 | **325 🪙** | ~25 arany |
| 14 | ~42.98 | **602 🪙** | ~98 arany |
| 21 | ~39.60 | **831 🪙** | ~219 arany |
| 30 | 33.33 | **1,000 🪙** | ~500 arany |

**Legjobb deal:** 30 nap (33.33 arany/nap vs 50 arany/nap)

---

### 💰 VISSZATÉRÍTÉSI RENDSZER

**Hogyan működik:**

Ha idő előtt visszaadod a könyvet, **visszatérítést** kapsz!

**Formula:**
```typescript
const remainingDays = Math.floor((rentedUntil - Date.now()) / (1 day in ms));
const daysElapsed = originalDaysRented - remainingDays;

const priceForElapsedDays = calculateRentalPrice(daysElapsed);
const originalPrice = calculateRentalPrice(originalDaysRented);

const refund = originalPrice - priceForElapsedDays;
```

**Példák:**

#### **Példa 1: 30 napos kölcsönzés, 10 nap után visszaadás**
```
Eredeti kölcsönzés: 30 nap = 1,000 arany
Eltelt idő: 10 nap
Eltelt idő ára: calculateRentalPrice(10) = ~436 arany
Visszatérítés: 1,000 - 436 = 564 arany ✅
```

#### **Példa 2: 7 napos kölcsönzés, 2 nap után visszaadás**
```
Eredeti kölcsönzés: 7 nap = 325 arany
Eltelt idő: 2 nap
Eltelt idő ára: calculateRentalPrice(2) = ~98 arany
Visszatérítés: 325 - 98 = 227 arany ✅
```

#### **Példa 3: 1 napos kölcsönzés, azonnal visszaadás (< 1 nap)**
```
Eredeti kölcsönzés: 1 nap = 50 arany
Eltelt idő: 0 nap
Eltelt idő ára: 0 arany
Visszatérítés: 50 - 0 = 50 arany (teljes visszatérítés!) ✅
```

#### **Példa 4: Lejárt kölcsönzés visszaadása**
```
Eredeti kölcsönzés: 7 nap = 325 arany
Eltelt idő: 7+ nap (lejárt)
Visszatérítés: 0 arany ❌ (nincs visszatérítés)
```

**Fontos:**
- Ha `remainingDays <= 0`, **nincs visszatérítés**
- Ha `remainingDays > 0`, **prorated visszatérítés**
- Azonnal visszaadva: **teljes visszatérítés**

---

## 5. KÜZDŐTÉR (ARÉNA)

### ⚔️ ARENA MECHANIKA

#### **JÁTÉK MENET:**

1. **Könyv választás:** 1-5 könyv (maxBooksForArena = 5)
2. **Tét beállítás:** 50-500 arany (arenaMinBet - arenaMaxBet)
3. **10 kérdés:** Számítás alapú kérdések a kiválasztott könyvekből
4. **Pontszámítás:** Ki válaszolt pontosabban/gyorsabban
5. **Eredmény:**
   - **Győzelem:** +betAmount arany, +XP (50 × könyv szám)
   - **Vereség:** -betAmount arany, 0 XP
   - **Döntetlen:** 0 arany változás, 0 XP

#### **XP SZÁMÍTÁS:**

```typescript
const baseXp = 50; // xpPerArenaWin
const bookMultiplier = selectedBooks.length; // 1-5
const totalXp = baseXp * bookMultiplier;
```

**Példák:**

| Könyvek | Eredmény | XP | Arany változás (tét: 200) |
|---------|----------|-------|---------------------------|
| 1 könyv | Győzelem | +50 XP | +200 🪙 |
| 2 könyv | Győzelem | +100 XP | +200 🪙 |
| 3 könyv | Győzelem | +150 XP | +200 🪙 |
| 5 könyv | Győzelem | +250 XP | +200 🪙 |
| 3 könyv | Vereség | 0 XP | -200 🪙 |
| 2 könyv | Döntetlen | 0 XP | 0 🪙 |

**Stratégia:**
- **Több könyv = Több XP, de nehezebb kérdések!**
- 5 könyv választása: maximum XP (250), de legnehezebb

---

#### **NAPI LIMIT (Ingyenes felhasználók):**

- **Ingyenes tier:** **3 játék/nap** (freeDailyArenaGames)
- **Pro tier:** **Korlátlan**
- **Master tier:** **Korlátlan**

**LocalStorage tracking:**
```typescript
'arena_daily_games' → { date: string, gamesPlayed: number }
```

Új nap kezdetén a számláló **nullázódik**.

---

## 6. ÖSSZESÍTETT TÁBLÁZAT

### 📊 XP FORRÁSOK

| Tevékenység | XP Jutalom | Gyakoriság | Megjegyzés |
|-------------|------------|------------|------------|
| Quiz (Easy) | 50 XP | Lecke | Első teljesítés |
| Matching (Medium) | 100 XP | Lecke | Első teljesítés |
| Reading (Hard) | 150 XP | Lecke | Első teljesítés |
| Ismételt lecke | 30 XP | Lecke | Bármilyen típus |
| Arena (1 könyv) | 50 XP | Győzelem | Napi limit: 3 (free) |
| Arena (2 könyv) | 100 XP | Győzelem | Napi limit: 3 (free) |
| Arena (3 könyv) | 150 XP | Győzelem | Napi limit: 3 (free) |
| Arena (4 könyv) | 200 XP | Győzelem | Napi limit: 3 (free) |
| Arena (5 könyv) | **250 XP** | Győzelem | Napi limit: 3 (free) |

---

### 💎 GYÉMÁNT FORRÁSOK

| Forrás | Gyémánt | Költség | Megjegyzés |
|--------|---------|---------|------------|
| Milestone (6 stage) | 5 💎 | Ingyenes | Automatikus |
| Shop (1 db) | 1 💎 | 100 🪙 | - |
| Shop (10 db) | 10 💎 | 900 🪙 | 10% kedvezmény |
| Shop (50 db) | 50 💎 | 4,000 🪙 | 20% kedvezmény |
| Shop (100 db) | 100 💎 | 7,500 🪙 | 25% kedvezmény |

---

### 🪙 ARANY FORRÁSOK

| Forrás | Arany | Költség | Megjegyzés |
|--------|-------|---------|------------|
| Quiz (Easy) | 50 🪙 | Ingyenes | Első teljesítés |
| Matching (Medium) | 100 🪙 | Ingyenes | Első teljesítés |
| Reading (Hard) | 150 🪙 | Ingyenes | Első teljesítés |
| Ismételt lecke | 20 🪙 | Ingyenes | Bármilyen típus |
| Arena győzelem | 50-500 🪙 | Kockázat | Tét visszanyerése |
| Shop (100 arany) | 100 🪙 | 490 Ft | - |
| Shop (500 arany) | 500 🪙 | 1,990 Ft | 19% kedvezmény |
| Shop (1,000 arany) | 1,000 🪙 | 3,490 Ft | 29% kedvezmény |
| Shop (5,000 arany) | 5,000 🪙 | 14,990 Ft | 39% kedvezmény |
| Kezdő jutalom | 1,000 🪙 | Ingyenes | Új fiók |

---

### 💸 ARANY FELHASZNÁLÁS

| Tevékenység | Költség | Megjegyzés |
|-------------|---------|------------|
| Könyv (1 nap) | 50 🪙 | Visszatérítés lehetséges |
| Könyv (7 nap) | ~325 🪙 | Visszatérítés lehetséges |
| Könyv (30 nap) | 1,000 🪙 | Legjobb deal, visszatérítés lehetséges |
| Arena tét (min) | 50 🪙 | Kockázat |
| Arena tét (max) | 500 🪙 | Kockázat |
| Gyémánt (1 db) | 100 🪙 | - |
| Gyémánt (10 db) | 900 🪙 | 10% kedvezmény |
| Gyémánt (50 db) | 4,000 🪙 | 20% kedvezmény |
| Gyémánt (100 db) | 7,500 🪙 | 25% kedvezmény |
| Streak Freeze | 500 🪙 | Serie megőrzés |

---

## 🎯 OPTIMÁLIS STRATÉGIÁK

### **XP Farming (Max XP/óra):**
1. **Reading leckék (Hard):** 150 XP/lecke (legjobb lecke/XP arány)
2. **Arena 5 könyvvel:** 250 XP/győzelem (legjobb XP/játék, de nehéz)
3. **Matching (Medium):** 100 XP/lecke (közepes sebesség)

### **Gyémánt Farming:**
1. **Sok lecke teljesítése:** 6 lecke = 5 💎 (milestone)
2. **Arany → Gyémánt:** 7,500 arany = 100 💎 (25% kedvezmény)

### **Arany Farming:**
1. **Reading leckék:** 150 🪙/lecke
2. **Arena (alacsony tét, biztos győzelem):** 50-200 🪙/győzelem
3. **Ismételt leckék:** 20 🪙/lecke (gyors)

### **Könyvkölcsönzés Optimalizálás:**
- **Rövid távú:** 1-3 nap (azonnal visszaadva teljes refund)
- **Hosszú távú:** 30 nap (legjobb ár/nap arány)
- **Visszaadás:** Mindig add vissza idő előtt → visszatérítés!

---

## 📈 PÉLDA PROGRESS (1 hét):

**Napi rutin (30 perc/nap):**
- 3 Reading lecke: 450 XP + 450 🪙
- 2 Arena győzelem (3 könyv): 300 XP + 200 🪙 (100 tét)
- **Napi összesen:** 750 XP + 650 🪙

**1 hét után:**
- **XP:** 5,250 XP (→ kb. 3-4 szint emelkedés az elején)
- **Arany:** 4,550 🪙
- **Gyémánt:** ~5-10 💎 (21 lecke ÷ 6 = 3-4 milestone)

---

## ❓ GYIK

**Q: Mennyi XP kell a max szinthez (100)?**  
A: ~137,796,123 XP (nagyon hosszú!)

**Q: Lehet-e XP-t veszíteni?**  
A: **NEM!** Az XP sosem csökken.

**Q: Mi történik Arena vereségnél?**  
A: Elveszíted a tétet (arany), de **0 XP-t kapsz**, nem veszítesz XP-t.

**Q: Lehet-e gyémántot visszaváltani aranyra?**  
A: **NEM!** Csak arany → gyémánt irány.

**Q: Mit csinálok ha elfogyott az aranyom?**  
A: 
1. Ismételt leckék (20 🪙/lecke)
2. Könyv visszaadása (refund)
3. Valós pénzből vásárlás (490 Ft → 100 🪙)

**Q: Mennyi ideig lehet kölcsönözni egy könyvet?**  
A: 1-30 nap között bármit.

**Q: Kaphatok teljes visszatérítést?**  
A: **IGEN!** Ha azonnal (< néhány óra) visszaadod, ~teljes refund.

---

## 🎊 ÖSSZEFOGLALÁS

✅ **XP:** Leckék (50-150 XP) + Arena (50-250 XP)  
✅ **Gyémánt:** 6 lecke = 5 💎 (automatikus milestone)  
✅ **Arany:** Leckék (50-150 🪙) + Arena (±50-500 🪙)  
✅ **Könyv:** 50-1000 🪙, visszaadva refund lehetséges  
✅ **Szintlépés:** Exponenciális növekedés (10%/szint)  

**Happy Grinding! 🚀**
