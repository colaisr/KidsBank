import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChildPageTitle } from '../components/ChildPageTitle';
import {
  defaultAgeRangeForExperience,
  readStoredChildAgeRange,
} from '../context/childExperience';
import { usePreferences } from '../context/PreferencesContext';
import {
  ONBOARDING_AGE_RANGE_EMOJI,
  ONBOARDING_AGE_RANGE_IDS,
  type OnboardingAgeRangeId,
} from '../data/onboardingAgeRanges';

export function OnboardingAgePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { childExperience, setChildExperienceFromAgeRange } = usePreferences();
  const [selectedAge, setSelectedAge] = useState<OnboardingAgeRangeId>(() =>
    readStoredChildAgeRange() ?? defaultAgeRangeForExperience(childExperience),
  );

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle
        titleKey="ui.onboarding.age.title"
        backTo="/child/onboarding/role"
        showSettingsLink={false}
        presenterId="onboarding-age"
      />

      <div className="px-4 pb-4">
        <div className="mb-4 flex gap-2">
          <span className="h-1.5 flex-1 rounded-full bg-border" />
          <span
            className="h-1.5 flex-1 rounded-full"
            style={{
              background: 'linear-gradient(90deg, var(--kb-primary) 0%, var(--kb-accent-kids) 100%)',
            }}
          />
        </div>
        <p className="text-center text-sm text-text-muted">{t('ui.onboarding.age.subtitle')}</p>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 pb-24">
        {ONBOARDING_AGE_RANGE_IDS.map((id) => {
          const selected = selectedAge === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedAge(id)}
              className={`flex items-center gap-3 rounded-card border-2 bg-surface p-4 text-left transition-colors ${
                selected
                  ? 'border-primary bg-gradient-to-r from-accent-kids/15 to-surface'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center text-2xl">
                {ONBOARDING_AGE_RANGE_EMOJI[id]}
              </span>
              <span className="min-w-0 flex-1 font-heading text-base font-semibold text-text">
                {t(`ui.onboarding.age.ranges.${id}`)}
              </span>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected ? 'border-primary bg-primary text-white' : 'border-border bg-surface'
                }`}
                aria-hidden="true"
              >
                {selected ? '✓' : ''}
              </span>
            </button>
          );
        })}
      </div>

      <div className="sticky bottom-0 border-t border-border bg-surface px-4 py-4">
        <button
          type="button"
          onClick={() => {
            setChildExperienceFromAgeRange(selectedAge);
            navigate('/child');
          }}
          className="w-full rounded-card bg-primary py-3.5 font-heading text-base font-semibold text-white transition-opacity hover:opacity-95"
        >
          {t('ui.onboarding.age.continue')}
        </button>
      </div>
    </div>
  );
}
