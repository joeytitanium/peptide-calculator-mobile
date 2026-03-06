import { Onboarding } from '@/components/onboarding/components';
import type { Href } from 'expo-router';
import {
  Image,
  ImageSourcePropType,
  View,
  useWindowDimensions,
} from 'react-native';

type OnboardingAppScreenshotProps = {
  currentHref: Href;
  source: ImageSourcePropType;
  title: string;
  subtitle: string;
};

export function OnboardingAppScreenshot({
  currentHref,
  source,
  title,
  subtitle,
}: OnboardingAppScreenshotProps) {
  const { width: windowWidth } = useWindowDimensions();

  const PHONE_ASPECT_RATIO = 2.05;
  const idealWidth = windowWidth * 0.65;

  return (
    <Onboarding.Container
      currentHref={currentHref}
      canProceed
      topGradientHidden
      bottomGradientHidden
    >
      {({ top, bottom, topToolbarHeight, bottomToolbarHeight }) => {
        const topChrome = topToolbarHeight + top + 16;

        return (
          <View className="flex-1 bg-background">
            {/* Screenshot in phone frame — fills remaining space after text */}
            <View
              className="flex-1 items-center justify-center"
              style={{ paddingTop: topChrome }}
            >
              <View
                className="rounded-[28px] overflow-hidden bg-neutral-300 dark:bg-neutral-400"
                style={{
                  width: idealWidth,
                  aspectRatio: 1 / PHONE_ASPECT_RATIO,
                  maxHeight: '100%',
                  padding: 4,
                }}
              >
                <View
                  className="flex-1 rounded-[24px] overflow-hidden bg-neutral-700 dark:bg-neutral-900"
                  style={{ padding: 2 }}
                >
                  <View className="flex-1 rounded-[22px] overflow-hidden">
                    <Image
                      source={source}
                      resizeMode="cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Title + subtitle — sizes to content, never clipped */}
            <View
              className="items-center justify-start px-6 bg-card rounded-t-3xl"
              style={{
                paddingBottom: bottomToolbarHeight + bottom + 8,
                paddingTop: 24,
                marginTop: 16,
              }}
            >
              <Onboarding.Title className="mb-2">{title}</Onboarding.Title>
              <Onboarding.Subtitle className="px-1">
                {subtitle}
              </Onboarding.Subtitle>
            </View>
          </View>
        );
      }}
    </Onboarding.Container>
  );
}
