import { SortOrder } from '@/types/sort-order';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tryCatch } from './try-catch';

export type CropRegionPreference = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AuthState = {
  appleUserId: string | null;
  identityToken: string | null;
  username: string | null;
  profileImageUrl: string | null;
};

export type ColorSchemePreference = 'system' | 'light' | 'dark';

export type ReminderTime = {
  hour: number; // 0-23
  minute: number; // 0-59
};

export type ReminderSchedulePreference = {
  enabled: boolean;
  times: ReminderTime[];
};

export const HEADACHE_FREQUENCIES = [
  'daily',
  'several-per-week',
  'weekly',
  'few-per-month',
  'rarely',
] as const;
export type HeadacheFrequency = (typeof HEADACHE_FREQUENCIES)[number];

export const HEADACHE_TYPES = [
  'tension',
  'migraine',
  'cluster',
  'sinus',
  'not-sure',
] as const;
export type HeadacheType = (typeof HEADACHE_TYPES)[number];

export type HeadachePreference = {
  frequency: HeadacheFrequency;
  type: HeadacheType;
};

export type AsyncStorageSchema = {
  'sort-order-preference': SortOrder;
  'jwt-token': string;
  'save-photo-preference': boolean;
  'onboarding-completed': boolean;
  'last-paywall-shown-date': Date;
  'install-date': Date;
  'last-review-request-date': Date;
  'auth-state': AuthState;
  'push-device-token': string;
  'crop-region-preference': CropRegionPreference;
  'color-scheme-preference': ColorSchemePreference;
  'reminder-schedule-preference': ReminderSchedulePreference;
  'headache-preference': HeadachePreference;
  'screenshot-mode': boolean;
  'locale-preference': string | null;
};

// const ASYNC_STORAGE_KEYS = Object.keys(
//   {} as AsyncStorageSchema
// ) as (keyof AsyncStorageSchema)[];
export type AsyncStorageKey = keyof AsyncStorageSchema;

type Serializer<T> = {
  serialize: (value: T) => string;
  deserialize: (value: string | null) => T | null;
};

const serializers: {
  [K in keyof AsyncStorageSchema]: Serializer<AsyncStorageSchema[K]>;
} = {
  'sort-order-preference': {
    serialize: (value: SortOrder) => value,
    deserialize: (value: string | null) =>
      value === null ? 'date-newest' : (value as SortOrder),
  },
  'jwt-token': {
    serialize: (value: string) => value,
    deserialize: (value: string | null) => value ?? null,
  },
  'save-photo-preference': {
    serialize: (value: boolean) => JSON.stringify(value),
    deserialize: (value: string | null) =>
      value === null ? null : (JSON.parse(value) as boolean),
  },
  'onboarding-completed': {
    serialize: (value: boolean) => JSON.stringify(value),
    deserialize: (value: string | null) =>
      value === null ? null : (JSON.parse(value) as boolean),
  },
  'last-paywall-shown-date': {
    serialize: (value: Date) => value.toISOString(),
    deserialize: (value: string | null) =>
      value === null ? null : new Date(value),
  },
  'install-date': {
    serialize: (value: Date) => value.toISOString(),
    deserialize: (value: string | null) =>
      value === null ? null : new Date(value),
  },
  'last-review-request-date': {
    serialize: (value: Date) => value.toISOString(),
    deserialize: (value: string | null) =>
      value === null ? null : new Date(value),
  },
  'auth-state': {
    serialize: (value: AuthState) => JSON.stringify(value),
    deserialize: (value: string | null) =>
      value === null ? null : (JSON.parse(value) as AuthState),
  },
  'push-device-token': {
    serialize: (value: string) => value,
    deserialize: (value: string | null) => value ?? null,
  },
  'crop-region-preference': {
    serialize: (value: CropRegionPreference) => JSON.stringify(value),
    deserialize: (value: string | null) =>
      value === null ? null : (JSON.parse(value) as CropRegionPreference),
  },
  'color-scheme-preference': {
    serialize: (value: ColorSchemePreference) => value,
    deserialize: (value: string | null) =>
      value === null ? null : (value as ColorSchemePreference),
  },
  'reminder-schedule-preference': {
    serialize: (value: ReminderSchedulePreference) => JSON.stringify(value),
    deserialize: (value: string | null) => {
      if (value === null) return null;
      const parsed = JSON.parse(value) as Record<string, unknown>;
      // Migrate from old interval-based format
      if ('startHour' in parsed && !('times' in parsed)) {
        const startMinutes =
          (parsed.startHour as number) * 60 + (parsed.startMinute as number);
        const endMinutes =
          (parsed.endHour as number) * 60 + (parsed.endMinute as number);
        const interval = (parsed.intervalMinutes as number | undefined) ?? 60;
        const times: ReminderTime[] = [];
        let current = startMinutes;
        while (current <= endMinutes) {
          times.push({
            hour: Math.floor(current / 60),
            minute: current % 60,
          });
          current += interval;
        }
        return {
          enabled: (parsed.enabled as boolean | undefined) ?? false,
          times,
        };
      }
      return parsed as ReminderSchedulePreference;
    },
  },
  'headache-preference': {
    serialize: (value: HeadachePreference) => JSON.stringify(value),
    deserialize: (value: string | null) =>
      value === null ? null : (JSON.parse(value) as HeadachePreference),
  },
  'screenshot-mode': {
    serialize: (value: boolean) => JSON.stringify(value),
    deserialize: (value: string | null) =>
      value === null ? null : (JSON.parse(value) as boolean),
  },
  'locale-preference': {
    serialize: (value: string | null) => (value === null ? '' : value),
    deserialize: (value: string | null) =>
      value === null || value === '' ? null : value,
  },
};

/**
 * Get a typed storage item
 * @param key Storage key
 * @returns Typed value or null if not found/error
 */
export const getAsyncStorageItem = async <K extends AsyncStorageKey>(
  key: K
): Promise<{
  data?: AsyncStorageSchema[K];
  error?: Error;
}> => {
  const { error, data } = await tryCatch(AsyncStorage.getItem(key));
  if (error) {
    return { error };
  }

  return { data: serializers[key].deserialize(data) ?? undefined };
};

/**
 * Set a typed storage item
 * @param key Storage key
 * @param value Typed value to store
 * @returns Success status
 */
export const setAsyncStorageItem = async <K extends AsyncStorageKey>({
  key,
  value,
}: {
  key: K;
  value: AsyncStorageSchema[K];
}): Promise<{
  error?: Error;
}> => {
  const serializedValue = serializers[key].serialize(value);
  const { error } = await tryCatch(AsyncStorage.setItem(key, serializedValue));

  if (error) {
    return { error };
  }

  return { error: undefined };
};

/**
 * Remove an item from AsyncStorage
 * @param key Storage key
 * @returns Success status
 */
export const removeAsyncStorageItem = async (
  key: AsyncStorageKey
): Promise<{
  error?: Error;
}> => {
  const { error } = await tryCatch(AsyncStorage.removeItem(key));

  if (error) {
    return { error };
  }

  return { error: undefined };
};

/**
 * Clear all items from AsyncStorage
 * @returns Success status
 */
export const clearAsyncStorage = async (): Promise<{
  error?: Error;
}> => {
  const { error } = await tryCatch(AsyncStorage.clear());

  if (error) {
    return { error };
  }

  return { error: undefined };
};
