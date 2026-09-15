import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { ParentSpendingDonut } from '../components/ParentSpendingDonut';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency, formatNumber } from '../lib/format';
import {
  getSpendingReport,
  type ReportPeriod,
} from '../lib/parentSpendingReport';

export function ParentReportsPage() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const [period, setPeriod] = useState<ReportPeriod>('week');
  const [pdfFeedback, setPdfFeedback] = useState(false);

  const { slices, total } = useMemo(() => getSpendingReport(period), [period]);

  const dateRangeKey =
    period === 'week'
      ? 'ui.parent.reportsScreen.dateRangeWeek'
      : 'ui.parent.reportsScreen.dateRangeMonth';

  function handleDownloadPdf() {
    setPdfFeedback(true);
    window.setTimeout(() => setPdfFeedback(false), 2500);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-surface-muted">
      <ChildPageTitle
        titleKey="ui.parent.reportsScreen.title"
        backTo="/parent"
        showSettingsLink={false}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-8 pt-2">
        <div className="flex rounded-full bg-primary/5 p-1 ring-1 ring-border/40">
          {(['week', 'month'] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setPeriod(id)}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all duration-200 ${
                period === id
                  ? 'bg-surface text-text shadow-sm ring-1 ring-border/50'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {t(`ui.parent.reportsScreen.period.${id}`)}
            </button>
          ))}
        </div>

        <p className="mt-3 text-center text-xs text-text-muted">{t(dateRangeKey)}</p>

        <div className="mt-6">
          <ParentSpendingDonut
            slices={slices}
            centerLabel={formatCurrency(total, locale)}
            centerSubLabel={t('ui.parent.reportsScreen.totalLabel')}
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-card border border-border bg-surface shadow-sm">
          <ul className="divide-y divide-border">
            {slices.map((slice) => (
              <li
                key={slice.id}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 text-sm font-medium text-text">
                  {t(`ui.parent.reportsScreen.categories.${slice.id}`)}
                </span>
                <span className="shrink-0 text-sm font-semibold text-text">
                  {formatCurrency(slice.amount, locale)}
                </span>
                <span className="w-10 shrink-0 text-right text-sm text-text-muted">
                  {formatNumber(slice.percent, locale)}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        {pdfFeedback ? (
          <p className="mt-4 text-center text-sm font-medium text-primary" role="status">
            {t('ui.parent.reportsScreen.pdfDemo')}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleDownloadPdf}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary bg-surface py-3.5 font-heading text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          <span aria-hidden="true">↓</span>
          {t('ui.parent.reportsScreen.downloadPdf')}
        </button>
      </div>
    </div>
  );
}
