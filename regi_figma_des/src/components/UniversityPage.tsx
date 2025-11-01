import { ArrowLeft, ChevronUp, Map } from 'lucide-react';
import campusMap from 'figma:asset/c558539c9d306455dfd5af15f072594f408ff9a0.png';
import { Building2, BookOpen, Users, FileCheck, GraduationCap, Home } from 'lucide-react';
import { useState, CSSProperties } from 'react';
import { LibraryPage } from './LibraryPage';
import { COLORS, SPACING, SIZES } from '../utils/styleConstants';

interface UniversityPageProps {
  onBack: () => void;
  onOpenBookView: (bookTitle: string) => void;
  coins: number;
  onCoinsChange: (newCoins: number) => void;
}

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  container: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  // Header
  header: {
    position: 'relative',
    zIndex: 30,
    paddingLeft: SPACING.base,
    paddingRight: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.base,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    color: COLORS.white,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },

  // Campus Container
  campusContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundContainer: {
    position: 'absolute',
    inset: 0,
  },
  campusImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  darkOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(88, 28, 135, 0.3), rgba(15, 23, 42, 0.5))',
  },

  // Crystal effects
  crystalContainer: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  crystal: (top?: number, left?: number, right?: number, bottom?: number, width?: number, height?: number, rotation?: string, delay?: string): CSSProperties => ({
    position: 'absolute',
    top,
    left,
    right,
    bottom,
    width,
    height,
    background: 'linear-gradient(to top, rgba(147, 51, 234, 0.3), rgba(192, 132, 252, 0.15))',
    transform: rotation,
    borderRadius: '12px 12px 0 0',
    filter: 'blur(4px)',
    animation: 'pulse 2s infinite',
    animationDelay: delay,
  }),

  // Title
  titleContainer: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.base,
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.font3XL,
    marginBottom: SPACING.xs,
    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
    margin: 0,
  },
  subtitle: {
    color: '#E9D5FF',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
    margin: 0,
  },

  // Map placeholder
  mapPlaceholder: {
    position: 'relative',
    zIndex: 10,
    flex: 1,
  },

  // Bottom Menu
  bottomMenuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
    transition: 'opacity 0.3s',
    bottom: 'auto',
    top: '-100vh',
  },
  slideUpPanel: (menuOpen: boolean): CSSProperties => ({
    position: 'relative',
    transition: 'transform 0.5s ease-out',
    transform: menuOpen ? 'translateY(0)' : 'translateY(calc(100% - 56px))',
  }),

  // Menu Tab/Handle
  tabContainer: {
    paddingLeft: SPACING.base,
    paddingRight: SPACING.base,
  },
  tabButton: {
    width: '100%',
    background: 'linear-gradient(to right, rgba(147, 51, 234, 0.9), rgba(59, 130, 246, 0.9))',
    backdropFilter: 'blur(16px)',
    borderTop: '2px solid rgba(168, 85, 247, 0.4)',
    borderLeft: '2px solid rgba(168, 85, 247, 0.4)',
    borderRight: '2px solid rgba(168, 85, 247, 0.4)',
    borderBottom: 'none',
    borderRadius: '24px 24px 0 0',
    boxShadow: '0 8px 16px rgba(147, 51, 234, 0.3)',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  tabContent: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  tabText: {
    color: COLORS.white,
    margin: 0,
  },
  chevronIcon: (menuOpen: boolean): CSSProperties => ({
    width: SIZES.iconBase,
    height: SIZES.iconBase,
    color: COLORS.white,
    transition: 'transform 0.5s',
    transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  }),

  // Menu Content
  menuContent: {
    background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(88, 28, 135, 0.95))',
    backdropFilter: 'blur(16px)',
    borderTop: '1px solid rgba(168, 85, 247, 0.3)',
    boxShadow: '0 8px 16px rgba(147, 51, 234, 0.2)',
  },
  buildingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: SPACING.sm,
    padding: SPACING.base,
  },

  // Building Button
  buildingButton: (isSelected: boolean): CSSProperties => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    borderRadius: SIZES.radiusLG,
    padding: '10px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    border: isSelected ? '2px solid white' : 'none',
    outline: isSelected ? '2px solid rgba(15, 23, 42, 0.5)' : 'none',
    outlineOffset: isSelected ? '2px' : '0',
  }),
  buildingNumberBadge: {
    flexShrink: 0,
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  buildingNumberText: {
    color: '#0F172A',
  },
  buildingName: {
    color: COLORS.white,
    fontSize: SIZES.fontSM,
    flex: 1,
    textAlign: 'left',
    lineHeight: 1.2,
  },
  buildingGlow: {
    position: 'absolute',
    inset: 0,
    borderRadius: SIZES.radiusLG,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    transition: 'all 0.3s',
    pointerEvents: 'none',
  },

  // Selected Building Modal
  selectedBuildingModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 40,
    width: '85%',
    maxWidth: '400px',
  },
  modalContent: {
    background: 'linear-gradient(to right, rgba(15, 23, 42, 0.98), rgba(88, 28, 135, 0.98))',
    backdropFilter: 'blur(24px)',
    border: '2px solid rgba(168, 85, 247, 0.5)',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.lg,
    boxShadow: '0 8px 16px rgba(147, 51, 234, 0.3)',
    animation: 'zoomIn 0.3s ease-out',
  },
  modalInner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: SPACING.base,
  },
  modalIconContainer: {
    padding: SPACING.base,
    borderRadius: SIZES.radiusXL,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    flexShrink: 0,
  },
  modalTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  modalNumberBadge: {
    width: SIZES.iconLG,
    height: SIZES.iconLG,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalNumberText: {
    color: '#0F172A',
    fontSize: SIZES.fontSM,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: SIZES.fontXL,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    margin: 0,
  },
  modalSubtitle: {
    color: '#D8B4FE',
    margin: 0,
  },
  modalDescription: {
    color: 'rgba(233, 213, 255, 0.7)',
    fontSize: SIZES.fontSM,
    marginTop: SPACING.sm,
    margin: 0,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: COLORS.white,
    transition: 'background-color 0.3s',
    cursor: 'pointer',
    border: 'none',
  },

  // Library Page Overlay
  libraryOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
  },
};

// Building color gradients
const buildingGradients: Record<string, string> = {
  reception: 'linear-gradient(to bottom right, #A855F7, #7C3AED)',
  library: 'linear-gradient(to bottom right, #3B82F6, #1D4ED8)',
  lecture: 'linear-gradient(to bottom right, #6366F1, #4338CA)',
  exam: 'linear-gradient(to bottom right, #EF4444, #B91C1C)',
  office: 'linear-gradient(to bottom right, #10B981, #047857)',
  dorm: 'linear-gradient(to bottom right, #F97316, #C2410C)',
};

export function UniversityPage({ onBack, onOpenBookView, coins, onCoinsChange }: UniversityPageProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  const buildings = [
    { 
      id: 'reception', 
      name: 'Recepció', 
      icon: Building2, 
      color: 'from-purple-500 to-purple-700',
      number: 1
    },
    { 
      id: 'library', 
      name: 'Könyvtár', 
      icon: BookOpen, 
      color: 'from-blue-500 to-blue-700',
      number: 2
    },
    { 
      id: 'lecture', 
      name: 'Előadó', 
      icon: Users, 
      color: 'from-indigo-500 to-indigo-700',
      number: 3
    },
    { 
      id: 'exam', 
      name: 'Vizsgáztató', 
      icon: FileCheck, 
      color: 'from-red-500 to-red-700',
      number: 4
    },
    { 
      id: 'office', 
      name: 'Tanulmányi osztály', 
      icon: GraduationCap, 
      color: 'from-green-500 to-green-700',
      number: 5
    },
    { 
      id: 'dorm', 
      name: 'Kollégium', 
      icon: Home, 
      color: 'from-orange-500 to-orange-700',
      number: 6
    },
  ];

  return (
    <div style={styles.container}>
      {/* Header with back button */}
      <div style={styles.header}>
        <button
          onClick={onBack}
          style={styles.backButton}
          onMouseEnter={(e) => e.currentTarget.style.color = '#D8B4FE'}
          onMouseLeave={(e) => e.currentTarget.style.color = COLORS.white}
        >
          <ArrowLeft style={{ width: SIZES.iconLG, height: SIZES.iconLG }} />
          <span>Vissza</span>
        </button>
      </div>

      {/* University Campus */}
      <div style={styles.campusContainer}>
        {/* Background image with overlay */}
        <div style={styles.backgroundContainer}>
          <img 
            src={campusMap}
            alt="University Campus Map"
            style={styles.campusImage}
          />
          {/* Dark overlay for better contrast with fantasy theme */}
          <div style={styles.darkOverlay}></div>
          
          {/* Fantasy crystal effects */}
          <div style={styles.crystalContainer}>
            <div style={styles.crystal(40, 40, undefined, undefined, 80, 112, 'rotate(12deg)', '0s')}></div>
            <div style={styles.crystal(80, undefined, 64, undefined, 64, 96, 'rotate(-6deg)', '1s')}></div>
            <div style={styles.crystal(undefined, 80, undefined, 128, 48, 80, 'rotate(6deg)', '2s')}></div>
          </div>
        </div>

        {/* Title */}
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>Egyetemi Város</h1>
          <p style={styles.subtitle}>Válassz egy épületet a listából!</p>
        </div>

        {/* Map Image - No interactive elements on map */}
        <div style={styles.mapPlaceholder}></div>

        {/* Bottom Slide-Up Menu */}
        <div style={styles.bottomMenuContainer}>
          {/* Backdrop */}
          {menuOpen && (
            <div 
              style={styles.backdrop}
              onClick={() => setMenuOpen(false)}
            />
          )}

          {/* Slide-up panel */}
          <div style={styles.slideUpPanel(menuOpen)}>
            {/* Tab/Handle to open menu */}
            <div style={styles.tabContainer}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={styles.tabButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, #9333EA, #3B82F6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, rgba(147, 51, 234, 0.9), rgba(59, 130, 246, 0.9))';
                }}
              >
                <div style={styles.tabContent}>
                  <Map style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: COLORS.white }} />
                  <span style={styles.tabText}>Épületek Térképe</span>
                </div>
                <ChevronUp style={styles.chevronIcon(menuOpen)} />
              </button>
            </div>

            {/* Menu content */}
            <div style={styles.menuContent}>
              {/* Building Grid */}
              <div style={styles.buildingsGrid}>
                {buildings.map((building) => (
                  <button
                    key={building.id}
                    onClick={() => {
                      setSelectedBuilding(building.id);
                      setMenuOpen(false);
                      if (building.id === 'library') {
                        setShowLibrary(true);
                      }
                    }}
                    style={{
                      ...styles.buildingButton(selectedBuilding === building.id),
                      background: buildingGradients[building.id],
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {/* Number badge */}
                    <div style={styles.buildingNumberBadge}>
                      <span style={styles.buildingNumberText}>{building.number}</span>
                    </div>
                    
                    {/* Building icon */}
                    <building.icon style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: COLORS.white, flexShrink: 0, strokeWidth: 2.5 }} />
                    
                    {/* Building name */}
                    <span style={styles.buildingName}>{building.name}</span>

                    {/* Glow effect */}
                    <div 
                      style={styles.buildingGlow}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                      }}
                    ></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected building detailed info */}
        {selectedBuilding && selectedBuilding !== 'library' && (
          <div style={styles.selectedBuildingModal}>
            <div style={styles.modalContent}>
              <div style={styles.modalInner}>
                {buildings.find(b => b.id === selectedBuilding)?.icon && (
                  <div style={{
                    ...styles.modalIconContainer,
                    background: buildingGradients[selectedBuilding],
                  }}>
                    {(() => {
                      const Icon = buildings.find(b => b.id === selectedBuilding)!.icon;
                      return <Icon style={{ width: 32, height: 32, color: COLORS.white, strokeWidth: 2.5 }} />;
                    })()}
                  </div>
                )}
                <div style={styles.modalTextContainer}>
                  <div style={styles.modalHeader}>
                    <div style={styles.modalNumberBadge}>
                      <span style={styles.modalNumberText}>{buildings.find(b => b.id === selectedBuilding)?.number}</span>
                    </div>
                    <h3 style={styles.modalTitle}>{buildings.find(b => b.id === selectedBuilding)?.name}</h3>
                  </div>
                  <p style={styles.modalSubtitle}>Hamarosan elérhető...</p>
                  <p style={styles.modalDescription}>
                    Itt tudsz majd különböző tevékenységeket végezni az egyetemen.
                  </p>
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBuilding(null);
                }}
                style={styles.closeButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Library Page */}
      {showLibrary && (
        <div style={styles.libraryOverlay}>
          <LibraryPage 
            onBack={() => {
              setShowLibrary(false);
              setSelectedBuilding(null);
            }} 
            onOpenBookView={onOpenBookView}
            coins={coins}
            onCoinsChange={onCoinsChange}
          />
        </div>
      )}
    </div>
  );
}
