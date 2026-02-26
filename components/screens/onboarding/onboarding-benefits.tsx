import { SlideLeftRevealView } from '@/components/core/animations/slide-left-reveal-view';
import { SlideUpRevealView } from '@/components/core/animations/slide-up-reveal-view';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Onboarding } from '@/components/onboarding/components';
import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/lib/use-color-scheme';
import { clsx } from 'clsx';
import type { Href } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { Check } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Platform, View } from 'react-native';

iconWithClassName(Check);

interface OnboardingBenefitsProps {
  currentHref: Href;
  title: string;
  benefits: string[];
  buttonText?: string;
  icon: LucideIcon;
  iconBgColor: 'red' | 'green' | 'blue' | 'violet' | 'orange' | 'yellow';
}

export const OnboardingBenefits = ({
  currentHref,
  title,
  benefits,
  buttonText,
  icon: Icon,
  iconBgColor,
}: OnboardingBenefitsProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { isDarkColorScheme } = useColorScheme();

  iconWithClassName(Icon);

  useEffect(() => {
    if (Platform.OS === 'android') {
      scaleAnim.setValue(1);
      return;
    }

    // Animate check icon: start small, grow larger then back to normal size
    scaleAnim.setValue(0.3);
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
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

  const bgColorClasses = {
    red: {
      light: 'bg-red-100',
      dark: 'bg-red-950/50',
      inner: 'bg-red-500',
    },
    green: {
      light: 'bg-green-100',
      dark: 'bg-green-950/50',
      inner: 'bg-green-500',
    },
    blue: {
      light: 'bg-blue-100',
      dark: 'bg-blue-950/50',
      inner: 'bg-blue-500',
    },
    violet: {
      light: 'bg-violet-100',
      dark: 'bg-violet-950/50',
      inner: 'bg-violet-500',
    },
    orange: {
      light: 'bg-orange-100',
      dark: 'bg-orange-950/50',
      inner: 'bg-orange-500',
    },
    yellow: {
      light: 'bg-yellow-100',
      dark: 'bg-yellow-950/50',
      inner: 'bg-yellow-500',
    },
  };

  const colors = bgColorClasses[iconBgColor];

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
              <View
                className={clsx(
                  'w-24 h-24 rounded-full items-center justify-center',
                  {
                    [colors.light]: !isDarkColorScheme,
                    [colors.dark]: isDarkColorScheme,
                  }
                )}
              >
                <View
                  className={clsx(
                    'w-16 h-16 rounded-full items-center justify-center',
                    colors.inner
                  )}
                >
                  <Icon
                    size={40}
                    className="text-white"
                    strokeWidth={3}
                  />
                </View>
              </View>
            </Animated.View>
            <SlideUpRevealView delay={300}>
              <Onboarding.Title className="mb-8">{title}</Onboarding.Title>
            </SlideUpRevealView>
            <View className="gap-2">
              {benefits.map((benefit, index) => (
                <SlideLeftRevealView
                  key={benefit}
                  delay={500 + index * 150}
                  translateX={-30}
                >
                  <View className="flex-row items-center gap-3">
                    <Check
                      size={20}
                      className="text-green-500"
                      strokeWidth={3}
                    />
                    <Text className="text-lg font-medium">{benefit}</Text>
                  </View>
                </SlideLeftRevealView>
              ))}
            </View>
          </View>
        </Onboarding.ScrollView>
      )}
    </Onboarding.Container>
  );
};
