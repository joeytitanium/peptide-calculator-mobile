import { clsx } from 'clsx';
import { ReactNode } from 'react';
import { ScrollView } from 'react-native';

export const OnboardingScrollView = ({
  children,
  topInset,
  bottomInset,
  alignCenter = false,
  className,
}: {
  children: ReactNode;
  topInset?: number;
  bottomInset?: number;
  alignCenter?: boolean;
  className?: string;
}) => (
  <ScrollView
    className={className}
    showsVerticalScrollIndicator={false}
    contentContainerClassName={clsx({
      'flex-grow': alignCenter,
    })}
    contentContainerStyle={{
      paddingTop: topInset,
      paddingBottom: bottomInset,
    }}
  >
    {children}
  </ScrollView>
);
