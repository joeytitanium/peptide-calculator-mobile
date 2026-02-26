import { tryCatch } from '@/utils/try-catch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { CloudStorage, useIsCloudAvailable } from 'react-native-cloud-storage';

const ASYNC_STORAGE_RECORDS_KEY = '@records';

// Parse records from JSON
function parseRecords<TRecord>(json: string): TRecord[] {
  return JSON.parse(json) as TRecord[];
}

async function readCloudFile(path: string): Promise<string | null> {
  const { data: exists, error: existsError } = await tryCatch(
    CloudStorage.exists(path)
  );
  if (existsError || !exists) return null;

  const { data: content, error: readError } = await tryCatch(
    CloudStorage.readFile(path)
  );
  if (readError) return null;

  return content;
}

type ICloudStorageResult<TRecord> = {
  records: TRecord[];
  setRecords: (
    newRecords: TRecord[] | ((prevRecords?: TRecord[]) => TRecord[])
  ) => void;
  isLoaded: boolean;
  isCloudAvailable: boolean;
  isCheckingCloud: boolean;
};

export const useICloudStorage = <TRecord extends { id: string }>(
  storageKey: string = ASYNC_STORAGE_RECORDS_KEY,
  cloudFilePath: string = '/record.json'
): ICloudStorageResult<TRecord> => {
  const [records, setRecords] = useState<TRecord[] | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCheckingCloud, setIsCheckingCloud] = useState(true);

  const isCloudAvailable = useIsCloudAvailable();

  useEffect(() => {
    let isActive = true;

    const loadRecords = async () => {
      let loadedRecords: TRecord[] = [];

      if (isCloudAvailable) {
        const cloudContent = await readCloudFile(cloudFilePath);
        if (cloudContent) {
          try {
            loadedRecords = parseRecords<TRecord>(cloudContent);
            // Sync to AsyncStorage as backup
            await AsyncStorage.setItem(
              storageKey,
              JSON.stringify(loadedRecords)
            );
          } catch (error) {
            console.error('Error parsing records from iCloud:', error);
          }
        }
      }

      if (loadedRecords.length === 0) {
        // Fallback to AsyncStorage
        try {
          const asyncStorageData = await AsyncStorage.getItem(storageKey);
          if (asyncStorageData) {
            loadedRecords = parseRecords<TRecord>(asyncStorageData);
          }
        } catch (error) {
          console.error('Error loading records from AsyncStorage:', error);
        }
      }

      if (isActive) {
        setRecords(loadedRecords);
        setIsLoaded(true);
        setIsCheckingCloud(false);
      }
    };

    void loadRecords();

    return () => {
      isActive = false;
    };
  }, [isCloudAvailable, cloudFilePath, storageKey]);

  const setRecordsHandler = useCallback(
    (newRecords: TRecord[] | ((prevRecords?: TRecord[]) => TRecord[])) => {
      setRecords((prevRecords) => {
        const recordsToSet =
          newRecords instanceof Function ? newRecords(prevRecords) : newRecords;

        void (async () => {
          const recordsJson = JSON.stringify(recordsToSet);

          // Always save to AsyncStorage as backup
          try {
            await AsyncStorage.setItem(storageKey, recordsJson);
          } catch (error) {
            console.error('Error saving to AsyncStorage:', error);
          }

          // Also save to iCloud if available
          if (isCloudAvailable) {
            const { error } = await tryCatch(
              CloudStorage.writeFile(cloudFilePath, recordsJson)
            );
            if (error) {
              console.error('Error saving to iCloud:', error);
            }
          }
        })();

        return recordsToSet;
      });
    },
    [isCloudAvailable, cloudFilePath, storageKey]
  );

  return {
    records: isLoaded ? (records ?? []) : [],
    setRecords: setRecordsHandler,
    isLoaded,
    isCloudAvailable,
    isCheckingCloud,
  };
};
