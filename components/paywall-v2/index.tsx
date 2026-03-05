import { IMAGE_ASSETS } from '@/components/assets';
import { CoolOffCloseButton } from '@/components/cool-off-close-button';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { FooterLinks } from '@/components/paywall/main-content';
import { PerksList } from '@/components/paywall/perks-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { useSafeAreaInsets } from '@/hooks/use-safe-area-insets';
import {
  cancelAllDripNotifications,
  cancelTrialReminderNotification,
  PaywallResult,
} from '@/lib/drip-notifications';
import { useColorScheme } from '@/lib/use-color-scheme';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import { capturePosthogEvent, useViewedScreen } from '@/utils/posthog';
import { clsx } from 'clsx';
import { useFocusEffect } from 'expo-router';
import { first, isNil } from 'lodash';
import { Check, Circle } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import {
  CustomerInfo,
  PACKAGE_TYPE,
  PurchasesPackage,
} from 'react-native-purchases';

iconWithClassName(Check);
iconWithClassName(Circle);

const PackageCell = ({
  purchasePackage,
  allPackages,
  onPress,
  selected,
}: {
  purchasePackage: PurchasesPackage;
  allPackages: PurchasesPackage[];
  onPress: () => void;
  selected: boolean;
}) => {
  const { t } = useTranslation();
  const { colors: themeColors } = useColorScheme();
  const { introPrice } = purchasePackage.product;
  const type = purchasePackage.packageType;
  const hasTrial = !isNil(introPrice);

  const title = (() => {
    if (hasTrial) {
      return t('paywall.package.trialTitle', {
        count: introPrice.periodNumberOfUnits,
      });
    }
    if (type === PACKAGE_TYPE.ANNUAL) return t('paywall.package.yearlyTitle');
    if (type === PACKAGE_TYPE.MONTHLY) return t('paywall.package.monthlyTitle');
    if (type === PACKAGE_TYPE.WEEKLY) return t('paywall.package.weeklyTitle');
    if (type === PACKAGE_TYPE.LIFETIME)
      return t('paywall.package.lifetimeTitle');
    return purchasePackage.product.title.replace(/\s*\(.*?\)/, '').trim();
  })();

  const subtitle = (() => {
    const price = purchasePackage.product.priceString;
    if (hasTrial) {
      if (type === PACKAGE_TYPE.WEEKLY)
        return t('paywall.package.thenPricePerWeek', { price });
      if (type === PACKAGE_TYPE.MONTHLY)
        return t('paywall.package.thenPricePerMonth', { price });
      if (type === PACKAGE_TYPE.ANNUAL)
        return t('paywall.package.thenPricePerYear', { price });
    }
    if (type === PACKAGE_TYPE.ANNUAL)
      return `${price}${t('paywall.package.perYear')}`;
    if (type === PACKAGE_TYPE.MONTHLY)
      return `${price}${t('paywall.package.perMonth')}`;
    if (type === PACKAGE_TYPE.WEEKLY)
      return `${price}${t('paywall.package.perWeek')}`;
    if (type === PACKAGE_TYPE.LIFETIME)
      return `${price} ${t('paywall.package.once')}`;
    return price;
  })();

  const percentageOff = (() => {
    if (type !== PACKAGE_TYPE.ANNUAL) return undefined;
    const monthlyPkg = allPackages.find(
      (x) => x.packageType === PACKAGE_TYPE.MONTHLY
    );
    const weeklyPkg = allPackages.find(
      (x) => x.packageType === PACKAGE_TYPE.WEEKLY
    );
    const reference = monthlyPkg ?? weeklyPkg;
    if (!reference) return undefined;
    const refPerYear = reference.product.pricePerYear;
    const annualPrice = purchasePackage.product.pricePerYear;
    if (isNil(refPerYear) || isNil(annualPrice)) return undefined;
    return Math.floor(((refPerYear - annualPrice) / refPerYear) * 100);
  })();

  return (
    <Pressable onPress={onPress}>
      <Card
        className={clsx('rounded-xl px-4 py-4 border-2', {
          'border-primary': selected,
          'border-border': !selected,
        })}
      >
        <View className="flex-row items-center justify-between">
          <View className="gap-2 flex-1">
            <Text className="text-xl font-bold leading-none">{title}</Text>
            <Text className="text-base text-muted-foreground leading-none">
              {subtitle}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            {hasTrial ? (
              <Text className="text-lg font-semibold leading-none">
                {t('paywall.package.free')}
              </Text>
            ) : (
              percentageOff && (
                <Badge className="bg-green-400 border-green-400 px-2 py-0.5">
                  <Text className="text-black text-xs font-semibold">
                    {t('paywall.package.savePercent', {
                      percent: percentageOff,
                    })}
                  </Text>
                </Badge>
              )
            )}
            {selected ? (
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: themeColors.foreground,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check
                  size={16}
                  color={themeColors.background}
                  strokeWidth={4}
                  className=""
                />
              </View>
            ) : (
              <Circle
                size={28}
                className="text-muted-foreground"
              />
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

export const PaywallV2 = ({
  className,
  onClose,
  onAutoClose,
  onComplete,
  excludePackageTypes,
}: {
  className?: string;
  onClose: () => void;
  onAutoClose: () => void;
  onComplete?: (result: PaywallResult) => void;
  excludePackageTypes?: PACKAGE_TYPE[];
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
  const [selectedPackage, setSelectedPackage] = useState<
    PurchasesPackage | undefined
  >(undefined);

  const { paddingTop, paddingBottom, top } = useSafeAreaInsets({
    navigationBarPadding: 'none',
    contentPadding: 'none',
    nativePadding: 'both',
  });

  const { lastPaywallShownDateSetValue } = useAsyncStorage();
  useFocusEffect(
    useCallback(() => {
      lastPaywallShownDateSetValue(new Date());
    }, [lastPaywallShownDateSetValue])
  );

  useViewedScreen('paywall-v2');

  const filteredPackages = excludePackageTypes
    ? availablePackages.filter(
        (pkg) => !excludePackageTypes.includes(pkg.packageType)
      )
    : availablePackages;

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
    if (!selectedPackage && filteredPackages.length > 0) {
      setSelectedPackage(first(filteredPackages));
    }
  }, [
    availablePackages,
    filteredPackages,
    loadOfferings,
    selectedPackage,
    hasAttemptedLoad,
    loadOfferingsError,
  ]);

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
    if (!selectedPackage) return;
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
    <View
      className={clsx('flex-1 bg-background', className)}
      style={{ paddingTop: Platform.OS === 'android' ? top : paddingTop }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-start px-4 py-3">
        {!CONFIG.isHardPaywall ? (
          <CoolOffCloseButton onClose={handleClose} />
        ) : (
          <View className="w-10" />
        )}
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={{ overflow: 'visible' }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24,
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* App Icon */}
        <View className="items-center pt-4 pb-10">
          <View
            style={{
              shadowColor: CONFIG.tintColor.hex,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 40,
            }}
          >
            <Image
              source={IMAGE_ASSETS['app-icon']}
              className="w-24 h-24 rounded-3xl"
            />
          </View>
        </View>

        {/* Perks */}
        <PerksList />
      </ScrollView>

      {/* Bottom: packages + continue button + footer links */}
      <View
        className="border-t border-border bg-background px-4 pt-3"
        style={{ paddingBottom }}
      >
        <View className="gap-3 mb-3">
          {filteredPackages.map((pkg) => (
            <PackageCell
              key={pkg.product.identifier}
              purchasePackage={pkg}
              allPackages={filteredPackages}
              onPress={() => setSelectedPackage(pkg)}
              selected={
                selectedPackage?.product.identifier === pkg.product.identifier
              }
            />
          ))}
        </View>
        <Button
          size="lg"
          className="mb-2"
          disabled={isLoading || filteredPackages.length === 0}
          onPress={handlePurchase}
        >
          {isLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text className="text-lg">
              {!isNil(selectedPackage?.product.introPrice)
                ? t('paywall.tryForFree')
                : t('paywall.continue')}
            </Text>
          )}
        </Button>
        <FooterLinks
          className="mt-2"
          onRestorePurchase={handleRestorePurchases}
        />
      </View>
    </View>
  );
};
