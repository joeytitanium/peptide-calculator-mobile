import { View } from 'react-native';

import { H1, Muted } from '@/components/ui/typography';
import { useViewedScreen } from '@/utils/posthog';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  useViewedScreen('not-found');
  const { t } = useTranslation();

  return (
    <View className="flex flex-1 items-center justify-center gap-y-4 bg-background p-4">
      <H1 className="text-center">{t('notFound.title')}</H1>
      <Muted className="text-center">{t('notFound.message')}</Muted>
    </View>
  );
}
