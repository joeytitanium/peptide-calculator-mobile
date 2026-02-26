import { Onboarding } from '@/components/onboarding/components';
import { Href } from 'expo-router';
import { useState } from 'react';

interface CheckboxOption {
  value: string;
  label: string;
}

export const OnboardingSurveyCheckboxQuestion = ({
  title,
  subtitle,
  options,
  currentHref,
}: {
  title: string;
  subtitle: string;
  options: CheckboxOption[];
  currentHref: Href;
}) => {
  const [value, setSelectedValue] = useState<string[]>([]);

  return (
    <Onboarding.Container
      currentHref={currentHref}
      canProceed={!!value}
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
            <Onboarding.Survey.CheckboxOptions
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
