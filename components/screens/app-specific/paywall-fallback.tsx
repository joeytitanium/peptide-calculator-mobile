import { CoolOffCloseButton } from '@/components/cool-off-close-button';
import { FooterLinks } from '@/components/paywall/main-content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from '@/hooks/use-safe-area-insets';
import {
  cancelAllDripNotifications,
  cancelTrialReminderNotification,
  PaywallResult,
} from '@/lib/drip-notifications';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import { capturePosthogEvent, useViewedScreen } from '@/utils/posthog';
import { isNil } from 'lodash';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Platform, View } from 'react-native';
import { CustomerInfo, PACKAGE_TYPE } from 'react-native-purchases';
import Animated, { FadeInDown } from 'react-native-reanimated';

type PaywallFallbackScreenProps = {
  onClose: () => void;
  onAutoClose: () => void;
  onComplete?: (result: PaywallResult) => void;
};

export function PaywallFallbackScreen({
  onClose,
  onAutoClose,
  onComplete,
}: PaywallFallbackScreenProps) {
  const { t } = useTranslation();
  const {
    purchasePackage,
    restorePurchases,
    customerInfo,
    isPurchasing,
    isRestoringPurchases,
    availablePackages,
    isLoadingAvailablePackages,
  } = useRevenueCat();

  // Use the CUSTOM package from the main offering
  const customPackage = availablePackages.find(
    (x) => x.packageType === PACKAGE_TYPE.CUSTOM
  );

  const { paddingTop, paddingBottom, top } = useSafeAreaInsets({
    navigationBarPadding: 'none',
    contentPadding: 'none',
    nativePadding: 'both',
  });

  useViewedScreen('paywall-fallback');

  const hasActiveSubscription = (info: CustomerInfo | null) => {
    if (isNil(info)) return false;
    return Object.keys(info.entitlements.active).length > 0;
  };

  useEffect(() => {
    if (hasActiveSubscription(customerInfo)) {
      onAutoClose();
    }
  }, [customerInfo, onAutoClose]);

  const handleClose = () => {
    onComplete?.('dismissed');
    onClose();
  };

  const handleRestorePurchases = async () => {
    const { result, error } = await restorePurchases();
    if (error) {
      Alert.alert(t('common.error'), error);
      return;
    }
    if (!hasActiveSubscription(result)) {
      Alert.alert(t('paywall.noPurchasesFound'));
      return;
    }
    capturePosthogEvent('purchases-restored');
    await cancelAllDripNotifications();
    await cancelTrialReminderNotification();
  };

  const handlePurchase = async () => {
    if (!customPackage) return;
    const { error, userCancelled } = await purchasePackage(customPackage);
    if (error) {
      if (!userCancelled) {
        capturePosthogEvent('purchases-purchase-failed', { error });
        Alert.alert(t('common.error'), error);
      }
      return;
    }
    capturePosthogEvent('purchases-purchase-succeeded', {
      purchasePackage: customPackage.identifier,
      source: 'fallback',
    });
    await cancelAllDripNotifications();
    const startedTrial = !isNil(customPackage.product.introPrice);
    onComplete?.(startedTrial ? 'trial' : 'subscribed');
  };

  // Use the standard yearly package as the reference for percentage off + strikethrough
  const yearlyPackage = availablePackages.find(
    (x) => x.packageType === PACKAGE_TYPE.ANNUAL
  );

  const percentageOff = (() => {
    if (!customPackage || !yearlyPackage) return undefined;
    const yearlyPrice = yearlyPackage.product.price;
    const customPrice = customPackage.product.price;
    if (yearlyPrice === 0) return undefined;
    return Math.round(((yearlyPrice - customPrice) / yearlyPrice) * 100);
  })();

  // Show the standard yearly price as the strikethrough
  const referenceYearlyPriceString = yearlyPackage?.product.priceString;

  const priceLabel = (() => {
    if (!customPackage) return '';
    const price = customPackage.product.priceString;
    return `${price}${t('paywall.package.perYear')}`;
  })();

  const isLoading =
    isPurchasing || isRestoringPurchases || isLoadingAvailablePackages;

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Platform.OS === 'android' ? top : paddingTop }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-start px-4 py-3">
        <CoolOffCloseButton
          onClose={handleClose}
          skipCoolOff
        />
      </View>

      {/* Content */}
      <View className="flex-1 justify-center items-center px-6">
        {/* "Last chance" heading */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
          <Text className="text-center text-3xl font-bold text-foreground mb-3">
            {t('paywall.fallback.lastChance')}
          </Text>
        </Animated.View>

        {/* Feature subtitle */}
        <Animated.View entering={FadeInDown.delay(250).duration(600)}>
          <Text className="text-center text-base text-muted-foreground mb-8 px-4">
            {t('paywall.fallback.subtitle')}
          </Text>
        </Animated.View>

        {/* Big percentage + OFF */}
        {percentageOff ? (
          <Animated.View
            entering={FadeInDown.delay(450).duration(700).springify()}
            className="items-center"
          >
            <Text
              className="font-extrabold leading-none"
              style={{
                fontSize: 90,
              }}
            >
              {percentageOff}%
            </Text>
            <Text
              className="font-extrabold leading-none"
              style={{ fontSize: 72 }}
            >
              {t('paywall.fallback.off')}
            </Text>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(450).duration(600)}>
            <Text className="text-center text-2xl font-bold text-foreground">
              {t('paywall.continue')}
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Bottom: package + CTA + footer */}
      <Animated.View
        entering={FadeInDown.delay(800).duration(600)}
        className="border-t border-border bg-background px-4 pt-3"
        style={{ paddingBottom }}
      >
        {customPackage && (
          <Card className="rounded-xl px-4 py-4 border-2 border-primary mb-3">
            <View className="flex-row items-center justify-between">
              <View className="gap-1">
                <Text className="text-xl font-bold leading-none">
                  {t('paywall.package.yearlyTitle')}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-base font-semibold text-primary leading-none">
                    {priceLabel}
                  </Text>
                  {referenceYearlyPriceString && (
                    <Text className="text-sm text-muted-foreground line-through leading-none">
                      {referenceYearlyPriceString}
                    </Text>
                  )}
                </View>
              </View>
              {percentageOff && (
                <Badge className="bg-green-400 border-green-400 px-2 py-0.5">
                  <Text className="text-black text-xs font-semibold">
                    {t('paywall.package.savePercent', {
                      percent: percentageOff,
                    })}
                  </Text>
                </Badge>
              )}
            </View>
          </Card>
        )}
        <Button
          size="lg"
          className="mb-2"
          disabled={isLoading || !customPackage}
          onPress={handlePurchase}
        >
          {isLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text className="text-lg">
              {percentageOff
                ? t('paywall.fallback.cta', { percent: percentageOff })
                : t('paywall.continue')}
            </Text>
          )}
        </Button>
        <FooterLinks
          className="mt-2"
          onRestorePurchase={handleRestorePurchases}
        />
      </Animated.View>
    </View>
  );
}
