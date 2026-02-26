import {
  refreshPushTokenRegistration,
  unregisterPushTokenFromBackend,
} from '@/lib/push-notifications';
import { AuthState } from '@/utils/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useAsyncStorage } from './async-storage-provider';

const DEFAULT_AUTH_STATE: AuthState = {
  appleUserId: null,
  identityToken: null,
  username: null,
  profileImageUrl: null,
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  appleUserId: string | null;
  username: string | null;
  profileImageUrl: string | null;
  signIn: (
    credential: AppleAuthentication.AppleAuthenticationCredential
  ) => void;
  setUsername: (username: string) => void;
  setProfileImageUrl: (url: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    authStateValue,
    authStateSetValue,
    authStateRemoveValue,
    authStateIsLoaded,
  } = useAsyncStorage();

  const currentAuthState = authStateValue ?? DEFAULT_AUTH_STATE;

  const signIn = useCallback(
    (credential: AppleAuthentication.AppleAuthenticationCredential) => {
      const newState: AuthState = {
        appleUserId: credential.user,
        identityToken: credential.identityToken ?? null,
        username: currentAuthState.username,
        profileImageUrl: currentAuthState.profileImageUrl,
      };
      authStateSetValue(newState);
    },
    [
      currentAuthState.username,
      currentAuthState.profileImageUrl,
      authStateSetValue,
    ]
  );

  const setUsername = useCallback(
    (username: string) => {
      const newState: AuthState = {
        ...currentAuthState,
        username,
      };
      authStateSetValue(newState);

      // Register push token after user is fully set up (fire and forget)
      void refreshPushTokenRegistration();
    },
    [currentAuthState, authStateSetValue]
  );

  const setProfileImageUrl = useCallback(
    (url: string) => {
      const newState: AuthState = {
        ...currentAuthState,
        profileImageUrl: url,
      };
      authStateSetValue(newState);
    },
    [currentAuthState, authStateSetValue]
  );

  const signOut = useCallback(() => {
    // Unregister push token before signing out (fire and forget)
    void unregisterPushTokenFromBackend();
    void authStateRemoveValue();
  }, [authStateRemoveValue]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated:
        !!currentAuthState.appleUserId && !!currentAuthState.username,
      isLoading: !authStateIsLoaded,
      appleUserId: currentAuthState.appleUserId,
      username: currentAuthState.username,
      profileImageUrl: currentAuthState.profileImageUrl,
      signIn,
      setUsername,
      setProfileImageUrl,
      signOut,
    }),
    [
      currentAuthState,
      authStateIsLoaded,
      signIn,
      setUsername,
      setProfileImageUrl,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
