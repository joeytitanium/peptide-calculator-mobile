import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/config';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy } from 'lucide-react-native';
import { useState } from 'react';

iconWithClassName(Copy);
iconWithClassName(Check);

export const CopyIconButton = ({
  clipboardText,
}: {
  clipboardText: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(clipboardText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onPress={handleCopy}
      className="h-6 w-6"
    >
      {copied ? (
        <Check
          size={CONFIG.icon.size['xs']}
          className="text-muted-foreground"
        />
      ) : (
        <Copy
          size={CONFIG.icon.size['xs']}
          className="text-muted-foreground"
        />
      )}
    </Button>
  );
};
