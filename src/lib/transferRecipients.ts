import type { DemoTransferRecipient, DemoTransferRecipientTone } from '../data/demoBaseline';

export const TRANSFER_AVATAR_TONE_CLASS: Record<DemoTransferRecipientTone, string> = {
  primary: 'bg-primary/15 text-primary',
  warm: 'bg-accent-secondary/15 text-accent-secondary',
  sky: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
};

export const TRANSFER_AVATAR_RING_CLASS: Record<DemoTransferRecipientTone, string> = {
  primary: 'ring-primary',
  warm: 'ring-accent-secondary',
  sky: 'ring-sky-500',
};

type Translate = (key: string) => string;

export function transferRecipientDisplayName(
  recipient: DemoTransferRecipient,
  t: Translate,
): string {
  if (recipient.customName) {
    return recipient.customName;
  }
  return recipient.nameKey ? t(recipient.nameKey) : '';
}

/** For «Сумма для …» (genitive in ru). */
export function transferRecipientAmountForName(
  recipient: DemoTransferRecipient,
  t: Translate,
): string {
  if (recipient.customName) {
    return recipient.customName;
  }
  const genitiveKey = `demo.limits.recipient.${recipient.id}Genitive`;
  const translated = t(genitiveKey);
  if (translated !== genitiveKey) {
    return translated;
  }
  return transferRecipientDisplayName(recipient, t);
}

/** For «Перевести …» (dative in ru). */
export function transferRecipientDativeName(
  recipient: DemoTransferRecipient,
  t: Translate,
): string {
  if (recipient.customName) {
    return recipient.customName;
  }
  const dativeKey = `demo.limits.recipient.${recipient.id}Dative`;
  const translated = t(dativeKey);
  if (translated !== dativeKey) {
    return translated;
  }
  return transferRecipientDisplayName(recipient, t);
}

export function enabledTransferRecipients(
  recipients: DemoTransferRecipient[],
): DemoTransferRecipient[] {
  return recipients.filter((recipient) => recipient.enabled);
}
