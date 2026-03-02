import { GlassView } from '@/components/core/glass-view';
import { useColorScheme } from '@/lib/use-color-scheme';
import { ReactNode } from 'react';
import { LayoutChangeEvent } from 'react-native';

type Props = {
  bottom: number;
  onLayout: (e: LayoutChangeEvent) => void;
  children: ReactNode;
};

export function StickyOutputPanel({ bottom, onLayout, children }: Props) {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <GlassView
      onLayout={onLayout}
      glassEffectStyle="clear"
      tintColor={isDarkColorScheme ? 'black' : 'white'}
      style={{
        position: 'absolute',
        bottom: bottom + 8,
        left: 16,
        right: 16,
        borderRadius: 24,
      }}
    >
      {children}
    </GlassView>
  );
}
