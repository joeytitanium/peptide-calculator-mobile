import { HeaderIconButton } from '@/components/core/header-button';
import { ProBadge } from '@/components/pro-badge';
import { THEME } from '@/lib/theme';
import { useColorScheme } from '@/lib/use-color-scheme';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

export default function Layout() {
  const { t } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();
  const { isLoadingCustomerInfo, hasActiveSubscription } = useRevenueCat();
  const { screenshotModeValue: screenshotMode } = useAsyncStorage();

  const showProBadge =
    !isLoadingCustomerInfo && !hasActiveSubscription && !screenshotMode;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: t('navigation.peptideCalculator'),
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
      <Stack.Screen
        name="index"
        options={{
          headerLeft: showProBadge
            ? () => (
                <HeaderIconButton
                  onPress={() =>
                    router.push('/(app)/(tabs)/calculator/paywall')
                  }
                >
                  <ProBadge hideText />
                </HeaderIconButton>
              )
            : undefined,
        }}
      />
      <Stack.Screen
        name="paywall"
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="review"
        options={{
          headerShown: false,
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.35, 0.65],
          sheetInitialDetentIndex: 0,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </Stack>
  );
}
