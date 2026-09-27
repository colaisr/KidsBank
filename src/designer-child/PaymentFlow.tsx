import {childScreenMotion} from "./childMotion";
import AmountPicker from "./AmountPicker";
import HeaderBlur from "./HeaderBlur";
import { useDemo, type Recipient } from "./DemoState";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretLeft, Phone, WarningCircle } from "@phosphor-icons/react";
import useDialogFocus from "./useDialogFocus";
import "./payment-flow.css";
import QrScanner from "./QrScanner";
import MoneyAmount from "./MoneyAmount";
import RecipientAvatar from "./RecipientAvatar";
import { useDesignerChildT } from "./useDesignerChildT";
import { useTranslation } from "react-i18next";

export type PaymentKind = "phone" | "qr" | "transfer";
type Props = { kind: PaymentKind; balance: number; onPay: (amount: number, label: string) => boolean; onClose: () => void };
type Stage = "camera" | "form" | "scanning" | "confirm" | "processing";
export default function PaymentFlow({ kind, balance, onPay, onClose }: Props) {
  const reduce = useReducedMotion(), dialog = useDialogFocus();
  const { t } = useDesignerChildT();
  const { t: tRoot } = useTranslation();
  const {state,recipientRemaining,transferToRecipient}=useDemo();
  const recipients=state.recipients.filter(r=>r.enabled);
  const qr = kind === "qr";
  const [stage, setStage] = useState<Stage>(qr ? "camera" : "form");
  const [amount, setAmount] = useState(kind === "transfer" ? 300 : 1000);
  const [recipientId,setRecipientId]=useState(recipients[0]?.id);
  const recipient=recipients.findIndex(r=>r.id===recipientId);
  const selected=recipients[recipient];
  useEffect(()=>{if(!selected)setRecipientId(recipients[0]?.id)},[selected,recipients]);
  const [error, setError] = useState<"limit" | "insufficient" | "recipientLimit" | null>(null);
  const timer = useRef<number | null>(null), paid = useRef(false);
  const [qrPayment,setQrPayment]=useState({merchant:"",amount:0});
  const activeAmount = qr ? qrPayment.amount : amount;
  const title = qr ? t('payment.qrTitle') : kind === "phone" ? t('payment.phoneTitle') : t('payment.transferTitle');
  const phoneNumber = tRoot('demo.child.david.phone');
  const clear = () => { if (timer.current !== null) { window.clearTimeout(timer.current); timer.current = null; } };
  useEffect(() => clear, []);
  const submit = () => {
    if (paid.current) return;
    if (!Number.isFinite(activeAmount) || activeAmount <= 0 || activeAmount > balance) { setError("insufficient"); return; }
    if (kind === "transfer" && (!selected || activeAmount > recipientRemaining(selected.id))) { setError("recipientLimit"); return; }
    paid.current = true; setStage("processing");
    timer.current = window.setTimeout(() => {
      timer.current = null;
      const label = qr
        ? `QR · ${qrPayment.merchant}`
        : kind === "phone"
          ? `${t('payment.myNumber')} ${phoneNumber}`
          : selected?.name || t('payment.transferTitle');
      if (kind === "transfer" ? selected && transferToRecipient(activeAmount, selected.id) : onPay(activeAmount, label)) onClose();
      else { paid.current = false; setError("limit"); setStage(qr ? "confirm" : "form"); }
    }, reduce ? 0 : 400);
  };
  const back = () => { if (stage === "processing") return; if (qr && stage === "confirm") { setError(null); setStage("camera"); } else onClose(); };
  return <motion.section ref={dialog} onKeyDown={event => { if (event.key === "Escape") back(); }} className={`payment-flow ${qr ? "payment-flow--qr" : ""}`} role="dialog" aria-modal="true" aria-labelledby="payment-title" {...childScreenMotion(reduce)}>
    <header className="payment-header"><HeaderBlur/><button type="button" className="payment-back" aria-label={t('common.back')} onClick={back} disabled={stage === "processing"}><CaretLeft size={22} weight="bold" /></button><h1 id="payment-title" tabIndex={-1}>{title}</h1></header>

    <AnimatePresence mode="wait" initial={false}>{qr ? <QrScanner stage={stage} merchant={qrPayment.merchant} amount={activeAmount} error={error} onRecognized={payment=>{setQrPayment(payment);setError(null);setStage("confirm")}} onReset={()=>{setError(null);setStage("camera")}} onPay={submit} /> : <SimpleScreen available={kind==='transfer'&&selected?Math.min(balance,recipientRemaining(selected.id)):balance} recipients={recipients} busy={stage === "processing"} kind={kind} amount={amount} recipient={recipient} error={error} onAmount={value => { setAmount(value); setError(null); }} onRecipient={value => { setRecipientId(recipients[value]?.id); setError(null); }} onPay={submit} />}</AnimatePresence>
  </motion.section>;
}

function SimpleScreen({ recipients, available, busy, kind, amount, recipient, error, onAmount, onRecipient, onPay }: { recipients:Recipient[]; available:number; busy:boolean; kind: "phone" | "transfer"; amount: number; recipient: number; error: string | null; onAmount(value: number): void; onRecipient(value: number): void; onPay(): void }) {
  const { t } = useDesignerChildT();
  const { t: tRoot } = useTranslation();
  const transfer = kind === "transfer", selected = recipients[recipient], presets = transfer ? [100, 300, 500] : [500, 1000, 2000];
  const amountPanel=<AmountPicker label={transfer?t('payment.transferAmount'):t('payment.topUpAmount')} value={amount} presets={presets} disabled={busy} onChange={v=>onAmount(Number(v))} hint={<>{transfer?t('common.available'):t('common.onCard')} <MoneyAmount value={available}/></>}/>;
  const actions=<div className="transfer-footer">{error&&<Error type={error}/>}<button type="button" className="payment-cta" disabled={busy} onClick={onPay}>{busy?t('common.busy'):transfer?(selected?.name?t('common.transferTo',{name:selected.name}):t('common.transfer')):t('common.topUp')}</button></div>;
  if(transfer&&!selected)return <div className="payment-content"><h2>{t('payment.noRecipientsTitle')}</h2><p className="payment-hint">{t('payment.noRecipientsHint')}</p></div>;
  if(transfer)return <motion.div key="transfer" className="payment-content payment-content--transfer">
    <section className="transfer-recipients" aria-label={t('payment.recipientSection')}><h2>{t('payment.recipientSection')}</h2><div className="recipient-list">{recipients.map((item,index)=><button type="button" key={item.id} disabled={busy} aria-pressed={recipient===index} className={`recipient ${recipient===index?'is-selected':''}`} onClick={()=>onRecipient(index)}><RecipientAvatar name={item.name} avatar={item.avatar}/><span>{item.name}</span></button>)}</div></section>
    {amountPanel}{actions}
  </motion.div>;
  return <motion.div key="phone" className="payment-content payment-content--transfer payment-content--phone">
    <div className="phone-number"><span><Phone size={23} weight="duotone"/></span><div><small>{t('payment.myNumber')}</small><strong>{tRoot('demo.child.david.phone')}</strong></div></div>
    {amountPanel}{actions}
  </motion.div>;
}

function Error({ type }: { type: string }) {
  const { t } = useDesignerChildT();
  return <p className="payment-error" role="alert"><WarningCircle size={17} weight="fill" />{type === "insufficient" ? t('payment.insufficient') : type === "recipientLimit" ? t('payment.recipientLimit') : t('payment.cardLimit')}</p>;
}
