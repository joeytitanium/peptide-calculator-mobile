import { Href } from 'expo-router';

type ScreenConfig = {
  posthogEventName: string;
  hideTopGradient?: boolean;
  hideBottomGradient?: boolean;
  href: Href;
  onComplete?: () => void | Promise<void>;
};

export const ONBOARDING_CONFIG: ScreenConfig[] = [
  {
    posthogEventName: 'onboarding-1',
    href: '/(auth)/onboarding-1',
  },
  {
    posthogEventName: 'onboarding-2',
    href: '/(auth)/onboarding-2',
  },
  {
    posthogEventName: 'onboarding-3',
    href: '/(auth)/onboarding-3',
  },
  // {
  //   posthogEventName: 'onboarding-welcome',
  //   href: '/(auth)/onboarding-welcome',
  //   hideTopGradient: true,
  //   hideBottomGradient: true,
  // },
  // {
  //   posthogEventName: 'onboarding-question-1',
  //   href: '/(auth)/onboarding-question-1',
  // },
  // {
  //   posthogEventName: 'onboarding-question-2',
  //   href: '/(auth)/onboarding-question-2',
  // },
  // {
  //   posthogEventName: 'onboarding-notifications',
  //   href: '/(auth)/onboarding-notifications',
  // },
  // {
  //   posthogEventName: 'onboarding-personalization',
  //   href: '/(auth)/onboarding-personalization',
  //   onComplete: async () => {
  //     await requestReviewHandler({ inAppOnly: true });
  //   },
  // },
  // {
  //   posthogEventName: 'onboarding-personalization-done',
  //   href: '/(auth)/onboarding-personalization-done',
  // },
  // {
  //   posthogEventName: 'onboarding-community',
  //   href: '/(auth)/onboarding-community',
  // },
  // {
  //   posthogEventName: 'onboarding-pain-points',
  //   href: '/(auth)/onboarding-pain-points',
  // },
  // {
  //   posthogEventName: 'onboarding-benefits',
  //   href: '/(auth)/onboarding-benefits',
  // },
  // {
  //   posthogEventName: 'onboarding-comparison',
  //   href: '/(auth)/onboarding-comparison',
  // },
  // {
  //   posthogEventName: 'onboarding-finished',
  //   href: '/(auth)/onboarding-finished',
  // },
  {
    posthogEventName: 'onboarding-paywall',
    href: '/(auth)/paywall',
  },
] as const;

export const getNextHref = (currentHref: Href) => {
  const currentIndex = ONBOARDING_CONFIG.findIndex(
    (config) => config.href === currentHref
  );
  if (currentIndex === -1) {
    return undefined;
  }

  const nextIndex = currentIndex + 1;
  if (nextIndex >= ONBOARDING_CONFIG.length) {
    return undefined;
  }

  return ONBOARDING_CONFIG[nextIndex].href;
};
