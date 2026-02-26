import { IMAGE_ASSETS } from '@/components/assets';
import { Text } from '@/components/ui/text';
import { clsx } from 'clsx';
import { ReactNode } from 'react';
import { Image, View } from 'react-native';

export const WreathContainer = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <View className={clsx('items-center flex-shrink', className)}>
    <View className="flex-row items-center">
      <Image
        source={IMAGE_ASSETS['single-wreath']}
        style={{ width: 35, height: 47 }}
        resizeMode="contain"
      />
      {children}
      <Image
        source={IMAGE_ASSETS['single-wreath']}
        style={{ width: 35, height: 47, transform: [{ scaleX: -1 }] }}
        resizeMode="contain"
      />
    </View>
  </View>
);

export const AppStoreRatingWreath = ({ className }: { className?: string }) => (
  <WreathContainer className={className}>
    <View className="px-1">
      <Text className="text-center text-2xl font-bold">4.8</Text>
      <View className="flex-row items-center justify-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Image
            key={index}
            source={IMAGE_ASSETS['star']}
            className="h-[10px] w-[10px]"
            resizeMode="contain"
          />
        ))}
      </View>
    </View>
  </WreathContainer>
);

export const BestAppWreath = ({
  className,
  title,
}: {
  className?: string;
  title: string;
}) => (
  <WreathContainer className={className}>
    <View className="max-w-[80px]">
      <Text className="text-center text-[10px] font-bold uppercase tracking-tight leading-tight">
        {title}
      </Text>
    </View>
  </WreathContainer>
);
