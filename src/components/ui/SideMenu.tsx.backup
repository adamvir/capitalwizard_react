import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, SPACING } from '../../utils/styleConstants';

// ============================================
// SIDEMENU KOMPONENS
// Oldalsó navigációs menü gombok
// ============================================

interface SideMenuProps {
  onLessonsClick?: () => void;
  onShopClick?: () => void;
}

// Menü elem típus definíció
interface MenuItem {
  iconName: string;
  label: string;
  backgroundColor: string;
  onClick?: () => void;
  navigationTarget?: string;
}

export function SideMenu({ onLessonsClick, onShopClick }: SideMenuProps) {
  const navigation = useNavigation();

  // ===== MENU CONFIGURATION =====
  // Menü elemek konfigurációja
  const menuItems: MenuItem[] = [
    {
      iconName: 'shopping',
      label: 'Bolt',
      backgroundColor: '#EAB308', // yellow-500
      onClick: onShopClick,
      // navigationTarget: 'Shop' // Navigate to Shop screen
    },
    {
      iconName: 'message-square',
      label: 'Üzenetek',
      backgroundColor: '#D97706', // amber-600
      onClick: undefined,
      // navigationTarget: 'Messages' // Navigate to Messages screen
    },
    {
      iconName: 'book-open-variant',
      label: 'Leckék',
      backgroundColor: '#B45309', // amber-700
      onClick: onLessonsClick,
      // navigationTarget: 'Lessons' // Navigate to Lessons screen
    },
    {
      iconName: 'sparkles',
      label: 'Speciális',
      backgroundColor: '#EA580C', // orange-600
      onClick: undefined,
      // navigationTarget: 'Special' // Navigate to Special screen
    },
  ];

  // ===== EVENT HANDLERS =====

  // Menü elem klikk kezelése
  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    // Ha van navigationTarget, navigálj oda
    // if (item.navigationTarget) {
    //   navigation.navigate(item.navigationTarget);
    // }
  };

  // ===== RENDER MENU ITEM =====
  const renderMenuItem = (item: MenuItem, index: number) => {
    const isDisabled = !item.onClick;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Animáció: nyomásra kicsinyítés
    const handlePressIn = () => {
      if (!isDisabled) {
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          useNativeDriver: true,
        }).start();
      }
    };

    // Animáció: visszaugrik normál méret
    const handlePressOut = () => {
      if (!isDisabled) {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 3,
          tension: 40,
        }).start();
      }
    };

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleMenuItemClick(item)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.9}
        style={[
          styles.menuItemButton,
          isDisabled && styles.menuItemButtonDisabled,
        ]}
      >
        {/* Ikon container */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              backgroundColor: item.backgroundColor,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <MaterialCommunityIcons
            name={item.iconName as any}
            size={28}
            color={COLORS.white}
          />
        </Animated.View>

        {/* Label */}
        <Text style={styles.labelText}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => renderMenuItem(item, index))}
    </View>
  );
}

const styles = StyleSheet.create({
  // Fő container (bal oldali pozíció)
  container: {
    position: 'absolute',
    left: 8,
    top: 16,
    flexDirection: 'column',
    zIndex: 10,
  },

  // Menü elem gomb container
  menuItemButton: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },

  // Menü elem gomb (letiltott)
  menuItemButtonDisabled: {
    opacity: 0.7,
  },

  // Ikon container
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radiusLG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    // Shadow for iOS
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    // Shadow for Android
    elevation: 10,
  },

  // Label szöveg
  labelText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
