import AmountPicker from "./AmountPicker";
import {RewardIcon} from "./RewardGoals";
import StarAmount from "./StarAmount";
import RecipientAvatar from "./RecipientAvatar";
import SectionHeading from "./SectionHeading";
import SpendingChart, {spendingColors} from "./SpendingChart";
import ParentServiceArtwork from "./ParentServiceArtwork";
import CardVisual, {readCardDesign} from "./CardVisual";
import { createPortal } from "react-dom";
import { lazy, Suspense, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  CaretLeft,
  CaretRight,
  Check,
  ClipboardText,
  DownloadSimple,
  GearSix,
  Minus,
  Plus,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import HeaderBlur from "./HeaderBlur";
import ProgressiveBlur from "./ProgressiveBlur";
import AmbientBackground from "./AmbientBackground";
import ChildAvatar from "./ChildAvatar";
import {home,money} from "./data";
import MoneyAmount from "./MoneyAmount";
import { useDemo } from "./DemoState";
import useDialogFocus from "./useDialogFocus";
import { parentHistory, thisMonthExpenses } from "./parentHistory";
import {savedPlaces,paymentPlaces,type ParentPlace} from "./parentPlaces";
import "./parent.css";
const ParentLocationMap=lazy(()=>import("./ParentLocationMap"));

type ParentRoute = "home" | "geolocation" | "transfer" | "limits" | "tasks" | "reports" | "spending-history" | "goals";

const routeTitles: Record<Exclude<ParentRoute, "home">, string> = {
  geolocation: "Где Давид",
  transfer: "Перевод Давиду",
  limits: "Лимиты",
  tasks: "Задания",
  reports: "Отчёты",
  "spending-history": "История трат",
  goals: "Цели",
};

const readRoute = (): ParentRoute => {
  const value = location.pathname.split("/").filter(Boolean)[1];
  return value && value in routeTitles ? value as ParentRoute : "home";
};

export default function ParentApp() {
  const reduce = useReducedMotion();
  const [route, setRoute] = useState<ParentRoute>(readRoute);
  const [homeSettled, setHomeSettled] = useState(() => readRoute() === 'home');
  useEffect(() => { if (route !== 'home') setHomeSettled(false); }, [route]);
  useEffect(() => {
    const sync = () => setRoute(readRoute());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const open = (next: ParentRoute) => {
    history.pushState({ parentRoute: next }, "", next === "home" ? "/parent" : `/parent/${next}`);
    setRoute(next);
  };
  const back = () => {
    if (route === "home") return;
    if (history.state?.parentRoute) history.back();
    else {
      history.replaceState(null, "", "/parent");
      setRoute("home");
    }
  };
  return (
    <div className="phone-shell parent-shell" data-home={route === 'home'}>
      <ParentHome onOpen={open} active={route === 'home'} backgroundPaused={!homeSettled} />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => {if(route === 'home')setHomeSettled(true)}}>
        {route !== "home" && (
          <motion.section
            key={route}
            className="parent-detail"
            initial={reduce ? false : { x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ParentHeader title={routeTitles[route]} onBack={back} />
            <div className="parent-detail-body">
              {route === "geolocation" && <GeolocationScreen />}
              {route === "transfer" && <TransferScreen />}
              {route === "limits" && <LimitsScreen />}
              {route === "tasks" && <ParentTasksScreen />}
              {route === "reports" && <ReportsScreen />}
              {route === "spending-history" && <SpendingHistoryScreen />}
              {route === "goals" && <ParentGoalsScreen />}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function ParentHeader({ title, onBack }: { title: string; onBack(): void }) {
  return (
    <header className="parent-detail-header">
      <HeaderBlur />
      <button type="button" className="parent-back" onClick={onBack} aria-label="Назад"><CaretLeft size={24}  weight="bold"/></button>
      <h1>{title}</h1>
      <span />
    </header>
  );
}

const services = [
  { id: "geolocation", title: "Геолокация", description: "В школе" },
  { id: "transfer", title: "Перевод", description: "На карту или в копилку" },
  { id: "limits", title: "Лимиты", description: "Переводы и наличные" },
  { id: "tasks", title: "Задания", description: "" },
  { id: "reports", title: "Отчёты", description: "Траты по категориям" },
  { id: "spending-history", title: "История трат", description: "" },
  { id: "goals", title: "Цели", description: "" },
] as const;

function ParentHome({ onOpen, active, backgroundPaused }: { onOpen(route: ParentRoute): void; active: boolean; backgroundPaused: boolean }) {
  const { state } = useDemo();
  const pending = state.tasks.filter(task => task.status === "waitingParent").length;
  const taskWord = pending % 100 >= 11 && pending % 100 <= 14 ? 'заданий' : pending % 10 === 1 ? 'задание' : pending % 10 >= 2 && pending % 10 <= 4 ? 'задания' : 'заданий';
  const [cardDesign, setCardDesign] = useState(readCardDesign);
  useEffect(() => {
    const sync = (event: StorageEvent) => {if(event.key === 'evoca-card-design' || event.key === null)setCardDesign(readCardDesign())};
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const [childrenOpen, setChildrenOpen] = useState(false);
  return (
    <main className="parent-home" inert={!active} aria-hidden={!active || undefined}>
      <AmbientBackground active paused={childrenOpen || !active || backgroundPaused}/>
      <header className="parent-hero" data-background-paused={childrenOpen || !active || backgroundPaused}>
        <div className="parent-child-header">
          <button type="button" className="parent-child-row" onClick={()=>setChildrenOpen(true)} aria-label="Выбрать ребёнка">
            <ChildAvatar/>
            <span className="parent-child-copy"><b>{home.name}</b><CaretRight size={17} weight="bold" aria-hidden="true"/></span>
          </button>
          <span className="parent-child-settings" aria-hidden="true"><GearSix size={21} weight="fill"/></span>
        </div>
        <div className="parent-summary-grid">
          <section className="parent-account-summary" aria-label="Карта ребёнка">
            <div className="parent-account-top">
              <div className="parent-account-balance"><span>На карте</span><strong>{money.format(state.balance)}</strong></div>
              <div className="parent-card-preview" role="img" aria-label={`Карта Давида, дизайн «${cardDesign}», заканчивается на 1112`}><CardVisual design={cardDesign}/></div>
            </div>
            <button type="button" className="parent-account-transfer" onClick={()=>onOpen('transfer')}>Перевести</button>
          </section>
          <section className="parent-pending-summary" aria-label="Задания">
            <span className="parent-pending-art" aria-hidden="true"><img src="/assets/parent-services-3d/tasks-clipboard-neutral.png" alt=""/></span>
            <div className="parent-pending-copy"><small>{pending > 0 ? 'Нужно подтвердить' : 'Задания'}</small><strong>{pending > 0 ? `${pending} ${taskWord}` : 'Всё проверено'}</strong></div>
            <button type="button" className="parent-pending-action" onClick={()=>onOpen('tasks')}>{pending > 0 ? 'Проверить' : 'Открыть'}</button>
          </section>
        </div>
      </header>
      <AnimatePresence>{childrenOpen && <ParentSheet title="Дети" onClose={() => setChildrenOpen(false)}><ParentChoice title={home.name} description={`${home.age} лет`} selected onClick={() => setChildrenOpen(false)}/><button className="parent-primary child-cabinet-link" onClick={()=>location.assign("/child")}>Открыть кабинет ребёнка<CaretRight size={20} weight="bold"/></button></ParentSheet>}</AnimatePresence>
      <div className="parent-home-content">
        <section className="parent-services" aria-label="Сервисы">
          <div className="parent-service-list">
            {services.filter(({id})=>id !== 'transfer' && id !== 'tasks').map(({ id, title, description }) => (
              <button
                type="button"
                key={id}
                className="parent-service"
                onClick={() => onOpen(id)}
              >
                <span className="parent-service-icon"><ParentServiceArtwork name={id}/></span>
                <span className="parent-service-copy"><b>{title}</b>{(id==="limits"||description)&&<small>{id==="limits"?(state.cashEnabled?`Наличные · ${money.format(state.cashLimit)} AMD в день`:"Снятие наличных отключено"):description}</small>}</span>
                <span className="parent-service-end">
                  <CaretRight className="parent-service-chevron" size={20} aria-hidden="true"  weight="bold"/>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function DailyExpenseBars({expenses}:{expenses:ReturnType<typeof thisMonthExpenses>}) {
  const now = new Date();
  const dayCount = now.getDate();
  const values = Array.from({length:dayCount},(_,index)=>expenses.filter(row=>row.date?.getDate()===index+1).reduce((sum,row)=>sum+Math.abs(row.amount),0));
  const total = values.reduce((sum,value)=>sum+value,0);
  const maximum = Math.max(...values, 1);
  const month = new Intl.DateTimeFormat("ru-RU",{month:"long"}).format(now);
  const dateRange = new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long"}).format(new Date(now.getFullYear(),now.getMonth(),dayCount));
  return <section className="parent-expense-summary" aria-labelledby="parent-expense-title">
    <div className="parent-expense-copy"><span id="parent-expense-title">Потрачено в этом месяце</span><strong><MoneyAmount value={total}/></strong><small>{dayCount===1?dateRange:`1–${dateRange}`}</small></div>
    <div className="parent-expense-bars" role="img" aria-label={`Траты за ${month}: ${money.format(total)} AMD. Показаны расходы по дням с 1 по ${dayCount}.`}>
      {values.map((value,index)=><span key={index} className={`parent-expense-bar${value===0?" is-empty":""}`} style={{"--bar-height":`${value/maximum*100}%`} as CSSProperties} title={`${index+1} ${dateRange.replace(/^\d+\s/,"")}: ${money.format(value)} AMD`} />)}
    </div>
    <div className="parent-expense-axis" aria-hidden="true"><span>1</span><span>{dayCount}</span></div>
  </section>;
}

function ParentChoice({title,description,selected,navigate,onClick}:{title:string;description?:string;selected?:boolean;navigate?:boolean;onClick():void}) {
  return <button type="button" className="parent-choice" aria-pressed={selected} onClick={onClick}>
    <span className="parent-choice-copy"><b>{title}</b>{description&&<small>{description}</small>}</span>
    {selected?<span className="parent-choice-check" aria-hidden="true"><img src="/assets/marker-check.png" width="26" height="26" alt=""/></span>:navigate?<CaretRight size={20} weight="bold"/>:null}
  </button>;
}

let activeParentSheets=0;
const parentSheetInertState=new Map<HTMLElement,boolean>();
function ParentSheet({title,onClose,children}:{title:string;onClose():void;children:ReactNode}) {
  const dialog=useDialogFocus();
  const reduce=useReducedMotion();
  useEffect(()=>{activeParentSheets++;const screens=Array.from(document.querySelectorAll<HTMLElement>('.parent-shell > .parent-home,.parent-shell > .parent-detail'));screens.forEach(el=>{if(!parentSheetInertState.has(el))parentSheetInertState.set(el,el.inert);el.inert=true});return()=>{activeParentSheets--;if(activeParentSheets===0){parentSheetInertState.forEach((inert,el)=>{el.inert=el.classList.contains('parent-home')?el.parentElement?.dataset.home!=='true':inert});parentSheetInertState.clear()}}},[]);
  return createPortal(<motion.div className="parent-sheet-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,transition:{duration:reduce?0:.22}}} transition={{duration:reduce?.12:.22}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
    <motion.section ref={dialog} className="parent-sheet" role="dialog" aria-modal="true" aria-label={title} initial={{y:reduce?0:"100%"}} animate={{y:0}} exit={{y:reduce?0:"100%",transition:{duration:reduce?0:.22,ease:[.4,0,1,1]}}} transition={reduce?{duration:0}:{type:"spring",stiffness:320,damping:32,mass:1}} onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();onClose()}}}>
      <header><button className="parent-back" onClick={onClose} aria-label="Назад"><CaretLeft size={24} weight="bold"/></button><h1 tabIndex={-1}>{title}</h1><span/></header>{children}
    </motion.section>
  </motion.div>,document.querySelector('.parent-shell')!);
}
function GeolocationScreen() {
  const [list,setList]=useState<'saved'|'payments'|null>(null),[point,setPoint]=useState<ParentPlace>(savedPlaces[0]);
  const choose=(place:ParentPlace)=>{setPoint(place);setList(null)};
  return <>
    <Suspense fallback={<div className="parent-map-loading" role="status">Загружаем карту…</div>}><ParentLocationMap point={point} onSelect={choose}/></Suspense>
    <div className="parent-location-links"><button className="parent-panel parent-choice" onClick={()=>setList('saved')}><span>Сохранённые места</span><CaretRight size={22} weight="bold"/></button><button className="parent-panel parent-choice" onClick={()=>setList('payments')}><span>Места оплат</span><CaretRight size={22} weight="bold"/></button></div>
    <AnimatePresence>{list&&<ParentSheet title={list==='saved'?'Сохранённые места':'Места оплат'} onClose={()=>setList(null)}>{(list==='saved'?savedPlaces:paymentPlaces).map(place=><ParentChoice key={place.name} title={place.name} description={place.detail} onClick={()=>choose(place)} navigate/>)}</ParentSheet>}</AnimatePresence>
  </>;
}

const frequencies={friday:'Каждую неделю, Пт',monday:'Каждую неделю, Пн',monthly:'Раз в месяц'} as const;
function TransferScreen() {
  const {state,parentTransfer,saveSchedule}=useDemo();
  const [destination,setDestination]=useState<'card'|'savings'>(state.schedule.destination);
  const [amountDraft,setAmountDraft]=useState(String(state.schedule.amount)),[message,setMessage]=useState(''),[frequencyOpen,setFrequencyOpen]=useState(false);
  const amount=Number(amountDraft.replace(',','.'));
  const save=(patch:Partial<typeof state.schedule>)=>saveSchedule({...state.schedule,amount,destination,...patch});
  const submit=()=>{if(parentTransfer(amount,destination==='savings')){save({});setMessage(`${money.format(amount)} AMD переведено ${destination==='savings'?'в копилку':'на карту'}`)}else setMessage('Укажи сумму больше нуля, не больше остатка кошелька и с двумя знаками после запятой максимум')};
  return <div className="parent-transfer-layout">
    <AmountPicker label="Сумма перевода" value={amountDraft} editable presets={[200,500,1000]} onChange={v=>{setAmountDraft(v);setMessage('')}} hint={<>Доступно в кошельке <MoneyAmount value={state.parentWallet}/></>}>
    <div className="parent-segmented" role="tablist" aria-label="Куда перевести">{(['card','savings'] as const).map(value=><button role="tab" key={value} aria-selected={destination===value} className={destination===value?'is-active':''} onClick={()=>{setDestination(value);setMessage('')}}>{value==='card'?'На карту':'В копилку'}</button>)}</div>
    </AmountPicker>
    <section className="parent-panel setting-row"><span><b>Регулярный перевод</b><small>Повторять автоматически</small></span><Switch checked={state.schedule.enabled} onChange={enabled=>{if(!save({enabled,...(!enabled?{amount:state.schedule.amount}:{})}))setMessage('Укажи корректную сумму перевода')}} label="Регулярный перевод"/></section>
    {state.schedule.enabled&&<><button className="parent-panel frequency-row" onClick={()=>setFrequencyOpen(true)}><span><b>Периодичность</b><small>{frequencies[state.schedule.frequency]}</small></span><CaretRight size={18} weight="bold"/></button><button className="parent-secondary" onClick={()=>setMessage(save({})?'Расписание сохранено':'Укажи корректную сумму перевода')}>Сохранить расписание</button></>}
    <AnimatePresence>{frequencyOpen&&<ParentSheet title="Периодичность" onClose={()=>setFrequencyOpen(false)}>{(Object.keys(frequencies) as Array<keyof typeof frequencies>).map(frequency=><ParentChoice key={frequency} title={frequencies[frequency]} selected={state.schedule.frequency===frequency} onClick={()=>{if(save({frequency,amount:state.schedule.amount,destination:state.schedule.destination}))setFrequencyOpen(false);else setMessage('Укажи корректную сумму перевода')}}/>)}</ParentSheet>}</AnimatePresence>
    {message&&<p className="parent-message" role="status">{message}</p>}<button className="parent-primary" onClick={submit}>Перевести {money.format(amount||0)} AMD</button>
  </div>;
}

function LimitsScreen() {
  const {state,setRecipientEnabled,addRecipient,setCashEnabled,setCashLimit}=useDemo();
  const [adding,setAdding]=useState(false),[name,setName]=useState(''),[limit,setLimit]=useState<number|null>(null);
  return <>
    <ParentGroup title="Переводы"><div className="parent-panel parent-settings-section">{state.recipients.map(person=><div className="setting-row compact limit-recipient" key={person.id}><RecipientAvatar name={person.name} avatar={person.avatar} className="limit-recipient-avatar"/><span className="limit-recipient-copy"><b>{person.name}</b><small>{person.limit===null?'без лимита':`до ${money.format(person.limit)} AMD в день`}</small></span><Switch checked={person.enabled} onChange={value=>setRecipientEnabled(person.id,value)} label={person.name}/></div>)}<button className="parent-secondary parent-add-recipient" onClick={()=>setAdding(true)}><Plus size={20} weight="regular"/>Добавить получателя</button></div></ParentGroup>
    <ParentGroup title="Наличные" caption="Максимум 3 000 AMD в день"><div className="parent-panel parent-settings-section"><div className="setting-row compact"><span><b>Снятие в банкомате</b><small>Разрешить Давиду снимать деньги</small></span><Switch checked={state.cashEnabled} onChange={setCashEnabled} label="Снятие наличных"/></div><div className="cash-limit"><button disabled={!state.cashEnabled||state.cashLimit===0} aria-label="Уменьшить лимит" onClick={()=>setCashLimit(state.cashLimit-500)}><Minus size={20} weight="regular"/></button><span><strong><MoneyAmount value={state.cashLimit}/></strong><small>в день</small></span><button disabled={!state.cashEnabled||state.cashLimit===3000} aria-label="Увеличить лимит" onClick={()=>setCashLimit(state.cashLimit+500)}><Plus size={20} weight="regular"/></button></div></div></ParentGroup>
    <AnimatePresence>{adding&&<ParentSheet title="Новый получатель" onClose={()=>setAdding(false)}><form className="task-form" onSubmit={e=>{e.preventDefault();if(addRecipient(name,limit)){setAdding(false);setName('');setLimit(null)}}}><label>Имя<input value={name} maxLength={35} onChange={e=>setName(e.target.value)} required/></label><FormOptions label="Лимит в день">{[null,500,1000,2000].map(value=><button type="button" key={String(value)} className={limit===value?'is-active':''} aria-pressed={limit===value} onClick={()=>setLimit(value)}>{value===null?'Без лимита':`${money.format(value)} AMD`}</button>)}</FormOptions><button className="parent-primary" disabled={!name.trim()}>Добавить</button></form></ParentSheet>}</AnimatePresence>
  </>;
}

function ParentTasksScreen() {
  const {state,approveTask,saveTask,cancelTask}=useDemo();
  const [selected,setSelected]=useState<string|null>(null),[editing,setEditing]=useState<string|null>(null),[creating,setCreating]=useState(false);
  const [template,setTemplate]=useState('Убраться в комнате'),[title,setTitle]=useState(''),[reward,setReward]=useState(15),[deadline,setDeadline]=useState('18:00'),[error,setError]=useState('');
  const task=state.tasks.find(t=>t.id===selected);
  const startEdit=()=>{if(!task)return;setEditing(task.id);setTitle(task.title);setReward(task.reward);setDeadline(task.deadline);setSelected(null);setError('')};
  const closeForm=()=>{setCreating(false);setEditing(null);setError('')};
  const pending=state.tasks.filter(t=>t.status==='waitingParent'),active=state.tasks.filter(t=>t.status==='open');
  return <>
    <AnimatePresence>{(creating||editing)&&<ParentSheet title={editing?'Изменить задание':'Новое задание'} onClose={closeForm}><form className="task-form" onSubmit={e=>{e.preventDefault();if(saveTask(editing||template==='Другое'?title:template,reward,deadline,editing||undefined))closeForm();else setError('Заполни название, награду и время')}}>
      <label>Название задания<input value={editing||template==='Другое'?title:template} placeholder="Например, полить цветы" maxLength={80} onChange={e=>{setTemplate('Другое');setTitle(e.target.value)}} required/></label>
      {!editing&&<div className="task-ideas" role="group" aria-label="Идеи заданий">{['Убраться в комнате','Помыть посуду'].map(idea=><button type="button" key={idea} aria-pressed={template===idea} onClick={()=>{setTemplate(idea);setTitle(idea)}}>{idea}</button>)}</div>}
      <FormOptions label="Награда в звёздах">{[10,15,25,50].map(n=><button type="button" key={n} className={reward===n?'is-active':''} aria-pressed={reward===n} onClick={()=>setReward(n)}><StarAmount value={n}/></button>)}</FormOptions>
      <label>Выполнить до<input type="time" value={deadline} onChange={e=>setDeadline(e.target.value)} required/></label><div className="parent-presets time-presets" role="group" aria-label="Быстрый выбор времени">{['16:00','18:00','20:00'].map(time=><button key={time} type="button" aria-pressed={deadline===time} className={deadline===time?'is-active':''} onClick={()=>setDeadline(time)}>{time}</button>)}</div>
      {error&&<p role="alert">{error}</p>}<button className="parent-primary">{editing?'Сохранить':'Добавить'}</button><button type="button" className="parent-secondary ui-cancel" onClick={closeForm}>Отмена</button>
    </form></ParentSheet>}</AnimatePresence>
    <AnimatePresence>{task&&<ParentSheet title={task.status==='waitingParent'?'Подтвердить задание':'Задание'} onClose={()=>setSelected(null)}><h2>{task.title}</h2><p>До {task.deadline} · <StarAmount value={task.reward}/></p>{task.status==='waitingParent'&&<><p>Ребёнок отметил задание выполненным — начислить звёзды?</p><button className="parent-primary" onClick={()=>{approveTask(task.id);setSelected(null)}}>Подтвердить задание</button></>}<button className="parent-secondary" onClick={startEdit}>Изменить</button><button className="parent-secondary" onClick={()=>{cancelTask(task.id);setSelected(null)}}>Отменить задание</button></ParentSheet>}</AnimatePresence>
    <TaskGroup title={`Ждут подтверждения · ${pending.length}`} empty="Всё проверено" hint="Когда Давид выполнит задание, оно появится здесь для подтверждения.">{pending.map(t=><button className="parent-panel parent-task-row parent-task-button" key={t.id} onClick={()=>setSelected(t.id)}><TaskCopy title={t.title} meta={<StarAmount value={t.reward}/>}/><span className="approve-task">Подтвердить</span></button>)}</TaskGroup>
    <TaskGroup title="Активные" empty="Можно выбрать новое дело" hint="Добавьте задание и назначьте награду в звёздах.">{active.map(t=><button className="parent-panel parent-task-row parent-task-button" key={t.id} onClick={()=>setSelected(t.id)}><TaskCopy title={t.title} meta={<>До {t.deadline} · <StarAmount value={t.reward}/></>}/><CaretRight size={20} weight="bold"/></button>)}</TaskGroup>
    <TaskGroup title="Выполнено сегодня" empty="Первые победы ещё впереди" hint="Здесь появятся задания, которые вы подтвердите сегодня.">{state.completedToday.map(t=><article className="parent-panel parent-task-row is-complete" key={t.id}><span className="complete-mark"><Check size={18}/></span><TaskCopy title={t.title} meta={<>Подтверждено · <StarAmount value={t.reward}/> начислено</>}/></article>)}</TaskGroup>
    <button className="parent-primary parent-new-task" onClick={()=>{setTemplate('Убраться в комнате');setTitle('');setReward(15);setDeadline('18:00');setCreating(true)}}><Plus size={20} weight="regular"/>Новое задание</button>
  </>;
}

function ParentGroup({title,caption,children}:{title:string;caption?:string;children:ReactNode}) {
  return <section className="parent-group"><SectionHeading>{title}</SectionHeading>{children}{caption&&<p className="parent-group-caption">{caption}</p>}</section>;
}

function TaskGroup({ title, empty, hint, children }: { title: string; empty: string; hint:string; children: ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return <ParentGroup title={title}>{hasChildren ? children : <div className="parent-panel task-empty"><ClipboardText size={28} weight="duotone"/><div><b>{empty}</b><p>{hint}</p></div></div>}</ParentGroup>;
}
function FormOptions({label,children}:{label:string;children:ReactNode}) { return <fieldset className="form-options"><legend>{label}</legend><div className="parent-presets">{children}</div></fieldset>; }
function TaskCopy({ title, meta }: { title: string; meta: ReactNode }) { return <span className="parent-task-copy"><b>{title}</b><small>{meta}</small></span>; }

function ReportsScreen() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const {state}=useDemo();
  const monthExpenses=thisMonthExpenses(state.entries);
  const categoryTotals=[0,0,0,0];
  monthExpenses.forEach(row=>{const category=/sweet|кафе|продукт|еда/i.test(row.title)?0:/транспорт|автобус|такси/i.test(row.title)?1:3;categoryTotals[category]+=Math.abs(row.amount)});
  const monthTotal=categoryTotals.reduce((a,b)=>a+b,0);
  const rows: Array<[string,number,number]> = period==='week' ? [['Еда',320,40],['Транспорт',180,22],['В копилку',250,31],['Другое',60,7]] : ['Еда','Транспорт','В копилку','Другое'].map((name,index)=>[name,categoryTotals[index],monthTotal?categoryTotals[index]/monthTotal*100:0]);
  const periodLabel=period==='week'?'1–7 сентября 2026':new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(new Date());
  const total = rows.reduce((sum, row) => sum + Number(row[1]), 0);
  const [ready, setReady] = useState(false);
  return <>
    <div className="parent-segmented report-switch"><button className={period === "week" ? "is-active" : ""} onClick={() => { setPeriod("week"); setReady(false); }}>Неделя</button><button className={period === "month" ? "is-active" : ""} onClick={() => { setPeriod("month"); setReady(false); }}>Месяц</button></div>
    <p className="report-period">{periodLabel}</p>
    <section className="parent-panel report-card"><SpendingChart rows={rows}/><div className="report-legend">{rows.map(([label, amount, percent], index) => <div key={String(label)}><span className="legend-dot" style={{background:spendingColors[index]}} /><b>{label}<small>{Math.round(Number(percent))}%</small></b><span className="ui-row-amount"><MoneyAmount value={Number(amount)}/></span></div>)}</div></section>
    <button className="parent-secondary" onClick={() => setReady(true)}><DownloadSimple size={20} weight="bold" />Посмотреть отчёт</button>
    <AnimatePresence>{ready && <ParentSheet title="Отчёт о тратах" onClose={()=>setReady(false)}><p>{periodLabel}</p><h2><MoneyAmount value={total}/></h2>{rows.map(([label,amount])=><div className="parent-choice" key={String(label)}><span>{label}</span><b><MoneyAmount value={Number(amount)}/></b></div>)}</ParentSheet>}</AnimatePresence>
  </>;
}

function SpendingHistoryScreen() {
  const {state}=useDemo();
  const rows=parentHistory(state.entries);
  const groups=new Map<string,{title:string;rows:typeof rows}>();
  const currentYear=new Date().getFullYear();
  for(const row of rows){
    const key=row.date?`${row.date.getFullYear()}-${row.date.getMonth()}-${row.date.getDate()}`:'earlier';
    if(!groups.has(key))groups.set(key,{title:row.date?new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',...(row.date.getFullYear()!==currentYear?{year:'numeric' as const}:{})}).format(row.date):'Ранее',rows:[]});
    groups.get(key)!.rows.push(row);
  }
  return <>
    <DailyExpenseBars expenses={thisMonthExpenses(state.entries)}/>
    <div className="history-list">{[...groups].map(([key,group])=><ParentGroup key={key} title={group.title}>
      <div className="parent-panel history-day">{group.rows.map(row=>{
        const qr=row.title.startsWith('Оплата по QR · ');
        const phone=row.title.match(/^(Мой номер)\s+(\+.*)$/);
        const title=qr?row.title.slice('Оплата по QR · '.length):phone?'Пополнение телефона':row.title;
        const time=row.date?new Intl.DateTimeFormat('ru-RU',{hour:'2-digit',minute:'2-digit'}).format(row.date):'';
        const detail=[qr?'Оплата по QR':'',time].filter(Boolean).join(' · ');
        return <article className="history-row" key={row.id}>
          <span className="history-copy"><b>{title}</b>{detail&&<small>{detail}</small>}</span>
          <strong className={`ui-row-amount ${row.amount>0?'positive':''}`}><MoneyAmount value={row.amount} signed/></strong>
        </article>;
      })}</div>
    </ParentGroup>)}</div>
  </>;
}

const goalIcons=['Учёба','Питомец','Дом','Кухня','Игры','Подарок'];
function ParentGoalsScreen() {
  const {state,addRewardGoal}=useDemo();
  const [creating,setCreating]=useState(false),[title,setTitle]=useState(''),[target,setTarget]=useState(500),[exchange,setExchange]=useState(50000),[icon,setIcon]=useState('Подарок'),[error,setError]=useState('');
  const selectedGoals=state.rewardGoals.filter(goal=>goal.selected);
  const availableGoals=state.rewardGoals.filter(goal=>!goal.selected);
  return <>
    <AnimatePresence>{creating&&<ParentSheet title="Новая цель" onClose={()=>setCreating(false)}><form className="task-form" onSubmit={e=>{e.preventDefault();if(addRewardGoal(title,target,exchange,icon)){setTitle('');setCreating(false);setError('')}else setError('Укажи название, целое число звёзд и сумму больше нуля')}}>
      <label>Название цели<input value={title} maxLength={60} placeholder="Например, велосипед" onChange={e=>setTitle(e.target.value)} required/></label>
      <fieldset className="form-field"><legend>Иконка</legend><div className="goal-icon-options">{goalIcons.map(i=><button type="button" key={i} aria-label={i} aria-pressed={icon===i} onClick={()=>setIcon(i)}><RewardIcon name={i}/></button>)}</div></fieldset>
      <fieldset className="form-field"><legend>Нужно звёзд</legend><input aria-label="Нужно звёзд" type="number" min="1" step="1" value={target||''} onChange={e=>setTarget(Number(e.target.value))} required/><div className="parent-presets">{[500,800,1000,1500].map(n=><button type="button" key={n} aria-pressed={target===n} onClick={()=>setTarget(n)} className={target===n?'is-active':''}><StarAmount value={n}/></button>)}</div></fieldset>
      <fieldset className="form-field"><legend>Сумма при обмене, AMD</legend><input aria-label="Сумма при обмене, AMD" type="number" min="0.01" step="0.01" value={exchange||''} onChange={e=>setExchange(Number(e.target.value))} required/><div className="parent-presets">{[50000,120000,200000,250000].map(n=><button type="button" key={n} aria-pressed={exchange===n} onClick={()=>setExchange(n)} className={exchange===n?'is-active':''}>{money.format(n)}</button>)}</div></fieldset>
      {error&&<p role="alert">{error}</p>}<button className="parent-primary">Добавить цель</button><button type="button" className="parent-secondary ui-cancel" onClick={()=>setCreating(false)}>Отмена</button>
    </form></ParentSheet>}</AnimatePresence>
    <div className="parent-goals-scroll">{selectedGoals.length>0&&<ParentGroup title="Ребёнок копит"><div className="parent-selected-goals">{selectedGoals.map(goal=><article className="parent-panel parent-goal-card" key={goal.id}>
      <h3>{goal.title}</h3><p>{money.format(goal.exchange)} AMD при обмене</p>
      <div className="parent-goal-progress" role="progressbar" aria-label={goal.title} aria-valuemin={0} aria-valuemax={goal.target} aria-valuenow={Math.min(goal.saved,goal.target)}><span style={{width:`${Math.min(100,goal.saved/goal.target*100)}%`}}/></div>
      <div className="parent-goal-progress-label"><strong>{money.format(goal.saved)}</strong> из {money.format(goal.target)} звёзд</div>
    </article>)}</div></ParentGroup>}
    {availableGoals.length>0&&<ParentGroup title="В витрине"><div className="parent-panel parent-goal-catalog">{availableGoals.map(goal=><article className="parent-goal-option" key={goal.id}>
      <div><h3>{goal.title}</h3><p>{money.format(goal.exchange)} AMD при обмене</p></div><strong className="ui-row-amount"><StarAmount value={goal.target}/></strong>
    </article>)}</div></ParentGroup>}
    </div><footer className="parent-goals-footer"><ProgressiveBlur/><button className="parent-primary" onClick={()=>setCreating(true)}><Plus size={20} weight="regular"/>Новая цель</button></footer>
  </>;

}

function Switch({ checked, onChange, label }: { checked: boolean; onChange(value: boolean): void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`parent-switch ${checked ? "is-on" : ""}`} onClick={() => onChange(!checked)}><span /></button>;
}
