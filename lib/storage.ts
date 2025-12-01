import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV({
  id: "pokedex-cache",
});

export const storageHelper = {
  setItem: (key: string, value: any) => {
    storage.set(key, JSON.stringify(value));
  },

  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : null;
  },

  removeItem: (key: string) => {
    storage.remove(key);
  },

  clear: () => {
    storage.clearAll();
  },
};
