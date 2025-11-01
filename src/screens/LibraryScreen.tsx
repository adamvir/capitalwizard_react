import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface LibraryScreenProps {
  navigation: any;
  route: {
    params: {
      onOpenBookView: (bookTitle: string) => void;
      coins: number;
      onCoinsChange: (newCoins: number) => void;
    };
  };
}

interface Book { title: string; color: string; width: number; spineColor: string; textColor: string; hasContent?: boolean; }
interface RentedBook { title: string; rentedUntil: number; daysRented: number; color: string; textColor: string; }

const calculateRentalPrice = (days: number): number => {
  if (days === 1) return 50;
  if (days === 30) return 1000;
  const basePrice = 50;
  const maxDiscount = 0.33;
  const discountFactor = (days - 1) / 29;
  const pricePerDay = basePrice * (1 - (maxDiscount * discountFactor));
  return Math.round(pricePerDay * days);
};

export default function LibraryScreen({ navigation, route }: LibraryScreenProps) {
  const { onOpenBookView, coins, onCoinsChange } = route.params;
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [rentedBooks, setRentedBooks] = useState<RentedBook[]>([]);
  const [bookToRent, setBookToRent] = useState<Book | null>(null);
  const [rentalDays, setRentalDays] = useState(7);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => { loadRentedBooks(); }, []);

  const loadRentedBooks = async () => {
    try {
      const saved = await AsyncStorage.getItem('rentedBooks');
      if (saved) {
        const parsed: RentedBook[] = JSON.parse(saved);
        const active = parsed.filter(book => book.rentedUntil > Date.now());
        setRentedBooks(active);
        if (active.length !== parsed.length) {
          await AsyncStorage.setItem('rentedBooks', JSON.stringify(active));
        }
      }
    } catch (error) { console.error('Error loading rented books:', error); }
  };

  const saveRentedBooks = async (books: RentedBook[]) => {
    setRentedBooks(books);
    await AsyncStorage.setItem('rentedBooks', JSON.stringify(books));
  };

  const handleRentBook = async () => {
    if (!bookToRent) return;
    const price = calculateRentalPrice(rentalDays);
    if (coins < price) { Alert.alert('Nincs elég aranyad a kölcsönzéshez!'); return; }
    const alreadyRented = rentedBooks.find(b => b.title === bookToRent.title);
    if (alreadyRented) { Alert.alert('Ez a könyv már ki van kölcsönözve!'); return; }
    onCoinsChange(coins - price);
    const newRental: RentedBook = {
      title: bookToRent.title,
      rentedUntil: Date.now() + (rentalDays * 24 * 60 * 60 * 1000),
      daysRented: rentalDays,
      color: bookToRent.color,
      textColor: bookToRent.textColor,
    };
    await saveRentedBooks([...rentedBooks, newRental]);
    setBookToRent(null);
    setShowSuccessModal(true);
  };

  const handleReturnBook = async (bookTitle: string) => {
    const book = rentedBooks.find(b => b.title === bookTitle);
    if (!book) return;
    const remainingTime = book.rentedUntil - Date.now();
    const remainingDays = Math.max(0, Math.floor(remainingTime / (24 * 60 * 60 * 1000)));
    if (remainingDays > 0) {
      const daysElapsed = book.daysRented - remainingDays;
      const priceForElapsedDays = calculateRentalPrice(daysElapsed);
      const originalPrice = calculateRentalPrice(book.daysRented);
      const refund = originalPrice - priceForElapsedDays;
      onCoinsChange(coins + refund);
      Alert.alert('Sikeres visszaadás!', `${refund} arany visszatérítés`);
    } else {
      Alert.alert('Könyv visszaadva!');
    }
    const updatedBooks = rentedBooks.filter(b => b.title !== bookTitle);
    await saveRentedBooks(updatedBooks);
  };

  const isBookRented = (bookTitle: string) => {
    return rentedBooks.some(b => b.title === bookTitle);
  };

  const shelves: Book[][] = [
    [
      { title: 'Tőkepiaci Szótár', color: 'rgba(180, 83, 9, 1)', width: 60, spineColor: 'rgba(120, 53, 15, 1)', textColor: '#FEF3C7', hasContent: true },
      { title: 'Pénzügyi Alapismeretek', color: 'rgba(100, 116, 139, 1)', width: 54, spineColor: 'rgba(71, 85, 105, 1)', textColor: '#F1F5F9', hasContent: true },
      { title: 'Befektetés Alapjai', color: 'rgba(29, 78, 216, 1)', width: 55, spineColor: 'rgba(30, 64, 175, 1)', textColor: '#DBEAFE', hasContent: true },
      { title: 'Részvények', color: 'rgba(21, 128, 61, 1)', width: 48, spineColor: 'rgba(22, 101, 52, 1)', textColor: '#D1FAE5', hasContent: true },
      { title: 'Kötvények', color: 'rgba(126, 34, 206, 1)', width: 52, spineColor: 'rgba(107, 33, 168, 1)', textColor: '#F3E8FF', hasContent: true },
    ],
    [
      { title: 'Technikai Elemzés', color: 'rgba(67, 56, 202, 1)', width: 62, spineColor: 'rgba(55, 48, 163, 1)', textColor: '#E0E7FF', hasContent: true },
      { title: 'Fundamentális Elemzés', color: 'rgba(13, 148, 136, 1)', width: 65, spineColor: 'rgba(15, 118, 110, 1)', textColor: '#CCFBF1', hasContent: true },
      { title: 'Opciók', color: 'rgba(219, 39, 119, 1)', width: 44, spineColor: 'rgba(190, 24, 93, 1)', textColor: '#FCE7F3', hasContent: true },
      { title: 'Határidős Ügyletek', color: 'rgba(6, 182, 212, 1)', width: 54, spineColor: 'rgba(14, 116, 144, 1)', textColor: '#CFFAFE', hasContent: true },
    ],
    [
      { title: 'Kockázatkezelés', color: 'rgba(244, 63, 94, 1)', width: 58, spineColor: 'rgba(225, 29, 72, 1)', textColor: '#FFE4E6', hasContent: true },
      { title: 'Makrogazdaság', color: 'rgba(234, 179, 8, 1)', width: 55, spineColor: 'rgba(202, 138, 4, 1)', textColor: '#FEF9C3', hasContent: true },
      { title: 'Kripto és Blockchain', color: 'rgba(79, 70, 229, 1)', width: 57, spineColor: 'rgba(67, 56, 202, 1)', textColor: '#E0E7FF', hasContent: true },
      { title: 'Ingatlan Befektetés', color: 'rgba(234, 88, 12, 1)', width: 58, spineColor: 'rgba(194, 65, 12, 1)', textColor: '#FFEDD5', hasContent: true },
    ],
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#78350F', '#1C1917', '#78350F']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={SIZES.iconBase} color="#FEF3C7" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <MaterialCommunityIcons name="book-open-variant" size={32} color="#FCD34D" />
            <Text style={styles.headerTitleText}>Könyvtár</Text>
          </View>
          <TouchableOpacity onPress={() => {}} style={styles.rentalButton}>
            <MaterialCommunityIcons name="bookmark" size={SIZES.iconBase} color="#FEF3C7" />
            {rentedBooks.length > 0 && (
              <View style={styles.rentalBadge}>
                <Text style={styles.rentalBadgeText}>{rentedBooks.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.bookshelfContainer} showsVerticalScrollIndicator={false}>
          {shelves.map((shelf, shelfIndex) => (
            <View key={shelfIndex} style={styles.shelfContainer}>
              <View style={styles.shelfBacking} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.booksRow}>
                {shelf.map((book, bookIndex) => {
                  const isRented = isBookRented(book.title);
                  return (
                    <TouchableOpacity key={bookIndex} onPress={() => setSelectedBook(book)} style={[styles.bookButton, { width: book.width }]}>
                      {isRented && (
                        <View style={styles.rentedIndicator}>
                          <View style={styles.rentedBadge}>
                            <MaterialCommunityIcons name="bookmark" size={12} color="#fff" />
                          </View>
                        </View>
                      )}
                      <View style={[styles.bookSpine, { backgroundColor: book.color, borderColor: book.spineColor, height: 140 + Math.random() * 40, opacity: isRented ? 1 : 0.6 }]}>
                        <Text style={[styles.bookTitle, { color: book.textColor }]}>{book.title}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ))}
        </ScrollView>

        {selectedBook && (
          <Modal visible={true} transparent animationType="fade" onRequestClose={() => setSelectedBook(null)}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedBook(null)}>
              <View style={styles.bookDetailsCard}>
                <LinearGradient colors={[selectedBook.color, selectedBook.spineColor]} style={styles.bookDetailsHeader}>
                  <MaterialCommunityIcons name="book-open-variant" size={48} color={selectedBook.textColor} />
                  <Text style={[styles.bookDetailsHeaderText, { color: selectedBook.textColor }]}>{selectedBook.title}</Text>
                </LinearGradient>
                <Text style={styles.bookDetailsText}>
                  {isBookRented(selectedBook.title) ? 'Ez a könyv jelenleg ki van kölcsönözve. Nyomd meg az "Olvasás" gombot a megtekintéshez.' : selectedBook.hasContent ? 'Ez egy pénzügyi és tőkepiaci oktatási könyv. Kölcsönözd ki, hogy hozzáférj a tartalmához!' : 'Ez a könyv hamarosan elérhető lesz!'}
                </Text>
                <View style={styles.bookDetailsActions}>
                  {selectedBook.hasContent && !isBookRented(selectedBook.title) && (
                    <TouchableOpacity onPress={() => { setBookToRent(selectedBook); setSelectedBook(null); }} style={styles.bookDetailsButton}>
                      <LinearGradient colors={['#059669', '#047857']} style={styles.bookDetailsButtonGradient}>
                        <MaterialCommunityIcons name="coin" size={SIZES.iconBase} color="#fff" />
                        <Text style={styles.bookDetailsButtonText}>Kölcsönzés</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                  {selectedBook.hasContent && isBookRented(selectedBook.title) && (
                    <TouchableOpacity onPress={() => { setSelectedBook(null); onOpenBookView(selectedBook.title); }} style={styles.bookDetailsButton}>
                      <LinearGradient colors={['#2563EB', '#1D4ED8']} style={styles.bookDetailsButtonGradient}>
                        <MaterialCommunityIcons name="book-open-variant" size={SIZES.iconBase} color="#fff" />
                        <Text style={styles.bookDetailsButtonText}>Olvasás</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => setSelectedBook(null)} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Bezárás</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        )}

        {bookToRent && (
          <Modal visible={true} transparent animationType="slide" onRequestClose={() => setBookToRent(null)}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setBookToRent(null)}>
              <View style={styles.rentalCard}>
                <View style={styles.rentalHeader}>
                  <Text style={styles.rentalTitle}>Könyv Kölcsönzése</Text>
                  <TouchableOpacity onPress={() => setBookToRent(null)} style={styles.rentalCloseButton}>
                    <MaterialCommunityIcons name="close" size={SIZES.iconBase} color="#FEF3C7" />
                  </TouchableOpacity>
                </View>
                <LinearGradient colors={[bookToRent.color, bookToRent.spineColor]} style={styles.bookDetailsHeader}>
                  <Text style={[styles.bookDetailsHeaderText, { color: bookToRent.textColor, fontSize: SIZES.fontLG }]}>{bookToRent.title}</Text>
                </LinearGradient>
                <View style={styles.priceBox}>
                  <LinearGradient colors={['#EAB308', '#CA8A04']} style={styles.priceBoxGradient}>
                    <View style={styles.priceRow}>
                      <View style={styles.priceLabel}>
                        <MaterialCommunityIcons name="coin" size={SIZES.iconLG} color="#78350F" />
                        <Text style={styles.priceLabelText}>Ár:</Text>
                      </View>
                      <View>
                        <Text style={styles.priceValue}>{calculateRentalPrice(rentalDays)}</Text>
                        <Text style={styles.pricePerDay}>(~{Math.round(calculateRentalPrice(rentalDays) / rentalDays)} arany/nap)</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity onPress={handleRentBook} disabled={coins < calculateRentalPrice(rentalDays)} style={[styles.rentButton, coins < calculateRentalPrice(rentalDays) && styles.rentButtonDisabled]}>
                    <LinearGradient colors={coins >= calculateRentalPrice(rentalDays) ? ['#059669', '#047857'] : ['#9CA3AF', '#6B7280']} style={styles.rentButtonGradient}>
                      <MaterialCommunityIcons name="coin" size={SIZES.iconBase} color="#fff" />
                      <Text style={styles.rentButtonText}>Kölcsönzés - {calculateRentalPrice(rentalDays)} arany</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setBookToRent(null)} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Mégse</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        )}

        {showSuccessModal && (
          <Modal visible={true} transparent animationType="fade" onRequestClose={() => setShowSuccessModal(false)}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSuccessModal(false)}>
              <View style={styles.successModalCard}>
                <View style={styles.successIcon}>
                  <MaterialCommunityIcons name="bookmark" size={40} color="#fff" />
                </View>
                <Text style={styles.successTitle}>Sikeres kölcsönzés! 🎉</Text>
                <Text style={styles.successMessage}>Most már hozzáférhetsz a könyv tartalmához!</Text>
                <TouchableOpacity onPress={() => setShowSuccessModal(false)} style={styles.successButton}>
                  <LinearGradient colors={['#D97706', '#B45309']} style={styles.successButtonGradient}>
                    <Text style={styles.successButtonText}>Rendben</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: 48, paddingBottom: SPACING.base },
  backButton: { width: 40, height: 40, backgroundColor: 'rgba(180, 83, 9, 0.8)', borderRadius: SIZES.radiusXL, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  headerTitleText: { color: '#FEF3C7', fontSize: SIZES.font2XL, textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  rentalButton: { width: 40, height: 40, backgroundColor: 'rgba(180, 83, 9, 0.8)', borderRadius: SIZES.radiusXL, alignItems: 'center', justifyContent: 'center' },
  rentalBadge: { position: 'absolute', top: -4, right: -4, width: 20, height: 20, backgroundColor: '#DC2626', borderRadius: 10, borderWidth: 2, borderColor: '#78350F', alignItems: 'center', justifyContent: 'center' },
  rentalBadgeText: { color: '#fff', fontSize: SIZES.fontXS },
  bookshelfContainer: { flex: 1, paddingHorizontal: SPACING.lg },
  shelfContainer: { marginBottom: SPACING.lg },
  shelfBacking: { height: 12, backgroundColor: '#78350F', borderRadius: SIZES.radiusSM, marginTop: SPACING.base },
  booksRow: { flexDirection: 'row', paddingBottom: SPACING.base },
  bookButton: { marginHorizontal: 2, position: 'relative' },
  rentedIndicator: { position: 'absolute', top: -8, left: 0, right: 0, zIndex: 10, alignItems: 'center' },
  rentedBadge: { backgroundColor: '#10B981', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: SIZES.radiusFull, flexDirection: 'row', alignItems: 'center', gap: 4 },
  bookSpine: { borderRadius: SIZES.radiusSM, borderWidth: 2, padding: 4, alignItems: 'center', justifyContent: 'center' },
  bookTitle: { fontSize: SIZES.fontXS, textAlign: 'center', transform: [{ rotate: '-90deg' }] },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', padding: 32 },
  bookDetailsCard: { backgroundColor: '#FEF3C7', borderRadius: SIZES.radius2XL, padding: 32, maxWidth: 384, borderWidth: 4, borderColor: '#78350F' },
  bookDetailsHeader: { borderRadius: SIZES.radiusLG, padding: SPACING.lg, marginBottom: SPACING.base, alignItems: 'center' },
  bookDetailsHeaderText: { fontSize: SIZES.fontXL, textAlign: 'center', marginTop: SPACING.sm },
  bookDetailsText: { color: '#78350F', marginBottom: SPACING.lg },
  bookDetailsActions: { gap: SPACING.sm },
  bookDetailsButton: { width: '100%' },
  bookDetailsButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, borderRadius: SIZES.radiusLG },
  bookDetailsButtonText: { color: '#fff', fontSize: SIZES.fontBase },
  closeButton: { width: '100%', backgroundColor: '#B45309', paddingVertical: SPACING.md, borderRadius: SIZES.radiusLG, alignItems: 'center' },
  closeButtonText: { color: '#FEF3C7', fontSize: SIZES.fontBase },
  rentalCard: { backgroundColor: '#FEF3C7', borderRadius: SIZES.radius2XL, padding: SPACING.lg, maxWidth: 448, width: '100%', borderWidth: 4, borderColor: '#78350F' },
  rentalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.base },
  rentalTitle: { fontSize: SIZES.font2XL, color: '#78350F' },
  rentalCloseButton: { width: 32, height: 32, backgroundColor: '#B45309', borderRadius: SIZES.radiusLG, alignItems: 'center', justifyContent: 'center' },
  priceBox: { marginBottom: SPACING.lg },
  priceBoxGradient: { borderRadius: SIZES.radiusLG, padding: SPACING.base },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceLabel: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  priceLabelText: { color: '#78350F' },
  priceValue: { fontSize: SIZES.font2XL, color: '#78350F', textAlign: 'right' },
  pricePerDay: { fontSize: SIZES.fontXS, color: '#92400E', textAlign: 'right' },
  actionButtons: { gap: SPACING.sm },
  rentButton: { width: '100%' },
  rentButtonDisabled: { opacity: 0.5 },
  rentButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, borderRadius: SIZES.radiusLG },
  rentButtonText: { color: '#fff', fontSize: SIZES.fontBase },
  cancelButton: { width: '100%', backgroundColor: '#B45309', paddingVertical: SPACING.sm, borderRadius: SIZES.radiusLG, alignItems: 'center' },
  cancelButtonText: { color: '#FEF3C7', fontSize: SIZES.fontBase },
  successModalCard: { backgroundColor: '#FEF3C7', borderRadius: SIZES.radius2XL, padding: 32, maxWidth: 384, width: '100%', borderWidth: 4, borderColor: '#D97706', alignItems: 'center' },
  successIcon: { width: 80, height: 80, backgroundColor: '#D97706', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.base },
  successTitle: { fontSize: SIZES.font3XL, color: '#78350F', textAlign: 'center', marginBottom: SPACING.sm },
  successMessage: { color: '#92400E', textAlign: 'center', marginBottom: SPACING.lg },
  successButton: { width: '100%' },
  successButtonGradient: { paddingHorizontal: 48, paddingVertical: SPACING.md, borderRadius: SIZES.radiusLG, alignItems: 'center' },
  successButtonText: { color: '#fff', fontSize: SIZES.fontLG },
});
