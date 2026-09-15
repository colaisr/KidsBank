import { useTranslation } from 'react-i18next';
import type { YoungCardThemePreview } from '../../data/youngCardThemes';

type YoungCardThemeTileProps = {
  theme: YoungCardThemePreview;
  selected: boolean;
  onSelect: () => void;
};

export function YoungCardThemeTile({ theme, selected, onSelect }: YoungCardThemeTileProps) {
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
        className="relative block aspect-[1.55/1] w-full overflow-hidden rounded-2xl shadow-md transition-transform duration-200 group-active:scale-[0.98]"
        style={{ background: theme.gradient }}
      >
        <ThemeDecor decor={theme.decor} />
        {selected ? (
          <span
            className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow"
            aria-hidden="true"
          >
            ✓
          </span>
        ) : null}
      </span>
      <span className="text-center font-heading text-base font-semibold text-text">
        {t(`ui.childYoung.cardDesign.skins.${theme.id}`)}
      </span>
    </button>
  );
}

function ThemeDecor({ decor }: { decor: YoungCardThemePreview['decor'] }) {
  switch (decor) {
    case 'ocean':
      return (
        <span
          className="absolute -bottom-6 -right-4 h-24 w-24 rounded-full bg-teal-300/35"
          aria-hidden="true"
        />
      );
    case 'space':
      return (
        <>
          {['12%', '28%', '62%', '78%'].map((left, index) => (
            <span
              key={left}
              className="absolute h-1 w-1 rounded-full bg-white/70"
              style={{ left, top: `${20 + index * 14}%` }}
              aria-hidden="true"
            />
          ))}
        </>
      );
    case 'leo':
      return (
        <span
          className="absolute -bottom-4 -right-2 h-20 w-20 rounded-full bg-orange-200/40"
          aria-hidden="true"
        />
      );
    case 'jungle':
      return null;
    default:
      return null;
  }
}
