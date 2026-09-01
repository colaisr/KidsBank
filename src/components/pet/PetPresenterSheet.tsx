import { useTranslation } from 'react-i18next';

type PetPresenterSheetProps = {
  open: boolean;
  onClose: () => void;
};

const CHILD_ROWS = ['regularity', 'earnSpend', 'choice', 'responsibility'] as const;
const BANK_ROWS = ['retention', 'ltv', 'differentiation', 'family'] as const;
const DEMO_STEPS = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'] as const;

export function PetPresenterSheet({ open, onClose }: PetPresenterSheetProps) {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-card border border-border bg-surface p-5 shadow-xl">
        <h2 className="font-heading text-lg font-semibold text-text">{t('ui.pet.presenter.title')}</h2>
        <p className="mt-1 text-xs text-text-muted">{t('ui.pet.presenter.subtitle')}</p>

        <section className="mt-5">
          <h3 className="text-sm font-semibold text-text">{t('ui.pet.presenter.childTitle')}</h3>
          <table className="mt-2 w-full text-left text-xs">
            <tbody>
              {CHILD_ROWS.map((row) => (
                <tr key={row} className="border-b border-border last:border-0">
                  <td className="py-2 pr-2 font-medium text-text">{t(`ui.pet.presenter.child.${row}.topic`)}</td>
                  <td className="py-2 text-text-muted">{t(`ui.pet.presenter.child.${row}.meaning`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-5">
          <h3 className="text-sm font-semibold text-text">{t('ui.pet.presenter.bankTitle')}</h3>
          <table className="mt-2 w-full text-left text-xs">
            <tbody>
              {BANK_ROWS.map((row) => (
                <tr key={row} className="border-b border-border last:border-0">
                  <td className="py-2 pr-2 font-medium text-text">{t(`ui.pet.presenter.bank.${row}.effect`)}</td>
                  <td className="py-2 text-text-muted">{t(`ui.pet.presenter.bank.${row}.meaning`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-5">
          <h3 className="text-sm font-semibold text-text">{t('ui.pet.presenter.demoTitle')}</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs text-text-muted">
            {DEMO_STEPS.map((step) => (
              <li key={step}>{t(`ui.pet.presenter.demo.${step}`)}</li>
            ))}
          </ol>
        </section>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-card bg-primary px-4 py-2.5 text-sm font-medium text-white"
        >
          {t('ui.pet.presenter.close')}
        </button>
      </div>
    </div>
  );
}
