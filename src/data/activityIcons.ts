export const ACTIVITY_ICON_IDS = ['book', 'paw', 'home', 'utensils', 'gamepad', 'gift'] as const;

export type ActivityIconId = (typeof ACTIVITY_ICON_IDS)[number];

export const ACTIVITY_ICON_EMOJI: Record<ActivityIconId, string> = {
  book: '📚',
  paw: '🐾',
  home: '🏠',
  utensils: '🍽️',
  gamepad: '🎮',
  gift: '🎁',
};

const LEGACY_ICON_MAP: Record<string, ActivityIconId> = {
  bike: 'gift',
  headphones: 'gift',
  gamepad: 'gamepad',
};

export function normalizeActivityIconId(iconId: string | undefined, fallback: ActivityIconId): ActivityIconId {
  if (!iconId) {
    return fallback;
  }

  if (ACTIVITY_ICON_IDS.includes(iconId as ActivityIconId)) {
    return iconId as ActivityIconId;
  }

  return LEGACY_ICON_MAP[iconId] ?? fallback;
}
