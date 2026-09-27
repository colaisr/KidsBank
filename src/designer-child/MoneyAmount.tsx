import AnimatedNumber from './AnimatedNumber';
import {money} from './data';

/** One amount/unit layout for balances, history, reports and payment summaries. */
export default function MoneyAmount({value,signed=false,animated=false,hero=false}:{value:number;signed?:boolean;animated?:boolean;hero?:boolean}) {
  const amount=signed?Math.abs(value):value;
  return <span className={`money-value${hero?' money-value--hero':''}`}>
    <span className="money-number">{signed?(value<0?'−':'+'):''}{animated?<AnimatedNumber value={amount} decimals={Number.isInteger(amount)?0:2}/>:money.format(amount)}</span>
    <span className="money-unit">AMD</span>
  </span>;
}
