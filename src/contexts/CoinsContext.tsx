/**
 * ============================================
 * COINS CONTEXT
 * ============================================
 *
 * Globális state management a coins (aranyak) és gems (drágakövek) kezelésére.
 * Minden screen elérheti és módosíthatja az egyenleget.
 *
 * HASZNÁLAT:
 *
 * 1. Wrap the app with CoinsProvider in App.tsx or MainScreen.tsx:
 *    <CoinsProvider>
 *      <NavigationContainer>...</NavigationContainer>
 *    </CoinsProvider>
 *
 * 2. Use in any screen:
 *    const { coins, gems, setCoins, setGems, addCoins, subtractCoins } = useCoins();
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// TYPES
// ============================================

interface CoinsContextType {
  coins: number;
  gems: number;
  setCoins: (amount: number) => void;
  setGems: (amount: number) => void;
  addCoins: (amount: number) => void;
  subtractCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  subtractGems: (amount: number) => void;
  reloadBalance: () => Promise<void>;
}

// ============================================
// CONTEXT
// ============================================

const CoinsContext = createContext<CoinsContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

interface CoinsProviderProps {
  children: ReactNode;
}

export function CoinsProvider({ children }: CoinsProviderProps) {
  const [coins, setCoinsState] = useState(680); // Initial coins
  const [gems, setGemsState] = useState(50); // Initial gems

  // Set coins (with AsyncStorage persistence)
  const setCoins = async (amount: number) => {
    setCoinsState(amount);
    try {
      await AsyncStorage.setItem('userCoins', amount.toString());
    } catch (error) {
      console.error('Failed to save coins:', error);
    }
  };

  // Set gems (with AsyncStorage persistence)
  const setGems = async (amount: number) => {
    setGemsState(amount);
    try {
      await AsyncStorage.setItem('userGems', amount.toString());
    } catch (error) {
      console.error('Failed to save gems:', error);
    }
  };

  // Add coins
  const addCoins = (amount: number) => {
    setCoins(coins + amount);
  };

  // Subtract coins
  const subtractCoins = (amount: number) => {
    setCoins(Math.max(0, coins - amount));
  };

  // Add gems
  const addGems = (amount: number) => {
    setGems(gems + amount);
  };

  // Subtract gems
  const subtractGems = (amount: number) => {
    setGems(Math.max(0, gems - amount));
  };

  // Load coins and gems from AsyncStorage
  const loadBalance = async () => {
    try {
      const savedCoins = await AsyncStorage.getItem('userCoins');
      const savedGems = await AsyncStorage.getItem('userGems');

      if (savedCoins) {
        setCoinsState(parseInt(savedCoins, 10));
      } else {
        // Ha nincs mentett adat, állítsuk 1000-re alapértelmezettként
        setCoinsState(1000);
        await AsyncStorage.setItem('userCoins', '1000');
      }

      if (savedGems) {
        setGemsState(parseInt(savedGems, 10));
      } else {
        // Ha nincs mentett adat, állítsuk 0-ra alapértelmezettként
        setGemsState(0);
        await AsyncStorage.setItem('userGems', '0');
      }
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  // Reload balance (public function for manual reload)
  const reloadBalance = async () => {
    console.log('🔄 Reloading balance from AsyncStorage...');
    await loadBalance();
  };

  // Load coins and gems from AsyncStorage on mount
  React.useEffect(() => {
    loadBalance();
  }, []);

  return (
    <CoinsContext.Provider
      value={{
        coins,
        gems,
        setCoins,
        setGems,
        addCoins,
        subtractCoins,
        addGems,
        subtractGems,
        reloadBalance,
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useCoins(): CoinsContextType {
  const context = useContext(CoinsContext);
  if (!context) {
    throw new Error('useCoins must be used within a CoinsProvider');
  }
  return context;
}
