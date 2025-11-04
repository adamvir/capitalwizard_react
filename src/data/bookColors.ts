// ============================================
// BOOK COLORS - KÖNYVEK SZÍNEI
// ============================================
// Minden könyvhöz tartozó színek centralizálva

export interface BookColorConfig {
  colors: [string, string]; // Gradient colors
  borderColor: string;
  textColor: string;
}

// Book title -> color mapping
export const BOOK_COLORS: Record<string, BookColorConfig> = {
  // Shelf 1
  'Tőkepiaci Szótár': {
    colors: ['#D97706', '#B45309'],
    borderColor: '#92400E',
    textColor: '#FEF3C7',
  },
  'Pénzügyi Alapismeretek': {
    colors: ['#475569', '#1E293B'],
    borderColor: '#0F172A',
    textColor: '#F1F5F9',
  },
  'Befektetés Alapjai': {
    colors: ['#1D4ED8', '#1E3A8A'],
    borderColor: '#1E3A8A',
    textColor: '#DBEAFE',
  },
  'Részvények': {
    colors: ['#15803D', '#14532D'],
    borderColor: '#052E16',
    textColor: '#DCFCE7',
  },
  'Kötvények': {
    colors: ['#7C3AED', '#5B21B6'],
    borderColor: '#4C1D95',
    textColor: '#F3E8FF',
  },
  'Portfolió Kezelés': {
    colors: ['#DC2626', '#991B1B'],
    borderColor: '#7F1D1D',
    textColor: '#FEE2E2',
  },

  // Shelf 2
  'Technikai Elemzés': {
    colors: ['#2563EB', '#1E40AF'],
    borderColor: '#1E3A8A',
    textColor: '#DBEAFE',
  },
  'Fundamentális Elemzés': {
    colors: ['#059669', '#047857'],
    borderColor: '#065F46',
    textColor: '#D1FAE5',
  },
  'Pénzügyi Matematika': {
    colors: ['#EA580C', '#C2410C'],
    borderColor: '#9A3412',
    textColor: '#FFEDD5',
  },
  'Opciók': {
    colors: ['#DB2777', '#9F1239'],
    borderColor: '#831843',
    textColor: '#FCE7F3',
  },
  'Határidős Ügyletek': {
    colors: ['#0891B2', '#155E75'],
    borderColor: '#164E63',
    textColor: '#CFFAFE',
  },

  // Shelf 3
  'Devizapiac': {
    colors: ['#16A34A', '#15803D'],
    borderColor: '#166534',
    textColor: '#DCFCE7',
  },
  'Kockázatkezelés': {
    colors: ['#DC2626', '#B91C1C'],
    borderColor: '#991B1B',
    textColor: '#FEE2E2',
  },
  'Vállalati Pénzügy': {
    colors: ['#6366F1', '#4F46E5'],
    borderColor: '#4338CA',
    textColor: '#E0E7FF',
  },
  'Értékpapírosítás': {
    colors: ['#84CC16', '#65A30D'],
    borderColor: '#4D7C0F',
    textColor: '#ECFCCB',
  },
  'Piackutatási Alapok': {
    colors: ['#A855F7', '#9333EA'],
    borderColor: '#7E22CE',
    textColor: '#F3E8FF',
  },

  // Shelf 4
  'ETF-ek': {
    colors: ['#06B6D4', '#0891B2'],
    borderColor: '#0E7490',
    textColor: '#CFFAFE',
  },
  'Mikrogazdaságtan': {
    colors: ['#F97316', '#EA580C'],
    borderColor: '#C2410C',
    textColor: '#FFEDD5',
  },
  'Day Trading': {
    colors: ['#2563EB', '#1D4ED8'],
    borderColor: '#1E40AF',
    textColor: '#DBEAFE',
  },
  'Faktorok és Kereskedelem': {
    colors: ['#10B981', '#059669'],
    borderColor: '#047857',
    textColor: '#D1FAE5',
  },
  'Passzív Befektetés': {
    colors: ['#8B5CF6', '#7C3AED'],
    borderColor: '#6D28D9',
    textColor: '#EDE9FE',
  },

  // Shelf 5
  'Pénzügyi Szabályozás': {
    colors: ['#DC2626', '#B91C1C'],
    borderColor: '#991B1B',
    textColor: '#FEE2E2',
  },
  'Kripto és Blockchain': {
    colors: ['#4F46E5', '#4338CA'],
    borderColor: '#3730A3',
    textColor: '#E0E7FF',
  },
  'Pszichológia és Trading': {
    colors: ['#0D9488', '#0F766E'],
    borderColor: '#115E59',
    textColor: '#CCFBF1',
  },
  'Ingatlan Befektetés': {
    colors: ['#EA580C', '#C2410C'],
    borderColor: '#9A3412',
    textColor: '#FFEDD5',
  },
  'Kereskedési Stratégiák': {
    colors: ['#DB2777', '#BE123C'],
    borderColor: '#9F1239',
    textColor: '#FCE7F3',
  },
};

// Helper function to get book colors
export function getBookColors(bookTitle: string): BookColorConfig {
  return BOOK_COLORS[bookTitle] || {
    // Default fallback colors
    colors: ['#D97706', '#B45309'],
    borderColor: '#92400E',
    textColor: '#FEF3C7',
  };
}
