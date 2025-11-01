// ============================================
// ASYNCSTORAGE WRAPPER
// localStorage helyett React Native-ben
// ============================================

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  /**
   * Érték mentése AsyncStorage-ba
   * @param key - A kulcs
   * @param value - Az érték (automatikusan JSON.stringify-olva)
   */
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Storage setItem error:', error);
      throw error;
    }
  },

  /**
   * Érték lekérése AsyncStorage-ból
   * @param key - A kulcs
   * @param defaultValue - Alapértelmezett érték, ha nincs találat
   * @returns Az érték vagy a defaultValue
   */
  async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);

      if (jsonValue === null) {
        return defaultValue !== undefined ? defaultValue : null;
      }

      return JSON.parse(jsonValue) as T;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return defaultValue !== undefined ? defaultValue : null;
    }
  },

  /**
   * Érték törlése AsyncStorage-ból
   * @param key - A kulcs
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
      throw error;
    }
  },

  /**
   * Összes kulcs lekérése
   * @returns Összes kulcs tömbje
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  },

  /**
   * Teljes storage törlése
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
      throw error;
    }
  },

  /**
   * Több érték párhuzamos lekérése
   * @param keys - Kulcsok tömbje
   * @returns Kulcs-érték párok
   */
  async multiGet(keys: string[]): Promise<Record<string, any>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};

      pairs.forEach(([key, value]) => {
        if (value !== null) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Storage multiGet error:', error);
      return {};
    }
  },

  /**
   * Több érték párhuzamos mentése
   * @param keyValuePairs - Kulcs-érték párok
   */
  async multiSet(keyValuePairs: Record<string, any>): Promise<void> {
    try {
      const pairs: [string, string][] = Object.entries(keyValuePairs).map(
        ([key, value]) => [key, JSON.stringify(value)]
      );
      await AsyncStorage.multiSet(pairs);
    } catch (error) {
      console.error('Storage multiSet error:', error);
      throw error;
    }
  },
};

// Típus helper a storage kulcsokhoz
export type StorageKeys = {
  PLAYER_DATA: 'playerData';
  PLAYER_LEVEL: 'playerLevel';
  PLAYER_XP: 'playerXP';
  PLAYER_COINS: 'playerCoins';
  PLAYER_DIAMONDS: 'playerDiamonds';
  STREAK_DATA: 'streakData';
  LESSON_PROGRESS: 'lessonProgress';
  COMPLETED_LESSONS: 'completedLessons';
  AVATAR_ID: 'avatarId';
  SUBSCRIPTION_TYPE: 'subscriptionType';
  LAST_LOGIN: 'lastLogin';
  DAILY_LIMIT: 'dailyLimit';
};

export const STORAGE_KEYS: StorageKeys = {
  PLAYER_DATA: 'playerData',
  PLAYER_LEVEL: 'playerLevel',
  PLAYER_XP: 'playerXP',
  PLAYER_COINS: 'playerCoins',
  PLAYER_DIAMONDS: 'playerDiamonds',
  STREAK_DATA: 'streakData',
  LESSON_PROGRESS: 'lessonProgress',
  COMPLETED_LESSONS: 'completedLessons',
  AVATAR_ID: 'avatarId',
  SUBSCRIPTION_TYPE: 'subscriptionType',
  LAST_LOGIN: 'lastLogin',
  DAILY_LIMIT: 'dailyLimit',
};
