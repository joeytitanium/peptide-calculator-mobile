import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

export default function Layout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: t('navigation.history'),
        headerTransparent: Platform.OS === 'ios',
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
