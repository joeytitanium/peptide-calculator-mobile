import { Onboarding } from '@/components/onboarding/components';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { HeadacheFrequency } from '@/utils/async-storage';
import { capturePosthogEvent } from '@/utils/posthog';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function OnboardingQuestion1() {
  const { t } = useTranslation();
  const { headachePreferenceValue, headachePreferenceSetValue } =
    useAsyncStorage();
  const [selectedValue, setSelectedValue] = useState<string | undefined>();

  const options = [
    { value: 'daily', label: t('onboarding.question1.options.daily') },
    {
      value: 'several-per-week',
      label: t('onboarding.question1.options.severalPerWeek'),
    },
    { value: 'weekly', label: t('onboarding.question1.options.weekly') },
    {
      value: 'few-per-month',
      label: t('onboarding.question1.options.fewPerMonth'),
    },
    { value: 'rarely', label: t('onboarding.question1.options.rarely') },
  ];

  return (
    <Onboarding.Container
      currentHref="/(auth)/onboarding-question-1"
      canProceed={!!selectedValue}
      onProceed={
        selectedValue
          ? async () => {
              const frequency = selectedValue as HeadacheFrequency;
              headachePreferenceSetValue({
                frequency,
                type: headachePreferenceValue?.type ?? 'not-sure',
              });
              capturePosthogEvent('onboarding-headache-frequency', {
                answer: frequency,
              });
            }
          : undefined
      }
    >
      {({ top, bottom, topToolbarHeight, bottomToolbarHeight }) => (
        <Onboarding.ScrollView
          topInset={topToolbarHeight + top}
          bottomInset={bottomToolbarHeight + bottom}
        >
          <Onboarding.Survey.Container>
            <Onboarding.Survey.TextContainer>
              <Onboarding.Survey.Title>
                {t('onboarding.question1.title')}
              </Onboarding.Survey.Title>
              <Onboarding.Survey.Subtitle>
                {t('onboarding.question1.subtitle')}
              </Onboarding.Survey.Subtitle>
            </Onboarding.Survey.TextContainer>
            <Onboarding.Survey.RadioOptions
              options={options}
              value={selectedValue}
              onChangeValue={setSelectedValue}
            />
          </Onboarding.Survey.Container>
        </Onboarding.ScrollView>
      )}
    </Onboarding.Container>
  );
}
