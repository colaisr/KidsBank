import type { CardSkin } from '../context/preferences';

export const YOUNG_CARD_THEME_IDS = ['ocean', 'space', 'leo', 'jungle'] as const;

export type YoungCardThemeId = (typeof YOUNG_CARD_THEME_IDS)[number];

export type YoungCardThemePreview = {
  id: YoungCardThemeId;
  gradient: string;
  decor: 'ocean' | 'space' | 'leo' | 'jungle';
};

export const YOUNG_CARD_THEME_PREVIEWS: YoungCardThemePreview[] = [
  {
    id: 'ocean',
    gradient: 'linear-gradient(145deg, #0d9488 0%, #0f766e 55%, #14b8a6 100%)',
    decor: 'ocean',
  },
  {
    id: 'space',
    gradient: 'linear-gradient(160deg, #1e3a5f 0%, #0f172a 100%)',
    decor: 'space',
  },
  {
    id: 'leo',
    gradient: 'linear-gradient(145deg, #fbbf24 0%, #f59e0b 45%, #ea580c 100%)',
    decor: 'leo',
  },
  {
    id: 'jungle',
    gradient: 'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)',
    decor: 'jungle',
  },
];

export function isYoungCardTheme(id: CardSkin): id is YoungCardThemeId {
  return (YOUNG_CARD_THEME_IDS as readonly string[]).includes(id);
}

export function normalizeYoungCardTheme(id: CardSkin): YoungCardThemeId {
  return isYoungCardTheme(id) ? id : 'ocean';
}
