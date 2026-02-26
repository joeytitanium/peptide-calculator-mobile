import { SlideUpRevealView } from '@/components/core/animations/slide-up-reveal-view';
import { StarRating } from '@/components/core/rating/star-rating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useSubmitFeedback } from '@/lib/api/use-submit-feedback';
import { useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FeedbackScreenProps = {
  initialRating: number;
  imageUri?: string;
  onSuccess?: () => void;
};

export default function FeedbackScreen({
  initialRating,
  imageUri,
  onSuccess,
}: FeedbackScreenProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(initialRating);
  const [feedbackText, setFeedbackText] = useState('');
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();

  const submitFeedbackMutation = useSubmitFeedback({
    onSuccess: () => {
      Alert.alert(t('feedback.thankYouTitle'), t('feedback.thankYouMessage'), [
        { text: t('common.ok'), onPress: onSuccess },
      ]);
    },
    onError: (error) => {
      Alert.alert(t('common.error'), error.message);
    },
  });

  const isSubmitting = submitFeedbackMutation.isPending;

  const handleSubmit = useCallback(() => {
    if (feedbackText.trim().length === 0) {
      Alert.alert(
        t('feedback.feedbackRequired'),
        t('feedback.feedbackRequiredMessage')
      );
      return;
    }

    submitFeedbackMutation.mutate({
      rating,
      feedback: feedbackText.trim(),
      imageUri,
    });
  }, [feedbackText, rating, imageUri, submitFeedbackMutation, t]);

  // Set header button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          variant="ghost"
          size="sm"
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text className="text-primary font-semibold">
            {t('feedback.submit')}
          </Text>
        </Button>
      ),
    });
  }, [navigation, isSubmitting, handleSubmit, t]);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: bottom + 32,
      }}
    >
      <View className="px-6 py-8 gap-8">
        <SlideUpRevealView delay={300}>
          <View className="gap-0">
            <Text className="text-2xl font-bold tracking-tight">
              {t('feedback.title')}
            </Text>
            <Text className="text-lg text-muted-foreground leading-relaxed">
              {t('feedback.subtitle')}
            </Text>
          </View>
        </SlideUpRevealView>

        <SlideUpRevealView delay={500}>
          <StarRating
            value={rating}
            onChange={setRating}
            size="lg"
            className="justify-center"
          />
        </SlideUpRevealView>

        <SlideUpRevealView delay={700}>
          <View className="gap-2">
            <Text className="text-lg font-medium">{t('feedback.tellUs')}</Text>
            <Input
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              className="min-h-[150px] py-3"
              editable={!isSubmitting}
            />
          </View>
        </SlideUpRevealView>
      </View>
    </ScrollView>
  );
}
