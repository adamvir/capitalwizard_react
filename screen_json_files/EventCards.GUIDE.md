# 🎴 EventCards - React Native Útmutató

**Event cards: Arena (active) + Templomos (placeholder)**

---

## 🚀 GYORS HASZNÁLAT (3 perc)

```bash
npm install @react-native-async-storage/async-storage react-native-linear-gradient lucide-react-native
cd ios && pod install && cd ..
cp exports/EventCards.rn.tsx src/components/EventCards.tsx
```

```tsx
<EventCards
  onArenaClick={() => navigation.navigate('Arena')}
  subscriptionTier="free"  // 'free' | 'pro' | 'master'
/>
```

---

## 📋 KÁRTYÁK (2 db)

| Kártya | Funkció | Állapot | Ikon |
|--------|---------|---------|------|
| **Küzdőtér** | Arena játék | ✅ Aktív | 👑 Crown |
| **Templomos** | Placeholder | ⏸️ Disabled | 🕐 Clock |

---

## 🎯 PROPS

```tsx
interface EventCardsProps {
  onArenaClick?: () => void;                        // Arena callback
  subscriptionTier?: 'free' | 'pro' | 'master';    // Előfizetés szint
}
```

---

## 💎 DAILY LIMIT TRACKING

### **Free tier:**
- 3 játék/nap
- AsyncStorage: `arena_daily_games`
- Naponta reset

### **Pro/Master tier:**
- Unlimited games
- Infinity ikon

### **AsyncStorage structure:**
```json
{
  "date": "Sat Jan 01 2025",
  "gamesPlayed": 2
}
```

---

## 📊 STATISZTIKÁK

| Metric | Érték |
|--------|-------|
| **Sor** | ~280 |
| **Props** | 2 |
| **Cards** | 2 |
| **Gradients** | 4 |
| **AsyncStorage** | 1 key |
| **Konverzió** | 5 perc |

---

**Készült:** 2025-01-01 | **Fájl:** `EventCards.rn.tsx` (~280 sor)
