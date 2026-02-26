import { THEME } from '@/lib/theme';
import { useColorScheme } from '@/lib/use-color-scheme';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function Layout() {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: '',
        headerTransparent: Platform.OS === 'ios',
        headerShadowVisible: Platform.OS !== 'android',
        ...(Platform.OS === 'android' && {
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: isDarkColorScheme
              ? THEME.dark.background
              : THEME.light.background,
          },
        }),
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[recordId]"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="log"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="analyze-photo"
        options={{
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="confirm-photo"
        options={{
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="feedback"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="paywall"
        options={{
          presentation: 'fullScreenModal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
