import { Onboarding } from '@/components/onboarding/components';
import { Href } from 'expo-router';
import { useState } from 'react';

interface RadioOption {
  value: string;
  label: string;
}

export const OnboardingSurveyRadioQuestion = ({
  title,
  subtitle,
  options,
  currentHref,
  onProceed,
}: {
  title: string;
  subtitle: string;
  options: RadioOption[];
  currentHref: Href;
  onProceed?: (selectedValue: string) => void | Promise<void>;
}) => {
  const [value, setSelectedValue] = useState<string | undefined>();

  return (
    <Onboarding.Container
      currentHref={currentHref}
      canProceed={!!value}
      onProceed={value ? () => onProceed?.(value) : undefined}
    >
      {({ top, bottom, topToolbarHeight, bottomToolbarHeight }) => (
        <Onboarding.ScrollView
          topInset={topToolbarHeight + top}
          bottomInset={bottomToolbarHeight + bottom}
        >
          <Onboarding.Survey.Container>
            <Onboarding.Survey.TextContainer>
              <Onboarding.Survey.Title>{title}</Onboarding.Survey.Title>
              <Onboarding.Survey.Subtitle>
                {subtitle}
              </Onboarding.Survey.Subtitle>
            </Onboarding.Survey.TextContainer>
            <Onboarding.Survey.RadioOptions
              options={options}
              value={value}
              onChangeValue={setSelectedValue}
            />
          </Onboarding.Survey.Container>
        </Onboarding.ScrollView>
      )}
    </Onboarding.Container>
  );
};
