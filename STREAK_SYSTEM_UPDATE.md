# 🔥 Streak Rendszer Frissítve!

## ✅ Mi változott?

### ELŐTTE ❌
- **Automatikus** streak frissítés **minden** napi bejelentkezésnél
- Jutalmak jöttek **játék nélkül** is
- WelcomeScreen-en automatikus `recordActivity()`

### UTÁNA ✅
- Streak **CSAK** lecke befejezésekor frissül
- **Játszanod kell** hogy növeld a streak-et
- Lecke befejezéskor **bónusz jutalmak** a streak alapján

---

## 🎮 Hogyan Működik Most?

### 1. Lecke Befejezés = Streak + Jutalom

```
Befejezed a leckét
    ↓
Kapsz: XP + Coins (lecke jutalom)
    ↓
Streak frissül (csak ha új nap van!)
    ↓
Ha növekedett a streak:
    🔥 BÓNUSZ JUTALOM! +60, +70, +80... coins
```

### 2. Bónusz Számítás

| Streak | Bónusz |
|--------|--------|
| 1 nap | +60 coins |
| 2 nap | +70 coins |
| 3 nap | +80 coins |
| 5 nap | +100 coins |
| 10 nap | +150 coins |

**Képlet:** `50 + (streak * 10)`

---

## 📱 Példa Flow

### Hétfő (1. nap):
```
1. Megnyitod az appot
   - Streak: 0 → nincs változás

2. Befejezed az első leckét
   - Alapjutalom: +50 XP, +100 coins
   - Streak: 0 → 1 (új!)
   - Bónusz: +60 coins 🔥
   - Összesen: +50 XP, +160 coins
```

### Kedd (2. nap):
```
1. Megnyitod az appot
   - Streak: 1 → nincs változás (nem játszottál még)

2. Befejezed a második leckét
   - Alapjutalom: +50 XP, +100 coins
   - Streak: 1 → 2 (folytatódik!)
   - Bónusz: +70 coins 🔥
   - Összesen: +50 XP, +170 coins
```

### Szerda (nem játszol):
```
- Megnyitod az appot
  - Streak: 2 → nem változik
  - Nincs jutalom (nem játszottál)
```

### Csütörtök (elveszett 1 nap):
```
1. Megnyitod az appot
   - Streak: 2 → nincs változás

2. Befejezed a leckét
   - Alapjutalom: +50 XP, +100 coins
   - Streak: 2 → 0 (megszakadt, mert tegnap nem játszottál!)
   - Nincs bónusz ❌
   - Újra kezdődik: 0 → 1
   - Új bónusz: +60 coins 🔥
```

---

## 🎯 Alert Üzenetek

### Alap lecke befejezés (nincs streak növekedés):
```
Lecke Befejezve! ✅

+50 XP
+100 Érme
```

### Lecke befejezés + új streak nap:
```
Lecke Befejezve! ✅

+50 XP
+100 Érme

🔥 3 napos sorozat!
+80 Bónusz Érme
```

### Lecke befejezés + szintlépés + streak:
```
Szintlépés! 🎉
Elérted a 5. szintet!

+50 XP
+100 Érme

🔥 5 napos sorozat!
+100 Bónusz Érme
```

---

## 💡 Miért Jobb Ez?

### ✅ Előnyök:

1. **Motiváló**: Csak akkor kapsz jutalmakat, ha játszol
2. **Fair**: Nem lehet "csalással" növelni a streak-et
3. **Jutalmazó**: Extra bónuszok a hűséges játékosoknak
4. **Egyértelmű**: Látod pontosan mit kaptál és miért

### ❌ Előtte volt:

- Automatikus jutalmak napi bejelentkezéskor
- Streak nőtt anélkül hogy játszottál volna
- Nem volt motiváció lecke befejezésre

---

## 🔧 Technikai Részletek

### Streak frissítés logika:

```typescript
// LessonGameScreen.tsx (handleWin)

// 1. Elmenti a jelenlegi streak-et
const previousStreak = streak?.current_streak || 0;

// 2. Frissíti a streak-et (automatikusan kezeli az új napot)
await recordActivity();

// 3. Megnézi növekedett-e
const newStreak = streak?.current_streak || 0;

// 4. Ha növekedett → bónusz
if (newStreak > previousStreak) {
  const streakBonus = 50 + (newStreak * 10);
  await addCoins(streakBonus);
}
```

### Mi történik a Supabase-ben:

```sql
-- streaks tábla
UPDATE streaks
SET
  current_streak =
    CASE
      WHEN last_activity_date = CURRENT_DATE THEN current_streak
      WHEN last_activity_date = CURRENT_DATE - 1 THEN current_streak + 1
      ELSE 1  -- Reset ha több mint 1 nap telt el
    END,
  longest_streak = GREATEST(longest_streak, current_streak + 1),
  last_activity_date = CURRENT_DATE
WHERE player_id = 'xxx';
```

---

## 🎮 Tippek Játékosoknak

1. **Napi 1 lecke minimum** → tartsd a streak-et
2. **Minél hosszabb a streak** → több bónusz
3. **Ne hagyd megszakadni** → újra kell kezdeni 1-ről
4. **Kombináld a jutalmakat** → lecke + streak + szintlépés = sok coins!

---

## 📊 Példa Számítások

### 7 napos streak befejezése:

| Nap | Lecke | Streak | Lecke Coins | Streak Bónusz | Össz Coins |
|-----|-------|--------|-------------|---------------|------------|
| 1. | ✅ | 1 | 100 | 60 | 160 |
| 2. | ✅ | 2 | 100 | 70 | 170 |
| 3. | ✅ | 3 | 100 | 80 | 180 |
| 4. | ✅ | 4 | 100 | 90 | 190 |
| 5. | ✅ | 5 | 100 | 100 | 200 |
| 6. | ✅ | 6 | 100 | 110 | 210 |
| 7. | ✅ | 7 | 100 | 120 | 220 |
| **ÖSSZESEN** | | | **700** | **630** | **1,330** 🎉 |

### Ha megszakad a 7. napon:

| Nap | Lecke | Streak | Lecke Coins | Streak Bónusz | Össz Coins |
|-----|-------|--------|-------------|---------------|------------|
| 1-6. | ✅ | 1-6 | 600 | 510 | 1,110 |
| 7. | ❌ | - | 0 | 0 | 0 |
| 8. | ✅ | 1 (reset!) | 100 | 60 | 160 |

**Veszteség:** ~560 coins amit el lehetett volna érni! 😱

---

## ✅ Összefoglalás

- 🎮 **Csak játékkal** növekszik a streak
- 🔥 **Bónusz jutalmak** hosszabb streak-ért
- 💰 **Extra coins** minden új streak nap után
- 📈 **Motiváció** napi játékra

**Játssz minden nap → növeld a streak-et → szerezz extra jutalmakat!** 🚀
