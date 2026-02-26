import { Image, ImageProps, StyleProp, View, ViewStyle } from 'react-native';
import { IMAGE_ASSETS, ImageAssetName } from './assets';

// Define border properties and colors
const OUTER_BORDER_WIDTH = 4;
const INNER_BORDER_WIDTH = 2;
const IMAGE_CORNER_RADIUS = 44;

// Calculate radii for each layer to ensure smooth curves
// The radius of an outer layer needs to accommodate the border width and the radius of the layer inside it.
const INNER_CONTAINER_RADIUS = IMAGE_CORNER_RADIUS; // Radius for the direct image container
const MIDDLE_BEZEL_RADIUS = INNER_CONTAINER_RADIUS + INNER_BORDER_WIDTH; // Radius for the black bezel
const OUTER_FRAME_RADIUS = MIDDLE_BEZEL_RADIUS + OUTER_BORDER_WIDTH; // Radius for the silver frame

export const PhoneFrameScreenshot = ({
  source,
  style: userProvidedStyle,
  imageProps,
}: {
  source: ImageAssetName;
  imageProps?: ImageProps;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View // Outermost View: Silver frame
      className="bg-neutral-300 dark:bg-neutral-400"
      style={[
        userProvidedStyle, // User can pass width, height, flex, margins, etc.
        {
          flex: 1,
          borderRadius: OUTER_FRAME_RADIUS,
          // This view will take its size from userProvidedStyle or its children if not specified.
        },
      ]}
    >
      <View // Middle View: Black bezel
        className="bg-neutral-700 dark:bg-neutral-900"
        style={{
          borderRadius: MIDDLE_BEZEL_RADIUS,
          margin: OUTER_BORDER_WIDTH, // This margin creates the silver border effect.
          // It pushes this black view inward from the silver view's edges.
          flex: 1, // Ensures this view expands to fill the space made available by the parent's margin.
        }}
      >
        <View // Innermost View: Clips the image
          style={{
            // backgroundColor: 'transparent', // Or a placeholder color if needed
            borderRadius: INNER_CONTAINER_RADIUS,
            margin: INNER_BORDER_WIDTH, // This margin creates the black border effect.
            // It pushes the image container inward from the black view's edges.
            overflow: 'hidden', // Crucial for clipping the image.
            flex: 1, // Ensures this view expands.
          }}
        >
          <Image
            source={IMAGE_ASSETS[source]}
            resizeMode="cover"
            style={{
              width: '100%',
              height: '100%',
            }}
            {...imageProps}
          />
        </View>
      </View>
    </View>
  );
};
