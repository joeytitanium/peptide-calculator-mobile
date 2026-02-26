import { Badge, BadgeProps } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { ResultVariant } from '@/types/result-variant';
import { clsx } from 'clsx';
import { createContext, ReactNode, useContext } from 'react';
import { TextProps } from 'react-native';

const ResultBadgeContext = createContext<ResultVariant | undefined>(undefined);

export const variantForScore = (score: number) => {
  if (score >= 0.9) {
    return 'success';
  }
  if (score > 0.5) {
    return 'warning';
  }
  return 'danger';
};

const useResultBadge = () => {
  const context = useContext(ResultBadgeContext);
  if (context === undefined) {
    throw new Error('useResultBadge must be used within a ResultBadge');
  }
  return context;
};

export const ResultBadge = ({
  className,
  children,
  variant = 'info',
  ...badgeProps
}: {
  variant?: ResultVariant;
  children: ReactNode;
} & Omit<BadgeProps, 'variant'>) => {
  return (
    <ResultBadgeContext.Provider value={variant}>
      <Badge
        variant="default"
        className={clsx(className, {
          'bg-destructive': variant === 'danger',
          'bg-yellow-500': variant === 'warning',
          'bg-green-500': variant === 'success',
          'bg-blue-500': variant === 'info',
        })}
        {...badgeProps}
      >
        {children}
      </Badge>
    </ResultBadgeContext.Provider>
  );
};

const ResultBadgeText = ({
  children,
  ...textProps
}: { children: ReactNode } & TextProps) => {
  const variant = useResultBadge();

  return (
    <Text
      className={clsx({
        'text-white': variant === 'danger' || variant === 'success',
        'text-black': variant === 'warning' || variant === 'info',
      })}
      {...textProps}
    >
      {children}
    </Text>
  );
};

ResultBadge.Text = ResultBadgeText;
