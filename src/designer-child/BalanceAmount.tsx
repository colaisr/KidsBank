import MoneyAmount from './MoneyAmount';
export default function BalanceAmount({value}:{value:number}) {
  return <MoneyAmount value={value} animated hero/>;
}
