import { ArrowLeft, ShoppingBag, Coins, Flame, Gem, CreditCard, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { getGameConfig } from '../utils/gameConfig';
import { toast } from 'sonner@2.0.3';
import { CSSProperties } from 'react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface ShopPageProps {
  onBack: () => void;
  gold: number;
  diamonds: number;
  streakFreezes: number;
  onPurchaseStreakFreeze: () => void;
  onPurchaseGoldWithMoney: (amount: number, price: number) => void;
  onPurchaseDiamondsWithGold: (amount: number, cost: number) => void;
}

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  container: {
    background: 'linear-gradient(to bottom, #FAF5FF, #FFFFFF)',
    padding: SPACING.base,
    paddingBottom: 256,
    minHeight: 1600,
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  headerTextContainer: {},
  headerTitle: {
    color: '#581C87',
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    margin: 0,
  },
  headerSubtitle: {
    fontSize: SIZES.fontSM,
    color: '#7E22CE',
  },

  // Balance Card uses Shadcn Card with inline styles
  balanceText: {
    fontSize: SIZES.fontSM,
    opacity: 0.9,
    marginBottom: SPACING.sm,
  },
  balanceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  balanceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  balanceValue: {
    fontSize: SIZES.fontXL,
  },

  // Section
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: '#7C2D12',
    margin: 0,
  },

  // Streak Freeze Card
  streakCardContent: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.base,
  },
  streakTextContainer: {
    flex: 1,
  },
  streakTitle: {
    color: '#7C2D12',
    marginBottom: SPACING.sm,
    fontSize: SIZES.fontBase,
    margin: 0,
  },
  streakDescription: {
    fontSize: SIZES.fontSM,
    color: '#C2410C',
    marginBottom: SPACING.md,
  },
  streakCurrent: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    fontSize: SIZES.fontSM,
    color: '#9A3412',
  },
  streakBold: {
    fontWeight: 'bold',
  },
  streakPriceContainer: {
    textAlign: 'center',
  },
  streakPrice: {
    fontSize: SIZES.font2XL,
    color: '#EA580C',
    marginBottom: SPACING.sm,
  },
  streakPriceLabel: {
    fontSize: SIZES.fontXS,
    color: '#C2410C',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },

  // Gold Grid
  goldGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: SPACING.md,
  },

  // Gold Card
  goldCardContent: {
    textAlign: 'center',
  },
  goldIconCircle: (gradient: string): CSSProperties => ({
    width: 48,
    height: 48,
    margin: '0 auto',
    marginBottom: SPACING.sm,
    borderRadius: '50%',
    background: gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  goldAmount: {
    fontSize: SIZES.font2XL,
    color: '#A16207',
    marginBottom: 4,
  },
  goldLabel: {
    fontSize: SIZES.fontXS,
    color: '#CA8A04',
    marginBottom: SPACING.md,
  },

  // Badge
  bestBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DC2626',
    color: COLORS.white,
    fontSize: 10,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: SIZES.radiusFull,
  },

  // Diamond Grid
  diamondGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: SPACING.md,
  },

  // Diamond Card
  diamondCardContent: {
    textAlign: 'center',
  },
  diamondAmount: {
    fontSize: SIZES.font2XL,
    color: '#0E7490',
    marginBottom: 4,
  },
  diamondLabel: {
    fontSize: SIZES.fontXS,
    color: '#0891B2',
    marginBottom: SPACING.md,
  },

  bonusBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#9333EA',
    color: COLORS.white,
    fontSize: 10,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: SIZES.radiusFull,
  },
};

export function ShopPage({ 
  onBack, 
  gold,
  diamonds,
  streakFreezes,
  onPurchaseStreakFreeze,
  onPurchaseGoldWithMoney,
  onPurchaseDiamondsWithGold
}: ShopPageProps) {
  const config = getGameConfig();
  
  const handleGoldPurchase = (amount: number, price: number) => {
    // In a real app, this would trigger payment
    toast.success(`${amount} arany vásárlása ${price.toLocaleString('hu-HU')} Ft-ért`);
    onPurchaseGoldWithMoney(amount, price);
  };
  
  const handleDiamondPurchase = (amount: number, cost: number) => {
    if (gold < cost) {
      toast.error('Nincs elég aranyad!');
      return;
    }
    toast.success(`${amount} gyémánt vásárlása sikeres!`);
    onPurchaseDiamondsWithGold(amount, cost);
  };
  
  const handleStreakFreezePurchase = () => {
    if (gold < config.streakFreezeGoldCost) {
      toast.error('Nincs elég aranyad!');
      return;
    }
    onPurchaseStreakFreeze();
    toast.success('Széria pont vásárlása sikeres!');
  };
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="rounded-full bg-white shadow-md hover:bg-purple-50"
        >
          <ArrowLeft style={{ width: SIZES.iconBase, height: SIZES.iconBase }} />
        </Button>
        <div style={styles.headerTextContainer}>
          <h1 style={styles.headerTitle}>
            <ShoppingBag style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: '#A855F7' }} />
            Bolt
          </h1>
          <p style={styles.headerSubtitle}>Vásárolj erőforrásokat és bónuszokat</p>
        </div>
      </div>

      {/* Current Balance */}
      <Card style={{ padding: SPACING.base, marginBottom: SPACING.lg, background: 'linear-gradient(to right, #A855F7, #EC4899)', color: COLORS.white, border: 'none' }}>
        <p style={styles.balanceText}>Jelenlegi egyenleged</p>
        <div style={styles.balanceRow}>
          <div style={styles.balanceItem}>
            <Coins style={{ width: SIZES.iconBase, height: SIZES.iconBase }} />
            <span style={styles.balanceValue}>{gold.toLocaleString('hu-HU')}</span>
          </div>
          <div style={styles.balanceItem}>
            <Gem style={{ width: SIZES.iconBase, height: SIZES.iconBase }} />
            <span style={styles.balanceValue}>{diamonds}</span>
          </div>
          <div style={styles.balanceItem}>
            <Flame style={{ width: SIZES.iconBase, height: SIZES.iconBase }} />
            <span style={styles.balanceValue}>{streakFreezes}</span>
          </div>
        </div>
      </Card>

      {/* Streak Freeze Section */}
      <div style={{ marginBottom: SPACING.lg }}>
        <div style={styles.sectionHeader}>
          <Flame style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#F97316' }} />
          <h2 style={styles.sectionTitle}>Széria Védelem</h2>
        </div>
        
        <Card style={{ padding: SPACING.base, border: '2px solid #FED7AA', backgroundColor: '#FFF7ED' }}>
          <div style={styles.streakCardContent}>
            <div style={styles.streakTextContainer}>
              <h3 style={styles.streakTitle}>Széria Pont</h3>
              <p style={styles.streakDescription}>
                Ha kihagysz egy napot, a széria pont automatikusan megvédi a szériádat.
              </p>
              <div style={styles.streakCurrent}>
                <Flame style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                <span>Jelenleg: <span style={styles.streakBold}>{streakFreezes} db</span></span>
              </div>
            </div>
            <div style={styles.streakPriceContainer}>
              <div style={{ marginBottom: SPACING.sm }}>
                <div style={styles.streakPrice}>{config.streakFreezeGoldCost}</div>
                <div style={styles.streakPriceLabel}>
                  <Coins style={{ width: 12, height: 12 }} />
                  arany
                </div>
              </div>
              <Button
                onClick={handleStreakFreezePurchase}
                disabled={gold < config.streakFreezeGoldCost}
                className="bg-orange-500 hover:bg-orange-600"
                size="sm"
              >
                Vásárlás
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Separator style={{ marginTop: SPACING.lg, marginBottom: SPACING.lg }} />

      {/* Gold Purchase Section */}
      <div style={{ marginBottom: SPACING.lg }}>
        <div style={styles.sectionHeader}>
          <Coins style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#EAB308' }} />
          <h2 style={{ ...styles.sectionTitle, color: '#78350F' }}>Arany vásárlása</h2>
        </div>
        
        <div style={styles.goldGrid}>
          <Card 
            style={{ padding: SPACING.base, border: '2px solid #FDE047', backgroundColor: '#FEFCE8', cursor: 'pointer', transition: 'background-color 0.3s' }}
            onClick={() => handleGoldPurchase(100, config.gold100Price)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF9C3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEFCE8'}
          >
            <div style={styles.goldCardContent}>
              <div style={styles.goldIconCircle('linear-gradient(to bottom right, #FBBF24, #D97706)')}>
                <Coins style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
              </div>
              <div style={styles.goldAmount}>100</div>
              <div style={styles.goldLabel}>arany</div>
              <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700">
                <CreditCard style={{ width: 14, height: 14, marginRight: 4 }} />
                {config.gold100Price.toLocaleString('hu-HU')} Ft
              </Button>
            </div>
          </Card>

          <Card 
            style={{ padding: SPACING.base, border: '2px solid #FDE047', backgroundColor: '#FEFCE8', cursor: 'pointer', transition: 'background-color 0.3s' }}
            onClick={() => handleGoldPurchase(500, config.gold500Price)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF9C3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEFCE8'}
          >
            <div style={styles.goldCardContent}>
              <div style={styles.goldIconCircle('linear-gradient(to bottom right, #FBBF24, #D97706)')}>
                <Coins style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
              </div>
              <div style={styles.goldAmount}>500</div>
              <div style={styles.goldLabel}>arany</div>
              <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700">
                <CreditCard style={{ width: 14, height: 14, marginRight: 4 }} />
                {config.gold500Price.toLocaleString('hu-HU')} Ft
              </Button>
            </div>
          </Card>

          <Card 
            style={{ padding: SPACING.base, border: '2px solid #FDE047', backgroundColor: '#FEFCE8', cursor: 'pointer', transition: 'background-color 0.3s' }}
            onClick={() => handleGoldPurchase(1000, config.gold1000Price)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF9C3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEFCE8'}
          >
            <div style={styles.goldCardContent}>
              <div style={styles.goldIconCircle('linear-gradient(to bottom right, #FBBF24, #EA580C)')}>
                <Coins style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
              </div>
              <div style={styles.goldAmount}>1,000</div>
              <div style={styles.goldLabel}>arany</div>
              <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700">
                <CreditCard style={{ width: 14, height: 14, marginRight: 4 }} />
                {config.gold1000Price.toLocaleString('hu-HU')} Ft
              </Button>
            </div>
          </Card>

          <Card 
            style={{ padding: SPACING.base, border: '2px solid #FDE047', backgroundColor: '#FEFCE8', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'background-color 0.3s' }}
            onClick={() => handleGoldPurchase(5000, config.gold5000Price)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF9C3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FEFCE8'}
          >
            <div style={styles.bestBadge}>BEST</div>
            <div style={styles.goldCardContent}>
              <div style={styles.goldIconCircle('linear-gradient(to bottom right, #FB923C, #DC2626)')}>
                <Sparkles style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
              </div>
              <div style={styles.goldAmount}>5,000</div>
              <div style={styles.goldLabel}>arany</div>
              <Button size="sm" className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                <CreditCard style={{ width: 14, height: 14, marginRight: 4 }} />
                {config.gold5000Price.toLocaleString('hu-HU')} Ft
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Separator style={{ marginTop: SPACING.lg, marginBottom: SPACING.lg }} />

      {/* Diamond Purchase Section */}
      <div style={{ marginBottom: SPACING.lg }}>
        <div style={styles.sectionHeader}>
          <Gem style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#06B6D4' }} />
          <h2 style={{ ...styles.sectionTitle, color: '#164E63' }}>Gyémánt vásárlása aranyért</h2>
        </div>
        
        <div style={styles.diamondGrid}>
          <Card style={{ padding: SPACING.base, border: '2px solid #A5F3FC', backgroundColor: '#ECFEFF' }}>
            <div style={styles.diamondCardContent}>
              <div style={styles.goldIconCircle('linear-gradient(to bottom right, #22D3EE, #2563EB)')}>
                <Gem style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
              </div>
              <div style={styles.diamondAmount}>1</div>
              <div style={styles.diamondLabel}>gyémánt</div>
              <Button 
                size="sm" 
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                onClick={() => handleDiamondPurchase(1, config.diamond1GoldCost)}
                disabled={gold < config.diamond1GoldCost}
              >
                <Coins style={{ width: 14, height: 14, marginRight: 4 }} />
                {config.diamond1GoldCost} arany
              </Button>
            </div>
          </Card>

          <Card style={{ padding: SPACING.base, border: '2px solid #A5F3FC', backgroundColor: '#ECFEFF' }}>
            <div style={styles.diamondCardContent}>
              <div style={styles.goldIconCircle('linear-gradient(to bottom right, #22D3EE, #2563EB)')}>
                <Gem style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
              </div>
              <div style={styles.diamondAmount}>10</div>
              <div style={styles.diamondLabel}>gyémánt</div>
              <Button 
                size="sm" 
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                onClick={() => handleDiamondPurchase(10, config.diamond10GoldCost)}
                disabled={gold < config.diamond10GoldCost}
              >
                <Coins style={{ width: 14, height: 14, marginRight: 4 }} />
                {config.diamond10GoldCost} arany
              </Button>
            </div>
          </Card>

          <Card style={{ padding: SPACING.base, border: '2px solid #A5F3FC', backgroundColor: '#ECFEFF' }}>
            <div style={styles.diamondCardContent}>
              <div style={styles.goldIconCircle('linear-gradient(to bottom right, #22D3EE, #9333EA)')}>
                <Gem style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
              </div>
              <div style={styles.diamondAmount}>50</div>
              <div style={styles.diamondLabel}>gyémánt</div>
              <Button 
                size="sm" 
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                onClick={() => handleDiamondPurchase(50, config.diamond50GoldCost)}
                disabled={gold < config.diamond50GoldCost}
              >
                <Coins style={{ width: 14, height: 14, marginRight: 4 }} />
                {config.diamond50GoldCost} arany
              </Button>
            </div>
          </Card>

          <Card style={{ padding: SPACING.base, border: '2px solid #A5F3FC', backgroundColor: '#ECFEFF', position: 'relative', overflow: 'hidden' }}>
            <div style={styles.bonusBadge}>BONUS</div>
            <div style={styles.diamondCardContent}>
              <div style={styles.goldIconCircle('linear-gradient(to bottom right, #C084FC, #EC4899)')}>
                <Sparkles style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
              </div>
              <div style={styles.diamondAmount}>100</div>
              <div style={styles.diamondLabel}>gyémánt</div>
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                onClick={() => handleDiamondPurchase(100, config.diamond100GoldCost)}
                disabled={gold < config.diamond100GoldCost}
              >
                <Coins style={{ width: 14, height: 14, marginRight: 4 }} />
                {config.diamond100GoldCost} arany
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
