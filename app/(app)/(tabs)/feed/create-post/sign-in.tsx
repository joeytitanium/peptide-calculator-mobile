import { SignInScreen } from '@/components/screens/sign-in';
import { useRouter } from 'expo-router';

export default function SignIn() {
  const router = useRouter();

  return (
    <SignInScreen
      onSuccess={(needsUsername) => {
        if (needsUsername) {
          router.push('/feed/create-post/setup-profile');
        } else {
          router.dismissAll();
        }
      }}
    />
  );
}
