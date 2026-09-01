import type { PetState } from '../data/demoBaseline';

export type PetActionId = 'feed' | 'play' | 'sleep';

export const PET_ACTION_COSTS: Record<PetActionId, number> = {
  feed: 5,
  play: 8,
  sleep: 3,
};

export const PET_ACTION_EFFECTS: Record<
  PetActionId,
  { fullness: number; joy: number; energy: number }
> = {
  feed: { fullness: 35, joy: 5, energy: -8 },
  play: { fullness: -8, joy: 35, energy: -20 },
  sleep: { fullness: -5, joy: 8, energy: 40 },
};

export const XP_PER_LEVEL = 10;
export const XP_PER_ACTION = 10;

export type PetHintId =
  | 'feedMe'
  | 'sleepy'
  | 'playWithMe'
  | 'happy'
  | 'earnStars'
  | 'thanksForTask'
  | 'checkGoals';

export type PetHintResult = {
  hintId: PetHintId;
  navigable: boolean;
  navigateTo?: '/child/tasks' | '/child/goals';
};

function clampNeed(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function petLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function tickPetOnVisit(pet: PetState, now: Date): PetState {
  let { fullness, joy, energy, visitCount } = pet;

  if (visitCount > 0) {
    fullness -= 12;
    joy -= 10;
    energy -= 15;
  } else {
    const last = new Date(pet.lastTickAt);
    const minutes = Math.floor((now.getTime() - last.getTime()) / 60000);
    if (minutes >= 1) {
      const decay = Math.min(12, minutes * 3);
      fullness -= decay;
      joy -= decay;
      energy -= decay;
    }
  }

  return {
    ...pet,
    fullness: clampNeed(fullness),
    joy: clampNeed(joy),
    energy: clampNeed(energy),
    visitCount: visitCount + 1,
    lastTickAt: now.toISOString(),
  };
}

export function getPetHint(pet: PetState, starsBalance: number): PetHintResult {
  if (pet.careCount === 0) {
    return { hintId: 'feedMe', navigable: false };
  }
  if (pet.taskBuff) {
    return { hintId: 'thanksForTask', navigable: false };
  }
  if (starsBalance < 5) {
    return { hintId: 'earnStars', navigable: true, navigateTo: '/child/tasks' };
  }
  if (pet.fullness < 40) {
    return { hintId: 'feedMe', navigable: false };
  }
  if (pet.energy < 40) {
    return { hintId: 'sleepy', navigable: false };
  }
  if (pet.joy < 40) {
    return { hintId: 'playWithMe', navigable: false };
  }
  if (pet.fullness >= 70 && pet.joy >= 70 && pet.energy >= 70) {
    return { hintId: 'checkGoals', navigable: true, navigateTo: '/child/goals' };
  }
  return { hintId: 'happy', navigable: false };
}

export function petNeedsUrgentDot(pet: PetState, starsBalance: number): boolean {
  const minNeed = Math.min(pet.fullness, pet.joy, pet.energy);
  const minCost = Math.min(...Object.values(PET_ACTION_COSTS));
  return minNeed < 40 || starsBalance < minCost;
}

/** Tab bar badge: first visit, task buff, or urgent needs */
export function petNeedsTabAttention(pet: PetState, starsBalance: number): boolean {
  if (pet.careCount === 0 || pet.taskBuff) {
    return true;
  }
  return petNeedsUrgentDot(pet, starsBalance);
}

export function canAffordAction(
  action: PetActionId,
  starsBalance: number,
  taskBuff: boolean,
): boolean {
  if (taskBuff) {
    return true;
  }
  return starsBalance >= PET_ACTION_COSTS[action];
}

export function applyPetNeedEffects(pet: PetState, action: PetActionId): PetState {
  const effects = PET_ACTION_EFFECTS[action];
  return {
    ...pet,
    fullness: clampNeed(pet.fullness + effects.fullness),
    joy: clampNeed(pet.joy + effects.joy),
    energy: clampNeed(pet.energy + effects.energy),
    xp: pet.xp + XP_PER_ACTION,
    careCount: pet.careCount + 1,
    taskBuff: false,
  };
}
