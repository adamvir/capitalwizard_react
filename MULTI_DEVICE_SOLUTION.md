# 📱 Multi-Device Support - Megoldások

## ⚠️ Jelenlegi Probléma

**AsyncStorage eszközhöz kötött**, ezért:
- iPhone #1 → új player
- iPhone #2 → **másik** új player
- Android → **megint másik** új player

Minden eszközön **külön account** jön létre! 😱

---

## ✅ MEGOLDÁS 1: Supabase Auth (AJÁNLOTT) ⭐⭐⭐

### Mi ez?
Felhasználói bejelentkezés (email, Google, Apple Sign In) → egy account több eszközön.

### Előnyök:
- ✅ Multi-device support
- ✅ Biztonságos
- ✅ Jelszó visszaállítás
- ✅ Social login (Google, Apple, Facebook)
- ✅ Automatikus session kezelés

### Hogyan működik?

```
1. Felhasználó bejelentkezik (email/Google/Apple)
      ↓
2. Supabase Auth User ID (pl: user_abc123)
      ↓
3. Player account kapcsolva a User ID-hez
      ↓
4. Bármelyik eszközön bejelentkezik
      ↓
5. Ugyanaz a player account! ✅
```

### Példa Flow:

#### iPhone #1:
```
1. Letöltöm az appot
2. Bejelentkezem: adam@example.com
3. Player account: player_abc123 (Supabase)
4. Játszom → szint 10, 5000 coins
```

#### Android:
```
1. Letöltöm az appot
2. Bejelentkezem: adam@example.com (UGYANAZ!)
3. Player account: player_abc123 (UGYANAZ!) ✅
4. Látom: szint 10, 5000 coins ✅✅✅
```

### Implementáció:

#### 1. Enable Auth in Supabase
```
1. Menj: https://app.supabase.com
2. Projekted → Authentication → Providers
3. Enable: Email, Google, Apple
```

#### 2. Módosítsd a player táblát:
```sql
ALTER TABLE players
ADD COLUMN user_id UUID REFERENCES auth.users(id) UNIQUE;

-- Index a gyors kereséshez
CREATE INDEX idx_players_user_id ON players(user_id);
```

#### 3. Új Hook: `useAuth.ts`
```typescript
import { supabase } from '../config/supabase';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return { user, loading, signIn, signUp, signOut };
}
```

#### 4. Módosítsd `usePlayer.ts`:
```typescript
import { useAuth } from './useAuth';

export function usePlayer() {
  const { user } = useAuth();

  const getOrCreatePlayerId = async () => {
    if (!user) return null;

    // Keresd meg a player-t user_id alapján
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingPlayer) {
      return existingPlayer.id;
    }

    // Ha nincs → hozz létre ÚJ player-t
    const { data: newPlayer } = await supabase
      .from('players')
      .insert({
        user_id: user.id,  // Kapcsold a user-hez!
        level: 1,
        xp: 0,
        coins: 0,
        diamonds: 0,
      })
      .select()
      .single();

    return newPlayer?.id;
  };

  // ... rest
}
```

#### 5. Login Screen:
```typescript
import { useAuth } from '../hooks/useAuth';

function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    const { error } = await signIn(email, password);
    if (error) {
      Alert.alert('Hiba', error.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Jelszó"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Bejelentkezés" onPress={handleSignIn} />
    </View>
  );
}
```

### Social Login (Google/Apple):

```typescript
// Google Sign In
const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
};

// Apple Sign In
const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
  });
};
```

---

## ✅ MEGOLDÁS 2: Egyedi Kapcsolási Kód (KÖZEPES) ⭐⭐

### Mi ez?
6 számjegyű kód generálás → másik eszközön beírod → sync.

### Előnyök:
- ✅ Nincs bejelentkezés szükséges
- ✅ Egyszerű
- ✅ Gyors setup

### Hátrányok:
- ❌ Manuális sync
- ❌ Kevésbé biztonságos
- ❌ Nem automatikus

### Hogyan működik?

```
iPhone #1:
1. Generálok kódot: "123456"
2. Mentem a players táblába: sync_code = "123456"

Android:
1. Beírom a kódot: "123456"
2. Lekérem a player-t: WHERE sync_code = "123456"
3. Elmentem a player ID-t AsyncStorage-ba
4. Sync! ✅
```

### Implementáció:

#### 1. Add sync_code oszlopot:
```sql
ALTER TABLE players
ADD COLUMN sync_code TEXT UNIQUE;

CREATE INDEX idx_players_sync_code ON players(sync_code);
```

#### 2. Kód generálás:
```typescript
function generateSyncCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createSyncCode(playerId: string) {
  const code = generateSyncCode();

  await supabase
    .from('players')
    .update({ sync_code: code })
    .eq('id', playerId);

  return code;
}
```

#### 3. Settings Screen:
```typescript
function SettingsScreen() {
  const { player } = usePlayer();
  const [syncCode, setSyncCode] = useState('');

  const handleGenerateCode = async () => {
    const code = await createSyncCode(player.id);
    setSyncCode(code);
    Alert.alert('Sync Kód', `A kódod: ${code}`);
  };

  return (
    <View>
      <Text>Eszköz összekapcsolása</Text>
      <Button title="Kód Generálása" onPress={handleGenerateCode} />
      {syncCode && <Text>Kódod: {syncCode}</Text>}
    </View>
  );
}
```

#### 4. Sync Screen (másik eszközön):
```typescript
function SyncScreen() {
  const [inputCode, setInputCode] = useState('');

  const handleSync = async () => {
    // Keresd meg a player-t a kód alapján
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('sync_code', inputCode)
      .single();

    if (data) {
      // Mentsd el a player ID-t
      await storage.setItem('playerData', data.id);
      Alert.alert('Siker!', 'Eszköz összekapcsolva!');
    } else {
      Alert.alert('Hiba', 'Érvénytelen kód');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="6 számjegyű kód"
        value={inputCode}
        onChangeText={setInputCode}
        keyboardType="number-pad"
        maxLength={6}
      />
      <Button title="Szinkronizálás" onPress={handleSync} />
    </View>
  );
}
```

---

## ✅ MEGOLDÁS 3: QR Kód (KÖZEPES+) ⭐⭐

### Mi ez?
Generálsz QR kódot → másik eszközzel szkenneled → sync.

### Előnyök:
- ✅ Gyors
- ✅ Nem kell kódot beírni
- ✅ User-friendly

### Implementáció:

```bash
npm install react-native-qrcode-svg
npm install react-native-camera
```

```typescript
import QRCode from 'react-native-qrcode-svg';

function SyncQRScreen() {
  const { player } = usePlayer();

  return (
    <View>
      <Text>Szkenneld be ezt a kódot másik eszközön:</Text>
      <QRCode
        value={JSON.stringify({ playerId: player.id })}
        size={200}
      />
    </View>
  );
}
```

---

## 📊 Összehasonlítás

| Megoldás | Előnyök | Hátrányok | Ajánlott? |
|----------|---------|-----------|-----------|
| **Supabase Auth** | Multi-device, biztonságos, social login | Több kód, bejelentkezés kell | ✅ IGEN |
| **Sync Kód** | Egyszerű, gyors | Manuális, kevésbé biztonságos | 🟡 Köztes |
| **QR Kód** | User-friendly, gyors | Extra library, kamera kell | 🟡 Köztes |

---

## 🎯 AJÁNLÁS

### Ha komoly app → **Supabase Auth** ⭐⭐⭐
- Multi-device automatikus
- Biztonságos
- Social login (Google, Apple)
- Password reset
- Session management

### Ha gyors prototípus → **Sync Kód** ⭐⭐
- Egyszerű
- Gyors implementáció
- Nincs bejelentkezés

---

## 🚀 Következő Lépés

Melyiket szeretnéd?

### 1. **Supabase Auth** (ajánlott)
- Létrehozom a teljes auth flow-t
- Login/Register screen
- Social login setup
- Multi-device support

### 2. **Sync Kód**
- Generálás + sync képernyők
- 6 számjegyű kód
- Gyors megoldás

### 3. **QR Kód**
- QR generálás + scanner
- Kamera integráció
- Modern UX

**Döntsd el és szólj!** 😊
