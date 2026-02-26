import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

export default function ReportLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: Platform.OS === 'ios',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('navigation.reportPost'),
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{
          title: '',
          headerBackTitle: t('navigation.back'),
        }}
      />
      <Stack.Screen
        name="setup-profile"
        options={{
          title: '',
          headerBackTitle: t('navigation.back'),
        }}
      />
    </Stack>
  );
}
