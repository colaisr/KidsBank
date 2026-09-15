import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { demoQrPay } from '../../context/demoActions';
import { useDemoState } from '../../context/DemoStateContext';
import { usePreferences } from '../../context/PreferencesContext';
import {
  YOUNG_QR_PAY_AMOUNT,
  YOUNG_QR_PAY_MERCHANT_KEY,
  YOUNG_QR_SCAN_MS,
} from '../../data/youngQrPay';
import { DemoMerchantQrGraphic } from '../../components/child-young/DemoMerchantQrGraphic';
import { formatCurrency } from '../../lib/format';

type QrPhase = 'scanning' | 'confirm';
type PayError = 'limit' | 'insufficient' | null;

export function YoungChildQrPayPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { locale } = usePreferences();
  const { demo, setDemo } = useDemoState();
  const [phase, setPhase] = useState<QrPhase>('scanning');
  const [error, setError] = useState<PayError>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (phase !== 'scanning') {
      return;
    }
    const timer = window.setTimeout(() => setPhase('confirm'), YOUNG_QR_SCAN_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  function restartScan() {
    setError(null);
    setPaying(false);
    setPhase('scanning');
  }

  function handleConfirmPay() {
    setError(null);
    setPaying(true);
    const result = demoQrPay(demo, YOUNG_QR_PAY_AMOUNT, YOUNG_QR_PAY_MERCHANT_KEY);
    if (result === 'limit') {
      setPaying(false);
      setError('limit');
      return;
    }
    if (result === 'insufficient') {
      setPaying(false);
      setError('insufficient');
      return;
    }
    setDemo(result);
    window.setTimeout(() => navigate('/child'), 400);
  }

  const merchantName = t(`demo.merchants.${YOUNG_QR_PAY_MERCHANT_KEY}`);
  const amountLabel = formatCurrency(YOUNG_QR_PAY_AMOUNT, locale);

  return (
    <div className="relative flex min-h-full flex-col bg-[#0c1018] text-white">
      <header className="relative z-10 px-4 pb-2 pt-3">
        <div className="flex items-center gap-3">
          <Link
            to="/child"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white"
            aria-label={t('ui.app.back')}
          >
            <span aria-hidden="true">←</span>
          </Link>
          <h1 className="min-w-0 flex-1 text-center font-heading text-lg font-semibold pr-9">
            {t('ui.childYoung.qrPay.title')}
          </h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center px-6 pb-8 pt-6">
        <div className="relative flex aspect-square w-full max-w-[280px] items-center justify-center">
          <QrViewfinder active={phase === 'scanning'} />
          {phase === 'scanning' ? (
            <p className="sr-only" aria-live="polite">
              {t('ui.childYoung.qrPay.scanningA11y')}
            </p>
          ) : null}
        </div>

        <div className="mt-8 text-center">
          <p className="font-heading text-lg font-semibold">
            {phase === 'scanning'
              ? t('ui.childYoung.qrPay.scanTitle')
              : t('ui.childYoung.qrPay.confirmTitle')}
          </p>
          <p className="mt-2 text-sm text-white/55">
            {phase === 'scanning'
              ? t('ui.childYoung.qrPay.scanHint')
              : t('ui.childYoung.qrPay.confirmHint')}
          </p>
        </div>

        <div className="mt-auto flex flex-col items-center gap-4 pt-10">
          <button
            type="button"
            onClick={restartScan}
            disabled={phase === 'scanning' && !error}
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-opacity disabled:opacity-40"
            aria-label={t('ui.childYoung.qrPay.cameraAria')}
          >
            <CameraGlyph />
          </button>
        </div>
      </div>

      {phase === 'confirm' ? (
        <div
          className="absolute inset-0 z-20 flex flex-col justify-end bg-black/55 px-4 pb-8 pt-16"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-pay-confirm-title"
        >
          <div className="rounded-2xl border border-white/10 bg-[#151b26] p-5 shadow-xl">
            <h2 id="qr-pay-confirm-title" className="font-heading text-base font-semibold">
              {t('ui.childYoung.qrPay.confirmTitle')}
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-white/55">{t('ui.childYoung.qrPay.merchantLabel')}</dt>
                <dd className="font-medium text-right">{merchantName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/55">{t('ui.childYoung.qrPay.amountLabel')}</dt>
                <dd className="font-heading text-lg font-semibold text-[#fb923c]">{amountLabel}</dd>
              </div>
            </dl>
            {error ? (
              <p className="mt-3 text-center text-sm font-medium text-red-400" role="alert">
                {t(`ui.childYoung.qrPay.errors.${error}`)}
              </p>
            ) : null}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={restartScan}
                disabled={paying}
                className="flex-1 rounded-full border border-white/20 py-3 text-sm font-semibold text-white/90"
              >
                {t('ui.childYoung.qrPay.cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmPay}
                disabled={paying}
                className="flex-1 rounded-full bg-[#ea580c] py-3 text-sm font-semibold text-white disabled:opacity-70"
              >
                {paying ? t('ui.childYoung.qrPay.paying') : t('ui.childYoung.qrPay.confirm')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function QrViewfinder({ active }: { active: boolean }) {
  const corner =
    'absolute z-10 h-10 w-10 border-[#f97316] border-solid';
  return (
    <div className="relative h-full w-full max-h-[280px] max-w-[280px]">
      <div
        className="absolute inset-[11%] overflow-hidden rounded-lg bg-white shadow-[inset_0_0_24px_rgba(0,0,0,0.35)]"
        aria-hidden="true"
      >
        <DemoMerchantQrGraphic className="scale-[1.02]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0c1018]/20 via-transparent to-[#0c1018]/30" />
      </div>
      <span className={`${corner} left-0 top-0 border-l-[3px] border-t-[3px] rounded-tl-md`} />
      <span className={`${corner} right-0 top-0 border-r-[3px] border-t-[3px] rounded-tr-md`} />
      <span className={`${corner} bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-md`} />
      <span className={`${corner} bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-md`} />
      {active ? (
        <span
          className="pointer-events-none absolute z-20 left-[12%] right-[12%] top-[18%] h-0.5 rounded-full bg-[#f97316] shadow-[0_0_12px_rgba(249,115,22,0.8)] young-qr-scan-line"
          aria-hidden="true"
        />
      ) : null}
      <style>{`
        @keyframes youngQrScan {
          0%, 100% { top: 18%; opacity: 0.85; }
          50% { top: 78%; opacity: 1; }
        }
        .young-qr-scan-line {
          animation: youngQrScan ${YOUNG_QR_SCAN_MS}ms ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function CameraGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8h3l1.5-2h7L17 8h3a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.25" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}
