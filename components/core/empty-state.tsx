import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { View } from 'react-native';

type EmptyStateButton = {
  label: string;
  onPress: () => void;
};

export type EmptyStateProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  primaryButton?: EmptyStateButton;
  secondaryButton?: EmptyStateButton;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  primaryButton,
  secondaryButton,
  className,
}: EmptyStateProps) {
  const hasButtons = primaryButton || secondaryButton;

  return (
    <View className={cn('items-center justify-center gap-4 px-8', className)}>
      {icon && <View>{icon}</View>}
      {(title || description) && (
        <View className="items-center gap-1">
          {title && (
            <Text
              variant="h3"
              className="text-center"
            >
              {title}
            </Text>
          )}
          {description && (
            <Text
              variant="muted"
              className="text-center"
            >
              {description}
            </Text>
          )}
        </View>
      )}
      {hasButtons && (
        <View className="flex-row gap-3 mt-4">
          {secondaryButton && (
            <Button
              variant="outline"
              onPress={secondaryButton.onPress}
            >
              <Text>{secondaryButton.label}</Text>
            </Button>
          )}
          {primaryButton && (
            <Button onPress={primaryButton.onPress}>
              <Text>{primaryButton.label}</Text>
            </Button>
          )}
        </View>
      )}
    </View>
  );
}
