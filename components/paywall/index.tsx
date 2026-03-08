import { CoolOffCloseButton } from '@/components/cool-off-close-button';
import { Switch } from '@/components/core/switch';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import {
  AlertDescription,
  AlertTitle,
  Alert as AlertUI,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import {
  cancelAllDripNotifications,
  cancelTrialReminderNotification,
  PaywallResult,
} from '@/lib/drip-notifications';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import { capturePosthogEvent, useViewedScreen } from '@/utils/posthog';
import { clsx } from 'clsx';
import { useFocusEffect } from 'expo-router';
import { first, isNil } from 'lodash';
import {
  Check,
  CheckCircle2,
  Circle,
  TriangleAlert,
} from 'lucide-react-native';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Platform, View } from 'react-native';
import {
  CustomerInfo,
  PACKAGE_TYPE,
  PurchasesPackage,
} from 'react-native-purchases';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { useSafeAreaInsets } from '@/hooks/use-safe-area-insets';
import { NonTrialView, TrialView } from './main-content';
import {
  PurchasePackageBaseCell,
  PurchasePackageCell,
} from './purchase-package-cell';

iconWithClassName(Check);
iconWithClassName(CheckCircle2);
iconWithClassName(Circle);
iconWithClassName(TriangleAlert);

export const Paywall = ({
  className,
  onClose,
  onAutoClose,
  onComplete,
}: {
  className?: string;
  onClose: () => void;
  onAutoClose: () => void;
  onComplete?: (result: PaywallResult) => void;
}) => {
  const { t } = useTranslation();
  const {
    loadOfferings,
    availablePackages,
    purchasePackage,
    restorePurchases,
    customerInfo,
    isPurchasing,
    isRestoringPurchases,
    isLoadingAvailablePackages,
    loadOfferingsError,
  } = useRevenueCat();
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  const { paddingTop, paddingBottom, top } = useSafeAreaInsets({
    navigationBarPadding: 'none',
    contentPadding: 'bottom',
  });
  const [selectedPackage, setSelectedPackage] = useState<
    PurchasesPackage | undefined
  >(undefined);
  const { lastPaywallShownDateSetValue } = useAsyncStorage();
  useFocusEffect(
    useCallback(() => {
      lastPaywallShownDateSetValue(new Date());
    }, [lastPaywallShownDateSetValue])
  );

  useViewedScreen('paywall');

  useEffect(() => {
    if (
      availablePackages.length === 0 &&
      !hasAttemptedLoad &&
      !loadOfferingsError
    ) {
      setHasAttemptedLoad(true);
      void loadOfferings();
      return;
    }

    if (!selectedPackage && availablePackages.length > 0) {
      setSelectedPackage(first(availablePackages));
    }
  }, [
    availablePackages,
    loadOfferings,
    selectedPackage,
    hasAttemptedLoad,
    loadOfferingsError,
  ]);

  const handleRetryLoadOfferings = () => {
    setHasAttemptedLoad(false);
    void loadOfferings();
  };

  const selectedFreeTrialPackage = !isNil(selectedPackage?.product.introPrice);
  const weeklyPackage = availablePackages.find(
    (pkg) => pkg.packageType === PACKAGE_TYPE.WEEKLY
  );
  const yearlyPackage = availablePackages.find(
    (pkg) => pkg.packageType === PACKAGE_TYPE.ANNUAL
  );

  const hasActiveSubscription = (customerInfo: CustomerInfo | null) => {
    if (isNil(customerInfo)) {
      return false;
    }
    return Object.keys(customerInfo.entitlements.active).length > 0;
  };

  const trialAvailable = availablePackages.some((x) => x.product.introPrice);

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
    if (!selectedPackage) {
      return;
    }

    const { error, userCancelled } = await purchasePackage(selectedPackage);
    if (error) {
      if (!userCancelled) {
        capturePosthogEvent('purchases-purchase-failed', { error });
        Alert.alert(t('common.error'), error);
      }
      return;
    }

    capturePosthogEvent('purchases-purchase-succeeded', {
      purchasePackage: selectedPackage.identifier,
    });
    await cancelAllDripNotifications();

    const startedTrial = !isNil(selectedPackage.product.introPrice);
    onComplete?.(startedTrial ? 'trial' : 'subscribed');
  };

  const isLoading =
    isPurchasing || isRestoringPurchases || isLoadingAvailablePackages;

  return (
    <Fragment>
      <View className={clsx('flex-1 bg-background', className)}>
        <View
          className="flex-1"
          style={{ paddingTop }}
        >
          {selectedFreeTrialPackage ? (
            <TrialView
              onRestorePurchase={handleRestorePurchases}
              trialDays={selectedPackage.product.introPrice.periodNumberOfUnits}
            />
          ) : (
            <NonTrialView onRestorePurchase={handleRestorePurchases} />
          )}
          <Animated.View
            entering={FadeInDown.delay(200).duration(600).springify()}
            className="rounded-t-3xl  bg-secondary px-3 pt-2 shadow-xl"
            style={{
              paddingBottom,
            }}
          >
            <View className="flex-col gap-4 py-3">
              {availablePackages.map((pkg, index) => (
                <Animated.View
                  key={pkg.product.identifier}
                  entering={FadeIn.delay(400 + index * 100).duration(500)}
                >
                  <PurchasePackageCell
                    purchasePackage={pkg}
                    allPackages={availablePackages}
                    onPress={() => setSelectedPackage(pkg)}
                    selected={
                      selectedPackage?.product.identifier ===
                      pkg.product.identifier
                    }
                  />
                </Animated.View>
              ))}
              {availablePackages.length > 0 &&
                trialAvailable &&
                Platform.OS !== 'ios' && (
                  <Animated.View entering={FadeIn.delay(600).duration(500)}>
                    <PurchasePackageBaseCell>
                      <View className="flex-row  items-center justify-between py-0.5">
                        <Text>{t('paywall.freeTrialEnabled')}</Text>
                        <Switch
                          value={selectedFreeTrialPackage}
                          onValueChange={(on) => {
                            setSelectedPackage(
                              on ? weeklyPackage : yearlyPackage
                            );
                          }}
                        />
                      </View>
                    </PurchasePackageBaseCell>
                  </Animated.View>
                )}
              {availablePackages.length === 0 &&
                !isLoading &&
                loadOfferingsError && (
                  <View className="gap-3">
                    <AlertUI
                      variant="destructive"
                      icon={TriangleAlert}
                      className="max-w-xl"
                    >
                      <AlertTitle>{t('paywall.errorTitle')}</AlertTitle>
                      <AlertDescription>
                        {t('paywall.errorDescription')}
                      </AlertDescription>
                    </AlertUI>
                    <Button
                      variant="outline"
                      onPress={handleRetryLoadOfferings}
                      size="lg"
                    >
                      <Text>{t('paywall.tryAgain')}</Text>
                    </Button>
                  </View>
                )}
            </View>
            <Animated.View entering={FadeIn.delay(800).duration(500)}>
              <Button
                size="lg"
                className="flex-col gap-0"
                disabled={isLoading || availablePackages.length === 0}
                onPress={handlePurchase}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <>
                    <Text className="text-lg leading-tight">
                      {selectedFreeTrialPackage
                        ? t('paywall.tryForFree', { price: selectedPackage?.product.introPrice?.priceString })
                        : t('paywall.continue')}
                    </Text>
                    {selectedFreeTrialPackage && (
                      <View className="flex-row items-center gap-1">
                        <Check
                          className="text-green-500 "
                          size={CONFIG.icon.size.xs}
                        />
                        <Text className="text-xs text-primary-foreground/60 leading-tight font-medium">
                          {t('paywall.noCommitment')}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </Button>
            </Animated.View>
          </Animated.View>
        </View>
      </View>
      {!CONFIG.isHardPaywall && (
        <CoolOffCloseButton
          onClose={handleClose}
          className="absolute"
          style={{
            right: 16,
            top,
          }}
        />
      )}
    </Fragment>
  );
};
