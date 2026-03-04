import { CONFIG } from '@/config';
import { clsx } from 'clsx';
import { Zap } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { PressableGlassView } from './core/glass-view';
import { Icon } from './ui/icon';
import { Text } from './ui/text';

export const ProBadge = ({
  className,
  onPress,
  hideText = false,
}: {
  className?: string;
  onPress?: () => void;
  hideText?: boolean;
}) => {
  const { t } = useTranslation();

  const content = (
    <>
      <Icon
        as={Zap}
        size={CONFIG.icon.size.sm}
        className={`${CONFIG.tintColor.className} ${CONFIG.tintColor.fillClassName}`}
        strokeWidth={2}
      />
      {!hideText && (
        <Text className="font-bold text-sm">{t('proBadge.pro')}</Text>
      )}
    </>
  );

  if (!onPress) {
    return (
      <View
        className={clsx(
          'flex-row flex-nowrap justify-center items-center',
          className
        )}
      >
        {content}
      </View>
    );
  }

  return (
    <PressableGlassView
      onPress={onPress}
      pressableClassName="overflow-hidden rounded-full"
      className={clsx(
        'flex-row justify-center items-center px-3 py-2 rounded-full gap-1.5',
        className
      )}
    >
      {content}
    </PressableGlassView>
  );
};
