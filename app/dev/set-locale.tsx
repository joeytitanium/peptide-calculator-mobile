import i18n from '@/lib/i18n';
import { useColorScheme } from '@/lib/use-color-scheme';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useRecords } from '@/providers/records-provider';
import { getSeedRecords } from '@/screenshots/seed-data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

const ASYNC_STORAGE_RECORDS_KEY = '@records';

export default function SetLocaleScreen() {
  const router = useRouter();
  const { lang, seed, colorScheme: colorSchemeParam, date, tab } = useLocalSearchParams<{
    lang?: string;
    seed?: string;
    colorScheme?: 'light' | 'dark';
    date?: string;
    tab?: 'dashboard' | 'home';
  }>();
  const {
    screenshotModeSetValue,
    onboardingCompletedSetValue,
    localePreferenceSetValue,
  } = useAsyncStorage();
  const { setColorScheme } = useColorScheme();
  const { replaceAllRecords } = useRecords();
  const replaceAllRecordsRef = useRef(replaceAllRecords);
  replaceAllRecordsRef.current = replaceAllRecords;
  const lastProcessedLang = useRef<string | undefined>();

  useEffect(() => {
    if (lastProcessedLang.current === lang) return;
    lastProcessedLang.current = lang;

    const setup = async () => {
      if (lang) {
        await i18n.changeLanguage(lang);
        localePreferenceSetValue(lang);
      }

      if (seed === 'true') {
        const seedRecords = getSeedRecords({ t: i18n.t });
        // Write directly to AsyncStorage first to prevent race condition:
        // the iCloud hook loads records asynchronously on app start, and can
        // overwrite in-memory state set by replaceAllRecords with stale data.
        await AsyncStorage.setItem(
          ASYNC_STORAGE_RECORDS_KEY,
          JSON.stringify(seedRecords)
        );
        replaceAllRecordsRef.current({ records: seedRecords });
      }

      // Set color scheme if specified (for screenshots)
      if (colorSchemeParam === 'light' || colorSchemeParam === 'dark') {
        setColorScheme(colorSchemeParam);
      }

      // Enable screenshot mode to skip paywall and hide pro badge
      screenshotModeSetValue(true);
      // Mark onboarding as completed so we skip the onboarding flow
      onboardingCompletedSetValue(true);

      // Short delay to let React state settle, then navigate via index redirect
      // (direct deep route navigation fails on Android)
      setTimeout(() => {
        router.replace('/');
      }, 100);
    };

    void setup();
  }, [lang, seed, colorSchemeParam, router, screenshotModeSetValue, onboardingCompletedSetValue, localePreferenceSetValue, setColorScheme]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Setting up screenshot environment...</Text>
    </View>
  );
}
