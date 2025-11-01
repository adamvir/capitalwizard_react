import { ShoppingBag, CreditCard, BookOpen, Sparkles, MessageSquare } from 'lucide-react';
import { COLORS, SIZES, SPACING } from '../utils/styleConstants';

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
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  label: string;
  backgroundColor: string;
  onClick?: () => void;
}

export function SideMenu({ onLessonsClick, onShopClick }: SideMenuProps) {
  
  // ===== MENU CONFIGURATION =====
  // Menü elemek konfigurációja
  const menuItems: MenuItem[] = [
    { 
      icon: ShoppingBag, 
      label: 'Bolt', 
      backgroundColor: '#EAB308',  // yellow-500
      onClick: onShopClick 
    },
    { 
      icon: MessageSquare, 
      label: 'Üzenetek', 
      backgroundColor: '#D97706',  // amber-600
      onClick: undefined 
    },
    { 
      icon: BookOpen, 
      label: 'Leckék', 
      backgroundColor: '#B45309',  // amber-700
      onClick: onLessonsClick 
    },
    { 
      icon: Sparkles, 
      label: 'Speciális', 
      backgroundColor: '#EA580C',  // orange-600
      onClick: undefined 
    },
  ];

  // ===== EVENT HANDLERS =====
  
  // Menü elem klikk kezelése
  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
  };

  // ===== STYLES =====
  
  const styles = {
    // Fő container (bal oldali pozíció)
    container: {
      position: 'absolute' as const,
      left: 8,
      top: 111,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: SPACING.sm,
      zIndex: 10,
    },
    
    // Menü elem gomb container
    menuItemButton: {
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: 4,
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
    },
    
    // Menü elem gomb (letiltott)
    menuItemButtonDisabled: {
      position: 'relative' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: 4,
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'default',
      opacity: 0.7,
    },
    
    // Label szöveg
    labelText: {
      color: COLORS.white,
      fontSize: SIZES.fontXS,
      filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
    },
  };

  // Ikon container stílus generálása (minden menü elemhez egyedi)
  const getIconContainerStyle = (item: MenuItem, isActive: boolean) => ({
    width: 56,
    height: 56,
    backgroundColor: item.backgroundColor,
    borderRadius: SIZES.radiusLG,
    boxShadow: `0 10px 15px -3px ${COLORS.shadowMedium}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s',
  });

  return (
    <div style={styles.container}>
      {menuItems.map((item, index) => {
        const IconComponent = item.icon;
        const isDisabled = !item.onClick;
        
        return (
          <button
            key={index}
            onClick={() => handleMenuItemClick(item)}
            disabled={isDisabled}
            style={isDisabled ? styles.menuItemButtonDisabled : styles.menuItemButton}
            type="button"
          >
            {/* Ikon container */}
            <div 
              style={getIconContainerStyle(item, !isDisabled)}
              onMouseEnter={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              onMouseDown={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.transform = 'scale(0.95)';
                }
              }}
              onMouseUp={(e) => {
                if (!isDisabled) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
            >
              <IconComponent style={{ width: 28, height: 28, color: COLORS.white }} />
            </div>
            
            {/* Label */}
            <span style={styles.labelText}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
