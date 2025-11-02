/**
 * ============================================
 * LIBRARYSCREEN - REACT NATIVE VERSION
 * ============================================
 *
 * Library bookshelf screen with:
 * - 6 wooden bookshelves with ~30 books
 * - Book selection modal
 * - Rental modal (days selector + price calculator)
 * - Rental panel (sidebar with rented books)
 * - Success modal (rental confirmation)
 * - Book return functionality (with refund)
 *
 * NAVIGATION:
 * - Back button → navigation.goBack()
 * - Read book → navigation.navigate('BookView', { bookTitle })
 *
 * DEPENDENCIES:
 * npm install expo-linear-gradient
 * npm install lucide-react-native
 * npm install @react-native-async-storage/async-storage
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArrowLeft,
  BookOpen,
  Filter,
  BookMarked,
  Clock,
  Coins,
  Calendar,
  X,
} from 'lucide-react-native';
import { useCoins } from '../contexts/CoinsContext';

// ============================================
// TYPES
// ============================================

interface LibraryScreenProps {
  navigation: any;
  route?: any;
}

interface Book {
  title: string;
  colors: string[]; // Gradient colors
  width: number;
  borderColor: string;
  textColor: string;
  hasContent?: boolean;
}

interface RentedBook {
  title: string;
  rentedUntil: number; // timestamp
  daysRented: number;
  colors: string[];
  textColor: string;
}

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  brown: {
    50: '#FEF3C7',
    100: '#FDE68A',
    200: '#FCD34D',
    300: '#FBBF24',
    400: '#F59E0B',
    500: '#D97706',
    600: '#B45309',
    700: '#92400E',
    800: '#78350F',
    900: '#57534E',
  },
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

const SIZES = {
  fontXS: 10,
  fontSM: 12,
  fontBase: 14,
  fontLG: 16,
  fontXL: 18,
  font2XL: 24,
  font3XL: 30,
  iconSM: 14,
  iconBase: 20,
  iconLG: 24,
  radiusSM: 4,
  radiusLG: 12,
  radiusXL: 16,
  radius2XL: 20,
  radiusFull: 9999,
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// HELPER FUNCTIONS
// ============================================

// Calculate rental price based on days
const calculateRentalPrice = (days: number): number => {
  if (days === 1) return 50;
  if (days === 30) return 1000;

  // Progressive discount
  const basePrice = 50;
  const maxDiscount = 0.33;
  const discountFactor = (days - 1) / 29;
  const pricePerDay = basePrice * (1 - (maxDiscount * discountFactor));

  return Math.round(pricePerDay * days);
};

// ============================================
// BOOK DATA
// ============================================

const SHELVES: Book[][] = [
  // Shelf 1
  [
    { title: 'Tőkepiaci Szótár', colors: ['#B45309', '#78350F'], width: 60, borderColor: '#57534E', textColor: '#FEF3C7', hasContent: true },
    { title: 'Pénzügyi Alapismeretek', colors: ['#475569', '#1E293B'], width: 54, borderColor: '#0F172A', textColor: '#F1F5F9', hasContent: true },
    { title: 'Befektetés Alapjai', colors: ['#1D4ED8', '#1E3A8A'], width: 55, borderColor: '#1E3A8A', textColor: '#DBEAFE', hasContent: true },
    { title: 'Részvények', colors: ['#15803D', '#14532D'], width: 48, borderColor: '#052E16', textColor: '#DCFCE7', hasContent: true },
    { title: 'Kötvények', colors: ['#7C3AED', '#5B21B6'], width: 52, borderColor: '#4C1D95', textColor: '#F3E8FF', hasContent: true },
    { title: 'Portfolió Kezelés', colors: ['#DC2626', '#991B1B'], width: 58, borderColor: '#7F1D1D', textColor: '#FEE2E2', hasContent: true },
  ],
  // Shelf 2
  [
    { title: 'Technikai Elemzés', colors: ['#4F46E5', '#3730A3'], width: 62, borderColor: '#312E81', textColor: '#E0E7FF', hasContent: true },
    { title: 'Fundamentális Elemzés', colors: ['#0F766E', '#134E4A'], width: 65, borderColor: '#134E4A', textColor: '#CCFBF1', hasContent: true },
    { title: 'Pénzügyi Matematika', colors: ['#EA580C', '#C2410C'], width: 56, borderColor: '#9A3412', textColor: '#FFEDD5', hasContent: true },
    { title: 'Opciók', colors: ['#DB2777', '#9F1239'], width: 44, borderColor: '#831843', textColor: '#FCE7F3', hasContent: true },
    { title: 'Határidős Ügyletek', colors: ['#0891B2', '#155E75'], width: 54, borderColor: '#164E63', textColor: '#CFFAFE', hasContent: true },
  ],
  // Shelf 3
  [
    { title: 'Devizapiac', colors: ['#059669', '#047857'], width: 50, borderColor: '#065F46', textColor: '#D1FAE5' },
    { title: 'Kockázatkezelés', colors: ['#E11D48', '#BE123C'], width: 58, borderColor: '#9F1239', textColor: '#FFE4E6', hasContent: true },
    { title: 'Vállalati Pénzügyek', colors: ['#7C3AED', '#6D28D9'], width: 60, borderColor: '#5B21B6', textColor: '#EDE9FE' },
    { title: 'Értékpapírok', colors: ['#84CC16', '#65A30D'], width: 52, borderColor: '#4D7C0F', textColor: '#ECFCCB' },
    { title: 'Befektetési Alapok', colors: ['#C026D3', '#A21CAF'], width: 56, borderColor: '#86198F', textColor: '#FAE8FF' },
  ],
  // Shelf 4
  [
    { title: 'ETF-ek', colors: ['#0284C7', '#0369A1'], width: 42, borderColor: '#075985', textColor: '#E0F2FE' },
    { title: 'Makrogazdaság', colors: ['#D97706', '#B45309'], width: 55, borderColor: '#92400E', textColor: '#FEF3C7', hasContent: true },
    { title: 'Day Trading', colors: ['#2563EB', '#1D4ED8'], width: 54, borderColor: '#1E40AF', textColor: '#DBEAFE' },
    { title: 'Napi Kereskedés', colors: ['#16A34A', '#15803D'], width: 52, borderColor: '#166534', textColor: '#DCFCE7' },
    { title: 'Passzív Befektetés', colors: ['#9333EA', '#7C3AED'], width: 58, borderColor: '#6D28D9', textColor: '#F3E8FF' },
  ],
  // Shelf 5
  [
    { title: 'Pénzügyi Szabályozás', colors: ['#DC2626', '#B91C1C'], width: 62, borderColor: '#991B1B', textColor: '#FEE2E2' },
    { title: 'Kripto és Blockchain', colors: ['#4F46E5', '#4338CA'], width: 57, borderColor: '#3730A3', textColor: '#E0E7FF', hasContent: true },
    { title: 'Pszichológia és Trading', colors: ['#0D9488', '#0F766E'], width: 56, borderColor: '#115E59', textColor: '#CCFBF1', hasContent: true },
    { title: 'Ingatlan Befektetés', colors: ['#EA580C', '#C2410C'], width: 58, borderColor: '#9A3412', textColor: '#FFEDD5', hasContent: true },
    { title: 'Kereskedési Stratégiák', colors: ['#DB2777', '#BE123C'], width: 60, borderColor: '#9F1239', textColor: '#FCE7F3' },
  ],
  // Shelf 6
  [
    { title: 'Árfolyam Grafikonok', colors: ['#0891B2', '#0E7490'], width: 55, borderColor: '#155E75', textColor: '#CFFAFE' },
    { title: 'Piaci Mutatók', colors: ['#059669', '#047857'], width: 50, borderColor: '#065F46', textColor: '#D1FAE5' },
    { title: 'Diverzifikáció', colors: ['#E11D48', '#BE123C'], width: 54, borderColor: '#9F1239', textColor: '#FFE4E6' },
    { title: 'Eszköz Allokáció', colors: ['#7C3AED', '#6D28D9'], width: 56, borderColor: '#5B21B6', textColor: '#EDE9FE' },
    { title: 'Hosszú Távú Befektetés', colors: ['#84CC16', '#65A30D'], width: 62, borderColor: '#4D7C0F', textColor: '#ECFCCB' },
  ],
];

// ============================================
// COMPONENT
// ============================================

export default function LibraryScreen({ navigation }: LibraryScreenProps) {
  // ============================================
  // GLOBAL STATE (CoinsContext)
  // ============================================

  const { coins, setCoins } = useCoins();

  // ============================================
  // LOCAL STATE
  // ============================================

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showRentalPanel, setShowRentalPanel] = useState(false);
  const [bookToRent, setBookToRent] = useState<Book | null>(null);
  const [rentalDays, setRentalDays] = useState(7);
  const [rentedBooks, setRentedBooks] = useState<RentedBook[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successBookTitle, setSuccessBookTitle] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // ============================================
  // ANIMATIONS
  // ============================================

  const rentalPanelAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  // ============================================
  // EFFECTS
  // ============================================

  // Load rented books from AsyncStorage
  useEffect(() => {
    loadRentedBooks();
  }, []);

  // Rental panel animation
  useEffect(() => {
    Animated.spring(rentalPanelAnim, {
      toValue: showRentalPanel ? 0 : SCREEN_WIDTH,
      friction: 10,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [showRentalPanel]);

  // ============================================
  // ASYNCSTORAGE FUNCTIONS
  // ============================================

  const loadRentedBooks = async () => {
    try {
      const saved = await AsyncStorage.getItem('rentedBooks');
      if (saved) {
        const parsed: RentedBook[] = JSON.parse(saved);
        // Filter out expired rentals
        const active = parsed.filter(book => book.rentedUntil > Date.now());
        setRentedBooks(active);
        if (active.length !== parsed.length) {
          await AsyncStorage.setItem('rentedBooks', JSON.stringify(active));
        }
      }
    } catch (error) {
      console.error('Failed to load rented books:', error);
    }
  };

  const saveRentedBooks = async (books: RentedBook[]) => {
    try {
      setRentedBooks(books);
      await AsyncStorage.setItem('rentedBooks', JSON.stringify(books));
    } catch (error) {
      console.error('Failed to save rented books:', error);
    }
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleRentBook = () => {
    if (!bookToRent) return;

    const price = calculateRentalPrice(rentalDays);

    if (coins < price) {
      // TOAST: Nincs elég aranyad!
      console.log('ERROR: Nincs elég aranyad a kölcsönzéshez!');
      return;
    }

    // Check if book is already rented
    const alreadyRented = rentedBooks.find(b => b.title === bookToRent.title);
    if (alreadyRented) {
      // TOAST: Ez a könyv már ki van kölcsönözve!
      console.log('ERROR: Ez a könyv már ki van kölcsönözve!');
      return;
    }

    // Deduct coins
    setCoins(coins - price);

    // Add to rented books
    const newRental: RentedBook = {
      title: bookToRent.title,
      rentedUntil: Date.now() + (rentalDays * 24 * 60 * 60 * 1000),
      daysRented: rentalDays,
      colors: bookToRent.colors,
      textColor: bookToRent.textColor,
    };

    saveRentedBooks([...rentedBooks, newRental]);

    // Close rental modal and show success modal
    setSuccessBookTitle(bookToRent.title);
    setBookToRent(null);
    setShowSuccessModal(true);
  };

  const handleReturnBook = (bookTitle: string) => {
    const book = rentedBooks.find(b => b.title === bookTitle);
    if (!book) return;

    // Calculate refund
    const remainingTime = book.rentedUntil - Date.now();
    const remainingDays = Math.max(0, Math.floor(remainingTime / (24 * 60 * 60 * 1000)));

    if (remainingDays > 0) {
      const daysElapsed = book.daysRented - remainingDays;
      const priceForElapsedDays = calculateRentalPrice(daysElapsed);
      const originalPrice = calculateRentalPrice(book.daysRented);
      const refund = originalPrice - priceForElapsedDays;
      setCoins(coins + refund);
      // TOAST: Visszaadva! {refund} arany visszatérítés
      console.log(`SUCCESS: Visszaadva! ${refund} arany visszatérítés`);
    } else {
      // TOAST: Könyv visszaadva!
      console.log('SUCCESS: Könyv visszaadva!');
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

  const handleOpenBookView = (bookTitle: string) => {
    navigation.navigate('BookView', { bookTitle });
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderBook = (book: Book, shelfIndex: number, bookIndex: number) => {
    const isRented = isBookRented(book.title);
    const randomHeight = 140 + Math.random() * 40;

    return (
      <TouchableOpacity
        key={`${shelfIndex}-${bookIndex}`}
        onPress={() => setSelectedBook(book)}
        activeOpacity={0.8}
        style={{ width: book.width, marginHorizontal: 2 }}
      >
        {/* Rented indicator */}
        {isRented && (
          <View style={styles.rentedIndicator}>
            <View style={styles.rentedBadge}>
              <BookMarked size={10} color={COLORS.white} strokeWidth={2.5} />
              <Text style={styles.rentedBadgeText}>Kikölcsönözve</Text>
            </View>
          </View>
        )}

        {/* Book spine */}
        <LinearGradient
          colors={book.colors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.bookSpine,
            {
              height: randomHeight,
              borderLeftColor: book.borderColor,
              borderRightColor: book.borderColor,
              opacity: isRented ? 0.6 : 1,
            },
          ]}
        >
          {/* Book title (vertical - spine text) */}
          <View style={styles.bookTitleContainer}>
            <Text
              style={[
                styles.bookTitle,
                { color: book.textColor },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {book.title}
            </Text>
          </View>

          {/* Book texture */}
          <View style={styles.bookTexture} />
          <View style={styles.bookShadow} />
        </LinearGradient>

        {/* Book bottom edge */}
        <LinearGradient
          colors={[book.colors[0], book.colors[1]] as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.bookBottomEdge,
            {
              borderLeftColor: book.borderColor,
              borderRightColor: book.borderColor,
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#78350F', '#1C1917', '#78350F']}
        style={styles.backgroundGradient}
      />

      {/* Background overlay */}
      <LinearGradient
        colors={['rgba(120, 53, 15, 0.8)', 'rgba(41, 37, 36, 0.9)', 'rgba(120, 53, 15, 0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundOverlay}
      />

      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {/* Left side: Back button + Title */}
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
              <ArrowLeft size={SIZES.iconBase} color="#FEF3C7" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <BookOpen size={32} color="#FCD34D" />
              <Text style={styles.headerTitle}>Könyvtár</Text>
            </View>
          </View>

          {/* Right side: Rental panel toggle + Filter menu */}
          <View style={styles.headerRight}>
            {/* Rental Panel Toggle */}
            <TouchableOpacity
              onPress={() => setShowRentalPanel(!showRentalPanel)}
              activeOpacity={0.7}
              style={styles.rentalButton}
            >
              <BookMarked size={SIZES.iconBase} color="#FEF3C7" />
              {rentedBooks.length > 0 && (
                <View style={styles.rentalBadge}>
                  <Text style={styles.rentalBadgeText}>{rentedBooks.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Filter Menu Toggle */}
            <TouchableOpacity
              onPress={() => setShowFilterMenu(true)}
              activeOpacity={0.7}
              style={styles.filterButton}
            >
              <Filter size={SIZES.iconBase} color="#FEF3C7" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ============================================ */}
      {/* BOOKSHELF CONTAINER */}
      {/* ============================================ */}
      <ScrollView
        style={styles.bookshelfContainer}
        contentContainerStyle={styles.bookshelfInner}
        showsVerticalScrollIndicator={false}
      >
        {SHELVES.map((shelf, shelfIndex) => (
          <View key={shelfIndex} style={styles.shelfContainer}>
            {/* Shelf backing */}
            <LinearGradient
              colors={['#92400E', '#78350F']}
              style={styles.shelfBacking}
            />
            <View style={styles.shelfEdge} />

            {/* Books on shelf */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.booksRow}
            >
              {shelf.map((book, bookIndex) => renderBook(book, shelfIndex, bookIndex))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      {/* ============================================ */}
      {/* BOOK DETAILS MODAL */}
      {/* ============================================ */}
      {selectedBook && (
        <Modal transparent visible animationType="fade" onRequestClose={() => setSelectedBook(null)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedBook(null)}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <LinearGradient
                colors={['#FEF3C7', '#FDE68A']}
                style={styles.bookDetailsCard}
              >
                <LinearGradient
                  colors={selectedBook.colors as [string, string]}
                  style={styles.bookDetailsHeader}
                >
                  <BookOpen size={48} color={selectedBook.textColor} />
                  <Text style={[styles.bookDetailsHeaderTitle, { color: selectedBook.textColor }]}>
                    {selectedBook.title}
                  </Text>
                </LinearGradient>

                <Text style={styles.bookDetailsText}>
                  {isBookRented(selectedBook.title)
                    ? 'Ez a könyv jelenleg ki van kölcsönözve. Nyomd meg az "Olvasás" gombot a megtekintéshez.'
                    : selectedBook.hasContent
                    ? 'Ez egy pénzügyi és tőkepiaci oktatási könyv. Kölcsönözd ki, hogy hozzáférj a tartalmához!'
                    : 'Ez a könyv hamarosan elérhető lesz!'}
                </Text>

                <View style={styles.bookDetailsActions}>
                  {/* Rent button */}
                  {selectedBook.hasContent && !isBookRented(selectedBook.title) && (
                    <TouchableOpacity
                      onPress={() => {
                        setBookToRent(selectedBook);
                        setSelectedBook(null);
                      }}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#059669', '#047857']}
                        style={styles.bookDetailsButton}
                      >
                        <Coins size={SIZES.iconBase} color={COLORS.white} />
                        <Text style={styles.bookDetailsButtonText}>Kölcsönzés</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  {/* Read button */}
                  {selectedBook.hasContent && isBookRented(selectedBook.title) && (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedBook(null);
                        handleOpenBookView(selectedBook.title);
                      }}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#2563EB', '#1D4ED8']}
                        style={styles.bookDetailsButton}
                      >
                        <BookOpen size={SIZES.iconBase} color={COLORS.white} />
                        <Text style={styles.bookDetailsButtonText}>Olvasás</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  {/* Close button */}
                  <TouchableOpacity
                    onPress={() => setSelectedBook(null)}
                    style={styles.closeButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.closeButtonText}>Bezárás</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {/* ============================================ */}
      {/* RENTAL MODAL (Days selector + Price) */}
      {/* ============================================ */}
      {bookToRent && (
        <Modal transparent visible animationType="fade" onRequestClose={() => setBookToRent(null)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setBookToRent(null)}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <LinearGradient
                colors={['#FEF3C7', '#FDE68A']}
                style={styles.rentalCard}
              >
                {/* Header */}
                <View style={styles.rentalHeader}>
                  <Text style={styles.rentalTitle}>Könyv Kölcsönzése</Text>
                  <TouchableOpacity onPress={() => setBookToRent(null)} style={styles.rentalCloseButton}>
                    <X size={SIZES.iconBase} color="#FEF3C7" />
                  </TouchableOpacity>
                </View>

                {/* Book title */}
                <LinearGradient
                  colors={bookToRent.colors as [string, string]}
                  style={styles.rentalBookHeader}
                >
                  <Text style={[styles.rentalBookTitle, { color: bookToRent.textColor }]}>
                    {bookToRent.title}
                  </Text>
                </LinearGradient>

                {/* Days Selector */}
                <View style={styles.daysSection}>
                  <Text style={styles.daysLabel}>
                    <Calendar size={SIZES.iconSM} color="#78350F" /> Kölcsönzési időszak
                  </Text>
                  <View style={styles.daysSliderContainer}>
                    <Text style={styles.daysSliderText}>{rentalDays} nap</Text>
                  </View>
                  <View style={styles.daysRange}>
                    <Text style={styles.daysRangeText}>1 nap</Text>
                    <Text style={styles.daysCurrent}>{rentalDays} nap</Text>
                    <Text style={styles.daysRangeText}>30 nap</Text>
                  </View>
                  {/* Day selector buttons */}
                  <View style={styles.daysSelectorButtons}>
                    {[1, 7, 14, 30].map((days) => (
                      <TouchableOpacity
                        key={days}
                        onPress={() => setRentalDays(days)}
                        style={[
                          styles.daySelectorButton,
                          rentalDays === days && styles.daySelectorButtonActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.daySelectorButtonText,
                            rentalDays === days && styles.daySelectorButtonTextActive,
                          ]}
                        >
                          {days}d
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Price Display */}
                <LinearGradient
                  colors={['#EAB308', '#CA8A04']}
                  style={styles.priceBox}
                >
                  <View style={styles.priceRow}>
                    <View style={styles.priceLabel}>
                      <Coins size={SIZES.iconLG} color="#78350F" />
                      <Text style={styles.priceLabelText}>Ár:</Text>
                    </View>
                    <View>
                      <Text style={styles.priceValue}>{calculateRentalPrice(rentalDays)}</Text>
                      <Text style={styles.pricePerDay}>
                        (~{Math.round(calculateRentalPrice(rentalDays) / rentalDays)} arany/nap)
                      </Text>
                    </View>
                  </View>
                </LinearGradient>

                {/* User balance */}
                <View style={styles.balanceBox}>
                  <Text style={styles.balanceLabel}>Egyenleged:</Text>
                  <View style={styles.balanceValue}>
                    <Coins size={SIZES.iconBase} color="#92400E" />
                    <Text style={styles.balanceValueText}>{coins}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  {/* Rent button */}
                  <TouchableOpacity
                    onPress={handleRentBook}
                    disabled={coins < calculateRentalPrice(rentalDays)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={coins < calculateRentalPrice(rentalDays)
                        ? ['#9CA3AF', '#6B7280']
                        : ['#059669', '#047857']}
                      style={[
                        styles.rentButton,
                        coins < calculateRentalPrice(rentalDays) && styles.rentButtonDisabled,
                      ]}
                    >
                      <Coins size={SIZES.iconBase} color={COLORS.white} />
                      <Text style={styles.rentButtonText}>
                        Kölcsönzés - {calculateRentalPrice(rentalDays)} arany
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Cancel button */}
                  <TouchableOpacity
                    onPress={() => setBookToRent(null)}
                    style={styles.cancelButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelButtonText}>Mégse</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {/* ============================================ */}
      {/* RENTAL PANEL (Sidebar with rented books) */}
      {/* ============================================ */}
      {showRentalPanel && (
        <>
          {/* Backdrop */}
          <TouchableOpacity
            style={styles.rentalPanelBackdrop}
            activeOpacity={1}
            onPress={() => setShowRentalPanel(false)}
          />

          {/* Panel */}
          <Animated.View
            style={[
              styles.rentalPanel,
              {
                transform: [{ translateX: rentalPanelAnim }],
              },
            ]}
          >
            {/* Panel Header */}
            <LinearGradient
              colors={['#B45309', '#92400E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.panelHeader}
            >
              <View style={styles.panelHeaderContent}>
                <View style={styles.panelHeaderLeft}>
                  <BookMarked size={SIZES.iconLG} color="#FEF3C7" />
                  <Text style={styles.panelHeaderTitle}>Kölcsönzött Könyvek</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowRentalPanel(false)}
                  style={styles.panelCloseButton}
                  activeOpacity={0.7}
                >
                  <X size={SIZES.iconBase} color="#FEF3C7" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Rented Books List */}
            <ScrollView
              style={styles.rentedBooksList}
              contentContainerStyle={styles.rentedBooksListContent}
              showsVerticalScrollIndicator={false}
            >
              {rentedBooks.length === 0 ? (
                <View style={styles.emptyRentalState}>
                  <BookOpen size={64} color="#FBBF24" />
                  <Text style={styles.emptyRentalText}>Még nincs kikölcsönzött könyved</Text>
                  <Text style={styles.emptyRentalSubtext}>Kölcsönözz ki egy könyvet a polcokról!</Text>
                </View>
              ) : (
                rentedBooks.map((book, index) => {
                  const remainingDays = getRemainingDays(book.rentedUntil);
                  const isExpiringSoon = remainingDays <= 3;
                  const progressPercentage = (remainingDays / book.daysRented) * 100;

                  return (
                    <View key={index} style={styles.rentedBookCard}>
                      {/* Book header */}
                      <LinearGradient
                        colors={book.colors as [string, string]}
                        style={styles.rentedBookHeader}
                      >
                        <View style={styles.rentedBookHeaderContent}>
                          <BookOpen size={20} color={book.textColor} />
                          <Text style={[styles.rentedBookHeaderTitle, { color: book.textColor }]}>
                            {book.title}
                          </Text>
                        </View>
                      </LinearGradient>

                      {/* Book info */}
                      <View style={styles.rentedBookInfo}>
                        <View style={styles.rentedBookInfoRow}>
                          <View style={styles.rentedBookLabel}>
                            <Calendar size={SIZES.iconSM} color={isExpiringSoon ? '#DC2626' : '#92400E'} />
                            <Text style={[styles.rentedBookLabelText, isExpiringSoon && styles.textExpiring]}>
                              Kölcsönözve:
                            </Text>
                          </View>
                          <Text style={[styles.rentedBookValue, isExpiringSoon && styles.textExpiringBold]}>
                            {book.daysRented} napra
                          </Text>
                        </View>

                        <View style={styles.rentedBookInfoRow}>
                          <View style={styles.rentedBookLabel}>
                            <Clock size={SIZES.iconSM} color={isExpiringSoon ? '#DC2626' : '#92400E'} />
                            <Text style={[styles.rentedBookLabelText, isExpiringSoon && styles.textExpiring]}>
                              Hátralévő idő:
                            </Text>
                          </View>
                          <Text style={[styles.rentedBookValue, isExpiringSoon && styles.textExpiringBold]}>
                            {remainingDays} nap
                          </Text>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.rentedProgressBar}>
                          <View
                            style={[
                              styles.rentedProgressFill,
                              {
                                width: `${progressPercentage}%`,
                                backgroundColor: isExpiringSoon ? '#DC2626' : '#059669',
                              },
                            ]}
                          />
                        </View>
                      </View>

                      {/* Book actions */}
                      <View style={styles.rentedBookActions}>
                        <TouchableOpacity
                          onPress={() => {
                            setShowRentalPanel(false);
                            handleOpenBookView(book.title);
                          }}
                          activeOpacity={0.8}
                          style={styles.rentedReadButtonWrapper}
                        >
                          <LinearGradient
                            colors={['#2563EB', '#1D4ED8']}
                            style={styles.rentedReadButton}
                          >
                            <BookOpen size={SIZES.iconSM} color={COLORS.white} />
                            <Text style={styles.rentedReadButtonText}>Olvasás</Text>
                          </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleReturnBook(book.title)}
                          activeOpacity={0.8}
                          style={styles.rentedReturnButtonWrapper}
                        >
                          <LinearGradient
                            colors={['#DC2626', '#B91C1C']}
                            style={styles.rentedReturnButton}
                          >
                            <Text style={styles.rentedReturnButtonText}>Visszaadás</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>

            {/* Info Section */}
            <View style={styles.panelInfoSection}>
              <Text style={styles.panelInfoTitle}>💡 Tudtad?</Text>
              <Text style={styles.panelInfoText}>• Hosszabb kölcsönzés olcsóbb naponként</Text>
              <Text style={styles.panelInfoText}>• Visszaadáskor visszakapod a fennmaradó napok árát</Text>
              <Text style={styles.panelInfoText}>• Kikölcsönzött könyveket bármikor olvashatod</Text>
            </View>
          </Animated.View>
        </>
      )}

      {/* ============================================ */}
      {/* SUCCESS MODAL */}
      {/* ============================================ */}
      {showSuccessModal && (
        <Modal transparent visible animationType="fade" onRequestClose={() => setShowSuccessModal(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowSuccessModal(false)}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <LinearGradient
                colors={['#FEF3C7', '#FDE68A']}
                style={styles.successModalCard}
              >
                {/* Success Icon */}
                <LinearGradient
                  colors={['#D97706', '#B45309']}
                  style={styles.successIcon}
                >
                  <BookOpen size={40} color={COLORS.white} />
                </LinearGradient>

                {/* Title */}
                <Text style={styles.successTitle}>Sikeres kölcsönzés! 🎉</Text>

                {/* Message */}
                <Text style={styles.successMessage}>
                  <Text style={styles.successBookName}>{successBookTitle}</Text>
                  {'\n'}
                  <Text style={styles.successSubtext}>
                    Jó olvasást! A könyv megtalálható a kölcsönzött könyvek között.
                  </Text>
                </Text>

                {/* Decorations */}
                <BookMarked size={24} color="#D97706" style={styles.successDecor1} />
                <BookOpen size={20} color="#D97706" style={styles.successDecor2} />

                {/* Close button */}
                <View style={styles.successButton}>
                  <TouchableOpacity onPress={() => setShowSuccessModal(false)} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['#D97706', '#B45309']}
                      style={styles.successButtonInner}
                    >
                      <Text style={styles.successButtonText}>Rendben</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {/* ============================================ */}
      {/* FILTER MENU MODAL (Simple placeholder) */}
      {/* ============================================ */}
      {showFilterMenu && (
        <Modal transparent visible animationType="fade" onRequestClose={() => setShowFilterMenu(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowFilterMenu(false)}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <LinearGradient
                colors={['#FEF3C7', '#FDE68A']}
                style={styles.filterMenuCard}
              >
                <Text style={styles.filterMenuTitle}>Könyvtár Beállítások</Text>
                <Text style={styles.filterMenuText}>• Rendezés (A-Z)</Text>
                <Text style={styles.filterMenuText}>• Szűrés (Csak olvasható)</Text>
                <Text style={styles.filterMenuText}>• Keresés</Text>
                <TouchableOpacity
                  onPress={() => setShowFilterMenu(false)}
                  style={styles.filterMenuCloseButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.filterMenuCloseText}>Bezárás</Text>
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  // Background
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // ===== HEADER =====
  header: {
    position: 'relative',
    zIndex: 20,
    paddingTop: 48,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.base,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(180, 83, 9, 0.8)',
    borderRadius: SIZES.radiusXL,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(120, 53, 15, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    color: '#FEF3C7',
    fontSize: SIZES.font2XL,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rentalButton: {
    position: 'relative',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(180, 83, 9, 0.8)',
    borderRadius: SIZES.radiusXL,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(120, 53, 15, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  rentalBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#78350F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rentalBadgeText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
    fontWeight: '700',
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(180, 83, 9, 0.8)',
    borderRadius: SIZES.radiusXL,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(120, 53, 15, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  // ===== BOOKSHELF CONTAINER =====
  bookshelfContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
  },
  bookshelfInner: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 80,
    gap: SPACING.lg,
  },

  // Shelf
  shelfContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  shelfBacking: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 12,
    borderRadius: SIZES.radiusSM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  shelfEdge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    height: 4,
    backgroundColor: 'rgba(120, 53, 15, 0.8)',
  },
  booksRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: SPACING.base,
    paddingHorizontal: SPACING.sm,
    minHeight: 180,
  },

  // Book
  bookSpine: {
    borderRadius: SIZES.radiusSM,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  bookTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    overflow: 'visible',
  },
  bookTitle: {
    fontSize: 11,
    fontWeight: '700',
    transform: [{ rotate: '-90deg' }],
    letterSpacing: 0.3,
    width: 140,
    textAlign: 'center',
  },
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
  bookBottomEdge: {
    height: 8,
    borderBottomLeftRadius: SIZES.radiusSM,
    borderBottomRightRadius: SIZES.radiusSM,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    opacity: 0.75,
  },
  rentedIndicator: {
    position: 'absolute',
    top: -8,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  rentedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radiusFull,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  rentedBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },

  // ===== MODALS =====
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },

  // Book Details Modal
  bookDetailsCard: {
    borderRadius: SIZES.radius2XL,
    padding: 32,
    maxWidth: 384,
    width: '100%',
    borderWidth: 4,
    borderColor: '#78350F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 10,
  },
  bookDetailsHeader: {
    borderRadius: SIZES.radiusLG,
    padding: SPACING.lg,
    marginBottom: SPACING.base,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  bookDetailsHeaderTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: '700',
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  bookDetailsText: {
    color: '#78350F',
    fontSize: SIZES.fontBase,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  bookDetailsActions: {
    gap: SPACING.sm,
  },
  bookDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: SIZES.radiusLG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  bookDetailsButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#B45309',
    paddingVertical: SPACING.md,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FEF3C7',
    fontSize: SIZES.fontBase,
    fontWeight: '600',
  },

  // Rental Modal
  rentalCard: {
    borderRadius: SIZES.radius2XL,
    padding: SPACING.lg,
    maxWidth: 448,
    width: '100%',
    borderWidth: 4,
    borderColor: '#78350F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 10,
  },
  rentalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  rentalTitle: {
    fontSize: SIZES.font2XL,
    fontWeight: '700',
    color: '#78350F',
  },
  rentalCloseButton: {
    width: 32,
    height: 32,
    backgroundColor: '#B45309',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rentalBookHeader: {
    borderRadius: SIZES.radiusLG,
    padding: SPACING.base,
    marginBottom: SPACING.md,
  },
  rentalBookTitle: {
    fontSize: SIZES.fontLG,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Days Selector
  daysSection: {
    marginBottom: SPACING.lg,
  },
  daysLabel: {
    color: '#78350F',
    fontSize: SIZES.fontBase,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  daysSliderContainer: {
    backgroundColor: '#FCD34D',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  daysSliderText: {
    color: '#78350F',
    fontSize: SIZES.fontLG,
    fontWeight: '700',
  },
  daysRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  daysRangeText: {
    fontSize: SIZES.fontSM,
    color: '#92400E',
  },
  daysCurrent: {
    fontSize: SIZES.fontSM,
    color: '#78350F',
    fontWeight: '700',
  },
  daysSelectorButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  daySelectorButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  daySelectorButtonActive: {
    backgroundColor: '#FBBF24',
    borderColor: '#78350F',
  },
  daySelectorButtonText: {
    color: '#92400E',
    fontSize: SIZES.fontSM,
    fontWeight: '600',
  },
  daySelectorButtonTextActive: {
    color: '#78350F',
    fontWeight: '700',
  },

  // Price Display
  priceBox: {
    borderRadius: SIZES.radiusLG,
    padding: SPACING.base,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  priceLabelText: {
    color: '#78350F',
    fontSize: SIZES.fontBase,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: SIZES.font2XL,
    fontWeight: '700',
    color: '#78350F',
    textAlign: 'right',
  },
  pricePerDay: {
    fontSize: SIZES.fontXS,
    color: '#92400E',
    textAlign: 'right',
  },

  // User Balance
  balanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: 'rgba(251, 191, 36, 0.5)',
    borderRadius: SIZES.radiusLG,
  },
  balanceLabel: {
    color: '#78350F',
    fontSize: SIZES.fontBase,
    fontWeight: '600',
  },
  balanceValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceValueText: {
    color: '#78350F',
    fontSize: SIZES.fontBase,
    fontWeight: '700',
  },

  // Action Buttons
  actionButtons: {
    gap: SPACING.sm,
  },
  rentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: SIZES.radiusLG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  rentButtonDisabled: {
    opacity: 0.6,
  },
  rentButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#B45309',
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#FEF3C7',
    fontSize: SIZES.fontBase,
    fontWeight: '600',
  },

  // ===== RENTAL PANEL (Sidebar) =====
  rentalPanelBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 40,
  },
  rentalPanel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 320,
    zIndex: 50,
    borderLeftWidth: 4,
    borderLeftColor: '#78350F',
    shadowColor: '#000',
    shadowOffset: { width: -10, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
    backgroundColor: '#FEF3C7',
  },
  panelHeader: {
    padding: SPACING.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  panelHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  panelHeaderTitle: {
    color: '#FEF3C7',
    fontSize: SIZES.fontXL,
    fontWeight: '700',
  },
  panelCloseButton: {
    width: 32,
    height: 32,
    backgroundColor: '#78350F',
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Rented Books List
  rentedBooksList: {
    flex: 1,
  },
  rentedBooksListContent: {
    padding: SPACING.base,
    gap: SPACING.md,
  },
  emptyRentalState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyRentalText: {
    color: '#92400E',
    fontSize: SIZES.fontBase,
    fontWeight: '600',
    marginTop: SPACING.base,
    textAlign: 'center',
  },
  emptyRentalSubtext: {
    color: '#A16207',
    fontSize: SIZES.fontSM,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },

  // Rented Book Card
  rentedBookCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLG,
    padding: SPACING.base,
    borderWidth: 2,
    borderColor: '#FCD34D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  rentedBookHeader: {
    borderRadius: SIZES.radiusLG,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  rentedBookHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rentedBookHeaderTitle: {
    fontSize: SIZES.fontSM,
    fontWeight: '700',
    flex: 1,
  },
  rentedBookInfo: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  rentedBookInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rentedBookLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rentedBookLabelText: {
    color: '#92400E',
    fontSize: SIZES.fontSM,
  },
  textExpiring: {
    color: '#DC2626',
  },
  rentedBookValue: {
    color: '#78350F',
    fontSize: SIZES.fontSM,
    fontWeight: '600',
  },
  textExpiringBold: {
    color: '#B91C1C',
    fontWeight: '700',
  },

  // Progress Bar
  rentedProgressBar: {
    width: '100%',
    backgroundColor: '#FDE68A',
    borderRadius: SIZES.radiusFull,
    height: 8,
    overflow: 'hidden',
  },
  rentedProgressFill: {
    height: '100%',
  },

  // Rented Book Actions
  rentedBookActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  rentedReadButtonWrapper: {
    flex: 1,
  },
  rentedReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
  },
  rentedReadButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    fontWeight: '600',
  },
  rentedReturnButtonWrapper: {
    flex: 1,
  },
  rentedReturnButton: {
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rentedReturnButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    fontWeight: '600',
  },

  // Info Section
  panelInfoSection: {
    padding: SPACING.base,
    backgroundColor: 'rgba(252, 211, 77, 0.3)',
    borderTopWidth: 2,
    borderTopColor: '#FBBF24',
  },
  panelInfoTitle: {
    color: '#78350F',
    fontSize: SIZES.fontSM,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  panelInfoText: {
    fontSize: SIZES.fontXS,
    color: '#92400E',
    marginBottom: 4,
  },

  // ===== SUCCESS MODAL =====
  successModalCard: {
    borderRadius: SIZES.radius2XL,
    padding: 32,
    maxWidth: 384,
    width: '100%',
    borderWidth: 4,
    borderColor: '#D97706',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 10,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: SPACING.base,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  successTitle: {
    fontSize: SIZES.font3XL,
    fontWeight: '700',
    color: '#78350F',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  successMessage: {
    color: '#92400E',
    fontSize: SIZES.fontBase,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  successBookName: {
    fontSize: SIZES.fontLG,
    fontWeight: '700',
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
    alignItems: 'center',
  },
  successButtonInner: {
    paddingHorizontal: 48,
    paddingVertical: SPACING.md,
    borderRadius: SIZES.radiusLG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  successButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontLG,
    fontWeight: '700',
  },

  // ===== FILTER MENU MODAL =====
  filterMenuCard: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.lg,
    maxWidth: 280,
    width: '100%',
    borderWidth: 2,
    borderColor: '#92400E',
  },
  filterMenuTitle: {
    fontSize: SIZES.fontXL,
    fontWeight: '700',
    color: '#78350F',
    marginBottom: SPACING.md,
  },
  filterMenuText: {
    fontSize: SIZES.fontSM,
    color: '#92400E',
    marginBottom: SPACING.sm,
  },
  filterMenuCloseButton: {
    marginTop: SPACING.base,
    backgroundColor: '#B45309',
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
  },
  filterMenuCloseText: {
    color: '#FEF3C7',
    fontSize: SIZES.fontBase,
    fontWeight: '600',
  },
});
