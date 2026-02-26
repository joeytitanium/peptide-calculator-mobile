import { Text } from '@/components/ui/text';
import clsx from 'clsx';

export const OnboardingJumbleTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Text
      className={clsx(
        'px-4 text-center text-3xl font-bold tracking-tight',
        className
      )}
    >
      {children}
    </Text>
  );
};
