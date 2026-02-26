import { clsx } from 'clsx';
import { View } from 'react-native';

export const OnboardingTextContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View className={clsx('mt-1 items-center justify-center gap-2', className)}>
      {children}
    </View>
  );
};
