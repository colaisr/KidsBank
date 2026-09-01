import type { CardSkin } from '../context/preferences';

export type CardSkinPreview = {
  id: CardSkin;
  gradient: string;
  motif: 'star' | 'stars' | 'dino' | 'heart' | 'robot' | 'bolt';
};

export const CARD_SKIN_PREVIEWS: CardSkinPreview[] = [
  {
    id: 'ocean',
    gradient: 'linear-gradient(135deg, #05a9c7 0%, #086f83 100%)',
    motif: 'star',
  },
  {
    id: 'space',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
    motif: 'stars',
  },
  {
    id: 'dinosaurs',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
    motif: 'dino',
  },
  {
    id: 'unicorns',
    gradient: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)',
    motif: 'heart',
  },
  {
    id: 'robots',
    gradient: 'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)',
    motif: 'robot',
  },
  {
    id: 'racing',
    gradient: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
    motif: 'bolt',
  },
];
