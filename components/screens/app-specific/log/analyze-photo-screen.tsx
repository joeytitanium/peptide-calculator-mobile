import { CameraView } from '@/components/core/camera-view';
import { type CropRegion } from '@/components/core/crop-overlay';
import { View } from 'react-native';

type AnalyzePhotoScreenProps = {
  onPhotoTaken: (uri: string, cropRegion?: CropRegion) => void;
};

export const AnalyzePhotoScreen = ({
  onPhotoTaken,
}: AnalyzePhotoScreenProps) => {
  return (
    <View className="flex-1">
      <CameraView
        active
        photoGuidelinesDisabled
        onPhotoTaken={onPhotoTaken}
      />
    </View>
  );
};
