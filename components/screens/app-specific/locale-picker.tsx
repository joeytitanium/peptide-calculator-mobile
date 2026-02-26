import { HeaderCloseButton } from '@/components/core/header-button';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Text } from '@/components/ui/text';
import {
  getDeviceLanguage,
  LOCALE_DISPLAY_NAMES,
  SUPPORTED_LOCALES,
  SupportedLocale,
} from '@/lib/i18n';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import * as Haptics from 'expo-haptics';
import { useNavigation } from 'expo-router';
import i18n from 'i18next';
import { Check } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';

iconWithClassName(Check);

type LocalePickerProps = {
  onSelect: () => void;
  onCancel: () => void;
};

export const LocalePicker = ({ onSelect, onCancel }: LocalePickerProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { localePreferenceValue, localePreferenceSetValue } = useAsyncStorage();

  const currentLocale = localePreferenceValue;
  const deviceLanguage = getDeviceLanguage();
  const isSupportedLocale = SUPPORTED_LOCALES.includes(
    deviceLanguage as SupportedLocale
  );
  const deviceLanguageDisplay = isSupportedLocale
    ? LOCALE_DISPLAY_NAMES[deviceLanguage as SupportedLocale]
    : deviceLanguage;

  // Track if this is the initial mount to avoid changing language on first render
  const isInitialMount = useRef(true);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderCloseButton onPress={onCancel} />,
    });
  }, [navigation, onCancel]);

  // Update i18n when locale preference changes (not on initial mount).
  // This must be done in a useEffect rather than directly in the event handler
  // because calling i18n.changeLanguage during a press handler crashes on Android.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const newLanguage = currentLocale ?? deviceLanguage;
    // eslint-disable-next-line import/no-named-as-default-member
    void i18n.changeLanguage(newLanguage);
  }, [currentLocale, deviceLanguage]);

  const handleSelectSystemDefault = () => {
    if (currentLocale === null || currentLocale === undefined) {
      onSelect();
      return;
    }

    void Haptics.selectionAsync();
    localePreferenceSetValue(null);
    onSelect();
  };

  const handleSelectLocale = (locale: SupportedLocale) => {
    if (locale === currentLocale) {
      onSelect();
      return;
    }

    void Haptics.selectionAsync();
    localePreferenceSetValue(locale);
    onSelect();
  };

  const isSystemDefault = currentLocale === null || currentLocale === undefined;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-2">
        <Pressable
          className="flex-row items-center justify-between py-4 border-b border-border"
          onPress={handleSelectSystemDefault}
        >
          <View>
            <Text className="text-lg text-foreground">
              {t('settings.systemDefault')}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {deviceLanguageDisplay}
            </Text>
          </View>
          {isSystemDefault && (
            <Check
              size={24}
              className="text-primary"
            />
          )}
        </Pressable>

        {SUPPORTED_LOCALES.map((locale) => {
          const isSelected = locale === currentLocale;

          return (
            <Pressable
              key={locale}
              testID={`locale-picker-${locale}`}
              className="flex-row items-center justify-between py-4 border-b border-border"
              onPress={() => handleSelectLocale(locale)}
            >
              <Text className="text-lg text-foreground">
                {LOCALE_DISPLAY_NAMES[locale]}
              </Text>
              {isSelected && (
                <Check
                  size={24}
                  className="text-primary"
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
};
