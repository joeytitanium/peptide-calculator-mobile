import clsx from 'clsx';
import { View } from 'react-native';

export const OnboardingSurveyTextContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View className={clsx('mb-8 mt-1 justify-center gap-0.5 px-2', className)}>
      {children}
    </View>
  );
};
