import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { CONFIG } from '@/config';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { GlassView } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { X } from 'lucide-react-native';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

iconWithClassName(X);

interface ImageZoomModalProps {
  visible: boolean;
  uri: string | undefined;
  onClose: () => void;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  visible,
  uri,
  onClose,
}) => {
  const { top } = useSafeAreaInsets();

  const handleClose = () => {
    void Haptics.selectionAsync();
    onClose();
  };

  if (!uri) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ImageZoom
          uri={uri}
          minScale={1}
          maxScale={5}
          isDoubleTapEnabled
          onSingleTap={onClose}
          style={styles.zoomImage}
        />

        {/* Close button */}
        <View style={[styles.closeButtonContainer, { top: top }]}>
          <GlassView style={styles.glassContainer}>
            <Pressable
              onPress={handleClose}
              style={styles.closeButton}
            >
              <X
                size={CONFIG.icon.size.md}
                className="text-white"
              />
            </Pressable>
          </GlassView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  zoomImage: {
    flex: 1,
  },
  closeButtonContainer: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  glassContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
