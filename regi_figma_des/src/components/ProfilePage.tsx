import { ArrowLeft, User, Mail, Calendar, MapPin, Edit2, Save, X, Crown, Coins, Gem, TrendingUp } from 'lucide-react';
import { useState, useEffect, CSSProperties } from 'react';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface ProfilePageProps {
  onBack: () => void;
  playerLevel: number;
  coins: number;
  gems?: number;
  subscriptionTier?: 'free' | 'pro' | 'master';
}

interface UserProfile {
  name: string;
  email: string;
  birthDate: string;
  location: string;
  bio: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  birthDate: '',
  location: '',
  bio: ''
};

const loadProfile = (): UserProfile => {
  try {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
  return DEFAULT_PROFILE;
};

const saveProfile = (profile: UserProfile) => {
  try {
    localStorage.setItem('user_profile', JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  container: {
    position: 'absolute',
    inset: 0,
    paddingTop: 64,
    background: 'linear-gradient(to bottom right, #0F172A, #1E3A8A, #0F172A)',
    overflowY: 'auto',
  },

  // Header
  header: {
    background: 'linear-gradient(to right, rgba(29, 78, 216, 0.9), rgba(30, 64, 175, 0.9))',
    backdropFilter: 'blur(8px)',
    paddingLeft: SPACING.base,
    paddingRight: SPACING.base,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '2px solid #3B82F6',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(37, 99, 235, 0.6)',
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
  editButton: (isEditing: boolean): CSSProperties => ({
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: isEditing ? '#16A34A' : 'rgba(37, 99, 235, 0.6)',
  }),

  // Content
  content: {
    padding: SPACING.base,
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.base,
  },

  // Stats Card
  statsCard: {
    background: 'linear-gradient(to bottom right, rgba(30, 64, 175, 0.4), rgba(30, 58, 138, 0.4))',
    backdropFilter: 'blur(8px)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    border: '1px solid rgba(59, 130, 246, 0.3)',
  },
  statsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  statsTitle: {
    fontSize: SIZES.fontLG,
    color: COLORS.white,
    margin: 0,
  },
  tierBadge: (tier: string): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs,
    background: tier === 'master' 
      ? 'linear-gradient(to right, #A855F7, #EC4899)' 
      : tier === 'pro'
      ? 'linear-gradient(to right, #3B82F6, #06B6D4)'
      : '#334155',
    paddingLeft: SPACING.md,
    paddingRight: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    borderRadius: SIZES.radiusFull,
  }),
  tierBadgeText: (tier: string): CSSProperties => ({
    fontSize: SIZES.fontXS,
    color: tier === 'free' ? '#CBD5E1' : COLORS.white,
  }),

  // Level Progress
  levelContainer: {
    marginBottom: SPACING.base,
  },
  levelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  levelInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  levelText: {
    color: COLORS.white,
    margin: 0,
  },
  xpText: {
    fontSize: SIZES.fontSM,
    color: '#93C5FD',
  },
  progressBar: {
    width: '100%',
    backgroundColor: '#334155',
    borderRadius: SIZES.radiusFull,
    height: 12,
    overflow: 'hidden',
  },
  progressFill: (width: number): CSSProperties => ({
    height: '100%',
    background: 'linear-gradient(to right, #3B82F6, #06B6D4)',
    transition: 'width 0.5s',
    width: `${width}%`,
  }),

  // Resources Grid
  resourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: SPACING.md,
  },
  resourceCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.md,
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  resourceIcon: (bgColor: string): CSSProperties => ({
    width: 40,
    height: 40,
    backgroundColor: bgColor,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  resourceLabel: {
    fontSize: SIZES.fontXS,
    color: '#94A3B8',
  },
  resourceValue: (color: string): CSSProperties => ({
    fontSize: SIZES.fontLG,
    color,
    margin: 0,
  }),

  // Profile Info Card
  profileCard: {
    background: 'linear-gradient(to bottom right, rgba(30, 64, 175, 0.4), rgba(30, 58, 138, 0.4))',
    backdropFilter: 'blur(8px)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    border: '1px solid rgba(59, 130, 246, 0.3)',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  cancelButton: {
    width: 32,
    height: 32,
    backgroundColor: '#DC2626',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
    border: 'none',
  },

  // Form Fields
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.md,
  },
  fieldLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    fontSize: SIZES.fontSM,
    color: '#93C5FD',
    marginBottom: SPACING.xs,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: SIZES.radiusLG,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    color: COLORS.white,
    outline: 'none',
  },
  displayValue: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: SIZES.radiusLG,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    color: COLORS.white,
  },
  placeholder: {
    color: '#64748B',
  },
  textarea: {
    width: '100%',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: SIZES.radiusLG,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    color: COLORS.white,
    outline: 'none',
    resize: 'none',
  },
  textareaDisplay: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: SIZES.radiusLG,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    color: COLORS.white,
    minHeight: 80,
  },

  // Save Button
  saveButton: {
    width: '100%',
    background: 'linear-gradient(to right, #16A34A, #15803D)',
    color: COLORS.white,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderRadius: SIZES.radiusXL,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    transition: 'all 0.3s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    border: 'none',
  },
};

export function ProfilePage({ onBack, playerLevel, coins, gems = 0, subscriptionTier = 'free' }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(loadProfile());
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // Trigger a custom event to notify other components
    window.dispatchEvent(new Event('profileUpdated'));
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  // Calculate XP for current level
  const xpForCurrentLevel = playerLevel * 1000;
  const currentXp = 650; // This should come from props in real implementation
  const xpProgress = (currentXp / xpForCurrentLevel) * 100;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={onBack}
          style={styles.backButton}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.6)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.6)'}
        >
          <ArrowLeft style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: COLORS.white }} />
        </button>
        <h1 style={styles.headerTitle}>
          <User style={{ width: SIZES.iconLG, height: SIZES.iconLG }} />
          Diák Profil
        </h1>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          style={styles.editButton(isEditing)}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isEditing ? '#15803D' : 'rgba(59, 130, 246, 0.6)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isEditing ? '#16A34A' : 'rgba(37, 99, 235, 0.6)'}
        >
          {isEditing ? (
            <Save style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: COLORS.white }} />
          ) : (
            <Edit2 style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: COLORS.white }} />
          )}
        </button>
      </div>

      <div style={styles.content}>
        {/* Stats Card */}
        <div style={styles.statsCard}>
          <div style={styles.statsHeader}>
            <h2 style={styles.statsTitle}>Statisztikák</h2>
            <div style={styles.tierBadge(subscriptionTier)}>
              {(subscriptionTier === 'master' || subscriptionTier === 'pro') && (
                <Crown style={{ width: SIZES.iconSM, height: SIZES.iconSM, color: COLORS.white }} />
              )}
              <span style={styles.tierBadgeText(subscriptionTier)}>
                {subscriptionTier === 'master' ? 'Master' : subscriptionTier === 'pro' ? 'Pro' : 'Free'}
              </span>
            </div>
          </div>

          {/* Level Progress */}
          <div style={styles.levelContainer}>
            <div style={styles.levelHeader}>
              <div style={styles.levelInfo}>
                <TrendingUp style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#60A5FA' }} />
                <span style={styles.levelText}>Szint {playerLevel}</span>
              </div>
              <span style={styles.xpText}>{currentXp} / {xpForCurrentLevel} XP</span>
            </div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill(xpProgress)}></div>
            </div>
          </div>

          {/* Resources */}
          <div style={styles.resourcesGrid}>
            <div style={styles.resourceCard}>
              <div style={styles.resourceIcon('#F59E0B')}>
                <Coins style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
              </div>
              <div>
                <div style={styles.resourceLabel}>Arany</div>
                <div style={styles.resourceValue('#FCD34D')}>{coins}</div>
              </div>
            </div>
            <div style={styles.resourceCard}>
              <div style={styles.resourceIcon('#06B6D4')}>
                <Gem style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
              </div>
              <div>
                <div style={styles.resourceLabel}>Gyémánt</div>
                <div style={styles.resourceValue('#67E8F9')}>{gems}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info Card */}
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <h2 style={styles.statsTitle}>Személyes Adatok</h2>
            {isEditing && (
              <button
                onClick={handleCancel}
                style={styles.cancelButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
              >
                <X style={{ width: SIZES.iconSM, height: SIZES.iconSM, color: COLORS.white }} />
              </button>
            )}
          </div>

          <div style={styles.fieldsContainer}>
            {/* Name */}
            <div>
              <label style={styles.fieldLabel}>
                <User style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                Név
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  style={styles.input}
                  placeholder="Teljes név"
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'}
                />
              ) : (
                <div style={styles.displayValue}>
                  {profile.name || <span style={styles.placeholder}>Nem megadva</span>}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={styles.fieldLabel}>
                <Mail style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  style={styles.input}
                  placeholder="email@example.com"
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'}
                />
              ) : (
                <div style={styles.displayValue}>
                  {profile.email || <span style={styles.placeholder}>Nem megadva</span>}
                </div>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <label style={styles.fieldLabel}>
                <Calendar style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                Születési dátum
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedProfile.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  style={styles.input}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'}
                />
              ) : (
                <div style={styles.displayValue}>
                  {profile.birthDate || <span style={styles.placeholder}>Nem megadva</span>}
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label style={styles.fieldLabel}>
                <MapPin style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                Helyszín
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  style={styles.input}
                  placeholder="Város, Ország"
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'}
                />
              ) : (
                <div style={styles.displayValue}>
                  {profile.location || <span style={styles.placeholder}>Nem megadva</span>}
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label style={{ ...styles.fieldLabel, display: 'block' }}>
                Bemutatkozás
              </label>
              {isEditing ? (
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  style={styles.textarea}
                  placeholder="Írj magadról..."
                  rows={3}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'}
                />
              ) : (
                <div style={styles.textareaDisplay}>
                  {profile.bio || <span style={styles.placeholder}>Nem megadva</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button (mobile friendly) */}
        {isEditing && (
          <button
            onClick={handleSave}
            style={styles.saveButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #15803D, #14532D)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #16A34A, #15803D)';
            }}
          >
            <Save style={{ width: SIZES.iconBase, height: SIZES.iconBase }} />
            Változások mentése
          </button>
        )}
      </div>
    </div>
  );
}
