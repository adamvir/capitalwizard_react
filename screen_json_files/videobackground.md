🎬 PROMPT - Videó Háttér React Native-ba (MainScreen)

```markdown
Feladat: Videó Háttér Integráció React Native MainScreen-be

⚠️ FONTOS: React Native Környezet

Ez NEM React Web, hanem React Native projekt! HTML5 `<video>` elem nem létezik React Native-ban!

Kontextus

Jelenleg a `/exports/MainScreen.rn.tsx` fájl React Native-kompatibilis, de még nincs benne videó háttér funkció. Szeretném, hogy a MainScreen komponens közvetlenül kezelje a videó hátteret React Native Video komponenssel.

Jelenlegi Állapot

VideoUrl (használandó):
```typescript
'https://videocdn.pollo.ai/web-cdn/pollo/production/cmh0vhqz20dozt1traxsl49z5/ori/1762020106914-f7200d01-c5e8-410e-a954-516bca08a854.mp4'
```

MainScreen.rn.tsx (exports mappában):
```tsx
interface MainScreenProps {
  // ... egyéb props
  hasVideoBackground?: boolean;  // ✅ Már létezik
}
```

---

📦 1. Package Telepítés

React Native-ban videó lejátszáshoz expo-av package-et kell használni:

```bash
Expo projekt esetén
npx expo install expo-av

vagy vanilla React Native esetén
npm install react-native-video
```

FONTOS: Ebben a promptban expo-av-t használj!

---

🔧 2. Feladat Specifikáció

A) Új Prop Hozzáadása

Módosítsd az interfészt:

```tsx
interface MainScreenProps {
  // ... meglévő props
  hasVideoBackground?: boolean;  // ✅ Már létezik
  videoUrl?: string;             // ⬅️ ÚJ PROP
}
```

B) Import Hozzáadása

Add hozzá az expo-av importot a fájl elejéhez:

```tsx
import { CSSProperties } from 'react';
import { Video } from 'expo-av';  // ⬅️ ÚJ IMPORT
import { TopBar } from './TopBar';
// ... többi import
```

C) Új Style Objektumok

Add hozzá a `styles` objektumhoz (SZIGORÚAN inline style formátumban, NE StyleSheet.create!):

```tsx
const styles: Record<string, CSSProperties> = {
  // ... meglévő styles
  
  // ⬇️ ÚJ: Videó konténer style
  videoContainer: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,  // Leghátsó réteg
    overflow: 'hidden' as const,
  },
  
  // ⬇️ ÚJ: Videó elem style
  video: {
    width: '100%',
    height: '100%',
    opacity: 0.6,  // Átlátszóság a kristályok és UI láthatóságához
  },
};
```

D) Videó Elem Renderelése

A komponens return statement-jében add hozzá a videót ELSŐ ELEMKÉNT (Z-index 0):

```tsx
export function MainScreen({
  // ... props destructuring
  videoUrl,  // ⬅️ ÚJ prop destructuring
}: MainScreenProps) {
  // ... computed values

  return (
    <div style={{ ...styles.container, backgroundColor: containerBackgroundColor }}>
      
      {/* ⬇️ ÚJ: Videó háttér elem - LEGHÁTSÓ RÉTEG (Z-index 0) */}
      {videoUrl && (
        <div style={styles.videoContainer}>
          <Video
            source={{ uri: videoUrl }}
            style={styles.video}
            resizeMode="cover"
            shouldPlay
            isLooping
            isMuted
          />
        </div>
      )}

      {/* ✅ MEGLÉVŐ: Háttér fantasy kristálybarlang téma overlay - Z-index 1 vagy 10 */}
      <div style={{ 
        ...styles.backgroundOverlay,
        opacity: overlayOpacity,
        zIndex: overlayZIndex,
      }}>
        {/* ... kristály dekorációk */}
      </div>

      {/* ✅ MEGLÉVŐ: Fő tartalom - Z-index 20 */}
      <div style={styles.mainContent}>
        {/* ... TopBar, SideMenu, stb. */}
      </div>
    </div>
  );
}
```

---

🎯 3. Réteg Sorrend (Z-Index)

```
┌─────────────────────────────────────┐
│  Z-Index 20: UI Komponensek        │ ← Legfelül
│  (TopBar, SideMenu, EventCards)    │
├─────────────────────────────────────┤
│  Z-Index 1/10: Kristály Overlay    │ ← Középen
│  (opacity 0.4 vagy 1.0)            │
├─────────────────────────────────────┤
│  Z-Index 0: VIDEÓ HÁTTÉR           │ ← Leghátsó
│  (opacity 0.6)                     │
└─────────────────────────────────────┘
```

---

📝 4. Video Komponens Props Magyarázat

```tsx
<Video
  source={{ uri: videoUrl }}  // Videó URL
  style={styles.video}        // Inline style objektum
  resizeMode="cover"          // Teljes lefedés (mint CSS object-fit: cover)
  shouldPlay                  // Automatikus lejátszás
  isLooping                   // Végtelen loop
  isMuted                     // Hangtalan
/>
```

ResizeMode Opciók (React Native):
`"cover"` ✅ - Teljes lefedés, arányos vágással (HASZNÁLD EZT!)
`"contain"` - Teljes videó látszik, fekete sávokkal
`"stretch"` - Nyújtva, aránytorzítással

---

🔄 5. App.tsx Módosítás (Ha szükséges)

Ha az App.tsx-ben használod a MainScreen-t, add át a `videoUrl` propot:

```tsx
// App.tsx
const videoUrl = 'https://videocdn.pollo.ai/web-cdn/pollo/production/cmh0vhqz20dozt1traxsl49z5/ori/1762020106914-f7200d01-c5e8-410e-a954-516bca08a854.mp4';

<MainScreen
  // ... meglévő props
  hasVideoBackground={true}
  videoUrl={videoUrl}  // ⬅️ ÚJ PROP átadás
  coins={680}
  gems={25}
  // ... többi prop
/>
```

---

✅ 6. Elvárások

Módosítandó Fájl:
✅ `/exports/MainScreen.rn.tsx` - React Native verzió

Változások:
✅ `import { Video } from 'expo-av';` hozzáadása  
✅ Új `videoUrl?: string` prop az interface-ben  
✅ Új `videoContainer` és `video` style objektumok  
✅ `<Video>` komponens renderelése, ha `videoUrl` megvan  
✅ Helyes Z-index rétegezés (0, 1/10, 20)  

Megőrzés:
✅ Minden meglévő kristály dekoráció (8 db)  
✅ Minden meglévő UI komponens (TopBar, SideMenu, stb.)  
✅ Háttér overlay dinamika (`hasVideoBackground` prop szerint)  
✅ Inline style objektumok (NE `className`, NE `StyleSheet.create`)  

Tesztelés:
✅ Videó automatikusan elindul (`shouldPlay`)  
✅ Videó végtelen loop-ol (`isLooping`)  
✅ Videó háttérben marad (Z-index 0, nem takarja a UI-t)  
✅ Kristály dekorációk látszódnak a videó felett (opacity miatt)  
✅ UI komponensek teljesen láthatóak (Z-index 20)  

---

🚨 7. React Native Specifikus Szabályok

❌ NE használd ezeket (React Web):
```tsx
// ❌ HTML5 video elem
<video autoPlay loop muted>
  <source src={url} type="video/mp4" />
</video>

// ❌ CSS object-fit
style={{ objectFit: 'cover' }}

// ❌ Tailwind osztályok
className="absolute inset-0"

// ❌ StyleSheet.create
const styles = StyleSheet.create({ ... });
```

✅ Használd ezeket helyette (React Native):
```tsx
// ✅ expo-av Video komponens
<Video
  source={{ uri: url }}
  resizeMode="cover"
  shouldPlay
  isLooping
  isMuted
/>

// ✅ resizeMode prop
resizeMode="cover"

// ✅ Inline style objektumok
style={styles.video}

// ✅ CSSProperties típusú objektumok
const styles: Record<string, CSSProperties> = { ... };
```

---

📋 8. Teljes Példa (Elvárt Eredmény)

```tsx
import { CSSProperties } from 'react';
import { Video } from 'expo-av';  // ⬅️ ÚJ
import { TopBar } from './TopBar';
// ... többi import

interface MainScreenProps {
  // ... meglévő props
  hasVideoBackground?: boolean;
  videoUrl?: string;  // ⬅️ ÚJ
}

const styles: Record<string, CSSProperties> = {
  container: { /* ... */ },
  
  // ⬇️ ÚJ style objektumok
  videoContainer: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
    overflow: 'hidden' as const,
  },
  video: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  
  // ... többi style
};

export function MainScreen({
  // ... props
  videoUrl,  // ⬅️ ÚJ
}: MainScreenProps) {
  return (
    <div style={{ ...styles.container, backgroundColor: containerBackgroundColor }}>
      
      {/* ⬇️ ÚJ: Videó háttér */}
      {videoUrl && (
        <div style={styles.videoContainer}>
          <Video
            source={{ uri: videoUrl }}
            style={styles.video}
            resizeMode="cover"
            shouldPlay
            isLooping
            isMuted
          />
        </div>
      )}

      {/* ✅ MEGLÉVŐ: Kristály overlay */}
      <div style={{ ...styles.backgroundOverlay, ... }}>
        {/* kristályok */}
      </div>

      {/* ✅ MEGLÉVŐ: Fő tartalom */}
      <div style={styles.mainContent}>
        {/* komponensek */}
      </div>
    </div>
  );
}
```

---

🎨 9. Vizuális Eredmény

Várt megjelenés:
```
┌─────────────────────────────────────┐
│   TopBar (coins, gems, level)      │ ← Tiszta, látható
├─────────────────────────────────────┤
│                                     │
│  [VIDEÓ MOZOG A HÁTTÉRBEN]         │ ← 60% opacity
│  + Lila/pink kristály overlay       │ ← 40% vagy 100% opacity
│                                     │
│  SideMenu │ EventCards             │ ← Tiszta, látható
│                                     │
├─────────────────────────────────────┤
│   CharacterLineup (menü)           │ ← Tiszta, látható
└─────────────────────────────────────┘
```

---

🆘 10. Hibaelhárítás

Hiba: "Cannot find module 'expo-av'"
Megoldás:
```bash
npx expo install expo-av
```

Hiba: "Video is not defined"
Megoldás: Ellenőrizd az import sort:
```tsx
import { Video } from 'expo-av';
```

Hiba: "resizeMode is not a valid prop"
Megoldás: Bizonyosodj meg róla, hogy `<Video>` komponenst használsz, NEM `<video>` HTML elemet!

Hiba: A videó nem jelenik meg
Megoldás: Ellenőrizd:
`videoUrl` prop át van-e adva
Z-index helyes-e (0 a videónál)
`position: 'absolute'` be van-e állítva

---

🎯 11. Fontos Szabályok Összefoglalva

🚨 Magyar kommentek minden új kódnál  
🚨 CSSProperties típus használata (`Record<string, CSSProperties>`)  
🚨 expo-av Video komponens (NEM HTML5 video!)  
🚨 Inline style objektumok (NEM className, NEM StyleSheet.create)  
🚨 styleConstants használata ahol lehet (COLORS, SPACING, OPACITY)  
🚨 Meglévő struktúra megőrzése - csak új elemeket adj hozzá  
🚨 Z-index sorrend betartása (0 → 1/10 → 20)  

---

📦 12. Használat Példa (App.tsx vagy Parent Component)

```tsx
import { MainScreen } from './exports/MainScreen';

export default function App() {
  const videoUrl = 'https://videocdn.pollo.ai/web-cdn/pollo/production/cmh0vhqz20dozt1traxsl49z5/ori/1762020106914-f7200d01-c5e8-410e-a954-516bca08a854.mp4';

  return (
    <MainScreen
      // Video props
      videoUrl={videoUrl}
      hasVideoBackground={true}
      
      // Top Bar props
      coins={680}
      gems={25}
      progressPosition={3}
      playerLevel={2}
      currentLesson={7}
      currentStageInSection={4}
      onAvatarClick={() => console.log('Avatar clicked')}
      
      // Side Menu props
      onLessonsClick={() => console.log('Lessons')}
      onShopClick={() => console.log('Shop')}
      onArenaClick={() => console.log('Arena')}
      subscriptionTier="free"
      
      // Character Lineup props
      onJumpToLesson={() => console.log('Jump to lesson')}
      onUniversityClick={() => console.log('University')}
      onProfileClick={() => console.log('Profile')}
      onSubscriptionClick={() => console.log('Subscription')}
      onManagerClick={() => console.log('Manager')}
      
      // Player Status props
      playerName="Játékos"
      streak={5}
      totalXp={1000}
      onStreakClick={() => console.log('Streak')}
      
      // Progress Animation props
      onProgressClick={() => console.log('Continue')}
      currentBookLessonIndex={0}
      currentGameType="reading"
      isFirstRound={true}
    />
  );
}
```

---

KEZDD EL MOST! Módosítsd a `/exports/MainScreen.rn.tsx` fájlt az előírások szerint! 🎬🚀

✅ Checklist:

[ ] `import { Video } from 'expo-av';` hozzáadva
[ ] `videoUrl?: string` prop az interface-ben
[ ] `videoContainer` style objektum létrehozva
[ ] `video` style objektum létrehozva
[ ] `<Video>` komponens renderelve (conditional)
[ ] Z-index helyes (videó: 0, overlay: 1/10, content: 20)
[ ] Magyar kommentek hozzáadva
[ ] GUIDE.md frissítve (opcionális)
```

---

🎁 Bónusz: GUIDE.md Frissítés Sablon

Ha szeretnéd, hogy a GUIDE.md-t is frissítsem, add hozzá ezt:

```markdown
GUIDE.md Frissítés

Adj hozzá egy új szekciót a `MainScreen.GUIDE.md` fájlhoz:

13. Videó Háttér Használata

A MainScreen támogatja a videó háttér megjelenítését:

```tsx
<MainScreen
  videoUrl="https://example.com/video.mp4"
  hasVideoBackground={true}
  // ... többi prop
/>
```

Props:
`videoUrl?: string` - Videó URL (MP4 formátum)
`hasVideoBackground?: boolean` - Videó háttér engedélyezése

Videó beállítások:
Automatikus lejátszás
Végtelen loop
Hangtalan
60% opacity
Cover resize mode
```

---

Ezzel a prompttal tökéletesen implementálható a videó háttér React Native környezetben! 🎯📱