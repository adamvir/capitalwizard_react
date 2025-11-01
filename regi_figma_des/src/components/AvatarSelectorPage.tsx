import { useState, useEffect, CSSProperties } from 'react';
import { ArrowLeft, Crown, Lock, Sparkles } from 'lucide-react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface AvatarSelectorPageProps {
  onBack: () => void;
  subscriptionTier: 'free' | 'pro' | 'master';
}

// Avatar tiers with emojis
const avatars = {
  free: [
    { emoji: '🧙‍♂️', name: 'Varázsló', rarity: 'Közönséges' },
    { emoji: '⚔️', name: 'Harcos', rarity: 'Közönséges' },
    { emoji: '🏹', name: 'Íjász', rarity: 'Közönséges' },
    { emoji: '🛡️', name: 'Védő', rarity: 'Közönséges' },
    { emoji: '🗡️', name: 'Lovag', rarity: 'Közönséges' },
    { emoji: '🎯', name: 'Célzó', rarity: 'Közönséges' }
  ],
  pro: [
    { emoji: '🐉', name: 'Sárkány', rarity: 'Ritka', locked: true },
    { emoji: '🦅', name: 'Sas', rarity: 'Ritka', locked: true },
    { emoji: '🦁', name: 'Oroszlán', rarity: 'Ritka', locked: true },
    { emoji: '🔮', name: 'Látnok', rarity: 'Ritka', locked: true },
    { emoji: '⚡', name: 'Villám', rarity: 'Ritka', locked: true },
    { emoji: '🌟', name: 'Csillag', rarity: 'Ritka', locked: true },
    { emoji: '🔥', name: 'Láng', rarity: 'Ritka', locked: true },
    { emoji: '💎', name: 'Gyémánt', rarity: 'Ritka', locked: true }
  ],
  master: [
    { emoji: '👑', name: 'Király', rarity: 'Legendás', locked: true },
    { emoji: '🌌', name: 'Galaxis', rarity: 'Legendás', locked: true },
    { emoji: '🦄', name: 'Egyszarvú', rarity: 'Legendás', locked: true },
    { emoji: '🎭', name: 'Maszk', rarity: 'Legendás', locked: true },
    { emoji: '🏆', name: 'Bajnok', rarity: 'Legendás', locked: true },
    { emoji: '💫', name: 'Csillaghullás', rarity: 'Legendás', locked: true }
  ]
};

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  container: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, #0F172A, #581C87, #0F172A)',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 80,
  },

  // Header
  header: {
    background: 'linear-gradient(to right, rgba(126, 34, 206, 0.9), rgba(107, 33, 168, 0.9))',
    backdropFilter: 'blur(8px)',
    paddingLeft: SPACING.base,
    paddingRight: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
    borderBottom: '2px solid #A855F7',
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(147, 51, 234, 0.6)',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
    border: 'none',
  },
  headerTitle: {
    fontSize: SIZES.fontXL,
    color: COLORS.white,
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    margin: 0,
  },
  spacer: {
    width: 40,
    height: 40,
  },

  // Current Avatar Display
  currentAvatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  currentAvatarCircle: {
    width: 80,
    height: 80,
    background: 'linear-gradient(to bottom right, #9333EA, #EC4899)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '4px solid #6B21A8',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
  },
  currentAvatarEmoji: {
    fontSize: SIZES.font5XL,
  },
  currentAvatarLabel: {
    fontSize: SIZES.fontSM,
    color: '#E9D5FF',
  },

  // Avatar Grid Container
  gridContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: SPACING.base,
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.lg,
  },

  // Section
  section: {
    marginBottom: 0,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontLG,
    color: COLORS.white,
    margin: 0,
  },
  sectionBadge: (bg: string, color: string): CSSProperties => ({
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: bg,
    color,
    fontSize: SIZES.fontXS,
    borderRadius: SIZES.radiusSM,
  }),

  // Avatar Grid
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: SPACING.md,
  },

  // Avatar Button
  avatarButton: (gradient: string, borderColor: string, isLocked: boolean, isSelected: boolean): CSSProperties => ({
    position: 'relative',
    background: gradient,
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    border: `2px solid ${borderColor}`,
    transition: 'all 0.3s',
    boxShadow: isSelected ? '0 8px 16px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.2)',
    opacity: isLocked ? 0.5 : 1,
    cursor: isLocked ? 'not-allowed' : 'pointer',
    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
  }),
  avatarContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarEmojiContainer: {
    fontSize: SIZES.font4XL,
    position: 'relative',
  },
  avatarLockOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: SIZES.radiusSM,
  },
  avatarName: {
    fontSize: SIZES.fontXS,
    color: COLORS.white,
    textAlign: 'center',
  },
  avatarRarity: (color: string): CSSProperties => ({
    fontSize: 10,
    color,
  }),
  selectedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: '#10B981',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid white',
  },
  checkmark: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
  },

  // Info Card
  infoCard: {
    background: 'linear-gradient(to bottom right, rgba(30, 64, 175, 0.4), rgba(30, 58, 138, 0.4))',
    backdropFilter: 'blur(8px)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    border: '1px solid rgba(59, 130, 246, 0.3)',
    marginBottom: SPACING.base,
  },
  infoCardContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  infoCardTextContainer: {
    flex: 1,
  },
  infoCardTitle: {
    color: COLORS.white,
    marginBottom: 4,
    fontSize: SIZES.fontBase,
    margin: 0,
  },
  infoCardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: SIZES.fontSM,
    color: '#BFDBFE',
  },
  infoCardItem: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  tierDot: (bg: string): CSSProperties => ({
    width: 12,
    height: 12,
    backgroundColor: bg,
    borderRadius: '50%',
  }),
};

export function AvatarSelectorPage({ onBack, subscriptionTier }: AvatarSelectorPageProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🧙‍♂️');

  // Load saved avatar from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('player_avatar');
    if (saved) {
      setSelectedAvatar(saved);
    }
  }, []);

  const handleSelectAvatar = (emoji: string, isLocked: boolean) => {
    if (!isLocked) {
      setSelectedAvatar(emoji);
      localStorage.setItem('player_avatar', emoji);
      
      // Trigger storage event for TopBar to update
      window.dispatchEvent(new Event('storage'));
    }
  };

  const isAvatarLocked = (avatar: any) => {
    if (!avatar.locked) return false;
    
    // Check if user has required subscription
    if (subscriptionTier === 'master') return false;
    if (subscriptionTier === 'pro' && avatar.rarity !== 'Legendás') return false;
    return true;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Közönséges':
        return { gradient: 'linear-gradient(to bottom right, #475569, #334155)', border: '#64748B' };
      case 'Ritka':
        return { gradient: 'linear-gradient(to bottom right, #2563EB, #1D4ED8)', border: '#3B82F6' };
      case 'Legendás':
        return { gradient: 'linear-gradient(to bottom right, #9333EA, #EC4899)', border: '#A855F7' };
      default:
        return { gradient: 'linear-gradient(to bottom right, #475569, #334155)', border: '#64748B' };
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'Közönséges':
        return '#CBD5E1';
      case 'Ritka':
        return '#93C5FD';
      case 'Legendás':
        return '#D8B4FE';
      default:
        return '#CBD5E1';
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button
            onClick={onBack}
            style={styles.backButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.6)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(147, 51, 234, 0.6)'}
          >
            <ArrowLeft style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: COLORS.white }} />
          </button>
          <h1 style={styles.headerTitle}>
            <Sparkles style={{ width: SIZES.iconLG, height: SIZES.iconLG }} />
            Avatar Választó
          </h1>
          <div style={styles.spacer}></div>
        </div>

        {/* Current Avatar Display */}
        <div style={styles.currentAvatarSection}>
          <div style={styles.currentAvatarCircle}>
            <span style={styles.currentAvatarEmoji}>{selectedAvatar}</span>
          </div>
          <p style={styles.currentAvatarLabel}>Kiválasztott Avatar</p>
        </div>
      </div>

      {/* Avatar Grid */}
      <div style={styles.gridContainer}>
        {/* Free Avatars */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Ingyenes Avatarok</h2>
            <span style={styles.sectionBadge('#334155', '#CBD5E1')}>
              {avatars.free.length} db
            </span>
          </div>
          <div style={styles.avatarGrid}>
            {avatars.free.map((avatar, index) => {
              const isSelected = selectedAvatar === avatar.emoji;
              const colors = getRarityColor(avatar.rarity);
              return (
                <button
                  key={index}
                  onClick={() => handleSelectAvatar(avatar.emoji, false)}
                  style={styles.avatarButton(colors.gradient, colors.border, false, isSelected)}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div style={styles.avatarContent}>
                    <div style={styles.avatarEmojiContainer}>{avatar.emoji}</div>
                    <div style={styles.avatarName}>{avatar.name}</div>
                    <div style={styles.avatarRarity(getRarityTextColor(avatar.rarity))}>
                      {avatar.rarity}
                    </div>
                  </div>
                  {isSelected && (
                    <div style={styles.selectedBadge}>
                      <span style={styles.checkmark}>✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pro Avatars */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Pro Avatarok</h2>
            <Crown style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#60A5FA' }} />
            <span style={styles.sectionBadge('rgba(29, 78, 216, 0.5)', '#93C5FD')}>
              {avatars.pro.length} db
            </span>
          </div>
          <div style={styles.avatarGrid}>
            {avatars.pro.map((avatar, index) => {
              const isLocked = isAvatarLocked(avatar);
              const isSelected = selectedAvatar === avatar.emoji;
              const colors = getRarityColor(avatar.rarity);
              return (
                <button
                  key={index}
                  onClick={() => handleSelectAvatar(avatar.emoji, isLocked)}
                  style={styles.avatarButton(colors.gradient, colors.border, isLocked, isSelected)}
                  disabled={isLocked}
                  onMouseEnter={(e) => {
                    if (!isLocked && !isSelected) e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isLocked && !isSelected) e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div style={styles.avatarContent}>
                    <div style={styles.avatarEmojiContainer}>
                      {avatar.emoji}
                      {isLocked && (
                        <div style={styles.avatarLockOverlay}>
                          <Lock style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
                        </div>
                      )}
                    </div>
                    <div style={styles.avatarName}>{avatar.name}</div>
                    <div style={styles.avatarRarity(getRarityTextColor(avatar.rarity))}>
                      {avatar.rarity}
                    </div>
                  </div>
                  {isSelected && !isLocked && (
                    <div style={styles.selectedBadge}>
                      <span style={styles.checkmark}>✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Master Avatars */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Master Avatarok</h2>
            <Crown style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#C084FC' }} />
            <span style={styles.sectionBadge('rgba(126, 34, 206, 0.5)', '#D8B4FE')}>
              {avatars.master.length} db
            </span>
          </div>
          <div style={styles.avatarGrid}>
            {avatars.master.map((avatar, index) => {
              const isLocked = isAvatarLocked(avatar);
              const isSelected = selectedAvatar === avatar.emoji;
              const colors = getRarityColor(avatar.rarity);
              return (
                <button
                  key={index}
                  onClick={() => handleSelectAvatar(avatar.emoji, isLocked)}
                  style={styles.avatarButton(colors.gradient, colors.border, isLocked, isSelected)}
                  disabled={isLocked}
                  onMouseEnter={(e) => {
                    if (!isLocked && !isSelected) e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isLocked && !isSelected) e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div style={styles.avatarContent}>
                    <div style={styles.avatarEmojiContainer}>
                      {avatar.emoji}
                      {isLocked && (
                        <div style={styles.avatarLockOverlay}>
                          <Lock style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
                        </div>
                      )}
                    </div>
                    <div style={styles.avatarName}>{avatar.name}</div>
                    <div style={styles.avatarRarity(getRarityTextColor(avatar.rarity))}>
                      {avatar.rarity}
                    </div>
                  </div>
                  {isSelected && !isLocked && (
                    <div style={styles.selectedBadge}>
                      <span style={styles.checkmark}>✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Card */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardContent}>
            <Sparkles style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#60A5FA', marginTop: 2 }} />
            <div style={styles.infoCardTextContainer}>
              <h3 style={styles.infoCardTitle}>Avatar Tier-ek</h3>
              <div style={styles.infoCardList}>
                <div style={styles.infoCardItem}>
                  <div style={styles.tierDot('#475569')}></div>
                  <span>Közönséges - Mindenki számára elérhető</span>
                </div>
                <div style={styles.infoCardItem}>
                  <div style={styles.tierDot('#2563EB')}></div>
                  <span>Ritka - Pro előfizetés szükséges</span>
                </div>
                <div style={styles.infoCardItem}>
                  <div style={styles.tierDot('#9333EA')}></div>
                  <span>Legendás - Master előfizetés szükséges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
