import { GlassView } from '@/components/core/glass-view';
import { CONFIG } from '@/config';
import { ReactNode } from 'react';
import { Modal, Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type GlassTooltipProps = {
  visible: boolean;
  onDismiss: () => void;
  children: ReactNode;
  /** Position from top of screen. Defaults to below header (safeArea + 44 + 8) */
  top?: number;
  /** Position from right edge. Defaults to 16 */
  right?: number;
  /** Position from left edge */
  left?: number;
  /** Additional styles for the GlassView container */
  style?: StyleProp<ViewStyle>;
};

export function GlassTooltip({
  visible,
  onDismiss,
  children,
  top,
  right = 16,
  left,
  style,
}: GlassTooltipProps) {
  const insets = useSafeAreaInsets();
  const defaultTop = insets.top + CONFIG.layout.navigationBarPadding + 8;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <Pressable
        className="flex-1"
        onPress={onDismiss}
      >
        <View
          className="absolute"
          style={{
            top: top ?? defaultTop,
            right: left === undefined ? right : undefined,
            left,
          }}
        >
          <GlassView
            className="rounded-2xl"
            style={[
              {
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderRadius: 16,
              },
              style,
            ]}
          >
            {children}
          </GlassView>
        </View>
      </Pressable>
    </Modal>
  );
}
