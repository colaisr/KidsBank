import { STORAGE_KEYS } from '../context/preferences';
import { normalizeYoungCardTheme } from '../data/youngCardThemes';
import type { CardDesign } from './CardVisual';

const HANDOFF_CARD_KEY = 'evoca-card-design';

const DESIGNER_CARD_IDS = new Set<string>(['ocean', 'space', 'leo', 'jungle']);

export function readDesignerCardDesign(): CardDesign {
  try {
    const skin = localStorage.getItem(STORAGE_KEYS.cardSkin);
    if (skin && DESIGNER_CARD_IDS.has(skin)) {
      return skin as CardDesign;
    }
    const saved = localStorage.getItem(HANDOFF_CARD_KEY);
    if (saved && DESIGNER_CARD_IDS.has(saved)) {
      return saved as CardDesign;
    }
  } catch {
    // ignore
  }
  return 'space';
}

export function writeDesignerCardDesign(design: CardDesign): void {
  try {
    localStorage.setItem(HANDOFF_CARD_KEY, design);
    if (DESIGNER_CARD_IDS.has(design)) {
      localStorage.setItem(STORAGE_KEYS.cardSkin, normalizeYoungCardTheme(design));
    }
  } catch {
    // ignore
  }
}
