import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DemoChildProfile } from '../data/demoBaseline';
import { ParentChildPickerSheet } from './ParentChildPickerSheet';

type ParentChildHeaderProps = {
  children: DemoChildProfile[];
  activeChildId: string;
  onSelectChild: (childId: string) => void;
};

export function ParentChildHeader({
  children,
  activeChildId,
  onSelectChild,
}: ParentChildHeaderProps) {
  const { t } = useTranslation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const active = children.find((c) => c.id === activeChildId) ?? children[0];

  if (!active) {
    return null;
  }

  return (
    <>
      <div className="border-b border-border bg-surface px-4 py-3">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex w-full items-center gap-3 text-left"
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 font-heading text-base font-semibold text-primary"
            aria-hidden="true"
          >
            {active.initial}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1 font-heading text-base font-semibold text-text">
              <span className="truncate">{t(active.nameKey)}</span>
              <span className="text-text-muted" aria-hidden="true">▾</span>
            </span>
            <span className="block truncate text-xs text-text-muted">
              {t('ui.parent.childProfileSubtitle', { age: active.age })}
            </span>
          </span>
        </button>
      </div>
      <ParentChildPickerSheet
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        children={children}
        activeChildId={activeChildId}
        onSelect={onSelectChild}
      />
    </>
  );
}
