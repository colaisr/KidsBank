import { useTranslation } from 'react-i18next';
import { PRESENTER_SHEET_CONFIG, type PresenterSheetId } from '../data/presenterSheets';

type PresenterValueSheetProps = {
  presenterId: PresenterSheetId;
  open: boolean;
  onClose: () => void;
};

export function PresenterValueSheet({ presenterId, open, onClose }: PresenterValueSheetProps) {
  const { t } = useTranslation();
  const config = PRESENTER_SHEET_CONFIG[presenterId];
  const base = `ui.presenter.sheets.${presenterId}`;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-card border border-border bg-surface p-5 shadow-xl">
        <h2 className="font-heading text-lg font-semibold text-text">{t(`${base}.title`)}</h2>
        <p className="mt-1 text-xs text-text-muted">{t('ui.presenter.subtitle')}</p>

        <section className="mt-5">
          <h3 className="text-sm font-semibold text-text">{t('ui.presenter.section.childTitle')}</h3>
          <table className="mt-2 w-full text-left text-xs">
            <tbody>
              {config.childRows.map((row) => (
                <tr key={row} className="border-b border-border last:border-0">
                  <td className="py-2 pr-2 font-medium text-text">
                    {t(`${base}.child.${row}.topic`)}
                  </td>
                  <td className="py-2 text-text-muted">{t(`${base}.child.${row}.meaning`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-5">
          <h3 className="text-sm font-semibold text-text">{t('ui.presenter.section.bankTitle')}</h3>
          <table className="mt-2 w-full text-left text-xs">
            <tbody>
              {config.bankRows.map((row) => (
                <tr key={row} className="border-b border-border last:border-0">
                  <td className="py-2 pr-2 font-medium text-text">
                    {t(`${base}.bank.${row}.effect`)}
                  </td>
                  <td className="py-2 text-text-muted">{t(`${base}.bank.${row}.meaning`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-5">
          <h3 className="text-sm font-semibold text-text">{t('ui.presenter.section.demoTitle')}</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs text-text-muted">
            {config.demoSteps.map((step) => (
              <li key={step}>{t(`${base}.demo.${step}`)}</li>
            ))}
          </ol>
        </section>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-card bg-primary px-4 py-2.5 text-sm font-medium text-white"
        >
          {t('ui.presenter.close')}
        </button>
      </div>
    </div>
  );
}
