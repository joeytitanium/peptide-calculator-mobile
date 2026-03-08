import { CoolOffCloseButton } from '@/components/cool-off-close-button';
import { FooterLinks } from '@/components/paywall/main-content';
import { SingleReview } from '@/components/paywall/reviews';
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
import { annualizePrice } from '@/utils/annualize-price';
import { capturePosthogEvent, useViewedScreen } from '@/utils/posthog';
import { isNil } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  useColorScheme,
  View,
} from 'react-native';
import {
  CustomerInfo,
  PACKAGE_TYPE,
  PurchasesPackage,
} from 'react-native-purchases';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Circle as SvgCircle,
} from 'react-native-svg';
import twColors from 'tailwindcss/colors';

const isDiscountedPackage = (pkg: PurchasesPackage) =>
  pkg.identifier.toLowerCase().includes('discounted') ||
  pkg.product.identifier.toLowerCase().includes('discounted');

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedLine = Animated.createAnimatedComponent(Line);

const PaywallGauge = ({
  percentage,
  size = 180,
}: {
  percentage: number;
  size?: number;
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = radius + strokeWidth / 2;
  const svgHeight = cy + 16;
  const halfCircumference = Math.PI * radius;

  const progress = Math.min(Math.max(percentage / 100, 0), 1);
  const needleLength = radius - strokeWidth;

  // Semicircle arc left to right (used for both background and progress)
  const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

  // Animate on iOS, static on Android
  const animatedProgress = useSharedValue(Platform.OS === 'ios' ? 0 : progress);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      animatedProgress.value = withDelay(
        600,
        withTiming(progress, {
          duration: 1200,
          easing: Easing.out(Easing.cubic),
        })
      );
    } else {
      animatedProgress.value = progress;
    }
  }, [animatedProgress, progress]);

  const arcAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: halfCircumference * (1 - animatedProgress.value),
  }));

  const needleAnimatedProps = useAnimatedProps(() => {
    const a = Math.PI * (1 - animatedProgress.value);
    return {
      x2: cx + needleLength * Math.cos(a),
      y2: cy - needleLength * Math.sin(a),
    };
  });

  const trackColor = isDark ? twColors.green[900] : twColors.green[200];
  const gradientStart = isDark ? twColors.green[600] : twColors.green[700];
  const gradientEnd = isDark ? twColors.green[300] : twColors.green[400];
  const needleColor = isDark ? twColors.green[100] : twColors.green[900];

  return (
    <Svg
      width={size}
      height={svgHeight}
    >
      <Defs>
        <LinearGradient
          id="gaugeGradient"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <Stop
            offset="0"
            stopColor={gradientStart}
          />
          <Stop
            offset="1"
            stopColor={gradientEnd}
          />
        </LinearGradient>
      </Defs>
      <Path
        d={arcPath}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
      <AnimatedPath
        d={arcPath}
        stroke="url(#gaugeGradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${halfCircumference},${halfCircumference}`}
        animatedProps={arcAnimatedProps}
      />
      <AnimatedLine
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy}
        stroke={needleColor}
        strokeWidth={3}
        strokeLinecap="round"
        animatedProps={needleAnimatedProps}
      />
      <SvgCircle
        cx={cx}
        cy={cy}
        r={5}
        fill={needleColor}
      />
    </Svg>
  );
};

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

  const discountedPackages = availablePackages.filter(isDiscountedPackage);
  const [selectedPackage, setSelectedPackage] = useState<
    PurchasesPackage | undefined
  >(undefined);

  useEffect(() => {
    if (!selectedPackage && discountedPackages.length > 0) {
      setSelectedPackage(discountedPackages[0]);
    }
  }, [discountedPackages, selectedPackage]);

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
      source: 'fallback',
    });
    await cancelAllDripNotifications();
    const startedTrial = !isNil(selectedPackage.product.introPrice);
    onComplete?.(startedTrial ? 'trial' : 'subscribed');
  };

  // Use the non-discounted yearly package as the reference for percentage off
  const referencePackage = availablePackages.find(
    (x) => x.packageType === PACKAGE_TYPE.ANNUAL && !isDiscountedPackage(x)
  );

  const getPercentageOff = (pkg: PurchasesPackage | undefined) => {
    if (!pkg || !referencePackage) return undefined;
    const refPrice = referencePackage.product.price;
    const discountedPrice = pkg.product.price;
    if (refPrice === 0) return undefined;
    // Only compare raw prices when both are the same period
    if (
      pkg.product.subscriptionPeriod ===
      referencePackage.product.subscriptionPeriod
    ) {
      return Math.round(((refPrice - discountedPrice) / refPrice) * 100);
    }
    // Different periods: compare annualized prices
    const refPerYear = annualizePrice(referencePackage);
    const discountedPerYear = annualizePrice(pkg);
    if (refPerYear === 0) return undefined;
    const pct = Math.round(
      ((refPerYear - discountedPerYear) / refPerYear) * 100
    );
    // If negative, the "discount" is actually more expensive — don't show it
    return pct > 0 ? pct : undefined;
  };

  const percentageOff = getPercentageOff(selectedPackage);
  const referenceYearlyPriceString = referencePackage?.product.priceString;

  const isYearly = (pkg: PurchasesPackage) =>
    pkg.packageType === PACKAGE_TYPE.ANNUAL ||
    pkg.product.subscriptionPeriod === 'P1Y';

  const isMonthly = (pkg: PurchasesPackage) =>
    pkg.packageType === PACKAGE_TYPE.MONTHLY ||
    pkg.product.subscriptionPeriod === 'P1M';

  const isWeekly = (pkg: PurchasesPackage) =>
    pkg.packageType === PACKAGE_TYPE.WEEKLY ||
    pkg.product.subscriptionPeriod === 'P1W';

  const getPackageTitle = (pkg: PurchasesPackage) => {
    if (isYearly(pkg)) return t('paywall.package.yearlyTitle');
    if (isMonthly(pkg)) return t('paywall.package.monthlyTitle');
    if (isWeekly(pkg)) return t('paywall.package.weeklyTitle');
    if (pkg.packageType === PACKAGE_TYPE.LIFETIME)
      return t('paywall.package.lifetimeTitle');
    return pkg.product.title.replace(/\s*\(.*?\)/, '').trim();
  };

  const getPriceLabel = (pkg: PurchasesPackage) => {
    const price = pkg.product.priceString;
    if (isYearly(pkg)) return `${price}${t('paywall.package.perYear')}`;
    if (isMonthly(pkg)) return `${price}${t('paywall.package.perMonth')}`;
    if (isWeekly(pkg)) return `${price}${t('paywall.package.perWeek')}`;
    if (pkg.packageType === PACKAGE_TYPE.LIFETIME)
      return `${price} ${t('paywall.package.once')}`;
    return price;
  };

  const isLoading =
    isPurchasing || isRestoringPurchases || isLoadingAvailablePackages;

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: Platform.OS === 'android' ? top : paddingTop }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-start px-4">
        <CoolOffCloseButton
          onClose={handleClose}
          skipCoolOff
        />
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        style={{ overflow: 'visible' }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Gauge + percentage */}
        {percentageOff ? (
          <Animated.View
            entering={FadeInDown.delay(450).duration(700).springify()}
            className="items-center"
          >
            <PaywallGauge percentage={percentageOff} />
            <Text
              className="font-extrabold leading-none"
              style={{ fontSize: 72 }}
            >
              {percentageOff}%
            </Text>
            <Text className="text-2xl font-bold text-muted-foreground mt-1">
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

        <Animated.View entering={FadeInDown.delay(600).duration(600)}>
          <SingleReview className="mt-6" />
        </Animated.View>

        <View style={{ flex: 1, minHeight: 80 }} />

        <FooterLinks onRestorePurchase={handleRestorePurchases} />
      </ScrollView>

      {/* Bottom: packages + CTA */}
      <Animated.View
        entering={FadeInDown.delay(800).duration(600)}
        className="border-t border-border bg-background px-4 pt-3"
        style={{ paddingBottom }}
      >
        <View className="gap-3 mb-3">
          {discountedPackages.map((pkg) => {
            const isSelected =
              selectedPackage?.product.identifier === pkg.product.identifier;
            const pkgPercentOff = getPercentageOff(pkg);
            return (
              <Pressable
                key={pkg.product.identifier}
                onPress={() => setSelectedPackage(pkg)}
              >
                <Card
                  className={`rounded-xl px-4 py-4 border-2 ${isSelected ? 'border-primary' : 'border-border'}`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="gap-1">
                      <Text className="text-xl font-bold leading-none">
                        {getPackageTitle(pkg)}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-base font-semibold text-primary leading-none">
                          {getPriceLabel(pkg)}
                        </Text>
                        {isSelected && referenceYearlyPriceString && (
                          <Text className="text-sm text-muted-foreground line-through leading-none">
                            {referenceYearlyPriceString}
                          </Text>
                        )}
                      </View>
                    </View>
                    {pkgPercentOff && (
                      <Badge className="bg-green-400 border-green-400 px-2 py-0.5">
                        <Text className="text-black text-xs font-semibold">
                          {t('paywall.package.savePercent', {
                            percent: pkgPercentOff,
                          })}
                        </Text>
                      </Badge>
                    )}
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
        <Button
          size="lg"
          className="mb-2"
          disabled={isLoading || discountedPackages.length === 0}
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
        <Text className="text-center text-sm text-muted-foreground">
          {t('paywall.noCommitment')}
        </Text>
      </Animated.View>
    </View>
  );
}
