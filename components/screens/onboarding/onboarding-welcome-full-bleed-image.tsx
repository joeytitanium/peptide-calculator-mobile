import { IMAGE_ASSETS } from '@/components/assets';
import { HeaderIconButton } from '@/components/core/header-button';
import { iconWithClassName } from '@/components/icons/iconWithClassName';

import { Onboarding } from '@/components/onboarding/components';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import clsx from 'clsx';
import { Href, useNavigation, useRouter } from 'expo-router';
import { Zap } from 'lucide-react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

iconWithClassName(Zap);

export const OnboardingWelcomeFullBleedImage = ({
  currentHref,
  onPresentPaywall,
  colorScheme,
  textPosition = 'bottom',
  title,
  subtitle,
  topGradientHidden = false,
  bottomGradientHidden = false,
}: {
  currentHref: Href;
  onPresentPaywall: () => void;
  colorScheme: 'light' | 'dark';
  textPosition?: 'top' | 'bottom';
  title?: string;
  subtitle?: string;
  topGradientHidden?: boolean;
  bottomGradientHidden?: boolean;
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();
  const displayTitle = title ?? t('onboarding.welcome.title');
  const displaySubtitle = subtitle ?? t('onboarding.welcome.subtitle');

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    navigation.setOptions({
      headerRight: () => (
        <HeaderIconButton onPress={onPresentPaywall}>
          <Zap
            size={CONFIG.icon.size.md}
            className="text-foreground"
          />
        </HeaderIconButton>
      ),
    });
  }, [navigation, router, onPresentPaywall]);

  return (
    <Onboarding.Container
      currentHref={currentHref}
      progressBarHidden
      canProceed
      topGradientHidden={topGradientHidden}
      bottomGradientHidden={bottomGradientHidden}
    >
      {({ top, topToolbarHeight }) => (
        <View className="flex-1">
          <Image
            source={IMAGE_ASSETS['onboarding-welcome']}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <View
            className={clsx('absolute left-0 right-0 pl-6 pr-8', {
              'pt-6': textPosition === 'top',
              'pb-6': textPosition === 'bottom',
            })}
            style={
              textPosition === 'top'
                ? { top: topToolbarHeight + top + 16 }
                : { bottom: 80 }
            }
          >
            <Text
              className={clsx(
                'text-4xl font-bold tracking-tighter leading-none',
                {
                  'text-black': colorScheme === 'light',
                  'text-white': colorScheme === 'dark',
                }
              )}
            >
              {displayTitle}
            </Text>
            <Text
              className={clsx(
                'text-lg leading-tight tracking-tighter font-medium',
                {
                  'text-black': colorScheme === 'light',
                  'text-white': colorScheme === 'dark',
                }
              )}
            >
              {displaySubtitle}
            </Text>
          </View>
        </View>
      )}
    </Onboarding.Container>
  );
};
