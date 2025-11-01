# Lecke Rendszer - Áttekintés

## 🎯 Jelenlegi Állapot

### Elkészült Funkciók

✅ **Duolingo-szerű Lecke Térkép**
- Vizuális megjelenítés minden leckéről
- Oldalak szerinti csoportosítás
- 3 játék típus oldalanként (1. kör): Olvasás → Párosítás → Kvíz

✅ **Haladás Mentése & Megjelenítése**
- LocalStorage alapú mentés
- Haladás megmarad kölcsönzés lejárta után is
- Vizuális jelzések:
  - ✅ Zöld = Teljesített lecke
  - 🟡 Sárga = Jelenlegi lecke
  - 🔵 Kék = Elérhető lecke

✅ **Könyv Választó Oldal**
- Kölcsönzött könyvek listája
- Haladás százalék mutatása
- Előző haladás elérése (ha könyv nincs kölcsönözve)

✅ **Statisztikák**
- Teljesített leckék száma
- Százalékos haladás
- Lecke térképen egyértelmű jelzések

### Technikai Részletek

**Adattárolás:**
- `lessonProgress` objektum a localStorage-ban
- Struktúra: `{ "Könyv Cím": { "pageIndex-gameType": true } }`
- Példa: `{ "Pénzügyi Alapismeretek": { "0-reading": true, "0-matching": true } }`

**Event System:**
- `lessonCompleted` event amikor lecke befejeződik
- Automatikus frissítés a LessonsPage komponensben
- Real-time statisztika frissítés

## 📊 Tartalom Állapot

### Pénzügyi Alapismeretek Könyv

**Könyv tartalom:** 60 oldal (PenzugyiAlapismeretkBookView.tsx)
**Lecke tartalom:** 60 oldal (penzugyiAlapismeretkLessons.ts) ✅ **TELJES**

**Első kör leckék:** 60 oldal × 3 játék = 180 lecke
**Második kör leckék:** 60 oldal × 1 játék = 60 lecke
**Összesen:** 240 lecke

### Tartalom Állapot

**Mind a 60 oldal feldolgozva!** ✅
- Szöveges tartalom: ✅ Megvan (mind a 60 oldal)
- Olvasó kérdések: ✅ Elkészült (mind a 60 oldal)
- Párosítások: ✅ Elkészült (mind a 60 oldal)
- Kvíz kérdések: ✅ Elkészült (mind a 60 oldal)

## 🔧 További Leckék Hozzáadása

Lásd a részletes útmutatót: [LESSON_GUIDE.md](./LESSON_GUIDE.md)

### Gyors Összefoglaló

1. Nyisd meg: `/data/penzugyiAlapismeretkLessons.ts`
2. Másold a struktúrát egy meglévő leckéből
3. Töltsd ki az új oldal adataival:
   - `id`: Folytatólagos szám (13, 14, 15...)
   - `pageNumber`: Ugyanaz mint az id
   - `reading`: Szöveg + 3-5 kérdés
   - `matching`: 10-15 párosítás
   - `quiz`: 3-5 kvíz kérdés

4. Add hozzá a tömb végéhez
5. Mentsd el
6. Automatikusan megjelenik az alkalmazásban! ✨

## 📱 Felhasználói Felület

### Főbb Funkciók

**Könyv Választás:**
- Kölcsönzött könyvek listája
- Haladás mutatók
- Előző haladás elérhetősége

**Lecke Térkép:**
- Oldalak szerinti rendezés
- Minden lecke kattintható
- Státusz jelzések (teljesített/jelenlegi/elérhető)
- Animációk és vizuális visszajelzések

**Haladás Követés:**
- Százalékos haladás mutatása
- Teljesített vs. összes lecke
- Könyvenként külön statisztika

## 🎮 Játék Típusok

### 1. Olvasó Játék (Reading)
- Szöveges tartalom megjelenítése
- Kérdések a szöveg alapján
- Kulcsszó alapú válasz ellenőrzés

### 2. Párosító Játék (Matching)
- Fogalom-definíció párosítás
- Drag & drop interakció
- 10-15 pár oldalanként

### 3. Kvíz Játék (Quiz)
- Feleletválasztós kérdések
- 4 válaszlehetőség
- Azonnali visszajelzés

## 🔄 Lecke Folyamat

```
1. Könyv kiválasztása
   ↓
2. Lecke kiválasztása a térképről
   ↓
3. Játék játszása
   ↓
4. Lecke teljesítése
   ↓
5. Haladás mentése
   ↓
6. Automatikus visszatérés a térképhez
   ↓
7. Következő lecke választása
```

## 💾 Adatmegőrzés

**Mentés időpontja:**
- Lecke befejezésekor
- Automatikus, nincs szükség kézi mentésre

**Megőrzési idő:**
- Határozatlan ideig (localStorage)
- Akkor is megmarad, ha könyv nincs kölcsönözve
- Böngésző adatok törlésével veszhet el

**Kompatibilitás:**
- Működik kölcsönzött és nem kölcsönzött könyveknél
- Több könyv haladása külön tárolódik
- Nincs interferencia könyvek között

## 🎨 Vizuális Dizájn

**Színkódok:**
- 🟢 Zöld: Teljesített lecke (CheckCircle2 ikon)
- 🟡 Sárga: Jelenlegi lecke (kitöltött kör, pulsing)
- 🔵 Kék: Elérhető lecke (üres kör)

**Animációk:**
- Slide-in animáció leckéknél
- Hover effekt (kicsit jobbra mozog)
- Scale animáció kattintáskor
- Progress bar smooth transition

## 🚀 Jövőbeli Fejlesztési Lehetőségek

1. **Több könyv támogatása**
   - Többi könyv lecke rendszerrel való ellátása
   - Univerzális lecke engine

2. **Statisztikák bővítése**
   - Napi streak
   - Teljesítmény grafikonok
   - Időalapú statisztikák

3. **Gamification**
   - Achievements (teljesítmények)
   - Leaderboards
   - Különleges jutalmak

4. **Exportálás**
   - Haladás exportálása
   - Megosztás közösségi médiában
   - Tanúsítvány generálás

## 📞 Támogatás

Ha kérdésed van a lecke rendszerrel kapcsolatban:
1. Nézd meg a [LESSON_GUIDE.md](./LESSON_GUIDE.md) fájlt
2. Ellenőrizd a `penzugyiAlapismeretkLessons.ts` fájl struktúráját
3. Tesztelj minden változtatást alaposan

---

## 🎉 Mérföldkövek

- ✅ **2025-10-25** - **TELJES KÖNYV FELDOLGOZVA** - Mind a 60 oldal (240 lecke)
- ✅ **2025-10-25** - Haladás mentése és megőrzése implementálva
- ✅ **2025-10-25** - Duolingo-szerű lecke térkép elkészült
- ✅ **2025-10-25** - Vizuális statisztikák és haladás követés hozzáadva
- ✅ **2025-10-25** - Teljes tartalom: Bevezetés, Pénz, Kialakulás, Tulajdonságok, Infláció, Megtakarítás, Befektetés, Kockázatok

---

**Utolsó frissítés:** 2025-10-25
**Verzió:** 3.0 - 60 OLDAL TELJES KÖNYV ✅
**Készítette:** Figma Make AI Assistant
