/**
 * ============================================
 * FriendsScreen - REACT NATIVE VERSION
 * ============================================
 *
 * Barátrendszer képernyő
 * - Barátok listája
 * - Bejövő barátkérelmek
 * - Username alapú keresés
 * - Küldött kérelmek törlése
 * - Barát elleni küzdelem (navigál az ArenaScreen-re)
 *
 * HASZNÁLAT:
 * navigation.navigate('Friends')
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Users,
  Search,
  UserPlus,
  UserCheck,
  UserX,
  X,
  Swords,
  Mail,
  MailCheck,
  Crown,
} from 'lucide-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useFriends, Player, Friend, FriendRequest } from '../hooks/useFriends';
import { useCoins } from '../contexts/CoinsContext';
import { useCallback } from 'react';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748B',
  slate400: '#94A3B8',
  slate300: '#CBD5E1',
  blue900: '#1E3A8A',
  blue800: '#1E40AF',
  blue700: '#1D4ED8',
  blue600: '#2563EB',
  blue500: '#3B82F6',
  blue400: '#60A5FA',
  blue300: '#93C5FD',
  cyan500: '#06B6D4',
  cyan400: '#22D3EE',
  amber500: '#F59E0B',
  amber400: '#FBBF24',
  green600: '#16A34A',
  green700: '#15803D',
  red600: '#DC2626',
  red700: '#B91C1C',
  purple500: '#A855F7',
  pink500: '#EC4899',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
};

const SIZES = {
  fontXS: 10,
  fontSM: 12,
  fontBase: 14,
  fontLG: 18,
  fontXL: 20,
  borderThin: 1,
  radiusLG: 12,
  radiusXL: 16,
  radiusFull: 9999,
  iconSM: 16,
  iconBase: 18,
  iconLG: 24,
};

const FONT_WEIGHT = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// ============================================
// TYPES
// ============================================

type FriendsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Friends'>;

interface FriendsScreenProps {
  navigation: FriendsScreenNavigationProp;
}

type Tab = 'friends' | 'requests' | 'search';

// ============================================
// COMPONENT
// ============================================

export default function FriendsScreen({ navigation }: FriendsScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const {
    friends,
    incomingRequests,
    outgoingRequests,
    loading,
    refresh,
    searchPlayers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    cancelFriendRequest,
  } = useFriends();

  const { coins } = useCoins();

  // ============================================
  // REFRESH ON FOCUS
  // ============================================

  useFocusEffect(
    useCallback(() => {
      console.log('🔄 FriendsScreen focused - refreshing friends data...');
      refresh();
    }, [refresh])
  );

  // ============================================
  // SEARCH HANDLER
  // ============================================

  const handleSearch = async () => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results = await searchPlayers(searchQuery.trim());
    setSearchResults(results);
    setIsSearching(false);
  };

  // Trigger search on query change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ============================================
  // ACTION HANDLERS
  // ============================================

  const handleSendRequest = async (playerId: string, playerName: string) => {
    const success = await sendFriendRequest(playerId);
    if (success) {
      Alert.alert('Siker', `Barátkérelem elküldve: ${playerName}`);
    } else {
      Alert.alert('Hiba', 'Nem sikerült a barátkérelem elküldése');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    const success = await acceptFriendRequest(requestId);
    if (success) {
      Alert.alert('Siker', 'Barátkérelem elfogadva!');
    } else {
      Alert.alert('Hiba', 'Nem sikerült elfogadni a kérelmet');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const success = await rejectFriendRequest(requestId);
    if (success) {
      Alert.alert('Siker', 'Barátkérelem elutasítva');
    } else {
      Alert.alert('Hiba', 'Nem sikerült elutasítani a kérelmet');
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    const success = await cancelFriendRequest(requestId);
    if (success) {
      Alert.alert('Siker', 'Barátkérelem visszavonva');
    } else {
      Alert.alert('Hiba', 'Nem sikerült visszavonni a kérelmet');
    }
  };

  const handleRemoveFriend = async (friendId: string, friendName: string) => {
    Alert.alert(
      'Barát törlése',
      `Biztosan törölni szeretnéd a barátod: ${friendName}?`,
      [
        { text: 'Mégsem', style: 'cancel' },
        {
          text: 'Törlés',
          style: 'destructive',
          onPress: async () => {
            const success = await removeFriend(friendId);
            if (success) {
              Alert.alert('Siker', 'Barát törölve');
            } else {
              Alert.alert('Hiba', 'Nem sikerült törölni a barátot');
            }
          },
        },
      ]
    );
  };

  const handleChallengeFriend = (friendId: string, friendName: string) => {
    Alert.alert(
      'Küzdelem',
      `Hamarosan küzdhetsz ${friendName} ellen az Arénában!`,
      [{ text: 'Rendben' }]
    );
    // TODO: Navigate to Arena with friend challenge mode
    // navigation.navigate('Arena', { opponentId: friendId, ... });
  };

  // ============================================
  // TIER BADGE COLORS
  // ============================================

  const getTierColors = (tier: string) => {
    switch (tier) {
      case 'master':
        return { bg: COLORS.purple500, text: COLORS.white };
      case 'pro':
        return { bg: COLORS.cyan500, text: COLORS.white };
      default:
        return { bg: COLORS.slate600, text: COLORS.slate300 };
    }
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderFriendCard = (friend: Friend) => {
    const friendData = friend.friend;
    if (!friendData) return null;

    const tierColors = getTierColors(friendData.subscription_type);

    return (
      <LinearGradient
        key={friend.id}
        colors={[`${COLORS.blue800}66`, `${COLORS.blue900}66`]}
        style={styles.card}
      >
        <View style={styles.cardContent}>
          {/* Player Info */}
          <View style={styles.playerInfo}>
            <View style={styles.playerHeader}>
              <Text style={styles.playerName}>
                {friendData.username || 'Névtelen játékos'}
              </Text>
              {(friendData.subscription_type === 'master' ||
                friendData.subscription_type === 'pro') && (
                <View
                  style={[
                    styles.tierBadge,
                    { backgroundColor: tierColors.bg },
                  ]}
                >
                  <Crown size={SIZES.iconSM} color={tierColors.text} />
                </View>
              )}
            </View>
            <Text style={styles.playerLevel}>Szint {friendData.level}</Text>
          </View>

          {/* Actions */}
          <View style={styles.cardActions}>
            {/* Challenge Button */}
            <TouchableOpacity
              onPress={() =>
                handleChallengeFriend(friendData.id, friendData.username || 'Játékos')
              }
              style={[styles.actionButton, { backgroundColor: COLORS.amber500 }]}
            >
              <Swords size={SIZES.iconBase} color={COLORS.white} />
            </TouchableOpacity>

            {/* Remove Button */}
            <TouchableOpacity
              onPress={() =>
                handleRemoveFriend(friendData.id, friendData.username || 'Játékos')
              }
              style={[styles.actionButton, { backgroundColor: COLORS.red600 }]}
            >
              <UserX size={SIZES.iconBase} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderIncomingRequest = (request: FriendRequest) => {
    const sender = request.sender;
    if (!sender) return null;

    return (
      <LinearGradient
        key={request.id}
        colors={[`${COLORS.blue800}66`, `${COLORS.blue900}66`]}
        style={styles.card}
      >
        <View style={styles.cardContent}>
          {/* Player Info */}
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>
              {sender.username || 'Névtelen játékos'}
            </Text>
            <Text style={styles.playerLevel}>Szint {sender.level}</Text>
          </View>

          {/* Actions */}
          <View style={styles.cardActions}>
            {/* Accept Button */}
            <TouchableOpacity
              onPress={() => handleAcceptRequest(request.id)}
              style={[styles.actionButton, { backgroundColor: COLORS.green600 }]}
            >
              <UserCheck size={SIZES.iconBase} color={COLORS.white} />
            </TouchableOpacity>

            {/* Reject Button */}
            <TouchableOpacity
              onPress={() => handleRejectRequest(request.id)}
              style={[styles.actionButton, { backgroundColor: COLORS.red600 }]}
            >
              <UserX size={SIZES.iconBase} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderOutgoingRequest = (request: FriendRequest) => {
    const receiver = request.receiver;
    if (!receiver) return null;

    return (
      <LinearGradient
        key={request.id}
        colors={[`${COLORS.slate800}66`, `${COLORS.slate700}66`]}
        style={styles.card}
      >
        <View style={styles.cardContent}>
          {/* Player Info */}
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>
              {receiver.username || 'Névtelen játékos'}
            </Text>
            <Text style={[styles.playerLevel, { color: COLORS.slate400 }]}>
              Kérelem elküldve...
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.cardActions}>
            {/* Cancel Button */}
            <TouchableOpacity
              onPress={() => handleCancelRequest(request.id)}
              style={[styles.actionButton, { backgroundColor: COLORS.red600 }]}
            >
              <X size={SIZES.iconBase} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderSearchResult = (player: Player) => {
    // Check if already friends
    const isFriend = friends.some((f) => f.friend?.id === player.id);

    // Check if request already sent
    const requestSent = outgoingRequests.some((r) => r.receiver?.id === player.id);

    const tierColors = getTierColors(player.subscription_type);

    return (
      <LinearGradient
        key={player.id}
        colors={[`${COLORS.blue800}66`, `${COLORS.blue900}66`]}
        style={styles.card}
      >
        <View style={styles.cardContent}>
          {/* Player Info */}
          <View style={styles.playerInfo}>
            <View style={styles.playerHeader}>
              <Text style={styles.playerName}>
                {player.username || 'Névtelen játékos'}
              </Text>
              {(player.subscription_type === 'master' ||
                player.subscription_type === 'pro') && (
                <View
                  style={[
                    styles.tierBadge,
                    { backgroundColor: tierColors.bg },
                  ]}
                >
                  <Crown size={SIZES.iconSM} color={tierColors.text} />
                </View>
              )}
            </View>
            <Text style={styles.playerLevel}>Szint {player.level}</Text>
          </View>

          {/* Actions */}
          <View style={styles.cardActions}>
            {isFriend ? (
              <View style={[styles.statusBadge, { backgroundColor: COLORS.green600 }]}>
                <UserCheck size={SIZES.iconSM} color={COLORS.white} />
                <Text style={styles.statusBadgeText}>Barát</Text>
              </View>
            ) : requestSent ? (
              <View style={[styles.statusBadge, { backgroundColor: COLORS.slate600 }]}>
                <MailCheck size={SIZES.iconSM} color={COLORS.white} />
                <Text style={styles.statusBadgeText}>Elküldve</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  handleSendRequest(player.id, player.username || 'Játékos')
                }
                style={[styles.actionButton, { backgroundColor: COLORS.blue600 }]}
              >
                <UserPlus size={SIZES.iconBase} color={COLORS.white} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    );
  };

  // ============================================
  // RENDER TAB CONTENT
  // ============================================

  const renderTabContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.blue500} />
          <Text style={styles.loadingText}>Betöltés...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'friends':
        return (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.cardsContainer}>
            {friends.length === 0 ? (
              <View style={styles.emptyState}>
                <Users size={48} color={COLORS.slate500} />
                <Text style={styles.emptyStateText}>Még nincsenek barátaid</Text>
                <Text style={styles.emptyStateSubtext}>
                  Keress rá játékosokra a Keresés fülön!
                </Text>
              </View>
            ) : (
              friends.map((friend) => renderFriendCard(friend))
            )}
          </ScrollView>
        );

      case 'requests':
        return (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.cardsContainer}>
            {/* Incoming Requests */}
            {incomingRequests.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Bejövő kérelmek</Text>
                {incomingRequests.map((request) => renderIncomingRequest(request))}
              </View>
            )}

            {/* Outgoing Requests */}
            {outgoingRequests.length > 0 && (
              <View style={{ marginTop: incomingRequests.length > 0 ? SPACING.xl : 0 }}>
                <Text style={styles.sectionTitle}>Kimenő kérelmek</Text>
                {outgoingRequests.map((request) => renderOutgoingRequest(request))}
              </View>
            )}

            {/* Empty State */}
            {incomingRequests.length === 0 && outgoingRequests.length === 0 && (
              <View style={styles.emptyState}>
                <Mail size={48} color={COLORS.slate500} />
                <Text style={styles.emptyStateText}>Nincsenek barátkérelmek</Text>
              </View>
            )}
          </ScrollView>
        );

      case 'search':
        return (
          <View style={styles.searchContainer}>
            {/* Search Input */}
            <View style={styles.searchInputContainer}>
              <Search size={SIZES.iconBase} color={COLORS.slate400} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Keress felhasználónév alapján..."
                placeholderTextColor={COLORS.slate500}
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={SIZES.iconBase} color={COLORS.slate400} />
                </TouchableOpacity>
              )}
            </View>

            {/* Search Results */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.cardsContainer}>
              {isSearching ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.blue500} />
                </View>
              ) : searchResults.length > 0 ? (
                searchResults.map((player) => renderSearchResult(player))
              ) : searchQuery.trim().length > 0 ? (
                <View style={styles.emptyState}>
                  <Search size={48} color={COLORS.slate500} />
                  <Text style={styles.emptyStateText}>Nincs találat</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Próbálj meg másik felhasználónevet keresni
                  </Text>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Search size={48} color={COLORS.slate500} />
                  <Text style={styles.emptyStateText}>Kezdj el keresni!</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Írj be egy felhasználónevet a keresőbe
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        );
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" translucent={false} />
      <LinearGradient
        colors={[COLORS.slate900, COLORS.blue900, COLORS.slate900]}
        style={styles.gradient}
      >
        {/* Top Spacer for iPhone notch */}
        <View style={styles.topSpacer} />

        {/* Header */}
        <LinearGradient
          colors={[`${COLORS.blue700}e6`, `${COLORS.blue800}e6`]}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={SIZES.iconBase} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Users size={SIZES.iconLG} color={COLORS.white} />
            <Text style={styles.headerTitle}>Barátok</Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.friendsCount}>{friends.length} barát</Text>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab('friends')}
            style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          >
            <Users
              size={SIZES.iconBase}
              color={activeTab === 'friends' ? COLORS.blue400 : COLORS.slate400}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'friends' && styles.activeTabText,
              ]}
            >
              Barátok
            </Text>
            {friends.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{friends.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('requests')}
            style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          >
            <Mail
              size={SIZES.iconBase}
              color={activeTab === 'requests' ? COLORS.blue400 : COLORS.slate400}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'requests' && styles.activeTabText,
              ]}
            >
              Kérelmek
            </Text>
            {incomingRequests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{incomingRequests.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('search')}
            style={[styles.tab, activeTab === 'search' && styles.activeTab]}
          >
            <Search
              size={SIZES.iconBase}
              color={activeTab === 'search' ? COLORS.blue400 : COLORS.slate400}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'search' && styles.activeTabText,
              ]}
            >
              Keresés
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </LinearGradient>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.slate900,
  },
  gradient: {
    flex: 1,
  },
  topSpacer: {
    height: 48,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.blue500,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: `${COLORS.blue600}99`,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    fontSize: SIZES.fontXL,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  friendsCount: {
    fontSize: SIZES.fontSM,
    color: COLORS.blue300,
    fontWeight: FONT_WEIGHT.medium,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    gap: SPACING.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    backgroundColor: `${COLORS.slate800}80`,
    borderRadius: SIZES.radiusLG,
    borderWidth: SIZES.borderThin,
    borderColor: 'transparent',
  },
  activeTab: {
    backgroundColor: `${COLORS.blue800}66`,
    borderColor: COLORS.blue500,
  },
  tabText: {
    fontSize: SIZES.fontSM,
    color: COLORS.slate400,
    fontWeight: FONT_WEIGHT.medium,
  },
  activeTabText: {
    color: COLORS.blue300,
    fontWeight: FONT_WEIGHT.semibold,
  },
  badge: {
    backgroundColor: COLORS.red600,
    borderRadius: SIZES.radiusFull,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xs,
  },
  badgeText: {
    fontSize: SIZES.fontXS,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    padding: SPACING.base,
    gap: SPACING.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontLG,
    color: COLORS.blue300,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },

  // Cards
  card: {
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.blue500}4d`,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerInfo: {
    flex: 1,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  playerName: {
    fontSize: SIZES.fontLG,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },
  playerLevel: {
    fontSize: SIZES.fontSM,
    color: COLORS.blue300,
  },
  tierBadge: {
    width: 24,
    height: 24,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SIZES.radiusLG,
  },
  statusBadgeText: {
    fontSize: SIZES.fontSM,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.medium,
  },

  // Search
  searchContainer: {
    flex: 1,
    paddingTop: SPACING.base,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: `${COLORS.slate800}80`,
    borderWidth: SIZES.borderThin,
    borderColor: `${COLORS.blue500}4d`,
    borderRadius: SIZES.radiusLG,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: SIZES.fontBase,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
    gap: SPACING.md,
  },
  emptyStateText: {
    fontSize: SIZES.fontLG,
    color: COLORS.slate400,
    fontWeight: FONT_WEIGHT.medium,
  },
  emptyStateSubtext: {
    fontSize: SIZES.fontBase,
    color: COLORS.slate500,
    textAlign: 'center',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  loadingText: {
    marginTop: SPACING.base,
    color: COLORS.slate400,
    fontSize: SIZES.fontBase,
  },
});
