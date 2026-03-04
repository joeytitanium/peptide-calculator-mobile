import { THEME } from '@/lib/theme';
import { useColorScheme } from '@/lib/use-color-scheme';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

export default function Layout() {
  const { t } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: t('tabs.settings'),
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
      <Stack.Screen
        name="account"
        options={{
          title: t('navigation.account'),
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: t('navigation.editProfile'),
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="delete-account"
        options={{
          title: t('navigation.deleteAccount'),
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="locale"
        options={{
          title: t('navigation.language'),
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
