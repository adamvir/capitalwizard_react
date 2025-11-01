import { ArrowLeft, Settings, Coins, BookOpen, Swords, Calendar, Crown, Trophy, RotateCcw, Save, AlertCircle, Info, Download, Upload, HardDrive, TrendingUp, Shuffle, Brain, BookOpenCheck, ShoppingBag, Flame, Gem } from 'lucide-react';
import { useState, useEffect, CSSProperties } from 'react';
import { getGameConfig, saveGameConfig, resetGameConfig, DEFAULT_CONFIG, GameConfig } from '../utils/gameConfig';
import { toast } from 'sonner@2.0.3';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { COLORS, SPACING, SIZES, SHADOWS } from '../utils/styleConstants';

interface ManagerPageProps {
  onBack: () => void;
}

// ============================================
// STYLE OBJEKTUMOK - React Native kompatibilis
// ============================================

const styles: Record<string, CSSProperties> = {
  // Container
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
    overflowY: 'auto',
    // scrollbarWidth: 'none', // Firefox
    // msOverflowStyle: 'none', // IE/Edge
  },

  // Header
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: `linear-gradient(to right, ${COLORS.secondary}, #4F46E5)`,
    color: COLORS.white,
    padding: SPACING.base,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerButton: {
    padding: SPACING.sm,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: SIZES.radiusLG,
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  headerTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  headerSubtitle: {
    color: '#E9D5FF',
    fontSize: SIZES.fontXS,
  },
  unsavedChangesIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingLeft: SPACING.md,
    paddingRight: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    borderRadius: SIZES.radiusFull,
  },
  unsavedChangesText: {
    fontSize: SIZES.fontSM,
  },

  // Content
  content: {
    padding: SPACING.base,
    paddingBottom: 96,
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.xl,
  },

  // App Info Section
  appInfoContainer: {
    background: `linear-gradient(to bottom right, #EEF2FF, #F3E8FF)`,
    borderRadius: SIZES.radiusXL,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: SPACING.lg,
    border: `2px solid #C7D2FE`,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  iconContainer: (fromColor: string, toColor: string): CSSProperties => ({
    width: 40,
    height: 40,
    background: `linear-gradient(to bottom right, ${fromColor}, ${toColor})`,
    borderRadius: SIZES.radiusLG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  sectionTitle: (color: string): CSSProperties => ({
    color,
    margin: 0,
  }),
  sectionSubtitle: (color: string): CSSProperties => ({
    fontSize: SIZES.fontXS,
    color,
    margin: 0,
  }),

  // Info boxes
  storageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    border: '1px solid #C7D2FE',
  },
  storageContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storageLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  storageLabelText: {
    fontSize: SIZES.fontSM,
    color: '#312E81',
  },
  storageValue: {
    color: '#4338CA',
  },

  // Sync info box
  syncInfoBox: {
    backgroundColor: '#EFF6FF',
    border: '2px solid #BFDBFE',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.md,
    marginBottom: SPACING.base,
  },
  syncInfoContent: {
    display: 'flex',
    gap: SPACING.sm,
  },
  syncInfoText: {
    fontSize: SIZES.fontXS,
    color: '#1E40AF',
  },
  syncInfoTextStrong: {
    marginBottom: SPACING.xs,
  },
  syncInfoList: {
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
  },

  // User guide box
  userGuideBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: SIZES.radiusLG,
    padding: SPACING.base,
    border: '1px solid #C7D2FE',
  },
  userGuideTitle: {
    fontSize: SIZES.fontSM,
    color: '#312E81',
    marginBottom: SPACING.sm,
  },
  userGuideContent: {
    fontSize: SIZES.fontXS,
    color: '#4338CA',
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.sm,
  },
  userGuideList: {
    marginLeft: SPACING.sm,
  },
  userGuideSectionTitle: {
    marginTop: SPACING.md,
  },

  // Action Buttons Container
  actionButtonsContainer: {
    display: 'flex',
    gap: SPACING.md,
  },

  // Settings Card Base
  settingsCard: (borderColor: string): CSSProperties => ({
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusXL,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: SPACING.base,
    border: `2px solid ${borderColor}`,
  }),

  // Input Label
  inputLabel: (color: string): CSSProperties => ({
    fontSize: SIZES.fontSM,
    color,
    marginBottom: SPACING.xs,
    display: 'block',
  }),
  inputLabelSmall: (color: string): CSSProperties => ({
    fontSize: SIZES.fontXS,
    color,
    marginBottom: SPACING.sm,
    display: 'block',
  }),
  inputHelperText: (color: string): CSSProperties => ({
    fontSize: SIZES.fontXS,
    color,
    marginTop: SPACING.xs,
  }),

  // Space between inputs
  inputsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.md,
  },

  // Grid layout for multiple inputs
  gridContainer2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: SPACING.md,
  },
  gridContainer3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: SPACING.sm,
  },

  // Info card at bottom
  infoCard: {
    backgroundColor: '#EFF6FF',
    border: '2px solid #BFDBFE',
    borderRadius: SIZES.radiusXL,
    padding: SPACING.base,
  },
  infoCardContent: {
    display: 'flex',
    gap: SPACING.md,
  },
  infoCardText: {
    fontSize: SIZES.fontSM,
    color: '#1E40AF',
  },
  infoCardParagraph: {
    marginBottom: SPACING.sm,
  },
};

export function ManagerPage({ onBack }: ManagerPageProps) {
  const [config, setConfig] = useState<GameConfig>(getGameConfig());
  const [hasChanges, setHasChanges] = useState(false);
  const [storageSize, setStorageSize] = useState(0);

  // Calculate localStorage size
  useEffect(() => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    // Convert to MB (bytes to MB)
    setStorageSize(total / 1024 / 1024);
  }, []);

  useEffect(() => {
    const currentConfig = getGameConfig();
    const isDifferent = JSON.stringify(currentConfig) !== JSON.stringify(config);
    setHasChanges(isDifferent);
  }, [config]);

  const handleSave = () => {
    saveGameConfig(config);
    setHasChanges(false);
    toast.success('Beállítások mentve!');
  };

  const handleReset = () => {
    if (confirm('Biztosan visszaállítod az alapértelmezett beállításokat?')) {
      resetGameConfig();
      setConfig(DEFAULT_CONFIG);
      setHasChanges(false);
      toast.success('Alapértelmezett beállítások visszaállítva!');
    }
  };

  const updateConfig = (key: keyof GameConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleExportData = () => {
    try {
      const allData: Record<string, string> = {};
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          allData[key] = localStorage[key];
        }
      }
      
      // Add metadata
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        data: allData
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `rpg-game-full-backup-${timestamp}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('✅ Játékadatok exportálva! Fájl letöltve.', { duration: 4000 });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('❌ Export hiba történt!');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          
          // Handle both old format (direct data) and new format (with metadata)
          const data = parsed.data || parsed;
          
          if (confirm('⚠️ Biztosan felülírod a jelenlegi játékadatokat?\n\nEz importálja az összes mentett haladást, beállítást és állapotot.\nEz a művelet nem vonható vissza!')) {
            // Clear existing data
            localStorage.clear();
            
            // Import all data
            for (let key in data) {
              localStorage.setItem(key, data[key]);
            }
            
            // Reload config
            const newConfig = getGameConfig();
            setConfig(newConfig);
            
            toast.success('✅ Játékadatok sikeresen importálva! Az oldal újratöltődik...', { duration: 3000 });
            setTimeout(() => window.location.reload(), 1500);
          }
        } catch (error) {
          console.error('Import error:', error);
          toast.error('❌ Érvénytelen fájl formátum! Kérlek egy érvényes backup JSON fájlt válassz.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <button
            onClick={onBack}
            style={styles.headerButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft style={{ width: SIZES.iconLG, height: SIZES.iconLG }} />
          </button>
          <div style={styles.headerTitleContainer}>
            <Settings style={{ width: 28, height: 28 }} />
            <div>
              <h1 style={{ margin: 0 }}>Menedzser Panel</h1>
              <p style={styles.headerSubtitle}>Játék beállítások kezelése</p>
            </div>
          </div>
          {hasChanges && (
            <div style={styles.unsavedChangesIndicator}>
              <AlertCircle style={{ width: SIZES.iconSM, height: SIZES.iconSM }} />
              <span style={styles.unsavedChangesText}>Nem mentett változások</span>
            </div>
          )}
        </div>
      </div>

      <div style={styles.content}>
        {/* App Info Section */}
        <div style={styles.appInfoContainer}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#6366F1', '#7C3AED')}>
              <Info style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#312E81')}>App Info</h3>
              <p style={styles.sectionSubtitle('#4F46E5')}>Alkalmazás információk</p>
            </div>
          </div>

          {/* Storage Size */}
          <div style={styles.storageBox}>
            <div style={styles.storageContent}>
              <div style={styles.storageLabel}>
                <HardDrive style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#4F46E5' }} />
                <span style={styles.storageLabelText}>Adatméret</span>
              </div>
              <span style={styles.storageValue}>{storageSize.toFixed(3)} MB</span>
            </div>
          </div>

          {/* Info about data sync */}
          <div style={styles.syncInfoBox}>
            <div style={styles.syncInfoContent}>
              <Info style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#2563EB', flexShrink: 0, marginTop: 2 }} />
              <div style={styles.syncInfoText}>
                <p style={styles.syncInfoTextStrong}><strong>💾 Adatok szinkronizálása</strong></p>
                <p>Az adatok automatikusan mentődnek a böngésződben.</p>
                <p style={{ marginTop: SPACING.xs }}>Másik gépen való használathoz:</p>
                <ol style={{ ...styles.syncInfoList, listStyleType: 'decimal', listStylePosition: 'inside' }}>
                  <li>Nyisd meg a <strong>Fejlesztői Menüt</strong> (Dev gomb lent)</li>
                  <li>Kattints az <strong>"Állapot exportálása"</strong> gombra</li>
                  <li>Másik gépen importáld be a letöltött JSON fájlt</li>
                </ol>
              </div>
            </div>
          </div>

          {/* User Guide */}
          <div style={styles.userGuideBox}>
            <h4 style={styles.userGuideTitle}>📖 Felhasználói útmutató</h4>
            <div style={styles.userGuideContent}>
              <p><strong>v1.1 - Alapfunkciók:</strong></p>
              <ul style={{ ...styles.userGuideList, listStyleType: 'disc', listStylePosition: 'inside' }}>
                <li>Játékos profil és szintrendszer (max 100 szint)</li>
                <li>Arany és gyémánt valuta rendszer</li>
                <li>Napi sorozat számláló, naptár és széria pont</li>
                <li>Freemium előfizetési modell (Free, Pro, Master)</li>
                <li>Bolt rendszer - arany és gyémánt vásárlás</li>
              </ul>
              
              <p style={styles.userGuideSectionTitle}><strong>Egyetem (University):</strong></p>
              <ul style={{ ...styles.userGuideList, listStyleType: 'disc', listStylePosition: 'inside' }}>
                <li>Izometrikus campus térkép 6 épülettel</li>
                <li>3 különböző játéktípus (Párosító, Kvíz, Olvasó)</li>
                <li>XP és arany jutalmak teljesítés után</li>
                <li>Napi limitek Free felhasználóknak</li>
              </ul>
              
              <p style={styles.userGuideSectionTitle}><strong>Könyvtár (Library):</strong></p>
              <ul style={{ ...styles.userGuideList, listStyleType: 'disc', listStylePosition: 'inside' }}>
                <li>6 könyvespolc 15 pénzügyi témájú könyvvel</li>
                <li>1 napos és 30 napos kölcsönzési opciók</li>
                <li>Teljes könyv tartalom olvasó nézet</li>
                <li>Kölcsönzési státusz és lejárat követés</li>
              </ul>
              
              <p style={styles.userGuideSectionTitle}><strong>Küzdőtér (Arena):</strong></p>
              <ul style={{ ...styles.userGuideList, listStyleType: 'disc', listStylePosition: 'inside' }}>
                <li>Pénzügyi kvíz kérdések arany kockáztatással</li>
                <li>Minimum és maximum fogadási limitek</li>
                <li>Győzelem esetén dupla arany jutalom</li>
                <li>Napi limit Free felhasználóknak</li>
              </ul>
              
              <p style={styles.userGuideSectionTitle}><strong>Diák Profil:</strong></p>
              <ul style={{ ...styles.userGuideList, listStyleType: 'disc', listStylePosition: 'inside' }}>
                <li>Személyes adatok szerkesztése</li>
                <li>Statisztikák (szint, XP, arany, gyémánt)</li>
                <li>Előfizetési státusz megjelenítés</li>
                <li>localStorage alapú adatmentés</li>
              </ul>
              
              <p style={styles.userGuideSectionTitle}><strong>XP és Szintrendszer:</strong></p>
              <ul style={{ ...styles.userGuideList, listStyleType: 'disc', listStylePosition: 'inside' }}>
                <li>Leckék és Küzdőtér győzelmek XP-t adnak</li>
                <li>Küzdőtérben az XP a kiválasztott könyvek számával szorzódik</li>
                <li>Lineáris XP növekedés szintenként (állítható %)</li>
                <li>Maximális szint állítható (alapértelmezett: 100)</li>
                <li>Automatikus szintlépés és ünneplés</li>
              </ul>
              
              <p style={styles.userGuideSectionTitle}><strong>Széria Napló:</strong></p>
              <ul style={{ ...styles.userGuideList, listStyleType: 'disc', listStylePosition: 'inside' }}>
                <li>30 napos naptár nézet teljesítménnyel</li>
                <li>Jelenlegi és leghosszabb széria megjelenítése</li>
                <li>Széria pont vásárlás aranyért</li>
                <li>Kattintható széria számláló az állapotsorban</li>
              </ul>
              
              <p style={styles.userGuideSectionTitle}><strong>Bolt (Shop):</strong></p>
              <ul style={{ ...styles.userGuideList, listStyleType: 'disc', listStylePosition: 'inside' }}>
                <li>Széria pont vásárlás aranyért</li>
                <li>Arany vásárlás forintért (100, 500, 1K, 5K csomagok)</li>
                <li>Gyémánt vásárlás aranyért (1, 10, 50, 100 db)</li>
                <li>Minden ár beállítható a Manager panelban</li>
              </ul>
              
              <p style={styles.userGuideSectionTitle}><strong>Menedzser Panel:</strong></p>
              <ul style={{ ...styles.userGuideList, listStyleType: 'disc', listStylePosition: 'inside' }}>
                <li>Kezdő arany beállítása</li>
                <li>Könyvtári árak testreszabása</li>
                <li>Küzdőtér limitek és XP beállítások</li>
                <li>Küzdőtérhez választható könyvek max száma</li>
                <li>XP rendszer konfigurálása (alap XP, növekedés, max szint)</li>
                <li>Napi limitek konfigurálása</li>
                <li>Előfizetési árak beállítása</li>
                <li>Lecke jutalmak (XP és arany) testreszabása</li>
                <li>Játékmódok beállításai (Párosító, Kvíz, Olvasó)</li>
                <li>Bolt árak konfigurálása (széria, arany, gyémánt)</li>
                <li>Adatméret monitorozás</li>
              </ul>
              
              <p style={styles.userGuideSectionTitle}><strong>Technikai jellemzők:</strong></p>
              <ul style={{ ...styles.userGuideList, listStyleType: 'disc', listStylePosition: 'inside' }}>
                <li>React + TypeScript + Tailwind CSS</li>
                <li>iPhone 16 Pro Max méretű design</li>
                <li>localStorage alapú perzisztencia</li>
                <li>Valósághű iPhone keret Dynamic Island-del</li>
                <li>Responsív és optimalizált animációk</li>
                <li>Fantasy kristály-barlang design téma</li>
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div style={styles.actionButtonsContainer}>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white gap-2"
          >
            <Save className="w-5 h-5" />
            Mentés
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 border-2 border-purple-300 hover:bg-purple-50 gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Alapértelmezett
          </Button>
        </div>

        {/* Starting Gold */}
        <div style={styles.settingsCard('#FDE68A')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#F59E0B', '#D97706')}>
              <Coins style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#78350F')}>Kezdő arany</h3>
              <p style={styles.sectionSubtitle('#92400E')}>Reset után kapott arany</p>
            </div>
          </div>
          <Input
            type="number"
            value={config.initialGold}
            onChange={(e) => updateConfig('initialGold', parseInt(e.target.value) || 0)}
            className="text-lg border-2 border-amber-300 focus:border-amber-500"
          />
        </div>

        <Separator />

        {/* Library Settings */}
        <div style={styles.settingsCard('#BFDBFE')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#3B82F6', '#4F46E5')}>
              <BookOpen style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#1E3A8A')}>Könyvtár</h3>
              <p style={styles.sectionSubtitle('#1E40AF')}>Kölcsönzési díjak</p>
            </div>
          </div>
          <div style={styles.inputsContainer}>
            <div>
              <label style={styles.inputLabel('#1E40AF')}>1 napos kölcsönzés (arany)</label>
              <Input
                type="number"
                value={config.bookRental1Day}
                onChange={(e) => updateConfig('bookRental1Day', parseInt(e.target.value) || 0)}
                className="border-2 border-blue-300 focus:border-blue-500"
              />
            </div>
            <div>
              <label style={styles.inputLabel('#1E40AF')}>30 napos kölcsönzés (arany)</label>
              <Input
                type="number"
                value={config.bookRental30Days}
                onChange={(e) => updateConfig('bookRental30Days', parseInt(e.target.value) || 0)}
                className="border-2 border-blue-300 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Arena Settings */}
        <div style={styles.settingsCard('#FECACA')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#EF4444', '#F97316')}>
              <Swords style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#7F1D1D')}>Küzdőtér</h3>
              <p style={styles.sectionSubtitle('#991B1B')}>Fogadás limitek</p>
            </div>
          </div>
          <div style={styles.inputsContainer}>
            <div>
              <label style={styles.inputLabel('#991B1B')}>Minimum fogadás (arany)</label>
              <Input
                type="number"
                value={config.arenaMinBet}
                onChange={(e) => updateConfig('arenaMinBet', parseInt(e.target.value) || 0)}
                className="border-2 border-red-300 focus:border-red-500"
              />
            </div>
            <div>
              <label style={styles.inputLabel('#991B1B')}>Maximum fogadás (arany)</label>
              <Input
                type="number"
                value={config.arenaMaxBet}
                onChange={(e) => updateConfig('arenaMaxBet', parseInt(e.target.value) || 0)}
                className="border-2 border-red-300 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Daily Limits */}
        <div style={styles.settingsCard('#BBF7D0')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#10B981', '#059669')}>
              <Calendar style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#064E3B')}>Napi limitek</h3>
              <p style={styles.sectionSubtitle('#065F46')}>Free felhasználók limitjei</p>
            </div>
          </div>
          <div style={styles.inputsContainer}>
            <div>
              <label style={styles.inputLabel('#065F46')}>Küzdőtér játékok naponta</label>
              <Input
                type="number"
                value={config.freeDailyArenaGames}
                onChange={(e) => updateConfig('freeDailyArenaGames', parseInt(e.target.value) || 0)}
                className="border-2 border-green-300 focus:border-green-500"
              />
            </div>
            <div>
              <label style={styles.inputLabel('#065F46')}>Leckék naponta</label>
              <Input
                type="number"
                value={config.dailyLessonLimit}
                onChange={(e) => updateConfig('dailyLessonLimit', parseInt(e.target.value) || 0)}
                className="border-2 border-green-300 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Subscription Prices */}
        <div style={styles.settingsCard('#E9D5FF')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#8B5CF6', '#EC4899')}>
              <Crown style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#581C87')}>Előfizetési árak</h3>
              <p style={styles.sectionSubtitle('#6B21A8')}>Havi díjak Ft-ban</p>
            </div>
          </div>
          <div style={styles.inputsContainer}>
            <div>
              <label style={styles.inputLabel('#6B21A8')}>Professzionális (Ft/hó)</label>
              <Input
                type="number"
                value={config.subscriptionProPrice}
                onChange={(e) => updateConfig('subscriptionProPrice', parseInt(e.target.value) || 0)}
                className="border-2 border-purple-300 focus:border-purple-500"
              />
            </div>
            <div>
              <label style={styles.inputLabel('#6B21A8')}>Mester (Ft/hó)</label>
              <Input
                type="number"
                value={config.subscriptionMasterPrice}
                onChange={(e) => updateConfig('subscriptionMasterPrice', parseInt(e.target.value) || 0)}
                className="border-2 border-purple-300 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Lesson Rewards */}
        <div style={styles.settingsCard('#C7D2FE')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#6366F1', '#3B82F6')}>
              <Trophy style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#312E81')}>Lecke jutalmak</h3>
              <p style={styles.sectionSubtitle('#4338CA')}>XP és arany jutalmazás</p>
            </div>
          </div>
          <div style={styles.inputsContainer}>
            <div>
              <p style={styles.inputLabel('#4338CA')}>📊 Jutalmak játéktípus szerint</p>
            </div>
            
            {/* XP Rewards by Game Type */}
            <div>
              <label style={styles.inputLabelSmall('#4338CA')}>XP pontok</label>
              <div style={styles.gridContainer3}>
                <div>
                  <label style={styles.inputLabelSmall('#065F46')}>Kvíz (Könnyű)</label>
                  <Input
                    type="number"
                    value={config.xpEasy}
                    onChange={(e) => updateConfig('xpEasy', parseInt(e.target.value) || 0)}
                    className="border-2 border-green-300 focus:border-green-500"
                  />
                </div>
                <div>
                  <label style={styles.inputLabelSmall('#92400E')}>Párosító (Közepes)</label>
                  <Input
                    type="number"
                    value={config.xpMedium}
                    onChange={(e) => updateConfig('xpMedium', parseInt(e.target.value) || 0)}
                    className="border-2 border-yellow-300 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label style={styles.inputLabelSmall('#991B1B')}>Olvasó (Nehéz)</label>
                  <Input
                    type="number"
                    value={config.xpHard}
                    onChange={(e) => updateConfig('xpHard', parseInt(e.target.value) || 0)}
                    className="border-2 border-red-300 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Gold Rewards by Game Type */}
            <div>
              <label style={styles.inputLabelSmall('#4338CA')}>Arany jutalmak</label>
              <div style={styles.gridContainer3}>
                <div>
                  <label style={styles.inputLabelSmall('#065F46')}>Kvíz (Könnyű)</label>
                  <Input
                    type="number"
                    value={config.goldEasy}
                    onChange={(e) => updateConfig('goldEasy', parseInt(e.target.value) || 0)}
                    className="border-2 border-green-300 focus:border-green-500"
                  />
                </div>
                <div>
                  <label style={styles.inputLabelSmall('#92400E')}>Párosító (Közepes)</label>
                  <Input
                    type="number"
                    value={config.goldMedium}
                    onChange={(e) => updateConfig('goldMedium', parseInt(e.target.value) || 0)}
                    className="border-2 border-yellow-300 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label style={styles.inputLabelSmall('#991B1B')}>Olvasó (Nehéz)</label>
                  <Input
                    type="number"
                    value={config.goldHard}
                    onChange={(e) => updateConfig('goldHard', parseInt(e.target.value) || 0)}
                    className="border-2 border-red-300 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Repeated Lessons Rewards */}
        <div style={styles.settingsCard('#DDD6FE')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#8B5CF6', '#7C3AED')}>
              <BookOpenCheck style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#581C87')}>Elvégzett leckék</h3>
              <p style={styles.sectionSubtitle('#6B21A8')}>Már elvégzett leckék jutalmak</p>
            </div>
          </div>
          <div style={styles.inputsContainer}>
            <div>
              <label style={styles.inputLabel('#6B21A8')}>XP pont / elvégzett lecke</label>
              <Input
                type="number"
                value={config.repeatedLessonXp}
                onChange={(e) => updateConfig('repeatedLessonXp', parseInt(e.target.value) || 0)}
                className="border-2 border-violet-300 focus:border-violet-500"
              />
              <p style={styles.inputHelperText('#7C3AED')}>Kisebb jutalom már teljesített leckékért</p>
            </div>
            <div>
              <label style={styles.inputLabel('#6B21A8')}>Arany / elvégzett lecke</label>
              <Input
                type="number"
                value={config.repeatedLessonGold}
                onChange={(e) => updateConfig('repeatedLessonGold', parseInt(e.target.value) || 0)}
                className="border-2 border-violet-300 focus:border-violet-500"
              />
              <p style={styles.inputHelperText('#7C3AED')}>Arany jutalom ismétlő leckékért</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* XP System Settings */}
        <div style={styles.settingsCard('#A5F3FC')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#06B6D4', '#3B82F6')}>
              <TrendingUp style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#164E63')}>XP rendszer</h3>
              <p style={styles.sectionSubtitle('#155E75')}>Szintrendszer beállítások</p>
            </div>
          </div>
          <div style={styles.inputsContainer}>
            <div>
              <label style={styles.inputLabel('#155E75')}>Maximális szint</label>
              <Input
                type="number"
                value={config.maxLevel}
                onChange={(e) => updateConfig('maxLevel', parseInt(e.target.value) || 1)}
                className="border-2 border-cyan-300 focus:border-cyan-500"
              />
            </div>
            <div>
              <label style={styles.inputLabel('#155E75')}>Alap XP / szint</label>
              <Input
                type="number"
                value={config.baseXpPerLevel}
                onChange={(e) => updateConfig('baseXpPerLevel', parseInt(e.target.value) || 0)}
                className="border-2 border-cyan-300 focus:border-cyan-500"
              />
            </div>
            <div>
              <label style={styles.inputLabel('#155E75')}>XP növekedés / szint (%)</label>
              <Input
                type="number"
                value={config.xpGrowthPercentage}
                onChange={(e) => updateConfig('xpGrowthPercentage', parseInt(e.target.value) || 0)}
                className="border-2 border-cyan-300 focus:border-cyan-500"
              />
              <p style={styles.inputHelperText('#0E7490')}>Minden szint után ennyi %-kal nő a szükséges XP</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Arena XP Settings */}
        <div style={styles.settingsCard('#FED7AA')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#F97316', '#DC2626')}>
              <Trophy style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#7C2D12')}>Küzdőtér XP</h3>
              <p style={styles.sectionSubtitle('#9A3412')}>Arena tapasztalati pontok</p>
            </div>
          </div>
          <div style={styles.inputsContainer}>
            <div>
              <label style={styles.inputLabel('#9A3412')}>Alap XP / győzelem</label>
              <Input
                type="number"
                value={config.xpPerArenaWin}
                onChange={(e) => updateConfig('xpPerArenaWin', parseInt(e.target.value) || 0)}
                className="border-2 border-orange-300 focus:border-orange-500"
              />
              <p style={styles.inputHelperText('#C2410C')}>Ez szorozva lesz a kiválasztott könyvek számával</p>
            </div>
            <div>
              <label style={styles.inputLabel('#9A3412')}>Max kiválasztható könyvek</label>
              <Input
                type="number"
                value={config.maxBooksForArena}
                onChange={(e) => updateConfig('maxBooksForArena', parseInt(e.target.value) || 1)}
                className="border-2 border-orange-300 focus:border-orange-500"
              />
              <p style={styles.inputHelperText('#C2410C')}>Maximális könyvek száma arenában egyszerre</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Matching Game (Párosító) Settings */}
        <div style={styles.settingsCard('#FBCFE8')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#EC4899', '#F43F5E')}>
              <Shuffle style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#831843')}>Párosító játék</h3>
              <p style={styles.sectionSubtitle('#9F1239')}>Fogalom párosítás beállítások</p>
            </div>
          </div>
          <div style={styles.inputsContainer}>
            <div>
              <label style={styles.inputLabel('#9F1239')}>Párosítandó fogalmak száma</label>
              <Input
                type="number"
                value={config.matchingPairsCount}
                onChange={(e) => updateConfig('matchingPairsCount', parseInt(e.target.value) || 1)}
                className="border-2 border-pink-300 focus:border-pink-500"
              />
              <p style={styles.inputHelperText('#BE185D')}>Hány párt kell párosítani a játék során</p>
            </div>
            <div>
              <label style={styles.inputLabel('#9F1239')}>Rendelkezésre álló idő (mp)</label>
              <Input
                type="number"
                value={config.matchingTimeLimit}
                onChange={(e) => updateConfig('matchingTimeLimit', parseInt(e.target.value) || 1)}
                className="border-2 border-pink-300 focus:border-pink-500"
              />
              <p style={styles.inputHelperText('#BE185D')}>Másodpercben megadva</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Quiz Game (Kvíz) Settings */}
        <div style={styles.settingsCard('#99F6E4')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#14B8A6', '#06B6D4')}>
              <Brain style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#134E4A')}>Kvíz játék</h3>
              <p style={styles.sectionSubtitle('#115E59')}>Kvíz kérdések beállítások</p>
            </div>
          </div>
          <div style={styles.inputsContainer}>
            <div>
              <label style={styles.inputLabel('#115E59')}>Kvíz kérdések száma</label>
              <Input
                type="number"
                value={config.quizQuestionsCount}
                onChange={(e) => updateConfig('quizQuestionsCount', parseInt(e.target.value) || 1)}
                className="border-2 border-teal-300 focus:border-teal-500"
              />
              <p style={styles.inputHelperText('#0F766E')}>Összesen hány kérdés legyen a kvízben</p>
            </div>
            <div>
              <label style={styles.inputLabel('#115E59')}>Válaszok száma / kérdés</label>
              <Input
                type="number"
                value={config.quizAnswersPerQuestion}
                onChange={(e) => updateConfig('quizAnswersPerQuestion', parseInt(e.target.value) || 2)}
                className="border-2 border-teal-300 focus:border-teal-500"
              />
              <p style={styles.inputHelperText('#0F766E')}>Hány válaszlehetőség jelenjen meg kérdésenként</p>
            </div>
            <div>
              <label style={styles.inputLabel('#115E59')}>Minimális helyes válaszok (sikerhez)</label>
              <Input
                type="number"
                value={config.quizMinCorrectAnswers}
                onChange={(e) => updateConfig('quizMinCorrectAnswers', parseInt(e.target.value) || 1)}
                className="border-2 border-teal-300 focus:border-teal-500"
              />
              <p style={styles.inputHelperText('#0F766E')}>Ennyi helyes válasz kell a győzelemhez</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Reading Game (Olvasó) Settings */}
        <div style={styles.settingsCard('#DDD6FE')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#8B5CF6', '#7C3AED')}>
              <BookOpenCheck style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#581C87')}>Olvasó játék</h3>
              <p style={styles.sectionSubtitle('#6B21A8')}>Olvasás utáni kérdések beállítások</p>
            </div>
          </div>
          <div style={styles.inputsContainer}>
            <div>
              <label style={styles.inputLabel('#6B21A8')}>Kérdések száma</label>
              <Input
                type="number"
                value={config.readingQuestionsCount}
                onChange={(e) => updateConfig('readingQuestionsCount', parseInt(e.target.value) || 1)}
                className="border-2 border-violet-300 focus:border-violet-500"
              />
              <p style={styles.inputHelperText('#7C3AED')}>Hány kérdést kell megválaszolni az olvasás után</p>
            </div>
            <div>
              <label style={styles.inputLabel('#6B21A8')}>Minimális helyes válaszok (sikerhez)</label>
              <Input
                type="number"
                value={config.readingMinCorrectAnswers}
                onChange={(e) => updateConfig('readingMinCorrectAnswers', parseInt(e.target.value) || 1)}
                className="border-2 border-violet-300 focus:border-violet-500"
              />
              <p style={styles.inputHelperText('#7C3AED')}>Ennyi helyes válasz kell a győzelemhez</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Stage/Milestone System Settings */}
        <div style={styles.settingsCard('#FDE68A')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#F59E0B', '#D97706')}>
              <Trophy style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#78350F')}>Szakasz rendszer</h3>
              <p style={styles.sectionSubtitle('#92400E')}>Mérföldkő jutalmak beállítása</p>
            </div>
          </div>
          <div style={styles.inputsContainer}>
            <div>
              <label style={styles.inputLabel('#92400E')}>Gyémántok mérföldkőnként</label>
              <Input
                type="number"
                value={config.diamondsPerMilestone}
                onChange={(e) => updateConfig('diamondsPerMilestone', parseInt(e.target.value) || 1)}
                className="border-2 border-amber-300 focus:border-amber-500"
              />
              <p style={styles.inputHelperText('#B45309')}>Ennyi gyémántot kap a játékos minden 6 szakasz teljesítése után</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Shop Settings - Streak Freeze */}
        <div style={styles.settingsCard('#FED7AA')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#F97316', '#DC2626')}>
              <Flame style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#7C2D12')}>Széria Védelem Bolt</h3>
              <p style={styles.sectionSubtitle('#9A3412')}>Széria pont vásárlási ár</p>
            </div>
          </div>
          <div>
            <label style={styles.inputLabel('#9A3412')}>Széria Pont ára (aranyban)</label>
            <Input
              type="number"
              value={config.streakFreezeGoldCost}
              onChange={(e) => updateConfig('streakFreezeGoldCost', parseInt(e.target.value) || 0)}
              className="border-2 border-orange-300 focus:border-orange-500"
            />
            <p style={styles.inputHelperText('#C2410C')}>Ennyi aranyba kerül 1 széria pont vásárlása</p>
          </div>
        </div>

        <Separator />

        {/* Shop Settings - Gold Purchase */}
        <div style={styles.settingsCard('#FEF3C7')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#EAB308', '#F97316')}>
              <Coins style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#713F12')}>Arany vásárlás (forintért)</h3>
              <p style={styles.sectionSubtitle('#854D0E')}>Arany csomagok árai HUF-ban</p>
            </div>
          </div>
          <div style={styles.gridContainer2}>
            <div>
              <label style={styles.inputLabel('#854D0E')}>100 arany ára</label>
              <Input
                type="number"
                value={config.gold100Price}
                onChange={(e) => updateConfig('gold100Price', parseInt(e.target.value) || 0)}
                className="border-2 border-yellow-300 focus:border-yellow-500"
              />
              <p style={styles.inputHelperText('#A16207')}>Ft</p>
            </div>
            <div>
              <label style={styles.inputLabel('#854D0E')}>500 arany ára</label>
              <Input
                type="number"
                value={config.gold500Price}
                onChange={(e) => updateConfig('gold500Price', parseInt(e.target.value) || 0)}
                className="border-2 border-yellow-300 focus:border-yellow-500"
              />
              <p style={styles.inputHelperText('#A16207')}>Ft</p>
            </div>
            <div>
              <label style={styles.inputLabel('#854D0E')}>1,000 arany ára</label>
              <Input
                type="number"
                value={config.gold1000Price}
                onChange={(e) => updateConfig('gold1000Price', parseInt(e.target.value) || 0)}
                className="border-2 border-yellow-300 focus:border-yellow-500"
              />
              <p style={styles.inputHelperText('#A16207')}>Ft</p>
            </div>
            <div>
              <label style={styles.inputLabel('#854D0E')}>5,000 arany ára</label>
              <Input
                type="number"
                value={config.gold5000Price}
                onChange={(e) => updateConfig('gold5000Price', parseInt(e.target.value) || 0)}
                className="border-2 border-yellow-300 focus:border-yellow-500"
              />
              <p style={styles.inputHelperText('#A16207')}>Ft</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Shop Settings - Diamond Purchase */}
        <div style={styles.settingsCard('#A5F3FC')}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconContainer('#06B6D4', '#3B82F6')}>
              <Gem style={{ width: SIZES.iconLG, height: SIZES.iconLG, color: COLORS.white }} />
            </div>
            <div>
              <h3 style={styles.sectionTitle('#164E63')}>Gyémánt vásárlás (aranyért)</h3>
              <p style={styles.sectionSubtitle('#155E75')}>Gyémánt csomagok árai aranyban</p>
            </div>
          </div>
          <div style={styles.gridContainer2}>
            <div>
              <label style={styles.inputLabel('#155E75')}>1 gyémánt ára</label>
              <Input
                type="number"
                value={config.diamond1GoldCost}
                onChange={(e) => updateConfig('diamond1GoldCost', parseInt(e.target.value) || 0)}
                className="border-2 border-cyan-300 focus:border-cyan-500"
              />
              <p style={styles.inputHelperText('#0E7490')}>arany</p>
            </div>
            <div>
              <label style={styles.inputLabel('#155E75')}>10 gyémánt ára</label>
              <Input
                type="number"
                value={config.diamond10GoldCost}
                onChange={(e) => updateConfig('diamond10GoldCost', parseInt(e.target.value) || 0)}
                className="border-2 border-cyan-300 focus:border-cyan-500"
              />
              <p style={styles.inputHelperText('#0E7490')}>arany</p>
            </div>
            <div>
              <label style={styles.inputLabel('#155E75')}>50 gyémánt ára</label>
              <Input
                type="number"
                value={config.diamond50GoldCost}
                onChange={(e) => updateConfig('diamond50GoldCost', parseInt(e.target.value) || 0)}
                className="border-2 border-cyan-300 focus:border-cyan-500"
              />
              <p style={styles.inputHelperText('#0E7490')}>arany</p>
            </div>
            <div>
              <label style={styles.inputLabel('#155E75')}>100 gyémánt ára</label>
              <Input
                type="number"
                value={config.diamond100GoldCost}
                onChange={(e) => updateConfig('diamond100GoldCost', parseInt(e.target.value) || 0)}
                className="border-2 border-cyan-300 focus:border-cyan-500"
              />
              <p style={styles.inputHelperText('#0E7490')}>arany</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Info Card */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardContent}>
            <AlertCircle style={{ width: SIZES.iconBase, height: SIZES.iconBase, color: '#2563EB', flexShrink: 0, marginTop: 2 }} />
            <div style={styles.infoCardText}>
              <p style={styles.infoCardParagraph}>A módosítások azonnal érvénybe lépnek mentés után.</p>
              <p>Az alapértelmezett beállítások visszaállítása törli az összes egyéni beállítást.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
