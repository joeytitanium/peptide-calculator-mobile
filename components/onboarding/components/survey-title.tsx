import { Text } from '@/components/ui/text';
import clsx from 'clsx';

export const OnboardingSurveyTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Text
      className={clsx(
        'mt-2 text-2xl font-bold leading-tight tracking-tight',
        className
      )}
    >
      {children}
    </Text>
  );
};
