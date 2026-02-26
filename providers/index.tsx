import { ReactNode } from 'react';
import { LogBox } from 'react-native';

import { CONFIG } from '@/config';
import { useColorScheme } from '@/lib/use-color-scheme';
// Import to configure notification handler on app start
import '@/lib/push-notifications';
import { NAV_THEME } from '@/theme';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { PostHogProvider } from 'posthog-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { AsyncStorageProvider } from './async-storage-provider';
import { AuthProvider } from './auth-provider';
import { RecordsProvider } from './records-provider';
import { RevenueCatProvider } from './revenue-cat-provider';

// Ignore RevenueCat errors in dev mode (they show as toasts during screenshots)
LogBox.ignoreLogs([
  '[RevenueCat]',
  'PurchasesError',
  'Failed to load offerings',
  /🚨/,
]);

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const queryClient = new QueryClient();

// Theme configuration moved to Expo Router level

export const Providers = ({ children }: { children: ReactNode }) => {
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      <PostHogProvider
        apiKey={CONFIG.posthog.apiKey}
        options={{
          host: CONFIG.posthog.host,
          disabled: !CONFIG.posthog.enabled,
        }}
      >
        <ThemeProvider value={NAV_THEME[colorScheme]}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
              <AsyncStorageProvider>
                <RevenueCatProvider>
                  <AuthProvider>
                    <RecordsProvider>
                      <KeyboardProvider>
                        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                          {children}
                        </SafeAreaProvider>
                      </KeyboardProvider>
                    </RecordsProvider>
                  </AuthProvider>
                </RevenueCatProvider>
              </AsyncStorageProvider>
            </QueryClientProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </PostHogProvider>
    </>
  );
};
