import { useTranslation } from 'react-i18next';
import { ChildPageTitle } from '../components/ChildPageTitle';
import { PiggyDepositRow } from '../components/PiggyDepositRow';
import { PiggyTransferModal } from '../components/PiggyTransferModal';
import { formatCurrency } from '../lib/format';
import { CopyIcon, PiggyIcon, ShareIcon } from './piggy/PiggyPageIcons';
import { usePiggyBankPageState } from './piggy/usePiggyBankPageState';

export function TeenChildPiggyBankPage() {
  const { t } = useTranslation();
  const {
    locale,
    demo,
    shareUrl,
    shareFeedback,
    transferMode,
    transferFeedback,
    groupedDeposits,
    handleCopyLink,
    handleShareLink,
    openTransfer,
    closeTransfer,
    onTransferSuccess,
    onTransferInsufficient,
  } = usePiggyBankPageState();

  return (
    <div className="flex min-h-full flex-col bg-surface-muted">
      <ChildPageTitle titleKey="ui.home.piggy" backTo="/child" presenterId="child-piggy" />
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
            onClick={() => openTransfer('toPiggy')}
            className="rounded-full border border-primary bg-surface py-3 text-sm font-semibold text-primary"
          >
            {t('ui.piggy.depositFromCard')}
          </button>
          <button
            type="button"
            onClick={() => openTransfer('toCard')}
            className="rounded-full border border-border bg-surface py-3 text-sm font-semibold text-text"
          >
            {t('ui.piggy.withdrawToCard')}
          </button>
        </div>

        <PiggyTransferFeedback feedback={transferFeedback} />

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
          onClose={closeTransfer}
          onSuccess={() => onTransferSuccess(transferMode)}
          onInsufficient={onTransferInsufficient}
        />
      ) : null}
    </div>
  );
}

function PiggyTransferFeedback({
  feedback,
}: {
  feedback: 'deposit' | 'withdraw' | 'insufficient' | null;
}) {
  const { t } = useTranslation();
  if (feedback === 'deposit') {
    return (
      <p className="rounded-card border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
        {t('ui.piggy.depositDone')}
      </p>
    );
  }
  if (feedback === 'withdraw') {
    return (
      <p className="rounded-card border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
        {t('ui.piggy.withdrawDone')}
      </p>
    );
  }
  if (feedback === 'insufficient') {
    return (
      <p className="rounded-card border border-border bg-surface px-4 py-3 text-sm text-text-muted">
        {t('ui.piggy.insufficient')}
      </p>
    );
  }
  return null;
}
