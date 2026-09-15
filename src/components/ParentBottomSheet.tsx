import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type ParentBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

/**
 * Bottom sheet scoped to the phone frame (absolute), not the browser viewport (fixed).
 */
export function ParentBottomSheet({ open, onClose, title, children }: ParentBottomSheetProps) {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-[500] flex flex-col justify-end bg-black/40">
      <button
        type="button"
        className="absolute inset-0"
        aria-label={t('ui.app.back')}
        onClick={onClose}
      />
      <div
        className="relative z-10 mx-4 mb-4 flex max-h-[min(72%,28rem)] w-[calc(100%-2rem)] flex-col rounded-t-card border border-border bg-surface px-4 pb-5 pt-3 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="parent-sheet-title"
      >
        <div className="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-border" aria-hidden="true" />
        <h2
          id="parent-sheet-title"
          className="shrink-0 font-heading text-lg font-semibold text-text"
        >
          {title}
        </h2>
        <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
