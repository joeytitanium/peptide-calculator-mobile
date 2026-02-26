import { StarRating } from '@/components/core/rating/star-rating';
import { Text } from '@/components/ui/text';
import { useDeterministicallyRequestReview } from '@/hooks/use-deterministically-request-review';
import { clsx } from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

type RatingAlertProps = {
  onRatingSelected?: (rating: number) => void;
  className?: string;
};

export function RatingAlert({ onRatingSelected, className }: RatingAlertProps) {
  const { t } = useTranslation();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const { requestReview } = useDeterministicallyRequestReview();

  const handleRatingChange = async (rating: number) => {
    setSelectedRating(rating);

    if (rating >= 4) {
      // High rating - request app store review, keep stars filled and visible
      await requestReview();
    } else {
      // Low rating - notify parent to handle navigation
      onRatingSelected?.(rating);
    }
  };

  return (
    <View className={clsx('items-center gap-3', className)}>
      <Text className="text-base text-muted-foreground text-center leading-relaxed">
        {t('rating.howWouldYouRate')}
      </Text>

      <StarRating
        value={selectedRating ?? 0}
        onChange={handleRatingChange}
        size="lg"
      />
    </View>
  );
}
