import StarAmount from "./StarAmount";
import { useState } from 'react';
import { BookOpen, PawPrint, House, ForkKnife, GameController, Gift } from '@phosphor-icons/react';
import { useDemo } from './DemoState';
import MoneyAmount from './MoneyAmount';
import SectionHeading from './SectionHeading';
import {money} from './data';

export function RewardIcon({name}:{name:string}) {
  const Icon=({'Учёба':BookOpen,'Питомец':PawPrint,'Дом':House,'Кухня':ForkKnife,'Игры':GameController,'Подарок':Gift} as const)[name as 'Учёба']||Gift;
  return <Icon size={26} aria-label={name}/>;
}
export default function RewardGoals() {
  const {state,selectRewardGoal,fundRewardGoal}=useDemo();
  const [funding,setFunding]=useState<string|null>(null),[amount,setAmount]=useState(''),[error,setError]=useState('');
  const active=state.rewardGoals.filter(g=>g.selected),shelf=state.rewardGoals.filter(g=>!g.selected);
  return <section className="reward-goals-child">
    <div className="goals-section-header"><SectionHeading>Коплю звёзды</SectionHeading><span>{state.stars} <img src="/assets/star.png" alt="звёзд доступно"/></span></div>
    {active.map(g=><article className="feature-panel" key={g.id}>
      <div className="reward-goal-heading"><RewardIcon name={g.icon}/><div><h2>{g.title}</h2><p className="reward-goal-value"><MoneyAmount value={g.exchange}/> при обмене</p></div></div>
      <div className="reward-goal-progress"><p className="reward-goal-count">{money.format(g.saved)} из <StarAmount value={g.target}/></p><progress aria-label={`Накоплено на ${g.title}`} value={g.saved} max={g.target}/></div>
      {funding===g.id?<form onSubmit={e=>{e.preventDefault();if(fundRewardGoal(g.id,Number(amount))){setFunding(null);setAmount('');setError('')}else setError('Укажи целое число звёзд в пределах доступного остатка и цели')}}><label>Сколько звёзд отложить<input type="number" min="1" step="1" max={Math.min(state.stars,g.target-g.saved)} value={amount} onChange={e=>setAmount(e.target.value)} required autoFocus/></label>{error&&<p role="alert" className="feature-error">{error}</p>}<button className="feature-primary">Отложить</button><button type="button" className="feature-secondary ui-cancel" onClick={()=>{setFunding(null);setError('')}}>Отмена</button></form>:<button className="feature-secondary" disabled={g.saved>=g.target||state.stars===0} onClick={()=>{setFunding(g.id);setAmount(String(Math.min(100,state.stars,g.target-g.saved)));setError('')}}>{g.saved>=g.target?'Цель достигнута!':'Отложить звёзды'}</button>}
    </article>)}
    {shelf.length>0&&<><SectionHeading>Можно выбрать</SectionHeading>{shelf.map(g=><article className="feature-panel" key={g.id}><div className="reward-goal-heading"><RewardIcon name={g.icon}/><div><h2>{g.title}</h2><p className="reward-goal-value"><MoneyAmount value={g.exchange}/> при обмене</p></div></div><button className="feature-secondary reward-goal-select" onClick={()=>selectRewardGoal(g.id)}><span>Выбрать</span><span aria-hidden="true">·</span><StarAmount value={g.target}/></button></article>)}</>}
  </section>;
}
