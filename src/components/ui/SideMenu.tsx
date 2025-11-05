/**
 * ============================================
 * SIDEMENU - REACT NATIVE VERSION
 * ============================================
 *
 * Left-side navigation menu with 4 quick action buttons
 * - Bolt (Shop)
 * - Barátok (Friends)
 * - Leckék (Lessons)
 * - Speciális (Special) - disabled
 *
 * HASZNÁLAT:
 * <SideMenu
 *   onLessonsClick={() => navigation.navigate('Lessons')}
 *   onShopClick={() => navigation.navigate('Shop')}
 *   onFriendsClick={() => navigation.navigate('Friends')}
 * />
 *
 * FÜGGŐSÉGEK:
 * npm install lucide-react-native
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingBag, Users, BookOpen, Sparkles } from 'lucide-react-native';

// ============================================
// CONSTANTS
// ============================================

const COLORS = {
  white: '#FFFFFF',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
};

const SPACING = {
  sm: 8,
};

const SIZES = {
  fontXS: 10,
  radiusLG: 12,
  iconSize: 28,
  buttonSize: 56,
};

// ============================================
// TYPES
// ============================================

interface SideMenuProps {
  onLessonsClick?: () => void;
  onShopClick?: () => void;
  onFriendsClick?: () => void;
  pendingFriendRequestsCount?: number; // Új: értesítési badge
}

interface MenuItem {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  backgroundColor: string;
  onClick?: () => void;
}

// ============================================
// MENU CONFIGURATION
// ============================================

const getMenuItems = (
  onLessonsClick?: () => void,
  onShopClick?: () => void,
  onFriendsClick?: () => void
): MenuItem[] => [
  {
    icon: ShoppingBag,
    label: 'Bolt',
    backgroundColor: '#EAB308', // yellow-500
    onClick: onShopClick,
  },
  {
    icon: Users,
    label: 'Barátok',
    backgroundColor: '#3B82F6', // blue-500
    onClick: onFriendsClick,
  },
  {
    icon: BookOpen,
    label: 'Leckék',
    backgroundColor: '#B45309', // amber-700
    onClick: onLessonsClick,
  },
  {
    icon: Sparkles,
    label: 'Speciális',
    backgroundColor: '#EA580C', // orange-600
    onClick: undefined, // Disabled
  },
];

// ============================================
// COMPONENT
// ============================================

export function SideMenu({
  onLessonsClick,
  onShopClick,
  onFriendsClick,
  pendingFriendRequestsCount = 0
}: SideMenuProps) {
  const menuItems = getMenuItems(onLessonsClick, onShopClick, onFriendsClick);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => {
        const IconComponent = item.icon;
        const isDisabled = !item.onClick;
        const isFriendsButton = index === 1; // Barátok gomb (Users icon)
        const showBadge = isFriendsButton && pendingFriendRequestsCount > 0;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleMenuItemClick(item)}
            disabled={isDisabled}
            activeOpacity={isDisabled ? 1 : 0.7}
            style={[styles.menuItem, isDisabled && styles.menuItemDisabled]}
          >
            {/* Icon container */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.backgroundColor },
              ]}
            >
              <IconComponent size={SIZES.iconSize} color={COLORS.white} />

              {/* Notification Badge - iOS style */}
              {showBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {pendingFriendRequestsCount > 9 ? '9+' : pendingFriendRequestsCount}
                  </Text>
                </View>
              )}
            </View>

            {/* Label */}
            <Text style={styles.labelText}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 8,
    top: 80,
    flexDirection: 'column',
    gap: SPACING.sm,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  menuItemDisabled: {
    opacity: 0.7,
  },
  iconContainer: {
    width: SIZES.buttonSize,
    height: SIZES.buttonSize,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    // Shadow for Android
    elevation: 5,
  },
  labelText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
    // Erős text shadow a jobb láthatóságért
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  // iOS-style notification badge
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30', // iOS red
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    // Shadow for Android
    elevation: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },
});
