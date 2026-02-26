import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';

import { COLORS } from '@/theme/colors';
import {
  ColorSchemePreference,
  getAsyncStorageItem,
  setAsyncStorageItem,
} from '@/utils/async-storage';

function useColorScheme() {
  const { colorScheme, setColorScheme } = useNativewindColorScheme();
  const [preference, setPreference] = useState<ColorSchemePreference>('system');

  // Load preference from storage on mount
  useEffect(() => {
    const loadPreference = async () => {
      const { data } = await getAsyncStorageItem('color-scheme-preference');
      const pref = data ?? 'system';
      setPreference(pref);

      // Apply the initial color scheme
      if (pref === 'system') {
        setColorScheme('system'); // Let nativewind handle system detection
      } else {
        setColorScheme(pref);
      }
    };
    void loadPreference();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cycleColorScheme = useCallback(() => {
    const nextPreference: ColorSchemePreference =
      preference === 'system' ? 'light' : preference === 'light' ? 'dark' : 'system';

    setPreference(nextPreference);
    void setAsyncStorageItem({
      key: 'color-scheme-preference',
      value: nextPreference,
    });

    // Apply the new color scheme
    if (nextPreference === 'system') {
      setColorScheme('system'); // Let nativewind handle system detection
    } else {
      setColorScheme(nextPreference);
    }
  }, [preference, setColorScheme]);

  return {
    colorScheme: colorScheme ?? 'light',
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme,
    cycleColorScheme,
    colorSchemePreference: preference,
    colors: COLORS[colorScheme ?? 'light'],
  };
}

export { useColorScheme };
