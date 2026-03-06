export const IMAGE_ASSET_NAMES = [
  'app-icon',
  'app-store-icon',
  'onboarding-welcome',
  'onboarding-community',
  'single-wreath',
  'star',
  'photo-guidelines-good-1',
  'photo-guidelines-good-2',
  'photo-guidelines-good-3',
  'photo-guidelines-bad-1',
  'photo-guidelines-bad-2',
  'photo-guidelines-bad-3',
  'testimonial-anne',
  'testimonial-arthur',
  'testimonial-felicia',
  'testimonial-isaac',
  'testimonial-jenn',
  'testimonial-jessica',
  'testimonial-joel',
  'testimonial-shawna',
  'testimonial-wesley',
] as const;
export type ImageAssetName = (typeof IMAGE_ASSET_NAMES)[number];

export const VIDEO_ASSET_NAMES = ['paywall', 'demo'] as const;
export type VideoAssetName = (typeof VIDEO_ASSET_NAMES)[number];

/**
 * =============================================================
 * ASSET FILES
 * =============================================================
 */

export const IMAGE_ASSETS: Record<ImageAssetName, number> = {
  'app-icon': require('@/assets/images/app-icon.png'),
  'app-store-icon': require('@/assets/images/app-store-icon.png'),
  'onboarding-community': require('@/assets/images/onboarding-community.jpg'),
  'photo-guidelines-good-1': require('@/assets/images/photo-guidelines/good-1.jpg'),
  'photo-guidelines-good-2': require('@/assets/images/photo-guidelines/good-2.jpg'),
  'photo-guidelines-good-3': require('@/assets/images/photo-guidelines/good-3.jpg'),
  'photo-guidelines-bad-1': require('@/assets/images/photo-guidelines/bad-1.jpg'),
  'photo-guidelines-bad-2': require('@/assets/images/photo-guidelines/bad-2.jpg'),
  'photo-guidelines-bad-3': require('@/assets/images/photo-guidelines/bad-3.jpg'),
  'single-wreath': require('@/assets/images/single-wreath.png'),
  'testimonial-anne': require('@/assets/testimonials/anne.jpg'),
  'testimonial-arthur': require('@/assets/testimonials/arthur.jpg'),
  'testimonial-felicia': require('@/assets/testimonials/felicia.jpg'),
  'testimonial-isaac': require('@/assets/testimonials/isaac.jpg'),
  'testimonial-jenn': require('@/assets/testimonials/jenn.jpg'),
  'testimonial-jessica': require('@/assets/testimonials/jessica.jpg'),
  'testimonial-joel': require('@/assets/testimonials/joel.jpg'),
  'testimonial-shawna': require('@/assets/testimonials/shawna.jpg'),
  'testimonial-wesley': require('@/assets/testimonials/wesley.jpg'),
  'onboarding-welcome': require('@/assets/images/onboarding-welcome.jpeg'),
  star: require('@/assets/images/star.png'),
};

export const VIDEO_ASSETS: Record<VideoAssetName, number> = {
  paywall: require('@/assets/videos/paywall.mp4'),
  demo: require('@/assets/videos/demo.mp4'),
};
