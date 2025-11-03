# 🚀 Supabase Setup - Teljes Útmutató

## ✅ Most már csak EGY fájlt kell futtatnod!

Minden adat külön táblában van (jobb struktúra), DE automatikusan létrejön amikor új player regisztrál!

---

## 📄 Futtasd le ezt az EGY fájlt:

### `supabase-complete-setup.sql`

1. Nyisd meg a Supabase Dashboard-ot: https://app.supabase.com
2. Válaszd ki a projektedet
3. Menj a **SQL Editor**-ba (bal oldali menü)
4. Kattints a **New query** gombra
5. Másold be a `supabase-complete-setup.sql` tartalmát
6. Kattints a **Run** gombra

---

## 🎉 Mi történik automatikusan?

### Amikor lefut az SQL:
- ✅ Létrejön **5 tábla**: players, streaks, lesson_progress, daily_limits, rented_books
- ✅ Létrejön egy **database trigger**, ami automatikusan inicializál minden új playert
- ✅ Minden tábla megkapja a szükséges indexeket és RLS policy-kat

### Amikor egy új player létrejön az app-ban:
1. App létrehoz egy új rekordot a `players` táblában
2. **AUTOMATIKUSAN** (trigger által):
   - Létrejön egy `streaks` rekord (0 nap, mai dátum)
3. Készen áll:
   - `lesson_progress` használatra (amikor elvégez egy leckét)
   - `rented_books` használatra (amikor kölcsönöz egy könyvet)
   - `daily_limits` használatra (amikor napi limitet használ)

---

## 📊 Tábla struktúra

```
┌─────────────┐
│   players   │ ← Fő tábla (player adatok)
└──────┬──────┘
       │
       ├─► streaks          (napi sorozat)
       ├─► lesson_progress  (lecke előrehaladás)
       ├─► daily_limits     (napi limitek)
       └─► rented_books     (kölcsönzött könyvek + hol tart)
```

### Miért több tábla?

❌ **Egy tábla:** Nem lehet több könyvet, több lecke progress-t kezelni
✅ **Több tábla:** Skálázható, tiszta struktúra, könnyen kezelhető

**De automatikus létrehozás!** A trigger gondoskodik róla, hogy minden adat meglegyen.

---

## 🧪 Ellenőrzés

Az SQL futtatása után futtasd le ezeket a lekérdezéseket:

```sql
-- Ellenőrzés: Létrejöttek-e a táblák?
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Ellenőrzés: Létrejött-e a trigger?
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'trigger_initialize_new_player';
```

---

## 🔄 Migrálás (ha már van régi adatod)

Ha már van régi `players` táblád a régi constraint-tel:

```sql
-- Töröld a régi constraint-et
ALTER TABLE players DROP CONSTRAINT IF EXISTS players_subscription_type_check;

-- Add hozzá az új constraint-et
ALTER TABLE players
ADD CONSTRAINT players_subscription_type_check
CHECK (subscription_type IN ('free', 'pro', 'master'));
```

---

## 🎮 Használat az app-ban

### 1. Új player létrehozása
```typescript
import { createPlayer } from './services/playerService';

const newPlayer = await createPlayer({
  username: 'JohnDoe',
  avatar_id: 1,
  level: 1,
  xp: 0,
  coins: 0,
  diamonds: 0,
  subscription_type: 'free',
  streak_freezes: 0,
});

// ✅ A streak AUTOMATIKUSAN létrejött!
// Nincs szükség külön createStreak() hívásra
```

### 2. Könyv kölcsönzése
```typescript
import { useRentedBooks } from './hooks';

const { rentNewBook } = useRentedBooks();

await rentNewBook('Pénzügyi Alapismeretek', 7); // 7 napra
```

### 3. Lecke előrehaladás mentése
```typescript
import { useLessonProgress } from './hooks';

const { saveProgress } = useLessonProgress();

await saveProgress('Pénzügyi Alapismeretek-0-reading', true, 100);
```

---

## 🐛 Troubleshooting

### Probléma: "relation already exists"
**Megoldás:** A táblák már léteznek. Futtasd le újra az SQL-t, a `CREATE TABLE IF NOT EXISTS` miatt nem fog hibát dobni.

### Probléma: Új player-nek nincs streak-je
**Megoldás:** Ellenőrizd, hogy a trigger létrejött-e:
```sql
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'trigger_initialize_new_player';
```

Ha nincs, futtasd le újra a teljes SQL script-et.

---

## 📝 Megjegyzések

- A **RLS (Row Level Security)** engedélyezve van minden táblán
- Jelenleg minden player láthatja a többi player adatait (leaderboard miatt)
- A `rented_books` táblában van `current_lesson_index` és `current_game_type` → tudjuk, hogy hol tart a könyvben

---

## ✅ Checklist

- [ ] Futtattam a `supabase-complete-setup.sql` fájlt
- [ ] Ellenőriztem, hogy létrejöttek a táblák
- [ ] Ellenőriztem, hogy létrejött a trigger
- [ ] Teszteltem új player létrehozását
- [ ] Ellenőriztem, hogy a streak automatikusan létrejött

**Ha minden kész, töröld a régi SQL fájlokat!**
