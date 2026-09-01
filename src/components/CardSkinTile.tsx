import { useTranslation } from 'react-i18next';
import type { CardSkinPreview } from '../data/cardSkins';

type CardSkinTileProps = {
  skin: CardSkinPreview;
  selected: boolean;
  onSelect: () => void;
};

export function CardSkinTile({ skin, selected, onSelect }: CardSkinTileProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="group flex flex-col items-center gap-2 text-left"
    >
      <span
        className="relative block aspect-[1.6/1] w-full overflow-hidden rounded-2xl shadow-md transition-transform duration-200 group-hover:scale-[1.02]"
        style={{ background: skin.gradient }}
      >
        <SkinMotif motif={skin.motif} />
        {selected ? (
          <span
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-primary shadow"
            aria-hidden="true"
          >
            ✓
          </span>
        ) : null}
      </span>
      <span className="text-center text-sm font-medium text-text">
        {t(`ui.cardDesign.skins.${skin.id}`)}
      </span>
    </button>
  );
}

function SkinMotif({ motif }: { motif: CardSkinPreview['motif'] }) {
  switch (motif) {
    case 'star':
      return (
        <span className="absolute left-2 top-2 text-sm text-accent-kids" aria-hidden="true">
          ★
        </span>
      );
    case 'stars':
      return (
        <>
          <span className="absolute left-2 top-2 text-[10px] text-white/80" aria-hidden="true">
            · · ·
          </span>
          <span className="absolute bottom-2 right-2 text-sm text-orange-300" aria-hidden="true">
            ✦
          </span>
        </>
      );
    case 'dino':
      return (
        <span
          className="absolute bottom-1 right-1 h-8 w-8 rounded-full rounded-br-none bg-emerald-900/50"
          aria-hidden="true"
        />
      );
    case 'heart':
      return (
        <>
          <span className="absolute right-2 top-2 text-xs text-white/70" aria-hidden="true">
            ★
          </span>
          <span className="absolute bottom-2 right-2 text-sm text-white/80" aria-hidden="true">
            ♥
          </span>
        </>
      );
    case 'robot':
      return (
        <>
          <span className="absolute left-2 top-3 text-[10px] tracking-widest text-white/50" aria-hidden="true">
            ▁▂▃
          </span>
          <span className="absolute bottom-2 right-2 text-sm text-sky-200" aria-hidden="true">
            ▣
          </span>
        </>
      );
    case 'bolt':
      return (
        <>
          <span
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgb(255 255 255 / 0.15) 8px, rgb(255 255 255 / 0.15) 16px)',
            }}
            aria-hidden="true"
          />
          <span className="absolute bottom-2 right-2 text-sm text-white" aria-hidden="true">
            ⚡
          </span>
        </>
      );
    default:
      return null;
  }
}
