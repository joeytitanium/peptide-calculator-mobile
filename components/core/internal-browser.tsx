import { useColorScheme } from '@/lib/use-color-scheme';
import { WebView } from 'react-native-webview';

export const InternalBrowser = ({ url }: { url: string }) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <WebView
      forceDarkOn={isDarkColorScheme}
      source={{ uri: url }}
      style={{ flex: 1 }}
    />
  );
};
