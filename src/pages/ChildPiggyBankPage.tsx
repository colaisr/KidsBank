import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { PiggyDepositRow } from '../components/PiggyDepositRow';
import { PiggyTransferModal, type PiggyTransferMode } from '../components/PiggyTransferModal';
import { useDemoState } from '../context/DemoStateContext';
import { usePreferences } from '../context/PreferencesContext';
import { isPiggyDeposit, type DemoTransaction } from '../data/demoBaseline';
import {
  formatCurrency,
  getRelativeDayGroup,
  type RelativeDayGroup,
} from '../lib/format';
import { getPiggyShareUrl } from '../lib/piggy';

type ShareFeedback = 'copied' | 'shared' | null;
type TransferFeedback = 'deposit' | 'withdraw' | 'insufficient' | null;

const GROUP_ORDER: RelativeDayGroup[] = ['today', 'yesterday', 'earlier'];

export function ChildPiggyBankPage() {
  const { t } = useTranslation();
  const { locale, bank } = usePreferences();
  const { demo } = useDemoState();
  const [shareFeedback, setShareFeedback] = useState<ShareFeedback>(null);
  const [transferMode, setTransferMode] = useState<PiggyTransferMode | null>(null);
  const [transferFeedback, setTransferFeedback] = useState<TransferFeedback>(null);

  useEffect(() => {
    if (!transferFeedback) {
      return;
    }
    const timer = window.setTimeout(() => setTransferFeedback(null), 3500);
    return () => window.clearTimeout(timer);
  }, [transferFeedback]);

  const shareUrl = getPiggyShareUrl(bank, demo.piggy.shareSlug);

  const groupedDeposits = useMemo(() => {
    const deposits = demo.transactions
      .filter((tx) => isPiggyDeposit(tx.typeId))
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

    const groups = new Map<RelativeDayGroup, DemoTransaction[]>();
    for (const tx of deposits) {
      const key = getRelativeDayGroup(new Date(tx.at));
      const bucket = groups.get(key) ?? [];
      bucket.push(tx);
      groups.set(key, bucket);
    }

    const labelFor = (key: RelativeDayGroup) => {
      if (key === 'today') {
        return t('ui.piggy.dayToday');
      }
      if (key === 'yesterday') {
        return t('ui.piggy.dayYesterday');
      }
      return t('ui.piggy.dayEarlier');
    };

    return GROUP_ORDER.filter((key) => groups.has(key)).map((key) => ({
      key,
      label: labelFor(key),
      items: groups.get(key) ?? [],
    }));
  }, [demo.transactions, t]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareFeedback('copied');
      window.setTimeout(() => setShareFeedback(null), 2000);
    } catch {
      // clipboard unavailable in some demo contexts
    }
  }

  async function handleShareLink() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('ui.piggy.shareTitle'),
          text: t('ui.piggy.shareText'),
          url: `https://${shareUrl}`,
        });
        setShareFeedback('shared');
        window.setTimeout(() => setShareFeedback(null), 2000);
        return;
      } catch {
        // user dismissed share sheet
      }
    }

    await handleCopyLink();
  }

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle titleKey="ui.home.piggy" backTo="/child" />
      <div className="space-y-5 px-4 py-4">
        <section className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center text-primary">
            <PiggyIcon />
          </div>
          <p className="mt-3 font-heading text-4xl font-semibold tracking-tight text-text">
            {formatCurrency(demo.piggy.balance, locale)}
          </p>
          <p className="mt-1 text-sm text-text-muted">{t('ui.piggy.totalSaved')}</p>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTransferMode('toPiggy')}
            className="rounded-full border border-primary bg-surface py-3 text-sm font-semibold text-primary"
          >
            {t('ui.piggy.depositFromCard')}
          </button>
          <button
            type="button"
            onClick={() => setTransferMode('toCard')}
            className="rounded-full border border-border bg-surface py-3 text-sm font-semibold text-text"
          >
            {t('ui.piggy.withdrawToCard')}
          </button>
        </div>

        {transferFeedback === 'deposit' ? (
          <p className="rounded-card border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
            {t('ui.piggy.depositDone')}
          </p>
        ) : null}
        {transferFeedback === 'withdraw' ? (
          <p className="rounded-card border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
            {t('ui.piggy.withdrawDone')}
          </p>
        ) : null}
        {transferFeedback === 'insufficient' ? (
          <p className="rounded-card border border-border bg-surface px-4 py-3 text-sm text-text-muted">
            {t('ui.piggy.insufficient')}
          </p>
        ) : null}

        <section className="rounded-card bg-gradient-to-br from-accent-kids via-orange-300 to-amber-200 p-5 text-amber-950 shadow-md">
          <h2 className="font-heading text-base font-semibold">{t('ui.piggy.linkTitle')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-amber-950/85">{t('ui.piggy.linkHint')}</p>

          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/75 px-3 py-2.5">
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-text">{shareUrl}</p>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm"
              aria-label={t('ui.piggy.copyLink')}
            >
              <CopyIcon />
            </button>
          </div>

          <button
            type="button"
            onClick={handleShareLink}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-semibold text-text shadow-sm"
          >
            <ShareIcon />
            {t('ui.piggy.shareLink')}
          </button>

          {shareFeedback === 'copied' ? (
            <p className="mt-2 text-center text-xs font-medium text-amber-950/80">
              {t('ui.piggy.copied')}
            </p>
          ) : null}
          {shareFeedback === 'shared' ? (
            <p className="mt-2 text-center text-xs font-medium text-amber-950/80">
              {t('ui.piggy.shared')}
            </p>
          ) : null}
        </section>

        <section>
          <h2 className="mb-3 font-heading text-base font-semibold text-text">
            {t('ui.piggy.deposits')}
          </h2>
          {groupedDeposits.length > 0 ? (
            <div className="space-y-4">
              {groupedDeposits.map((group) => (
                <div key={group.key} className="space-y-2">
                  <p className="px-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    {group.label}
                  </p>
                  {group.items.map((tx) => (
                    <PiggyDepositRow key={tx.id} transaction={tx} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-border bg-surface p-5">
              <p className="text-sm leading-relaxed text-text-muted">{t('ui.piggy.empty')}</p>
            </div>
          )}
        </section>
      </div>

      {transferMode ? (
        <PiggyTransferModal
          mode={transferMode}
          open
          onClose={() => setTransferMode(null)}
          onSuccess={() => setTransferFeedback(transferMode === 'toPiggy' ? 'deposit' : 'withdraw')}
          onInsufficient={() => {
            setTransferMode(null);
            setTransferFeedback('insufficient');
          }}
        />
      ) : null}
    </div>
  );
}

function PiggyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 8.2c.4-.3.7-.8.7-1.4 0-.9-.8-1.6-1.7-1.6-.5 0-1 .2-1.3.6C13.2 5.3 12.6 5 12 5c-3.4 0-6.2 2.5-6.8 5.8H4.5A1.5 1.5 0 0 0 3 12.3V14a1 1 0 0 0 1 1h.6c.4 1.8 1.8 3.3 3.6 4v1.2a.8.8 0 0 0 .8.8h1.2a.8.8 0 0 0 .8-.8V19h2.2v1.2a.8.8 0 0 0 .8.8h1.2a.8.8 0 0 0 .8-.8V19c1.5-.6 2.6-1.8 3.2-3.3.8-.2 1.8-1.1 1.8-2.4 0-1-.6-1.8-1.4-2.2V11c0-1.2-.8-2.2-1.8-2.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M7 15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.2 11 15.8 7M8.2 13l7.6 4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
