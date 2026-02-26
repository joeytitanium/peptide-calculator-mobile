import { CameraView, CropRegion } from '@/components/core/camera-view';
import { useSafeAreaInsets } from '@/hooks/use-safe-area-insets';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import * as MediaLibrary from 'expo-media-library';
import React from 'react';

export type { CropRegion };

type CameraScreenProps = {
  isScreenActive: boolean;
  onPhotoTaken: (uri: string, cropRegion?: CropRegion) => void;
  cropEnabled?: boolean;
};

export const CameraScreen = ({
  isScreenActive = false,
  onPhotoTaken,
  cropEnabled = false,
}: CameraScreenProps) => {
  const { savePhotoPreferenceValue, savePhotoPreferenceIsLoaded } =
    useAsyncStorage();
  const { paddingBottom } = useSafeAreaInsets({
    contentPadding: 'none',
  });

  return (
    <CameraView
      active={isScreenActive}
      containerClassName="flex-1"
      photoGuidelinesDisabled
      cropEnabled={cropEnabled}
      onPhotoTaken={async (uri, cropRegion) => {
        // Save photo to library if preference is enabled
        if (savePhotoPreferenceValue && savePhotoPreferenceIsLoaded) {
          try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === MediaLibrary.PermissionStatus.GRANTED) {
              await MediaLibrary.saveToLibraryAsync(uri);
            }
          } catch (error) {
            console.error('Failed to save photo to library:', error);
          }
        }

        onPhotoTaken(uri, cropRegion);
      }}
      style={{
        paddingBottom,
      }}
    />
  );
};
