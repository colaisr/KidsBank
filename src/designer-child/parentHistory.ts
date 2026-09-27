import {entryDate} from './entryDate';
import { isExpense, type Entry } from './DemoState';
export function parentHistory(entries:Entry[]) {
  const fixtures=[
    {id:'sweet',title:'Оплата по QR · Sweet Shop',date:new Date(2026,8,20,13,45),amount:-180,expense:true},
    {id:'shop',title:'Продуктовый магазин',date:new Date(2026,8,19,19,10),amount:-260,expense:true},
    {id:'game',title:'Игровой автомат',date:new Date(2026,8,19,17,32),amount:-100,expense:true},
    {id:'book',title:'Книжный',date:new Date(2026,8,16,15,0),amount:-800,expense:true},
    {id:'cafe',title:'Кафе',date:new Date(2026,7,20,12,5),amount:-320,expense:true},
  ];
  const live=entries.filter(e=>e.currency==='AMD').map(e=>({id:e.id,title:e.label,date:entryDate(e,entries),amount:e.amount,expense:isExpense(e)}));
  return [...live,...fixtures].sort((a,b)=>(b.date?.getTime()||0)-(a.date?.getTime()||0));
}
export function thisMonthExpenses(entries:Entry[],now=new Date()) {
 return parentHistory(entries).filter(r=>r.expense&&r.date&&r.date.getMonth()===now.getMonth()&&r.date.getFullYear()===now.getFullYear());
}
