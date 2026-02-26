import { VIDEO_ASSETS, VideoAssetName } from '@/components/assets';
import { BORDER_RADIUS_MAP, BorderRadius } from '@/types/border-radius';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleProp, ViewStyle } from 'react-native';

type LocalVideoViewProps = {
  assetName: VideoAssetName;
  className?: string;
  width: number;
  height: number;
  borderRadius?: BorderRadius;
  style?: StyleProp<ViewStyle>;
};

export const LocalVideoView = ({
  assetName,
  className,
  width,
  height,
  borderRadius = 'none',
  style,
}: LocalVideoViewProps) => {
  const player = useVideoPlayer(
    {
      assetId: VIDEO_ASSETS[assetName],
      metadata: {
        title: '',
        artist: '',
      },
    },
    (player) => {
      player.loop = true;
      player.muted = true;
      player.play();
    }
  );

  return (
    <VideoView
      className={className}
      player={player}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
      nativeControls={false}
      contentFit="cover"
      style={{
        width,
        height,
        borderRadius: BORDER_RADIUS_MAP[borderRadius],
        ...(style as ViewStyle),
      }}
    />
  );
};
