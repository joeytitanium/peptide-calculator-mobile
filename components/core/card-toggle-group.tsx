import { InputContainer } from '@/components/core/input-primitives';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

type CardToggleGroupContextValue<T> = {
  value: T | null;
  onChange: (value: T) => void;
};

const CardToggleGroupContext =
  React.createContext<CardToggleGroupContextValue<any> | null>(null);

function useCardToggleGroupContext<T>() {
  const context = React.useContext(
    CardToggleGroupContext
  ) as CardToggleGroupContextValue<T> | null;
  if (context === null) {
    throw new Error(
      'CardToggleGroupItem must be rendered inside a CardToggleGroup component'
    );
  }
  return context;
}

type CardToggleGroupProps<T> = {
  value: T | null;
  onChange: (value: T) => void;
  children: React.ReactNode;
  labelsClassName?: string;
  contentClassName?: string;
  className?: string;
  label?: string;
  description?: string;
};

function CardToggleGroup<T>({
  value,
  onChange,
  children,
  labelsClassName,
  contentClassName,
  className,
  label,
  description,
}: CardToggleGroupProps<T>) {
  return (
    <CardToggleGroupContext.Provider value={{ value, onChange }}>
      <InputContainer
        label={label}
        description={description}
        labelsClassName={labelsClassName}
        className={className}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName={cn('gap-2', contentClassName)}
        >
          {children}
        </ScrollView>
      </InputContainer>
    </CardToggleGroupContext.Provider>
  );
}

type CardToggleGroupItemProps<T> = {
  value: T;
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

function CardToggleGroupItem<T>({
  value,
  label,
  description,
  children,
  className,
}: CardToggleGroupItemProps<T>) {
  const context = useCardToggleGroupContext<T>();
  const isSelected = context.value === value;

  return (
    <Pressable
      onPress={() => context.onChange(value)}
      className={cn(
        'rounded-xl overflow-hidden',
        isSelected
          ? 'border-2 border-primary p-2 bg-accent'
          : 'border border-border p-[9px] bg-card',
        className
      )}
    >
      {children}
      <View className="pt-2">
        <Text className="font-medium text-sm">{label}</Text>
        {description && (
          <Text
            className="text-muted-foreground text-xs"
            numberOfLines={1}
          >
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export { CardToggleGroup, CardToggleGroupItem };
