import { Text } from '@/components/ui/text';
import clsx from 'clsx';
import { View } from 'react-native';
// import { Separator } from '@/components/ui/separator';

type DividerProps = {
  label: string;
  className?: string;
};

export const Divider = ({ label, className }: DividerProps) => (
  <View className={clsx(className, 'relative mb-4 mt-1 h-[12px] w-full')}>
    {/* <Separator /> */}
    {label && (
      <Text className="absolute left-1/2 top-1/2 -mt-[6px] -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-zinc-500 dark:text-zinc-400">
        {label}
      </Text>
    )}
  </View>
);
