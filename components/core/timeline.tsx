import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

export interface TimelineItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

type TimelineProps = {
  items: TimelineItem[];
};

export const Timeline = ({ items }: TimelineProps) => {
  return (
    <View className="py-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        iconWithClassName(Icon);
        const isLast = index === items.length - 1;

        return (
          <View
            key={index}
            className="flex-row"
          >
            {/* Left side - Icon and line */}
            <View className="items-center mr-4">
              {/* Icon container */}
              <View
                className={`w-11 h-11 rounded-full bg-secondary border-border border items-center justify-center`}
              >
                <Icon
                  size={CONFIG.icon.size.sm}
                  className="text-primary"
                  strokeWidth={2}
                />
              </View>

              {/* Vertical line */}
              {!isLast && (
                <View className="-m-[1.2px] w-[8px] flex-1 bg-secondary border-border border-x z-10" />
              )}
            </View>

            {/* Right side - Content */}
            <View className={clsx('flex-1', { 'pb-6': !isLast })}>
              <Text className="text-lg font-bold text-foreground">
                {item.title}
              </Text>
              <Text className="text-base text-muted-foreground leading-5">
                {item.subtitle}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};
