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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const PHONE_ASPECT_RATIO = 2.05;
  const TEXT_AREA_HEIGHT = 140; // title + subtitle + padding estimate

  return (
    <Onboarding.Container
      currentHref={currentHref}
      canProceed
      topGradientHidden
      bottomGradientHidden
    >
      {({ top, bottom, topToolbarHeight, bottomToolbarHeight }) => {
        const topChrome = topToolbarHeight + top + 16;
        const bottomChrome =
          bottomToolbarHeight + bottom + 8 + TEXT_AREA_HEIGHT;
        const maxHeight = windowHeight - topChrome - bottomChrome;
        const idealWidth = windowWidth * 0.65;
        const idealHeight = idealWidth * PHONE_ASPECT_RATIO;
        // If height-constrained, shrink width proportionally to maintain aspect ratio
        const phoneHeight = Math.min(idealHeight, maxHeight);
        const phoneWidth =
          phoneHeight < idealHeight
            ? phoneHeight / PHONE_ASPECT_RATIO
            : idealWidth;

        return (
          <View className="flex-1 bg-background">
            {/* Screenshot in phone frame */}
            <View
              className="items-center"
              style={{ paddingTop: topChrome }}
            >
              <View
                className="rounded-[28px] overflow-hidden bg-neutral-300 dark:bg-neutral-400"
                style={{
                  width: phoneWidth,
                  height: phoneHeight,
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

            {/* Title + subtitle pinned above button */}
            <View
              className="flex-1 items-center justify-start px-6 bg-card rounded-t-3xl"
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
