import { HeaderCloseButton } from '@/components/core/header-button';
import { LogHeadacheForm } from '@/components/screens/app-specific/log/log-headache-form';
import { useRecords } from '@/providers/records-provider';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function LogModal() {
  const router = useRouter();
  const { t } = useTranslation();
  const { recordId, date } = useLocalSearchParams<{
    recordId?: string;
    date?: string;
  }>();
  const { getRecordById } = useRecords();

  const record = getRecordById({ id: recordId });
  const isEditMode = !!record;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: isEditMode
            ? t('navigation.editLog')
            : t('navigation.logHeadache'),
          headerLeft: () => <HeaderCloseButton onPress={() => router.back()} />,
        }}
      />
      <LogHeadacheForm
        initialRecord={record}
        initialDate={date}
        onPresentPaywall={() => router.push('/(app)/(tabs)/home/paywall')}
        onNavigateHome={({ date: recordDate }) =>
          router.replace({
            pathname: '/(app)/(tabs)/home',
            params: { date: recordDate },
          })
        }
      />
    </>
  );
}
