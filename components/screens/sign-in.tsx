import { Text } from '@/components/ui/text';
import { fetchApi } from '@/lib/api/fetch-api';
import { useColorScheme } from '@/lib/use-color-scheme';
import { useAuth } from '@/providers/auth-provider';
import { useQuery } from '@tanstack/react-query';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Image } from 'expo-image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

type SignInScreenProps = {
  onSuccess: (needsUsername: boolean) => void;
};

const ME_SCHEMA = z.object({
  username: z.string().nullable(),
  createdAt: z.string(),
});

export const SignInScreen = ({ onSuccess }: SignInScreenProps) => {
  const { t } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();
  const { signIn, setUsername } = useAuth();
  const { bottom } = useSafeAreaInsets();
  const [credential, setCredential] =
    useState<AppleAuthentication.AppleAuthenticationCredential | null>(null);

  const { isFetching } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { success, data } = await fetchApi({
        path: '/me',
        schema: ME_SCHEMA,
      });

      if (!success || !data) {
        onSuccess(true);
        return null;
      }

      if (data.username) {
        void setUsername(data.username);
        onSuccess(false);
      } else {
        onSuccess(true);
      }

      return data;
    },
    enabled: !!credential,
  });

  const handleAppleSignIn = async () => {
    try {
      const result = await AppleAuthentication.signInAsync();
      signIn(result);
      setCredential(result);
    } catch (e: unknown) {
      const error = e as { code?: string };
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        console.error('Apple sign in error:', e);
      }
    }
  };

  const showLoading = !!credential && isFetching;

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-8">
        {/* App icon */}
        <Image
          source={require('@/assets/images/app-icon.png')}
          style={{ width: 100, height: 100, borderRadius: 20 }}
          contentFit="cover"
        />

        {/* Text */}
        <Text className="mt-8 text-center text-2xl font-semibold tracking-tight">
          {t('signIn.title')}
        </Text>
        <Text className="mt-3 text-center text-base text-muted-foreground">
          {t('signIn.subtitle')}
        </Text>
      </View>

      {/* Apple Sign In Button */}
      <View
        className="px-6"
        style={{ paddingBottom: bottom + 16 }}
      >
        {showLoading ? (
          <View
            style={styles.appleButton}
            className="items-center justify-center"
          >
            <ActivityIndicator />
          </View>
        ) : (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
            }
            buttonStyle={
              !isDarkColorScheme
                ? AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                : AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
            }
            cornerRadius={12}
            style={styles.appleButton}
            onPress={() => {
              void handleAppleSignIn();
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appleButton: {
    width: '100%',
    height: 54,
  },
});
