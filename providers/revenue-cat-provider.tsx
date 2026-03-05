import { CONFIG } from '@/config';
import { useDeterministicallyRequestReview } from '@/hooks/use-deterministically-request-review';
import { logDebugMessage, logError } from '@/utils/logger';
import { isAfter } from 'date-fns';
import { isNil } from 'lodash';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  MakePurchaseResult,
  PurchasesEntitlementInfo,
  PurchasesPackage,
} from 'react-native-purchases';

type PurchaseResult = {
  result: MakePurchaseResult | null;
  error?: string | null;
  userCancelled?: boolean;
};
type RestorePurchasesResult = {
  result: CustomerInfo | null;
  error: string | null;
};

type RevenueCatContextType = {
  loadOfferings: () => Promise<void>;
  loadOfferingByIdentifier: (params: {
    identifier: string;
  }) => Promise<PurchasesPackage[]>;
  refreshSubscriptionStatus: () => Promise<void>;
  setPushToken: (pushToken: string) => void;
  availablePackages: PurchasesPackage[];
  purchasePackage: (pkg: PurchasesPackage) => Promise<PurchaseResult>;
  restorePurchases: () => Promise<RestorePurchasesResult>;
  activeSubscriptionInfo: PurchasesEntitlementInfo | null;
  hasActiveSubscription: boolean | null;
  customerInfo: CustomerInfo | null;
  isPurchasing: boolean;
  isRestoringPurchases: boolean;
  isLoadingAvailablePackages: boolean;
  isLoadingCustomerInfo: boolean;
  isRefreshingSubscriptionStatus: boolean;
  loadOfferingsError: string | null;
};

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(
  undefined
);

export function RevenueCatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [availablePackages, setAvailablePackages] = useState<
    PurchasesPackage[]
  >([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoringPurchases, setIsRestoringPurchases] = useState(false);
  const [isLoadingAvailablePackages, setIsLoadingAvailablePackages] =
    useState(false);
  const [loadOfferingsError, setLoadOfferingsError] = useState<string | null>(
    null
  );
  const [isRefreshingSubscriptionStatus, setIsRefreshingSubscriptionStatus] =
    useState(false);
  const [isLoadingCustomerInfo, setIsLoadingCustomerInfo] = useState(true);
  const { requestReview } = useDeterministicallyRequestReview();

  useEffect(() => {
    const customerInfoUpdateListener = (info: CustomerInfo) => {
      updateCustomerInfo(info);
    };

    const setupRevenueCat = async () => {
      try {
        if (__DEV__) {
          void Purchases.setLogLevel(LOG_LEVEL.ERROR);
        }

        const apiKey = Platform.select({
          ios: CONFIG.revenuecat.apiKey.ios,
          android: CONFIG.revenuecat.apiKey.android,
          default: undefined,
        });

        if (!apiKey) {
          logError({
            message: 'RevenueCat API key is not set',
          });
          throw new Error('RevenueCat API key is not set');
        }

        Purchases.configure({
          apiKey,
        });
        await Purchases.enableAdServicesAttributionTokenCollection();

        Purchases.addCustomerInfoUpdateListener(customerInfoUpdateListener);

        await loadOfferings();

        // Get customer info after configuration
        const customerInfo = await Purchases.getCustomerInfo();
        updateCustomerInfo(customerInfo);
      } catch (error) {
        logDebugMessage({
          message: typeof error === 'string' ? error : 'Unknown error',
          context: { error },
        });
      }
    };

    void setupRevenueCat();

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdateListener);
    };
  }, []);

  const refreshSubscriptionStatus = async () => {
    if (isRefreshingSubscriptionStatus) {
      return;
    }

    try {
      setIsRefreshingSubscriptionStatus(true);
      await Purchases.invalidateCustomerInfoCache();
      const customerInfo = await Purchases.getCustomerInfo();
      updateCustomerInfo(customerInfo);
    } catch (error) {
      setIsRefreshingSubscriptionStatus(false);
      logError({
        message: 'Failed to refresh subscription status',
        error,
      });
    } finally {
      setIsRefreshingSubscriptionStatus(false);
    }
  };

  const loadOfferings = async () => {
    if (isLoadingAvailablePackages) {
      return;
    }

    try {
      setIsLoadingAvailablePackages(true);
      setLoadOfferingsError(null);
      const offerings = await Purchases.getOfferings();

      if (isNil(offerings.current)) {
        setAvailablePackages([]);
        return;
      }

      setAvailablePackages(
        offerings.current.availablePackages as PurchasesPackage[]
      );
    } catch (error: any) {
      setLoadOfferingsError(error?.message ?? 'Failed to load offerings');
      logError({
        message: 'Failed to load offerings',
        error,
        context: {
          message: error?.message,
        },
      });
    } finally {
      setIsLoadingAvailablePackages(false);
    }
  };

  const updateCustomerInfo = (info: CustomerInfo) => {
    setCustomerInfo(info);
    setIsLoadingCustomerInfo(false);
  };

  const setPushToken = (pushToken: string) => {
    void Purchases.setPushToken(pushToken);
  };

  const activeSubscriptionInfo: PurchasesEntitlementInfo | null = (() => {
    if (isNil(customerInfo)) {
      return null;
    }

    const activeSubscriptions = customerInfo.entitlements.active;
    if (Object.keys(activeSubscriptions).length === 0) {
      return null;
    }
    return Object.values(activeSubscriptions)[0];
  })();

  const hasActiveSubscription: boolean | null = (() => {
    if (isNil(activeSubscriptionInfo)) {
      return null;
    }

    // TODO: check if this is correct
    if (!activeSubscriptionInfo.isActive) {
      return false;
    }

    if (isNil(activeSubscriptionInfo.expirationDate)) {
      return false;
    }

    const expirationDate = new Date(activeSubscriptionInfo.expirationDate);
    const now = new Date();

    return isAfter(expirationDate, now);
  })();

  const purchasePackage = async (pkg: PurchasesPackage) => {
    try {
      setIsPurchasing(true);
      const result = await Purchases.purchasePackage(pkg);
      setIsPurchasing(false);
      await requestReview();
      return { result, error: null };
    } catch (error: any) {
      setIsPurchasing(false);
      logError({
        message: 'Failed to purchase package',
        error,
      });
      return {
        result: null,
        error: error.message,
        userCancelled: error.userCancelled ?? false,
      };
    }
  };

  const loadOfferingByIdentifier = async ({
    identifier,
  }: {
    identifier: string;
  }): Promise<PurchasesPackage[]> => {
    try {
      const offerings = await Purchases.getOfferings();
      const offering = offerings.all[identifier];
      if (!offering) return [];
      return offering.availablePackages as PurchasesPackage[];
    } catch (error) {
      logError({
        message: `Failed to load offering: ${identifier}`,
        error,
      });
      return [];
    }
  };

  const restorePurchases = async (): Promise<RestorePurchasesResult> => {
    try {
      setIsRestoringPurchases(true);
      const result = await Purchases.restorePurchases();
      updateCustomerInfo(result);
      setIsRestoringPurchases(false);
      return { result, error: null };
    } catch (error: any) {
      setIsRestoringPurchases(false);
      logError({
        message: 'Failed to restore purchases',
        error,
      });

      if (error?.userInfo.readable_error_code === 'RECEIPT_ALREADY_IN_USE') {
        return {
          result: null,
          error:
            'This was purchased by a different user. Please sign in with the original account that made the purchase.',
        };
      }

      return {
        result: null,
        error:
          error?.userInfo?.NSUnderlyingError?.userInfo
            ?.NSLocalizedDescription ?? 'Failed to restore purchases',
      };
    }
  };

  if (__DEV__) {
    console.log(
      `RC subscription: ${JSON.stringify(
        Object.keys(customerInfo?.entitlements.active ?? {}).length > 0
          ? 'Active'
          : 'Inactive',
        null,
        '\t'
      )}`
    );
  }

  return (
    <RevenueCatContext.Provider
      value={{
        loadOfferings,
        loadOfferingByIdentifier,
        refreshSubscriptionStatus,
        setPushToken,
        availablePackages,
        purchasePackage,
        restorePurchases,
        activeSubscriptionInfo,
        hasActiveSubscription,
        customerInfo,
        isPurchasing,
        isRestoringPurchases,
        isLoadingCustomerInfo,
        isLoadingAvailablePackages,
        isRefreshingSubscriptionStatus,
        loadOfferingsError,
      }}
    >
      {children}
    </RevenueCatContext.Provider>
  );
}

export function useRevenueCat() {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error('useRevenueCat must be used within an RevenueCatProvider');
  }
  return context;
}
