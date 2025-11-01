import { ArrowLeft, BookOpen, Filter, SortAsc, Search, Grid3x3, List, BookMarked, Clock, Coins, Calendar, X } from 'lucide-react';
import { useState, useEffect, CSSProperties } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from './ui/dropdown-menu';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface LibraryPageProps {
  onBack: () => void;
  onOpenBookView: (bookTitle: string) => void;
  coins: number;
  onCoinsChange: (newCoins: number) => void;
}

// Book data structure
interface Book {
  title: string;
  color: string;
  width: number;
  spineColor: string;
  textColor: string;
  hasContent?: boolean;
}

interface RentedBook {
  title: string;
  rentedUntil: number; // timestamp
  daysRented: number;
  color: string;
  textColor: string;
}

// Calculate rental price based on days
const calculateRentalPrice = (days: number): number => {
  if (days === 1) return 50;
  if (days === 30) return 1000;
  
  // Progressive discount: the more days, the cheaper per day
  // Formula: starts at 50/day, decreases to 33.33/day at 30 days
  const basePrice = 50;
  const maxDiscount = 0.33; // 33% discount at max
  const discountFactor = (days - 1) / 29; // 0 to 1 progression
  const pricePerDay = basePrice * (1 - (maxDiscount * discountFactor));
  
  return Math.round(pricePerDay * days);
};

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, #78350F, #1C1917, #78350F)',
    overflow: 'hidden',
  },
  backgroundOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(120, 53, 15, 0.8), rgba(41, 37, 36, 0.9), rgba(120, 53, 15, 0.8))',
  },
  woodGrainTexture: {
    position: 'absolute',
    inset: 0,
    opacity: 0.3,
    backgroundImage: `repeating-linear-gradient(90deg, rgba(139, 69, 19, 0.2) 0px, transparent 1px, transparent 2px, rgba(139, 69, 19, 0.2) 3px)`,
  },

  // Header
  header: {
    position: 'relative',
    zIndex: 20,
    paddingTop: 48,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
    paddingBottom: SPACING.base,
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(180, 83, 9, 0.8)',
    backdropFilter: 'blur(8px)',
    borderRadius: SIZES.radiusXL,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(120, 53, 15, 0.5)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  headerTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    color: '#FEF3C7',
    fontSize: SIZES.font2XL,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rentalButton: {
    position: 'relative',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(180, 83, 9, 0.8)',
    backdropFilter: 'blur(8px)',
    borderRadius: SIZES.radiusXL,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(120, 53, 15, 0.5)',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  rentalBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: '#DC2626',
    borderRadius: '50%',
    border: '2px solid #78350F',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rentalBadgeText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
  },

  // Bookshelf Container
  bookshelfContainer: {
    position: 'relative',
    zIndex: 10,
    height: 'calc(100% - 100px)',
    overflowY: 'auto',
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
    paddingBottom: 80,
  },
  bookshelfInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.lg,
  },

  // Shelf
  shelfContainer: {
    position: 'relative',
  },
  shelfBacking: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 12,
    background: 'linear-gradient(to bottom, #92400E, #78350F)',
    borderRadius: SIZES.radiusSM,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  shelfEdge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    height: 4,
    backgroundColor: 'rgba(120, 53, 15, 0.8)',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
  },
  booksRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    gap: 4,
    paddingBottom: SPACING.base,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    minHeight: 180,
  },

  // Book
  bookButton: (width: number): CSSProperties => ({
    width: `${width}px`,
    position: 'relative',
    transition: 'all 0.3s',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    padding: 0,
  }),
  bookSpine: (color: string, borderColor: string, height: number, isRented: boolean): CSSProperties => ({
    borderRadius: SIZES.radiusSM,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    borderLeft: `2px solid`,
    borderRight: `2px solid`,
    borderColor,
    transition: 'all 0.3s',
    height: `${height}px`,
    transformOrigin: 'bottom',
    opacity: isRented ? 0.6 : 1,
  }),
  bookTitleContainer: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  bookTitle: (textColor: string): CSSProperties => ({
    fontSize: SIZES.fontXS,
    textAlign: 'center',
    lineHeight: 1.2,
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    transform: 'rotate(180deg)',
  }),
  bookTexture: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  bookShadow: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bookBottomEdge: (color: string, borderColor: string): CSSProperties => ({
    height: 8,
    borderRadius: `0 0 ${SIZES.radiusSM} ${SIZES.radiusSM}`,
    filter: 'brightness(0.75)',
    borderLeft: `2px solid`,
    borderRight: `2px solid`,
    borderColor,
  }),
  rentedIndicator: {
    position: 'absolute',
    top: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  rentedBadge: {
    backgroundColor: '#10B981',
    color: COLORS.white,
    fontSize: 10,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: SIZES.radiusFull,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  },
  rentedBadgeText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  // Decorative Elements
  decorBox1: {
    position: 'absolute',
    top: 0,
    right: 16,
    width: 64,
    height: 80,
    backgroundColor: 'rgba(180, 83, 9, 0.2)',
    borderRadius: `0 0 ${SIZES.radiusLG} ${SIZES.radiusLG}`,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  decorBox2: {
    position: 'absolute',
    top: 128,
    left: 8,
    width: 48,
    height: 64,
    backgroundColor: 'rgba(146, 64, 14, 0.3)',
    borderRadius: `0 0 ${SIZES.radiusLG} ${SIZES.radiusLG}`,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },

  // Modals - Book Details Modal
  modalOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
    zIndex: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  bookDetailsCard: {
    background: 'linear-gradient(to bottom right, #FEF3C7, #FDE68A)',
    borderRadius: SIZES.radius2XL,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    padding: 32,
    maxWidth: 384,
    border: '4px solid #78350F',
  },
  bookDetailsHeader: (color: string): CSSProperties => ({
    borderRadius: SIZES.radiusLG,
    padding: SPACING.lg,
    marginBottom: SPACING.base,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  }),
  bookDetailsText: {
    color: '#78350F',
    marginBottom: SPACING.lg,
  },
  bookDetailsActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.sm,
  },
  bookDetailsButton: (gradient: string): CSSProperties => ({
    width: '100%',
    background: gradient,
    color: COLORS.white,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderRadius: SIZES.radiusLG,
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    border: 'none',
  }),
  closeButton: {
    width: '100%',
    backgroundColor: '#B45309',
    color: '#FEF3C7',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderRadius: SIZES.radiusLG,
    transition: 'colors 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
  },

  // Rental Modal
  rentalCard: {
    background: 'linear-gradient(to bottom right, #FEF3C7, #FDE68A)',
    borderRadius: SIZES.radius2XL,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    padding: SPACING.lg,
    maxWidth: 448,
    width: '100%',
    border: '4px solid #78350F',
  },
  rentalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  rentalTitle: {
    fontSize: SIZES.font2XL,
    color: '#78350F',
    margin: 0,
  },
  rentalCloseButton: {
    width: 32,
    height: 32,
    backgroundColor: '#B45309',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
    border: 'none',
  },
  
  // Days Selector
  daysSection: {
    marginBottom: SPACING.lg,
  },
  daysLabel: {
    display: 'block',
    color: '#78350F',
    marginBottom: SPACING.sm,
  },
  daysSlider: {
    width: '100%',
    height: 8,
    backgroundColor: '#FCD34D',
    borderRadius: SIZES.radiusLG,
    appearance: 'none',
    cursor: 'pointer',
    accentColor: '#B45309',
  },
  daysRange: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: SIZES.fontSM,
    color: '#92400E',
    marginTop: 4,
  },
  daysCurrent: {
    color: '#78350F',
  },

  // Price Display
  priceBox: {
    background: 'linear-gradient(to right, #EAB308, #CA8A04)',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.base,
    marginBottom: SPACING.lg,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  priceLabelText: {
    color: '#78350F',
  },
  priceValue: {
    fontSize: SIZES.font2XL,
    color: '#78350F',
  },
  pricePerDay: {
    fontSize: SIZES.fontXS,
    color: '#92400E',
  },

  // User Balance
  balanceBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: 'rgba(251, 191, 36, 0.5)',
    borderRadius: SIZES.radiusLG,
  },
  balanceLabel: {
    color: '#78350F',
  },
  balanceValue: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  balanceValueText: {
    color: '#78350F',
  },

  // Action Buttons
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.sm,
  },
  rentButton: (disabled: boolean): CSSProperties => ({
    width: '100%',
    background: disabled 
      ? 'linear-gradient(to right, #9CA3AF, #6B7280)' 
      : 'linear-gradient(to right, #059669, #047857)',
    color: COLORS.white,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderRadius: SIZES.radiusLG,
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
  }),
  cancelButton: {
    width: '100%',
    backgroundColor: '#B45309',
    color: '#FEF3C7',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
  },

  // Rental Panel (Sidebar)
  rentalPanelBackdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 40,
  },
  rentalPanel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 320,
    background: 'linear-gradient(to bottom right, #FEF3C7, #FDE68A)',
    boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
    zIndex: 50,
    overflowY: 'auto',
    borderLeft: '4px solid #78350F',
  },
  panelHeader: {
    position: 'sticky',
    top: 0,
    background: 'linear-gradient(to right, #B45309, #92400E)',
    padding: SPACING.base,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    zIndex: 10,
  },
  panelHeaderContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  panelHeaderTitle: {
    color: '#FEF3C7',
    fontSize: SIZES.fontXL,
    margin: 0,
  },
  panelCloseButton: {
    width: 32,
    height: 32,
    backgroundColor: '#78350F',
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
    border: 'none',
  },

  // Rented Books List
  rentedBooksList: {
    padding: SPACING.base,
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.md,
  },
  emptyRentalState: {
    textAlign: 'center',
    paddingTop: 48,
    paddingBottom: 48,
  },
  emptyRentalIcon: {
    width: 64,
    height: 64,
    color: '#FBBF24',
    margin: '0 auto',
    marginBottom: SPACING.base,
  },
  emptyRentalText: {
    color: '#92400E',
  },
  emptyRentalSubtext: {
    color: '#A16207',
    fontSize: SIZES.fontSM,
    marginTop: SPACING.sm,
  },

  // Rented Book Card
  rentedBookCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLG,
    padding: SPACING.base,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    border: '2px solid #FCD34D',
  },
  rentedBookInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  rentedBookInfoRow: (isExpiring: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: SIZES.fontSM,
  }),
  rentedBookLabel: (isExpiring: boolean): CSSProperties => ({
    color: isExpiring ? '#DC2626' : '#92400E',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  }),
  rentedBookValue: (isExpiring: boolean): CSSProperties => ({
    color: isExpiring ? '#B91C1C' : '#78350F',
    fontWeight: isExpiring ? 'bold' : 'normal',
  }),

  // Progress Bar in Rented Book
  rentedProgressBar: {
    width: '100%',
    backgroundColor: '#FDE68A',
    borderRadius: SIZES.radiusFull,
    height: 8,
    overflow: 'hidden',
  },
  rentedProgressFill: (percentage: number, isExpiring: boolean): CSSProperties => ({
    height: '100%',
    transition: 'all 0.3s',
    width: `${percentage}%`,
    backgroundColor: isExpiring ? '#DC2626' : '#059669',
  }),

  // Rented Book Actions
  rentedBookActions: {
    display: 'flex',
    gap: SPACING.sm,
  },
  rentedReadButton: {
    flex: 1,
    background: 'linear-gradient(to right, #2563EB, #1D4ED8)',
    color: COLORS.white,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    transition: 'all 0.3s',
    fontSize: SIZES.fontSM,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    cursor: 'pointer',
    border: 'none',
  },
  rentedReturnButton: {
    flex: 1,
    background: 'linear-gradient(to right, #DC2626, #B91C1C)',
    color: COLORS.white,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    transition: 'all 0.3s',
    fontSize: SIZES.fontSM,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
  },

  // Info Section in Panel
  panelInfoSection: {
    padding: SPACING.base,
    backgroundColor: 'rgba(252, 211, 77, 0.3)',
    borderTop: '2px solid #FBBF24',
    marginTop: SPACING.base,
  },
  panelInfoTitle: {
    color: '#78350F',
    fontSize: SIZES.fontSM,
    marginBottom: SPACING.sm,
    margin: 0,
  },
  panelInfoList: {
    fontSize: SIZES.fontXS,
    color: '#92400E',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },

  // Success Modal
  successModalCard: {
    background: 'linear-gradient(to bottom right, #FEF3C7, #FDE68A)',
    borderRadius: SIZES.radius2XL,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    padding: 32,
    maxWidth: 384,
    width: '100%',
    border: '4px solid #D97706',
    position: 'relative',
    overflow: 'hidden',
  },
  successIcon: {
    width: 80,
    height: 80,
    background: 'linear-gradient(to bottom right, #D97706, #B45309)',
    borderRadius: '50%',
    margin: '0 auto',
    marginBottom: SPACING.base,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
  },
  successTitle: {
    fontSize: SIZES.font3XL,
    color: '#78350F',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    margin: 0,
  },
  successMessage: {
    color: '#92400E',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  successBookName: {
    display: 'block',
    fontSize: SIZES.fontLG,
    marginBottom: 4,
  },
  successSubtext: {
    fontSize: SIZES.fontSM,
  },
  successDecor1: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  successDecor2: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  successButton: {
    display: 'flex',
    justifyContent: 'center',
  },
  successButtonInner: {
    background: 'linear-gradient(to right, #D97706, #B45309)',
    color: COLORS.white,
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderRadius: SIZES.radiusLG,
    transition: 'all 0.3s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    fontSize: SIZES.fontLG,
    cursor: 'pointer',
    border: 'none',
  },
};

export function LibraryPage({ onBack, onOpenBookView, coins, onCoinsChange }: LibraryPageProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'color'>('name');
  const [showOnlyContent, setShowOnlyContent] = useState(false);
  const [showRentalPanel, setShowRentalPanel] = useState(false);
  const [bookToRent, setBookToRent] = useState<Book | null>(null);
  const [rentalDays, setRentalDays] = useState(7);
  const [rentedBooks, setRentedBooks] = useState<RentedBook[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successBookTitle, setSuccessBookTitle] = useState('');
  
  // Load rented books from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rentedBooks');
    if (saved) {
      const parsed: RentedBook[] = JSON.parse(saved);
      // Filter out expired rentals
      const active = parsed.filter(book => book.rentedUntil > Date.now());
      setRentedBooks(active);
      if (active.length !== parsed.length) {
        localStorage.setItem('rentedBooks', JSON.stringify(active));
      }
    }
  }, []);
  
  // Save rented books to localStorage
  const saveRentedBooks = (books: RentedBook[]) => {
    setRentedBooks(books);
    localStorage.setItem('rentedBooks', JSON.stringify(books));
  };
  
  const handleRentBook = () => {
    if (!bookToRent) return;
    
    const price = calculateRentalPrice(rentalDays);
    
    if (coins < price) {
      toast.error('Nincs elég aranyad a kölcsönzéshez!');
      return;
    }
    
    // Check if book is already rented
    const alreadyRented = rentedBooks.find(b => b.title === bookToRent.title);
    if (alreadyRented) {
      toast.error('Ez a könyv már ki van kölcsönözve!');
      return;
    }
    
    // Deduct coins
    onCoinsChange(coins - price);
    
    // Add to rented books
    const newRental: RentedBook = {
      title: bookToRent.title,
      rentedUntil: Date.now() + (rentalDays * 24 * 60 * 60 * 1000),
      daysRented: rentalDays,
      color: bookToRent.color,
      textColor: bookToRent.textColor,
    };
    
    saveRentedBooks([...rentedBooks, newRental]);
    
    // Close rental panel and show success modal
    setSuccessBookTitle(bookToRent.title);
    setBookToRent(null);
    setShowRentalPanel(false);
    setShowSuccessModal(true);
  };
  
  const handleReturnBook = (bookTitle: string) => {
    const book = rentedBooks.find(b => b.title === bookTitle);
    if (!book) return;
    
    // Calculate refund
    const remainingTime = book.rentedUntil - Date.now();
    const remainingDays = Math.max(0, Math.floor(remainingTime / (24 * 60 * 60 * 1000)));
    
    // Calculate refund: original price minus price for elapsed days
    if (remainingDays > 0) {
      const daysElapsed = book.daysRented - remainingDays;
      const priceForElapsedDays = calculateRentalPrice(daysElapsed);
      const originalPrice = calculateRentalPrice(book.daysRented);
      const refund = originalPrice - priceForElapsedDays;
      onCoinsChange(coins + refund);
      toast.success(`Visszaadva! ${refund} arany visszatérítés`);
    } else {
      toast.success('Könyv visszaadva!');
    }
    
    const updatedBooks = rentedBooks.filter(b => b.title !== bookTitle);
    saveRentedBooks(updatedBooks);
  };
  
  const isBookRented = (bookTitle: string) => {
    return rentedBooks.some(b => b.title === bookTitle);
  };
  
  const getRemainingDays = (rentedUntil: number) => {
    const remaining = rentedUntil - Date.now();
    return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
  };
  
  // Generate book shelves with various financial books
  const shelves: Book[][] = [
    // Shelf 1 - Top shelf
    [
      { title: 'Tőkepiaci Szótár', color: 'bg-gradient-to-r from-amber-700 to-amber-900', width: 60, spineColor: 'border-amber-950', textColor: 'text-amber-100', hasContent: true },
      { title: 'Pénzügyi Alapismeretek', color: 'bg-gradient-to-r from-slate-700 to-slate-900', width: 54, spineColor: 'border-slate-950', textColor: 'text-slate-100', hasContent: true },
      { title: 'Befektetés Alapjai', color: 'bg-gradient-to-r from-blue-700 to-blue-900', width: 55, spineColor: 'border-blue-950', textColor: 'text-blue-100', hasContent: true },
      { title: 'Részvények', color: 'bg-gradient-to-r from-green-700 to-green-900', width: 48, spineColor: 'border-green-950', textColor: 'text-green-100', hasContent: true },
      { title: 'Kötvények', color: 'bg-gradient-to-r from-purple-700 to-purple-900', width: 52, spineColor: 'border-purple-950', textColor: 'text-purple-100', hasContent: true },
      { title: 'Portfolió Kezelés', color: 'bg-gradient-to-r from-red-700 to-red-900', width: 58, spineColor: 'border-red-950', textColor: 'text-red-100', hasContent: true },
    ],
    // Shelf 2
    [
      { title: 'Technikai Elemzés', color: 'bg-gradient-to-r from-indigo-700 to-indigo-900', width: 62, spineColor: 'border-indigo-950', textColor: 'text-indigo-100', hasContent: true },
      { title: 'Fundamentális Elemzés', color: 'bg-gradient-to-r from-teal-700 to-teal-900', width: 65, spineColor: 'border-teal-950', textColor: 'text-teal-100', hasContent: true },
      { title: 'Pénzügyi Matematika', color: 'bg-gradient-to-r from-orange-700 to-orange-900', width: 56, spineColor: 'border-orange-950', textColor: 'text-orange-100', hasContent: true },
      { title: 'Opciók', color: 'bg-gradient-to-r from-pink-700 to-pink-900', width: 44, spineColor: 'border-pink-950', textColor: 'text-pink-100', hasContent: true },
      { title: 'Határidős Ügyletek', color: 'bg-gradient-to-r from-cyan-700 to-cyan-900', width: 54, spineColor: 'border-cyan-950', textColor: 'text-cyan-100', hasContent: true },
    ],
    // Shelf 3
    [
      { title: 'Devizapiac', color: 'bg-gradient-to-r from-emerald-700 to-emerald-900', width: 50, spineColor: 'border-emerald-950', textColor: 'text-emerald-100' },
      { title: 'Kockázatkezelés', color: 'bg-gradient-to-r from-rose-700 to-rose-900', width: 58, spineColor: 'border-rose-950', textColor: 'text-rose-100', hasContent: true },
      { title: 'Vállalati Pénzügyek', color: 'bg-gradient-to-r from-violet-700 to-violet-900', width: 60, spineColor: 'border-violet-950', textColor: 'text-violet-100' },
      { title: 'Értékpapírok', color: 'bg-gradient-to-r from-lime-700 to-lime-900', width: 52, spineColor: 'border-lime-950', textColor: 'text-lime-100' },
      { title: 'Befektetési Alapok', color: 'bg-gradient-to-r from-fuchsia-700 to-fuchsia-900', width: 56, spineColor: 'border-fuchsia-950', textColor: 'text-fuchsia-100' },
    ],
    // Shelf 4
    [
      { title: 'ETF-ek', color: 'bg-gradient-to-r from-sky-700 to-sky-900', width: 42, spineColor: 'border-sky-950', textColor: 'text-sky-100' },
      { title: 'Makrogazdaság', color: 'bg-gradient-to-r from-amber-600 to-amber-800', width: 55, spineColor: 'border-amber-900', textColor: 'text-amber-100', hasContent: true },
      { title: 'Day Trading', color: 'bg-gradient-to-r from-blue-600 to-blue-800', width: 54, spineColor: 'border-blue-900', textColor: 'text-blue-100' },
      { title: 'Napi Kereskedés', color: 'bg-gradient-to-r from-green-600 to-green-800', width: 52, spineColor: 'border-green-900', textColor: 'text-green-100' },
      { title: 'Passzív Befektetés', color: 'bg-gradient-to-r from-purple-600 to-purple-800', width: 58, spineColor: 'border-purple-900', textColor: 'text-purple-100' },
    ],
    // Shelf 5
    [
      { title: 'Pénzügyi Szabályozás', color: 'bg-gradient-to-r from-red-600 to-red-800', width: 62, spineColor: 'border-red-900', textColor: 'text-red-100' },
      { title: 'Kripto és Blockchain', color: 'bg-gradient-to-r from-indigo-600 to-indigo-800', width: 57, spineColor: 'border-indigo-900', textColor: 'text-indigo-100', hasContent: true },
      { title: 'Pszichológia és Trading', color: 'bg-gradient-to-r from-teal-600 to-teal-800', width: 56, spineColor: 'border-teal-900', textColor: 'text-teal-100', hasContent: true },
      { title: 'Ingatlan Befektetés', color: 'bg-gradient-to-r from-orange-600 to-orange-800', width: 58, spineColor: 'border-orange-900', textColor: 'text-orange-100', hasContent: true },
      { title: 'Kereskedési Stratégiák', color: 'bg-gradient-to-r from-pink-600 to-pink-800', width: 60, spineColor: 'border-pink-900', textColor: 'text-pink-100' },
    ],
    // Shelf 6
    [
      { title: 'Árfolyam Grafikonok', color: 'bg-gradient-to-r from-cyan-600 to-cyan-800', width: 55, spineColor: 'border-cyan-900', textColor: 'text-cyan-100' },
      { title: 'Piaci Mutatók', color: 'bg-gradient-to-r from-emerald-600 to-emerald-800', width: 50, spineColor: 'border-emerald-900', textColor: 'text-emerald-100' },
      { title: 'Diverzifikáció', color: 'bg-gradient-to-r from-rose-600 to-rose-800', width: 54, spineColor: 'border-rose-900', textColor: 'text-rose-100' },
      { title: 'Eszköz Allokáció', color: 'bg-gradient-to-r from-violet-600 to-violet-800', width: 56, spineColor: 'border-violet-900', textColor: 'text-violet-100' },
      { title: 'Hosszú Távú Befektetés', color: 'bg-gradient-to-r from-lime-600 to-lime-800', width: 62, spineColor: 'border-lime-900', textColor: 'text-lime-100' },
    ],
  ];

  return (
    <div style={styles.container}>
      {/* Warm wood cabinet background */}
      <div style={styles.backgroundOverlay} />
      
      {/* Wood grain texture overlay */}
      <div style={styles.woodGrainTexture} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerRow}>
          <div style={styles.headerLeft}>
            <button
              onClick={onBack}
              style={styles.backButton}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <ArrowLeft style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#FEF3C7' }} />
            </button>
            <div style={styles.headerTitleContainer}>
              <BookOpen style={{ width: 32, height: 32, color: '#FCD34D' }} />
              <h1 style={styles.headerTitle}>Könyvtár</h1>
            </div>
          </div>

          <div style={styles.headerRight}>
            {/* Rental Panel Toggle */}
            <button
              onClick={() => setShowRentalPanel(!showRentalPanel)}
              style={styles.rentalButton}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <BookMarked style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#FEF3C7' }} />
              {rentedBooks.length > 0 && (
                <div style={styles.rentalBadge}>
                  <span style={styles.rentalBadgeText}>{rentedBooks.length}</span>
                </div>
              )}
            </button>

            {/* Dropdown Menu - NAVIGATION NOTE: Shadcn DropdownMenu */}
            {/* For React Native, use react-native-paper Menu or @react-navigation/drawer */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 bg-amber-700/80 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center border-2 border-amber-900/50 transition-transform hover:scale-105 active:scale-95">
                  <Filter style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#FEF3C7' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-amber-50 border-2 border-amber-900/30 shadow-xl" align="end">
                <DropdownMenuLabel className="text-amber-900">Könyvtár Beállítások</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-amber-200" />
                
                <DropdownMenuLabel className="text-xs text-amber-700">Rendezés</DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => setSortBy('name')}
                  className="cursor-pointer hover:bg-amber-100 focus:bg-amber-100"
                >
                  <SortAsc className="w-4 h-4 mr-2 text-amber-700" />
                  <span className="text-amber-900">Név szerint (A-Z)</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('color')}
                  className="cursor-pointer hover:bg-amber-100 focus:bg-amber-100"
                >
                  <Grid3x3 className="w-4 h-4 mr-2 text-amber-700" />
                  <span className="text-amber-900">Szín szerint</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-amber-200" />
                
                <DropdownMenuLabel className="text-xs text-amber-700">Szűrés</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={showOnlyContent}
                  onCheckedChange={setShowOnlyContent}
                  className="cursor-pointer hover:bg-amber-100 focus:bg-amber-100"
                >
                  <span className="text-amber-900">Csak olvasható könyvek</span>
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuSeparator className="bg-amber-200" />
                
                <DropdownMenuItem className="cursor-pointer hover:bg-amber-100 focus:bg-amber-100">
                  <Search className="w-4 h-4 mr-2 text-amber-700" />
                  <span className="text-amber-900">Keresés...</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-amber-100 focus:bg-amber-100">
                  <List className="w-4 h-4 mr-2 text-amber-700" />
                  <span className="text-amber-900">Kategóriák</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Bookshelf Container */}
      <div style={styles.bookshelfContainer} className="scrollbar-hide">
        <div style={styles.bookshelfInner}>
          {shelves.map((shelf, shelfIndex) => (
            <div key={shelfIndex} style={styles.shelfContainer}>
              {/* Shelf backing */}
              <div style={styles.shelfBacking} />
              <div style={styles.shelfEdge} />
              
              {/* Books on shelf */}
              <div style={styles.booksRow}>
                {shelf.map((book, bookIndex) => {
                  const isRented = isBookRented(book.title);
                  const randomHeight = 140 + Math.random() * 40;
                  
                  return (
                    <button
                      key={bookIndex}
                      onClick={() => {
                        setSelectedBook(book);
                        if (book.hasContent && isRented) {
                          onOpenBookView(book.title);
                        }
                      }}
                      style={styles.bookButton(book.width)}
                      className="group"
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      {/* Rented indicator */}
                      {isRented && (
                        <div style={styles.rentedIndicator}>
                          <div style={styles.rentedBadge}>
                            <BookMarked style={{ width: 12, height: 12, flexShrink: 0 }} />
                            <span style={styles.rentedBadgeText}>Kikölcsönözve</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Book spine */}
                      <div
                        className={book.color}
                        style={styles.bookSpine(book.color, book.spineColor, randomHeight, isRented)}
                      >
                        {/* Book title on spine */}
                        <div style={styles.bookTitleContainer}>
                          <div
                            className={book.textColor}
                            style={styles.bookTitle(book.textColor)}
                          >
                            {book.title}
                          </div>
                        </div>

                        {/* Book details/texture */}
                        <div style={styles.bookTexture} />
                        <div style={styles.bookShadow} />
                      </div>

                      {/* Book bottom edge */}
                      <div className={book.color} style={styles.bookBottomEdge(book.color, book.spineColor)} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Decorative elements */}
        <div style={styles.decorBox1} />
        <div style={styles.decorBox2} />
      </div>

      {/* Book Details Modal */}
      {/* NAVIGATION NOTE: AnimatePresence + motion work in React web */}
      {/* For React Native, use react-native-reanimated or Animated API */}
      {selectedBook && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedBook(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={styles.bookDetailsCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={selectedBook.color} style={styles.bookDetailsHeader(selectedBook.color)}>
              <BookOpen className={`w-12 h-12 ${selectedBook.textColor} mb-2`} />
              <h2 className={`text-2xl ${selectedBook.textColor}`}>{selectedBook.title}</h2>
            </div>
            
            <p style={styles.bookDetailsText}>
              {isBookRented(selectedBook.title) 
                ? 'Ez a könyv jelenleg ki van kölcsönözve. Nyomd meg az "Olvasás" gombot a megtekintéshez.'
                : selectedBook.hasContent 
                  ? 'Ez egy pénzügyi és tőkepiaci oktatási könyv. Kölcsönözd ki, hogy hozzáférj a tartalmához!'
                  : 'Ez a könyv hamarosan elérhető lesz!'}
            </p>
            
            <div style={styles.bookDetailsActions}>
              {selectedBook.hasContent && !isBookRented(selectedBook.title) && (
                <button
                  onClick={() => {
                    setBookToRent(selectedBook);
                    setSelectedBook(null);
                  }}
                  style={styles.bookDetailsButton('linear-gradient(to right, #059669, #047857)')}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #047857, #065F46)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #059669, #047857)'}
                >
                  <Coins style={{ width: SIZES.iconBase, height: SIZES.iconBase }} />
                  Kölcsönzés
                </button>
              )}
              
              {selectedBook.hasContent && isBookRented(selectedBook.title) && (
                <button
                  onClick={() => {
                    setSelectedBook(null);
                    onOpenBookView(selectedBook.title);
                  }}
                  style={styles.bookDetailsButton('linear-gradient(to right, #2563EB, #1D4ED8)')}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1D4ED8, #1E40AF)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #2563EB, #1D4ED8)'}
                >
                  <BookOpen style={{ width: SIZES.iconBase, height: SIZES.iconBase }} />
                  Olvasás
                </button>
              )}
              
              <button
                onClick={() => setSelectedBook(null)}
                style={styles.closeButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#92400E'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B45309'}
              >
                Bezárás
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rental Selection Modal */}
      <AnimatePresence>
        {bookToRent && (
          <div
            style={styles.modalOverlay}
            onClick={() => setBookToRent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={styles.rentalCard}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.rentalHeader}>
                <h2 style={styles.rentalTitle}>Könyv Kölcsönzése</h2>
                <button
                  onClick={() => setBookToRent(null)}
                  style={styles.rentalCloseButton}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#92400E'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B45309'}
                >
                  <X style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#FEF3C7' }} />
                </button>
              </div>

              <div className={bookToRent.color} style={styles.bookDetailsHeader(bookToRent.color)}>
                <h3 className={`text-lg ${bookToRent.textColor}`}>{bookToRent.title}</h3>
              </div>

              {/* Days Selector */}
              <div style={styles.daysSection}>
                <label style={styles.daysLabel}>
                  <Calendar style={{ width: SIZES.iconSM, height: SIZES.iconSM, display: 'inline', marginRight: 4 }} />
                  Kölcsönzési időszak
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(parseInt(e.target.value))}
                  style={styles.daysSlider}
                />
                <div style={styles.daysRange}>
                  <span>1 nap</span>
                  <span style={styles.daysCurrent}>{rentalDays} nap</span>
                  <span>30 nap</span>
                </div>
              </div>

              {/* Price Display */}
              <div style={styles.priceBox}>
                <div style={styles.priceRow}>
                  <div style={styles.priceLabel}>
                    <Coins style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: '#78350F' }} />
                    <span style={styles.priceLabelText}>Ár:</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={styles.priceValue}>{calculateRentalPrice(rentalDays)}</div>
                    <div style={styles.pricePerDay}>
                      (~{Math.round(calculateRentalPrice(rentalDays) / rentalDays)} arany/nap)
                    </div>
                  </div>
                </div>
              </div>

              {/* User's coins */}
              <div style={styles.balanceBox}>
                <span style={styles.balanceLabel}>Egyenleged:</span>
                <div style={styles.balanceValue}>
                  <Coins style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#92400E' }} />
                  <span style={styles.balanceValueText}>{coins}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.actionButtons}>
                <button
                  onClick={handleRentBook}
                  disabled={coins < calculateRentalPrice(rentalDays)}
                  style={styles.rentButton(coins < calculateRentalPrice(rentalDays))}
                  onMouseEnter={(e) => {
                    if (coins >= calculateRentalPrice(rentalDays)) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #047857, #065F46)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (coins >= calculateRentalPrice(rentalDays)) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #059669, #047857)';
                    }
                  }}
                >
                  <Coins style={{ width: SIZES.iconBase, height: SIZES.iconBase }} />
                  Kölcsönzés - {calculateRentalPrice(rentalDays)} arany
                </button>
                <button
                  onClick={() => setBookToRent(null)}
                  style={styles.cancelButton}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#92400E'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B45309'}
                >
                  Mégse
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rental Panel */}
      <AnimatePresence>
        {showRentalPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={styles.rentalPanelBackdrop}
              onClick={() => setShowRentalPanel(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={styles.rentalPanel}
            >
              {/* Panel Header */}
              <div style={styles.panelHeader}>
                <div style={styles.panelHeaderContent}>
                  <div style={styles.panelHeaderLeft}>
                    <BookMarked style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: '#FEF3C7' }} />
                    <h2 style={styles.panelHeaderTitle}>Kölcsönzött Könyvek</h2>
                  </div>
                  <button
                    onClick={() => setShowRentalPanel(false)}
                    style={styles.panelCloseButton}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#57534E'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#78350F'}
                  >
                    <X style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#FEF3C7' }} />
                  </button>
                </div>
              </div>

              {/* Rented Books List */}
              <div style={styles.rentedBooksList}>
                {rentedBooks.length === 0 ? (
                  <div style={styles.emptyRentalState}>
                    <BookOpen style={styles.emptyRentalIcon} />
                    <p style={styles.emptyRentalText}>Még nincs kikölcsönzött könyved</p>
                    <p style={styles.emptyRentalSubtext}>Kölcsönözz ki egy könyvet a polcokról!</p>
                  </div>
                ) : (
                  rentedBooks.map((book, index) => {
                    const remainingDays = getRemainingDays(book.rentedUntil);
                    const isExpiringSoon = remainingDays <= 3;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={styles.rentedBookCard}
                      >
                        <div className={book.color} style={styles.bookDetailsHeader(book.color)}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
                            <BookOpen className={`w-5 h-5 ${book.textColor}`} />
                            <h3 className={`${book.textColor} text-sm`}>{book.title}</h3>
                          </div>
                        </div>

                        <div style={styles.rentedBookInfo}>
                          <div style={styles.rentedBookInfoRow(isExpiringSoon)}>
                            <span style={styles.rentedBookLabel(isExpiringSoon)}>
                              <Calendar style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                              Kölcsönözve:
                            </span>
                            <span style={styles.rentedBookValue(isExpiringSoon)}>{book.daysRented} napra</span>
                          </div>
                          
                          <div style={styles.rentedBookInfoRow(isExpiringSoon)}>
                            <span style={styles.rentedBookLabel(isExpiringSoon)}>
                              <Clock style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                              Hátralévő idő:
                            </span>
                            <span style={styles.rentedBookValue(isExpiringSoon)}>
                              {remainingDays} nap
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div style={styles.rentedProgressBar}>
                            <div
                              style={styles.rentedProgressFill((remainingDays / book.daysRented) * 100, isExpiringSoon)}
                            />
                          </div>
                        </div>

                        <div style={styles.rentedBookActions}>
                          <button
                            onClick={() => {
                              setShowRentalPanel(false);
                              onOpenBookView(book.title);
                            }}
                            style={styles.rentedReadButton}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1D4ED8, #1E40AF)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #2563EB, #1D4ED8)'}
                          >
                            <BookOpen style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
                            Olvasás
                          </button>
                          <button
                            onClick={() => handleReturnBook(book.title)}
                            style={styles.rentedReturnButton}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #B91C1C, #991B1B)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #DC2626, #B91C1C)'}
                          >
                            Visszaadás
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Info Section */}
              <div style={styles.panelInfoSection}>
                <h3 style={styles.panelInfoTitle}>ℹ️ Tudnivalók</h3>
                <ul style={styles.panelInfoList}>
                  <li>• Min. 1 nap, max. 30 nap kölcsönzés</li>
                  <li>• 1 nap = 50 arany</li>
                  <li>• 30 nap = 1000 arany (kedvezmény!)</li>
                  <li>• Hosszabb időszak = jobb ár/nap arány</li>
                  <li>• Korai visszaadásnál időarányos visszatérítés</li>
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Celebration Modal */}
      {showSuccessModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            style={styles.successModalCard}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <div style={styles.successIcon}>
              <BookMarked style={{ width: 40, height: 40, color: COLORS.white }} />
            </div>

            {/* Success Message */}
            <h2 style={styles.successTitle}>
              Sikeres kölcsönzés! 🎉
            </h2>

            <p style={styles.successMessage}>
              <span style={styles.successBookName}>{successBookTitle}</span>
              <span style={styles.successSubtext}>Most már hozzáférhetsz a könyv tartalmához!</span>
            </p>

            {/* Decorative elements */}
            <div style={styles.successDecor1}>
              <BookOpen style={{ width: 32, height: 32, color: 'rgba(217, 119, 6, 0.3)' }} />
            </div>
            <div style={styles.successDecor2}>
              <Coins style={{ width: 32, height: 32, color: 'rgba(217, 119, 6, 0.3)' }} />
            </div>

            {/* Continue Button */}
            <div style={styles.successButton}>
              <button
                onClick={() => setShowSuccessModal(false)}
                style={styles.successButtonInner}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = 'linear-gradient(to right, #B45309, #92400E)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'linear-gradient(to right, #D97706, #B45309)';
                }}
              >
                Rendben
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
