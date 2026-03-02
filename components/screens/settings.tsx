import { Avatar } from '@/components/core/avatar';
import { GlowIcon } from '@/components/core/glow-icon';
import { TableView } from '@/components/core/table-view';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { storeUrl } from '@/hooks/use-deterministically-request-review';
import { useSafeAreaInsets } from '@/hooks/use-safe-area-insets';
import { LOCALE_DISPLAY_NAMES, SupportedLocale } from '@/lib/i18n';
import { useColorScheme } from '@/lib/use-color-scheme';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { useAuth } from '@/providers/auth-provider';
import { useRecords } from '@/providers/records-provider';
import { useRevenueCat } from '@/providers/revenue-cat-provider';
import { getSeedRecords } from '@/screenshots/seed-data';
import { presentInAppBrowser } from '@/utils/present-in-app-browser';
import * as Application from 'expo-application';
import * as StoreReview from 'expo-store-review';
import {
  Bug,
  Database,
  Gem,
  GlobeLock,
  HeartHandshake,
  Languages,
  MessageCircle,
  Share as ShareIcon,
  Star,
  SunMoon,
  User,
  Zap,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  Share,
  View,
} from 'react-native';
import Purchases from 'react-native-purchases';

iconWithClassName(Bug);
iconWithClassName(Database);
iconWithClassName(Languages);
iconWithClassName(User);
iconWithClassName(MessageCircle);

iconWithClassName(Star);
iconWithClassName(ShareIcon);
iconWithClassName(SunMoon);
iconWithClassName(GlobeLock);
iconWithClassName(HeartHandshake);
iconWithClassName(Gem);

const PROFILE_IMAGE_SIZE = 40;

type SettingsScreenProps = {
  onNavigateToAccount: () => void;
  onNavigateToLocale: () => void;
  accountSupportDisabled?: boolean;
  onPresentPaywall: () => void;
};

export const SettingsScreen = ({
  onNavigateToAccount,
  onNavigateToLocale,
  accountSupportDisabled = false,
  onPresentPaywall,
}: SettingsScreenProps) => {
  const { t } = useTranslation();
  const { cycleColorScheme, colorSchemePreference } = useColorScheme();
  const { hasActiveSubscription, isLoadingCustomerInfo } = useRevenueCat();
  const { paddingTop, paddingBottom } = useSafeAreaInsets({
    navigationBarPadding: 'none',
    nativePadding: 'none',
  });
  const { isAuthenticated, username, profileImageUrl } = useAuth();
  const {
    onboardingCompletedRemoveValue,
    localePreferenceValue,
    screenshotModeValue,
  } = useAsyncStorage();
  const { replaceAllRecords } = useRecords();

  const handleRateApp = async () => {
    await Linking.openURL(storeUrl());
  };

  const handleShareApp = async () => {
    try {
      const appStoreUrl = `https://apps.apple.com/app/apple-store/id${StoreReview.storeUrl()}`;
      await Share.share({
        message: t('settings.shareMessage', { appName: CONFIG.site.name }),
        url: appStoreUrl,
      });
    } catch {
      // User cancelled or error occurred - silently fail
    }
  };

  const handleContactSupport = async () => {
    try {
      const appVersion = `${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`;
      const osVersion = `${Platform.OS} ${Platform.Version}`;
      const userId = await Purchases.getAppUserID();

      const body = `


---------------
${t('settings.emailPlaceholder')}

${t('settings.emailAppName')} ${CONFIG.site.name}
${t('settings.emailAppVersion')} ${appVersion}
${t('settings.emailOS')} ${osVersion}
${t('settings.emailUserId')} ${userId}`;
      const url = `mailto:${CONFIG.supportEmail}?body=${encodeURIComponent(
        body
      )}`;
      await Linking.openURL(url);
    } catch {
      // Error occurred - silently fail
    }
  };

  const handleCycleDarkMode = () => {
    cycleColorScheme();
  };

  const colorSchemeLabel =
    colorSchemePreference === 'system'
      ? t('settings.themeSystem')
      : colorSchemePreference === 'light'
        ? t('settings.themeLight')
        : t('settings.themeDark');

  const getLocaleLabel = (): string => {
    if (localePreferenceValue === null || localePreferenceValue === undefined) {
      return t('settings.systemDefault');
    }
    return LOCALE_DISPLAY_NAMES[localePreferenceValue as SupportedLocale];
  };
  const localeLabel = getLocaleLabel();

  const handlePrivacyPolicy = () => {
    void presentInAppBrowser({ url: CONFIG.privacyPolicyUrl });
  };

  const handleTermsOfService = () => {
    void presentInAppBrowser({ url: CONFIG.termsOfServiceUrl });
  };

  const handleAccountSettings = () => {
    onNavigateToAccount();
  };

  const handleResetOnboarding = async () => {
    await onboardingCompletedRemoveValue();
    Alert.alert(
      t('settings.onboardingResetTitle'),
      t('settings.onboardingResetMessage')
    );
  };

  const handleSeedData = () => {
    const seedRecords = getSeedRecords({ t });
    replaceAllRecords({ records: seedRecords });
    Alert.alert('Seed Data', `Loaded ${seedRecords.length} records`);
  };

  return (
    <ScrollView
      className="bg-background"
      contentContainerStyle={{
        paddingTop,
        paddingBottom,
      }}
    >
      <View className="px-2 gap-8">
        {!isLoadingCustomerInfo &&
          !hasActiveSubscription &&
          !screenshotModeValue && (
            <TableView.Section>
              <TableView.Row
                title={t('settings.unlockPro')}
                subtitle={t('settings.unlockProSubtitle')}
                onPress={onPresentPaywall}
                leftElement={<GlowIcon glow={false} icon={Zap} color="violet" />}
                rightElementType="chevron"
                hideSeparator
              />
            </TableView.Section>
          )}
        <TableView.Section>
          <TableView.Row
            title={t('settings.contactSupport')}
            subtitle={t('settings.contactSupportSubtitle')}
            onPress={handleContactSupport}
            leftElement={<GlowIcon glow={false} icon={MessageCircle} color="blue" />}
            rightElementType="external-link"
          />
          <TableView.Row
            title={t('settings.rateApp')}
            subtitle={t('settings.rateAppSubtitle')}
            onPress={handleRateApp}
            leftElement={<GlowIcon glow={false} icon={Star} color="amber" />}
            rightElementType="external-link"
          />
          <TableView.Row
            title={t('settings.shareApp')}
            subtitle={t('settings.shareAppSubtitle')}
            onPress={handleShareApp}
            leftElement={<GlowIcon glow={false} icon={ShareIcon} color="teal" />}
            rightElementType="external-link"
          />
          <TableView.Row
            title={t('settings.appearance')}
            subtitle={t('settings.appearanceSubtitle')}
            onPress={handleCycleDarkMode}
            leftElement={<GlowIcon glow={false} icon={SunMoon} color="purple" />}
            rightElement={
              <Text className="text-muted-foreground">{colorSchemeLabel}</Text>
            }
          />
          <TableView.Row
            title={t('settings.language')}
            onPress={onNavigateToLocale}
            leftElement={<GlowIcon glow={false} icon={Languages} color="blue" />}
            rightElement={
              <Text className="text-muted-foreground">{localeLabel}</Text>
            }
            rightElementType="chevron"
            hideSeparator
            testID="settings-language-row"
          />
        </TableView.Section>
        <TableView.Section>
          <TableView.Row
            title={t('settings.privacyPolicy')}
            subtitle={t('settings.privacyPolicySubtitle')}
            onPress={handlePrivacyPolicy}
            leftElement={<GlowIcon glow={false} icon={GlobeLock} color="teal" />}
            rightElementType="external-link"
          />
          <TableView.Row
            title={t('settings.termsOfService')}
            subtitle={t('settings.termsOfServiceSubtitle')}
            onPress={handleTermsOfService}
            leftElement={<GlowIcon glow={false} icon={HeartHandshake} color="rose" />}
            rightElementType="external-link"
            hideSeparator
          />
        </TableView.Section>

        {!accountSupportDisabled && isAuthenticated && (
          <TableView.Section>
            <TableView.Row
              title={t('settings.account')}
              subtitle={
                username ? `@${username}` : t('settings.signedInWithApple')
              }
              onPress={handleAccountSettings}
              rightElementType="chevron"
              hideSeparator
              leftElement={
                <Avatar
                  imageUrl={profileImageUrl}
                  size={PROFILE_IMAGE_SIZE}
                  fallback={
                    <User
                      size={PROFILE_IMAGE_SIZE * 0.5}
                      className="text-muted-foreground"
                    />
                  }
                />
              }
            />
          </TableView.Section>
        )}

        {__DEV__ && (
          <TableView.Section>
            <TableView.Row
              title={t('settings.resetOnboarding')}
              subtitle={t('settings.resetOnboardingSubtitle')}
              onPress={handleResetOnboarding}
              leftElement={<GlowIcon glow={false} icon={Bug} color="amber" />}
            />
            <TableView.Row
              testID="settings-seed-data-row"
              title="Seed Data"
              subtitle="Load sample records for testing"
              onPress={handleSeedData}
              leftElement={<GlowIcon glow={false} icon={Database} color="teal" />}
              hideSeparator
            />
          </TableView.Section>
        )}

        <Text className="text-xs text-center text-muted-foreground">
          {Application.applicationName} - {t('settings.version')}{' '}
          {Application.nativeApplicationVersion} (
          {Application.nativeBuildVersion})
        </Text>
      </View>
    </ScrollView>
  );
};
