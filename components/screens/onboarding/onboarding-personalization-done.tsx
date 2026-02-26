import { SlideUpRevealView } from '@/components/core/animations/slide-up-reveal-view';
import { Onboarding } from '@/components/onboarding/components';
import type { Href } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Platform, View } from 'react-native';

interface OnboardingPersonalizationDoneProps {
  currentHref: Href;
  title: string;
  subtitle: string;
}

export const OnboardingPersonalizationDone = ({
  currentHref,
  title,
  subtitle,
}: OnboardingPersonalizationDoneProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

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

  return (
    <Onboarding.Container
      currentHref={currentHref}
      canProceed
      progressBarHidden
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
              className="mb-6"
            >
              <Onboarding.IconBadge
                icon={Check}
                color="green"
                iconSize={48}
                strokeWidth={3}
              />
            </Animated.View>
            <SlideUpRevealView delay={300}>
              <Onboarding.Title className="mb-4">{title}</Onboarding.Title>
            </SlideUpRevealView>
            <SlideUpRevealView delay={500}>
              <Onboarding.Subtitle>{subtitle}</Onboarding.Subtitle>
            </SlideUpRevealView>
          </View>
        </Onboarding.ScrollView>
      )}
    </Onboarding.Container>
  );
};
