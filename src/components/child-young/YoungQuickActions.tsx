import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ACTIONS: {
  key: 'topUpPhone' | 'payQr' | 'transfer';
  Icon: typeof PhoneIcon;
  to?: string;
}[] = [
  { key: 'topUpPhone', Icon: PhoneIcon, to: '/child/young/phone-topup' },
  { key: 'payQr', Icon: QrIcon, to: '/child/young/qr-pay' },
  { key: 'transfer', Icon: TransferIcon },
];

export function YoungQuickActions() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-2">
      {ACTIONS.map(({ key, Icon, to }) => {
        const className =
          'flex flex-col items-center gap-1 rounded-card border border-border bg-surface px-1.5 py-2 text-center transition-colors hover:border-primary/25';
        const content = (
          <>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-primary">
              <Icon />
            </span>
            <span className="text-[10px] font-medium leading-tight text-text">
              {t(`ui.childYoung.home.quickActions.${key}`)}
            </span>
          </>
        );

        if (to) {
          return (
            <Link key={key} to={to} className={className}>
              {content}
            </Link>
          );
        }

        return (
          <button key={key} type="button" className={className}>
            {content}
          </button>
        );
      })}
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M10 6h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 17v1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75" />
      <rect x="13" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75" />
      <rect x="4" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75" />
      <path d="M13 13h3v3h-3zM16 16h4v4h-4zM13 19h3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function TransferIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 12h11M15 8l4 4-4 4M16 6H7a2 2 0 00-2 2v10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
