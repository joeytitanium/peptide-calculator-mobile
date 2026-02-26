import { Text } from '@/components/ui/text';
import { clsx } from 'clsx';

export const OnboardingSubtitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Text
      className={clsx(
        'px-4 text-center text-lg leading-tight text-muted-foreground',
        className
      )}
    >
      {children}
    </Text>
  );
};
