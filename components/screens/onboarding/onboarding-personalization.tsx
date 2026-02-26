import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Onboarding } from '@/components/onboarding/components';
import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { clsx } from 'clsx';
import type { Href } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';
import { Check } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Platform, View } from 'react-native';

iconWithClassName(Check);

type PersonalizingStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

interface OnboardingPersonalizationStepsProps {
  steps: PersonalizingStep[];
  currentHref: Href;
  title: string;
  subtitle: string;
}

export const OnboardingPersonalization = ({
  steps,
  currentHref,
  title,
  subtitle,
}: OnboardingPersonalizationStepsProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [canProceed, setCanProceed] = useState(false);

  // Create refs for animation values for each step
  const scaleAnimations = useRef(
    steps.map(() => new Animated.Value(1))
  ).current;

  // Animate when step becomes active
  useEffect(() => {
    if (Platform.OS === 'android') return;

    if (currentStepIndex < steps.length - 1) {
      const scaleAnim = scaleAnimations[currentStepIndex];

      // Reset to 1
      scaleAnim.setValue(1);

      // Animate scale up and back down with spring for smooth, bouncy effect
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.08,
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
    }
  }, [currentStepIndex, scaleAnimations, steps.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }, 1200);
    if (currentStepIndex === steps.length - 1) {
      setCanProceed(true);
    }
    return () => clearInterval(interval);
  }, [steps.length, currentStepIndex]);

  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <Onboarding.Container
      currentHref={currentHref}
      canProceed={canProceed}
      progressBarHidden
    >
      {({ top, bottom, topToolbarHeight, bottomToolbarHeight }) => (
        <Onboarding.ScrollView
          topInset={top + topToolbarHeight + CONFIG.layout.navigationBarPadding}
          bottomInset={bottom + bottomToolbarHeight}
        >
          <Onboarding.Survey.TextContainer>
            <Onboarding.Survey.Title className="text-center">
              {title}
            </Onboarding.Survey.Title>
            <Onboarding.Survey.Subtitle className="text-center">
              {subtitle}
            </Onboarding.Survey.Subtitle>
          </Onboarding.Survey.TextContainer>
          <View className="items-center justify-center ">
            <View className="w-full px-6">
              <View className="flex-row items-center gap-4 px-4 py-2 rounded-full border border-secondary">
                <View className="flex-1">
                  <Progress
                    value={progress}
                    className="h-2 bg-card"
                  />
                </View>
                <Text className="text-lg font-semibold text-foreground">
                  {Math.round(progress)}%
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-8 rounded-3xl bg-card px-6 py-6 min-h-[400px]">
            <View className="gap-5">
              {steps.map((step, index) => {
                const isLastStep = index === steps.length - 1;
                const isCompleted =
                  index < currentStepIndex ||
                  (isLastStep && currentStepIndex === index);
                const isInProgress = index === currentStepIndex && !isLastStep;
                const isPending = index > currentStepIndex;

                const StepIcon = step.icon;

                return (
                  <View
                    key={index}
                    className="flex-row items-center gap-4"
                  >
                    {/* Icon Container - Now Animated */}
                    <Animated.View
                      style={{
                        transform: [{ scale: scaleAnimations[index] }],
                      }}
                      className={clsx(
                        'w-12 h-12 rounded-full items-center justify-center',
                        isCompleted && 'bg-green-500',
                        isInProgress && 'bg-orange-400',
                        isPending && 'bg-background'
                      )}
                    >
                      {isCompleted && (
                        <Check
                          className="text-white"
                          size={CONFIG.icon.size.md}
                          strokeWidth={2.5}
                        />
                      )}
                      {isInProgress && (
                        <ActivityIndicator
                          size="small"
                          color="white"
                        />
                      )}
                      {isPending && (
                        <StepIcon
                          className="text-muted-foreground"
                          size={CONFIG.icon.size.md}
                          strokeWidth={2}
                        />
                      )}
                    </Animated.View>

                    {/* Text Content */}
                    <View className="flex-1 justify-center">
                      <Text
                        className={clsx(
                          'text-lg font-bold leading-tight',
                          (isCompleted || isInProgress) && 'text-foreground',
                          isPending && 'text-muted-foreground'
                        )}
                      >
                        {step.title}
                      </Text>
                      <Text
                        className={clsx(
                          'text-sm',
                          (isCompleted || isInProgress) &&
                            'text-muted-foreground',
                          isPending && 'text-muted-foreground/60'
                        )}
                      >
                        {step.description}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </Onboarding.ScrollView>
      )}
    </Onboarding.Container>
  );
};
