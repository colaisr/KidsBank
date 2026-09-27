import {lionEmotions} from './lionEmotions';
import type {LionEmotion} from './lionEmotions';
import ActionTile from "./ActionTile";
import StarAmount from "./StarAmount";
import {useEffect,useLayoutEffect,useRef,useState,type PointerEvent} from 'react';
import {animate,motion,useMotionValue,useReducedMotion} from 'motion/react';
import {PaperPlaneTilt,Heart,GameController,Moon,Microphone} from '@phosphor-icons/react';
import {useDemo} from './DemoState';
import {money} from './data';
import './pet-screen.css';
import { useDesignerChildT } from './useDesignerChildT';
import i18n from '../i18n';
type VoiceRecognition = {lang:string;continuous:boolean;interimResults:boolean;onresult:((event:{resultIndex:number;results:ArrayLike<ArrayLike<{transcript:string}>>})=>void)|null;onerror:((event:{error:string})=>void)|null;onend:(()=>void)|null;start():void;stop():void};
type SpeechWindow=Window&{SpeechRecognition?:new()=>VoiceRecognition;webkitSpeechRecognition?:new()=>VoiceRecognition};
export default function PetScreen({onEmotion,taps,onChatExpanded,keyboardOpen}:{onEmotion(value:LionEmotion):void;taps:number;onChatExpanded(value:boolean):void;keyboardOpen:boolean}){
 const { t } = useDesignerChildT();
 const {state,petAction}=useDemo();const [fullness,setFullness]=useState(80),[joy,setJoy]=useState(65),[draft,setDraft]=useState(''),[typing,setTyping]=useState(false);
 const [messages,setMessages]=useState([{role:'leo',text:''}]);
 useEffect(()=>{setMessages([{role:'leo',text:t('pet.greeting')}])},[t]);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const recognition=useRef<VoiceRecognition|null>(null);
 const [listening,setListening]=useState(false),[voiceMessage,setVoiceMessage]=useState('');
 const root=useRef<HTMLDivElement>(null),scene=useRef<HTMLElement>(null),log=useRef<HTMLDivElement>(null),input=useRef<HTMLTextAreaElement>(null);
 const [expanded,setExpanded]=useState(false),[collapsedTop,setCollapsedTop]=useState(0);
 const reduced=useReducedMotion(),chatTop=useMotionValue(0);
 const initialized=useRef(false),settling=useRef<ReturnType<typeof animate>|null>(null);
 const gesture=useRef<{id:number;start:number;top:number;last:number;time:number;velocity:number;moved:boolean}|null>(null);
 const suppressClick=useRef(false);
 useLayoutEffect(()=>{
  const measure=()=>{if(!root.current||!scene.current)return;const top=Math.min(scene.current.offsetHeight+16,Math.max(0,root.current.clientHeight-180));setCollapsedTop(top);if(!initialized.current){chatTop.set(top);initialized.current=true}};
  const observer=new ResizeObserver(measure);if(root.current)observer.observe(root.current);if(scene.current)observer.observe(scene.current);measure();return()=>observer.disconnect();
 },[chatTop]);
 // The shared mascot remains mounted for the home transition, but the sheet
 // physically occludes its layer throughout a drag, including before release.
 useLayoutEffect(()=>{
  const shell=root.current?.closest<HTMLElement>('.phone-shell');if(!shell)return;
  const sync=()=>{if(!root.current)return;const a=root.current.getBoundingClientRect(),b=shell.getBoundingClientRect();const scale=b.width?shell.offsetWidth/b.width:1;shell.style.setProperty('--leo-chat-edge',`${(a.top-b.top)*scale+chatTop.get()}px`)};
  const unsubscribe=chatTop.on('change',sync),observer=new ResizeObserver(sync);observer.observe(root.current!);observer.observe(shell);sync();
  return()=>{unsubscribe();observer.disconnect();shell.style.removeProperty('--leo-chat-edge')};
 },[chatTop]);
 useEffect(()=>{if(keyboardOpen)setExpanded(true)},[keyboardOpen]);
 useEffect(()=>{onChatExpanded(expanded);return()=>onChatExpanded(false)},[expanded,onChatExpanded]);
 useEffect(()=>{
  settling.current?.stop();const target=expanded?0:collapsedTop;
  if(reduced)chatTop.set(target);else settling.current=animate(chatTop,target,{type:'spring',stiffness:360,damping:38});
  return()=>settling.current?.stop();
 },[expanded,collapsedTop,reduced,chatTop]);
 useEffect(()=>{log.current?.scrollTo({top:log.current.scrollHeight,behavior:reduced?'instant':'smooth'})},[messages,typing,reduced]);
 useEffect(()=>{const el=log.current;if(!el)return;const observer=new ResizeObserver(()=>{el.scrollTop=el.scrollHeight});observer.observe(el);return()=>observer.disconnect()},[]);
 function startDrag(e:PointerEvent<HTMLButtonElement>){if(e.button!==0)return;settling.current?.stop();e.currentTarget.setPointerCapture(e.pointerId);gesture.current={id:e.pointerId,start:e.clientY,top:chatTop.get(),last:e.clientY,time:e.timeStamp,velocity:0,moved:false};suppressClick.current=false}
 function moveDrag(e:PointerEvent<HTMLButtonElement>){const g=gesture.current;if(!g||g.id!==e.pointerId)return;const delta=e.clientY-g.start;g.moved ||= Math.abs(delta)>5;g.velocity=(e.clientY-g.last)/Math.max(1,e.timeStamp-g.time);g.last=e.clientY;g.time=e.timeStamp;chatTop.set(Math.max(0,Math.min(collapsedTop,g.top+delta)))}
 function endDrag(e:PointerEvent<HTMLButtonElement>,cancelled=false){const g=gesture.current;if(!g||g.id!==e.pointerId)return;gesture.current=null;suppressClick.current=!cancelled&&g.moved;const next=cancelled?expanded:chatTop.get()+g.velocity*150<collapsedTop/2;if(!next)input.current?.blur();setExpanded(next);settling.current?.stop();settling.current=animate(chatTop,next?0:collapsedTop,reduced?{duration:0}:{type:'spring',stiffness:360,damping:38});}
 function toggleChat(){if(suppressClick.current){suppressClick.current=false;return}if(expanded)input.current?.blur();setExpanded(v=>!v)}

 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 useEffect(()=>()=>recognition.current?.stop(),[]);
 function toggleVoice(){
  if(listening){recognition.current?.stop();setListening(false);return}
  const Speech=(window as SpeechWindow).SpeechRecognition||(window as SpeechWindow).webkitSpeechRecognition;
  if(!Speech){setVoiceMessage(t('pet.voiceUnavailable'));return}
  setVoiceMessage('');const current=new Speech();recognition.current=current;current.lang=i18n.language==='hy'?'hy-AM':i18n.language==='en'?'en-US':'ru-RU';current.continuous=false;current.interimResults=true;
  current.onresult=event=>{let transcript='';for(let i=event.resultIndex;i<event.results.length;i++)transcript+=event.results[i][0]?.transcript||'';if(transcript)setDraft(transcript.trim())};
  current.onerror=event=>{setListening(false);setVoiceMessage(event.error==='not-allowed'?t('pet.micDenied'):t('pet.voiceFailed'))};
  current.onend=()=>setListening(false);
  try{current.start();setListening(true)}catch{setListening(false);setVoiceMessage(t('pet.micError'))}
 }
 useEffect(()=>{if(taps)onEmotion(lionEmotions[(taps-1)%lionEmotions.length])},[taps]);
 function action(kind:string){if(!petAction(kind==='feed'?5:kind==='play'?8:3))return;onEmotion(kind==='sleep'?'rest':kind==='play'?'play':'feed');if(kind==='feed')setFullness(n=>Math.min(100,n+35));if(kind==='play')setJoy(n=>Math.min(100,n+35));setMessages(m=>[...m,{role:'leo',text:kind==='feed'?t('pet.replyFeed'):kind==='play'?t('pet.replyPlay'):t('pet.replySleep')}])}
 function send(text=draft){if(!text.trim()||typing)return;const q=text.trim();setDraft('');setMessages(m=>[...m,{role:'you',text:q}]);setTyping(true);onEmotion('think');timer.current=setTimeout(()=>{let answer=t('pet.replyDefault');if(/копил|мечт|накоп|piggy|dream|savings|խնայ/i.test(q))answer=t('pet.replyPiggy',{savings:money.format(state.savings)});else if(/дн|день|сколько|day|count|օր/i.test(q))answer=t('pet.replyDays');else if(/зв[её]зд|задан|star|task|աստղ/i.test(q))answer=t('pet.replyStars',{stars:state.stars});else if(/баланс|карт|денег|balance|card|քարտ/i.test(q))answer=t('pet.replyBalance',{balance:money.format(state.balance)});else if(/привет|как дел|hello|hi|բարև/i.test(q))answer=t('pet.replyHello');setMessages(m=>[...m,{role:'leo',text:answer}]);setTyping(false);onEmotion(/привет|как дел|hello|hi|բարև/i.test(q)?'laugh':'wink')},550)}
 return <div ref={root} className="leo-screen" data-chat-expanded={expanded} data-keyboard-open={keyboardOpen}>
  <section ref={scene} className="leo-scene" inert={expanded}>
   <div className="leo-level">{t('pet.level',{level:1+Math.floor(state.xp/100)})}</div>
   <div className="leo-stage"><div className="leo-stat"><Heart size={28}/><strong>{fullness}%</strong><small>{t('pet.fullness')}</small></div><div className="pet-mascot-target"/><div className="leo-stat"><GameController size={28}/><strong>{joy}%</strong><small>{t('pet.joy')}</small></div></div>
   <div className="leo-actions"><ActionTile label={t('pet.feed')} disabled={state.stars<5} onClick={()=>action('feed')} icon={<Heart size={28} weight="duotone"/>} detail={<StarAmount value={5}/>}>{t('pet.feed')}</ActionTile><ActionTile label={t('pet.play')} disabled={state.stars<8} onClick={()=>action('play')} icon={<GameController size={28} weight="duotone"/>} detail={<StarAmount value={8}/>}>{t('pet.play')}</ActionTile><ActionTile label={t('pet.rest')} disabled={state.stars<3} onClick={()=>action('sleep')} icon={<Moon size={28} weight="duotone"/>} detail={<StarAmount value={3}/>}>{t('pet.rest')}</ActionTile></div>
  </section>
  <motion.section className="leo-chat" aria-label={t('pet.chatLabel')} style={{top:chatTop}}>
   <button type="button" className="leo-chat-grab" aria-label={expanded?t('pet.collapseChat'):t('pet.expandChat')} aria-expanded={expanded} onClick={toggleChat} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={e=>endDrag(e)} onPointerCancel={e=>endDrag(e,true)}><span/></button>
   <div className="leo-chat-header"><b>{t('pet.leoName')}</b><span>{t('pet.online')}</span></div>
   <div ref={log} className="leo-messages" role="log" aria-live="polite">{messages.map((m,i)=><div key={i} className={`leo-bubble ${m.role}`}>{m.text}</div>)}{typing&&<div className="leo-bubble leo">{t('pet.thinking')}</div>}{messages.length===1&&<div className="leo-suggestions"><button onClick={()=>send(t('pet.suggestDaysQuestion'))}>{t('pet.suggestDays')}</button><button onClick={()=>send(t('pet.suggestPiggyQuestion'))}>{t('pet.suggestPiggy')}</button></div>}</div>
   {voiceMessage&&<p className="leo-voice-status" role="status">{voiceMessage}</p>}
   <form className="leo-composer" onSubmit={e=>{e.preventDefault();send()}}><textarea ref={input} onFocus={()=>setExpanded(true)} aria-label={t('pet.messageLabel')} rows={1} placeholder={t('pet.messagePlaceholder')} value={draft} maxLength={500} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}/>
    {draft.trim()?<button type="submit" onPointerDown={e=>e.preventDefault()} aria-label={t('pet.send')} disabled={typing}><PaperPlaneTilt size={22} weight="fill"/></button>:<button type="button" onClick={toggleVoice} onPointerDown={e=>e.preventDefault()} className={listening?'is-listening':''} aria-label={listening?t('pet.voiceStop'):t('pet.voiceStart')} aria-pressed={listening}><Microphone size={22} weight="fill"/></button>}
   </form>
  </motion.section>
 </div>
}
