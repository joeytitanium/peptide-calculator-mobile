import { useColorScheme } from '@/lib/use-color-scheme';
import clsx from 'clsx';
import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import colors from 'tailwindcss/colors';
import { CircularProgress } from './circular-progress';
import { iconWithClassName } from './icons/iconWithClassName';
import { Button } from './ui/button';

iconWithClassName(X);

const START_PROGRESS = 1;
const END_PROGRESS = 100;
const SIZE = 28;

export const CoolOffCloseButton = ({
  onClose,
  duration = 5000,
  className,
  style,
  onDelayFinished,
  skipCoolOff = false,
}: {
  className?: string;
  onClose: () => void;
  duration?: number; // in milliseconds
  style?: StyleProp<ViewStyle>;
  onDelayFinished?: () => void;
  skipCoolOff?: boolean;
}) => {
  const [progress, setProgress] = useState<number>(START_PROGRESS);
  const { isDarkColorScheme } = useColorScheme();
  const animatedProgress = useSharedValue(START_PROGRESS);

  useEffect(() => {
    animatedProgress.value = START_PROGRESS; // Reset on duration change or mount
    animatedProgress.value = withTiming(END_PROGRESS, {
      duration,
      easing: Easing.linear, // For a consistent progress speed
    });
  }, [duration, animatedProgress]);

  useAnimatedReaction(
    () => {
      return animatedProgress.value;
    },
    (currentValue) => {
      runOnJS(setProgress)(Math.round(currentValue));
    },
    [animatedProgress]
  );

  useEffect(() => {
    if (progress >= END_PROGRESS) {
      onDelayFinished?.();
    }
  }, [progress, onDelayFinished]);

  const color = isDarkColorScheme ? colors.zinc[700] : colors.stone[300];

  return (
    <View
      className={clsx(
        'items-center justify-center w-[44px] h-[44px]',
        className
      )}
      style={style}
    >
      {!skipCoolOff && progress < END_PROGRESS ? (
        <CircularProgress
          progress={progress}
          size={SIZE}
          strokeWidth={4}
          showLabel={false}
          progressCircleColor={color}
          outerCircleColor={isDarkColorScheme ? colors.black : colors.white}
        />
      ) : (
        <Button
          hitSlop={44}
          onPress={onClose}
          variant="ghost"
          size="icon"
          style={{
            width: SIZE,
            height: SIZE,
          }}
        >
          <X color={color} />
        </Button>
      )}
    </View>
  );
};
