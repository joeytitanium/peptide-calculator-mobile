import { Progress } from '@/components/ui/progress';
import { isIos26OrGreater } from '@/utils/is-ios-26-or-greater';
import { clsx } from 'clsx';

import { Platform, View, ViewProps } from 'react-native';

export const OnboardingProgressToolbar = ({
  onGoBack,
  progress,
  ...props
}: ViewProps & {
  onGoBack: () => void;
  progress: number;
}) => {
  return (
    <View
      className={clsx(
        'pl-[80px] w-full flex-row items-center justify-between pr-4',
        {
          'h-11': isIos26OrGreater(),
          'h-[56px]': Platform.OS === 'android',
          'h-[34px]': !isIos26OrGreater() && Platform.OS !== 'android',
        }
      )}
      {...props}
    >
      <Progress
        value={progress}
        className="bg-card"
      />
    </View>
  );
};
