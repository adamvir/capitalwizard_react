/**
 * Data Sync Utilities
 * 
 * Provides functions for exporting, importing, and syncing game data
 * across devices using JSON files or URL parameters.
 */

export interface GameBackup {
  exportDate: string;
  version: string;
  data: Record<string, string>;
}

/**
 * Export all localStorage data as a JSON object
 */
export function exportGameData(): GameBackup {
  const allData: Record<string, string> = {};
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      allData[key] = localStorage[key];
    }
  }
  
  return {
    exportDate: new Date().toISOString(),
    version: '1.0',
    data: allData
  };
}

/**
 * Import game data from a backup object
 */
export function importGameData(backup: GameBackup): boolean {
  try {
    // Handle both old format (direct data) and new format (with metadata)
    const data = backup.data || (backup as any);
    
    // Clear existing data
    localStorage.clear();
    
    // Import all data
    for (let key in data) {
      localStorage.setItem(key, data[key]);
    }
    
    console.log('✅ Game data imported successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to import game data:', error);
    return false;
  }
}

/**
 * Download game data as a JSON file
 */
export function downloadGameBackup(): void {
  const backup = exportGameData();
  const dataStr = JSON.stringify(backup, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  link.download = `rpg-game-backup-${timestamp}.json`;
  
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Upload game data from a JSON file
 */
export function uploadGameBackup(file: File): Promise<GameBackup> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target?.result as string);
        resolve(backup);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Get data size in MB
 */
export function getStorageSize(): number {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  // Convert to MB
  return total / 1024 / 1024;
}

/**
 * Compress data for URL sharing (base64 encoded)
 * Note: This may not work for large datasets
 */
export function compressDataForURL(): string {
  const backup = exportGameData();
  const jsonStr = JSON.stringify(backup);
  return btoa(jsonStr);
}

/**
 * Decompress data from URL parameter
 */
export function decompressDataFromURL(compressed: string): GameBackup | null {
  try {
    const jsonStr = atob(compressed);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to decompress URL data:', error);
    return null;
  }
}

/**
 * Auto-save to browser's IndexedDB (future enhancement)
 * This would provide automatic cloud-like sync across same browser
 */
export function enableAutoSync(): void {
  // Listen for changes to localStorage
  window.addEventListener('storage', (e) => {
    console.log('Storage changed:', e.key);
    // Could trigger auto-backup here
  });
  
  // Periodic backup (every 5 minutes)
  setInterval(() => {
    const backup = exportGameData();
    sessionStorage.setItem('latest_backup', JSON.stringify(backup));
    console.log('📦 Auto-backup created');
  }, 5 * 60 * 1000);
}
