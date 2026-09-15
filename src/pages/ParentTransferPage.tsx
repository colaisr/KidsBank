import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { ParentBottomSheet } from '../components/ParentBottomSheet';
import {
  type TransferTarget,
  transferParentToChild,
} from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency, formatNumber } from '../lib/format';

const AMOUNT_PRESETS = [200, 500, 1000] as const;

type PeriodId = 'weeklyFri' | 'weeklyMon' | 'monthly';

const PERIOD_IDS: PeriodId[] = ['weeklyFri', 'weeklyMon', 'monthly'];

export function ParentTransferPage() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const navigate = useNavigate();
  const { demo, setDemo } = useDemoState();

  const activeChild =
    demo.children.find((c) => c.id === demo.activeChildId) ?? demo.children[0];

  const [target, setTarget] = useState<TransferTarget>('card');
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(500);
  const [customAmount, setCustomAmount] = useState('500');
  const [regularEnabled, setRegularEnabled] = useState(true);
  const [periodId, setPeriodId] = useState<PeriodId>('weeklyFri');
  const [periodSheetOpen, setPeriodSheetOpen] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'insufficient' | null>(null);

  const amount = useMemo(() => {
    if (selectedPreset === 'custom') {
      const parsed = Number.parseInt(customAmount.replace(/\s/g, ''), 10);
      return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    }
    return selectedPreset;
  }, [selectedPreset, customAmount]);

  const canTransfer = amount > 0 && amount <= demo.parentWallet;

  function handleTransfer() {
    if (!canTransfer) {
      setFeedback('insufficient');
      return;
    }
    setDemo((s) => transferParentToChild(s, amount, target));
    setFeedback('success');
    window.setTimeout(() => navigate('/parent'), 900);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-surface-muted">
      <ChildPageTitle
        titleKey="ui.parent.transferScreen.title"
        titleValues={{ name: t(activeChild.nameKey) }}
        backTo="/parent"
        showSettingsLink={false}
        presenterId="parent-transfer"
      />

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-8 pt-3">
        <p className="mx-auto max-w-sm rounded-full bg-surface px-4 py-2 text-center text-xs font-medium text-text-muted shadow-sm ring-1 ring-border/50">
          {t('ui.transfer.wallet', {
            amount: formatCurrency(demo.parentWallet, locale),
          })}
        </p>

        <div className="mt-5 flex rounded-full bg-primary/5 p-1 ring-1 ring-border/40">
          {(['card', 'piggy'] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTarget(id)}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all duration-200 ${
                target === id
                  ? 'bg-surface text-text shadow-sm ring-1 ring-border/50'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {t(`ui.transfer.target.${id}`)}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <p className="text-center text-sm text-text-muted">
            {t('ui.parent.transferScreen.amountLabel')}
          </p>
          {selectedPreset === 'custom' ? (
            <div className="mt-2 flex items-baseline justify-center gap-1">
              <input
                type="text"
                inputMode="numeric"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value.replace(/[^\d]/g, ''))}
                className="w-[min(12rem,70vw)] border-0 bg-transparent text-center font-heading text-4xl font-semibold text-text outline-none"
                aria-label={t('ui.parent.transferScreen.amountLabel')}
              />
              <span className="font-heading text-2xl font-semibold text-text-muted">֏</span>
            </div>
          ) : (
            <p className="mt-2 text-center font-heading text-5xl font-semibold tracking-tight text-text">
              {formatNumber(amount, locale)}
              <span className="ml-1 text-3xl text-text-muted">֏</span>
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {AMOUNT_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setSelectedPreset(preset)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                selectedPreset === preset
                  ? 'bg-surface text-text shadow-sm ring-2 ring-primary/35'
                  : 'bg-primary/10 text-primary ring-1 ring-primary/15 hover:bg-primary/15'
              }`}
            >
              {formatCurrency(preset, locale)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedPreset('custom')}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              selectedPreset === 'custom'
                ? 'bg-surface text-text shadow-sm ring-2 ring-primary/35'
                : 'bg-primary/10 text-primary ring-1 ring-primary/15 hover:bg-primary/15'
            }`}
          >
            {t('ui.parent.transferScreen.customAmount')}
          </button>
        </div>

        <div className="mt-8 space-y-3">
          <div className="rounded-card border border-border bg-surface px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-heading text-sm font-semibold text-text">
                  {t('ui.parent.transferScreen.regularTitle')}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {t('ui.parent.transferScreen.regularHint')}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={regularEnabled}
                onClick={() => setRegularEnabled((on) => !on)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  regularEnabled ? 'bg-primary' : 'bg-border'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    regularEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {regularEnabled ? (
            <button
              type="button"
              onClick={() => setPeriodSheetOpen(true)}
              className="flex w-full items-center justify-between rounded-card border border-border bg-surface px-4 py-4 text-left shadow-sm"
            >
              <span className="text-sm font-medium text-text">
                {t('ui.parent.transferScreen.periodicity')}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                {t(`ui.parent.transferScreen.period.${periodId}`)}
                <span className="text-text-muted" aria-hidden="true">›</span>
              </span>
            </button>
          ) : null}
        </div>

        {feedback === 'success' ? (
          <p className="mt-4 text-center text-sm font-medium text-primary" role="status">
            {t('ui.parent.transferScreen.success')}
          </p>
        ) : null}
        {feedback === 'insufficient' ? (
          <p className="mt-4 text-center text-sm font-medium text-red-600" role="alert">
            {t('ui.parent.transferScreen.insufficient')}
          </p>
        ) : null}

        <div className="sticky bottom-0 mt-auto pt-6 pb-1">
          <button
            type="button"
            onClick={handleTransfer}
            disabled={!canTransfer}
            className="w-full rounded-full py-4 font-heading text-base font-semibold text-white shadow-lg transition-[opacity,transform] duration-200 active:scale-[0.99] disabled:opacity-45"
            style={{ background: 'var(--kb-header-gradient)' }}
          >
            {t('ui.parent.transferScreen.submit', {
              amount: formatCurrency(amount, locale),
            })}
          </button>
        </div>
      </div>

      <ParentBottomSheet
        open={periodSheetOpen}
        onClose={() => setPeriodSheetOpen(false)}
        title={t('ui.parent.transferScreen.periodicity')}
      >
        <ul className="space-y-2">
          {PERIOD_IDS.map((id) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => {
                  setPeriodId(id);
                  setPeriodSheetOpen(false);
                }}
                className={`flex w-full rounded-card border px-4 py-3 text-left text-sm font-semibold ${
                  periodId === id
                    ? 'border-primary/40 bg-primary/5 text-primary'
                    : 'border-border bg-surface-muted text-text'
                }`}
              >
                {t(`ui.parent.transferScreen.period.${id}`)}
              </button>
            </li>
          ))}
        </ul>
      </ParentBottomSheet>
    </div>
  );
}
