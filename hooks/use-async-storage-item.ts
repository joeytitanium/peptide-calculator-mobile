import {
  AsyncStorageKey,
  AsyncStorageSchema,
  getAsyncStorageItem,
  removeAsyncStorageItem,
  setAsyncStorageItem,
} from '@/utils/async-storage';
import { useCallback, useEffect, useState } from 'react';

type AsyncStorageHookOptions<K extends AsyncStorageKey> = {
  key: K;
  defaultValue?: AsyncStorageSchema[K];
};

// Updated function signature using the generic key K
export const useAsyncStorageItem = <K extends AsyncStorageKey>({
  key,
  defaultValue,
}: AsyncStorageHookOptions<K>) => {
  // Initialize state with undefined to distinguish between initial load and actual default value
  const [value, setValue] = useState<AsyncStorageSchema[K] | undefined>(
    undefined
  );

  // Flag to track if the value has been loaded from storage
  const [isLoaded, setIsLoaded] = useState(false);

  // Effect to load the initial value from AsyncStorage
  useEffect(() => {
    void (async () => {
      const { data: storedValue } = await getAsyncStorageItem(key);
      setValue(storedValue ?? defaultValue);
      setIsLoaded(true);
    })();
  }, [key, defaultValue]);

  // Memoized function to set the value in both state and AsyncStorage
  const setValueHandler = useCallback(
    (
      newValue:
        | AsyncStorageSchema[K]
        | ((prevState?: AsyncStorageSchema[K]) => AsyncStorageSchema[K])
    ) => {
      setValue((prevValue) => {
        // Determine the actual value to set (either the direct value or result of the function)
        const valueToSet =
          newValue instanceof Function ? newValue(prevValue) : newValue;

        // Update AsyncStorage asynchronously (optimistic update)
        void setAsyncStorageItem({ key, value: valueToSet });

        return valueToSet;
      });
    },
    [key]
  );

  // Memoized function to remove the value from AsyncStorage and reset state
  const removeValue = useCallback(async () => {
    const { error } = await removeAsyncStorageItem(key); // Use the new helper
    if (!error) {
      setValue(defaultValue); // Reset state to default
    }
    // Optionally handle the case where removal fails
  }, [key, defaultValue]);

  return {
    // Return defaultValue if still loading or value is explicitly undefined/null
    value: isLoaded ? value : defaultValue,
    setValue: setValueHandler,
    removeValue, // <-- Return the new remove function
    isLoaded, // <-- Expose loading state
  };
};
