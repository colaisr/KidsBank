import { useTranslation } from 'react-i18next';
import type { DemoChildProfile } from '../data/demoBaseline';
import { ParentBottomSheet } from './ParentBottomSheet';

type ParentChildPickerSheetProps = {
  open: boolean;
  onClose: () => void;
  children: DemoChildProfile[];
  activeChildId: string;
  onSelect: (childId: string) => void;
};

export function ParentChildPickerSheet({
  open,
  onClose,
  children,
  activeChildId,
  onSelect,
}: ParentChildPickerSheetProps) {
  const { t } = useTranslation();

  return (
    <ParentBottomSheet open={open} onClose={onClose} title={t('ui.parent.childPickerTitle')}>
      <ul className="space-y-2">
        {children.map((child) => {
          const selected = child.id === activeChildId;
          return (
            <li key={child.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(child.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-card border px-4 py-3 text-left transition-colors ${
                  selected
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border bg-surface-muted hover:border-primary/30'
                }`}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-heading text-sm font-semibold text-primary"
                  aria-hidden="true"
                >
                  {child.initial}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-sm font-semibold text-text">
                    {t(child.nameKey)}
                  </span>
                  <span className="block text-xs text-text-muted">
                    {t('ui.parent.childProfileAge', { age: child.age })}
                  </span>
                </span>
                {selected ? (
                  <span className="text-xs font-medium text-primary">{t('ui.parent.childSelected')}</span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </ParentBottomSheet>
  );
}
