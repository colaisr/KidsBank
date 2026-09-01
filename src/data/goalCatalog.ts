import type { ActivityIconId } from './activityIcons';

export type GoalCardTone = 'navy' | 'peach' | 'cyan';

export type GoalCatalogEntry = {
  templateId: string;
  iconId: ActivityIconId;
  targetStars: number;
  amdValue: number;
  cardTone: GoalCardTone;
};

export const GOAL_CATALOG: readonly GoalCatalogEntry[] = [
  {
    templateId: 'ps5',
    iconId: 'gamepad',
    targetStars: 1500,
    amdValue: 250000,
    cardTone: 'navy',
  },
  {
    templateId: 'sneakers',
    iconId: 'gift',
    targetStars: 430,
    amdValue: 35000,
    cardTone: 'peach',
  },
  {
    templateId: 'bike',
    iconId: 'gift',
    targetStars: 2200,
    amdValue: 120000,
    cardTone: 'cyan',
  },
  {
    templateId: 'skateboard',
    iconId: 'gift',
    targetStars: 900,
    amdValue: 80000,
    cardTone: 'cyan',
  },
  {
    templateId: 'book',
    iconId: 'book',
    targetStars: 150,
    amdValue: 15000,
    cardTone: 'peach',
  },
  {
    templateId: 'headphones',
    iconId: 'gift',
    targetStars: 1100,
    amdValue: 50000,
    cardTone: 'cyan',
  },
];

export function getGoalCatalogEntry(templateId: string): GoalCatalogEntry | undefined {
  return GOAL_CATALOG.find((entry) => entry.templateId === templateId);
}

export const GOAL_CARD_TONE_CLASS: Record<GoalCardTone, string> = {
  navy: 'bg-slate-800 text-white',
  peach: 'bg-orange-100 text-orange-700',
  cyan: 'bg-sky-100 text-sky-700',
};
