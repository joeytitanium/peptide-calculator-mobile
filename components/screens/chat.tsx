import { CopyIconButton } from '@/components/core/copy-icon-button';
import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { CONFIG } from '@/config';
import { useChat } from '@/hooks/use-chat';
import { useSafeAreaInsets } from '@/hooks/use-safe-area-insets';
import { useChatRecords } from '@/providers/records-provider';
import { ChatRecord } from '@/types/record';
import { useViewedScreen } from '@/utils/posthog';
import { clsx } from 'clsx';

import { GlassView, PressableGlassView } from '@/components/core/glass-view';
import { useRouter } from 'expo-router';
import { ArrowUp, ChevronDown } from 'lucide-react-native';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import Markdown from 'react-native-markdown-display';
import uuid from 'react-native-uuid';
import colors from 'tailwindcss/colors';

iconWithClassName(ChevronDown);
iconWithClassName(ArrowUp);

// TODO:
// - Make the text selectable
// - Fix math hack trying to put user message at the top after submit

const ChatScreenComponent = ({
  chatRecord,
  initialImageUri,
}: {
  chatRecord: ChatRecord;
  initialImageUri?: string;
}) => {
  const { t } = useTranslation();
  const { height: windowHeight } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { paddingTop, paddingBottom } = useSafeAreaInsets({
    // additionalTopPadding:
    //   Platform.OS === 'ios' ? CONFIG.layout.navigationBarPadding : 0,
  });
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();

  const [input, setInput] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, isLoading, sendMessage, sendImage } = useChat({
    chatRecord,
    onSubscriptionRequired: () => router.replace('/paywall'),
  });

  // if (__DEV__) {
  //   console.log(
  //     `🔫 messages: ${JSON.stringify(
  //       messages.map((message) =>
  //         message.parts.map((part) => {
  //           if (part.type === 'file') {
  //             return {
  //               ...part,
  //               url: 'placeholder.png',
  //             };
  //           }
  //           return part;
  //         })
  //       ),
  //       null,
  //       '\t'
  //     )}`
  //   );
  // }

  const markdownStyles = useMemo(
    () => ({
      body: {
        color: colorScheme === 'dark' ? colors.white : colors.black,
        fontSize: 16,
      },
      code_inline: {
        backgroundColor:
          colorScheme === 'dark' ? colors.zinc[800] : colors.zinc[100],
        paddingHorizontal: 4,
        borderRadius: 4,
        fontFamily: 'monospace',
      },
      fence: {
        backgroundColor:
          colorScheme === 'dark' ? colors.zinc[800] : colors.zinc[100],
        borderWidth: 0.5,
        borderColor:
          colorScheme === 'dark' ? colors.zinc[800] : colors.zinc[300],
        padding: 8,
        borderRadius: 8,
        marginVertical: 8,
      },
      code_block: {
        backgroundColor:
          colorScheme === 'dark' ? colors.zinc[800] : colors.zinc[100],
        borderWidth: 0.5,
        borderColor:
          colorScheme === 'dark' ? colors.zinc[800] : colors.zinc[300],
        padding: 8,
        borderRadius: 8,
        fontFamily: 'monospace',
      },
      table: {
        borderWidth: 0.5,
        borderColor:
          colorScheme === 'dark' ? colors.zinc[800] : colors.zinc[300],
        marginVertical: 8,
      },
      thead: {
        backgroundColor:
          colorScheme === 'dark' ? colors.zinc[800] : colors.zinc[100],
      },
      th: {
        borderWidth: 0.5,
        borderColor:
          colorScheme === 'dark' ? colors.zinc[800] : colors.zinc[300],
        padding: 8,
        fontWeight: 'bold' as const,
      },
      tr: {
        borderBottomWidth: 0.5,
        borderColor:
          colorScheme === 'dark' ? colors.zinc[800] : colors.zinc[300],
      },
      td: {
        borderWidth: 0.5,
        borderColor:
          colorScheme === 'dark' ? colors.zinc[800] : colors.zinc[300],
        padding: 8,
      },
    }),
    [colorScheme]
  );

  const markdownRules = useMemo(
    () => ({
      body: (node: { key: string }, children: React.ReactNode) => (
        <View key={node.key}>{children}</View>
      ),
      heading1: (node: { key: string }, children: React.ReactNode) => (
        <Text
          key={node.key}
          className="text-2xl font-bold my-2"
        >
          {children}
        </Text>
      ),
      heading2: (node: { key: string }, children: React.ReactNode) => (
        <Text
          key={node.key}
          className="text-xl font-bold my-1.5"
        >
          {children}
        </Text>
      ),
      heading3: (node: { key: string }, children: React.ReactNode) => (
        <Text
          key={node.key}
          className="text-lg font-semibold my-1"
        >
          {children}
        </Text>
      ),
      heading4: (node: { key: string }, children: React.ReactNode) => (
        <Text
          key={node.key}
          className="text-base font-semibold my-1"
        >
          {children}
        </Text>
      ),
      heading5: (node: { key: string }, children: React.ReactNode) => (
        <Text
          key={node.key}
          className="text-sm font-semibold my-0.5"
        >
          {children}
        </Text>
      ),
      heading6: (node: { key: string }, children: React.ReactNode) => (
        <Text
          key={node.key}
          className="text-sm font-medium my-0.5"
        >
          {children}
        </Text>
      ),
      hr: (node: { key: string }) => (
        <View
          key={node.key}
          className="h-px bg-border my-2"
        />
      ),
      strong: (node: { key: string }, children: React.ReactNode) => (
        <Text
          key={node.key}
          className="font-bold"
        >
          {children}
        </Text>
      ),
      em: (node: { key: string }, children: React.ReactNode) => (
        <Text
          key={node.key}
          className="italic"
        >
          {children}
        </Text>
      ),
      s: (node: { key: string }, children: React.ReactNode) => (
        <Text
          key={node.key}
          className="line-through"
        >
          {children}
        </Text>
      ),
      blockquote: (node: { key: string }, children: React.ReactNode) => (
        <View
          key={node.key}
          className="border-l-4 border-muted-foreground pl-3 my-2"
        >
          {children}
        </View>
      ),
    }),
    []
  );

  // Send image on mount if no initial chat record is provided
  useEffect(() => {
    if (initialImageUri && chatRecord.messages.length === 0) {
      void sendImage(initialImageUri);
    }
  }, [chatRecord, initialImageUri, sendImage]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
      const isNearBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
      setIsAtBottom(isNearBottom);
    },
    []
  );

  const scrollToBottom = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
    setIsAtBottom(true);
  }, []);

  const handleSend = async ({
    value,
    clearInput,
  }: {
    value?: string;
    clearInput?: boolean;
  }) => {
    if (!value || value.trim().length === 0) {
      return;
    }
    sendMessage(value.trim());
    if (clearInput) {
      setInput('');
    }
    Keyboard.dismiss();
    // Scroll to bottom so user's message appears at the top of the visible area
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <Fragment>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop,
          paddingBottom: Math.max(
            windowHeight -
              paddingTop -
              paddingBottom -
              keyboardHeight.value -
              200,
            paddingBottom
          ),
        }}
        contentContainerClassName="px-4 pb-4"
      >
        {messages.map((message, index) => {
          if (message.parts.some((part) => part.type === 'file')) {
            const imageUri = message.parts.find(
              (part) => part.type === 'file'
            )?.url;
            if (!imageUri) {
              return null;
            }
            return (
              <View
                key={message.id}
                className="ml-12 self-end overflow-hidden rounded-2xl bg-secondary"
              >
                <Image
                  source={{ uri: imageUri }}
                  className="aspect-video w-full"
                  resizeMode="cover"
                />
              </View>
            );
          }

          // Only render if there are text parts
          const textParts = message.parts.filter(
            (part) => part.type === 'text'
          );
          if (textParts.length === 0) {
            return null;
          }

          const fullText = textParts.map((part) => part.text).join('\n');

          // Check if this is the last assistant message and still streaming
          const isLastMessage = index === messages.length - 1;
          const isStreaming =
            isLoading && isLastMessage && message.role === 'assistant';

          return (
            <View key={message.id}>
              <View
                className={clsx('rounded-2xl', {
                  'self-end bg-secondary ml-20 px-4 py-2 mb-2':
                    message.role === 'user',
                  'bg-transparent': message.role === 'assistant',
                })}
              >
                {textParts.map((part, i) => {
                  if (message.role === 'assistant') {
                    return (
                      <Markdown
                        key={`${message.id}-${i}`}
                        style={markdownStyles}
                        rules={markdownRules}
                      >
                        {part.text}
                      </Markdown>
                    );
                  }
                  return (
                    <Text
                      key={`${message.id}-${i}`}
                      className="text-base"
                    >
                      {part.text}
                    </Text>
                  );
                })}
              </View>
              {message.role === 'assistant' && !isStreaming && (
                <CopyIconButton clipboardText={fullText} />
              )}
            </View>
          );
        })}

        {/* Loading indicator */}
        {isLoading && (
          <View>
            <Skeleton className="h-8 w-8 rounded-full" />
          </View>
        )}
      </KeyboardAwareScrollView>
      <KeyboardStickyView>
        <View className="w-full">
          {/* Scroll to bottom button - absolutely positioned above input */}
          {!isAtBottom && (
            <PressableGlassView
              onPress={scrollToBottom}
              style={{
                position: 'absolute',
                top: -50,
                left: '50%',
                width: 44,
                height: 44,
                transform: [{ translateX: -22 }],
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              hitSlop={44}
            >
              <ChevronDown
                size={CONFIG.icon.size.md}
                className="text-primary"
              />
            </PressableGlassView>
          )}
          <GlassView
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 8,
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 16,
              marginBottom: 16,
              marginHorizontal: 8,
            }}
          >
            <TextInput
              className="mb-2 flex-1 text-base leading-none text-primary"
              placeholder={t('chat.askFollowUp')}
              value={input}
              onChangeText={setInput}
              multiline
              numberOfLines={4}
            />

            <Button
              onPress={() => handleSend({ value: input, clearInput: true })}
              size="icon"
              variant="default"
              className="flex-shrink-0 rounded-full h-8 w-8"
              disabled={isLoading || !input.trim()}
            >
              <ArrowUp
                className="text-primary-foreground"
                size={CONFIG.icon.size.sm}
                strokeWidth={2.5}
              />
            </Button>
          </GlassView>
        </View>
      </KeyboardStickyView>
    </Fragment>
  );
};

export const ChatScreen = ({
  chatRecordId,
  imageUri,
}: {
  chatRecordId?: string;
  imageUri?: string;
}) => {
  const { getRecordById, createRecord } = useChatRecords();
  const [chatRecord, setChatRecord] = useState<ChatRecord | null>(null);
  const initializedRef = useRef(false);
  useViewedScreen('chat');

  useEffect(() => {
    // Only initialize once
    if (initializedRef.current) return;
    initializedRef.current = true;

    void (async () => {
      // Load existing record
      if (chatRecordId) {
        const existingRecord = getRecordById({ id: chatRecordId });
        if (existingRecord) {
          setChatRecord(existingRecord);
          return;
        }
      }

      // Create new record for new chat
      const newRecord: ChatRecord = {
        id: uuid.v4(),
        messages: [],
        createdAt: new Date(),
      };
      await createRecord({ record: newRecord });
      setChatRecord(newRecord);
    })();
  }, [chatRecordId, imageUri, getRecordById, createRecord]);

  if (!chatRecord) {
    return null; // or a loading spinner
  }

  return (
    <ChatScreenComponent
      chatRecord={chatRecord}
      initialImageUri={imageUri}
    />
  );
};
