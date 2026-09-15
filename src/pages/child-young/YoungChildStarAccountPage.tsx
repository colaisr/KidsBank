import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDemoState } from '../../context/DemoStateContext';
import { usePreferences } from '../../context/PreferencesContext';
import { formatNumber, getRelativeDayGroup } from '../../lib/format';
import {
  getYoungStarEarnings,
  youngStarEarningTitle,
  type YoungStarEarning,
  type YoungStarEarningKind,
} from '../../lib/youngStarEarnings';

export function YoungChildStarAccountPage() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo } = useDemoState();

  const earnings = useMemo(() => getYoungStarEarnings(demo), [demo]);

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <header className="border-b border-border bg-surface px-4 pb-4 pt-3">
        <div className="flex items-center gap-3">
          <Link
            to="/child"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary"
            aria-label={t('ui.app.back')}
          >
            <span aria-hidden="true">←</span>
          </Link>
          <h1 className="min-w-0 flex-1 text-center font-heading text-lg font-semibold text-text pr-9">
            {t('ui.childYoung.stars.title')}
          </h1>
        </div>
      </header>

      <div className="space-y-6 px-4 py-6">
        <section className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-accent-kids/25">
            <span className="text-4xl text-accent-kids-ink" aria-hidden="true">★</span>
          </div>
          <p className="mt-4 font-heading text-4xl font-bold tracking-tight text-text">
            {formatNumber(demo.taskStats.starsEarned, locale)}
            <span className="ml-1.5 text-3xl text-accent-kids-ink" aria-hidden="true">★</span>
          </p>
          <p className="mt-1 text-sm text-text-muted">{t('ui.childYoung.stars.totalEarned')}</p>
        </section>

        <section>
          <h2 className="mb-3 font-heading text-base font-semibold text-text">
            {t('ui.childYoung.stars.sourcesTitle')}
          </h2>
          {earnings.length > 0 ? (
            <div className="space-y-2">
              {earnings.map((earning) => (
                <YoungStarEarningRow key={earning.id} earning={earning} />
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-border bg-surface p-5">
              <p className="text-sm text-text-muted">{t('ui.childYoung.stars.empty')}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function YoungStarEarningRow({ earning }: { earning: YoungStarEarning }) {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo } = useDemoState();

  const title = youngStarEarningTitle(earning, demo.tasks, t);
  const dateLabel = formatYoungStarDate(new Date(earning.at), t);

  return (
    <article className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3">
      <EarningIcon kind={earning.kind} />
      <div className="min-w-0 flex-1">
        <p className="font-heading text-sm font-semibold text-text">{title}</p>
        <p className="text-xs text-text-muted">{dateLabel}</p>
      </div>
      <p className="shrink-0 font-heading text-sm font-semibold text-primary">
        +{formatNumber(earning.amount, locale)}
        <span className="ml-0.5" aria-hidden="true">★</span>
      </p>
    </article>
  );
}

function formatYoungStarDate(
  date: Date,
  t: (key: string, options?: Record<string, number>) => string,
): string {
  const group = getRelativeDayGroup(date);
  if (group === 'today') {
    return t('ui.piggy.dayToday');
  }
  if (group === 'yesterday') {
    return t('ui.piggy.dayYesterday');
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / (24 * 60 * 60 * 1000),
  );

  return t('ui.childYoung.stars.daysAgo', { count: Math.max(2, diffDays) });
}

function EarningIcon({ kind }: { kind: YoungStarEarningKind }) {
  if (kind === 'pet') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 5v4l-2 8h12l-2-8V5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M10 9h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (kind === 'lesson') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 4 4 8v8l8 4 8-4V8l-8-4Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 12.5l3 3 7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
