import { OnboardingReview } from '@/components/screens/onboarding/onboarding-review';
import { useTranslation } from 'react-i18next';

export default function OnboardingReviewScreen() {
  const { t } = useTranslation();

  return (
    <OnboardingReview
      currentHref="/(auth)/onboarding-review"
      title={t('onboarding.review.title')}
      subtitle={t('onboarding.review.subtitle')}
      switchLabel={t('onboarding.review.switchLabel')}
      reviews={[
        {
          imageAssetName: 'testimonial-anne',
          name: 'Emilea C.',
          message: t('reviewCarousel.reviews.emilea'),
        },
        {
          imageAssetName: 'testimonial-arthur',
          name: 'Zlassenp',
          message: t('reviewCarousel.reviews.zlassenp'),
        },
        {
          imageAssetName: 'testimonial-felicia',
          name: 'Jaynacc',
          message: t('reviewCarousel.reviews.jaynacc'),
        },
      ]}
    />
  );
}
