import { useTranslation } from 'react-i18next';
import { ACTIVITY_ICON_EMOJI, ACTIVITY_ICON_IDS, type ActivityIconId } from '../data/activityIcons';

type IconPickerProps = {
  value: ActivityIconId;
  onChange: (iconId: ActivityIconId) => void;
  labelKey?: string;
};

export function IconPicker({ value, onChange, labelKey = 'ui.icons.label' }: IconPickerProps) {
  const { t } = useTranslation();

  return (
    <div>
      <span className="text-xs font-medium text-text-muted">{t(labelKey)}</span>
      <div className="mt-2 grid grid-cols-6 gap-2">
        {ACTIVITY_ICON_IDS.map((iconId) => (
          <button
            key={iconId}
            type="button"
            onClick={() => onChange(iconId)}
            aria-label={t(`ui.icons.${iconId}`)}
            className={`flex h-11 items-center justify-center rounded-xl border text-lg transition-colors ${
              value === iconId
                ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                : 'border-border bg-surface-muted hover:border-primary/40'
            }`}
          >
            <span aria-hidden="true">{ACTIVITY_ICON_EMOJI[iconId]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
