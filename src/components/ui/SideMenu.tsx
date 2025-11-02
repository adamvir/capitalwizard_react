/**
 * ============================================
 * SIDEMENU - REACT NATIVE VERSION
 * ============================================
 *
 * Left-side navigation menu with 4 quick action buttons
 * - Bolt (Shop)
 * - Üzenetek (Messages) - disabled
 * - Leckék (Lessons)
 * - Speciális (Special) - disabled
 *
 * HASZNÁLAT:
 * <SideMenu
 *   onLessonsClick={() => navigation.navigate('Lessons')}
 *   onShopClick={() => navigation.navigate('Shop')}
 * />
 *
 * FÜGGŐSÉGEK:
 * npm install lucide-react-native
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShoppingBag, MessageSquare, BookOpen, Sparkles } from 'lucide-react-native';

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
  onShopClick?: () => void
): MenuItem[] => [
  {
    icon: ShoppingBag,
    label: 'Bolt',
    backgroundColor: '#EAB308', // yellow-500
    onClick: onShopClick,
  },
  {
    icon: MessageSquare,
    label: 'Üzenetek',
    backgroundColor: '#D97706', // amber-600
    onClick: undefined, // Disabled
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

export function SideMenu({ onLessonsClick, onShopClick }: SideMenuProps) {
  const menuItems = getMenuItems(onLessonsClick, onShopClick);

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
    fontSize: SIZES.fontXS,
    // Text shadow (iOS + Android)
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
