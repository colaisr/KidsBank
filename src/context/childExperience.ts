import type { OnboardingAgeRangeId } from '../data/onboardingAgeRanges';

/** 6–8: current KidsBank young UI. 8–10: designer handoff child shell. 10–12+: teen UI. */
export type ChildExperience = 'young' | 'youngDesigner' | 'teen';

export const CHILD_EXPERIENCE_STORAGE_KEY = 'kidsbank.childExperience';
export const CHILD_AGE_RANGE_STORAGE_KEY = 'kidsbank.childAgeRange';

const VALID: ChildExperience[] = ['young', 'youngDesigner', 'teen'];

export const DEFAULT_CHILD_EXPERIENCE: ChildExperience = 'teen';

export function experienceFromAgeRange(ageRange: OnboardingAgeRangeId): ChildExperience {
  if (ageRange === '6-8') {
    return 'young';
  }
  if (ageRange === '8-10') {
    return 'youngDesigner';
  }
  return 'teen';
}

export function defaultAgeRangeForExperience(experience: ChildExperience): OnboardingAgeRangeId {
  if (experience === 'young') {
    return '6-8';
  }
  if (experience === 'youngDesigner') {
    return '8-10';
  }
  return '10-12';
}

export function isYoungChildExperience(experience: ChildExperience): boolean {
  return experience === 'young' || experience === 'youngDesigner';
}

export function readStoredChildExperience(): ChildExperience {
  try {
    const stored = localStorage.getItem(CHILD_EXPERIENCE_STORAGE_KEY) as ChildExperience | null;
    const ageRange = readStoredChildAgeRange();
    if (stored === 'young' && ageRange === '8-10') {
      return 'youngDesigner';
    }
    if (stored && VALID.includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage may be unavailable
  }
  return DEFAULT_CHILD_EXPERIENCE;
}

export function writeStoredChildExperience(experience: ChildExperience): void {
  try {
    localStorage.setItem(CHILD_EXPERIENCE_STORAGE_KEY, experience);
  } catch {
    // ignore
  }
}

export function readStoredChildAgeRange(): OnboardingAgeRangeId | null {
  try {
    const stored = localStorage.getItem(CHILD_AGE_RANGE_STORAGE_KEY);
    if (stored && (['6-8', '8-10', '10-12', '12-14', '14-17'] as const).includes(stored as OnboardingAgeRangeId)) {
      return stored as OnboardingAgeRangeId;
    }
  } catch {
    // ignore
  }
  return null;
}

export function writeStoredChildAgeRange(ageRange: OnboardingAgeRangeId): void {
  try {
    localStorage.setItem(CHILD_AGE_RANGE_STORAGE_KEY, ageRange);
  } catch {
    // ignore
  }
}

export function persistChildAgeSelection(ageRange: OnboardingAgeRangeId): ChildExperience {
  const experience = experienceFromAgeRange(ageRange);
  writeStoredChildExperience(experience);
  writeStoredChildAgeRange(ageRange);
  return experience;
}
