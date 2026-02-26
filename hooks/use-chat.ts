import { CONFIG } from '@/config';
import { useChatRecords } from '@/providers/records-provider';
import { ChatRecord } from '@/types/record';
import { getAsyncStorageItem } from '@/utils/async-storage';
import { fileUriToBase64 } from '@/utils/file-to-base64';
import { resizeImage } from '@/utils/resize-image';
import { useChat as useAiChat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';
import { fetch as expoFetch, type FetchRequestInit } from 'expo/fetch';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Purchases from 'react-native-purchases';

export type { UIMessage };

export class SubscriptionRequiredError extends Error {
  constructor(message = 'Subscription required') {
    super(message);
    this.name = 'SubscriptionRequiredError';
  }
}

export const useChat = ({
  onSubscriptionRequired,
  chatRecord,
}: {
  onSubscriptionRequired?: () => void;
  chatRecord: ChatRecord;
}) => {
  const [authHeaders, setAuthHeaders] = useState<Record<string, string>>({});
  const { updateRecord } = useChatRecords();

  // Load auth headers on mount
  useEffect(() => {
    const loadAuth = async () => {
      const [userId, authState] = await Promise.all([
        Purchases.getAppUserID(),
        getAsyncStorageItem('auth-state'),
      ]);
      const headers: Record<string, string> = {
        'x-user-id': userId,
      };
      if (authState.data?.identityToken) {
        headers['x-apple-identity-token'] = authState.data.identityToken;
      }
      setAuthHeaders(headers);
    };
    void loadAuth();
  }, []);

  const headersReady = 'x-user-id' in authHeaders;

  // Wrap fetch to intercept 402 status codes
  const handledSubscriptionRef = useRef(false);
  const wrappedFetch = useCallback(
    async (input: string, init?: FetchRequestInit) => {
      const response = await expoFetch(input, init);
      if (response.status === 402) {
        handledSubscriptionRef.current = true;
        onSubscriptionRequired?.();
      }
      return response;
    },
    [onSubscriptionRequired]
  ) as typeof globalThis.fetch;

  // Memoize transport so it updates when headers change
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        fetch: wrappedFetch,
        api: `${CONFIG.apiUrl}/chat`,
        headers: authHeaders,
      }),
    [authHeaders, wrappedFetch]
  );

  const {
    messages,
    error: aiError,
    status,
    sendMessage: aiSendMessage,
  } = useAiChat({
    id: chatRecord.id,
    messages: chatRecord.messages,
    transport,
    onError: (error) => {
      if (handledSubscriptionRef.current) {
        handledSubscriptionRef.current = false;
        return;
      }
      console.error('Chat error:', error);
    },
    onFinish: ({ messages }) => {
      void updateRecord({
        record: {
          ...chatRecord,
          messages,
        },
      });
    },
  });

  const sendImage = useCallback(
    async (imageUri: string) => {
      if (!headersReady) return;

      try {
        // Convert image to base64
        const resizedUri = await resizeImage({ url: imageUri });
        const imageBlob = await fileUriToBase64(resizedUri);

        // Send image as first message using FileUIPart format
        // Check if imageBlob already has data URL prefix
        const imageUrl = imageBlob.startsWith('data:')
          ? imageBlob
          : `data:image/jpeg;base64,${imageBlob}`;

        void aiSendMessage(
          {
            files: [
              {
                type: 'file',
                mediaType: 'image/jpeg',
                url: imageUrl,
              },
            ],
          },
          { headers: authHeaders }
        );
      } catch (error) {
        console.error('Failed to analyze image:', error);
      }
    },
    [aiSendMessage, headersReady, authHeaders]
  );

  const sendMessage = useCallback(
    (content: string) => {
      if (!content || content.trim().length === 0) return;
      void aiSendMessage({ text: content.trim() }, { headers: authHeaders });
    },
    [aiSendMessage, authHeaders]
  );

  return {
    messages,
    isLoading: status === 'streaming' || status === 'submitted',
    error: aiError?.message ?? null,
    sendMessage,
    sendImage,
    isReady: headersReady,
  };
};
