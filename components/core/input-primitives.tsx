import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { View } from 'react-native';

type InputLabelProps = {
  children: string;
  className?: string;
};

export const InputLabel = ({ children, className }: InputLabelProps) => {
  return (
    <Text className={cn('text-lg font-semibold', className)}>{children}</Text>
  );
};

type InputDescriptionProps = {
  children: string;
  className?: string;
};

export const InputDescription = ({
  children,
  className,
}: InputDescriptionProps) => {
  return (
    <Text className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </Text>
  );
};

type InputContainerProps = {
  children: React.ReactNode;
  label?: string;
  description?: string;
  className?: string;
  labelsClassName?: string;
};

export const InputContainer = ({
  children,
  label,
  description,
  labelsClassName,
  className,
}: InputContainerProps) => {
  return (
    <View className={cn('gap-2', className)}>
      {(label || description) && (
        <View className={cn('', labelsClassName)}>
          {label && <InputLabel>{label}</InputLabel>}
          {description && (
            <InputDescription className="mt-[-2px]">
              {description}
            </InputDescription>
          )}
        </View>
      )}
      {children}
    </View>
  );
};
