import { SlideUpRevealView } from '@/components/core/animations/slide-up-reveal-view';
import { Onboarding } from '@/components/onboarding/components';
import { CONFIG } from '@/config';
import { useColorScheme } from '@/lib/use-color-scheme';
import { Image } from 'expo-image';
import type { Href } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Platform, useWindowDimensions, View } from 'react-native';
import colors from 'tailwindcss/colors';

const IMAGE_ASPECT_RATIO = 2532 / 1170; // height / width from original 1170×2532

interface OnboardingCommunityProps {
  currentHref: Href;
  title: string;
  subtitle: string;
  buttonText?: string;
  imageSource: number;
  icon: LucideIcon;
}

export const OnboardingCommunity = ({
  currentHref,
  title,
  subtitle,
  buttonText,
  imageSource,
  icon: Icon,
}: OnboardingCommunityProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { isDarkColorScheme } = useColorScheme();
  const { width: screenWidth } = useWindowDimensions();

  const imageWidth = screenWidth * 0.9;
  const imageHeight = imageWidth * IMAGE_ASPECT_RATIO;

  useEffect(() => {
    if (Platform.OS === 'android') {
      scaleAnim.setValue(1);
      return;
    }

    scaleAnim.setValue(0.3);
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim]);

  return (
    <Onboarding.Container
      currentHref={currentHref}
      canProceed
      progressBarHidden
      buttonText={buttonText}
    >
      {({ top, bottom, topToolbarHeight, bottomToolbarHeight }) => (
        <Onboarding.ScrollView
          topInset={topToolbarHeight + top + CONFIG.layout.navigationBarPadding}
          bottomInset={bottomToolbarHeight + bottom}
          alignCenter
        >
          <View className="flex-1 justify-center items-center px-4">
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
              }}
              className="mb-6"
            >
              <Onboarding.IconBadge
                icon={Icon}
                color="violet"
                iconSize={36}
                strokeWidth={2}
              />
            </Animated.View>
            <SlideUpRevealView delay={300}>
              <Onboarding.Title className="mb-4">{title}</Onboarding.Title>
            </SlideUpRevealView>
            <SlideUpRevealView delay={500}>
              <Onboarding.Subtitle className="mb-8">
                {subtitle}
              </Onboarding.Subtitle>
            </SlideUpRevealView>
            <SlideUpRevealView
              delay={700}
              className="w-full items-center"
            >
              <Image
                source={imageSource}
                style={{
                  width: imageWidth,
                  height: imageHeight,
                  borderRadius: 32,
                  borderColor: isDarkColorScheme
                    ? colors.white
                    : colors.gray[400],
                  borderWidth: 4,
                }}
                contentFit="cover"
              />
            </SlideUpRevealView>
          </View>
        </Onboarding.ScrollView>
      )}
    </Onboarding.Container>
  );
};
