import {useId, useRef, type ReactNode} from 'react';
import MoneyAmount from './MoneyAmount';
import {money} from './data';

type Props={label:string;value:number|string;presets:number[];onChange(value:string):void;editable?:boolean;disabled?:boolean;invalid?:boolean;hint?:ReactNode;children?:ReactNode};
/** Shared amount surface for payments, transfers and savings. */
export default function AmountPicker({label,value,presets,onChange,editable=false,disabled=false,invalid=false,hint,children}:Props){
  const id=useId(),input=useRef<HTMLInputElement>(null);
  return <section className="amount-panel" aria-label={label}>
    {children}
    {editable?<><label className="amount-panel-label" htmlFor={id}>{label}</label><div className="amount-panel-input"><input id={id} ref={input} inputMode="decimal" aria-invalid={invalid||undefined} autoComplete="off" value={value} placeholder="0" disabled={disabled} style={{width:`${Math.max(1,String(value).length)}ch`}} onChange={e=>onChange(e.target.value)} aria-label={`${label}, AMD`}/><span>AMD</span></div></>:<><p className="amount-panel-label">{label}</p><strong className="amount-panel-value"><MoneyAmount value={Number(value)} hero/></strong></>}
    <div className="amount-options" role="group" aria-label="Быстрая сумма">{presets.map(n=><button type="button" key={n} disabled={disabled} aria-pressed={Number(String(value).replace(',','.'))===n} className={Number(String(value).replace(',','.'))===n?'is-active':''} onClick={()=>onChange(String(n))}>{money.format(n)} AMD</button>)}</div>
    {editable&&<button type="button" className="amount-panel-custom" disabled={disabled} onClick={()=>input.current?.focus()}>Ввести другую сумму</button>}
    {hint&&<p className="amount-panel-hint">{hint}</p>}
  </section>;
}
