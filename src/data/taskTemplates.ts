export const CUSTOM_TASK_TEMPLATE_ID = 'other' as const;

/** Parent-assigned chores only — not goals («своё дело» lives on `/child/goals`). */
export const TASK_TEMPLATES = [
  'homework',
  'walkDog',
  'hangLaundry',
  'tidyRoom',
  'dishes',
] as const;

export type TaskTemplateId = (typeof TASK_TEMPLATES)[number];

export const TASK_TEMPLATE_DEFAULT_REWARDS: Record<TaskTemplateId, number> = {
  homework: 25,
  walkDog: 15,
  hangLaundry: 10,
  tidyRoom: 15,
  dishes: 10,
};

export const TASK_TEMPLATE_DEFAULT_DUE: Record<TaskTemplateId, string> = {
  homework: '18:00',
  walkDog: '20:00',
  hangLaundry: '16:00',
  tidyRoom: '19:30',
  dishes: '17:00',
};

export const TASK_REWARD_PRESETS = [10, 15, 25, 50] as const;

export const TASK_DUE_PRESETS = ['16:00', '18:00', '20:00'] as const;
