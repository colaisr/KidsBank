import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PiggyTransferMode } from '../../components/PiggyTransferModal';
import { useDemoState } from '../../context/DemoStateContext';
import { usePreferences } from '../../context/PreferencesContext';
import { isPiggyDeposit, type DemoTransaction } from '../../data/demoBaseline';
import { getRelativeDayGroup, type RelativeDayGroup } from '../../lib/format';
import { getPiggyShareUrl } from '../../lib/piggy';

export type ShareFeedback = 'copied' | 'shared' | null;
export type TransferFeedback = 'deposit' | 'withdraw' | 'insufficient' | null;

const GROUP_ORDER: RelativeDayGroup[] = ['today', 'yesterday', 'earlier'];

export const YOUNG_PIGGY_RECENT_LIMIT = 8;

export function usePiggyBankPageState() {
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

  const sortedDeposits = useMemo(() => {
    return demo.transactions
      .filter((tx) => isPiggyDeposit(tx.typeId))
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }, [demo.transactions]);

  const recentDeposits = useMemo(
    () => sortedDeposits.slice(0, YOUNG_PIGGY_RECENT_LIMIT),
    [sortedDeposits],
  );

  const groupedDeposits = useMemo(() => {
    const groups = new Map<RelativeDayGroup, DemoTransaction[]>();
    for (const tx of sortedDeposits) {
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
  }, [sortedDeposits, t]);

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

  function openTransfer(mode: PiggyTransferMode) {
    setTransferMode(mode);
  }

  function closeTransfer() {
    setTransferMode(null);
  }

  function onTransferSuccess(mode: PiggyTransferMode) {
    setTransferFeedback(mode === 'toPiggy' ? 'deposit' : 'withdraw');
  }

  function onTransferInsufficient() {
    setTransferMode(null);
    setTransferFeedback('insufficient');
  }

  return {
    locale,
    demo,
    shareUrl,
    shareFeedback,
    transferMode,
    transferFeedback,
    groupedDeposits,
    recentDeposits,
    handleCopyLink,
    handleShareLink,
    openTransfer,
    closeTransfer,
    onTransferSuccess,
    onTransferInsufficient,
  };
}
