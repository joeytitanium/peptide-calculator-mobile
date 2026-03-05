import { GlassView } from '@/components/core/glass-view';
import { CONFIG } from '@/config';
import { ReactNode } from 'react';
import { LayoutChangeEvent, Platform } from 'react-native';

type Props = {
  bottom: number;
  onLayout: (e: LayoutChangeEvent) => void;
  children: ReactNode;
};

export function StickyOutputPanel({ bottom, onLayout, children }: Props) {
  const bottomOffset =
    Platform.OS === 'android' ? 8 : bottom + CONFIG.layout.tabBarPadding + 8;

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
