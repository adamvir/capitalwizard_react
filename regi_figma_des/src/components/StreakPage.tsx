import { ArrowLeft, Flame, Calendar, ShoppingBag, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { getGameConfig } from '../utils/gameConfig';
import { CSSProperties } from 'react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface StreakPageProps {
  onBack: () => void;
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  onPurchaseStreakFreeze: () => void;
  gold: number;
}

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  container: {
    background: 'linear-gradient(to bottom, #FFF7ED, #FFFFFF)',
    padding: 14,
    paddingBottom: 256,
    minHeight: 1600,
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.base,
  },
  headerTextContainer: {},
  headerTitle: {
    color: '#7C2D12',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    margin: 0,
  },
  headerSubtitle: {
    fontSize: SIZES.fontXS,
    color: '#C2410C',
  },

  // Streak Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginBottom: SPACING.base,
  },

  // Stat cards use Shadcn Card component with inline styles

  statCardContent: {
    padding: 14,
  },
  statCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statCardLabel: {
    fontSize: SIZES.fontXS,
    opacity: 0.9,
  },
  statCardValue: {
    fontSize: SIZES.font2XL,
    margin: 0,
  },
  statCardFooter: {
    fontSize: 10,
    opacity: 0.8,
    marginTop: 2,
  },

  // Streak Freeze Info uses Shadcn Card
  freezeCardContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  },
  freezeIcon: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: '#3B82F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  freezeTextContainer: {
    flex: 1,
  },
  freezeTitle: {
    color: '#1E3A8A',
    marginBottom: 2,
    fontSize: SIZES.fontSM,
    margin: 0,
  },
  freezeDescription: {
    fontSize: SIZES.fontXS,
    color: '#1D4ED8',
    marginBottom: 10,
  },
  freezeBold: {
    fontWeight: 'bold',
  },
  freezeWarning: {
    fontSize: 10,
    color: '#2563EB',
    marginTop: 6,
    textAlign: 'center',
  },

  // Calendar Grid uses Shadcn Card
  calendarTitle: {
    color: '#7C2D12',
    marginBottom: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: SIZES.fontSM,
    margin: 0,
  },

  // Day labels
  dayLabelsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 6,
    marginBottom: 6,
  },
  dayLabel: {
    textAlign: 'center',
    fontSize: 10,
    color: '#C2410C',
    fontWeight: 600,
  },

  // Calendar cells
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 6,
  },
  dayCell: (isFuture: boolean, completed: boolean, isToday: boolean): CSSProperties => ({
    aspectRatio: '1',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    fontSize: SIZES.fontXS,
    transition: 'all 0.2s',
    ...(isFuture
      ? { backgroundColor: '#F3F4F6', color: '#9CA3AF' }
      : completed
      ? { background: 'linear-gradient(to bottom right, #10B981, #059669)', color: COLORS.white, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }
      : { backgroundColor: '#E5E7EB', color: '#4B5563' }),
    ...(isToday && { outline: '2px solid #F97316', outlineOffset: '1px' }),
  }),
  dayCellDate: {
    fontSize: 9,
    fontWeight: 600,
  },

  // Legend
  legend: {
    marginTop: 14,
    paddingTop: 14,
    borderTop: '1px solid #FED7AA',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    fontSize: 10,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: (bg: string, ring?: string): CSSProperties => ({
    width: 14,
    height: 14,
    borderRadius: SIZES.radiusSM,
    background: bg,
    ...(ring && { outline: `2px solid ${ring}` }),
  }),
  legendLabel: {
    color: '#374151',
  },
};

export function StreakPage({ 
  onBack, 
  currentStreak, 
  longestStreak,
  streakFreezes,
  onPurchaseStreakFreeze,
  gold
}: StreakPageProps) {
  const config = getGameConfig();
  
  // Generate last 30 days of calendar
  const today = new Date();
  const days: { date: Date; completed: boolean; isFuture: boolean }[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Check if this day is in the current streak
    const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    const completed = daysAgo < currentStreak;
    const isFuture = date > today;
    
    days.push({ date, completed, isFuture });
  }
  
  const canAffordStreakFreeze = gold >= config.streakFreezeGoldCost;
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="rounded-full bg-white shadow-md hover:bg-orange-50 h-9 w-9"
        >
          <ArrowLeft style={{ width: 18, height: 18 }} />
        </Button>
        <div style={styles.headerTextContainer}>
          <h1 style={styles.headerTitle}>
            <Flame style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#F97316' }} />
            Széria Napló
          </h1>
          <p style={styles.headerSubtitle}>Napi teljesítmények nyomon követése</p>
        </div>
      </div>

      {/* Streak Stats */}
      <div style={styles.statsGrid}>
        <Card style={{ background: 'linear-gradient(to bottom right, #F97316, #EF4444)', color: COLORS.white, border: 'none' }}>
          <div style={styles.statCardContent}>
            <div style={styles.statCardHeader}>
              <Flame style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
              <p style={styles.statCardLabel}>Jelenlegi széria</p>
            </div>
            <p style={styles.statCardValue}>{currentStreak}</p>
            <p style={styles.statCardFooter}>nap egymás után</p>
          </div>
        </Card>
        
        <Card style={{ background: 'linear-gradient(to bottom right, #EAB308, #F97316)', color: COLORS.white, border: 'none' }}>
          <div style={styles.statCardContent}>
            <div style={styles.statCardHeader}>
              <Calendar style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
              <p style={styles.statCardLabel}>Leghosszabb</p>
            </div>
            <p style={styles.statCardValue}>{longestStreak}</p>
            <p style={styles.statCardFooter}>nap rekord</p>
          </div>
        </Card>
      </div>

      {/* Streak Freeze Info */}
      <Card style={{ padding: 14, marginBottom: SPACING.base, border: '2px solid #BFDBFE', backgroundColor: '#EFF6FF' }}>
        <div style={styles.freezeCardContent}>
          <div style={styles.freezeIcon}>
            <ShoppingBag style={{ width: SIZES.iconSM, height: SIZES.iconSM, color: COLORS.white }} />
          </div>
          <div style={styles.freezeTextContainer}>
            <h3 style={styles.freezeTitle}>Széria Védelem</h3>
            <p style={styles.freezeDescription}>
              Van <span style={styles.freezeBold}>{streakFreezes} széria pont</span> tartalékod. 
              Ha kihagysz egy napot, automatikusan felhasználódik és megvédi a szériádat!
            </p>
            <Button
              onClick={onPurchaseStreakFreeze}
              disabled={!canAffordStreakFreeze}
              className="w-full bg-blue-600 hover:bg-blue-700 h-9 text-xs"
            >
              <ShoppingBag style={{ width: 14, height: 14, marginRight: 6 }} />
              Vásárolj Széria Pontot ({config.streakFreezeGoldCost} arany)
            </Button>
            {!canAffordStreakFreeze && (
              <p style={styles.freezeWarning}>
                Nincs elég aranyad ({gold} / {config.streakFreezeGoldCost})
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card style={{ padding: 14, border: '2px solid #FED7AA' }}>
        <h3 style={styles.calendarTitle}>
          <Calendar style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
          Utolsó 30 nap teljesítménye
        </h3>
        
        {/* Day labels */}
        <div style={styles.dayLabelsGrid}>
          {['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'].map(day => (
            <div key={day} style={styles.dayLabel}>
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar cells */}
        <div style={styles.calendarGrid}>
          {days.map((day, index) => {
            const isToday = day.date.toDateString() === today.toDateString();
            
            return (
              <div
                key={index}
                style={styles.dayCell(day.isFuture, day.completed, isToday)}
              >
                <div style={styles.dayCellDate}>
                  {day.date.getDate()}
                </div>
                {!day.isFuture && (
                  <div>
                    {day.completed ? (
                      <CheckCircle2 style={{ width: 14, height: 14 }} />
                    ) : (
                      <XCircle style={{ width: 14, height: 14 }} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={styles.legendDot('linear-gradient(to bottom right, #10B981, #059669)')}></div>
            <span style={styles.legendLabel}>Teljesítve</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendDot('#E5E7EB')}></div>
            <span style={styles.legendLabel}>Kihagyva</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendDot('transparent', '#F97316')}></div>
            <span style={styles.legendLabel}>Ma</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
