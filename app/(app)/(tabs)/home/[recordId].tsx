import { RecordDetailScreen } from '@/components/screens/app-specific/record-detail';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function RecordDetailModal() {
  const { recordId } = useLocalSearchParams<{ recordId: string }>();
  const router = useRouter();

  return (
    <RecordDetailScreen
      recordId={recordId}
      onClose={() => router.back()}
      onEdit={() =>
        router.push({
          pathname: '/(app)/(tabs)/home/log',
          params: { recordId },
        })
      }
    />
  );
}
