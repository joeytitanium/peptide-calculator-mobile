import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Alert, Image, Pressable, View } from 'react-native';
import { RecordItemProps } from './types';

iconWithClassName(Trash2);

// TODO:
// - Handle markdown in the title & subtitle

export const HorizontalImageRecordItem = ({
  title,
  titleClassName,
  subtitle,
  imageUri,
  date,
  onDelete,
  onPress,
  onPressIn,
  onPressOut,
}: RecordItemProps) => {
  const { t } = useTranslation();
  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      {({ pressed: momentarilyPressed }) => (
        <View
          className={clsx('rounded-3xl overflow-hidden bg-secondary', {
            'bg-muted': momentarilyPressed,
          })}
        >
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              className="w-full aspect-video"
              resizeMode="cover"
            />
          )}
          <View className="px-3 pt-3 pb-1">
            <View className="gap-1">
              {title && (
                <Text
                  className={clsx(
                    'text-lg font-semibold tracking-tighter leading-tight line-clamp-2',
                    titleClassName
                  )}
                >
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text className="text-sm text-muted-foreground line-clamp-2">
                  {subtitle}
                </Text>
              )}
            </View>
            <View className="flex-row items-center justify-between gap-2 mt-2">
              <Text className="text-xs text-muted-foreground">
                {format(date, 'MMM d, yyyy h:mm a')}
              </Text>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => {
                  Alert.alert(
                    t('history.deleteTitle'),
                    t('history.deleteMessage'),
                    [
                      {
                        text: t('common.cancel'),
                        style: 'cancel',
                      },
                      {
                        text: t('common.delete'),
                        style: 'destructive',
                        onPress: onDelete,
                      },
                    ]
                  );
                }}
              >
                <Trash2
                  size={CONFIG.icon.size['2xs']}
                  className="text-destructive"
                />
              </Button>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
};
