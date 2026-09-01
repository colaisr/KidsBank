export const ONBOARDING_AGE_RANGE_IDS = ['6-8', '8-10', '10-12', '12-14', '14-17'] as const;

export type OnboardingAgeRangeId = (typeof ONBOARDING_AGE_RANGE_IDS)[number];

export const ONBOARDING_AGE_RANGE_EMOJI: Record<OnboardingAgeRangeId, string> = {
  '6-8': '🐣',
  '8-10': '🚀',
  '10-12': '⭐',
  '12-14': '🎮',
  '14-17': '🎧',
};
