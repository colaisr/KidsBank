import useLeoViewport from "./useLeoViewport";
import {childTransition} from "./childMotion";
import type {LionEmotion} from './lionEmotions';
import ActionTile from "./ActionTile";
import {
  useEffect,
  useCallback,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
import {
  CaretRight,
  QrCode,
  DeviceMobile,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion, useMotionValue } from "motion/react";
import { DemoProvider, useDemo } from "./DemoState";
import FeatureScreen, { type Feature } from "./FeatureScreen";
import PaymentFlow from "./PaymentFlow";
import AnimatedNumber from "./AnimatedNumber";
import CardFlight, { measureCard, type CardFlightState } from "./CardFlight";
import HeroCarousel from "./HeroCarousel";
import CardDesignScreen from "./CardDesignScreen";
import { readCardDesign, type CardDesign } from "./CardVisual";
import { writeDesignerCardDesign } from "./designerCardSkin";
import { usePreferences } from "../context/PreferencesContext";
import { normalizeYoungCardTheme } from "../data/youngCardThemes";
import type { CardSkin } from "../context/preferences";
import "./accounts.css";
import { home } from "./data";
import SharedLion from "./SharedLion";
import TaskCard from "./TaskCard";
import ProgressiveBlur from "./ProgressiveBlur";
import { FeedbackProvider, Pressable } from "./Feedback";
import ParentApp from "./ParentApp";
import AmbientBackground from "./AmbientBackground";
import ChildAvatar from "./ChildAvatar";
import { useDesignerChildT } from "./useDesignerChildT";

function Header({
  onStars,
  onIdentity,
  identityLabel,
  childDisplayName,
}: {
  onStars(): void;
  onIdentity(): void;
  identityLabel: string;
  childDisplayName: string;
}) {
  const {state}=useDemo();
  const { t } = useDesignerChildT();
  const reduce = useReducedMotion();
  return (
    <div className="header-chrome"><motion.header className="header" initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Pressable className="identity" label={identityLabel} onClick={onIdentity}>
        <ChildAvatar/>
        <span>{childDisplayName}</span>
      </Pressable>
      <Pressable onClick={onStars} className="stars-counter" label={t('common.starsCount', { count: state.stars })}>
        <AnimatedNumber value={state.stars} />
        <img
          className="counter-star brand-raster-art"
          src="/assets/star.png"
          alt=""
          width="32"
          height="32"
        />
      </Pressable>
    </motion.header></div>
  );
}
function QuickActions({onOpen}:{onOpen(kind:string):void}) {
  const { t } = useDesignerChildT();
  const actions = [
    {
      path: "/young/qr-pay",
      label: t('actions.qrPay'),
      icon: QrCode,
      lines: (
        <>
          {t('actions.qrPay').split(' ').slice(0, 1).join(' ')}
          <br />
          {t('actions.qrPay').split(' ').slice(1).join(' ')}
        </>
      ),
    },
    {
      path: "/young/phone-topup",
      label: t('actions.phoneTopUp'),
      icon: DeviceMobile,
      lines: (
        <>
          {t('actions.phoneTopUp').split(' ').slice(0, 1).join(' ')}
          <br />
          {t('actions.phoneTopUp').split(' ').slice(1).join(' ')}
        </>
      ),
    },
    {
      path: "/young/transfer",
      label: t('actions.transferMoney'),
      icon: PaperPlaneTilt,
      lines: (
        <>
          {t('actions.transferMoney').split(' ').slice(0, 1).join(' ')}
          <br />
          {t('actions.transferMoney').split(' ').slice(1).join(' ')}
        </>
      ),
    },
  ];
  return (
    <nav className="quick-actions" aria-label={t('nav.quickActions')}>
      {actions.map(({ path, label, icon: Icon, lines }) => (
        <ActionTile key={path} onClick={()=>onOpen(path.includes("phone")?"phone":path.includes("qr")?"qr":"transfer")} label={label} icon={<Icon size={28} weight="duotone"/>}>{lines}</ActionTile>
      ))}
    </nav>
  );
}
function Tasks({onOpen}:{onOpen():void}) {
  const {state}=useDemo();
  const { t } = useDesignerChildT();
  return (
    <section className="tasks" aria-labelledby="tasks-title">
      <div className="section-heading">
        <h2 id="tasks-title" tabIndex={-1}>
          {t('home.tasksTitle')} <span className="count">{state.tasks.length}</span>
        </h2>
        <Pressable className="all-tasks" onClick={onOpen}>{t('common.all')}<CaretRight size={15} weight="bold" aria-hidden="true" /></Pressable>
      </div>
      <div className="task-list">
        {state.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
function BottomNavigation({ onSavings, onStars, onPet }: { onSavings(): void;onStars():void;onPet():void }) {
  const { t } = useDesignerChildT();
  return (
    <footer className="bottom-chrome">
      <nav className="bottom-nav" aria-label={t('nav.main')}>
        <Pressable className="nav-item" onClick={onSavings}>
          <span className="nav-art-shadow"><img className="nav-illustration" src="/assets/nav-piggy-shadow.png" width="48" height="48" alt="" /></span>
          <span>{t('nav.piggy')}</span>
        </Pressable>
        <div className="nav-pet"><button className="nav-pet-open" aria-label={t('nav.openLeo')} onClick={onPet}/></div>
        <Pressable className="nav-item" onClick={onStars}>
          <span className="nav-art-shadow"><img className="nav-illustration nav-star-art" src="/assets/nav-star-shadow.png" width="48" height="48" alt="" /></span>
          <span>{t('nav.stars')}</span>
        </Pressable>
      </nav>
    </footer>
  );
}
type HomeAppProps = {
  onIdentityClick?: () => void;
  identityAriaLabel?: string;
  childDisplayName?: string;
};

export function HomeApp({
  onIdentityClick,
  identityAriaLabel,
  childDisplayName = home.name,
}: HomeAppProps = {}) {
  const { t } = useDesignerChildT();
  const { bank, cardSkin, setCardSkin } = usePreferences();
  const resolvedIdentityLabel = identityAriaLabel ?? t('home.openParent');
  const {state,pay}=useDemo();
  const [petChatExpanded,setPetChatExpanded]=useState(false);
  const [petEmotion,setPetEmotion]=useState<LionEmotion>("wink"),[petTaps,setPetTaps]=useState(0),[petReaction,setPetReaction]=useState(0);
  const validFlows=['savings','goals','tasks','stars','pet','phone','qr','transfer'];
  const readFlow=()=>{const value=location.hash.slice(1);return validFlows.includes(value)?value:null};
  const [flow,setFlow]=useState<string|null>(readFlow);
  const homeOpacity=useMotionValue(flow?0:1),petOpacity=useMotionValue(0);
  useLayoutEffect(()=>{if(flow==='pet')petOpacity.set(0)},[flow,petOpacity]);
  useEffect(()=>{const update=()=>{const next=readFlow();if(next!=='pet'&&document.activeElement instanceof HTMLTextAreaElement&&document.activeElement.closest('.feature-screen--pet'))document.activeElement.blur();setFlow(next)};window.addEventListener('popstate',update);return()=>window.removeEventListener('popstate',update)},[]);
  function openFlow(kind:string){history.pushState({evocaFlow:true},'',`#${kind}`);setFlow(kind)}
  function closeFlow(){if(flow==='pet'&&document.activeElement instanceof HTMLTextAreaElement)document.activeElement.blur();if(history.state?.evocaFlow)history.back();else{history.replaceState(null,'',location.pathname);setFlow(null)}}
  const reduce = useReducedMotion();
  const [design, setDesign] = useState<CardDesign>(readCardDesign);
  useEffect(() => {
    setDesign(readCardDesign());
  }, [cardSkin, bank]);
  const [editing, setEditing] = useState(() => location.hash === "#card-design");
  const [slide, setSlide] = useState(0);
  const main = useRef<HTMLElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const petKeyboardOpen=useLeoViewport(shell);
  const designRef = useRef(design);
  designRef.current = design;
  const [flight, setFlight] = useState<CardFlightState | null>(null);
  const flightId = useRef(0);
  const beginFlight = useCallback((card: CardDesign, destination: "home" | "editor") => {
    if (reduce) return;
    const inFlight = shell.current?.dataset.flying === card
      ? measureCard(shell.current, ".card-flight .bank-card") : undefined;
    const from = inFlight ?? measureCard(shell.current, destination === "editor"
      ? ".card-trigger .bank-card"
      : `.design-option[data-design="${card}"] .bank-card`);
    if (from) setFlight({ id: ++flightId.current, design: card, checked: shell.current?.querySelector(`.design-option[data-design="${card}"]`)?.getAttribute("aria-checked") === "true", from, destination });
  }, [reduce]);
  useLayoutEffect(() => {
    if (!flight || flight.to) return;
    const to = measureCard(shell.current, flight.destination === "home"
      ? ".card-trigger .bank-card"
      : `.design-option[data-design="${flight.design}"] .bank-card`, true);
    if (to) setFlight(current => current ? { ...current, to } : null);
    else setFlight(null);
  }, [flight, editing]);
  const openRef = useRef(editing);
  const closingRef = useRef(false);
  const returnFocus = useRef(false);
  const finishEditing = useCallback((committed?: CardDesign) => {
    beginFlight(committed ?? designRef.current, "home");
    if (committed) {
      const skin = normalizeYoungCardTheme(committed) as CardSkin;
      setDesign(committed);
      writeDesignerCardDesign(committed);
      setCardSkin(skin);
    }
    closingRef.current = false;
    openRef.current = false;
    returnFocus.current = true;
    setEditing(false);
  }, [beginFlight, setCardSkin]);
  useEffect(() => {
    const back = () => {
      if (location.hash === "#card-design") {
        beginFlight(designRef.current, "editor");
        openRef.current = true;
        closingRef.current = false;
        setEditing(true);
      } else if (openRef.current) finishEditing(undefined);
    };
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, [finishEditing, beginFlight]);
  function openDesign() {
    if (openRef.current || flight) return;
    beginFlight(design, "editor");
    openRef.current = true;
    history.pushState({ evocaCardDesign: true }, "", "#card-design");
    setEditing(true);
  }
  function closeDesign(next?: CardDesign) {
    if (!openRef.current || closingRef.current) return;
    closingRef.current = true;
    if (location.hash === "#card-design") {
      history.replaceState(null, "", location.pathname + location.search);
    }
    finishEditing(next);
  }
  return <div ref={shell} className="kb-designer-child phone-shell" data-flying={flight?.design}>
      <AmbientBackground key={bank} bank={bank} active paused={editing || (!!flow && flow !== "pet")} />
      <motion.div initial={false} animate={{opacity:flow?0:1}} transition={{...childTransition,duration:reduce?0:.28}} onUpdate={v=>homeOpacity.set(Number(v.opacity))} className={`home-layer ${editing ? "is-editing" : ""}`} inert={editing || !!flight || !!flow} aria-hidden={editing || !!flow || undefined}>
        <a className="skip-link" href="#tasks-title">{t('common.skipToTasks')}</a>
        <Header
          onStars={() => openFlow("stars")}
          onIdentity={onIdentityClick ?? (() => location.assign("/parent"))}
          identityLabel={resolvedIdentityLabel}
          childDisplayName={childDisplayName}
        />
        <motion.main ref={main} layoutScroll className="home" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}>
          <HeroCarousel design={design} editing={editing} slide={slide} onSlide={setSlide} onEdit={openDesign} onSavings={()=>openFlow("savings")} />
          <QuickActions onOpen={openFlow} />
          <Tasks onOpen={()=>openFlow("tasks")} />
        </motion.main>
        <ProgressiveBlur edge="top" />
        <ProgressiveBlur />
        <BottomNavigation onSavings={()=>openFlow('savings')} onStars={()=>openFlow('stars')} onPet={()=>openFlow('pet')} />
      </motion.div>
      <AnimatePresence onExitComplete={() => {
        if (returnFocus.current && !flight) {
          returnFocus.current = false;
          main.current?.querySelector<HTMLButtonElement>(".card-trigger")?.focus({ preventScroll: true });
        }
      }}>
        {editing && <CardDesignScreen key="design" selected={design} busy={!!flight} onClose={closeDesign} />}
      </AnimatePresence>
      <motion.div className="child-flow-backdrop" aria-hidden="true" initial={false} animate={{opacity:flow&&flow!=='pet'?1:0}} transition={{...childTransition,duration:reduce?0:.28}}/>
      <AnimatePresence mode="wait">
        {flow && (['phone','qr','transfer'].includes(flow)
          ? <PaymentFlow key={flow} kind={flow as 'phone'|'qr'|'transfer'} balance={state.balance} onPay={pay} onClose={closeFlow}/>
          : <FeatureScreen key={flow} kind={flow as Feature} onClose={closeFlow} onNavigate={openFlow} onEmotion={emotion=>{setPetEmotion(emotion);setPetReaction(n=>n+1)}} petTaps={petTaps} onPetChatExpanded={setPetChatExpanded} petOpacity={petOpacity} petKeyboardOpen={petKeyboardOpen}/>)}
      </AnimatePresence>
      {!editing&&<SharedLion homeOpacity={homeOpacity} petOpacity={petOpacity} flow={flow} covered={flow==='pet'&&petChatExpanded} emotion={petEmotion} reaction={petReaction} onInteract={()=>flow==='pet'?setPetTaps(n=>n+1):openFlow('pet')}/>}
      {flight && <CardFlight key={flight.id} flight={flight} onComplete={() => {
        setFlight(null);
        if (!openRef.current) {
          returnFocus.current = false;
          requestAnimationFrame(() => main.current?.querySelector<HTMLButtonElement>(".card-trigger")?.focus({ preventScroll: true }));
        }
      }} />}
    </div>;
}
export default function App() {
  return (
    <DemoProvider>
      <FeedbackProvider>
        {location.pathname.startsWith('/parent') ? <ParentApp /> : <HomeApp />}
      </FeedbackProvider>
    </DemoProvider>
  );
}
