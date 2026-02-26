import { SignInScreen } from '@/components/screens/sign-in';
import { useRouter } from 'expo-router';

export default function SignIn() {
  const router = useRouter();

  return (
    <SignInScreen
      onSuccess={(needsUsername) => {
        if (needsUsername) {
          router.push('/feed/sign-in/setup-profile');
        } else {
          router.dismiss();
        }
      }}
    />
  );
}
