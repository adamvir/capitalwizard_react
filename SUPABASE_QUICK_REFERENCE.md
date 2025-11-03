# Supabase Gyors Referencia

## 🚀 Gyors Kezdés

### 1. Telepítés & Setup (egyszeri)
```bash
# 1. Környezeti változók beállítása
cp .env.example .env
# Szerkeszd a .env fájlt a Supabase credentials-ekkel

# 2. Supabase táblák létrehozása
# Másold be a supabase-setup.sql tartalmát a Supabase SQL Editor-ba
```

### 2. Hook-ok Használata

#### 🎮 Játékos Adatok
```typescript
import { usePlayer } from '@/hooks';

const { player, addPlayerXP, addCoins, addDiamonds } = usePlayer();

// XP hozzáadása
const { leveledUp } = await addPlayerXP(50);

// Érmék/gyémántok
await addCoins(100);
await addDiamonds(10);
```

#### 🔥 Streak
```typescript
import { useStreak } from '@/hooks';

const { streak, recordActivity } = useStreak();

// Aktivitás rögzítése (napi login, lecke befejezés)
await recordActivity();

// Adatok megjelenítése
<Text>Sorozat: {streak?.current_streak} nap</Text>
```

#### 📚 Lecke Előrehaladás
```typescript
import { useLessonProgress } from '@/hooks';

const { saveProgress, isLessonCompleted, getLessonScore } = useLessonProgress();

// Lecke befejezése
await saveProgress('lesson-id', true, 85);

// Ellenőrzés
if (isLessonCompleted('lesson-id')) {
  // ...
}
```

## 📁 Fájlstruktúra

```
src/
├── config/
│   └── supabase.ts              # Supabase client konfiguráció
├── types/
│   └── database.ts              # TypeScript típusok
├── services/
│   └── playerService.ts         # API funkciók
├── hooks/
│   ├── usePlayer.ts             # Játékos hook
│   ├── useStreak.ts             # Streak hook
│   ├── useLessonProgress.ts    # Lecke hook
│   └── index.ts                 # Exportok
└── components/
    └── examples/
        └── SupabaseExample.tsx  # Példa komponens
```

## 🗄️ Adatbázis Táblák

| Tábla | Leírás |
|-------|--------|
| `players` | Játékos profilok (szint, XP, érmék, gyémántok) |
| `streaks` | Napi sorozatok |
| `lesson_progress` | Lecke előrehaladás és pontszámok |
| `daily_limits` | Napi leckék limitje |

## 🔑 API Funkciók (playerService.ts)

### Játékos
- `createPlayer(data)` - Új játékos
- `getPlayer(id)` - Lekérés
- `updatePlayer(id, updates)` - Frissítés
- `addXP(id, amount)` - XP hozzáadás
- `updateCoins(id, amount)` - Érmék módosítása
- `updateDiamonds(id, amount)` - Gyémántok módosítása

### Streak
- `getStreak(playerId)` - Lekérés
- `updateStreak(playerId)` - Frissítés (automatikus számítás)

### Lecke
- `saveLessonProgress(playerId, lessonId, completed, score)` - Mentés
- `getPlayerLessonProgress(playerId)` - Összes lecke
- `getCompletedLessonsCount(playerId)` - Befejezett leckék száma

### Napi Limit
- `getTodayLimit(playerId)` - Mai limit
- `updateDailyLimit(playerId, maxLessons)` - Limit frissítés

## 🧪 Tesztelés

```typescript
import { testSupabaseConnection } from '@/config/supabase';

const connected = await testSupabaseConnection();
console.log(connected ? 'Kapcsolat OK' : 'Hiba');
```

## ⚡ Gyakori Minták

### Lecke Befejezése (teljes flow)
```typescript
const { player, addPlayerXP, addCoins } = usePlayer();
const { recordActivity } = useStreak();
const { saveProgress } = useLessonProgress();

const handleLessonComplete = async (lessonId: string, score: number) => {
  // 1. Mentjük az előrehaladást
  await saveProgress(lessonId, true, score);

  // 2. XP és érmék
  const { leveledUp } = await addPlayerXP(50);
  await addCoins(score * 10); // Pontszám alapú jutalom

  // 3. Streak frissítés
  await recordActivity();

  // 4. Szintlépés kezelése
  if (leveledUp) {
    Alert.alert('Szintlépés!', `Elérted a ${player?.level}. szintet!`);
  }
};
```

### Loading State Kezelése
```typescript
const { player, loading } = usePlayer();

if (loading) {
  return <ActivityIndicator />;
}

return <ProfileScreen player={player} />;
```

## 📝 Megjegyzések

- Az `EXPO_PUBLIC_` prefix kötelező a környezeti változókhoz
- A `.env` fájl automatikusan ignorálva van a git-ben
- A hook-ok automatikusan kezelik az ID-t (AsyncStorage)
- RLS (Row Level Security) be van kapcsolva minden táblán
- Timestamp-ek automatikusan frissülnek

## 🔗 További Információk

Részletes útmutató: `SUPABASE_SETUP.md`
Példa komponens: `src/components/examples/SupabaseExample.tsx`
