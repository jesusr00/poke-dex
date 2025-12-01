import { storage } from "@/lib/storage";
import { SWRConfig } from "swr";

const CACHE_PREFIX = "swr-cache-";

const createMMKVProvider = () => {
  const map = new Map<string, any>();

  try {
    const keys = storage.getAllKeys();
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        const cacheKey = key.replace(CACHE_PREFIX, "");
        const value = storage.getString(key);
        if (value) {
          map.set(cacheKey, JSON.parse(value));
        }
      }
    });
    console.log(`✅ Caché restaurado: ${map.size} entradas`);
  } catch (error) {
    console.warn("⚠️ Error restaurando caché:", error);
  }

  return (): Map<string, any> => {
    return new Map([...map]);
  };
};

interface SWRProviderProps {
  children: React.ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        provider: createMMKVProvider(),
        dedupingInterval: 200000,
        focusThrottleInterval: 5000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        revalidateIfStale: true,

        shouldRetryOnError: false,

        onSuccess: (data, key) => {
          try {
            const mmkvKey = `${CACHE_PREFIX}${key}`;
            storage.set(mmkvKey, JSON.stringify(data));
          } catch (error) {
            console.warn("⚠️ Error guardando en caché:", error);
          }
        },

        onError: (error, key) => {
          console.warn(`⚠️ Error en SWR [${key}]:`, error.message);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}

export const clearSWRCache = () => {
  try {
    const keys = storage.getAllKeys();
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        storage.remove(key);
      }
    });
    console.log("✅ Caché de SWR limpiado");
  } catch (error) {
    console.warn("⚠️ Error limpiando caché:", error);
  }
};
