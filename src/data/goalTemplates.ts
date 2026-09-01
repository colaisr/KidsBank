import type { ActivityIconId } from './activityIcons';

export const CUSTOM_GOAL_TEMPLATE_ID = 'other' as const;

export const GOAL_TEMPLATES = ['bike', 'ps5', 'headphones'] as const;

export type GoalTemplateId = (typeof GOAL_TEMPLATES)[number];

export const GOAL_TEMPLATE_DEFAULT_TARGETS: Record<GoalTemplateId, number> = {
  bike: 800,
  ps5: 1500,
  headphones: 500,
};

export const GOAL_TEMPLATE_DEFAULT_AMD: Record<GoalTemplateId, number> = {
  bike: 120000,
  ps5: 250000,
  headphones: 50000,
};

export const GOAL_TEMPLATE_DEFAULT_ICONS: Record<GoalTemplateId, ActivityIconId> = {
  bike: 'gift',
  ps5: 'gamepad',
  headphones: 'gift',
};

export const GOAL_TARGET_PRESETS = [500, 800, 1000, 1500] as const;

export const GOAL_AMD_PRESETS = [50000, 120000, 200000, 250000] as const;

export const CUSTOM_GOAL_DEFAULT_ICON: ActivityIconId = 'gift';
