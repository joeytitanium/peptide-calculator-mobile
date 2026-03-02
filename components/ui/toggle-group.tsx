import { Icon } from '@/components/ui/icon';
import { TextClassContext } from '@/components/ui/text';
import { toggleVariants } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import * as ToggleGroupPrimitive from '@rn-primitives/toggle-group';
import type { VariantProps } from 'class-variance-authority';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { Platform } from 'react-native';

const ToggleGroupContext = React.createContext<VariantProps<
  typeof toggleVariants
> | null>(null);

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: ToggleGroupPrimitive.RootProps &
  VariantProps<typeof toggleVariants> &
  React.RefAttributes<ToggleGroupPrimitive.RootRef>) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        'flex flex-row items-center rounded-md shadow-none',
        Platform.select({ web: 'w-fit' }),
        variant === 'outline' && 'shadow-sm shadow-black/5',
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function useToggleGroupContext() {
  const context = React.useContext(ToggleGroupContext);
  if (context === null) {
    throw new Error(
      'ToggleGroup compound components cannot be rendered outside the ToggleGroup component'
    );
  }
  return context;
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  isFirst,
  isLast,
  selectedClassName,
  onPress,
  ...props
}: ToggleGroupPrimitive.ItemProps &
  VariantProps<typeof toggleVariants> &
  React.RefAttributes<ToggleGroupPrimitive.ItemRef> & {
    isFirst?: boolean;
    isLast?: boolean;
    selectedClassName?: string;
  }) {
  const context = useToggleGroupContext();
  const { value } = ToggleGroupPrimitive.useRootContext();
  const isSelected = ToggleGroupPrimitive.utils.getIsSelected(
    value,
    props.value
  );

  const handlePress = React.useCallback(
    (event: any) => {
      void Haptics.selectionAsync();
      onPress?.(event);
    },
    [onPress]
  );

  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm text-foreground font-medium',
        isSelected
          ? 'text-background'
          : Platform.select({ web: 'group-hover:text-muted-foreground' })
      )}
    >
      <ToggleGroupPrimitive.Item
        className={cn(
          toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
          }),
          props.disabled && 'opacity-50',
          isSelected && (selectedClassName ?? 'bg-foreground'),
          'min-w-0 shrink-0 rounded-none shadow-none',
          isFirst && 'rounded-l-md',
          isLast && 'rounded-r-md',
          (context.variant === 'outline' || variant === 'outline') &&
            'border-l-0',
          (context.variant === 'outline' || variant === 'outline') &&
            isFirst &&
            'border-l',
          Platform.select({
            web: 'flex-1 focus:z-10 focus-visible:z-10',
          }),
          className
        )}
        onPress={handlePress}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    </TextClassContext.Provider>
  );
}

function ToggleGroupIcon({
  className,
  ...props
}: React.ComponentProps<typeof Icon>) {
  const textClass = React.useContext(TextClassContext);
  return (
    <Icon
      className={cn('size-4 shrink-0', textClass, className)}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupIcon, ToggleGroupItem };
