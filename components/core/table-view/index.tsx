import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { ArrowUpRight, ChevronRight, LucideProps } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

iconWithClassName(ChevronRight);
iconWithClassName(ArrowUpRight);

export const ICON_PROPS: LucideProps = {
  size: CONFIG.icon.size.sm,
  className: 'text-muted-foreground',
};

type RightElementType = 'chevron' | 'external-link';

type RowProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  rightElementType?: RightElementType;
  chevronVariant?: boolean;
  hideSeparator?: boolean;
  isRowPressable?: boolean;
  destructive?: boolean;
  testID?: string;
};

const Row = ({
  title,
  subtitle,
  onPress,
  leftElement,
  rightElement: rightElementOverride,
  rightElementType,
  hideSeparator = false,
  isRowPressable = true,
  destructive = false,
  testID,
}: RowProps) => {
  const content = (pressed = false) => {
    const rightElement = (() => {
      if (rightElementOverride) {
        return rightElementOverride;
      }

      if (rightElementType === 'chevron') {
        return (
          <ChevronRight
            className={
              destructive ? 'text-destructive' : 'text-muted-foreground'
            }
            strokeWidth={1.5}
            size={CONFIG.icon.size.sm}
          />
        );
      } else if (rightElementType === 'external-link') {
        return (
          <ArrowUpRight
            className={
              destructive ? 'text-destructive' : 'text-muted-foreground'
            }
            strokeWidth={1.5}
            size={CONFIG.icon.size.sm}
          />
        );
      }
    })();

    return (
      <>
        <View
          className={clsx('flex-row items-center justify-between py-4 px-4', {
            'bg-secondary-foreground/10': pressed,
          })}
        >
          {leftElement && <View className="mr-3">{leftElement}</View>}
          <View className="flex-1">
            <Text
              className={clsx('text-base font-medium', {
                'text-destructive': destructive,
              })}
            >
              {title}
            </Text>
            {subtitle && (
              <Text className="text-sm text-muted-foreground leading-tight">
                {subtitle}
              </Text>
            )}
          </View>
          {rightElement && <View className="items-center">{rightElement}</View>}
        </View>
        {!hideSeparator && <View className="ml-4 bg-border h-[1px]" />}
      </>
    );
  };

  if (isRowPressable) {
    const handlePress = () => {
      void Haptics.selectionAsync();
      onPress?.();
    };

    return (
      <Pressable
        onPress={handlePress}
        disabled={!onPress}
        testID={testID}
      >
        {({ pressed }) => content(pressed)}
      </Pressable>
    );
  }

  return content();
};

type SectionProps = {
  children: React.ReactNode;
};

const Section = ({ children }: SectionProps) => {
  return (
    <View className="bg-card rounded-3xl overflow-hidden mx-2">{children}</View>
  );
};

export const TableView = {
  Row,
  Section,
};
