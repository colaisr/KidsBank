import { useTranslation } from 'react-i18next';
import { usePreferences } from '../context/PreferencesContext';
import type { Role } from '../context/preferences';

type RoleToggleProps = {
  onGradient?: boolean;
  compact?: boolean;
};

export function RoleToggle({ onGradient = false, compact = false }: RoleToggleProps) {
  const { t } = useTranslation();
  const { role, setRole } = usePreferences();

  return (
    <div
      className={`flex rounded-full p-1 ${
        onGradient ? 'bg-white/15' : 'bg-surface-muted'
      }`}
    >
      {(['child', 'parent'] as Role[]).map((item) => {
        const active = role === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => setRole(item)}
            className={`rounded-full font-medium transition-colors duration-200 ${
              compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
            } ${
              active
                ? onGradient
                  ? 'bg-white text-primary-dark'
                  : 'bg-primary text-white'
                : onGradient
                  ? 'text-white/80 hover:text-white'
                  : 'text-text-muted hover:text-text'
            }`}
          >
            {t(`ui.role.${item}`)}
          </button>
        );
      })}
    </div>
  );
}
