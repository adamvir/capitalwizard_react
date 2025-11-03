# 🧪 Supabase Tesztelési Útmutató

## Gyors Teszt - 2 módon

### ✅ 1. MÓDSZER: Teszt Képernyő Használata (AJÁNLOTT)

Létrehoztam egy kész teszt képernyőt, amit már be is integráltam a navigációba!

#### A) Navigálj a Teszt Képernyőhöz Kódból

Adj hozzá egy gombot **BÁRMELYIK** meglévő képernyőhöz (pl. WelcomeScreen, HomeScreen):

```typescript
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

// A komponensedben:
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

// Valahol a return-ben:
<TouchableOpacity
  onPress={() => navigation.navigate('SupabaseTest')}
  style={{ padding: 15, backgroundColor: '#2196F3', borderRadius: 8 }}
>
  <Text style={{ color: '#fff' }}>🧪 Supabase Teszt</Text>
</TouchableOpacity>
```

#### B) VAGY Állítsd Be Kezdő Képernyőnek (Ideiglenes Teszteléshez)

Nyisd meg: `src/navigation/AppNavigator.tsx`

Módosítsd a kezdő képernyőt:
```typescript
<Stack.Navigator
  initialRouteName="SupabaseTest"  // <-- Add hozzá ezt a sort
  screenOptions={{
```

**Ne felejts el visszaállítani `"Welcome"`-ra amikor végzel!**

### ✅ 2. MÓDSZER: Egyszerű Console Log Teszt

Ha nem akarsz új képernyőt, egyszerűen tesztelj az App.tsx-ben:

#### Nyisd meg: `App.tsx`

```typescript
import { useEffect } from 'react';
import { testSupabaseConnection } from './src/config/supabase';

export default function App() {
  // Teszt a betöltéskor
  useEffect(() => {
    async function test() {
      const connected = await testSupabaseConnection();
      console.log('🔗 Supabase kapcsolat:', connected ? '✅ Rendben' : '❌ Hiba');
    }
    test();
  }, []);

  return (
    // ... többi kód
  );
}
```

Majd indítsd el az appot és nézd meg a consolet:
```bash
npm start
```

---

## 📱 Mit Látsz Ha Minden Működik?

A Teszt képernyőn látni fogod:
- ✅ Zöld "Kapcsolat rendben" banner
- 👤 Játékos adatok (ID, szint, XP, coins, gyémántok)
- 🔥 Streak információk
- 📚 Befejezett leckék száma
- Gombokat az XP és coins teszteléséhez

---

## 🔥 Gyors Funkció Teszt

A teszt képernyőn kipróbálhatod:

1. **"+50 XP hozzáadása"** gomb
   - Hozzáad 50 XP-t
   - Ha új szintet érsz el, megmutatja

2. **"+100 Érme hozzáadása"** gomb
   - Azonnal láthatod a változást
   - Az adatok frissülnek

3. **"Kapcsolat újratesztelése"** gomb
   - Ellenőrzi, hogy a Supabase elérhető-e

4. **Ellenőrizd a Supabase Dashboard-on:**
   - Menj a Supabase → Table Editor → `players` táblához
   - Látnod kell az új játékos adatokat!

---

## 🎯 Következő Lépés: Integráció

Most már kész vagy integrálni a hook-okat a saját képernyőidbe!

### Példa: Lecke befejezése XP-vel

```typescript
import { usePlayer, useStreak, useLessonProgress } from '@/hooks';

function YourLessonScreen() {
  const { addPlayerXP, addCoins } = usePlayer();
  const { recordActivity } = useStreak();
  const { saveProgress } = useLessonProgress();

  const handleLessonComplete = async () => {
    // 1. Lecke mentése
    await saveProgress('lesson-id', true, 85);

    // 2. Jutalmak
    const { leveledUp } = await addPlayerXP(50);
    await addCoins(100);

    // 3. Streak frissítés
    await recordActivity();

    // 4. Ha szintlépés volt
    if (leveledUp) {
      Alert.alert('Szintlépés! 🎉');
    }
  };

  return (
    <Button title="Lecke Befejezése" onPress={handleLessonComplete} />
  );
}
```

---

## 🐛 Hibakeresés

### "Failed to connect to Supabase"

**Megoldás:**
1. Ellenőrizd a `.env` fájlt:
   ```bash
   cat .env
   ```
   Győződj meg róla, hogy helyes URL és API key van benne

2. Újraindítás:
   ```bash
   npm start -- --clear
   ```

3. Supabase Dashboard-on:
   - Settings → API
   - Másold ki újra az URL-t és API key-t

### TypeScript hibák

Ha TypeScript hibát látsz az importoknál:
```bash
npm run type-check
```

### "Module not found" hiba

```bash
npm install
npm start -- --clear
```

---

## 📊 Adatok Ellenőrzése Supabase-ben

1. Menj a Supabase Dashboard-ra: https://app.supabase.com
2. Válaszd ki a projekted
3. Kattints: **Table Editor** → **players**
4. Látnod kell az új sorokat minden új játékossal!

---

## 🎉 Kész!

Ha mindent látsz és a gombok működnek, akkor **sikeresen integráltad a Supabase-t**! 🚀

**Töröld ki a teszt képernyőt ha már nem kell:**
1. `src/screens/SupabaseTestScreen.tsx` - törölhető
2. `src/navigation/AppNavigator.tsx` - vedd ki az import-ot és a Screen-t
3. `src/navigation/types.ts` - vedd ki a `SupabaseTest: undefined;` sort

**Következő lépések:**
- Integráld a hook-okat a meglévő képernyőkbe
- Cseréld le az AsyncStorage használatát Supabase-re
- Élvezd a felhő alapú adattárolást! ☁️
