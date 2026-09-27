import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import i18n from '../i18n';
import { applyDesignerPatchToKidsBank, mergeKidsBankIntoHandoffStorage } from './kidsbankDemoBridge';
import { home, type Task } from './data';
export type Goal = { id:string; title:string; target:number; saved:number };
export type Recipient = { id:string; name:string; enabled:boolean; limit:number|null; avatar?:string; dative?:string; genitive?:string };
export type RewardGoal = { id:string; title:string; target:number; saved:number; exchange:number; icon:string; selected:boolean; redeemed?:boolean };
export type Schedule = { enabled:boolean; frequency:'friday'|'monday'|'monthly'; amount:number; destination:'card'|'savings' };
export type Entry = { id:string; label:string; amount:number; currency:'AMD'|'★'; createdAt?:string; kind?:'expense'|'internal'|'income'|'reward'; recipientId?:string };
type State = { balance:number; savings:number; stars:number; parentWallet:number; tasks:Task[]; completedToday:Task[]; goals:Goal[]; entries:Entry[]; xp:number; recipients:Recipient[]; cashEnabled:boolean; cashLimit:number; schedule:Schedule; rewardGoals:RewardGoal[] };
const rewardGoals:RewardGoal[] = [
 {id:'console',title:'Приставка',saved:600,target:1500,exchange:250000,icon:'Игры',selected:true},
 {id:'shoes',title:'Кроссовки',saved:86,target:430,exchange:35000,icon:'Подарок',selected:true},
 {id:'bike',title:'Велосипед',saved:0,target:2200,exchange:120000,icon:'Подарок',selected:false},
 {id:'skate',title:'Скейтборд',saved:0,target:900,exchange:80000,icon:'Подарок',selected:false},
 {id:'book',title:'Книга',saved:0,target:150,exchange:15000,icon:'Учёба',selected:false},
 {id:'headphones',title:'Наушники',saved:0,target:1100,exchange:50000,icon:'Игры',selected:false},
];
const initial:State={balance:home.balance,savings:0,stars:home.stars,parentWallet:50000,tasks:home.tasks,completedToday:[],goals:[],entries:[],xp:0,recipients:[
 {id:'mama',name:'Мама',enabled:true,limit:null,avatar:'/assets/recipients/mama.png',dative:'маме',genitive:'мамы'},
 {id:'grandmother',name:'Бабушка',enabled:true,limit:1000,avatar:'/assets/recipients/grandmother.png',dative:'бабушке',genitive:'бабушки'},
 {id:'timur',name:'Тимур',enabled:true,limit:500,avatar:'/assets/recipients/timur.png',dative:'Тимуру',genitive:'Тимура'},
],cashEnabled:true,cashLimit:1000,schedule:{enabled:false,frequency:'friday',amount:500,destination:'card'},rewardGoals};
const newId=()=>globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random().toString(36).slice(2)}`;
const round=(n:number)=>Math.round(n*100)/100;
const validAmount=(n:number)=>Number.isFinite(n)&&n>0&&Math.abs(n*100-Math.round(n*100))<.000001;
const entry=(label:string,amount:number,currency:Entry['currency'],kind:Entry['kind'],recipientId?:string):Entry=>({id:newId(),label,amount,currency,kind,recipientId,createdAt:new Date().toISOString()});
function read():State {
 mergeKidsBankIntoHandoffStorage();
 try {const s=JSON.parse(localStorage.getItem('evoca-demo-v2')||'null');if(s&&Number.isFinite(s.balance)&&Array.isArray(s.tasks)&&Array.isArray(s.goals))return {...initial,...s,recipients:Array.isArray(s.recipients)?s.recipients:initial.recipients,rewardGoals:Array.isArray(s.rewardGoals)?s.rewardGoals:initial.rewardGoals,schedule:{...initial.schedule,...s.schedule}};}catch{}return initial;}
export function isExpense(e:Entry){return e.kind?e.kind==='expense':e.currency==='AMD'&&e.amount<0&&!/копил|мечт/i.test(e.label);}
let syncingFromDesigner=false;
function useModel(){
 const [state,setState]=useState(read);const ref=useRef(state);
 useEffect(()=>{const sync=(e:StorageEvent)=>{if(e.key!=='evoca-demo-v2')return;const next=read();ref.current=next;setState(next)};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync)},[]);
 useEffect(()=>{const onKidsBank=()=>{if(syncingFromDesigner)return;const next=read();ref.current=next;setState(next)};window.addEventListener('kidsbank-demo-updated',onKidsBank);return()=>window.removeEventListener('kidsbank-demo-updated',onKidsBank)},[]);
 useEffect(()=>{const onLang=()=>{mergeKidsBankIntoHandoffStorage();const next=read();ref.current=next;setState(next)};i18n.on('languageChanged',onLang);return()=>{i18n.off('languageChanged',onLang)}},[]);
 function update(fn:(s:State)=>State){const next=fn(ref.current);ref.current=next;setState(next);try{localStorage.setItem('evoca-demo-v2',JSON.stringify(next));}catch{}
 syncingFromDesigner=true;
 applyDesignerPatchToKidsBank({balance:next.balance,savings:next.savings,stars:next.stars,parentWallet:next.parentWallet,tasks:next.tasks,entries:next.entries,recipients:next.recipients,rewardGoals:next.rewardGoals,cashEnabled:next.cashEnabled,cashLimit:next.cashLimit});
 syncingFromDesigner=false;}
 function pay(amount:number,label:string){if(!validAmount(amount)||amount>ref.current.balance)return false;update(s=>({...s,balance:round(s.balance-amount),entries:[entry(label,-amount,'AMD','expense'),...s.entries]}));return true;}
 function recipientRemaining(id:string){const s=ref.current,r=s.recipients.find(r=>r.id===id);if(!r?.enabled)return 0;if(r.limit===null)return Infinity;const today=new Date().toDateString();return Math.max(0,r.limit-s.entries.filter(e=>e.recipientId===id&&e.createdAt&&new Date(e.createdAt).toDateString()===today).reduce((sum,e)=>sum+Math.abs(e.amount),0));}
 function transferToRecipient(amount:number,id:string){const r=ref.current.recipients.find(r=>r.id===id);if(!r?.enabled||!validAmount(amount)||amount>ref.current.balance||amount>recipientRemaining(id))return false;update(s=>({...s,balance:round(s.balance-amount),entries:[entry(r.name,-amount,'AMD','expense',id),...s.entries]}));return true;}
 function move(amount:number,withdraw=false){const s=ref.current;if(!validAmount(amount)||amount>(withdraw?Math.max(0,s.savings-s.goals.reduce((a,g)=>a+g.saved,0)):s.balance))return false;update(s=>({...s,balance:round(s.balance+(withdraw?amount:-amount)),savings:round(s.savings+(withdraw?-amount:amount)),entries:[entry(withdraw?'Из копилки на карту':'В копилку',withdraw?-amount:amount,'AMD','internal'),...s.entries]}));return true;}
 function parentTransfer(amount:number,toSavings=false){if(!validAmount(amount)||amount>ref.current.parentWallet)return false;update(s=>({...s,parentWallet:round(s.parentWallet-amount),balance:toSavings?s.balance:round(s.balance+amount),savings:toSavings?round(s.savings+amount):s.savings,entries:[entry(toSavings?'От родителя в копилку':'Перевод от родителя',amount,'AMD','income'),...s.entries]}));return true;}
 function approveTask(id:string){const task=ref.current.tasks.find(t=>t.id===id&&t.status==='waitingParent');if(!task)return false;update(s=>({...s,stars:s.stars+task.reward,tasks:s.tasks.filter(t=>t.id!==id),completedToday:[task,...s.completedToday],entries:[entry(`Задание: ${task.title}`,task.reward,'★','reward'),...s.entries]}));return true;}
 function saveTask(title:string,reward:number,deadline:string,id?:string){if(!title.trim()||!Number.isInteger(reward)||reward<=0||!/^([01]\d|2[0-3]):[0-5]\d$/.test(deadline))return false;if(id&&!ref.current.tasks.some(t=>t.id===id))return false;update(s=>({...s,tasks:id?s.tasks.map(t=>t.id===id?{...t,title:title.trim(),reward,deadline}:t):[...s.tasks,{id:newId(),title:title.trim(),reward,deadline,status:'open'}]}));return true;}
 function addRewardGoal(title:string,target:number,exchange:number,icon:string){if(!title.trim()||!Number.isInteger(target)||target<=0||!validAmount(exchange))return false;update(s=>({...s,rewardGoals:[...s.rewardGoals,{id:newId(),title:title.trim(),target,saved:0,exchange,icon,selected:false}]}));return true;}
 return {state,pay,move,parentTransfer,approveTask,addTask:saveTask,saveTask,recipientRemaining,transferToRecipient,addRewardGoal,
 cancelTask:(id:string)=>update(s=>({...s,tasks:s.tasks.filter(t=>t.id!==id)})),
 setRecipientEnabled:(id:string,enabled:boolean)=>update(s=>({...s,recipients:s.recipients.map(r=>r.id===id?{...r,enabled}:r)})),
 addRecipient:(name:string,limit:number|null)=>{if(!name.trim()||(limit!==null&&(!validAmount(limit))))return false;update(s=>({...s,recipients:[...s.recipients,{id:newId(),name:name.trim(),limit,enabled:true}]}));return true;},
 setCashEnabled:(cashEnabled:boolean)=>update(s=>({...s,cashEnabled})),setCashLimit:(cashLimit:number)=>update(s=>({...s,cashLimit:Math.max(0,Math.min(3000,cashLimit))})),
 saveSchedule:(schedule:Schedule)=>{if(!validAmount(schedule.amount))return false;update(s=>({...s,schedule}));return true;},
 selectRewardGoal:(id:string)=>update(s=>({...s,rewardGoals:s.rewardGoals.map(g=>g.id===id?{...g,selected:true}:g)})),
 fundRewardGoal:(id:string,amount:number)=>{const s=ref.current,g=s.rewardGoals.find(g=>g.id===id);if(!g?.selected||g.redeemed||!Number.isInteger(amount)||amount<=0||amount>s.stars||amount>g.target-g.saved)return false;update(s=>({...s,stars:s.stars-amount,rewardGoals:s.rewardGoals.map(g=>g.id===id?{...g,saved:g.saved+amount}:g),entries:[entry(`На цель: ${g.title}`,-amount,'★','internal'),...s.entries]}));return true;},
 toggleTask:(id:string,checked:boolean)=>update(s=>({...s,tasks:s.tasks.map(t=>t.id===id?{...t,status:checked?'waitingParent':'open'}:t)})),
 addGoal:(title:string,target:number)=>update(s=>({...s,goals:[...s.goals,{id:newId(),title,target,saved:0}]})),
 fundGoal:(id:string,amount:number)=>{const s=ref.current,g=s.goals.find(g=>g.id===id);if(!g||!validAmount(amount)||amount>s.balance||amount>g.target-g.saved)return false;update(s=>({...s,balance:round(s.balance-amount),savings:round(s.savings+amount),entries:[entry(`В копилку: ${g.title}`,amount,'AMD','internal'),...s.entries],goals:s.goals.map(g=>g.id===id?{...g,saved:round(g.saved+amount)}:g)}));return true;},
 petAction:(cost=0)=>{if(ref.current.stars<cost)return false;update(s=>({...s,xp:s.xp+10,stars:s.stars-cost}));return true;},reset:()=>update(()=>initial)};
}
const Context=createContext<ReturnType<typeof useModel>|null>(null);
export function DemoProvider({children}:{children:ReactNode}){const value=useModel();return <Context.Provider value={value}>{children}</Context.Provider>}
export function useDemo(){const value=useContext(Context);if(!value)throw Error('DemoProvider missing');return value;}
