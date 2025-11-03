# 🔄 Supabase Adatfrissítés - Útmutató

## ⚠️ Probléma

Ha manuálisan módosítod az adatokat a Supabase dashboard-on (pl. +500 coins), az app **nem látja** a változást automatikusan.

---

## ✅ MEGOLDÁSOK (3 féle)

### 1. **Automatikus Frissítés** (10 másodpercenként) ⏰

**Már beépítve!** A `usePlayer` hook automatikusan frissül 10 másodpercenként.

```typescript
// src/hooks/usePlayer.ts
useEffect(() => {
  const interval = setInterval(() => {
    console.log('🔄 Auto-refreshing player data...');
    loadPlayer();
  }, 10000); // 10 másodperc

  return () => clearInterval(interval);
}, [loadPlayer]);
```

**Amit csinálsz:**
1. Supabase dashboard → módosítasz adatot
2. Várj max **10 másodpercet**
3. Az app automatikusan frissül ✅

---

### 2. **Képernyő Fókusz Frissítés** 📱

**Már beépítve!** Amikor visszatérsz a HomeScreen-re, automatikusan frissül.

```typescript
// src/screens/HomeScreen.tsx
useFocusEffect(
  useCallback(() => {
    console.log('🔄 HomeScreen focused - refreshing player data...');
    refreshPlayer();
  }, [refreshPlayer])
);
```

**Amit csinálsz:**
1. Supabase dashboard → módosítasz adatot
2. App-ban menj másik képernyőre
3. Menj vissza a Home-ra
4. Automatikusan frissül ✅

---

### 3. **Manuális Frissítés** (Pull-to-Refresh) 🔽

Ha szeretnéd hozzáadni a "húzd le a frissítéshez" funkciót:

#### HomeScreen-hez:

```typescript
import { RefreshControl } from 'react-native';

function HomeScreen() {
  const { refreshPlayer } = usePlayer();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPlayer();
    setRefreshing(false);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* ... content */}
    </ScrollView>
  );
}
```

---

## 🧪 Tesztelés

### Teszt 1: Automatikus frissítés (10s)

1. **Supabase Dashboard:**
   - Table Editor → `players` tábla
   - Találd meg a player-edet
   - Módosítsd a `coins` értéket: `0` → `500`
   - Mentsd el

2. **App-ban:**
   - Várj **10 másodpercet** ⏰
   - Nézd a console-t: `🔄 Auto-refreshing player data...`
   - Az coins frissül: `500` ✅

### Teszt 2: Képernyő fókusz frissítés

1. **Supabase Dashboard:**
   - Módosítsd a `coins`: `500` → `1000`

2. **App-ban:**
   - Menj másik képernyőre (pl. Profile)
   - Menj vissza a Home-ra
   - Console: `🔄 HomeScreen focused - refreshing player data...`
   - Az coins frissül: `1000` ✅

---

## 🎯 Legjobb Gyakorlat

### Mikor frissül automatikusan?

1. ✅ **App indításkor** → első betöltés
2. ✅ **10 másodpercenként** → automatikus polling
3. ✅ **Képernyő fókuszálásakor** → amikor visszatérsz
4. ✅ **Művelet után** (pl. XP hozzáadás) → azonnal frissül

### Mikor NEM frissül?

- ❌ Ha a Supabase dashboard-on módosítasz **ÉS** nem várod meg a 10 mp-et
- ❌ Ha más eszközön módosítasz **ÉS** nem használsz real-time subscription-t

---

## 🚀 Opcionális: Real-Time Subscription

Ha **azonnal** szeretnéd látni a változásokat (< 1 mp):

### Implementáció:

```typescript
// src/hooks/usePlayer.ts

useEffect(() => {
  if (!player?.id) return;

  // Subscribe to real-time changes
  const channel = supabase
    .channel('player-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'players',
        filter: `id=eq.${player.id}`,
      },
      (payload) => {
        console.log('🔴 REAL-TIME: Player updated!', payload);
        // Frissítsd a local state-et
        setPlayer(payload.new as Player);
      }
    )
    .subscribe();

  // Cleanup
  return () => {
    supabase.removeChannel(channel);
  };
}, [player?.id]);
```

**Előnyök:**
- ✅ **Azonnal** látod a változásokat (< 1 mp)
- ✅ **Multi-device** sync (más eszközön módosítasz, itt látod)
- ✅ Nincs polling overhead

**Hátrányok:**
- ❌ Több kód
- ❌ Több Supabase quota használat

---

## 📊 Összehasonlítás

| Módszer | Frissítési idő | Bonyolultság | Ajánlott |
|---------|---------------|--------------|----------|
| **Auto-refresh (10s)** | 10 másodperc | Egyszerű | ✅ Alapértelmezett |
| **Screen focus** | Azonnal | Egyszerű | ✅ Igen |
| **Pull-to-refresh** | Kézi | Közepes | 🟡 Opcionális |
| **Real-time** | < 1 másodperc | Bonyolult | 🟡 Ha kell |

---

## 🎮 Használati Példák

### Példa 1: Devtools Tesztelés

```
1. Supabase → players → coins = 1000
2. App → várj 10 mp
3. ✅ Látod: 1000 coins
```

### Példa 2: Gyors Frissítés

```
1. Supabase → players → level = 10
2. App → menj Profile-ra
3. App → menj vissza Home-ra
4. ✅ Látod: Level 10
```

### Példa 3: Lecke Befejezés (automatikus)

```
1. Befejezed a leckét
2. addPlayerXP(50) → Supabase UPDATE
3. ✅ Azonnal látod az új XP-t (hook refreshes)
```

---

## 🐛 Debug

### Console Log-ok

Nézd meg ezeket a log-okat:

```
🔄 Auto-refreshing player data...       → 10s polling működik
🔄 HomeScreen focused - refreshing...   → Screen focus refresh
✅ Player data refreshed                → Sikeres frissítés
```

### Ha nem frissül:

1. **Ellenőrizd a console-t** → vannak log-ok?
2. **Ellenőrizd a Supabase-t** → tényleg módosult az adat?
3. **Restart az app** → `npm start -- --clear`
4. **Ellenőrizd a .env** → helyes URL és API key?

---

## ✅ Összefoglalás

Most már **3 módszer** van az adatok frissítésére:

1. ⏰ **Automatikus** (10s) - mindig működik
2. 📱 **Képernyő fókusz** - amikor visszatérsz
3. 🎮 **Műveletek után** - XP hozzáadás, stb.

**Ha gyorsabb real-time-ot szeretnél** → használd a Real-Time Subscription-t!

**Normál használatra az auto-refresh (10s) tökéletes!** ✅
