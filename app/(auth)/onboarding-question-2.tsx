import { Onboarding } from '@/components/onboarding/components';
import { useAsyncStorage } from '@/providers/async-storage-provider';
import { HeadacheType } from '@/utils/async-storage';
import { capturePosthogEvent } from '@/utils/posthog';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function OnboardingQuestion2() {
  const { t } = useTranslation();
  const { headachePreferenceValue, headachePreferenceSetValue } =
    useAsyncStorage();
  const [selectedValue, setSelectedValue] = useState<string | undefined>();

  const options = [
    { value: 'tension', label: t('onboarding.question2.options.tension') },
    { value: 'migraine', label: t('onboarding.question2.options.migraine') },
    { value: 'cluster', label: t('onboarding.question2.options.cluster') },
    { value: 'sinus', label: t('onboarding.question2.options.sinus') },
    { value: 'not-sure', label: t('onboarding.question2.options.notSure') },
  ];

  return (
    <Onboarding.Container
      currentHref="/(auth)/onboarding-question-2"
      canProceed={!!selectedValue}
      onProceed={
        selectedValue
          ? async () => {
              const type = selectedValue as HeadacheType;
              headachePreferenceSetValue({
                frequency: headachePreferenceValue?.frequency ?? 'rarely',
                type,
              });
              capturePosthogEvent('onboarding-headache-type', {
                answer: type,
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
                {t('onboarding.question2.title')}
              </Onboarding.Survey.Title>
              <Onboarding.Survey.Subtitle>
                {t('onboarding.question2.subtitle')}
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
