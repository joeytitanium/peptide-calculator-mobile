import { TableView } from '@/components/core/table-view';
import { useAuth } from '@/providers/auth-provider';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, View } from 'react-native';

type AccountSettingsScreenProps = {
  onEditProfile: () => void;
  onDeleteAccount: () => void;
  onSignOut: () => void;
};

export const AccountSettingsScreen = ({
  onEditProfile,
  onDeleteAccount,
  onSignOut,
}: AccountSettingsScreenProps) => {
  const { t } = useTranslation();
  const { username, signOut } = useAuth();

  const handleEditProfile = () => {
    void Haptics.selectionAsync();
    onEditProfile();
  };

  const handleSignOut = () => {
    void Haptics.selectionAsync();
    Alert.alert(t('account.signOutConfirmTitle'), t('account.signOutConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('account.signOut'),
        style: 'destructive',
        onPress: () => {
          signOut();
          onSignOut();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    void Haptics.selectionAsync();
    onDeleteAccount();
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName=""
    >
      <View className="px-2 gap-8">
        <TableView.Section>
          <TableView.Row
            title={t('account.editProfile')}
            subtitle={t('account.editProfileSubtitle')}
            onPress={handleEditProfile}
            rightElementType="chevron"
            hideSeparator
          />
        </TableView.Section>
        <TableView.Section>
          <TableView.Row
            title={t('account.signOut')}
            subtitle={username ? `@${username}` : t('settings.signedInWithApple')}
            onPress={handleSignOut}
            rightElementType="chevron"
          />
          <TableView.Row
            title={t('account.deleteAccount')}
            subtitle={t('account.deleteAccountSubtitle')}
            onPress={handleDeleteAccount}
            rightElementType="chevron"
            hideSeparator
            destructive
          />
        </TableView.Section>
      </View>
    </ScrollView>
  );
};
