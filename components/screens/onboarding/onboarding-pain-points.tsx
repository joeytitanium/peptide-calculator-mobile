import { SlideUpRevealView } from '@/components/core/animations/slide-up-reveal-view';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Onboarding } from '@/components/onboarding/components';
import { useColorScheme } from '@/lib/use-color-scheme';
import { clsx } from 'clsx';
import type { Href } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Platform, View } from 'react-native';

interface OnboardingPainPointsProps {
  currentHref: Href;
  title: string;
  subtitle: string;
  buttonText?: string;
  icon: LucideIcon;
  iconBgColor: 'red' | 'green' | 'blue' | 'violet' | 'orange' | 'yellow';
}

export const OnboardingPainPoints = ({
  currentHref,
  title,
  subtitle,
  buttonText,
  icon: Icon,
  iconBgColor,
}: OnboardingPainPointsProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { isDarkColorScheme } = useColorScheme();

  iconWithClassName(Icon);

  useEffect(() => {
    if (Platform.OS === 'android') {
      scaleAnim.setValue(1);
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
                    strokeWidth={2.5}
                  />
                </View>
              </View>
            </Animated.View>
            <SlideUpRevealView delay={300}>
              <Onboarding.Title className="mb-4">{title}</Onboarding.Title>
            </SlideUpRevealView>
            <SlideUpRevealView delay={500}>
              <Onboarding.Subtitle className="mb-8">
                {subtitle}
              </Onboarding.Subtitle>
            </SlideUpRevealView>
          </View>
        </Onboarding.ScrollView>
      )}
    </Onboarding.Container>
  );
};
