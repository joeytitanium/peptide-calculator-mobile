import { useICloudStorage } from '@/hooks/use-icloud-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// App-specific implementations
import { HeadacheRecord } from '@/types/app-specific/headache-record';
import { ChatRecord } from '@/types/record';

type RecordsContextType<TRecord extends { id: string }> = {
  records: TRecord[];
  getRecordById: ({ id }: { id?: string }) => TRecord | undefined;
  deleteRecordId: ({ id }: { id: string }) => Promise<{
    error?: string;
  }>;
  createRecord: ({ record }: { record: TRecord }) => Promise<{
    error?: string;
  }>;
  updateRecord: ({ record }: { record: TRecord }) => Promise<{
    error?: string;
  }>;
  replaceAllRecords: ({ records }: { records: TRecord[] }) => void;
};

export function createRecordsContext<TRecord extends { id: string }>() {
  return createContext<RecordsContextType<TRecord> | undefined>(undefined);
}

interface RecordsProviderProps {
  children: ReactNode;
  storageKey?: string;
  cloudFilePath?: string;
}

export function createRecordsProvider<TRecord extends { id: string }>(
  Context: React.Context<RecordsContextType<TRecord> | undefined>,
  displayName: string = 'RecordsProvider'
) {
  const Provider = ({
    children,
    storageKey,
    cloudFilePath,
  }: RecordsProviderProps) => {
    const { records: persistedRecords, setRecords: setPersistedRecords } =
      useICloudStorage<TRecord>(storageKey, cloudFilePath);

    const [records, setRecords] = useState<TRecord[]>(persistedRecords);
    const prevPersistedRecordsRef = useRef<TRecord[]>([]);

    const persistedRecordsString = useMemo(() => {
      return JSON.stringify(persistedRecords);
    }, [persistedRecords]);

    const currentRecordsString = useMemo(() => {
      return JSON.stringify(records);
    }, [records]);

    useEffect(() => {
      if (persistedRecordsString !== currentRecordsString) {
        setRecords(persistedRecords);
      }
      prevPersistedRecordsRef.current = persistedRecords;
    }, [persistedRecordsString, persistedRecords, currentRecordsString]);

    const handleRecordsChange = useCallback(
      (updatedRecords: TRecord[]) => {
        setRecords(updatedRecords);
        setPersistedRecords(updatedRecords);
      },
      [setPersistedRecords]
    );

    const getRecordById = useCallback(
      ({ id }: { id?: string }): TRecord | undefined => {
        return records.find((record) => record.id === id);
      },
      [records]
    );

    const deleteRecordId = async ({ id }: { id: string }) => {
      const record = getRecordById({ id });
      if (record) {
        const updatedRecords = records.filter((record) => record.id !== id);
        handleRecordsChange(updatedRecords);
        return { success: true };
      }
      return { success: false, error: 'Record not found' };
    };

    const createRecord = useCallback(
      async ({ record }: { record: TRecord }) => {
        const updatedRecords = [record, ...records];
        handleRecordsChange(updatedRecords);

        return { error: undefined };
      },
      [records, handleRecordsChange]
    );

    const updateRecord = useCallback(
      async ({ record }: { record: TRecord }) => {
        const updatedRecords = records.map((r) =>
          r.id === record.id ? record : r
        );
        handleRecordsChange(updatedRecords);
        return { error: undefined };
      },
      [records, handleRecordsChange]
    );

    const replaceAllRecords = useCallback(
      ({ records: newRecords }: { records: TRecord[] }) => {
        handleRecordsChange(newRecords);
      },
      [handleRecordsChange]
    );

    return (
      <Context.Provider
        value={{
          records,
          getRecordById,
          deleteRecordId,
          createRecord,
          updateRecord,
          replaceAllRecords,
        }}
      >
        {children}
      </Context.Provider>
    );
  };

  Provider.displayName = displayName;
  return Provider;
}

export function createUseRecords<TRecord extends { id: string }>(
  Context: React.Context<RecordsContextType<TRecord> | undefined>
) {
  return (): RecordsContextType<TRecord> => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error('useRecords must be used within an RecordsProvider');
    }
    return context;
  };
}

// Headache Records (main app feature)
const HeadacheRecordsContext = createRecordsContext<HeadacheRecord>();
export const RecordsProvider = createRecordsProvider<HeadacheRecord>(
  HeadacheRecordsContext,
  'RecordsProvider'
);
export const useRecords = createUseRecords<HeadacheRecord>(
  HeadacheRecordsContext
);

// Chat Records (for AI chat feature)
const ChatRecordsContext = createRecordsContext<ChatRecord>();
export const ChatRecordsProvider = createRecordsProvider<ChatRecord>(
  ChatRecordsContext,
  'ChatRecordsProvider'
);
export const useChatRecords = createUseRecords<ChatRecord>(ChatRecordsContext);
