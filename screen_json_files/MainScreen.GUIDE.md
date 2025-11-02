# MainScreen - React Native Konverziós Útmutató

## 📱 Áttekintés

A **MainScreen** komponens a teljes főoldal nézete, amely egyesíti az összes fő UI komponenst egy központi képernyőn. Ez a komponens felelős a fantasy kristálybarlang háttér megjelenítéséért, valamint az összes navigációs és státusz komponens koordinálásáért.

### Tartalmazza:
- ✅ **TopBar** - Játékos adatok (coins, gems, level, progress)
- ✅ **SideMenu** - Bal oldali navigációs menü (Lessons, Shop)
- ✅ **EventCards** - Esemény kártyák (Arena, Subscription)
- ✅ **TipBar** - Tipp sáv a képernyő közepén
- ✅ **CharacterLineup** - Alsó menüsor (University, Profile, Subscription, Manager)
- ✅ **PlayerStatusBar** - Játékos státusz (név, streak, XP)
- ✅ **ProgressAnimation** - "Tovább" gomb animáció

---

## 🚀 Használat

### React Native projektbe telepítés:

```bash
# 1. Másold a konvertált fájlt a projektedbe
cp exports/MainScreen.rn.tsx src/components/MainScreen.tsx

# 2. Győződj meg róla, hogy a függőségek telepítve vannak
npm install lucide-react motion/react

# 3. Ellenőrizd, hogy a styleConstants.ts elérhető-e
ls src/utils/styleConstants.ts
```

### Importálás és használat:

```tsx
import { MainScreen } from './components/MainScreen';

export default function App() {
  const [coins, setCoins] = useState(680);
  const [gems, setGems] = useState(25);
  const [playerLevel, setPlayerLevel] = useState(2);
  // ... további state-ek

  return (
    <MainScreen
      // Top Bar props
      coins={coins}
      gems={gems}
      progressPosition={3}
      playerLevel={playerLevel}
      currentLesson={7}
      currentStageInSection={4}
      onAvatarClick={() => navigateTo('avatar')}
      
      // Side Menu & Event Cards props
      onLessonsClick={() => navigateTo('lessons')}
      onShopClick={() => navigateTo('shop')}
      onArenaClick={() => navigateTo('arena')}
      subscriptionTier="free"
      
      // Character Lineup props
      onJumpToLesson={() => navigateTo('lessons')}
      onUniversityClick={() => navigateTo('university')}
      onProfileClick={() => navigateTo('profile')}
      onSubscriptionClick={() => navigateTo('subscription')}
      onManagerClick={() => navigateTo('manager')}
      
      // Player Status Bar props
      playerName="Játékos"
      streak={5}
      totalXp={1000}
      onStreakClick={() => navigateTo('streak')}
      
      // Progress Animation props
      onProgressClick={() => handleLessonContinue()}
      currentBookLessonIndex={0}
      currentGameType="reading"
      isFirstRound={true}
      
      // Video background
      hasVideoBackground={false}
    />
  );
}
```

---

## 📋 Props Interface

```tsx
interface MainScreenProps {
  // ===== TOP BAR =====
  coins: number;                    // Játékos érméi
  gems: number;                     // Játékos drágakövei
  progressPosition: number;         // Progress pozíció (0-based)
  playerLevel: number;              // Játékos szintje
  currentLesson: number;            // Aktuális lecke száma
  currentStageInSection: number;    // Aktuális szakasz a szekcióban
  onAvatarClick: () => void;        // Avatar kattintás callback
  
  // ===== SIDE MENU & EVENT CARDS =====
  onLessonsClick: () => void;       // Leckék menüpont callback
  onShopClick: () => void;          // Bolt menüpont callback
  onArenaClick: () => void;         // Aréna esemény callback
  subscriptionTier: 'free' | 'pro' | 'master';  // Előfizetési szint
  
  // ===== CHARACTER LINEUP (Alsó menü) =====
  onJumpToLesson: () => void;       // Ugrás lecke callback
  onUniversityClick: () => void;    // Egyetem menüpont callback
  onProfileClick: () => void;       // Profil menüpont callback
  onSubscriptionClick: () => void;  // Előfizetés menüpont callback
  onManagerClick: () => void;       // Manager menüpont callback
  
  // ===== PLAYER STATUS BAR =====
  playerName: string;               // Játékos neve
  streak: number;                   // Napi sorozat (streak)
  totalXp: number;                  // Összes XP
  onStreakClick: () => void;        // Streak kattintás callback
  
  // ===== PROGRESS ANIMATION =====
  onProgressClick: () => void;      // "Tovább" gomb callback
  currentBookLessonIndex: number;   // Aktuális lecke index
  currentGameType: 'reading' | 'matching' | 'quiz';  // Játék típus
  isFirstRound: boolean;            // Első kör flag
  
  // ===== VIDEO BACKGROUND =====
  hasVideoBackground?: boolean;     // Videó háttér engedélyezése (opcionális)
}
```

---

## 🎯 Navigációs Logika

A MainScreen 11 különböző navigációs callback-et kezel:

| Callback | Cél | Meghívó Komponens |
|----------|-----|-------------------|
| `onAvatarClick()` | Avatar választó oldal | TopBar |
| `onLessonsClick()` | Leckék listája | SideMenu |
| `onShopClick()` | Bolt oldal | SideMenu |
| `onArenaClick()` | Aréna játék | EventCards |
| `onJumpToLesson()` | Lecke folytatása | CharacterLineup |
| `onUniversityClick()` | Egyetem oldal | CharacterLineup |
| `onProfileClick()` | Profil oldal | CharacterLineup |
| `onSubscriptionClick()` | Előfizetés oldal | CharacterLineup |
| `onManagerClick()` | Manager oldal | CharacterLineup |
| `onStreakClick()` | Streak statisztika | PlayerStatusBar |
| `onProgressClick()` | Lecke folytatása | ProgressAnimation |

**Minden callback void return type-ot vár**, tehát csak mellékhatásokat hajt végre (pl. navigáció, state változás).

---

## 🎨 Főbb Változások (Web → React Native)

### 1. Tailwind → Inline Styles

❌ **Előtte (Tailwind):**
```tsx
<div className="relative w-full h-full overflow-hidden">
  <div className="absolute inset-0 opacity-30">
    {/* ... */}
  </div>
</div>
```

✅ **Utána (Inline Styles):**
```tsx
<div style={styles.container}>
  <div style={styles.gradientBackground}>
    {/* ... */}
  </div>
</div>

const styles = {
  container: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    overflow: 'hidden' as const,
  },
  gradientBackground: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: OPACITY[30],
  },
};
```

### 2. Hardcoded Értékek → styleConstants

❌ **Előtte:**
```tsx
width: '128px',
height: '160px',
bottom: 192,
```

✅ **Utána:**
```tsx
width: SIZES.width32,
height: SIZES.height40,
bottom: 192,  // Egyedi érték, nincs a constants-ban
```

### 3. Gradiens Background Inline

A komplex gradiens háttér megmaradt inline, mert dinamikus értékeket tartalmaz:

```tsx
background: `
  radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
  radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
  linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(88, 28, 135, 0.4))
`,
```

### 4. Dinamikus Style Objektumok

A `hasVideoBackground` prop alapján dinamikusan változnak bizonyos style értékek:

```tsx
const containerBackgroundColor = hasVideoBackground 
  ? COLORS.transparent 
  : 'rgba(15, 23, 42, 1)';

const overlayOpacity = hasVideoBackground ? OPACITY[40] : OPACITY[100];
const overlayZIndex = hasVideoBackground ? Z_INDEX.overlay : Z_INDEX.base;
```

---

## 🔧 React Native Specifikus Módosítások

### 1. TypeScript `as const` Használata

```tsx
position: 'relative' as const,  // ✅ TypeScript strict mode
overflow: 'hidden' as const,     // ✅ CSSProperties kompatibilitás
flexDirection: 'column' as const, // ✅ Type narrowing
```

### 2. Style Objektumok Kombinálása

```tsx
<div style={{ 
  ...styles.container, 
  backgroundColor: containerBackgroundColor 
}}>
```

### 3. Z-Index és Opacity Konstansok

```tsx
import { Z_INDEX, OPACITY } from '../utils/styleConstants';

zIndex: Z_INDEX.content,  // 20
opacity: OPACITY[30],     // '0.3'
```

### 4. Transform Stringek

```tsx
transform: 'rotate(-12deg)',  // ✅ CSS string formátum
transform: 'rotate(6deg)',
```

---

## 📦 Függőségek

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "lucide-react": "latest",
    "motion/react": "latest"
  }
}
```

### Belső Függőségek (ugyanabban a projektben):

```tsx
import { TopBar } from './TopBar';
import { SideMenu } from './SideMenu';
import { EventCards } from './EventCards';
import { TipBar } from './TipBar';
import { CharacterLineup } from './CharacterLineup';
import { PlayerStatusBar } from './PlayerStatusBar';
import { ProgressAnimation } from './ProgressAnimation';
import { getTotalXpForLevel } from '../utils/gameConfig';
import { COLORS, SPACING, SIZES, OPACITY, Z_INDEX } from '../utils/styleConstants';
```

**FONTOS:** Ezeknek a komponenseknek is React Native-kompatibilisnek kell lenniük!

---

## 🎨 Design Jellemzők

### Háttér Rendszer:
- **Fantasy kristálybarlang téma** lila/pink/kék gradiens átmenetekkel
- **Radial és linear gradiens kombináció**
- **8 db kristály dekoráció** különböző pozíciókban és forgatásokkal
- **Dinamikus opacity** videó háttér esetén (0.4 vs 1.0)

### Layout Struktúra:
```
┌─────────────────────────────────┐
│   TopBar (coins, gems, level)  │
├─────────────────────────────────┤
│                                 │
│  ┌────┐  ┌──────────────┐      │
│  │Side│  │ EventCards   │      │
│  │Menu│  └──────────────┘      │
│  └────┘                         │
│                                 │
├─────────────────────────────────┤
│          TipBar                 │
├─────────────────────────────────┤
│   CharacterLineup (menü)       │
├─────────────────────────────────┤
│   PlayerStatusBar              │
├─────────────────────────────────┤
│   ProgressAnimation (Tovább)   │
└─────────────────────────────────┘
```

### Spacing:
- Fő konténer padding-top: `48px` (SPACING['3xl'])
- Középső szekció padding-bottom: `32px` (SPACING['2xl'])

---

## ⚠️ Fontos Megjegyzések

### 1. Video Background Funkció

A `hasVideoBackground` prop lehetővé teszi a videó háttér integrálását:

```tsx
// Videó háttérrel
<MainScreen hasVideoBackground={true} {...props} />

// Videó nélkül (alapértelmezett)
<MainScreen hasVideoBackground={false} {...props} />
```

**Hatása:**
- `true`: Átlátszó háttér, 0.4 opacity overlay, Z-index 10
- `false`: Sötét háttér, 1.0 opacity overlay, Z-index 1

### 2. Komponens Függőségek

A MainScreen **7 másik komponenst** importál. Ezeknek is React Native-kompatibilisnek kell lenniük!

Ha hiányzik valamelyik, az alábbi hibát kapod:
```
Error: Cannot find module './TopBar'
```

**Megoldás:** Konvertáld az összes függőségi komponenst is!

### 3. gameConfig Utility

```tsx
import { getTotalXpForLevel } from '../utils/gameConfig';
```

Ez a függvény kiszámítja a következő szinthez szükséges összes XP-t:

```tsx
const totalXpForNextLevel = getTotalXpForLevel(playerLevel + 1);
```

### 4. Pixel-Pontos Kristály Pozíciók

A kristály dekorációk pontos pozíciói megmaradtak az eredeti designból:

```tsx
bottom: 192,     // caveCrystalBottomLeft1
bottom: 208,     // caveCrystalBottomLeft2
bottom: 192,     // caveCrystalBottomRight
top: '33.333333%',  // crystalTopLeftCenter (1/3)
top: '50%',         // crystalTopRightCenter (1/2)
left: '25%',        // crystalTopLeftCenter (1/4)
right: '33.333333%', // crystalTopRightCenter (1/3)
```

### 5. TypeScript Strict Mode

Minden style objektum szigorúan típusos:

```tsx
const styles: Record<string, CSSProperties> = { ... };
```

Ha nem találja a CSSProperties típust:

```bash
npm install --save-dev @types/react
```

---

## 🔄 Verzió Információ

- **Eredeti fájl:** `/components/MainScreen.tsx` (179 sor)
- **Konvertált fájl:** `/exports/MainScreen.rn.tsx` (381 sor)
- **Konverzió dátuma:** 2025-11-02
- **Tailwind osztályok eltávolítva:** 12 db
- **Inline style objektumok:** 12 db
- **StyleConstants használat:** COLORS, SPACING, SIZES, OPACITY, Z_INDEX

---

## 📚 További Lépések

1. ✅ **Konvertáld a függőségi komponenseket:**
   - TopBar.tsx → TopBar.rn.tsx
   - SideMenu.tsx → SideMenu.rn.tsx
   - EventCards.tsx → EventCards.rn.tsx
   - TipBar.tsx → TipBar.rn.tsx
   - CharacterLineup.tsx → CharacterLineup.rn.tsx
   - PlayerStatusBar.tsx → PlayerStatusBar.rn.tsx
   - ProgressAnimation.tsx → ProgressAnimation.rn.tsx

2. ✅ **Teszteld a komponenst React Native környezetben:**
   ```bash
   npm run ios
   # vagy
   npm run android
   ```

3. ✅ **Ellenőrizd a navigációs callback-eket:**
   - Minden callback meghívódik-e?
   - Helyes oldalra navigál-e?

4. ✅ **Videó háttér integráció:**
   - Ha használod, add hozzá a videó komponenst
   - Állítsd be a `hasVideoBackground={true}` propot

---

## 🆘 Hibaelhárítás

### Probléma: "Cannot find module './TopBar'"
**Megoldás:** Konvertáld a TopBar komponenst is, vagy módosítsd az import útvonalat.

### Probléma: "Property 'position' does not exist on type 'CSSProperties'"
**Megoldás:** Használd az `as const` type assertion-t:
```tsx
position: 'relative' as const,
```

### Probléma: "COLORS is not defined"
**Megoldás:** Ellenőrizd, hogy a styleConstants.ts elérhető-e és importálva van-e.

### Probléma: A kristályok nem jelennek meg
**Megoldás:** Ellenőrizd, hogy a gradiens background stringek helyesen vannak-e formázva.

---

## 📞 Kapcsolat

Ha további kérdésed van a konverzióval kapcsolatban, nézd meg a többi `.GUIDE.md` fájlt az `/exports/` mappában!

🎮 **Jó játékot!** 🚀
