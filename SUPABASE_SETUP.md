# Supabase Setup Útmutató - Capital Wizard

Ez az útmutató végigvezet a Supabase integráció beállításán a Capital Wizard projektben.

## 📋 Tartalomjegyzék

1. [Előfeltételek](#előfeltételek)
2. [Supabase Projekt Létrehozása](#supabase-projekt-létrehozása)
3. [Adatbázis Táblák Létrehozása](#adatbázis-táblák-létrehozása)
4. [Környezeti Változók Beállítása](#környezeti-változók-beállítása)
5. [Használat a Kódban](#használat-a-kódban)
6. [Tesztelés](#tesztelés)

## 🎯 Előfeltételek

- Supabase account: [https://app.supabase.com](https://app.supabase.com)
- Node.js és npm telepítve
- A projekt klónozva és függőségek telepítve (`npm install`)

## 🚀 Supabase Projekt Létrehozása

### 1. Regisztráció/Bejelentkezés

1. Menj a [https://app.supabase.com](https://app.supabase.com) oldalra
2. Jelentkezz be GitHub, Google vagy email fiókkal

### 2. Új Projekt Létrehozása

1. Kattints a **"New project"** gombra
2. Válassz ki egy szervezetet vagy hozz létre újat
3. Add meg a projekt adatait:
   - **Name**: `capital-wizard` (vagy tetszőleges név)
   - **Database Password**: Generálj egy erős jelszót (mentsd el!)
   - **Region**: Válaszd a hozzád legközelebbi régiót (pl. Europe - Frankfurt)
   - **Pricing Plan**: Kezdetnek a Free tier is elegendő

4. Kattints a **"Create new project"** gombra
5. Várj 1-2 percet, amíg a projekt elkészül

## 🗄️ Adatbázis Táblák Létrehozása

### 1. SQL Editor Megnyitása

**2 lehetőség van:**

#### A) SQL Editor (ajánlott)
1. A Supabase dashboard-on (https://app.supabase.com)
2. Kattints bal oldalt a **"SQL Editor"** ikonra (⚡ villám ikon vagy "SQL Editor" szöveg)
3. Az oldal jobb felső sarkában látsz egy **"+ New query"** gombot VAGY
4. Ha nem látod, egyszerűen csak kattints középre, ahol van egy nagy üres szövegmező

#### B) Database → SQL Editor (alternatív)
1. Kattints bal oldalt a **"Database"** menüre
2. Válaszd ki a **"SQL Editor"** tab-ot (felül)
3. Kattints a **"+ New query"** gombra (vagy használd az üres szövegmezőt)

### 2. SQL Szkript Futtatása

1. Nyisd meg a projekt gyökérkönyvtárában lévő `supabase-setup.sql` fájlt (bármelyik szövegszerkesztővel)
2. Másold ki a **TELJES** tartalmát (Ctrl+A, Ctrl+C / Cmd+A, Cmd+C)
3. Illeszd be a Supabase SQL Editor-ba (a nagy szövegmezőbe)
4. Kattints a **"RUN"** gombra
   - Ez lehet jobb alsó sarokban egy **"Run"** vagy **"▶️ Run"** gomb
   - VAGY egy zöld/kék gomb felül **"Run"** felirattal

A szkript automatikusan létrehozza:
- ✅ `players` - Játékos profilok
- ✅ `streaks` - Napi sorozatok
- ✅ `lesson_progress` - Lecke előrehaladás
- ✅ `daily_limits` - Napi limitek
- ✅ Row Level Security (RLS) policy-k
- ✅ Automatikus timestamp frissítés (triggers)
- ✅ Teszt adatok (opcionális)

### 3. Táblák Ellenőrzése

1. Navigálj a **Table Editor** menüponthoz
2. Láthatod az összes létrehozott táblát
3. Kattints rájuk, hogy megnézd a struktúrájukat

## 🔑 Környezeti Változók Beállítása

### 1. API Kulcsok Lekérése

1. A Supabase dashboard-on menj a **Settings** (⚙️) menübe
2. Válaszd ki az **API** almenüt
3. Másold ki az alábbi értékeket:
   - **Project URL** (pl. `https://xyzabc123.supabase.co`)
   - **anon/public** API key (a hosszú token)

### 2. .env Fájl Létrehozása

1. A projekt gyökérkönyvtárában található `.env.example` fájlt másold át `.env` névre:
   ```bash
   cp .env.example .env
   ```

2. Nyisd meg a `.env` fájlt és töltsd ki az értékeket:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Cseréld le:
   - `your-project-id` → A saját projekt URL-ed
   - `your-anon-key-here` → A saját anon kulcsod

**⚠️ FONTOS:**
- A `.env` fájl már be van rakva a `.gitignore`-ba, NE commitold!
- Minden csapattag használja a saját `.env` fájlját

## 💻 Használat a Kódban

A projekt már tartalmaz minden szükséges kódot. Íme néhány példa:

### 1. Játékos Adatok Kezelése

```typescript
import { usePlayer } from '@/hooks/usePlayer';

function ProfileScreen() {
  const { player, loading, addPlayerXP, addCoins } = usePlayer();

  const handleLessonComplete = async () => {
    // XP hozzáadása (automatikusan kezeli a szintlépést)
    const { leveledUp } = await addPlayerXP(50);

    if (leveledUp) {
      console.log('Szintlépés! 🎉');
    }

    // Érmék hozzáadása
    await addCoins(100);
  };

  if (loading) return <Text>Betöltés...</Text>;

  return (
    <View>
      <Text>Szint: {player?.level}</Text>
      <Text>XP: {player?.xp}</Text>
      <Text>Érmék: {player?.coins}</Text>
    </View>
  );
}
```

### 2. Streak Kezelése

```typescript
import { useStreak } from '@/hooks/useStreak';

function StreakDisplay() {
  const { streak, recordActivity } = useStreak();

  // Minden napi bejelentkezéskor vagy lecke befejezésekor:
  useEffect(() => {
    recordActivity();
  }, []);

  return (
    <View>
      <Text>Jelenlegi sorozat: {streak?.current_streak} nap 🔥</Text>
      <Text>Leghosszabb: {streak?.longest_streak} nap</Text>
    </View>
  );
}
```

### 3. Lecke Előrehaladás

```typescript
import { useLessonProgress } from '@/hooks/useLessonProgress';

function LessonScreen({ lessonId }: { lessonId: string }) {
  const { saveProgress, isLessonCompleted } = useLessonProgress();

  const handleComplete = async () => {
    await saveProgress(lessonId, true, 85); // 85% pontszám
  };

  const completed = isLessonCompleted(lessonId);

  return (
    <View>
      {completed ? (
        <Text>✅ Befejezve</Text>
      ) : (
        <Button title="Befejezés" onPress={handleComplete} />
      )}
    </View>
  );
}
```

## 🧪 Tesztelés

### 1. Alapvető Kapcsolat Tesztelése

Adj hozzá egy tesztgombot bármelyik képernyőhöz:

```typescript
import { testSupabaseConnection } from '@/config/supabase';

<Button
  title="Supabase Teszt"
  onPress={async () => {
    const connected = await testSupabaseConnection();
    Alert.alert(
      connected ? 'Siker! ✅' : 'Hiba ❌',
      connected
        ? 'Sikeresen csatlakoztál a Supabase-hez!'
        : 'Nem sikerült csatlakozni. Ellenőrizd a .env fájlt.'
    );
  }}
/>
```

### 2. Adatok Ellenőrzése Supabase-ben

1. Menj a Supabase **Table Editor**-ba
2. Nyisd meg a `players` táblát
3. Látnod kell az appból létrehozott játékos adatokat
4. Ellenőrizd a többi táblát is

### 3. Real-time Megfigyelés

A Supabase automatikusan szinkronizálja az adatokat. Próbáld ki:
1. Nyisd meg az appot két eszközön
2. Módosítsd az adatokat egyiken
3. Lásd a változásokat a másikon (ha real-time subscription-t állítottál be)

## 🔧 Gyakori Problémák

### "Failed to connect to Supabase"

**Megoldás:**
1. Ellenőrizd a `.env` fájl értékeit
2. Bizonyosodj meg róla, hogy a `EXPO_PUBLIC_` prefix benne van
3. Újraindítás után: `npm start` (clear cache: `npm start -- --clear`)

### "PGRST301: JWT expired"

**Megoldás:**
Az `anon` kulcs nem jár le. Ha mégis hibát látsz:
1. Ellenőrizd, hogy az `anon` kulcsot használod (nem a `service_role` kulcsot)
2. Generálj új API kulcsot a Supabase dashboard-on

### "Row Level Security" hiba

**Megoldás:**
Futtasd újra a `supabase-setup.sql` szkriptet, ami beállítja a megfelelő policy-kat.

## 📚 További Források

- [Supabase Dokumentáció](https://supabase.com/docs)
- [React Native + Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Expo Környezeti Változók](https://docs.expo.dev/guides/environment-variables/)

## 🎉 Kész!

Most már teljes mértékben integrálva van a Supabase a projektedbe! A játékosok adatai, előrehaladásuk és minden statisztikájuk a felhőben tárolódik.

**Következő lépések:**
- 📱 Teszteld az appot
- 🔐 Állíts be autentikációt (opcionális)
- 📊 Hozz létre analytics dashboard-ot
- 🚀 Deploy-old production-be

Jó kódolást! 🚀
