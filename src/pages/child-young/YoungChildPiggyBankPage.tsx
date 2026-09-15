import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PiggyDepositRow } from '../../components/PiggyDepositRow';
import { PiggyTransferModal } from '../../components/PiggyTransferModal';
import { formatCurrency } from '../../lib/format';
import { LinkChainIcon, PiggyIcon, ShareIcon } from '../piggy/PiggyPageIcons';
import { usePiggyBankPageState } from '../piggy/usePiggyBankPageState';

export function YoungChildPiggyBankPage() {
  const { t } = useTranslation();
  const {
    locale,
    demo,
    shareFeedback,
    transferMode,
    transferFeedback,
    recentDeposits,
    handleShareLink,
    openTransfer,
    closeTransfer,
    onTransferSuccess,
    onTransferInsufficient,
  } = usePiggyBankPageState();

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
            {t('ui.home.piggy')}
          </h1>
        </div>
      </header>

      <div className="space-y-5 px-4 py-5">
        <section className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PiggyIcon size={40} />
          </div>
          <p className="mt-4 font-heading text-4xl font-bold tracking-tight text-text">
            {formatCurrency(demo.piggy.balance, locale)}
          </p>
          <p className="mt-1 text-sm text-text-muted">{t('ui.childYoung.piggy.alreadySaved')}</p>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => openTransfer('toPiggy')}
            className="rounded-full border border-primary bg-surface py-3 text-sm font-semibold text-primary"
          >
            {t('ui.childYoung.piggy.depositFromCard')}
          </button>
          <button
            type="button"
            onClick={() => openTransfer('toCard')}
            className="rounded-full border border-border bg-surface py-3 text-sm font-semibold text-text"
          >
            {t('ui.childYoung.piggy.withdrawToCard')}
          </button>
        </div>

        <YoungPiggyTransferFeedback feedback={transferFeedback} />

        <section className="rounded-2xl bg-gradient-to-br from-orange-400 via-orange-400 to-amber-300 p-5 text-amber-950 shadow-md">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-amber-950/90">
              <LinkChainIcon />
            </span>
            <h2 className="font-heading text-base font-semibold leading-snug">
              {t('ui.childYoung.piggy.inviteFriends')}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleShareLink}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 text-sm font-semibold text-orange-600 shadow-sm"
          >
            <ShareIcon />
            {t('ui.childYoung.piggy.shareLink')}
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
            {t('ui.childYoung.piggy.recentDeposits')}
          </h2>
          {recentDeposits.length > 0 ? (
            <div className="space-y-2">
              {recentDeposits.map((tx) => (
                <PiggyDepositRow key={tx.id} transaction={tx} variant="young" />
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-border bg-surface p-5">
              <p className="text-sm leading-relaxed text-text-muted">
                {t('ui.childYoung.piggy.empty')}
              </p>
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

function YoungPiggyTransferFeedback({
  feedback,
}: {
  feedback: 'deposit' | 'withdraw' | 'insufficient' | null;
}) {
  const { t } = useTranslation();
  if (feedback === 'deposit') {
    return (
      <p className="rounded-card border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
        {t('ui.childYoung.piggy.depositDone')}
      </p>
    );
  }
  if (feedback === 'withdraw') {
    return (
      <p className="rounded-card border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
        {t('ui.childYoung.piggy.withdrawDone')}
      </p>
    );
  }
  if (feedback === 'insufficient') {
    return (
      <p className="rounded-card border border-border bg-surface px-4 py-3 text-sm text-text-muted">
        {t('ui.childYoung.piggy.insufficient')}
      </p>
    );
  }
  return null;
}
