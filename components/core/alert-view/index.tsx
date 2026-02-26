import { Button, ButtonProps } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View } from 'react-native';

type CancelButtonProps = Pick<ButtonProps, 'variant' | 'onPress'> & {
  title?: string;
};

type ActionButtonProps = Pick<ButtonProps, 'variant' | 'onPress'> & {
  title: string;
};

export type AlertViewProps = {
  /** The title at the top of the tooltip */
  title: string;
  /** The text content of the tooltip */
  content: string;
  /** A function that will be fired on close of the tooltip */
  onDismiss: () => void;
  visible: boolean;

  cancelButton?: CancelButtonProps;
  primaryButton?: ActionButtonProps;
};

export const AlertView = ({
  content,
  title,
  visible,
  onDismiss,
  primaryButton,
  cancelButton,
}: AlertViewProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onDismiss={onDismiss}
    >
      <View className="absolute inset-0 bg-zinc-950 opacity-80"></View>
      <View className="absolute inset-0 flex-row items-center justify-center">
        <View className="mx-4 flex-1 gap-3 rounded-2xl border border-zinc-800 bg-background px-4 pb-4 pt-6 shadow-zinc-900">
          <Text className="text-center text-xl font-bold">{title}</Text>
          <Text className="text-center">{content}</Text>
          <View className="mt-2 flex-row gap-4">
            <Button
              className="flex-1"
              onPress={(evt) => {
                onDismiss();
                cancelButton?.onPress?.(evt);
              }}
              variant={cancelButton?.variant ?? 'outline'}
            >
              <Text>
                {cancelButton?.title ??
                  (primaryButton ? t('common.cancel') : t('common.ok'))}
              </Text>
            </Button>
            {primaryButton && (
              <Button
                className="flex-1"
                onPress={(evt) => {
                  onDismiss();
                  primaryButton.onPress?.(evt);
                }}
                variant={primaryButton.variant}
              >
                <Text>{primaryButton.title}</Text>
              </Button>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
