import { SlideUpRevealView } from '@/components/core/animations/slide-up-reveal-view';
import { Onboarding } from '@/components/onboarding/components';
import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/lib/use-color-scheme';
import { clsx } from 'clsx';
import type { Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Platform, View } from 'react-native';

type ComparisonItem = {
  label: string;
  percentage: number;
  color: 'red' | 'green' | 'blue' | 'violet' | 'orange' | 'yellow';
};

interface OnboardingComparisonProps {
  currentHref: Href;
  title: string;
  subtitle: string;
  comparisonData: ComparisonItem[];
  buttonText?: string;
}

export const OnboardingComparison = ({
  currentHref,
  title,
  subtitle,
  comparisonData,
  buttonText,
}: OnboardingComparisonProps) => {
  const { isDarkColorScheme } = useColorScheme();
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Set final values directly without animation
      const values = comparisonData.map(
        (item) => new Animated.Value(item.percentage)
      );
      setAnimatedValues(values);
      return;
    }

    // Initialize animated values
    const values = comparisonData.map(() => new Animated.Value(0));
    setAnimatedValues(values);

    // Animate each progress bar with staggered delays
    values.forEach((animValue, index) => {
      Animated.timing(animValue, {
        toValue: comparisonData[index]?.percentage ?? 0,
        duration: 1000,
        delay: 700 + index * 200 + 300, // Match SlideUpRevealView delay + extra time for reveal
        useNativeDriver: false, // Progress component doesn't support native driver
      }).start();
    });
  }, [comparisonData]);

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
            <SlideUpRevealView delay={300}>
              <Onboarding.Title className="mb-3">{title}</Onboarding.Title>
            </SlideUpRevealView>
            <SlideUpRevealView delay={500}>
              <Onboarding.Subtitle className="mb-12">
                {subtitle}
              </Onboarding.Subtitle>
            </SlideUpRevealView>
            <SlideUpRevealView
              delay={700}
              className="w-full"
            >
              <View className="rounded-3xl bg-card px-6 py-6 w-full">
                <View className="w-full max-w-[340px] gap-6">
                  {comparisonData.map((item, index) => {
                    const AnimatedComparisonItem = ({
                      animatedValue,
                      item,
                    }: {
                      animatedValue: Animated.Value;
                      item: ComparisonItem;
                    }) => {
                      const [displayValue, setDisplayValue] = useState(
                        Platform.OS === 'android' ? item.percentage : 0
                      );

                      useEffect(() => {
                        const listenerId = animatedValue.addListener(
                          ({ value }) => {
                            setDisplayValue(Math.round(value));
                          }
                        );

                        return () => {
                          animatedValue.removeListener(listenerId);
                        };
                      }, [animatedValue]);

                      return (
                        <View className="gap-2">
                          <View className="flex-row items-center justify-between">
                            <Text className="text-base font-medium ">
                              {item.label}
                            </Text>
                            <Text
                              className={clsx('text-lg font-semibold', {
                                'text-red-500': item.color === 'red',
                                'text-green-500': item.color === 'green',
                                'text-blue-500': item.color === 'blue',
                                'text-violet-500': item.color === 'violet',
                                'text-orange-500': item.color === 'orange',
                                'text-yellow-500': item.color === 'yellow',
                              })}
                            >
                              {displayValue}%
                            </Text>
                          </View>
                          <Progress
                            value={displayValue}
                            className={clsx('h-4 rounded-full bg-muted')}
                            indicatorClassName={clsx('rounded-full', {
                              'bg-red-500': item.color === 'red',
                              'bg-green-500': item.color === 'green',
                              'bg-blue-500': item.color === 'blue',
                              'bg-violet-500': item.color === 'violet',
                              'bg-orange-500': item.color === 'orange',
                              'bg-yellow-500': item.color === 'yellow',
                            })}
                          />
                        </View>
                      );
                    };

                    return (
                      <SlideUpRevealView
                        key={item.label}
                        delay={700 + index * 200}
                      >
                        {animatedValues[index] ? (
                          <AnimatedComparisonItem
                            animatedValue={
                              animatedValues[index] ?? new Animated.Value(0)
                            }
                            item={item}
                          />
                        ) : (
                          <View className="gap-2">
                            <View className="flex-row items-center justify-between">
                              <Text className="text-base font-medium text-muted-foreground">
                                {item.label}
                              </Text>
                              <Text
                                className={clsx('text-lg font-semibold', {
                                  'text-red-500': item.color === 'red',
                                  'text-green-500': item.color === 'green',
                                  'text-blue-500': item.color === 'blue',
                                  'text-violet-500': item.color === 'violet',
                                  'text-orange-500': item.color === 'orange',
                                  'text-yellow-500': item.color === 'yellow',
                                })}
                              >
                                0%
                              </Text>
                            </View>
                            <Progress
                              value={0}
                              className="h-4 rounded-full bg-muted"
                              indicatorClassName={clsx('rounded-full', {
                                'bg-red-500': item.color === 'red',
                                'bg-green-500': item.color === 'green',
                                'bg-blue-500': item.color === 'blue',
                                'bg-violet-500': item.color === 'violet',
                                'bg-orange-500': item.color === 'orange',
                                'bg-yellow-500': item.color === 'yellow',
                              })}
                            />
                          </View>
                        )}
                      </SlideUpRevealView>
                    );
                  })}
                </View>
              </View>
            </SlideUpRevealView>
          </View>
        </Onboarding.ScrollView>
      )}
    </Onboarding.Container>
  );
};
