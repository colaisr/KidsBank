import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DemoChildProfile } from '../data/demoBaseline';
import { ParentChildPickerSheet } from './ParentChildPickerSheet';

type ParentChildHeaderProps = {
  children: DemoChildProfile[];
  activeChildId: string;
  onSelectChild: (childId: string) => void;
  /** Sits on parent home gradient — no separate white bar */
  variant?: 'surface' | 'hero';
};

export function ParentChildHeader({
  children,
  activeChildId,
  onSelectChild,
  variant = 'surface',
}: ParentChildHeaderProps) {
  const { t } = useTranslation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const active = children.find((c) => c.id === activeChildId) ?? children[0];

  if (!active) {
    return null;
  }

  const onHero = variant === 'hero';

  return (
    <>
      <div
        className={
          onHero
            ? 'px-4 pt-2 pb-1'
            : 'border-b border-border bg-surface px-4 py-3'
        }
      >
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex w-full items-center gap-2.5 text-left"
        >
          <span
            className={`flex shrink-0 items-center justify-center rounded-full font-heading font-semibold ${
              onHero
                ? 'h-10 w-10 bg-white/20 text-base text-white'
                : 'h-11 w-11 bg-primary/15 text-base text-primary'
            }`}
            aria-hidden="true"
          >
            {active.initial}
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={`flex items-center gap-1 font-heading font-semibold ${
                onHero ? 'text-base text-white' : 'text-base text-text'
              }`}
            >
              <span className="truncate">{t(active.nameKey)}</span>
              <span className={onHero ? 'text-white/70' : 'text-text-muted'} aria-hidden="true">
                ▾
              </span>
            </span>
            <span
              className={`block truncate text-xs ${
                onHero ? 'text-white/75' : 'text-text-muted'
              }`}
            >
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
