import { Text } from '@/components/ui/text';
import clsx from 'clsx';

export const OnboardingSurveySubtitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Text className={clsx('text-lg text-muted-foreground', className)}>
      {children}
    </Text>
  );
};
