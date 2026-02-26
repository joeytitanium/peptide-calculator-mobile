import { SetupProfileScreen } from '@/components/screens/setup-profile';
import { useRouter } from 'expo-router';

export default function SetupProfile() {
  const router = useRouter();

  return (
    <SetupProfileScreen
      onSuccess={() => {
        router.replace('/feed');
      }}
    />
  );
}
