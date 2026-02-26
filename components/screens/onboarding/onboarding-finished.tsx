import { SlideUpRevealView } from '@/components/core/animations/slide-up-reveal-view';
import { Onboarding } from '@/components/onboarding/components';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import type { Href } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, View } from 'react-native';

interface OnboardingFinishedProps {
  currentHref: Href;
  icon: LucideIcon;
  iconFilled?: boolean;
  title: string;
  subtitle: string;
  animatedNumber: number;
  numberLabel: string;
  bottomTitle: string;
  bottomSubtitle: string;
  buttonText?: string;
}

export const OnboardingFinished = ({
  currentHref,
  icon: Icon,
  iconFilled = false,
  title,
  subtitle,
  animatedNumber,
  numberLabel,
  bottomTitle,
  bottomSubtitle,
  buttonText,
}: OnboardingFinishedProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const numberAnim = useRef(new Animated.Value(0)).current;
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'android') {
      scaleAnim.setValue(1);
      setDisplayNumber(animatedNumber);
      return;
    }

    // Animate icon: start small, grow larger then back to normal size
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

    // Animate number counting up
    const listenerId = numberAnim.addListener(({ value }) => {
      setDisplayNumber(Math.round(value));
    });

    Animated.timing(numberAnim, {
      toValue: animatedNumber,
      duration: 1500,
      delay: 800,
      useNativeDriver: false,
    }).start();

    return () => {
      numberAnim.removeListener(listenerId);
    };
  }, [scaleAnim, numberAnim, animatedNumber]);

  return (
    <Onboarding.Container
      currentHref={currentHref}
      canProceed
      progressBarHidden
      buttonText={buttonText}
    >
      {({ top, bottom, topToolbarHeight, bottomToolbarHeight }) => (
        <Onboarding.ScrollView
          topInset={topToolbarHeight + top}
          bottomInset={bottomToolbarHeight + bottom}
          alignCenter
        >
          <View className="flex-1 justify-center items-center px-4">
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
              }}
              className="mb-8"
            >
              <Onboarding.IconBadge
                icon={Icon}
                color={CONFIG.tintColor.base}
                filled={iconFilled}
              />
            </Animated.View>
            <SlideUpRevealView delay={300}>
              <Onboarding.Title className="mb-2">{title}</Onboarding.Title>
            </SlideUpRevealView>
            <SlideUpRevealView delay={500}>
              <Onboarding.Subtitle>{subtitle}</Onboarding.Subtitle>
            </SlideUpRevealView>
            <SlideUpRevealView
              delay={700}
              className="w-full"
            >
              <View className="rounded-3xl bg-card px-6 py-6 items-center my-8">
                <Text className="text-5xl font-bold mb-1">
                  {displayNumber.toLocaleString()}+
                </Text>
                <Onboarding.Subtitle>{numberLabel}</Onboarding.Subtitle>
              </View>
            </SlideUpRevealView>
            <SlideUpRevealView delay={1100}>
              <Onboarding.Title className="mb-4">
                {bottomTitle}
              </Onboarding.Title>
              <Onboarding.Subtitle>{bottomSubtitle}</Onboarding.Subtitle>
            </SlideUpRevealView>
          </View>
        </Onboarding.ScrollView>
      )}
    </Onboarding.Container>
  );
};
