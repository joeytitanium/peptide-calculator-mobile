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
        title: 'Reconstitution',
        headerTransparent: Platform.OS === 'ios',
        headerShadowVisible: Platform.OS !== 'android',
        headerTitleAlign: Platform.OS === 'android' ? 'center' : undefined,
        ...(Platform.OS === 'android' && {
          headerStyle: {
            backgroundColor: isDarkColorScheme
              ? THEME.dark.background
              : THEME.light.background,
          },
        }),
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
