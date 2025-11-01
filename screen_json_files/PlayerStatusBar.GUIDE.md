# 📊 PlayerStatusBar - React Native Útmutató

**Player status: Avatar + Name + Streak + Tier + XP Progress**

---

## 🚀 GYORS HASZNÁLAT

```bash
npm install react-native-linear-gradient lucide-react-native
cd ios && pod install && cd ..
cp exports/PlayerStatusBar.rn.tsx src/components/PlayerStatusBar.tsx
```

```tsx
<PlayerStatusBar
  playerName="Játékos"
  subscriptionTier="free"  // 'free' | 'pro' | 'master'
  streak={7}
  totalXp={2500}
  totalXpForNextLevel={5000}
  playerLevel={5}
  onStreakClick={() => navigation.navigate('Streak')}
/>
```

---

## 📋 ELEMEK

| Elem | Leírás |
|------|--------|
| **Avatar** | First letter (gradient background) |
| **Name** | Player name |
| **Streak badge** | Clickable, Flame icon + number |
| **Tier badge** | Free/Pro/Master (different gradients) |
| **XP progress** | Zap icon + text + progress bar |

---

## 🎯 PROPS

```tsx
interface PlayerStatusBarProps {
  playerName: string;                           // Játékos neve
  subscriptionTier: 'free' | 'pro' | 'master'; // Előfizetés
  streak?: number;                              // Streak (0 = hidden)
  totalXp?: number;                             // Aktuális XP
  totalXpForNextLevel?: number;                 // XP a következő szinthez
  playerLevel?: number;                         // Szint
  onStreakClick?: () => void;                   // Streak klikk callback
}
```

---

## 🎨 TIER BADGES

| Tier | Icon | Colors |
|------|------|--------|
| **Master** | ✨ Sparkles | Purple → Pink |
| **Pro** | ⭐ Star | Blue → Cyan |
| **Free** | - | Gray (no gradient) |

---

## 📊 STATISZTIKÁK

| Metric | Érték |
|--------|-------|
| **Sor** | ~420 |
| **Props** | 7 |
| **Gradients** | 5 |
| **Konverzió** | 7 perc |

---

**Készült:** 2025-01-01 | **Fájl:** `PlayerStatusBar.rn.tsx` (~420 sor)
