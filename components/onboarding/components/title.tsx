import { Text } from '@/components/ui/text';
import { clsx } from 'clsx';

export const OnboardingTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Text
      className={clsx(
        'text-balance px-6 text-center text-2xl font-bold leading-tight tracking-tight',
        className
      )}
    >
      {children}
    </Text>
  );
};
