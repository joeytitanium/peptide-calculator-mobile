import { iconWithClassName } from '@/components/icons/iconWithClassName';
import { CONFIG } from '@/config';
import clsx from 'clsx';
import { GlassView } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { Ellipsis } from 'lucide-react-native';
import { ReactNode } from 'react';
import { Pressable } from 'react-native';
import RNContextMenu from 'react-native-context-menu-view';

iconWithClassName(Ellipsis);

export type ContextMenuAction = {
  title: string;
  description?: string;
  systemIcon?: string;
  subtitle?: string;
  onPress: () => void;
};

export const ContextMenu = ({
  children,
  actions,
}: {
  children: ReactNode;
  actions: ContextMenuAction[];
}) => {
  return (
    <RNContextMenu
      dropdownMenuMode
      actions={actions.map((action) => ({
        title: action.title,
        description: action.description,
        systemIcon: action.systemIcon,
        subtitle: action.subtitle,
      }))}
      onPress={(e) => {
        void Haptics.selectionAsync();
        actions[e.nativeEvent.index].onPress();
      }}
    >
      {children}
    </RNContextMenu>
  );
};

export const ContextMenuEllipsisButton = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <GlassView
      style={{
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        width: 48,
      }}
      glassEffectStyle="clear"
    >
      <Pressable
        onPress={() => {
          void Haptics.selectionAsync();
        }}
      >
        <Ellipsis
          size={CONFIG.icon.size.md}
          className={clsx('text-background', className)}
        />
      </Pressable>
    </GlassView>
  );
};

ContextMenu.EllipsisButton = ContextMenuEllipsisButton;
