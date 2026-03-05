import { StarRating } from '@/components/core/rating/star-rating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useSubmitFeedback } from '@/lib/api/use-submit-feedback';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';

type Step = 'rating' | 'feedback';

type ReviewSheetScreenProps = {
  onRequestStoreReview: () => void;
  onDismiss: () => void;
};

export function ReviewSheetScreen({
  onRequestStoreReview,
  onDismiss,
}: ReviewSheetScreenProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('rating');
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const submitFeedbackMutation = useSubmitFeedback({
    onSuccess: () => {
      Alert.alert(t('feedback.thankYouTitle'), t('feedback.thankYouMessage'), [
        { text: t('common.ok'), onPress: onDismiss },
      ]);
    },
    onError: (error) => {
      Alert.alert(t('common.error'), error.message);
    },
  });

  const isSubmitting = submitFeedbackMutation.isPending;

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);

    if (rating >= 4) {
      onRequestStoreReview();
    } else {
      setStep('feedback');
    }
  };

  const handleSubmitFeedback = () => {
    if (feedbackText.trim().length === 0) {
      Alert.alert(
        t('feedback.feedbackRequired'),
        t('feedback.feedbackRequiredMessage')
      );
      return;
    }

    submitFeedbackMutation.mutate({
      rating: selectedRating,
      feedback: feedbackText.trim(),
    });
  };

  return (
    <View className="flex-1 justify-end p-6 pb-12">
      {step === 'rating' ? (
        <View className="items-center gap-4">
          <Text className="text-2xl font-bold">{t('review.title')}</Text>
          <Text className="text-base text-muted-foreground text-center">
            {t('review.subtitle')}
          </Text>
          <StarRating
            value={selectedRating}
            onChange={handleRatingChange}
            size="lg"
          />
        </View>
      ) : (
        <View className="w-full gap-4">
          <View className="items-center gap-1">
            <Text className="text-xl font-bold">
              {t('review.feedbackTitle')}
            </Text>
            <Text className="text-base text-muted-foreground text-center">
              {t('review.feedbackSubtitle')}
            </Text>
          </View>
          <Input
            value={feedbackText}
            onChangeText={setFeedbackText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-[100px] py-3"
            editable={!isSubmitting}
            placeholder={t('review.feedbackPlaceholder')}
            autoFocus
          />
          <Button
            onPress={handleSubmitFeedback}
            disabled={isSubmitting}
          >
            <Text>{t('review.submit')}</Text>
          </Button>
          <Button
            variant="ghost"
            onPress={onDismiss}
            disabled={isSubmitting}
          >
            <Text>{t('review.noThanks')}</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
