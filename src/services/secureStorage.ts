import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const memoryStore = new Map<string, string>();

const getWebStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const secureStorage = {
  getItemAsync: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return getWebStorage()?.getItem(key) ?? memoryStore.get(key) ?? null;
    }

    return SecureStore.getItemAsync(key);
  },

  setItemAsync: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      const storage = getWebStorage();
      if (storage) {
        storage.setItem(key, value);
      } else {
        memoryStore.set(key, value);
      }
      return;
    }

    await SecureStore.setItemAsync(key, value);
  },

  deleteItemAsync: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      getWebStorage()?.removeItem(key);
      memoryStore.delete(key);
      return;
    }

    await SecureStore.deleteItemAsync(key);
  },
};

export default secureStorage;
