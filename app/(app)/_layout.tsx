import {
  HeaderCloseButton,
} from '@/components/core/header-button';
import { THEME } from '@/lib/theme';
import { useColorScheme } from '@/lib/use-color-scheme';
import { Stack, useRouter } from 'expo-router';
import { Platform } from 'react-native';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function AppLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTransparent: Platform.OS === 'ios',
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="paywall"
        options={{
          animation: 'slide_from_bottom',
          presentation: 'fullScreenModal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          title: '',
          presentation: 'fullScreenModal',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="review"
        options={{
          headerShown: false,
          ...(Platform.OS === 'ios'
            ? {
                presentation: 'formSheet',
                sheetGrabberVisible: true,
                sheetAllowedDetents: 'fitToContents',
              }
            : {
                presentation: 'fullScreenModal',
                headerShown: true,
                title: '',
                headerShadowVisible: false,
                headerStyle: {
                  backgroundColor: isDarkColorScheme
                    ? THEME.dark.background
                    : THEME.light.background,
                },
                headerLeft: () => (
                  <HeaderCloseButton onPress={() => router.back()} />
                ),
              }),
          contentStyle: {
            backgroundColor: isDarkColorScheme
              ? THEME.dark.background
              : THEME.light.background,
          },
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
