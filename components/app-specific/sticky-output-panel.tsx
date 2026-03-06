import { GlassView } from '@/components/core/glass-view';
import { ReactNode } from 'react';
import { LayoutChangeEvent, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GAP = 8;

type Props = {
  onLayout: (e: LayoutChangeEvent) => void;
  children: ReactNode;
};

export function StickyOutputPanel({ onLayout, children }: Props) {
  const { bottom } = useSafeAreaInsets();
  const bottomOffset = Platform.OS === 'android' ? GAP : bottom + GAP;

  return (
    <GlassView
      onLayout={onLayout}
      showBorder={Platform.OS === 'android'}
      style={{
        position: 'absolute',
        bottom: bottomOffset,
        left: 16,
        right: 16,
        borderRadius: 24,
      }}
    >
      {children}
    </GlassView>
  );
}
