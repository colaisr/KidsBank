import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { ParentBottomSheet } from '../components/ParentBottomSheet';
import { ParentToggle } from '../components/ParentToggle';
import {
  CASH_WITHDRAWAL_MAX_DAILY,
  CASH_WITHDRAWAL_STEP,
  type DemoTransferRecipient,
  type DemoTransferRecipientTone,
} from '../data/demoBaseline';
import {
  addTransferRecipient,
  setCashWithdrawalDailyLimit,
  setCashWithdrawalEnabled,
  setTransferRecipientEnabled,
} from '../context/demoActions';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatCurrency } from '../lib/format';

const AVATAR_TONE_CLASS: Record<DemoTransferRecipientTone, string> = {
  primary: 'bg-primary/15 text-primary',
  warm: 'bg-accent-secondary/15 text-accent-secondary',
  sky: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
};

const ADD_LIMIT_OPTIONS: Array<number | null> = [null, 500, 1000, 2000];

function recipientDisplayName(recipient: DemoTransferRecipient, t: (key: string) => string) {
  if (recipient.customName) {
    return recipient.customName;
  }
  return recipient.nameKey ? t(recipient.nameKey) : '';
}

export function ParentLimitsPage() {
  const { t } = useTranslation();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();

  const activeChild =
    demo.children.find((c) => c.id === demo.activeChildId) ?? demo.children[0];

  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLimit, setNewLimit] = useState<number | null>(500);

  const cashProgress = useMemo(() => {
    const max = demo.cashWithdrawal.maxDaily || CASH_WITHDRAWAL_MAX_DAILY;
    return Math.min(100, (demo.cashWithdrawal.dailyLimit / max) * 100);
  }, [demo.cashWithdrawal.dailyLimit, demo.cashWithdrawal.maxDaily]);

  function recipientSubtitle(recipient: DemoTransferRecipient) {
    if (recipient.dailyLimit === null) {
      return t('ui.parent.limitsScreen.noDailyLimit');
    }
    return t('ui.parent.limitsScreen.dailyUpTo', {
      amount: formatCurrency(recipient.dailyLimit, locale),
    });
  }

  function handleAddRecipient() {
    setDemo((s) => addTransferRecipient(s, { customName: newName, dailyLimit: newLimit }));
    setNewName('');
    setNewLimit(500);
    setAddSheetOpen(false);
  }

  function stepCash(delta: number) {
    setDemo((s) =>
      setCashWithdrawalDailyLimit(s, s.cashWithdrawal.dailyLimit + delta * CASH_WITHDRAWAL_STEP),
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-surface-muted">
      <ChildPageTitle
        titleKey="ui.parent.limitsScreen.title"
        backTo="/parent"
        showSettingsLink={false}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-4 pb-8 pt-4">
        <section>
          <h2 className="font-heading text-base font-semibold text-text">
            {t('ui.parent.limitsScreen.transfersTitle')}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {t('ui.parent.limitsScreen.transfersHint', {
              name: t(activeChild.nameKey),
            })}
          </p>

          <div className="mt-4 overflow-hidden rounded-card border border-border bg-surface shadow-sm">
            <ul className="divide-y divide-border">
              {demo.transferRecipients.map((recipient) => (
                <li
                  key={recipient.id}
                  className="flex items-center gap-3 px-4 py-3.5"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-heading text-sm font-semibold ${AVATAR_TONE_CLASS[recipient.avatarTone]}`}
                    aria-hidden="true"
                  >
                    {recipient.initial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-sm font-semibold text-text">
                      {recipientDisplayName(recipient, t)}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {recipientSubtitle(recipient)}
                    </p>
                  </div>
                  <ParentToggle
                    checked={recipient.enabled}
                    onChange={(enabled) =>
                      setDemo((s) => setTransferRecipientEnabled(s, recipient.id, enabled))
                    }
                    ariaLabel={recipientDisplayName(recipient, t)}
                  />
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => setAddSheetOpen(true)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-muted/80"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xl text-text-muted"
                    aria-hidden="true"
                  >
                    +
                  </span>
                  <span className="font-heading text-sm font-semibold text-text">
                    {t('ui.parent.limitsScreen.addRecipient')}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-base font-semibold text-text">
            {t('ui.parent.limitsScreen.cashTitle')}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {t('ui.parent.limitsScreen.cashHint')}
          </p>

          <div className="mt-4 space-y-4 rounded-card border border-border bg-surface px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="font-heading text-sm font-semibold text-text">
                {t('ui.parent.limitsScreen.allowCash')}
              </p>
              <ParentToggle
                checked={demo.cashWithdrawal.enabled}
                onChange={(enabled) => setDemo((s) => setCashWithdrawalEnabled(s, enabled))}
                ariaLabel={t('ui.parent.limitsScreen.allowCash')}
              />
            </div>

            <div
              className={`transition-opacity ${demo.cashWithdrawal.enabled ? 'opacity-100' : 'pointer-events-none opacity-40'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => stepCash(-1)}
                  disabled={demo.cashWithdrawal.dailyLimit <= 0}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted text-lg font-semibold text-text disabled:opacity-40"
                  aria-label={t('ui.parent.limitsScreen.decreaseCash')}
                >
                  −
                </button>
                <p className="font-heading text-2xl font-semibold tracking-tight text-text">
                  {formatCurrency(demo.cashWithdrawal.dailyLimit, locale)}
                </p>
                <button
                  type="button"
                  onClick={() => stepCash(1)}
                  disabled={
                    demo.cashWithdrawal.dailyLimit >= demo.cashWithdrawal.maxDaily
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted text-lg font-semibold text-text disabled:opacity-40"
                  aria-label={t('ui.parent.limitsScreen.increaseCash')}
                >
                  +
                </button>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-border/60">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-200"
                  style={{ width: `${cashProgress}%` }}
                />
              </div>
              <p className="mt-2 text-right text-xs font-medium text-text-muted">
                {t('ui.parent.limitsScreen.cashMax', {
                  amount: formatCurrency(demo.cashWithdrawal.maxDaily, locale),
                })}
              </p>
            </div>
          </div>
        </section>
      </div>

      <ParentBottomSheet
        open={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        title={t('ui.parent.limitsScreen.addRecipientTitle')}
      >
        <label className="block text-sm font-medium text-text">
          {t('ui.parent.limitsScreen.recipientName')}
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mt-2 w-full rounded-card border border-border bg-surface-muted px-3 py-2.5 text-sm text-text outline-none focus:border-primary/50"
            placeholder={t('ui.parent.limitsScreen.recipientNamePlaceholder')}
          />
        </label>

        <p className="mt-4 text-sm font-medium text-text">
          {t('ui.parent.limitsScreen.recipientLimit')}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ADD_LIMIT_OPTIONS.map((limit) => (
            <button
              key={limit ?? 'unlimited'}
              type="button"
              onClick={() => setNewLimit(limit)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                newLimit === limit
                  ? 'bg-primary text-white'
                  : 'bg-surface-muted text-text ring-1 ring-border'
              }`}
            >
              {limit === null
                ? t('ui.parent.limitsScreen.noDailyLimit')
                : formatCurrency(limit, locale)}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddRecipient}
          disabled={!newName.trim()}
          className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold text-white disabled:opacity-45"
        >
          {t('ui.parent.limitsScreen.addRecipientConfirm')}
        </button>
      </ParentBottomSheet>
    </div>
  );
}
