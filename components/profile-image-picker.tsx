import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { resizeImage } from '@/utils/resize-image';
import { Image } from 'expo-image';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { User } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

iconWithClassName(User);

const DISPLAY_SIZE = 80;
const UPLOAD_SIZE = DISPLAY_SIZE * 2; // 160x160

type ProfileImagePickerProps = {
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
  disabled?: boolean;
};

export const ProfileImagePicker = ({
  imageUri,
  onImageSelected,
  disabled = false,
}: ProfileImagePickerProps) => {
  const handlePress = async () => {
    if (disabled) return;

    const result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const { uri } = result.assets[0];
    const resizedUri = await resizeImage({ url: uri, maxSize: UPLOAD_SIZE });

    onImageSelected(resizedUri);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
    >
      <View
        className="items-center justify-center overflow-hidden rounded-full bg-secondary"
        style={{ width: DISPLAY_SIZE, height: DISPLAY_SIZE }}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: DISPLAY_SIZE, height: DISPLAY_SIZE }}
          />
        ) : (
          <User
            size={DISPLAY_SIZE * 0.5}
            className="text-muted-foreground"
          />
        )}
      </View>
    </Pressable>
  );
};
