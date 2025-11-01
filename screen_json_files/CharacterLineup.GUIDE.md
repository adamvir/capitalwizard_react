# 🎮 CharacterLineup - React Native Útmutató

**Bottom navigation: 6 character buttons + dev menu**

---

## 🚀 GYORS HASZNÁLAT

```bash
npm install lucide-react-native
cp exports/CharacterLineup.rn.tsx src/components/CharacterLineup.tsx
```

```tsx
<CharacterLineup
  onUniversityClick={() => navigation.navigate('University')}
  onProfileClick={() => navigation.navigate('Profile')}
  onSubscriptionClick={() => navigation.navigate('Subscription')}
  onJumpToLesson={(lesson) => console.log('Jump to', lesson)}
  onManagerClick={() => navigation.navigate('Manager')}
/>
```

---

## 📋 GOMBOK (6 + 1)

| # | Label | Icon | Állapot |
|---|-------|------|---------|
| 1 | Egyetem | 🎓 GraduationCap | ✅ Active |
| 2 | Diák | 👤 User | ✅ Active |
| 3 | Eredmények | 🏆 Trophy | ⏸️ Disabled |
| 4 | Helyezés | 🥇 Medal | ⏸️ Disabled |
| 5 | Hírek | 📰 Newspaper | ⏸️ Disabled |
| 6 | Előfizetés | 👑 Crown | ✅ Active |
| 7 | Dev Menu | ⚙️ Settings | ✅ Modal |

---

## 🎯 PROPS

```tsx
interface CharacterLineupProps {
  onJumpToLesson?: (lesson: number) => void;  // Lesson jump (1-15)
  onUniversityClick?: () => void;             // Egyetem
  onProfileClick?: () => void;                // Diák/Profile
  onSubscriptionClick?: () => void;           // Előfizetés
  onManagerClick?: () => void;                // Manager
}
```

---

## 🛠️ DEV MENU

**Modal features:**
- Jump to Lesson (1-15 grid buttons)
- Open Manager
- Close button

---

## 📊 STATISZTIKÁK

| Metric | Érték |
|--------|-------|
| **Sor** | ~480 |
| **Props** | 5 |
| **Buttons** | 6 + 1 (dev) |
| **Modal** | Dev menu |
| **Konverzió** | 8 perc |

---

**Készült:** 2025-01-01 | **Fájl:** `CharacterLineup.rn.tsx` (~480 sor)
