import { OnboardingContainer } from './container';
import { OnboardingIconBadge } from './icon-badge';
import { OnboardingJumbleTitle } from './jumbo-title';
import { OnboardingProgressToolbar } from './progress-toolbar';
import { OnboardingScrollView } from './scrollview';
import { OnboardingSubtitle } from './subtitle';
import { OnboardingSurveyContainer } from './survey-container';
import {
  OnboardingSurveyCheckboxOptions,
  OnboardingSurveyRadioOptions,
} from './survey-options';
import { OnboardingSurveySubtitle } from './survey-subtitle';
import { OnboardingSurveyTextContainer } from './survey-text-container';
import { OnboardingSurveyTitle } from './survey-title';
import { OnboardingTextContainer } from './text-container';
import { OnboardingTitle } from './title';

export type OnboardingScreenLayoutProps = {
  topSafeAreaHeight: number;
  bottomSafeAreaHeight: number;
  topToolbarHeight: number;
  bottomToolbarHeight: number;
};

export const Onboarding = {
  Container: OnboardingContainer,
  IconBadge: OnboardingIconBadge,
  ScrollView: OnboardingScrollView,
  JumbleTitle: OnboardingJumbleTitle,
  Title: OnboardingTitle,
  Subtitle: OnboardingSubtitle,
  TextContainer: OnboardingTextContainer,
  ProgressToolbar: OnboardingProgressToolbar,
  Survey: {
    Container: OnboardingSurveyContainer,
    RadioOptions: OnboardingSurveyRadioOptions,
    CheckboxOptions: OnboardingSurveyCheckboxOptions,
    Title: OnboardingSurveyTitle,
    Subtitle: OnboardingSurveySubtitle,
    TextContainer: OnboardingSurveyTextContainer,
  },
};
