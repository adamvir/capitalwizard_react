// ============================================
// KÖZÖS STÍLUS KONSTANSOK
// Könnyű konvertálás React Native/Flutter-re
// ============================================

// SZÍNEK (COLORS)
export const COLORS = {
  // Alapszínek
  primary: '#3B82F6',      // Kék
  primaryDark: '#1E40AF',  // Sötét kék
  secondary: '#8B5CF6',    // Lila
  success: '#10B981',      // Zöld
  warning: '#F59E0B',      // Narancs
  danger: '#EF4444',       // Piros
  
  // Szürke skála
  black: '#000000',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Arany/Gyémánt
  gold: '#F59E0B',
  goldDark: '#D97706',
  goldLight: '#FCD34D',
  diamond: '#60A5FA',
  diamondDark: '#3B82F6',
  diamondLight: '#93C5FD',
  
  // XP színek
  xpBlue: '#3B82F6',
  xpBlueDark: '#2563EB',
  xpBlueLight: '#60A5FA',
  
  // Szint színek
  levelGold: '#F59E0B',
  levelBorder: '#FCD34D',
  
  // Háttér színek
  bgWhite: '#FFFFFF',
  bgGray: '#F9FAFB',
  bgDark: '#1F2937',
  
  // Kristály barlang színek
  crystalPurple: '#8B5CF6',
  crystalBlue: '#3B82F6',
  crystalPink: '#EC4899',
  crystalCyan: '#06B6D4',
  
  // Átlátszó árnyékok
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.2)',
  shadowDark: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Állapot színek
  disabled: '#D1D5DB',
  border: '#E5E7EB',
  borderDark: '#374151',
  
  // Előfizetés színek
  freeTier: '#9CA3AF',
  proTier: '#3B82F6',
  masterTier: '#8B5CF6',
};

// MÉRETEK (SIZES)
export const SIZES = {
  // Font méretek
  fontXS: 12,
  fontSM: 14,
  fontBase: 16,
  fontLG: 18,
  fontXL: 20,
  font2XL: 24,
  font3XL: 30,
  font4XL: 36,
  font5XL: 48,
  font6XL: 60,

  // Icon méretek
  iconXS: 12,
  iconSM: 16,
  iconBase: 20,
  iconLG: 24,
  iconXL: 32,
  icon2XL: 40,
  icon3XL: 48,
  
  // Button méretek
  buttonHeightSM: 32,
  buttonHeightBase: 40,
  buttonHeightLG: 48,
  
  // Avatar méretek
  avatarSM: 32,
  avatarBase: 40,
  avatarLG: 64,
  avatarXL: 80,
  avatar2XL: 96,
  
  // Border radius
  radiusXS: 4,
  radiusSM: 6,
  radiusBase: 8,
  radiusLG: 12,
  radiusXL: 16,
  radius2XL: 24,
  radius3XL: 32,
  radiusFull: 9999,
  
  // Border width
  borderThin: 1,
  borderBase: 2,
  borderThick: 3,
  borderXL: 4,
};

// SPACING (TÁVOLSÁGOK)
export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
};

// TELEFON MÉRETEK (iPhone 16 Pro Max)
export const PHONE_DIMENSIONS = {
  width: 430,
  height: 932,
  borderRadius: 55,
  screenPadding: 8,
  topNotch: 59,
  bottomBar: 34,
  sideButtonWidth: 4,
  sideButtonHeight: 80,
  volumeButtonWidth: 4,
  volumeButtonHeight: 40,
  dynamicIslandWidth: 150,
  dynamicIslandHeight: 37,
};

// ANIMÁCIÓ IDŐZÍTÉSEK
export const ANIMATION = {
  fast: 150,
  base: 300,
  slow: 500,
  verySlow: 1000,
};

// Z-INDEX RÉTEGEK
export const Z_INDEX = {
  background: 0,
  content: 1,
  overlay: 10,
  modal: 20,
  tooltip: 30,
  notification: 40,
  max: 50,
};

// TIPOGRÁFIA SÚLYOK
export const FONT_WEIGHT = {
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// ÁRNYÉKOK (SHADOWS)
export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  xl: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
};

// JÁTÉK KONFIGURÁCIÓ SZÍNEK
export const GAME_COLORS = {
  easy: '#10B981',        // Zöld - Könnyű
  medium: '#F59E0B',      // Narancs - Közepes
  hard: '#EF4444',        // Piros - Nehéz
  
  reading: '#EF4444',     // Piros - Szövegértés
  matching: '#F59E0B',    // Narancs - Párosítás
  quiz: '#10B981',        // Zöld - Kvíz
};

// KÖNYV SZÍNEK
export const BOOK_COLORS = {
  tokepiaciSzotar: {
    from: '#B45309',
    via: '#92400E',
    to: '#78350F',
    accent: '#FCD34D',
  },
  befektetesAlapjai: {
    from: '#1D4ED8',
    via: '#1E40AF',
    to: '#1E3A8A',
    accent: '#60A5FA',
  },
  penzugyiAlapismeretek: {
    from: '#334155',
    via: '#1E293B',
    to: '#0F172A',
    accent: '#94A3B8',
  },
  reszvények: {
    from: '#047857',
    via: '#065F46',
    to: '#064E3B',
    accent: '#34D399',
  },
  kotvények: {
    from: '#7C3AED',
    via: '#6D28D9',
    to: '#5B21B6',
    accent: '#A78BFA',
  },
  portfolioKezeles: {
    from: '#B91C1C',
    via: '#991B1B',
    to: '#7F1D1D',
    accent: '#F87171',
  },
  technikaiElemzes: {
    from: '#4338CA',
    via: '#3730A3',
    to: '#312E81',
    accent: '#818CF8',
  },
  fundamentalisElemzes: {
    from: '#0F766E',
    via: '#115E59',
    to: '#134E4A',
    accent: '#5EEAD4',
  },
  penzugyiMatematika: {
    from: '#C2410C',
    via: '#9A3412',
    to: '#7C2D12',
    accent: '#FB923C',
  },
  opciok: {
    from: '#BE185D',
    via: '#9F1239',
    to: '#831843',
    accent: '#F9A8D4',
  },
  hatariidosUgyletek: {
    from: '#0E7490',
    via: '#155E75',
    to: '#164E63',
    accent: '#67E8F9',
  },
  kockazatkezeles: {
    from: '#374151',
    via: '#1F2937',
    to: '#111827',
    accent: '#9CA3AF',
  },
  makrogazdasag: {
    from: '#A16207',
    via: '#854D0E',
    to: '#713F12',
    accent: '#FDE047',
  },
  kriptoEsBlockchain: {
    from: '#047857',
    via: '#065F46',
    to: '#064E3B',
    accent: '#34D399',
  },
  pszichologiaEsTrading: {
    from: '#1D4ED8',
    via: '#1E40AF',
    to: '#1E3A8A',
    accent: '#60A5FA',
  },
  ingatlanBefektetes: {
    from: '#B91C1C',
    via: '#991B1B',
    to: '#7F1D1D',
    accent: '#F87171',
  },
};
