import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type ParentBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function ParentBottomSheet({ open, onClose, title, children }: ParentBottomSheetProps) {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/40 p-4">
      <button
        type="button"
        className="absolute inset-0"
        aria-label={t('ui.app.back')}
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-md rounded-t-card border border-border bg-surface px-4 pb-6 pt-3 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="parent-sheet-title"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" aria-hidden="true" />
        <h2 id="parent-sheet-title" className="font-heading text-lg font-semibold text-text">
          {title}
        </h2>
        <div className="mt-4 max-h-[50vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
