import { HeaderCloseButton } from '@/components/core/header-button';
import { ChatScreen } from '@/components/screens/chat';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

export default function Chat() {
  const router = useRouter();
  const { recordId, imageUri } = useLocalSearchParams<{
    recordId?: string;
    imageUri?: string;
  }>();

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/(tabs)/home');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => <HeaderCloseButton onPress={handleClose} />,
        }}
      />
      <ChatScreen
        chatRecordId={recordId}
        imageUri={imageUri}
      />
    </>
  );
}
