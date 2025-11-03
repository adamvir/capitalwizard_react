# 🔗 Supabase Integráció Példák

Konkrét példák arra, hogyan használd a Supabase hook-okat a meglévő képernyőidben.

---

## 📋 Tartalom

1. [Profil Képernyő Integrációja](#1-profil-képernyő)
2. [Lecke Befejezése](#2-lecke-befejezése)
3. [Napi Bejelentkezés Jutalom](#3-napi-bejelentkezés)
4. [Leaderboard / Rangsor](#4-leaderboard)

---

## 1. Profil Képernyő

### ELŐTTE (AsyncStorage)

```typescript
// ProfileScreen.tsx - RÉGI
import AsyncStorage from '@react-native-async-storage/async-storage';

const [level, setLevel] = useState(1);
const [xp, setXP] = useState(0);
const [coins, setCoins] = useState(0);

useEffect(() => {
  loadProfile();
}, []);

const loadProfile = async () => {
  const savedLevel = await AsyncStorage.getItem('playerLevel');
  const savedXP = await AsyncStorage.getItem('playerXP');
  const savedCoins = await AsyncStorage.getItem('playerCoins');

  if (savedLevel) setLevel(parseInt(savedLevel));
  if (savedXP) setXP(parseInt(savedXP));
  if (savedCoins) setCoins(parseInt(savedCoins));
};
```

### UTÁNA (Supabase)

```typescript
// ProfileScreen.tsx - ÚJ
import { usePlayer } from '../hooks';

function ProfileScreen() {
  const { player, loading, updatePlayerData } = usePlayer();

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Text>Szint: {player?.level}</Text>
      <Text>XP: {player?.xp}</Text>
      <Text>Érmék: {player?.coins}</Text>

      {/* Felhasználónév módosítása */}
      <Button
        title="Mentés"
        onPress={() => updatePlayerData({ username: newUsername })}
      />
    </View>
  );
}
```

**Előnyök:**
- ✅ Automatikus szinkronizáció
- ✅ Nincs manuális betöltés/mentés
- ✅ Real-time frissülés
- ✅ TypeScript típusbiztonság

---

## 2. Lecke Befejezése

### Teljes Flow Példa

```typescript
// LessonGameScreen.tsx
import { usePlayer, useStreak, useLessonProgress } from '../hooks';
import { Alert } from 'react-native';

function LessonGameScreen({ route, navigation }) {
  const { lessonId } = route.params;

  // Hook-ok
  const { player, addPlayerXP, addCoins } = usePlayer();
  const { recordActivity } = useStreak();
  const { saveProgress } = useLessonProgress();

  const handleLessonComplete = async (score: number) => {
    try {
      // 1. Lecke előrehaladás mentése
      await saveProgress(lessonId, true, score);

      // 2. XP számítás (pontszám alapján)
      const earnedXP = Math.floor(score / 2); // 50-100 XP
      const { leveledUp } = await addPlayerXP(earnedXP);

      // 3. Érmék hozzáadása
      const earnedCoins = score * 10; // 850-1000 coins
      await addCoins(earnedCoins);

      // 4. Streak frissítés (napi aktivitás)
      await recordActivity();

      // 5. Feedback a felhasználónak
      if (leveledUp) {
        Alert.alert(
          '🎉 Szintlépés!',
          `Gratulálok! Elérted a ${player?.level}. szintet!\n\n` +
          `+${earnedXP} XP\n` +
          `+${earnedCoins} Érme`,
          [{ text: 'Rendben', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          '✅ Lecke Befejezve!',
          `+${earnedXP} XP\n+${earnedCoins} Érme`,
          [{ text: 'Folytatás', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      Alert.alert('Hiba', 'Nem sikerült menteni az eredményt');
    }
  };

  // Lecke vége
  const onQuizEnd = (score: number) => {
    handleLessonComplete(score);
  };

  return (
    <QuizComponent onComplete={onQuizEnd} />
  );
}
```

---

## 3. Napi Bejelentkezés

### Welcome/Home Screen - Streak Jutalom

```typescript
// HomeScreen.tsx vagy WelcomeScreen.tsx
import { useEffect } from 'react';
import { useStreak, usePlayer } from '../hooks';
import { Alert } from 'react-native';

function HomeScreen() {
  const { streak, recordActivity } = useStreak();
  const { addCoins } = usePlayer();

  useEffect(() => {
    handleDailyLogin();
  }, []);

  const handleDailyLogin = async () => {
    // Előző streak érték
    const previousStreak = streak?.current_streak || 0;

    // Streak frissítés (automatikusan kezeli a napokat)
    await recordActivity();

    // Ha új nap, új streak
    const newStreak = streak?.current_streak || 0;

    if (newStreak > previousStreak) {
      // Napi jutalom
      const dailyReward = 50 + (newStreak * 10); // 60, 70, 80...
      await addCoins(dailyReward);

      Alert.alert(
        '🔥 Napi Jutalom!',
        `${newStreak} napos sorozat!\n+${dailyReward} Érme`,
        [{ text: 'Köszönöm!' }]
      );
    }
  };

  return (
    <View>
      <Text>Jelenlegi sorozat: {streak?.current_streak} nap 🔥</Text>
      {/* ... */}
    </View>
  );
}
```

---

## 4. Leaderboard (Rangsor)

### Top 10 Játékos Lekérése

```typescript
// LeaderboardScreen.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { Database } from '../types/database';

type Player = Database['public']['Tables']['players']['Row'];

function LeaderboardScreen() {
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('level', { ascending: false })
        .order('xp', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Leaderboard error:', error);
        return;
      }

      setTopPlayers(data || []);
    } catch (error) {
      console.error('Exception loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView>
      <Text style={styles.title}>🏆 Toplista</Text>
      {topPlayers.map((player, index) => (
        <View key={player.id} style={styles.playerRow}>
          <Text style={styles.rank}>#{index + 1}</Text>
          <Text style={styles.username}>
            {player.username || `Játékos ${player.id.substring(0, 6)}`}
          </Text>
          <Text style={styles.level}>Lvl {player.level}</Text>
          <Text style={styles.xp}>{player.xp} XP</Text>
        </View>
      ))}
    </ScrollView>
  );
}
```

---

## 5. Real-time Értesítések (Opcionális)

### Élő Adatfrissítés

Ha szeretnéd, hogy a változások azonnal látszódjanak:

```typescript
// ProfileScreen.tsx vagy bármely képernyő
import { useEffect } from 'react';
import { supabase } from '../config/supabase';

function ProfileScreen() {
  const { player, refreshPlayer } = usePlayer();

  useEffect(() => {
    // Real-time subscription
    const channel = supabase
      .channel('player-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'players',
          filter: `id=eq.${player?.id}`,
        },
        (payload) => {
          console.log('Player updated:', payload);
          refreshPlayer(); // Frissítjük a lokális adatokat
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [player?.id]);

  return (
    <View>
      <Text>Érmék: {player?.coins}</Text>
      {/* Real-time frissül ha változik! */}
    </View>
  );
}
```

---

## 6. Offline Támogatás (Opcionális)

### Fallback AsyncStorage-ra

Ha nincs internet, használj fallback-et:

```typescript
import { usePlayer } from '../hooks';
import { storage, STORAGE_KEYS } from '../utils/storage';

function MyComponent() {
  const { player, loading, error } = usePlayer();
  const [cachedPlayer, setCachedPlayer] = useState(null);

  useEffect(() => {
    if (error) {
      // Ha nincs kapcsolat, használj cache-t
      loadCachedData();
    }
  }, [error]);

  const loadCachedData = async () => {
    const cached = await storage.getItem(STORAGE_KEYS.PLAYER_DATA);
    setCachedPlayer(cached);
  };

  const displayPlayer = player || cachedPlayer;

  return (
    <View>
      {error && <Text>⚠️ Offline mód</Text>}
      <Text>Szint: {displayPlayer?.level}</Text>
    </View>
  );
}
```

---

## 📝 Migráció Checklist

Ha át akarod állítani a teljes appot Supabase-re:

### 1. Játékos Adatok
- [ ] Replace AsyncStorage `playerLevel` → `usePlayer().player.level`
- [ ] Replace AsyncStorage `playerXP` → `usePlayer().player.xp`
- [ ] Replace AsyncStorage `playerCoins` → `usePlayer().player.coins`
- [ ] Replace AsyncStorage `playerDiamonds` → `usePlayer().player.diamonds`

### 2. Streak
- [ ] Replace AsyncStorage streak logic → `useStreak()`
- [ ] Add `recordActivity()` minden napi eseménynél

### 3. Leckék
- [ ] Replace AsyncStorage completed lessons → `useLessonProgress()`
- [ ] Add `saveProgress()` minden lecke befejezésnél

### 4. Jutalmak
- [ ] Replace coin manuális állítás → `addCoins()`
- [ ] Replace XP manuális állítás → `addPlayerXP()`
- [ ] Add szintlépés kezelés

---

## 🎯 Best Practices

1. **Mindig használj try-catch-et**
   ```typescript
   try {
     await addPlayerXP(50);
   } catch (error) {
     console.error('XP error:', error);
     Alert.alert('Hiba történt');
   }
   ```

2. **Loading state kezelése**
   ```typescript
   const { player, loading } = usePlayer();
   if (loading) return <ActivityIndicator />;
   ```

3. **Null check**
   ```typescript
   <Text>{player?.level || 1}</Text>
   ```

4. **Batch műveletek**
   ```typescript
   // Rossz - 3 külön hívás
   await addPlayerXP(50);
   await addCoins(100);
   await recordActivity();

   // Jó - párhuzamos
   await Promise.all([
     addPlayerXP(50),
     addCoins(100),
     recordActivity(),
   ]);
   ```

---

## 🚀 Kész!

Ezekkel a példákkal könnyen integrálhatod a Supabase-t a meglévő kódodba!

**További segítség:**
- `SUPABASE_QUICK_REFERENCE.md` - Hook API referencia
- `src/components/examples/SupabaseExample.tsx` - Működő példa komponens
- `src/hooks/usePlayer.ts` - Hook implementáció
