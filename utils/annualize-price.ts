import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';

/**
 * Manually annualizes a package's price.
 * `product.pricePerYear` is unreliable on Android, so we calculate it ourselves.
 */
export const annualizePrice = (pkg: PurchasesPackage): number => {
  const price = pkg.product.price;
  const period = pkg.product.subscriptionPeriod;

  if (pkg.packageType === PACKAGE_TYPE.WEEKLY || period === 'P1W')
    return price * 52;
  if (pkg.packageType === PACKAGE_TYPE.MONTHLY || period === 'P1M')
    return price * 12;

  return price;
};
