import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { YoungAccountRows } from '../../components/child-young/YoungAccountRows';
import { YoungChildHomeHeader } from '../../components/child-young/YoungChildHomeHeader';
import { YoungQuickActions } from '../../components/child-young/YoungQuickActions';
import { YoungTotemDock } from '../../components/child-young/YoungTotemDock';
import { HomeSectionHeading } from '../../components/HomeSectionHeading';
import { TaskCard } from '../../components/TaskCard';
import { useDemoState } from '../../context/DemoStateContext';
import { usePreferences } from '../../context/PreferencesContext';
import { formatCurrency } from '../../lib/format';
import { getActiveTasks } from '../../lib/tasks';

export function YoungChildHomePage() {
  const { t } = useTranslation();
  const { demo } = useDemoState();
  const { locale, bank } = usePreferences();
  const productName =
    bank === 'amio' ? t('ui.home.productAmio') : t('ui.home.productEvoca');
  const homeTask = getActiveTasks(demo.tasks)[0];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-surface-muted">
      <YoungChildHomeHeader />

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-4 pb-1 pt-2.5">
        <Link
          to="/child/card-design"
          className="kb-pay-card block shrink-0 rounded-card px-4 py-3.5 shadow-lg transition-transform duration-200 active:scale-[0.99]"
          aria-label={t('ui.cardDesign.title')}
        >
          <div className="relative z-10 flex items-start justify-between">
            <CardChipIcon />
            <span className="text-base text-accent-kids" aria-hidden="true">★</span>
          </div>
          <p className="relative z-10 mt-2 font-heading text-xs font-semibold tracking-wide text-white/90">
            {productName}
          </p>
          <p className="relative z-10 mt-0.5 font-medium tracking-[0.12em] text-xs text-white/80">
            {t('ui.card.masked', { last4: demo.card.last4 })}
          </p>
          <p className="relative z-10 mt-2 font-heading text-2xl font-semibold tracking-tight">
            {formatCurrency(demo.card.balance, locale, 'AMD', 2)}
          </p>
          <span className="kb-card-mark" aria-hidden="true" />
        </Link>

        <YoungQuickActions />
        <YoungAccountRows />

        {homeTask ? (
          <section className="min-h-0 shrink pt-0.5">
            <HomeSectionHeading
              titleKey="ui.home.tasks"
              to="/child/tasks"
              presenterId="child-tasks"
              dense
            />
            <TaskCard task={homeTask} compact />
          </section>
        ) : null}
      </div>

      <YoungTotemDock />
    </div>
  );
}

function CardChipIcon() {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="26" height="18" rx="4" stroke="white" strokeOpacity="0.7" strokeWidth="1.5" />
      <rect x="5" y="5" width="8" height="6" rx="1" fill="white" fillOpacity="0.35" />
    </svg>
  );
}
