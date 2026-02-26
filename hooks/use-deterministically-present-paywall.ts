import { useRevenueCat } from '@/providers/revenue-cat-provider';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export const useDeterministicallyPresentPaywall = ({
  onPresentPaywall,
}: {
  onPresentPaywall: () => void;
}) => {
  const { hasActiveSubscription } = useRevenueCat();

  useFocusEffect(
    useCallback(() => {
      if (hasActiveSubscription) {
        return;
      }
      onPresentPaywall();
    }, [hasActiveSubscription, onPresentPaywall])
  );
};
