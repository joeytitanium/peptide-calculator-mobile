import { annualizePrice } from '@/utils/annualize-price';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { clsx } from 'clsx';
import { isNil } from 'lodash';
import { CheckCircle2, Circle } from 'lucide-react-native';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';

iconWithClassName(CheckCircle2);
iconWithClassName(Circle);

export const PurchasePackageBaseCell = ({
  children,
  onPress,
  selected,
  className,
}: {
  children: ReactNode;
  onPress?: () => void;
  selected?: boolean;
  className?: string;
}) => (
  <Pressable onPress={onPress}>
    <Card
      className={clsx('gap-1 rounded-xl px-3 py-2', {
        'border-2 border-primary': selected,
        className,
      })}
    >
      {children}
    </Card>
  </Pressable>
);

export const PurchasePackageCell = ({
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
  const hasIntroPrice = !isNil(purchasePackage.product.introPrice);

  const weeklyPackage = allPackages.find(
    (x) => x.packageType === PACKAGE_TYPE.WEEKLY
  );
  const yearlyPackage = allPackages.find(
    (x) => x.packageType === PACKAGE_TYPE.ANNUAL
  );

  const title = (() => {
    if (hasIntroPrice) {
      return t('paywall.package.daysFree', {
        count: purchasePackage.product.introPrice.periodNumberOfUnits,
      });
    }

    return purchasePackage.product.title;
  })();

  const subtitle = (() => {
    const suffix = (() => {
      const timeframe = purchasePackage.packageType;
      if (timeframe === PACKAGE_TYPE.ANNUAL) {
        return t('paywall.package.yearly');
      } else if (timeframe === PACKAGE_TYPE.WEEKLY) {
        return t('paywall.package.weekly');
      } else if (timeframe === PACKAGE_TYPE.MONTHLY) {
        return t('paywall.package.monthly');
      }

      return timeframe.toLowerCase();
    })();

    return `${hasIntroPrice ? t('paywall.package.then') : ''}${purchasePackage.product.priceString}/${suffix}`;
  })();

  const strikethroughPrice = (() => {
    if (
      isNil(weeklyPackage) ||
      isNil(yearlyPackage) ||
      allPackages.length !== 2 ||
      purchasePackage.packageType !== PACKAGE_TYPE.ANNUAL
    ) {
      return undefined;
    }

    return weeklyPackage.product.pricePerYearString;
  })();

  const percentageOff = (() => {
    if (
      allPackages.length !== 2 ||
      isNil(weeklyPackage) ||
      isNil(yearlyPackage) ||
      purchasePackage.packageType !== PACKAGE_TYPE.ANNUAL
    ) {
      return undefined;
    }

    const weeklyPrice = annualizePrice(weeklyPackage);
    const yearlyPrice = annualizePrice(yearlyPackage);

    return Math.floor(((weeklyPrice - yearlyPrice) / weeklyPrice) * 100);
  })();

  return (
    <PurchasePackageBaseCell
      onPress={onPress}
      selected={selected}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {selected ? (
            <CheckCircle2
              className="h-4 w-4 fill-primary text-muted"
              size={CONFIG.icon.size.md}
            />
          ) : (
            <Circle
              className="h-4 w-4 text-primary"
              size={CONFIG.icon.size.md}
            />
          )}
          <View>
            <Text className="text-lg font-semibold">
              {/* Android appends app name in parentheses to the title - remove it */}
              {title.replace(/\s*\(.*?\)/, '').trim()}
            </Text>
            <View className="flex-row items-center gap-1 text-sm font-medium leading-none">
              {strikethroughPrice && (
                <Text className="text-muted-foreground line-through">
                  {strikethroughPrice}
                </Text>
              )}
              <Text className="">{subtitle}</Text>
            </View>
          </View>
        </View>
        {purchasePackage.packageType === PACKAGE_TYPE.ANNUAL && (
          <>
            <Text className="text-sm font-medium text-muted-foreground">
              {purchasePackage.product.pricePerWeekString}
              {t('paywall.package.perWeek')}
            </Text>
            {percentageOff && (
              <Badge className="absolute -top-5 right-0">
                <Text className="">
                  {t('paywall.package.percentOff', { percent: percentageOff })}
                </Text>
              </Badge>
            )}
          </>
        )}
        {purchasePackage.packageType !== PACKAGE_TYPE.ANNUAL &&
          hasIntroPrice && (
            <Text className="py-0.5 text-muted-foreground">
              {t('paywall.package.freeTrial')}
            </Text>
          )}
      </View>
    </PurchasePackageBaseCell>
  );
};
