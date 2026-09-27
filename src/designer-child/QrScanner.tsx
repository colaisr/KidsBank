import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CircleNotch } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { DemoMerchantQrGraphic } from '../components/child-young/DemoMerchantQrGraphic';
import {
  YOUNG_QR_PAY_AMOUNT,
  YOUNG_QR_PAY_MERCHANT_KEY,
  YOUNG_QR_SCAN_MS,
} from '../data/youngQrPay';
import MoneyAmount from './MoneyAmount';
import { useDesignerChildT } from './useDesignerChildT';

type Payment = { merchant: string; amount: number };
type Props = {
  stage: string;
  merchant: string;
  amount: number;
  error: string | null;
  onRecognized(payment: Payment): void;
  onReset(): void;
  onPay(): void;
};

/** Demo QR scan — same as young 6–8: faux viewfinder, no real camera. */
export default function QrScanner({
  stage,
  merchant,
  amount,
  error,
  onRecognized,
  onReset,
  onPay,
}: Props) {
  const { t: tRoot } = useTranslation();
  const { t } = useDesignerChildT();
  const callback = useRef(onRecognized);
  const stageRef = useRef(stage);
  const [scanGeneration, setScanGeneration] = useState(0);
  const reduced = useReducedMotion();
  const scanning = stage === 'camera';
  stageRef.current = stage;
  const sheet = stage === 'confirm' || stage === 'processing';

  callback.current = onRecognized;

  useEffect(() => {
    if (!scanning) {
      return;
    }
    const demoPayment: Payment = {
      merchant: tRoot(`demo.merchants.${YOUNG_QR_PAY_MERCHANT_KEY}`),
      amount: YOUNG_QR_PAY_AMOUNT,
    };
    const timer = window.setTimeout(() => {
      if (stageRef.current === 'camera') {
        callback.current(demoPayment);
      }
    }, YOUNG_QR_SCAN_MS);
    return () => window.clearTimeout(timer);
  }, [scanning, scanGeneration, tRoot]);

  function restartScan() {
    setScanGeneration((n) => n + 1);
    onReset();
  }

  return (
    <div className="scanner-fullscreen">
      <div className="scanner-video scanner-demo-feed" aria-hidden="true">
        <div className="scanner-demo-vignette" />
      </div>
      <div className="scanner-shade" />
      {!sheet && (
        <>
          <div className="scanner-target" aria-hidden="true">
            <div className="scanner-demo-qr">
              <DemoMerchantQrGraphic />
            </div>
            <i />
            <i />
            <i />
            <i />
            {scanning && <span className="scanner-sweep" />}
          </div>
          <div className="scanner-guidance" aria-live="polite">
            <p className="sr-only">{tRoot('ui.childYoung.qrPay.scanningA11y')}</p>
            <h2>{tRoot('ui.childYoung.qrPay.scanTitle')}</h2>
            <p>{tRoot('ui.childYoung.qrPay.scanHint')}</p>
            <button type="button" onClick={restartScan}>
              {tRoot('ui.childYoung.qrPay.cameraAria')}
            </button>
          </div>
        </>
      )}
      <AnimatePresence>
        {sheet && (
          <motion.div
            className="scanner-sheet"
            initial={{ y: reduced ? 0 : 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduced ? 0 : 32, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="scanner-sheet-handle" />
            <h2>
              {stage === 'processing'
                ? tRoot('ui.childYoung.qrPay.paying')
                : tRoot('ui.childYoung.qrPay.confirmTitle')}
            </h2>
            <dl>
              <div>
                <dt>{tRoot('ui.childYoung.qrPay.merchantLabel')}</dt>
                <dd>{merchant}</dd>
              </div>
              <div>
                <dt>{tRoot('ui.childYoung.qrPay.amountLabel')}</dt>
                <dd>
                  <MoneyAmount value={amount} />
                </dd>
              </div>
            </dl>
            {error && (
              <p role="alert" className="payment-error">
                {error === 'insufficient'
                  ? tRoot('ui.childYoung.qrPay.errors.insufficient')
                  : error === 'limit'
                    ? tRoot('ui.childYoung.qrPay.errors.limit')
                    : t('payment.insufficient')}
              </p>
            )}
            <div className="scanner-sheet-actions">
              <button
                type="button"
                className="payment-cta"
                disabled={stage === 'processing'}
                onClick={onPay}
              >
                {stage === 'processing' ? (
                  <CircleNotch className="spinner" size={22} />
                ) : (
                  tRoot('ui.childYoung.qrPay.confirm')
                )}
              </button>
              <button
                type="button"
                className="ui-cancel"
                disabled={stage === 'processing'}
                onClick={restartScan}
              >
                {tRoot('ui.childYoung.qrPay.cancel')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
