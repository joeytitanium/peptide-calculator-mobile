import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Minus, Plus } from 'lucide-react-native';
import { View } from 'react-native';

iconWithClassName(Minus);
iconWithClassName(Plus);

type NumberStepperProps = {
  value: number;
  onChange: (params: { value: number }) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
};

export const NumberStepper = ({
  value,
  onChange,
  min,
  max,
  step,
  unit,
}: NumberStepperProps) => {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange({ value: newValue });
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange({ value: newValue });
  };

  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View className="flex-row items-center justify-center gap-6">
      <Button
        variant="outline"
        size="icon"
        className="h-14 w-14 rounded-full"
        onPress={handleDecrement}
        disabled={!canDecrement}
      >
        <Minus
          className="text-foreground"
          size={24}
        />
      </Button>

      <View className="min-w-[140px] items-center">
        <Text className="text-5xl font-bold text-foreground">
          {value.toLocaleString()}
        </Text>
        <Text className="text-lg text-muted-foreground">{unit}</Text>
      </View>

      <Button
        variant="outline"
        size="icon"
        className="h-14 w-14 rounded-full"
        onPress={handleIncrement}
        disabled={!canIncrement}
      >
        <Plus
          className="text-foreground"
          size={24}
        />
      </Button>
    </View>
  );
};
