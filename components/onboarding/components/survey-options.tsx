import { SlideUpRevealView } from '@/components/core/animations/slide-up-reveal-view';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { View } from 'react-native';

type RadioOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};

type BaseOptionsProps = {
  className?: string;
  options: RadioOption[];
  shouldAnimate?: boolean;
  isSelected: (value: string) => boolean;
  onOptionPress: (value: string) => void;
};

const OnboardingSurveyOptionsBase = ({
  className,
  options,
  shouldAnimate = true,
  isSelected,
  onOptionPress,
}: BaseOptionsProps) => (
  <View className={clsx('w-full gap-4', className)}>
    {options.map((option, index) => (
      <SlideUpRevealView
        key={option.label}
        delay={index * 150}
        duration={600}
        shouldAnimate={shouldAnimate}
        // onAnimationStart={() => {
        //   void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // }}
      >
        <Button
          className={clsx(
            'px-4 py-2 justify-start',
            !isSelected(option.value) && 'bg-card'
          )}
          variant={isSelected(option.value) ? 'default' : 'secondary'}
          size="lg"
          onPress={() => onOptionPress(option.value)}
        >
          <Text className="text-md font-semibold">{option.label}</Text>
        </Button>
      </SlideUpRevealView>
    ))}
  </View>
);

export const OnboardingSurveyRadioOptions = ({
  className,
  options,
  onChangeValue,
  value,
  shouldAnimate = true,
}: {
  className?: string;
  options: RadioOption[];
  onChangeValue: (value: string) => void;
  value: string | undefined;
  shouldAnimate?: boolean;
}) => (
  <OnboardingSurveyOptionsBase
    className={className}
    options={options}
    shouldAnimate={shouldAnimate}
    isSelected={(optionValue) => value === optionValue}
    onOptionPress={onChangeValue}
  />
);

export const OnboardingSurveyCheckboxOptions = ({
  className,
  options,
  onChangeValue,
  value,
  shouldAnimate = true,
}: {
  className?: string;
  options: RadioOption[];
  onChangeValue: (value: string[]) => void;
  value: string[];
  shouldAnimate?: boolean;
}) => (
  <OnboardingSurveyOptionsBase
    className={className}
    options={options}
    shouldAnimate={shouldAnimate}
    isSelected={(optionValue) => value.includes(optionValue)}
    onOptionPress={(optionValue) =>
      onChangeValue(
        value.includes(optionValue)
          ? value.filter((v) => v !== optionValue)
          : [...value, optionValue]
      )
    }
  />
);
