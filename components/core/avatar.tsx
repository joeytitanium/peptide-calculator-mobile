import { Image } from 'expo-image';
import { ReactNode } from 'react';
import { View } from 'react-native';

type AvatarProps = {
  imageUrl?: string | null;
  size?: number;
  fallback?: ReactNode;
};

export const Avatar = ({ imageUrl, size = 32, fallback }: AvatarProps) => {
  const borderRadius = size / 2;

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={{ width: size, height: size, borderRadius }}
        contentFit="cover"
      />
    );
  }

  if (fallback) {
    return (
      <View
        className="items-center justify-center overflow-hidden rounded-full bg-muted"
        style={{ width: size, height: size }}
      >
        {fallback}
      </View>
    );
  }

  return (
    <View
      className="rounded-full bg-muted"
      style={{ width: size, height: size }}
    />
  );
};
