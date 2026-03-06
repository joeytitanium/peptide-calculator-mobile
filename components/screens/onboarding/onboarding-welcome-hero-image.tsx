import { IMAGE_ASSETS } from '@/components/assets';
import { Onboarding } from '@/components/onboarding/components';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import type { Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

type OnboardingWelcomeProps = {
  currentHref: Href;
};

export function OnboardingWelcomeHeroImage({
  currentHref,
}: OnboardingWelcomeProps) {
  const { t } = useTranslation();

  return (
    <Onboarding.Container
      currentHref={currentHref}
      canProceed
      progressBarHidden
      topGradientHidden
      bottomGradientHidden
    >
      {({ bottom, bottomToolbarHeight }) => (
        <View className="flex-1">
          {/* Background image — fills top portion */}
          <View className="flex-[3]">
            <Image
              source={IMAGE_ASSETS['onboarding-welcome']}
              className="absolute inset-0 w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Text content on card */}
          <View
            className="items-center justify-center px-6 bg-card rounded-t-3xl"
            style={{
              paddingBottom: bottomToolbarHeight + bottom + 16,
              paddingTop: 32,
              marginTop: -24,
            }}
          >
            <Text className="text-sm text-muted-foreground text-center mb-2">
              {t('onboarding.sheet.welcomeTo')}
            </Text>
            <Text className="text-4xl text-center font-bold text-foreground mb-2 leading-tight tracking-tight">
              {CONFIG.site.name}
            </Text>
            <Text className="text-base text-center px-4">
              {CONFIG.site.description}
            </Text>
          </View>
        </View>
      )}
    </Onboarding.Container>
  );
}
